if io == nil or os == nil then
  emu.stop(80)
end

local out_dir = os.getenv("CV2MAP_MESEN_OUT") or "out/mesen-callback-types"
os.execute("mkdir -p " .. string.format("%q", out_dir))

local function dump_table(name, value)
  local lines = {}
  for key, child in pairs(value) do
    lines[#lines + 1] = tostring(key) .. "=" .. tostring(child)
  end
  table.sort(lines)

  local file = io.open(out_dir .. "/" .. name .. ".txt", "wb")
  if file == nil then
    emu.stop(81)
  end
  file:write(table.concat(lines, "\n"))
  file:write("\n")
  file:close()
end

dump_table("callback-types", emu.callbackType)
dump_table("event-types", emu.eventType)

emu.stop(0)
