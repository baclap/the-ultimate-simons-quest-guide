if io == nil or os == nil then
  emu.stop(110)
end

local frames = 0
local out_dir = os.getenv("CV2MAP_MESEN_OUT") or "out/mesen-buffer-trace"
local stop_frame = tonumber(os.getenv("CV2MAP_TRACE_STOP_FRAME") or "3900")
local max_lines = tonumber(os.getenv("CV2MAP_TRACE_MAX_LINES") or "20000")
local start_presses_raw = os.getenv("CV2MAP_START_PRESSES") or "240:20,2000:20,3500:20"
os.execute("mkdir -p " .. string.format("%q", out_dir))

local function parse_start_presses(raw)
  local presses = {}
  for start_frame, duration in raw:gmatch("(%d+):(%d+)") do
    presses[#presses + 1] = {
      start_frame = tonumber(start_frame),
      end_frame = tonumber(start_frame) + tonumber(duration)
    }
  end
  return presses
end

local start_presses = parse_start_presses(start_presses_raw)

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
  if line_count >= max_lines then
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

emu.addEventCallback(function()
  local should_press_start = false
  for _, press in ipairs(start_presses) do
    if frames >= press.start_frame and frames < press.end_frame then
      should_press_start = true
    end
  end
  emu.setInput({ start = should_press_start }, 0)
end, emu.eventType.inputPolled)

emu.addEventCallback(function()
  frames = frames + 1
  if frames >= stop_frame or line_count >= max_lines then
    file:close()
    emu.stop(0)
  end
end, emu.eventType.endFrame)
