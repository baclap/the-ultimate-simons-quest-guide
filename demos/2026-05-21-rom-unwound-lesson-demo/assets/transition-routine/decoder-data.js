window.TRANSITION_ROUTINE_DECODER = {
  "schemaVersion": 1,
  "source": {
    "renderer": "transition-routine-decoder",
    "probesFile": "out/transition-probes/analysis.json",
    "topologyFile": "out/exterior-topology/topology.json",
    "notes": [
      "This decoder summarizes routine evidence; it does not treat emulator screenshots as source art.",
      "Mesen write PCs are preserved as trace evidence with nearby ROM byte windows.",
      "Placement/camera rules are promoted only when supported by the current fixtures."
    ]
  },
  "summary": {
    "probes": 6,
    "transitions": 10,
    "completeTransitions": 10,
    "timeoutTransitions": 0,
    "routineAddresses": [
      "0x0070",
      "0x0071",
      "0x0072",
      "0x0073"
    ],
    "writePcs": [
      "0xD19E",
      "0xD1A3",
      "0xD1A8",
      "0xD1AD"
    ],
    "topologyEdges": 87,
    "directTopologyMatches": 5,
    "sourceAreaCandidates": 1,
    "noHandPlacedCoordinates": true
  },
  "romWindows": [
    {
      "pc": "0xD19E",
      "fixedBank": 7,
      "fileOffset": "0x01D1AE",
      "start": "0xD196",
      "end": "0xD1A6",
      "radius": 8,
      "bytes": [
        {
          "address": "0xD196",
          "value": "0x93",
          "isTracePc": false
        },
        {
          "address": "0xD197",
          "value": "0x0A",
          "isTracePc": false
        },
        {
          "address": "0xD198",
          "value": "0x0A",
          "isTracePc": false
        },
        {
          "address": "0xD199",
          "value": "0xA8",
          "isTracePc": false
        },
        {
          "address": "0xD19A",
          "value": "0xB1",
          "isTracePc": false
        },
        {
          "address": "0xD19B",
          "value": "0x04",
          "isTracePc": false
        },
        {
          "address": "0xD19C",
          "value": "0x85",
          "isTracePc": false
        },
        {
          "address": "0xD19D",
          "value": "0x70",
          "isTracePc": false
        },
        {
          "address": "0xD19E",
          "value": "0xC8",
          "isTracePc": true
        },
        {
          "address": "0xD19F",
          "value": "0xB1",
          "isTracePc": false
        },
        {
          "address": "0xD1A0",
          "value": "0x04",
          "isTracePc": false
        },
        {
          "address": "0xD1A1",
          "value": "0x85",
          "isTracePc": false
        },
        {
          "address": "0xD1A2",
          "value": "0x71",
          "isTracePc": false
        },
        {
          "address": "0xD1A3",
          "value": "0xC8",
          "isTracePc": false
        },
        {
          "address": "0xD1A4",
          "value": "0xB1",
          "isTracePc": false
        },
        {
          "address": "0xD1A5",
          "value": "0x04",
          "isTracePc": false
        },
        {
          "address": "0xD1A6",
          "value": "0x85",
          "isTracePc": false
        }
      ],
      "note": "Mesen write PC evidence is preserved as trace evidence; this window does not assume the PC is the exact write opcode boundary."
    },
    {
      "pc": "0xD1A3",
      "fixedBank": 7,
      "fileOffset": "0x01D1B3",
      "start": "0xD19B",
      "end": "0xD1AB",
      "radius": 8,
      "bytes": [
        {
          "address": "0xD19B",
          "value": "0x04",
          "isTracePc": false
        },
        {
          "address": "0xD19C",
          "value": "0x85",
          "isTracePc": false
        },
        {
          "address": "0xD19D",
          "value": "0x70",
          "isTracePc": false
        },
        {
          "address": "0xD19E",
          "value": "0xC8",
          "isTracePc": false
        },
        {
          "address": "0xD19F",
          "value": "0xB1",
          "isTracePc": false
        },
        {
          "address": "0xD1A0",
          "value": "0x04",
          "isTracePc": false
        },
        {
          "address": "0xD1A1",
          "value": "0x85",
          "isTracePc": false
        },
        {
          "address": "0xD1A2",
          "value": "0x71",
          "isTracePc": false
        },
        {
          "address": "0xD1A3",
          "value": "0xC8",
          "isTracePc": true
        },
        {
          "address": "0xD1A4",
          "value": "0xB1",
          "isTracePc": false
        },
        {
          "address": "0xD1A5",
          "value": "0x04",
          "isTracePc": false
        },
        {
          "address": "0xD1A6",
          "value": "0x85",
          "isTracePc": false
        },
        {
          "address": "0xD1A7",
          "value": "0x72",
          "isTracePc": false
        },
        {
          "address": "0xD1A8",
          "value": "0xC8",
          "isTracePc": false
        },
        {
          "address": "0xD1A9",
          "value": "0xB1",
          "isTracePc": false
        },
        {
          "address": "0xD1AA",
          "value": "0x04",
          "isTracePc": false
        },
        {
          "address": "0xD1AB",
          "value": "0x85",
          "isTracePc": false
        }
      ],
      "note": "Mesen write PC evidence is preserved as trace evidence; this window does not assume the PC is the exact write opcode boundary."
    },
    {
      "pc": "0xD1A8",
      "fixedBank": 7,
      "fileOffset": "0x01D1B8",
      "start": "0xD1A0",
      "end": "0xD1B0",
      "radius": 8,
      "bytes": [
        {
          "address": "0xD1A0",
          "value": "0x04",
          "isTracePc": false
        },
        {
          "address": "0xD1A1",
          "value": "0x85",
          "isTracePc": false
        },
        {
          "address": "0xD1A2",
          "value": "0x71",
          "isTracePc": false
        },
        {
          "address": "0xD1A3",
          "value": "0xC8",
          "isTracePc": false
        },
        {
          "address": "0xD1A4",
          "value": "0xB1",
          "isTracePc": false
        },
        {
          "address": "0xD1A5",
          "value": "0x04",
          "isTracePc": false
        },
        {
          "address": "0xD1A6",
          "value": "0x85",
          "isTracePc": false
        },
        {
          "address": "0xD1A7",
          "value": "0x72",
          "isTracePc": false
        },
        {
          "address": "0xD1A8",
          "value": "0xC8",
          "isTracePc": true
        },
        {
          "address": "0xD1A9",
          "value": "0xB1",
          "isTracePc": false
        },
        {
          "address": "0xD1AA",
          "value": "0x04",
          "isTracePc": false
        },
        {
          "address": "0xD1AB",
          "value": "0x85",
          "isTracePc": false
        },
        {
          "address": "0xD1AC",
          "value": "0x73",
          "isTracePc": false
        },
        {
          "address": "0xD1AD",
          "value": "0xA5",
          "isTracePc": false
        },
        {
          "address": "0xD1AE",
          "value": "0x30",
          "isTracePc": false
        },
        {
          "address": "0xD1AF",
          "value": "0x0A",
          "isTracePc": false
        },
        {
          "address": "0xD1B0",
          "value": "0x0A",
          "isTracePc": false
        }
      ],
      "note": "Mesen write PC evidence is preserved as trace evidence; this window does not assume the PC is the exact write opcode boundary."
    },
    {
      "pc": "0xD1AD",
      "fixedBank": 7,
      "fileOffset": "0x01D1BD",
      "start": "0xD1A5",
      "end": "0xD1B5",
      "radius": 8,
      "bytes": [
        {
          "address": "0xD1A5",
          "value": "0x04",
          "isTracePc": false
        },
        {
          "address": "0xD1A6",
          "value": "0x85",
          "isTracePc": false
        },
        {
          "address": "0xD1A7",
          "value": "0x72",
          "isTracePc": false
        },
        {
          "address": "0xD1A8",
          "value": "0xC8",
          "isTracePc": false
        },
        {
          "address": "0xD1A9",
          "value": "0xB1",
          "isTracePc": false
        },
        {
          "address": "0xD1AA",
          "value": "0x04",
          "isTracePc": false
        },
        {
          "address": "0xD1AB",
          "value": "0x85",
          "isTracePc": false
        },
        {
          "address": "0xD1AC",
          "value": "0x73",
          "isTracePc": false
        },
        {
          "address": "0xD1AD",
          "value": "0xA5",
          "isTracePc": true
        },
        {
          "address": "0xD1AE",
          "value": "0x30",
          "isTracePc": false
        },
        {
          "address": "0xD1AF",
          "value": "0x0A",
          "isTracePc": false
        },
        {
          "address": "0xD1B0",
          "value": "0x0A",
          "isTracePc": false
        },
        {
          "address": "0xD1B1",
          "value": "0xA8",
          "isTracePc": false
        },
        {
          "address": "0xD1B2",
          "value": "0xB9",
          "isTracePc": false
        },
        {
          "address": "0xD1B3",
          "value": "0xD1",
          "isTracePc": false
        },
        {
          "address": "0xD1B4",
          "value": "0xF7",
          "isTracePc": false
        },
        {
          "address": "0xD1B5",
          "value": "0x85",
          "isTracePc": false
        }
      ],
      "note": "Mesen write PC evidence is preserved as trace evidence; this window does not assume the PC is the exact write opcode boundary."
    }
  ],
  "transitions": [
    {
      "probeId": "jova-woods-left-round-trip",
      "stepId": "woods-to-jova",
      "label": "Walk left from Jova Woods into Town of Jova",
      "type": "outdoor-horizontal",
      "input": "left",
      "status": "complete",
      "framesToTarget": 36,
      "startContext": {
        "objset": "0x02",
        "area": "0x00",
        "submap": "0x00",
        "submapRaw": "0x00",
        "submapFlags": "0x00",
        "actorPointer": "0x9FE4",
        "tileSetPointer": "0x8CF4"
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
      "topology": {
        "matchStatus": "direct",
        "startNode": "obj02-area00-sub00",
        "finalNode": "obj00-area00-sub00",
        "edgeId": "boundary-transition:obj02-area00-sub00->obj00-area00-sub00:left",
        "edgeType": "boundary-transition",
        "direction": "left",
        "transitionBytes": [
          "0xFF",
          "0x00",
          "0x00"
        ],
        "transitionKind": "objset-area",
        "transitionSemantics": {
          "transitionClass": "object-set-boundary",
          "placementMode": "ordinary-adjacency",
          "ordinaryAdjacency": true,
          "coordinateConfidence": "horizontal-side-only",
          "note": "Transition crosses to an area that may use another object set."
        },
        "note": "Jova Woods exits left to Town of Jova."
      },
      "simon": {
        "beforeX": "0x30",
        "afterX": "0xE9",
        "beforeY": "0xBA",
        "afterY": "0xBA",
        "beforeSpriteTop": "0xAE",
        "afterSpriteTop": "0xAE"
      },
      "camera": {
        "startScroll": {
          "coarseX": 0,
          "coarseY": 28,
          "fineX": 0,
          "fineY": 3,
          "nametableX": 0,
          "nametableY": 0,
          "scrollX": 0,
          "scrollY": 227
        },
        "finalScroll": {
          "coarseX": 0,
          "coarseY": 26,
          "fineX": 0,
          "fineY": 3,
          "nametableX": 1,
          "nametableY": 0,
          "scrollX": 256,
          "scrollY": 211
        },
        "changedMetrics": [
          {
            "metric": "scrollYLow",
            "before": "0xE3",
            "after": "0xD3"
          },
          {
            "metric": "coarseY",
            "before": "0x1C",
            "after": "0x1A"
          },
          {
            "metric": "nametableX",
            "before": "0x00",
            "after": "0x01"
          }
        ]
      },
      "routineBytes": [
        {
          "address": "0x0070",
          "before": "0x3E",
          "after": "0x86",
          "changed": true,
          "writeCount": 1,
          "transitionRoutineWriteCount": 1,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 65,
            "stepFrame": 35,
            "pc": "0xD19E",
            "value": "0x86",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 65,
            "stepFrame": 35,
            "pc": "0xD19E",
            "value": "0x86",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD19E",
              "count": 1
            }
          ],
          "writeMetadata": [
            {
              "frame": 65,
              "stepFrame": 35,
              "pc": "0xD19E",
              "prgReg": "0x02",
              "a": "0x86",
              "x": "0x00",
              "y": "0x0C",
              "address": "0x0070",
              "value": "0x86",
              "context": {
                "objset": "0x00",
                "area": "0x00",
                "submapRaw": "0x80",
                "submap": "0x00",
                "actorPointer": "0x9FE4",
                "tileSetPointer": "0x8CF4",
                "transitionState": 0
              }
            }
          ]
        },
        {
          "address": "0x0071",
          "before": "0xA2",
          "after": "0xFA",
          "changed": true,
          "writeCount": 1,
          "transitionRoutineWriteCount": 1,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 65,
            "stepFrame": 35,
            "pc": "0xD1A3",
            "value": "0xFA",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 65,
            "stepFrame": 35,
            "pc": "0xD1A3",
            "value": "0xFA",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD1A3",
              "count": 1
            }
          ],
          "writeMetadata": [
            {
              "frame": 65,
              "stepFrame": 35,
              "pc": "0xD1A3",
              "prgReg": "0x02",
              "a": "0xFA",
              "x": "0x00",
              "y": "0x0D",
              "address": "0x0071",
              "value": "0xFA",
              "context": {
                "objset": "0x00",
                "area": "0x00",
                "submapRaw": "0x80",
                "submap": "0x00",
                "actorPointer": "0x9FE4",
                "tileSetPointer": "0x8CF4",
                "transitionState": 0
              }
            }
          ]
        },
        {
          "address": "0x0072",
          "before": "0x21",
          "after": "0x50",
          "changed": true,
          "writeCount": 1,
          "transitionRoutineWriteCount": 1,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 65,
            "stepFrame": 35,
            "pc": "0xD1A8",
            "value": "0x50",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 65,
            "stepFrame": 35,
            "pc": "0xD1A8",
            "value": "0x50",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD1A8",
              "count": 1
            }
          ],
          "writeMetadata": [
            {
              "frame": 65,
              "stepFrame": 35,
              "pc": "0xD1A8",
              "prgReg": "0x02",
              "a": "0x50",
              "x": "0x00",
              "y": "0x0E",
              "address": "0x0072",
              "value": "0x50",
              "context": {
                "objset": "0x00",
                "area": "0x00",
                "submapRaw": "0x80",
                "submap": "0x00",
                "actorPointer": "0x9FE4",
                "tileSetPointer": "0x8CF4",
                "transitionState": 0
              }
            }
          ]
        },
        {
          "address": "0x0073",
          "before": "0xA2",
          "after": "0xFA",
          "changed": true,
          "writeCount": 1,
          "transitionRoutineWriteCount": 1,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 65,
            "stepFrame": 35,
            "pc": "0xD1AD",
            "value": "0xFA",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 65,
            "stepFrame": 35,
            "pc": "0xD1AD",
            "value": "0xFA",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD1AD",
              "count": 1
            }
          ],
          "writeMetadata": [
            {
              "frame": 65,
              "stepFrame": 35,
              "pc": "0xD1AD",
              "prgReg": "0x02",
              "a": "0xFA",
              "x": "0x00",
              "y": "0x0F",
              "address": "0x0073",
              "value": "0xFA",
              "context": {
                "objset": "0x00",
                "area": "0x00",
                "submapRaw": "0x80",
                "submap": "0x00",
                "actorPointer": "0x9FE4",
                "tileSetPointer": "0x8CF4",
                "transitionState": 0
              }
            }
          ]
        }
      ]
    },
    {
      "probeId": "jova-woods-left-round-trip",
      "stepId": "jova-to-woods",
      "label": "Walk right from Town of Jova back into Jova Woods",
      "type": "outdoor-horizontal-return",
      "input": "right",
      "status": "complete",
      "framesToTarget": 21,
      "startContext": {
        "objset": "0x00",
        "area": "0x00",
        "submap": "0x00",
        "submapRaw": "0x80",
        "submapFlags": "0x80",
        "actorPointer": "0x9FE4",
        "tileSetPointer": "0x841D"
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
      "topology": {
        "matchStatus": "direct",
        "startNode": "obj00-area00-sub00",
        "finalNode": "obj02-area00-sub00",
        "edgeId": "boundary-transition:obj00-area00-sub00->obj02-area00-sub00:right",
        "edgeType": "boundary-transition",
        "direction": "right",
        "transitionBytes": [
          "0xFF",
          "0x02",
          "0x00"
        ],
        "transitionKind": "objset-area",
        "transitionSemantics": {
          "transitionClass": "object-set-boundary",
          "placementMode": "ordinary-adjacency",
          "ordinaryAdjacency": true,
          "coordinateConfidence": "horizontal-side-only",
          "note": "Transition crosses to an area that may use another object set."
        },
        "note": "Town of Jova exits right to Jova Woods."
      },
      "simon": {
        "beforeX": "0xE9",
        "afterX": "0x10",
        "beforeY": "0xBA",
        "afterY": "0xBA",
        "beforeSpriteTop": "0xAE",
        "afterSpriteTop": "0xAE"
      },
      "camera": {
        "startScroll": {
          "coarseX": 0,
          "coarseY": 26,
          "fineX": 0,
          "fineY": 3,
          "nametableX": 1,
          "nametableY": 0,
          "scrollX": 256,
          "scrollY": 211
        },
        "finalScroll": {
          "coarseX": 0,
          "coarseY": 28,
          "fineX": 0,
          "fineY": 3,
          "nametableX": 0,
          "nametableY": 0,
          "scrollX": 0,
          "scrollY": 227
        },
        "changedMetrics": [
          {
            "metric": "scrollYLow",
            "before": "0xD3",
            "after": "0xE3"
          },
          {
            "metric": "coarseY",
            "before": "0x1A",
            "after": "0x1C"
          },
          {
            "metric": "nametableX",
            "before": "0x01",
            "after": "0x00"
          }
        ]
      },
      "routineBytes": [
        {
          "address": "0x0070",
          "before": "0x86",
          "after": "0x3E",
          "changed": true,
          "writeCount": 1,
          "transitionRoutineWriteCount": 1,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 110,
            "stepFrame": 20,
            "pc": "0xD19E",
            "value": "0x3E",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 110,
            "stepFrame": 20,
            "pc": "0xD19E",
            "value": "0x3E",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD19E",
              "count": 1
            }
          ],
          "writeMetadata": [
            {
              "frame": 110,
              "stepFrame": 20,
              "pc": "0xD19E",
              "prgReg": "0x02",
              "a": "0x3E",
              "x": "0x00",
              "y": "0x08",
              "address": "0x0070",
              "value": "0x3E",
              "context": {
                "objset": "0x02",
                "area": "0x00",
                "submapRaw": "0x00",
                "submap": "0x00",
                "actorPointer": "0x90AC",
                "tileSetPointer": "0x841D",
                "transitionState": 0
              }
            }
          ]
        },
        {
          "address": "0x0071",
          "before": "0xFA",
          "after": "0xA2",
          "changed": true,
          "writeCount": 1,
          "transitionRoutineWriteCount": 1,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 110,
            "stepFrame": 20,
            "pc": "0xD1A3",
            "value": "0xA2",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 110,
            "stepFrame": 20,
            "pc": "0xD1A3",
            "value": "0xA2",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD1A3",
              "count": 1
            }
          ],
          "writeMetadata": [
            {
              "frame": 110,
              "stepFrame": 20,
              "pc": "0xD1A3",
              "prgReg": "0x02",
              "a": "0xA2",
              "x": "0x00",
              "y": "0x09",
              "address": "0x0071",
              "value": "0xA2",
              "context": {
                "objset": "0x02",
                "area": "0x00",
                "submapRaw": "0x00",
                "submap": "0x00",
                "actorPointer": "0x90AC",
                "tileSetPointer": "0x841D",
                "transitionState": 0
              }
            }
          ]
        },
        {
          "address": "0x0072",
          "before": "0x50",
          "after": "0x21",
          "changed": true,
          "writeCount": 1,
          "transitionRoutineWriteCount": 1,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 110,
            "stepFrame": 20,
            "pc": "0xD1A8",
            "value": "0x21",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 110,
            "stepFrame": 20,
            "pc": "0xD1A8",
            "value": "0x21",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD1A8",
              "count": 1
            }
          ],
          "writeMetadata": [
            {
              "frame": 110,
              "stepFrame": 20,
              "pc": "0xD1A8",
              "prgReg": "0x02",
              "a": "0x21",
              "x": "0x00",
              "y": "0x0A",
              "address": "0x0072",
              "value": "0x21",
              "context": {
                "objset": "0x02",
                "area": "0x00",
                "submapRaw": "0x00",
                "submap": "0x00",
                "actorPointer": "0x90AC",
                "tileSetPointer": "0x841D",
                "transitionState": 0
              }
            }
          ]
        },
        {
          "address": "0x0073",
          "before": "0xFA",
          "after": "0xA2",
          "changed": true,
          "writeCount": 1,
          "transitionRoutineWriteCount": 1,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 110,
            "stepFrame": 20,
            "pc": "0xD1AD",
            "value": "0xA2",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 110,
            "stepFrame": 20,
            "pc": "0xD1AD",
            "value": "0xA2",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD1AD",
              "count": 1
            }
          ],
          "writeMetadata": [
            {
              "frame": 110,
              "stepFrame": 20,
              "pc": "0xD1AD",
              "prgReg": "0x02",
              "a": "0xA2",
              "x": "0x00",
              "y": "0x0B",
              "address": "0x0073",
              "value": "0xA2",
              "context": {
                "objset": "0x02",
                "area": "0x00",
                "submapRaw": "0x00",
                "submap": "0x00",
                "actorPointer": "0x90AC",
                "tileSetPointer": "0x841D",
                "transitionState": 0
              }
            }
          ]
        }
      ]
    },
    {
      "probeId": "doina-church-round-trip",
      "stepId": "church-to-doina",
      "label": "Walk left from Doina church to Town of Doina",
      "type": "interior-exit",
      "input": "left",
      "status": "complete",
      "framesToTarget": 4,
      "startContext": {
        "objset": "0x00",
        "area": "0x07",
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
      "topology": {
        "matchStatus": "none",
        "startNode": "obj00-area07-sub00",
        "finalNode": "obj00-area05-sub00"
      },
      "simon": {
        "beforeX": "0x10",
        "afterX": "0x80",
        "beforeY": "0xBA",
        "afterY": "0xBA",
        "beforeSpriteTop": "0xAE",
        "afterSpriteTop": "0xAE"
      },
      "camera": {
        "startScroll": {
          "coarseX": 0,
          "coarseY": 28,
          "fineX": 0,
          "fineY": 3,
          "nametableX": 0,
          "nametableY": 0,
          "scrollX": 0,
          "scrollY": 227
        },
        "finalScroll": {
          "coarseX": 30,
          "coarseY": 28,
          "fineX": 2,
          "fineY": 3,
          "nametableX": 1,
          "nametableY": 0,
          "scrollX": 498,
          "scrollY": 227
        },
        "changedMetrics": [
          {
            "metric": "scrollXLow",
            "before": "0x00",
            "after": "0xF2"
          },
          {
            "metric": "coarseX",
            "before": "0x00",
            "after": "0x1E"
          },
          {
            "metric": "fineX",
            "before": "0x00",
            "after": "0x02"
          },
          {
            "metric": "nametableX",
            "before": "0x00",
            "after": "0x01"
          }
        ]
      },
      "routineBytes": [
        {
          "address": "0x0070",
          "before": "0x10",
          "after": "0x66",
          "changed": true,
          "writeCount": 1,
          "transitionRoutineWriteCount": 1,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 33,
            "stepFrame": 3,
            "pc": "0xD19E",
            "value": "0x66",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 33,
            "stepFrame": 3,
            "pc": "0xD19E",
            "value": "0x66",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD19E",
              "count": 1
            }
          ],
          "writeMetadata": [
            {
              "frame": 33,
              "stepFrame": 3,
              "pc": "0xD19E",
              "prgReg": "0x02",
              "a": "0x66",
              "x": "0x00",
              "y": "0x00",
              "address": "0x0070",
              "value": "0x66",
              "context": {
                "objset": "0x00",
                "area": "0x05",
                "submapRaw": "0x00",
                "submap": "0x00",
                "actorPointer": "0x8EDD",
                "tileSetPointer": "0x841D",
                "transitionState": 0
              }
            }
          ]
        },
        {
          "address": "0x0071",
          "before": "0x80",
          "after": "0xFB",
          "changed": true,
          "writeCount": 1,
          "transitionRoutineWriteCount": 1,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 33,
            "stepFrame": 3,
            "pc": "0xD1A3",
            "value": "0xFB",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 33,
            "stepFrame": 3,
            "pc": "0xD1A3",
            "value": "0xFB",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD1A3",
              "count": 1
            }
          ],
          "writeMetadata": [
            {
              "frame": 33,
              "stepFrame": 3,
              "pc": "0xD1A3",
              "prgReg": "0x02",
              "a": "0xFB",
              "x": "0x00",
              "y": "0x01",
              "address": "0x0071",
              "value": "0xFB",
              "context": {
                "objset": "0x00",
                "area": "0x05",
                "submapRaw": "0x00",
                "submap": "0x00",
                "actorPointer": "0x8EDD",
                "tileSetPointer": "0x841D",
                "transitionState": 0
              }
            }
          ]
        },
        {
          "address": "0x0072",
          "before": "0x3D",
          "after": "0x35",
          "changed": true,
          "writeCount": 1,
          "transitionRoutineWriteCount": 1,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 33,
            "stepFrame": 3,
            "pc": "0xD1A8",
            "value": "0x35",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 33,
            "stepFrame": 3,
            "pc": "0xD1A8",
            "value": "0x35",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD1A8",
              "count": 1
            }
          ],
          "writeMetadata": [
            {
              "frame": 33,
              "stepFrame": 3,
              "pc": "0xD1A8",
              "prgReg": "0x02",
              "a": "0x35",
              "x": "0x00",
              "y": "0x02",
              "address": "0x0072",
              "value": "0x35",
              "context": {
                "objset": "0x00",
                "area": "0x05",
                "submapRaw": "0x00",
                "submap": "0x00",
                "actorPointer": "0x8EDD",
                "tileSetPointer": "0x841D",
                "transitionState": 0
              }
            }
          ]
        },
        {
          "address": "0x0073",
          "before": "0x80",
          "after": "0xFB",
          "changed": true,
          "writeCount": 1,
          "transitionRoutineWriteCount": 1,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 33,
            "stepFrame": 3,
            "pc": "0xD1AD",
            "value": "0xFB",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 33,
            "stepFrame": 3,
            "pc": "0xD1AD",
            "value": "0xFB",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD1AD",
              "count": 1
            }
          ],
          "writeMetadata": [
            {
              "frame": 33,
              "stepFrame": 3,
              "pc": "0xD1AD",
              "prgReg": "0x02",
              "a": "0xFB",
              "x": "0x00",
              "y": "0x03",
              "address": "0x0073",
              "value": "0xFB",
              "context": {
                "objset": "0x00",
                "area": "0x05",
                "submapRaw": "0x00",
                "submap": "0x00",
                "actorPointer": "0x8EDD",
                "tileSetPointer": "0x841D",
                "transitionState": 0
              }
            }
          ]
        }
      ]
    },
    {
      "probeId": "doina-church-round-trip",
      "stepId": "doina-to-church",
      "label": "Press up from Town of Doina to re-enter the church",
      "type": "interior-entry",
      "input": "up",
      "status": "complete",
      "framesToTarget": 4,
      "startContext": {
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
        "area": "0x07",
        "submap": "0x00",
        "submapRaw": "0x00",
        "submapFlags": "0x00",
        "actorPointer": "0x91A1",
        "tileSetPointer": "0x841D"
      },
      "topology": {
        "matchStatus": "none",
        "startNode": "obj00-area05-sub00",
        "finalNode": "obj00-area07-sub00"
      },
      "simon": {
        "beforeX": "0x80",
        "afterX": "0x10",
        "beforeY": "0xBA",
        "afterY": "0xBA",
        "beforeSpriteTop": "0xAE",
        "afterSpriteTop": "0xAE"
      },
      "camera": {
        "startScroll": {
          "coarseX": 30,
          "coarseY": 28,
          "fineX": 2,
          "fineY": 3,
          "nametableX": 1,
          "nametableY": 0,
          "scrollX": 498,
          "scrollY": 227
        },
        "finalScroll": {
          "coarseX": 0,
          "coarseY": 28,
          "fineX": 0,
          "fineY": 3,
          "nametableX": 0,
          "nametableY": 0,
          "scrollX": 0,
          "scrollY": 227
        },
        "changedMetrics": [
          {
            "metric": "scrollXLow",
            "before": "0xF2",
            "after": "0x00"
          },
          {
            "metric": "coarseX",
            "before": "0x1E",
            "after": "0x00"
          },
          {
            "metric": "fineX",
            "before": "0x02",
            "after": "0x00"
          },
          {
            "metric": "nametableX",
            "before": "0x01",
            "after": "0x00"
          }
        ]
      },
      "routineBytes": [
        {
          "address": "0x0070",
          "before": "0x66",
          "after": "0x10",
          "changed": true,
          "writeCount": 1,
          "transitionRoutineWriteCount": 1,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 68,
            "stepFrame": 4,
            "pc": "0xD19E",
            "value": "0x10",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 68,
            "stepFrame": 4,
            "pc": "0xD19E",
            "value": "0x10",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD19E",
              "count": 1
            }
          ],
          "writeMetadata": [
            {
              "frame": 68,
              "stepFrame": 4,
              "pc": "0xD19E",
              "prgReg": "0x02",
              "a": "0x10",
              "x": "0x00",
              "y": "0x40",
              "address": "0x0070",
              "value": "0x10",
              "context": {
                "objset": "0x00",
                "area": "0x07",
                "submapRaw": "0x00",
                "submap": "0x00",
                "actorPointer": "0x91A1",
                "tileSetPointer": "0x841D",
                "transitionState": 0
              }
            }
          ]
        },
        {
          "address": "0x0071",
          "before": "0xFB",
          "after": "0x80",
          "changed": true,
          "writeCount": 1,
          "transitionRoutineWriteCount": 1,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 68,
            "stepFrame": 4,
            "pc": "0xD1A3",
            "value": "0x80",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 68,
            "stepFrame": 4,
            "pc": "0xD1A3",
            "value": "0x80",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD1A3",
              "count": 1
            }
          ],
          "writeMetadata": [
            {
              "frame": 68,
              "stepFrame": 4,
              "pc": "0xD1A3",
              "prgReg": "0x02",
              "a": "0x80",
              "x": "0x00",
              "y": "0x41",
              "address": "0x0071",
              "value": "0x80",
              "context": {
                "objset": "0x00",
                "area": "0x07",
                "submapRaw": "0x00",
                "submap": "0x00",
                "actorPointer": "0x91A1",
                "tileSetPointer": "0x841D",
                "transitionState": 0
              }
            }
          ]
        },
        {
          "address": "0x0072",
          "before": "0x35",
          "after": "0x3D",
          "changed": true,
          "writeCount": 1,
          "transitionRoutineWriteCount": 1,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 68,
            "stepFrame": 4,
            "pc": "0xD1A8",
            "value": "0x3D",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 68,
            "stepFrame": 4,
            "pc": "0xD1A8",
            "value": "0x3D",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD1A8",
              "count": 1
            }
          ],
          "writeMetadata": [
            {
              "frame": 68,
              "stepFrame": 4,
              "pc": "0xD1A8",
              "prgReg": "0x02",
              "a": "0x3D",
              "x": "0x00",
              "y": "0x42",
              "address": "0x0072",
              "value": "0x3D",
              "context": {
                "objset": "0x00",
                "area": "0x07",
                "submapRaw": "0x00",
                "submap": "0x00",
                "actorPointer": "0x91A1",
                "tileSetPointer": "0x841D",
                "transitionState": 0
              }
            }
          ]
        },
        {
          "address": "0x0073",
          "before": "0xFB",
          "after": "0x80",
          "changed": true,
          "writeCount": 1,
          "transitionRoutineWriteCount": 1,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 68,
            "stepFrame": 4,
            "pc": "0xD1AD",
            "value": "0x80",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 68,
            "stepFrame": 4,
            "pc": "0xD1AD",
            "value": "0x80",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD1AD",
              "count": 1
            }
          ],
          "writeMetadata": [
            {
              "frame": 68,
              "stepFrame": 4,
              "pc": "0xD1AD",
              "prgReg": "0x02",
              "a": "0x80",
              "x": "0x00",
              "y": "0x43",
              "address": "0x0073",
              "value": "0x80",
              "context": {
                "objset": "0x00",
                "area": "0x07",
                "submapRaw": "0x00",
                "submap": "0x00",
                "actorPointer": "0x91A1",
                "tileSetPointer": "0x841D",
                "transitionState": 0
              }
            }
          ]
        }
      ]
    },
    {
      "probeId": "castlevania-bridge-round-trip",
      "stepId": "castlevania-to-bridge",
      "label": "Walk left from Castlevania entrance to Castlevania Bridge",
      "type": "final-area-exit",
      "input": "left",
      "status": "complete",
      "framesToTarget": 5,
      "startContext": {
        "objset": "0x05",
        "area": "0x00",
        "submap": "0x00",
        "submapRaw": "0x00",
        "submapFlags": "0x00",
        "actorPointer": "0xB3FE",
        "tileSetPointer": "0x9A3F"
      },
      "finalContext": {
        "objset": "0x04",
        "area": "0x03",
        "submap": "0x01",
        "submapRaw": "0x81",
        "submapFlags": "0x80",
        "actorPointer": "0xB3FE",
        "tileSetPointer": "0x9620"
      },
      "topology": {
        "matchStatus": "direct",
        "startNode": "obj05-area00-sub00",
        "finalNode": "obj04-area03-sub01",
        "edgeId": "boundary-transition:obj05-area00-sub00->obj04-area03-sub01:left",
        "edgeType": "boundary-transition",
        "direction": "left",
        "transitionBytes": [
          "0xFF",
          "0x04",
          "0x03"
        ],
        "transitionKind": "objset-area",
        "transitionSemantics": {
          "transitionClass": "object-set-boundary",
          "placementMode": "ordinary-adjacency",
          "ordinaryAdjacency": true,
          "coordinateConfidence": "horizontal-side-only",
          "note": "Transition crosses to an area that may use another object set."
        },
        "note": "Castlevania exits left to Castlevania Bridge."
      },
      "simon": {
        "beforeX": "0x14",
        "afterX": "0xE9",
        "beforeY": "0x8C",
        "afterY": "0xBA",
        "beforeSpriteTop": "0x80",
        "afterSpriteTop": "0xAE"
      },
      "camera": {
        "startScroll": {
          "coarseX": 0,
          "coarseY": 4,
          "fineX": 0,
          "fineY": 1,
          "nametableX": 0,
          "nametableY": 0,
          "scrollX": 0,
          "scrollY": 33
        },
        "finalScroll": {
          "coarseX": 0,
          "coarseY": 28,
          "fineX": 0,
          "fineY": 3,
          "nametableX": 1,
          "nametableY": 0,
          "scrollX": 256,
          "scrollY": 227
        },
        "changedMetrics": [
          {
            "metric": "scrollYLow",
            "before": "0x21",
            "after": "0xE3"
          },
          {
            "metric": "coarseY",
            "before": "0x04",
            "after": "0x1C"
          },
          {
            "metric": "fineY",
            "before": "0x01",
            "after": "0x03"
          },
          {
            "metric": "nametableX",
            "before": "0x00",
            "after": "0x01"
          }
        ]
      },
      "routineBytes": [
        {
          "address": "0x0070",
          "before": "0x82",
          "after": "0x22",
          "changed": true,
          "writeCount": 1,
          "transitionRoutineWriteCount": 1,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 34,
            "stepFrame": 4,
            "pc": "0xD19E",
            "value": "0x22",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 34,
            "stepFrame": 4,
            "pc": "0xD19E",
            "value": "0x22",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD19E",
              "count": 1
            }
          ],
          "writeMetadata": [
            {
              "frame": 34,
              "stepFrame": 4,
              "pc": "0xD19E",
              "prgReg": "0x02",
              "a": "0x22",
              "x": "0x00",
              "y": "0x08",
              "address": "0x0070",
              "value": "0x22",
              "context": {
                "objset": "0x04",
                "area": "0x03",
                "submapRaw": "0x81",
                "submap": "0x01",
                "actorPointer": "0xB3FE",
                "tileSetPointer": "0x9A3F",
                "transitionState": 0
              }
            }
          ]
        },
        {
          "address": "0x0071",
          "before": "0xBC",
          "after": "0xAF",
          "changed": true,
          "writeCount": 1,
          "transitionRoutineWriteCount": 1,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 34,
            "stepFrame": 4,
            "pc": "0xD1A3",
            "value": "0xAF",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 34,
            "stepFrame": 4,
            "pc": "0xD1A3",
            "value": "0xAF",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD1A3",
              "count": 1
            }
          ],
          "writeMetadata": [
            {
              "frame": 34,
              "stepFrame": 4,
              "pc": "0xD1A3",
              "prgReg": "0x02",
              "a": "0xAF",
              "x": "0x00",
              "y": "0x09",
              "address": "0x0071",
              "value": "0xAF",
              "context": {
                "objset": "0x04",
                "area": "0x03",
                "submapRaw": "0x81",
                "submap": "0x01",
                "actorPointer": "0xB3FE",
                "tileSetPointer": "0x9A3F",
                "transitionState": 0
              }
            }
          ]
        },
        {
          "address": "0x0072",
          "before": "0x68",
          "after": "0xFD",
          "changed": true,
          "writeCount": 1,
          "transitionRoutineWriteCount": 1,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 34,
            "stepFrame": 4,
            "pc": "0xD1A8",
            "value": "0xFD",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 34,
            "stepFrame": 4,
            "pc": "0xD1A8",
            "value": "0xFD",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD1A8",
              "count": 1
            }
          ],
          "writeMetadata": [
            {
              "frame": 34,
              "stepFrame": 4,
              "pc": "0xD1A8",
              "prgReg": "0x02",
              "a": "0xFD",
              "x": "0x00",
              "y": "0x0A",
              "address": "0x0072",
              "value": "0xFD",
              "context": {
                "objset": "0x04",
                "area": "0x03",
                "submapRaw": "0x81",
                "submap": "0x01",
                "actorPointer": "0xB3FE",
                "tileSetPointer": "0x9A3F",
                "transitionState": 0
              }
            }
          ]
        },
        {
          "address": "0x0073",
          "before": "0xBC",
          "after": "0xAE",
          "changed": true,
          "writeCount": 1,
          "transitionRoutineWriteCount": 1,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 34,
            "stepFrame": 4,
            "pc": "0xD1AD",
            "value": "0xAE",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 34,
            "stepFrame": 4,
            "pc": "0xD1AD",
            "value": "0xAE",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD1AD",
              "count": 1
            }
          ],
          "writeMetadata": [
            {
              "frame": 34,
              "stepFrame": 4,
              "pc": "0xD1AD",
              "prgReg": "0x02",
              "a": "0xAE",
              "x": "0x00",
              "y": "0x0B",
              "address": "0x0073",
              "value": "0xAE",
              "context": {
                "objset": "0x04",
                "area": "0x03",
                "submapRaw": "0x81",
                "submap": "0x01",
                "actorPointer": "0xB3FE",
                "tileSetPointer": "0x9A3F",
                "transitionState": 0
              }
            }
          ]
        }
      ]
    },
    {
      "probeId": "castlevania-bridge-round-trip",
      "stepId": "bridge-to-castlevania",
      "label": "Walk right from Castlevania Bridge back to Castlevania entrance",
      "type": "final-area-entry",
      "input": "right",
      "status": "complete",
      "framesToTarget": 14,
      "startContext": {
        "objset": "0x04",
        "area": "0x03",
        "submap": "0x01",
        "submapRaw": "0x81",
        "submapFlags": "0x80",
        "actorPointer": "0xB3FE",
        "tileSetPointer": "0x9620"
      },
      "finalContext": {
        "objset": "0x05",
        "area": "0x00",
        "submap": "0x00",
        "submapRaw": "0x00",
        "submapFlags": "0x00",
        "actorPointer": "0xA8A9",
        "tileSetPointer": "0x9A3F"
      },
      "topology": {
        "matchStatus": "direct",
        "startNode": "obj04-area03-sub01",
        "finalNode": "obj05-area00-sub00",
        "edgeId": "boundary-transition:obj04-area03-sub01->obj05-area00-sub00:right",
        "edgeType": "boundary-transition",
        "direction": "right",
        "transitionBytes": [
          "0xFF",
          "0x05",
          "0x00"
        ],
        "transitionKind": "objset-area",
        "transitionSemantics": {
          "transitionClass": "object-set-boundary",
          "placementMode": "ordinary-adjacency",
          "ordinaryAdjacency": true,
          "coordinateConfidence": "horizontal-side-only",
          "note": "Transition crosses to an area that may use another object set."
        },
        "note": "Castlevania Bridge exits right to Castlevania."
      },
      "simon": {
        "beforeX": "0xE9",
        "afterX": "0x10",
        "beforeY": "0xBA",
        "afterY": "0xBA",
        "beforeSpriteTop": "0xAE",
        "afterSpriteTop": "0xAE"
      },
      "camera": {
        "startScroll": {
          "coarseX": 0,
          "coarseY": 28,
          "fineX": 0,
          "fineY": 3,
          "nametableX": 1,
          "nametableY": 0,
          "scrollX": 256,
          "scrollY": 227
        },
        "finalScroll": {
          "coarseX": 0,
          "coarseY": 28,
          "fineX": 0,
          "fineY": 3,
          "nametableX": 0,
          "nametableY": 0,
          "scrollX": 0,
          "scrollY": 227
        },
        "changedMetrics": [
          {
            "metric": "nametableX",
            "before": "0x01",
            "after": "0x00"
          }
        ]
      },
      "routineBytes": [
        {
          "address": "0x0070",
          "before": "0x22",
          "after": "0x82",
          "changed": true,
          "writeCount": 1,
          "transitionRoutineWriteCount": 1,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 78,
            "stepFrame": 13,
            "pc": "0xD19E",
            "value": "0x82",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 78,
            "stepFrame": 13,
            "pc": "0xD19E",
            "value": "0x82",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD19E",
              "count": 1
            }
          ],
          "writeMetadata": [
            {
              "frame": 78,
              "stepFrame": 13,
              "pc": "0xD19E",
              "prgReg": "0x02",
              "a": "0x82",
              "x": "0x00",
              "y": "0x00",
              "address": "0x0070",
              "value": "0x82",
              "context": {
                "objset": "0x05",
                "area": "0x00",
                "submapRaw": "0x00",
                "submap": "0x00",
                "actorPointer": "0xA8A9",
                "tileSetPointer": "0x9620",
                "transitionState": 0
              }
            }
          ]
        },
        {
          "address": "0x0071",
          "before": "0xAF",
          "after": "0xBC",
          "changed": true,
          "writeCount": 1,
          "transitionRoutineWriteCount": 1,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 78,
            "stepFrame": 13,
            "pc": "0xD1A3",
            "value": "0xBC",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 78,
            "stepFrame": 13,
            "pc": "0xD1A3",
            "value": "0xBC",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD1A3",
              "count": 1
            }
          ],
          "writeMetadata": [
            {
              "frame": 78,
              "stepFrame": 13,
              "pc": "0xD1A3",
              "prgReg": "0x02",
              "a": "0xBC",
              "x": "0x00",
              "y": "0x01",
              "address": "0x0071",
              "value": "0xBC",
              "context": {
                "objset": "0x05",
                "area": "0x00",
                "submapRaw": "0x00",
                "submap": "0x00",
                "actorPointer": "0xA8A9",
                "tileSetPointer": "0x9620",
                "transitionState": 0
              }
            }
          ]
        },
        {
          "address": "0x0072",
          "before": "0xFD",
          "after": "0x68",
          "changed": true,
          "writeCount": 1,
          "transitionRoutineWriteCount": 1,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 78,
            "stepFrame": 13,
            "pc": "0xD1A8",
            "value": "0x68",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 78,
            "stepFrame": 13,
            "pc": "0xD1A8",
            "value": "0x68",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD1A8",
              "count": 1
            }
          ],
          "writeMetadata": [
            {
              "frame": 78,
              "stepFrame": 13,
              "pc": "0xD1A8",
              "prgReg": "0x02",
              "a": "0x68",
              "x": "0x00",
              "y": "0x02",
              "address": "0x0072",
              "value": "0x68",
              "context": {
                "objset": "0x05",
                "area": "0x00",
                "submapRaw": "0x00",
                "submap": "0x00",
                "actorPointer": "0xA8A9",
                "tileSetPointer": "0x9620",
                "transitionState": 0
              }
            }
          ]
        },
        {
          "address": "0x0073",
          "before": "0xAE",
          "after": "0xBC",
          "changed": true,
          "writeCount": 1,
          "transitionRoutineWriteCount": 1,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 78,
            "stepFrame": 13,
            "pc": "0xD1AD",
            "value": "0xBC",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 78,
            "stepFrame": 13,
            "pc": "0xD1AD",
            "value": "0xBC",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD1AD",
              "count": 1
            }
          ],
          "writeMetadata": [
            {
              "frame": 78,
              "stepFrame": 13,
              "pc": "0xD1AD",
              "prgReg": "0x02",
              "a": "0xBC",
              "x": "0x00",
              "y": "0x03",
              "address": "0x0073",
              "value": "0xBC",
              "context": {
                "objset": "0x05",
                "area": "0x00",
                "submapRaw": "0x00",
                "submap": "0x00",
                "actorPointer": "0xA8A9",
                "tileSetPointer": "0x9620",
                "transitionState": 0
              }
            }
          ]
        }
      ]
    },
    {
      "probeId": "dora-woods-part-3-left",
      "stepId": "dora-part-3-to-part-2",
      "label": "Walk left from Dora Woods - Part 3 to Dora Woods - Part 2",
      "type": "outdoor-horizontal-vertical-delta",
      "input": "left",
      "status": "complete",
      "framesToTarget": 4,
      "startContext": {
        "objset": "0x02",
        "area": "0x09",
        "submap": "0x00",
        "submapRaw": "0x00",
        "submapFlags": "0x00",
        "actorPointer": "0xA153",
        "tileSetPointer": "0x8CF4"
      },
      "finalContext": {
        "objset": "0x02",
        "area": "0x08",
        "submap": "0x02",
        "submapRaw": "0x82",
        "submapFlags": "0x80",
        "actorPointer": "0xA153",
        "tileSetPointer": "0x8CF4"
      },
      "topology": {
        "matchStatus": "direct",
        "startNode": "obj02-area09-sub00",
        "finalNode": "obj02-area08-sub02",
        "edgeId": "boundary-transition:obj02-area09-sub00->obj02-area08-sub02:left",
        "edgeType": "boundary-transition",
        "direction": "left",
        "transitionBytes": [
          "0x00",
          "0x00",
          "0x08"
        ],
        "transitionKind": "same-objset-area",
        "transitionSemantics": {
          "transitionClass": "same-object-set-boundary",
          "placementMode": "ordinary-adjacency",
          "ordinaryAdjacency": true,
          "coordinateConfidence": "horizontal-side-only",
          "note": "Transition stays in the current object set and changes area."
        },
        "note": "Dora Woods - Part 3 exits left to Dora Woods - Part 2."
      },
      "simon": {
        "beforeX": "0x14",
        "afterX": "0xE9",
        "beforeY": "0x6D",
        "afterY": "0x6D",
        "beforeSpriteTop": "0x61",
        "afterSpriteTop": "0x61"
      },
      "camera": {
        "startScroll": {
          "coarseX": 2,
          "coarseY": 0,
          "fineX": 0,
          "fineY": 0,
          "nametableX": 0,
          "nametableY": 1,
          "scrollX": 16,
          "scrollY": 240
        },
        "finalScroll": {
          "coarseX": 0,
          "coarseY": 0,
          "fineX": 0,
          "fineY": 0,
          "nametableX": 1,
          "nametableY": 0,
          "scrollX": 256,
          "scrollY": 0
        },
        "changedMetrics": [
          {
            "metric": "scrollXLow",
            "before": "0x10",
            "after": "0x00"
          },
          {
            "metric": "scrollYLow",
            "before": "0xF0",
            "after": "0x00"
          },
          {
            "metric": "coarseX",
            "before": "0x02",
            "after": "0x00"
          },
          {
            "metric": "nametableX",
            "before": "0x00",
            "after": "0x01"
          },
          {
            "metric": "nametableY",
            "before": "0x01",
            "after": "0x00"
          }
        ]
      },
      "routineBytes": [
        {
          "address": "0x0070",
          "before": "0x22",
          "after": "0x96",
          "changed": true,
          "writeCount": 1,
          "transitionRoutineWriteCount": 1,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 33,
            "stepFrame": 3,
            "pc": "0xD19E",
            "value": "0x96",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 33,
            "stepFrame": 3,
            "pc": "0xD19E",
            "value": "0x96",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD19E",
              "count": 1
            }
          ],
          "writeMetadata": [
            {
              "frame": 33,
              "stepFrame": 3,
              "pc": "0xD19E",
              "prgReg": "0x02",
              "a": "0x96",
              "x": "0x00",
              "y": "0x34",
              "address": "0x0070",
              "value": "0x96",
              "context": {
                "objset": "0x02",
                "area": "0x08",
                "submapRaw": "0x82",
                "submap": "0x02",
                "actorPointer": "0xA153",
                "tileSetPointer": "0x8CF4",
                "transitionState": 254
              }
            }
          ]
        },
        {
          "address": "0x0071",
          "before": "0xA2",
          "after": "0xA2",
          "changed": false,
          "writeCount": 1,
          "transitionRoutineWriteCount": 1,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 33,
            "stepFrame": 3,
            "pc": "0xD1A3",
            "value": "0xA2",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 33,
            "stepFrame": 3,
            "pc": "0xD1A3",
            "value": "0xA2",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD1A3",
              "count": 1
            }
          ],
          "writeMetadata": [
            {
              "frame": 33,
              "stepFrame": 3,
              "pc": "0xD1A3",
              "prgReg": "0x02",
              "a": "0xA2",
              "x": "0x00",
              "y": "0x35",
              "address": "0x0071",
              "value": "0xA2",
              "context": {
                "objset": "0x02",
                "area": "0x08",
                "submapRaw": "0x82",
                "submap": "0x02",
                "actorPointer": "0xA153",
                "tileSetPointer": "0x8CF4",
                "transitionState": 254
              }
            }
          ]
        },
        {
          "address": "0x0072",
          "before": "0xF8",
          "after": "0xF8",
          "changed": false,
          "writeCount": 1,
          "transitionRoutineWriteCount": 1,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 33,
            "stepFrame": 3,
            "pc": "0xD1A8",
            "value": "0xF8",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 33,
            "stepFrame": 3,
            "pc": "0xD1A8",
            "value": "0xF8",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD1A8",
              "count": 1
            }
          ],
          "writeMetadata": [
            {
              "frame": 33,
              "stepFrame": 3,
              "pc": "0xD1A8",
              "prgReg": "0x02",
              "a": "0xF8",
              "x": "0x00",
              "y": "0x36",
              "address": "0x0072",
              "value": "0xF8",
              "context": {
                "objset": "0x02",
                "area": "0x08",
                "submapRaw": "0x82",
                "submap": "0x02",
                "actorPointer": "0xA153",
                "tileSetPointer": "0x8CF4",
                "transitionState": 254
              }
            }
          ]
        },
        {
          "address": "0x0073",
          "before": "0xA1",
          "after": "0xA1",
          "changed": false,
          "writeCount": 1,
          "transitionRoutineWriteCount": 1,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 33,
            "stepFrame": 3,
            "pc": "0xD1AD",
            "value": "0xA1",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 33,
            "stepFrame": 3,
            "pc": "0xD1AD",
            "value": "0xA1",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD1AD",
              "count": 1
            }
          ],
          "writeMetadata": [
            {
              "frame": 33,
              "stepFrame": 3,
              "pc": "0xD1AD",
              "prgReg": "0x02",
              "a": "0xA1",
              "x": "0x00",
              "y": "0x37",
              "address": "0x0073",
              "value": "0xA1",
              "context": {
                "objset": "0x02",
                "area": "0x08",
                "submapRaw": "0x82",
                "submap": "0x02",
                "actorPointer": "0xA153",
                "tileSetPointer": "0x8CF4",
                "transitionState": 254
              }
            }
          ]
        }
      ]
    },
    {
      "probeId": "deborah-cliff-tornado-transport",
      "stepId": "deborah-cliff-to-bodley-door",
      "label": "Hold down at Deborah Cliff to trigger tornado transport",
      "type": "special-transport",
      "input": "down",
      "status": "complete",
      "framesToTarget": 787,
      "startContext": {
        "objset": "0x04",
        "area": "0x01",
        "submap": "0x01",
        "submapRaw": "0x81",
        "submapFlags": "0x80",
        "actorPointer": "0xA885",
        "tileSetPointer": "0x9620"
      },
      "finalContext": {
        "objset": "0x01",
        "area": "0x04",
        "submap": "0x00",
        "submapRaw": "0x80",
        "submapFlags": "0x80",
        "actorPointer": "0x9346",
        "tileSetPointer": "0x8891"
      },
      "topology": {
        "matchStatus": "source-area-candidate",
        "startNode": "obj04-area01-sub01",
        "finalNode": "obj01-area04-sub00",
        "edgeId": "boundary-transition:obj04-area01-sub00->obj01-area04-sub00:left",
        "edgeType": "boundary-transition",
        "direction": "left",
        "transitionBytes": [
          "0xFF",
          "0x01",
          "0x04"
        ],
        "transitionKind": "objset-area",
        "transitionSemantics": {
          "transitionClass": "special-transport-candidate",
          "placementMode": "connector-only",
          "ordinaryAdjacency": false,
          "coordinateConfidence": "endpoint-known-position-unknown",
          "note": "This edge should be rendered as a connector until the transport event coordinates are decoded."
        },
        "note": "Deborah Cliff (In Tornado) exits left to Bodley Mansion - Door."
      },
      "simon": {
        "beforeX": "0x27",
        "afterX": "0xE7",
        "beforeY": "0x6F",
        "afterY": "0xBA",
        "beforeSpriteTop": "0x63",
        "afterSpriteTop": "0xAE"
      },
      "camera": {
        "startScroll": {
          "coarseX": 0,
          "coarseY": 29,
          "fineX": 0,
          "fineY": 6,
          "nametableX": 0,
          "nametableY": 0,
          "scrollX": 0,
          "scrollY": 238
        },
        "finalScroll": {
          "coarseX": 0,
          "coarseY": 28,
          "fineX": 0,
          "fineY": 3,
          "nametableX": 0,
          "nametableY": 0,
          "scrollX": 0,
          "scrollY": 227
        },
        "changedMetrics": [
          {
            "metric": "scrollYLow",
            "before": "0xEE",
            "after": "0xE3"
          },
          {
            "metric": "coarseY",
            "before": "0x1D",
            "after": "0x1C"
          },
          {
            "metric": "fineY",
            "before": "0x06",
            "after": "0x03"
          }
        ]
      },
      "routineBytes": [
        {
          "address": "0x0070",
          "before": "0x34",
          "after": "0xCF",
          "changed": true,
          "writeCount": 2,
          "transitionRoutineWriteCount": 2,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 816,
            "stepFrame": 786,
            "pc": "0xD19E",
            "value": "0xCF",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 816,
            "stepFrame": 786,
            "pc": "0xD19E",
            "value": "0xCF",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD19E",
              "count": 2
            }
          ],
          "writeMetadata": [
            {
              "frame": 592,
              "stepFrame": 562,
              "pc": "0xD19E",
              "prgReg": "0x02",
              "a": "0x6A",
              "x": "0x00",
              "y": "0x1C",
              "address": "0x0070",
              "value": "0x6A",
              "context": {
                "objset": "0x04",
                "area": "0x01",
                "submapRaw": "0x80",
                "submap": "0x00",
                "actorPointer": "0xA885",
                "tileSetPointer": "0x9620",
                "transitionState": 0
              }
            },
            {
              "frame": 816,
              "stepFrame": 786,
              "pc": "0xD19E",
              "prgReg": "0x02",
              "a": "0xCF",
              "x": "0x00",
              "y": "0x08",
              "address": "0x0070",
              "value": "0xCF",
              "context": {
                "objset": "0x01",
                "area": "0x04",
                "submapRaw": "0x80",
                "submap": "0x00",
                "actorPointer": "0xA8A9",
                "tileSetPointer": "0x9620",
                "transitionState": 0
              }
            }
          ]
        },
        {
          "address": "0x0071",
          "before": "0xAF",
          "after": "0x87",
          "changed": true,
          "writeCount": 2,
          "transitionRoutineWriteCount": 2,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 816,
            "stepFrame": 786,
            "pc": "0xD1A3",
            "value": "0x87",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 816,
            "stepFrame": 786,
            "pc": "0xD1A3",
            "value": "0x87",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD1A3",
              "count": 2
            }
          ],
          "writeMetadata": [
            {
              "frame": 592,
              "stepFrame": 562,
              "pc": "0xD1A3",
              "prgReg": "0x02",
              "a": "0xAF",
              "x": "0x00",
              "y": "0x1D",
              "address": "0x0071",
              "value": "0xAF",
              "context": {
                "objset": "0x04",
                "area": "0x01",
                "submapRaw": "0x80",
                "submap": "0x00",
                "actorPointer": "0xA885",
                "tileSetPointer": "0x9620",
                "transitionState": 0
              }
            },
            {
              "frame": 816,
              "stepFrame": 786,
              "pc": "0xD1A3",
              "prgReg": "0x02",
              "a": "0x87",
              "x": "0x00",
              "y": "0x09",
              "address": "0x0071",
              "value": "0x87",
              "context": {
                "objset": "0x01",
                "area": "0x04",
                "submapRaw": "0x80",
                "submap": "0x00",
                "actorPointer": "0xA8A9",
                "tileSetPointer": "0x9620",
                "transitionState": 0
              }
            }
          ]
        },
        {
          "address": "0x0072",
          "before": "0xFD",
          "after": "0xCE",
          "changed": true,
          "writeCount": 2,
          "transitionRoutineWriteCount": 2,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 816,
            "stepFrame": 786,
            "pc": "0xD1A8",
            "value": "0xCE",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 816,
            "stepFrame": 786,
            "pc": "0xD1A8",
            "value": "0xCE",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD1A8",
              "count": 2
            }
          ],
          "writeMetadata": [
            {
              "frame": 592,
              "stepFrame": 562,
              "pc": "0xD1A8",
              "prgReg": "0x02",
              "a": "0xFD",
              "x": "0x00",
              "y": "0x1E",
              "address": "0x0072",
              "value": "0xFD",
              "context": {
                "objset": "0x04",
                "area": "0x01",
                "submapRaw": "0x80",
                "submap": "0x00",
                "actorPointer": "0xA885",
                "tileSetPointer": "0x9620",
                "transitionState": 0
              }
            },
            {
              "frame": 816,
              "stepFrame": 786,
              "pc": "0xD1A8",
              "prgReg": "0x02",
              "a": "0xCE",
              "x": "0x00",
              "y": "0x0A",
              "address": "0x0072",
              "value": "0xCE",
              "context": {
                "objset": "0x01",
                "area": "0x04",
                "submapRaw": "0x80",
                "submap": "0x00",
                "actorPointer": "0xA8A9",
                "tileSetPointer": "0x9620",
                "transitionState": 0
              }
            }
          ]
        },
        {
          "address": "0x0073",
          "before": "0xAE",
          "after": "0x87",
          "changed": true,
          "writeCount": 2,
          "transitionRoutineWriteCount": 2,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 816,
            "stepFrame": 786,
            "pc": "0xD1AD",
            "value": "0x87",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 816,
            "stepFrame": 786,
            "pc": "0xD1AD",
            "value": "0x87",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD1AD",
              "count": 2
            }
          ],
          "writeMetadata": [
            {
              "frame": 592,
              "stepFrame": 562,
              "pc": "0xD1AD",
              "prgReg": "0x02",
              "a": "0xAE",
              "x": "0x00",
              "y": "0x1F",
              "address": "0x0073",
              "value": "0xAE",
              "context": {
                "objset": "0x04",
                "area": "0x01",
                "submapRaw": "0x80",
                "submap": "0x00",
                "actorPointer": "0xA885",
                "tileSetPointer": "0x9620",
                "transitionState": 0
              }
            },
            {
              "frame": 816,
              "stepFrame": 786,
              "pc": "0xD1AD",
              "prgReg": "0x02",
              "a": "0x87",
              "x": "0x00",
              "y": "0x0B",
              "address": "0x0073",
              "value": "0x87",
              "context": {
                "objset": "0x01",
                "area": "0x04",
                "submapRaw": "0x80",
                "submap": "0x00",
                "actorPointer": "0xA8A9",
                "tileSetPointer": "0x9620",
                "transitionState": 0
              }
            }
          ]
        }
      ]
    },
    {
      "probeId": "jova-town-interior-round-trip",
      "stepId": "jova-interior-to-town",
      "label": "Walk left from Jova Thorn Whip Room to Town of Jova",
      "type": "interior-exit",
      "input": "left",
      "status": "complete",
      "framesToTarget": 3,
      "startContext": {
        "objset": "0x00",
        "area": "0x08",
        "submap": "0x00",
        "submapRaw": "0x00",
        "submapFlags": "0x00",
        "actorPointer": "0x913E",
        "tileSetPointer": "0x841D"
      },
      "finalContext": {
        "objset": "0x00",
        "area": "0x00",
        "submap": "0x00",
        "submapRaw": "0x00",
        "submapFlags": "0x00",
        "actorPointer": "0x913E",
        "tileSetPointer": "0x841D"
      },
      "topology": {
        "matchStatus": "none",
        "startNode": "obj00-area08-sub00",
        "finalNode": "obj00-area00-sub00"
      },
      "simon": {
        "beforeX": "0x0C",
        "afterX": "0x80",
        "beforeY": "0xBA",
        "afterY": "0x8C",
        "beforeSpriteTop": "0xAD",
        "afterSpriteTop": "0x80"
      },
      "camera": {
        "startScroll": {
          "coarseX": 0,
          "coarseY": 28,
          "fineX": 0,
          "fineY": 3,
          "nametableX": 0,
          "nametableY": 0,
          "scrollX": 0,
          "scrollY": 227
        },
        "finalScroll": {
          "coarseX": 1,
          "coarseY": 20,
          "fineX": 7,
          "fineY": 1,
          "nametableX": 1,
          "nametableY": 0,
          "scrollX": 271,
          "scrollY": 161
        },
        "changedMetrics": [
          {
            "metric": "scrollXLow",
            "before": "0x00",
            "after": "0x0F"
          },
          {
            "metric": "scrollYLow",
            "before": "0xE3",
            "after": "0xA1"
          },
          {
            "metric": "coarseX",
            "before": "0x00",
            "after": "0x01"
          },
          {
            "metric": "coarseY",
            "before": "0x1C",
            "after": "0x14"
          },
          {
            "metric": "fineX",
            "before": "0x00",
            "after": "0x07"
          },
          {
            "metric": "fineY",
            "before": "0x03",
            "after": "0x01"
          },
          {
            "metric": "nametableX",
            "before": "0x00",
            "after": "0x01"
          }
        ]
      },
      "routineBytes": [
        {
          "address": "0x0070",
          "before": "0x16",
          "after": "0x86",
          "changed": true,
          "writeCount": 1,
          "transitionRoutineWriteCount": 1,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 32,
            "stepFrame": 2,
            "pc": "0xD19E",
            "value": "0x86",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 32,
            "stepFrame": 2,
            "pc": "0xD19E",
            "value": "0x86",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD19E",
              "count": 1
            }
          ],
          "writeMetadata": [
            {
              "frame": 32,
              "stepFrame": 2,
              "pc": "0xD19E",
              "prgReg": "0x02",
              "a": "0x86",
              "x": "0x00",
              "y": "0x0C",
              "address": "0x0070",
              "value": "0x86",
              "context": {
                "objset": "0x00",
                "area": "0x00",
                "submapRaw": "0x00",
                "submap": "0x00",
                "actorPointer": "0x913E",
                "tileSetPointer": "0x841D",
                "transitionState": 0
              }
            }
          ]
        },
        {
          "address": "0x0071",
          "before": "0x80",
          "after": "0xFA",
          "changed": true,
          "writeCount": 1,
          "transitionRoutineWriteCount": 1,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 32,
            "stepFrame": 2,
            "pc": "0xD1A3",
            "value": "0xFA",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 32,
            "stepFrame": 2,
            "pc": "0xD1A3",
            "value": "0xFA",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD1A3",
              "count": 1
            }
          ],
          "writeMetadata": [
            {
              "frame": 32,
              "stepFrame": 2,
              "pc": "0xD1A3",
              "prgReg": "0x02",
              "a": "0xFA",
              "x": "0x00",
              "y": "0x0D",
              "address": "0x0071",
              "value": "0xFA",
              "context": {
                "objset": "0x00",
                "area": "0x00",
                "submapRaw": "0x00",
                "submap": "0x00",
                "actorPointer": "0x913E",
                "tileSetPointer": "0x841D",
                "transitionState": 0
              }
            }
          ]
        },
        {
          "address": "0x0072",
          "before": "0x41",
          "after": "0x50",
          "changed": true,
          "writeCount": 1,
          "transitionRoutineWriteCount": 1,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 32,
            "stepFrame": 2,
            "pc": "0xD1A8",
            "value": "0x50",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 32,
            "stepFrame": 2,
            "pc": "0xD1A8",
            "value": "0x50",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD1A8",
              "count": 1
            }
          ],
          "writeMetadata": [
            {
              "frame": 32,
              "stepFrame": 2,
              "pc": "0xD1A8",
              "prgReg": "0x02",
              "a": "0x50",
              "x": "0x00",
              "y": "0x0E",
              "address": "0x0072",
              "value": "0x50",
              "context": {
                "objset": "0x00",
                "area": "0x00",
                "submapRaw": "0x00",
                "submap": "0x00",
                "actorPointer": "0x913E",
                "tileSetPointer": "0x841D",
                "transitionState": 0
              }
            }
          ]
        },
        {
          "address": "0x0073",
          "before": "0x80",
          "after": "0xFA",
          "changed": true,
          "writeCount": 1,
          "transitionRoutineWriteCount": 1,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 32,
            "stepFrame": 2,
            "pc": "0xD1AD",
            "value": "0xFA",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 32,
            "stepFrame": 2,
            "pc": "0xD1AD",
            "value": "0xFA",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD1AD",
              "count": 1
            }
          ],
          "writeMetadata": [
            {
              "frame": 32,
              "stepFrame": 2,
              "pc": "0xD1AD",
              "prgReg": "0x02",
              "a": "0xFA",
              "x": "0x00",
              "y": "0x0F",
              "address": "0x0073",
              "value": "0xFA",
              "context": {
                "objset": "0x00",
                "area": "0x00",
                "submapRaw": "0x00",
                "submap": "0x00",
                "actorPointer": "0x913E",
                "tileSetPointer": "0x841D",
                "transitionState": 0
              }
            }
          ]
        }
      ]
    },
    {
      "probeId": "jova-town-interior-round-trip",
      "stepId": "jova-town-to-interior",
      "label": "Press up from Town of Jova to re-enter Jova Thorn Whip Room",
      "type": "interior-entry",
      "input": "up",
      "status": "complete",
      "framesToTarget": 5,
      "startContext": {
        "objset": "0x00",
        "area": "0x00",
        "submap": "0x00",
        "submapRaw": "0x00",
        "submapFlags": "0x00",
        "actorPointer": "0x913E",
        "tileSetPointer": "0x841D"
      },
      "finalContext": {
        "objset": "0x00",
        "area": "0x08",
        "submap": "0x00",
        "submapRaw": "0x00",
        "submapFlags": "0x00",
        "actorPointer": "0x90AC",
        "tileSetPointer": "0x841D"
      },
      "topology": {
        "matchStatus": "none",
        "startNode": "obj00-area00-sub00",
        "finalNode": "obj00-area08-sub00"
      },
      "simon": {
        "beforeX": "0x80",
        "afterX": "0x10",
        "beforeY": "0x8C",
        "afterY": "0xBA",
        "beforeSpriteTop": "0x80",
        "afterSpriteTop": "0xAE"
      },
      "camera": {
        "startScroll": {
          "coarseX": 1,
          "coarseY": 20,
          "fineX": 7,
          "fineY": 1,
          "nametableX": 1,
          "nametableY": 0,
          "scrollX": 271,
          "scrollY": 161
        },
        "finalScroll": {
          "coarseX": 0,
          "coarseY": 28,
          "fineX": 0,
          "fineY": 3,
          "nametableX": 0,
          "nametableY": 0,
          "scrollX": 0,
          "scrollY": 227
        },
        "changedMetrics": [
          {
            "metric": "scrollXLow",
            "before": "0x0F",
            "after": "0x00"
          },
          {
            "metric": "scrollYLow",
            "before": "0xA1",
            "after": "0xE3"
          },
          {
            "metric": "coarseX",
            "before": "0x01",
            "after": "0x00"
          },
          {
            "metric": "coarseY",
            "before": "0x14",
            "after": "0x1C"
          },
          {
            "metric": "fineX",
            "before": "0x07",
            "after": "0x00"
          },
          {
            "metric": "fineY",
            "before": "0x01",
            "after": "0x03"
          },
          {
            "metric": "nametableX",
            "before": "0x01",
            "after": "0x00"
          }
        ]
      },
      "routineBytes": [
        {
          "address": "0x0070",
          "before": "0x86",
          "after": "0x16",
          "changed": true,
          "writeCount": 1,
          "transitionRoutineWriteCount": 1,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 69,
            "stepFrame": 6,
            "pc": "0xD19E",
            "value": "0x16",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 69,
            "stepFrame": 6,
            "pc": "0xD19E",
            "value": "0x16",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD19E",
              "count": 1
            }
          ],
          "writeMetadata": [
            {
              "frame": 69,
              "stepFrame": 6,
              "pc": "0xD19E",
              "prgReg": "0x02",
              "a": "0x16",
              "x": "0x00",
              "y": "0x1C",
              "address": "0x0070",
              "value": "0x16",
              "context": {
                "objset": "0x00",
                "area": "0x08",
                "submapRaw": "0x00",
                "submap": "0x00",
                "actorPointer": "0x90AC",
                "tileSetPointer": "0x841D",
                "transitionState": 0
              }
            }
          ]
        },
        {
          "address": "0x0071",
          "before": "0xFA",
          "after": "0x80",
          "changed": true,
          "writeCount": 1,
          "transitionRoutineWriteCount": 1,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 69,
            "stepFrame": 6,
            "pc": "0xD1A3",
            "value": "0x80",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 69,
            "stepFrame": 6,
            "pc": "0xD1A3",
            "value": "0x80",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD1A3",
              "count": 1
            }
          ],
          "writeMetadata": [
            {
              "frame": 69,
              "stepFrame": 6,
              "pc": "0xD1A3",
              "prgReg": "0x02",
              "a": "0x80",
              "x": "0x00",
              "y": "0x1D",
              "address": "0x0071",
              "value": "0x80",
              "context": {
                "objset": "0x00",
                "area": "0x08",
                "submapRaw": "0x00",
                "submap": "0x00",
                "actorPointer": "0x90AC",
                "tileSetPointer": "0x841D",
                "transitionState": 0
              }
            }
          ]
        },
        {
          "address": "0x0072",
          "before": "0x50",
          "after": "0x41",
          "changed": true,
          "writeCount": 1,
          "transitionRoutineWriteCount": 1,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 69,
            "stepFrame": 6,
            "pc": "0xD1A8",
            "value": "0x41",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 69,
            "stepFrame": 6,
            "pc": "0xD1A8",
            "value": "0x41",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD1A8",
              "count": 1
            }
          ],
          "writeMetadata": [
            {
              "frame": 69,
              "stepFrame": 6,
              "pc": "0xD1A8",
              "prgReg": "0x02",
              "a": "0x41",
              "x": "0x00",
              "y": "0x1E",
              "address": "0x0072",
              "value": "0x41",
              "context": {
                "objset": "0x00",
                "area": "0x08",
                "submapRaw": "0x00",
                "submap": "0x00",
                "actorPointer": "0x90AC",
                "tileSetPointer": "0x841D",
                "transitionState": 0
              }
            }
          ]
        },
        {
          "address": "0x0073",
          "before": "0xFA",
          "after": "0x80",
          "changed": true,
          "writeCount": 1,
          "transitionRoutineWriteCount": 1,
          "writtenInTransitionRoutine": true,
          "lastWrite": {
            "frame": 69,
            "stepFrame": 6,
            "pc": "0xD1AD",
            "value": "0x80",
            "event": "zero-page-write"
          },
          "lastTransitionRoutineWrite": {
            "frame": 69,
            "stepFrame": 6,
            "pc": "0xD1AD",
            "value": "0x80",
            "event": "zero-page-write"
          },
          "topTransitionRoutinePcs": [
            {
              "pc": "0xD1AD",
              "count": 1
            }
          ],
          "writeMetadata": [
            {
              "frame": 69,
              "stepFrame": 6,
              "pc": "0xD1AD",
              "prgReg": "0x02",
              "a": "0x80",
              "x": "0x00",
              "y": "0x1F",
              "address": "0x0073",
              "value": "0x80",
              "context": {
                "objset": "0x00",
                "area": "0x08",
                "submapRaw": "0x00",
                "submap": "0x00",
                "actorPointer": "0x90AC",
                "tileSetPointer": "0x841D",
                "transitionState": 0
              }
            }
          ]
        }
      ]
    }
  ],
  "edgeEvidence": [
    {
      "edgeId": "boundary-transition:obj02-area00-sub00->obj00-area00-sub00:left",
      "stepId": "woods-to-jova",
      "probeId": "jova-woods-left-round-trip",
      "matchStatus": "direct",
      "status": "complete",
      "type": "outdoor-horizontal",
      "transitionBytes": [
        "0xFF",
        "0x00",
        "0x00"
      ],
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set."
      },
      "simon": {
        "beforeX": "0x30",
        "afterX": "0xE9",
        "beforeY": "0xBA",
        "afterY": "0xBA",
        "beforeSpriteTop": "0xAE",
        "afterSpriteTop": "0xAE"
      },
      "cameraChangedMetrics": [
        "scrollYLow",
        "coarseY",
        "nametableX"
      ],
      "routineAfterBytes": {
        "0x0070": "0x86",
        "0x0071": "0xFA",
        "0x0072": "0x50",
        "0x0073": "0xFA"
      },
      "routineWriteCounts": {
        "0x0070": 1,
        "0x0071": 1,
        "0x0072": 1,
        "0x0073": 1
      }
    },
    {
      "edgeId": "boundary-transition:obj00-area00-sub00->obj02-area00-sub00:right",
      "stepId": "jova-to-woods",
      "probeId": "jova-woods-left-round-trip",
      "matchStatus": "direct",
      "status": "complete",
      "type": "outdoor-horizontal-return",
      "transitionBytes": [
        "0xFF",
        "0x02",
        "0x00"
      ],
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set."
      },
      "simon": {
        "beforeX": "0xE9",
        "afterX": "0x10",
        "beforeY": "0xBA",
        "afterY": "0xBA",
        "beforeSpriteTop": "0xAE",
        "afterSpriteTop": "0xAE"
      },
      "cameraChangedMetrics": [
        "scrollYLow",
        "coarseY",
        "nametableX"
      ],
      "routineAfterBytes": {
        "0x0070": "0x3E",
        "0x0071": "0xA2",
        "0x0072": "0x21",
        "0x0073": "0xA2"
      },
      "routineWriteCounts": {
        "0x0070": 1,
        "0x0071": 1,
        "0x0072": 1,
        "0x0073": 1
      }
    },
    {
      "edgeId": "boundary-transition:obj05-area00-sub00->obj04-area03-sub01:left",
      "stepId": "castlevania-to-bridge",
      "probeId": "castlevania-bridge-round-trip",
      "matchStatus": "direct",
      "status": "complete",
      "type": "final-area-exit",
      "transitionBytes": [
        "0xFF",
        "0x04",
        "0x03"
      ],
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set."
      },
      "simon": {
        "beforeX": "0x14",
        "afterX": "0xE9",
        "beforeY": "0x8C",
        "afterY": "0xBA",
        "beforeSpriteTop": "0x80",
        "afterSpriteTop": "0xAE"
      },
      "cameraChangedMetrics": [
        "scrollYLow",
        "coarseY",
        "fineY",
        "nametableX"
      ],
      "routineAfterBytes": {
        "0x0070": "0x22",
        "0x0071": "0xAF",
        "0x0072": "0xFD",
        "0x0073": "0xAE"
      },
      "routineWriteCounts": {
        "0x0070": 1,
        "0x0071": 1,
        "0x0072": 1,
        "0x0073": 1
      }
    },
    {
      "edgeId": "boundary-transition:obj04-area03-sub01->obj05-area00-sub00:right",
      "stepId": "bridge-to-castlevania",
      "probeId": "castlevania-bridge-round-trip",
      "matchStatus": "direct",
      "status": "complete",
      "type": "final-area-entry",
      "transitionBytes": [
        "0xFF",
        "0x05",
        "0x00"
      ],
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set."
      },
      "simon": {
        "beforeX": "0xE9",
        "afterX": "0x10",
        "beforeY": "0xBA",
        "afterY": "0xBA",
        "beforeSpriteTop": "0xAE",
        "afterSpriteTop": "0xAE"
      },
      "cameraChangedMetrics": [
        "nametableX"
      ],
      "routineAfterBytes": {
        "0x0070": "0x82",
        "0x0071": "0xBC",
        "0x0072": "0x68",
        "0x0073": "0xBC"
      },
      "routineWriteCounts": {
        "0x0070": 1,
        "0x0071": 1,
        "0x0072": 1,
        "0x0073": 1
      }
    },
    {
      "edgeId": "boundary-transition:obj02-area09-sub00->obj02-area08-sub02:left",
      "stepId": "dora-part-3-to-part-2",
      "probeId": "dora-woods-part-3-left",
      "matchStatus": "direct",
      "status": "complete",
      "type": "outdoor-horizontal-vertical-delta",
      "transitionBytes": [
        "0x00",
        "0x00",
        "0x08"
      ],
      "transitionSemantics": {
        "transitionClass": "same-object-set-boundary",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition stays in the current object set and changes area."
      },
      "simon": {
        "beforeX": "0x14",
        "afterX": "0xE9",
        "beforeY": "0x6D",
        "afterY": "0x6D",
        "beforeSpriteTop": "0x61",
        "afterSpriteTop": "0x61"
      },
      "cameraChangedMetrics": [
        "scrollXLow",
        "scrollYLow",
        "coarseX",
        "nametableX",
        "nametableY"
      ],
      "routineAfterBytes": {
        "0x0070": "0x96",
        "0x0071": "0xA2",
        "0x0072": "0xF8",
        "0x0073": "0xA1"
      },
      "routineWriteCounts": {
        "0x0070": 1,
        "0x0071": 1,
        "0x0072": 1,
        "0x0073": 1
      }
    },
    {
      "edgeId": "boundary-transition:obj04-area01-sub00->obj01-area04-sub00:left",
      "stepId": "deborah-cliff-to-bodley-door",
      "probeId": "deborah-cliff-tornado-transport",
      "matchStatus": "source-area-candidate",
      "status": "complete",
      "type": "special-transport",
      "transitionBytes": [
        "0xFF",
        "0x01",
        "0x04"
      ],
      "transitionSemantics": {
        "transitionClass": "special-transport-candidate",
        "placementMode": "connector-only",
        "ordinaryAdjacency": false,
        "coordinateConfidence": "endpoint-known-position-unknown",
        "note": "This edge should be rendered as a connector until the transport event coordinates are decoded."
      },
      "simon": {
        "beforeX": "0x27",
        "afterX": "0xE7",
        "beforeY": "0x6F",
        "afterY": "0xBA",
        "beforeSpriteTop": "0x63",
        "afterSpriteTop": "0xAE"
      },
      "cameraChangedMetrics": [
        "scrollYLow",
        "coarseY",
        "fineY"
      ],
      "routineAfterBytes": {
        "0x0070": "0xCF",
        "0x0071": "0x87",
        "0x0072": "0xCE",
        "0x0073": "0x87"
      },
      "routineWriteCounts": {
        "0x0070": 2,
        "0x0071": 2,
        "0x0072": 2,
        "0x0073": 2
      }
    }
  ],
  "byteRoleHypotheses": {
    "promoted": [
      {
        "id": "simon-screen-center-x-0348",
        "status": "promoted",
        "address": "0x0348",
        "evidence": "10 matched transition steps",
        "note": "Inherited from transition probe analysis; this is a sprite-staging placement evidence field, not a ROM table by itself."
      },
      {
        "id": "routine-output-byte-matrix",
        "status": "promoted",
        "addresses": [
          "0x0070",
          "0x0071",
          "0x0072",
          "0x0073"
        ],
        "evidence": "10/10 transitions have all routine bytes written in the transition routine window.",
        "note": "$70-$73 are promoted as observed transition routine output bytes, with role decoding still separate."
      }
    ],
    "diagnostic": [
      {
        "id": "visible-y-direct-byte-role",
        "status": "diagnostic",
        "yDeltaSteps": [
          "castlevania-to-bridge",
          "deborah-cliff-to-bodley-door",
          "jova-interior-to-town",
          "jova-town-to-interior"
        ],
        "directYMatches": [
          {
            "address": "0x0070",
            "afterCenterMatches": [],
            "afterSpriteTopMatches": []
          },
          {
            "address": "0x0071",
            "afterCenterMatches": [],
            "afterSpriteTopMatches": []
          },
          {
            "address": "0x0072",
            "afterCenterMatches": [],
            "afterSpriteTopMatches": []
          },
          {
            "address": "0x0073",
            "afterCenterMatches": [],
            "afterSpriteTopMatches": [
              "castlevania-to-bridge"
            ]
          }
        ],
        "note": "No routine byte is promoted as a complete visible-Y formula yet; partial matches are retained for routine reading."
      },
      {
        "id": "special-transport-double-write",
        "status": "diagnostic",
        "stepId": "deborah-cliff-to-bodley-door",
        "writeCounts": {
          "0x0070": 2,
          "0x0071": 2,
          "0x0072": 2,
          "0x0073": 2
        },
        "note": "Deborah Cliff writes each routine byte twice before reaching Bodley Mansion - Door, so transport remains a special diagnostic path."
      },
      {
        "id": "camera-scroll-byte-role",
        "status": "diagnostic",
        "note": "Camera/scroll changes are preserved per transition, but no direct $70-$73 to PPU scroll rule is promoted."
      }
    ],
    "unresolved": [
      {
        "id": "trace-pc-alignment",
        "status": "unresolved",
        "note": "ROM byte windows are included so the write PCs can be aligned to actual instructions in a later routine read."
      },
      {
        "id": "full-placement-camera-equation",
        "status": "unresolved",
        "note": "The current fixtures prove byte writes and selected outputs; they do not yet decode a complete formula for all transition classes."
      }
    ]
  },
  "compositionHints": {
    "status": "evidence-model",
    "handPlacedCoordinates": 0,
    "edgeEvidence": [
      {
        "edgeId": "boundary-transition:obj02-area00-sub00->obj00-area00-sub00:left",
        "stepId": "woods-to-jova",
        "probeId": "jova-woods-left-round-trip",
        "matchStatus": "direct",
        "status": "complete",
        "type": "outdoor-horizontal",
        "transitionBytes": [
          "0xFF",
          "0x00",
          "0x00"
        ],
        "transitionSemantics": {
          "transitionClass": "object-set-boundary",
          "placementMode": "ordinary-adjacency",
          "ordinaryAdjacency": true,
          "coordinateConfidence": "horizontal-side-only",
          "note": "Transition crosses to an area that may use another object set."
        },
        "simon": {
          "beforeX": "0x30",
          "afterX": "0xE9",
          "beforeY": "0xBA",
          "afterY": "0xBA",
          "beforeSpriteTop": "0xAE",
          "afterSpriteTop": "0xAE"
        },
        "cameraChangedMetrics": [
          "scrollYLow",
          "coarseY",
          "nametableX"
        ],
        "routineAfterBytes": {
          "0x0070": "0x86",
          "0x0071": "0xFA",
          "0x0072": "0x50",
          "0x0073": "0xFA"
        },
        "routineWriteCounts": {
          "0x0070": 1,
          "0x0071": 1,
          "0x0072": 1,
          "0x0073": 1
        }
      },
      {
        "edgeId": "boundary-transition:obj00-area00-sub00->obj02-area00-sub00:right",
        "stepId": "jova-to-woods",
        "probeId": "jova-woods-left-round-trip",
        "matchStatus": "direct",
        "status": "complete",
        "type": "outdoor-horizontal-return",
        "transitionBytes": [
          "0xFF",
          "0x02",
          "0x00"
        ],
        "transitionSemantics": {
          "transitionClass": "object-set-boundary",
          "placementMode": "ordinary-adjacency",
          "ordinaryAdjacency": true,
          "coordinateConfidence": "horizontal-side-only",
          "note": "Transition crosses to an area that may use another object set."
        },
        "simon": {
          "beforeX": "0xE9",
          "afterX": "0x10",
          "beforeY": "0xBA",
          "afterY": "0xBA",
          "beforeSpriteTop": "0xAE",
          "afterSpriteTop": "0xAE"
        },
        "cameraChangedMetrics": [
          "scrollYLow",
          "coarseY",
          "nametableX"
        ],
        "routineAfterBytes": {
          "0x0070": "0x3E",
          "0x0071": "0xA2",
          "0x0072": "0x21",
          "0x0073": "0xA2"
        },
        "routineWriteCounts": {
          "0x0070": 1,
          "0x0071": 1,
          "0x0072": 1,
          "0x0073": 1
        }
      },
      {
        "edgeId": "boundary-transition:obj05-area00-sub00->obj04-area03-sub01:left",
        "stepId": "castlevania-to-bridge",
        "probeId": "castlevania-bridge-round-trip",
        "matchStatus": "direct",
        "status": "complete",
        "type": "final-area-exit",
        "transitionBytes": [
          "0xFF",
          "0x04",
          "0x03"
        ],
        "transitionSemantics": {
          "transitionClass": "object-set-boundary",
          "placementMode": "ordinary-adjacency",
          "ordinaryAdjacency": true,
          "coordinateConfidence": "horizontal-side-only",
          "note": "Transition crosses to an area that may use another object set."
        },
        "simon": {
          "beforeX": "0x14",
          "afterX": "0xE9",
          "beforeY": "0x8C",
          "afterY": "0xBA",
          "beforeSpriteTop": "0x80",
          "afterSpriteTop": "0xAE"
        },
        "cameraChangedMetrics": [
          "scrollYLow",
          "coarseY",
          "fineY",
          "nametableX"
        ],
        "routineAfterBytes": {
          "0x0070": "0x22",
          "0x0071": "0xAF",
          "0x0072": "0xFD",
          "0x0073": "0xAE"
        },
        "routineWriteCounts": {
          "0x0070": 1,
          "0x0071": 1,
          "0x0072": 1,
          "0x0073": 1
        }
      },
      {
        "edgeId": "boundary-transition:obj04-area03-sub01->obj05-area00-sub00:right",
        "stepId": "bridge-to-castlevania",
        "probeId": "castlevania-bridge-round-trip",
        "matchStatus": "direct",
        "status": "complete",
        "type": "final-area-entry",
        "transitionBytes": [
          "0xFF",
          "0x05",
          "0x00"
        ],
        "transitionSemantics": {
          "transitionClass": "object-set-boundary",
          "placementMode": "ordinary-adjacency",
          "ordinaryAdjacency": true,
          "coordinateConfidence": "horizontal-side-only",
          "note": "Transition crosses to an area that may use another object set."
        },
        "simon": {
          "beforeX": "0xE9",
          "afterX": "0x10",
          "beforeY": "0xBA",
          "afterY": "0xBA",
          "beforeSpriteTop": "0xAE",
          "afterSpriteTop": "0xAE"
        },
        "cameraChangedMetrics": [
          "nametableX"
        ],
        "routineAfterBytes": {
          "0x0070": "0x82",
          "0x0071": "0xBC",
          "0x0072": "0x68",
          "0x0073": "0xBC"
        },
        "routineWriteCounts": {
          "0x0070": 1,
          "0x0071": 1,
          "0x0072": 1,
          "0x0073": 1
        }
      },
      {
        "edgeId": "boundary-transition:obj02-area09-sub00->obj02-area08-sub02:left",
        "stepId": "dora-part-3-to-part-2",
        "probeId": "dora-woods-part-3-left",
        "matchStatus": "direct",
        "status": "complete",
        "type": "outdoor-horizontal-vertical-delta",
        "transitionBytes": [
          "0x00",
          "0x00",
          "0x08"
        ],
        "transitionSemantics": {
          "transitionClass": "same-object-set-boundary",
          "placementMode": "ordinary-adjacency",
          "ordinaryAdjacency": true,
          "coordinateConfidence": "horizontal-side-only",
          "note": "Transition stays in the current object set and changes area."
        },
        "simon": {
          "beforeX": "0x14",
          "afterX": "0xE9",
          "beforeY": "0x6D",
          "afterY": "0x6D",
          "beforeSpriteTop": "0x61",
          "afterSpriteTop": "0x61"
        },
        "cameraChangedMetrics": [
          "scrollXLow",
          "scrollYLow",
          "coarseX",
          "nametableX",
          "nametableY"
        ],
        "routineAfterBytes": {
          "0x0070": "0x96",
          "0x0071": "0xA2",
          "0x0072": "0xF8",
          "0x0073": "0xA1"
        },
        "routineWriteCounts": {
          "0x0070": 1,
          "0x0071": 1,
          "0x0072": 1,
          "0x0073": 1
        }
      },
      {
        "edgeId": "boundary-transition:obj04-area01-sub00->obj01-area04-sub00:left",
        "stepId": "deborah-cliff-to-bodley-door",
        "probeId": "deborah-cliff-tornado-transport",
        "matchStatus": "source-area-candidate",
        "status": "complete",
        "type": "special-transport",
        "transitionBytes": [
          "0xFF",
          "0x01",
          "0x04"
        ],
        "transitionSemantics": {
          "transitionClass": "special-transport-candidate",
          "placementMode": "connector-only",
          "ordinaryAdjacency": false,
          "coordinateConfidence": "endpoint-known-position-unknown",
          "note": "This edge should be rendered as a connector until the transport event coordinates are decoded."
        },
        "simon": {
          "beforeX": "0x27",
          "afterX": "0xE7",
          "beforeY": "0x6F",
          "afterY": "0xBA",
          "beforeSpriteTop": "0x63",
          "afterSpriteTop": "0xAE"
        },
        "cameraChangedMetrics": [
          "scrollYLow",
          "coarseY",
          "fineY"
        ],
        "routineAfterBytes": {
          "0x0070": "0xCF",
          "0x0071": "0x87",
          "0x0072": "0xCE",
          "0x0073": "0x87"
        },
        "routineWriteCounts": {
          "0x0070": 2,
          "0x0071": 2,
          "0x0072": 2,
          "0x0073": 2
        }
      }
    ],
    "defaultUse": "Use direct routine evidence to increase placement confidence, but keep connector-only and unresolved edges labeled unless a true spatial rule is decoded."
  }
};
