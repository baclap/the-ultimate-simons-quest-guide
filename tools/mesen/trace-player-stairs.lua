local frames = 0

local function getenv_number(name, default_value)
  local raw = os.getenv(name)
  if raw == nil or raw == "" then
    return default_value
  end
  return tonumber(raw) or default_value
end

local function json_escape(value)
  value = value or ""
  value = value:gsub("\\", "\\\\")
  value = value:gsub("\"", "\\\"")
  value = value:gsub("\n", "\\n")
  value = value:gsub("\r", "\\r")
  return value
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

local function hex(value, width)
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

local function player_oam_bounds()
  local min_x = 255
  local min_y = 255
  local max_x = 0
  local max_y = 0
  local count = 0
  for index = 0, 15 do
    local base = index * 4
    local y = emu.read(base, emu.memType.nesSpriteRam) or 0xFF
    local tile = emu.read(base + 1, emu.memType.nesSpriteRam) or 0
    local x = emu.read(base + 3, emu.memType.nesSpriteRam) or 0
    if y < 0xEF and tile ~= 0 then
      count = count + 1
      if x < min_x then min_x = x end
      if y < min_y then min_y = y end
      if x + 7 > max_x then max_x = x + 7 end
      if y + 16 > max_y then max_y = y + 16 end
    end
  end
  if count == 0 then
    return { count = 0, min_x = 0, min_y = 0, max_x = 0, max_y = 0 }
  end
  return { count = count, min_x = min_x, min_y = min_y, max_x = max_x, max_y = max_y }
end

local function write_summary(out_dir, status)
  local rom = emu.getRomInfo()
  write_file(out_dir .. "/summary.json", string.format(
    '{"schemaVersion":1,"id":"%s","statePath":"%s","traceStartFrame":%d,"settleFrames":%d,"traceFrames":%d,"inputs":"%s","totalFrames":%d,"status":"%s","romName":"%s","romPath":"%s","rows":%d}\n',
    json_escape(_G.trace_id),
    json_escape(_G.state_path),
    _G.trace_start_frame,
    _G.settle_frames,
    _G.trace_frames,
    json_escape(_G.inputs_raw),
    frames,
    json_escape(status),
    json_escape(rom.name or ""),
    json_escape(rom.path or ""),
    #_G.rows - 1
  ))
end

local function append_row(trace_frame)
  local state = emu.getState()
  local bounds = player_oam_bounds()
  _G.rows[#_G.rows + 1] = table.concat({
    tostring(frames),
    tostring(trace_frame),
    hex(state["cpu.pc"] or 0, 4),
    hex(state["mapper.prgReg"] or 0, 2),
    hex(cpu(0x00F5), 2),
    hex(cpu(0x00F7), 2),
    hex(cpu(0x0050), 2),
    hex(cpu(0x0051), 2),
    hex(cpu(0x0052), 2),
    hex(cpu(0x0053), 2),
    hex(cpu(0x0054), 2),
    hex(cpu(0x0055), 2),
    hex(cpu(0x0056), 2),
    hex(cpu(0x0057), 2),
    hex(cpu(0x0067), 2),
    hex(cpu(0x0068), 2),
    hex(cpu(0x006C), 2),
    hex(cpu(0x006D), 2),
    hex(cpu(0x0300), 2),
    tostring(cpu(0x0324)),
    tostring(cpu(0x0336)),
    tostring(cpu(0x0348)),
    tostring(cpu(0x035A)),
    hex(cpu(0x036C), 2),
    hex(cpu(0x037E), 2),
    hex(cpu(0x0390), 2),
    hex(cpu(0x03D8), 2),
    hex(cpu(0x040E), 2),
    hex(cpu(0x0420), 2),
    hex(cpu(0x0446), 2),
    hex(cpu(0x0456), 2),
    hex(cpu(0x0468), 2),
    hex(cpu(0x047A), 2),
    hex(cpu(0x048C), 2),
    hex(cpu(0x049E), 2),
    hex(cpu(0x04B0), 2),
    hex(cpu(0x04C2), 2),
    tostring(bounds.count),
    tostring(bounds.min_x),
    tostring(bounds.min_y),
    tostring(bounds.max_x),
    tostring(bounds.max_y)
  }, "\t")
end

local out_dir = os.getenv("CV2MAP_MESEN_OUT") or "out/player-stair-trace"
_G.trace_id = os.getenv("CV2MAP_ACTOR_TRACE_ID") or "player-stairs"
_G.state_path = os.getenv("CV2MAP_STATE_PATH") or ""
_G.inputs_raw = os.getenv("CV2MAP_INPUTS") or ""
_G.settle_frames = getenv_number("CV2MAP_SETTLE_FRAMES", 30)
_G.trace_frames = getenv_number("CV2MAP_TRACE_FRAMES", 420)
_G.state_loaded = _G.state_path == ""
_G.state_loaded_frame = 0
_G.trace_start_frame = 0
_G.input_events = parse_input_events(_G.inputs_raw)
_G.rows = {
  "frame\ttraceFrame\tpc\tprgReg\tinputF5\tinputF7\tarea50\tsub51\tcamSub52\tcamLo53\tcamHi54\tworldSub55\tworldLo56\tworldHi57\tmoveMode67\tmotionFlags68\tmoveLo6c\tmoveHi6d\tselector\tscreenY\tsubY\tscreenX\tsubX\tvelYHi36c\tvelYLo37e\tanimState390\tstate3d8\tselectorSidecar40e\tfacing420\tairFlag446\tstairAnim456\tstairFacing468\tstairTimer47a\tstairDir48c\tstairDir49e\tstairDelay4b0\tstairKind4c2\toamCount\toamMinX\toamMinY\toamMaxX\toamMaxY"
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

  if _G.trace_start_frame == 0 then
    _G.trace_start_frame = frames
  end

  local trace_frame = frames - _G.trace_start_frame
  if trace_frame <= _G.trace_frames then
    append_row(trace_frame)
  end

  if trace_frame >= _G.trace_frames then
    write_file(out_dir .. "/player-stairs.tsv", table.concat(_G.rows, "\n") .. "\n")
    write_summary(out_dir, "ok")
    emu.stop(0)
  end
end, emu.eventType.endFrame)
