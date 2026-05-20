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
    emu.stop(80)
  end
end

local function write_file(path, data)
  local file = io.open(path, "wb")
  if file == nil then
    emu.stop(81)
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
    emu.stop(82)
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

local function parse_steps(raw)
  local steps = {}
  for entry in string.gmatch(raw or "", "([^;]+)") do
    local id, button, objset, area, submap, max_frames, settle_frames =
      entry:match("^([^,]+),([^,]+),([^,]+),([^,]+),([^,]+),([^,]+),([^,]+)$")
    if id ~= nil then
      steps[#steps + 1] = {
        id = id,
        button = string.lower(button),
        target_objset = tonumber(objset),
        target_area = tonumber(area),
        target_submap = tonumber(submap),
        max_frames = tonumber(max_frames),
        settle_frames = tonumber(settle_frames),
        start_frame = nil,
        first_target_frame = nil,
        complete_frame = nil,
        status = "pending"
      }
    end
  end
  return steps
end

local function cpu(address)
  return emu.read(address, emu.memType.nesDebug) or 0
end

local function read_context()
  local submap_raw = cpu(0x0051)
  return {
    objset = cpu(0x0030),
    area = cpu(0x0050),
    submap_raw = submap_raw,
    submap = submap_raw & 0x7F,
    submap_flags = submap_raw & 0x80,
    actor_pointer = cpu(0x003D) | (cpu(0x003E) << 8),
    tile_set_pointer = cpu(0x0063) | (cpu(0x0064) << 8),
    game_state = cpu(0x0026),
    menu_state = cpu(0x0033),
    selected_item = cpu(0x004F),
    transition_state = cpu(0x008E)
  }
end

local function target_matches(step, context)
  return context.objset == step.target_objset and
    context.area == step.target_area and
    context.submap == step.target_submap
end

local function current_inputs()
  local step = nil
  if _G.current_step_index ~= nil then
    step = _G.steps[_G.current_step_index]
  end

  if step == nil or step.status ~= "active" or step.first_target_frame ~= nil then
    return {}
  end

  local inputs = {}
  inputs[step.button] = true
  return inputs
end

local function ppu_state()
  local state = emu.getState()
  return {
    x_scroll = state["ppu.xScroll"] or 0,
    video_ram_addr = state["ppu.videoRamAddr"] or 0,
    tmp_video_ram_addr = state["ppu.tmpVideoRamAddr"] or 0,
    bg_pattern_addr = state["ppu.control.backgroundPatternAddr"] or 0,
    sprite_pattern_addr = state["ppu.control.spritePatternAddr"] or 0
  }
end

local function hex(value, width)
  if value == nil then
    return ""
  end
  return string.format("%0" .. tostring(width) .. "X", value & ((1 << (width * 4)) - 1))
end

local function write_trace_row(event, addr, value)
  local step = nil
  if _G.current_step_index ~= nil then
    step = _G.steps[_G.current_step_index]
  end
  if step == nil or step.status ~= "active" then
    return
  end

  local state = emu.getState()
  local context = read_context()
  _G.write_rows[#_G.write_rows + 1] = table.concat({
    tostring(frames),
    step.id,
    tostring(frames - step.start_frame),
    event,
    hex(state["cpu.pc"] or 0, 4),
    hex(state["cpu.a"] or 0, 2),
    hex(state["cpu.x"] or 0, 2),
    hex(state["cpu.y"] or 0, 2),
    hex(state["mapper.prgReg"] or 0, 2),
    hex(addr or 0, 4),
    hex(value or 0, 2),
    tostring(context.objset),
    tostring(context.area),
    tostring(context.submap_raw),
    tostring(context.submap),
    tostring(context.actor_pointer),
    tostring(context.tile_set_pointer),
    tostring(context.transition_state)
  }, "\t")
end

