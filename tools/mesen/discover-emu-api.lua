if io == nil or os == nil then
  emu.stop(80)
end

local out_dir = os.getenv("CV2MAP_MESEN_OUT") or "out/mesen-emu-api"
os.execute("mkdir -p " .. string.format("%q", out_dir))

local keys = {}
for key, value in pairs(emu) do
  keys[#keys + 1] = tostring(key) .. "=" .. type(value)
end
table.sort(keys)

local file = io.open(out_dir .. "/emu-api.txt", "wb")
if file == nil then
  emu.stop(81)
end

file:write(table.concat(keys, "\n"))
file:write("\n")
file:close()

emu.stop(0)
