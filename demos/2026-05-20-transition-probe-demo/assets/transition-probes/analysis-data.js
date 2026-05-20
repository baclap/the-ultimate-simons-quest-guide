window.TRANSITION_PROBES = {
  "schemaVersion": 1,
  "source": {
    "fixtureFile": "data/transition-probes.json",
    "script": "tools/mesen/trace-transition.lua",
    "notes": [
      "Transition probes use save states and scripted inputs to observe runtime state changes.",
      "The emulator trace is evidence for decoding ROM behavior; it is not source art for map rendering."
    ]
  },
  "summary": {
    "probes": 2,
    "transitions": 4,
    "completeTransitions": 4,
    "timeoutTransitions": 0,
    "byType": {
      "outdoor-horizontal": 1,
      "outdoor-horizontal-return": 1,
      "interior-exit": 1,
      "interior-entry": 1
    }
  },
  "probes": [
    {
      "id": "jova-woods-left-round-trip",
      "label": "Jova Woods left-edge round trip",
      "location": "Jova Woods",
      "variant": "day",
      "access": "outdoor",
      "state": "/Users/baclap/workspace/castlevania/out/states/jova-woods.mss",
      "reason": "Normal outdoor horizontal boundary transition plus immediate return, with short post-return settle to avoid enemy knockback after re-entering Jova Woods.",
      "output": "/Users/baclap/workspace/castlevania/out/transition-probes/jova-woods-left-round-trip",
      "trace": "/Users/baclap/workspace/castlevania/out/transition-probes/jova-woods-left-round-trip/trace.tsv",
      "status": "complete",
      "totalFrames": 124,
      "stateLoadedFrame": 0,
      "steps": [
        {
          "id": "woods-to-jova",
          "label": "Walk left from Jova Woods into Town of Jova",
          "type": "outdoor-horizontal",
          "input": "left",
          "status": "complete",
          "startFrame": 30,
          "firstTargetFrame": 66,
          "completeFrame": 90,
          "durationFrames": 60,
          "framesToTarget": 36,
          "settleFrames": 24,
          "targetContext": {
            "objset": "0x00",
            "area": "0x00",
            "submap": "0x00"
          },
          "startContext": {
            "objset": "0x02",
            "area": "0x00",
            "submap": "0x00",
            "submapRaw": "0x00",
            "submapFlags": "0x00",
            "actorPointer": "0x9FE4",
            "tileSetPointer": "0x8CF4"
          },
          "targetObservedContext": {
            "objset": "0x00",
            "area": "0x00",
            "submap": "0x00",
            "submapRaw": "0x80",
            "submapFlags": "0x80",
            "actorPointer": "0x9FE4",
            "tileSetPointer": "0x841D"
          },
          "finalContext": {
            "objset": "0x00",
            "area": "0x00",
            "submap": "0x00",
            "submapRaw": "0x80",
            "submapFlags": "0x80",
            "actorPointer": "0x9FE4",
            "tileSetPointer": "0x841D"
          },
          "startPpu": {
            "xScroll": 0,
            "videoRamAddr": "0x3B82",
            "tmpVideoRamAddr": "0x3380",
            "bgPatternAddr": "0x0000",
            "spritePatternAddr": "0x1000"
          },
          "targetPpu": {
            "xScroll": 0,
            "videoRamAddr": "0x0000",
            "tmpVideoRamAddr": "0x0000",
            "bgPatternAddr": "0x0000",
            "spritePatternAddr": "0x1000"
          },
          "finalPpu": {
            "xScroll": 0,
            "videoRamAddr": "0x2000",
            "tmpVideoRamAddr": "0x3740",
            "bgPatternAddr": "0x0000",
            "spritePatternAddr": "0x1000"
          },
          "changedBytes": {
            "count": 345,
            "knownFields": [
              {
                "address": 48,
                "addressHex": "0x0030",
                "before": 2,
                "beforeHex": "0x02",
                "after": 0,
                "afterHex": "0x00",
                "label": "runtimeObjset"
              },
              {
                "address": 81,
                "addressHex": "0x0051",
                "before": 0,
                "beforeHex": "0x00",
                "after": 128,
                "afterHex": "0x80",
                "label": "runtimeSubmapRaw"
              },
              {
                "address": 99,
                "addressHex": "0x0063",
                "before": 244,
                "beforeHex": "0xF4",
                "after": 29,
                "afterHex": "0x1D",
                "label": "runtimeTileSetPointerLow"
              },
              {
                "address": 100,
                "addressHex": "0x0064",
                "before": 140,
                "beforeHex": "0x8C",
                "after": 132,
                "afterHex": "0x84",
                "label": "runtimeTileSetPointerHigh"
              }
            ],
            "zeroPageCandidates": [
              {
                "address": 0,
                "addressHex": "0x0000",
                "before": 96,
                "beforeHex": "0x60",
                "after": 154,
                "afterHex": "0x9A"
              },
              {
                "address": 1,
                "addressHex": "0x0001",
                "before": 0,
                "beforeHex": "0x00",
                "after": 204,
                "afterHex": "0xCC"
              },
              {
                "address": 2,
                "addressHex": "0x0002",
                "before": 0,
                "beforeHex": "0x00",
                "after": 95,
                "afterHex": "0x5F"
              },
              {
                "address": 3,
                "addressHex": "0x0003",
                "before": 0,
                "beforeHex": "0x00",
                "after": 132,
                "afterHex": "0x84"
              },
              {
                "address": 6,
                "addressHex": "0x0006",
                "before": 8,
                "beforeHex": "0x08",
                "after": 248,
                "afterHex": "0xF8"
              },
              {
                "address": 7,
                "addressHex": "0x0007",
                "before": 0,
                "beforeHex": "0x00",
                "after": 45,
                "afterHex": "0x2D"
              },
              {
                "address": 8,
                "addressHex": "0x0008",
                "before": 0,
                "beforeHex": "0x00",
                "after": 2,
                "afterHex": "0x02"
              },
              {
                "address": 9,
                "addressHex": "0x0009",
                "before": 221,
                "beforeHex": "0xDD",
                "after": 113,
                "afterHex": "0x71"
              },
              {
                "address": 10,
                "addressHex": "0x000A",
                "before": 225,
                "beforeHex": "0xE1",
                "after": 255,
                "afterHex": "0xFF"
              },
              {
                "address": 11,
                "addressHex": "0x000B",
                "before": 5,
                "beforeHex": "0x05",
                "after": 6,
                "afterHex": "0x06"
              },
              {
                "address": 12,
                "addressHex": "0x000C",
                "before": 2,
                "beforeHex": "0x02",
                "after": 7,
                "afterHex": "0x07"
              },
              {
                "address": 13,
                "addressHex": "0x000D",
                "before": 97,
                "beforeHex": "0x61",
                "after": 63,
                "afterHex": "0x3F"
              },
              {
                "address": 15,
                "addressHex": "0x000F",
                "before": 132,
                "beforeHex": "0x84",
                "after": 136,
                "afterHex": "0x88"
              },
              {
                "address": 16,
                "addressHex": "0x0010",
                "before": 0,
                "beforeHex": "0x00",
                "after": 2,
                "afterHex": "0x02"
              },
              {
                "address": 17,
                "addressHex": "0x0011",
                "before": 55,
                "beforeHex": "0x37",
                "after": 0,
                "afterHex": "0x00"
              },
              {
                "address": 18,
                "addressHex": "0x0012",
                "before": 16,
                "beforeHex": "0x10",
                "after": 1,
                "afterHex": "0x01"
              },
              {
                "address": 19,
                "addressHex": "0x0013",
                "before": 1,
                "beforeHex": "0x01",
                "after": 7,
                "afterHex": "0x07"
              },
              {
                "address": 20,
                "addressHex": "0x0014",
                "before": 0,
                "beforeHex": "0x00",
                "after": 3,
                "afterHex": "0x03"
              },
              {
                "address": 22,
                "addressHex": "0x0016",
                "before": 72,
                "beforeHex": "0x48",
                "after": 113,
                "afterHex": "0x71"
              },
              {
                "address": 23,
                "addressHex": "0x0017",
                "before": 0,
                "beforeHex": "0x00",
                "after": 136,
                "afterHex": "0x88"
              },
              {
                "address": 28,
                "addressHex": "0x001C",
                "before": 1,
                "beforeHex": "0x01",
                "after": 4,
                "afterHex": "0x04"
              },
              {
                "address": 29,
                "addressHex": "0x001D",
                "before": 217,
                "beforeHex": "0xD9",
                "after": 21,
                "afterHex": "0x15"
              },
              {
                "address": 33,
                "addressHex": "0x0021",
                "before": 0,
                "beforeHex": "0x00",
                "after": 5,
                "afterHex": "0x05"
              },
              {
                "address": 34,
                "addressHex": "0x0022",
                "before": 1,
                "beforeHex": "0x01",
                "after": 133,
                "afterHex": "0x85"
              },
              {
                "address": 36,
                "addressHex": "0x0024",
                "before": 255,
                "beforeHex": "0xFF",
                "after": 0,
                "afterHex": "0x00"
              },
              {
                "address": 44,
                "addressHex": "0x002C",
                "before": 3,
                "beforeHex": "0x03",
                "after": 2,
                "afterHex": "0x02"
              },
              {
                "address": 45,
                "addressHex": "0x002D",
                "before": 100,
                "beforeHex": "0x64",
                "after": 112,
                "afterHex": "0x70"
              },
              {
                "address": 46,
                "addressHex": "0x002E",
                "before": 54,
                "beforeHex": "0x36",
                "after": 191,
                "afterHex": "0xBF"
              },
              {
                "address": 84,
                "addressHex": "0x0054",
                "before": 0,
                "beforeHex": "0x00",
                "after": 3,
                "afterHex": "0x03"
              },
              {
                "address": 87,
                "addressHex": "0x0057",
                "before": 0,
                "beforeHex": "0x00",
                "after": 1,
                "afterHex": "0x01"
              },
              {
                "address": 88,
                "addressHex": "0x0058",
                "before": 252,
                "beforeHex": "0xFC",
                "after": 32,
                "afterHex": "0x20"
              },
              {
                "address": 89,
                "addressHex": "0x0059",
                "before": 11,
                "beforeHex": "0x0B",
                "after": 35,
                "afterHex": "0x23"
              },
              {
                "address": 90,
                "addressHex": "0x005A",
                "before": 0,
                "beforeHex": "0x00",
                "after": 30,
                "afterHex": "0x1E"
              },
              {
                "address": 91,
                "addressHex": "0x005B",
                "before": 0,
                "beforeHex": "0x00",
                "after": 30,
                "afterHex": "0x1E"
              },
              {
                "address": 92,
                "addressHex": "0x005C",
                "before": 255,
                "beforeHex": "0xFF",
                "after": 27,
                "afterHex": "0x1B"
              },
              {
                "address": 93,
                "addressHex": "0x005D",
                "before": 28,
                "beforeHex": "0x1C",
                "after": 56,
                "afterHex": "0x38"
              },
              {
                "address": 94,
                "addressHex": "0x005E",
                "before": 6,
                "beforeHex": "0x06",
                "after": 220,
                "afterHex": "0xDC"
              },
              {
                "address": 95,
                "addressHex": "0x005F",
                "before": 35,
                "beforeHex": "0x23",
                "after": 39,
                "afterHex": "0x27"
              },
              {
                "address": 96,
                "addressHex": "0x0060",
                "before": 248,
                "beforeHex": "0xF8",
                "after": 7,
                "afterHex": "0x07"
              },
              {
                "address": 97,
                "addressHex": "0x0061",
                "before": 35,
                "beforeHex": "0x23",
                "after": 39,
                "afterHex": "0x27"
              },
              {
                "address": 98,
                "addressHex": "0x0062",
                "before": 0,
                "beforeHex": "0x00",
                "after": 65,
                "afterHex": "0x41"
              },
              {
                "address": 101,
                "addressHex": "0x0065",
                "before": 16,
                "beforeHex": "0x10",
                "after": 12,
                "afterHex": "0x0C"
              },
              {
                "address": 102,
                "addressHex": "0x0066",
                "before": 252,
                "beforeHex": "0xFC",
                "after": 0,
                "afterHex": "0x00"
              },
              {
                "address": 103,
                "addressHex": "0x0067",
                "before": 0,
                "beforeHex": "0x00",
                "after": 130,
                "afterHex": "0x82"
              },
              {
                "address": 106,
                "addressHex": "0x006A",
                "before": 24,
                "beforeHex": "0x18",
                "after": 30,
                "afterHex": "0x1E"
              },
              {
                "address": 109,
                "addressHex": "0x006D",
                "before": 0,
                "beforeHex": "0x00",
                "after": 255,
                "afterHex": "0xFF"
              },
              {
                "address": 110,
                "addressHex": "0x006E",
                "before": 239,
                "beforeHex": "0xEF",
                "after": 233,
                "afterHex": "0xE9"
              },
              {
                "address": 112,
                "addressHex": "0x0070",
                "before": 62,
                "beforeHex": "0x3E",
                "after": 134,
                "afterHex": "0x86"
              },
              {
                "address": 113,
                "addressHex": "0x0071",
                "before": 162,
                "beforeHex": "0xA2",
                "after": 250,
                "afterHex": "0xFA"
              },
              {
                "address": 114,
                "addressHex": "0x0072",
                "before": 33,
                "beforeHex": "0x21",
                "after": 80,
                "afterHex": "0x50"
              },
              {
                "address": 115,
                "addressHex": "0x0073",
                "before": 162,
                "beforeHex": "0xA2",
                "after": 250,
                "afterHex": "0xFA"
              },
              {
                "address": 132,
                "addressHex": "0x0084",
                "before": 1,
                "beforeHex": "0x01",
                "after": 5,
                "afterHex": "0x05"
              },
              {
                "address": 133,
                "addressHex": "0x0085",
                "before": 86,
                "beforeHex": "0x56",
                "after": 88,
                "afterHex": "0x58"
              },
              {
                "address": 137,
                "addressHex": "0x0089",
                "before": 255,
                "beforeHex": "0xFF",
                "after": 1,
                "afterHex": "0x01"
              },
              {
                "address": 143,
                "addressHex": "0x008F",
                "before": 65,
                "beforeHex": "0x41",
                "after": 0,
                "afterHex": "0x00"
              },
              {
                "address": 147,
                "addressHex": "0x0093",
                "before": 248,
                "beforeHex": "0xF8",
                "after": 2,
                "afterHex": "0x02"
              },
              {
                "address": 148,
                "addressHex": "0x0094",
                "before": 0,
                "beforeHex": "0x00",
                "after": 10,
                "afterHex": "0x0A"
              },
              {
                "address": 149,
                "addressHex": "0x0095",
                "before": 28,
                "beforeHex": "0x1C",
                "after": 48,
                "afterHex": "0x30"
              },
              {
                "address": 151,
                "addressHex": "0x0097",
                "before": 3,
                "beforeHex": "0x03",
                "after": 8,
                "afterHex": "0x08"
              },
              {
                "address": 155,
                "addressHex": "0x009B",
                "before": 26,
                "beforeHex": "0x1A",
                "after": 161,
                "afterHex": "0xA1"
              },
              {
                "address": 156,
                "addressHex": "0x009C",
                "before": 10,
                "beforeHex": "0x0A",
                "after": 8,
                "afterHex": "0x08"
              },
              {
                "address": 161,
                "addressHex": "0x00A1",
                "before": 21,
                "beforeHex": "0x15",
                "after": 27,
                "afterHex": "0x1B"
              },
              {
                "address": 165,
                "addressHex": "0x00A5",
                "before": 0,
                "beforeHex": "0x00",
                "after": 1,
                "afterHex": "0x01"
              },
              {
                "address": 167,
                "addressHex": "0x00A7",
                "before": 95,
                "beforeHex": "0x5F",
                "after": 100,
                "afterHex": "0x64"
              }
            ]
          },
          "snapshots": {
            "beforeCpu": "woods-to-jova-before-cpu-0000-07ff.bin",
            "afterCpu": "woods-to-jova-after-cpu-0000-07ff.bin"
          }
        },
        {
          "id": "jova-to-woods",
          "label": "Walk right from Town of Jova back into Jova Woods",
          "type": "outdoor-horizontal-return",
          "input": "right",
          "status": "complete",
          "startFrame": 90,
          "firstTargetFrame": 111,
          "completeFrame": 123,
          "durationFrames": 33,
          "framesToTarget": 21,
          "settleFrames": 12,
          "targetContext": {
            "objset": "0x02",
            "area": "0x00",
            "submap": "0x00"
          },
          "startContext": {
            "objset": "0x00",
            "area": "0x00",
            "submap": "0x00",
            "submapRaw": "0x80",
            "submapFlags": "0x80",
            "actorPointer": "0x9FE4",
            "tileSetPointer": "0x841D"
          },
          "targetObservedContext": {
            "objset": "0x02",
            "area": "0x00",
            "submap": "0x00",
            "submapRaw": "0x00",
            "submapFlags": "0x00",
            "actorPointer": "0x90AC",
            "tileSetPointer": "0x8CF4"
          },
          "finalContext": {
            "objset": "0x02",
            "area": "0x00",
            "submap": "0x00",
            "submapRaw": "0x00",
            "submapFlags": "0x00",
            "actorPointer": "0x90AC",
            "tileSetPointer": "0x8CF4"
          },
          "startPpu": {
            "xScroll": 0,
            "videoRamAddr": "0x2000",
            "tmpVideoRamAddr": "0x3740",
            "bgPatternAddr": "0x0000",
            "spritePatternAddr": "0x1000"
          },
          "targetPpu": {
            "xScroll": 0,
            "videoRamAddr": "0x0000",
            "tmpVideoRamAddr": "0x0000",
            "bgPatternAddr": "0x0000",
            "spritePatternAddr": "0x1000"
          },
          "finalPpu": {
            "xScroll": 0,
            "videoRamAddr": "0x2000",
            "tmpVideoRamAddr": "0x3380",
            "bgPatternAddr": "0x0000",
            "spritePatternAddr": "0x1000"
          },
          "changedBytes": {
            "count": 497,
            "knownFields": [
              {
                "address": 48,
                "addressHex": "0x0030",
                "before": 0,
                "beforeHex": "0x00",
                "after": 2,
                "afterHex": "0x02",
                "label": "runtimeObjset"
              },
              {
                "address": 61,
                "addressHex": "0x003D",
                "before": 228,
                "beforeHex": "0xE4",
                "after": 172,
                "afterHex": "0xAC",
                "label": "runtimeActorPointerLow"
              },
              {
                "address": 62,
                "addressHex": "0x003E",
                "before": 159,
                "beforeHex": "0x9F",
                "after": 144,
                "afterHex": "0x90",
                "label": "runtimeActorPointerHigh"
              },
              {
                "address": 81,
                "addressHex": "0x0051",
                "before": 128,
                "beforeHex": "0x80",
                "after": 0,
                "afterHex": "0x00",
                "label": "runtimeSubmapRaw"
              },
              {
                "address": 99,
                "addressHex": "0x0063",
                "before": 29,
                "beforeHex": "0x1D",
                "after": 244,
                "afterHex": "0xF4",
                "label": "runtimeTileSetPointerLow"
              },
              {
                "address": 100,
                "addressHex": "0x0064",
                "before": 132,
                "beforeHex": "0x84",
                "after": 140,
                "afterHex": "0x8C",
                "label": "runtimeTileSetPointerHigh"
              }
            ],
            "zeroPageCandidates": [
              {
                "address": 2,
                "addressHex": "0x0002",
                "before": 95,
                "beforeHex": "0x5F",
                "after": 7,
                "afterHex": "0x07"
              },
              {
                "address": 3,
                "addressHex": "0x0003",
                "before": 132,
                "beforeHex": "0x84",
                "after": 248,
                "afterHex": "0xF8"
              },
              {
                "address": 4,
                "addressHex": "0x0004",
                "before": 2,
                "beforeHex": "0x02",
                "after": 1,
                "afterHex": "0x01"
              },
              {
                "address": 6,
                "addressHex": "0x0006",
                "before": 248,
                "beforeHex": "0xF8",
                "after": 8,
                "afterHex": "0x08"
              },
              {
                "address": 7,
                "addressHex": "0x0007",
                "before": 45,
                "beforeHex": "0x2D",
                "after": 41,
                "afterHex": "0x29"
              },
              {
                "address": 8,
                "addressHex": "0x0008",
                "before": 2,
                "beforeHex": "0x02",
                "after": 80,
                "afterHex": "0x50"
              },
              {
                "address": 9,
                "addressHex": "0x0009",
                "before": 113,
                "beforeHex": "0x71",
                "after": 58,
                "afterHex": "0x3A"
              },
              {
                "address": 10,
                "addressHex": "0x000A",
                "before": 255,
                "beforeHex": "0xFF",
                "after": 1,
                "afterHex": "0x01"
              },
              {
                "address": 13,
                "addressHex": "0x000D",
                "before": 63,
                "beforeHex": "0x3F",
                "after": 3,
                "afterHex": "0x03"
              },
              {
                "address": 14,
                "addressHex": "0x000E",
                "before": 177,
                "beforeHex": "0xB1",
                "after": 178,
                "afterHex": "0xB2"
              },
              {
                "address": 15,
                "addressHex": "0x000F",
                "before": 136,
                "beforeHex": "0x88",
                "after": 141,
                "afterHex": "0x8D"
              },
              {
                "address": 16,
                "addressHex": "0x0010",
                "before": 2,
                "beforeHex": "0x02",
                "after": 1,
                "afterHex": "0x01"
              },
              {
                "address": 19,
                "addressHex": "0x0013",
                "before": 7,
                "beforeHex": "0x07",
                "after": 1,
                "afterHex": "0x01"
              },
              {
                "address": 20,
                "addressHex": "0x0014",
                "before": 3,
                "beforeHex": "0x03",
                "after": 0,
                "afterHex": "0x00"
              },
              {
                "address": 22,
                "addressHex": "0x0016",
                "before": 113,
                "beforeHex": "0x71",
                "after": 58,
                "afterHex": "0x3A"
              },
              {
                "address": 23,
                "addressHex": "0x0017",
                "before": 136,
                "beforeHex": "0x88",
                "after": 141,
                "afterHex": "0x8D"
              },
              {
                "address": 29,
                "addressHex": "0x001D",
                "before": 21,
                "beforeHex": "0x15",
                "after": 52,
                "afterHex": "0x34"
              },
              {
                "address": 34,
                "addressHex": "0x0022",
                "before": 133,
                "beforeHex": "0x85",
                "after": 120,
                "afterHex": "0x78"
              },
              {
                "address": 45,
                "addressHex": "0x002D",
                "before": 112,
                "beforeHex": "0x70",
                "after": 220,
                "afterHex": "0xDC"
              },
              {
                "address": 46,
                "addressHex": "0x002E",
                "before": 191,
                "beforeHex": "0xBF",
                "after": 10,
                "afterHex": "0x0A"
              },
              {
                "address": 57,
                "addressHex": "0x0039",
                "before": 0,
                "beforeHex": "0x00",
                "after": 48,
                "afterHex": "0x30"
              },
              {
                "address": 59,
                "addressHex": "0x003B",
                "before": 0,
                "beforeHex": "0x00",
                "after": 14,
                "afterHex": "0x0E"
              },
              {
                "address": 84,
                "addressHex": "0x0054",
                "before": 3,
                "beforeHex": "0x03",
                "after": 0,
                "afterHex": "0x00"
              },
              {
                "address": 87,
                "addressHex": "0x0057",
                "before": 1,
                "beforeHex": "0x01",
                "after": 0,
                "afterHex": "0x00"
              },
              {
                "address": 88,
                "addressHex": "0x0058",
                "before": 32,
                "beforeHex": "0x20",
                "after": 2,
                "afterHex": "0x02"
              },
              {
                "address": 89,
                "addressHex": "0x0059",
                "before": 35,
                "beforeHex": "0x23",
                "after": 11,
                "afterHex": "0x0B"
              },
              {
                "address": 90,
                "addressHex": "0x005A",
                "before": 30,
                "beforeHex": "0x1E",
                "after": 0,
                "afterHex": "0x00"
              },
              {
                "address": 91,
                "addressHex": "0x005B",
                "before": 30,
                "beforeHex": "0x1E",
                "after": 0,
                "afterHex": "0x00"
              },
              {
                "address": 92,
                "addressHex": "0x005C",
                "before": 27,
                "beforeHex": "0x1B",
                "after": 255,
                "afterHex": "0xFF"
              },
              {
                "address": 93,
                "addressHex": "0x005D",
                "before": 56,
                "beforeHex": "0x38",
                "after": 28,
                "afterHex": "0x1C"
              },
              {
                "address": 94,
                "addressHex": "0x005E",
                "before": 220,
                "beforeHex": "0xDC",
                "after": 164,
                "afterHex": "0xA4"
              },
              {
                "address": 95,
                "addressHex": "0x005F",
                "before": 39,
                "beforeHex": "0x27",
                "after": 35,
                "afterHex": "0x23"
              },
              {
                "address": 96,
                "addressHex": "0x0060",
                "before": 7,
                "beforeHex": "0x07",
                "after": 249,
                "afterHex": "0xF9"
              },
              {
                "address": 97,
                "addressHex": "0x0061",
                "before": 39,
                "beforeHex": "0x27",
                "after": 35,
                "afterHex": "0x23"
              },
              {
                "address": 98,
                "addressHex": "0x0062",
                "before": 65,
                "beforeHex": "0x41",
                "after": 0,
                "afterHex": "0x00"
              },
              {
                "address": 101,
                "addressHex": "0x0065",
                "before": 12,
                "beforeHex": "0x0C",
                "after": 6,
                "afterHex": "0x06"
              },
              {
                "address": 103,
                "addressHex": "0x0067",
                "before": 130,
                "beforeHex": "0x82",
                "after": 129,
                "afterHex": "0x81"
              },
              {
                "address": 105,
                "addressHex": "0x0069",
                "before": 255,
                "beforeHex": "0xFF",
                "after": 27,
                "afterHex": "0x1B"
              },
              {
                "address": 106,
                "addressHex": "0x006A",
                "before": 30,
                "beforeHex": "0x1E",
                "after": 0,
                "afterHex": "0x00"
              },
              {
                "address": 109,
                "addressHex": "0x006D",
                "before": 255,
                "beforeHex": "0xFF",
                "after": 1,
                "afterHex": "0x01"
              },
              {
                "address": 110,
                "addressHex": "0x006E",
                "before": 233,
                "beforeHex": "0xE9",
                "after": 239,
                "afterHex": "0xEF"
              },
              {
                "address": 112,
                "addressHex": "0x0070",
                "before": 134,
                "beforeHex": "0x86",
                "after": 62,
                "afterHex": "0x3E"
              },
              {
                "address": 113,
                "addressHex": "0x0071",
                "before": 250,
                "beforeHex": "0xFA",
                "after": 162,
                "afterHex": "0xA2"
              },
              {
                "address": 114,
                "addressHex": "0x0072",
                "before": 80,
                "beforeHex": "0x50",
                "after": 33,
                "afterHex": "0x21"
              },
              {
                "address": 115,
                "addressHex": "0x0073",
                "before": 250,
                "beforeHex": "0xFA",
                "after": 162,
                "afterHex": "0xA2"
              },
              {
                "address": 118,
                "addressHex": "0x0076",
                "before": 0,
                "beforeHex": "0x00",
                "after": 1,
                "afterHex": "0x01"
              },
              {
                "address": 132,
                "addressHex": "0x0084",
                "before": 5,
                "beforeHex": "0x05",
                "after": 14,
                "afterHex": "0x0E"
              },
              {
                "address": 137,
                "addressHex": "0x0089",
                "before": 1,
                "beforeHex": "0x01",
                "after": 255,
                "afterHex": "0xFF"
              },
              {
                "address": 140,
                "addressHex": "0x008C",
                "before": 0,
                "beforeHex": "0x00",
                "after": 224,
                "afterHex": "0xE0"
              },
              {
                "address": 143,
                "addressHex": "0x008F",
                "before": 0,
                "beforeHex": "0x00",
                "after": 65,
                "afterHex": "0x41"
              },
              {
                "address": 147,
                "addressHex": "0x0093",
                "before": 2,
                "beforeHex": "0x02",
                "after": 0,
                "afterHex": "0x00"
              },
              {
                "address": 148,
                "addressHex": "0x0094",
                "before": 10,
                "beforeHex": "0x0A",
                "after": 0,
                "afterHex": "0x00"
              },
              {
                "address": 149,
                "addressHex": "0x0095",
                "before": 48,
                "beforeHex": "0x30",
                "after": 32,
                "afterHex": "0x20"
              },
              {
                "address": 151,
                "addressHex": "0x0097",
                "before": 8,
                "beforeHex": "0x08",
                "after": 4,
                "afterHex": "0x04"
              },
              {
                "address": 153,
                "addressHex": "0x0099",
                "before": 116,
                "beforeHex": "0x74",
                "after": 115,
                "afterHex": "0x73"
              },
              {
                "address": 155,
                "addressHex": "0x009B",
                "before": 161,
                "beforeHex": "0xA1",
                "after": 1,
                "afterHex": "0x01"
              },
              {
                "address": 157,
                "addressHex": "0x009D",
                "before": 151,
                "beforeHex": "0x97",
                "after": 138,
                "afterHex": "0x8A"
              },
              {
                "address": 161,
                "addressHex": "0x00A1",
                "before": 27,
                "beforeHex": "0x1B",
                "after": 110,
                "afterHex": "0x6E"
              },
              {
                "address": 162,
                "addressHex": "0x00A2",
                "before": 150,
                "beforeHex": "0x96",
                "after": 145,
                "afterHex": "0x91"
              },
              {
                "address": 163,
                "addressHex": "0x00A3",
                "before": 64,
                "beforeHex": "0x40",
                "after": 61,
                "afterHex": "0x3D"
              },
              {
                "address": 165,
                "addressHex": "0x00A5",
                "before": 1,
                "beforeHex": "0x01",
                "after": 0,
                "afterHex": "0x00"
              },
              {
                "address": 167,
                "addressHex": "0x00A7",
                "before": 100,
                "beforeHex": "0x64",
                "after": 210,
                "afterHex": "0xD2"
              },
              {
                "address": 168,
                "addressHex": "0x00A8",
                "before": 157,
                "beforeHex": "0x9D",
                "after": 151,
                "afterHex": "0x97"
              },
              {
                "address": 169,
                "addressHex": "0x00A9",
                "before": 98,
                "beforeHex": "0x62",
                "after": 131,
                "afterHex": "0x83"
              }
            ]
          },
          "snapshots": {
            "beforeCpu": "jova-to-woods-before-cpu-0000-07ff.bin",
            "afterCpu": "jova-to-woods-after-cpu-0000-07ff.bin"
          }
        }
      ],
      "mesen": {
        "status": 0,
        "durationMs": 558,
        "outputs": [
          "/Users/baclap/workspace/castlevania/out/transition-probes/jova-woods-left-round-trip/jova-to-woods-after-cpu-0000-07ff.bin",
          "/Users/baclap/workspace/castlevania/out/transition-probes/jova-woods-left-round-trip/jova-to-woods-before-cpu-0000-07ff.bin",
          "/Users/baclap/workspace/castlevania/out/transition-probes/jova-woods-left-round-trip/probe-start-cpu-0000-07ff.bin",
          "/Users/baclap/workspace/castlevania/out/transition-probes/jova-woods-left-round-trip/summary.json",
          "/Users/baclap/workspace/castlevania/out/transition-probes/jova-woods-left-round-trip/trace.tsv",
          "/Users/baclap/workspace/castlevania/out/transition-probes/jova-woods-left-round-trip/woods-to-jova-after-cpu-0000-07ff.bin",
          "/Users/baclap/workspace/castlevania/out/transition-probes/jova-woods-left-round-trip/woods-to-jova-before-cpu-0000-07ff.bin"
        ]
      }
    },
    {
      "id": "doina-church-round-trip",
      "label": "Doina church interior round trip",
      "location": "Town of Doina church interior",
      "variant": "day",
      "access": "town-interior",
      "state": "/Users/baclap/workspace/castlevania/out/states/doina-church-interior-day.mss",
      "reason": "Interior exit by walking left, then exterior re-entry by pressing up at the door.",
      "output": "/Users/baclap/workspace/castlevania/out/transition-probes/doina-church-round-trip",
      "trace": "/Users/baclap/workspace/castlevania/out/transition-probes/doina-church-round-trip/trace.tsv",
      "status": "complete",
      "totalFrames": 99,
      "stateLoadedFrame": 0,
      "steps": [
        {
          "id": "church-to-doina",
          "label": "Walk left from Doina church to Town of Doina",
          "type": "interior-exit",
          "input": "left",
          "status": "complete",
          "startFrame": 30,
          "firstTargetFrame": 34,
          "completeFrame": 64,
          "durationFrames": 34,
          "framesToTarget": 4,
          "settleFrames": 30,
          "targetContext": {
            "objset": "0x00",
            "area": "0x05",
            "submap": "0x00"
          },
          "startContext": {
            "objset": "0x00",
            "area": "0x07",
            "submap": "0x00",
            "submapRaw": "0x00",
            "submapFlags": "0x00",
            "actorPointer": "0x8EDD",
            "tileSetPointer": "0x841D"
          },
          "targetObservedContext": {
            "objset": "0x00",
            "area": "0x05",
            "submap": "0x00",
            "submapRaw": "0x00",
            "submapFlags": "0x00",
            "actorPointer": "0x8EDD",
            "tileSetPointer": "0x841D"
          },
          "finalContext": {
            "objset": "0x00",
            "area": "0x05",
            "submap": "0x00",
            "submapRaw": "0x00",
            "submapFlags": "0x00",
            "actorPointer": "0x8EDD",
            "tileSetPointer": "0x841D"
          },
          "startPpu": {
            "xScroll": 0,
            "videoRamAddr": "0x3B82",
            "tmpVideoRamAddr": "0x3380",
            "bgPatternAddr": "0x0000",
            "spritePatternAddr": "0x1000"
          },
          "targetPpu": {
            "xScroll": 0,
            "videoRamAddr": "0x0000",
            "tmpVideoRamAddr": "0x0000",
            "bgPatternAddr": "0x0000",
            "spritePatternAddr": "0x1000"
          },
          "finalPpu": {
            "xScroll": 2,
            "videoRamAddr": "0x2000",
            "tmpVideoRamAddr": "0x379E",
            "bgPatternAddr": "0x0000",
            "spritePatternAddr": "0x1000"
          },
          "changedBytes": {
            "count": 386,
            "knownFields": [
              {
                "address": 80,
                "addressHex": "0x0050",
                "before": 7,
                "beforeHex": "0x07",
                "after": 5,
                "afterHex": "0x05",
                "label": "runtimeArea"
              }
            ],
            "zeroPageCandidates": [
              {
                "address": 0,
                "addressHex": "0x0000",
                "before": 0,
                "beforeHex": "0x00",
                "after": 154,
                "afterHex": "0x9A"
              },
              {
                "address": 1,
                "addressHex": "0x0001",
                "before": 139,
                "beforeHex": "0x8B",
                "after": 204,
                "afterHex": "0xCC"
              },
              {
                "address": 2,
                "addressHex": "0x0002",
                "before": 1,
                "beforeHex": "0x01",
                "after": 7,
                "afterHex": "0x07"
              },
              {
                "address": 3,
                "addressHex": "0x0003",
                "before": 0,
                "beforeHex": "0x00",
                "after": 248,
                "afterHex": "0xF8"
              },
              {
                "address": 4,
                "addressHex": "0x0004",
                "before": 2,
                "beforeHex": "0x02",
                "after": 1,
                "afterHex": "0x01"
              },
              {
                "address": 6,
                "addressHex": "0x0006",
                "before": 8,
                "beforeHex": "0x08",
                "after": 248,
                "afterHex": "0xF8"
              },
              {
                "address": 7,
                "addressHex": "0x0007",
                "before": 0,
                "beforeHex": "0x00",
                "after": 41,
                "afterHex": "0x29"
              },
              {
                "address": 8,
                "addressHex": "0x0008",
                "before": 252,
                "beforeHex": "0xFC",
                "after": 0,
                "afterHex": "0x00"
              },
              {
                "address": 9,
                "addressHex": "0x0009",
                "before": 12,
                "beforeHex": "0x0C",
                "after": 97,
                "afterHex": "0x61"
              },
              {
                "address": 10,
                "addressHex": "0x000A",
                "before": 6,
                "beforeHex": "0x06",
                "after": 241,
                "afterHex": "0xF1"
              },
              {
                "address": 11,
                "addressHex": "0x000B",
                "before": 5,
                "beforeHex": "0x05",
                "after": 6,
                "afterHex": "0x06"
              },
              {
                "address": 12,
                "addressHex": "0x000C",
                "before": 2,
                "beforeHex": "0x02",
                "after": 7,
                "afterHex": "0x07"
              },
              {
                "address": 13,
                "addressHex": "0x000D",
                "before": 31,
                "beforeHex": "0x1F",
                "after": 51,
                "afterHex": "0x33"
              },
              {
                "address": 16,
                "addressHex": "0x0010",
                "before": 0,
                "beforeHex": "0x00",
                "after": 1,
                "afterHex": "0x01"
              },
              {
                "address": 19,
                "addressHex": "0x0013",
                "before": 2,
                "beforeHex": "0x02",
                "after": 1,
                "afterHex": "0x01"
              },
              {
                "address": 20,
                "addressHex": "0x0014",
                "before": 0,
                "beforeHex": "0x00",
                "after": 3,
                "afterHex": "0x03"
              },
              {
                "address": 22,
                "addressHex": "0x0016",
                "before": 72,
                "beforeHex": "0x48",
                "after": 97,
                "afterHex": "0x61"
              },
              {
                "address": 23,
                "addressHex": "0x0017",
                "before": 0,
                "beforeHex": "0x00",
                "after": 132,
                "afterHex": "0x84"
              },
              {
                "address": 28,
                "addressHex": "0x001C",
                "before": 1,
                "beforeHex": "0x01",
                "after": 4,
                "afterHex": "0x04"
              },
              {
                "address": 29,
                "addressHex": "0x001D",
                "before": 130,
                "beforeHex": "0x82",
                "after": 163,
                "afterHex": "0xA3"
              },
              {
                "address": 33,
                "addressHex": "0x0021",
                "before": 0,
                "beforeHex": "0x00",
                "after": 5,
                "afterHex": "0x05"
              },
              {
                "address": 34,
                "addressHex": "0x0022",
                "before": 1,
                "beforeHex": "0x01",
                "after": 120,
                "afterHex": "0x78"
              },
              {
                "address": 44,
                "addressHex": "0x002C",
                "before": 3,
                "beforeHex": "0x03",
                "after": 2,
                "afterHex": "0x02"
              },
              {
                "address": 45,
                "addressHex": "0x002D",
                "before": 192,
                "beforeHex": "0xC0",
                "after": 248,
                "afterHex": "0xF8"
              },
              {
                "address": 46,
                "addressHex": "0x002E",
                "before": 144,
                "beforeHex": "0x90",
                "after": 165,
                "afterHex": "0xA5"
              },
              {
                "address": 83,
                "addressHex": "0x0053",
                "before": 0,
                "beforeHex": "0x00",
                "after": 242,
                "afterHex": "0xF2"
              },
              {
                "address": 84,
                "addressHex": "0x0054",
                "before": 0,
                "beforeHex": "0x00",
                "after": 1,
                "afterHex": "0x01"
              },
              {
                "address": 88,
                "addressHex": "0x0058",
                "before": 252,
                "beforeHex": "0xFC",
                "after": 26,
                "afterHex": "0x1A"
              },
              {
                "address": 89,
                "addressHex": "0x0059",
                "before": 11,
                "beforeHex": "0x0B",
                "after": 26,
                "afterHex": "0x1A"
              },
              {
                "address": 94,
                "addressHex": "0x005E",
                "before": 10,
                "beforeHex": "0x0A",
                "after": 164,
                "afterHex": "0xA4"
              },
              {
                "address": 95,
                "addressHex": "0x005F",
                "before": 34,
                "beforeHex": "0x22",
                "after": 39,
                "afterHex": "0x27"
              },
              {
                "address": 96,
                "addressHex": "0x0060",
                "before": 251,
                "beforeHex": "0xFB",
                "after": 249,
                "afterHex": "0xF9"
              },
              {
                "address": 101,
                "addressHex": "0x0065",
                "before": 16,
                "beforeHex": "0x10",
                "after": 15,
                "afterHex": "0x0F"
              },
              {
                "address": 102,
                "addressHex": "0x0066",
                "before": 252,
                "beforeHex": "0xFC",
                "after": 0,
                "afterHex": "0x00"
              },
              {
                "address": 103,
                "addressHex": "0x0067",
                "before": 0,
                "beforeHex": "0x00",
                "after": 130,
                "afterHex": "0x82"
              },
              {
                "address": 106,
                "addressHex": "0x006A",
                "before": 16,
                "beforeHex": "0x10",
                "after": 0,
                "afterHex": "0x00"
              },
              {
                "address": 109,
                "addressHex": "0x006D",
                "before": 0,
                "beforeHex": "0x00",
                "after": 255,
                "afterHex": "0xFF"
              },
              {
                "address": 112,
                "addressHex": "0x0070",
                "before": 16,
                "beforeHex": "0x10",
                "after": 102,
                "afterHex": "0x66"
              },
              {
                "address": 113,
                "addressHex": "0x0071",
                "before": 128,
                "beforeHex": "0x80",
                "after": 251,
                "afterHex": "0xFB"
              },
              {
                "address": 114,
                "addressHex": "0x0072",
                "before": 61,
                "beforeHex": "0x3D",
                "after": 53,
                "afterHex": "0x35"
              },
              {
                "address": 115,
                "addressHex": "0x0073",
                "before": 128,
                "beforeHex": "0x80",
                "after": 251,
                "afterHex": "0xFB"
              },
              {
                "address": 143,
                "addressHex": "0x008F",
                "before": 1,
                "beforeHex": "0x01",
                "after": 0,
                "afterHex": "0x00"
              },
              {
                "address": 147,
                "addressHex": "0x0093",
                "before": 32,
                "beforeHex": "0x20",
                "after": 0,
                "afterHex": "0x00"
              },
              {
                "address": 149,
                "addressHex": "0x0095",
                "before": 28,
                "beforeHex": "0x1C",
                "after": 32,
                "afterHex": "0x20"
              },
              {
                "address": 150,
                "addressHex": "0x0096",
                "before": 6,
                "beforeHex": "0x06",
                "after": 0,
                "afterHex": "0x00"
              },
              {
                "address": 151,
                "addressHex": "0x0097",
                "before": 16,
                "beforeHex": "0x10",
                "after": 4,
                "afterHex": "0x04"
              },
              {
                "address": 153,
                "addressHex": "0x0099",
                "before": 4,
                "beforeHex": "0x04",
                "after": 117,
                "afterHex": "0x75"
              },
              {
                "address": 155,
                "addressHex": "0x009B",
                "before": 4,
                "beforeHex": "0x04",
                "after": 30,
                "afterHex": "0x1E"
              },
              {
                "address": 156,
                "addressHex": "0x009C",
                "before": 8,
                "beforeHex": "0x08",
                "after": 9,
                "afterHex": "0x09"
              },
              {
                "address": 161,
                "addressHex": "0x00A1",
                "before": 231,
                "beforeHex": "0xE7",
                "after": 233,
                "afterHex": "0xE9"
              },
              {
                "address": 165,
                "addressHex": "0x00A5",
                "before": 0,
                "beforeHex": "0x00",
                "after": 1,
                "afterHex": "0x01"
              },
              {
                "address": 167,
                "addressHex": "0x00A7",
                "before": 145,
                "beforeHex": "0x91",
                "after": 141,
                "afterHex": "0x8D"
              },
              {
                "address": 168,
                "addressHex": "0x00A8",
                "before": 152,
                "beforeHex": "0x98",
                "after": 157,
                "afterHex": "0x9D"
              },
              {
                "address": 169,
                "addressHex": "0x00A9",
                "before": 15,
                "beforeHex": "0x0F",
                "after": 48,
                "afterHex": "0x30"
              },
              {
                "address": 171,
                "addressHex": "0x00AB",
                "before": 3,
                "beforeHex": "0x03",
                "after": 10,
                "afterHex": "0x0A"
              },
              {
                "address": 172,
                "addressHex": "0x00AC",
                "before": 3,
                "beforeHex": "0x03",
                "after": 58,
                "afterHex": "0x3A"
              },
              {
                "address": 173,
                "addressHex": "0x00AD",
                "before": 3,
                "beforeHex": "0x03",
                "after": 10,
                "afterHex": "0x0A"
              },
              {
                "address": 175,
                "addressHex": "0x00AF",
                "before": 1,
                "beforeHex": "0x01",
                "after": 0,
                "afterHex": "0x00"
              },
              {
                "address": 176,
                "addressHex": "0x00B0",
                "before": 3,
                "beforeHex": "0x03",
                "after": 10,
                "afterHex": "0x0A"
              },
              {
                "address": 181,
                "addressHex": "0x00B5",
                "before": 3,
                "beforeHex": "0x03",
                "after": 0,
                "afterHex": "0x00"
              },
              {
                "address": 183,
                "addressHex": "0x00B7",
                "before": 52,
                "beforeHex": "0x34",
                "after": 58,
                "afterHex": "0x3A"
              },
              {
                "address": 184,
                "addressHex": "0x00B8",
                "before": 229,
                "beforeHex": "0xE5",
                "after": 235,
                "afterHex": "0xEB"
              },
              {
                "address": 185,
                "addressHex": "0x00B9",
                "before": 57,
                "beforeHex": "0x39",
                "after": 59,
                "afterHex": "0x3B"
              },
              {
                "address": 187,
                "addressHex": "0x00BB",
                "before": 157,
                "beforeHex": "0x9D",
                "after": 160,
                "afterHex": "0xA0"
              }
            ]
          },
          "snapshots": {
            "beforeCpu": "church-to-doina-before-cpu-0000-07ff.bin",
            "afterCpu": "church-to-doina-after-cpu-0000-07ff.bin"
          }
        },
        {
          "id": "doina-to-church",
          "label": "Press up from Town of Doina to re-enter the church",
          "type": "interior-entry",
          "input": "up",
          "status": "complete",
          "startFrame": 64,
          "firstTargetFrame": 68,
          "completeFrame": 98,
          "durationFrames": 34,
          "framesToTarget": 4,
          "settleFrames": 30,
          "targetContext": {
            "objset": "0x00",
            "area": "0x07",
            "submap": "0x00"
          },
          "startContext": {
            "objset": "0x00",
            "area": "0x05",
            "submap": "0x00",
            "submapRaw": "0x00",
            "submapFlags": "0x00",
            "actorPointer": "0x8EDD",
            "tileSetPointer": "0x841D"
          },
          "targetObservedContext": {
            "objset": "0x00",
            "area": "0x07",
            "submap": "0x00",
            "submapRaw": "0x00",
            "submapFlags": "0x00",
            "actorPointer": "0x91A1",
            "tileSetPointer": "0x841D"
          },
          "finalContext": {
            "objset": "0x00",
            "area": "0x07",
            "submap": "0x00",
            "submapRaw": "0x00",
            "submapFlags": "0x00",
            "actorPointer": "0x91A1",
            "tileSetPointer": "0x841D"
          },
          "startPpu": {
            "xScroll": 2,
            "videoRamAddr": "0x2000",
            "tmpVideoRamAddr": "0x379E",
            "bgPatternAddr": "0x0000",
            "spritePatternAddr": "0x1000"
          },
          "targetPpu": {
            "xScroll": 2,
            "videoRamAddr": "0x2000",
            "tmpVideoRamAddr": "0x379E",
            "bgPatternAddr": "0x0000",
            "spritePatternAddr": "0x1000"
          },
          "finalPpu": {
            "xScroll": 0,
            "videoRamAddr": "0x2000",
            "tmpVideoRamAddr": "0x3380",
            "bgPatternAddr": "0x0000",
            "spritePatternAddr": "0x1000"
          },
          "changedBytes": {
            "count": 378,
            "knownFields": [
              {
                "address": 61,
                "addressHex": "0x003D",
                "before": 221,
                "beforeHex": "0xDD",
                "after": 161,
                "afterHex": "0xA1",
                "label": "runtimeActorPointerLow"
              },
              {
                "address": 62,
                "addressHex": "0x003E",
                "before": 142,
                "beforeHex": "0x8E",
                "after": 145,
                "afterHex": "0x91",
                "label": "runtimeActorPointerHigh"
              },
              {
                "address": 80,
                "addressHex": "0x0050",
                "before": 5,
                "beforeHex": "0x05",
                "after": 7,
                "afterHex": "0x07",
                "label": "runtimeArea"
              }
            ],
            "zeroPageCandidates": [
              {
                "address": 2,
                "addressHex": "0x0002",
                "before": 7,
                "beforeHex": "0x07",
                "after": 1,
                "afterHex": "0x01"
              },
              {
                "address": 3,
                "addressHex": "0x0003",
                "before": 248,
                "beforeHex": "0xF8",
                "after": 1,
                "afterHex": "0x01"
              },
              {
                "address": 9,
                "addressHex": "0x0009",
                "before": 97,
                "beforeHex": "0x61",
                "after": 113,
                "afterHex": "0x71"
              },
              {
                "address": 13,
                "addressHex": "0x000D",
                "before": 51,
                "beforeHex": "0x33",
                "after": 19,
                "afterHex": "0x13"
              },
              {
                "address": 14,
                "addressHex": "0x000E",
                "before": 178,
                "beforeHex": "0xB2",
                "after": 180,
                "afterHex": "0xB4"
              },
              {
                "address": 20,
                "addressHex": "0x0014",
                "before": 3,
                "beforeHex": "0x03",
                "after": 1,
                "afterHex": "0x01"
              },
              {
                "address": 22,
                "addressHex": "0x0016",
                "before": 97,
                "beforeHex": "0x61",
                "after": 113,
                "afterHex": "0x71"
              },
              {
                "address": 29,
                "addressHex": "0x001D",
                "before": 163,
                "beforeHex": "0xA3",
                "after": 195,
                "afterHex": "0xC3"
              },
              {
                "address": 45,
                "addressHex": "0x002D",
                "before": 248,
                "beforeHex": "0xF8",
                "after": 236,
                "afterHex": "0xEC"
              },
              {
                "address": 46,
                "addressHex": "0x002E",
                "before": 165,
                "beforeHex": "0xA5",
                "after": 51,
                "afterHex": "0x33"
              },
              {
                "address": 55,
                "addressHex": "0x0037",
                "before": 0,
                "beforeHex": "0x00",
                "after": 1,
                "afterHex": "0x01"
              },
              {
                "address": 57,
                "addressHex": "0x0039",
                "before": 0,
                "beforeHex": "0x00",
                "after": 31,
                "afterHex": "0x1F"
              },
              {
                "address": 75,
                "addressHex": "0x004B",
                "before": 1,
                "beforeHex": "0x01",
                "after": 0,
                "afterHex": "0x00"
              },
              {
                "address": 83,
                "addressHex": "0x0053",
                "before": 242,
                "beforeHex": "0xF2",
                "after": 0,
                "afterHex": "0x00"
              },
              {
                "address": 84,
                "addressHex": "0x0054",
                "before": 1,
                "beforeHex": "0x01",
                "after": 0,
                "afterHex": "0x00"
              },
              {
                "address": 88,
                "addressHex": "0x0058",
                "before": 26,
                "beforeHex": "0x1A",
                "after": 10,
                "afterHex": "0x0A"
              },
              {
                "address": 89,
                "addressHex": "0x0059",
                "before": 26,
                "beforeHex": "0x1A",
                "after": 11,
                "afterHex": "0x0B"
              },
              {
                "address": 98,
                "addressHex": "0x0062",
                "before": 0,
                "beforeHex": "0x00",
                "after": 1,
                "afterHex": "0x01"
              },
              {
                "address": 101,
                "addressHex": "0x0065",
                "before": 15,
                "beforeHex": "0x0F",
                "after": 14,
                "afterHex": "0x0E"
              },
              {
                "address": 103,
                "addressHex": "0x0067",
                "before": 130,
                "beforeHex": "0x82",
                "after": 2,
                "afterHex": "0x02"
              },
              {
                "address": 104,
                "addressHex": "0x0068",
                "before": 128,
                "beforeHex": "0x80",
                "after": 162,
                "afterHex": "0xA2"
              },
              {
                "address": 109,
                "addressHex": "0x006D",
                "before": 255,
                "beforeHex": "0xFF",
                "after": 0,
                "afterHex": "0x00"
              },
              {
                "address": 112,
                "addressHex": "0x0070",
                "before": 102,
                "beforeHex": "0x66",
                "after": 16,
                "afterHex": "0x10"
              },
              {
                "address": 113,
                "addressHex": "0x0071",
                "before": 251,
                "beforeHex": "0xFB",
                "after": 128,
                "afterHex": "0x80"
              },
              {
                "address": 114,
                "addressHex": "0x0072",
                "before": 53,
                "beforeHex": "0x35",
                "after": 61,
                "afterHex": "0x3D"
              },
              {
                "address": 115,
                "addressHex": "0x0073",
                "before": 251,
                "beforeHex": "0xFB",
                "after": 128,
                "afterHex": "0x80"
              },
              {
                "address": 116,
                "addressHex": "0x0074",
                "before": 0,
                "beforeHex": "0x00",
                "after": 242,
                "afterHex": "0xF2"
              },
              {
                "address": 132,
                "addressHex": "0x0084",
                "before": 5,
                "beforeHex": "0x05",
                "after": 6,
                "afterHex": "0x06"
              },
              {
                "address": 143,
                "addressHex": "0x008F",
                "before": 0,
                "beforeHex": "0x00",
                "after": 1,
                "afterHex": "0x01"
              },
              {
                "address": 148,
                "addressHex": "0x0094",
                "before": 0,
                "beforeHex": "0x00",
                "after": 170,
                "afterHex": "0xAA"
              },
              {
                "address": 153,
                "addressHex": "0x0099",
                "before": 117,
                "beforeHex": "0x75",
                "after": 0,
                "afterHex": "0x00"
              },
              {
                "address": 155,
                "addressHex": "0x009B",
                "before": 30,
                "beforeHex": "0x1E",
                "after": 58,
                "afterHex": "0x3A"
              },
              {
                "address": 156,
                "addressHex": "0x009C",
                "before": 9,
                "beforeHex": "0x09",
                "after": 10,
                "afterHex": "0x0A"
              },
              {
                "address": 161,
                "addressHex": "0x00A1",
                "before": 233,
                "beforeHex": "0xE9",
                "after": 236,
                "afterHex": "0xEC"
              },
              {
                "address": 165,
                "addressHex": "0x00A5",
                "before": 1,
                "beforeHex": "0x01",
                "after": 12,
                "afterHex": "0x0C"
              },
              {
                "address": 167,
                "addressHex": "0x00A7",
                "before": 141,
                "beforeHex": "0x8D",
                "after": 95,
                "afterHex": "0x5F"
              },
              {
                "address": 168,
                "addressHex": "0x00A8",
                "before": 157,
                "beforeHex": "0x9D",
                "after": 153,
                "afterHex": "0x99"
              },
              {
                "address": 169,
                "addressHex": "0x00A9",
                "before": 48,
                "beforeHex": "0x30",
                "after": 82,
                "afterHex": "0x52"
              },
              {
                "address": 171,
                "addressHex": "0x00AB",
                "before": 10,
                "beforeHex": "0x0A",
                "after": 16,
                "afterHex": "0x10"
              },
              {
                "address": 172,
                "addressHex": "0x00AC",
                "before": 58,
                "beforeHex": "0x3A",
                "after": 24,
                "afterHex": "0x18"
              },
              {
                "address": 173,
                "addressHex": "0x00AD",
                "before": 10,
                "beforeHex": "0x0A",
                "after": 16,
                "afterHex": "0x10"
              },
              {
                "address": 175,
                "addressHex": "0x00AF",
                "before": 0,
                "beforeHex": "0x00",
                "after": 1,
                "afterHex": "0x01"
              },
              {
                "address": 176,
                "addressHex": "0x00B0",
                "before": 10,
                "beforeHex": "0x0A",
                "after": 16,
                "afterHex": "0x10"
              },
              {
                "address": 181,
                "addressHex": "0x00B5",
                "before": 0,
                "beforeHex": "0x00",
                "after": 3,
                "afterHex": "0x03"
              },
              {
                "address": 183,
                "addressHex": "0x00B7",
                "before": 58,
                "beforeHex": "0x3A",
                "after": 66,
                "afterHex": "0x42"
              },
              {
                "address": 185,
                "addressHex": "0x00B9",
                "before": 59,
                "beforeHex": "0x3B",
                "after": 64,
                "afterHex": "0x40"
              },
              {
                "address": 187,
                "addressHex": "0x00BB",
                "before": 160,
                "beforeHex": "0xA0",
                "after": 151,
                "afterHex": "0x97"
              },
              {
                "address": 188,
                "addressHex": "0x00BC",
                "before": 233,
                "beforeHex": "0xE9",
                "after": 237,
                "afterHex": "0xED"
              },
              {
                "address": 199,
                "addressHex": "0x00C7",
                "before": 0,
                "beforeHex": "0x00",
                "after": 1,
                "afterHex": "0x01"
              },
              {
                "address": 253,
                "addressHex": "0x00FD",
                "before": 242,
                "beforeHex": "0xF2",
                "after": 0,
                "afterHex": "0x00"
              },
              {
                "address": 255,
                "addressHex": "0x00FF",
                "before": 169,
                "beforeHex": "0xA9",
                "after": 168,
                "afterHex": "0xA8"
              }
            ]
          },
          "snapshots": {
            "beforeCpu": "doina-to-church-before-cpu-0000-07ff.bin",
            "afterCpu": "doina-to-church-after-cpu-0000-07ff.bin"
          }
        }
      ],
      "mesen": {
        "status": 0,
        "durationMs": 462,
        "outputs": [
          "/Users/baclap/workspace/castlevania/out/transition-probes/doina-church-round-trip/church-to-doina-after-cpu-0000-07ff.bin",
          "/Users/baclap/workspace/castlevania/out/transition-probes/doina-church-round-trip/church-to-doina-before-cpu-0000-07ff.bin",
          "/Users/baclap/workspace/castlevania/out/transition-probes/doina-church-round-trip/doina-to-church-after-cpu-0000-07ff.bin",
          "/Users/baclap/workspace/castlevania/out/transition-probes/doina-church-round-trip/doina-to-church-before-cpu-0000-07ff.bin",
          "/Users/baclap/workspace/castlevania/out/transition-probes/doina-church-round-trip/probe-start-cpu-0000-07ff.bin",
          "/Users/baclap/workspace/castlevania/out/transition-probes/doina-church-round-trip/summary.json",
          "/Users/baclap/workspace/castlevania/out/transition-probes/doina-church-round-trip/trace.tsv"
        ]
      }
    }
  ]
};
