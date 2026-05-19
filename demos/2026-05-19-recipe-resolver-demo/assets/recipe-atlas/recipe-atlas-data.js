window.RENDER_RECIPE_ATLAS = {
  "schemaVersion": 1,
  "source": {
    "renderer": "rom-render-recipe-atlas",
    "auditFile": "out/render-recipe-audit/audit.json",
    "notes": [
      "Validated entries have exact save-state recipe probes.",
      "Projected entries reuse a validated family recipe but still need representative pixel validation.",
      "Diagnostic entries render from remaining inferred families and should not be treated as pixel-perfect."
    ]
  },
  "summary": {
    "entries": 99,
    "rendered": 99,
    "blocked": 0,
    "renderErrors": 0,
    "byRecipeStatus": {
      "validated": 11,
      "projected": 80,
      "diagnostic": 8
    },
    "byVariant": {
      "day": 57,
      "night": 42
    },
    "byAccess": {
      "outdoor": 92,
      "mansion-door": 5,
      "town-interior": 1,
      "mansion-interior": 1
    }
  },
  "auditSummary": {
    "fixtures": 11,
    "audited": 11,
    "missingCaptureFiles": 0,
    "chrExact": 11,
    "paletteSelectorExact": 11,
    "paletteTransferMatched": 11,
    "recipeEvidencePresent": 11,
    "deferred": 5
  },
  "deferred": [
    {
      "id": "north-bridge-day",
      "label": "North Bridge, day",
      "state": "out/states/north-bridge-day.mss",
      "reason": "Suspected palette issue; state not available yet."
    },
    {
      "id": "north-bridge-night",
      "label": "North Bridge, night",
      "state": "out/states/north-bridge-night.mss",
      "reason": "Night variant for suspected palette issue; state not available yet."
    },
    {
      "id": "vrad-graveyard-day",
      "label": "Vrad Graveyard, day",
      "state": "out/states/vrad-graveyard-day.mss",
      "reason": "Representative objset 4 and currently suspect scrambled render; state not available yet."
    },
    {
      "id": "castlevania-bridge-day",
      "label": "Castlevania Bridge, day",
      "state": "out/states/castlevania-bridge-day.mss",
      "reason": "Currently suspect scrambled render; state not available yet."
    },
    {
      "id": "castlevania-exterior-day",
      "label": "Castlevania exterior, day",
      "state": "out/states/castlevania-exterior-day.mss",
      "reason": "Representative objset 5 large layout; state not available yet."
    }
  ],
  "entries": [
    {
      "id": "obj00-area00-sub00-jova-day",
      "locationId": "obj00-area00-sub00-jova",
      "name": "Jova",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 0,
      "objsetHex": "0x00",
      "area": 0,
      "areaHex": "0x00",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x8042",
        "areaRecordAddress": "0xF9FF",
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
        "rawLayoutIndex": "0x03",
        "layoutIndex": "0x03",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj00-area00-sub00-jova-day-recipe",
        "label": "Jova, day",
        "status": "validated",
        "statusDetail": "Validated by Jova town exterior, day.",
        "evidence": {
          "exactFixture": {
            "id": "jova-town-day",
            "label": "Jova town exterior, day"
          },
          "familyFixture": {
            "id": "jova-town-day",
            "label": "Jova town exterior, day"
          }
        },
        "layoutContext": {
          "objset": "0x00",
          "area": "0x00",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x00",
          "area": "0x00",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x00",
          "0x01"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0x9EA2",
          "pointerAddress": "0x88C1",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x8072",
            "indexListPointerAddress": "0x8072",
            "indexListAddress": "0xFA3E",
            "indexOffset": 0,
            "transferId": "0x16",
            "auxiliaryTransferId": "0x2E",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88C1"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 8,
        "rowsPerLayoutSection": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj00-area00-sub00-jova-day.png",
      "width": 1024,
      "height": 448,
      "layoutSections": [
        0,
        1
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 2,
        "renderedColumns": 4,
        "renderedRows": 2,
        "totalPointers": 8
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 0,
          "area": 0,
          "submap": 0
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
          "rawLayoutIndex": 3,
          "rawLayoutIndexHex": "0x03",
          "layoutIndex": 3,
          "layoutIndexHex": "0x03",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FB",
          "address": "0x80D3"
        },
        "layoutHeader": {
          "pointerAddress": "0x80DF",
          "address": "0xFA86",
          "secondaryAddress": "0xFA50"
        },
        "tileSet": {
          "pointerAddress": "0xF7D1",
          "address": "0x841D",
          "auxiliaryAddress": "0xF7E9"
        }
      }
    },
    {
      "id": "obj00-area00-sub00-jova-night",
      "locationId": "obj00-area00-sub00-jova",
      "name": "Jova",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 0,
      "objsetHex": "0x00",
      "area": 0,
      "areaHex": "0x00",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x8042",
        "areaRecordAddress": "0xF9FF",
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
        "rawLayoutIndex": "0x03",
        "layoutIndex": "0x03",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj00-area00-sub00-jova-night-recipe",
        "label": "Jova, night",
        "status": "validated",
        "statusDetail": "Validated by Jova town exterior, night.",
        "evidence": {
          "exactFixture": {
            "id": "jova-town-night",
            "label": "Jova town exterior, night"
          },
          "familyFixture": {
            "id": "jova-town-night",
            "label": "Jova town exterior, night"
          }
        },
        "layoutContext": {
          "objset": "0x00",
          "area": "0x00",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x00",
          "area": "0x00",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x00",
          "0x01"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "bank": 4,
          "address": "0x9E80",
          "pointerAddress": "0x88BD",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x8072",
            "indexListPointerAddress": "0x8074",
            "indexListAddress": "0xFA4A",
            "indexOffset": 0,
            "transferId": "0x14",
            "auxiliaryTransferId": "0x37",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88BD"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 8,
        "rowsPerLayoutSection": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj00-area00-sub00-jova-night.png",
      "width": 1024,
      "height": 448,
      "layoutSections": [
        0,
        1
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 2,
        "renderedColumns": 4,
        "renderedRows": 2,
        "totalPointers": 8
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 0,
          "area": 0,
          "submap": 0
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
          "rawLayoutIndex": 3,
          "rawLayoutIndexHex": "0x03",
          "layoutIndex": 3,
          "layoutIndexHex": "0x03",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FB",
          "address": "0x80D3"
        },
        "layoutHeader": {
          "pointerAddress": "0x80DF",
          "address": "0xFA86",
          "secondaryAddress": "0xFA50"
        },
        "tileSet": {
          "pointerAddress": "0xF7D1",
          "address": "0x841D",
          "auxiliaryAddress": "0xF7E9"
        }
      }
    },
    {
      "id": "obj00-area01-sub00-veros-day",
      "locationId": "obj00-area01-sub00-veros",
      "name": "Veros",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 0,
      "objsetHex": "0x00",
      "area": 1,
      "areaHex": "0x01",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x8042",
        "areaRecordAddress": "0x8657",
        "pointerAddress": "0x8660",
        "address": "0x86AC",
        "firstBytes": [
          "0x01",
          "0x05",
          "0x09",
          "0x0F",
          "0x00",
          "0xFE",
          "0x17",
          "0x2E"
        ],
        "rawLayoutIndex": "0x01",
        "layoutIndex": "0x01",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj00-area01-sub00-veros-day-recipe",
        "label": "Veros, day",
        "status": "projected",
        "statusDetail": "Projected from Jova town exterior, day.",
        "evidence": {
          "familyFixture": {
            "id": "jova-town-day",
            "label": "Jova town exterior, day"
          }
        },
        "layoutContext": {
          "objset": "0x00",
          "area": "0x01",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x00",
          "area": "0x01",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x00",
          "0x01"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0x9EB3",
          "pointerAddress": "0x88C3",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x8072",
            "indexListPointerAddress": "0x8076",
            "indexListAddress": "0x86B2",
            "indexOffset": 0,
            "transferId": "0x17",
            "auxiliaryTransferId": "0x2E",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88C3"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 8,
        "rowsPerLayoutSection": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj00-area01-sub00-veros-day.png",
      "width": 1024,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 1,
        "renderedColumns": 4,
        "renderedRows": 1,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 0,
          "area": 1,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0x8660",
          "address": "0x86AC",
          "firstBytes": [
            "0x01",
            "0x05",
            "0x09",
            "0x0F",
            "0x00",
            "0xFE",
            "0x17",
            "0x2E"
          ],
          "rawLayoutIndex": 1,
          "rawLayoutIndexHex": "0x01",
          "layoutIndex": 1,
          "layoutIndexHex": "0x01",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FB",
          "address": "0x80D3"
        },
        "layoutHeader": {
          "pointerAddress": "0x80D7",
          "address": "0x86F8",
          "bank": 2,
          "secondaryAddress": "0x86C0"
        },
        "tileSet": {
          "pointerAddress": "0xF7D1",
          "address": "0x841D",
          "auxiliaryAddress": "0xF7E9"
        }
      }
    },
    {
      "id": "obj00-area01-sub00-veros-night",
      "locationId": "obj00-area01-sub00-veros",
      "name": "Veros",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 0,
      "objsetHex": "0x00",
      "area": 1,
      "areaHex": "0x01",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x8042",
        "areaRecordAddress": "0x8657",
        "pointerAddress": "0x8660",
        "address": "0x86AC",
        "firstBytes": [
          "0x01",
          "0x05",
          "0x09",
          "0x0F",
          "0x00",
          "0xFE",
          "0x17",
          "0x2E"
        ],
        "rawLayoutIndex": "0x01",
        "layoutIndex": "0x01",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj00-area01-sub00-veros-night-recipe",
        "label": "Veros, night",
        "status": "projected",
        "statusDetail": "Projected from Jova town exterior, night.",
        "evidence": {
          "familyFixture": {
            "id": "jova-town-night",
            "label": "Jova town exterior, night"
          }
        },
        "layoutContext": {
          "objset": "0x00",
          "area": "0x01",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x00",
          "area": "0x01",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x00",
          "0x01"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "bank": 4,
          "address": "0x9E80",
          "pointerAddress": "0x88BD",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x8072",
            "indexListPointerAddress": "0x8078",
            "indexListAddress": "0x86BE",
            "indexOffset": 0,
            "transferId": "0x14",
            "auxiliaryTransferId": "0x37",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88BD"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 8,
        "rowsPerLayoutSection": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj00-area01-sub00-veros-night.png",
      "width": 1024,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 1,
        "renderedColumns": 4,
        "renderedRows": 1,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 0,
          "area": 1,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0x8660",
          "address": "0x86AC",
          "firstBytes": [
            "0x01",
            "0x05",
            "0x09",
            "0x0F",
            "0x00",
            "0xFE",
            "0x17",
            "0x2E"
          ],
          "rawLayoutIndex": 1,
          "rawLayoutIndexHex": "0x01",
          "layoutIndex": 1,
          "layoutIndexHex": "0x01",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FB",
          "address": "0x80D3"
        },
        "layoutHeader": {
          "pointerAddress": "0x80D7",
          "address": "0x86F8",
          "bank": 2,
          "secondaryAddress": "0x86C0"
        },
        "tileSet": {
          "pointerAddress": "0xF7D1",
          "address": "0x841D",
          "auxiliaryAddress": "0xF7E9"
        }
      }
    },
    {
      "id": "obj00-area02-sub00-aljiba-day",
      "locationId": "obj00-area02-sub00-aljiba",
      "name": "Aljiba",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 0,
      "objsetHex": "0x00",
      "area": 2,
      "areaHex": "0x02",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x8042",
        "areaRecordAddress": "0xFAC2",
        "pointerAddress": "0xFACB",
        "address": "0xFB1E",
        "firstBytes": [
          "0x02",
          "0x00",
          "0x06",
          "0x0A",
          "0x0B",
          "0x0E",
          "0xFF",
          "0x18"
        ],
        "rawLayoutIndex": "0x02",
        "layoutIndex": "0x02",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj00-area02-sub00-aljiba-day-recipe",
        "label": "Aljiba, day",
        "status": "projected",
        "statusDetail": "Projected from Jova town exterior, day.",
        "evidence": {
          "familyFixture": {
            "id": "jova-town-day",
            "label": "Jova town exterior, day"
          }
        },
        "layoutContext": {
          "objset": "0x00",
          "area": "0x02",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x00",
          "area": "0x02",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x00",
          "0x01"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0x9EC4",
          "pointerAddress": "0x88C5",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x8072",
            "indexListPointerAddress": "0x807A",
            "indexListAddress": "0xFB25",
            "indexOffset": 0,
            "transferId": "0x18",
            "auxiliaryTransferId": "0x2E",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88C5"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 8,
        "rowsPerLayoutSection": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj00-area02-sub00-aljiba-day.png",
      "width": 1024,
      "height": 448,
      "layoutSections": [
        0,
        1
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 2,
        "renderedColumns": 4,
        "renderedRows": 2,
        "totalPointers": 8
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 0,
          "area": 2,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xFACB",
          "address": "0xFB1E",
          "firstBytes": [
            "0x02",
            "0x00",
            "0x06",
            "0x0A",
            "0x0B",
            "0x0E",
            "0xFF",
            "0x18"
          ],
          "rawLayoutIndex": 2,
          "rawLayoutIndexHex": "0x02",
          "layoutIndex": 2,
          "layoutIndexHex": "0x02",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FB",
          "address": "0x80D3"
        },
        "layoutHeader": {
          "pointerAddress": "0x80DB",
          "address": "0xFB78",
          "secondaryAddress": "0xFB3E"
        },
        "tileSet": {
          "pointerAddress": "0xF7D1",
          "address": "0x841D",
          "auxiliaryAddress": "0xF7E9"
        }
      }
    },
    {
      "id": "obj00-area02-sub00-aljiba-night",
      "locationId": "obj00-area02-sub00-aljiba",
      "name": "Aljiba",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 0,
      "objsetHex": "0x00",
      "area": 2,
      "areaHex": "0x02",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x8042",
        "areaRecordAddress": "0xFAC2",
        "pointerAddress": "0xFACB",
        "address": "0xFB1E",
        "firstBytes": [
          "0x02",
          "0x00",
          "0x06",
          "0x0A",
          "0x0B",
          "0x0E",
          "0xFF",
          "0x18"
        ],
        "rawLayoutIndex": "0x02",
        "layoutIndex": "0x02",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj00-area02-sub00-aljiba-night-recipe",
        "label": "Aljiba, night",
        "status": "projected",
        "statusDetail": "Projected from Jova town exterior, night.",
        "evidence": {
          "familyFixture": {
            "id": "jova-town-night",
            "label": "Jova town exterior, night"
          }
        },
        "layoutContext": {
          "objset": "0x00",
          "area": "0x02",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x00",
          "area": "0x02",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x00",
          "0x01"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "bank": 4,
          "address": "0x9E80",
          "pointerAddress": "0x88BD",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x8072",
            "indexListPointerAddress": "0x807C",
            "indexListAddress": "0xFB33",
            "indexOffset": 0,
            "transferId": "0x14",
            "auxiliaryTransferId": "0x37",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88BD"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 8,
        "rowsPerLayoutSection": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj00-area02-sub00-aljiba-night.png",
      "width": 1024,
      "height": 448,
      "layoutSections": [
        0,
        1
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 2,
        "renderedColumns": 4,
        "renderedRows": 2,
        "totalPointers": 8
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 0,
          "area": 2,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xFACB",
          "address": "0xFB1E",
          "firstBytes": [
            "0x02",
            "0x00",
            "0x06",
            "0x0A",
            "0x0B",
            "0x0E",
            "0xFF",
            "0x18"
          ],
          "rawLayoutIndex": 2,
          "rawLayoutIndexHex": "0x02",
          "layoutIndex": 2,
          "layoutIndexHex": "0x02",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FB",
          "address": "0x80D3"
        },
        "layoutHeader": {
          "pointerAddress": "0x80DB",
          "address": "0xFB78",
          "secondaryAddress": "0xFB3E"
        },
        "tileSet": {
          "pointerAddress": "0xF7D1",
          "address": "0x841D",
          "auxiliaryAddress": "0xF7E9"
        }
      }
    },
    {
      "id": "obj00-area03-sub00-alba-day",
      "locationId": "obj00-area03-sub00-alba",
      "name": "Alba",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 0,
      "objsetHex": "0x00",
      "area": 3,
      "areaHex": "0x03",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x8042",
        "areaRecordAddress": "0xFA0A",
        "pointerAddress": "0xFA13",
        "address": "0xFA3B",
        "firstBytes": [
          "0x04",
          "0xFE",
          "0xFF",
          "0x16",
          "0x2E",
          "0x19",
          "0x2E",
          "0x15"
        ],
        "rawLayoutIndex": "0x04",
        "layoutIndex": "0x04",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj00-area03-sub00-alba-day-recipe",
        "label": "Alba, day",
        "status": "projected",
        "statusDetail": "Projected from Jova town exterior, day.",
        "evidence": {
          "familyFixture": {
            "id": "jova-town-day",
            "label": "Jova town exterior, day"
          }
        },
        "layoutContext": {
          "objset": "0x00",
          "area": "0x03",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x00",
          "area": "0x03",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x00",
          "0x01"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0x9ED5",
          "pointerAddress": "0x88C7",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x8072",
            "indexListPointerAddress": "0x807E",
            "indexListAddress": "0xFA40",
            "indexOffset": 0,
            "transferId": "0x19",
            "auxiliaryTransferId": "0x2E",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88C7"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 8,
        "rowsPerLayoutSection": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj00-area03-sub00-alba-day.png",
      "width": 1024,
      "height": 672,
      "layoutSections": [
        0,
        1,
        2
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 3,
        "renderedColumns": 4,
        "renderedRows": 3,
        "totalPointers": 12
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 0,
          "area": 3,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xFA13",
          "address": "0xFA3B",
          "firstBytes": [
            "0x04",
            "0xFE",
            "0xFF",
            "0x16",
            "0x2E",
            "0x19",
            "0x2E",
            "0x15"
          ],
          "rawLayoutIndex": 4,
          "rawLayoutIndexHex": "0x04",
          "layoutIndex": 4,
          "layoutIndexHex": "0x04",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FB",
          "address": "0x80D3"
        },
        "layoutHeader": {
          "pointerAddress": "0x80E3",
          "address": "0xFAA0",
          "secondaryAddress": "0xFA69"
        },
        "tileSet": {
          "pointerAddress": "0xF7D1",
          "address": "0x841D",
          "auxiliaryAddress": "0xF7E9"
        }
      }
    },
    {
      "id": "obj00-area03-sub00-alba-night",
      "locationId": "obj00-area03-sub00-alba",
      "name": "Alba",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 0,
      "objsetHex": "0x00",
      "area": 3,
      "areaHex": "0x03",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x8042",
        "areaRecordAddress": "0xFA0A",
        "pointerAddress": "0xFA13",
        "address": "0xFA3B",
        "firstBytes": [
          "0x04",
          "0xFE",
          "0xFF",
          "0x16",
          "0x2E",
          "0x19",
          "0x2E",
          "0x15"
        ],
        "rawLayoutIndex": "0x04",
        "layoutIndex": "0x04",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj00-area03-sub00-alba-night-recipe",
        "label": "Alba, night",
        "status": "projected",
        "statusDetail": "Projected from Jova town exterior, night.",
        "evidence": {
          "familyFixture": {
            "id": "jova-town-night",
            "label": "Jova town exterior, night"
          }
        },
        "layoutContext": {
          "objset": "0x00",
          "area": "0x03",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x00",
          "area": "0x03",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x00",
          "0x01"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "bank": 4,
          "address": "0x9E80",
          "pointerAddress": "0x88BD",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x8072",
            "indexListPointerAddress": "0x8080",
            "indexListAddress": "0xFA4A",
            "indexOffset": 0,
            "transferId": "0x14",
            "auxiliaryTransferId": "0x37",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88BD"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 8,
        "rowsPerLayoutSection": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj00-area03-sub00-alba-night.png",
      "width": 1024,
      "height": 672,
      "layoutSections": [
        0,
        1,
        2
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 3,
        "renderedColumns": 4,
        "renderedRows": 3,
        "totalPointers": 12
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 0,
          "area": 3,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xFA13",
          "address": "0xFA3B",
          "firstBytes": [
            "0x04",
            "0xFE",
            "0xFF",
            "0x16",
            "0x2E",
            "0x19",
            "0x2E",
            "0x15"
          ],
          "rawLayoutIndex": 4,
          "rawLayoutIndexHex": "0x04",
          "layoutIndex": 4,
          "layoutIndexHex": "0x04",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FB",
          "address": "0x80D3"
        },
        "layoutHeader": {
          "pointerAddress": "0x80E3",
          "address": "0xFAA0",
          "secondaryAddress": "0xFA69"
        },
        "tileSet": {
          "pointerAddress": "0xF7D1",
          "address": "0x841D",
          "auxiliaryAddress": "0xF7E9"
        }
      }
    },
    {
      "id": "obj00-area04-sub00-ondol-day",
      "locationId": "obj00-area04-sub00-ondol",
      "name": "Ondol",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 0,
      "objsetHex": "0x00",
      "area": 4,
      "areaHex": "0x04",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x8042",
        "areaRecordAddress": "0x8662",
        "pointerAddress": "0x866B",
        "address": "0x86AD",
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
        "rawLayoutIndex": "0x05",
        "layoutIndex": "0x05",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj00-area04-sub00-ondol-day-recipe",
        "label": "Ondol, day",
        "status": "projected",
        "statusDetail": "Projected from Jova town exterior, day.",
        "evidence": {
          "familyFixture": {
            "id": "jova-town-day",
            "label": "Jova town exterior, day"
          }
        },
        "layoutContext": {
          "objset": "0x00",
          "area": "0x04",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x00",
          "area": "0x04",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x00",
          "0x01"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0x9EE6",
          "pointerAddress": "0x88C9",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x8072",
            "indexListPointerAddress": "0x8082",
            "indexListAddress": "0x86B4",
            "indexOffset": 0,
            "transferId": "0x1A",
            "auxiliaryTransferId": "0x2E",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88C9"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 8,
        "rowsPerLayoutSection": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj00-area04-sub00-ondol-day.png",
      "width": 1024,
      "height": 672,
      "layoutSections": [
        0,
        1,
        2
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 3,
        "renderedColumns": 4,
        "renderedRows": 3,
        "totalPointers": 12
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 0,
          "area": 4,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0x866B",
          "address": "0x86AD",
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
          "rawLayoutIndex": 5,
          "rawLayoutIndexHex": "0x05",
          "layoutIndex": 5,
          "layoutIndexHex": "0x05",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FB",
          "address": "0x80D3"
        },
        "layoutHeader": {
          "pointerAddress": "0x80E7",
          "address": "0x870A",
          "bank": 2,
          "secondaryAddress": "0x86C5"
        },
        "tileSet": {
          "pointerAddress": "0xF7D1",
          "address": "0x841D",
          "auxiliaryAddress": "0xF7E9"
        }
      }
    },
    {
      "id": "obj00-area04-sub00-ondol-night",
      "locationId": "obj00-area04-sub00-ondol",
      "name": "Ondol",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 0,
      "objsetHex": "0x00",
      "area": 4,
      "areaHex": "0x04",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x8042",
        "areaRecordAddress": "0x8662",
        "pointerAddress": "0x866B",
        "address": "0x86AD",
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
        "rawLayoutIndex": "0x05",
        "layoutIndex": "0x05",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj00-area04-sub00-ondol-night-recipe",
        "label": "Ondol, night",
        "status": "projected",
        "statusDetail": "Projected from Jova town exterior, night.",
        "evidence": {
          "familyFixture": {
            "id": "jova-town-night",
            "label": "Jova town exterior, night"
          }
        },
        "layoutContext": {
          "objset": "0x00",
          "area": "0x04",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x00",
          "area": "0x04",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x00",
          "0x01"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "bank": 4,
          "address": "0x9E80",
          "pointerAddress": "0x88BD",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x8072",
            "indexListPointerAddress": "0x8084",
            "indexListAddress": "0x86BE",
            "indexOffset": 0,
            "transferId": "0x14",
            "auxiliaryTransferId": "0x37",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88BD"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 8,
        "rowsPerLayoutSection": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj00-area04-sub00-ondol-night.png",
      "width": 1024,
      "height": 672,
      "layoutSections": [
        0,
        1,
        2
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 3,
        "renderedColumns": 4,
        "renderedRows": 3,
        "totalPointers": 12
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 0,
          "area": 4,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0x866B",
          "address": "0x86AD",
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
          "rawLayoutIndex": 5,
          "rawLayoutIndexHex": "0x05",
          "layoutIndex": 5,
          "layoutIndexHex": "0x05",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FB",
          "address": "0x80D3"
        },
        "layoutHeader": {
          "pointerAddress": "0x80E7",
          "address": "0x870A",
          "bank": 2,
          "secondaryAddress": "0x86C5"
        },
        "tileSet": {
          "pointerAddress": "0xF7D1",
          "address": "0x841D",
          "auxiliaryAddress": "0xF7E9"
        }
      }
    },
    {
      "id": "obj00-area05-sub00-doina-day",
      "locationId": "obj00-area05-sub00-doina",
      "name": "Doina",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 0,
      "objsetHex": "0x00",
      "area": 5,
      "areaHex": "0x05",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x8042",
        "areaRecordAddress": "0xFACD",
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
        "rawLayoutIndex": "0x00",
        "layoutIndex": "0x00",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj00-area05-sub00-doina-day-recipe",
        "label": "Doina, day",
        "status": "projected",
        "statusDetail": "Projected from Jova town exterior, day.",
        "evidence": {
          "familyFixture": {
            "id": "jova-town-day",
            "label": "Jova town exterior, day"
          }
        },
        "layoutContext": {
          "objset": "0x00",
          "area": "0x05",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x00",
          "area": "0x05",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x00",
          "0x01"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0x9EF7",
          "pointerAddress": "0x88CB",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x8072",
            "indexListPointerAddress": "0x8086",
            "indexListAddress": "0xFB27",
            "indexOffset": 0,
            "transferId": "0x1B",
            "auxiliaryTransferId": "0x2E",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88CB"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 8,
        "rowsPerLayoutSection": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj00-area05-sub00-doina-day.png",
      "width": 1024,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 1,
        "renderedColumns": 4,
        "renderedRows": 1,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 0,
          "area": 5,
          "submap": 0
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
          "rawLayoutIndex": 0,
          "rawLayoutIndexHex": "0x00",
          "layoutIndex": 0,
          "layoutIndexHex": "0x00",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FB",
          "address": "0x80D3"
        },
        "layoutHeader": {
          "pointerAddress": "0x80D3",
          "address": "0xFB66",
          "secondaryAddress": "0xFB35"
        },
        "tileSet": {
          "pointerAddress": "0xF7D1",
          "address": "0x841D",
          "auxiliaryAddress": "0xF7E9"
        }
      }
    },
    {
      "id": "obj00-area05-sub00-doina-night",
      "locationId": "obj00-area05-sub00-doina",
      "name": "Doina",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 0,
      "objsetHex": "0x00",
      "area": 5,
      "areaHex": "0x05",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x8042",
        "areaRecordAddress": "0xFACD",
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
        "rawLayoutIndex": "0x00",
        "layoutIndex": "0x00",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj00-area05-sub00-doina-night-recipe",
        "label": "Doina, night",
        "status": "projected",
        "statusDetail": "Projected from Jova town exterior, night.",
        "evidence": {
          "familyFixture": {
            "id": "jova-town-night",
            "label": "Jova town exterior, night"
          }
        },
        "layoutContext": {
          "objset": "0x00",
          "area": "0x05",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x00",
          "area": "0x05",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x00",
          "0x01"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "bank": 4,
          "address": "0x9E80",
          "pointerAddress": "0x88BD",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x8072",
            "indexListPointerAddress": "0x8088",
            "indexListAddress": "0xFB33",
            "indexOffset": 0,
            "transferId": "0x14",
            "auxiliaryTransferId": "0x37",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88BD"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 8,
        "rowsPerLayoutSection": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj00-area05-sub00-doina-night.png",
      "width": 1024,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 1,
        "renderedColumns": 4,
        "renderedRows": 1,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 0,
          "area": 5,
          "submap": 0
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
          "rawLayoutIndex": 0,
          "rawLayoutIndexHex": "0x00",
          "layoutIndex": 0,
          "layoutIndexHex": "0x00",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FB",
          "address": "0x80D3"
        },
        "layoutHeader": {
          "pointerAddress": "0x80D3",
          "address": "0xFB66",
          "secondaryAddress": "0xFB35"
        },
        "tileSet": {
          "pointerAddress": "0xF7D1",
          "address": "0x841D",
          "auxiliaryAddress": "0xF7E9"
        }
      }
    },
    {
      "id": "obj00-area06-sub00-yomi-day",
      "locationId": "obj00-area06-sub00-yomi",
      "name": "Yomi",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 0,
      "objsetHex": "0x00",
      "area": 6,
      "areaHex": "0x06",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x8042",
        "areaRecordAddress": "0xFAD8",
        "pointerAddress": "0xFAE1",
        "address": "0xFB20",
        "firstBytes": [
          "0x06",
          "0x0A",
          "0x0B",
          "0x0E",
          "0xFF",
          "0x18",
          "0x2E",
          "0x1B"
        ],
        "rawLayoutIndex": "0x06",
        "layoutIndex": "0x06",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj00-area06-sub00-yomi-day-recipe",
        "label": "Yomi, day",
        "status": "projected",
        "statusDetail": "Projected from Jova town exterior, day.",
        "evidence": {
          "familyFixture": {
            "id": "jova-town-day",
            "label": "Jova town exterior, day"
          }
        },
        "layoutContext": {
          "objset": "0x00",
          "area": "0x06",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x00",
          "area": "0x06",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x00",
          "0x01"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0x9F08",
          "pointerAddress": "0x88CD",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x8072",
            "indexListPointerAddress": "0x808A",
            "indexListAddress": "0xFB29",
            "indexOffset": 0,
            "transferId": "0x1C",
            "auxiliaryTransferId": "0x2E",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88CD"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 8,
        "rowsPerLayoutSection": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj00-area06-sub00-yomi-day.png",
      "width": 1024,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 1,
        "renderedColumns": 4,
        "renderedRows": 1,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 0,
          "area": 6,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xFAE1",
          "address": "0xFB20",
          "firstBytes": [
            "0x06",
            "0x0A",
            "0x0B",
            "0x0E",
            "0xFF",
            "0x18",
            "0x2E",
            "0x1B"
          ],
          "rawLayoutIndex": 6,
          "rawLayoutIndexHex": "0x06",
          "layoutIndex": 6,
          "layoutIndexHex": "0x06",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FB",
          "address": "0x80D3"
        },
        "layoutHeader": {
          "pointerAddress": "0x80EB",
          "address": "0xFB92",
          "secondaryAddress": "0xFB47"
        },
        "tileSet": {
          "pointerAddress": "0xF7D1",
          "address": "0x841D",
          "auxiliaryAddress": "0xF7E9"
        }
      }
    },
    {
      "id": "obj00-area06-sub00-yomi-night",
      "locationId": "obj00-area06-sub00-yomi",
      "name": "Yomi",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 0,
      "objsetHex": "0x00",
      "area": 6,
      "areaHex": "0x06",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x8042",
        "areaRecordAddress": "0xFAD8",
        "pointerAddress": "0xFAE1",
        "address": "0xFB20",
        "firstBytes": [
          "0x06",
          "0x0A",
          "0x0B",
          "0x0E",
          "0xFF",
          "0x18",
          "0x2E",
          "0x1B"
        ],
        "rawLayoutIndex": "0x06",
        "layoutIndex": "0x06",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj00-area06-sub00-yomi-night-recipe",
        "label": "Yomi, night",
        "status": "projected",
        "statusDetail": "Projected from Jova town exterior, night.",
        "evidence": {
          "familyFixture": {
            "id": "jova-town-night",
            "label": "Jova town exterior, night"
          }
        },
        "layoutContext": {
          "objset": "0x00",
          "area": "0x06",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x00",
          "area": "0x06",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x00",
          "0x01"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "bank": 4,
          "address": "0x9E80",
          "pointerAddress": "0x88BD",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x8072",
            "indexListPointerAddress": "0x808C",
            "indexListAddress": "0xFB33",
            "indexOffset": 0,
            "transferId": "0x14",
            "auxiliaryTransferId": "0x37",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88BD"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 8,
        "rowsPerLayoutSection": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj00-area06-sub00-yomi-night.png",
      "width": 1024,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 1,
        "renderedColumns": 4,
        "renderedRows": 1,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 0,
          "area": 6,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xFAE1",
          "address": "0xFB20",
          "firstBytes": [
            "0x06",
            "0x0A",
            "0x0B",
            "0x0E",
            "0xFF",
            "0x18",
            "0x2E",
            "0x1B"
          ],
          "rawLayoutIndex": 6,
          "rawLayoutIndexHex": "0x06",
          "layoutIndex": 6,
          "layoutIndexHex": "0x06",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FB",
          "address": "0x80D3"
        },
        "layoutHeader": {
          "pointerAddress": "0x80EB",
          "address": "0xFB92",
          "secondaryAddress": "0xFB47"
        },
        "tileSet": {
          "pointerAddress": "0xF7D1",
          "address": "0x841D",
          "auxiliaryAddress": "0xF7E9"
        }
      }
    },
    {
      "id": "obj01-area00-sub00-laruba-mansion-door-day",
      "locationId": "obj01-area00-sub00-laruba-mansion-door",
      "name": "Laruba Mansion - Door",
      "source": "exterior-atlas-candidate",
      "access": "mansion-door",
      "variant": "day",
      "objset": 1,
      "objsetHex": "0x01",
      "area": 0,
      "areaHex": "0x00",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x873C",
        "areaRecordAddress": "0x88C7",
        "pointerAddress": "0x88D0",
        "address": "0x88E3",
        "firstBytes": [
          "0x02",
          "0x00",
          "0x01",
          "0x0B",
          "0x0C",
          "0x0E",
          "0x47",
          "0x0E"
        ],
        "rawLayoutIndex": "0x02",
        "layoutIndex": "0x02",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj01-area00-sub00-laruba-mansion-door-day-recipe",
        "label": "Laruba Mansion - Door, day",
        "status": "projected",
        "statusDetail": "Projected from Berkeley Mansion door, day.",
        "evidence": {
          "familyFixture": {
            "id": "berkeley-mansion-door-day",
            "label": "Berkeley Mansion door, day"
          }
        },
        "layoutContext": {
          "objset": "0x01",
          "area": "0x00",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x01",
          "area": "0x00",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x08",
          "0x09"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0x9F44",
          "pointerAddress": "0x88B1",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x8762",
            "indexListPointerAddress": "0x8762",
            "indexListAddress": "0x88E8",
            "indexOffset": 0,
            "transferId": "0x0E",
            "auxiliaryTransferId": "0x47",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88B1"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj01-area00-sub00-laruba-mansion-door-day.png",
      "width": 256,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 1,
        "rows": 1,
        "renderedColumns": 1,
        "renderedRows": 1,
        "totalPointers": 1
      },
      "columnGroups": [
        0
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 1,
          "area": 0,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0x88D0",
          "address": "0x88E3",
          "firstBytes": [
            "0x02",
            "0x00",
            "0x01",
            "0x0B",
            "0x0C",
            "0x0E",
            "0x47",
            "0x0E"
          ],
          "rawLayoutIndex": 2,
          "rawLayoutIndexHex": "0x02",
          "layoutIndex": 2,
          "layoutIndexHex": "0x02",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FD",
          "address": "0x8792"
        },
        "layoutHeader": {
          "pointerAddress": "0x879A",
          "address": "0x87CF",
          "bank": 2,
          "secondaryAddress": "0x87CE"
        },
        "tileSet": {
          "pointerAddress": "0xF7D5",
          "address": "0x8891",
          "auxiliaryAddress": "0xF7EC"
        }
      }
    },
    {
      "id": "obj01-area01-sub00-berkeley-mansion-door-day",
      "locationId": "obj01-area01-sub00-berkeley-mansion-door",
      "name": "Berkeley Mansion - Door",
      "source": "exterior-atlas-candidate",
      "access": "mansion-door",
      "variant": "day",
      "objset": 1,
      "objsetHex": "0x01",
      "area": 1,
      "areaHex": "0x01",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x873C",
        "areaRecordAddress": "0x8D3A",
        "pointerAddress": "0x8D43",
        "address": "0x8D61",
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
        "rawLayoutIndex": "0x02",
        "layoutIndex": "0x02",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj01-area01-sub00-berkeley-mansion-door-day-recipe",
        "label": "Berkeley Mansion - Door, day",
        "status": "validated",
        "statusDetail": "Validated by Berkeley Mansion door, day.",
        "evidence": {
          "exactFixture": {
            "id": "berkeley-mansion-door-day",
            "label": "Berkeley Mansion door, day"
          },
          "familyFixture": {
            "id": "berkeley-mansion-door-day",
            "label": "Berkeley Mansion door, day"
          }
        },
        "layoutContext": {
          "objset": "0x01",
          "area": "0x01",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x01",
          "area": "0x01",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x08",
          "0x09"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0x9F5E",
          "pointerAddress": "0x88B3",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x8762",
            "indexListPointerAddress": "0x8766",
            "indexListAddress": "0x8D65",
            "indexOffset": 0,
            "transferId": "0x0F",
            "auxiliaryTransferId": "0x48",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88B3"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj01-area01-sub00-berkeley-mansion-door-day.png",
      "width": 256,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 1,
        "rows": 1,
        "renderedColumns": 1,
        "renderedRows": 1,
        "totalPointers": 1
      },
      "columnGroups": [
        0
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 1,
          "area": 1,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0x8D43",
          "address": "0x8D61",
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
          "rawLayoutIndex": 2,
          "rawLayoutIndexHex": "0x02",
          "layoutIndex": 2,
          "layoutIndexHex": "0x02",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FD",
          "address": "0x8792"
        },
        "layoutHeader": {
          "pointerAddress": "0x879A",
          "address": "0x87CF",
          "bank": 2,
          "secondaryAddress": "0x87CE"
        },
        "tileSet": {
          "pointerAddress": "0xF7D5",
          "address": "0x8891",
          "auxiliaryAddress": "0xF7EC"
        }
      }
    },
    {
      "id": "obj01-area02-sub00-rover-mansion-door-day",
      "locationId": "obj01-area02-sub00-rover-mansion-door",
      "name": "Rover Mansion - Door",
      "source": "exterior-atlas-candidate",
      "access": "mansion-door",
      "variant": "day",
      "objset": 1,
      "objsetHex": "0x01",
      "area": 2,
      "areaHex": "0x02",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x873C",
        "areaRecordAddress": "0x924A",
        "pointerAddress": "0x9253",
        "address": "0x9257",
        "firstBytes": [
          "0x03",
          "0x10",
          "0x49",
          "0x10",
          "0x49",
          "0x10",
          "0x49",
          "0x0D"
        ],
        "rawLayoutIndex": "0x03",
        "layoutIndex": "0x03",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj01-area02-sub00-rover-mansion-door-day-recipe",
        "label": "Rover Mansion - Door, day",
        "status": "projected",
        "statusDetail": "Projected from Berkeley Mansion door, day.",
        "evidence": {
          "familyFixture": {
            "id": "berkeley-mansion-door-day",
            "label": "Berkeley Mansion door, day"
          }
        },
        "layoutContext": {
          "objset": "0x01",
          "area": "0x02",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x01",
          "area": "0x02",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x08",
          "0x09"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0x9F78",
          "pointerAddress": "0x88B5",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x8762",
            "indexListPointerAddress": "0x876A",
            "indexListAddress": "0x9258",
            "indexOffset": 0,
            "transferId": "0x10",
            "auxiliaryTransferId": "0x49",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88B5"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj01-area02-sub00-rover-mansion-door-day.png",
      "width": 256,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 1,
        "rows": 1,
        "renderedColumns": 1,
        "renderedRows": 1,
        "totalPointers": 1
      },
      "columnGroups": [
        0
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 1,
          "area": 2,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0x9253",
          "address": "0x9257",
          "firstBytes": [
            "0x03",
            "0x10",
            "0x49",
            "0x10",
            "0x49",
            "0x10",
            "0x49",
            "0x0D"
          ],
          "rawLayoutIndex": 3,
          "rawLayoutIndexHex": "0x03",
          "layoutIndex": 3,
          "layoutIndexHex": "0x03",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FD",
          "address": "0x8792"
        },
        "layoutHeader": {
          "pointerAddress": "0x879E",
          "address": "0x87D5",
          "bank": 2,
          "secondaryAddress": "0x87CE"
        },
        "tileSet": {
          "pointerAddress": "0xF7D5",
          "address": "0x8891",
          "auxiliaryAddress": "0xF7EC"
        }
      }
    },
    {
      "id": "obj01-area03-sub00-brahm-mansion-door-day",
      "locationId": "obj01-area03-sub00-brahm-mansion-door",
      "name": "Brahm Mansion - Door",
      "source": "exterior-atlas-candidate",
      "access": "mansion-door",
      "variant": "day",
      "objset": 1,
      "objsetHex": "0x01",
      "area": 3,
      "areaHex": "0x03",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x873C",
        "areaRecordAddress": "0x967B",
        "pointerAddress": "0x9684",
        "address": "0x9697",
        "firstBytes": [
          "0x02",
          "0x08",
          "0x0A",
          "0x0B",
          "0x0C",
          "0x00",
          "0xFD",
          "0x00"
        ],
        "rawLayoutIndex": "0x02",
        "layoutIndex": "0x02",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj01-area03-sub00-brahm-mansion-door-day-recipe",
        "label": "Brahm Mansion - Door, day",
        "status": "projected",
        "statusDetail": "Projected from Berkeley Mansion door, day.",
        "evidence": {
          "familyFixture": {
            "id": "berkeley-mansion-door-day",
            "label": "Berkeley Mansion door, day"
          }
        },
        "layoutContext": {
          "objset": "0x01",
          "area": "0x03",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x01",
          "area": "0x03",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x08",
          "0x09"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0x9F92",
          "pointerAddress": "0x88B7",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x8762",
            "indexListPointerAddress": "0x876E",
            "indexListAddress": "0x969F",
            "indexOffset": 0,
            "transferId": "0x11",
            "auxiliaryTransferId": "0x4A",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88B7"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj01-area03-sub00-brahm-mansion-door-day.png",
      "width": 256,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 1,
        "rows": 1,
        "renderedColumns": 1,
        "renderedRows": 1,
        "totalPointers": 1
      },
      "columnGroups": [
        0
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 1,
          "area": 3,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0x9684",
          "address": "0x9697",
          "firstBytes": [
            "0x02",
            "0x08",
            "0x0A",
            "0x0B",
            "0x0C",
            "0x00",
            "0xFD",
            "0x00"
          ],
          "rawLayoutIndex": 2,
          "rawLayoutIndexHex": "0x02",
          "layoutIndex": 2,
          "layoutIndexHex": "0x02",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FD",
          "address": "0x8792"
        },
        "layoutHeader": {
          "pointerAddress": "0x879A",
          "address": "0x87CF",
          "bank": 2,
          "secondaryAddress": "0x87CE"
        },
        "tileSet": {
          "pointerAddress": "0xF7D5",
          "address": "0x8891",
          "auxiliaryAddress": "0xF7EC"
        }
      }
    },
    {
      "id": "obj01-area04-sub00-bodley-mansion-door-day",
      "locationId": "obj01-area04-sub00-bodley-mansion-door",
      "name": "Bodley Mansion - Door",
      "source": "exterior-atlas-candidate",
      "access": "mansion-door",
      "variant": "day",
      "objset": 1,
      "objsetHex": "0x01",
      "area": 4,
      "areaHex": "0x04",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x873C",
        "areaRecordAddress": "0x9A51",
        "pointerAddress": "0x9A5A",
        "address": "0x9A69",
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
        "rawLayoutIndex": "0x02",
        "layoutIndex": "0x02",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj01-area04-sub00-bodley-mansion-door-day-recipe",
        "label": "Bodley Mansion - Door, day",
        "status": "projected",
        "statusDetail": "Projected from Berkeley Mansion door, day.",
        "evidence": {
          "familyFixture": {
            "id": "berkeley-mansion-door-day",
            "label": "Berkeley Mansion door, day"
          }
        },
        "layoutContext": {
          "objset": "0x01",
          "area": "0x04",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x01",
          "area": "0x04",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x08",
          "0x09"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0x9FAC",
          "pointerAddress": "0x88BB",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x8762",
            "indexListPointerAddress": "0x8772",
            "indexListAddress": "0x9A6D",
            "indexOffset": 0,
            "transferId": "0x13",
            "auxiliaryTransferId": "0x4B",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88BB"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj01-area04-sub00-bodley-mansion-door-day.png",
      "width": 256,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 1,
        "rows": 1,
        "renderedColumns": 1,
        "renderedRows": 1,
        "totalPointers": 1
      },
      "columnGroups": [
        0
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 1,
          "area": 4,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0x9A5A",
          "address": "0x9A69",
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
          "rawLayoutIndex": 2,
          "rawLayoutIndexHex": "0x02",
          "layoutIndex": 2,
          "layoutIndexHex": "0x02",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FD",
          "address": "0x8792"
        },
        "layoutHeader": {
          "pointerAddress": "0x879A",
          "address": "0x87CF",
          "bank": 2,
          "secondaryAddress": "0x87CE"
        },
        "tileSet": {
          "pointerAddress": "0xF7D5",
          "address": "0x8891",
          "auxiliaryAddress": "0xF7EC"
        }
      }
    },
    {
      "id": "obj02-area00-sub00-jova-woods-day",
      "locationId": "obj02-area00-sub00-jova-woods",
      "name": "Jova Woods",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 0,
      "areaHex": "0x00",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA149",
        "pointerAddress": "0xA152",
        "address": "0xA1A0",
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
        "rawLayoutIndex": "0x02",
        "layoutIndex": "0x02",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area00-sub00-jova-woods-day-recipe",
        "label": "Jova Woods, day",
        "status": "validated",
        "statusDetail": "Validated by Jova Woods, day.",
        "evidence": {
          "exactFixture": {
            "id": "jova-woods-day",
            "label": "Jova Woods, day"
          },
          "familyFixture": {
            "id": "jova-woods-day",
            "label": "Jova Woods, day"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x00",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x00",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0x9FC6",
          "pointerAddress": "0x88D9",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9EF9",
            "indexListAddress": "0xA1C0",
            "indexOffset": 0,
            "transferId": "0x22",
            "auxiliaryTransferId": "0x2F",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88D9"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area00-sub00-jova-woods-day.png",
      "width": 1024,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 1,
        "renderedColumns": 4,
        "renderedRows": 1,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 0,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xA152",
          "address": "0xA1A0",
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
          "rawLayoutIndex": 2,
          "rawLayoutIndexHex": "0x02",
          "layoutIndex": 2,
          "layoutIndexHex": "0x02",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F29",
          "address": "0xA23E",
          "bank": 2,
          "secondaryAddress": "0xA221"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area00-sub00-jova-woods-night",
      "locationId": "obj02-area00-sub00-jova-woods",
      "name": "Jova Woods",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 0,
      "areaHex": "0x00",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA149",
        "pointerAddress": "0xA152",
        "address": "0xA1A0",
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
        "rawLayoutIndex": "0x02",
        "layoutIndex": "0x02",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area00-sub00-jova-woods-night-recipe",
        "label": "Jova Woods, night",
        "status": "validated",
        "statusDetail": "Validated by Jova Woods, night.",
        "evidence": {
          "exactFixture": {
            "id": "jova-woods-night",
            "label": "Jova Woods, night"
          },
          "familyFixture": {
            "id": "jova-woods-night",
            "label": "Jova Woods, night"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x00",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x00",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "bank": 4,
          "address": "0x9FF9",
          "pointerAddress": "0x88DF",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9EFB",
            "indexListAddress": "0xA1DC",
            "indexOffset": 0,
            "transferId": "0x25",
            "auxiliaryTransferId": "0x2F",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88DF"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area00-sub00-jova-woods-night.png",
      "width": 1024,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 1,
        "renderedColumns": 4,
        "renderedRows": 1,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 0,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xA152",
          "address": "0xA1A0",
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
          "rawLayoutIndex": 2,
          "rawLayoutIndexHex": "0x02",
          "layoutIndex": 2,
          "layoutIndexHex": "0x02",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F29",
          "address": "0xA23E",
          "bank": 2,
          "secondaryAddress": "0xA221"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area00-sub01-jova-veros-bridge-day",
      "locationId": "obj02-area00-sub01-jova-veros-bridge",
      "name": "Jova-Veros Bridge",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 0,
      "areaHex": "0x00",
      "submap": 1,
      "submapHex": "0x01",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA149",
        "pointerAddress": "0xA154",
        "address": "0xA1A1",
        "firstBytes": [
          "0x04",
          "0x05",
          "0xFE",
          "0x06",
          "0xFF",
          "0x00",
          "0x01",
          "0x16"
        ],
        "rawLayoutIndex": "0x04",
        "layoutIndex": "0x04",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area00-sub01-jova-veros-bridge-day-recipe",
        "label": "Jova-Veros Bridge, day",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, day.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-day",
            "label": "Jova Woods, day"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x00",
          "submap": "0x01"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x00",
          "submap": "0x01"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "address": "0xCAF3",
          "pointerAddress": "0x88D3",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9EF9",
            "indexListAddress": "0xA1C0",
            "indexOffset": 2,
            "transferId": "0x1F",
            "auxiliaryTransferId": "0x2F",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88D3"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area00-sub01-jova-veros-bridge-day.png",
      "width": 1024,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 1,
        "renderedColumns": 4,
        "renderedRows": 1,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 0,
          "submap": 1
        },
        "screenRecord": {
          "pointerAddress": "0xA154",
          "address": "0xA1A1",
          "firstBytes": [
            "0x04",
            "0x05",
            "0xFE",
            "0x06",
            "0xFF",
            "0x00",
            "0x01",
            "0x16"
          ],
          "rawLayoutIndex": 4,
          "rawLayoutIndexHex": "0x04",
          "layoutIndex": 4,
          "layoutIndexHex": "0x04",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F31",
          "address": "0xA250",
          "bank": 2,
          "secondaryAddress": "0xA221"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area00-sub01-jova-veros-bridge-night",
      "locationId": "obj02-area00-sub01-jova-veros-bridge",
      "name": "Jova-Veros Bridge",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 0,
      "areaHex": "0x00",
      "submap": 1,
      "submapHex": "0x01",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA149",
        "pointerAddress": "0xA154",
        "address": "0xA1A1",
        "firstBytes": [
          "0x04",
          "0x05",
          "0xFE",
          "0x06",
          "0xFF",
          "0x00",
          "0x01",
          "0x16"
        ],
        "rawLayoutIndex": "0x04",
        "layoutIndex": "0x04",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area00-sub01-jova-veros-bridge-night-recipe",
        "label": "Jova-Veros Bridge, night",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, night.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-night",
            "label": "Jova Woods, night"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x00",
          "submap": "0x01"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x00",
          "submap": "0x01"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "address": "0xCB15",
          "pointerAddress": "0x88D7",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9EFB",
            "indexListAddress": "0xA1DC",
            "indexOffset": 2,
            "transferId": "0x21",
            "auxiliaryTransferId": "0x2F",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88D7"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area00-sub01-jova-veros-bridge-night.png",
      "width": 1024,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 1,
        "renderedColumns": 4,
        "renderedRows": 1,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 0,
          "submap": 1
        },
        "screenRecord": {
          "pointerAddress": "0xA154",
          "address": "0xA1A1",
          "firstBytes": [
            "0x04",
            "0x05",
            "0xFE",
            "0x06",
            "0xFF",
            "0x00",
            "0x01",
            "0x16"
          ],
          "rawLayoutIndex": 4,
          "rawLayoutIndexHex": "0x04",
          "layoutIndex": 4,
          "layoutIndexHex": "0x04",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F31",
          "address": "0xA250",
          "bank": 2,
          "secondaryAddress": "0xA221"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area00-sub02-veros-woods-part-1-day",
      "locationId": "obj02-area00-sub02-veros-woods-part-1",
      "name": "Veros Woods - Part 1",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 0,
      "areaHex": "0x00",
      "submap": 2,
      "submapHex": "0x02",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA149",
        "pointerAddress": "0xA156",
        "address": "0xA1A2",
        "firstBytes": [
          "0x05",
          "0xFE",
          "0x06",
          "0xFF",
          "0x00",
          "0x01",
          "0x16",
          "0x0B"
        ],
        "rawLayoutIndex": "0x05",
        "layoutIndex": "0x05",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area00-sub02-veros-woods-part-1-day-recipe",
        "label": "Veros Woods - Part 1, day",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, day.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-day",
            "label": "Jova Woods, day"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x00",
          "submap": "0x02"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x00",
          "submap": "0x02"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0x9FD7",
          "pointerAddress": "0x88DB",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9EF9",
            "indexListAddress": "0xA1C0",
            "indexOffset": 4,
            "transferId": "0x23",
            "auxiliaryTransferId": "0x30",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88DB"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area00-sub02-veros-woods-part-1-day.png",
      "width": 512,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 2,
        "rows": 1,
        "renderedColumns": 2,
        "renderedRows": 1,
        "totalPointers": 2
      },
      "columnGroups": [
        0,
        1
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 0,
          "submap": 2
        },
        "screenRecord": {
          "pointerAddress": "0xA156",
          "address": "0xA1A2",
          "firstBytes": [
            "0x05",
            "0xFE",
            "0x06",
            "0xFF",
            "0x00",
            "0x01",
            "0x16",
            "0x0B"
          ],
          "rawLayoutIndex": 5,
          "rawLayoutIndexHex": "0x05",
          "layoutIndex": 5,
          "layoutIndexHex": "0x05",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F35",
          "address": "0xA262",
          "bank": 2,
          "secondaryAddress": "0xA218"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area00-sub02-veros-woods-part-1-night",
      "locationId": "obj02-area00-sub02-veros-woods-part-1",
      "name": "Veros Woods - Part 1",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 0,
      "areaHex": "0x00",
      "submap": 2,
      "submapHex": "0x02",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA149",
        "pointerAddress": "0xA156",
        "address": "0xA1A2",
        "firstBytes": [
          "0x05",
          "0xFE",
          "0x06",
          "0xFF",
          "0x00",
          "0x01",
          "0x16",
          "0x0B"
        ],
        "rawLayoutIndex": "0x05",
        "layoutIndex": "0x05",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area00-sub02-veros-woods-part-1-night-recipe",
        "label": "Veros Woods - Part 1, night",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, night.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-night",
            "label": "Jova Woods, night"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x00",
          "submap": "0x02"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x00",
          "submap": "0x02"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "bank": 4,
          "address": "0x9FF9",
          "pointerAddress": "0x88DF",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9EFB",
            "indexListAddress": "0xA1DC",
            "indexOffset": 4,
            "transferId": "0x25",
            "auxiliaryTransferId": "0x30",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88DF"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area00-sub02-veros-woods-part-1-night.png",
      "width": 512,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 2,
        "rows": 1,
        "renderedColumns": 2,
        "renderedRows": 1,
        "totalPointers": 2
      },
      "columnGroups": [
        0,
        1
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 0,
          "submap": 2
        },
        "screenRecord": {
          "pointerAddress": "0xA156",
          "address": "0xA1A2",
          "firstBytes": [
            "0x05",
            "0xFE",
            "0x06",
            "0xFF",
            "0x00",
            "0x01",
            "0x16",
            "0x0B"
          ],
          "rawLayoutIndex": 5,
          "rawLayoutIndexHex": "0x05",
          "layoutIndex": 5,
          "layoutIndexHex": "0x05",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F35",
          "address": "0xA262",
          "bank": 2,
          "secondaryAddress": "0xA218"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area00-sub03-veros-woods-part-2-day",
      "locationId": "obj02-area00-sub03-veros-woods-part-2",
      "name": "Veros Woods - Part 2",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 0,
      "areaHex": "0x00",
      "submap": 3,
      "submapHex": "0x03",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA149",
        "pointerAddress": "0xA158",
        "address": "0xA1A3",
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
        "rawLayoutIndex": "0xFE",
        "layoutIndex": "0x06",
        "layoutIndexSource": "special-0xFE-byte-1"
      },
      "recipe": {
        "id": "obj02-area00-sub03-veros-woods-part-2-day-recipe",
        "label": "Veros Woods - Part 2, day",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, day.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-day",
            "label": "Jova Woods, day"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x00",
          "submap": "0x03"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x00",
          "submap": "0x03"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0x9FD7",
          "pointerAddress": "0x88DB",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9EF9",
            "indexListAddress": "0xA1C0",
            "indexOffset": 6,
            "transferId": "0x23",
            "auxiliaryTransferId": "0x30",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88DB"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area00-sub03-veros-woods-part-2-day.png",
      "width": 512,
      "height": 448,
      "layoutSections": [
        0,
        1
      ],
      "layoutGrid": {
        "columns": 2,
        "rows": 2,
        "renderedColumns": 2,
        "renderedRows": 2,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 0,
          "submap": 3
        },
        "screenRecord": {
          "pointerAddress": "0xA158",
          "address": "0xA1A3",
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
          "rawLayoutIndex": 254,
          "rawLayoutIndexHex": "0xFE",
          "layoutIndex": 6,
          "layoutIndexHex": "0x06",
          "layoutIndexSource": "segment-override"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F39",
          "address": "0xA26C",
          "bank": 2,
          "secondaryAddress": "0xA1F8"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area00-sub03-veros-woods-part-2-night",
      "locationId": "obj02-area00-sub03-veros-woods-part-2",
      "name": "Veros Woods - Part 2",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 0,
      "areaHex": "0x00",
      "submap": 3,
      "submapHex": "0x03",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA149",
        "pointerAddress": "0xA158",
        "address": "0xA1A3",
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
        "rawLayoutIndex": "0xFE",
        "layoutIndex": "0x06",
        "layoutIndexSource": "special-0xFE-byte-1"
      },
      "recipe": {
        "id": "obj02-area00-sub03-veros-woods-part-2-night-recipe",
        "label": "Veros Woods - Part 2, night",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, night.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-night",
            "label": "Jova Woods, night"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x00",
          "submap": "0x03"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x00",
          "submap": "0x03"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "bank": 4,
          "address": "0x9FF9",
          "pointerAddress": "0x88DF",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9EFB",
            "indexListAddress": "0xA1DC",
            "indexOffset": 6,
            "transferId": "0x25",
            "auxiliaryTransferId": "0x30",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88DF"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area00-sub03-veros-woods-part-2-night.png",
      "width": 512,
      "height": 448,
      "layoutSections": [
        0,
        1
      ],
      "layoutGrid": {
        "columns": 2,
        "rows": 2,
        "renderedColumns": 2,
        "renderedRows": 2,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 0,
          "submap": 3
        },
        "screenRecord": {
          "pointerAddress": "0xA158",
          "address": "0xA1A3",
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
          "rawLayoutIndex": 254,
          "rawLayoutIndexHex": "0xFE",
          "layoutIndex": 6,
          "layoutIndexHex": "0x06",
          "layoutIndexSource": "segment-override"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F39",
          "address": "0xA26C",
          "bank": 2,
          "secondaryAddress": "0xA1F8"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area01-sub00-denis-woods-part-1-day",
      "locationId": "obj02-area01-sub00-denis-woods-part-1",
      "name": "Denis Woods - Part 1",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 1,
      "areaHex": "0x01",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA15A",
        "pointerAddress": "0xA163",
        "address": "0xA1A8",
        "firstBytes": [
          "0x16",
          "0x0B",
          "0x0C",
          "0xFE",
          "0x0D",
          "0xFF",
          "0x00",
          "0x06"
        ],
        "rawLayoutIndex": "0x16",
        "layoutIndex": "0x16",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area01-sub00-denis-woods-part-1-day-recipe",
        "label": "Denis Woods - Part 1, day",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, day.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-day",
            "label": "Jova Woods, day"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x01",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x01",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0x9FD7",
          "pointerAddress": "0x88DB",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9EFD",
            "indexListAddress": "0xA1BE",
            "indexOffset": 0,
            "transferId": "0x23",
            "auxiliaryTransferId": "0x30",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88DB"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area01-sub00-denis-woods-part-1-day.png",
      "width": 512,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 2,
        "rows": 1,
        "renderedColumns": 2,
        "renderedRows": 1,
        "totalPointers": 2
      },
      "columnGroups": [
        0,
        1
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 1,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xA163",
          "address": "0xA1A8",
          "firstBytes": [
            "0x16",
            "0x0B",
            "0x0C",
            "0xFE",
            "0x0D",
            "0xFF",
            "0x00",
            "0x06"
          ],
          "rawLayoutIndex": 22,
          "rawLayoutIndexHex": "0x16",
          "layoutIndex": 22,
          "layoutIndexHex": "0x16",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F79",
          "address": "0xA2C6",
          "bank": 2,
          "secondaryAddress": "0xA221"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area01-sub00-denis-woods-part-1-night",
      "locationId": "obj02-area01-sub00-denis-woods-part-1",
      "name": "Denis Woods - Part 1",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 1,
      "areaHex": "0x01",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA15A",
        "pointerAddress": "0xA163",
        "address": "0xA1A8",
        "firstBytes": [
          "0x16",
          "0x0B",
          "0x0C",
          "0xFE",
          "0x0D",
          "0xFF",
          "0x00",
          "0x06"
        ],
        "rawLayoutIndex": "0x16",
        "layoutIndex": "0x16",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area01-sub00-denis-woods-part-1-night-recipe",
        "label": "Denis Woods - Part 1, night",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, night.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-night",
            "label": "Jova Woods, night"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x01",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x01",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "bank": 4,
          "address": "0x9FF9",
          "pointerAddress": "0x88DF",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9EFF",
            "indexListAddress": "0xA1DA",
            "indexOffset": 0,
            "transferId": "0x25",
            "auxiliaryTransferId": "0x2F",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88DF"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area01-sub00-denis-woods-part-1-night.png",
      "width": 512,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 2,
        "rows": 1,
        "renderedColumns": 2,
        "renderedRows": 1,
        "totalPointers": 2
      },
      "columnGroups": [
        0,
        1
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 1,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xA163",
          "address": "0xA1A8",
          "firstBytes": [
            "0x16",
            "0x0B",
            "0x0C",
            "0xFE",
            "0x0D",
            "0xFF",
            "0x00",
            "0x06"
          ],
          "rawLayoutIndex": 22,
          "rawLayoutIndexHex": "0x16",
          "layoutIndex": 22,
          "layoutIndexHex": "0x16",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F79",
          "address": "0xA2C6",
          "bank": 2,
          "secondaryAddress": "0xA221"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area02-sub00-aljiba-woods-part-3-day",
      "locationId": "obj02-area02-sub00-aljiba-woods-part-3",
      "name": "Aljiba Woods - Part 3",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 2,
      "areaHex": "0x02",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA69A",
        "pointerAddress": "0xA6A3",
        "address": "0xA6D0",
        "firstBytes": [
          "0x18",
          "0xFD",
          "0x13",
          "0xFF",
          "0x00",
          "0x01",
          "0x14",
          "0x08"
        ],
        "rawLayoutIndex": "0x18",
        "layoutIndex": "0x18",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area02-sub00-aljiba-woods-part-3-day-recipe",
        "label": "Aljiba Woods - Part 3, day",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, day.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-day",
            "label": "Jova Woods, day"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x02",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x02",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0x9FD7",
          "pointerAddress": "0x88DB",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9F01",
            "indexListAddress": "0xA6E9",
            "indexOffset": 0,
            "transferId": "0x23",
            "auxiliaryTransferId": "0x31",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88DB"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area02-sub00-aljiba-woods-part-3-day.png",
      "width": 512,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 2,
        "rows": 1,
        "renderedColumns": 2,
        "renderedRows": 1,
        "totalPointers": 2
      },
      "columnGroups": [
        0,
        1
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 2,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xA6A3",
          "address": "0xA6D0",
          "firstBytes": [
            "0x18",
            "0xFD",
            "0x13",
            "0xFF",
            "0x00",
            "0x01",
            "0x14",
            "0x08"
          ],
          "rawLayoutIndex": 24,
          "rawLayoutIndexHex": "0x18",
          "layoutIndex": 24,
          "layoutIndexHex": "0x18",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F81",
          "address": "0xA792",
          "bank": 2,
          "secondaryAddress": "0xA72F"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area02-sub00-aljiba-woods-part-3-night",
      "locationId": "obj02-area02-sub00-aljiba-woods-part-3",
      "name": "Aljiba Woods - Part 3",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 2,
      "areaHex": "0x02",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA69A",
        "pointerAddress": "0xA6A3",
        "address": "0xA6D0",
        "firstBytes": [
          "0x18",
          "0xFD",
          "0x13",
          "0xFF",
          "0x00",
          "0x01",
          "0x14",
          "0x08"
        ],
        "rawLayoutIndex": "0x18",
        "layoutIndex": "0x18",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area02-sub00-aljiba-woods-part-3-night-recipe",
        "label": "Aljiba Woods - Part 3, night",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, night.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-night",
            "label": "Jova Woods, night"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x02",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x02",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "bank": 4,
          "address": "0x9FF9",
          "pointerAddress": "0x88DF",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9F03",
            "indexListAddress": "0xA6FB",
            "indexOffset": 0,
            "transferId": "0x25",
            "auxiliaryTransferId": "0x31",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88DF"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area02-sub00-aljiba-woods-part-3-night.png",
      "width": 512,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 2,
        "rows": 1,
        "renderedColumns": 2,
        "renderedRows": 1,
        "totalPointers": 2
      },
      "columnGroups": [
        0,
        1
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 2,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xA6A3",
          "address": "0xA6D0",
          "firstBytes": [
            "0x18",
            "0xFD",
            "0x13",
            "0xFF",
            "0x00",
            "0x01",
            "0x14",
            "0x08"
          ],
          "rawLayoutIndex": 24,
          "rawLayoutIndexHex": "0x18",
          "layoutIndex": 24,
          "layoutIndexHex": "0x18",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F81",
          "address": "0xA792",
          "bank": 2,
          "secondaryAddress": "0xA72F"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area03-sub00-dabi-s-path-part-1-day",
      "locationId": "obj02-area03-sub00-dabi-s-path-part-1",
      "name": "Dabi's Path - Part 1",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 3,
      "areaHex": "0x03",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA6A5",
        "pointerAddress": "0xA6AE",
        "address": "0xA6D1",
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
        "rawLayoutIndex": "0xFD",
        "layoutIndex": "0x13",
        "layoutIndexSource": "special-0xFD-byte-1"
      },
      "recipe": {
        "id": "obj02-area03-sub00-dabi-s-path-part-1-day-recipe",
        "label": "Dabi's Path - Part 1, day",
        "status": "validated",
        "statusDetail": "Validated by Dabi's Path, day.",
        "evidence": {
          "exactFixture": {
            "id": "dabis-path-day",
            "label": "Dabi's Path, day"
          },
          "familyFixture": {
            "id": "jova-woods-day",
            "label": "Jova Woods, day"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x03",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x03",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0xA00A",
          "pointerAddress": "0x88E1",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9F05",
            "indexListAddress": "0xA6EB",
            "indexOffset": 0,
            "transferId": "0x26",
            "auxiliaryTransferId": "0x31",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88E1"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area03-sub00-dabi-s-path-part-1-day.png",
      "width": 512,
      "height": 448,
      "layoutSections": [
        0,
        1
      ],
      "layoutGrid": {
        "columns": 2,
        "rows": 2,
        "renderedColumns": 2,
        "renderedRows": 2,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 3,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xA6AE",
          "address": "0xA6D1",
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
          "rawLayoutIndex": 253,
          "rawLayoutIndexHex": "0xFD",
          "layoutIndex": 19,
          "layoutIndexHex": "0x13",
          "layoutIndexSource": "segment-override"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F6D",
          "address": "0xA75E",
          "bank": 2,
          "secondaryAddress": "0xA71E"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area03-sub00-dabi-s-path-part-1-night",
      "locationId": "obj02-area03-sub00-dabi-s-path-part-1",
      "name": "Dabi's Path - Part 1",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 3,
      "areaHex": "0x03",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA6A5",
        "pointerAddress": "0xA6AE",
        "address": "0xA6D1",
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
        "rawLayoutIndex": "0xFD",
        "layoutIndex": "0x13",
        "layoutIndexSource": "special-0xFD-byte-1"
      },
      "recipe": {
        "id": "obj02-area03-sub00-dabi-s-path-part-1-night-recipe",
        "label": "Dabi's Path - Part 1, night",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, night.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-night",
            "label": "Jova Woods, night"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x03",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x03",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "bank": 4,
          "address": "0xA00A",
          "pointerAddress": "0x88E1",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9F07",
            "indexListAddress": "0xA6FD",
            "indexOffset": 0,
            "transferId": "0x26",
            "auxiliaryTransferId": "0x31",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88E1"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area03-sub00-dabi-s-path-part-1-night.png",
      "width": 512,
      "height": 448,
      "layoutSections": [
        0,
        1
      ],
      "layoutGrid": {
        "columns": 2,
        "rows": 2,
        "renderedColumns": 2,
        "renderedRows": 2,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 3,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xA6AE",
          "address": "0xA6D1",
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
          "rawLayoutIndex": 253,
          "rawLayoutIndexHex": "0xFD",
          "layoutIndex": 19,
          "layoutIndexHex": "0x13",
          "layoutIndexSource": "segment-override"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F6D",
          "address": "0xA75E",
          "bank": 2,
          "secondaryAddress": "0xA71E"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area03-sub01-dabi-s-path-part-2-day",
      "locationId": "obj02-area03-sub01-dabi-s-path-part-2",
      "name": "Dabi's Path - Part 2",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 3,
      "areaHex": "0x03",
      "submap": 1,
      "submapHex": "0x01",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA6A5",
        "pointerAddress": "0xA6B0",
        "address": "0xA6D6",
        "firstBytes": [
          "0x14",
          "0x08",
          "0xFE",
          "0x09",
          "0x00",
          "0x00",
          "0x05",
          "0x07"
        ],
        "rawLayoutIndex": "0x14",
        "layoutIndex": "0x14",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area03-sub01-dabi-s-path-part-2-day-recipe",
        "label": "Dabi's Path - Part 2, day",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, day.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-day",
            "label": "Jova Woods, day"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x03",
          "submap": "0x01"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x03",
          "submap": "0x01"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0xA00A",
          "pointerAddress": "0x88E1",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9F05",
            "indexListAddress": "0xA6EB",
            "indexOffset": 2,
            "transferId": "0x26",
            "auxiliaryTransferId": "0x31",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88E1"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area03-sub01-dabi-s-path-part-2-day.png",
      "width": 512,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 2,
        "rows": 1,
        "renderedColumns": 2,
        "renderedRows": 1,
        "totalPointers": 2
      },
      "columnGroups": [
        0,
        1
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 3,
          "submap": 1
        },
        "screenRecord": {
          "pointerAddress": "0xA6B0",
          "address": "0xA6D6",
          "firstBytes": [
            "0x14",
            "0x08",
            "0xFE",
            "0x09",
            "0x00",
            "0x00",
            "0x05",
            "0x07"
          ],
          "rawLayoutIndex": 20,
          "rawLayoutIndexHex": "0x14",
          "layoutIndex": 20,
          "layoutIndexHex": "0x14",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F71",
          "address": "0xA76C",
          "bank": 2,
          "secondaryAddress": "0xA72F"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area03-sub01-dabi-s-path-part-2-night",
      "locationId": "obj02-area03-sub01-dabi-s-path-part-2",
      "name": "Dabi's Path - Part 2",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 3,
      "areaHex": "0x03",
      "submap": 1,
      "submapHex": "0x01",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA6A5",
        "pointerAddress": "0xA6B0",
        "address": "0xA6D6",
        "firstBytes": [
          "0x14",
          "0x08",
          "0xFE",
          "0x09",
          "0x00",
          "0x00",
          "0x05",
          "0x07"
        ],
        "rawLayoutIndex": "0x14",
        "layoutIndex": "0x14",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area03-sub01-dabi-s-path-part-2-night-recipe",
        "label": "Dabi's Path - Part 2, night",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, night.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-night",
            "label": "Jova Woods, night"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x03",
          "submap": "0x01"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x03",
          "submap": "0x01"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "bank": 4,
          "address": "0xA00A",
          "pointerAddress": "0x88E1",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9F07",
            "indexListAddress": "0xA6FD",
            "indexOffset": 2,
            "transferId": "0x26",
            "auxiliaryTransferId": "0x31",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88E1"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area03-sub01-dabi-s-path-part-2-night.png",
      "width": 512,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 2,
        "rows": 1,
        "renderedColumns": 2,
        "renderedRows": 1,
        "totalPointers": 2
      },
      "columnGroups": [
        0,
        1
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 3,
          "submap": 1
        },
        "screenRecord": {
          "pointerAddress": "0xA6B0",
          "address": "0xA6D6",
          "firstBytes": [
            "0x14",
            "0x08",
            "0xFE",
            "0x09",
            "0x00",
            "0x00",
            "0x05",
            "0x07"
          ],
          "rawLayoutIndex": 20,
          "rawLayoutIndexHex": "0x14",
          "layoutIndex": 20,
          "layoutIndexHex": "0x14",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F71",
          "address": "0xA76C",
          "bank": 2,
          "secondaryAddress": "0xA72F"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area03-sub02-aljiba-woods-part-1-day",
      "locationId": "obj02-area03-sub02-aljiba-woods-part-1",
      "name": "Aljiba Woods - Part 1",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 3,
      "areaHex": "0x03",
      "submap": 2,
      "submapHex": "0x02",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA6A5",
        "pointerAddress": "0xA6B2",
        "address": "0xA6D7",
        "firstBytes": [
          "0x08",
          "0xFE",
          "0x09",
          "0x00",
          "0x00",
          "0x05",
          "0x07",
          "0x17"
        ],
        "rawLayoutIndex": "0x08",
        "layoutIndex": "0x08",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area03-sub02-aljiba-woods-part-1-day-recipe",
        "label": "Aljiba Woods - Part 1, day",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, day.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-day",
            "label": "Jova Woods, day"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x03",
          "submap": "0x02"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x03",
          "submap": "0x02"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0x9FD7",
          "pointerAddress": "0x88DB",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9F05",
            "indexListAddress": "0xA6EB",
            "indexOffset": 4,
            "transferId": "0x23",
            "auxiliaryTransferId": "0x31",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88DB"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area03-sub02-aljiba-woods-part-1-day.png",
      "width": 512,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 2,
        "rows": 1,
        "renderedColumns": 2,
        "renderedRows": 1,
        "totalPointers": 2
      },
      "columnGroups": [
        0,
        1
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 3,
          "submap": 2
        },
        "screenRecord": {
          "pointerAddress": "0xA6B2",
          "address": "0xA6D7",
          "firstBytes": [
            "0x08",
            "0xFE",
            "0x09",
            "0x00",
            "0x00",
            "0x05",
            "0x07",
            "0x17"
          ],
          "rawLayoutIndex": 8,
          "rawLayoutIndexHex": "0x08",
          "layoutIndex": 8,
          "layoutIndexHex": "0x08",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F41",
          "address": "0xA73E",
          "bank": 2,
          "secondaryAddress": "0xA72F"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area03-sub02-aljiba-woods-part-1-night",
      "locationId": "obj02-area03-sub02-aljiba-woods-part-1",
      "name": "Aljiba Woods - Part 1",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 3,
      "areaHex": "0x03",
      "submap": 2,
      "submapHex": "0x02",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA6A5",
        "pointerAddress": "0xA6B2",
        "address": "0xA6D7",
        "firstBytes": [
          "0x08",
          "0xFE",
          "0x09",
          "0x00",
          "0x00",
          "0x05",
          "0x07",
          "0x17"
        ],
        "rawLayoutIndex": "0x08",
        "layoutIndex": "0x08",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area03-sub02-aljiba-woods-part-1-night-recipe",
        "label": "Aljiba Woods - Part 1, night",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, night.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-night",
            "label": "Jova Woods, night"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x03",
          "submap": "0x02"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x03",
          "submap": "0x02"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "bank": 4,
          "address": "0x9FF9",
          "pointerAddress": "0x88DF",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9F07",
            "indexListAddress": "0xA6FD",
            "indexOffset": 4,
            "transferId": "0x25",
            "auxiliaryTransferId": "0x31",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88DF"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area03-sub02-aljiba-woods-part-1-night.png",
      "width": 512,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 2,
        "rows": 1,
        "renderedColumns": 2,
        "renderedRows": 1,
        "totalPointers": 2
      },
      "columnGroups": [
        0,
        1
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 3,
          "submap": 2
        },
        "screenRecord": {
          "pointerAddress": "0xA6B2",
          "address": "0xA6D7",
          "firstBytes": [
            "0x08",
            "0xFE",
            "0x09",
            "0x00",
            "0x00",
            "0x05",
            "0x07",
            "0x17"
          ],
          "rawLayoutIndex": 8,
          "rawLayoutIndexHex": "0x08",
          "layoutIndex": 8,
          "layoutIndexHex": "0x08",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F41",
          "address": "0xA73E",
          "bank": 2,
          "secondaryAddress": "0xA72F"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area03-sub03-aljiba-woods-part-2-day",
      "locationId": "obj02-area03-sub03-aljiba-woods-part-2",
      "name": "Aljiba Woods - Part 2",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 3,
      "areaHex": "0x03",
      "submap": 3,
      "submapHex": "0x03",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA6A5",
        "pointerAddress": "0xA6B4",
        "address": "0xA6D8",
        "firstBytes": [
          "0xFE",
          "0x09",
          "0x00",
          "0x00",
          "0x05",
          "0x07",
          "0x17",
          "0x15"
        ],
        "rawLayoutIndex": "0xFE",
        "layoutIndex": "0x09",
        "layoutIndexSource": "special-0xFE-byte-1"
      },
      "recipe": {
        "id": "obj02-area03-sub03-aljiba-woods-part-2-day-recipe",
        "label": "Aljiba Woods - Part 2, day",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, day.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-day",
            "label": "Jova Woods, day"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x03",
          "submap": "0x03"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x03",
          "submap": "0x03"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0x9FD7",
          "pointerAddress": "0x88DB",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9F05",
            "indexListAddress": "0xA6EB",
            "indexOffset": 6,
            "transferId": "0x23",
            "auxiliaryTransferId": "0x31",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88DB"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area03-sub03-aljiba-woods-part-2-day.png",
      "width": 512,
      "height": 448,
      "layoutSections": [
        0,
        1
      ],
      "layoutGrid": {
        "columns": 2,
        "rows": 2,
        "renderedColumns": 2,
        "renderedRows": 2,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 3,
          "submap": 3
        },
        "screenRecord": {
          "pointerAddress": "0xA6B4",
          "address": "0xA6D8",
          "firstBytes": [
            "0xFE",
            "0x09",
            "0x00",
            "0x00",
            "0x05",
            "0x07",
            "0x17",
            "0x15"
          ],
          "rawLayoutIndex": 254,
          "rawLayoutIndexHex": "0xFE",
          "layoutIndex": 9,
          "layoutIndexHex": "0x09",
          "layoutIndexSource": "segment-override"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F45",
          "address": "0xA748",
          "bank": 2,
          "secondaryAddress": "0xA714"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area03-sub03-aljiba-woods-part-2-night",
      "locationId": "obj02-area03-sub03-aljiba-woods-part-2",
      "name": "Aljiba Woods - Part 2",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 3,
      "areaHex": "0x03",
      "submap": 3,
      "submapHex": "0x03",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA6A5",
        "pointerAddress": "0xA6B4",
        "address": "0xA6D8",
        "firstBytes": [
          "0xFE",
          "0x09",
          "0x00",
          "0x00",
          "0x05",
          "0x07",
          "0x17",
          "0x15"
        ],
        "rawLayoutIndex": "0xFE",
        "layoutIndex": "0x09",
        "layoutIndexSource": "special-0xFE-byte-1"
      },
      "recipe": {
        "id": "obj02-area03-sub03-aljiba-woods-part-2-night-recipe",
        "label": "Aljiba Woods - Part 2, night",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, night.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-night",
            "label": "Jova Woods, night"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x03",
          "submap": "0x03"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x03",
          "submap": "0x03"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "bank": 4,
          "address": "0x9FF9",
          "pointerAddress": "0x88DF",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9F07",
            "indexListAddress": "0xA6FD",
            "indexOffset": 6,
            "transferId": "0x25",
            "auxiliaryTransferId": "0x31",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88DF"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area03-sub03-aljiba-woods-part-2-night.png",
      "width": 512,
      "height": 448,
      "layoutSections": [
        0,
        1
      ],
      "layoutGrid": {
        "columns": 2,
        "rows": 2,
        "renderedColumns": 2,
        "renderedRows": 2,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 3,
          "submap": 3
        },
        "screenRecord": {
          "pointerAddress": "0xA6B4",
          "address": "0xA6D8",
          "firstBytes": [
            "0xFE",
            "0x09",
            "0x00",
            "0x00",
            "0x05",
            "0x07",
            "0x17",
            "0x15"
          ],
          "rawLayoutIndex": 254,
          "rawLayoutIndexHex": "0xFE",
          "layoutIndex": 9,
          "layoutIndexHex": "0x09",
          "layoutIndexSource": "segment-override"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F45",
          "address": "0xA748",
          "bank": 2,
          "secondaryAddress": "0xA714"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area04-sub00-denis-woods-part-2-day",
      "locationId": "obj02-area04-sub00-denis-woods-part-2",
      "name": "Denis Woods - Part 2",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 4,
      "areaHex": "0x04",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA6B6",
        "pointerAddress": "0xA6BF",
        "address": "0xA6DD",
        "firstBytes": [
          "0x07",
          "0x17",
          "0x15",
          "0x0A",
          "0x01",
          "0x00",
          "0x00",
          "0x00"
        ],
        "rawLayoutIndex": "0x07",
        "layoutIndex": "0x07",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area04-sub00-denis-woods-part-2-day-recipe",
        "label": "Denis Woods - Part 2, day",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, day.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-day",
            "label": "Jova Woods, day"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x04",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x04",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0x9FD7",
          "pointerAddress": "0x88DB",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9F09",
            "indexListAddress": "0xA6F7",
            "indexOffset": 0,
            "transferId": "0x23",
            "auxiliaryTransferId": "0x31",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88DB"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area04-sub00-denis-woods-part-2-day.png",
      "width": 768,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 3,
        "rows": 1,
        "renderedColumns": 3,
        "renderedRows": 1,
        "totalPointers": 3
      },
      "columnGroups": [
        0,
        1,
        2
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 4,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xA6BF",
          "address": "0xA6DD",
          "firstBytes": [
            "0x07",
            "0x17",
            "0x15",
            "0x0A",
            "0x01",
            "0x00",
            "0x00",
            "0x00"
          ],
          "rawLayoutIndex": 7,
          "rawLayoutIndexHex": "0x07",
          "layoutIndex": 7,
          "layoutIndexHex": "0x07",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F3D",
          "address": "0xA730",
          "bank": 2,
          "secondaryAddress": "0xA70F"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area04-sub00-denis-woods-part-2-night",
      "locationId": "obj02-area04-sub00-denis-woods-part-2",
      "name": "Denis Woods - Part 2",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 4,
      "areaHex": "0x04",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA6B6",
        "pointerAddress": "0xA6BF",
        "address": "0xA6DD",
        "firstBytes": [
          "0x07",
          "0x17",
          "0x15",
          "0x0A",
          "0x01",
          "0x00",
          "0x00",
          "0x00"
        ],
        "rawLayoutIndex": "0x07",
        "layoutIndex": "0x07",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area04-sub00-denis-woods-part-2-night-recipe",
        "label": "Denis Woods - Part 2, night",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, night.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-night",
            "label": "Jova Woods, night"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x04",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x04",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "bank": 4,
          "address": "0x9FF9",
          "pointerAddress": "0x88DF",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9F0B",
            "indexListAddress": "0xA707",
            "indexOffset": 0,
            "transferId": "0x25",
            "auxiliaryTransferId": "0x31",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88DF"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area04-sub00-denis-woods-part-2-night.png",
      "width": 768,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 3,
        "rows": 1,
        "renderedColumns": 3,
        "renderedRows": 1,
        "totalPointers": 3
      },
      "columnGroups": [
        0,
        1,
        2
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 4,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xA6BF",
          "address": "0xA6DD",
          "firstBytes": [
            "0x07",
            "0x17",
            "0x15",
            "0x0A",
            "0x01",
            "0x00",
            "0x00",
            "0x00"
          ],
          "rawLayoutIndex": 7,
          "rawLayoutIndexHex": "0x07",
          "layoutIndex": 7,
          "layoutIndexHex": "0x07",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F3D",
          "address": "0xA730",
          "bank": 2,
          "secondaryAddress": "0xA70F"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area04-sub01-denis-woods-part-3-day",
      "locationId": "obj02-area04-sub01-denis-woods-part-3",
      "name": "Denis Woods - Part 3",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 4,
      "areaHex": "0x04",
      "submap": 1,
      "submapHex": "0x01",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA6B6",
        "pointerAddress": "0xA6C1",
        "address": "0xA6DE",
        "firstBytes": [
          "0x17",
          "0x15",
          "0x0A",
          "0x01",
          "0x00",
          "0x00",
          "0x00",
          "0x00"
        ],
        "rawLayoutIndex": "0x17",
        "layoutIndex": "0x17",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area04-sub01-denis-woods-part-3-day-recipe",
        "label": "Denis Woods - Part 3, day",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, day.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-day",
            "label": "Jova Woods, day"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x04",
          "submap": "0x01"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x04",
          "submap": "0x01"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0x9FD7",
          "pointerAddress": "0x88DB",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9F09",
            "indexListAddress": "0xA6F7",
            "indexOffset": 2,
            "transferId": "0x23",
            "auxiliaryTransferId": "0x31",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88DB"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area04-sub01-denis-woods-part-3-day.png",
      "width": 512,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 2,
        "rows": 1,
        "renderedColumns": 2,
        "renderedRows": 1,
        "totalPointers": 2
      },
      "columnGroups": [
        0,
        1
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 4,
          "submap": 1
        },
        "screenRecord": {
          "pointerAddress": "0xA6C1",
          "address": "0xA6DE",
          "firstBytes": [
            "0x17",
            "0x15",
            "0x0A",
            "0x01",
            "0x00",
            "0x00",
            "0x00",
            "0x00"
          ],
          "rawLayoutIndex": 23,
          "rawLayoutIndexHex": "0x17",
          "layoutIndex": 23,
          "layoutIndexHex": "0x17",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F7D",
          "address": "0xA788",
          "bank": 2,
          "secondaryAddress": "0xA72F"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area04-sub01-denis-woods-part-3-night",
      "locationId": "obj02-area04-sub01-denis-woods-part-3",
      "name": "Denis Woods - Part 3",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 4,
      "areaHex": "0x04",
      "submap": 1,
      "submapHex": "0x01",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA6B6",
        "pointerAddress": "0xA6C1",
        "address": "0xA6DE",
        "firstBytes": [
          "0x17",
          "0x15",
          "0x0A",
          "0x01",
          "0x00",
          "0x00",
          "0x00",
          "0x00"
        ],
        "rawLayoutIndex": "0x17",
        "layoutIndex": "0x17",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area04-sub01-denis-woods-part-3-night-recipe",
        "label": "Denis Woods - Part 3, night",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, night.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-night",
            "label": "Jova Woods, night"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x04",
          "submap": "0x01"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x04",
          "submap": "0x01"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "bank": 4,
          "address": "0x9FF9",
          "pointerAddress": "0x88DF",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9F0B",
            "indexListAddress": "0xA707",
            "indexOffset": 2,
            "transferId": "0x25",
            "auxiliaryTransferId": "0x31",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88DF"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area04-sub01-denis-woods-part-3-night.png",
      "width": 512,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 2,
        "rows": 1,
        "renderedColumns": 2,
        "renderedRows": 1,
        "totalPointers": 2
      },
      "columnGroups": [
        0,
        1
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 4,
          "submap": 1
        },
        "screenRecord": {
          "pointerAddress": "0xA6C1",
          "address": "0xA6DE",
          "firstBytes": [
            "0x17",
            "0x15",
            "0x0A",
            "0x01",
            "0x00",
            "0x00",
            "0x00",
            "0x00"
          ],
          "rawLayoutIndex": 23,
          "rawLayoutIndexHex": "0x17",
          "layoutIndex": 23,
          "layoutIndexHex": "0x17",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F7D",
          "address": "0xA788",
          "bank": 2,
          "secondaryAddress": "0xA72F"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area05-sub00-yuba-lake-path-day",
      "locationId": "obj02-area05-sub00-yuba-lake-path",
      "name": "Yuba Lake Path",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 5,
      "areaHex": "0x05",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA6C3",
        "pointerAddress": "0xA6CC",
        "address": "0xA6DF",
        "firstBytes": [
          "0x15",
          "0x0A",
          "0x01",
          "0x00",
          "0x00",
          "0x00",
          "0x00",
          "0x00"
        ],
        "rawLayoutIndex": "0x15",
        "layoutIndex": "0x15",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area05-sub00-yuba-lake-path-day-recipe",
        "label": "Yuba Lake Path, day",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, day.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-day",
            "label": "Jova Woods, day"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x05",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x05",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0xA00A",
          "pointerAddress": "0x88E1",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9F0D",
            "indexListAddress": "0xA6F3",
            "indexOffset": 0,
            "transferId": "0x26",
            "auxiliaryTransferId": "0x32",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88E1"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area05-sub00-yuba-lake-path-day.png",
      "width": 1024,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 1,
        "renderedColumns": 4,
        "renderedRows": 1,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 5,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xA6CC",
          "address": "0xA6DF",
          "firstBytes": [
            "0x15",
            "0x0A",
            "0x01",
            "0x00",
            "0x00",
            "0x00",
            "0x00",
            "0x00"
          ],
          "rawLayoutIndex": 21,
          "rawLayoutIndexHex": "0x15",
          "layoutIndex": 21,
          "layoutIndexHex": "0x15",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F75",
          "address": "0xA776",
          "bank": 2,
          "secondaryAddress": "0xA72B"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area05-sub00-yuba-lake-path-night",
      "locationId": "obj02-area05-sub00-yuba-lake-path",
      "name": "Yuba Lake Path",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 5,
      "areaHex": "0x05",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA6C3",
        "pointerAddress": "0xA6CC",
        "address": "0xA6DF",
        "firstBytes": [
          "0x15",
          "0x0A",
          "0x01",
          "0x00",
          "0x00",
          "0x00",
          "0x00",
          "0x00"
        ],
        "rawLayoutIndex": "0x15",
        "layoutIndex": "0x15",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area05-sub00-yuba-lake-path-night-recipe",
        "label": "Yuba Lake Path, night",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, night.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-night",
            "label": "Jova Woods, night"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x05",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x05",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "bank": 4,
          "address": "0xA00A",
          "pointerAddress": "0x88E1",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9F0F",
            "indexListAddress": "0xA70B",
            "indexOffset": 0,
            "transferId": "0x26",
            "auxiliaryTransferId": "0x32",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88E1"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area05-sub00-yuba-lake-path-night.png",
      "width": 1024,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 1,
        "renderedColumns": 4,
        "renderedRows": 1,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 5,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xA6CC",
          "address": "0xA6DF",
          "firstBytes": [
            "0x15",
            "0x0A",
            "0x01",
            "0x00",
            "0x00",
            "0x00",
            "0x00",
            "0x00"
          ],
          "rawLayoutIndex": 21,
          "rawLayoutIndexHex": "0x15",
          "layoutIndex": 21,
          "layoutIndexHex": "0x15",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F75",
          "address": "0xA776",
          "bank": 2,
          "secondaryAddress": "0xA72B"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area05-sub01-yuba-lake-day",
      "locationId": "obj02-area05-sub01-yuba-lake",
      "name": "Yuba Lake",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 5,
      "areaHex": "0x05",
      "submap": 1,
      "submapHex": "0x01",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA6C3",
        "pointerAddress": "0xA6CE",
        "address": "0xA6E0",
        "firstBytes": [
          "0x0A",
          "0x01",
          "0x00",
          "0x00",
          "0x00",
          "0x00",
          "0x00",
          "0x00"
        ],
        "rawLayoutIndex": "0x0A",
        "layoutIndex": "0x0A",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area05-sub01-yuba-lake-day-recipe",
        "label": "Yuba Lake, day",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, day.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-day",
            "label": "Jova Woods, day"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x05",
          "submap": "0x01"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x05",
          "submap": "0x01"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "address": "0xCAF3",
          "pointerAddress": "0x88D3",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9F0D",
            "indexListAddress": "0xA6F3",
            "indexOffset": 2,
            "transferId": "0x1F",
            "auxiliaryTransferId": "0x32",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88D3"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area05-sub01-yuba-lake-day.png",
      "width": 256,
      "height": 448,
      "layoutSections": [
        0,
        1
      ],
      "layoutGrid": {
        "columns": 1,
        "rows": 2,
        "renderedColumns": 1,
        "renderedRows": 2,
        "totalPointers": 2
      },
      "columnGroups": [
        0
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 5,
          "submap": 1
        },
        "screenRecord": {
          "pointerAddress": "0xA6CE",
          "address": "0xA6E0",
          "firstBytes": [
            "0x0A",
            "0x01",
            "0x00",
            "0x00",
            "0x00",
            "0x00",
            "0x00",
            "0x00"
          ],
          "rawLayoutIndex": 10,
          "rawLayoutIndexHex": "0x0A",
          "layoutIndex": 10,
          "layoutIndexHex": "0x0A",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F49",
          "address": "0xA756",
          "bank": 2,
          "secondaryAddress": "0xA719"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area05-sub01-yuba-lake-night",
      "locationId": "obj02-area05-sub01-yuba-lake",
      "name": "Yuba Lake",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 5,
      "areaHex": "0x05",
      "submap": 1,
      "submapHex": "0x01",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA6C3",
        "pointerAddress": "0xA6CE",
        "address": "0xA6E0",
        "firstBytes": [
          "0x0A",
          "0x01",
          "0x00",
          "0x00",
          "0x00",
          "0x00",
          "0x00",
          "0x00"
        ],
        "rawLayoutIndex": "0x0A",
        "layoutIndex": "0x0A",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area05-sub01-yuba-lake-night-recipe",
        "label": "Yuba Lake, night",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, night.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-night",
            "label": "Jova Woods, night"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x05",
          "submap": "0x01"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x05",
          "submap": "0x01"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "address": "0xCB15",
          "pointerAddress": "0x88D7",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9F0F",
            "indexListAddress": "0xA70B",
            "indexOffset": 2,
            "transferId": "0x21",
            "auxiliaryTransferId": "0x32",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88D7"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area05-sub01-yuba-lake-night.png",
      "width": 256,
      "height": 448,
      "layoutSections": [
        0,
        1
      ],
      "layoutGrid": {
        "columns": 1,
        "rows": 2,
        "renderedColumns": 1,
        "renderedRows": 2,
        "totalPointers": 2
      },
      "columnGroups": [
        0
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 5,
          "submap": 1
        },
        "screenRecord": {
          "pointerAddress": "0xA6CE",
          "address": "0xA6E0",
          "firstBytes": [
            "0x0A",
            "0x01",
            "0x00",
            "0x00",
            "0x00",
            "0x00",
            "0x00",
            "0x00"
          ],
          "rawLayoutIndex": 10,
          "rawLayoutIndexHex": "0x0A",
          "layoutIndex": 10,
          "layoutIndexHex": "0x0A",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F49",
          "address": "0xA756",
          "bank": 2,
          "secondaryAddress": "0xA719"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area06-sub00-dead-river-to-brahm-day",
      "locationId": "obj02-area06-sub00-dead-river-to-brahm",
      "name": "Dead River to Brahm",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 6,
      "areaHex": "0x06",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA165",
        "pointerAddress": "0xA16E",
        "address": "0xA19D",
        "firstBytes": [
          "0x10",
          "0x12",
          "0x00",
          "0x02",
          "0x04",
          "0x05",
          "0xFE",
          "0x06"
        ],
        "rawLayoutIndex": "0x10",
        "layoutIndex": "0x10",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area06-sub00-dead-river-to-brahm-day-recipe",
        "label": "Dead River to Brahm, day",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, day.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-day",
            "label": "Jova Woods, day"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x06",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x06",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "address": "0xCB04",
          "pointerAddress": "0x88D5",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9F11",
            "indexListAddress": "0xA1BC",
            "indexOffset": 0,
            "transferId": "0x20",
            "auxiliaryTransferId": "0x30",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88D5"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area06-sub00-dead-river-to-brahm-day.png",
      "width": 512,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 2,
        "rows": 1,
        "renderedColumns": 2,
        "renderedRows": 1,
        "totalPointers": 2
      },
      "columnGroups": [
        0,
        1
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 6,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xA16E",
          "address": "0xA19D",
          "firstBytes": [
            "0x10",
            "0x12",
            "0x00",
            "0x02",
            "0x04",
            "0x05",
            "0xFE",
            "0x06"
          ],
          "rawLayoutIndex": 16,
          "rawLayoutIndexHex": "0x10",
          "layoutIndex": 16,
          "layoutIndexHex": "0x10",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F61",
          "address": "0xA2B2",
          "bank": 2,
          "secondaryAddress": "0xA221"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area06-sub00-dead-river-to-brahm-night",
      "locationId": "obj02-area06-sub00-dead-river-to-brahm",
      "name": "Dead River to Brahm",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 6,
      "areaHex": "0x06",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA165",
        "pointerAddress": "0xA16E",
        "address": "0xA19D",
        "firstBytes": [
          "0x10",
          "0x12",
          "0x00",
          "0x02",
          "0x04",
          "0x05",
          "0xFE",
          "0x06"
        ],
        "rawLayoutIndex": "0x10",
        "layoutIndex": "0x10",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area06-sub00-dead-river-to-brahm-night-recipe",
        "label": "Dead River to Brahm, night",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, night.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-night",
            "label": "Jova Woods, night"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x06",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x06",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "address": "0xCB15",
          "pointerAddress": "0x88D7",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9F13",
            "indexListAddress": "0xA1E4",
            "indexOffset": 0,
            "transferId": "0x21",
            "auxiliaryTransferId": "0x30",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88D7"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area06-sub00-dead-river-to-brahm-night.png",
      "width": 512,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 2,
        "rows": 1,
        "renderedColumns": 2,
        "renderedRows": 1,
        "totalPointers": 2
      },
      "columnGroups": [
        0,
        1
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 6,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xA16E",
          "address": "0xA19D",
          "firstBytes": [
            "0x10",
            "0x12",
            "0x00",
            "0x02",
            "0x04",
            "0x05",
            "0xFE",
            "0x06"
          ],
          "rawLayoutIndex": 16,
          "rawLayoutIndexHex": "0x10",
          "layoutIndex": 16,
          "layoutIndexHex": "0x10",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F61",
          "address": "0xA2B2",
          "bank": 2,
          "secondaryAddress": "0xA221"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area07-sub00-dead-river-part-2-day",
      "locationId": "obj02-area07-sub00-dead-river-part-2",
      "name": "Dead River - Part 2",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 7,
      "areaHex": "0x07",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA170",
        "pointerAddress": "0xA179",
        "address": "0xA19D",
        "firstBytes": [
          "0x10",
          "0x12",
          "0x00",
          "0x02",
          "0x04",
          "0x05",
          "0xFE",
          "0x06"
        ],
        "rawLayoutIndex": "0x10",
        "layoutIndex": "0x10",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area07-sub00-dead-river-part-2-day-recipe",
        "label": "Dead River - Part 2, day",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, day.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-day",
            "label": "Jova Woods, day"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x07",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x07",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "address": "0xCAF3",
          "pointerAddress": "0x88D3",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9F15",
            "indexListAddress": "0xA1C8",
            "indexOffset": 0,
            "transferId": "0x1F",
            "auxiliaryTransferId": "0x2F",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88D3"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area07-sub00-dead-river-part-2-day.png",
      "width": 512,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 2,
        "rows": 1,
        "renderedColumns": 2,
        "renderedRows": 1,
        "totalPointers": 2
      },
      "columnGroups": [
        0,
        1
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 7,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xA179",
          "address": "0xA19D",
          "firstBytes": [
            "0x10",
            "0x12",
            "0x00",
            "0x02",
            "0x04",
            "0x05",
            "0xFE",
            "0x06"
          ],
          "rawLayoutIndex": 16,
          "rawLayoutIndexHex": "0x10",
          "layoutIndex": 16,
          "layoutIndexHex": "0x10",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F61",
          "address": "0xA2B2",
          "bank": 2,
          "secondaryAddress": "0xA221"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area07-sub00-dead-river-part-2-night",
      "locationId": "obj02-area07-sub00-dead-river-part-2",
      "name": "Dead River - Part 2",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 7,
      "areaHex": "0x07",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA170",
        "pointerAddress": "0xA179",
        "address": "0xA19D",
        "firstBytes": [
          "0x10",
          "0x12",
          "0x00",
          "0x02",
          "0x04",
          "0x05",
          "0xFE",
          "0x06"
        ],
        "rawLayoutIndex": "0x10",
        "layoutIndex": "0x10",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area07-sub00-dead-river-part-2-night-recipe",
        "label": "Dead River - Part 2, night",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, night.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-night",
            "label": "Jova Woods, night"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x07",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x07",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "address": "0xCB15",
          "pointerAddress": "0x88D7",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9F17",
            "indexListAddress": "0xA1E6",
            "indexOffset": 0,
            "transferId": "0x21",
            "auxiliaryTransferId": "0x2F",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88D7"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area07-sub00-dead-river-part-2-night.png",
      "width": 512,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 2,
        "rows": 1,
        "renderedColumns": 2,
        "renderedRows": 1,
        "totalPointers": 2
      },
      "columnGroups": [
        0,
        1
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 7,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xA179",
          "address": "0xA19D",
          "firstBytes": [
            "0x10",
            "0x12",
            "0x00",
            "0x02",
            "0x04",
            "0x05",
            "0xFE",
            "0x06"
          ],
          "rawLayoutIndex": 16,
          "rawLayoutIndexHex": "0x10",
          "layoutIndex": 16,
          "layoutIndexHex": "0x10",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F61",
          "address": "0xA2B2",
          "bank": 2,
          "secondaryAddress": "0xA221"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area07-sub01-dead-river-part-1-day",
      "locationId": "obj02-area07-sub01-dead-river-part-1",
      "name": "Dead River - Part 1",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 7,
      "areaHex": "0x07",
      "submap": 1,
      "submapHex": "0x01",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA170",
        "pointerAddress": "0xA17B",
        "address": "0xA19E",
        "firstBytes": [
          "0x12",
          "0x00",
          "0x02",
          "0x04",
          "0x05",
          "0xFE",
          "0x06",
          "0xFF"
        ],
        "rawLayoutIndex": "0x12",
        "layoutIndex": "0x12",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area07-sub01-dead-river-part-1-day-recipe",
        "label": "Dead River - Part 1, day",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, day.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-day",
            "label": "Jova Woods, day"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x07",
          "submap": "0x01"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x07",
          "submap": "0x01"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "address": "0xCAF3",
          "pointerAddress": "0x88D3",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9F15",
            "indexListAddress": "0xA1C8",
            "indexOffset": 2,
            "transferId": "0x1F",
            "auxiliaryTransferId": "0x2F",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88D3"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area07-sub01-dead-river-part-1-day.png",
      "width": 512,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 2,
        "rows": 1,
        "renderedColumns": 2,
        "renderedRows": 1,
        "totalPointers": 2
      },
      "columnGroups": [
        0,
        1
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 7,
          "submap": 1
        },
        "screenRecord": {
          "pointerAddress": "0xA17B",
          "address": "0xA19E",
          "firstBytes": [
            "0x12",
            "0x00",
            "0x02",
            "0x04",
            "0x05",
            "0xFE",
            "0x06",
            "0xFF"
          ],
          "rawLayoutIndex": 18,
          "rawLayoutIndexHex": "0x12",
          "layoutIndex": 18,
          "layoutIndexHex": "0x12",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F69",
          "address": "0xA2BC",
          "bank": 2,
          "secondaryAddress": "0xA221"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area07-sub01-dead-river-part-1-night",
      "locationId": "obj02-area07-sub01-dead-river-part-1",
      "name": "Dead River - Part 1",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 7,
      "areaHex": "0x07",
      "submap": 1,
      "submapHex": "0x01",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA170",
        "pointerAddress": "0xA17B",
        "address": "0xA19E",
        "firstBytes": [
          "0x12",
          "0x00",
          "0x02",
          "0x04",
          "0x05",
          "0xFE",
          "0x06",
          "0xFF"
        ],
        "rawLayoutIndex": "0x12",
        "layoutIndex": "0x12",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area07-sub01-dead-river-part-1-night-recipe",
        "label": "Dead River - Part 1, night",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, night.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-night",
            "label": "Jova Woods, night"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x07",
          "submap": "0x01"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x07",
          "submap": "0x01"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "address": "0xCB15",
          "pointerAddress": "0x88D7",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9F17",
            "indexListAddress": "0xA1E6",
            "indexOffset": 2,
            "transferId": "0x21",
            "auxiliaryTransferId": "0x2F",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88D7"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area07-sub01-dead-river-part-1-night.png",
      "width": 512,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 2,
        "rows": 1,
        "renderedColumns": 2,
        "renderedRows": 1,
        "totalPointers": 2
      },
      "columnGroups": [
        0,
        1
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 7,
          "submap": 1
        },
        "screenRecord": {
          "pointerAddress": "0xA17B",
          "address": "0xA19E",
          "firstBytes": [
            "0x12",
            "0x00",
            "0x02",
            "0x04",
            "0x05",
            "0xFE",
            "0x06",
            "0xFF"
          ],
          "rawLayoutIndex": 18,
          "rawLayoutIndexHex": "0x12",
          "layoutIndex": 18,
          "layoutIndexHex": "0x12",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F69",
          "address": "0xA2BC",
          "bank": 2,
          "secondaryAddress": "0xA221"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area07-sub02-belasco-marsh-day",
      "locationId": "obj02-area07-sub02-belasco-marsh",
      "name": "Belasco Marsh",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 7,
      "areaHex": "0x07",
      "submap": 2,
      "submapHex": "0x02",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA170",
        "pointerAddress": "0xA17D",
        "address": "0xA19F",
        "firstBytes": [
          "0x00",
          "0x02",
          "0x04",
          "0x05",
          "0xFE",
          "0x06",
          "0xFF",
          "0x00"
        ],
        "rawLayoutIndex": "0x00",
        "layoutIndex": "0x00",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area07-sub02-belasco-marsh-day-recipe",
        "label": "Belasco Marsh, day",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, day.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-day",
            "label": "Jova Woods, day"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x07",
          "submap": "0x02"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x07",
          "submap": "0x02"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0x9FC6",
          "pointerAddress": "0x88D9",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9F15",
            "indexListAddress": "0xA1C8",
            "indexOffset": 4,
            "transferId": "0x22",
            "auxiliaryTransferId": "0x32",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88D9"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area07-sub02-belasco-marsh-day.png",
      "width": 1024,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 1,
        "renderedColumns": 4,
        "renderedRows": 1,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 7,
          "submap": 2
        },
        "screenRecord": {
          "pointerAddress": "0xA17D",
          "address": "0xA19F",
          "firstBytes": [
            "0x00",
            "0x02",
            "0x04",
            "0x05",
            "0xFE",
            "0x06",
            "0xFF",
            "0x00"
          ],
          "rawLayoutIndex": 0,
          "rawLayoutIndexHex": "0x00",
          "layoutIndex": 0,
          "layoutIndexHex": "0x00",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F21",
          "address": "0xA22C",
          "bank": 2,
          "secondaryAddress": "0xA221"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area07-sub02-belasco-marsh-night",
      "locationId": "obj02-area07-sub02-belasco-marsh",
      "name": "Belasco Marsh",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 7,
      "areaHex": "0x07",
      "submap": 2,
      "submapHex": "0x02",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA170",
        "pointerAddress": "0xA17D",
        "address": "0xA19F",
        "firstBytes": [
          "0x00",
          "0x02",
          "0x04",
          "0x05",
          "0xFE",
          "0x06",
          "0xFF",
          "0x00"
        ],
        "rawLayoutIndex": "0x00",
        "layoutIndex": "0x00",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area07-sub02-belasco-marsh-night-recipe",
        "label": "Belasco Marsh, night",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, night.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-night",
            "label": "Jova Woods, night"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x07",
          "submap": "0x02"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x07",
          "submap": "0x02"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "bank": 4,
          "address": "0x9FF9",
          "pointerAddress": "0x88DF",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9F17",
            "indexListAddress": "0xA1E6",
            "indexOffset": 4,
            "transferId": "0x25",
            "auxiliaryTransferId": "0x32",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88DF"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area07-sub02-belasco-marsh-night.png",
      "width": 1024,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 1,
        "renderedColumns": 4,
        "renderedRows": 1,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 7,
          "submap": 2
        },
        "screenRecord": {
          "pointerAddress": "0xA17D",
          "address": "0xA19F",
          "firstBytes": [
            "0x00",
            "0x02",
            "0x04",
            "0x05",
            "0xFE",
            "0x06",
            "0xFF",
            "0x00"
          ],
          "rawLayoutIndex": 0,
          "rawLayoutIndexHex": "0x00",
          "layoutIndex": 0,
          "layoutIndexHex": "0x00",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F21",
          "address": "0xA22C",
          "bank": 2,
          "secondaryAddress": "0xA221"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area08-sub00-north-bridge-day",
      "locationId": "obj02-area08-sub00-north-bridge",
      "name": "North Bridge",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 8,
      "areaHex": "0x08",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA17F",
        "pointerAddress": "0xA188",
        "address": "0xA1A9",
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
        "rawLayoutIndex": "0x0B",
        "layoutIndex": "0x0B",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area08-sub00-north-bridge-day-recipe",
        "label": "North Bridge, day",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, day.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-day",
            "label": "Jova Woods, day"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x08",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x08",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "address": "0xCB04",
          "pointerAddress": "0x88D5",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9F19",
            "indexListAddress": "0xA1CE",
            "indexOffset": 0,
            "transferId": "0x20",
            "auxiliaryTransferId": "0x33",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88D5"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area08-sub00-north-bridge-day.png",
      "width": 1024,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 1,
        "renderedColumns": 4,
        "renderedRows": 1,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 8,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xA188",
          "address": "0xA1A9",
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
          "rawLayoutIndex": 11,
          "rawLayoutIndexHex": "0x0B",
          "layoutIndex": 11,
          "layoutIndexHex": "0x0B",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F4D",
          "address": "0xA27A",
          "bank": 2,
          "secondaryAddress": "0xA221"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area08-sub00-north-bridge-night",
      "locationId": "obj02-area08-sub00-north-bridge",
      "name": "North Bridge",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 8,
      "areaHex": "0x08",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA17F",
        "pointerAddress": "0xA188",
        "address": "0xA1A9",
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
        "rawLayoutIndex": "0x0B",
        "layoutIndex": "0x0B",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area08-sub00-north-bridge-night-recipe",
        "label": "North Bridge, night",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, night.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-night",
            "label": "Jova Woods, night"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x08",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x08",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "address": "0xCB15",
          "pointerAddress": "0x88D7",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9F1B",
            "indexListAddress": "0xA1EC",
            "indexOffset": 0,
            "transferId": "0x21",
            "auxiliaryTransferId": "0x33",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88D7"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area08-sub00-north-bridge-night.png",
      "width": 1024,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 1,
        "renderedColumns": 4,
        "renderedRows": 1,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 8,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xA188",
          "address": "0xA1A9",
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
          "rawLayoutIndex": 11,
          "rawLayoutIndexHex": "0x0B",
          "layoutIndex": 11,
          "layoutIndexHex": "0x0B",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F4D",
          "address": "0xA27A",
          "bank": 2,
          "secondaryAddress": "0xA221"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area08-sub01-dora-woods-part-1-day",
      "locationId": "obj02-area08-sub01-dora-woods-part-1",
      "name": "Dora Woods - Part 1",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 8,
      "areaHex": "0x08",
      "submap": 1,
      "submapHex": "0x01",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA17F",
        "pointerAddress": "0xA18A",
        "address": "0xA1AA",
        "firstBytes": [
          "0x0C",
          "0xFE",
          "0x0D",
          "0xFF",
          "0x00",
          "0x06",
          "0x01",
          "0x19"
        ],
        "rawLayoutIndex": "0x0C",
        "layoutIndex": "0x0C",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area08-sub01-dora-woods-part-1-day-recipe",
        "label": "Dora Woods - Part 1, day",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, day.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-day",
            "label": "Jova Woods, day"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x08",
          "submap": "0x01"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x08",
          "submap": "0x01"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0x9FE8",
          "pointerAddress": "0x88DD",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9F19",
            "indexListAddress": "0xA1CE",
            "indexOffset": 2,
            "transferId": "0x24",
            "auxiliaryTransferId": "0x33",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88DD"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area08-sub01-dora-woods-part-1-day.png",
      "width": 512,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 2,
        "rows": 1,
        "renderedColumns": 2,
        "renderedRows": 1,
        "totalPointers": 2
      },
      "columnGroups": [
        0,
        1
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 8,
          "submap": 1
        },
        "screenRecord": {
          "pointerAddress": "0xA18A",
          "address": "0xA1AA",
          "firstBytes": [
            "0x0C",
            "0xFE",
            "0x0D",
            "0xFF",
            "0x00",
            "0x06",
            "0x01",
            "0x19"
          ],
          "rawLayoutIndex": 12,
          "rawLayoutIndexHex": "0x0C",
          "layoutIndex": 12,
          "layoutIndexHex": "0x0C",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F51",
          "address": "0xA28C",
          "bank": 2,
          "secondaryAddress": "0xA221"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area08-sub01-dora-woods-part-1-night",
      "locationId": "obj02-area08-sub01-dora-woods-part-1",
      "name": "Dora Woods - Part 1",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 8,
      "areaHex": "0x08",
      "submap": 1,
      "submapHex": "0x01",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA17F",
        "pointerAddress": "0xA18A",
        "address": "0xA1AA",
        "firstBytes": [
          "0x0C",
          "0xFE",
          "0x0D",
          "0xFF",
          "0x00",
          "0x06",
          "0x01",
          "0x19"
        ],
        "rawLayoutIndex": "0x0C",
        "layoutIndex": "0x0C",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area08-sub01-dora-woods-part-1-night-recipe",
        "label": "Dora Woods - Part 1, night",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, night.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-night",
            "label": "Jova Woods, night"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x08",
          "submap": "0x01"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x08",
          "submap": "0x01"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "bank": 4,
          "address": "0x9FF9",
          "pointerAddress": "0x88DF",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9F1B",
            "indexListAddress": "0xA1EC",
            "indexOffset": 2,
            "transferId": "0x25",
            "auxiliaryTransferId": "0x33",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88DF"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area08-sub01-dora-woods-part-1-night.png",
      "width": 512,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 2,
        "rows": 1,
        "renderedColumns": 2,
        "renderedRows": 1,
        "totalPointers": 2
      },
      "columnGroups": [
        0,
        1
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 8,
          "submap": 1
        },
        "screenRecord": {
          "pointerAddress": "0xA18A",
          "address": "0xA1AA",
          "firstBytes": [
            "0x0C",
            "0xFE",
            "0x0D",
            "0xFF",
            "0x00",
            "0x06",
            "0x01",
            "0x19"
          ],
          "rawLayoutIndex": 12,
          "rawLayoutIndexHex": "0x0C",
          "layoutIndex": 12,
          "layoutIndexHex": "0x0C",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F51",
          "address": "0xA28C",
          "bank": 2,
          "secondaryAddress": "0xA221"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area08-sub02-dora-woods-part-2-day",
      "locationId": "obj02-area08-sub02-dora-woods-part-2",
      "name": "Dora Woods - Part 2",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 8,
      "areaHex": "0x08",
      "submap": 2,
      "submapHex": "0x02",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA17F",
        "pointerAddress": "0xA18C",
        "address": "0xA1AB",
        "firstBytes": [
          "0xFE",
          "0x0D",
          "0xFF",
          "0x00",
          "0x06",
          "0x01",
          "0x19",
          "0x0F"
        ],
        "rawLayoutIndex": "0xFE",
        "layoutIndex": "0x0D",
        "layoutIndexSource": "special-0xFE-byte-1"
      },
      "recipe": {
        "id": "obj02-area08-sub02-dora-woods-part-2-day-recipe",
        "label": "Dora Woods - Part 2, day",
        "status": "validated",
        "statusDetail": "Validated by Dora Woods - Part 2, day.",
        "evidence": {
          "exactFixture": {
            "id": "dora-woods-part-2-day",
            "label": "Dora Woods - Part 2, day"
          },
          "familyFixture": {
            "id": "jova-woods-day",
            "label": "Jova Woods, day"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x08",
          "submap": "0x02"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x00",
          "submap": "0x03",
          "submapRaw": "0x83",
          "submapFlags": "0x80"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0x9FD7",
          "pointerAddress": "0x88DB",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9EF9",
            "indexListAddress": "0xA1C0",
            "indexOffset": 6,
            "transferId": "0x23",
            "auxiliaryTransferId": "0x30",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88DB"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area08-sub02-dora-woods-part-2-day.png",
      "width": 512,
      "height": 448,
      "layoutSections": [
        0,
        1
      ],
      "layoutGrid": {
        "columns": 2,
        "rows": 2,
        "renderedColumns": 2,
        "renderedRows": 2,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 8,
          "submap": 2
        },
        "screenRecord": {
          "pointerAddress": "0xA18C",
          "address": "0xA1AB",
          "firstBytes": [
            "0xFE",
            "0x0D",
            "0xFF",
            "0x00",
            "0x06",
            "0x01",
            "0x19",
            "0x0F"
          ],
          "rawLayoutIndex": 254,
          "rawLayoutIndexHex": "0xFE",
          "layoutIndex": 13,
          "layoutIndexHex": "0x0D",
          "layoutIndexSource": "segment-override"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F55",
          "address": "0xA296",
          "bank": 2,
          "secondaryAddress": "0xA1F8"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area08-sub02-dora-woods-part-2-night",
      "locationId": "obj02-area08-sub02-dora-woods-part-2",
      "name": "Dora Woods - Part 2",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 8,
      "areaHex": "0x08",
      "submap": 2,
      "submapHex": "0x02",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA17F",
        "pointerAddress": "0xA18C",
        "address": "0xA1AB",
        "firstBytes": [
          "0xFE",
          "0x0D",
          "0xFF",
          "0x00",
          "0x06",
          "0x01",
          "0x19",
          "0x0F"
        ],
        "rawLayoutIndex": "0xFE",
        "layoutIndex": "0x0D",
        "layoutIndexSource": "special-0xFE-byte-1"
      },
      "recipe": {
        "id": "obj02-area08-sub02-dora-woods-part-2-night-recipe",
        "label": "Dora Woods - Part 2, night",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, night.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-night",
            "label": "Jova Woods, night"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x08",
          "submap": "0x02"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x00",
          "submap": "0x03",
          "submapRaw": "0x83",
          "submapFlags": "0x80"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "bank": 4,
          "address": "0x9FF9",
          "pointerAddress": "0x88DF",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9EFB",
            "indexListAddress": "0xA1DC",
            "indexOffset": 6,
            "transferId": "0x25",
            "auxiliaryTransferId": "0x30",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88DF"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area08-sub02-dora-woods-part-2-night.png",
      "width": 512,
      "height": 448,
      "layoutSections": [
        0,
        1
      ],
      "layoutGrid": {
        "columns": 2,
        "rows": 2,
        "renderedColumns": 2,
        "renderedRows": 2,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 8,
          "submap": 2
        },
        "screenRecord": {
          "pointerAddress": "0xA18C",
          "address": "0xA1AB",
          "firstBytes": [
            "0xFE",
            "0x0D",
            "0xFF",
            "0x00",
            "0x06",
            "0x01",
            "0x19",
            "0x0F"
          ],
          "rawLayoutIndex": 254,
          "rawLayoutIndexHex": "0xFE",
          "layoutIndex": 13,
          "layoutIndexHex": "0x0D",
          "layoutIndexSource": "segment-override"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F55",
          "address": "0xA296",
          "bank": 2,
          "secondaryAddress": "0xA1F8"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area09-sub00-dora-woods-part-3-day",
      "locationId": "obj02-area09-sub00-dora-woods-part-3",
      "name": "Dora Woods - Part 3",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 9,
      "areaHex": "0x09",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA18E",
        "pointerAddress": "0xA197",
        "address": "0xA1B0",
        "firstBytes": [
          "0x01",
          "0x19",
          "0x0F",
          "0x00",
          "0x00",
          "0x01",
          "0x00",
          "0x00"
        ],
        "rawLayoutIndex": "0x01",
        "layoutIndex": "0x01",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area09-sub00-dora-woods-part-3-day-recipe",
        "label": "Dora Woods - Part 3, day",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, day.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-day",
            "label": "Jova Woods, day"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x09",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x09",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0x9FE8",
          "pointerAddress": "0x88DD",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9F1D",
            "indexListAddress": "0xA1D4",
            "indexOffset": 0,
            "transferId": "0x24",
            "auxiliaryTransferId": "0x33",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88DD"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area09-sub00-dora-woods-part-3-day.png",
      "width": 512,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 2,
        "rows": 1,
        "renderedColumns": 2,
        "renderedRows": 1,
        "totalPointers": 2
      },
      "columnGroups": [
        0,
        1
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 9,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xA197",
          "address": "0xA1B0",
          "firstBytes": [
            "0x01",
            "0x19",
            "0x0F",
            "0x00",
            "0x00",
            "0x01",
            "0x00",
            "0x00"
          ],
          "rawLayoutIndex": 1,
          "rawLayoutIndexHex": "0x01",
          "layoutIndex": 1,
          "layoutIndexHex": "0x01",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F25",
          "address": "0xA222",
          "bank": 2,
          "secondaryAddress": "0xA1F8"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area09-sub00-dora-woods-part-3-night",
      "locationId": "obj02-area09-sub00-dora-woods-part-3",
      "name": "Dora Woods - Part 3",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 9,
      "areaHex": "0x09",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA18E",
        "pointerAddress": "0xA197",
        "address": "0xA1B0",
        "firstBytes": [
          "0x01",
          "0x19",
          "0x0F",
          "0x00",
          "0x00",
          "0x01",
          "0x00",
          "0x00"
        ],
        "rawLayoutIndex": "0x01",
        "layoutIndex": "0x01",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area09-sub00-dora-woods-part-3-night-recipe",
        "label": "Dora Woods - Part 3, night",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, night.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-night",
            "label": "Jova Woods, night"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x09",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x09",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "bank": 4,
          "address": "0x9FF9",
          "pointerAddress": "0x88DF",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9F1F",
            "indexListAddress": "0xA1F2",
            "indexOffset": 0,
            "transferId": "0x25",
            "auxiliaryTransferId": "0x33",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88DF"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area09-sub00-dora-woods-part-3-night.png",
      "width": 512,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 2,
        "rows": 1,
        "renderedColumns": 2,
        "renderedRows": 1,
        "totalPointers": 2
      },
      "columnGroups": [
        0,
        1
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 9,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xA197",
          "address": "0xA1B0",
          "firstBytes": [
            "0x01",
            "0x19",
            "0x0F",
            "0x00",
            "0x00",
            "0x01",
            "0x00",
            "0x00"
          ],
          "rawLayoutIndex": 1,
          "rawLayoutIndexHex": "0x01",
          "layoutIndex": 1,
          "layoutIndexHex": "0x01",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F25",
          "address": "0xA222",
          "bank": 2,
          "secondaryAddress": "0xA1F8"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area09-sub01-long-bridge-to-bordia-mountains-dead-end-swamp-day",
      "locationId": "obj02-area09-sub01-long-bridge-to-bordia-mountains-dead-end-swamp",
      "name": "Long Bridge to Bordia Mountains (Dead End Swamp)",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 9,
      "areaHex": "0x09",
      "submap": 1,
      "submapHex": "0x01",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA18E",
        "pointerAddress": "0xA199",
        "address": "0xA1B1",
        "firstBytes": [
          "0x19",
          "0x0F",
          "0x00",
          "0x00",
          "0x01",
          "0x00",
          "0x00",
          "0x00"
        ],
        "rawLayoutIndex": "0x19",
        "layoutIndex": "0x19",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area09-sub01-long-bridge-to-bordia-mountains-dead-end-swamp-day-recipe",
        "label": "Long Bridge to Bordia Mountains (Dead End Swamp), day",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, day.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-day",
            "label": "Jova Woods, day"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x09",
          "submap": "0x01"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x09",
          "submap": "0x01"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "address": "0xCAF3",
          "pointerAddress": "0x88D3",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9F1D",
            "indexListAddress": "0xA1D4",
            "indexOffset": 2,
            "transferId": "0x1F",
            "auxiliaryTransferId": "0x2F",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88D3"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area09-sub01-long-bridge-to-bordia-mountains-dead-end-swamp-day.png",
      "width": 1024,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 1,
        "renderedColumns": 4,
        "renderedRows": 1,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 9,
          "submap": 1
        },
        "screenRecord": {
          "pointerAddress": "0xA199",
          "address": "0xA1B1",
          "firstBytes": [
            "0x19",
            "0x0F",
            "0x00",
            "0x00",
            "0x01",
            "0x00",
            "0x00",
            "0x00"
          ],
          "rawLayoutIndex": 25,
          "rawLayoutIndexHex": "0x19",
          "layoutIndex": 25,
          "layoutIndexHex": "0x19",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F85",
          "address": "0xA2D0",
          "bank": 2,
          "secondaryAddress": "0xA221"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area09-sub01-long-bridge-to-bordia-mountains-dead-end-swamp-night",
      "locationId": "obj02-area09-sub01-long-bridge-to-bordia-mountains-dead-end-swamp",
      "name": "Long Bridge to Bordia Mountains (Dead End Swamp)",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 9,
      "areaHex": "0x09",
      "submap": 1,
      "submapHex": "0x01",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA18E",
        "pointerAddress": "0xA199",
        "address": "0xA1B1",
        "firstBytes": [
          "0x19",
          "0x0F",
          "0x00",
          "0x00",
          "0x01",
          "0x00",
          "0x00",
          "0x00"
        ],
        "rawLayoutIndex": "0x19",
        "layoutIndex": "0x19",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area09-sub01-long-bridge-to-bordia-mountains-dead-end-swamp-night-recipe",
        "label": "Long Bridge to Bordia Mountains (Dead End Swamp), night",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, night.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-night",
            "label": "Jova Woods, night"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x09",
          "submap": "0x01"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x09",
          "submap": "0x01"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "address": "0xCB15",
          "pointerAddress": "0x88D7",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9F1F",
            "indexListAddress": "0xA1F2",
            "indexOffset": 2,
            "transferId": "0x21",
            "auxiliaryTransferId": "0x2F",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88D7"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area09-sub01-long-bridge-to-bordia-mountains-dead-end-swamp-night.png",
      "width": 1024,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 1,
        "renderedColumns": 4,
        "renderedRows": 1,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 9,
          "submap": 1
        },
        "screenRecord": {
          "pointerAddress": "0xA199",
          "address": "0xA1B1",
          "firstBytes": [
            "0x19",
            "0x0F",
            "0x00",
            "0x00",
            "0x01",
            "0x00",
            "0x00",
            "0x00"
          ],
          "rawLayoutIndex": 25,
          "rawLayoutIndexHex": "0x19",
          "layoutIndex": 25,
          "layoutIndexHex": "0x19",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F85",
          "address": "0xA2D0",
          "bank": 2,
          "secondaryAddress": "0xA221"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area09-sub02-bordia-mountains-dead-end-swamp-day",
      "locationId": "obj02-area09-sub02-bordia-mountains-dead-end-swamp",
      "name": "Bordia Mountains (Dead End Swamp)",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 9,
      "areaHex": "0x09",
      "submap": 2,
      "submapHex": "0x02",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA18E",
        "pointerAddress": "0xA19B",
        "address": "0xA1B2",
        "firstBytes": [
          "0x0F",
          "0x00",
          "0x00",
          "0x01",
          "0x00",
          "0x00",
          "0x00",
          "0x00"
        ],
        "rawLayoutIndex": "0x0F",
        "layoutIndex": "0x0F",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area09-sub02-bordia-mountains-dead-end-swamp-day-recipe",
        "label": "Bordia Mountains (Dead End Swamp), day",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, day.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-day",
            "label": "Jova Woods, day"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x09",
          "submap": "0x02"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x09",
          "submap": "0x02"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0xA01B",
          "pointerAddress": "0x88E3",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9F1D",
            "indexListAddress": "0xA1D4",
            "indexOffset": 4,
            "transferId": "0x27",
            "auxiliaryTransferId": "0x34",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88E3"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area09-sub02-bordia-mountains-dead-end-swamp-day.png",
      "width": 1024,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 1,
        "renderedColumns": 4,
        "renderedRows": 1,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 9,
          "submap": 2
        },
        "screenRecord": {
          "pointerAddress": "0xA19B",
          "address": "0xA1B2",
          "firstBytes": [
            "0x0F",
            "0x00",
            "0x00",
            "0x01",
            "0x00",
            "0x00",
            "0x00",
            "0x00"
          ],
          "rawLayoutIndex": 15,
          "rawLayoutIndexHex": "0x0F",
          "layoutIndex": 15,
          "layoutIndexHex": "0x0F",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F5D",
          "address": "0xA2A0",
          "bank": 2,
          "secondaryAddress": "0xA207"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj02-area09-sub02-bordia-mountains-dead-end-swamp-night",
      "locationId": "obj02-area09-sub02-bordia-mountains-dead-end-swamp",
      "name": "Bordia Mountains (Dead End Swamp)",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 9,
      "areaHex": "0x09",
      "submap": 2,
      "submapHex": "0x02",
      "screenRecord": {
        "areaTableAddress": "0x9EE5",
        "areaRecordAddress": "0xA18E",
        "pointerAddress": "0xA19B",
        "address": "0xA1B2",
        "firstBytes": [
          "0x0F",
          "0x00",
          "0x00",
          "0x01",
          "0x00",
          "0x00",
          "0x00",
          "0x00"
        ],
        "rawLayoutIndex": "0x0F",
        "layoutIndex": "0x0F",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj02-area09-sub02-bordia-mountains-dead-end-swamp-night-recipe",
        "label": "Bordia Mountains (Dead End Swamp), night",
        "status": "projected",
        "statusDetail": "Projected from Jova Woods, night.",
        "evidence": {
          "familyFixture": {
            "id": "jova-woods-night",
            "label": "Jova Woods, night"
          }
        },
        "layoutContext": {
          "objset": "0x02",
          "area": "0x09",
          "submap": "0x02"
        },
        "paletteContext": {
          "objset": "0x02",
          "area": "0x09",
          "submap": "0x02"
        },
        "chrBanks": [
          "0x02",
          "0x03"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "bank": 4,
          "address": "0xA02C",
          "pointerAddress": "0x88E5",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x9EF9",
            "indexListPointerAddress": "0x9F1F",
            "indexListAddress": "0xA1F2",
            "indexOffset": 4,
            "transferId": "0x28",
            "auxiliaryTransferId": "0x34",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88E5"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj02-area09-sub02-bordia-mountains-dead-end-swamp-night.png",
      "width": 1024,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 1,
        "renderedColumns": 4,
        "renderedRows": 1,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 2,
          "area": 9,
          "submap": 2
        },
        "screenRecord": {
          "pointerAddress": "0xA19B",
          "address": "0xA1B2",
          "firstBytes": [
            "0x0F",
            "0x00",
            "0x00",
            "0x01",
            "0x00",
            "0x00",
            "0x00",
            "0x00"
          ],
          "rawLayoutIndex": 15,
          "rawLayoutIndexHex": "0x0F",
          "layoutIndex": 15,
          "layoutIndexHex": "0x0F",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FF",
          "address": "0x9F21"
        },
        "layoutHeader": {
          "pointerAddress": "0x9F5D",
          "address": "0xA2A0",
          "bank": 2,
          "secondaryAddress": "0xA207"
        },
        "tileSet": {
          "pointerAddress": "0xF7D9",
          "address": "0x8CF4",
          "auxiliaryAddress": "0xF7EF"
        }
      }
    },
    {
      "id": "obj03-area00-sub00-camilla-cemetery-day",
      "locationId": "obj03-area00-sub00-camilla-cemetery",
      "name": "Camilla Cemetery",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 3,
      "objsetHex": "0x03",
      "area": 0,
      "areaHex": "0x00",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0xB280",
        "areaRecordAddress": "0xB372",
        "pointerAddress": "0xB37B",
        "address": "0xB3A2",
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
        "rawLayoutIndex": "0x00",
        "layoutIndex": "0x00",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj03-area00-sub00-camilla-cemetery-day-recipe",
        "label": "Camilla Cemetery, day",
        "status": "validated",
        "statusDetail": "Validated by Camilla Cemetery, day.",
        "evidence": {
          "exactFixture": {
            "id": "camilla-cemetery-day",
            "label": "Camilla Cemetery, day"
          },
          "familyFixture": {
            "id": "camilla-cemetery-day",
            "label": "Camilla Cemetery, day"
          }
        },
        "layoutContext": {
          "objset": "0x03",
          "area": "0x00",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x03",
          "area": "0x00",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x04",
          "0x05"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0xA03D",
          "pointerAddress": "0x88E7",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0xB28A",
            "indexListPointerAddress": "0xB28A",
            "indexListAddress": "0xB3B2",
            "indexOffset": 0,
            "transferId": "0x29",
            "auxiliaryTransferId": "0x35",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88E7"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj03-area00-sub00-camilla-cemetery-day.png",
      "width": 1024,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 1,
        "renderedColumns": 4,
        "renderedRows": 1,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 3,
          "area": 0,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xB37B",
          "address": "0xB3A2",
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
          "rawLayoutIndex": 0,
          "rawLayoutIndexHex": "0x00",
          "layoutIndex": 0,
          "layoutIndexHex": "0x00",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF801",
          "address": "0xB29E"
        },
        "layoutHeader": {
          "pointerAddress": "0xB29E",
          "address": "0xB3EF",
          "bank": 2,
          "secondaryAddress": "0xB3EE"
        },
        "tileSet": {
          "pointerAddress": "0xF7DD",
          "address": "0x918A",
          "auxiliaryAddress": "0xF7F2"
        }
      }
    },
    {
      "id": "obj03-area00-sub00-camilla-cemetery-night",
      "locationId": "obj03-area00-sub00-camilla-cemetery",
      "name": "Camilla Cemetery",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 3,
      "objsetHex": "0x03",
      "area": 0,
      "areaHex": "0x00",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0xB280",
        "areaRecordAddress": "0xB372",
        "pointerAddress": "0xB37B",
        "address": "0xB3A2",
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
        "rawLayoutIndex": "0x00",
        "layoutIndex": "0x00",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj03-area00-sub00-camilla-cemetery-night-recipe",
        "label": "Camilla Cemetery, night",
        "status": "validated",
        "statusDetail": "Validated by Camilla Cemetery, night.",
        "evidence": {
          "exactFixture": {
            "id": "camilla-cemetery-night",
            "label": "Camilla Cemetery, night"
          },
          "familyFixture": {
            "id": "camilla-cemetery-night",
            "label": "Camilla Cemetery, night"
          }
        },
        "layoutContext": {
          "objset": "0x03",
          "area": "0x00",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x03",
          "area": "0x00",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x04",
          "0x05"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "bank": 4,
          "address": "0xA05F",
          "pointerAddress": "0x88EB",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0xB28A",
            "indexListPointerAddress": "0xB28C",
            "indexListAddress": "0xB3C0",
            "indexOffset": 0,
            "transferId": "0x2B",
            "auxiliaryTransferId": "0x35",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88EB"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj03-area00-sub00-camilla-cemetery-night.png",
      "width": 1024,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 1,
        "renderedColumns": 4,
        "renderedRows": 1,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 3,
          "area": 0,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xB37B",
          "address": "0xB3A2",
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
          "rawLayoutIndex": 0,
          "rawLayoutIndexHex": "0x00",
          "layoutIndex": 0,
          "layoutIndexHex": "0x00",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF801",
          "address": "0xB29E"
        },
        "layoutHeader": {
          "pointerAddress": "0xB29E",
          "address": "0xB3EF",
          "bank": 2,
          "secondaryAddress": "0xB3EE"
        },
        "tileSet": {
          "pointerAddress": "0xF7DD",
          "address": "0x918A",
          "auxiliaryAddress": "0xF7F2"
        }
      }
    },
    {
      "id": "obj03-area00-sub01-joma-marsh-part-1-day",
      "locationId": "obj03-area00-sub01-joma-marsh-part-1",
      "name": "Joma Marsh - Part 1",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 3,
      "objsetHex": "0x03",
      "area": 0,
      "areaHex": "0x00",
      "submap": 1,
      "submapHex": "0x01",
      "screenRecord": {
        "areaTableAddress": "0xB280",
        "areaRecordAddress": "0xB372",
        "pointerAddress": "0xB37D",
        "address": "0xB3A3",
        "firstBytes": [
          "0x01",
          "0x05",
          "0xFD",
          "0x06",
          "0x00",
          "0x00",
          "0x01",
          "0x07"
        ],
        "rawLayoutIndex": "0x01",
        "layoutIndex": "0x01",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj03-area00-sub01-joma-marsh-part-1-day-recipe",
        "label": "Joma Marsh - Part 1, day",
        "status": "projected",
        "statusDetail": "Projected from Camilla Cemetery, day.",
        "evidence": {
          "familyFixture": {
            "id": "camilla-cemetery-day",
            "label": "Camilla Cemetery, day"
          }
        },
        "layoutContext": {
          "objset": "0x03",
          "area": "0x00",
          "submap": "0x01"
        },
        "paletteContext": {
          "objset": "0x03",
          "area": "0x00",
          "submap": "0x01"
        },
        "chrBanks": [
          "0x04",
          "0x05"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0xA070",
          "pointerAddress": "0x88ED",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0xB28A",
            "indexListPointerAddress": "0xB28A",
            "indexListAddress": "0xB3B2",
            "indexOffset": 2,
            "transferId": "0x2C",
            "auxiliaryTransferId": "0x35",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88ED"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj03-area00-sub01-joma-marsh-part-1-day.png",
      "width": 1024,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 1,
        "renderedColumns": 4,
        "renderedRows": 1,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 3,
          "area": 0,
          "submap": 1
        },
        "screenRecord": {
          "pointerAddress": "0xB37D",
          "address": "0xB3A3",
          "firstBytes": [
            "0x01",
            "0x05",
            "0xFD",
            "0x06",
            "0x00",
            "0x00",
            "0x01",
            "0x07"
          ],
          "rawLayoutIndex": 1,
          "rawLayoutIndexHex": "0x01",
          "layoutIndex": 1,
          "layoutIndexHex": "0x01",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF801",
          "address": "0xB29E"
        },
        "layoutHeader": {
          "pointerAddress": "0xB2A2",
          "address": "0xB401",
          "bank": 2,
          "secondaryAddress": "0xB3CE"
        },
        "tileSet": {
          "pointerAddress": "0xF7DD",
          "address": "0x918A",
          "auxiliaryAddress": "0xF7F2"
        }
      }
    },
    {
      "id": "obj03-area00-sub01-joma-marsh-part-1-night",
      "locationId": "obj03-area00-sub01-joma-marsh-part-1",
      "name": "Joma Marsh - Part 1",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 3,
      "objsetHex": "0x03",
      "area": 0,
      "areaHex": "0x00",
      "submap": 1,
      "submapHex": "0x01",
      "screenRecord": {
        "areaTableAddress": "0xB280",
        "areaRecordAddress": "0xB372",
        "pointerAddress": "0xB37D",
        "address": "0xB3A3",
        "firstBytes": [
          "0x01",
          "0x05",
          "0xFD",
          "0x06",
          "0x00",
          "0x00",
          "0x01",
          "0x07"
        ],
        "rawLayoutIndex": "0x01",
        "layoutIndex": "0x01",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj03-area00-sub01-joma-marsh-part-1-night-recipe",
        "label": "Joma Marsh - Part 1, night",
        "status": "projected",
        "statusDetail": "Projected from Camilla Cemetery, night.",
        "evidence": {
          "familyFixture": {
            "id": "camilla-cemetery-night",
            "label": "Camilla Cemetery, night"
          }
        },
        "layoutContext": {
          "objset": "0x03",
          "area": "0x00",
          "submap": "0x01"
        },
        "paletteContext": {
          "objset": "0x03",
          "area": "0x00",
          "submap": "0x01"
        },
        "chrBanks": [
          "0x04",
          "0x05"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "bank": 4,
          "address": "0xA0A3",
          "pointerAddress": "0x890F",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0xB28A",
            "indexListPointerAddress": "0xB28C",
            "indexListAddress": "0xB3C0",
            "indexOffset": 2,
            "transferId": "0x3D",
            "auxiliaryTransferId": "0x35",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x890F"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj03-area00-sub01-joma-marsh-part-1-night.png",
      "width": 1024,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 1,
        "renderedColumns": 4,
        "renderedRows": 1,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 3,
          "area": 0,
          "submap": 1
        },
        "screenRecord": {
          "pointerAddress": "0xB37D",
          "address": "0xB3A3",
          "firstBytes": [
            "0x01",
            "0x05",
            "0xFD",
            "0x06",
            "0x00",
            "0x00",
            "0x01",
            "0x07"
          ],
          "rawLayoutIndex": 1,
          "rawLayoutIndexHex": "0x01",
          "layoutIndex": 1,
          "layoutIndexHex": "0x01",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF801",
          "address": "0xB29E"
        },
        "layoutHeader": {
          "pointerAddress": "0xB2A2",
          "address": "0xB401",
          "bank": 2,
          "secondaryAddress": "0xB3CE"
        },
        "tileSet": {
          "pointerAddress": "0xF7DD",
          "address": "0x918A",
          "auxiliaryAddress": "0xF7F2"
        }
      }
    },
    {
      "id": "obj03-area01-sub00-storigoi-graveyard-blob-boost-day",
      "locationId": "obj03-area01-sub00-storigoi-graveyard-blob-boost",
      "name": "Storigoi Graveyard (Blob Boost)",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 3,
      "objsetHex": "0x03",
      "area": 1,
      "areaHex": "0x01",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0xB280",
        "areaRecordAddress": "0xB37F",
        "pointerAddress": "0xB388",
        "address": "0xB3A4",
        "firstBytes": [
          "0x05",
          "0xFD",
          "0x06",
          "0x00",
          "0x00",
          "0x01",
          "0x07",
          "0x09"
        ],
        "rawLayoutIndex": "0x05",
        "layoutIndex": "0x05",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj03-area01-sub00-storigoi-graveyard-blob-boost-day-recipe",
        "label": "Storigoi Graveyard (Blob Boost), day",
        "status": "projected",
        "statusDetail": "Projected from Camilla Cemetery, day.",
        "evidence": {
          "familyFixture": {
            "id": "camilla-cemetery-day",
            "label": "Camilla Cemetery, day"
          }
        },
        "layoutContext": {
          "objset": "0x03",
          "area": "0x01",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x03",
          "area": "0x01",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x04",
          "0x05"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0xA04E",
          "pointerAddress": "0x88E9",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0xB28A",
            "indexListPointerAddress": "0xB28E",
            "indexListAddress": "0xB3B6",
            "indexOffset": 0,
            "transferId": "0x2A",
            "auxiliaryTransferId": "0x36",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88E9"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj03-area01-sub00-storigoi-graveyard-blob-boost-day.png",
      "width": 1024,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 1,
        "renderedColumns": 4,
        "renderedRows": 1,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 3,
          "area": 1,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xB388",
          "address": "0xB3A4",
          "firstBytes": [
            "0x05",
            "0xFD",
            "0x06",
            "0x00",
            "0x00",
            "0x01",
            "0x07",
            "0x09"
          ],
          "rawLayoutIndex": 5,
          "rawLayoutIndexHex": "0x05",
          "layoutIndex": 5,
          "layoutIndexHex": "0x05",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF801",
          "address": "0xB29E"
        },
        "layoutHeader": {
          "pointerAddress": "0xB2B2",
          "address": "0xB413",
          "bank": 2,
          "secondaryAddress": "0xB3D3"
        },
        "tileSet": {
          "pointerAddress": "0xF7DD",
          "address": "0x918A",
          "auxiliaryAddress": "0xF7F2"
        }
      }
    },
    {
      "id": "obj03-area01-sub00-storigoi-graveyard-blob-boost-night",
      "locationId": "obj03-area01-sub00-storigoi-graveyard-blob-boost",
      "name": "Storigoi Graveyard (Blob Boost)",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 3,
      "objsetHex": "0x03",
      "area": 1,
      "areaHex": "0x01",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0xB280",
        "areaRecordAddress": "0xB37F",
        "pointerAddress": "0xB388",
        "address": "0xB3A4",
        "firstBytes": [
          "0x05",
          "0xFD",
          "0x06",
          "0x00",
          "0x00",
          "0x01",
          "0x07",
          "0x09"
        ],
        "rawLayoutIndex": "0x05",
        "layoutIndex": "0x05",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj03-area01-sub00-storigoi-graveyard-blob-boost-night-recipe",
        "label": "Storigoi Graveyard (Blob Boost), night",
        "status": "projected",
        "statusDetail": "Projected from Camilla Cemetery, night.",
        "evidence": {
          "familyFixture": {
            "id": "camilla-cemetery-night",
            "label": "Camilla Cemetery, night"
          }
        },
        "layoutContext": {
          "objset": "0x03",
          "area": "0x01",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x03",
          "area": "0x01",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x04",
          "0x05"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "bank": 4,
          "address": "0xA05F",
          "pointerAddress": "0x88EB",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0xB28A",
            "indexListPointerAddress": "0xB290",
            "indexListAddress": "0xB3C4",
            "indexOffset": 0,
            "transferId": "0x2B",
            "auxiliaryTransferId": "0x36",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88EB"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj03-area01-sub00-storigoi-graveyard-blob-boost-night.png",
      "width": 1024,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 1,
        "renderedColumns": 4,
        "renderedRows": 1,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 3,
          "area": 1,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xB388",
          "address": "0xB3A4",
          "firstBytes": [
            "0x05",
            "0xFD",
            "0x06",
            "0x00",
            "0x00",
            "0x01",
            "0x07",
            "0x09"
          ],
          "rawLayoutIndex": 5,
          "rawLayoutIndexHex": "0x05",
          "layoutIndex": 5,
          "layoutIndexHex": "0x05",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF801",
          "address": "0xB29E"
        },
        "layoutHeader": {
          "pointerAddress": "0xB2B2",
          "address": "0xB413",
          "bank": 2,
          "secondaryAddress": "0xB3D3"
        },
        "tileSet": {
          "pointerAddress": "0xF7DD",
          "address": "0x918A",
          "auxiliaryAddress": "0xF7F2"
        }
      }
    },
    {
      "id": "obj03-area02-sub00-sadam-woods-part-2-day",
      "locationId": "obj03-area02-sub00-sadam-woods-part-2",
      "name": "Sadam Woods - Part 2",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 3,
      "objsetHex": "0x03",
      "area": 2,
      "areaHex": "0x02",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0xB280",
        "areaRecordAddress": "0xB38A",
        "pointerAddress": "0xB393",
        "address": "0xB3A5",
        "firstBytes": [
          "0xFD",
          "0x06",
          "0x00",
          "0x00",
          "0x01",
          "0x07",
          "0x09",
          "0x00"
        ],
        "rawLayoutIndex": "0xFD",
        "layoutIndex": "0x06",
        "layoutIndexSource": "special-0xFD-byte-1"
      },
      "recipe": {
        "id": "obj03-area02-sub00-sadam-woods-part-2-day-recipe",
        "label": "Sadam Woods - Part 2, day",
        "status": "projected",
        "statusDetail": "Projected from Camilla Cemetery, day.",
        "evidence": {
          "familyFixture": {
            "id": "camilla-cemetery-day",
            "label": "Camilla Cemetery, day"
          }
        },
        "layoutContext": {
          "objset": "0x03",
          "area": "0x02",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x03",
          "area": "0x02",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x04",
          "0x05"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0xA081",
          "pointerAddress": "0x88EF",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0xB28A",
            "indexListPointerAddress": "0xB292",
            "indexListAddress": "0xB3B8",
            "indexOffset": 0,
            "transferId": "0x2D",
            "auxiliaryTransferId": "0x36",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88EF"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj03-area02-sub00-sadam-woods-part-2-day.png",
      "width": 512,
      "height": 448,
      "layoutSections": [
        0,
        1
      ],
      "layoutGrid": {
        "columns": 2,
        "rows": 2,
        "renderedColumns": 2,
        "renderedRows": 2,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 3,
          "area": 2,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xB393",
          "address": "0xB3A5",
          "firstBytes": [
            "0xFD",
            "0x06",
            "0x00",
            "0x00",
            "0x01",
            "0x07",
            "0x09",
            "0x00"
          ],
          "rawLayoutIndex": 253,
          "rawLayoutIndexHex": "0xFD",
          "layoutIndex": 6,
          "layoutIndexHex": "0x06",
          "layoutIndexSource": "segment-override"
        },
        "layoutTable": {
          "pointerAddress": "0xF801",
          "address": "0xB29E"
        },
        "layoutHeader": {
          "pointerAddress": "0xB2B6",
          "address": "0xB425",
          "bank": 2,
          "secondaryAddress": "0xB3D8"
        },
        "tileSet": {
          "pointerAddress": "0xF7DD",
          "address": "0x918A",
          "auxiliaryAddress": "0xF7F2"
        }
      }
    },
    {
      "id": "obj03-area02-sub00-sadam-woods-part-2-night",
      "locationId": "obj03-area02-sub00-sadam-woods-part-2",
      "name": "Sadam Woods - Part 2",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 3,
      "objsetHex": "0x03",
      "area": 2,
      "areaHex": "0x02",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0xB280",
        "areaRecordAddress": "0xB38A",
        "pointerAddress": "0xB393",
        "address": "0xB3A5",
        "firstBytes": [
          "0xFD",
          "0x06",
          "0x00",
          "0x00",
          "0x01",
          "0x07",
          "0x09",
          "0x00"
        ],
        "rawLayoutIndex": "0xFD",
        "layoutIndex": "0x06",
        "layoutIndexSource": "special-0xFD-byte-1"
      },
      "recipe": {
        "id": "obj03-area02-sub00-sadam-woods-part-2-night-recipe",
        "label": "Sadam Woods - Part 2, night",
        "status": "projected",
        "statusDetail": "Projected from Camilla Cemetery, night.",
        "evidence": {
          "familyFixture": {
            "id": "camilla-cemetery-night",
            "label": "Camilla Cemetery, night"
          }
        },
        "layoutContext": {
          "objset": "0x03",
          "area": "0x02",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x03",
          "area": "0x02",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x04",
          "0x05"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "bank": 4,
          "address": "0xA0A3",
          "pointerAddress": "0x890F",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0xB28A",
            "indexListPointerAddress": "0xB294",
            "indexListAddress": "0xB3C6",
            "indexOffset": 0,
            "transferId": "0x3D",
            "auxiliaryTransferId": "0x36",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x890F"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj03-area02-sub00-sadam-woods-part-2-night.png",
      "width": 512,
      "height": 448,
      "layoutSections": [
        0,
        1
      ],
      "layoutGrid": {
        "columns": 2,
        "rows": 2,
        "renderedColumns": 2,
        "renderedRows": 2,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 3,
          "area": 2,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xB393",
          "address": "0xB3A5",
          "firstBytes": [
            "0xFD",
            "0x06",
            "0x00",
            "0x00",
            "0x01",
            "0x07",
            "0x09",
            "0x00"
          ],
          "rawLayoutIndex": 253,
          "rawLayoutIndexHex": "0xFD",
          "layoutIndex": 6,
          "layoutIndexHex": "0x06",
          "layoutIndexSource": "segment-override"
        },
        "layoutTable": {
          "pointerAddress": "0xF801",
          "address": "0xB29E"
        },
        "layoutHeader": {
          "pointerAddress": "0xB2B6",
          "address": "0xB425",
          "bank": 2,
          "secondaryAddress": "0xB3D8"
        },
        "tileSet": {
          "pointerAddress": "0xF7DD",
          "address": "0x918A",
          "auxiliaryAddress": "0xF7F2"
        }
      }
    },
    {
      "id": "obj03-area02-sub01-sadam-woods-part-1-day",
      "locationId": "obj03-area02-sub01-sadam-woods-part-1",
      "name": "Sadam Woods - Part 1",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 3,
      "objsetHex": "0x03",
      "area": 2,
      "areaHex": "0x02",
      "submap": 1,
      "submapHex": "0x01",
      "screenRecord": {
        "areaTableAddress": "0xB280",
        "areaRecordAddress": "0xB38A",
        "pointerAddress": "0xB395",
        "address": "0xB3AA",
        "firstBytes": [
          "0x07",
          "0x09",
          "0x00",
          "0x00",
          "0x01",
          "0x00",
          "0x02",
          "0x00"
        ],
        "rawLayoutIndex": "0x07",
        "layoutIndex": "0x07",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj03-area02-sub01-sadam-woods-part-1-day-recipe",
        "label": "Sadam Woods - Part 1, day",
        "status": "projected",
        "statusDetail": "Projected from Camilla Cemetery, day.",
        "evidence": {
          "familyFixture": {
            "id": "camilla-cemetery-day",
            "label": "Camilla Cemetery, day"
          }
        },
        "layoutContext": {
          "objset": "0x03",
          "area": "0x02",
          "submap": "0x01"
        },
        "paletteContext": {
          "objset": "0x03",
          "area": "0x02",
          "submap": "0x01"
        },
        "chrBanks": [
          "0x04",
          "0x05"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0xA081",
          "pointerAddress": "0x88EF",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0xB28A",
            "indexListPointerAddress": "0xB292",
            "indexListAddress": "0xB3B8",
            "indexOffset": 2,
            "transferId": "0x2D",
            "auxiliaryTransferId": "0x36",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88EF"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj03-area02-sub01-sadam-woods-part-1-day.png",
      "width": 512,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 2,
        "rows": 1,
        "renderedColumns": 2,
        "renderedRows": 1,
        "totalPointers": 2
      },
      "columnGroups": [
        0,
        1
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 3,
          "area": 2,
          "submap": 1
        },
        "screenRecord": {
          "pointerAddress": "0xB395",
          "address": "0xB3AA",
          "firstBytes": [
            "0x07",
            "0x09",
            "0x00",
            "0x00",
            "0x01",
            "0x00",
            "0x02",
            "0x00"
          ],
          "rawLayoutIndex": 7,
          "rawLayoutIndexHex": "0x07",
          "layoutIndex": 7,
          "layoutIndexHex": "0x07",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF801",
          "address": "0xB29E"
        },
        "layoutHeader": {
          "pointerAddress": "0xB2BA",
          "address": "0xB433",
          "bank": 2,
          "secondaryAddress": "0xB3E5"
        },
        "tileSet": {
          "pointerAddress": "0xF7DD",
          "address": "0x918A",
          "auxiliaryAddress": "0xF7F2"
        }
      }
    },
    {
      "id": "obj03-area02-sub01-sadam-woods-part-1-night",
      "locationId": "obj03-area02-sub01-sadam-woods-part-1",
      "name": "Sadam Woods - Part 1",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 3,
      "objsetHex": "0x03",
      "area": 2,
      "areaHex": "0x02",
      "submap": 1,
      "submapHex": "0x01",
      "screenRecord": {
        "areaTableAddress": "0xB280",
        "areaRecordAddress": "0xB38A",
        "pointerAddress": "0xB395",
        "address": "0xB3AA",
        "firstBytes": [
          "0x07",
          "0x09",
          "0x00",
          "0x00",
          "0x01",
          "0x00",
          "0x02",
          "0x00"
        ],
        "rawLayoutIndex": "0x07",
        "layoutIndex": "0x07",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj03-area02-sub01-sadam-woods-part-1-night-recipe",
        "label": "Sadam Woods - Part 1, night",
        "status": "projected",
        "statusDetail": "Projected from Camilla Cemetery, night.",
        "evidence": {
          "familyFixture": {
            "id": "camilla-cemetery-night",
            "label": "Camilla Cemetery, night"
          }
        },
        "layoutContext": {
          "objset": "0x03",
          "area": "0x02",
          "submap": "0x01"
        },
        "paletteContext": {
          "objset": "0x03",
          "area": "0x02",
          "submap": "0x01"
        },
        "chrBanks": [
          "0x04",
          "0x05"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "bank": 4,
          "address": "0xA0A3",
          "pointerAddress": "0x890F",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0xB28A",
            "indexListPointerAddress": "0xB294",
            "indexListAddress": "0xB3C6",
            "indexOffset": 2,
            "transferId": "0x3D",
            "auxiliaryTransferId": "0x36",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x890F"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj03-area02-sub01-sadam-woods-part-1-night.png",
      "width": 512,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 2,
        "rows": 1,
        "renderedColumns": 2,
        "renderedRows": 1,
        "totalPointers": 2
      },
      "columnGroups": [
        0,
        1
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 3,
          "area": 2,
          "submap": 1
        },
        "screenRecord": {
          "pointerAddress": "0xB395",
          "address": "0xB3AA",
          "firstBytes": [
            "0x07",
            "0x09",
            "0x00",
            "0x00",
            "0x01",
            "0x00",
            "0x02",
            "0x00"
          ],
          "rawLayoutIndex": 7,
          "rawLayoutIndexHex": "0x07",
          "layoutIndex": 7,
          "layoutIndexHex": "0x07",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF801",
          "address": "0xB29E"
        },
        "layoutHeader": {
          "pointerAddress": "0xB2BA",
          "address": "0xB433",
          "bank": 2,
          "secondaryAddress": "0xB3E5"
        },
        "tileSet": {
          "pointerAddress": "0xF7DD",
          "address": "0x918A",
          "auxiliaryAddress": "0xF7F2"
        }
      }
    },
    {
      "id": "obj03-area03-sub00-joma-marsh-part-2-day",
      "locationId": "obj03-area03-sub00-joma-marsh-part-2",
      "name": "Joma Marsh - Part 2",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 3,
      "objsetHex": "0x03",
      "area": 3,
      "areaHex": "0x03",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0xB280",
        "areaRecordAddress": "0xB7C7",
        "pointerAddress": "0xB7D0",
        "address": "0xB7DA",
        "firstBytes": [
          "0x02",
          "0x03",
          "0x08",
          "0x04",
          "0x0A",
          "0x00",
          "0x02",
          "0xFF"
        ],
        "rawLayoutIndex": "0x02",
        "layoutIndex": "0x02",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj03-area03-sub00-joma-marsh-part-2-day-recipe",
        "label": "Joma Marsh - Part 2, day",
        "status": "projected",
        "statusDetail": "Projected from Camilla Cemetery, day.",
        "evidence": {
          "familyFixture": {
            "id": "camilla-cemetery-day",
            "label": "Camilla Cemetery, day"
          }
        },
        "layoutContext": {
          "objset": "0x03",
          "area": "0x03",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x03",
          "area": "0x03",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x04",
          "0x05"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0xA070",
          "pointerAddress": "0x88ED",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0xB28A",
            "indexListPointerAddress": "0xB296",
            "indexListAddress": "0xB7E4",
            "indexOffset": 0,
            "transferId": "0x2C",
            "auxiliaryTransferId": "0x38",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88ED"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj03-area03-sub00-joma-marsh-part-2-day.png",
      "width": 1024,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 1,
        "renderedColumns": 4,
        "renderedRows": 1,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 3,
          "area": 3,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xB7D0",
          "address": "0xB7DA",
          "firstBytes": [
            "0x02",
            "0x03",
            "0x08",
            "0x04",
            "0x0A",
            "0x00",
            "0x02",
            "0xFF"
          ],
          "rawLayoutIndex": 2,
          "rawLayoutIndexHex": "0x02",
          "layoutIndex": 2,
          "layoutIndexHex": "0x02",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF801",
          "address": "0xB29E"
        },
        "layoutHeader": {
          "pointerAddress": "0xB2A6",
          "address": "0xB802",
          "bank": 2,
          "secondaryAddress": "0xB7F8"
        },
        "tileSet": {
          "pointerAddress": "0xF7DD",
          "address": "0x918A",
          "auxiliaryAddress": "0xF7F2"
        }
      }
    },
    {
      "id": "obj03-area03-sub00-joma-marsh-part-2-night",
      "locationId": "obj03-area03-sub00-joma-marsh-part-2",
      "name": "Joma Marsh - Part 2",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 3,
      "objsetHex": "0x03",
      "area": 3,
      "areaHex": "0x03",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0xB280",
        "areaRecordAddress": "0xB7C7",
        "pointerAddress": "0xB7D0",
        "address": "0xB7DA",
        "firstBytes": [
          "0x02",
          "0x03",
          "0x08",
          "0x04",
          "0x0A",
          "0x00",
          "0x02",
          "0xFF"
        ],
        "rawLayoutIndex": "0x02",
        "layoutIndex": "0x02",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj03-area03-sub00-joma-marsh-part-2-night-recipe",
        "label": "Joma Marsh - Part 2, night",
        "status": "projected",
        "statusDetail": "Projected from Camilla Cemetery, night.",
        "evidence": {
          "familyFixture": {
            "id": "camilla-cemetery-night",
            "label": "Camilla Cemetery, night"
          }
        },
        "layoutContext": {
          "objset": "0x03",
          "area": "0x03",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x03",
          "area": "0x03",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x04",
          "0x05"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "bank": 4,
          "address": "0xA0A3",
          "pointerAddress": "0x890F",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0xB28A",
            "indexListPointerAddress": "0xB298",
            "indexListAddress": "0xB7EE",
            "indexOffset": 0,
            "transferId": "0x3D",
            "auxiliaryTransferId": "0x38",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x890F"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj03-area03-sub00-joma-marsh-part-2-night.png",
      "width": 1024,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 1,
        "renderedColumns": 4,
        "renderedRows": 1,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 3,
          "area": 3,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xB7D0",
          "address": "0xB7DA",
          "firstBytes": [
            "0x02",
            "0x03",
            "0x08",
            "0x04",
            "0x0A",
            "0x00",
            "0x02",
            "0xFF"
          ],
          "rawLayoutIndex": 2,
          "rawLayoutIndexHex": "0x02",
          "layoutIndex": 2,
          "layoutIndexHex": "0x02",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF801",
          "address": "0xB29E"
        },
        "layoutHeader": {
          "pointerAddress": "0xB2A6",
          "address": "0xB802",
          "bank": 2,
          "secondaryAddress": "0xB7F8"
        },
        "tileSet": {
          "pointerAddress": "0xF7DD",
          "address": "0x918A",
          "auxiliaryAddress": "0xF7F2"
        }
      }
    },
    {
      "id": "obj03-area03-sub01-joma-marsh-part-3-fire-and-skulls-day",
      "locationId": "obj03-area03-sub01-joma-marsh-part-3-fire-and-skulls",
      "name": "Joma Marsh - Part 3 (Fire and Skulls)",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 3,
      "objsetHex": "0x03",
      "area": 3,
      "areaHex": "0x03",
      "submap": 1,
      "submapHex": "0x01",
      "screenRecord": {
        "areaTableAddress": "0xB280",
        "areaRecordAddress": "0xB7C7",
        "pointerAddress": "0xB7D2",
        "address": "0xB7DB",
        "firstBytes": [
          "0x03",
          "0x08",
          "0x04",
          "0x0A",
          "0x00",
          "0x02",
          "0xFF",
          "0x00"
        ],
        "rawLayoutIndex": "0x03",
        "layoutIndex": "0x03",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj03-area03-sub01-joma-marsh-part-3-fire-and-skulls-day-recipe",
        "label": "Joma Marsh - Part 3 (Fire and Skulls), day",
        "status": "projected",
        "statusDetail": "Projected from Camilla Cemetery, day.",
        "evidence": {
          "familyFixture": {
            "id": "camilla-cemetery-day",
            "label": "Camilla Cemetery, day"
          }
        },
        "layoutContext": {
          "objset": "0x03",
          "area": "0x03",
          "submap": "0x01"
        },
        "paletteContext": {
          "objset": "0x03",
          "area": "0x03",
          "submap": "0x01"
        },
        "chrBanks": [
          "0x04",
          "0x05"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0xA092",
          "pointerAddress": "0x890D",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0xB28A",
            "indexListPointerAddress": "0xB296",
            "indexListAddress": "0xB7E4",
            "indexOffset": 2,
            "transferId": "0x3C",
            "auxiliaryTransferId": "0x37",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x890D"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj03-area03-sub01-joma-marsh-part-3-fire-and-skulls-day.png",
      "width": 1024,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 1,
        "renderedColumns": 4,
        "renderedRows": 1,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 3,
          "area": 3,
          "submap": 1
        },
        "screenRecord": {
          "pointerAddress": "0xB7D2",
          "address": "0xB7DB",
          "firstBytes": [
            "0x03",
            "0x08",
            "0x04",
            "0x0A",
            "0x00",
            "0x02",
            "0xFF",
            "0x00"
          ],
          "rawLayoutIndex": 3,
          "rawLayoutIndexHex": "0x03",
          "layoutIndex": 3,
          "layoutIndexHex": "0x03",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF801",
          "address": "0xB29E"
        },
        "layoutHeader": {
          "pointerAddress": "0xB2AA",
          "address": "0xB814",
          "bank": 2,
          "secondaryAddress": "0xB801"
        },
        "tileSet": {
          "pointerAddress": "0xF7DD",
          "address": "0x918A",
          "auxiliaryAddress": "0xF7F2"
        }
      }
    },
    {
      "id": "obj03-area03-sub01-joma-marsh-part-3-fire-and-skulls-night",
      "locationId": "obj03-area03-sub01-joma-marsh-part-3-fire-and-skulls",
      "name": "Joma Marsh - Part 3 (Fire and Skulls)",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 3,
      "objsetHex": "0x03",
      "area": 3,
      "areaHex": "0x03",
      "submap": 1,
      "submapHex": "0x01",
      "screenRecord": {
        "areaTableAddress": "0xB280",
        "areaRecordAddress": "0xB7C7",
        "pointerAddress": "0xB7D2",
        "address": "0xB7DB",
        "firstBytes": [
          "0x03",
          "0x08",
          "0x04",
          "0x0A",
          "0x00",
          "0x02",
          "0xFF",
          "0x00"
        ],
        "rawLayoutIndex": "0x03",
        "layoutIndex": "0x03",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj03-area03-sub01-joma-marsh-part-3-fire-and-skulls-night-recipe",
        "label": "Joma Marsh - Part 3 (Fire and Skulls), night",
        "status": "projected",
        "statusDetail": "Projected from Camilla Cemetery, night.",
        "evidence": {
          "familyFixture": {
            "id": "camilla-cemetery-night",
            "label": "Camilla Cemetery, night"
          }
        },
        "layoutContext": {
          "objset": "0x03",
          "area": "0x03",
          "submap": "0x01"
        },
        "paletteContext": {
          "objset": "0x03",
          "area": "0x03",
          "submap": "0x01"
        },
        "chrBanks": [
          "0x04",
          "0x05"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "bank": 4,
          "address": "0xA0A3",
          "pointerAddress": "0x890F",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0xB28A",
            "indexListPointerAddress": "0xB298",
            "indexListAddress": "0xB7EE",
            "indexOffset": 2,
            "transferId": "0x3D",
            "auxiliaryTransferId": "0x37",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x890F"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj03-area03-sub01-joma-marsh-part-3-fire-and-skulls-night.png",
      "width": 1024,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 1,
        "renderedColumns": 4,
        "renderedRows": 1,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 3,
          "area": 3,
          "submap": 1
        },
        "screenRecord": {
          "pointerAddress": "0xB7D2",
          "address": "0xB7DB",
          "firstBytes": [
            "0x03",
            "0x08",
            "0x04",
            "0x0A",
            "0x00",
            "0x02",
            "0xFF",
            "0x00"
          ],
          "rawLayoutIndex": 3,
          "rawLayoutIndexHex": "0x03",
          "layoutIndex": 3,
          "layoutIndexHex": "0x03",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF801",
          "address": "0xB29E"
        },
        "layoutHeader": {
          "pointerAddress": "0xB2AA",
          "address": "0xB814",
          "bank": 2,
          "secondaryAddress": "0xB801"
        },
        "tileSet": {
          "pointerAddress": "0xF7DD",
          "address": "0x918A",
          "auxiliaryAddress": "0xF7F2"
        }
      }
    },
    {
      "id": "obj03-area03-sub02-debious-woods-part-3-day",
      "locationId": "obj03-area03-sub02-debious-woods-part-3",
      "name": "Debious Woods - Part 3",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 3,
      "objsetHex": "0x03",
      "area": 3,
      "areaHex": "0x03",
      "submap": 2,
      "submapHex": "0x02",
      "screenRecord": {
        "areaTableAddress": "0xB280",
        "areaRecordAddress": "0xB7C7",
        "pointerAddress": "0xB7D4",
        "address": "0xB7DC",
        "firstBytes": [
          "0x08",
          "0x04",
          "0x0A",
          "0x00",
          "0x02",
          "0xFF",
          "0x00",
          "0x00"
        ],
        "rawLayoutIndex": "0x08",
        "layoutIndex": "0x08",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj03-area03-sub02-debious-woods-part-3-day-recipe",
        "label": "Debious Woods - Part 3, day",
        "status": "projected",
        "statusDetail": "Projected from Camilla Cemetery, day.",
        "evidence": {
          "familyFixture": {
            "id": "camilla-cemetery-day",
            "label": "Camilla Cemetery, day"
          }
        },
        "layoutContext": {
          "objset": "0x03",
          "area": "0x03",
          "submap": "0x02"
        },
        "paletteContext": {
          "objset": "0x03",
          "area": "0x03",
          "submap": "0x02"
        },
        "chrBanks": [
          "0x04",
          "0x05"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0xA0B4",
          "pointerAddress": "0x8911",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0xB28A",
            "indexListPointerAddress": "0xB296",
            "indexListAddress": "0xB7E4",
            "indexOffset": 4,
            "transferId": "0x3E",
            "auxiliaryTransferId": "0x37",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x8911"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj03-area03-sub02-debious-woods-part-3-day.png",
      "width": 1024,
      "height": 672,
      "layoutSections": [
        0,
        1,
        2
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 3,
        "renderedColumns": 4,
        "renderedRows": 3,
        "totalPointers": 12
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 3,
          "area": 3,
          "submap": 2
        },
        "screenRecord": {
          "pointerAddress": "0xB7D4",
          "address": "0xB7DC",
          "firstBytes": [
            "0x08",
            "0x04",
            "0x0A",
            "0x00",
            "0x02",
            "0xFF",
            "0x00",
            "0x00"
          ],
          "rawLayoutIndex": 8,
          "rawLayoutIndexHex": "0x08",
          "layoutIndex": 8,
          "layoutIndexHex": "0x08",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF801",
          "address": "0xB29E"
        },
        "layoutHeader": {
          "pointerAddress": "0xB2BE",
          "address": "0xB82E",
          "bank": 2,
          "secondaryAddress": "0xB801"
        },
        "tileSet": {
          "pointerAddress": "0xF7DD",
          "address": "0x918A",
          "auxiliaryAddress": "0xF7F2"
        }
      }
    },
    {
      "id": "obj03-area03-sub02-debious-woods-part-3-night",
      "locationId": "obj03-area03-sub02-debious-woods-part-3",
      "name": "Debious Woods - Part 3",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 3,
      "objsetHex": "0x03",
      "area": 3,
      "areaHex": "0x03",
      "submap": 2,
      "submapHex": "0x02",
      "screenRecord": {
        "areaTableAddress": "0xB280",
        "areaRecordAddress": "0xB7C7",
        "pointerAddress": "0xB7D4",
        "address": "0xB7DC",
        "firstBytes": [
          "0x08",
          "0x04",
          "0x0A",
          "0x00",
          "0x02",
          "0xFF",
          "0x00",
          "0x00"
        ],
        "rawLayoutIndex": "0x08",
        "layoutIndex": "0x08",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj03-area03-sub02-debious-woods-part-3-night-recipe",
        "label": "Debious Woods - Part 3, night",
        "status": "projected",
        "statusDetail": "Projected from Camilla Cemetery, night.",
        "evidence": {
          "familyFixture": {
            "id": "camilla-cemetery-night",
            "label": "Camilla Cemetery, night"
          }
        },
        "layoutContext": {
          "objset": "0x03",
          "area": "0x03",
          "submap": "0x02"
        },
        "paletteContext": {
          "objset": "0x03",
          "area": "0x03",
          "submap": "0x02"
        },
        "chrBanks": [
          "0x04",
          "0x05"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "bank": 4,
          "address": "0xA0B4",
          "pointerAddress": "0x8911",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0xB28A",
            "indexListPointerAddress": "0xB298",
            "indexListAddress": "0xB7EE",
            "indexOffset": 4,
            "transferId": "0x3E",
            "auxiliaryTransferId": "0x37",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x8911"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj03-area03-sub02-debious-woods-part-3-night.png",
      "width": 1024,
      "height": 672,
      "layoutSections": [
        0,
        1,
        2
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 3,
        "renderedColumns": 4,
        "renderedRows": 3,
        "totalPointers": 12
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 3,
          "area": 3,
          "submap": 2
        },
        "screenRecord": {
          "pointerAddress": "0xB7D4",
          "address": "0xB7DC",
          "firstBytes": [
            "0x08",
            "0x04",
            "0x0A",
            "0x00",
            "0x02",
            "0xFF",
            "0x00",
            "0x00"
          ],
          "rawLayoutIndex": 8,
          "rawLayoutIndexHex": "0x08",
          "layoutIndex": 8,
          "layoutIndexHex": "0x08",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF801",
          "address": "0xB29E"
        },
        "layoutHeader": {
          "pointerAddress": "0xB2BE",
          "address": "0xB82E",
          "bank": 2,
          "secondaryAddress": "0xB801"
        },
        "tileSet": {
          "pointerAddress": "0xF7DD",
          "address": "0x918A",
          "auxiliaryAddress": "0xF7F2"
        }
      }
    },
    {
      "id": "obj03-area03-sub03-debious-woods-part-2-day",
      "locationId": "obj03-area03-sub03-debious-woods-part-2",
      "name": "Debious Woods - Part 2",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 3,
      "objsetHex": "0x03",
      "area": 3,
      "areaHex": "0x03",
      "submap": 3,
      "submapHex": "0x03",
      "screenRecord": {
        "areaTableAddress": "0xB280",
        "areaRecordAddress": "0xB7C7",
        "pointerAddress": "0xB7D6",
        "address": "0xB7DD",
        "firstBytes": [
          "0x04",
          "0x0A",
          "0x00",
          "0x02",
          "0xFF",
          "0x00",
          "0x00",
          "0x2C"
        ],
        "rawLayoutIndex": "0x04",
        "layoutIndex": "0x04",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj03-area03-sub03-debious-woods-part-2-day-recipe",
        "label": "Debious Woods - Part 2, day",
        "status": "projected",
        "statusDetail": "Projected from Camilla Cemetery, day.",
        "evidence": {
          "familyFixture": {
            "id": "camilla-cemetery-day",
            "label": "Camilla Cemetery, day"
          }
        },
        "layoutContext": {
          "objset": "0x03",
          "area": "0x03",
          "submap": "0x03"
        },
        "paletteContext": {
          "objset": "0x03",
          "area": "0x03",
          "submap": "0x03"
        },
        "chrBanks": [
          "0x04",
          "0x05"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "address": "0xCB04",
          "pointerAddress": "0x88D5",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0xB28A",
            "indexListPointerAddress": "0xB296",
            "indexListAddress": "0xB7E4",
            "indexOffset": 6,
            "transferId": "0x20",
            "auxiliaryTransferId": "0x37",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88D5"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj03-area03-sub03-debious-woods-part-2-day.png",
      "width": 256,
      "height": 448,
      "layoutSections": [
        0,
        1
      ],
      "layoutGrid": {
        "columns": 1,
        "rows": 2,
        "renderedColumns": 1,
        "renderedRows": 2,
        "totalPointers": 2
      },
      "columnGroups": [
        0
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 3,
          "area": 3,
          "submap": 3
        },
        "screenRecord": {
          "pointerAddress": "0xB7D6",
          "address": "0xB7DD",
          "firstBytes": [
            "0x04",
            "0x0A",
            "0x00",
            "0x02",
            "0xFF",
            "0x00",
            "0x00",
            "0x2C"
          ],
          "rawLayoutIndex": 4,
          "rawLayoutIndexHex": "0x04",
          "layoutIndex": 4,
          "layoutIndexHex": "0x04",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF801",
          "address": "0xB29E"
        },
        "layoutHeader": {
          "pointerAddress": "0xB2AE",
          "address": "0xB826",
          "bank": 2,
          "secondaryAddress": "0xB7FD"
        },
        "tileSet": {
          "pointerAddress": "0xF7DD",
          "address": "0x918A",
          "auxiliaryAddress": "0xF7F2"
        }
      }
    },
    {
      "id": "obj03-area03-sub03-debious-woods-part-2-night",
      "locationId": "obj03-area03-sub03-debious-woods-part-2",
      "name": "Debious Woods - Part 2",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 3,
      "objsetHex": "0x03",
      "area": 3,
      "areaHex": "0x03",
      "submap": 3,
      "submapHex": "0x03",
      "screenRecord": {
        "areaTableAddress": "0xB280",
        "areaRecordAddress": "0xB7C7",
        "pointerAddress": "0xB7D6",
        "address": "0xB7DD",
        "firstBytes": [
          "0x04",
          "0x0A",
          "0x00",
          "0x02",
          "0xFF",
          "0x00",
          "0x00",
          "0x2C"
        ],
        "rawLayoutIndex": "0x04",
        "layoutIndex": "0x04",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj03-area03-sub03-debious-woods-part-2-night-recipe",
        "label": "Debious Woods - Part 2, night",
        "status": "projected",
        "statusDetail": "Projected from Camilla Cemetery, night.",
        "evidence": {
          "familyFixture": {
            "id": "camilla-cemetery-night",
            "label": "Camilla Cemetery, night"
          }
        },
        "layoutContext": {
          "objset": "0x03",
          "area": "0x03",
          "submap": "0x03"
        },
        "paletteContext": {
          "objset": "0x03",
          "area": "0x03",
          "submap": "0x03"
        },
        "chrBanks": [
          "0x04",
          "0x05"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "address": "0xCB15",
          "pointerAddress": "0x88D7",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0xB28A",
            "indexListPointerAddress": "0xB298",
            "indexListAddress": "0xB7EE",
            "indexOffset": 6,
            "transferId": "0x21",
            "auxiliaryTransferId": "0x37",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88D7"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj03-area03-sub03-debious-woods-part-2-night.png",
      "width": 256,
      "height": 448,
      "layoutSections": [
        0,
        1
      ],
      "layoutGrid": {
        "columns": 1,
        "rows": 2,
        "renderedColumns": 1,
        "renderedRows": 2,
        "totalPointers": 2
      },
      "columnGroups": [
        0
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 3,
          "area": 3,
          "submap": 3
        },
        "screenRecord": {
          "pointerAddress": "0xB7D6",
          "address": "0xB7DD",
          "firstBytes": [
            "0x04",
            "0x0A",
            "0x00",
            "0x02",
            "0xFF",
            "0x00",
            "0x00",
            "0x2C"
          ],
          "rawLayoutIndex": 4,
          "rawLayoutIndexHex": "0x04",
          "layoutIndex": 4,
          "layoutIndexHex": "0x04",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF801",
          "address": "0xB29E"
        },
        "layoutHeader": {
          "pointerAddress": "0xB2AE",
          "address": "0xB826",
          "bank": 2,
          "secondaryAddress": "0xB7FD"
        },
        "tileSet": {
          "pointerAddress": "0xF7DD",
          "address": "0x918A",
          "auxiliaryAddress": "0xF7F2"
        }
      }
    },
    {
      "id": "obj03-area03-sub04-debious-woods-part-1-day",
      "locationId": "obj03-area03-sub04-debious-woods-part-1",
      "name": "Debious Woods - Part 1",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 3,
      "objsetHex": "0x03",
      "area": 3,
      "areaHex": "0x03",
      "submap": 4,
      "submapHex": "0x04",
      "screenRecord": {
        "areaTableAddress": "0xB280",
        "areaRecordAddress": "0xB7C7",
        "pointerAddress": "0xB7D8",
        "address": "0xB7DE",
        "firstBytes": [
          "0x0A",
          "0x00",
          "0x02",
          "0xFF",
          "0x00",
          "0x00",
          "0x2C",
          "0x38"
        ],
        "rawLayoutIndex": "0x0A",
        "layoutIndex": "0x0A",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj03-area03-sub04-debious-woods-part-1-day-recipe",
        "label": "Debious Woods - Part 1, day",
        "status": "projected",
        "statusDetail": "Projected from Camilla Cemetery, day.",
        "evidence": {
          "familyFixture": {
            "id": "camilla-cemetery-day",
            "label": "Camilla Cemetery, day"
          }
        },
        "layoutContext": {
          "objset": "0x03",
          "area": "0x03",
          "submap": "0x04"
        },
        "paletteContext": {
          "objset": "0x03",
          "area": "0x03",
          "submap": "0x04"
        },
        "chrBanks": [
          "0x04",
          "0x05"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "address": "0xCB04",
          "pointerAddress": "0x88D5",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0xB28A",
            "indexListPointerAddress": "0xB296",
            "indexListAddress": "0xB7E4",
            "indexOffset": 8,
            "transferId": "0x20",
            "auxiliaryTransferId": "0x37",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88D5"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj03-area03-sub04-debious-woods-part-1-day.png",
      "width": 256,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 1,
        "rows": 1,
        "renderedColumns": 1,
        "renderedRows": 1,
        "totalPointers": 1
      },
      "columnGroups": [
        0
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 3,
          "area": 3,
          "submap": 4
        },
        "screenRecord": {
          "pointerAddress": "0xB7D8",
          "address": "0xB7DE",
          "firstBytes": [
            "0x0A",
            "0x00",
            "0x02",
            "0xFF",
            "0x00",
            "0x00",
            "0x2C",
            "0x38"
          ],
          "rawLayoutIndex": 10,
          "rawLayoutIndexHex": "0x0A",
          "layoutIndex": 10,
          "layoutIndexHex": "0x0A",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF801",
          "address": "0xB29E"
        },
        "layoutHeader": {
          "pointerAddress": "0xB2C6",
          "address": "0xB850",
          "bank": 2,
          "secondaryAddress": "0xB801"
        },
        "tileSet": {
          "pointerAddress": "0xF7DD",
          "address": "0x918A",
          "auxiliaryAddress": "0xF7F2"
        }
      }
    },
    {
      "id": "obj03-area03-sub04-debious-woods-part-1-night",
      "locationId": "obj03-area03-sub04-debious-woods-part-1",
      "name": "Debious Woods - Part 1",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 3,
      "objsetHex": "0x03",
      "area": 3,
      "areaHex": "0x03",
      "submap": 4,
      "submapHex": "0x04",
      "screenRecord": {
        "areaTableAddress": "0xB280",
        "areaRecordAddress": "0xB7C7",
        "pointerAddress": "0xB7D8",
        "address": "0xB7DE",
        "firstBytes": [
          "0x0A",
          "0x00",
          "0x02",
          "0xFF",
          "0x00",
          "0x00",
          "0x2C",
          "0x38"
        ],
        "rawLayoutIndex": "0x0A",
        "layoutIndex": "0x0A",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj03-area03-sub04-debious-woods-part-1-night-recipe",
        "label": "Debious Woods - Part 1, night",
        "status": "projected",
        "statusDetail": "Projected from Camilla Cemetery, night.",
        "evidence": {
          "familyFixture": {
            "id": "camilla-cemetery-night",
            "label": "Camilla Cemetery, night"
          }
        },
        "layoutContext": {
          "objset": "0x03",
          "area": "0x03",
          "submap": "0x04"
        },
        "paletteContext": {
          "objset": "0x03",
          "area": "0x03",
          "submap": "0x04"
        },
        "chrBanks": [
          "0x04",
          "0x05"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "address": "0xCB15",
          "pointerAddress": "0x88D7",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0xB28A",
            "indexListPointerAddress": "0xB298",
            "indexListAddress": "0xB7EE",
            "indexOffset": 8,
            "transferId": "0x21",
            "auxiliaryTransferId": "0x37",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88D7"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj03-area03-sub04-debious-woods-part-1-night.png",
      "width": 256,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 1,
        "rows": 1,
        "renderedColumns": 1,
        "renderedRows": 1,
        "totalPointers": 1
      },
      "columnGroups": [
        0
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 3,
          "area": 3,
          "submap": 4
        },
        "screenRecord": {
          "pointerAddress": "0xB7D8",
          "address": "0xB7DE",
          "firstBytes": [
            "0x0A",
            "0x00",
            "0x02",
            "0xFF",
            "0x00",
            "0x00",
            "0x2C",
            "0x38"
          ],
          "rawLayoutIndex": 10,
          "rawLayoutIndexHex": "0x0A",
          "layoutIndex": 10,
          "layoutIndexHex": "0x0A",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF801",
          "address": "0xB29E"
        },
        "layoutHeader": {
          "pointerAddress": "0xB2C6",
          "address": "0xB850",
          "bank": 2,
          "secondaryAddress": "0xB801"
        },
        "tileSet": {
          "pointerAddress": "0xF7DD",
          "address": "0x918A",
          "auxiliaryAddress": "0xF7F2"
        }
      }
    },
    {
      "id": "obj03-area04-sub00-sadam-woods-part-3-day",
      "locationId": "obj03-area04-sub00-sadam-woods-part-3",
      "name": "Sadam Woods - Part 3",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 3,
      "objsetHex": "0x03",
      "area": 4,
      "areaHex": "0x04",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0xB280",
        "areaRecordAddress": "0xB397",
        "pointerAddress": "0xB3A0",
        "address": "0xB3AB",
        "firstBytes": [
          "0x09",
          "0x00",
          "0x00",
          "0x01",
          "0x00",
          "0x02",
          "0x00",
          "0x29"
        ],
        "rawLayoutIndex": "0x09",
        "layoutIndex": "0x09",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj03-area04-sub00-sadam-woods-part-3-day-recipe",
        "label": "Sadam Woods - Part 3, day",
        "status": "projected",
        "statusDetail": "Projected from Camilla Cemetery, day.",
        "evidence": {
          "familyFixture": {
            "id": "camilla-cemetery-day",
            "label": "Camilla Cemetery, day"
          }
        },
        "layoutContext": {
          "objset": "0x03",
          "area": "0x04",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x03",
          "area": "0x04",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x04",
          "0x05"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0xA081",
          "pointerAddress": "0x88EF",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0xB28A",
            "indexListPointerAddress": "0xB29A",
            "indexListAddress": "0xB3BE",
            "indexOffset": 0,
            "transferId": "0x2D",
            "auxiliaryTransferId": "0x36",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88EF"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj03-area04-sub00-sadam-woods-part-3-day.png",
      "width": 512,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 2,
        "rows": 1,
        "renderedColumns": 2,
        "renderedRows": 1,
        "totalPointers": 2
      },
      "columnGroups": [
        0,
        1
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 3,
          "area": 4,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xB3A0",
          "address": "0xB3AB",
          "firstBytes": [
            "0x09",
            "0x00",
            "0x00",
            "0x01",
            "0x00",
            "0x02",
            "0x00",
            "0x29"
          ],
          "rawLayoutIndex": 9,
          "rawLayoutIndexHex": "0x09",
          "layoutIndex": 9,
          "layoutIndexHex": "0x09",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF801",
          "address": "0xB29E"
        },
        "layoutHeader": {
          "pointerAddress": "0xB2C2",
          "address": "0xB43D",
          "bank": 2,
          "secondaryAddress": "0xB3EA"
        },
        "tileSet": {
          "pointerAddress": "0xF7DD",
          "address": "0x918A",
          "auxiliaryAddress": "0xF7F2"
        }
      }
    },
    {
      "id": "obj03-area04-sub00-sadam-woods-part-3-night",
      "locationId": "obj03-area04-sub00-sadam-woods-part-3",
      "name": "Sadam Woods - Part 3",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "night",
      "objset": 3,
      "objsetHex": "0x03",
      "area": 4,
      "areaHex": "0x04",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0xB280",
        "areaRecordAddress": "0xB397",
        "pointerAddress": "0xB3A0",
        "address": "0xB3AB",
        "firstBytes": [
          "0x09",
          "0x00",
          "0x00",
          "0x01",
          "0x00",
          "0x02",
          "0x00",
          "0x29"
        ],
        "rawLayoutIndex": "0x09",
        "layoutIndex": "0x09",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj03-area04-sub00-sadam-woods-part-3-night-recipe",
        "label": "Sadam Woods - Part 3, night",
        "status": "projected",
        "statusDetail": "Projected from Camilla Cemetery, night.",
        "evidence": {
          "familyFixture": {
            "id": "camilla-cemetery-night",
            "label": "Camilla Cemetery, night"
          }
        },
        "layoutContext": {
          "objset": "0x03",
          "area": "0x04",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x03",
          "area": "0x04",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x04",
          "0x05"
        ],
        "palette": {
          "status": "resolved",
          "variant": "night",
          "bank": 4,
          "address": "0xA0A3",
          "pointerAddress": "0x890F",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0xB28A",
            "indexListPointerAddress": "0xB29C",
            "indexListAddress": "0xB3CC",
            "indexOffset": 0,
            "transferId": "0x3D",
            "auxiliaryTransferId": "0x36",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x890F"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj03-area04-sub00-sadam-woods-part-3-night.png",
      "width": 512,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 2,
        "rows": 1,
        "renderedColumns": 2,
        "renderedRows": 1,
        "totalPointers": 2
      },
      "columnGroups": [
        0,
        1
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 3,
          "area": 4,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xB3A0",
          "address": "0xB3AB",
          "firstBytes": [
            "0x09",
            "0x00",
            "0x00",
            "0x01",
            "0x00",
            "0x02",
            "0x00",
            "0x29"
          ],
          "rawLayoutIndex": 9,
          "rawLayoutIndexHex": "0x09",
          "layoutIndex": 9,
          "layoutIndexHex": "0x09",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF801",
          "address": "0xB29E"
        },
        "layoutHeader": {
          "pointerAddress": "0xB2C2",
          "address": "0xB43D",
          "bank": 2,
          "secondaryAddress": "0xB3EA"
        },
        "tileSet": {
          "pointerAddress": "0xF7DD",
          "address": "0x918A",
          "auxiliaryAddress": "0xF7F2"
        }
      }
    },
    {
      "id": "obj04-area00-sub00-vrad-mountain-part-2-diamond-dude-day",
      "locationId": "obj04-area00-sub00-vrad-mountain-part-2-diamond-dude",
      "name": "Vrad Mountain - Part 2 (Diamond Dude)",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 4,
      "objsetHex": "0x04",
      "area": 0,
      "areaHex": "0x00",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0xAE64",
        "areaRecordAddress": "0xAE6C",
        "pointerAddress": "0xAE75",
        "address": "0xAE9E",
        "firstBytes": [
          "0x04",
          "0x05",
          "0x03",
          "0x00",
          "0x01",
          "0x02",
          "0x07",
          "0x00"
        ],
        "rawLayoutIndex": "0x04",
        "layoutIndex": "0x04",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj04-area00-sub00-vrad-mountain-part-2-diamond-dude-day-recipe",
        "label": "Vrad Mountain - Part 2 (Diamond Dude), day",
        "status": "diagnostic",
        "statusDetail": "Objset 4 still needs Vrad/Castlevania Bridge probes.",
        "evidence": {},
        "layoutContext": {
          "objset": "0x04",
          "area": "0x00",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x04",
          "area": "0x00",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x08",
          "0x09"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0xA0E0",
          "pointerAddress": "0x8913",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0xAEAD",
            "indexListPointerAddress": "0xAEAD",
            "indexListAddress": "0xAEBD",
            "indexOffset": 0,
            "transferId": "0x3F",
            "auxiliaryTransferId": "0x44",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x8913"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj04-area00-sub00-vrad-mountain-part-2-diamond-dude-day.png",
      "width": 1024,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 1,
        "renderedColumns": 4,
        "renderedRows": 1,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 4,
          "area": 0,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xAE75",
          "address": "0xAE9E",
          "firstBytes": [
            "0x04",
            "0x05",
            "0x03",
            "0x00",
            "0x01",
            "0x02",
            "0x07",
            "0x00"
          ],
          "rawLayoutIndex": 4,
          "rawLayoutIndexHex": "0x04",
          "layoutIndex": 4,
          "layoutIndexHex": "0x04",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF803",
          "address": "0xAEDD"
        },
        "layoutHeader": {
          "pointerAddress": "0xAEED",
          "address": "0xAF46",
          "bank": 2,
          "secondaryAddress": "0xAEFD"
        },
        "tileSet": {
          "pointerAddress": "0xF7E1",
          "address": "0x9620",
          "auxiliaryAddress": "0xF7F5"
        }
      }
    },
    {
      "id": "obj04-area00-sub01-vrad-mountain-part-1-day",
      "locationId": "obj04-area00-sub01-vrad-mountain-part-1",
      "name": "Vrad Mountain - Part 1",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 4,
      "objsetHex": "0x04",
      "area": 0,
      "areaHex": "0x00",
      "submap": 1,
      "submapHex": "0x01",
      "screenRecord": {
        "areaTableAddress": "0xAE64",
        "areaRecordAddress": "0xAE6C",
        "pointerAddress": "0xAE77",
        "address": "0xAE9F",
        "firstBytes": [
          "0x05",
          "0x03",
          "0x00",
          "0x01",
          "0x02",
          "0x07",
          "0x00",
          "0x00"
        ],
        "rawLayoutIndex": "0x05",
        "layoutIndex": "0x05",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj04-area00-sub01-vrad-mountain-part-1-day-recipe",
        "label": "Vrad Mountain - Part 1, day",
        "status": "diagnostic",
        "statusDetail": "Objset 4 still needs Vrad/Castlevania Bridge probes.",
        "evidence": {},
        "layoutContext": {
          "objset": "0x04",
          "area": "0x00",
          "submap": "0x01"
        },
        "paletteContext": {
          "objset": "0x04",
          "area": "0x00",
          "submap": "0x01"
        },
        "chrBanks": [
          "0x08",
          "0x09"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "address": "0xCAF3",
          "pointerAddress": "0x88D3",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0xAEAD",
            "indexListPointerAddress": "0xAEAD",
            "indexListAddress": "0xAEBD",
            "indexOffset": 2,
            "transferId": "0x1F",
            "auxiliaryTransferId": "0x44",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88D3"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj04-area00-sub01-vrad-mountain-part-1-day.png",
      "width": 1024,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 1,
        "renderedColumns": 4,
        "renderedRows": 1,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 4,
          "area": 0,
          "submap": 1
        },
        "screenRecord": {
          "pointerAddress": "0xAE77",
          "address": "0xAE9F",
          "firstBytes": [
            "0x05",
            "0x03",
            "0x00",
            "0x01",
            "0x02",
            "0x07",
            "0x00",
            "0x00"
          ],
          "rawLayoutIndex": 5,
          "rawLayoutIndexHex": "0x05",
          "layoutIndex": 5,
          "layoutIndexHex": "0x05",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF803",
          "address": "0xAEDD"
        },
        "layoutHeader": {
          "pointerAddress": "0xAEF1",
          "address": "0xAF58",
          "bank": 2,
          "secondaryAddress": "0xAEFD"
        },
        "tileSet": {
          "pointerAddress": "0xF7E1",
          "address": "0x9620",
          "auxiliaryAddress": "0xF7F5"
        }
      }
    },
    {
      "id": "obj04-area01-sub00-deborah-cliff-in-tornado-day",
      "locationId": "obj04-area01-sub00-deborah-cliff-in-tornado",
      "name": "Deborah Cliff (In Tornado)",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 4,
      "objsetHex": "0x04",
      "area": 1,
      "areaHex": "0x01",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0xAE64",
        "areaRecordAddress": "0xAE79",
        "pointerAddress": "0xAE82",
        "address": "0xAEA4",
        "firstBytes": [
          "0x07",
          "0x00",
          "0x00",
          "0x00",
          "0x00",
          "0x02",
          "0x00",
          "0x00"
        ],
        "rawLayoutIndex": "0x07",
        "layoutIndex": "0x07",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj04-area01-sub00-deborah-cliff-in-tornado-day-recipe",
        "label": "Deborah Cliff (In Tornado), day",
        "status": "diagnostic",
        "statusDetail": "Objset 4 still needs Vrad/Castlevania Bridge probes.",
        "evidence": {},
        "layoutContext": {
          "objset": "0x04",
          "area": "0x01",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x04",
          "area": "0x01",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x08",
          "0x09"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0xA0E0",
          "pointerAddress": "0x8913",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0xAEAD",
            "indexListPointerAddress": "0xAEB1",
            "indexListAddress": "0xAEC3",
            "indexOffset": 0,
            "transferId": "0x3F",
            "auxiliaryTransferId": "0x44",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x8913"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj04-area01-sub00-deborah-cliff-in-tornado-day.png",
      "width": 256,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 1,
        "rows": 1,
        "renderedColumns": 1,
        "renderedRows": 1,
        "totalPointers": 1
      },
      "columnGroups": [
        0
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 4,
          "area": 1,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xAE82",
          "address": "0xAEA4",
          "firstBytes": [
            "0x07",
            "0x00",
            "0x00",
            "0x00",
            "0x00",
            "0x02",
            "0x00",
            "0x00"
          ],
          "rawLayoutIndex": 7,
          "rawLayoutIndexHex": "0x07",
          "layoutIndex": 7,
          "layoutIndexHex": "0x07",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF803",
          "address": "0xAEDD"
        },
        "layoutHeader": {
          "pointerAddress": "0xAEF9",
          "address": "0xAF6A",
          "bank": 2,
          "secondaryAddress": "0xAEFD"
        },
        "tileSet": {
          "pointerAddress": "0xF7E1",
          "address": "0x9620",
          "auxiliaryAddress": "0xF7F5"
        }
      }
    },
    {
      "id": "obj04-area01-sub01-jam-wasteland-deborah-cliff-day",
      "locationId": "obj04-area01-sub01-jam-wasteland-deborah-cliff",
      "name": "Jam Wasteland (Deborah Cliff)",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 4,
      "objsetHex": "0x04",
      "area": 1,
      "areaHex": "0x01",
      "submap": 1,
      "submapHex": "0x01",
      "screenRecord": {
        "areaTableAddress": "0xAE64",
        "areaRecordAddress": "0xAE79",
        "pointerAddress": "0xAE84",
        "address": "0xAEA0",
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
        "rawLayoutIndex": "0x03",
        "layoutIndex": "0x03",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj04-area01-sub01-jam-wasteland-deborah-cliff-day-recipe",
        "label": "Jam Wasteland (Deborah Cliff), day",
        "status": "diagnostic",
        "statusDetail": "Objset 4 still needs Vrad/Castlevania Bridge probes.",
        "evidence": {},
        "layoutContext": {
          "objset": "0x04",
          "area": "0x01",
          "submap": "0x01"
        },
        "paletteContext": {
          "objset": "0x04",
          "area": "0x01",
          "submap": "0x01"
        },
        "chrBanks": [
          "0x08",
          "0x09"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0xA0E0",
          "pointerAddress": "0x8913",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0xAEAD",
            "indexListPointerAddress": "0xAEB1",
            "indexListAddress": "0xAEC3",
            "indexOffset": 2,
            "transferId": "0x3F",
            "auxiliaryTransferId": "0x44",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x8913"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj04-area01-sub01-jam-wasteland-deborah-cliff-day.png",
      "width": 1024,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 1,
        "renderedColumns": 4,
        "renderedRows": 1,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 4,
          "area": 1,
          "submap": 1
        },
        "screenRecord": {
          "pointerAddress": "0xAE84",
          "address": "0xAEA0",
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
          "rawLayoutIndex": 3,
          "rawLayoutIndexHex": "0x03",
          "layoutIndex": 3,
          "layoutIndexHex": "0x03",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF803",
          "address": "0xAEDD"
        },
        "layoutHeader": {
          "pointerAddress": "0xAEE9",
          "address": "0xAF34",
          "bank": 2,
          "secondaryAddress": "0xAEFD"
        },
        "tileSet": {
          "pointerAddress": "0xF7E1",
          "address": "0x9620",
          "auxiliaryAddress": "0xF7F5"
        }
      }
    },
    {
      "id": "obj04-area02-sub00-wicked-ditch-day",
      "locationId": "obj04-area02-sub00-wicked-ditch",
      "name": "Wicked Ditch",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 4,
      "objsetHex": "0x04",
      "area": 2,
      "areaHex": "0x02",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0xAE64",
        "areaRecordAddress": "0xAE86",
        "pointerAddress": "0xAE8F",
        "address": "0xAEA1",
        "firstBytes": [
          "0x00",
          "0x01",
          "0x02",
          "0x07",
          "0x00",
          "0x00",
          "0x00",
          "0x00"
        ],
        "rawLayoutIndex": "0x00",
        "layoutIndex": "0x00",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj04-area02-sub00-wicked-ditch-day-recipe",
        "label": "Wicked Ditch, day",
        "status": "diagnostic",
        "statusDetail": "Objset 4 still needs Vrad/Castlevania Bridge probes.",
        "evidence": {},
        "layoutContext": {
          "objset": "0x04",
          "area": "0x02",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x04",
          "area": "0x02",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x08",
          "0x09"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0xA0F1",
          "pointerAddress": "0x8915",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0xAEAD",
            "indexListPointerAddress": "0xAEB5",
            "indexListAddress": "0xAEC7",
            "indexOffset": 0,
            "transferId": "0x40",
            "auxiliaryTransferId": "0x45",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x8915"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj04-area02-sub00-wicked-ditch-day.png",
      "width": 1024,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 1,
        "renderedColumns": 4,
        "renderedRows": 1,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 4,
          "area": 2,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xAE8F",
          "address": "0xAEA1",
          "firstBytes": [
            "0x00",
            "0x01",
            "0x02",
            "0x07",
            "0x00",
            "0x00",
            "0x00",
            "0x00"
          ],
          "rawLayoutIndex": 0,
          "rawLayoutIndexHex": "0x00",
          "layoutIndex": 0,
          "layoutIndexHex": "0x00",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF803",
          "address": "0xAEDD"
        },
        "layoutHeader": {
          "pointerAddress": "0xAEDD",
          "address": "0xAEFE",
          "bank": 2,
          "secondaryAddress": "0xAEFD"
        },
        "tileSet": {
          "pointerAddress": "0xF7E1",
          "address": "0x9620",
          "auxiliaryAddress": "0xF7F5"
        }
      }
    },
    {
      "id": "obj04-area03-sub00-vrad-graveyard-day",
      "locationId": "obj04-area03-sub00-vrad-graveyard",
      "name": "Vrad Graveyard",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 4,
      "objsetHex": "0x04",
      "area": 3,
      "areaHex": "0x03",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0xAE64",
        "areaRecordAddress": "0xAE91",
        "pointerAddress": "0xAE9A",
        "address": "0xAEA2",
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
        "rawLayoutIndex": "0x01",
        "layoutIndex": "0x01",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj04-area03-sub00-vrad-graveyard-day-recipe",
        "label": "Vrad Graveyard, day",
        "status": "diagnostic",
        "statusDetail": "Objset 4 still needs Vrad/Castlevania Bridge probes.",
        "evidence": {},
        "layoutContext": {
          "objset": "0x04",
          "area": "0x03",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x04",
          "area": "0x03",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x08",
          "0x09"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0xA113",
          "pointerAddress": "0x8919",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0xAEAD",
            "indexListPointerAddress": "0xAEB9",
            "indexListAddress": "0xAEC9",
            "indexOffset": 0,
            "transferId": "0x42",
            "auxiliaryTransferId": "0x46",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x8919"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj04-area03-sub00-vrad-graveyard-day.png",
      "width": 1024,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 1,
        "renderedColumns": 4,
        "renderedRows": 1,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 4,
          "area": 3,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xAE9A",
          "address": "0xAEA2",
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
          "rawLayoutIndex": 1,
          "rawLayoutIndexHex": "0x01",
          "layoutIndex": 1,
          "layoutIndexHex": "0x01",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF803",
          "address": "0xAEDD"
        },
        "layoutHeader": {
          "pointerAddress": "0xAEE1",
          "address": "0xAF10",
          "bank": 2,
          "secondaryAddress": "0xAEFD"
        },
        "tileSet": {
          "pointerAddress": "0xF7E1",
          "address": "0x9620",
          "auxiliaryAddress": "0xF7F5"
        }
      }
    },
    {
      "id": "obj04-area03-sub01-castlevania-bridge-day",
      "locationId": "obj04-area03-sub01-castlevania-bridge",
      "name": "Castlevania Bridge",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 4,
      "objsetHex": "0x04",
      "area": 3,
      "areaHex": "0x03",
      "submap": 1,
      "submapHex": "0x01",
      "screenRecord": {
        "areaTableAddress": "0xAE64",
        "areaRecordAddress": "0xAE91",
        "pointerAddress": "0xAE9C",
        "address": "0xAEA3",
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
        "rawLayoutIndex": "0x02",
        "layoutIndex": "0x02",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj04-area03-sub01-castlevania-bridge-day-recipe",
        "label": "Castlevania Bridge, day",
        "status": "diagnostic",
        "statusDetail": "Objset 4 still needs Vrad/Castlevania Bridge probes.",
        "evidence": {},
        "layoutContext": {
          "objset": "0x04",
          "area": "0x03",
          "submap": "0x01"
        },
        "paletteContext": {
          "objset": "0x04",
          "area": "0x03",
          "submap": "0x01"
        },
        "chrBanks": [
          "0x08",
          "0x09"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "address": "0xCB04",
          "pointerAddress": "0x88D5",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0xAEAD",
            "indexListPointerAddress": "0xAEB9",
            "indexListAddress": "0xAEC9",
            "indexOffset": 2,
            "transferId": "0x20",
            "auxiliaryTransferId": "0x46",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88D5"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj04-area03-sub01-castlevania-bridge-day.png",
      "width": 1024,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 1,
        "renderedColumns": 4,
        "renderedRows": 1,
        "totalPointers": 4
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 4,
          "area": 3,
          "submap": 1
        },
        "screenRecord": {
          "pointerAddress": "0xAE9C",
          "address": "0xAEA3",
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
          "rawLayoutIndex": 2,
          "rawLayoutIndexHex": "0x02",
          "layoutIndex": 2,
          "layoutIndexHex": "0x02",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF803",
          "address": "0xAEDD"
        },
        "layoutHeader": {
          "pointerAddress": "0xAEE5",
          "address": "0xAF22",
          "bank": 2,
          "secondaryAddress": "0xAEFD"
        },
        "tileSet": {
          "pointerAddress": "0xF7E1",
          "address": "0x9620",
          "auxiliaryAddress": "0xF7F5"
        }
      }
    },
    {
      "id": "obj05-area00-sub00-castlevania-day",
      "locationId": "obj05-area00-sub00-castlevania",
      "name": "Castlevania",
      "source": "exterior-atlas-candidate",
      "access": "outdoor",
      "variant": "day",
      "objset": 5,
      "objsetHex": "0x05",
      "area": 0,
      "areaHex": "0x00",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0xBC56",
        "areaRecordAddress": "0xBC58",
        "pointerAddress": "0xBC61",
        "address": "0xBC65",
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
        "rawLayoutIndex": "0x00",
        "layoutIndex": "0x00",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj05-area00-sub00-castlevania-day-recipe",
        "label": "Castlevania, day",
        "status": "diagnostic",
        "statusDetail": "Castlevania exterior still needs a representative probe.",
        "evidence": {},
        "layoutContext": {
          "objset": "0x05",
          "area": "0x00",
          "submap": "0x00"
        },
        "paletteContext": {
          "objset": "0x05",
          "area": "0x00",
          "submap": "0x00"
        },
        "chrBanks": [
          "0x06",
          "0x07"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0xA150",
          "pointerAddress": "0x8943",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0xBC4E",
            "indexListPointerAddress": "0xBC4E",
            "indexListAddress": "0xBC52",
            "indexOffset": 0,
            "transferId": "0x57",
            "auxiliaryTransferId": "0x4C",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x8943"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj05-area00-sub00-castlevania-day.png",
      "width": 1024,
      "height": 896,
      "layoutSections": [
        0,
        1,
        2,
        3
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 4,
        "renderedColumns": 4,
        "renderedRows": 4,
        "totalPointers": 16
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 5,
          "area": 0,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xBC61",
          "address": "0xBC65",
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
          "rawLayoutIndex": 0,
          "rawLayoutIndexHex": "0x00",
          "layoutIndex": 0,
          "layoutIndexHex": "0x00",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF805",
          "address": "0xBC46"
        },
        "layoutHeader": {
          "pointerAddress": "0xBC46",
          "address": "0xBC82",
          "bank": 2,
          "secondaryAddress": "0xBC68"
        },
        "tileSet": {
          "pointerAddress": "0xF7E5",
          "address": "0x9A3F",
          "auxiliaryAddress": "0xF7F8"
        }
      }
    },
    {
      "id": "obj00-area08-sub00-jova-thorn-whip-room-day",
      "locationId": "obj00-area08-sub00-jova-thorn-whip-room",
      "name": "Jova - Thorn Whip Room",
      "source": "recipe-audit-interior-probe",
      "access": "town-interior",
      "variant": "day",
      "objset": 0,
      "objsetHex": "0x00",
      "area": 8,
      "areaHex": "0x08",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x8042",
        "areaRecordAddress": "0xFA15",
        "pointerAddress": "0xFA1E",
        "address": "0x800C",
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
        "rawLayoutIndex": "0x07",
        "layoutIndex": "0x07",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj00-area08-sub00-jova-thorn-whip-room-day-recipe",
        "label": "Jova - Thorn Whip Room, day",
        "status": "validated",
        "statusDetail": "Validated by Jova town interior, day.",
        "evidence": {
          "exactFixture": {
            "id": "jova-town-interior-day",
            "label": "Jova town interior, day"
          },
          "familyFixture": {
            "id": "jova-town-interior-day",
            "label": "Jova town interior, day"
          }
        },
        "layoutContext": {
          "objset": "0x00",
          "area": "0x08",
          "submap": "0x00",
          "submapRaw": "0x00",
          "submapFlags": "0x00"
        },
        "paletteContext": {
          "objset": "0x00",
          "area": "0x08",
          "submap": "0x00",
          "submapRaw": "0x00",
          "submapFlags": "0x00"
        },
        "chrBanks": [
          "0x00",
          "0x01"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0x9E91",
          "pointerAddress": "0x88BF",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x8072",
            "indexListPointerAddress": "0x8092",
            "indexListAddress": "0xFA42",
            "indexOffset": 0,
            "transferId": "0x15",
            "auxiliaryTransferId": "0x2E",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88BF"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 8,
        "rowsPerLayoutSection": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj00-area08-sub00-jova-thorn-whip-room-day.png",
      "width": 256,
      "height": 224,
      "layoutSections": [
        0
      ],
      "layoutGrid": {
        "columns": 1,
        "rows": 1,
        "renderedColumns": 1,
        "renderedRows": 1,
        "totalPointers": 1
      },
      "columnGroups": [
        0
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 0,
          "area": 8,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0xFA1E",
          "address": "0x800C",
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
          "rawLayoutIndex": 7,
          "rawLayoutIndexHex": "0x07",
          "layoutIndex": 7,
          "layoutIndexHex": "0x07",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FB",
          "address": "0x80D3"
        },
        "layoutHeader": {
          "pointerAddress": "0x80EF",
          "address": "0x8016",
          "bank": 2,
          "secondaryAddress": "0x8041"
        },
        "tileSet": {
          "pointerAddress": "0xF7D1",
          "address": "0x841D",
          "auxiliaryAddress": "0xF7E9"
        }
      }
    },
    {
      "id": "obj01-area07-sub00-berkeley-mansion-part-1-day",
      "locationId": "obj01-area07-sub00-berkeley-mansion-part-1",
      "name": "Berkeley Mansion - Part 1",
      "source": "recipe-audit-interior-probe",
      "access": "mansion-interior",
      "variant": "day",
      "objset": 1,
      "objsetHex": "0x01",
      "area": 7,
      "areaHex": "0x07",
      "submap": 0,
      "submapHex": "0x00",
      "screenRecord": {
        "areaTableAddress": "0x873C",
        "areaRecordAddress": "0x8D45",
        "pointerAddress": "0x8D4E",
        "address": "0x8D5F",
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
        "rawLayoutIndex": "0x04",
        "layoutIndex": "0x04",
        "layoutIndexSource": "screen-record-byte-0"
      },
      "recipe": {
        "id": "obj01-area07-sub00-berkeley-mansion-part-1-day-recipe",
        "label": "Berkeley Mansion - Part 1, day",
        "status": "validated",
        "statusDetail": "Validated by Berkeley Mansion interior, day.",
        "evidence": {
          "exactFixture": {
            "id": "berkeley-mansion-interior-day",
            "label": "Berkeley Mansion interior, day"
          },
          "familyFixture": {
            "id": "berkeley-mansion-interior-day",
            "label": "Berkeley Mansion interior, day"
          }
        },
        "layoutContext": {
          "objset": "0x01",
          "area": "0x07",
          "submap": "0x00",
          "submapRaw": "0x00",
          "submapFlags": "0x00"
        },
        "paletteContext": {
          "objset": "0x01",
          "area": "0x07",
          "submap": "0x00",
          "submapRaw": "0x00",
          "submapFlags": "0x00"
        },
        "chrBanks": [
          "0x08",
          "0x09"
        ],
        "palette": {
          "status": "resolved",
          "variant": "day",
          "bank": 4,
          "address": "0x9F5E",
          "pointerAddress": "0x88B3",
          "selector": {
            "paletteIndexPointersAddress": "0xF7C5",
            "paletteTableAddress": "0x8762",
            "indexListPointerAddress": "0x877E",
            "indexListAddress": "0x8D65",
            "indexOffset": 0,
            "transferId": "0x0F",
            "auxiliaryTransferId": "0x48",
            "transferPointerTableAddress": "0x8895",
            "transferPointerAddress": "0x88B3"
          }
        },
        "widthBlocks": 8,
        "heightBlocks": 7
      },
      "renderStatus": "rendered",
      "output": "images/obj01-area07-sub00-berkeley-mansion-part-1-day.png",
      "width": 1024,
      "height": 672,
      "layoutSections": [
        0,
        1,
        2
      ],
      "layoutGrid": {
        "columns": 4,
        "rows": 3,
        "renderedColumns": 4,
        "renderedRows": 3,
        "totalPointers": 12
      },
      "columnGroups": [
        0,
        1,
        2,
        3
      ],
      "derivation": {
        "runtimeContext": {
          "objset": 1,
          "area": 7,
          "submap": 0
        },
        "screenRecord": {
          "pointerAddress": "0x8D4E",
          "address": "0x8D5F",
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
          "rawLayoutIndex": 4,
          "rawLayoutIndexHex": "0x04",
          "layoutIndex": 4,
          "layoutIndexHex": "0x04",
          "layoutIndexSource": "screen-record-byte-0"
        },
        "layoutTable": {
          "pointerAddress": "0xF7FD",
          "address": "0x8792"
        },
        "layoutHeader": {
          "pointerAddress": "0x87A2",
          "address": "0x8D99",
          "bank": 2,
          "secondaryAddress": "0x8D6B"
        },
        "tileSet": {
          "pointerAddress": "0xF7D5",
          "address": "0x8891",
          "auxiliaryAddress": "0xF7EC"
        }
      }
    }
  ]
};
