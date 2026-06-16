local frames = 0

local function getenv_number(name, default_value)
  local raw = os.getenv(name)
  if raw == nil or raw == "" then
    return default_value
  end
  local parsed = tonumber(raw)
  if parsed == nil then
    return default_value
  end
  return parsed
end

local function json_escape(value)
  value = value or ""
  value = value:gsub("\\", "\\\\")
  value = value:gsub("\"", "\\\"")
  value = value:gsub("\n", "\\n")
  value = value:gsub("\r", "\\r")
  return value
end

local function ensure_io()
  if io == nil or os == nil then
    emu.stop(90)
  end
end

local function write_file(path, data)
  local file = io.open(path, "wb")
  if file == nil then
    emu.stop(91)
  end
  file:write(data)
  file:close()
end

local function read_file(path)
  local file = io.open(path, "rb")
  if file == nil then
    return nil
  end
  local data = file:read("*a")
  file:close()
  return data
end

local function dump_memory(path, start_address, length, memory_type)
  local file = io.open(path, "wb")
  if file == nil then
    emu.stop(92)
  end

  local chunk = {}
  local chunk_len = 0
  for offset = 0, length - 1 do
    local value = emu.read(start_address + offset, memory_type) or 0
    chunk_len = chunk_len + 1
    chunk[chunk_len] = string.char(value & 0xFF)

    if chunk_len >= 1024 then
      file:write(table.concat(chunk))
      chunk = {}
      chunk_len = 0
    end
  end

  if chunk_len > 0 then
    file:write(table.concat(chunk))
  end
  file:close()
end

local function parse_input_events(raw)
  local events = {}
  for button, start_frame, duration in string.gmatch(raw or "", "([%a_]+):(%d+):(%d+)") do
    events[#events + 1] = {
      button = string.lower(button),
      start_frame = tonumber(start_frame),
      end_frame = tonumber(start_frame) + tonumber(duration)
    }
  end
  return events
end

local function cpu(address)
  return emu.read(address, emu.memType.nesDebug) or 0
end

local function ppu(address)
  return emu.read(address, emu.memType.nesPpuDebug) or 0
end

local function read_context()
  local submap_raw = cpu(0x0051)
  return {
    objset = cpu(0x0030),
    area = cpu(0x0050),
    submap_raw = submap_raw,
    submap = submap_raw & 0x7F,
    submap_flags = submap_raw & 0x80,
    night = cpu(0x0082),
    actor_pointer = cpu(0x003D) | (cpu(0x003E) << 8),
    tile_set_pointer = cpu(0x0063) | (cpu(0x0064) << 8),
    game_state = cpu(0x0026),
    menu_state = cpu(0x0033)
  }
end

local function ppu_state()
  local state = emu.getState()
  return {
    x_scroll = state["ppu.xScroll"] or 0,
    video_ram_addr = state["ppu.videoRamAddr"] or 0,
    tmp_video_ram_addr = state["ppu.tmpVideoRamAddr"] or 0,
    bg_pattern_addr = state["ppu.control.backgroundPatternAddr"] or 0,
    sprite_pattern_addr = state["ppu.control.spritePatternAddr"] or 0,
    large_sprites = state["ppu.control.largeSprites"] and 1 or 0,
    sprites_enabled = state["ppu.mask.spritesEnabled"] and 1 or 0
  }
end

local function hex(value, width)
  if value == nil then
    return ""
  end
  return string.format("%0" .. tostring(width) .. "X", value & ((1 << (width * 4)) - 1))
end

local function current_inputs()
  local inputs = {}
  for _, input in ipairs(_G.input_events) do
    if frames >= input.start_frame and frames < input.end_frame then
      inputs[input.button] = true
    end
  end
  return inputs
end

