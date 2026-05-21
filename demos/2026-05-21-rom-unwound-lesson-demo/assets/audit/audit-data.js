window.RENDER_RECIPE_AUDIT = {
  "schemaVersion": 1,
  "source": {
    "fixtureFile": "data/render-recipe-fixtures.json",
    "note": "Save states are validation probes. Captured PPU/CPU evidence is used to audit ROM-derived render recipes, not as final map source art."
  },
  "summary": {
    "fixtures": 23,
    "audited": 23,
    "missingCaptureFiles": 0,
    "chrExact": 23,
    "paletteSelectorExact": 23,
    "paletteTransferMatched": 23,
    "recipeEvidencePresent": 23,
    "deferred": 0
  },
  "fixtures": [
    {
      "id": "jova-town-day",
      "label": "Jova town exterior, day",
      "location": "Jova",
      "variant": "day",
      "access": "outdoor",
      "reason": "Baseline town exterior day palette and CHR evidence.",
      "capture": "out/captures/jova-day",
      "status": "audited",
      "requiredFiles": [
        {
          "file": "screenshot.png",
          "exists": true
        },
        {
          "file": "cpu-0000-07ff.bin",
          "exists": true
        },
        {
          "file": "ppu-0000-1fff-patterns.bin",
          "exists": true
        },
        {
          "file": "ppu-2000-2fff-nametables.bin",
          "exists": true
        },
        {
          "file": "ppu-3f00-3f1f-palettes.bin",
          "exists": true
        },
        {
          "file": "oam-0000-00ff-sprites.bin",
          "exists": true
        },
        {
          "file": "state.json",
          "exists": true
        }
      ],
      "expectedContext": {
        "status": "matches",
        "expected": [
          {
            "objset": "0x00",
            "area": "0x00",
            "submap": "0x00"
          }
        ]
      },
      "atlasContext": {
        "objset": "0x00",
        "area": "0x00",
        "submap": "0x00"
      },
      "atlasCandidate": {
        "id": "obj00-area00-sub00-town-of-jova",
        "name": "Town of Jova",
        "image": "images/obj00-area00-sub00-town-of-jova.png"
      },
      "live": {
        "runtimeContext": {
          "objset": "0x00",
          "area": "0x00",
          "submap": "0x00",
          "submapRaw": "0x00",
          "submapFlags": "0x00",
          "actorPointer": "0x90AC",
          "tileSetPointer": "0x841D"
        },
        "ppu": {
          "backgroundPaletteBytes": [
            "0x0F",
            "0x00",
            "0x10",
            "0x05",
            "0x0F",
            "0x00",
            "0x16",
            "0x10",
            "0x0F",
            "0x00",
            "0x10",
            "0x22",
            "0x0F",
            "0x11",
            "0x20",
            "0x15"
          ],
          "fullPaletteBytes": [
            "0x0F",
            "0x00",
            "0x10",
            "0x05",
            "0x0F",
            "0x00",
            "0x16",
            "0x10",
            "0x0F",
            "0x00",
            "0x10",
            "0x22",
            "0x0F",
            "0x11",
            "0x20",
            "0x15",
            "0x0F",
            "0x0F",
            "0x16",
            "0x20",
            "0x0F",
            "0x27",
            "0x20",
            "0x16",
            "0x0F",
            "0x17",
            "0x20",
            "0x0F",
            "0x0F",
            "0x00",
            "0x20",
            "0x0F"
          ],
          "backgroundPatternAddress": "0x0000",
          "xScroll": 0,
          "videoRamAddress": "0x1882",
          "tmpVideoRamAddress": "0x1080"
        }
      },
      "chr": {
        "status": "exact-match",
        "banks": [
          {
            "slot": 0,
            "ppuAddress": "0x0000",
            "sha1": "6e0d98e3d50b61e7a0a275c948209bd93018fc47",
            "matches": [
              {
                "bank": 0,
                "bankHex": "0x00"
              }
            ],
            "status": "exact-match"
          },
          {
            "slot": 1,
            "ppuAddress": "0x1000",
            "sha1": "080f054ffbfc6bd18157d9ddebad07d98a649fd3",
            "matches": [
              {
                "bank": 1,
                "bankHex": "0x01"
              }
            ],
            "status": "exact-match"
          }
        ]
      },
      "palette": {
        "selector": {
          "status": "exact-match",
          "variant": "day",
          "runtimeContext": {
            "objset": "0x00",
            "area": "0x00",
            "submap": "0x00"
          },
          "paletteTableAddress": "0x8072",
          "indexListPointerAddress": "0x8072",
          "indexListAddress": "0xFA3E",
          "indexOffset": 0,
          "transferId": "0x16",
          "auxiliaryTransferId": "0x2E",
          "transferPointerAddress": "0x88C1",
          "paletteAddress": "0x9EA2",
          "paletteBank": 4,
          "bytes": [
            "0x0F",
            "0x00",
            "0x10",
            "0x05",
            "0x0F",
            "0x00",
            "0x16",
            "0x10",
            "0x0F",
            "0x00",
            "0x10",
            "0x22",
            "0x0F",
            "0x11",
            "0x20",
            "0x15"
          ],
          "rawPalette": true
        },
        "transferMatches": [
          {
            "transferId": "0x16",
            "transferPointerAddress": "0x88C1",
            "paletteAddress": "0x9EA2",
            "paletteBank": 4,
            "bytes": [
              "0x0F",
              "0x00",
              "0x10",
              "0x05",
              "0x0F",
              "0x00",
              "0x16",
              "0x10",
              "0x0F",
              "0x00",
              "0x10",
              "0x22",
              "0x0F",
              "0x11",
              "0x20",
              "0x15"
            ]
          }
        ],
        "status": "selector-exact"
      },
      "romContext": {
        "status": "resolved",
        "backgroundContext": {
          "input": {
            "objset": 0,
            "objsetHex": "0x00",
            "area": 0,
            "areaHex": "0x00",
            "submap": 0,
            "submapHex": "0x00"
          },
          "tables": {
            "areaTable": {
              "pointerTableAddress": "0xF7AB",
              "pointerAddress": "0xF7AB",
              "address": "0x8042",
              "bank": 2
            },
            "areaRecord": {
              "pointerAddress": "0x8042",
              "address": "0xF9FF"
            },
            "screenRecord": {
              "pointerAddress": "0xFA08",
              "address": "0xFA3A",
              "firstBytes": [
                "0x03",
                "0x04",
                "0xFE",
                "0xFF",
                "0x16",
                "0x2E",
                "0x19",
                "0x2E"
              ],
              "layoutIndex": 3,
              "layoutIndexHex": "0x03"
            },
            "layoutTable": {
              "pointerTableAddress": "0xF7FB",
              "pointerAddress": "0xF7FB",
              "address": "0x80D3",
              "bank": 2
            },
            "layoutHeader": {
              "pointerAddress": "0x80DF",
              "address": "0xFA86",
              "secondaryAddress": "0xFA50"
            },
            "tileSet": {
              "pointerTableAddress": "0xF7D1",
              "pointerAddress": "0xF7D1",
              "address": "0x841D",
              "bank": 4,
              "auxiliaryAddress": "0xF7E9"
            }
          },
          "derivedDescriptorFields": {
            "layoutBank": 2,
            "layoutHeaderAddress": "0xFA86",
            "tileBank": 4,
            "tileSetAddress": "0x841D"
          }
        }
      },
      "evidenceStatus": {
        "runtimeContext": "matches",
        "chr": "exact-match",
        "palette": "exact-match",
        "renderRecipe": "recipe-evidence-present"
      }
    },
    {
      "id": "jova-town-night",
      "label": "Jova town exterior, night",
      "location": "Jova",
      "variant": "night",
      "access": "outdoor",
      "reason": "Town exterior night palette probe.",
      "capture": "out/captures/jova-town-night",
      "state": "out/states/jova-town-night.mss",
      "status": "audited",
      "requiredFiles": [
        {
          "file": "screenshot.png",
          "exists": true
        },
        {
          "file": "cpu-0000-07ff.bin",
          "exists": true
        },
        {
          "file": "ppu-0000-1fff-patterns.bin",
          "exists": true
        },
        {
          "file": "ppu-2000-2fff-nametables.bin",
          "exists": true
        },
        {
          "file": "ppu-3f00-3f1f-palettes.bin",
          "exists": true
        },
        {
          "file": "oam-0000-00ff-sprites.bin",
          "exists": true
        },
        {
          "file": "state.json",
          "exists": true
        }
      ],
      "expectedContext": {
        "status": "matches",
        "expected": [
          {
            "objset": "0x00",
            "area": "0x00",
            "submap": "0x00"
          }
        ]
      },
      "atlasContext": {
        "objset": "0x00",
        "area": "0x00",
        "submap": "0x00"
      },
      "atlasCandidate": {
        "id": "obj00-area00-sub00-town-of-jova",
        "name": "Town of Jova",
        "image": "images/obj00-area00-sub00-town-of-jova.png"
      },
      "live": {
        "runtimeContext": {
          "objset": "0x00",
          "area": "0x00",
          "submap": "0x00",
          "submapRaw": "0x80",
          "submapFlags": "0x80",
          "actorPointer": "0x90AC",
          "tileSetPointer": "0x841D"
        },
        "ppu": {
          "backgroundPaletteBytes": [
            "0x0F",
            "0x0C",
            "0x1C",
            "0x03",
            "0x0F",
            "0x0C",
            "0x02",
            "0x1C",
            "0x0F",
            "0x0C",
            "0x11",
            "0x0F",
            "0x0F",
            "0x01",
            "0x31",
            "0x05"
          ],
          "fullPaletteBytes": [
            "0x0F",
            "0x0C",
            "0x1C",
            "0x03",
            "0x0F",
            "0x0C",
            "0x02",
            "0x1C",
            "0x0F",
            "0x0C",
            "0x11",
            "0x0F",
            "0x0F",
            "0x01",
            "0x31",
            "0x05",
            "0x0F",
            "0x0F",
            "0x16",
            "0x20",
            "0x0F",
            "0x27",
            "0x20",
            "0x16",
            "0x0F",
            "0x1A",
            "0x2A",
            "0x0F",
            "0x0F",
            "0x03",
            "0x20",
            "0x0F"
          ],
          "backgroundPatternAddress": "0x0000",
          "xScroll": 0,
          "videoRamAddress": "0x0902",
          "tmpVideoRamAddress": "0x0100"
        }
      },
      "chr": {
        "status": "exact-match",
        "banks": [
          {
            "slot": 0,
            "ppuAddress": "0x0000",
            "sha1": "6e0d98e3d50b61e7a0a275c948209bd93018fc47",
            "matches": [
              {
                "bank": 0,
                "bankHex": "0x00"
              }
            ],
            "status": "exact-match"
          },
          {
            "slot": 1,
            "ppuAddress": "0x1000",
            "sha1": "080f054ffbfc6bd18157d9ddebad07d98a649fd3",
            "matches": [
              {
                "bank": 1,
                "bankHex": "0x01"
              }
            ],
            "status": "exact-match"
          }
        ]
      },
      "palette": {
        "selector": {
          "status": "exact-match",
          "variant": "night",
          "runtimeContext": {
            "objset": "0x00",
            "area": "0x00",
            "submap": "0x00"
          },
          "paletteTableAddress": "0x8072",
          "indexListPointerAddress": "0x8074",
          "indexListAddress": "0xFA4A",
          "indexOffset": 0,
          "transferId": "0x14",
          "auxiliaryTransferId": "0x37",
          "transferPointerAddress": "0x88BD",
          "paletteAddress": "0x9E80",
          "paletteBank": 4,
          "bytes": [
            "0x0F",
            "0x0C",
            "0x1C",
            "0x03",
            "0x0F",
            "0x0C",
            "0x02",
            "0x1C",
            "0x0F",
            "0x0C",
            "0x11",
            "0x0F",
            "0x0F",
            "0x01",
            "0x31",
            "0x05"
          ],
          "rawPalette": true
        },
        "transferMatches": [
          {
            "transferId": "0x14",
            "transferPointerAddress": "0x88BD",
            "paletteAddress": "0x9E80",
            "paletteBank": 4,
            "bytes": [
              "0x0F",
              "0x0C",
              "0x1C",
              "0x03",
              "0x0F",
              "0x0C",
              "0x02",
              "0x1C",
              "0x0F",
              "0x0C",
              "0x11",
              "0x0F",
              "0x0F",
              "0x01",
              "0x31",
              "0x05"
            ]
          }
        ],
        "status": "selector-exact"
      },
      "romContext": {
        "status": "resolved",
        "backgroundContext": {
          "input": {
            "objset": 0,
            "objsetHex": "0x00",
            "area": 0,
            "areaHex": "0x00",
            "submap": 0,
            "submapHex": "0x00"
          },
          "tables": {
            "areaTable": {
              "pointerTableAddress": "0xF7AB",
              "pointerAddress": "0xF7AB",
              "address": "0x8042",
              "bank": 2
            },
            "areaRecord": {
              "pointerAddress": "0x8042",
              "address": "0xF9FF"
            },
            "screenRecord": {
              "pointerAddress": "0xFA08",
              "address": "0xFA3A",
              "firstBytes": [
                "0x03",
                "0x04",
                "0xFE",
                "0xFF",
                "0x16",
                "0x2E",
                "0x19",
                "0x2E"
              ],
              "layoutIndex": 3,
              "layoutIndexHex": "0x03"
            },
            "layoutTable": {
              "pointerTableAddress": "0xF7FB",
              "pointerAddress": "0xF7FB",
              "address": "0x80D3",
              "bank": 2
            },
            "layoutHeader": {
              "pointerAddress": "0x80DF",
              "address": "0xFA86",
              "secondaryAddress": "0xFA50"
            },
            "tileSet": {
              "pointerTableAddress": "0xF7D1",
              "pointerAddress": "0xF7D1",
              "address": "0x841D",
              "bank": 4,
              "auxiliaryAddress": "0xF7E9"
            }
          },
          "derivedDescriptorFields": {
            "layoutBank": 2,
            "layoutHeaderAddress": "0xFA86",
            "tileBank": 4,
            "tileSetAddress": "0x841D"
          }
        }
      },
      "evidenceStatus": {
        "runtimeContext": "matches",
        "chr": "exact-match",
        "palette": "exact-match",
        "renderRecipe": "recipe-evidence-present"
      }
    },
    {
      "id": "jova-woods-day",
      "label": "Jova Woods, day",
      "location": "Jova Woods",
      "variant": "day",
      "access": "outdoor",
      "reason": "Baseline objset 2 route where runtime context and atlas context match.",
      "capture": "out/captures/jova-woods-day",
      "state": "out/states/jova-woods.mss",
      "status": "audited",
      "requiredFiles": [
        {
          "file": "screenshot.png",
          "exists": true
        },
        {
          "file": "cpu-0000-07ff.bin",
          "exists": true
        },
        {
          "file": "ppu-0000-1fff-patterns.bin",
          "exists": true
        },
        {
          "file": "ppu-2000-2fff-nametables.bin",
          "exists": true
        },
        {
          "file": "ppu-3f00-3f1f-palettes.bin",
          "exists": true
        },
        {
          "file": "oam-0000-00ff-sprites.bin",
          "exists": true
        },
        {
          "file": "state.json",
          "exists": true
        }
      ],
      "expectedContext": {
        "status": "matches",
        "expected": [
          {
            "objset": "0x02",
            "area": "0x00",
            "submap": "0x00"
          }
        ]
      },
      "atlasContext": {
        "objset": "0x02",
        "area": "0x00",
        "submap": "0x00"
      },
      "atlasCandidate": {
        "id": "obj02-area00-sub00-jova-woods",
        "name": "Jova Woods",
        "image": "images/obj02-area00-sub00-jova-woods.png"
      },
      "live": {
        "runtimeContext": {
          "objset": "0x02",
          "area": "0x00",
          "submap": "0x00",
          "submapRaw": "0x00",
          "submapFlags": "0x00",
          "actorPointer": "0x9FE4",
          "tileSetPointer": "0x8CF4"
        },
        "ppu": {
          "backgroundPaletteBytes": [
            "0x0F",
            "0x00",
            "0x10",
            "0x0A",
            "0x0F",
            "0x16",
            "0x1A",
            "0x06",
            "0x0F",
            "0x22",
            "0x17",
            "0x1A",
            "0x0F",
            "0x11",
            "0x20",
            "0x15"
          ],
          "fullPaletteBytes": [
            "0x0F",
            "0x00",
            "0x10",
            "0x0A",
            "0x0F",
            "0x16",
            "0x1A",
            "0x06",
            "0x0F",
            "0x22",
            "0x17",
            "0x1A",
            "0x0F",
            "0x11",
            "0x20",
            "0x15",
            "0x0F",
            "0x0F",
            "0x16",
            "0x20",
            "0x0F",
            "0x27",
            "0x20",
            "0x16",
            "0x0F",
            "0x15",
            "0x35",
            "0x0F",
            "0x0F",
            "0x21",
            "0x20",
            "0x0F"
          ],
          "backgroundPatternAddress": "0x0000",
          "xScroll": 0,
          "videoRamAddress": "0x3B82",
          "tmpVideoRamAddress": "0x3380"
        }
      },
      "chr": {
        "status": "exact-match",
        "banks": [
          {
            "slot": 0,
            "ppuAddress": "0x0000",
            "sha1": "af90453c4fb4b66a7de212233f3f36ace1f4e5bd",
            "matches": [
              {
                "bank": 2,
                "bankHex": "0x02"
              }
            ],
            "status": "exact-match"
          },
          {
            "slot": 1,
            "ppuAddress": "0x1000",
            "sha1": "50b0d3261453a2e4621abe117ab00d068d7016d5",
            "matches": [
              {
                "bank": 3,
                "bankHex": "0x03"
              }
            ],
            "status": "exact-match"
          }
        ]
      },
      "palette": {
        "selector": {
          "status": "exact-match",
          "variant": "day",
          "runtimeContext": {
            "objset": "0x02",
            "area": "0x00",
            "submap": "0x00"
          },
          "paletteTableAddress": "0x9EF9",
          "indexListPointerAddress": "0x9EF9",
          "indexListAddress": "0xA1C0",
          "indexOffset": 0,
          "transferId": "0x22",
          "auxiliaryTransferId": "0x2F",
          "transferPointerAddress": "0x88D9",
          "paletteAddress": "0x9FC6",
          "paletteBank": 4,
          "bytes": [
            "0x0F",
            "0x00",
            "0x10",
            "0x0A",
            "0x0F",
            "0x16",
            "0x1A",
            "0x06",
            "0x0F",
            "0x22",
            "0x17",
            "0x1A",
            "0x0F",
            "0x11",
            "0x20",
            "0x15"
          ],
          "rawPalette": true
        },
        "transferMatches": [
          {
            "transferId": "0x22",
            "transferPointerAddress": "0x88D9",
            "paletteAddress": "0x9FC6",
            "paletteBank": 4,
            "bytes": [
              "0x0F",
              "0x00",
              "0x10",
              "0x0A",
              "0x0F",
              "0x16",
              "0x1A",
              "0x06",
              "0x0F",
              "0x22",
              "0x17",
              "0x1A",
              "0x0F",
              "0x11",
              "0x20",
              "0x15"
            ]
          }
        ],
        "status": "selector-exact"
      },
      "romContext": {
        "status": "resolved",
        "backgroundContext": {
          "input": {
            "objset": 2,
            "objsetHex": "0x02",
            "area": 0,
            "areaHex": "0x00",
            "submap": 0,
            "submapHex": "0x00"
          },
          "tables": {
            "areaTable": {
              "pointerTableAddress": "0xF7AB",
              "pointerAddress": "0xF7AF",
              "address": "0x9EE5",
              "bank": 2
            },
            "areaRecord": {
              "pointerAddress": "0x9EE5",
              "address": "0xA149",
              "bank": 2
            },
            "screenRecord": {
              "pointerAddress": "0xA152",
              "address": "0xA1A0",
              "bank": 2,
              "firstBytes": [
                "0x02",
                "0x04",
                "0x05",
                "0xFE",
                "0x06",
                "0xFF",
                "0x00",
                "0x01"
              ],
              "layoutIndex": 2,
              "layoutIndexHex": "0x02"
            },
            "layoutTable": {
              "pointerTableAddress": "0xF7FB",
              "pointerAddress": "0xF7FF",
              "address": "0x9F21",
              "bank": 2
            },
            "layoutHeader": {
              "pointerAddress": "0x9F29",
              "address": "0xA23E",
              "bank": 2,
              "secondaryAddress": "0xA221",
              "secondaryBank": 2
            },
            "tileSet": {
              "pointerTableAddress": "0xF7D1",
              "pointerAddress": "0xF7D9",
              "address": "0x8CF4",
              "bank": 4,
              "auxiliaryAddress": "0xF7EF"
            }
          },
          "derivedDescriptorFields": {
            "layoutBank": 2,
            "layoutHeaderAddress": "0xA23E",
            "layoutHeaderBank": 2,
            "tileBank": 4,
            "tileSetAddress": "0x8CF4"
          }
        }
      },
      "evidenceStatus": {
        "runtimeContext": "matches",
        "chr": "exact-match",
        "palette": "exact-match",
        "renderRecipe": "recipe-evidence-present"
      }
    },
    {
      "id": "jova-woods-night",
      "label": "Jova Woods, night",
      "location": "Jova Woods",
      "variant": "night",
      "access": "outdoor",
      "reason": "Normal objset 2 night palette probe.",
      "capture": "out/captures/jova-woods-night",
      "state": "out/states/jova-woods-night.mss",
      "status": "audited",
      "requiredFiles": [
        {
          "file": "screenshot.png",
          "exists": true
        },
        {
          "file": "cpu-0000-07ff.bin",
          "exists": true
        },
        {
          "file": "ppu-0000-1fff-patterns.bin",
          "exists": true
        },
        {
          "file": "ppu-2000-2fff-nametables.bin",
          "exists": true
        },
        {
          "file": "ppu-3f00-3f1f-palettes.bin",
          "exists": true
        },
        {
          "file": "oam-0000-00ff-sprites.bin",
          "exists": true
        },
        {
          "file": "state.json",
          "exists": true
        }
      ],
      "expectedContext": {
        "status": "matches",
        "expected": [
          {
            "objset": "0x02",
            "area": "0x00",
            "submap": "0x00"
          }
        ]
      },
      "atlasContext": {
        "objset": "0x02",
        "area": "0x00",
        "submap": "0x00"
      },
      "atlasCandidate": {
        "id": "obj02-area00-sub00-jova-woods",
        "name": "Jova Woods",
        "image": "images/obj02-area00-sub00-jova-woods.png"
      },
      "live": {
        "runtimeContext": {
          "objset": "0x02",
          "area": "0x00",
          "submap": "0x00",
          "submapRaw": "0x00",
          "submapFlags": "0x00",
          "actorPointer": "0x9FE4",
          "tileSetPointer": "0x8CF4"
        },
        "ppu": {
          "backgroundPaletteBytes": [
            "0x0F",
            "0x00",
            "0x2B",
            "0x0B",
            "0x0F",
            "0x11",
            "0x11",
            "0x01",
            "0x0F",
            "0x02",
            "0x1B",
            "0x01",
            "0x0F",
            "0x01",
            "0x31",
            "0x05"
          ],
          "fullPaletteBytes": [
            "0x0F",
            "0x00",
            "0x2B",
            "0x0B",
            "0x0F",
            "0x11",
            "0x11",
            "0x01",
            "0x0F",
            "0x02",
            "0x1B",
            "0x01",
            "0x0F",
            "0x01",
            "0x31",
            "0x05",
            "0x0F",
            "0x0F",
            "0x16",
            "0x20",
            "0x0F",
            "0x27",
            "0x20",
            "0x16",
            "0x0F",
            "0x15",
            "0x35",
            "0x0F",
            "0x0F",
            "0x21",
            "0x20",
            "0x0F"
          ],
          "backgroundPatternAddress": "0x0000",
          "xScroll": 0,
          "videoRamAddress": "0x3B82",
          "tmpVideoRamAddress": "0x3380"
        }
      },
      "chr": {
        "status": "exact-match",
        "banks": [
          {
            "slot": 0,
            "ppuAddress": "0x0000",
            "sha1": "af90453c4fb4b66a7de212233f3f36ace1f4e5bd",
            "matches": [
              {
                "bank": 2,
                "bankHex": "0x02"
              }
            ],
            "status": "exact-match"
          },
          {
            "slot": 1,
            "ppuAddress": "0x1000",
            "sha1": "50b0d3261453a2e4621abe117ab00d068d7016d5",
            "matches": [
              {
                "bank": 3,
                "bankHex": "0x03"
              }
            ],
            "status": "exact-match"
          }
        ]
      },
      "palette": {
        "selector": {
          "status": "exact-match",
          "variant": "night",
          "runtimeContext": {
            "objset": "0x02",
            "area": "0x00",
            "submap": "0x00"
          },
          "paletteTableAddress": "0x9EF9",
          "indexListPointerAddress": "0x9EFB",
          "indexListAddress": "0xA1DC",
          "indexOffset": 0,
          "transferId": "0x25",
          "auxiliaryTransferId": "0x2F",
          "transferPointerAddress": "0x88DF",
          "paletteAddress": "0x9FF9",
          "paletteBank": 4,
          "bytes": [
            "0x0F",
            "0x00",
            "0x2B",
            "0x0B",
            "0x0F",
            "0x11",
            "0x11",
            "0x01",
            "0x0F",
            "0x02",
            "0x1B",
            "0x01",
            "0x0F",
            "0x01",
            "0x31",
            "0x05"
          ],
          "rawPalette": true
        },
        "transferMatches": [
          {
            "transferId": "0x25",
            "transferPointerAddress": "0x88DF",
            "paletteAddress": "0x9FF9",
            "paletteBank": 4,
            "bytes": [
              "0x0F",
              "0x00",
              "0x2B",
              "0x0B",
              "0x0F",
              "0x11",
              "0x11",
              "0x01",
              "0x0F",
              "0x02",
              "0x1B",
              "0x01",
              "0x0F",
              "0x01",
              "0x31",
              "0x05"
            ]
          }
        ],
        "status": "selector-exact"
      },
      "romContext": {
        "status": "resolved",
        "backgroundContext": {
          "input": {
            "objset": 2,
            "objsetHex": "0x02",
            "area": 0,
            "areaHex": "0x00",
            "submap": 0,
            "submapHex": "0x00"
          },
          "tables": {
            "areaTable": {
              "pointerTableAddress": "0xF7AB",
              "pointerAddress": "0xF7AF",
              "address": "0x9EE5",
              "bank": 2
            },
            "areaRecord": {
              "pointerAddress": "0x9EE5",
              "address": "0xA149",
              "bank": 2
            },
            "screenRecord": {
              "pointerAddress": "0xA152",
              "address": "0xA1A0",
              "bank": 2,
              "firstBytes": [
                "0x02",
                "0x04",
                "0x05",
                "0xFE",
                "0x06",
                "0xFF",
                "0x00",
                "0x01"
              ],
              "layoutIndex": 2,
              "layoutIndexHex": "0x02"
            },
            "layoutTable": {
              "pointerTableAddress": "0xF7FB",
              "pointerAddress": "0xF7FF",
              "address": "0x9F21",
              "bank": 2
            },
            "layoutHeader": {
              "pointerAddress": "0x9F29",
              "address": "0xA23E",
              "bank": 2,
              "secondaryAddress": "0xA221",
              "secondaryBank": 2
            },
            "tileSet": {
              "pointerTableAddress": "0xF7D1",
              "pointerAddress": "0xF7D9",
              "address": "0x8CF4",
              "bank": 4,
              "auxiliaryAddress": "0xF7EF"
            }
          },
          "derivedDescriptorFields": {
            "layoutBank": 2,
            "layoutHeaderAddress": "0xA23E",
            "layoutHeaderBank": 2,
            "tileBank": 4,
            "tileSetAddress": "0x8CF4"
          }
        }
      },
      "evidenceStatus": {
        "runtimeContext": "matches",
        "chr": "exact-match",
        "palette": "exact-match",
        "renderRecipe": "recipe-evidence-present"
      }
    },
    {
      "id": "dora-woods-part-2-day",
      "label": "Dora Woods - Part 2, day",
      "location": "Dora Woods - Part 2",
      "variant": "day",
      "access": "outdoor",
      "reason": "Known special runtime palette-context alias.",
      "capture": "out/captures/dora-woods-part-2-day",
      "state": "out/states/dora-woods-part-2.mss",
      "status": "audited",
      "requiredFiles": [
        {
          "file": "screenshot.png",
          "exists": true
        },
        {
          "file": "cpu-0000-07ff.bin",
          "exists": true
        },
        {
          "file": "ppu-0000-1fff-patterns.bin",
          "exists": true
        },
        {
          "file": "ppu-2000-2fff-nametables.bin",
          "exists": true
        },
        {
          "file": "ppu-3f00-3f1f-palettes.bin",
          "exists": true
        },
        {
          "file": "oam-0000-00ff-sprites.bin",
          "exists": true
        },
        {
          "file": "state.json",
          "exists": true
        }
      ],
      "expectedContext": {
        "status": "differs",
        "expected": [
          {
            "objset": "0x02",
            "area": "0x08",
            "submap": "0x02"
          }
        ]
      },
      "atlasContext": {
        "objset": "0x02",
        "area": "0x08",
        "submap": "0x02"
      },
      "atlasCandidate": {
        "id": "obj02-area08-sub02-dora-woods-part-2",
        "name": "Dora Woods - Part 2",
        "image": "images/obj02-area08-sub02-dora-woods-part-2.png"
      },
      "live": {
        "runtimeContext": {
          "objset": "0x02",
          "area": "0x00",
          "submap": "0x03",
          "submapRaw": "0x83",
          "submapFlags": "0x80",
          "actorPointer": "0xA04F",
          "tileSetPointer": "0x8CF4"
        },
        "ppu": {
          "backgroundPaletteBytes": [
            "0x0F",
            "0x00",
            "0x10",
            "0x0A",
            "0x0F",
            "0x16",
            "0x1C",
            "0x06",
            "0x0F",
            "0x22",
            "0x19",
            "0x1C",
            "0x0F",
            "0x11",
            "0x20",
            "0x15"
          ],
          "fullPaletteBytes": [
            "0x0F",
            "0x00",
            "0x10",
            "0x0A",
            "0x0F",
            "0x16",
            "0x1C",
            "0x06",
            "0x0F",
            "0x22",
            "0x19",
            "0x1C",
            "0x0F",
            "0x11",
            "0x20",
            "0x15",
            "0x0F",
            "0x0F",
            "0x16",
            "0x20",
            "0x0F",
            "0x27",
            "0x20",
            "0x16",
            "0x0F",
            "0x16",
            "0x36",
            "0x0F",
            "0x0F",
            "0x23",
            "0x20",
            "0x0F"
          ],
          "backgroundPatternAddress": "0x0000",
          "xScroll": 0,
          "videoRamAddress": "0x08D4",
          "tmpVideoRamAddress": "0x00D2"
        }
      },
      "chr": {
        "status": "exact-match",
        "banks": [
          {
            "slot": 0,
            "ppuAddress": "0x0000",
            "sha1": "af90453c4fb4b66a7de212233f3f36ace1f4e5bd",
            "matches": [
              {
                "bank": 2,
                "bankHex": "0x02"
              }
            ],
            "status": "exact-match"
          },
          {
            "slot": 1,
            "ppuAddress": "0x1000",
            "sha1": "50b0d3261453a2e4621abe117ab00d068d7016d5",
            "matches": [
              {
                "bank": 3,
                "bankHex": "0x03"
              }
            ],
            "status": "exact-match"
          }
        ]
      },
      "palette": {
        "selector": {
          "status": "exact-match",
          "variant": "day",
          "runtimeContext": {
            "objset": "0x02",
            "area": "0x00",
            "submap": "0x03"
          },
          "paletteTableAddress": "0x9EF9",
          "indexListPointerAddress": "0x9EF9",
          "indexListAddress": "0xA1C0",
          "indexOffset": 6,
          "transferId": "0x23",
          "auxiliaryTransferId": "0x30",
          "transferPointerAddress": "0x88DB",
          "paletteAddress": "0x9FD7",
          "paletteBank": 4,
          "bytes": [
            "0x0F",
            "0x00",
            "0x10",
            "0x0A",
            "0x0F",
            "0x16",
            "0x1C",
            "0x06",
            "0x0F",
            "0x22",
            "0x19",
            "0x1C",
            "0x0F",
            "0x11",
            "0x20",
            "0x15"
          ],
          "rawPalette": true
        },
        "transferMatches": [
          {
            "transferId": "0x23",
            "transferPointerAddress": "0x88DB",
            "paletteAddress": "0x9FD7",
            "paletteBank": 4,
            "bytes": [
              "0x0F",
              "0x00",
              "0x10",
              "0x0A",
              "0x0F",
              "0x16",
              "0x1C",
              "0x06",
              "0x0F",
              "0x22",
              "0x19",
              "0x1C",
              "0x0F",
              "0x11",
              "0x20",
              "0x15"
            ]
          }
        ],
        "status": "selector-exact"
      },
      "romContext": {
        "status": "resolved",
        "backgroundContext": {
          "input": {
            "objset": 2,
            "objsetHex": "0x02",
            "area": 0,
            "areaHex": "0x00",
            "submap": 3,
            "submapHex": "0x03"
          },
          "tables": {
            "areaTable": {
              "pointerTableAddress": "0xF7AB",
              "pointerAddress": "0xF7AF",
              "address": "0x9EE5",
              "bank": 2
            },
            "areaRecord": {
              "pointerAddress": "0x9EE5",
              "address": "0xA149",
              "bank": 2
            },
            "screenRecord": {
              "pointerAddress": "0xA158",
              "address": "0xA1A3",
              "bank": 2,
              "firstBytes": [
                "0xFE",
                "0x06",
                "0xFF",
                "0x00",
                "0x01",
                "0x16",
                "0x0B",
                "0x0C"
              ],
              "layoutIndex": 254,
              "layoutIndexHex": "0xFE"
            },
            "layoutTable": {
              "pointerTableAddress": "0xF7FB",
              "pointerAddress": "0xF7FF",
              "address": "0x9F21",
              "bank": 2
            },
            "layoutHeader": {
              "pointerAddress": "0xA319",
              "address": "0x1917",
              "bank": 2,
              "secondaryAddress": "0x0000",
              "secondaryBank": 2
            },
            "tileSet": {
              "pointerTableAddress": "0xF7D1",
              "pointerAddress": "0xF7D9",
              "address": "0x8CF4",
              "bank": 4,
              "auxiliaryAddress": "0xF7EF"
            }
          },
          "derivedDescriptorFields": {
            "layoutBank": 2,
            "layoutHeaderAddress": "0x1917",
            "layoutHeaderBank": 2,
            "tileBank": 4,
            "tileSetAddress": "0x8CF4"
          }
        }
      },
      "evidenceStatus": {
        "runtimeContext": "differs",
        "chr": "exact-match",
        "palette": "exact-match",
        "renderRecipe": "recipe-evidence-present"
      }
    },
    {
      "id": "dabis-path-day",
      "label": "Dabi's Path, day",
      "location": "Dabi's Path",
      "variant": "day",
      "access": "outdoor",
      "reason": "Objset 2 alternate day palette that validates the selector path without an alias.",
      "capture": "out/captures/dabis-path-day",
      "state": "out/states/dabis-path.mss",
      "status": "audited",
      "requiredFiles": [
        {
          "file": "screenshot.png",
          "exists": true
        },
        {
          "file": "cpu-0000-07ff.bin",
          "exists": true
        },
        {
          "file": "ppu-0000-1fff-patterns.bin",
          "exists": true
        },
        {
          "file": "ppu-2000-2fff-nametables.bin",
          "exists": true
        },
        {
          "file": "ppu-3f00-3f1f-palettes.bin",
          "exists": true
        },
        {
          "file": "oam-0000-00ff-sprites.bin",
          "exists": true
        },
        {
          "file": "state.json",
          "exists": true
        }
      ],
      "expectedContext": {
        "status": "matches",
        "expected": [
          {
            "objset": "0x02",
            "area": "0x03",
            "submap": "0x00"
          }
        ]
      },
      "atlasContext": {
        "objset": "0x02",
        "area": "0x03",
        "submap": "0x00"
      },
      "atlasCandidate": {
        "id": "obj02-area03-sub00-dabis-path-part-1",
        "name": "Dabis Path - Part 1",
        "image": "images/obj02-area03-sub00-dabis-path-part-1.png"
      },
      "live": {
        "runtimeContext": {
          "objset": "0x02",
          "area": "0x03",
          "submap": "0x00",
          "submapRaw": "0x00",
          "submapFlags": "0x00",
          "actorPointer": "0xA66F",
          "tileSetPointer": "0x8CF4"
        },
        "ppu": {
          "backgroundPaletteBytes": [
            "0x0F",
            "0x00",
            "0x23",
            "0x03",
            "0x0F",
            "0x1C",
            "0x04",
            "0x0C",
            "0x0F",
            "0x01",
            "0x11",
            "0x05",
            "0x0F",
            "0x01",
            "0x20",
            "0x05"
          ],
          "fullPaletteBytes": [
            "0x0F",
            "0x00",
            "0x23",
            "0x03",
            "0x0F",
            "0x1C",
            "0x04",
            "0x0C",
            "0x0F",
            "0x01",
            "0x11",
            "0x05",
            "0x0F",
            "0x01",
            "0x20",
            "0x05",
            "0x0F",
            "0x0F",
            "0x16",
            "0x20",
            "0x0F",
            "0x27",
            "0x20",
            "0x16",
            "0x0F",
            "0x17",
            "0x37",
            "0x0F",
            "0x0F",
            "0x00",
            "0x20",
            "0x0F"
          ],
          "backgroundPatternAddress": "0x0000",
          "xScroll": 0,
          "videoRamAddress": "0x3B42",
          "tmpVideoRamAddress": "0x3340"
        }
      },
      "chr": {
        "status": "exact-match",
        "banks": [
          {
            "slot": 0,
            "ppuAddress": "0x0000",
            "sha1": "af90453c4fb4b66a7de212233f3f36ace1f4e5bd",
            "matches": [
              {
                "bank": 2,
                "bankHex": "0x02"
              }
            ],
            "status": "exact-match"
          },
          {
            "slot": 1,
            "ppuAddress": "0x1000",
            "sha1": "50b0d3261453a2e4621abe117ab00d068d7016d5",
            "matches": [
              {
                "bank": 3,
                "bankHex": "0x03"
              }
            ],
            "status": "exact-match"
          }
        ]
      },
      "palette": {
        "selector": {
          "status": "exact-match",
          "variant": "day",
          "runtimeContext": {
            "objset": "0x02",
            "area": "0x03",
            "submap": "0x00"
          },
          "paletteTableAddress": "0x9EF9",
          "indexListPointerAddress": "0x9F05",
          "indexListAddress": "0xA6EB",
          "indexOffset": 0,
          "transferId": "0x26",
          "auxiliaryTransferId": "0x31",
          "transferPointerAddress": "0x88E1",
          "paletteAddress": "0xA00A",
          "paletteBank": 4,
          "bytes": [
            "0x0F",
            "0x00",
            "0x23",
            "0x03",
            "0x0F",
            "0x1C",
            "0x04",
            "0x0C",
            "0x0F",
            "0x01",
            "0x11",
            "0x05",
            "0x0F",
            "0x01",
            "0x20",
            "0x05"
          ],
          "rawPalette": true
        },
        "transferMatches": [
          {
            "transferId": "0x26",
            "transferPointerAddress": "0x88E1",
            "paletteAddress": "0xA00A",
            "paletteBank": 4,
            "bytes": [
              "0x0F",
              "0x00",
              "0x23",
              "0x03",
              "0x0F",
              "0x1C",
              "0x04",
              "0x0C",
              "0x0F",
              "0x01",
              "0x11",
              "0x05",
              "0x0F",
              "0x01",
              "0x20",
              "0x05"
            ]
          }
        ],
        "status": "selector-exact"
      },
      "romContext": {
        "status": "resolved",
        "backgroundContext": {
          "input": {
            "objset": 2,
            "objsetHex": "0x02",
            "area": 3,
            "areaHex": "0x03",
            "submap": 0,
            "submapHex": "0x00"
          },
          "tables": {
            "areaTable": {
              "pointerTableAddress": "0xF7AB",
              "pointerAddress": "0xF7AF",
              "address": "0x9EE5",
              "bank": 2
            },
            "areaRecord": {
              "pointerAddress": "0x9EEB",
              "address": "0xA6A5",
              "bank": 2
            },
            "screenRecord": {
              "pointerAddress": "0xA6AE",
              "address": "0xA6D1",
              "bank": 2,
              "firstBytes": [
                "0xFD",
                "0x13",
                "0xFF",
                "0x00",
                "0x01",
                "0x14",
                "0x08",
                "0xFE"
              ],
              "layoutIndex": 253,
              "layoutIndexHex": "0xFD"
            },
            "layoutTable": {
              "pointerTableAddress": "0xF7FB",
              "pointerAddress": "0xF7FF",
              "address": "0x9F21",
              "bank": 2
            },
            "layoutHeader": {
              "pointerAddress": "0xA315",
              "address": "0x0A04",
              "bank": 2,
              "secondaryAddress": "0x0101",
              "secondaryBank": 2
            },
            "tileSet": {
              "pointerTableAddress": "0xF7D1",
              "pointerAddress": "0xF7D9",
              "address": "0x8CF4",
              "bank": 4,
              "auxiliaryAddress": "0xF7EF"
            }
          },
          "derivedDescriptorFields": {
            "layoutBank": 2,
            "layoutHeaderAddress": "0x0A04",
            "layoutHeaderBank": 2,
            "tileBank": 4,
            "tileSetAddress": "0x8CF4"
          }
        }
      },
      "evidenceStatus": {
        "runtimeContext": "matches",
        "chr": "exact-match",
        "palette": "exact-match",
        "renderRecipe": "recipe-evidence-present"
      }
    },
    {
      "id": "camilla-cemetery-day",
      "label": "Camilla Cemetery, day",
      "location": "Camilla Cemetery",
      "variant": "day",
      "access": "outdoor",
      "reason": "Representative objset 3 exterior day recipe probe.",
      "capture": "out/captures/camilla-cemetery-day",
      "state": "out/states/camilla-cemetery-day.mss",
      "status": "audited",
      "requiredFiles": [
        {
          "file": "screenshot.png",
          "exists": true
        },
        {
          "file": "cpu-0000-07ff.bin",
          "exists": true
        },
        {
          "file": "ppu-0000-1fff-patterns.bin",
          "exists": true
        },
        {
          "file": "ppu-2000-2fff-nametables.bin",
          "exists": true
        },
        {
          "file": "ppu-3f00-3f1f-palettes.bin",
          "exists": true
        },
        {
          "file": "oam-0000-00ff-sprites.bin",
          "exists": true
        },
        {
          "file": "state.json",
          "exists": true
        }
      ],
      "expectedContext": {
        "status": "matches",
        "expected": [
          {
            "objset": "0x03",
            "area": "0x00",
            "submap": "0x00"
          }
        ]
      },
      "atlasContext": {
        "objset": "0x03",
        "area": "0x00",
        "submap": "0x00"
      },
      "atlasCandidate": {
        "id": "obj03-area00-sub00-camilla-cemetery",
        "name": "Camilla Cemetery",
        "image": "images/obj03-area00-sub00-camilla-cemetery.png"
      },
      "live": {
        "runtimeContext": {
          "objset": "0x03",
          "area": "0x00",
          "submap": "0x00",
          "submapRaw": "0x00",
          "submapFlags": "0x00",
          "actorPointer": "0xAF22",
          "tileSetPointer": "0x918A"
        },
        "ppu": {
          "backgroundPaletteBytes": [
            "0x0F",
            "0x00",
            "0x10",
            "0x1C",
            "0x0F",
            "0x16",
            "0x2B",
            "0x06",
            "0x0F",
            "0x22",
            "0x20",
            "0x2C",
            "0x0F",
            "0x11",
            "0x20",
            "0x15"
          ],
          "fullPaletteBytes": [
            "0x0F",
            "0x00",
            "0x10",
            "0x1C",
            "0x0F",
            "0x16",
            "0x2B",
            "0x06",
            "0x0F",
            "0x22",
            "0x20",
            "0x2C",
            "0x0F",
            "0x11",
            "0x20",
            "0x15",
            "0x0F",
            "0x0F",
            "0x16",
            "0x20",
            "0x0F",
            "0x27",
            "0x20",
            "0x16",
            "0x0F",
            "0x14",
            "0x34",
            "0x0F",
            "0x0F",
            "0x26",
            "0x20",
            "0x0F"
          ],
          "backgroundPatternAddress": "0x0000",
          "xScroll": 0,
          "videoRamAddress": "0x3BA2",
          "tmpVideoRamAddress": "0x33A0"
        }
      },
      "chr": {
        "status": "exact-match",
        "banks": [
          {
            "slot": 0,
            "ppuAddress": "0x0000",
            "sha1": "59602391659d508f75f800222f23c2898fdb14c3",
            "matches": [
              {
                "bank": 4,
                "bankHex": "0x04"
              }
            ],
            "status": "exact-match"
          },
          {
            "slot": 1,
            "ppuAddress": "0x1000",
            "sha1": "fb807093385d4ae676d8d4f073284ab2c1091502",
            "matches": [
              {
                "bank": 5,
                "bankHex": "0x05"
              }
            ],
            "status": "exact-match"
          }
        ]
      },
      "palette": {
        "selector": {
          "status": "exact-match",
          "variant": "day",
          "runtimeContext": {
            "objset": "0x03",
            "area": "0x00",
            "submap": "0x00"
          },
          "paletteTableAddress": "0xB28A",
          "indexListPointerAddress": "0xB28A",
          "indexListAddress": "0xB3B2",
          "indexOffset": 0,
          "transferId": "0x29",
          "auxiliaryTransferId": "0x35",
          "transferPointerAddress": "0x88E7",
          "paletteAddress": "0xA03D",
          "paletteBank": 4,
          "bytes": [
            "0x0F",
            "0x00",
            "0x10",
            "0x1C",
            "0x0F",
            "0x16",
            "0x2B",
            "0x06",
            "0x0F",
            "0x22",
            "0x20",
            "0x2C",
            "0x0F",
            "0x11",
            "0x20",
            "0x15"
          ],
          "rawPalette": true
        },
        "transferMatches": [
          {
            "transferId": "0x29",
            "transferPointerAddress": "0x88E7",
            "paletteAddress": "0xA03D",
            "paletteBank": 4,
            "bytes": [
              "0x0F",
              "0x00",
              "0x10",
              "0x1C",
              "0x0F",
              "0x16",
              "0x2B",
              "0x06",
              "0x0F",
              "0x22",
              "0x20",
              "0x2C",
              "0x0F",
              "0x11",
              "0x20",
              "0x15"
            ]
          }
        ],
        "status": "selector-exact"
      },
      "romContext": {
        "status": "resolved",
        "backgroundContext": {
          "input": {
            "objset": 3,
            "objsetHex": "0x03",
            "area": 0,
            "areaHex": "0x00",
            "submap": 0,
            "submapHex": "0x00"
          },
          "tables": {
            "areaTable": {
              "pointerTableAddress": "0xF7AB",
              "pointerAddress": "0xF7B1",
              "address": "0xB280",
              "bank": 2
            },
            "areaRecord": {
              "pointerAddress": "0xB280",
              "address": "0xB372",
              "bank": 2
            },
            "screenRecord": {
              "pointerAddress": "0xB37B",
              "address": "0xB3A2",
              "bank": 2,
              "firstBytes": [
                "0x00",
                "0x01",
                "0x05",
                "0xFD",
                "0x06",
                "0x00",
                "0x00",
                "0x01"
              ],
              "layoutIndex": 0,
              "layoutIndexHex": "0x00"
            },
            "layoutTable": {
              "pointerTableAddress": "0xF7FB",
              "pointerAddress": "0xF801",
              "address": "0xB29E",
              "bank": 2
            },
            "layoutHeader": {
              "pointerAddress": "0xB29E",
              "address": "0xB3EF",
              "bank": 2,
              "secondaryAddress": "0xB3EE",
              "secondaryBank": 2
            },
            "tileSet": {
              "pointerTableAddress": "0xF7D1",
              "pointerAddress": "0xF7DD",
              "address": "0x918A",
              "bank": 4,
              "auxiliaryAddress": "0xF7F2"
            }
          },
          "derivedDescriptorFields": {
            "layoutBank": 2,
            "layoutHeaderAddress": "0xB3EF",
            "layoutHeaderBank": 2,
            "tileBank": 4,
            "tileSetAddress": "0x918A"
          }
        }
      },
      "evidenceStatus": {
        "runtimeContext": "matches",
        "chr": "exact-match",
        "palette": "exact-match",
        "renderRecipe": "recipe-evidence-present"
      }
    },
    {
      "id": "camilla-cemetery-night",
      "label": "Camilla Cemetery, night",
      "location": "Camilla Cemetery",
      "variant": "night",
      "access": "outdoor",
      "reason": "Representative objset 3 exterior night palette probe.",
      "capture": "out/captures/camilla-cemetery-night",
      "state": "out/states/camilla-cemetery-night.mss",
      "status": "audited",
      "requiredFiles": [
        {
          "file": "screenshot.png",
          "exists": true
        },
        {
          "file": "cpu-0000-07ff.bin",
          "exists": true
        },
        {
          "file": "ppu-0000-1fff-patterns.bin",
          "exists": true
        },
        {
          "file": "ppu-2000-2fff-nametables.bin",
          "exists": true
        },
        {
          "file": "ppu-3f00-3f1f-palettes.bin",
          "exists": true
        },
        {
          "file": "oam-0000-00ff-sprites.bin",
          "exists": true
        },
        {
          "file": "state.json",
          "exists": true
        }
      ],
      "expectedContext": {
        "status": "matches",
        "expected": [
          {
            "objset": "0x03",
            "area": "0x00",
            "submap": "0x00"
          }
        ]
      },
      "atlasContext": {
        "objset": "0x03",
        "area": "0x00",
        "submap": "0x00"
      },
      "atlasCandidate": {
        "id": "obj03-area00-sub00-camilla-cemetery",
        "name": "Camilla Cemetery",
        "image": "images/obj03-area00-sub00-camilla-cemetery.png"
      },
      "live": {
        "runtimeContext": {
          "objset": "0x03",
          "area": "0x00",
          "submap": "0x00",
          "submapRaw": "0x00",
          "submapFlags": "0x00",
          "actorPointer": "0xAF22",
          "tileSetPointer": "0x918A"
        },
        "ppu": {
          "backgroundPaletteBytes": [
            "0x0F",
            "0x00",
            "0x10",
            "0x01",
            "0x0F",
            "0x11",
            "0x0C",
            "0x01",
            "0x0F",
            "0x02",
            "0x13",
            "0x0C",
            "0x0F",
            "0x01",
            "0x31",
            "0x05"
          ],
          "fullPaletteBytes": [
            "0x0F",
            "0x00",
            "0x10",
            "0x01",
            "0x0F",
            "0x11",
            "0x0C",
            "0x01",
            "0x0F",
            "0x02",
            "0x13",
            "0x0C",
            "0x0F",
            "0x01",
            "0x31",
            "0x05",
            "0x0F",
            "0x0F",
            "0x16",
            "0x20",
            "0x0F",
            "0x27",
            "0x20",
            "0x16",
            "0x0F",
            "0x14",
            "0x34",
            "0x0F",
            "0x0F",
            "0x26",
            "0x20",
            "0x0F"
          ],
          "backgroundPatternAddress": "0x0000",
          "xScroll": 0,
          "videoRamAddress": "0x3BA2",
          "tmpVideoRamAddress": "0x33A0"
        }
      },
      "chr": {
        "status": "exact-match",
        "banks": [
          {
            "slot": 0,
            "ppuAddress": "0x0000",
            "sha1": "59602391659d508f75f800222f23c2898fdb14c3",
            "matches": [
              {
                "bank": 4,
                "bankHex": "0x04"
              }
            ],
            "status": "exact-match"
          },
          {
            "slot": 1,
            "ppuAddress": "0x1000",
            "sha1": "fb807093385d4ae676d8d4f073284ab2c1091502",
            "matches": [
              {
                "bank": 5,
                "bankHex": "0x05"
              }
            ],
            "status": "exact-match"
          }
        ]
      },
      "palette": {
        "selector": {
          "status": "exact-match",
          "variant": "night",
          "runtimeContext": {
            "objset": "0x03",
            "area": "0x00",
            "submap": "0x00"
          },
          "paletteTableAddress": "0xB28A",
          "indexListPointerAddress": "0xB28C",
          "indexListAddress": "0xB3C0",
          "indexOffset": 0,
          "transferId": "0x2B",
          "auxiliaryTransferId": "0x35",
          "transferPointerAddress": "0x88EB",
          "paletteAddress": "0xA05F",
          "paletteBank": 4,
          "bytes": [
            "0x0F",
            "0x00",
            "0x10",
            "0x01",
            "0x0F",
            "0x11",
            "0x0C",
            "0x01",
            "0x0F",
            "0x02",
            "0x13",
            "0x0C",
            "0x0F",
            "0x01",
            "0x31",
            "0x05"
          ],
          "rawPalette": true
        },
        "transferMatches": [
          {
            "transferId": "0x2B",
            "transferPointerAddress": "0x88EB",
            "paletteAddress": "0xA05F",
            "paletteBank": 4,
            "bytes": [
              "0x0F",
              "0x00",
              "0x10",
              "0x01",
              "0x0F",
              "0x11",
              "0x0C",
              "0x01",
              "0x0F",
              "0x02",
              "0x13",
              "0x0C",
              "0x0F",
              "0x01",
              "0x31",
              "0x05"
            ]
          }
        ],
        "status": "selector-exact"
      },
      "romContext": {
        "status": "resolved",
        "backgroundContext": {
          "input": {
            "objset": 3,
            "objsetHex": "0x03",
            "area": 0,
            "areaHex": "0x00",
            "submap": 0,
            "submapHex": "0x00"
          },
          "tables": {
            "areaTable": {
              "pointerTableAddress": "0xF7AB",
              "pointerAddress": "0xF7B1",
              "address": "0xB280",
              "bank": 2
            },
            "areaRecord": {
              "pointerAddress": "0xB280",
              "address": "0xB372",
              "bank": 2
            },
            "screenRecord": {
              "pointerAddress": "0xB37B",
              "address": "0xB3A2",
              "bank": 2,
              "firstBytes": [
                "0x00",
                "0x01",
                "0x05",
                "0xFD",
                "0x06",
                "0x00",
                "0x00",
                "0x01"
              ],
              "layoutIndex": 0,
              "layoutIndexHex": "0x00"
            },
            "layoutTable": {
              "pointerTableAddress": "0xF7FB",
              "pointerAddress": "0xF801",
              "address": "0xB29E",
              "bank": 2
            },
            "layoutHeader": {
              "pointerAddress": "0xB29E",
              "address": "0xB3EF",
              "bank": 2,
              "secondaryAddress": "0xB3EE",
              "secondaryBank": 2
            },
            "tileSet": {
              "pointerTableAddress": "0xF7D1",
              "pointerAddress": "0xF7DD",
              "address": "0x918A",
              "bank": 4,
              "auxiliaryAddress": "0xF7F2"
            }
          },
          "derivedDescriptorFields": {
            "layoutBank": 2,
            "layoutHeaderAddress": "0xB3EF",
            "layoutHeaderBank": 2,
            "tileBank": 4,
            "tileSetAddress": "0x918A"
          }
        }
      },
      "evidenceStatus": {
        "runtimeContext": "matches",
        "chr": "exact-match",
        "palette": "exact-match",
        "renderRecipe": "recipe-evidence-present"
      }
    },
    {
      "id": "berkeley-mansion-door-day",
      "label": "Berkeley Mansion door, day",
      "location": "Berkeley Mansion - Door",
      "variant": "day",
      "access": "mansion-door",
      "reason": "Diagnostic probe for scrambled mansion-door exterior renders.",
      "capture": "out/captures/berkeley-mansion-door-day",
      "state": "out/states/berkeley-mansion-door-day.mss",
      "status": "audited",
      "requiredFiles": [
        {
          "file": "screenshot.png",
          "exists": true
        },
        {
          "file": "cpu-0000-07ff.bin",
          "exists": true
        },
        {
          "file": "ppu-0000-1fff-patterns.bin",
          "exists": true
        },
        {
          "file": "ppu-2000-2fff-nametables.bin",
          "exists": true
        },
        {
          "file": "ppu-3f00-3f1f-palettes.bin",
          "exists": true
        },
        {
          "file": "oam-0000-00ff-sprites.bin",
          "exists": true
        },
        {
          "file": "state.json",
          "exists": true
        }
      ],
      "expectedContext": {
        "status": "matches",
        "expected": [
          {
            "objset": "0x01",
            "area": "0x01",
            "submap": "0x00"
          }
        ]
      },
      "atlasContext": {
        "objset": "0x01",
        "area": "0x01",
        "submap": "0x00"
      },
      "atlasCandidate": {
        "id": "obj01-area01-sub00-berkeley-mansion-door",
        "name": "Berkeley Mansion - Door",
        "image": "images/obj01-area01-sub00-berkeley-mansion-door.png"
      },
      "live": {
        "runtimeContext": {
          "objset": "0x01",
          "area": "0x01",
          "submap": "0x00",
          "submapRaw": "0x00",
          "submapFlags": "0x00",
          "actorPointer": "0x9346",
          "tileSetPointer": "0x8891"
        },
        "ppu": {
          "backgroundPaletteBytes": [
            "0x0F",
            "0x00",
            "0x10",
            "0x0B",
            "0x0F",
            "0x0A",
            "0x17",
            "0x00",
            "0x0F",
            "0x06",
            "0x09",
            "0x37",
            "0x0F",
            "0x11",
            "0x20",
            "0x15"
          ],
          "fullPaletteBytes": [
            "0x0F",
            "0x00",
            "0x10",
            "0x0B",
            "0x0F",
            "0x0A",
            "0x17",
            "0x00",
            "0x0F",
            "0x06",
            "0x09",
            "0x37",
            "0x0F",
            "0x11",
            "0x20",
            "0x15",
            "0x0F",
            "0x0F",
            "0x16",
            "0x20",
            "0x0F",
            "0x27",
            "0x20",
            "0x16",
            "0x0F",
            "0x1C",
            "0x3C",
            "0x0F",
            "0x0F",
            "0x11",
            "0x20",
            "0x0F"
          ],
          "backgroundPatternAddress": "0x0000",
          "xScroll": 0,
          "videoRamAddress": "0x3B82",
          "tmpVideoRamAddress": "0x3380"
        }
      },
      "chr": {
        "status": "exact-match",
        "banks": [
          {
            "slot": 0,
            "ppuAddress": "0x0000",
            "sha1": "49407ad6e2b59cfcda3e9fa4f96a6776781c9efb",
            "matches": [
              {
                "bank": 8,
                "bankHex": "0x08"
              }
            ],
            "status": "exact-match"
          },
          {
            "slot": 1,
            "ppuAddress": "0x1000",
            "sha1": "0007874eb55a5b5a6f8a5b770d954e728e0b69a3",
            "matches": [
              {
                "bank": 9,
                "bankHex": "0x09"
              }
            ],
            "status": "exact-match"
          }
        ]
      },
      "palette": {
        "selector": {
          "status": "exact-match",
          "variant": "day",
          "runtimeContext": {
            "objset": "0x01",
            "area": "0x01",
            "submap": "0x00"
          },
          "paletteTableAddress": "0x8762",
          "indexListPointerAddress": "0x8766",
          "indexListAddress": "0x8D65",
          "indexOffset": 0,
          "transferId": "0x0F",
          "auxiliaryTransferId": "0x48",
          "transferPointerAddress": "0x88B3",
          "paletteAddress": "0x9F5E",
          "paletteBank": 4,
          "bytes": [
            "0x0F",
            "0x00",
            "0x10",
            "0x0B",
            "0x0F",
            "0x0A",
            "0x17",
            "0x00",
            "0x0F",
            "0x06",
            "0x09",
            "0x37",
            "0x0F",
            "0x11",
            "0x20",
            "0x15"
          ],
          "rawPalette": true
        },
        "transferMatches": [
          {
            "transferId": "0x0F",
            "transferPointerAddress": "0x88B3",
            "paletteAddress": "0x9F5E",
            "paletteBank": 4,
            "bytes": [
              "0x0F",
              "0x00",
              "0x10",
              "0x0B",
              "0x0F",
              "0x0A",
              "0x17",
              "0x00",
              "0x0F",
              "0x06",
              "0x09",
              "0x37",
              "0x0F",
              "0x11",
              "0x20",
              "0x15"
            ]
          }
        ],
        "status": "selector-exact"
      },
      "romContext": {
        "status": "resolved",
        "backgroundContext": {
          "input": {
            "objset": 1,
            "objsetHex": "0x01",
            "area": 1,
            "areaHex": "0x01",
            "submap": 0,
            "submapHex": "0x00"
          },
          "tables": {
            "areaTable": {
              "pointerTableAddress": "0xF7AB",
              "pointerAddress": "0xF7AD",
              "address": "0x873C",
              "bank": 2
            },
            "areaRecord": {
              "pointerAddress": "0x873E",
              "address": "0x8D3A",
              "bank": 2
            },
            "screenRecord": {
              "pointerAddress": "0x8D43",
              "address": "0x8D61",
              "bank": 2,
              "firstBytes": [
                "0x02",
                "0x00",
                "0x00",
                "0x00",
                "0x0F",
                "0x48",
                "0x0F",
                "0x48"
              ],
              "layoutIndex": 2,
              "layoutIndexHex": "0x02"
            },
            "layoutTable": {
              "pointerTableAddress": "0xF7FB",
              "pointerAddress": "0xF7FD",
              "address": "0x8792",
              "bank": 2
            },
            "layoutHeader": {
              "pointerAddress": "0x879A",
              "address": "0x87CF",
              "bank": 2,
              "secondaryAddress": "0x87CE",
              "secondaryBank": 2
            },
            "tileSet": {
              "pointerTableAddress": "0xF7D1",
              "pointerAddress": "0xF7D5",
              "address": "0x8891",
              "bank": 4,
              "auxiliaryAddress": "0xF7EC"
            }
          },
          "derivedDescriptorFields": {
            "layoutBank": 2,
            "layoutHeaderAddress": "0x87CF",
            "layoutHeaderBank": 2,
            "tileBank": 4,
            "tileSetAddress": "0x8891"
          }
        }
      },
      "evidenceStatus": {
        "runtimeContext": "matches",
        "chr": "exact-match",
        "palette": "exact-match",
        "renderRecipe": "recipe-evidence-present"
      }
    },
    {
      "id": "bodley-mansion-door-night",
      "label": "Bodley Mansion door, night",
      "location": "Bodley Mansion - Door",
      "variant": "night",
      "access": "mansion-door",
      "reason": "Night probe for mansion-door exterior palette behavior.",
      "capture": "out/captures/bodley-mansion-door-night",
      "state": "out/states/bodley-mansion-door-night.mss",
      "status": "audited",
      "requiredFiles": [
        {
          "file": "screenshot.png",
          "exists": true
        },
        {
          "file": "cpu-0000-07ff.bin",
          "exists": true
        },
        {
          "file": "ppu-0000-1fff-patterns.bin",
          "exists": true
        },
        {
          "file": "ppu-2000-2fff-nametables.bin",
          "exists": true
        },
        {
          "file": "ppu-3f00-3f1f-palettes.bin",
          "exists": true
        },
        {
          "file": "oam-0000-00ff-sprites.bin",
          "exists": true
        },
        {
          "file": "state.json",
          "exists": true
        }
      ],
      "expectedContext": {
        "status": "matches",
        "expected": [
          {
            "objset": "0x01",
            "area": "0x04",
            "submap": "0x00"
          }
        ]
      },
      "atlasContext": {
        "objset": "0x01",
        "area": "0x04",
        "submap": "0x00"
      },
      "atlasCandidate": {
        "id": "obj01-area04-sub00-bodley-mansion-door",
        "name": "Bodley Mansion - Door",
        "image": "images/obj01-area04-sub00-bodley-mansion-door.png"
      },
      "live": {
        "runtimeContext": {
          "objset": "0x01",
          "area": "0x04",
          "submap": "0x00",
          "submapRaw": "0x80",
          "submapFlags": "0x80",
          "actorPointer": "0x9346",
          "tileSetPointer": "0x8891"
        },
        "ppu": {
          "backgroundPaletteBytes": [
            "0x0F",
            "0x0C",
            "0x1C",
            "0x03",
            "0x0F",
            "0x01",
            "0x11",
            "0x13",
            "0x0F",
            "0x01",
            "0x11",
            "0x13",
            "0x0F",
            "0x01",
            "0x31",
            "0x05"
          ],
          "fullPaletteBytes": [
            "0x0F",
            "0x0C",
            "0x1C",
            "0x03",
            "0x0F",
            "0x01",
            "0x11",
            "0x13",
            "0x0F",
            "0x01",
            "0x11",
            "0x13",
            "0x0F",
            "0x01",
            "0x31",
            "0x05",
            "0x0F",
            "0x0F",
            "0x16",
            "0x20",
            "0x0F",
            "0x27",
            "0x20",
            "0x16",
            "0x0F",
            "0x12",
            "0x20",
            "0x0F",
            "0x0F",
            "0x17",
            "0x20",
            "0x0F"
          ],
          "backgroundPatternAddress": "0x0000",
          "xScroll": 0,
          "videoRamAddress": "0x3B82",
          "tmpVideoRamAddress": "0x3380"
        }
      },
      "chr": {
        "status": "exact-match",
        "banks": [
          {
            "slot": 0,
            "ppuAddress": "0x0000",
            "sha1": "49407ad6e2b59cfcda3e9fa4f96a6776781c9efb",
            "matches": [
              {
                "bank": 8,
                "bankHex": "0x08"
              }
            ],
            "status": "exact-match"
          },
          {
            "slot": 1,
            "ppuAddress": "0x1000",
            "sha1": "0007874eb55a5b5a6f8a5b770d954e728e0b69a3",
            "matches": [
              {
                "bank": 9,
                "bankHex": "0x09"
              }
            ],
            "status": "exact-match"
          }
        ]
      },
      "palette": {
        "selector": {
          "status": "exact-match",
          "variant": "night",
          "runtimeContext": {
            "objset": "0x01",
            "area": "0x04",
            "submap": "0x00"
          },
          "paletteTableAddress": "0x8762",
          "indexListPointerAddress": "0x8774",
          "indexListAddress": "0x9A71",
          "indexOffset": 0,
          "transferId": "0x0D",
          "auxiliaryTransferId": "0x4B",
          "transferPointerAddress": "0x88AF",
          "paletteAddress": "0x9F33",
          "paletteBank": 4,
          "bytes": [
            "0x0F",
            "0x0C",
            "0x1C",
            "0x03",
            "0x0F",
            "0x01",
            "0x11",
            "0x13",
            "0x0F",
            "0x01",
            "0x11",
            "0x13",
            "0x0F",
            "0x01",
            "0x31",
            "0x05"
          ],
          "rawPalette": true
        },
        "transferMatches": [
          {
            "transferId": "0x0D",
            "transferPointerAddress": "0x88AF",
            "paletteAddress": "0x9F33",
            "paletteBank": 4,
            "bytes": [
              "0x0F",
              "0x0C",
              "0x1C",
              "0x03",
              "0x0F",
              "0x01",
              "0x11",
              "0x13",
              "0x0F",
              "0x01",
              "0x11",
              "0x13",
              "0x0F",
              "0x01",
              "0x31",
              "0x05"
            ]
          }
        ],
        "status": "selector-exact"
      },
      "romContext": {
        "status": "resolved",
        "backgroundContext": {
          "input": {
            "objset": 1,
            "objsetHex": "0x01",
            "area": 4,
            "areaHex": "0x04",
            "submap": 0,
            "submapHex": "0x00"
          },
          "tables": {
            "areaTable": {
              "pointerTableAddress": "0xF7AB",
              "pointerAddress": "0xF7AD",
              "address": "0x873C",
              "bank": 2
            },
            "areaRecord": {
              "pointerAddress": "0x8744",
              "address": "0x9A51",
              "bank": 2
            },
            "screenRecord": {
              "pointerAddress": "0x9A5A",
              "address": "0x9A69",
              "bank": 2,
              "firstBytes": [
                "0x02",
                "0x0D",
                "0x0E",
                "0x00",
                "0x13",
                "0x4B",
                "0x13",
                "0x4B"
              ],
              "layoutIndex": 2,
              "layoutIndexHex": "0x02"
            },
            "layoutTable": {
              "pointerTableAddress": "0xF7FB",
              "pointerAddress": "0xF7FD",
              "address": "0x8792",
              "bank": 2
            },
            "layoutHeader": {
              "pointerAddress": "0x879A",
              "address": "0x87CF",
              "bank": 2,
              "secondaryAddress": "0x87CE",
              "secondaryBank": 2
            },
            "tileSet": {
              "pointerTableAddress": "0xF7D1",
              "pointerAddress": "0xF7D5",
              "address": "0x8891",
              "bank": 4,
              "auxiliaryAddress": "0xF7EC"
            }
          },
          "derivedDescriptorFields": {
            "layoutBank": 2,
            "layoutHeaderAddress": "0x87CF",
            "layoutHeaderBank": 2,
            "tileBank": 4,
            "tileSetAddress": "0x8891"
          }
        }
      },
      "evidenceStatus": {
        "runtimeContext": "matches",
        "chr": "exact-match",
        "palette": "exact-match",
        "renderRecipe": "recipe-evidence-present"
      }
    },
    {
      "id": "doina-town-exterior-day",
      "label": "Town of Doina exterior, day",
      "location": "Town of Doina",
      "variant": "day",
      "access": "outdoor",
      "reason": "Additional town exterior day palette and CHR validation.",
      "capture": "out/captures/doina-town-exterior-day",
      "state": "out/states/doina-town-exterior-day.mss",
      "status": "audited",
      "requiredFiles": [
        {
          "file": "screenshot.png",
          "exists": true
        },
        {
          "file": "cpu-0000-07ff.bin",
          "exists": true
        },
        {
          "file": "ppu-0000-1fff-patterns.bin",
          "exists": true
        },
        {
          "file": "ppu-2000-2fff-nametables.bin",
          "exists": true
        },
        {
          "file": "ppu-3f00-3f1f-palettes.bin",
          "exists": true
        },
        {
          "file": "oam-0000-00ff-sprites.bin",
          "exists": true
        },
        {
          "file": "state.json",
          "exists": true
        }
      ],
      "expectedContext": {
        "status": "matches",
        "expected": [
          {
            "objset": "0x00",
            "area": "0x05",
            "submap": "0x00"
          }
        ]
      },
      "atlasContext": {
        "objset": "0x00",
        "area": "0x05",
        "submap": "0x00"
      },
      "atlasCandidate": {
        "id": "obj00-area05-sub00-town-of-doina",
        "name": "Town of Doina",
        "image": "images/obj00-area05-sub00-town-of-doina.png"
      },
      "live": {
        "runtimeContext": {
          "objset": "0x00",
          "area": "0x05",
          "submap": "0x00",
          "submapRaw": "0x00",
          "submapFlags": "0x00",
          "actorPointer": "0x91A1",
          "tileSetPointer": "0x841D"
        },
        "ppu": {
          "backgroundPaletteBytes": [
            "0x0F",
            "0x00",
            "0x10",
            "0x01",
            "0x0F",
            "0x07",
            "0x17",
            "0x10",
            "0x0F",
            "0x00",
            "0x10",
            "0x23",
            "0x0F",
            "0x11",
            "0x20",
            "0x15"
          ],
          "fullPaletteBytes": [
            "0x0F",
            "0x00",
            "0x10",
            "0x01",
            "0x0F",
            "0x07",
            "0x17",
            "0x10",
            "0x0F",
            "0x00",
            "0x10",
            "0x23",
            "0x0F",
            "0x11",
            "0x20",
            "0x15",
            "0x0F",
            "0x0F",
            "0x16",
            "0x20",
            "0x0F",
            "0x27",
            "0x20",
            "0x16",
            "0x0F",
            "0x17",
            "0x20",
            "0x0F",
            "0x0F",
            "0x00",
            "0x20",
            "0x0F"
          ],
          "backgroundPatternAddress": "0x0000",
          "xScroll": 0,
          "videoRamAddress": "0x3B86",
          "tmpVideoRamAddress": "0x3384"
        }
      },
      "chr": {
        "status": "exact-match",
        "banks": [
          {
            "slot": 0,
            "ppuAddress": "0x0000",
            "sha1": "6e0d98e3d50b61e7a0a275c948209bd93018fc47",
            "matches": [
              {
                "bank": 0,
                "bankHex": "0x00"
              }
            ],
            "status": "exact-match"
          },
          {
            "slot": 1,
            "ppuAddress": "0x1000",
            "sha1": "080f054ffbfc6bd18157d9ddebad07d98a649fd3",
            "matches": [
              {
                "bank": 1,
                "bankHex": "0x01"
              }
            ],
            "status": "exact-match"
          }
        ]
      },
      "palette": {
        "selector": {
          "status": "exact-match",
          "variant": "day",
          "runtimeContext": {
            "objset": "0x00",
            "area": "0x05",
            "submap": "0x00"
          },
          "paletteTableAddress": "0x8072",
          "indexListPointerAddress": "0x8086",
          "indexListAddress": "0xFB27",
          "indexOffset": 0,
          "transferId": "0x1B",
          "auxiliaryTransferId": "0x2E",
          "transferPointerAddress": "0x88CB",
          "paletteAddress": "0x9EF7",
          "paletteBank": 4,
          "bytes": [
            "0x0F",
            "0x00",
            "0x10",
            "0x01",
            "0x0F",
            "0x07",
            "0x17",
            "0x10",
            "0x0F",
            "0x00",
            "0x10",
            "0x23",
            "0x0F",
            "0x11",
            "0x20",
            "0x15"
          ],
          "rawPalette": true
        },
        "transferMatches": [
          {
            "transferId": "0x1B",
            "transferPointerAddress": "0x88CB",
            "paletteAddress": "0x9EF7",
            "paletteBank": 4,
            "bytes": [
              "0x0F",
              "0x00",
              "0x10",
              "0x01",
              "0x0F",
              "0x07",
              "0x17",
              "0x10",
              "0x0F",
              "0x00",
              "0x10",
              "0x23",
              "0x0F",
              "0x11",
              "0x20",
              "0x15"
            ]
          }
        ],
        "status": "selector-exact"
      },
      "romContext": {
        "status": "resolved",
        "backgroundContext": {
          "input": {
            "objset": 0,
            "objsetHex": "0x00",
            "area": 5,
            "areaHex": "0x05",
            "submap": 0,
            "submapHex": "0x00"
          },
          "tables": {
            "areaTable": {
              "pointerTableAddress": "0xF7AB",
              "pointerAddress": "0xF7AB",
              "address": "0x8042",
              "bank": 2
            },
            "areaRecord": {
              "pointerAddress": "0x804C",
              "address": "0xFACD"
            },
            "screenRecord": {
              "pointerAddress": "0xFAD6",
              "address": "0xFB1F",
              "firstBytes": [
                "0x00",
                "0x06",
                "0x0A",
                "0x0B",
                "0x0E",
                "0xFF",
                "0x18",
                "0x2E"
              ],
              "layoutIndex": 0,
              "layoutIndexHex": "0x00"
            },
            "layoutTable": {
              "pointerTableAddress": "0xF7FB",
              "pointerAddress": "0xF7FB",
              "address": "0x80D3",
              "bank": 2
            },
            "layoutHeader": {
              "pointerAddress": "0x80D3",
              "address": "0xFB66",
              "secondaryAddress": "0xFB35"
            },
            "tileSet": {
              "pointerTableAddress": "0xF7D1",
              "pointerAddress": "0xF7D1",
              "address": "0x841D",
              "bank": 4,
              "auxiliaryAddress": "0xF7E9"
            }
          },
          "derivedDescriptorFields": {
            "layoutBank": 2,
            "layoutHeaderAddress": "0xFB66",
            "tileBank": 4,
            "tileSetAddress": "0x841D"
          }
        }
      },
      "evidenceStatus": {
        "runtimeContext": "matches",
        "chr": "exact-match",
        "palette": "exact-match",
        "renderRecipe": "recipe-evidence-present"
      }
    },
    {
      "id": "ondol-town-exterior-day",
      "label": "Town of Ondol exterior, day",
      "location": "Town of Ondol",
      "variant": "day",
      "access": "outdoor",
      "reason": "Additional town exterior day palette and CHR validation.",
      "capture": "out/captures/ondol-town-exterior-day",
      "state": "out/states/ondol-town-exterior-day.mss",
      "status": "audited",
      "requiredFiles": [
        {
          "file": "screenshot.png",
          "exists": true
        },
        {
          "file": "cpu-0000-07ff.bin",
          "exists": true
        },
        {
          "file": "ppu-0000-1fff-patterns.bin",
          "exists": true
        },
        {
          "file": "ppu-2000-2fff-nametables.bin",
          "exists": true
        },
        {
          "file": "ppu-3f00-3f1f-palettes.bin",
          "exists": true
        },
        {
          "file": "oam-0000-00ff-sprites.bin",
          "exists": true
        },
        {
          "file": "state.json",
          "exists": true
        }
      ],
      "expectedContext": {
        "status": "matches",
        "expected": [
          {
            "objset": "0x00",
            "area": "0x04",
            "submap": "0x00"
          }
        ]
      },
      "atlasContext": {
        "objset": "0x00",
        "area": "0x04",
        "submap": "0x00"
      },
      "atlasCandidate": {
        "id": "obj00-area04-sub00-town-of-ondol",
        "name": "Town of Ondol",
        "image": "images/obj00-area04-sub00-town-of-ondol.png"
      },
      "live": {
        "runtimeContext": {
          "objset": "0x00",
          "area": "0x04",
          "submap": "0x00",
          "submapRaw": "0x80",
          "submapFlags": "0x80",
          "actorPointer": "0x924F",
          "tileSetPointer": "0x841D"
        },
        "ppu": {
          "backgroundPaletteBytes": [
            "0x0F",
            "0x00",
            "0x10",
            "0x01",
            "0x0F",
            "0x01",
            "0x17",
            "0x33",
            "0x0F",
            "0x00",
            "0x10",
            "0x22",
            "0x0F",
            "0x11",
            "0x20",
            "0x15"
          ],
          "fullPaletteBytes": [
            "0x0F",
            "0x00",
            "0x10",
            "0x01",
            "0x0F",
            "0x01",
            "0x17",
            "0x33",
            "0x0F",
            "0x00",
            "0x10",
            "0x22",
            "0x0F",
            "0x11",
            "0x20",
            "0x15",
            "0x0F",
            "0x0F",
            "0x16",
            "0x20",
            "0x0F",
            "0x27",
            "0x20",
            "0x16",
            "0x0F",
            "0x17",
            "0x20",
            "0x0F",
            "0x0F",
            "0x00",
            "0x20",
            "0x0F"
          ],
          "backgroundPatternAddress": "0x0000",
          "xScroll": 0,
          "videoRamAddress": "0x6B22",
          "tmpVideoRamAddress": "0x6320"
        }
      },
      "chr": {
        "status": "exact-match",
        "banks": [
          {
            "slot": 0,
            "ppuAddress": "0x0000",
            "sha1": "6e0d98e3d50b61e7a0a275c948209bd93018fc47",
            "matches": [
              {
                "bank": 0,
                "bankHex": "0x00"
              }
            ],
            "status": "exact-match"
          },
          {
            "slot": 1,
            "ppuAddress": "0x1000",
            "sha1": "080f054ffbfc6bd18157d9ddebad07d98a649fd3",
            "matches": [
              {
                "bank": 1,
                "bankHex": "0x01"
              }
            ],
            "status": "exact-match"
          }
        ]
      },
      "palette": {
        "selector": {
          "status": "exact-match",
          "variant": "day",
          "runtimeContext": {
            "objset": "0x00",
            "area": "0x04",
            "submap": "0x00"
          },
          "paletteTableAddress": "0x8072",
          "indexListPointerAddress": "0x8082",
          "indexListAddress": "0x86B4",
          "indexOffset": 0,
          "transferId": "0x1A",
          "auxiliaryTransferId": "0x2E",
          "transferPointerAddress": "0x88C9",
          "paletteAddress": "0x9EE6",
          "paletteBank": 4,
          "bytes": [
            "0x0F",
            "0x00",
            "0x10",
            "0x01",
            "0x0F",
            "0x01",
            "0x17",
            "0x33",
            "0x0F",
            "0x00",
            "0x10",
            "0x22",
            "0x0F",
            "0x11",
            "0x20",
            "0x15"
          ],
          "rawPalette": true
        },
        "transferMatches": [
          {
            "transferId": "0x1A",
            "transferPointerAddress": "0x88C9",
            "paletteAddress": "0x9EE6",
            "paletteBank": 4,
            "bytes": [
              "0x0F",
              "0x00",
              "0x10",
              "0x01",
              "0x0F",
              "0x01",
              "0x17",
              "0x33",
              "0x0F",
              "0x00",
              "0x10",
              "0x22",
              "0x0F",
              "0x11",
              "0x20",
              "0x15"
            ]
          }
        ],
        "status": "selector-exact"
      },
      "romContext": {
        "status": "resolved",
        "backgroundContext": {
          "input": {
            "objset": 0,
            "objsetHex": "0x00",
            "area": 4,
            "areaHex": "0x04",
            "submap": 0,
            "submapHex": "0x00"
          },
          "tables": {
            "areaTable": {
              "pointerTableAddress": "0xF7AB",
              "pointerAddress": "0xF7AB",
              "address": "0x8042",
              "bank": 2
            },
            "areaRecord": {
              "pointerAddress": "0x804A",
              "address": "0x8662",
              "bank": 2
            },
            "screenRecord": {
              "pointerAddress": "0x866B",
              "address": "0x86AD",
              "bank": 2,
              "firstBytes": [
                "0x05",
                "0x09",
                "0x0F",
                "0x00",
                "0xFE",
                "0x17",
                "0x2E",
                "0x1A"
              ],
              "layoutIndex": 5,
              "layoutIndexHex": "0x05"
            },
            "layoutTable": {
              "pointerTableAddress": "0xF7FB",
              "pointerAddress": "0xF7FB",
              "address": "0x80D3",
              "bank": 2
            },
            "layoutHeader": {
              "pointerAddress": "0x80E7",
              "address": "0x870A",
              "bank": 2,
              "secondaryAddress": "0x86C5",
              "secondaryBank": 2
            },
            "tileSet": {
              "pointerTableAddress": "0xF7D1",
              "pointerAddress": "0xF7D1",
              "address": "0x841D",
              "bank": 4,
              "auxiliaryAddress": "0xF7E9"
            }
          },
          "derivedDescriptorFields": {
            "layoutBank": 2,
            "layoutHeaderAddress": "0x870A",
            "layoutHeaderBank": 2,
            "tileBank": 4,
            "tileSetAddress": "0x841D"
          }
        }
      },
      "evidenceStatus": {
        "runtimeContext": "matches",
        "chr": "exact-match",
        "palette": "exact-match",
        "renderRecipe": "recipe-evidence-present"
      }
    },
    {
      "id": "north-bridge-day",
      "label": "North Bridge, day",
      "location": "North Bridge",
      "variant": "day",
      "access": "outdoor",
      "reason": "Representative probe for a suspected projected palette issue.",
      "capture": "out/captures/north-bridge-day",
      "state": "out/states/north-bridge-day.mss",
      "status": "audited",
      "requiredFiles": [
        {
          "file": "screenshot.png",
          "exists": true
        },
        {
          "file": "cpu-0000-07ff.bin",
          "exists": true
        },
        {
          "file": "ppu-0000-1fff-patterns.bin",
          "exists": true
        },
        {
          "file": "ppu-2000-2fff-nametables.bin",
          "exists": true
        },
        {
          "file": "ppu-3f00-3f1f-palettes.bin",
          "exists": true
        },
        {
          "file": "oam-0000-00ff-sprites.bin",
          "exists": true
        },
        {
          "file": "state.json",
          "exists": true
        }
      ],
      "expectedContext": {
        "status": "matches",
        "expected": [
          {
            "objset": "0x02",
            "area": "0x08",
            "submap": "0x00"
          }
        ]
      },
      "atlasContext": {
        "objset": "0x02",
        "area": "0x08",
        "submap": "0x00"
      },
      "atlasCandidate": {
        "id": "obj02-area08-sub00-north-bridge",
        "name": "North Bridge",
        "image": "images/obj02-area08-sub00-north-bridge.png"
      },
      "live": {
        "runtimeContext": {
          "objset": "0x02",
          "area": "0x08",
          "submap": "0x00",
          "submapRaw": "0x00",
          "submapFlags": "0x00",
          "actorPointer": "0xA0D0",
          "tileSetPointer": "0x8CF4"
        },
        "ppu": {
          "backgroundPaletteBytes": [
            "0x0F",
            "0x00",
            "0x3B",
            "0x0A",
            "0x0F",
            "0x17",
            "0x1C",
            "0x07",
            "0x0F",
            "0x23",
            "0x20",
            "0x1C",
            "0x0F",
            "0x11",
            "0x20",
            "0x15"
          ],
          "fullPaletteBytes": [
            "0x0F",
            "0x00",
            "0x3B",
            "0x0A",
            "0x0F",
            "0x17",
            "0x1C",
            "0x07",
            "0x0F",
            "0x23",
            "0x20",
            "0x1C",
            "0x0F",
            "0x11",
            "0x20",
            "0x15",
            "0x0F",
            "0x0F",
            "0x16",
            "0x20",
            "0x0F",
            "0x27",
            "0x20",
            "0x16",
            "0x0F",
            "0x18",
            "0x38",
            "0x0F",
            "0x0F",
            "0x17",
            "0x20",
            "0x0F"
          ],
          "backgroundPatternAddress": "0x0000",
          "xScroll": 0,
          "videoRamAddress": "0x3B82",
          "tmpVideoRamAddress": "0x3380"
        }
      },
      "chr": {
        "status": "exact-match",
        "banks": [
          {
            "slot": 0,
            "ppuAddress": "0x0000",
            "sha1": "af90453c4fb4b66a7de212233f3f36ace1f4e5bd",
            "matches": [
              {
                "bank": 2,
                "bankHex": "0x02"
              }
            ],
            "status": "exact-match"
          },
          {
            "slot": 1,
            "ppuAddress": "0x1000",
            "sha1": "50b0d3261453a2e4621abe117ab00d068d7016d5",
            "matches": [
              {
                "bank": 3,
                "bankHex": "0x03"
              }
            ],
            "status": "exact-match"
          }
        ]
      },
      "palette": {
        "selector": {
          "status": "exact-match",
          "variant": "day",
          "runtimeContext": {
            "objset": "0x02",
            "area": "0x08",
            "submap": "0x00"
          },
          "paletteTableAddress": "0x9EF9",
          "indexListPointerAddress": "0x9F19",
          "indexListAddress": "0xA1CE",
          "indexOffset": 0,
          "transferId": "0x20",
          "auxiliaryTransferId": "0x33",
          "transferPointerAddress": "0x88D5",
          "paletteAddress": "0xCB04",
          "bytes": [
            "0x0F",
            "0x00",
            "0x3B",
            "0x0A",
            "0x0F",
            "0x17",
            "0x1C",
            "0x07",
            "0x0F",
            "0x23",
            "0x20",
            "0x1C",
            "0x0F",
            "0x11",
            "0x20",
            "0x15"
          ],
          "rawPalette": true
        },
        "transferMatches": [
          {
            "transferId": "0x20",
            "transferPointerAddress": "0x88D5",
            "paletteAddress": "0xCB04",
            "bytes": [
              "0x0F",
              "0x00",
              "0x3B",
              "0x0A",
              "0x0F",
              "0x17",
              "0x1C",
              "0x07",
              "0x0F",
              "0x23",
              "0x20",
              "0x1C",
              "0x0F",
              "0x11",
              "0x20",
              "0x15"
            ]
          }
        ],
        "status": "selector-exact"
      },
      "romContext": {
        "status": "resolved",
        "backgroundContext": {
          "input": {
            "objset": 2,
            "objsetHex": "0x02",
            "area": 8,
            "areaHex": "0x08",
            "submap": 0,
            "submapHex": "0x00"
          },
          "tables": {
            "areaTable": {
              "pointerTableAddress": "0xF7AB",
              "pointerAddress": "0xF7AF",
              "address": "0x9EE5",
              "bank": 2
            },
            "areaRecord": {
              "pointerAddress": "0x9EF5",
              "address": "0xA17F",
              "bank": 2
            },
            "screenRecord": {
              "pointerAddress": "0xA188",
              "address": "0xA1A9",
              "bank": 2,
              "firstBytes": [
                "0x0B",
                "0x0C",
                "0xFE",
                "0x0D",
                "0xFF",
                "0x00",
                "0x06",
                "0x01"
              ],
              "layoutIndex": 11,
              "layoutIndexHex": "0x0B"
            },
            "layoutTable": {
              "pointerTableAddress": "0xF7FB",
              "pointerAddress": "0xF7FF",
              "address": "0x9F21",
              "bank": 2
            },
            "layoutHeader": {
              "pointerAddress": "0x9F4D",
              "address": "0xA27A",
              "bank": 2,
              "secondaryAddress": "0xA221",
              "secondaryBank": 2
            },
            "tileSet": {
              "pointerTableAddress": "0xF7D1",
              "pointerAddress": "0xF7D9",
              "address": "0x8CF4",
              "bank": 4,
              "auxiliaryAddress": "0xF7EF"
            }
          },
          "derivedDescriptorFields": {
            "layoutBank": 2,
            "layoutHeaderAddress": "0xA27A",
            "layoutHeaderBank": 2,
            "tileBank": 4,
            "tileSetAddress": "0x8CF4"
          }
        }
      },
      "evidenceStatus": {
        "runtimeContext": "matches",
        "chr": "exact-match",
        "palette": "exact-match",
        "renderRecipe": "recipe-evidence-present"
      }
    },
    {
      "id": "north-bridge-night",
      "label": "North Bridge, night",
      "location": "North Bridge",
      "variant": "night",
      "access": "outdoor",
      "reason": "Night variant for suspected palette issue.",
      "capture": "out/captures/north-bridge-night",
      "state": "out/states/north-bridge-night.mss",
      "status": "audited",
      "requiredFiles": [
        {
          "file": "screenshot.png",
          "exists": true
        },
        {
          "file": "cpu-0000-07ff.bin",
          "exists": true
        },
        {
          "file": "ppu-0000-1fff-patterns.bin",
          "exists": true
        },
        {
          "file": "ppu-2000-2fff-nametables.bin",
          "exists": true
        },
        {
          "file": "ppu-3f00-3f1f-palettes.bin",
          "exists": true
        },
        {
          "file": "oam-0000-00ff-sprites.bin",
          "exists": true
        },
        {
          "file": "state.json",
          "exists": true
        }
      ],
      "expectedContext": {
        "status": "matches",
        "expected": [
          {
            "objset": "0x02",
            "area": "0x08",
            "submap": "0x00"
          }
        ]
      },
      "atlasContext": {
        "objset": "0x02",
        "area": "0x08",
        "submap": "0x00"
      },
      "atlasCandidate": {
        "id": "obj02-area08-sub00-north-bridge",
        "name": "North Bridge",
        "image": "images/obj02-area08-sub00-north-bridge.png"
      },
      "live": {
        "runtimeContext": {
          "objset": "0x02",
          "area": "0x08",
          "submap": "0x00",
          "submapRaw": "0x00",
          "submapFlags": "0x00",
          "actorPointer": "0xA0D0",
          "tileSetPointer": "0x8CF4"
        },
        "ppu": {
          "backgroundPaletteBytes": [
            "0x0F",
            "0x00",
            "0x2B",
            "0x0B",
            "0x0F",
            "0x11",
            "0x1C",
            "0x01",
            "0x0F",
            "0x02",
            "0x13",
            "0x0C",
            "0x0F",
            "0x01",
            "0x31",
            "0x05"
          ],
          "fullPaletteBytes": [
            "0x0F",
            "0x00",
            "0x2B",
            "0x0B",
            "0x0F",
            "0x11",
            "0x1C",
            "0x01",
            "0x0F",
            "0x02",
            "0x13",
            "0x0C",
            "0x0F",
            "0x01",
            "0x31",
            "0x05",
            "0x0F",
            "0x0F",
            "0x16",
            "0x20",
            "0x0F",
            "0x27",
            "0x20",
            "0x16",
            "0x0F",
            "0x18",
            "0x38",
            "0x0F",
            "0x0F",
            "0x17",
            "0x20",
            "0x0F"
          ],
          "backgroundPatternAddress": "0x0000",
          "xScroll": 0,
          "videoRamAddress": "0x3B82",
          "tmpVideoRamAddress": "0x3380"
        }
      },
      "chr": {
        "status": "exact-match",
        "banks": [
          {
            "slot": 0,
            "ppuAddress": "0x0000",
            "sha1": "af90453c4fb4b66a7de212233f3f36ace1f4e5bd",
            "matches": [
              {
                "bank": 2,
                "bankHex": "0x02"
              }
            ],
            "status": "exact-match"
          },
          {
            "slot": 1,
            "ppuAddress": "0x1000",
            "sha1": "50b0d3261453a2e4621abe117ab00d068d7016d5",
            "matches": [
              {
                "bank": 3,
                "bankHex": "0x03"
              }
            ],
            "status": "exact-match"
          }
        ]
      },
      "palette": {
        "selector": {
          "status": "exact-match",
          "variant": "night",
          "runtimeContext": {
            "objset": "0x02",
            "area": "0x08",
            "submap": "0x00"
          },
          "paletteTableAddress": "0x9EF9",
          "indexListPointerAddress": "0x9F1B",
          "indexListAddress": "0xA1EC",
          "indexOffset": 0,
          "transferId": "0x21",
          "auxiliaryTransferId": "0x33",
          "transferPointerAddress": "0x88D7",
          "paletteAddress": "0xCB15",
          "bytes": [
            "0x0F",
            "0x00",
            "0x2B",
            "0x0B",
            "0x0F",
            "0x11",
            "0x1C",
            "0x01",
            "0x0F",
            "0x02",
            "0x13",
            "0x0C",
            "0x0F",
            "0x01",
            "0x31",
            "0x05"
          ],
          "rawPalette": true
        },
        "transferMatches": [
          {
            "transferId": "0x21",
            "transferPointerAddress": "0x88D7",
            "paletteAddress": "0xCB15",
            "bytes": [
              "0x0F",
              "0x00",
              "0x2B",
              "0x0B",
              "0x0F",
              "0x11",
              "0x1C",
              "0x01",
              "0x0F",
              "0x02",
              "0x13",
              "0x0C",
              "0x0F",
              "0x01",
              "0x31",
              "0x05"
            ]
          }
        ],
        "status": "selector-exact"
      },
      "romContext": {
        "status": "resolved",
        "backgroundContext": {
          "input": {
            "objset": 2,
            "objsetHex": "0x02",
            "area": 8,
            "areaHex": "0x08",
            "submap": 0,
            "submapHex": "0x00"
          },
          "tables": {
            "areaTable": {
              "pointerTableAddress": "0xF7AB",
              "pointerAddress": "0xF7AF",
              "address": "0x9EE5",
              "bank": 2
            },
            "areaRecord": {
              "pointerAddress": "0x9EF5",
              "address": "0xA17F",
              "bank": 2
            },
            "screenRecord": {
              "pointerAddress": "0xA188",
              "address": "0xA1A9",
              "bank": 2,
              "firstBytes": [
                "0x0B",
                "0x0C",
                "0xFE",
                "0x0D",
                "0xFF",
                "0x00",
                "0x06",
                "0x01"
              ],
              "layoutIndex": 11,
              "layoutIndexHex": "0x0B"
            },
            "layoutTable": {
              "pointerTableAddress": "0xF7FB",
              "pointerAddress": "0xF7FF",
              "address": "0x9F21",
              "bank": 2
            },
            "layoutHeader": {
              "pointerAddress": "0x9F4D",
              "address": "0xA27A",
              "bank": 2,
              "secondaryAddress": "0xA221",
              "secondaryBank": 2
            },
            "tileSet": {
              "pointerTableAddress": "0xF7D1",
              "pointerAddress": "0xF7D9",
              "address": "0x8CF4",
              "bank": 4,
              "auxiliaryAddress": "0xF7EF"
            }
          },
          "derivedDescriptorFields": {
            "layoutBank": 2,
            "layoutHeaderAddress": "0xA27A",
            "layoutHeaderBank": 2,
            "tileBank": 4,
            "tileSetAddress": "0x8CF4"
          }
        }
      },
      "evidenceStatus": {
        "runtimeContext": "matches",
        "chr": "exact-match",
        "palette": "exact-match",
        "renderRecipe": "recipe-evidence-present"
      }
    },
    {
      "id": "deborah-cliff-night",
      "label": "Deborah Cliff, night",
      "location": "Deborah Cliff",
      "variant": "night",
      "access": "outdoor",
      "reason": "Objset 4 night evidence captured while traversing Deborah Cliff/Jam Wasteland.",
      "capture": "out/captures/deborah-cliff-night",
      "state": "out/states/deborah-cliff-night.mss",
      "status": "audited",
      "requiredFiles": [
        {
          "file": "screenshot.png",
          "exists": true
        },
        {
          "file": "cpu-0000-07ff.bin",
          "exists": true
        },
        {
          "file": "ppu-0000-1fff-patterns.bin",
          "exists": true
        },
        {
          "file": "ppu-2000-2fff-nametables.bin",
          "exists": true
        },
        {
          "file": "ppu-3f00-3f1f-palettes.bin",
          "exists": true
        },
        {
          "file": "oam-0000-00ff-sprites.bin",
          "exists": true
        },
        {
          "file": "state.json",
          "exists": true
        }
      ],
      "expectedContext": {
        "status": "matches",
        "expected": [
          {
            "objset": "0x04",
            "area": "0x01",
            "submap": "0x00"
          },
          {
            "objset": "0x04",
            "area": "0x01",
            "submap": "0x01"
          }
        ]
      },
      "live": {
        "runtimeContext": {
          "objset": "0x04",
          "area": "0x01",
          "submap": "0x01",
          "submapRaw": "0x81",
          "submapFlags": "0x80",
          "actorPointer": "0xA885",
          "tileSetPointer": "0x9620"
        },
        "ppu": {
          "backgroundPaletteBytes": [
            "0x0F",
            "0x00",
            "0x2B",
            "0x0B",
            "0x0F",
            "0x11",
            "0x0C",
            "0x0C",
            "0x0F",
            "0x02",
            "0x13",
            "0x0C",
            "0x0F",
            "0x01",
            "0x31",
            "0x05"
          ],
          "fullPaletteBytes": [
            "0x0F",
            "0x00",
            "0x2B",
            "0x0B",
            "0x0F",
            "0x11",
            "0x0C",
            "0x0C",
            "0x0F",
            "0x02",
            "0x13",
            "0x0C",
            "0x0F",
            "0x01",
            "0x31",
            "0x05",
            "0x0F",
            "0x0F",
            "0x16",
            "0x20",
            "0x0F",
            "0x27",
            "0x20",
            "0x16",
            "0x0F",
            "0x18",
            "0x38",
            "0x0F",
            "0x0F",
            "0x17",
            "0x20",
            "0x0F"
          ],
          "backgroundPatternAddress": "0x0000",
          "xScroll": 0,
          "videoRamAddress": "0x6BA2",
          "tmpVideoRamAddress": "0x63A0"
        }
      },
      "chr": {
        "status": "exact-match",
        "banks": [
          {
            "slot": 0,
            "ppuAddress": "0x0000",
            "sha1": "654a48b06d7a29650a56af3265d5bc3054e3561c",
            "matches": [
              {
                "bank": 6,
                "bankHex": "0x06"
              }
            ],
            "status": "exact-match"
          },
          {
            "slot": 1,
            "ppuAddress": "0x1000",
            "sha1": "2d2b862a2e8a4ab6d2d3cb250f74d655bd0f546f",
            "matches": [
              {
                "bank": 7,
                "bankHex": "0x07"
              }
            ],
            "status": "exact-match"
          }
        ]
      },
      "palette": {
        "selector": {
          "status": "exact-match",
          "variant": "night",
          "runtimeContext": {
            "objset": "0x04",
            "area": "0x01",
            "submap": "0x01"
          },
          "paletteTableAddress": "0xAEAD",
          "indexListPointerAddress": "0xAEB3",
          "indexListAddress": "0xAED3",
          "indexOffset": 2,
          "transferId": "0x41",
          "auxiliaryTransferId": "0x44",
          "transferPointerAddress": "0x8917",
          "paletteAddress": "0xA102",
          "paletteBank": 4,
          "bytes": [
            "0x0F",
            "0x00",
            "0x2B",
            "0x0B",
            "0x0F",
            "0x11",
            "0x0C",
            "0x0C",
            "0x0F",
            "0x02",
            "0x13",
            "0x0C",
            "0x0F",
            "0x01",
            "0x31",
            "0x05"
          ],
          "rawPalette": true
        },
        "transferMatches": [
          {
            "transferId": "0x41",
            "transferPointerAddress": "0x8917",
            "paletteAddress": "0xA102",
            "paletteBank": 4,
            "bytes": [
              "0x0F",
              "0x00",
              "0x2B",
              "0x0B",
              "0x0F",
              "0x11",
              "0x0C",
              "0x0C",
              "0x0F",
              "0x02",
              "0x13",
              "0x0C",
              "0x0F",
              "0x01",
              "0x31",
              "0x05"
            ]
          }
        ],
        "status": "selector-exact"
      },
      "romContext": {
        "status": "resolved",
        "backgroundContext": {
          "input": {
            "objset": 4,
            "objsetHex": "0x04",
            "area": 1,
            "areaHex": "0x01",
            "submap": 1,
            "submapHex": "0x01"
          },
          "tables": {
            "areaTable": {
              "pointerTableAddress": "0xF7AB",
              "pointerAddress": "0xF7B3",
              "address": "0xAE64",
              "bank": 2
            },
            "areaRecord": {
              "pointerAddress": "0xAE66",
              "address": "0xAE79",
              "bank": 2
            },
            "screenRecord": {
              "pointerAddress": "0xAE84",
              "address": "0xAEA0",
              "bank": 2,
              "firstBytes": [
                "0x03",
                "0x00",
                "0x01",
                "0x02",
                "0x07",
                "0x00",
                "0x00",
                "0x00"
              ],
              "layoutIndex": 3,
              "layoutIndexHex": "0x03"
            },
            "layoutTable": {
              "pointerTableAddress": "0xF7FB",
              "pointerAddress": "0xF803",
              "address": "0xAEDD",
              "bank": 2
            },
            "layoutHeader": {
              "pointerAddress": "0xAEE9",
              "address": "0xAF34",
              "bank": 2,
              "secondaryAddress": "0xAEFD",
              "secondaryBank": 2
            },
            "tileSet": {
              "pointerTableAddress": "0xF7D1",
              "pointerAddress": "0xF7E1",
              "address": "0x9620",
              "bank": 4,
              "auxiliaryAddress": "0xF7F5"
            }
          },
          "derivedDescriptorFields": {
            "layoutBank": 2,
            "layoutHeaderAddress": "0xAF34",
            "layoutHeaderBank": 2,
            "tileBank": 4,
            "tileSetAddress": "0x9620"
          }
        }
      },
      "evidenceStatus": {
        "runtimeContext": "matches",
        "chr": "exact-match",
        "palette": "exact-match",
        "renderRecipe": "recipe-evidence-present"
      }
    },
    {
      "id": "vrad-graveyard-day",
      "label": "Vrad Graveyard, day",
      "location": "Vrad Graveyard",
      "variant": "day",
      "access": "outdoor",
      "reason": "Representative objset 4 probe for currently scrambled graveyard render.",
      "capture": "out/captures/vrad-graveyard-day",
      "state": "out/states/vrad-graveyard-day.mss",
      "status": "audited",
      "requiredFiles": [
        {
          "file": "screenshot.png",
          "exists": true
        },
        {
          "file": "cpu-0000-07ff.bin",
          "exists": true
        },
        {
          "file": "ppu-0000-1fff-patterns.bin",
          "exists": true
        },
        {
          "file": "ppu-2000-2fff-nametables.bin",
          "exists": true
        },
        {
          "file": "ppu-3f00-3f1f-palettes.bin",
          "exists": true
        },
        {
          "file": "oam-0000-00ff-sprites.bin",
          "exists": true
        },
        {
          "file": "state.json",
          "exists": true
        }
      ],
      "expectedContext": {
        "status": "matches",
        "expected": [
          {
            "objset": "0x04",
            "area": "0x03",
            "submap": "0x00"
          }
        ]
      },
      "atlasContext": {
        "objset": "0x04",
        "area": "0x03",
        "submap": "0x00"
      },
      "atlasCandidate": {
        "id": "obj04-area03-sub00-vrad-graveyard",
        "name": "Vrad Graveyard",
        "image": "images/obj04-area03-sub00-vrad-graveyard.png"
      },
      "live": {
        "runtimeContext": {
          "objset": "0x04",
          "area": "0x03",
          "submap": "0x00",
          "submapRaw": "0x80",
          "submapFlags": "0x80",
          "actorPointer": "0xA8D3",
          "tileSetPointer": "0x9620"
        },
        "ppu": {
          "backgroundPaletteBytes": [
            "0x0F",
            "0x00",
            "0x10",
            "0x0A",
            "0x0F",
            "0x18",
            "0x20",
            "0x08",
            "0x0F",
            "0x33",
            "0x20",
            "0x1C",
            "0x0F",
            "0x11",
            "0x20",
            "0x15"
          ],
          "fullPaletteBytes": [
            "0x0F",
            "0x00",
            "0x10",
            "0x0A",
            "0x0F",
            "0x18",
            "0x20",
            "0x08",
            "0x0F",
            "0x33",
            "0x20",
            "0x1C",
            "0x0F",
            "0x11",
            "0x20",
            "0x15",
            "0x0F",
            "0x0F",
            "0x16",
            "0x20",
            "0x0F",
            "0x27",
            "0x20",
            "0x16",
            "0x0F",
            "0x33",
            "0x20",
            "0x0F",
            "0x0F",
            "0x00",
            "0x20",
            "0x0F"
          ],
          "backgroundPatternAddress": "0x0000",
          "xScroll": 0,
          "videoRamAddress": "0x3F82",
          "tmpVideoRamAddress": "0x3780"
        }
      },
      "chr": {
        "status": "exact-match",
        "banks": [
          {
            "slot": 0,
            "ppuAddress": "0x0000",
            "sha1": "654a48b06d7a29650a56af3265d5bc3054e3561c",
            "matches": [
              {
                "bank": 6,
                "bankHex": "0x06"
              }
            ],
            "status": "exact-match"
          },
          {
            "slot": 1,
            "ppuAddress": "0x1000",
            "sha1": "2d2b862a2e8a4ab6d2d3cb250f74d655bd0f546f",
            "matches": [
              {
                "bank": 7,
                "bankHex": "0x07"
              }
            ],
            "status": "exact-match"
          }
        ]
      },
      "palette": {
        "selector": {
          "status": "exact-match",
          "variant": "day",
          "runtimeContext": {
            "objset": "0x04",
            "area": "0x03",
            "submap": "0x00"
          },
          "paletteTableAddress": "0xAEAD",
          "indexListPointerAddress": "0xAEB9",
          "indexListAddress": "0xAEC9",
          "indexOffset": 0,
          "transferId": "0x42",
          "auxiliaryTransferId": "0x46",
          "transferPointerAddress": "0x8919",
          "paletteAddress": "0xA113",
          "paletteBank": 4,
          "bytes": [
            "0x0F",
            "0x00",
            "0x10",
            "0x0A",
            "0x0F",
            "0x18",
            "0x20",
            "0x08",
            "0x0F",
            "0x33",
            "0x20",
            "0x1C",
            "0x0F",
            "0x11",
            "0x20",
            "0x15"
          ],
          "rawPalette": true
        },
        "transferMatches": [
          {
            "transferId": "0x42",
            "transferPointerAddress": "0x8919",
            "paletteAddress": "0xA113",
            "paletteBank": 4,
            "bytes": [
              "0x0F",
              "0x00",
              "0x10",
              "0x0A",
              "0x0F",
              "0x18",
              "0x20",
              "0x08",
              "0x0F",
              "0x33",
              "0x20",
              "0x1C",
              "0x0F",
              "0x11",
              "0x20",
              "0x15"
            ]
          }
        ],
        "status": "selector-exact"
      },
      "romContext": {
        "status": "resolved",
        "backgroundContext": {
          "input": {
            "objset": 4,
            "objsetHex": "0x04",
            "area": 3,
            "areaHex": "0x03",
            "submap": 0,
            "submapHex": "0x00"
          },
          "tables": {
            "areaTable": {
              "pointerTableAddress": "0xF7AB",
              "pointerAddress": "0xF7B3",
              "address": "0xAE64",
              "bank": 2
            },
            "areaRecord": {
              "pointerAddress": "0xAE6A",
              "address": "0xAE91",
              "bank": 2
            },
            "screenRecord": {
              "pointerAddress": "0xAE9A",
              "address": "0xAEA2",
              "bank": 2,
              "firstBytes": [
                "0x01",
                "0x02",
                "0x07",
                "0x00",
                "0x00",
                "0x00",
                "0x00",
                "0x02"
              ],
              "layoutIndex": 1,
              "layoutIndexHex": "0x01"
            },
            "layoutTable": {
              "pointerTableAddress": "0xF7FB",
              "pointerAddress": "0xF803",
              "address": "0xAEDD",
              "bank": 2
            },
            "layoutHeader": {
              "pointerAddress": "0xAEE1",
              "address": "0xAF10",
              "bank": 2,
              "secondaryAddress": "0xAEFD",
              "secondaryBank": 2
            },
            "tileSet": {
              "pointerTableAddress": "0xF7D1",
              "pointerAddress": "0xF7E1",
              "address": "0x9620",
              "bank": 4,
              "auxiliaryAddress": "0xF7F5"
            }
          },
          "derivedDescriptorFields": {
            "layoutBank": 2,
            "layoutHeaderAddress": "0xAF10",
            "layoutHeaderBank": 2,
            "tileBank": 4,
            "tileSetAddress": "0x9620"
          }
        }
      },
      "evidenceStatus": {
        "runtimeContext": "matches",
        "chr": "exact-match",
        "palette": "exact-match",
        "renderRecipe": "recipe-evidence-present"
      }
    },
    {
      "id": "vrad-graveyard-night",
      "label": "Vrad Graveyard, night",
      "location": "Vrad Graveyard",
      "variant": "night",
      "access": "outdoor",
      "reason": "Night variant for objset 4 graveyard CHR and palette evidence.",
      "capture": "out/captures/vrad-graveyard-night",
      "state": "out/states/vrad-graveyard-night.mss",
      "status": "audited",
      "requiredFiles": [
        {
          "file": "screenshot.png",
          "exists": true
        },
        {
          "file": "cpu-0000-07ff.bin",
          "exists": true
        },
        {
          "file": "ppu-0000-1fff-patterns.bin",
          "exists": true
        },
        {
          "file": "ppu-2000-2fff-nametables.bin",
          "exists": true
        },
        {
          "file": "ppu-3f00-3f1f-palettes.bin",
          "exists": true
        },
        {
          "file": "oam-0000-00ff-sprites.bin",
          "exists": true
        },
        {
          "file": "state.json",
          "exists": true
        }
      ],
      "expectedContext": {
        "status": "matches",
        "expected": [
          {
            "objset": "0x04",
            "area": "0x03",
            "submap": "0x00"
          }
        ]
      },
      "atlasContext": {
        "objset": "0x04",
        "area": "0x03",
        "submap": "0x00"
      },
      "atlasCandidate": {
        "id": "obj04-area03-sub00-vrad-graveyard",
        "name": "Vrad Graveyard",
        "image": "images/obj04-area03-sub00-vrad-graveyard.png"
      },
      "live": {
        "runtimeContext": {
          "objset": "0x04",
          "area": "0x03",
          "submap": "0x00",
          "submapRaw": "0x00",
          "submapFlags": "0x00",
          "actorPointer": "0xA8D3",
          "tileSetPointer": "0x9620"
        },
        "ppu": {
          "backgroundPaletteBytes": [
            "0x0F",
            "0x03",
            "0x13",
            "0x0B",
            "0x0F",
            "0x11",
            "0x1C",
            "0x01",
            "0x0F",
            "0x02",
            "0x1C",
            "0x0C",
            "0x0F",
            "0x01",
            "0x31",
            "0x05"
          ],
          "fullPaletteBytes": [
            "0x0F",
            "0x03",
            "0x13",
            "0x0B",
            "0x0F",
            "0x11",
            "0x1C",
            "0x01",
            "0x0F",
            "0x02",
            "0x1C",
            "0x0C",
            "0x0F",
            "0x01",
            "0x31",
            "0x05",
            "0x0F",
            "0x0F",
            "0x16",
            "0x20",
            "0x0F",
            "0x27",
            "0x20",
            "0x16",
            "0x0F",
            "0x33",
            "0x20",
            "0x0F",
            "0x0F",
            "0x00",
            "0x20",
            "0x0F"
          ],
          "backgroundPatternAddress": "0x0000",
          "xScroll": 0,
          "videoRamAddress": "0x3B82",
          "tmpVideoRamAddress": "0x3380"
        }
      },
      "chr": {
        "status": "exact-match",
        "banks": [
          {
            "slot": 0,
            "ppuAddress": "0x0000",
            "sha1": "654a48b06d7a29650a56af3265d5bc3054e3561c",
            "matches": [
              {
                "bank": 6,
                "bankHex": "0x06"
              }
            ],
            "status": "exact-match"
          },
          {
            "slot": 1,
            "ppuAddress": "0x1000",
            "sha1": "2d2b862a2e8a4ab6d2d3cb250f74d655bd0f546f",
            "matches": [
              {
                "bank": 7,
                "bankHex": "0x07"
              }
            ],
            "status": "exact-match"
          }
        ]
      },
      "palette": {
        "selector": {
          "status": "exact-match",
          "variant": "night",
          "runtimeContext": {
            "objset": "0x04",
            "area": "0x03",
            "submap": "0x00"
          },
          "paletteTableAddress": "0xAEAD",
          "indexListPointerAddress": "0xAEBB",
          "indexListAddress": "0xAED9",
          "indexOffset": 0,
          "transferId": "0x43",
          "auxiliaryTransferId": "0x46",
          "transferPointerAddress": "0x891B",
          "paletteAddress": "0xA124",
          "paletteBank": 4,
          "bytes": [
            "0x0F",
            "0x03",
            "0x13",
            "0x0B",
            "0x0F",
            "0x11",
            "0x1C",
            "0x01",
            "0x0F",
            "0x02",
            "0x1C",
            "0x0C",
            "0x0F",
            "0x01",
            "0x31",
            "0x05"
          ],
          "rawPalette": true
        },
        "transferMatches": [
          {
            "transferId": "0x43",
            "transferPointerAddress": "0x891B",
            "paletteAddress": "0xA124",
            "paletteBank": 4,
            "bytes": [
              "0x0F",
              "0x03",
              "0x13",
              "0x0B",
              "0x0F",
              "0x11",
              "0x1C",
              "0x01",
              "0x0F",
              "0x02",
              "0x1C",
              "0x0C",
              "0x0F",
              "0x01",
              "0x31",
              "0x05"
            ]
          }
        ],
        "status": "selector-exact"
      },
      "romContext": {
        "status": "resolved",
        "backgroundContext": {
          "input": {
            "objset": 4,
            "objsetHex": "0x04",
            "area": 3,
            "areaHex": "0x03",
            "submap": 0,
            "submapHex": "0x00"
          },
          "tables": {
            "areaTable": {
              "pointerTableAddress": "0xF7AB",
              "pointerAddress": "0xF7B3",
              "address": "0xAE64",
              "bank": 2
            },
            "areaRecord": {
              "pointerAddress": "0xAE6A",
              "address": "0xAE91",
              "bank": 2
            },
            "screenRecord": {
              "pointerAddress": "0xAE9A",
              "address": "0xAEA2",
              "bank": 2,
              "firstBytes": [
                "0x01",
                "0x02",
                "0x07",
                "0x00",
                "0x00",
                "0x00",
                "0x00",
                "0x02"
              ],
              "layoutIndex": 1,
              "layoutIndexHex": "0x01"
            },
            "layoutTable": {
              "pointerTableAddress": "0xF7FB",
              "pointerAddress": "0xF803",
              "address": "0xAEDD",
              "bank": 2
            },
            "layoutHeader": {
              "pointerAddress": "0xAEE1",
              "address": "0xAF10",
              "bank": 2,
              "secondaryAddress": "0xAEFD",
              "secondaryBank": 2
            },
            "tileSet": {
              "pointerTableAddress": "0xF7D1",
              "pointerAddress": "0xF7E1",
              "address": "0x9620",
              "bank": 4,
              "auxiliaryAddress": "0xF7F5"
            }
          },
          "derivedDescriptorFields": {
            "layoutBank": 2,
            "layoutHeaderAddress": "0xAF10",
            "layoutHeaderBank": 2,
            "tileBank": 4,
            "tileSetAddress": "0x9620"
          }
        }
      },
      "evidenceStatus": {
        "runtimeContext": "matches",
        "chr": "exact-match",
        "palette": "exact-match",
        "renderRecipe": "recipe-evidence-present"
      }
    },
    {
      "id": "castlevania-bridge-day",
      "label": "Castlevania Bridge, day",
      "location": "Castlevania Bridge",
      "variant": "day",
      "access": "outdoor",
      "reason": "Representative objset 4 bridge probe for currently scrambled render.",
      "capture": "out/captures/castlevania-bridge-day",
      "state": "out/states/castlevania-bridge-day.mss",
      "status": "audited",
      "requiredFiles": [
        {
          "file": "screenshot.png",
          "exists": true
        },
        {
          "file": "cpu-0000-07ff.bin",
          "exists": true
        },
        {
          "file": "ppu-0000-1fff-patterns.bin",
          "exists": true
        },
        {
          "file": "ppu-2000-2fff-nametables.bin",
          "exists": true
        },
        {
          "file": "ppu-3f00-3f1f-palettes.bin",
          "exists": true
        },
        {
          "file": "oam-0000-00ff-sprites.bin",
          "exists": true
        },
        {
          "file": "state.json",
          "exists": true
        }
      ],
      "expectedContext": {
        "status": "matches",
        "expected": [
          {
            "objset": "0x04",
            "area": "0x03",
            "submap": "0x01"
          }
        ]
      },
      "atlasContext": {
        "objset": "0x04",
        "area": "0x03",
        "submap": "0x01"
      },
      "atlasCandidate": {
        "id": "obj04-area03-sub01-castlevania-bridge",
        "name": "Castlevania Bridge",
        "image": "images/obj04-area03-sub01-castlevania-bridge.png"
      },
      "live": {
        "runtimeContext": {
          "objset": "0x04",
          "area": "0x03",
          "submap": "0x01",
          "submapRaw": "0x01",
          "submapFlags": "0x00",
          "actorPointer": "0xA8A9",
          "tileSetPointer": "0x9620"
        },
        "ppu": {
          "backgroundPaletteBytes": [
            "0x0F",
            "0x00",
            "0x3B",
            "0x0A",
            "0x0F",
            "0x17",
            "0x1C",
            "0x07",
            "0x0F",
            "0x23",
            "0x20",
            "0x1C",
            "0x0F",
            "0x11",
            "0x20",
            "0x15"
          ],
          "fullPaletteBytes": [
            "0x0F",
            "0x00",
            "0x3B",
            "0x0A",
            "0x0F",
            "0x17",
            "0x1C",
            "0x07",
            "0x0F",
            "0x23",
            "0x20",
            "0x1C",
            "0x0F",
            "0x11",
            "0x20",
            "0x15",
            "0x0F",
            "0x0F",
            "0x16",
            "0x20",
            "0x0F",
            "0x27",
            "0x20",
            "0x16",
            "0x0F",
            "0x33",
            "0x20",
            "0x0F",
            "0x0F",
            "0x00",
            "0x20",
            "0x0F"
          ],
          "backgroundPatternAddress": "0x0000",
          "xScroll": 0,
          "videoRamAddress": "0x3B82",
          "tmpVideoRamAddress": "0x3380"
        }
      },
      "chr": {
        "status": "exact-match",
        "banks": [
          {
            "slot": 0,
            "ppuAddress": "0x0000",
            "sha1": "654a48b06d7a29650a56af3265d5bc3054e3561c",
            "matches": [
              {
                "bank": 6,
                "bankHex": "0x06"
              }
            ],
            "status": "exact-match"
          },
          {
            "slot": 1,
            "ppuAddress": "0x1000",
            "sha1": "2d2b862a2e8a4ab6d2d3cb250f74d655bd0f546f",
            "matches": [
              {
                "bank": 7,
                "bankHex": "0x07"
              }
            ],
            "status": "exact-match"
          }
        ]
      },
      "palette": {
        "selector": {
          "status": "exact-match",
          "variant": "day",
          "runtimeContext": {
            "objset": "0x04",
            "area": "0x03",
            "submap": "0x01"
          },
          "paletteTableAddress": "0xAEAD",
          "indexListPointerAddress": "0xAEB9",
          "indexListAddress": "0xAEC9",
          "indexOffset": 2,
          "transferId": "0x20",
          "auxiliaryTransferId": "0x46",
          "transferPointerAddress": "0x88D5",
          "paletteAddress": "0xCB04",
          "bytes": [
            "0x0F",
            "0x00",
            "0x3B",
            "0x0A",
            "0x0F",
            "0x17",
            "0x1C",
            "0x07",
            "0x0F",
            "0x23",
            "0x20",
            "0x1C",
            "0x0F",
            "0x11",
            "0x20",
            "0x15"
          ],
          "rawPalette": true
        },
        "transferMatches": [
          {
            "transferId": "0x20",
            "transferPointerAddress": "0x88D5",
            "paletteAddress": "0xCB04",
            "bytes": [
              "0x0F",
              "0x00",
              "0x3B",
              "0x0A",
              "0x0F",
              "0x17",
              "0x1C",
              "0x07",
              "0x0F",
              "0x23",
              "0x20",
              "0x1C",
              "0x0F",
              "0x11",
              "0x20",
              "0x15"
            ]
          }
        ],
        "status": "selector-exact"
      },
      "romContext": {
        "status": "resolved",
        "backgroundContext": {
          "input": {
            "objset": 4,
            "objsetHex": "0x04",
            "area": 3,
            "areaHex": "0x03",
            "submap": 1,
            "submapHex": "0x01"
          },
          "tables": {
            "areaTable": {
              "pointerTableAddress": "0xF7AB",
              "pointerAddress": "0xF7B3",
              "address": "0xAE64",
              "bank": 2
            },
            "areaRecord": {
              "pointerAddress": "0xAE6A",
              "address": "0xAE91",
              "bank": 2
            },
            "screenRecord": {
              "pointerAddress": "0xAE9C",
              "address": "0xAEA3",
              "bank": 2,
              "firstBytes": [
                "0x02",
                "0x07",
                "0x00",
                "0x00",
                "0x00",
                "0x00",
                "0x02",
                "0x00"
              ],
              "layoutIndex": 2,
              "layoutIndexHex": "0x02"
            },
            "layoutTable": {
              "pointerTableAddress": "0xF7FB",
              "pointerAddress": "0xF803",
              "address": "0xAEDD",
              "bank": 2
            },
            "layoutHeader": {
              "pointerAddress": "0xAEE5",
              "address": "0xAF22",
              "bank": 2,
              "secondaryAddress": "0xAEFD",
              "secondaryBank": 2
            },
            "tileSet": {
              "pointerTableAddress": "0xF7D1",
              "pointerAddress": "0xF7E1",
              "address": "0x9620",
              "bank": 4,
              "auxiliaryAddress": "0xF7F5"
            }
          },
          "derivedDescriptorFields": {
            "layoutBank": 2,
            "layoutHeaderAddress": "0xAF22",
            "layoutHeaderBank": 2,
            "tileBank": 4,
            "tileSetAddress": "0x9620"
          }
        }
      },
      "evidenceStatus": {
        "runtimeContext": "matches",
        "chr": "exact-match",
        "palette": "exact-match",
        "renderRecipe": "recipe-evidence-present"
      }
    },
    {
      "id": "castlevania-bridge-night",
      "label": "Castlevania Bridge, night",
      "location": "Castlevania Bridge",
      "variant": "night",
      "access": "outdoor",
      "reason": "Night variant for objset 4 bridge CHR and palette evidence.",
      "capture": "out/captures/castlevania-bridge-night",
      "state": "out/states/castlevania-bridge-night.mss",
      "status": "audited",
      "requiredFiles": [
        {
          "file": "screenshot.png",
          "exists": true
        },
        {
          "file": "cpu-0000-07ff.bin",
          "exists": true
        },
        {
          "file": "ppu-0000-1fff-patterns.bin",
          "exists": true
        },
        {
          "file": "ppu-2000-2fff-nametables.bin",
          "exists": true
        },
        {
          "file": "ppu-3f00-3f1f-palettes.bin",
          "exists": true
        },
        {
          "file": "oam-0000-00ff-sprites.bin",
          "exists": true
        },
        {
          "file": "state.json",
          "exists": true
        }
      ],
      "expectedContext": {
        "status": "matches",
        "expected": [
          {
            "objset": "0x04",
            "area": "0x03",
            "submap": "0x01"
          }
        ]
      },
      "atlasContext": {
        "objset": "0x04",
        "area": "0x03",
        "submap": "0x01"
      },
      "atlasCandidate": {
        "id": "obj04-area03-sub01-castlevania-bridge",
        "name": "Castlevania Bridge",
        "image": "images/obj04-area03-sub01-castlevania-bridge.png"
      },
      "live": {
        "runtimeContext": {
          "objset": "0x04",
          "area": "0x03",
          "submap": "0x01",
          "submapRaw": "0x01",
          "submapFlags": "0x00",
          "actorPointer": "0xA8A9",
          "tileSetPointer": "0x9620"
        },
        "ppu": {
          "backgroundPaletteBytes": [
            "0x0F",
            "0x00",
            "0x2B",
            "0x0B",
            "0x0F",
            "0x11",
            "0x1C",
            "0x01",
            "0x0F",
            "0x02",
            "0x13",
            "0x0C",
            "0x0F",
            "0x01",
            "0x31",
            "0x05"
          ],
          "fullPaletteBytes": [
            "0x0F",
            "0x00",
            "0x2B",
            "0x0B",
            "0x0F",
            "0x11",
            "0x1C",
            "0x01",
            "0x0F",
            "0x02",
            "0x13",
            "0x0C",
            "0x0F",
            "0x01",
            "0x31",
            "0x05",
            "0x0F",
            "0x0F",
            "0x16",
            "0x20",
            "0x0F",
            "0x27",
            "0x20",
            "0x16",
            "0x0F",
            "0x33",
            "0x20",
            "0x0F",
            "0x0F",
            "0x00",
            "0x20",
            "0x0F"
          ],
          "backgroundPatternAddress": "0x0000",
          "xScroll": 0,
          "videoRamAddress": "0x3B82",
          "tmpVideoRamAddress": "0x3380"
        }
      },
      "chr": {
        "status": "exact-match",
        "banks": [
          {
            "slot": 0,
            "ppuAddress": "0x0000",
            "sha1": "654a48b06d7a29650a56af3265d5bc3054e3561c",
            "matches": [
              {
                "bank": 6,
                "bankHex": "0x06"
              }
            ],
            "status": "exact-match"
          },
          {
            "slot": 1,
            "ppuAddress": "0x1000",
            "sha1": "2d2b862a2e8a4ab6d2d3cb250f74d655bd0f546f",
            "matches": [
              {
                "bank": 7,
                "bankHex": "0x07"
              }
            ],
            "status": "exact-match"
          }
        ]
      },
      "palette": {
        "selector": {
          "status": "exact-match",
          "variant": "night",
          "runtimeContext": {
            "objset": "0x04",
            "area": "0x03",
            "submap": "0x01"
          },
          "paletteTableAddress": "0xAEAD",
          "indexListPointerAddress": "0xAEBB",
          "indexListAddress": "0xAED9",
          "indexOffset": 2,
          "transferId": "0x21",
          "auxiliaryTransferId": "0x46",
          "transferPointerAddress": "0x88D7",
          "paletteAddress": "0xCB15",
          "bytes": [
            "0x0F",
            "0x00",
            "0x2B",
            "0x0B",
            "0x0F",
            "0x11",
            "0x1C",
            "0x01",
            "0x0F",
            "0x02",
            "0x13",
            "0x0C",
            "0x0F",
            "0x01",
            "0x31",
            "0x05"
          ],
          "rawPalette": true
        },
        "transferMatches": [
          {
            "transferId": "0x21",
            "transferPointerAddress": "0x88D7",
            "paletteAddress": "0xCB15",
            "bytes": [
              "0x0F",
              "0x00",
              "0x2B",
              "0x0B",
              "0x0F",
              "0x11",
              "0x1C",
              "0x01",
              "0x0F",
              "0x02",
              "0x13",
              "0x0C",
              "0x0F",
              "0x01",
              "0x31",
              "0x05"
            ]
          }
        ],
        "status": "selector-exact"
      },
      "romContext": {
        "status": "resolved",
        "backgroundContext": {
          "input": {
            "objset": 4,
            "objsetHex": "0x04",
            "area": 3,
            "areaHex": "0x03",
            "submap": 1,
            "submapHex": "0x01"
          },
          "tables": {
            "areaTable": {
              "pointerTableAddress": "0xF7AB",
              "pointerAddress": "0xF7B3",
              "address": "0xAE64",
              "bank": 2
            },
            "areaRecord": {
              "pointerAddress": "0xAE6A",
              "address": "0xAE91",
              "bank": 2
            },
            "screenRecord": {
              "pointerAddress": "0xAE9C",
              "address": "0xAEA3",
              "bank": 2,
              "firstBytes": [
                "0x02",
                "0x07",
                "0x00",
                "0x00",
                "0x00",
                "0x00",
                "0x02",
                "0x00"
              ],
              "layoutIndex": 2,
              "layoutIndexHex": "0x02"
            },
            "layoutTable": {
              "pointerTableAddress": "0xF7FB",
              "pointerAddress": "0xF803",
              "address": "0xAEDD",
              "bank": 2
            },
            "layoutHeader": {
              "pointerAddress": "0xAEE5",
              "address": "0xAF22",
              "bank": 2,
              "secondaryAddress": "0xAEFD",
              "secondaryBank": 2
            },
            "tileSet": {
              "pointerTableAddress": "0xF7D1",
              "pointerAddress": "0xF7E1",
              "address": "0x9620",
              "bank": 4,
              "auxiliaryAddress": "0xF7F5"
            }
          },
          "derivedDescriptorFields": {
            "layoutBank": 2,
            "layoutHeaderAddress": "0xAF22",
            "layoutHeaderBank": 2,
            "tileBank": 4,
            "tileSetAddress": "0x9620"
          }
        }
      },
      "evidenceStatus": {
        "runtimeContext": "matches",
        "chr": "exact-match",
        "palette": "exact-match",
        "renderRecipe": "recipe-evidence-present"
      }
    },
    {
      "id": "castlevania-final-area",
      "label": "Castlevania final area",
      "location": "Castlevania",
      "variant": "fixed",
      "access": "final-area",
      "reason": "Representative fixed-palette final Castlevania area; the game transitions from Castlevania Bridge directly inside.",
      "capture": "out/captures/castlevania-final-area",
      "state": "out/states/castlevania.mss",
      "status": "audited",
      "requiredFiles": [
        {
          "file": "screenshot.png",
          "exists": true
        },
        {
          "file": "cpu-0000-07ff.bin",
          "exists": true
        },
        {
          "file": "ppu-0000-1fff-patterns.bin",
          "exists": true
        },
        {
          "file": "ppu-2000-2fff-nametables.bin",
          "exists": true
        },
        {
          "file": "ppu-3f00-3f1f-palettes.bin",
          "exists": true
        },
        {
          "file": "oam-0000-00ff-sprites.bin",
          "exists": true
        },
        {
          "file": "state.json",
          "exists": true
        }
      ],
      "expectedContext": {
        "status": "matches",
        "expected": [
          {
            "objset": "0x05",
            "area": "0x00",
            "submap": "0x00"
          }
        ]
      },
      "atlasContext": {
        "objset": "0x05",
        "area": "0x00",
        "submap": "0x00"
      },
      "atlasCandidate": {
        "id": "obj05-area00-sub00-castlevania",
        "name": "Castlevania",
        "image": "images/obj05-area00-sub00-castlevania.png"
      },
      "live": {
        "runtimeContext": {
          "objset": "0x05",
          "area": "0x00",
          "submap": "0x00",
          "submapRaw": "0x00",
          "submapFlags": "0x00",
          "actorPointer": "0xB3FE",
          "tileSetPointer": "0x9A3F"
        },
        "ppu": {
          "backgroundPaletteBytes": [
            "0x0F",
            "0x00",
            "0x10",
            "0x13",
            "0x0F",
            "0x00",
            "0x10",
            "0x22",
            "0x0F",
            "0x00",
            "0x09",
            "0x22",
            "0x0F",
            "0x01",
            "0x20",
            "0x05"
          ],
          "fullPaletteBytes": [
            "0x0F",
            "0x00",
            "0x10",
            "0x13",
            "0x0F",
            "0x00",
            "0x10",
            "0x22",
            "0x0F",
            "0x00",
            "0x09",
            "0x22",
            "0x0F",
            "0x01",
            "0x20",
            "0x05",
            "0x0F",
            "0x0F",
            "0x16",
            "0x20",
            "0x0F",
            "0x27",
            "0x20",
            "0x16",
            "0x0F",
            "0x05",
            "0x35",
            "0x0F",
            "0x0F",
            "0x00",
            "0x20",
            "0x0F"
          ],
          "backgroundPatternAddress": "0x0000",
          "xScroll": 0,
          "videoRamAddress": "0x1882",
          "tmpVideoRamAddress": "0x1080"
        }
      },
      "chr": {
        "status": "exact-match",
        "banks": [
          {
            "slot": 0,
            "ppuAddress": "0x0000",
            "sha1": "8868aeafd84d728be3f14452a0cb3b70984521f9",
            "matches": [
              {
                "bank": 11,
                "bankHex": "0x0B"
              }
            ],
            "status": "exact-match"
          },
          {
            "slot": 1,
            "ppuAddress": "0x1000",
            "sha1": "88c7691475f8aca5ff0fdf0df4acd829afdfa351",
            "matches": [
              {
                "bank": 12,
                "bankHex": "0x0C"
              }
            ],
            "status": "exact-match"
          }
        ]
      },
      "palette": {
        "selector": {
          "status": "exact-match",
          "variant": "day",
          "runtimeContext": {
            "objset": "0x05",
            "area": "0x00",
            "submap": "0x00"
          },
          "paletteTableAddress": "0xBC4E",
          "indexListPointerAddress": "0xBC4E",
          "indexListAddress": "0xBC52",
          "indexOffset": 0,
          "transferId": "0x57",
          "auxiliaryTransferId": "0x4C",
          "transferPointerAddress": "0x8943",
          "paletteAddress": "0xA150",
          "paletteBank": 4,
          "bytes": [
            "0x0F",
            "0x00",
            "0x10",
            "0x13",
            "0x0F",
            "0x00",
            "0x10",
            "0x22",
            "0x0F",
            "0x00",
            "0x09",
            "0x22",
            "0x0F",
            "0x01",
            "0x20",
            "0x05"
          ],
          "rawPalette": true
        },
        "transferMatches": [
          {
            "transferId": "0x57",
            "transferPointerAddress": "0x8943",
            "paletteAddress": "0xA150",
            "paletteBank": 4,
            "bytes": [
              "0x0F",
              "0x00",
              "0x10",
              "0x13",
              "0x0F",
              "0x00",
              "0x10",
              "0x22",
              "0x0F",
              "0x00",
              "0x09",
              "0x22",
              "0x0F",
              "0x01",
              "0x20",
              "0x05"
            ]
          }
        ],
        "status": "selector-exact"
      },
      "romContext": {
        "status": "resolved",
        "backgroundContext": {
          "input": {
            "objset": 5,
            "objsetHex": "0x05",
            "area": 0,
            "areaHex": "0x00",
            "submap": 0,
            "submapHex": "0x00"
          },
          "tables": {
            "areaTable": {
              "pointerTableAddress": "0xF7AB",
              "pointerAddress": "0xF7B5",
              "address": "0xBC56",
              "bank": 2
            },
            "areaRecord": {
              "pointerAddress": "0xBC56",
              "address": "0xBC58",
              "bank": 2
            },
            "screenRecord": {
              "pointerAddress": "0xBC61",
              "address": "0xBC65",
              "bank": 2,
              "firstBytes": [
                "0x00",
                "0x01",
                "0xFD",
                "0x77",
                "0x9A",
                "0xEB",
                "0xA6",
                "0x59"
              ],
              "layoutIndex": 0,
              "layoutIndexHex": "0x00"
            },
            "layoutTable": {
              "pointerTableAddress": "0xF7FB",
              "pointerAddress": "0xF805",
              "address": "0xBC46",
              "bank": 2
            },
            "layoutHeader": {
              "pointerAddress": "0xBC46",
              "address": "0xBC82",
              "bank": 2,
              "secondaryAddress": "0xBC68",
              "secondaryBank": 2
            },
            "tileSet": {
              "pointerTableAddress": "0xF7D1",
              "pointerAddress": "0xF7E5",
              "address": "0x9A3F",
              "bank": 4,
              "auxiliaryAddress": "0xF7F8"
            }
          },
          "derivedDescriptorFields": {
            "layoutBank": 2,
            "layoutHeaderAddress": "0xBC82",
            "layoutHeaderBank": 2,
            "tileBank": 4,
            "tileSetAddress": "0x9A3F"
          }
        }
      },
      "evidenceStatus": {
        "runtimeContext": "matches",
        "chr": "exact-match",
        "palette": "exact-match",
        "renderRecipe": "recipe-evidence-present"
      }
    },
    {
      "id": "jova-town-interior-day",
      "label": "Jova town interior, day",
      "location": "Jova town interior",
      "variant": "day",
      "access": "town-interior",
      "reason": "Representative town-interior render family; exact room context is read from live state.",
      "capture": "out/captures/jova-town-interior-day",
      "state": "out/states/jova-town-interior-day.mss",
      "status": "audited",
      "requiredFiles": [
        {
          "file": "screenshot.png",
          "exists": true
        },
        {
          "file": "cpu-0000-07ff.bin",
          "exists": true
        },
        {
          "file": "ppu-0000-1fff-patterns.bin",
          "exists": true
        },
        {
          "file": "ppu-2000-2fff-nametables.bin",
          "exists": true
        },
        {
          "file": "ppu-3f00-3f1f-palettes.bin",
          "exists": true
        },
        {
          "file": "oam-0000-00ff-sprites.bin",
          "exists": true
        },
        {
          "file": "state.json",
          "exists": true
        }
      ],
      "expectedContext": {
        "status": "matches",
        "expected": [
          {
            "objset": "0x00",
            "area": "0x08",
            "submap": "0x00"
          },
          {
            "objset": "0x00",
            "area": "0x09",
            "submap": "0x00"
          }
        ]
      },
      "live": {
        "runtimeContext": {
          "objset": "0x00",
          "area": "0x08",
          "submap": "0x00",
          "submapRaw": "0x00",
          "submapFlags": "0x00",
          "actorPointer": "0x913E",
          "tileSetPointer": "0x841D"
        },
        "ppu": {
          "backgroundPaletteBytes": [
            "0x0F",
            "0x00",
            "0x3C",
            "0x0C",
            "0x0F",
            "0x03",
            "0x13",
            "0x33",
            "0x0F",
            "0x00",
            "0x20",
            "0x21",
            "0x0F",
            "0x11",
            "0x20",
            "0x15"
          ],
          "fullPaletteBytes": [
            "0x0F",
            "0x00",
            "0x3C",
            "0x0C",
            "0x0F",
            "0x03",
            "0x13",
            "0x33",
            "0x0F",
            "0x00",
            "0x20",
            "0x21",
            "0x0F",
            "0x11",
            "0x20",
            "0x15",
            "0x0F",
            "0x0F",
            "0x16",
            "0x20",
            "0x0F",
            "0x27",
            "0x20",
            "0x16",
            "0x0F",
            "0x17",
            "0x20",
            "0x0F",
            "0x0F",
            "0x00",
            "0x20",
            "0x0F"
          ],
          "backgroundPatternAddress": "0x0000",
          "xScroll": 0,
          "videoRamAddress": "0x3B82",
          "tmpVideoRamAddress": "0x3380"
        }
      },
      "chr": {
        "status": "exact-match",
        "banks": [
          {
            "slot": 0,
            "ppuAddress": "0x0000",
            "sha1": "6e0d98e3d50b61e7a0a275c948209bd93018fc47",
            "matches": [
              {
                "bank": 0,
                "bankHex": "0x00"
              }
            ],
            "status": "exact-match"
          },
          {
            "slot": 1,
            "ppuAddress": "0x1000",
            "sha1": "080f054ffbfc6bd18157d9ddebad07d98a649fd3",
            "matches": [
              {
                "bank": 1,
                "bankHex": "0x01"
              }
            ],
            "status": "exact-match"
          }
        ]
      },
      "palette": {
        "selector": {
          "status": "exact-match",
          "variant": "day",
          "runtimeContext": {
            "objset": "0x00",
            "area": "0x08",
            "submap": "0x00"
          },
          "paletteTableAddress": "0x8072",
          "indexListPointerAddress": "0x8092",
          "indexListAddress": "0xFA42",
          "indexOffset": 0,
          "transferId": "0x15",
          "auxiliaryTransferId": "0x2E",
          "transferPointerAddress": "0x88BF",
          "paletteAddress": "0x9E91",
          "paletteBank": 4,
          "bytes": [
            "0x0F",
            "0x00",
            "0x3C",
            "0x0C",
            "0x0F",
            "0x03",
            "0x13",
            "0x33",
            "0x0F",
            "0x00",
            "0x20",
            "0x21",
            "0x0F",
            "0x11",
            "0x20",
            "0x15"
          ],
          "rawPalette": true
        },
        "transferMatches": [
          {
            "transferId": "0x15",
            "transferPointerAddress": "0x88BF",
            "paletteAddress": "0x9E91",
            "paletteBank": 4,
            "bytes": [
              "0x0F",
              "0x00",
              "0x3C",
              "0x0C",
              "0x0F",
              "0x03",
              "0x13",
              "0x33",
              "0x0F",
              "0x00",
              "0x20",
              "0x21",
              "0x0F",
              "0x11",
              "0x20",
              "0x15"
            ]
          }
        ],
        "status": "selector-exact"
      },
      "romContext": {
        "status": "resolved",
        "backgroundContext": {
          "input": {
            "objset": 0,
            "objsetHex": "0x00",
            "area": 8,
            "areaHex": "0x08",
            "submap": 0,
            "submapHex": "0x00"
          },
          "tables": {
            "areaTable": {
              "pointerTableAddress": "0xF7AB",
              "pointerAddress": "0xF7AB",
              "address": "0x8042",
              "bank": 2
            },
            "areaRecord": {
              "pointerAddress": "0x8052",
              "address": "0xFA15"
            },
            "screenRecord": {
              "pointerAddress": "0xFA1E",
              "address": "0x800C",
              "bank": 2,
              "firstBytes": [
                "0x07",
                "0x08",
                "0x0C",
                "0x0D",
                "0x01",
                "0x01",
                "0x9F",
                "0x82"
              ],
              "layoutIndex": 7,
              "layoutIndexHex": "0x07"
            },
            "layoutTable": {
              "pointerTableAddress": "0xF7FB",
              "pointerAddress": "0xF7FB",
              "address": "0x80D3",
              "bank": 2
            },
            "layoutHeader": {
              "pointerAddress": "0x80EF",
              "address": "0x8016",
              "bank": 2,
              "secondaryAddress": "0x8041",
              "secondaryBank": 2
            },
            "tileSet": {
              "pointerTableAddress": "0xF7D1",
              "pointerAddress": "0xF7D1",
              "address": "0x841D",
              "bank": 4,
              "auxiliaryAddress": "0xF7E9"
            }
          },
          "derivedDescriptorFields": {
            "layoutBank": 2,
            "layoutHeaderAddress": "0x8016",
            "layoutHeaderBank": 2,
            "tileBank": 4,
            "tileSetAddress": "0x841D"
          }
        }
      },
      "evidenceStatus": {
        "runtimeContext": "matches",
        "chr": "exact-match",
        "palette": "exact-match",
        "renderRecipe": "recipe-evidence-present"
      }
    },
    {
      "id": "doina-church-interior-day",
      "label": "Town of Doina church interior, day",
      "location": "Town of Doina church interior",
      "variant": "day",
      "access": "town-interior",
      "reason": "Additional town-interior probe for church recipe behavior.",
      "capture": "out/captures/doina-church-interior-day",
      "state": "out/states/doina-church-interior-day.mss",
      "status": "audited",
      "requiredFiles": [
        {
          "file": "screenshot.png",
          "exists": true
        },
        {
          "file": "cpu-0000-07ff.bin",
          "exists": true
        },
        {
          "file": "ppu-0000-1fff-patterns.bin",
          "exists": true
        },
        {
          "file": "ppu-2000-2fff-nametables.bin",
          "exists": true
        },
        {
          "file": "ppu-3f00-3f1f-palettes.bin",
          "exists": true
        },
        {
          "file": "oam-0000-00ff-sprites.bin",
          "exists": true
        },
        {
          "file": "state.json",
          "exists": true
        }
      ],
      "expectedContext": {
        "status": "matches",
        "expected": [
          {
            "objset": "0x00",
            "area": "0x07",
            "submap": "0x00"
          }
        ]
      },
      "atlasContext": {
        "objset": "0x00",
        "area": "0x07",
        "submap": "0x00"
      },
      "live": {
        "runtimeContext": {
          "objset": "0x00",
          "area": "0x07",
          "submap": "0x00",
          "submapRaw": "0x00",
          "submapFlags": "0x00",
          "actorPointer": "0x8EDD",
          "tileSetPointer": "0x841D"
        },
        "ppu": {
          "backgroundPaletteBytes": [
            "0x0F",
            "0x00",
            "0x10",
            "0x01",
            "0x0F",
            "0x02",
            "0x12",
            "0x20",
            "0x0F",
            "0x00",
            "0x10",
            "0x20",
            "0x0F",
            "0x11",
            "0x20",
            "0x15"
          ],
          "fullPaletteBytes": [
            "0x0F",
            "0x00",
            "0x10",
            "0x01",
            "0x0F",
            "0x02",
            "0x12",
            "0x20",
            "0x0F",
            "0x00",
            "0x10",
            "0x20",
            "0x0F",
            "0x11",
            "0x20",
            "0x15",
            "0x0F",
            "0x0F",
            "0x16",
            "0x20",
            "0x0F",
            "0x27",
            "0x20",
            "0x16",
            "0x0F",
            "0x17",
            "0x20",
            "0x0F",
            "0x0F",
            "0x00",
            "0x20",
            "0x0F"
          ],
          "backgroundPatternAddress": "0x0000",
          "xScroll": 0,
          "videoRamAddress": "0x3B82",
          "tmpVideoRamAddress": "0x3380"
        }
      },
      "chr": {
        "status": "exact-match",
        "banks": [
          {
            "slot": 0,
            "ppuAddress": "0x0000",
            "sha1": "6e0d98e3d50b61e7a0a275c948209bd93018fc47",
            "matches": [
              {
                "bank": 0,
                "bankHex": "0x00"
              }
            ],
            "status": "exact-match"
          },
          {
            "slot": 1,
            "ppuAddress": "0x1000",
            "sha1": "080f054ffbfc6bd18157d9ddebad07d98a649fd3",
            "matches": [
              {
                "bank": 1,
                "bankHex": "0x01"
              }
            ],
            "status": "exact-match"
          }
        ]
      },
      "palette": {
        "selector": {
          "status": "exact-match",
          "variant": "day",
          "runtimeContext": {
            "objset": "0x00",
            "area": "0x07",
            "submap": "0x00"
          },
          "paletteTableAddress": "0x8072",
          "indexListPointerAddress": "0x808E",
          "indexListAddress": "0x8032",
          "indexOffset": 0,
          "transferId": "0x1D",
          "auxiliaryTransferId": "0x2E",
          "transferPointerAddress": "0x88CF",
          "paletteAddress": "0x9F19",
          "paletteBank": 4,
          "bytes": [
            "0x0F",
            "0x00",
            "0x10",
            "0x01",
            "0x0F",
            "0x02",
            "0x12",
            "0x20",
            "0x0F",
            "0x00",
            "0x10",
            "0x20",
            "0x0F",
            "0x11",
            "0x20",
            "0x15"
          ],
          "rawPalette": true
        },
        "transferMatches": [
          {
            "transferId": "0x1D",
            "transferPointerAddress": "0x88CF",
            "paletteAddress": "0x9F19",
            "paletteBank": 4,
            "bytes": [
              "0x0F",
              "0x00",
              "0x10",
              "0x01",
              "0x0F",
              "0x02",
              "0x12",
              "0x20",
              "0x0F",
              "0x00",
              "0x10",
              "0x20",
              "0x0F",
              "0x11",
              "0x20",
              "0x15"
            ]
          }
        ],
        "status": "selector-exact"
      },
      "romContext": {
        "status": "resolved",
        "backgroundContext": {
          "input": {
            "objset": 0,
            "objsetHex": "0x00",
            "area": 7,
            "areaHex": "0x07",
            "submap": 0,
            "submapHex": "0x00"
          },
          "tables": {
            "areaTable": {
              "pointerTableAddress": "0xF7AB",
              "pointerAddress": "0xF7AB",
              "address": "0x8042",
              "bank": 2
            },
            "areaRecord": {
              "pointerAddress": "0x8050",
              "address": "0x8000",
              "bank": 2
            },
            "screenRecord": {
              "pointerAddress": "0x8009",
              "address": "0x800B",
              "bank": 2,
              "firstBytes": [
                "0x10",
                "0x07",
                "0x08",
                "0x0C",
                "0x0D",
                "0x01",
                "0x01",
                "0x9F"
              ],
              "layoutIndex": 16,
              "layoutIndexHex": "0x10"
            },
            "layoutTable": {
              "pointerTableAddress": "0xF7FB",
              "pointerAddress": "0xF7FB",
              "address": "0x80D3",
              "bank": 2
            },
            "layoutHeader": {
              "pointerAddress": "0x8113",
              "address": "0x8010",
              "bank": 2,
              "secondaryAddress": "0x803D",
              "secondaryBank": 2
            },
            "tileSet": {
              "pointerTableAddress": "0xF7D1",
              "pointerAddress": "0xF7D1",
              "address": "0x841D",
              "bank": 4,
              "auxiliaryAddress": "0xF7E9"
            }
          },
          "derivedDescriptorFields": {
            "layoutBank": 2,
            "layoutHeaderAddress": "0x8010",
            "layoutHeaderBank": 2,
            "tileBank": 4,
            "tileSetAddress": "0x841D"
          }
        }
      },
      "evidenceStatus": {
        "runtimeContext": "matches",
        "chr": "exact-match",
        "palette": "exact-match",
        "renderRecipe": "recipe-evidence-present"
      }
    },
    {
      "id": "berkeley-mansion-interior-day",
      "label": "Berkeley Mansion interior, day",
      "location": "Berkeley Mansion",
      "variant": "fixed",
      "access": "mansion-interior",
      "reason": "Representative mansion-interior recipe; mansion interiors are assumed day/night palette-stable.",
      "capture": "out/captures/berkeley-mansion-interior-day",
      "state": "out/states/berkeley-mansion-interior-day.mss",
      "status": "audited",
      "requiredFiles": [
        {
          "file": "screenshot.png",
          "exists": true
        },
        {
          "file": "cpu-0000-07ff.bin",
          "exists": true
        },
        {
          "file": "ppu-0000-1fff-patterns.bin",
          "exists": true
        },
        {
          "file": "ppu-2000-2fff-nametables.bin",
          "exists": true
        },
        {
          "file": "ppu-3f00-3f1f-palettes.bin",
          "exists": true
        },
        {
          "file": "oam-0000-00ff-sprites.bin",
          "exists": true
        },
        {
          "file": "state.json",
          "exists": true
        }
      ],
      "expectedContext": {
        "status": "matches",
        "expected": [
          {
            "objset": "0x01",
            "area": "0x07",
            "submap": "0x00"
          }
        ]
      },
      "atlasContext": {
        "objset": "0x01",
        "area": "0x07",
        "submap": "0x00"
      },
      "live": {
        "runtimeContext": {
          "objset": "0x01",
          "area": "0x07",
          "submap": "0x00",
          "submapRaw": "0x00",
          "submapFlags": "0x00",
          "actorPointer": "0x9AC4",
          "tileSetPointer": "0x8891"
        },
        "ppu": {
          "backgroundPaletteBytes": [
            "0x0F",
            "0x00",
            "0x10",
            "0x0B",
            "0x0F",
            "0x0A",
            "0x17",
            "0x00",
            "0x0F",
            "0x06",
            "0x09",
            "0x37",
            "0x0F",
            "0x11",
            "0x20",
            "0x15"
          ],
          "fullPaletteBytes": [
            "0x0F",
            "0x00",
            "0x10",
            "0x0B",
            "0x0F",
            "0x0A",
            "0x17",
            "0x00",
            "0x0F",
            "0x06",
            "0x09",
            "0x37",
            "0x0F",
            "0x11",
            "0x20",
            "0x15",
            "0x0F",
            "0x0F",
            "0x16",
            "0x20",
            "0x0F",
            "0x27",
            "0x20",
            "0x16",
            "0x0F",
            "0x1C",
            "0x3C",
            "0x0F",
            "0x0F",
            "0x11",
            "0x20",
            "0x0F"
          ],
          "backgroundPatternAddress": "0x0000",
          "xScroll": 0,
          "videoRamAddress": "0x3B02",
          "tmpVideoRamAddress": "0x3300"
        }
      },
      "chr": {
        "status": "exact-match",
        "banks": [
          {
            "slot": 0,
            "ppuAddress": "0x0000",
            "sha1": "49407ad6e2b59cfcda3e9fa4f96a6776781c9efb",
            "matches": [
              {
                "bank": 8,
                "bankHex": "0x08"
              }
            ],
            "status": "exact-match"
          },
          {
            "slot": 1,
            "ppuAddress": "0x1000",
            "sha1": "0007874eb55a5b5a6f8a5b770d954e728e0b69a3",
            "matches": [
              {
                "bank": 9,
                "bankHex": "0x09"
              }
            ],
            "status": "exact-match"
          }
        ]
      },
      "palette": {
        "selector": {
          "status": "exact-match",
          "variant": "day",
          "runtimeContext": {
            "objset": "0x01",
            "area": "0x07",
            "submap": "0x00"
          },
          "paletteTableAddress": "0x8762",
          "indexListPointerAddress": "0x877E",
          "indexListAddress": "0x8D65",
          "indexOffset": 0,
          "transferId": "0x0F",
          "auxiliaryTransferId": "0x48",
          "transferPointerAddress": "0x88B3",
          "paletteAddress": "0x9F5E",
          "paletteBank": 4,
          "bytes": [
            "0x0F",
            "0x00",
            "0x10",
            "0x0B",
            "0x0F",
            "0x0A",
            "0x17",
            "0x00",
            "0x0F",
            "0x06",
            "0x09",
            "0x37",
            "0x0F",
            "0x11",
            "0x20",
            "0x15"
          ],
          "rawPalette": true
        },
        "transferMatches": [
          {
            "transferId": "0x0F",
            "transferPointerAddress": "0x88B3",
            "paletteAddress": "0x9F5E",
            "paletteBank": 4,
            "bytes": [
              "0x0F",
              "0x00",
              "0x10",
              "0x0B",
              "0x0F",
              "0x0A",
              "0x17",
              "0x00",
              "0x0F",
              "0x06",
              "0x09",
              "0x37",
              "0x0F",
              "0x11",
              "0x20",
              "0x15"
            ]
          }
        ],
        "status": "selector-exact"
      },
      "romContext": {
        "status": "resolved",
        "backgroundContext": {
          "input": {
            "objset": 1,
            "objsetHex": "0x01",
            "area": 7,
            "areaHex": "0x07",
            "submap": 0,
            "submapHex": "0x00"
          },
          "tables": {
            "areaTable": {
              "pointerTableAddress": "0xF7AB",
              "pointerAddress": "0xF7AD",
              "address": "0x873C",
              "bank": 2
            },
            "areaRecord": {
              "pointerAddress": "0x874A",
              "address": "0x8D45",
              "bank": 2
            },
            "screenRecord": {
              "pointerAddress": "0x8D4E",
              "address": "0x8D5F",
              "bank": 2,
              "firstBytes": [
                "0x04",
                "0x05",
                "0x02",
                "0x00",
                "0x00",
                "0x00",
                "0x0F",
                "0x48"
              ],
              "layoutIndex": 4,
              "layoutIndexHex": "0x04"
            },
            "layoutTable": {
              "pointerTableAddress": "0xF7FB",
              "pointerAddress": "0xF7FD",
              "address": "0x8792",
              "bank": 2
            },
            "layoutHeader": {
              "pointerAddress": "0x87A2",
              "address": "0x8D99",
              "bank": 2,
              "secondaryAddress": "0x8D6B",
              "secondaryBank": 2
            },
            "tileSet": {
              "pointerTableAddress": "0xF7D1",
              "pointerAddress": "0xF7D5",
              "address": "0x8891",
              "bank": 4,
              "auxiliaryAddress": "0xF7EC"
            }
          },
          "derivedDescriptorFields": {
            "layoutBank": 2,
            "layoutHeaderAddress": "0x8D99",
            "layoutHeaderBank": 2,
            "tileBank": 4,
            "tileSetAddress": "0x8891"
          }
        }
      },
      "evidenceStatus": {
        "runtimeContext": "matches",
        "chr": "exact-match",
        "palette": "exact-match",
        "renderRecipe": "recipe-evidence-present"
      }
    }
  ],
  "deferred": []
};
