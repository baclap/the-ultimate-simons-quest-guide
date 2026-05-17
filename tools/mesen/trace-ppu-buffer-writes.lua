if io == nil or os == nil then
  emu.stop(110)
end

local frames = 0
local out_dir = os.getenv("CV2MAP_MESEN_OUT") or "out/mesen-buffer-trace"
local stop_frame = tonumber(os.getenv("CV2MAP_TRACE_STOP_FRAME") or "3900")
local max_lines = tonumber(os.getenv("CV2MAP_TRACE_MAX_LINES") or "20000")
local start_presses_raw = os.getenv("CV2MAP_START_PRESSES") or "240:20,2000:20,3500:20"
local inputs_raw = os.getenv("CV2MAP_INPUTS") or ""
local state_path = os.getenv("CV2MAP_STATE_PATH") or ""
local settle_frames = tonumber(os.getenv("CV2MAP_SETTLE_FRAMES") or "30")
local state_loaded = state_path == ""
local state_loaded_frame = 0
os.execute("mkdir -p " .. string.format("%q", out_dir))

local function read_file(path)
  local file = io.open(path, "rb")
  if file == nil then
    return nil
  end
  local data = file:read("*a")
  file:close()
  return data
end

local function parse_start_presses(raw, use_default)
  local presses = {}
  for start_frame, duration in raw:gmatch("(%d+):(%d+)") do
    presses[#presses + 1] = {
      start_frame = tonumber(start_frame),
      end_frame = tonumber(start_frame) + tonumber(duration)
    }
  end
  if #presses == 0 and use_default then
    presses[1] = {
      start_frame = 45,
      end_frame = 57
    }
  end
  return presses
end

local function parse_input_events(raw)
  local events = {}
  for button, start_frame, duration in raw:gmatch("([%a_]+):(%d+):(%d+)") do
    events[#events + 1] = {
      button = string.lower(button),
      start_frame = tonumber(start_frame),
      end_frame = tonumber(start_frame) + tonumber(duration)
    }
  end
  return events
end

local function start_presses_to_input_events(raw)
  local events = {}
  for _, press in ipairs(parse_start_presses(raw, state_path == "")) do
    events[#events + 1] = {
      button = "start",
      start_frame = press.start_frame,
      end_frame = press.end_frame
    }
  end
  return events
end

local input_events = parse_input_events(inputs_raw)
if #input_events == 0 then
  input_events = start_presses_to_input_events(start_presses_raw)
end

local function current_inputs()
  local inputs = {}
  for _, input in ipairs(input_events) do
    if frames >= input.start_frame and frames < input.end_frame then
      inputs[input.button] = true
    end
  end
  return inputs
end

local file = io.open(out_dir .. "/ppu-buffer-writes.tsv", "wb")
if file == nil then
  emu.stop(111)
end

file:write("frame\tpc\taddr\tvalue\tprgReg\tchrReg0\tchrReg1\tobj30\tarea50\tsub51\tptr00\tptr02\tptr17\tptr3d\tbuf22\n")

local line_count = 0

local function hex(value, width)
  if value == nil then
    return ""
  end
  return string.format("%0" .. tostring(width) .. "X", value & ((1 << (width * 4)) - 1))
end

local function read16(addr)
  return (emu.read(addr, emu.memType.nesDebug) or 0) + ((emu.read(addr + 1, emu.memType.nesDebug) or 0) << 8)
end

emu.addMemoryCallback(function(addr, value)
  if not state_loaded or line_count >= max_lines then
    return
  end

  if state_path ~= "" and frames < state_loaded_frame + settle_frames then
    return
  end

  local state = emu.getState()
  file:write(table.concat({
    tostring(frames),
    hex(state["cpu.pc"] or 0, 4),
    hex(addr, 4),
    hex(value or 0, 2),
    hex(state["mapper.prgReg"] or 0, 2),
    hex(state["mapper.chrReg0"] or 0, 2),
    hex(state["mapper.chrReg1"] or 0, 2),
    hex(emu.read(0x0030, emu.memType.nesDebug) or 0, 2),
    hex(emu.read(0x0050, emu.memType.nesDebug) or 0, 2),
    hex(emu.read(0x0051, emu.memType.nesDebug) or 0, 2),
    hex(read16(0x0000), 4),
    hex(read16(0x0002), 4),
    hex(read16(0x0017), 4),
    hex(read16(0x003D), 4),
    hex(emu.read(0x0022, emu.memType.nesDebug) or 0, 2)
  }, "\t"))
  file:write("\n")
  line_count = line_count + 1
end, emu.callbackType.write, 0x0700, 0x07FF, emu.memType.nesMemory)

if state_path ~= "" then
  emu.addMemoryCallback(function()
    if state_loaded then
      return
    end

    local savestate = read_file(state_path)
    if savestate == nil then
      emu.stop(113)
      return
    end

    if not emu.loadSavestate(savestate) then
      emu.stop(114)
      return
    end

    state_loaded = true
    state_loaded_frame = frames
  end, emu.callbackType.exec, 0xFFD0, 0xFFD0, emu.memType.nesMemory)
end

emu.addEventCallback(function()
  emu.setInput(current_inputs(), 0)
end, emu.eventType.inputPolled)

emu.addEventCallback(function()
  frames = frames + 1

  if not state_loaded then
    if frames > 120 then
      file:close()
      emu.stop(115)
    end
    return
  end

  local should_stop = false
  if state_path == "" then
    should_stop = frames >= stop_frame
  else
    should_stop = frames >= state_loaded_frame + settle_frames + stop_frame
  end

  if should_stop or line_count >= max_lines then
    file:close()
    emu.stop(0)
  end
end, emu.eventType.endFrame)