local slot_fields = {
  { name = "selector", base = 0x0300 },
  { name = "attr", base = 0x0312 },
  { name = "screenY", base = 0x0324 },
  { name = "screenX", base = 0x0348 },
  { name = "activeId", base = 0x03B4 },
  { name = "flags", base = 0x03C6 },
  { name = "state", base = 0x03D8 },
  { name = "facing", base = 0x0420 },
  { name = "source", base = 0x0432 },
  { name = "timer", base = 0x0444 },
  { name = "aux", base = 0x0456 },
  { name = "hp", base = 0x04C2 },
  { name = "rowData", base = 0x04D4 },
  { name = "cooldown", base = 0x04F8 }
}

local function actor_field_for_address(addr)
  for _, field in ipairs(slot_fields) do
    if addr >= field.base and addr < field.base + 0x12 then
      return field.name, addr - field.base
    end
  end
  if addr >= 0x0200 and addr <= 0x02FF then
    return "oamShadow", (addr - 0x0200) >> 2
  end
  return "", ""
end

local function slot_value(slot, base)
  return cpu(base + slot)
end

local function slot_is_active(slot)
  local selector = slot_value(slot, 0x0300)
  local attr = slot_value(slot, 0x0312)
  local y = slot_value(slot, 0x0324)
  local x = slot_value(slot, 0x0348)
  local id = slot_value(slot, 0x03B4)
  local state = slot_value(slot, 0x03D8)
  local hp = slot_value(slot, 0x04C2)
  local row_data = slot_value(slot, 0x04D4)
  return selector ~= 0 or attr ~= 0 or y ~= 0 or x ~= 0 or id ~= 0 or
    state ~= 0 or hp ~= 0 or row_data ~= 0
end

local function visible_oam_count()
  local count = 0
  for index = 0, 63 do
    local y = emu.read(index * 4, emu.memType.nesSpriteRam) or 0xFF
    if y < 0xF0 then
      count = count + 1
    end
  end
  return count
end

local function append_slot_rows(trace_frame)
  local context = read_context()
  local state = ppu_state()
  local oam_count = visible_oam_count()
  for slot = 0, 0x11 do
    if slot_is_active(slot) then
      _G.slot_rows[#_G.slot_rows + 1] = table.concat({
        tostring(frames),
        tostring(trace_frame),
        tostring(slot),
        tostring(context.objset),
        tostring(context.area),
        tostring(context.submap_raw),
        tostring(context.submap),
        tostring(context.submap_flags),
        tostring(context.night),
        tostring(context.actor_pointer),
        tostring(context.tile_set_pointer),
        tostring(context.game_state),
        tostring(context.menu_state),
        tostring(state.x_scroll),
        tostring(state.video_ram_addr),
        tostring(state.tmp_video_ram_addr),
        tostring(state.bg_pattern_addr),
        tostring(state.sprite_pattern_addr),
        tostring(state.large_sprites),
        tostring(state.sprites_enabled),
        tostring(oam_count),
        tostring(slot_value(slot, 0x0300)),
        tostring(slot_value(slot, 0x0312)),
        tostring(slot_value(slot, 0x0324)),
        tostring(slot_value(slot, 0x0348)),
        tostring(slot_value(slot, 0x03B4)),
        tostring(slot_value(slot, 0x03C6)),
        tostring(slot_value(slot, 0x03D8)),
        tostring(slot_value(slot, 0x0420)),
        tostring(slot_value(slot, 0x0432)),
        tostring(slot_value(slot, 0x0444)),
        tostring(slot_value(slot, 0x0456)),
        tostring(slot_value(slot, 0x04C2)),
        tostring(slot_value(slot, 0x04D4)),
        tostring(slot_value(slot, 0x04F8))
      }, "\t")
    end
  end
end

local function append_oam_rows(trace_frame)
  for index = 0, 63 do
    local base = index * 4
    local y = emu.read(base, emu.memType.nesSpriteRam) or 0xFF
    if y < 0xF0 then
      _G.oam_rows[#_G.oam_rows + 1] = table.concat({
        tostring(frames),
        tostring(trace_frame),
        tostring(index),
        tostring(y),
        tostring(emu.read(base + 1, emu.memType.nesSpriteRam) or 0),
        tostring(emu.read(base + 2, emu.memType.nesSpriteRam) or 0),
        tostring(emu.read(base + 3, emu.memType.nesSpriteRam) or 0)
      }, "\t")
    end
  end
