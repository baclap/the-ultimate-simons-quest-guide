if io == nil or os == nil then
  emu.stop(21)
end

local out_dir = os.getenv("CV2MAP_MESEN_OUT") or "out/mesen-smoke"
local out_path = out_dir .. "/file-output.txt"

os.execute("mkdir -p " .. string.format("%q", out_dir))

local file = io.open(out_path, "wb")
if file == nil then
  emu.stop(22)
end

file:write("mesen lua file output ok\n")
file:close()

emu.stop(0)
