if io == nil or os == nil then
  emu.stop(100)
end

local frames = 0
local out_dir = os.getenv("CV2MAP_MESEN_OUT") or "out/mesen-bg-trace"
local stop_frame = tonumber(os.getenv("CV2MAP_TRACE_STOP_FRAME") or "5200")
local max_lines = tonumber(os.getenv("CV2MAP_TRACE_MAX_LINES") or "4000")
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

local file = io.open(out_dir .. "/background-loader.tsv", "wb")
if file == nil then
  emu.stop(101)
end

file:write("frame\tpc\tlabel\tprgReg\tchrReg0\tchrReg1\tobj30\tarea50\tsub51\tptr00\tptr3d\tppuAddr\n")

local line_count = 0
local ppu_addr_high = nil
local ppu_addr = 0

local function hex(value, width)
  if value == nil then
    return ""
  end
  return string.format("%0" .. tostring(width) .. "X", value & ((1 << (width * 4)) - 1))
end

local function read16(addr)
  return (emu.read(addr, emu.memType.nesDebug) or 0) + ((emu.read(addr + 1, emu.memType.nesDebug) or 0) << 8)
end

local function log(label)
  if line_count >= max_lines then
    return
  end
  local state = emu.getState()
  file:write(table.concat({
    tostring(frames),
    hex(state["cpu.pc"] or 0, 4),
    label,
    hex(state["mapper.prgReg"] or 0, 2),
    hex(state["mapper.chrReg0"] or 0, 2),
    hex(state["mapper.chrReg1"] or 0, 2),
    hex(emu.read(0x0030, emu.memType.nesDebug) or 0, 2),
    hex(emu.read(0x0050, emu.memType.nesDebug) or 0, 2),
    hex(emu.read(0x0051, emu.memType.nesDebug) or 0, 2),
    hex(read16(0x0000), 4),
    hex(read16(0x003D), 4),
    hex(ppu_addr, 4)
  }, "\t"))
  file:write("\n")
  line_count = line_count + 1
end

local targets = {
  [0xC34B] = "call-c6b6-from-c34b",
  [0xC6B6] = "load-transfer-pointer",
  [0xC6C0] = "run-transfer",
  [0xC6E0] = "transfer-loop",
  [0xC6FA] = "write-literal",
  [0xC717] = "write-repeat",
  [0xC724] = "transfer-return",
  [0xCB69] = "nmi-buffer",
  [0xCBBA] = "nmi-fill-ff",
  [0xCBC0] = "nmi-seq-write"
}

for address, label in pairs(targets) do
  emu.addMemoryCallback(function()
    log(label)
  end, emu.callbackType.exec, address, address, emu.memType.nesMemory)
end

emu.addMemoryCallback(function(addr, value)
  if addr == 0x2006 then
    if ppu_addr_high == nil then
      ppu_addr_high = value & 0x3F
    else
      ppu_addr = ((ppu_addr_high << 8) | value) & 0x3FFF
      ppu_addr_high = nil
    end
  elseif addr == 0x2007 then
    ppu_addr = (ppu_addr + 1) & 0x3FFF
  end
end, emu.callbackType.write, 0x2006, 0x2007, emu.memType.nesMemory)

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
