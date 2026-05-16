if io == nil or os == nil then
  emu.stop(90)
end

local out_dir = os.getenv("CV2MAP_MESEN_OUT") or "out/mesen-ppu-trace"
local stop_frame = tonumber(os.getenv("CV2MAP_TRACE_STOP_FRAME") or "900")
local max_lines = tonumber(os.getenv("CV2MAP_TRACE_MAX_LINES") or "10000")
os.execute("mkdir -p " .. string.format("%q", out_dir))

local frames = 0
local line_count = 0
local file = io.open(out_dir .. "/ppu-writes.tsv", "wb")
if file == nil then
  emu.stop(91)
end

file:write("frame\tpc\taddr\tvalue\targ3\targ4\tbank30\tarea50\tsub51\tptr00\tptr3d\n")

local function hex(value, width)
  if value == nil then
    return ""
  end
  return string.format("%0" .. tostring(width) .. "X", value & ((1 << (width * 4)) - 1))
end

local function trace_write(addr, value, arg3, arg4)
  if line_count >= max_lines then
    return
  end

  local state = emu.getState()
  local ptr00 = (emu.read(0x0000, emu.memType.nesDebug) or 0) + ((emu.read(0x0001, emu.memType.nesDebug) or 0) << 8)
  local ptr3d = (emu.read(0x003D, emu.memType.nesDebug) or 0) + ((emu.read(0x003E, emu.memType.nesDebug) or 0) << 8)
  file:write(table.concat({
    tostring(frames),
    hex(state["cpu.pc"] or 0, 4),
    hex(addr, 4),
    hex(value or 0, 2),
    tostring(arg3 or ""),
    tostring(arg4 or ""),
    hex(emu.read(0x0030, emu.memType.nesDebug) or 0, 2),
    hex(emu.read(0x0050, emu.memType.nesDebug) or 0, 2),
    hex(emu.read(0x0051, emu.memType.nesDebug) or 0, 2),
    hex(ptr00, 4),
    hex(ptr3d, 4)
  }, "\t"))
  file:write("\n")
  line_count = line_count + 1
end

emu.addMemoryCallback(trace_write, emu.callbackType.write, 0x2000, 0x2007, emu.memType.nesMemory)

emu.addEventCallback(function()
  frames = frames + 1
  if frames >= stop_frame or line_count >= max_lines then
    file:close()
    emu.stop(0)
  end
end, emu.eventType.endFrame)
