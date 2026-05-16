if io == nil or os == nil then
  emu.stop(70)
end

local out_dir = os.getenv("CV2MAP_MESEN_OUT") or "out/mesen-memtypes"
os.execute("mkdir -p " .. string.format("%q", out_dir))

local lines = {}
for key, value in pairs(emu.memType) do
  lines[#lines + 1] = tostring(key) .. "=" .. tostring(value)
end
table.sort(lines)

local file = io.open(out_dir .. "/mem-types.txt", "wb")
if file == nil then
  emu.stop(71)
end

file:write(table.concat(lines, "\n"))
file:write("\n")
file:close()

emu.stop(0)
