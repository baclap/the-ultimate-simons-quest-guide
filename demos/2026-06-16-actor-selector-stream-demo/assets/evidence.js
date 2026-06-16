window.ACTOR_SELECTOR_STREAM_EVIDENCE = {
  "schemaVersion": 1,
  "generatedAt": "2026-06-16T16:11:37.439Z",
  "summary": {
    "traceFixtures": 15,
    "actorRecords": 6,
    "promotedActors": 6,
    "diagnosticActors": 0,
    "renderedSpriteStrips": 6,
    "mismatchedSelectorWrites": 0
  },
  "source": {
    "fixtureFile": "data/actor-trace-fixtures.json",
    "tracesRoot": "out/actor-traces",
    "rom": "/Users/baclap/workspace/castlevania/roms/cv2.nes",
    "method": [
      "Existing save-state traces expose the runtime actor id and CPU Y register at selector write PC $DD7D.",
      "The fixed PRG routine around $DD35-$DD86 maps that Y register back to a 3-byte ROM selector-stream record.",
      "Each selector in the record resolves through the ROM metasprite pointer tables at $AC30/$AD30.",
      "Sprite strips are rendered from ROM metasprite bytes plus captured CHR/palette memory from the same trace family."
    ]
  },
  "routine": {
    "cpuRange": "0xDD35-0xDD86",
    "selectorWritePc": "0xDD7D",
    "tablePointers": {
      "low": {
        "pointerAddress": "0xDD9E",
        "value": "0xDDA2"
      },
      "high": {
        "pointerAddress": "0xDDA0",
        "value": "0xDEA2"
      }
    },
    "tableBase": "0xDDA2",
    "bytes": [
      "0xA9",
      "0x00",
      "0x85",
      "0x95",
      "0xBD",
      "0x0E",
      "0x04",
      "0x85",
      "0x94",
      "0x0A",
      "0x26",
      "0x95",
      "0x18",
      "0x65",
      "0x94",
      "0x85",
      "0x94",
      "0xA5",
      "0x95",
      "0x69",
      "0x00",
      "0x85",
      "0x95",
      "0xF0",
      "0x0D",
      "0xAD",
      "0xA0",
      "0xDD",
      "0x85",
      "0x08",
      "0xAD",
      "0xA1",
      "0xDD",
      "0x85",
      "0x09",
      "0x4C",
      "0x65",
      "0xDD",
      "0xAD",
      "0x9E",
      "0xDD",
      "0x85",
      "0x08",
      "0xAD",
      "0x9F",
      "0xDD",
      "0x85",
      "0x09",
      "0xA4",
      "0x94",
      "0xB1",
      "0x08",
      "0xDD",
      "0xFC",
      "0x03",
      "0xB0",
      "0x05",
      "0xA9",
      "0x00",
      "0x9D",
      "0xFC",
      "0x03",
      "0xC8",
      "0xB1",
      "0x08",
      "0x18",
      "0x7D",
      "0xFC",
      "0x03",
      "0x9D",
      "0x00",
      "0x03",
      "0xC8",
      "0xB1",
      "0x08",
      "0x9D",
      "0xEA",
      "0x03",
      "0xFE",
      "0xFC",
      "0x03",
      "0x60"
    ],
    "proof": [
      "$040E,x is multiplied by 3, so each actor animation entry is a 3-byte ROM record.",
      "The pointer pair at $DD9E/$DDA0 selects the same fixed-bank record table for low/high actor index ranges.",
      "$DD7D writes the selector byte after adding the actor frame counter, then $DD80 writes the sidecar byte to $03EA,x."
    ]
  },
  "promotedActors": [
    {
      "actorId": "0x03",
      "label": "Skeleton",
      "status": "promoted",
      "note": "Runtime-proven Jova Woods enemy. Day/night HP differs in the observed traces.",
      "writes": 194,
      "selectorRecord": {
        "cpuAddress": "0xDDB1",
        "fileOffset": "0x1DDC1",
        "recordIndex": 5,
        "frameLimit": "0x01",
        "baseSelector": "0x0E",
        "sidecar": "0x10",
        "selectors": [
          "0x0E",
          "0x0F"
        ],
        "bytes": [
          "0x01",
          "0x0E",
          "0x10"
        ]
      },
      "observedSelectors": [
        "0x0E",
        "0x0F"
      ],
      "observedSelectorWrites": [
        "0x0E",
        "0x0F"
      ],
      "hpValues": [
        "0x01",
        "0x02",
        "0x0F",
        "0x1E"
      ],
      "hpByNight": [
        {
          "night": "0x00",
          "hpValues": [
            "0x01",
            "0x0F"
          ]
        },
        {
          "night": "0x01",
          "hpValues": [
            "0x02",
            "0x1E"
          ]
        }
      ],
      "attrs": [
        "0x00"
      ],
      "spritePatternBases": [
        "0x1000"
      ],
      "largeSprites": [
        "0x01"
      ],
      "samplePositions": [
        "jova-woods-day-forward:0,192",
        "jova-woods-day-forward:12,192",
        "jova-woods-day-forward:147,160",
        "jova-woods-day-forward:149,160",
        "jova-woods-day-forward:15,192",
        "jova-woods-day-forward:150,160",
        "jova-woods-day-forward:152,160",
        "jova-woods-day-forward:154,160",
        "jova-woods-day-forward:155,160",
        "jova-woods-day-forward:156,160",
        "jova-woods-day-forward:158,160",
        "jova-woods-day-forward:159,160"
      ],
      "contexts": [
        {
          "objset": "0x02",
          "area": "0x00",
          "submapRaw": "0x00",
          "submap": "0x00",
          "night": "0x00",
          "actorPointer": "0x9FE4",
          "tileSetPointer": "0x8CF4"
        },
        {
          "objset": "0x02",
          "area": "0x00",
          "submapRaw": "0x00",
          "submap": "0x00",
          "night": "0x01",
          "actorPointer": "0x9FE4",
          "tileSetPointer": "0x8CF4"
        },
        {
          "objset": "0x02",
          "area": "0x08",
          "submapRaw": "0x00",
          "submap": "0x00",
          "night": "0x00",
          "actorPointer": "0xA0D0",
          "tileSetPointer": "0x8CF4"
        },
        {
          "objset": "0x02",
          "area": "0x08",
          "submapRaw": "0x00",
          "submap": "0x00",
          "night": "0x01",
          "actorPointer": "0xA0D0",
          "tileSetPointer": "0x8CF4"
        }
      ],
      "traces": [
        {
          "id": "jova-woods-day-forward",
          "label": "Jova Woods day, walking forward",
          "yRegisters": [
            "0x10"
          ],
          "observedSelectors": [
            "0x0E",
            "0x0F"
          ],
          "firstTraceFrame": 209,
          "firstCpuWriteFrame": 239,
          "contexts": [
            {
              "objset": "0x02",
              "area": "0x00",
              "submapRaw": "0x00",
              "submap": "0x00",
              "night": "0x00",
              "actorPointer": "0x9FE4",
              "tileSetPointer": "0x8CF4"
            }
          ]
        },
        {
          "id": "jova-woods-night-forward",
          "label": "Jova Woods night, walking forward",
          "yRegisters": [
            "0x10"
          ],
          "observedSelectors": [
            "0x0E",
            "0x0F"
          ],
          "firstTraceFrame": 212,
          "firstCpuWriteFrame": 242,
          "contexts": [
            {
              "objset": "0x02",
              "area": "0x00",
              "submapRaw": "0x00",
              "submap": "0x00",
              "night": "0x01",
              "actorPointer": "0x9FE4",
              "tileSetPointer": "0x8CF4"
            }
          ]
        },
        {
          "id": "north-bridge-day-idle",
          "label": "North Bridge day idle",
          "yRegisters": [
            "0x10"
          ],
          "observedSelectors": [
            "0x0E",
            "0x0F"
          ],
          "firstTraceFrame": 10,
          "firstCpuWriteFrame": 40,
          "contexts": [
            {
              "objset": "0x02",
              "area": "0x08",
              "submapRaw": "0x00",
              "submap": "0x00",
              "night": "0x00",
              "actorPointer": "0xA0D0",
              "tileSetPointer": "0x8CF4"
            }
          ]
        },
        {
          "id": "north-bridge-night-idle",
          "label": "North Bridge night idle",
          "yRegisters": [
            "0x10"
          ],
          "observedSelectors": [
            "0x0E",
            "0x0F"
          ],
          "firstTraceFrame": 16,
          "firstCpuWriteFrame": 46,
          "contexts": [
            {
              "objset": "0x02",
              "area": "0x08",
              "submapRaw": "0x00",
              "submap": "0x00",
              "night": "0x01",
              "actorPointer": "0xA0D0",
              "tileSetPointer": "0x8CF4"
            }
          ]
        }
      ],
      "sprite": {
        "status": "rendered",
        "output": "out/actor-selector-streams/sprites/actor-03-record-ddb1.png",
        "width": 48,
        "height": 41,
        "sourceTrace": "jova-woods-day-forward",
        "baseAttr": "0x00",
        "spritePatternBase": "0x1000",
        "largeSprites": true,
        "spriteHeight": 16,
        "frames": [
          {
            "selector": "0x0E",
            "pointer": "0xB21F",
            "status": "0x04",
            "count": 4,
            "usesSharedShape": false,
            "sprites": [
              {
                "tile": "0xB1",
                "attr": "0x03",
                "xOffset": -8,
                "yOffset": -19
              },
              {
                "tile": "0xB3",
                "attr": "0x03",
                "xOffset": 0,
                "yOffset": -19
              },
              {
                "tile": "0xB5",
                "attr": "0x03",
                "xOffset": -8,
                "yOffset": -3
              },
              {
                "tile": "0xB7",
                "attr": "0x03",
                "xOffset": 0,
                "yOffset": -3
              }
            ]
          },
          {
            "selector": "0x0F",
            "pointer": "0xB22D",
            "status": "0x04",
            "count": 4,
            "usesSharedShape": false,
            "sprites": [
              {
                "tile": "0xB1",
                "attr": "0x03",
                "xOffset": -8,
                "yOffset": -18
              },
              {
                "tile": "0xB3",
                "attr": "0x03",
                "xOffset": 0,
                "yOffset": -18
              },
              {
                "tile": "0xB9",
                "attr": "0x03",
                "xOffset": -8,
                "yOffset": -3
              },
              {
                "tile": "0xBB",
                "attr": "0x03",
                "xOffset": 0,
                "yOffset": -3
              }
            ]
          }
        ]
      }
    },
    {
      "actorId": "0x05",
      "label": "Mansion actor $05",
      "status": "promoted",
      "note": "Observed in Berkeley Mansion trace; promoted only as a ROM-backed actor id, not yet guide-named.",
      "writes": 24,
      "selectorRecord": {
        "cpuAddress": "0xDDDB",
        "fileOffset": "0x1DDEB",
        "recordIndex": 19,
        "frameLimit": "0x01",
        "baseSelector": "0x35",
        "sidecar": "0x18",
        "selectors": [
          "0x35",
          "0x36"
        ],
        "bytes": [
          "0x01",
          "0x35",
          "0x18"
        ]
      },
      "observedSelectors": [
        "0x35",
        "0x36"
      ],
      "observedSelectorWrites": [
        "0x35",
        "0x36"
      ],
      "hpValues": [
        "0x02"
      ],
      "hpByNight": [
        {
          "night": "0x00",
          "hpValues": [
            "0x02"
          ]
        }
      ],
      "attrs": [
        "0x00"
      ],
      "spritePatternBases": [
        "0x1000"
      ],
      "largeSprites": [
        "0x01"
      ],
      "samplePositions": [
        "berkeley-mansion-interior-day-idle:165,32",
        "berkeley-mansion-interior-day-idle:166,32",
        "berkeley-mansion-interior-day-idle:167,32",
        "berkeley-mansion-interior-day-idle:168,32",
        "berkeley-mansion-interior-day-idle:169,32",
        "berkeley-mansion-interior-day-idle:170,32",
        "berkeley-mansion-interior-day-idle:172,32",
        "berkeley-mansion-interior-day-idle:173,32",
        "berkeley-mansion-interior-day-idle:174,32",
        "berkeley-mansion-interior-day-idle:175,32",
        "berkeley-mansion-interior-day-idle:176,32",
        "berkeley-mansion-interior-day-idle:177,32"
      ],
      "contexts": [
        {
          "objset": "0x01",
          "area": "0x07",
          "submapRaw": "0x00",
          "submap": "0x00",
          "night": "0x00",
          "actorPointer": "0x9AC4",
          "tileSetPointer": "0x8891"
        }
      ],
      "traces": [
        {
          "id": "berkeley-mansion-interior-day-idle",
          "label": "Berkeley Mansion interior day idle",
          "yRegisters": [
            "0x3A"
          ],
          "observedSelectors": [
            "0x35",
            "0x36"
          ],
          "firstTraceFrame": 17,
          "firstCpuWriteFrame": 47,
          "contexts": [
            {
              "objset": "0x01",
              "area": "0x07",
              "submapRaw": "0x00",
              "submap": "0x00",
              "night": "0x00",
              "actorPointer": "0x9AC4",
              "tileSetPointer": "0x8891"
            }
          ]
        }
      ],
      "sprite": {
        "status": "rendered",
        "output": "out/actor-selector-streams/sprites/actor-05-record-dddb.png",
        "width": 80,
        "height": 41,
        "sourceTrace": "berkeley-mansion-interior-day-idle",
        "baseAttr": "0x00",
        "spritePatternBase": "0x1000",
        "largeSprites": true,
        "spriteHeight": 16,
        "frames": [
          {
            "selector": "0x35",
            "pointer": "0xB49F",
            "status": "0x05",
            "count": 5,
            "usesSharedShape": false,
            "sprites": [
              {
                "tile": "0xAB",
                "attr": "0x03",
                "xOffset": -20,
                "yOffset": -17
              },
              {
                "tile": "0xAD",
                "attr": "0x03",
                "xOffset": -12,
                "yOffset": -17
              },
              {
                "tile": "0xA1",
                "attr": "0x03",
                "xOffset": -4,
                "yOffset": -19
              },
              {
                "tile": "0xA3",
                "attr": "0x03",
                "xOffset": 4,
                "yOffset": -19
              },
              {
                "tile": "0xA5",
                "attr": "0x03",
                "xOffset": 1,
                "yOffset": -3
              }
            ]
          },
          {
            "selector": "0x36",
            "pointer": "0xB4B0",
            "status": "0x06",
            "count": 6,
            "usesSharedShape": false,
            "sprites": [
              {
                "tile": "0xAB",
                "attr": "0x03",
                "xOffset": -16,
                "yOffset": -16
              },
              {
                "tile": "0xAD",
                "attr": "0x03",
                "xOffset": -12,
                "yOffset": -16
              },
              {
                "tile": "0xA1",
                "attr": "0x03",
                "xOffset": -4,
                "yOffset": -18
              },
              {
                "tile": "0xA3",
                "attr": "0x03",
                "xOffset": 4,
                "yOffset": -18
              },
              {
                "tile": "0xA7",
                "attr": "0x03",
                "xOffset": -4,
                "yOffset": -3
              },
              {
                "tile": "0xA9",
                "attr": "0x03",
                "xOffset": 4,
                "yOffset": -3
              }
            ]
          }
        ]
      }
    },
    {
      "actorId": "0x13",
      "label": "Werewolf",
      "status": "promoted",
      "note": "Runtime-proven Jova Woods enemy. Day/night HP differs in the observed traces.",
      "writes": 178,
      "selectorRecord": {
        "cpuAddress": "0xDDFC",
        "fileOffset": "0x1DE0C",
        "recordIndex": 30,
        "frameLimit": "0x01",
        "baseSelector": "0x65",
        "sidecar": "0x10",
        "selectors": [
          "0x65",
          "0x66"
        ],
        "bytes": [
          "0x01",
          "0x65",
          "0x10"
        ]
      },
      "observedSelectors": [
        "0x65",
        "0x66"
      ],
      "observedSelectorWrites": [
        "0x65",
        "0x66"
      ],
      "hpValues": [
        "0x02",
        "0x04"
      ],
      "hpByNight": [
        {
          "night": "0x00",
          "hpValues": [
            "0x02"
          ]
        },
        {
          "night": "0x01",
          "hpValues": [
            "0x04"
          ]
        }
      ],
      "attrs": [
        "0x00"
      ],
      "spritePatternBases": [
        "0x1000"
      ],
      "largeSprites": [
        "0x01"
      ],
      "samplePositions": [
        "jova-woods-day-forward:1,192",
        "jova-woods-day-forward:10,128",
        "jova-woods-day-forward:101,176",
        "jova-woods-day-forward:102,167",
        "jova-woods-day-forward:105,159",
        "jova-woods-day-forward:105,160",
        "jova-woods-day-forward:105,166",
        "jova-woods-day-forward:107,157",
        "jova-woods-day-forward:108,157",
        "jova-woods-day-forward:108,176",
        "jova-woods-day-forward:110,159",
        "jova-woods-day-forward:110,162"
      ],
      "contexts": [
        {
          "objset": "0x02",
          "area": "0x00",
          "submapRaw": "0x00",
          "submap": "0x00",
          "night": "0x00",
          "actorPointer": "0x9FE4",
          "tileSetPointer": "0x8CF4"
        },
        {
          "objset": "0x02",
          "area": "0x00",
          "submapRaw": "0x00",
          "submap": "0x00",
          "night": "0x01",
          "actorPointer": "0x9FE4",
          "tileSetPointer": "0x8CF4"
        }
      ],
      "traces": [
        {
          "id": "jova-woods-day-forward",
          "label": "Jova Woods day, walking forward",
          "yRegisters": [
            "0x5B"
          ],
          "observedSelectors": [
            "0x65",
            "0x66"
          ],
          "firstTraceFrame": 145,
          "firstCpuWriteFrame": 175,
          "contexts": [
            {
              "objset": "0x02",
              "area": "0x00",
              "submapRaw": "0x00",
              "submap": "0x00",
              "night": "0x00",
              "actorPointer": "0x9FE4",
              "tileSetPointer": "0x8CF4"
            }
          ]
        },
        {
          "id": "jova-woods-night-forward",
          "label": "Jova Woods night, walking forward",
          "yRegisters": [
            "0x5B"
          ],
          "observedSelectors": [
            "0x65",
            "0x66"
          ],
          "firstTraceFrame": 148,
          "firstCpuWriteFrame": 178,
          "contexts": [
            {
              "objset": "0x02",
              "area": "0x00",
              "submapRaw": "0x00",
              "submap": "0x00",
              "night": "0x01",
              "actorPointer": "0x9FE4",
              "tileSetPointer": "0x8CF4"
            }
          ]
        }
      ],
      "sprite": {
        "status": "rendered",
        "output": "out/actor-selector-streams/sprites/actor-13-record-ddfc.png",
        "width": 48,
        "height": 41,
        "sourceTrace": "jova-woods-day-forward",
        "baseAttr": "0x00",
        "spritePatternBase": "0x1000",
        "largeSprites": true,
        "spriteHeight": 16,
        "frames": [
          {
            "selector": "0x65",
            "pointer": "0xB65D",
            "status": "0x84",
            "count": 4,
            "usesSharedShape": true,
            "shapePointer": "0xB21F",
            "sprites": [
              {
                "tile": "0xA1",
                "attr": "0x03",
                "xOffset": -8,
                "yOffset": -19
              },
              {
                "tile": "0xA3",
                "attr": "0x03",
                "xOffset": 0,
                "yOffset": -19
              },
              {
                "tile": "0xA5",
                "attr": "0x03",
                "xOffset": -8,
                "yOffset": -3
              },
              {
                "tile": "0xA7",
                "attr": "0x03",
                "xOffset": 0,
                "yOffset": -3
              }
            ]
          },
          {
            "selector": "0x66",
            "pointer": "0xB664",
            "status": "0x84",
            "count": 4,
            "usesSharedShape": true,
            "shapePointer": "0xB21F",
            "sprites": [
              {
                "tile": "0xA9",
                "attr": "0x03",
                "xOffset": -8,
                "yOffset": -19
              },
              {
                "tile": "0xAB",
                "attr": "0x03",
                "xOffset": 0,
                "yOffset": -19
              },
              {
                "tile": "0xAD",
                "attr": "0x03",
                "xOffset": -8,
                "yOffset": -3
              },
              {
                "tile": "0xAF",
                "attr": "0x03",
                "xOffset": 0,
                "yOffset": -3
              }
            ]
          }
        ]
      }
    },
    {
      "actorId": "0x17",
      "label": "Zombie",
      "status": "promoted",
      "note": "Runtime-proven Jova town night enemy.",
      "writes": 123,
      "selectorRecord": {
        "cpuAddress": "0xDE47",
        "fileOffset": "0x1DE57",
        "recordIndex": 55,
        "frameLimit": "0x01",
        "baseSelector": "0x3F",
        "sidecar": "0x10",
        "selectors": [
          "0x3F",
          "0x40"
        ],
        "bytes": [
          "0x01",
          "0x3F",
          "0x10"
        ]
      },
      "observedSelectors": [
        "0x3F",
        "0x40"
      ],
      "observedSelectorWrites": [
        "0x3F",
        "0x40"
      ],
      "hpValues": [
        "0x02"
      ],
      "hpByNight": [
        {
          "night": "0x01",
          "hpValues": [
            "0x02"
          ]
        }
      ],
      "attrs": [
        "0x00"
      ],
      "spritePatternBases": [
        "0x1000"
      ],
      "largeSprites": [
        "0x01"
      ],
      "samplePositions": [
        "jova-town-night-forward:0,118",
        "jova-town-night-forward:0,123",
        "jova-town-night-forward:1,118",
        "jova-town-night-forward:1,120",
        "jova-town-night-forward:10,118",
        "jova-town-night-forward:10,120",
        "jova-town-night-forward:10,246",
        "jova-town-night-forward:102,120",
        "jova-town-night-forward:106,216",
        "jova-town-night-forward:106,246",
        "jova-town-night-forward:108,123",
        "jova-town-night-forward:108,216"
      ],
      "contexts": [
        {
          "objset": "0x00",
          "area": "0x00",
          "submapRaw": "0x80",
          "submap": "0x00",
          "night": "0x01",
          "actorPointer": "0x90AC",
          "tileSetPointer": "0x841D"
        }
      ],
      "traces": [
        {
          "id": "jova-town-night-forward",
          "label": "Jova town night, walking forward",
          "yRegisters": [
            "0xA6"
          ],
          "observedSelectors": [
            "0x3F",
            "0x40"
          ],
          "firstTraceFrame": 74,
          "firstCpuWriteFrame": 104,
          "contexts": [
            {
              "objset": "0x00",
              "area": "0x00",
              "submapRaw": "0x80",
              "submap": "0x00",
              "night": "0x01",
              "actorPointer": "0x90AC",
              "tileSetPointer": "0x841D"
            }
          ]
        }
      ],
      "sprite": {
        "status": "rendered",
        "output": "out/actor-selector-streams/sprites/actor-17-record-de47.png",
        "width": 48,
        "height": 41,
        "sourceTrace": "jova-town-night-forward",
        "baseAttr": "0x00",
        "spritePatternBase": "0x1000",
        "largeSprites": true,
        "spriteHeight": 16,
        "frames": [
          {
            "selector": "0x3F",
            "pointer": "0xB3E6",
            "status": "0x84",
            "count": 4,
            "usesSharedShape": true,
            "shapePointer": "0xB41F",
            "sprites": [
              {
                "tile": "0xD1",
                "attr": "0x02",
                "xOffset": -8,
                "yOffset": -19
              },
              {
                "tile": "0xD3",
                "attr": "0x02",
                "xOffset": 0,
                "yOffset": -19
              },
              {
                "tile": "0xD5",
                "attr": "0x02",
                "xOffset": -8,
                "yOffset": -3
              },
              {
                "tile": "0xD7",
                "attr": "0x02",
                "xOffset": 0,
                "yOffset": -3
              }
            ]
          },
          {
            "selector": "0x40",
            "pointer": "0xB3ED",
            "status": "0x04",
            "count": 4,
            "usesSharedShape": false,
            "sprites": [
              {
                "tile": "0xD9",
                "attr": "0x02",
                "xOffset": -8,
                "yOffset": -18
              },
              {
                "tile": "0xDB",
                "attr": "0x02",
                "xOffset": 0,
                "yOffset": -18
              },
              {
                "tile": "0xD5",
                "attr": "0x02",
                "xOffset": -8,
                "yOffset": -3
              },
              {
                "tile": "0xD7",
                "attr": "0x02",
                "xOffset": 0,
                "yOffset": -3
              }
            ]
          }
        ]
      }
    },
    {
      "actorId": "0x38",
      "label": "Cemetery actor $38",
      "status": "promoted",
      "note": "Observed cemetery trace class outside the Jova-to-first-mansion slice.",
      "writes": 96,
      "selectorRecord": {
        "cpuAddress": "0xDDE7",
        "fileOffset": "0x1DDF7",
        "recordIndex": 23,
        "frameLimit": "0x01",
        "baseSelector": "0x8E",
        "sidecar": "0x18",
        "selectors": [
          "0x8E",
          "0x8F"
        ],
        "bytes": [
          "0x01",
          "0x8E",
          "0x18"
        ]
      },
      "observedSelectors": [
        "0x8E",
        "0x8F"
      ],
      "observedSelectorWrites": [
        "0x8E",
        "0x8F"
      ],
      "hpValues": [
        "0x08"
      ],
      "hpByNight": [
        {
          "night": "0x00",
          "hpValues": [
            "0x08"
          ]
        },
        {
          "night": "0x01",
          "hpValues": [
            "0x08"
          ]
        }
      ],
      "attrs": [
        "0x00"
      ],
      "spritePatternBases": [
        "0x1000"
      ],
      "largeSprites": [
        "0x01"
      ],
      "samplePositions": [
        "camilla-cemetery-day-idle:128,168",
        "camilla-cemetery-day-idle:128,170",
        "camilla-cemetery-day-idle:128,171",
        "camilla-cemetery-day-idle:128,173",
        "camilla-cemetery-day-idle:192,168",
        "camilla-cemetery-day-idle:192,170",
        "camilla-cemetery-day-idle:192,171",
        "camilla-cemetery-day-idle:192,173",
        "camilla-cemetery-night-idle:128,168",
        "camilla-cemetery-night-idle:128,169",
        "camilla-cemetery-night-idle:128,170",
        "camilla-cemetery-night-idle:128,171"
      ],
      "contexts": [
        {
          "objset": "0x03",
          "area": "0x00",
          "submapRaw": "0x00",
          "submap": "0x00",
          "night": "0x00",
          "actorPointer": "0xAF22",
          "tileSetPointer": "0x918A"
        },
        {
          "objset": "0x03",
          "area": "0x00",
          "submapRaw": "0x00",
          "submap": "0x00",
          "night": "0x01",
          "actorPointer": "0xAF22",
          "tileSetPointer": "0x918A"
        }
      ],
      "traces": [
        {
          "id": "camilla-cemetery-day-idle",
          "label": "Camilla Cemetery day idle",
          "yRegisters": [
            "0x46"
          ],
          "observedSelectors": [
            "0x8E",
            "0x8F"
          ],
          "firstTraceFrame": 23,
          "firstCpuWriteFrame": 53,
          "contexts": [
            {
              "objset": "0x03",
              "area": "0x00",
              "submapRaw": "0x00",
              "submap": "0x00",
              "night": "0x00",
              "actorPointer": "0xAF22",
              "tileSetPointer": "0x918A"
            }
          ]
        },
        {
          "id": "camilla-cemetery-night-idle",
          "label": "Camilla Cemetery night idle",
          "yRegisters": [
            "0x46"
          ],
          "observedSelectors": [
            "0x8E",
            "0x8F"
          ],
          "firstTraceFrame": 0,
          "firstCpuWriteFrame": 30,
          "contexts": [
            {
              "objset": "0x03",
              "area": "0x00",
              "submapRaw": "0x00",
              "submap": "0x00",
              "night": "0x01",
              "actorPointer": "0xAF22",
              "tileSetPointer": "0x918A"
            }
          ]
        }
      ],
      "sprite": {
        "status": "rendered",
        "output": "out/actor-selector-streams/sprites/actor-38-record-dde7.png",
        "width": 48,
        "height": 38,
        "sourceTrace": "camilla-cemetery-day-idle",
        "baseAttr": "0x00",
        "spritePatternBase": "0x1000",
        "largeSprites": true,
        "spriteHeight": 16,
        "frames": [
          {
            "selector": "0x8E",
            "pointer": "0xB7FE",
            "status": "0x02",
            "count": 2,
            "usesSharedShape": false,
            "sprites": [
              {
                "tile": "0x89",
                "attr": "0x02",
                "xOffset": -8,
                "yOffset": 16
              },
              {
                "tile": "0x9F",
                "attr": "0x02",
                "xOffset": 0,
                "yOffset": 16
              }
            ]
          },
          {
            "selector": "0x8F",
            "pointer": "0xB806",
            "status": "0x82",
            "count": 2,
            "usesSharedShape": true,
            "shapePointer": "0xB7FE",
            "sprites": [
              {
                "tile": "0xFB",
                "attr": "0x02",
                "xOffset": -8,
                "yOffset": 16
              },
              {
                "tile": "0xFD",
                "attr": "0x02",
                "xOffset": 0,
                "yOffset": 16
              }
            ]
          }
        ]
      }
    },
    {
      "actorId": "0x3A",
      "label": "Graveyard actor $3A",
      "status": "promoted",
      "note": "Observed graveyard trace class outside the Jova-to-first-mansion slice.",
      "writes": 48,
      "selectorRecord": {
        "cpuAddress": "0xDE41",
        "fileOffset": "0x1DE51",
        "recordIndex": 53,
        "frameLimit": "0x01",
        "baseSelector": "0xBC",
        "sidecar": "0x10",
        "selectors": [
          "0xBC",
          "0xBD"
        ],
        "bytes": [
          "0x01",
          "0xBC",
          "0x10"
        ]
      },
      "observedSelectors": [
        "0xBC",
        "0xBD"
      ],
      "observedSelectorWrites": [
        "0xBC",
        "0xBD"
      ],
      "hpValues": [
        "0x0F"
      ],
      "hpByNight": [
        {
          "night": "0x01",
          "hpValues": [
            "0x0F"
          ]
        }
      ],
      "attrs": [
        "0x00"
      ],
      "spritePatternBases": [
        "0x1000"
      ],
      "largeSprites": [
        "0x01"
      ],
      "samplePositions": [
        "vrad-graveyard-night-idle:189,192",
        "vrad-graveyard-night-idle:190,192",
        "vrad-graveyard-night-idle:191,192",
        "vrad-graveyard-night-idle:192,192",
        "vrad-graveyard-night-idle:193,192",
        "vrad-graveyard-night-idle:194,192",
        "vrad-graveyard-night-idle:195,192",
        "vrad-graveyard-night-idle:196,192",
        "vrad-graveyard-night-idle:197,192",
        "vrad-graveyard-night-idle:198,192",
        "vrad-graveyard-night-idle:199,192",
        "vrad-graveyard-night-idle:200,192"
      ],
      "contexts": [
        {
          "objset": "0x04",
          "area": "0x03",
          "submapRaw": "0x00",
          "submap": "0x00",
          "night": "0x01",
          "actorPointer": "0xA8D3",
          "tileSetPointer": "0x9620"
        }
      ],
      "traces": [
        {
          "id": "vrad-graveyard-night-idle",
          "label": "Vrad Graveyard night idle",
          "yRegisters": [
            "0xA0"
          ],
          "observedSelectors": [
            "0xBC",
            "0xBD"
          ],
          "firstTraceFrame": 0,
          "firstCpuWriteFrame": 30,
          "contexts": [
            {
              "objset": "0x04",
              "area": "0x03",
              "submapRaw": "0x00",
              "submap": "0x00",
              "night": "0x01",
              "actorPointer": "0xA8D3",
              "tileSetPointer": "0x9620"
            }
          ]
        }
      ],
      "sprite": {
        "status": "rendered",
        "output": "out/actor-selector-streams/sprites/actor-3a-record-de41.png",
        "width": 66,
        "height": 57,
        "sourceTrace": "vrad-graveyard-night-idle",
        "baseAttr": "0x00",
        "spritePatternBase": "0x1000",
        "largeSprites": true,
        "spriteHeight": 16,
        "frames": [
          {
            "selector": "0xBC",
            "pointer": "0xB717",
            "status": "0x06",
            "count": 6,
            "usesSharedShape": false,
            "sprites": [
              {
                "tile": "0xE5",
                "attr": "0x03",
                "xOffset": -8,
                "yOffset": -19
              },
              {
                "tile": "0xE7",
                "attr": "0x03",
                "xOffset": 0,
                "yOffset": -19
              },
              {
                "tile": "0xE9",
                "attr": "0x03",
                "xOffset": -8,
                "yOffset": -3
              },
              {
                "tile": "0xEB",
                "attr": "0x03",
                "xOffset": 0,
                "yOffset": -3
              },
              {
                "tile": "0xE1",
                "attr": "0x03",
                "xOffset": -3,
                "yOffset": -35
              },
              {
                "tile": "0xE3",
                "attr": "0x03",
                "xOffset": -16,
                "yOffset": -19
              }
            ]
          },
          {
            "selector": "0xBD",
            "pointer": "0xB72B",
            "status": "0x06",
            "count": 6,
            "usesSharedShape": false,
            "sprites": [
              {
                "tile": "0xE5",
                "attr": "0x03",
                "xOffset": -9,
                "yOffset": -18
              },
              {
                "tile": "0xE7",
                "attr": "0x03",
                "xOffset": -1,
                "yOffset": -18
              },
              {
                "tile": "0xED",
                "attr": "0x03",
                "xOffset": -8,
                "yOffset": -3
              },
              {
                "tile": "0xEF",
                "attr": "0x03",
                "xOffset": 0,
                "yOffset": -3
              },
              {
                "tile": "0xE1",
                "attr": "0x03",
                "xOffset": -4,
                "yOffset": -34
              },
              {
                "tile": "0xE3",
                "attr": "0x03",
                "xOffset": -17,
                "yOffset": -18
              }
            ]
          }
        ]
      }
    }
  ],
  "diagnosticActors": []
};
