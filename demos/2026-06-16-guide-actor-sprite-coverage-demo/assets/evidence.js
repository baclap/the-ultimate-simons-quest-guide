window.GUIDE_ACTOR_SPRITE_COVERAGE = {
  "schemaVersion": 1,
  "generatedAt": "2026-06-16T17:16:20.509Z",
  "title": "Guide Actor Sprite Coverage",
  "summary": {
    "status": "complete-for-current-guide-slice",
    "actorsCovered": 9,
    "renderedActorClasses": 8,
    "noSpriteFixtures": 1,
    "missing": 0,
    "townNpcClasses": 4,
    "enemyClasses": 4
  },
  "provenance": [
    "Actor rows are verified directly from ROM file offsets.",
    "Town high-bit actor ids are matched to live ids by masking with $7F, consistent with the already-captured shepherd and merchant slots.",
    "Actor dispatch entries are read from bank 1 table $81D3.",
    "Animation records are decoded from the fixed-bank selector table rooted at $DDA2.",
    "Sprite pixels are rendered from PRG metasprite tables, CHR ROM banks, and runtime PPU palette memory captured from the same ROM execution.",
    "The fishman color variant uses the previously generated fishman proof, which derives palette bytes through the ROM palette selector path."
  ],
  "townActors": [
    {
      "key": "jova-shepherd",
      "label": "Jova shepherd",
      "kind": "npc",
      "actorId": "0xB5",
      "liveId": "0x35",
      "status": "covered",
      "rows": [
        {
          "offset": "0x50BC",
          "rawBytes": [
            "0x04",
            "0x0C",
            "0xB5",
            "0x38"
          ],
          "tileX": 4,
          "tileY": 12,
          "pixelX": 64,
          "pixelY": 192,
          "actorId": "0xB5",
          "liveId": "0x35",
          "data": "0x38",
          "text": "first thing to do in this town is buy a white crystal."
        },
        {
          "offset": "0x50C0",
          "rawBytes": [
            "0x04",
            "0x1A",
            "0xB5",
            "0x3D"
          ],
          "tileX": 4,
          "tileY": 26,
          "pixelX": 64,
          "pixelY": 416,
          "actorId": "0xB5",
          "liveId": "0x35",
          "data": "0x3D",
          "text": "you have a friend in the town of aldra. go and see him."
        },
        {
          "offset": "0x50C4",
          "rawBytes": [
            "0x08",
            "0x12",
            "0xB5",
            "0x3E"
          ],
          "tileX": 8,
          "tileY": 18,
          "pixelX": 128,
          "pixelY": 288,
          "actorId": "0xB5",
          "liveId": "0x35",
          "data": "0x3E",
          "text": "13 clues will solve dracula's riddle."
        },
        {
          "offset": "0x50D0",
          "rawBytes": [
            "0x14",
            "0x1A",
            "0xB5",
            "0x41"
          ],
          "tileX": 20,
          "tileY": 26,
          "pixelX": 320,
          "pixelY": 416,
          "actorId": "0xB5",
          "liveId": "0x35",
          "data": "0x41",
          "text": "a magic potion will destroy the wall of evil."
        },
        {
          "offset": "0x50E4",
          "rawBytes": [
            "0x24",
            "0x0C",
            "0xB5",
            "0x4C"
          ],
          "tileX": 36,
          "tileY": 12,
          "pixelX": 576,
          "pixelY": 192,
          "actorId": "0xB5",
          "liveId": "0x35",
          "data": "0x4C",
          "text": "a crooked trader is offering bum deals in this town."
        }
      ],
      "dispatch": {
        "table": "0x81D3",
        "pointerAddress": "0x823D",
        "pointerBytes": [
          "0x50",
          "0x8F"
        ],
        "target": "0x8F50",
        "proofBytesAddress": "0x8F5D",
        "proofBytes": [
          "0x6F",
          "0xDE",
          "0xBD",
          "0xB4",
          "0x03",
          "0xC9",
          "0x35",
          "0xF0"
        ]
      },
      "proof": "Live actor $35 branches to animation record $0E; record $0E emits selectors $24/$25. Existing Jova day RAM captures also show row data $3E with selector $24.",
      "selectorRecordIndex": "0x0E",
      "sprite": {
        "output": "/Users/baclap/workspace/castlevania/out/guide-actor-sprite-coverage/sprites/jova-shepherd.png",
        "image": "sprites/jova-shepherd.png",
        "width": 48,
        "height": 41,
        "record": {
          "index": "0x0E",
          "cpuAddress": "0xDDCC",
          "fileOffset": "0x1DDDC",
          "bytes": [
            "0x01",
            "0x24",
            "0x0C"
          ],
          "selectors": [
            "0x24",
            "0x25"
          ],
          "frameLimit": 1,
          "baseSelector": "0x24",
          "sidecar": "0x0C"
        },
        "ppuSpritePalettes": [
          [
            "0x0F",
            "0x0F",
            "0x16",
            "0x20"
          ],
          [
            "0x0F",
            "0x27",
            "0x20",
            "0x16"
          ],
          [
            "0x0F",
            "0x17",
            "0x20",
            "0x0F"
          ],
          [
            "0x0F",
            "0x00",
            "0x20",
            "0x0F"
          ]
        ],
        "metasprites": [
          {
            "selector": "0x24",
            "pointer": "0xB434",
            "status": "0x84",
            "count": 4,
            "usesSharedShape": true,
            "shapePointer": "0xB41F",
            "sprites": [
              {
                "tile": "0xA1",
                "attr": "0x02",
                "palette": 2,
                "xOffset": -8,
                "yOffset": -19
              },
              {
                "tile": "0xA3",
                "attr": "0x02",
                "palette": 2,
                "xOffset": 0,
                "yOffset": -19
              },
              {
                "tile": "0xA5",
                "attr": "0x02",
                "palette": 2,
                "xOffset": -8,
                "yOffset": -3
              },
              {
                "tile": "0xA7",
                "attr": "0x02",
                "palette": 2,
                "xOffset": 0,
                "yOffset": -3
              }
            ]
          },
          {
            "selector": "0x25",
            "pointer": "0xB43B",
            "status": "0x84",
            "count": 4,
            "usesSharedShape": true,
            "shapePointer": "0xB41F",
            "sprites": [
              {
                "tile": "0xA9",
                "attr": "0x02",
                "palette": 2,
                "xOffset": -8,
                "yOffset": -19
              },
              {
                "tile": "0xAB",
                "attr": "0x02",
                "palette": 2,
                "xOffset": 0,
                "yOffset": -19
              },
              {
                "tile": "0xAD",
                "attr": "0x02",
                "palette": 2,
                "xOffset": -8,
                "yOffset": -3
              },
              {
                "tile": "0xAF",
                "attr": "0x02",
                "palette": 2,
                "xOffset": 0,
                "yOffset": -3
              }
            ]
          }
        ],
        "render": {
          "frameWidth": 22,
          "frameHeight": 41,
          "spriteHeight": 16,
          "largeSprites": true,
          "bounds": {
            "minX": -8,
            "minY": -19,
            "maxX": 8,
            "maxY": 16
          },
          "selectors": [
            36,
            37
          ],
          "frames": [
            {
              "selector": "0x24",
              "pointer": "0xB434",
              "status": "0x84",
              "count": 4,
              "usesSharedShape": true,
              "shapePointer": "0xB41F",
              "sprites": [
                {
                  "tile": "0xA1",
                  "attr": "0x02",
                  "xOffset": -8,
                  "yOffset": -19
                },
                {
                  "tile": "0xA3",
                  "attr": "0x02",
                  "xOffset": 0,
                  "yOffset": -19
                },
                {
                  "tile": "0xA5",
                  "attr": "0x02",
                  "xOffset": -8,
                  "yOffset": -3
                },
                {
                  "tile": "0xA7",
                  "attr": "0x02",
                  "xOffset": 0,
                  "yOffset": -3
                }
              ]
            },
            {
              "selector": "0x25",
              "pointer": "0xB43B",
              "status": "0x84",
              "count": 4,
              "usesSharedShape": true,
              "shapePointer": "0xB41F",
              "sprites": [
                {
                  "tile": "0xA9",
                  "attr": "0x02",
                  "xOffset": -8,
                  "yOffset": -19
                },
                {
                  "tile": "0xAB",
                  "attr": "0x02",
                  "xOffset": 0,
                  "yOffset": -19
                },
                {
                  "tile": "0xAD",
                  "attr": "0x02",
                  "xOffset": -8,
                  "yOffset": -3
                },
                {
                  "tile": "0xAF",
                  "attr": "0x02",
                  "xOffset": 0,
                  "yOffset": -3
                }
              ]
            }
          ]
        }
      },
      "runtimeSlot": null
    },
    {
      "key": "jova-man",
      "label": "Jova man",
      "kind": "npc",
      "actorId": "0xAA",
      "liveId": "0x2A",
      "status": "covered",
      "rows": [
        {
          "offset": "0x50D8",
          "rawBytes": [
            "0x18",
            "0x14",
            "0xAA",
            "0x44"
          ],
          "tileX": 24,
          "tileY": 20,
          "pixelX": 384,
          "pixelY": 320,
          "actorId": "0xAA",
          "liveId": "0x2A",
          "data": "0x44",
          "text": "rumor has it, the ferryman at dead river loves garlic."
        },
        {
          "offset": "0x50E8",
          "rawBytes": [
            "0x28",
            "0x14",
            "0xAA",
            "0x4D"
          ],
          "tileX": 40,
          "tileY": 20,
          "pixelX": 640,
          "pixelY": 320,
          "actorId": "0xAA",
          "liveId": "0x2A",
          "data": "0x4D",
          "text": "a flame is on top of the 6th tree in denis woods."
        }
      ],
      "dispatch": {
        "table": "0x81D3",
        "pointerAddress": "0x8227",
        "pointerBytes": [
          "0x0B",
          "0x8F"
        ],
        "target": "0x8F0B",
        "proofBytesAddress": "0x8F19",
        "proofBytes": [
          "0xA9",
          "0x0D",
          "0x4C",
          "0xD8",
          "0xDE",
          "0xBD",
          "0x56",
          "0x04"
        ]
      },
      "proof": "Live actor $2A loads animation record $0D. The older Jova transition probe also catches row data $44 live with selector $22, matching the first selector in record $0D.",
      "selectorRecordIndex": "0x0D",
      "sprite": {
        "output": "/Users/baclap/workspace/castlevania/out/guide-actor-sprite-coverage/sprites/jova-man.png",
        "image": "sprites/jova-man.png",
        "width": 48,
        "height": 41,
        "record": {
          "index": "0x0D",
          "cpuAddress": "0xDDC9",
          "fileOffset": "0x1DDD9",
          "bytes": [
            "0x01",
            "0x22",
            "0x0C"
          ],
          "selectors": [
            "0x22",
            "0x23"
          ],
          "frameLimit": 1,
          "baseSelector": "0x22",
          "sidecar": "0x0C"
        },
        "ppuSpritePalettes": [
          [
            "0x0F",
            "0x0F",
            "0x16",
            "0x20"
          ],
          [
            "0x0F",
            "0x27",
            "0x20",
            "0x16"
          ],
          [
            "0x0F",
            "0x17",
            "0x20",
            "0x0F"
          ],
          [
            "0x0F",
            "0x00",
            "0x20",
            "0x0F"
          ]
        ],
        "metasprites": [
          {
            "selector": "0x22",
            "pointer": "0xB41F",
            "status": "0x04",
            "count": 4,
            "usesSharedShape": false,
            "shapePointer": null,
            "sprites": [
              {
                "tile": "0xC1",
                "attr": "0x02",
                "palette": 2,
                "xOffset": -8,
                "yOffset": -19
              },
              {
                "tile": "0xC3",
                "attr": "0x02",
                "palette": 2,
                "xOffset": 0,
                "yOffset": -19
              },
              {
                "tile": "0xC5",
                "attr": "0x02",
                "palette": 2,
                "xOffset": -8,
                "yOffset": -3
              },
              {
                "tile": "0xC7",
                "attr": "0x02",
                "palette": 2,
                "xOffset": 0,
                "yOffset": -3
              }
            ]
          },
          {
            "selector": "0x23",
            "pointer": "0xB42D",
            "status": "0x84",
            "count": 4,
            "usesSharedShape": true,
            "shapePointer": "0xB41F",
            "sprites": [
              {
                "tile": "0xC9",
                "attr": "0x02",
                "palette": 2,
                "xOffset": -8,
                "yOffset": -19
              },
              {
                "tile": "0xCB",
                "attr": "0x02",
                "palette": 2,
                "xOffset": 0,
                "yOffset": -19
              },
              {
                "tile": "0xCD",
                "attr": "0x02",
                "palette": 2,
                "xOffset": -8,
                "yOffset": -3
              },
              {
                "tile": "0xCF",
                "attr": "0x02",
                "palette": 2,
                "xOffset": 0,
                "yOffset": -3
              }
            ]
          }
        ],
        "render": {
          "frameWidth": 22,
          "frameHeight": 41,
          "spriteHeight": 16,
          "largeSprites": true,
          "bounds": {
            "minX": -8,
            "minY": -19,
            "maxX": 8,
            "maxY": 16
          },
          "selectors": [
            34,
            35
          ],
          "frames": [
            {
              "selector": "0x22",
              "pointer": "0xB41F",
              "status": "0x04",
              "count": 4,
              "usesSharedShape": false,
              "sprites": [
                {
                  "tile": "0xC1",
                  "attr": "0x02",
                  "xOffset": -8,
                  "yOffset": -19
                },
                {
                  "tile": "0xC3",
                  "attr": "0x02",
                  "xOffset": 0,
                  "yOffset": -19
                },
                {
                  "tile": "0xC5",
                  "attr": "0x02",
                  "xOffset": -8,
                  "yOffset": -3
                },
                {
                  "tile": "0xC7",
                  "attr": "0x02",
                  "xOffset": 0,
                  "yOffset": -3
                }
              ]
            },
            {
              "selector": "0x23",
              "pointer": "0xB42D",
              "status": "0x84",
              "count": 4,
              "usesSharedShape": true,
              "shapePointer": "0xB41F",
              "sprites": [
                {
                  "tile": "0xC9",
                  "attr": "0x02",
                  "xOffset": -8,
                  "yOffset": -19
                },
                {
                  "tile": "0xCB",
                  "attr": "0x02",
                  "xOffset": 0,
                  "yOffset": -19
                },
                {
                  "tile": "0xCD",
                  "attr": "0x02",
                  "xOffset": -8,
                  "yOffset": -3
                },
                {
                  "tile": "0xCF",
                  "attr": "0x02",
                  "xOffset": 0,
                  "yOffset": -3
                }
              ]
            }
          ]
        }
      },
      "runtimeSlot": {
        "capture": "out/transition-probes/jova-town-interior-round-trip/jova-town-to-interior-after-cpu-0000-07ff.bin",
        "slot": 7,
        "activeId": "0x2A",
        "selector": "0x22",
        "rowData": "0x44",
        "screenX": 114,
        "screenY": 146,
        "state": "0x40",
        "sidecar": "0x0C"
      }
    },
    {
      "key": "jova-a8",
      "label": "Jova clue NPC $A8",
      "kind": "npc",
      "actorId": "0xA8",
      "liveId": "0x28",
      "status": "covered",
      "rows": [
        {
          "offset": "0x50EC",
          "rawBytes": [
            "0x2C",
            "0x1A",
            "0xA8",
            "0x4E"
          ],
          "tileX": 44,
          "tileY": 26,
          "pixelX": 704,
          "pixelY": 416,
          "actorId": "0xA8",
          "liveId": "0x28",
          "data": "0x4E",
          "text": "clues to dracula's riddle are in the town of veros."
        }
      ],
      "dispatch": {
        "table": "0x81D3",
        "pointerAddress": "0x8223",
        "pointerBytes": [
          "0xE2",
          "0x8E"
        ],
        "target": "0x8EE2",
        "proofBytesAddress": "0x8EEC",
        "proofBytes": [
          "0xA9",
          "0x0D",
          "0x4C",
          "0xD8",
          "0xDE",
          "0x20",
          "0x2A",
          "0xDD"
        ]
      },
      "proof": "The row byte $A8 becomes live actor $28 through the town high-bit path. Dispatch entry $28 starts by loading animation record $0D, the same town-man record proven live for $AA.",
      "selectorRecordIndex": "0x0D",
      "sprite": {
        "output": "/Users/baclap/workspace/castlevania/out/guide-actor-sprite-coverage/sprites/jova-a8.png",
        "image": "sprites/jova-a8.png",
        "width": 48,
        "height": 41,
        "record": {
          "index": "0x0D",
          "cpuAddress": "0xDDC9",
          "fileOffset": "0x1DDD9",
          "bytes": [
            "0x01",
            "0x22",
            "0x0C"
          ],
          "selectors": [
            "0x22",
            "0x23"
          ],
          "frameLimit": 1,
          "baseSelector": "0x22",
          "sidecar": "0x0C"
        },
        "ppuSpritePalettes": [
          [
            "0x0F",
            "0x0F",
            "0x16",
            "0x20"
          ],
          [
            "0x0F",
            "0x27",
            "0x20",
            "0x16"
          ],
          [
            "0x0F",
            "0x17",
            "0x20",
            "0x0F"
          ],
          [
            "0x0F",
            "0x00",
            "0x20",
            "0x0F"
          ]
        ],
        "metasprites": [
          {
            "selector": "0x22",
            "pointer": "0xB41F",
            "status": "0x04",
            "count": 4,
            "usesSharedShape": false,
            "shapePointer": null,
            "sprites": [
              {
                "tile": "0xC1",
                "attr": "0x02",
                "palette": 2,
                "xOffset": -8,
                "yOffset": -19
              },
              {
                "tile": "0xC3",
                "attr": "0x02",
                "palette": 2,
                "xOffset": 0,
                "yOffset": -19
              },
              {
                "tile": "0xC5",
                "attr": "0x02",
                "palette": 2,
                "xOffset": -8,
                "yOffset": -3
              },
              {
                "tile": "0xC7",
                "attr": "0x02",
                "palette": 2,
                "xOffset": 0,
                "yOffset": -3
              }
            ]
          },
          {
            "selector": "0x23",
            "pointer": "0xB42D",
            "status": "0x84",
            "count": 4,
            "usesSharedShape": true,
            "shapePointer": "0xB41F",
            "sprites": [
              {
                "tile": "0xC9",
                "attr": "0x02",
                "palette": 2,
                "xOffset": -8,
                "yOffset": -19
              },
              {
                "tile": "0xCB",
                "attr": "0x02",
                "palette": 2,
                "xOffset": 0,
                "yOffset": -19
              },
              {
                "tile": "0xCD",
                "attr": "0x02",
                "palette": 2,
                "xOffset": -8,
                "yOffset": -3
              },
              {
                "tile": "0xCF",
                "attr": "0x02",
                "palette": 2,
                "xOffset": 0,
                "yOffset": -3
              }
            ]
          }
        ],
        "render": {
          "frameWidth": 22,
          "frameHeight": 41,
          "spriteHeight": 16,
          "largeSprites": true,
          "bounds": {
            "minX": -8,
            "minY": -19,
            "maxX": 8,
            "maxY": 16
          },
          "selectors": [
            34,
            35
          ],
          "frames": [
            {
              "selector": "0x22",
              "pointer": "0xB41F",
              "status": "0x04",
              "count": 4,
              "usesSharedShape": false,
              "sprites": [
                {
                  "tile": "0xC1",
                  "attr": "0x02",
                  "xOffset": -8,
                  "yOffset": -19
                },
                {
                  "tile": "0xC3",
                  "attr": "0x02",
                  "xOffset": 0,
                  "yOffset": -19
                },
                {
                  "tile": "0xC5",
                  "attr": "0x02",
                  "xOffset": -8,
                  "yOffset": -3
                },
                {
                  "tile": "0xC7",
                  "attr": "0x02",
                  "xOffset": 0,
                  "yOffset": -3
                }
              ]
            },
            {
              "selector": "0x23",
              "pointer": "0xB42D",
              "status": "0x84",
              "count": 4,
              "usesSharedShape": true,
              "shapePointer": "0xB41F",
              "sprites": [
                {
                  "tile": "0xC9",
                  "attr": "0x02",
                  "xOffset": -8,
                  "yOffset": -19
                },
                {
                  "tile": "0xCB",
                  "attr": "0x02",
                  "xOffset": 0,
                  "yOffset": -19
                },
                {
                  "tile": "0xCD",
                  "attr": "0x02",
                  "xOffset": -8,
                  "yOffset": -3
                },
                {
                  "tile": "0xCF",
                  "attr": "0x02",
                  "xOffset": 0,
                  "yOffset": -3
                }
              ]
            }
          ]
        }
      },
      "runtimeSlot": null
    },
    {
      "key": "jova-merchant",
      "label": "White-crystal merchant",
      "kind": "npc",
      "actorId": "0xAE",
      "liveId": "0x2E",
      "status": "covered",
      "rows": [
        {
          "offset": "0x50F8",
          "rawBytes": [
            "0x34",
            "0x12",
            "0xAE",
            "0x07"
          ],
          "tileX": 52,
          "tileY": 18,
          "pixelX": 832,
          "pixelY": 288,
          "actorId": "0xAE",
          "liveId": "0x2E",
          "data": "0x07",
          "text": "buy a white crystal?"
        }
      ],
      "dispatch": {
        "table": "0x81D3",
        "pointerAddress": "0x822F",
        "pointerBytes": [
          "0xCC",
          "0x83"
        ],
        "target": "0x83CC",
        "proofBytesAddress": "0x83D8",
        "proofBytes": [
          "0x03",
          "0x38",
          "0xE9",
          "0x2D",
          "0xA8",
          "0xB9",
          "0xF3",
          "0x83"
        ]
      },
      "proof": "Live actor $2E indexes the small merchant selector table at $83F3. Table entry $0B resolves to selectors $1E/$1F; existing Jova right RAM captures show selector $1E for the merchant slot.",
      "selectorRecordIndex": "0x0B",
      "sprite": {
        "output": "/Users/baclap/workspace/castlevania/out/guide-actor-sprite-coverage/sprites/jova-merchant.png",
        "image": "sprites/jova-merchant.png",
        "width": 48,
        "height": 41,
        "record": {
          "index": "0x0B",
          "cpuAddress": "0xDDC3",
          "fileOffset": "0x1DDD3",
          "bytes": [
            "0x01",
            "0x1E",
            "0x0C"
          ],
          "selectors": [
            "0x1E",
            "0x1F"
          ],
          "frameLimit": 1,
          "baseSelector": "0x1E",
          "sidecar": "0x0C"
        },
        "ppuSpritePalettes": [
          [
            "0x0F",
            "0x0F",
            "0x16",
            "0x20"
          ],
          [
            "0x0F",
            "0x27",
            "0x20",
            "0x16"
          ],
          [
            "0x0F",
            "0x17",
            "0x20",
            "0x0F"
          ],
          [
            "0x0F",
            "0x00",
            "0x20",
            "0x0F"
          ]
        ],
        "metasprites": [
          {
            "selector": "0x1E",
            "pointer": "0xB23B",
            "status": "0x84",
            "count": 4,
            "usesSharedShape": true,
            "shapePointer": "0xB21F",
            "sprites": [
              {
                "tile": "0x6F",
                "attr": "0x03",
                "palette": 3,
                "xOffset": -8,
                "yOffset": -19
              },
              {
                "tile": "0x71",
                "attr": "0x03",
                "palette": 3,
                "xOffset": 0,
                "yOffset": -19
              },
              {
                "tile": "0x73",
                "attr": "0x03",
                "palette": 3,
                "xOffset": -8,
                "yOffset": -3
              },
              {
                "tile": "0x75",
                "attr": "0x03",
                "palette": 3,
                "xOffset": 0,
                "yOffset": -3
              }
            ]
          },
          {
            "selector": "0x1F",
            "pointer": "0xB242",
            "status": "0x84",
            "count": 4,
            "usesSharedShape": true,
            "shapePointer": "0xB22D",
            "sprites": [
              {
                "tile": "0x6F",
                "attr": "0x03",
                "palette": 3,
                "xOffset": -8,
                "yOffset": -18
              },
              {
                "tile": "0x71",
                "attr": "0x03",
                "palette": 3,
                "xOffset": 0,
                "yOffset": -18
              },
              {
                "tile": "0x77",
                "attr": "0x03",
                "palette": 3,
                "xOffset": -8,
                "yOffset": -3
              },
              {
                "tile": "0x79",
                "attr": "0x03",
                "palette": 3,
                "xOffset": 0,
                "yOffset": -3
              }
            ]
          }
        ],
        "render": {
          "frameWidth": 22,
          "frameHeight": 41,
          "spriteHeight": 16,
          "largeSprites": true,
          "bounds": {
            "minX": -8,
            "minY": -19,
            "maxX": 8,
            "maxY": 16
          },
          "selectors": [
            30,
            31
          ],
          "frames": [
            {
              "selector": "0x1E",
              "pointer": "0xB23B",
              "status": "0x84",
              "count": 4,
              "usesSharedShape": true,
              "shapePointer": "0xB21F",
              "sprites": [
                {
                  "tile": "0x6F",
                  "attr": "0x03",
                  "xOffset": -8,
                  "yOffset": -19
                },
                {
                  "tile": "0x71",
                  "attr": "0x03",
                  "xOffset": 0,
                  "yOffset": -19
                },
                {
                  "tile": "0x73",
                  "attr": "0x03",
                  "xOffset": -8,
                  "yOffset": -3
                },
                {
                  "tile": "0x75",
                  "attr": "0x03",
                  "xOffset": 0,
                  "yOffset": -3
                }
              ]
            },
            {
              "selector": "0x1F",
              "pointer": "0xB242",
              "status": "0x84",
              "count": 4,
              "usesSharedShape": true,
              "shapePointer": "0xB22D",
              "sprites": [
                {
                  "tile": "0x6F",
                  "attr": "0x03",
                  "xOffset": -8,
                  "yOffset": -18
                },
                {
                  "tile": "0x71",
                  "attr": "0x03",
                  "xOffset": 0,
                  "yOffset": -18
                },
                {
                  "tile": "0x77",
                  "attr": "0x03",
                  "xOffset": -8,
                  "yOffset": -3
                },
                {
                  "tile": "0x79",
                  "attr": "0x03",
                  "xOffset": 0,
                  "yOffset": -3
                }
              ]
            }
          ]
        }
      },
      "runtimeSlot": null
    },
    {
      "key": "jova-sign",
      "label": "Jova sign fixture",
      "kind": "fixture",
      "actorId": "0xA4",
      "liveId": "0x24",
      "status": "covered-no-sprite-fixture",
      "rows": [
        {
          "offset": "0x50C8",
          "rawBytes": [
            "0x0C",
            "0x1A",
            "0xA4",
            "0x3A"
          ],
          "tileX": 12,
          "tileY": 26,
          "pixelX": 192,
          "pixelY": 416,
          "actorId": "0xA4",
          "liveId": "0x24",
          "data": "0x3A",
          "text": "turn right for the jova woods. left for belasco marsh."
        }
      ],
      "dispatch": {
        "table": "0x81D3",
        "pointerAddress": "0x821B",
        "pointerBytes": [
          "0x5A",
          "0x90"
        ],
        "target": "0x905A",
        "proofBytesAddress": "0x905F",
        "proofBytes": [
          "0xA9",
          "0x40",
          "0xA0",
          "0x00",
          "0x4C",
          "0xD0",
          "0xDE",
          "0x20"
        ]
      },
      "proof": "Dispatch entry $24 calls $DED0 with Y=$00. $DED0 stores Y to $0300,x, and selector $00 decodes to zero OAM sprites, so the sign is a background fixture with interaction text, not a rendered actor sprite.",
      "sprite": null,
      "noSprite": {
        "selector": "0x00",
        "selectorCount": 0,
        "ded0Address": "0xDED0",
        "ded0Bytes": [
          "0x9D",
          "0xD8",
          "0x03",
          "0x98",
          "0x9D",
          "0x00",
          "0x03",
          "0x60"
        ],
        "meaning": "$DED0 stores A to $03D8,x, transfers Y to A, then stores Y as the current metasprite selector at $0300,x."
      }
    }
  ],
  "enemies": [
    {
      "key": "skeleton",
      "label": "Skeleton",
      "kind": "enemy",
      "actorId": "0x03",
      "status": "covered",
      "locations": [
        "Jova Woods",
        "South Bridge",
        "Veros Woods",
        "Denis Woods"
      ],
      "hp": {
        "day": 1,
        "night": 2
      },
      "proof": "Selector-stream record $DDB1 emits $0E/$0F, proven from live actor traces and decoded from fixed-bank ROM.",
      "sprite": {
        "output": "/Users/baclap/workspace/castlevania/out/guide-actor-sprite-coverage/sprites/skeleton.png",
        "image": "sprites/skeleton.png",
        "width": 48,
        "height": 41,
        "record": {
          "index": "0x05",
          "cpuAddress": "0xDDB1",
          "fileOffset": "0x1DDC1",
          "bytes": [
            "0x01",
            "0x0E",
            "0x10"
          ],
          "selectors": [
            "0x0E",
            "0x0F"
          ],
          "frameLimit": 1,
          "baseSelector": "0x0E",
          "sidecar": "0x10"
        },
        "ppuSpritePalettes": [
          [
            "0x0F",
            "0x0F",
            "0x16",
            "0x20"
          ],
          [
            "0x0F",
            "0x27",
            "0x20",
            "0x16"
          ],
          [
            "0x0F",
            "0x15",
            "0x35",
            "0x0F"
          ],
          [
            "0x0F",
            "0x21",
            "0x20",
            "0x0F"
          ]
        ],
        "metasprites": [
          {
            "selector": "0x0E",
            "pointer": "0xB21F",
            "status": "0x04",
            "count": 4,
            "usesSharedShape": false,
            "shapePointer": null,
            "sprites": [
              {
                "tile": "0xB1",
                "attr": "0x03",
                "palette": 3,
                "xOffset": -8,
                "yOffset": -19
              },
              {
                "tile": "0xB3",
                "attr": "0x03",
                "palette": 3,
                "xOffset": 0,
                "yOffset": -19
              },
              {
                "tile": "0xB5",
                "attr": "0x03",
                "palette": 3,
                "xOffset": -8,
                "yOffset": -3
              },
              {
                "tile": "0xB7",
                "attr": "0x03",
                "palette": 3,
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
            "shapePointer": null,
            "sprites": [
              {
                "tile": "0xB1",
                "attr": "0x03",
                "palette": 3,
                "xOffset": -8,
                "yOffset": -18
              },
              {
                "tile": "0xB3",
                "attr": "0x03",
                "palette": 3,
                "xOffset": 0,
                "yOffset": -18
              },
              {
                "tile": "0xB9",
                "attr": "0x03",
                "palette": 3,
                "xOffset": -8,
                "yOffset": -3
              },
              {
                "tile": "0xBB",
                "attr": "0x03",
                "palette": 3,
                "xOffset": 0,
                "yOffset": -3
              }
            ]
          }
        ],
        "render": {
          "frameWidth": 22,
          "frameHeight": 41,
          "spriteHeight": 16,
          "largeSprites": true,
          "bounds": {
            "minX": -8,
            "minY": -19,
            "maxX": 8,
            "maxY": 16
          },
          "selectors": [
            14,
            15
          ],
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
      }
    },
    {
      "key": "fishman",
      "label": "Fishman",
      "kind": "enemy",
      "actorId": "0x04",
      "locations": [
        "South Bridge",
        "Denis Woods - Part 1"
      ],
      "hp": {
        "day": 1,
        "night": 2
      },
      "status": "covered",
      "proof": "Fishman body selectors come from record $DDB4 and the attack state writes selector $67 directly. Palette bytes come from the ROM palette selector chain captured in the fishman proof.",
      "upstreamProof": "out/fishman-sprite-proof/analysis.json",
      "paletteVariant": {
        "id": "south-bridge-day",
        "label": "South Bridge, day",
        "spritePalette2": [
          "0x0F",
          "0x15",
          "0x35",
          "0x0F"
        ]
      },
      "sprites": [
        {
          "output": "/Users/baclap/workspace/castlevania/out/guide-actor-sprite-coverage/sprites/fishman-body.png",
          "image": "sprites/fishman-body.png",
          "width": 48,
          "height": 38,
          "record": {
            "index": "0x06",
            "cpuAddress": "0xDDB4",
            "fileOffset": "0x1DDC4",
            "bytes": [
              "0x01",
              "0x10",
              "0x10"
            ],
            "selectors": [
              "0x10",
              "0x11"
            ],
            "frameLimit": 1,
            "baseSelector": "0x10",
            "sidecar": "0x10"
          },
          "ppuSpritePalettes": [
            [
              "0x0F",
              "0x0F",
              "0x16",
              "0x20"
            ],
            [
              "0x0F",
              "0x27",
              "0x20",
              "0x16"
            ],
            [
              "0x0F",
              "0x15",
              "0x35",
              "0x0F"
            ],
            [
              "0x0F",
              "0x21",
              "0x20",
              "0x0F"
            ]
          ],
          "metasprites": [
            {
              "selector": "0x10",
              "pointer": "0xB5EB",
              "status": "0x84",
              "count": 4,
              "usesSharedShape": true,
              "shapePointer": "0xB600",
              "sprites": [
                {
                  "tile": "0xD1",
                  "attr": "0x02",
                  "palette": 2,
                  "xOffset": -8,
                  "yOffset": -16
                },
                {
                  "tile": "0xD3",
                  "attr": "0x02",
                  "palette": 2,
                  "xOffset": 0,
                  "yOffset": -16
                },
                {
                  "tile": "0xD5",
                  "attr": "0x02",
                  "palette": 2,
                  "xOffset": -8,
                  "yOffset": 0
                },
                {
                  "tile": "0xD7",
                  "attr": "0x02",
                  "palette": 2,
                  "xOffset": 0,
                  "yOffset": 0
                }
              ]
            },
            {
              "selector": "0x11",
              "pointer": "0xB5F2",
              "status": "0x04",
              "count": 4,
              "usesSharedShape": false,
              "shapePointer": null,
              "sprites": [
                {
                  "tile": "0xD1",
                  "attr": "0x02",
                  "palette": 2,
                  "xOffset": -8,
                  "yOffset": -15
                },
                {
                  "tile": "0xD3",
                  "attr": "0x02",
                  "palette": 2,
                  "xOffset": 0,
                  "yOffset": -15
                },
                {
                  "tile": "0xD9",
                  "attr": "0x02",
                  "palette": 2,
                  "xOffset": -8,
                  "yOffset": 0
                },
                {
                  "tile": "0xDB",
                  "attr": "0x02",
                  "palette": 2,
                  "xOffset": 0,
                  "yOffset": 0
                }
              ]
            }
          ],
          "render": {
            "frameWidth": 22,
            "frameHeight": 38,
            "spriteHeight": 16,
            "largeSprites": true,
            "bounds": {
              "minX": -8,
              "minY": -16,
              "maxX": 8,
              "maxY": 16
            },
            "selectors": [
              16,
              17
            ],
            "frames": [
              {
                "selector": "0x10",
                "pointer": "0xB5EB",
                "status": "0x84",
                "count": 4,
                "usesSharedShape": true,
                "shapePointer": "0xB600",
                "sprites": [
                  {
                    "tile": "0xD1",
                    "attr": "0x02",
                    "xOffset": -8,
                    "yOffset": -16
                  },
                  {
                    "tile": "0xD3",
                    "attr": "0x02",
                    "xOffset": 0,
                    "yOffset": -16
                  },
                  {
                    "tile": "0xD5",
                    "attr": "0x02",
                    "xOffset": -8,
                    "yOffset": 0
                  },
                  {
                    "tile": "0xD7",
                    "attr": "0x02",
                    "xOffset": 0,
                    "yOffset": 0
                  }
                ]
              },
              {
                "selector": "0x11",
                "pointer": "0xB5F2",
                "status": "0x04",
                "count": 4,
                "usesSharedShape": false,
                "sprites": [
                  {
                    "tile": "0xD1",
                    "attr": "0x02",
                    "xOffset": -8,
                    "yOffset": -15
                  },
                  {
                    "tile": "0xD3",
                    "attr": "0x02",
                    "xOffset": 0,
                    "yOffset": -15
                  },
                  {
                    "tile": "0xD9",
                    "attr": "0x02",
                    "xOffset": -8,
                    "yOffset": 0
                  },
                  {
                    "tile": "0xDB",
                    "attr": "0x02",
                    "xOffset": 0,
                    "yOffset": 0
                  }
                ]
              }
            ]
          }
        },
        {
          "output": "/Users/baclap/workspace/castlevania/out/guide-actor-sprite-coverage/sprites/fishman-attack.png",
          "image": "sprites/fishman-attack.png",
          "width": 22,
          "height": 38,
          "selector": "0x67",
          "ppuSpritePalettes": [
            [
              "0x0F",
              "0x0F",
              "0x16",
              "0x20"
            ],
            [
              "0x0F",
              "0x27",
              "0x20",
              "0x16"
            ],
            [
              "0x0F",
              "0x15",
              "0x35",
              "0x0F"
            ],
            [
              "0x0F",
              "0x21",
              "0x20",
              "0x0F"
            ]
          ],
          "metasprites": [
            {
              "selector": "0x67",
              "pointer": "0xB600",
              "status": "0x04",
              "count": 4,
              "usesSharedShape": false,
              "shapePointer": null,
              "sprites": [
                {
                  "tile": "0xDD",
                  "attr": "0x02",
                  "palette": 2,
                  "xOffset": -8,
                  "yOffset": -16
                },
                {
                  "tile": "0xDF",
                  "attr": "0x02",
                  "palette": 2,
                  "xOffset": 0,
                  "yOffset": -16
                },
                {
                  "tile": "0xD5",
                  "attr": "0x02",
                  "palette": 2,
                  "xOffset": -8,
                  "yOffset": 0
                },
                {
                  "tile": "0xD7",
                  "attr": "0x02",
                  "palette": 2,
                  "xOffset": 0,
                  "yOffset": 0
                }
              ]
            }
          ],
          "render": {
            "frameWidth": 22,
            "frameHeight": 38,
            "spriteHeight": 16,
            "largeSprites": true,
            "bounds": {
              "minX": -8,
              "minY": -16,
              "maxX": 8,
              "maxY": 16
            },
            "selectors": [
              103
            ],
            "frames": [
              {
                "selector": "0x67",
                "pointer": "0xB600",
                "status": "0x04",
                "count": 4,
                "usesSharedShape": false,
                "sprites": [
                  {
                    "tile": "0xDD",
                    "attr": "0x02",
                    "xOffset": -8,
                    "yOffset": -16
                  },
                  {
                    "tile": "0xDF",
                    "attr": "0x02",
                    "xOffset": 0,
                    "yOffset": -16
                  },
                  {
                    "tile": "0xD5",
                    "attr": "0x02",
                    "xOffset": -8,
                    "yOffset": 0
                  },
                  {
                    "tile": "0xD7",
                    "attr": "0x02",
                    "xOffset": 0,
                    "yOffset": 0
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    {
      "key": "werewolf",
      "label": "Werewolf",
      "kind": "enemy",
      "actorId": "0x13",
      "status": "covered",
      "locations": [
        "Jova Woods"
      ],
      "hp": {
        "day": 2,
        "night": 4
      },
      "proof": "Selector-stream record $DDFC emits $65/$66, proven from live Jova Woods traces.",
      "sprite": {
        "output": "/Users/baclap/workspace/castlevania/out/guide-actor-sprite-coverage/sprites/werewolf.png",
        "image": "sprites/werewolf.png",
        "width": 48,
        "height": 41,
        "record": {
          "index": "0x1E",
          "cpuAddress": "0xDDFC",
          "fileOffset": "0x1DE0C",
          "bytes": [
            "0x01",
            "0x65",
            "0x10"
          ],
          "selectors": [
            "0x65",
            "0x66"
          ],
          "frameLimit": 1,
          "baseSelector": "0x65",
          "sidecar": "0x10"
        },
        "ppuSpritePalettes": [
          [
            "0x0F",
            "0x0F",
            "0x16",
            "0x20"
          ],
          [
            "0x0F",
            "0x27",
            "0x20",
            "0x16"
          ],
          [
            "0x0F",
            "0x15",
            "0x35",
            "0x0F"
          ],
          [
            "0x0F",
            "0x21",
            "0x20",
            "0x0F"
          ]
        ],
        "metasprites": [
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
                "palette": 3,
                "xOffset": -8,
                "yOffset": -19
              },
              {
                "tile": "0xA3",
                "attr": "0x03",
                "palette": 3,
                "xOffset": 0,
                "yOffset": -19
              },
              {
                "tile": "0xA5",
                "attr": "0x03",
                "palette": 3,
                "xOffset": -8,
                "yOffset": -3
              },
              {
                "tile": "0xA7",
                "attr": "0x03",
                "palette": 3,
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
                "palette": 3,
                "xOffset": -8,
                "yOffset": -19
              },
              {
                "tile": "0xAB",
                "attr": "0x03",
                "palette": 3,
                "xOffset": 0,
                "yOffset": -19
              },
              {
                "tile": "0xAD",
                "attr": "0x03",
                "palette": 3,
                "xOffset": -8,
                "yOffset": -3
              },
              {
                "tile": "0xAF",
                "attr": "0x03",
                "palette": 3,
                "xOffset": 0,
                "yOffset": -3
              }
            ]
          }
        ],
        "render": {
          "frameWidth": 22,
          "frameHeight": 41,
          "spriteHeight": 16,
          "largeSprites": true,
          "bounds": {
            "minX": -8,
            "minY": -19,
            "maxX": 8,
            "maxY": 16
          },
          "selectors": [
            101,
            102
          ],
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
      }
    },
    {
      "key": "zombie",
      "label": "Zombie",
      "kind": "enemy",
      "actorId": "0x17",
      "status": "covered",
      "locations": [
        "Town of Jova at night"
      ],
      "hp": {
        "day": null,
        "night": 2
      },
      "proof": "Selector-stream record $DE47 emits the town-night zombie selectors. The town actor gate suppresses these rows during day and loads them at night.",
      "sprite": {
        "output": "/Users/baclap/workspace/castlevania/out/guide-actor-sprite-coverage/sprites/zombie.png",
        "image": "sprites/zombie.png",
        "width": 48,
        "height": 41,
        "record": {
          "index": "0x37",
          "cpuAddress": "0xDE47",
          "fileOffset": "0x1DE57",
          "bytes": [
            "0x01",
            "0x3F",
            "0x10"
          ],
          "selectors": [
            "0x3F",
            "0x40"
          ],
          "frameLimit": 1,
          "baseSelector": "0x3F",
          "sidecar": "0x10"
        },
        "ppuSpritePalettes": [
          [
            "0x0F",
            "0x0F",
            "0x16",
            "0x20"
          ],
          [
            "0x0F",
            "0x27",
            "0x20",
            "0x16"
          ],
          [
            "0x0F",
            "0x1A",
            "0x2A",
            "0x0F"
          ],
          [
            "0x0F",
            "0x03",
            "0x20",
            "0x0F"
          ]
        ],
        "metasprites": [
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
                "palette": 2,
                "xOffset": -8,
                "yOffset": -19
              },
              {
                "tile": "0xD3",
                "attr": "0x02",
                "palette": 2,
                "xOffset": 0,
                "yOffset": -19
              },
              {
                "tile": "0xD5",
                "attr": "0x02",
                "palette": 2,
                "xOffset": -8,
                "yOffset": -3
              },
              {
                "tile": "0xD7",
                "attr": "0x02",
                "palette": 2,
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
            "shapePointer": null,
            "sprites": [
              {
                "tile": "0xD9",
                "attr": "0x02",
                "palette": 2,
                "xOffset": -8,
                "yOffset": -18
              },
              {
                "tile": "0xDB",
                "attr": "0x02",
                "palette": 2,
                "xOffset": 0,
                "yOffset": -18
              },
              {
                "tile": "0xD5",
                "attr": "0x02",
                "palette": 2,
                "xOffset": -8,
                "yOffset": -3
              },
              {
                "tile": "0xD7",
                "attr": "0x02",
                "palette": 2,
                "xOffset": 0,
                "yOffset": -3
              }
            ]
          }
        ],
        "render": {
          "frameWidth": 22,
          "frameHeight": 41,
          "spriteHeight": 16,
          "largeSprites": true,
          "bounds": {
            "minX": -8,
            "minY": -19,
            "maxX": 8,
            "maxY": 16
          },
          "selectors": [
            63,
            64
          ],
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
      }
    }
  ],
  "integrationStatus": [
    {
      "item": "Town NPC row locations",
      "status": "covered"
    },
    {
      "item": "Town NPC sprites",
      "status": "covered"
    },
    {
      "item": "Town NPC text",
      "status": "covered"
    },
    {
      "item": "Town sign",
      "status": "covered as background fixture; no actor sprite exists"
    },
    {
      "item": "Guide-slice enemy sprites",
      "status": "covered"
    },
    {
      "item": "Guide-slice enemy HP day/night values",
      "status": "covered"
    }
  ],
  "shortcuts": []
};
