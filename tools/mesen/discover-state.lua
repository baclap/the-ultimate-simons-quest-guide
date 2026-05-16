if io == nil or os == nil then
  emu.stop(60)
end

local out_dir = os.getenv("CV2MAP_MESEN_OUT") or "out/mesen-state"
os.execute("mkdir -p " .. string.format("%q", out_dir))

local function describe(value, depth)
  local value_type = type(value)
  if value_type ~= "table" then
    return value_type .. "=" .. tostring(value)
  end

  if depth <= 0 then
    return "table"
  end

  local keys = {}
  for key, child in pairs(value) do
    keys[#keys + 1] = tostring(key) .. ":" .. type(child)
  end
  table.sort(keys)
  return "table{" .. table.concat(keys, ",") .. "}"
end

local state = emu.getState()
local lines = {}
for key, value in pairs(state) do
  lines[#lines + 1] = tostring(key) .. "=" .. describe(value, 1)
end
table.sort(lines)

local file = io.open(out_dir .. "/state-keys.txt", "wb")
if file == nil then
  emu.stop(61)
end
file:write(table.concat(lines, "\n"))
file:write("\n")
file:close()

emu.stop(0)