end

local function append_write_row(event, addr, value)
  if not _G.tracing_active then
    return
  end

  local field, slot = actor_field_for_address(addr)
  if field == "" then
    return
  end

  local state = emu.getState()
  local context = read_context()
  local active_id = ""
  local selector = ""
  local hp = ""
  local aux = ""
  local row_data = ""
  if type(slot) == "number" and slot >= 0 and slot < 0x12 then
    active_id = tostring(slot_value(slot, 0x03B4))
    selector = tostring(slot_value(slot, 0x0300))
    hp = tostring(slot_value(slot, 0x04C2))
    aux = tostring(slot_value(slot, 0x0456))
    row_data = tostring(slot_value(slot, 0x04D4))
  end
  _G.write_rows[#_G.write_rows + 1] = table.concat({
    tostring(frames),
    tostring(frames - _G.trace_start_frame),
    event,
    hex(state["cpu.pc"] or 0, 4),
    hex(state["cpu.a"] or 0, 2),
    hex(state["cpu.x"] or 0, 2),
    hex(state["cpu.y"] or 0, 2),
    hex(state["mapper.prgReg"] or 0, 2),
    hex(addr, 4),
    tostring(value or 0),
    field,
    tostring(slot),
    tostring(context.objset),
    tostring(context.area),
    tostring(context.submap_raw),
    tostring(context.submap),
    tostring(context.night),
    tostring(context.actor_pointer),
    tostring(context.tile_set_pointer),
    active_id,
    selector,
    hp,
    aux,
    row_data
  }, "\t")
end

local function write_summary(out_dir, status)
  local rom = emu.getRomInfo()
  write_file(out_dir .. "/summary.json", string.format(
    '{"schemaVersion":1,"id":"%s","label":"%s","statePath":"%s","stateLoadedFrame":%d,"traceStartFrame":%d,"settleFrames":%d,"traceFrames":%d,"sampleEvery":%d,"inputs":"%s","totalFrames":%d,"status":"%s","romName":"%s","romPath":"%s","slotRows":%d,"writeRows":%d,"oamRows":%d}\n',
    json_escape(_G.trace_id),
    json_escape(_G.trace_label),
    json_escape(_G.state_path),
    _G.state_loaded_frame,
    _G.trace_start_frame,
    _G.settle_frames,
    _G.trace_frames,
    _G.sample_every,
    json_escape(_G.inputs_raw),
    frames,
    json_escape(status),
    json_escape(rom.name or ""),
    json_escape(rom.path or ""),
    #_G.slot_rows - 1,
    #_G.write_rows - 1,
    #_G.oam_rows - 1
  ))
end

ensure_io()

local out_dir = os.getenv("CV2MAP_MESEN_OUT") or "out/actor-trace"
_G.trace_id = os.getenv("CV2MAP_ACTOR_TRACE_ID") or "actor-trace"
_G.trace_label = os.getenv("CV2MAP_ACTOR_TRACE_LABEL") or _G.trace_id
_G.state_path = os.getenv("CV2MAP_STATE_PATH") or ""
_G.inputs_raw = os.getenv("CV2MAP_INPUTS") or ""
_G.trace_oam_shadow_writes = os.getenv("CV2MAP_TRACE_OAM_SHADOW_WRITES") == "1"
_G.settle_frames = getenv_number("CV2MAP_SETTLE_FRAMES", 30)
_G.trace_frames = getenv_number("CV2MAP_TRACE_FRAMES", 600)
_G.sample_every = getenv_number("CV2MAP_SAMPLE_EVERY", 4)
_G.state_loaded = _G.state_path == ""
_G.state_loaded_frame = 0
_G.trace_start_frame = 0
_G.tracing_active = false
_G.input_events = parse_input_events(_G.inputs_raw)

