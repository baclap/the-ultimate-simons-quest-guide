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
  _G.rows[#_G.rows + 1] = table.concat({
    tostring(frames),
    tostring(trace_frame),
    hex(state["cpu.pc"] or 0, 4),
    hex(state["mapper.prgReg"] or 0, 2),
    hex(cpu(0x00F7), 2),
    tostring(cpu(0x0300)),
    tostring(cpu(0x0324)),
    tostring(cpu(0x0336)),
    tostring(cpu(0x0348)),
    tostring(cpu(0x035A)),
    tostring(cpu(0x036C)),
    tostring(cpu(0x037E)),
    tostring(cpu(0x03D8)),
    tostring(cpu(0x0420)),
    tostring(cpu(0x006C)),
    tostring(cpu(0x006D))
  }, "\t")
end

local out_dir = os.getenv("CV2MAP_MESEN_OUT") or "out/player-physics-trace"
_G.trace_id = os.getenv("CV2MAP_ACTOR_TRACE_ID") or "player-physics"
_G.state_path = os.getenv("CV2MAP_STATE_PATH") or ""
_G.inputs_raw = os.getenv("CV2MAP_INPUTS") or ""
_G.settle_frames = getenv_number("CV2MAP_SETTLE_FRAMES", 30)
_G.trace_frames = getenv_number("CV2MAP_TRACE_FRAMES", 180)
_G.state_loaded = _G.state_path == ""
_G.state_loaded_frame = 0
_G.trace_start_frame = 0
_G.input_events = parse_input_events(_G.inputs_raw)
_G.rows = {
  "frame\ttraceFrame\tpc\tprgReg\tinputF7\tselector\tscreenY\tsubY\tscreenX\tsubX\tvelYHi\tvelYLo\tstate\tfacing\tmoveLo\tmoveHi"
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
    write_file(out_dir .. "/player-physics.tsv", table.concat(_G.rows, "\n") .. "\n")
    write_summary(out_dir, "ok")
    emu.stop(0)
  end
end, emu.eventType.endFrame)
