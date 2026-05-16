if io == nil or os == nil then
  emu.stop(120)
end

local frames = 0
local out_dir = os.getenv("CV2MAP_MESEN_OUT") or "out/mesen-jova-render-state"
local start_frame = tonumber(os.getenv("CV2MAP_TRACE_START_FRAME") or "3600")
local stop_frame = tonumber(os.getenv("CV2MAP_TRACE_STOP_FRAME") or "3785")
local max_lines = tonumber(os.getenv("CV2MAP_TRACE_MAX_LINES") or "60000")
local start_presses_raw = os.getenv("CV2MAP_START_PRESSES") or "240:20,2000:20,3500:20"
os.execute("mkdir -p " .. string.format("%q", out_dir))

local function parse_start_presses(raw)
  local presses = {}
  for start_at, duration in raw:gmatch("(%d+):(%d+)") do
    presses[#presses + 1] = {
      start_frame = tonumber(start_at),
      end_frame = tonumber(start_at) + tonumber(duration)
    }
  end
  return presses
end

local start_presses = parse_start_presses(start_presses_raw)

local file = io.open(out_dir .. "/jova-render-state.tsv", "wb")
if file == nil then
  emu.stop(121)
end

file:write("frame\tevent\tpc\ta\tx\ty\taddr\tvalue\tprgReg\tchrReg0\tchrReg1\tp10\tp16\tp17\tp5c\tp5e\tp60\tp63\tv13\tv14\tv58\tv59\tv5a\tv5b\tv5c\tv5d\tv5e\tv5f\tv60\tv61\tv93\tv94\tv97\tv98\tbuf22\n")

local line_count = 0

local function hex(value, width)
  if value == nil then
    return ""
  end
  return string.format("%0" .. tostring(width) .. "X", value & ((1 << (width * 4)) - 1))
end

local function read8(addr)
  return emu.read(addr, emu.memType.nesDebug) or 0
end

local function read16(addr)
  return read8(addr) + (read8(addr + 1) << 8)
end

local function log(event, addr, value)
  if frames < start_frame or line_count >= max_lines then
    return
  end

  local state = emu.getState()
  file:write(table.concat({
    tostring(frames),
    event,
    hex(state["cpu.pc"] or 0, 4),
    hex(state["cpu.a"] or 0, 2),
    hex(state["cpu.x"] or 0, 2),
    hex(state["cpu.y"] or 0, 2),
    hex(addr or 0, 4),
    hex(value or 0, 2),
    hex(state["mapper.prgReg"] or 0, 2),
    hex(state["mapper.chrReg0"] or 0, 2),
    hex(state["mapper.chrReg1"] or 0, 2),
    hex(read16(0x0010), 4),
    hex(read16(0x0016), 4),
    hex(read16(0x0017), 4),
    hex(read16(0x005c), 4),
    hex(read16(0x005e), 4),
    hex(read16(0x0060), 4),
    hex(read16(0x0063), 4),
    hex(read8(0x0013), 2),
    hex(read8(0x0014), 2),
    hex(read8(0x0058), 2),
    hex(read8(0x0059), 2),
    hex(read8(0x005a), 2),
    hex(read8(0x005b), 2),
    hex(read8(0x005c), 2),
    hex(read8(0x005d), 2),
    hex(read8(0x005e), 2),
    hex(read8(0x005f), 2),
    hex(read8(0x0060), 2),
    hex(read8(0x0061), 2),
    hex(read8(0x0093), 2),
    hex(read8(0x0094), 2),
    hex(read8(0x0097), 2),
    hex(read8(0x0098), 2),
    hex(read8(0x0022), 2)
  }, "\t"))
  file:write("\n")
  line_count = line_count + 1
end

emu.addMemoryCallback(function(addr, value)
  log("stage-write", addr, value)
end, emu.callbackType.write, 0x0500, 0x05FF, emu.memType.nesMemory)

emu.addMemoryCallback(function(addr, value)
  log("stage-read", addr, value)
end, emu.callbackType.read, 0x0500, 0x05FF, emu.memType.nesMemory)

emu.addMemoryCallback(function(addr, value)
  log("ppu-buffer-write", addr, value)
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