local function trace_row(step, step_frame, context)
  local ppu = ppu_state()
  return table.concat({
    tostring(frames),
    step.id,
    tostring(step_frame),
    step.button,
    step.status,
    tostring(step.first_target_frame or ""),
    tostring(context.objset),
    tostring(context.area),
    tostring(context.submap_raw),
    tostring(context.submap),
    tostring(context.submap_flags),
    tostring(context.actor_pointer),
    tostring(context.tile_set_pointer),
    tostring(context.game_state),
    tostring(context.menu_state),
    tostring(context.selected_item),
    tostring(context.transition_state),
    tostring(ppu.x_scroll),
    tostring(ppu.video_ram_addr),
    tostring(ppu.tmp_video_ram_addr),
    tostring(ppu.bg_pattern_addr),
    tostring(ppu.sprite_pattern_addr)
  }, "\t")
end

local function step_json(step)
  return string.format(
    '{"id":"%s","button":"%s","targetContext":{"objset":%d,"area":%d,"submap":%d},"startFrame":%s,"firstTargetFrame":%s,"completeFrame":%s,"maxFrames":%d,"settleFrames":%d,"status":"%s","beforeCpu":"%s","afterCpu":"%s","beforeOam":"%s","afterOam":"%s"}',
    json_escape(step.id),
    json_escape(step.button),
    step.target_objset,
    step.target_area,
    step.target_submap,
    step.start_frame and tostring(step.start_frame) or "null",
    step.first_target_frame and tostring(step.first_target_frame) or "null",
    step.complete_frame and tostring(step.complete_frame) or "null",
    step.max_frames,
    step.settle_frames,
    json_escape(step.status),
    json_escape(step.before_cpu or ""),
    json_escape(step.after_cpu or ""),
    json_escape(step.before_oam or ""),
    json_escape(step.after_oam or "")
  )
end

local function write_summary(out_dir, status, probe_id, probe_label, state_path, state_loaded_frame, steps)
  local step_parts = {}
  for index, step in ipairs(steps) do
    step_parts[index] = step_json(step)
  end

  write_file(out_dir .. "/summary.json", string.format(
    '{"schemaVersion":1,"id":"%s","label":"%s","statePath":"%s","stateLoadedFrame":%d,"totalFrames":%d,"status":"%s","steps":[%s]}\n',
    json_escape(probe_id),
    json_escape(probe_label),
    json_escape(state_path),
    state_loaded_frame,
    frames,
    json_escape(status),
    table.concat(step_parts, ",")
  ))
end

ensure_io()

local out_dir = os.getenv("CV2MAP_MESEN_OUT") or "out/transition-probe"
local probe_id = os.getenv("CV2MAP_TRANSITION_PROBE_ID") or "transition-probe"
local probe_label = os.getenv("CV2MAP_TRANSITION_PROBE_LABEL") or probe_id
local state_path = os.getenv("CV2MAP_STATE_PATH") or ""
local pre_settle_frames = getenv_number("CV2MAP_PRE_SETTLE_FRAMES", 30)
local steps_raw = os.getenv("CV2MAP_TRANSITION_STEPS") or ""
local state_loaded = state_path == ""
local state_loaded_frame = 0
local trace_rows = {
  "frame\tstepId\tstepFrame\tinput\tstatus\tfirstTargetFrame\tobjset\tarea\tsubmapRaw\tsubmap\tsubmapFlags\tactorPointer\ttileSetPointer\tgameState\tmenuState\tselectedItem\ttransitionState\tppuXScroll\tppuVideoRamAddr\tppuTmpVideoRamAddr\tppuBgPatternAddr\tppuSpritePatternAddr"
}

_G.steps = parse_steps(steps_raw)
_G.current_step_index = nil
_G.write_rows = {
  "frame\tstepId\tstepFrame\tevent\tpc\ta\tx\ty\tprgReg\taddr\tvalue\tobjset\tarea\tsubmapRaw\tsubmap\tactorPointer\ttileSetPointer\ttransitionState"
}

os.execute("mkdir -p " .. string.format("%q", out_dir))

if #_G.steps == 0 then
  write_summary(out_dir, "no-steps", probe_id, probe_label, state_path, state_loaded_frame, _G.steps)
  emu.stop(0)
end

if state_path ~= "" then
  emu.addMemoryCallback(function()
    if state_loaded then
      return
    end

    local savestate = read_file(state_path)
    if savestate == nil then
      emu.stop(83)
      return
    end

    if not emu.loadSavestate(savestate) then
      emu.stop(84)
      return
    end

    state_loaded = true
    state_loaded_frame = frames
  end, emu.callbackType.exec, 0xFFD0, 0xFFD0, emu.memType.nesMemory)
