window.RUNTIME_CONTEXT_MAP = {
  "source": "rom-special-screen-record-alias",
  "constants": {
    "areaTablePointers": "0xF7AB",
    "screenRecordPointersOffset": "0x09",
    "maxSpecialAliasDistance": "0x20"
  },
  "candidates": 55,
  "specialScreenRecords": [
    {
      "name": "Veros Woods - Part 2",
      "context": {
        "objset": "0x02",
        "area": "0x00",
        "submap": "0x03"
      },
      "areaRecordAddress": "0xA149",
      "screenRecordPointerAddress": "0xA158",
      "screenRecordAddress": "0xA1A3",
      "firstByte": "0xFE",
      "secondByte": "0x06",
      "specialMarker": "0xFE"
    },
    {
      "name": "Dabi's Path - Part 1",
      "context": {
        "objset": "0x02",
        "area": "0x03",
        "submap": "0x00"
      },
      "areaRecordAddress": "0xA6A5",
      "screenRecordPointerAddress": "0xA6AE",
      "screenRecordAddress": "0xA6D1",
      "firstByte": "0xFD",
      "secondByte": "0x13",
      "specialMarker": "0xFD"
    },
    {
      "name": "Aljiba Woods - Part 2",
      "context": {
        "objset": "0x02",
        "area": "0x03",
        "submap": "0x03"
      },
      "areaRecordAddress": "0xA6A5",
      "screenRecordPointerAddress": "0xA6B4",
      "screenRecordAddress": "0xA6D8",
      "firstByte": "0xFE",
      "secondByte": "0x09",
      "specialMarker": "0xFE"
    },
    {
      "name": "Dora Woods - Part 2",
      "context": {
        "objset": "0x02",
        "area": "0x08",
        "submap": "0x02"
      },
      "areaRecordAddress": "0xA17F",
      "screenRecordPointerAddress": "0xA18C",
      "screenRecordAddress": "0xA1AB",
      "firstByte": "0xFE",
      "secondByte": "0x0D",
      "specialMarker": "0xFE"
    },
    {
      "name": "Sadam Woods - Part 2",
      "context": {
        "objset": "0x03",
        "area": "0x02",
        "submap": "0x00"
      },
      "areaRecordAddress": "0xB38A",
      "screenRecordPointerAddress": "0xB393",
      "screenRecordAddress": "0xB3A5",
      "firstByte": "0xFD",
      "secondByte": "0x06",
      "specialMarker": "0xFD"
    }
  ],
  "aliases": [
    {
      "key": "2:8:2",
      "target": {
        "context": {
          "objset": "0x02",
          "area": "0x08",
          "submap": "0x02"
        },
        "name": "Dora Woods - Part 2",
        "screenRecordAddress": "0xA1AB",
        "screenRecordPointerAddress": "0xA18C"
      },
      "source": {
        "context": {
          "objset": "0x02",
          "area": "0x00",
          "submap": "0x03"
        },
        "name": "Veros Woods - Part 2",
        "screenRecordAddress": "0xA1A3",
        "screenRecordPointerAddress": "0xA158"
      },
      "marker": "0xFE",
      "byteOffset": 8,
      "resolvedContext": {
        "objset": "0x02",
        "area": "0x00",
        "submap": "0x03",
        "submapRaw": "0x83",
        "submapFlags": "0x80"
      },
      "note": "Dora Woods - Part 2 starts at screen record $A1AB inside the same-marker special stream for Veros Woods - Part 2 at $A1A3."
    }
  ]
};
