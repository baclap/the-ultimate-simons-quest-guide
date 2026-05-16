if io == nil or os == nil then
  emu.stop(50)
end

local out_dir = os.getenv("CV2MAP_MESEN_OUT") or "out/mesen-input"
os.execute("mkdir -p " .. string.format("%q", out_dir))

local input = emu.getInput(0)
local names = {}
for key, value in pairs(input) do
  names[#names + 1] = string.format("%s=%s", tostring(key), tostring(value))
end
table.sort(names)

local file = io.open(out_dir .. "/input.txt", "wb")
if file == nil then
  emu.stop(51)
end
file:write(table.concat(names, "\n"))
file:write("\n")
file:close()

emu.stop(0)