end

emu.addEventCallback(function()
  emu.setInput(current_inputs(), 0)
end, emu.eventType.inputPolled)

emu.addMemoryCallback(function(addr, value)
  write_trace_row("zero-page-write", addr, value)
end, emu.callbackType.write, 0x0000, 0x00FF, emu.memType.nesMemory)

emu.addMemoryCallback(function(addr, value)
  write_trace_row("sprite-staging-write", addr, value)
end, emu.callbackType.write, 0x0300, 0x03FF, emu.memType.nesMemory)

local function start_step(index)
  local step = _G.steps[index]
  _G.current_step_index = index
  step.status = "active"
  step.start_frame = frames
  step.before_cpu = step.id .. "-before-cpu-0000-07ff.bin"
  step.before_oam = step.id .. "-before-oam-0000-00ff.bin"
  dump_memory(out_dir .. "/" .. step.before_cpu, 0x0000, 0x0800, emu.memType.nesDebug)
  dump_memory(out_dir .. "/" .. step.before_oam, 0x0000, 0x0100, emu.memType.nesSpriteRam)
end

local function complete_step(step)
  step.status = "complete"
  step.complete_frame = frames
  step.after_cpu = step.id .. "-after-cpu-0000-07ff.bin"
  step.after_oam = step.id .. "-after-oam-0000-00ff.bin"
  dump_memory(out_dir .. "/" .. step.after_cpu, 0x0000, 0x0800, emu.memType.nesDebug)
  dump_memory(out_dir .. "/" .. step.after_oam, 0x0000, 0x0100, emu.memType.nesSpriteRam)
end

local function timeout_step(step)
  step.status = "timeout"
  step.complete_frame = frames
  step.after_cpu = step.id .. "-timeout-cpu-0000-07ff.bin"
  step.after_oam = step.id .. "-timeout-oam-0000-00ff.bin"
  dump_memory(out_dir .. "/" .. step.after_cpu, 0x0000, 0x0800, emu.memType.nesDebug)
  dump_memory(out_dir .. "/" .. step.after_oam, 0x0000, 0x0100, emu.memType.nesSpriteRam)
end

emu.addEventCallback(function()
  frames = frames + 1

  if not state_loaded then
    if frames > 120 then
      write_summary(out_dir, "state-load-timeout", probe_id, probe_label, state_path, state_loaded_frame, _G.steps)
      emu.stop(0)
    end
    return
  end

  if _G.current_step_index == nil then
    if frames < state_loaded_frame + pre_settle_frames then
      return
    end
    dump_memory(out_dir .. "/probe-start-cpu-0000-07ff.bin", 0x0000, 0x0800, emu.memType.nesDebug)
    start_step(1)
  end

  local step = _G.steps[_G.current_step_index]
  if step == nil then
    write_file(out_dir .. "/trace.tsv", table.concat(trace_rows, "\n") .. "\n")
    write_file(out_dir .. "/ram-writes.tsv", table.concat(_G.write_rows, "\n") .. "\n")
    write_summary(out_dir, "complete", probe_id, probe_label, state_path, state_loaded_frame, _G.steps)
    emu.stop(0)
    return
  end

  local step_frame = frames - step.start_frame
  local context = read_context()
  trace_rows[#trace_rows + 1] = trace_row(step, step_frame, context)

  if step.first_target_frame == nil and target_matches(step, context) then
    step.first_target_frame = frames
  end

  if step.first_target_frame ~= nil and frames >= step.first_target_frame + step.settle_frames then
    complete_step(step)
    if _G.current_step_index >= #_G.steps then
      _G.current_step_index = _G.current_step_index + 1
    else
      start_step(_G.current_step_index + 1)
    end
    return
  end

  if step_frame >= step.max_frames then
    timeout_step(step)
    write_file(out_dir .. "/trace.tsv", table.concat(trace_rows, "\n") .. "\n")
    write_file(out_dir .. "/ram-writes.tsv", table.concat(_G.write_rows, "\n") .. "\n")
    write_summary(out_dir, "timeout", probe_id, probe_label, state_path, state_loaded_frame, _G.steps)
    emu.stop(0)
  end
end, emu.eventType.endFrame)
