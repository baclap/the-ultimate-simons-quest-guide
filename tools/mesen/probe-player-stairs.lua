local frames = 0

local function getenv_number(name, default_value)
  local raw = os.getenv(name)
  if raw == nil or raw == "" then
    return default_value
  end
  return tonumber(raw) or default_value
end

local function getenv_string(name, default_value)
  local raw = os.getenv(name)
  if raw == nil or raw == "" then
    return default_value
  end
  return raw
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

local function cpu(address)
  return emu.read(address, emu.memType.nesDebug) or 0
end

local function cpu_write(address, value)
  emu.write(address, value & 0xFF, emu.memType.nesDebug)
end

local function hex(value, width)
  return string.format("%0" .. tostring(width) .. "X", value & ((1 << (width * 4)) - 1))
end

local function parse_buttons(raw)
  local buttons = {}
  for button in string.gmatch(raw or "", "([%a_]+)") do
    buttons[#buttons + 1] = string.lower(button)
  end
  if #buttons == 0 then
    buttons = { "up", "down", "left", "right" }
  end
  return buttons
end

local function capture_cpu_ram()
  local ram = {}
  for address = 0, 0x07FF do
    ram[address] = cpu(address)
  end
  return ram
end

local function restore_cpu_ram(ram)
  for address = 0, 0x009F do
    cpu_write(address, ram[address] or 0)
  end
  for address = 0x0300, 0x0312 do
    cpu_write(address, ram[address] or 0)
  end
  local player_addresses = {
    0x0324, 0x0336, 0x0348, 0x035A, 0x036C, 0x037E,
    0x0390, 0x03A2, 0x03B4, 0x03C6, 0x03D8, 0x03EA, 0x03FC,
    0x040E, 0x0420, 0x0444, 0x0446, 0x0456, 0x0468, 0x047A,
    0x048C, 0x049E, 0x04B0, 0x04C2
  }
  for _, address in ipairs(player_addresses) do
    cpu_write(address, ram[address] or 0)
  end
end

local function oam_bounds()
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

local out_dir = os.getenv("CV2MAP_MESEN_OUT") or "out/player-stair-probe"
local state_path = os.getenv("CV2MAP_STATE_PATH") or ""
local settle_frames = getenv_number("CV2MAP_SETTLE_FRAMES", 30)
local case_frames = getenv_number("CV2MAP_PROBE_CASE_FRAMES", 40)
local x_min = getenv_number("CV2MAP_PROBE_X_MIN", 0)
local x_max = getenv_number("CV2MAP_PROBE_X_MAX", 255)
local x_step = getenv_number("CV2MAP_PROBE_X_STEP", 4)
local y_min = getenv_number("CV2MAP_PROBE_Y_MIN", 0)
local y_max = getenv_number("CV2MAP_PROBE_Y_MAX", 220)
local y_step = getenv_number("CV2MAP_PROBE_Y_STEP", 4)
local buttons = parse_buttons(getenv_string("CV2MAP_PROBE_BUTTONS", "up,down,left,right"))

local state_loaded = state_path == ""
local state_loaded_frame = 0
local baseline_ram = nil
local cases = {}
local current_case_index = 0
local current_case_frame = 0
local current_case = nil
local rows = {
  "case\tbutton\tstartX\tstartY\tfirstFrame\tframe\tstate\tselector\tscreenX\tsubX\tscreenY\tsubY\tfacing\tvelXHi\tvelXLo\tvelYHi\tvelYLo\tstairFacing\tstairKind\tstepTimer\tanimIndex\toamCount\toamMinX\toamMinY\toamMaxX\toamMaxY"
}

os.execute("mkdir -p " .. string.format("%q", out_dir))

for y = y_min, y_max, y_step do
  for x = x_min, x_max, x_step do
    for _, button in ipairs(buttons) do
      cases[#cases + 1] = { x = x, y = y, button = button }
    end
  end
end

local function setup_case(index)
  current_case_index = index
  current_case_frame = 0
  current_case = cases[index]
  if current_case == nil then
    write_file(out_dir .. "/player-stair-probe.tsv", table.concat(rows, "\n") .. "\n")
    write_file(out_dir .. "/summary.json", string.format(
      '{"schemaVersion":1,"status":"ok","cases":%d,"hits":%d,"caseFrames":%d,"xMin":%d,"xMax":%d,"xStep":%d,"yMin":%d,"yMax":%d,"yStep":%d,"buttons":"%s"}\n',
      #cases,
      #rows - 1,
      case_frames,
      x_min,
      x_max,
      x_step,
      y_min,
      y_max,
      y_step,
      table.concat(buttons, ",")
    ))
    emu.stop(0)
    return
  end

  restore_cpu_ram(baseline_ram)
  cpu_write(0x0300, 0x04)
  cpu_write(0x0324, current_case.y)
  cpu_write(0x0336, 0x90)
  cpu_write(0x0348, current_case.x)
  cpu_write(0x035A, 0x00)
  cpu_write(0x036C, 0x00)
  cpu_write(0x037E, 0x00)
  cpu_write(0x03D8, 0x00)
  cpu_write(0x040E, 0x11)
  cpu_write(0x0420, current_case.button == "left" and 0 or 1)
  cpu_write(0x0444, 0x00)
  cpu_write(0x0446, 0x00)
  cpu_write(0x0456, 0x00)
  cpu_write(0x047A, 0x00)
  cpu_write(0x048C, 0x00)
  cpu_write(0x04B0, 0x00)
end

if state_path ~= "" then
  emu.addMemoryCallback(function()
    if state_loaded then
      return
    end

    local savestate = read_file(state_path)
    if savestate == nil then
      write_file(out_dir .. "/summary.json", '{"schemaVersion":1,"status":"state-file-missing"}\n')
      emu.stop(93)
      return
    end

    if not emu.loadSavestate(savestate) then
      write_file(out_dir .. "/summary.json", '{"schemaVersion":1,"status":"state-load-failed"}\n')
      emu.stop(94)
      return
    end

    state_loaded = true
    state_loaded_frame = frames
  end, emu.callbackType.exec, 0xFFD0, 0xFFD0, emu.memType.nesMemory)
end

emu.addEventCallback(function()
  if current_case == nil then
    emu.setInput({}, 0)
    return
  end
  local inputs = {}
  inputs[current_case.button] = true
  emu.setInput(inputs, 0)
end, emu.eventType.inputPolled)

emu.addEventCallback(function()
  frames = frames + 1

  if not state_loaded then
    if frames > 120 then
      write_file(out_dir .. "/summary.json", '{"schemaVersion":1,"status":"state-load-timeout"}\n')
      emu.stop(95)
    end
    return
  end

  if frames < state_loaded_frame + settle_frames then
    return
  end

  if baseline_ram == nil then
    baseline_ram = capture_cpu_ram()
    setup_case(1)
    return
  end

  local state = cpu(0x03D8)
  if state == 0x09 or state == 0x0A then
    local bounds = oam_bounds()
    rows[#rows + 1] = table.concat({
      tostring(current_case_index),
      current_case.button,
      tostring(current_case.x),
      tostring(current_case.y),
      tostring(current_case_frame),
      tostring(frames),
      hex(state, 2),
      hex(cpu(0x0300), 2),
      tostring(cpu(0x0348)),
      tostring(cpu(0x035A)),
      tostring(cpu(0x0324)),
      tostring(cpu(0x0336)),
      tostring(cpu(0x0420)),
      hex(cpu(0x006D), 2),
      hex(cpu(0x006C), 2),
      hex(cpu(0x036C), 2),
      hex(cpu(0x037E), 2),
      hex(cpu(0x0468), 2),
      hex(cpu(0x04C2), 2),
      tostring(cpu(0x047A)),
      tostring(cpu(0x0456)),
      tostring(bounds.count),
      tostring(bounds.min_x),
      tostring(bounds.min_y),
      tostring(bounds.max_x),
      tostring(bounds.max_y)
    }, "\t")

    setup_case(current_case_index + 1)
    return
  end

  current_case_frame = current_case_frame + 1
  if current_case_frame >= case_frames then
    setup_case(current_case_index + 1)
  end
end, emu.eventType.endFrame)
