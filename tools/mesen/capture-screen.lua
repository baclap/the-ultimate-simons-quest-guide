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
    emu.stop(40)
  end
end

local function write_file(path, data)
  local file = io.open(path, "wb")
  if file == nil then
    emu.stop(41)
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
    emu.stop(42)
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

ensure_io()

local out_dir = os.getenv("CV2MAP_MESEN_OUT") or "out/captures/screen"
local press_start_at = getenv_number("CV2MAP_PRESS_START_AT", 45)
local press_start_frames = getenv_number("CV2MAP_PRESS_START_FRAMES", 12)
local capture_frame = getenv_number("CV2MAP_CAPTURE_FRAME", 360)
local capture_name = os.getenv("CV2MAP_CAPTURE_NAME") or "screen"
local capture_location = os.getenv("CV2MAP_CAPTURE_LOCATION") or ""
local capture_variant = os.getenv("CV2MAP_CAPTURE_VARIANT") or "unknown"
local capture_access = os.getenv("CV2MAP_CAPTURE_ACCESS") or "unknown"
local start_presses_raw = os.getenv("CV2MAP_START_PRESSES") or ""
local inputs_raw = os.getenv("CV2MAP_INPUTS") or ""
local state_path = os.getenv("CV2MAP_STATE_PATH") or ""
local settle_frames = getenv_number("CV2MAP_SETTLE_FRAMES", 30)
local state_loaded = state_path == ""
local state_loaded_frame = 0

local function parse_start_presses(raw, use_default)
  local presses = {}
  if raw ~= "" then
    for start_frame, duration in raw:gmatch("(%d+):(%d+)") do
      presses[#presses + 1] = {
        start_frame = tonumber(start_frame),
        end_frame = tonumber(start_frame) + tonumber(duration)
      }
    end
  end

  if #presses == 0 and use_default then
    presses[1] = {
      start_frame = press_start_at,
      end_frame = press_start_at + press_start_frames
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

os.execute("mkdir -p " .. string.format("%q", out_dir))

if state_path ~= "" then
  emu.addMemoryCallback(function()
    if state_loaded then
      return
    end

    local savestate = read_file(state_path)
    if savestate == nil then
      emu.stop(43)
      return
    end

    if not emu.loadSavestate(savestate) then
      emu.stop(44)
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
      emu.stop(45)
    end
    return
  end

  if state_path == "" and frames < capture_frame then
    return
  end

  if state_path ~= "" and frames < state_loaded_frame + settle_frames then
    return
  end

  local rom = emu.getRomInfo()
  local size = emu.getScreenSize()
  local screenshot = emu.takeScreenshot()
  local full_state = emu.getState()
  local ppu_x_scroll = full_state["ppu.xScroll"] or 0
  local ppu_video_ram_addr = full_state["ppu.videoRamAddr"] or 0
  local ppu_tmp_video_ram_addr = full_state["ppu.tmpVideoRamAddr"] or 0
  local ppu_bg_pattern_addr = full_state["ppu.control.backgroundPatternAddr"] or 0

  write_file(out_dir .. "/screenshot.png", screenshot)
  dump_memory(out_dir .. "/cpu-0000-07ff.bin", 0x0000, 0x0800, emu.memType.nesDebug)
  dump_memory(out_dir .. "/ppu-0000-1fff-patterns.bin", 0x0000, 0x2000, emu.memType.nesPpuDebug)
  dump_memory(out_dir .. "/ppu-2000-2fff-nametables.bin", 0x2000, 0x1000, emu.memType.nesPpuDebug)
  dump_memory(out_dir .. "/ppu-3f00-3f1f-palettes.bin", 0x3F00, 0x20, emu.memType.nesPpuDebug)
  dump_memory(out_dir .. "/oam-0000-00ff-sprites.bin", 0x0000, 0x100, emu.memType.nesSpriteRam)

  write_file(out_dir .. "/state.json", string.format(
    '{"name":"%s","location":"%s","variant":"%s","access":"%s","frames":%d,"pressStartAt":%d,"pressStartFrames":%d,"startPresses":"%s","inputs":"%s","statePath":"%s","stateLoadedFrame":%d,"settleFrames":%d,"captureFrame":%d,"romName":"%s","romPath":"%s","screenWidth":%d,"screenHeight":%d,"cpu2000":%d,"cpu2001":%d,"cpu2002":%d,"ppuPalette0":%d,"ppuNametable0":%d,"ppuXScroll":%d,"ppuVideoRamAddr":%d,"ppuTmpVideoRamAddr":%d,"ppuBackgroundPatternAddr":%d,"ppuSpritePatternAddr":%d,"ppuLargeSprites":%s,"ppuSpritesEnabled":%s,"ppuSpriteMask":%s,"ppuSpriteRamAddr":%d}\n',
    json_escape(capture_name),
    json_escape(capture_location),
    json_escape(capture_variant),
    json_escape(capture_access),
    frames,
    press_start_at,
    press_start_frames,
    json_escape(start_presses_raw),
    json_escape(inputs_raw),
    json_escape(state_path),
    state_loaded_frame,
    settle_frames,
    capture_frame,
    json_escape(rom.name or ""),
    json_escape(rom.path or ""),
    size.width or 0,
    size.height or 0,
    emu.read(0x2000, emu.memType.nesDebug) or -1,
    emu.read(0x2001, emu.memType.nesDebug) or -1,
    emu.read(0x2002, emu.memType.nesDebug) or -1,
    emu.read(0x3F00, emu.memType.nesPpuDebug) or -1,
    emu.read(0x2000, emu.memType.nesPpuDebug) or -1,
    ppu_x_scroll,
    ppu_video_ram_addr,
    ppu_tmp_video_ram_addr,
    ppu_bg_pattern_addr,
    full_state["ppu.control.spritePatternAddr"] or 0,
    tostring(full_state["ppu.control.largeSprites"] or false),
    tostring(full_state["ppu.mask.spritesEnabled"] or false),
    tostring(full_state["ppu.mask.spriteMask"] or false),
    full_state["ppu.spriteRamAddr"] or 0
  ))

  emu.stop(0)
end, emu.eventType.endFrame)