_G.slot_rows = {
  "frame\ttraceFrame\tslot\tobjset\tarea\tsubmapRaw\tsubmap\tsubmapFlags\tnight\tactorPointer\ttileSetPointer\tgameState\tmenuState\tppuXScroll\tppuVideoRamAddr\tppuTmpVideoRamAddr\tppuBgPatternAddr\tppuSpritePatternAddr\tppuLargeSprites\tppuSpritesEnabled\tvisibleOamCount\tselector\tattr\tscreenY\tscreenX\tactiveId\tflags\tstate\tfacing\tsource\ttimer\taux\thp\trowData\tcooldown"
}
_G.write_rows = {
  "frame\ttraceFrame\tevent\tpc\ta\tx\ty\tprgReg\taddr\tvalue\tfield\tslot\tobjset\tarea\tsubmapRaw\tsubmap\tnight\tactorPointer\ttileSetPointer\tactiveIdAtWrite\tselectorAtWrite\thpAtWrite\tauxAtWrite\trowDataAtWrite"
}
_G.oam_rows = {
  "frame\ttraceFrame\toamIndex\ty\ttile\tattr\tx"
}

os.execute("mkdir -p " .. string.format("%q", out_dir))

if _G.state_path ~= "" then
  emu.addMemoryCallback(function()
    if _G.state_loaded then
      return
    end

    local savestate = read_file(_G.state_path)
    if savestate == nil then
      write_summary(out_dir, "state-file-missing")
      emu.stop(93)
      return
    end

    if not emu.loadSavestate(savestate) then
      write_summary(out_dir, "state-load-failed")
      emu.stop(94)
      return
    end

    _G.state_loaded = true
    _G.state_loaded_frame = frames
  end, emu.callbackType.exec, 0xFFD0, 0xFFD0, emu.memType.nesMemory)
end

emu.addEventCallback(function()
  emu.setInput(current_inputs(), 0)
end, emu.eventType.inputPolled)

emu.addMemoryCallback(function(addr, value)
  append_write_row("actor-write", addr, value)
end, emu.callbackType.write, 0x0300, 0x0509, emu.memType.nesMemory)

if _G.trace_oam_shadow_writes then
  emu.addMemoryCallback(function(addr, value)
    append_write_row("oam-shadow-write", addr, value)
  end, emu.callbackType.write, 0x0200, 0x02FF, emu.memType.nesMemory)
end

emu.addEventCallback(function()
  frames = frames + 1

  if not _G.state_loaded then
    if frames > 120 then
      write_summary(out_dir, "state-load-timeout")
      emu.stop(95)
    end
    return
  end

  if frames < _G.state_loaded_frame + _G.settle_frames then
    return
  end

  if not _G.tracing_active then
    _G.tracing_active = true
    _G.trace_start_frame = frames
  end

  local trace_frame = frames - _G.trace_start_frame
  if trace_frame <= _G.trace_frames and (trace_frame % _G.sample_every) == 0 then
    append_slot_rows(trace_frame)
    append_oam_rows(trace_frame)
  end

  if trace_frame >= _G.trace_frames then
    local screenshot = emu.takeScreenshot()
    write_file(out_dir .. "/screenshot-final.png", screenshot)
    dump_memory(out_dir .. "/cpu-final-0000-07ff.bin", 0x0000, 0x0800, emu.memType.nesDebug)
    dump_memory(out_dir .. "/ppu-final-0000-1fff-patterns.bin", 0x0000, 0x2000, emu.memType.nesPpuDebug)
    dump_memory(out_dir .. "/ppu-final-3f00-3f1f-palettes.bin", 0x3F00, 0x20, emu.memType.nesPpuDebug)
    dump_memory(out_dir .. "/oam-final-0000-00ff-sprites.bin", 0x0000, 0x100, emu.memType.nesSpriteRam)
    write_file(out_dir .. "/actor-slots.tsv", table.concat(_G.slot_rows, "\n") .. "\n")
    write_file(out_dir .. "/actor-writes.tsv", table.concat(_G.write_rows, "\n") .. "\n")
    write_file(out_dir .. "/oam.tsv", table.concat(_G.oam_rows, "\n") .. "\n")
    write_summary(out_dir, "complete")
    emu.stop(0)
  end
end, emu.eventType.endFrame)
