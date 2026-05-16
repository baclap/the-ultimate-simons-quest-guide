local frames = 0

local function write_file(path, data)
  local file = io.open(path, "wb")
  if file == nil then
    emu.stop(31)
  end
  file:write(data)
  file:close()
end

if io == nil or os == nil then
  emu.stop(30)
end

local out_dir = os.getenv("CV2MAP_MESEN_OUT") or "out/mesen-smoke"
os.execute("mkdir -p " .. string.format("%q", out_dir))

emu.addEventCallback(function()
  frames = frames + 1
  if frames < 30 then
    return
  end

  local rom = emu.getRomInfo()
  local size = emu.getScreenSize()
  local screenshot = emu.takeScreenshot()
  local ppu2000 = emu.read(0x2000, emu.memType.nesDebug)
  local palette0 = emu.read(0x3F00, emu.memType.nesPpuDebug)
  local nametable0 = emu.read(0x2000, emu.memType.nesPpuDebug)

  write_file(out_dir .. "/screenshot.png", screenshot)
  write_file(out_dir .. "/state.json", string.format(
    '{"frames":%d,"romName":"%s","romPath":"%s","screenWidth":%d,"screenHeight":%d,"cpu2000":%d,"ppuPalette0":%d,"ppuNametable0":%d}\n',
    frames,
    rom.name or "",
    rom.path or "",
    size.width or 0,
    size.height or 0,
    ppu2000 or -1,
    palette0 or -1,
    nametable0 or -1
  ))

  emu.stop(0)
end, emu.eventType.endFrame)
