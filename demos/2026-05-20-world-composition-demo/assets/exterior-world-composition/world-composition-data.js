window.EXTERIOR_WORLD_COMPOSITION = {
  "schemaVersion": 1,
  "source": {
    "renderer": "rom-derived-exterior-world-composition",
    "topologyFile": "out/exterior-topology/topology.json",
    "recipeAtlasFile": "out/render-recipe-atlas/manifest.json",
    "transitionRulesFile": "out/transition-routine/decoder.json",
    "notes": [
      "Every rendered area comes from topology nodes and recipe-atlas images.",
      "No per-area hand coordinates are used.",
      "Routine decoder evidence changes confidence labels, not coordinates, unless a decoded spatial rule exists.",
      "Generic solver row shifts are labeled as solver-derived layout choices, not ROM-derived world coordinates."
    ]
  },
  "world": {
    "variant": "day",
    "status": "constraint-composition-draft",
    "note": "Full exterior graph composition driven by ROM topology, recipe-atlas dimensions, transition routine evidence, and deterministic solver layout."
  },
  "summary": {
    "areas": 32,
    "topologyAreas": 32,
    "nodes": 55,
    "topologyNodes": 55,
    "constraints": 87,
    "submapSequenceConstraints": 23,
    "boundaryConstraints": 64,
    "solvedConstraints": 68,
    "connectorOnlyTransitions": 1,
    "unresolvedConstraints": 1,
    "conflictConstraints": 17,
    "routineSupportedConstraints": 6,
    "deterministicSolverPlacements": 12,
    "genericOverlapShifts": 10,
    "handPlacedCoordinates": 0,
    "skippedAreas": 0,
    "skippedNodes": 0,
    "width": 15936,
    "height": 4864,
    "margin": 32,
    "normalizedShift": {
      "shiftX": 7200,
      "shiftY": 32
    },
    "output": "world.png",
    "groupsByArea": 32
  },
  "placements": [
    {
      "id": "obj00-area00",
      "label": "Town of Jova",
      "category": "town-exteriors",
      "objset": "0x00",
      "area": "0x00",
      "x": 7200,
      "y": 32,
      "width": 1024,
      "height": 448,
      "placementSource": "deterministic-component-root",
      "source": {
        "areaGrouping": "rom-topology-area",
        "submapOrder": "cv2r-submap-order",
        "dimensions": "recipe-atlas-layout-header"
      },
      "nodePlacements": [
        {
          "nodeId": "obj00-area00-sub00",
          "atlasId": "obj00-area00-sub00-town-of-jova",
          "entryId": "obj00-area00-sub00-town-of-jova-day",
          "name": "Town of Jova",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "validated",
          "renderStatus": "rendered",
          "width": 1024,
          "height": 448,
          "relativeX": 0,
          "relativeY": 0,
          "output": "images/obj00-area00-sub00-town-of-jova-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj00-area00-sub00-town-of-jova-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "address": "0x9EA2",
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
            }
          },
          "x": 7200,
          "y": 32
        }
      ]
    },
    {
      "id": "obj02-area00",
      "label": "Jova Woods -> Veros Woods - Part 2",
      "category": "western-overworld",
      "objset": "0x02",
      "area": "0x00",
      "x": 8224,
      "y": 32,
      "width": 3072,
      "height": 448,
      "placementSource": "rom-topology-side",
      "source": {
        "areaGrouping": "rom-topology-area",
        "submapOrder": "cv2r-submap-order",
        "dimensions": "recipe-atlas-layout-header"
      },
      "nodePlacements": [
        {
          "nodeId": "obj02-area00-sub00",
          "atlasId": "obj02-area00-sub00-jova-woods",
          "entryId": "obj02-area00-sub00-jova-woods-day",
          "name": "Jova Woods",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "validated",
          "renderStatus": "rendered",
          "width": 1024,
          "height": 224,
          "relativeX": 0,
          "relativeY": 0,
          "output": "images/obj02-area00-sub00-jova-woods-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj02-area00-sub00-jova-woods-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "address": "0x9FC6",
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
            }
          },
          "x": 8224,
          "y": 32
        },
        {
          "nodeId": "obj02-area00-sub01",
          "atlasId": "obj02-area00-sub01-south-bridge",
          "entryId": "obj02-area00-sub01-south-bridge-day",
          "name": "South Bridge",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 1024,
          "height": 224,
          "relativeX": 1024,
          "relativeY": 0,
          "output": "images/obj02-area00-sub01-south-bridge-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj02-area00-sub01-south-bridge-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
            }
          },
          "x": 9248,
          "y": 32
        },
        {
          "nodeId": "obj02-area00-sub02",
          "atlasId": "obj02-area00-sub02-veros-woods-part-1",
          "entryId": "obj02-area00-sub02-veros-woods-part-1-day",
          "name": "Veros Woods - Part 1",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 512,
          "height": 224,
          "relativeX": 2048,
          "relativeY": 0,
          "output": "images/obj02-area00-sub02-veros-woods-part-1-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj02-area00-sub02-veros-woods-part-1-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "address": "0x9FD7",
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
            }
          },
          "x": 10272,
          "y": 32
        },
        {
          "nodeId": "obj02-area00-sub03",
          "atlasId": "obj02-area00-sub03-veros-woods-part-2",
          "entryId": "obj02-area00-sub03-veros-woods-part-2-day",
          "name": "Veros Woods - Part 2",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 512,
          "height": 448,
          "relativeX": 2560,
          "relativeY": 0,
          "output": "images/obj02-area00-sub03-veros-woods-part-2-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj02-area00-sub03-veros-woods-part-2-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "address": "0x9FD7",
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
            }
          },
          "x": 10784,
          "y": 32
        }
      ]
    },
    {
      "id": "obj02-area07",
      "label": "Dead River - Part 2 -> Belasco Marsh",
      "category": "western-overworld",
      "objset": "0x02",
      "area": "0x07",
      "x": 5152,
      "y": 32,
      "width": 2048,
      "height": 224,
      "placementSource": "rom-topology-side",
      "source": {
        "areaGrouping": "rom-topology-area",
        "submapOrder": "cv2r-submap-order",
        "dimensions": "recipe-atlas-layout-header"
      },
      "nodePlacements": [
        {
          "nodeId": "obj02-area07-sub00",
          "atlasId": "obj02-area07-sub00-dead-river-part-2",
          "entryId": "obj02-area07-sub00-dead-river-part-2-day",
          "name": "Dead River - Part 2",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 512,
          "height": 224,
          "relativeX": 0,
          "relativeY": 0,
          "output": "images/obj02-area07-sub00-dead-river-part-2-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj02-area07-sub00-dead-river-part-2-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
            }
          },
          "x": 5152,
          "y": 32
        },
        {
          "nodeId": "obj02-area07-sub01",
          "atlasId": "obj02-area07-sub01-dead-river-part-1",
          "entryId": "obj02-area07-sub01-dead-river-part-1-day",
          "name": "Dead River - Part 1",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 512,
          "height": 224,
          "relativeX": 512,
          "relativeY": 0,
          "output": "images/obj02-area07-sub01-dead-river-part-1-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj02-area07-sub01-dead-river-part-1-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
            }
          },
          "x": 5664,
          "y": 32
        },
        {
          "nodeId": "obj02-area07-sub02",
          "atlasId": "obj02-area07-sub02-belasco-marsh",
          "entryId": "obj02-area07-sub02-belasco-marsh-day",
          "name": "Belasco Marsh",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 1024,
          "height": 224,
          "relativeX": 1024,
          "relativeY": 0,
          "output": "images/obj02-area07-sub02-belasco-marsh-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj02-area07-sub02-belasco-marsh-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "address": "0x9FC6",
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
            }
          },
          "x": 6176,
          "y": 32
        }
      ]
    },
    {
      "id": "obj00-area01",
      "label": "Town of Veros",
      "category": "town-exteriors",
      "objset": "0x00",
      "area": "0x01",
      "x": 11296,
      "y": 32,
      "width": 1024,
      "height": 224,
      "placementSource": "rom-topology-side",
      "source": {
        "areaGrouping": "rom-topology-area",
        "submapOrder": "cv2r-submap-order",
        "dimensions": "recipe-atlas-layout-header"
      },
      "nodePlacements": [
        {
          "nodeId": "obj00-area01-sub00",
          "atlasId": "obj00-area01-sub00-town-of-veros",
          "entryId": "obj00-area01-sub00-town-of-veros-day",
          "name": "Town of Veros",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 1024,
          "height": 224,
          "relativeX": 0,
          "relativeY": 0,
          "output": "images/obj00-area01-sub00-town-of-veros-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj00-area01-sub00-town-of-veros-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "address": "0x9EB3",
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
            }
          },
          "x": 11296,
          "y": 32
        }
      ]
    },
    {
      "id": "obj02-area01",
      "label": "Denis Woods - Part 1",
      "category": "western-overworld",
      "objset": "0x02",
      "area": "0x01",
      "x": 11296,
      "y": 992,
      "width": 512,
      "height": 224,
      "placementSource": "rom-topology-side-plus-deterministic-overlap-solver",
      "source": {
        "areaGrouping": "rom-topology-area",
        "submapOrder": "cv2r-submap-order",
        "dimensions": "recipe-atlas-layout-header"
      },
      "nodePlacements": [
        {
          "nodeId": "obj02-area01-sub00",
          "atlasId": "obj02-area01-sub00-denis-woods-part-1",
          "entryId": "obj02-area01-sub00-denis-woods-part-1-day",
          "name": "Denis Woods - Part 1",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 512,
          "height": 224,
          "relativeX": 0,
          "relativeY": 0,
          "output": "images/obj02-area01-sub00-denis-woods-part-1-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj02-area01-sub00-denis-woods-part-1-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "address": "0x9FD7",
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
            }
          },
          "x": 11296,
          "y": 992
        }
      ]
    },
    {
      "id": "obj00-area03",
      "label": "Town of Alba",
      "category": "town-exteriors",
      "objset": "0x00",
      "area": "0x03",
      "x": 4128,
      "y": 32,
      "width": 1024,
      "height": 672,
      "placementSource": "rom-topology-side",
      "source": {
        "areaGrouping": "rom-topology-area",
        "submapOrder": "cv2r-submap-order",
        "dimensions": "recipe-atlas-layout-header"
      },
      "nodePlacements": [
        {
          "nodeId": "obj00-area03-sub00",
          "atlasId": "obj00-area03-sub00-town-of-alba",
          "entryId": "obj00-area03-sub00-town-of-alba-day",
          "name": "Town of Alba",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 1024,
          "height": 672,
          "relativeX": 0,
          "relativeY": 0,
          "output": "images/obj00-area03-sub00-town-of-alba-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj00-area03-sub00-town-of-alba-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "address": "0x9ED5",
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
            }
          },
          "x": 4128,
          "y": 32
        }
      ]
    },
    {
      "id": "obj02-area06",
      "label": "Dead River to Brahm",
      "category": "western-overworld",
      "objset": "0x02",
      "area": "0x06",
      "x": 4640,
      "y": 992,
      "width": 512,
      "height": 224,
      "placementSource": "rom-topology-side-plus-deterministic-overlap-solver",
      "source": {
        "areaGrouping": "rom-topology-area",
        "submapOrder": "cv2r-submap-order",
        "dimensions": "recipe-atlas-layout-header"
      },
      "nodePlacements": [
        {
          "nodeId": "obj02-area06-sub00",
          "atlasId": "obj02-area06-sub00-dead-river-to-brahm",
          "entryId": "obj02-area06-sub00-dead-river-to-brahm-day",
          "name": "Dead River to Brahm",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 512,
          "height": 224,
          "relativeX": 0,
          "relativeY": 0,
          "output": "images/obj02-area06-sub00-dead-river-to-brahm-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj02-area06-sub00-dead-river-to-brahm-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
            }
          },
          "x": 4640,
          "y": 992
        }
      ]
    },
    {
      "id": "obj02-area03",
      "label": "Dabis Path - Part 1 -> Aljiba Woods - Part 2",
      "category": "western-overworld",
      "objset": "0x02",
      "area": "0x03",
      "x": 12320,
      "y": 32,
      "width": 2048,
      "height": 448,
      "placementSource": "rom-topology-side",
      "source": {
        "areaGrouping": "rom-topology-area",
        "submapOrder": "cv2r-submap-order",
        "dimensions": "recipe-atlas-layout-header"
      },
      "nodePlacements": [
        {
          "nodeId": "obj02-area03-sub00",
          "atlasId": "obj02-area03-sub00-dabis-path-part-1",
          "entryId": "obj02-area03-sub00-dabis-path-part-1-day",
          "name": "Dabis Path - Part 1",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "validated",
          "renderStatus": "rendered",
          "width": 512,
          "height": 448,
          "relativeX": 0,
          "relativeY": 0,
          "output": "images/obj02-area03-sub00-dabis-path-part-1-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj02-area03-sub00-dabis-path-part-1-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "address": "0xA00A",
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
            }
          },
          "x": 12320,
          "y": 32
        },
        {
          "nodeId": "obj02-area03-sub01",
          "atlasId": "obj02-area03-sub01-dabis-path-part-2",
          "entryId": "obj02-area03-sub01-dabis-path-part-2-day",
          "name": "Dabis Path - Part 2",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 512,
          "height": 224,
          "relativeX": 512,
          "relativeY": 0,
          "output": "images/obj02-area03-sub01-dabis-path-part-2-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj02-area03-sub01-dabis-path-part-2-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "address": "0xA00A",
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
            }
          },
          "x": 12832,
          "y": 32
        },
        {
          "nodeId": "obj02-area03-sub02",
          "atlasId": "obj02-area03-sub02-aljiba-woods-part-1",
          "entryId": "obj02-area03-sub02-aljiba-woods-part-1-day",
          "name": "Aljiba Woods - Part 1",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 512,
          "height": 224,
          "relativeX": 1024,
          "relativeY": 0,
          "output": "images/obj02-area03-sub02-aljiba-woods-part-1-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj02-area03-sub02-aljiba-woods-part-1-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "address": "0x9FD7",
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
            }
          },
          "x": 13344,
          "y": 32
        },
        {
          "nodeId": "obj02-area03-sub03",
          "atlasId": "obj02-area03-sub03-aljiba-woods-part-2",
          "entryId": "obj02-area03-sub03-aljiba-woods-part-2-day",
          "name": "Aljiba Woods - Part 2",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 512,
          "height": 448,
          "relativeX": 1536,
          "relativeY": 0,
          "output": "images/obj02-area03-sub03-aljiba-woods-part-2-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj02-area03-sub03-aljiba-woods-part-2-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "address": "0x9FD7",
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
            }
          },
          "x": 13856,
          "y": 32
        }
      ]
    },
    {
      "id": "obj01-area02",
      "label": "Lauber Mansion - Door",
      "category": "mansion-door-exteriors",
      "objset": "0x01",
      "area": "0x02",
      "x": 11040,
      "y": 992,
      "width": 256,
      "height": 224,
      "placementSource": "rom-topology-side-plus-deterministic-overlap-solver",
      "source": {
        "areaGrouping": "rom-topology-area",
        "submapOrder": "cv2r-submap-order",
        "dimensions": "recipe-atlas-layout-header"
      },
      "nodePlacements": [
        {
          "nodeId": "obj01-area02-sub00",
          "atlasId": "obj01-area02-sub00-lauber-mansion-door",
          "entryId": "obj01-area02-sub00-lauber-mansion-door-day",
          "name": "Lauber Mansion - Door",
          "access": "mansion-door",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 256,
          "height": 224,
          "relativeX": 0,
          "relativeY": 0,
          "output": "images/obj01-area02-sub00-lauber-mansion-door-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj01-area02-sub00-lauber-mansion-door-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "address": "0x9F78",
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
            }
          },
          "x": 11040,
          "y": 992
        }
      ]
    },
    {
      "id": "obj01-area01",
      "label": "Berkeley Mansion - Door",
      "category": "mansion-door-exteriors",
      "objset": "0x01",
      "area": "0x01",
      "x": 11808,
      "y": 992,
      "width": 256,
      "height": 224,
      "placementSource": "rom-topology-side",
      "source": {
        "areaGrouping": "rom-topology-area",
        "submapOrder": "cv2r-submap-order",
        "dimensions": "recipe-atlas-layout-header"
      },
      "nodePlacements": [
        {
          "nodeId": "obj01-area01-sub00",
          "atlasId": "obj01-area01-sub00-berkeley-mansion-door",
          "entryId": "obj01-area01-sub00-berkeley-mansion-door-day",
          "name": "Berkeley Mansion - Door",
          "access": "mansion-door",
          "variant": "day",
          "recipeStatus": "validated",
          "renderStatus": "rendered",
          "width": 256,
          "height": 224,
          "relativeX": 0,
          "relativeY": 0,
          "output": "images/obj01-area01-sub00-berkeley-mansion-door-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj01-area01-sub00-berkeley-mansion-door-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "address": "0x9F5E",
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
            }
          },
          "x": 11808,
          "y": 992
        }
      ]
    },
    {
      "id": "obj03-area02",
      "label": "Sadam Woods - Part 2 -> Sadam Woods - Part 1",
      "category": "eastern-overworld",
      "objset": "0x03",
      "area": "0x02",
      "x": 3104,
      "y": 32,
      "width": 1024,
      "height": 448,
      "placementSource": "rom-topology-side",
      "source": {
        "areaGrouping": "rom-topology-area",
        "submapOrder": "cv2r-submap-order",
        "dimensions": "recipe-atlas-layout-header"
      },
      "nodePlacements": [
        {
          "nodeId": "obj03-area02-sub00",
          "atlasId": "obj03-area02-sub00-sadam-woods-part-2",
          "entryId": "obj03-area02-sub00-sadam-woods-part-2-day",
          "name": "Sadam Woods - Part 2",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 512,
          "height": 448,
          "relativeX": 0,
          "relativeY": 0,
          "output": "images/obj03-area02-sub00-sadam-woods-part-2-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj03-area02-sub00-sadam-woods-part-2-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "address": "0xA081",
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
            }
          },
          "x": 3104,
          "y": 32
        },
        {
          "nodeId": "obj03-area02-sub01",
          "atlasId": "obj03-area02-sub01-sadam-woods-part-1",
          "entryId": "obj03-area02-sub01-sadam-woods-part-1-day",
          "name": "Sadam Woods - Part 1",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 512,
          "height": 224,
          "relativeX": 512,
          "relativeY": 0,
          "output": "images/obj03-area02-sub01-sadam-woods-part-1-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj03-area02-sub01-sadam-woods-part-1-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "address": "0xA081",
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
            }
          },
          "x": 3616,
          "y": 32
        }
      ]
    },
    {
      "id": "obj01-area03",
      "label": "Brahm's Mansion - Door",
      "category": "mansion-door-exteriors",
      "objset": "0x01",
      "area": "0x03",
      "x": 4384,
      "y": 992,
      "width": 256,
      "height": 224,
      "placementSource": "rom-topology-side",
      "source": {
        "areaGrouping": "rom-topology-area",
        "submapOrder": "cv2r-submap-order",
        "dimensions": "recipe-atlas-layout-header"
      },
      "nodePlacements": [
        {
          "nodeId": "obj01-area03-sub00",
          "atlasId": "obj01-area03-sub00-brahm-s-mansion-door",
          "entryId": "obj01-area03-sub00-brahm-s-mansion-door-day",
          "name": "Brahm's Mansion - Door",
          "access": "mansion-door",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 256,
          "height": 224,
          "relativeX": 0,
          "relativeY": 0,
          "output": "images/obj01-area03-sub00-brahm-s-mansion-door-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj01-area03-sub00-brahm-s-mansion-door-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "address": "0x9F92",
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
            }
          },
          "x": 4384,
          "y": 992
        }
      ]
    },
    {
      "id": "obj02-area02",
      "label": "Aljiba Woods - Part 3",
      "category": "western-overworld",
      "objset": "0x02",
      "area": "0x02",
      "x": 14368,
      "y": 32,
      "width": 512,
      "height": 224,
      "placementSource": "rom-topology-side",
      "source": {
        "areaGrouping": "rom-topology-area",
        "submapOrder": "cv2r-submap-order",
        "dimensions": "recipe-atlas-layout-header"
      },
      "nodePlacements": [
        {
          "nodeId": "obj02-area02-sub00",
          "atlasId": "obj02-area02-sub00-aljiba-woods-part-3",
          "entryId": "obj02-area02-sub00-aljiba-woods-part-3-day",
          "name": "Aljiba Woods - Part 3",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 512,
          "height": 224,
          "relativeX": 0,
          "relativeY": 0,
          "output": "images/obj02-area02-sub00-aljiba-woods-part-3-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj02-area02-sub00-aljiba-woods-part-3-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "address": "0x9FD7",
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
            }
          },
          "x": 14368,
          "y": 32
        }
      ]
    },
    {
      "id": "obj02-area04",
      "label": "Denis Woods - Part 2 -> Denis Woods - Part 3",
      "category": "western-overworld",
      "objset": "0x02",
      "area": "0x04",
      "x": 11040,
      "y": 1952,
      "width": 1280,
      "height": 224,
      "placementSource": "rom-topology-side-plus-deterministic-overlap-solver",
      "source": {
        "areaGrouping": "rom-topology-area",
        "submapOrder": "cv2r-submap-order",
        "dimensions": "recipe-atlas-layout-header"
      },
      "nodePlacements": [
        {
          "nodeId": "obj02-area04-sub00",
          "atlasId": "obj02-area04-sub00-denis-woods-part-2",
          "entryId": "obj02-area04-sub00-denis-woods-part-2-day",
          "name": "Denis Woods - Part 2",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 768,
          "height": 224,
          "relativeX": 0,
          "relativeY": 0,
          "output": "images/obj02-area04-sub00-denis-woods-part-2-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj02-area04-sub00-denis-woods-part-2-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "address": "0x9FD7",
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
            }
          },
          "x": 11040,
          "y": 1952
        },
        {
          "nodeId": "obj02-area04-sub01",
          "atlasId": "obj02-area04-sub01-denis-woods-part-3",
          "entryId": "obj02-area04-sub01-denis-woods-part-3-day",
          "name": "Denis Woods - Part 3",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 512,
          "height": 224,
          "relativeX": 768,
          "relativeY": 0,
          "output": "images/obj02-area04-sub01-denis-woods-part-3-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj02-area04-sub01-denis-woods-part-3-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "address": "0x9FD7",
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
            }
          },
          "x": 11808,
          "y": 1952
        }
      ]
    },
    {
      "id": "obj02-area05",
      "label": "Yuba Lake Path -> Yuba Lake",
      "category": "western-overworld",
      "objset": "0x02",
      "area": "0x05",
      "x": 14368,
      "y": 992,
      "width": 1280,
      "height": 448,
      "placementSource": "rom-topology-side-plus-deterministic-overlap-solver",
      "source": {
        "areaGrouping": "rom-topology-area",
        "submapOrder": "cv2r-submap-order",
        "dimensions": "recipe-atlas-layout-header"
      },
      "nodePlacements": [
        {
          "nodeId": "obj02-area05-sub00",
          "atlasId": "obj02-area05-sub00-yuba-lake-path",
          "entryId": "obj02-area05-sub00-yuba-lake-path-day",
          "name": "Yuba Lake Path",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 1024,
          "height": 224,
          "relativeX": 0,
          "relativeY": 0,
          "output": "images/obj02-area05-sub00-yuba-lake-path-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj02-area05-sub00-yuba-lake-path-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "address": "0xA00A",
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
            }
          },
          "x": 14368,
          "y": 992
        },
        {
          "nodeId": "obj02-area05-sub01",
          "atlasId": "obj02-area05-sub01-yuba-lake",
          "entryId": "obj02-area05-sub01-yuba-lake-day",
          "name": "Yuba Lake",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 256,
          "height": 448,
          "relativeX": 1024,
          "relativeY": 0,
          "output": "images/obj02-area05-sub01-yuba-lake-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj02-area05-sub01-yuba-lake-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
            }
          },
          "x": 15392,
          "y": 992
        }
      ]
    },
    {
      "id": "obj03-area01",
      "label": "Storigoi Graveyard (Blob Boost)",
      "category": "eastern-overworld",
      "objset": "0x03",
      "area": "0x01",
      "x": 2080,
      "y": 32,
      "width": 1024,
      "height": 224,
      "placementSource": "rom-topology-side",
      "source": {
        "areaGrouping": "rom-topology-area",
        "submapOrder": "cv2r-submap-order",
        "dimensions": "recipe-atlas-layout-header"
      },
      "nodePlacements": [
        {
          "nodeId": "obj03-area01-sub00",
          "atlasId": "obj03-area01-sub00-storigoi-graveyard-blob-boost",
          "entryId": "obj03-area01-sub00-storigoi-graveyard-blob-boost-day",
          "name": "Storigoi Graveyard (Blob Boost)",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 1024,
          "height": 224,
          "relativeX": 0,
          "relativeY": 0,
          "output": "images/obj03-area01-sub00-storigoi-graveyard-blob-boost-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj03-area01-sub00-storigoi-graveyard-blob-boost-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "address": "0xA04E",
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
            }
          },
          "x": 2080,
          "y": 32
        }
      ]
    },
    {
      "id": "obj03-area04",
      "label": "Sadam Woods - Part 3",
      "category": "eastern-overworld",
      "objset": "0x03",
      "area": "0x04",
      "x": 2592,
      "y": 992,
      "width": 512,
      "height": 224,
      "placementSource": "rom-topology-side-plus-deterministic-overlap-solver",
      "source": {
        "areaGrouping": "rom-topology-area",
        "submapOrder": "cv2r-submap-order",
        "dimensions": "recipe-atlas-layout-header"
      },
      "nodePlacements": [
        {
          "nodeId": "obj03-area04-sub00",
          "atlasId": "obj03-area04-sub00-sadam-woods-part-3",
          "entryId": "obj03-area04-sub00-sadam-woods-part-3-day",
          "name": "Sadam Woods - Part 3",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 512,
          "height": 224,
          "relativeX": 0,
          "relativeY": 0,
          "output": "images/obj03-area04-sub00-sadam-woods-part-3-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj03-area04-sub00-sadam-woods-part-3-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "address": "0xA081",
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
            }
          },
          "x": 2592,
          "y": 992
        }
      ]
    },
    {
      "id": "obj04-area00",
      "label": "Vrad Mountain - Part 2 (Diamond Dude) -> Vrad Mountain - Part 1",
      "category": "mountains-and-castle-approach",
      "objset": "0x04",
      "area": "0x00",
      "x": 2336,
      "y": 1952,
      "width": 2048,
      "height": 224,
      "placementSource": "rom-topology-side-plus-deterministic-overlap-solver",
      "source": {
        "areaGrouping": "rom-topology-area",
        "submapOrder": "cv2r-submap-order",
        "dimensions": "recipe-atlas-layout-header"
      },
      "nodePlacements": [
        {
          "nodeId": "obj04-area00-sub00",
          "atlasId": "obj04-area00-sub00-vrad-mountain-part-2-diamond-dude",
          "entryId": "obj04-area00-sub00-vrad-mountain-part-2-diamond-dude-day",
          "name": "Vrad Mountain - Part 2 (Diamond Dude)",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 1024,
          "height": 224,
          "relativeX": 0,
          "relativeY": 0,
          "output": "images/obj04-area00-sub00-vrad-mountain-part-2-diamond-dude-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj04-area00-sub00-vrad-mountain-part-2-diamond-dude-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "0x06",
              "0x07"
            ],
            "palette": {
              "status": "resolved",
              "variant": "day",
              "address": "0xA0E0",
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
            }
          },
          "x": 2336,
          "y": 1952
        },
        {
          "nodeId": "obj04-area00-sub01",
          "atlasId": "obj04-area00-sub01-vrad-mountain-part-1",
          "entryId": "obj04-area00-sub01-vrad-mountain-part-1-day",
          "name": "Vrad Mountain - Part 1",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 1024,
          "height": 224,
          "relativeX": 1024,
          "relativeY": 0,
          "output": "images/obj04-area00-sub01-vrad-mountain-part-1-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj04-area00-sub01-vrad-mountain-part-1-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "0x06",
              "0x07"
            ],
            "palette": {
              "status": "resolved",
              "variant": "day",
              "address": "0xCAF3",
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
            }
          },
          "x": 3360,
          "y": 1952
        }
      ]
    },
    {
      "id": "obj00-area02",
      "label": "Town of Aljiba",
      "category": "town-exteriors",
      "objset": "0x00",
      "area": "0x02",
      "x": 14880,
      "y": 32,
      "width": 1024,
      "height": 448,
      "placementSource": "rom-topology-side",
      "source": {
        "areaGrouping": "rom-topology-area",
        "submapOrder": "cv2r-submap-order",
        "dimensions": "recipe-atlas-layout-header"
      },
      "nodePlacements": [
        {
          "nodeId": "obj00-area02-sub00",
          "atlasId": "obj00-area02-sub00-town-of-aljiba",
          "entryId": "obj00-area02-sub00-town-of-aljiba-day",
          "name": "Town of Aljiba",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 1024,
          "height": 448,
          "relativeX": 0,
          "relativeY": 0,
          "output": "images/obj00-area02-sub00-town-of-aljiba-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj00-area02-sub00-town-of-aljiba-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "address": "0x9EC4",
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
            }
          },
          "x": 14880,
          "y": 32
        }
      ]
    },
    {
      "id": "obj03-area00",
      "label": "Camilla Cemetery -> Joma Marsh - Part 1",
      "category": "eastern-overworld",
      "objset": "0x03",
      "area": "0x00",
      "x": 32,
      "y": 32,
      "width": 2048,
      "height": 224,
      "placementSource": "rom-topology-side",
      "source": {
        "areaGrouping": "rom-topology-area",
        "submapOrder": "cv2r-submap-order",
        "dimensions": "recipe-atlas-layout-header"
      },
      "nodePlacements": [
        {
          "nodeId": "obj03-area00-sub00",
          "atlasId": "obj03-area00-sub00-camilla-cemetery",
          "entryId": "obj03-area00-sub00-camilla-cemetery-day",
          "name": "Camilla Cemetery",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "validated",
          "renderStatus": "rendered",
          "width": 1024,
          "height": 224,
          "relativeX": 0,
          "relativeY": 0,
          "output": "images/obj03-area00-sub00-camilla-cemetery-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj03-area00-sub00-camilla-cemetery-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "address": "0xA03D",
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
            }
          },
          "x": 32,
          "y": 32
        },
        {
          "nodeId": "obj03-area00-sub01",
          "atlasId": "obj03-area00-sub01-joma-marsh-part-1",
          "entryId": "obj03-area00-sub01-joma-marsh-part-1-day",
          "name": "Joma Marsh - Part 1",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 1024,
          "height": 224,
          "relativeX": 1024,
          "relativeY": 0,
          "output": "images/obj03-area00-sub01-joma-marsh-part-1-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj03-area00-sub01-joma-marsh-part-1-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "address": "0xA070",
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
            }
          },
          "x": 1056,
          "y": 32
        }
      ]
    },
    {
      "id": "obj00-area04",
      "label": "Town of Ondol",
      "category": "town-exteriors",
      "objset": "0x00",
      "area": "0x04",
      "x": 1568,
      "y": 992,
      "width": 1024,
      "height": 672,
      "placementSource": "rom-topology-side",
      "source": {
        "areaGrouping": "rom-topology-area",
        "submapOrder": "cv2r-submap-order",
        "dimensions": "recipe-atlas-layout-header"
      },
      "nodePlacements": [
        {
          "nodeId": "obj00-area04-sub00",
          "atlasId": "obj00-area04-sub00-town-of-ondol",
          "entryId": "obj00-area04-sub00-town-of-ondol-day",
          "name": "Town of Ondol",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "validated",
          "renderStatus": "rendered",
          "width": 1024,
          "height": 672,
          "relativeX": 0,
          "relativeY": 0,
          "output": "images/obj00-area04-sub00-town-of-ondol-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj00-area04-sub00-town-of-ondol-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "address": "0x9EE6",
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
            }
          },
          "x": 1568,
          "y": 992
        }
      ]
    },
    {
      "id": "obj01-area00",
      "label": "Laruba Mansion - Door",
      "category": "mansion-door-exteriors",
      "objset": "0x01",
      "area": "0x00",
      "x": 2080,
      "y": 1952,
      "width": 256,
      "height": 224,
      "placementSource": "rom-topology-side-plus-deterministic-overlap-solver",
      "source": {
        "areaGrouping": "rom-topology-area",
        "submapOrder": "cv2r-submap-order",
        "dimensions": "recipe-atlas-layout-header"
      },
      "nodePlacements": [
        {
          "nodeId": "obj01-area00-sub00",
          "atlasId": "obj01-area00-sub00-laruba-mansion-door",
          "entryId": "obj01-area00-sub00-laruba-mansion-door-day",
          "name": "Laruba Mansion - Door",
          "access": "mansion-door",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 256,
          "height": 224,
          "relativeX": 0,
          "relativeY": 0,
          "output": "images/obj01-area00-sub00-laruba-mansion-door-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj01-area00-sub00-laruba-mansion-door-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "address": "0x9F44",
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
            }
          },
          "x": 2080,
          "y": 1952
        }
      ]
    },
    {
      "id": "obj04-area01",
      "label": "Deborah Cliff (In Tornado) -> Jam Wasteland (Deborah Cliff)",
      "category": "mountains-and-castle-approach",
      "objset": "0x04",
      "area": "0x01",
      "x": 288,
      "y": 992,
      "width": 1280,
      "height": 224,
      "placementSource": "rom-topology-side",
      "source": {
        "areaGrouping": "rom-topology-area",
        "submapOrder": "cv2r-submap-order",
        "dimensions": "recipe-atlas-layout-header"
      },
      "nodePlacements": [
        {
          "nodeId": "obj04-area01-sub00",
          "atlasId": "obj04-area01-sub00-deborah-cliff-in-tornado",
          "entryId": "obj04-area01-sub00-deborah-cliff-in-tornado-day",
          "name": "Deborah Cliff (In Tornado)",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 256,
          "height": 224,
          "relativeX": 0,
          "relativeY": 0,
          "output": "images/obj04-area01-sub00-deborah-cliff-in-tornado-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj04-area01-sub00-deborah-cliff-in-tornado-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "0x06",
              "0x07"
            ],
            "palette": {
              "status": "resolved",
              "variant": "day",
              "address": "0xA0E0",
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
            }
          },
          "x": 288,
          "y": 992
        },
        {
          "nodeId": "obj04-area01-sub01",
          "atlasId": "obj04-area01-sub01-jam-wasteland-deborah-cliff",
          "entryId": "obj04-area01-sub01-jam-wasteland-deborah-cliff-day",
          "name": "Jam Wasteland (Deborah Cliff)",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 1024,
          "height": 224,
          "relativeX": 256,
          "relativeY": 0,
          "output": "images/obj04-area01-sub01-jam-wasteland-deborah-cliff-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj04-area01-sub01-jam-wasteland-deborah-cliff-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "0x06",
              "0x07"
            ],
            "palette": {
              "status": "resolved",
              "variant": "day",
              "address": "0xA0E0",
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
            }
          },
          "x": 544,
          "y": 992
        }
      ]
    },
    {
      "id": "obj03-area03",
      "label": "Joma Marsh - Part 2 -> Debious Woods - Part 1",
      "category": "eastern-overworld",
      "objset": "0x03",
      "area": "0x03",
      "x": 2336,
      "y": 2912,
      "width": 3584,
      "height": 672,
      "placementSource": "rom-topology-side-plus-deterministic-overlap-solver",
      "source": {
        "areaGrouping": "rom-topology-area",
        "submapOrder": "cv2r-submap-order",
        "dimensions": "recipe-atlas-layout-header"
      },
      "nodePlacements": [
        {
          "nodeId": "obj03-area03-sub00",
          "atlasId": "obj03-area03-sub00-joma-marsh-part-2",
          "entryId": "obj03-area03-sub00-joma-marsh-part-2-day",
          "name": "Joma Marsh - Part 2",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 1024,
          "height": 224,
          "relativeX": 0,
          "relativeY": 0,
          "output": "images/obj03-area03-sub00-joma-marsh-part-2-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj03-area03-sub00-joma-marsh-part-2-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "address": "0xA070",
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
            }
          },
          "x": 2336,
          "y": 2912
        },
        {
          "nodeId": "obj03-area03-sub01",
          "atlasId": "obj03-area03-sub01-joma-marsh-part-3-fire-and-skulls",
          "entryId": "obj03-area03-sub01-joma-marsh-part-3-fire-and-skulls-day",
          "name": "Joma Marsh - Part 3 (Fire and Skulls)",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 1024,
          "height": 224,
          "relativeX": 1024,
          "relativeY": 0,
          "output": "images/obj03-area03-sub01-joma-marsh-part-3-fire-and-skulls-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj03-area03-sub01-joma-marsh-part-3-fire-and-skulls-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "address": "0xA092",
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
            }
          },
          "x": 3360,
          "y": 2912
        },
        {
          "nodeId": "obj03-area03-sub02",
          "atlasId": "obj03-area03-sub02-debious-woods-part-3",
          "entryId": "obj03-area03-sub02-debious-woods-part-3-day",
          "name": "Debious Woods - Part 3",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 1024,
          "height": 672,
          "relativeX": 2048,
          "relativeY": 0,
          "output": "images/obj03-area03-sub02-debious-woods-part-3-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj03-area03-sub02-debious-woods-part-3-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "address": "0xA0B4",
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
            }
          },
          "x": 4384,
          "y": 2912
        },
        {
          "nodeId": "obj03-area03-sub03",
          "atlasId": "obj03-area03-sub03-debious-woods-part-2",
          "entryId": "obj03-area03-sub03-debious-woods-part-2-day",
          "name": "Debious Woods - Part 2",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 256,
          "height": 448,
          "relativeX": 3072,
          "relativeY": 0,
          "output": "images/obj03-area03-sub03-debious-woods-part-2-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj03-area03-sub03-debious-woods-part-2-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
            }
          },
          "x": 5408,
          "y": 2912
        },
        {
          "nodeId": "obj03-area03-sub04",
          "atlasId": "obj03-area03-sub04-debious-woods-part-1",
          "entryId": "obj03-area03-sub04-debious-woods-part-1-day",
          "name": "Debious Woods - Part 1",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 256,
          "height": 224,
          "relativeX": 3328,
          "relativeY": 0,
          "output": "images/obj03-area03-sub04-debious-woods-part-1-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj03-area03-sub04-debious-woods-part-1-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
            }
          },
          "x": 5664,
          "y": 2912
        }
      ]
    },
    {
      "id": "obj01-area04",
      "label": "Bodley Mansion - Door",
      "category": "mansion-door-exteriors",
      "objset": "0x01",
      "area": "0x04",
      "x": 7200,
      "y": 3648,
      "width": 256,
      "height": 224,
      "placementSource": "deterministic-connector-layout",
      "source": {
        "areaGrouping": "rom-topology-area",
        "submapOrder": "cv2r-submap-order",
        "dimensions": "recipe-atlas-layout-header"
      },
      "nodePlacements": [
        {
          "nodeId": "obj01-area04-sub00",
          "atlasId": "obj01-area04-sub00-bodley-mansion-door",
          "entryId": "obj01-area04-sub00-bodley-mansion-door-day",
          "name": "Bodley Mansion - Door",
          "access": "mansion-door",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 256,
          "height": 224,
          "relativeX": 0,
          "relativeY": 0,
          "output": "images/obj01-area04-sub00-bodley-mansion-door-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj01-area04-sub00-bodley-mansion-door-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "address": "0x9FAC",
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
            }
          },
          "x": 7200,
          "y": 3648
        }
      ]
    },
    {
      "id": "obj04-area02",
      "label": "Wicked Ditch",
      "category": "mountains-and-castle-approach",
      "objset": "0x04",
      "area": "0x02",
      "x": 7456,
      "y": 3648,
      "width": 1024,
      "height": 224,
      "placementSource": "rom-topology-side",
      "source": {
        "areaGrouping": "rom-topology-area",
        "submapOrder": "cv2r-submap-order",
        "dimensions": "recipe-atlas-layout-header"
      },
      "nodePlacements": [
        {
          "nodeId": "obj04-area02-sub00",
          "atlasId": "obj04-area02-sub00-wicked-ditch",
          "entryId": "obj04-area02-sub00-wicked-ditch-day",
          "name": "Wicked Ditch",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 1024,
          "height": 224,
          "relativeX": 0,
          "relativeY": 0,
          "output": "images/obj04-area02-sub00-wicked-ditch-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj04-area02-sub00-wicked-ditch-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "0x06",
              "0x07"
            ],
            "palette": {
              "status": "resolved",
              "variant": "day",
              "address": "0xA0F1",
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
            }
          },
          "x": 7456,
          "y": 3648
        }
      ]
    },
    {
      "id": "obj00-area05",
      "label": "Town of Doina",
      "category": "town-exteriors",
      "objset": "0x00",
      "area": "0x05",
      "x": 8480,
      "y": 3648,
      "width": 1024,
      "height": 224,
      "placementSource": "rom-topology-side",
      "source": {
        "areaGrouping": "rom-topology-area",
        "submapOrder": "cv2r-submap-order",
        "dimensions": "recipe-atlas-layout-header"
      },
      "nodePlacements": [
        {
          "nodeId": "obj00-area05-sub00",
          "atlasId": "obj00-area05-sub00-town-of-doina",
          "entryId": "obj00-area05-sub00-town-of-doina-day",
          "name": "Town of Doina",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "validated",
          "renderStatus": "rendered",
          "width": 1024,
          "height": 224,
          "relativeX": 0,
          "relativeY": 0,
          "output": "images/obj00-area05-sub00-town-of-doina-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj00-area05-sub00-town-of-doina-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "address": "0x9EF7",
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
            }
          },
          "x": 8480,
          "y": 3648
        }
      ]
    },
    {
      "id": "obj02-area08",
      "label": "North Bridge -> Dora Woods - Part 2",
      "category": "western-overworld",
      "objset": "0x02",
      "area": "0x08",
      "x": 9504,
      "y": 3648,
      "width": 2048,
      "height": 448,
      "placementSource": "rom-topology-side",
      "source": {
        "areaGrouping": "rom-topology-area",
        "submapOrder": "cv2r-submap-order",
        "dimensions": "recipe-atlas-layout-header"
      },
      "nodePlacements": [
        {
          "nodeId": "obj02-area08-sub00",
          "atlasId": "obj02-area08-sub00-north-bridge",
          "entryId": "obj02-area08-sub00-north-bridge-day",
          "name": "North Bridge",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "validated",
          "renderStatus": "rendered",
          "width": 1024,
          "height": 224,
          "relativeX": 0,
          "relativeY": 0,
          "output": "images/obj02-area08-sub00-north-bridge-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj02-area08-sub00-north-bridge-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
            }
          },
          "x": 9504,
          "y": 3648
        },
        {
          "nodeId": "obj02-area08-sub01",
          "atlasId": "obj02-area08-sub01-dora-woods-part-1",
          "entryId": "obj02-area08-sub01-dora-woods-part-1-day",
          "name": "Dora Woods - Part 1",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 512,
          "height": 224,
          "relativeX": 1024,
          "relativeY": 0,
          "output": "images/obj02-area08-sub01-dora-woods-part-1-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj02-area08-sub01-dora-woods-part-1-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "address": "0x9FE8",
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
            }
          },
          "x": 10528,
          "y": 3648
        },
        {
          "nodeId": "obj02-area08-sub02",
          "atlasId": "obj02-area08-sub02-dora-woods-part-2",
          "entryId": "obj02-area08-sub02-dora-woods-part-2-day",
          "name": "Dora Woods - Part 2",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "validated",
          "renderStatus": "rendered",
          "width": 512,
          "height": 448,
          "relativeX": 1536,
          "relativeY": 0,
          "output": "images/obj02-area08-sub02-dora-woods-part-2-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj02-area08-sub02-dora-woods-part-2-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "address": "0x9FD7",
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
            }
          },
          "x": 11040,
          "y": 3648
        }
      ]
    },
    {
      "id": "obj00-area06",
      "label": "Town of Yomi",
      "category": "town-exteriors",
      "objset": "0x00",
      "area": "0x06",
      "x": 11552,
      "y": 3648,
      "width": 1024,
      "height": 224,
      "placementSource": "rom-topology-side",
      "source": {
        "areaGrouping": "rom-topology-area",
        "submapOrder": "cv2r-submap-order",
        "dimensions": "recipe-atlas-layout-header"
      },
      "nodePlacements": [
        {
          "nodeId": "obj00-area06-sub00",
          "atlasId": "obj00-area06-sub00-town-of-yomi",
          "entryId": "obj00-area06-sub00-town-of-yomi-day",
          "name": "Town of Yomi",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 1024,
          "height": 224,
          "relativeX": 0,
          "relativeY": 0,
          "output": "images/obj00-area06-sub00-town-of-yomi-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj00-area06-sub00-town-of-yomi-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "address": "0x9F08",
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
            }
          },
          "x": 11552,
          "y": 3648
        }
      ]
    },
    {
      "id": "obj02-area09",
      "label": "Dora Woods - Part 3 -> Borgia Mountains (Dead End Swamp)",
      "category": "western-overworld",
      "objset": "0x02",
      "area": "0x09",
      "x": 11552,
      "y": 4608,
      "width": 2560,
      "height": 224,
      "placementSource": "rom-topology-side-plus-deterministic-overlap-solver",
      "source": {
        "areaGrouping": "rom-topology-area",
        "submapOrder": "cv2r-submap-order",
        "dimensions": "recipe-atlas-layout-header"
      },
      "nodePlacements": [
        {
          "nodeId": "obj02-area09-sub00",
          "atlasId": "obj02-area09-sub00-dora-woods-part-3",
          "entryId": "obj02-area09-sub00-dora-woods-part-3-day",
          "name": "Dora Woods - Part 3",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 512,
          "height": 224,
          "relativeX": 0,
          "relativeY": 0,
          "output": "images/obj02-area09-sub00-dora-woods-part-3-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj02-area09-sub00-dora-woods-part-3-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "address": "0x9FE8",
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
            }
          },
          "x": 11552,
          "y": 4608
        },
        {
          "nodeId": "obj02-area09-sub01",
          "atlasId": "obj02-area09-sub01-long-bridge-to-borgia-mountains-dead-end-swamp",
          "entryId": "obj02-area09-sub01-long-bridge-to-borgia-mountains-dead-end-swamp-day",
          "name": "Long Bridge to Borgia Mountains (Dead End Swamp)",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 1024,
          "height": 224,
          "relativeX": 512,
          "relativeY": 0,
          "output": "images/obj02-area09-sub01-long-bridge-to-borgia-mountains-dead-end-swamp-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj02-area09-sub01-long-bridge-to-borgia-mountains-dead-end-swamp-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
            }
          },
          "x": 12064,
          "y": 4608
        },
        {
          "nodeId": "obj02-area09-sub02",
          "atlasId": "obj02-area09-sub02-borgia-mountains-dead-end-swamp",
          "entryId": "obj02-area09-sub02-borgia-mountains-dead-end-swamp-day",
          "name": "Borgia Mountains (Dead End Swamp)",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "projected",
          "renderStatus": "rendered",
          "width": 1024,
          "height": 224,
          "relativeX": 1536,
          "relativeY": 0,
          "output": "images/obj02-area09-sub02-borgia-mountains-dead-end-swamp-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj02-area09-sub02-borgia-mountains-dead-end-swamp-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "address": "0xA01B",
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
            }
          },
          "x": 13088,
          "y": 4608
        }
      ]
    },
    {
      "id": "obj04-area03",
      "label": "Vrad Graveyard -> Castlevania Bridge",
      "category": "mountains-and-castle-approach",
      "objset": "0x04",
      "area": "0x03",
      "x": 12576,
      "y": 3648,
      "width": 2048,
      "height": 224,
      "placementSource": "rom-topology-side",
      "source": {
        "areaGrouping": "rom-topology-area",
        "submapOrder": "cv2r-submap-order",
        "dimensions": "recipe-atlas-layout-header"
      },
      "nodePlacements": [
        {
          "nodeId": "obj04-area03-sub00",
          "atlasId": "obj04-area03-sub00-vrad-graveyard",
          "entryId": "obj04-area03-sub00-vrad-graveyard-day",
          "name": "Vrad Graveyard",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "validated",
          "renderStatus": "rendered",
          "width": 1024,
          "height": 224,
          "relativeX": 0,
          "relativeY": 0,
          "output": "images/obj04-area03-sub00-vrad-graveyard-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj04-area03-sub00-vrad-graveyard-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "0x06",
              "0x07"
            ],
            "palette": {
              "status": "resolved",
              "variant": "day",
              "address": "0xA113",
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
            }
          },
          "x": 12576,
          "y": 3648
        },
        {
          "nodeId": "obj04-area03-sub01",
          "atlasId": "obj04-area03-sub01-castlevania-bridge",
          "entryId": "obj04-area03-sub01-castlevania-bridge-day",
          "name": "Castlevania Bridge",
          "access": "outdoor",
          "variant": "day",
          "recipeStatus": "validated",
          "renderStatus": "rendered",
          "width": 1024,
          "height": 224,
          "relativeX": 1024,
          "relativeY": 0,
          "output": "images/obj04-area03-sub01-castlevania-bridge-day.png",
          "sourceFile": "out/render-recipe-atlas/images/obj04-area03-sub01-castlevania-bridge-day.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "0x06",
              "0x07"
            ],
            "palette": {
              "status": "resolved",
              "variant": "day",
              "address": "0xCB04",
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
            }
          },
          "x": 13600,
          "y": 3648
        }
      ]
    },
    {
      "id": "obj05-area00",
      "label": "Castlevania",
      "category": "castlevania-final-area",
      "objset": "0x05",
      "area": "0x00",
      "x": 14624,
      "y": 3648,
      "width": 1024,
      "height": 896,
      "placementSource": "rom-topology-side",
      "source": {
        "areaGrouping": "rom-topology-area",
        "submapOrder": "cv2r-submap-order",
        "dimensions": "recipe-atlas-layout-header"
      },
      "nodePlacements": [
        {
          "nodeId": "obj05-area00-sub00",
          "atlasId": "obj05-area00-sub00-castlevania",
          "entryId": "obj05-area00-sub00-castlevania-fixed",
          "name": "Castlevania",
          "access": "final-area",
          "variant": "fixed",
          "recipeStatus": "validated",
          "renderStatus": "rendered",
          "width": 1024,
          "height": 896,
          "relativeX": 0,
          "relativeY": 0,
          "output": "images/obj05-area00-sub00-castlevania-fixed.png",
          "sourceFile": "out/render-recipe-atlas/images/obj05-area00-sub00-castlevania-fixed.png",
          "derivation": {
            "source": "recipe-atlas-entry",
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
              "0x0B",
              "0x0C"
            ],
            "palette": {
              "status": "resolved",
              "variant": "day",
              "address": "0xA150",
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
            }
          },
          "x": 14624,
          "y": 3648
        }
      ]
    }
  ],
  "constraints": [
    {
      "edgeId": "submap-sequence:obj02-area00-sub00->obj02-area00-sub01:0",
      "edgeType": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj02-area00",
      "nextAreaId": "obj02-area00",
      "edgeSourceArea": "obj02-area00",
      "edgeTargetArea": "obj02-area00",
      "sourceNode": "obj02-area00-sub00",
      "targetNode": "obj02-area00-sub01",
      "transitionClass": "same-area-submap-sequence",
      "transitionSemantics": {
        "transitionClass": "same-area-submap-sequence",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "coordinateConfidence": "submap-order-only",
        "evidence": [
          {
            "source": "cv2r-submap-order",
            "value": "obj02-area00-sub00 -> obj02-area00-sub01",
            "note": "Adjacent submaps in one area record."
          }
        ],
        "note": "Submap order indicates a layout sequence, not a complete world coordinate."
      },
      "routineEvidence": {
        "status": "not-applicable"
      },
      "status": "satisfied",
      "relationship": "target-submap-right-of-source-submap",
      "placementSource": "cv2r-submap-order",
      "spatialClaim": "submap-order-relative-layout",
      "proposedPlacement": {
        "x": 9248,
        "y": 32
      },
      "appliedPlacement": {
        "x": 9248,
        "y": 32
      }
    },
    {
      "edgeId": "submap-sequence:obj02-area00-sub01->obj02-area00-sub02:1",
      "edgeType": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj02-area00",
      "nextAreaId": "obj02-area00",
      "edgeSourceArea": "obj02-area00",
      "edgeTargetArea": "obj02-area00",
      "sourceNode": "obj02-area00-sub01",
      "targetNode": "obj02-area00-sub02",
      "transitionClass": "same-area-submap-sequence",
      "transitionSemantics": {
        "transitionClass": "same-area-submap-sequence",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "coordinateConfidence": "submap-order-only",
        "evidence": [
          {
            "source": "cv2r-submap-order",
            "value": "obj02-area00-sub01 -> obj02-area00-sub02",
            "note": "Adjacent submaps in one area record."
          }
        ],
        "note": "Submap order indicates a layout sequence, not a complete world coordinate."
      },
      "routineEvidence": {
        "status": "not-applicable"
      },
      "status": "satisfied",
      "relationship": "target-submap-right-of-source-submap",
      "placementSource": "cv2r-submap-order",
      "spatialClaim": "submap-order-relative-layout",
      "proposedPlacement": {
        "x": 10272,
        "y": 32
      },
      "appliedPlacement": {
        "x": 10272,
        "y": 32
      }
    },
    {
      "edgeId": "submap-sequence:obj02-area00-sub02->obj02-area00-sub03:2",
      "edgeType": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj02-area00",
      "nextAreaId": "obj02-area00",
      "edgeSourceArea": "obj02-area00",
      "edgeTargetArea": "obj02-area00",
      "sourceNode": "obj02-area00-sub02",
      "targetNode": "obj02-area00-sub03",
      "transitionClass": "same-area-submap-sequence",
      "transitionSemantics": {
        "transitionClass": "same-area-submap-sequence",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "coordinateConfidence": "submap-order-only",
        "evidence": [
          {
            "source": "cv2r-submap-order",
            "value": "obj02-area00-sub02 -> obj02-area00-sub03",
            "note": "Adjacent submaps in one area record."
          }
        ],
        "note": "Submap order indicates a layout sequence, not a complete world coordinate."
      },
      "routineEvidence": {
        "status": "not-applicable"
      },
      "status": "satisfied",
      "relationship": "target-submap-right-of-source-submap",
      "placementSource": "cv2r-submap-order",
      "spatialClaim": "submap-order-relative-layout",
      "proposedPlacement": {
        "x": 10784,
        "y": 32
      },
      "appliedPlacement": {
        "x": 10784,
        "y": 32
      }
    },
    {
      "edgeId": "submap-sequence:obj02-area03-sub00->obj02-area03-sub01:0",
      "edgeType": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj02-area03",
      "nextAreaId": "obj02-area03",
      "edgeSourceArea": "obj02-area03",
      "edgeTargetArea": "obj02-area03",
      "sourceNode": "obj02-area03-sub00",
      "targetNode": "obj02-area03-sub01",
      "transitionClass": "same-area-submap-sequence",
      "transitionSemantics": {
        "transitionClass": "same-area-submap-sequence",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "coordinateConfidence": "submap-order-only",
        "evidence": [
          {
            "source": "cv2r-submap-order",
            "value": "obj02-area03-sub00 -> obj02-area03-sub01",
            "note": "Adjacent submaps in one area record."
          }
        ],
        "note": "Submap order indicates a layout sequence, not a complete world coordinate."
      },
      "routineEvidence": {
        "status": "not-applicable"
      },
      "status": "satisfied",
      "relationship": "target-submap-right-of-source-submap",
      "placementSource": "cv2r-submap-order",
      "spatialClaim": "submap-order-relative-layout",
      "proposedPlacement": {
        "x": 12832,
        "y": 32
      },
      "appliedPlacement": {
        "x": 12832,
        "y": 32
      }
    },
    {
      "edgeId": "submap-sequence:obj02-area03-sub01->obj02-area03-sub02:1",
      "edgeType": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj02-area03",
      "nextAreaId": "obj02-area03",
      "edgeSourceArea": "obj02-area03",
      "edgeTargetArea": "obj02-area03",
      "sourceNode": "obj02-area03-sub01",
      "targetNode": "obj02-area03-sub02",
      "transitionClass": "same-area-submap-sequence",
      "transitionSemantics": {
        "transitionClass": "same-area-submap-sequence",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "coordinateConfidence": "submap-order-only",
        "evidence": [
          {
            "source": "cv2r-submap-order",
            "value": "obj02-area03-sub01 -> obj02-area03-sub02",
            "note": "Adjacent submaps in one area record."
          }
        ],
        "note": "Submap order indicates a layout sequence, not a complete world coordinate."
      },
      "routineEvidence": {
        "status": "not-applicable"
      },
      "status": "satisfied",
      "relationship": "target-submap-right-of-source-submap",
      "placementSource": "cv2r-submap-order",
      "spatialClaim": "submap-order-relative-layout",
      "proposedPlacement": {
        "x": 13344,
        "y": 32
      },
      "appliedPlacement": {
        "x": 13344,
        "y": 32
      }
    },
    {
      "edgeId": "submap-sequence:obj02-area03-sub02->obj02-area03-sub03:2",
      "edgeType": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj02-area03",
      "nextAreaId": "obj02-area03",
      "edgeSourceArea": "obj02-area03",
      "edgeTargetArea": "obj02-area03",
      "sourceNode": "obj02-area03-sub02",
      "targetNode": "obj02-area03-sub03",
      "transitionClass": "same-area-submap-sequence",
      "transitionSemantics": {
        "transitionClass": "same-area-submap-sequence",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "coordinateConfidence": "submap-order-only",
        "evidence": [
          {
            "source": "cv2r-submap-order",
            "value": "obj02-area03-sub02 -> obj02-area03-sub03",
            "note": "Adjacent submaps in one area record."
          }
        ],
        "note": "Submap order indicates a layout sequence, not a complete world coordinate."
      },
      "routineEvidence": {
        "status": "not-applicable"
      },
      "status": "satisfied",
      "relationship": "target-submap-right-of-source-submap",
      "placementSource": "cv2r-submap-order",
      "spatialClaim": "submap-order-relative-layout",
      "proposedPlacement": {
        "x": 13856,
        "y": 32
      },
      "appliedPlacement": {
        "x": 13856,
        "y": 32
      }
    },
    {
      "edgeId": "submap-sequence:obj02-area04-sub00->obj02-area04-sub01:0",
      "edgeType": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj02-area04",
      "nextAreaId": "obj02-area04",
      "edgeSourceArea": "obj02-area04",
      "edgeTargetArea": "obj02-area04",
      "sourceNode": "obj02-area04-sub00",
      "targetNode": "obj02-area04-sub01",
      "transitionClass": "same-area-submap-sequence",
      "transitionSemantics": {
        "transitionClass": "same-area-submap-sequence",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "coordinateConfidence": "submap-order-only",
        "evidence": [
          {
            "source": "cv2r-submap-order",
            "value": "obj02-area04-sub00 -> obj02-area04-sub01",
            "note": "Adjacent submaps in one area record."
          }
        ],
        "note": "Submap order indicates a layout sequence, not a complete world coordinate."
      },
      "routineEvidence": {
        "status": "not-applicable"
      },
      "status": "satisfied",
      "relationship": "target-submap-right-of-source-submap",
      "placementSource": "cv2r-submap-order",
      "spatialClaim": "submap-order-relative-layout",
      "proposedPlacement": {
        "x": 11808,
        "y": 1952
      },
      "appliedPlacement": {
        "x": 11808,
        "y": 1952
      }
    },
    {
      "edgeId": "submap-sequence:obj02-area05-sub00->obj02-area05-sub01:0",
      "edgeType": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj02-area05",
      "nextAreaId": "obj02-area05",
      "edgeSourceArea": "obj02-area05",
      "edgeTargetArea": "obj02-area05",
      "sourceNode": "obj02-area05-sub00",
      "targetNode": "obj02-area05-sub01",
      "transitionClass": "same-area-submap-sequence",
      "transitionSemantics": {
        "transitionClass": "same-area-submap-sequence",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "coordinateConfidence": "submap-order-only",
        "evidence": [
          {
            "source": "cv2r-submap-order",
            "value": "obj02-area05-sub00 -> obj02-area05-sub01",
            "note": "Adjacent submaps in one area record."
          }
        ],
        "note": "Submap order indicates a layout sequence, not a complete world coordinate."
      },
      "routineEvidence": {
        "status": "not-applicable"
      },
      "status": "satisfied",
      "relationship": "target-submap-right-of-source-submap",
      "placementSource": "cv2r-submap-order",
      "spatialClaim": "submap-order-relative-layout",
      "proposedPlacement": {
        "x": 15392,
        "y": 992
      },
      "appliedPlacement": {
        "x": 15392,
        "y": 992
      }
    },
    {
      "edgeId": "submap-sequence:obj02-area07-sub00->obj02-area07-sub01:0",
      "edgeType": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj02-area07",
      "nextAreaId": "obj02-area07",
      "edgeSourceArea": "obj02-area07",
      "edgeTargetArea": "obj02-area07",
      "sourceNode": "obj02-area07-sub00",
      "targetNode": "obj02-area07-sub01",
      "transitionClass": "same-area-submap-sequence",
      "transitionSemantics": {
        "transitionClass": "same-area-submap-sequence",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "coordinateConfidence": "submap-order-only",
        "evidence": [
          {
            "source": "cv2r-submap-order",
            "value": "obj02-area07-sub00 -> obj02-area07-sub01",
            "note": "Adjacent submaps in one area record."
          }
        ],
        "note": "Submap order indicates a layout sequence, not a complete world coordinate."
      },
      "routineEvidence": {
        "status": "not-applicable"
      },
      "status": "satisfied",
      "relationship": "target-submap-right-of-source-submap",
      "placementSource": "cv2r-submap-order",
      "spatialClaim": "submap-order-relative-layout",
      "proposedPlacement": {
        "x": 5664,
        "y": 32
      },
      "appliedPlacement": {
        "x": 5664,
        "y": 32
      }
    },
    {
      "edgeId": "submap-sequence:obj02-area07-sub01->obj02-area07-sub02:1",
      "edgeType": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj02-area07",
      "nextAreaId": "obj02-area07",
      "edgeSourceArea": "obj02-area07",
      "edgeTargetArea": "obj02-area07",
      "sourceNode": "obj02-area07-sub01",
      "targetNode": "obj02-area07-sub02",
      "transitionClass": "same-area-submap-sequence",
      "transitionSemantics": {
        "transitionClass": "same-area-submap-sequence",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "coordinateConfidence": "submap-order-only",
        "evidence": [
          {
            "source": "cv2r-submap-order",
            "value": "obj02-area07-sub01 -> obj02-area07-sub02",
            "note": "Adjacent submaps in one area record."
          }
        ],
        "note": "Submap order indicates a layout sequence, not a complete world coordinate."
      },
      "routineEvidence": {
        "status": "not-applicable"
      },
      "status": "satisfied",
      "relationship": "target-submap-right-of-source-submap",
      "placementSource": "cv2r-submap-order",
      "spatialClaim": "submap-order-relative-layout",
      "proposedPlacement": {
        "x": 6176,
        "y": 32
      },
      "appliedPlacement": {
        "x": 6176,
        "y": 32
      }
    },
    {
      "edgeId": "submap-sequence:obj02-area08-sub00->obj02-area08-sub01:0",
      "edgeType": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj02-area08",
      "nextAreaId": "obj02-area08",
      "edgeSourceArea": "obj02-area08",
      "edgeTargetArea": "obj02-area08",
      "sourceNode": "obj02-area08-sub00",
      "targetNode": "obj02-area08-sub01",
      "transitionClass": "same-area-submap-sequence",
      "transitionSemantics": {
        "transitionClass": "same-area-submap-sequence",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "coordinateConfidence": "submap-order-only",
        "evidence": [
          {
            "source": "cv2r-submap-order",
            "value": "obj02-area08-sub00 -> obj02-area08-sub01",
            "note": "Adjacent submaps in one area record."
          }
        ],
        "note": "Submap order indicates a layout sequence, not a complete world coordinate."
      },
      "routineEvidence": {
        "status": "not-applicable"
      },
      "status": "satisfied",
      "relationship": "target-submap-right-of-source-submap",
      "placementSource": "cv2r-submap-order",
      "spatialClaim": "submap-order-relative-layout",
      "proposedPlacement": {
        "x": 10528,
        "y": 3648
      },
      "appliedPlacement": {
        "x": 10528,
        "y": 3648
      }
    },
    {
      "edgeId": "submap-sequence:obj02-area08-sub01->obj02-area08-sub02:1",
      "edgeType": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj02-area08",
      "nextAreaId": "obj02-area08",
      "edgeSourceArea": "obj02-area08",
      "edgeTargetArea": "obj02-area08",
      "sourceNode": "obj02-area08-sub01",
      "targetNode": "obj02-area08-sub02",
      "transitionClass": "same-area-submap-sequence",
      "transitionSemantics": {
        "transitionClass": "same-area-submap-sequence",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "coordinateConfidence": "submap-order-only",
        "evidence": [
          {
            "source": "cv2r-submap-order",
            "value": "obj02-area08-sub01 -> obj02-area08-sub02",
            "note": "Adjacent submaps in one area record."
          }
        ],
        "note": "Submap order indicates a layout sequence, not a complete world coordinate."
      },
      "routineEvidence": {
        "status": "not-applicable"
      },
      "status": "satisfied",
      "relationship": "target-submap-right-of-source-submap",
      "placementSource": "cv2r-submap-order",
      "spatialClaim": "submap-order-relative-layout",
      "proposedPlacement": {
        "x": 11040,
        "y": 3648
      },
      "appliedPlacement": {
        "x": 11040,
        "y": 3648
      }
    },
    {
      "edgeId": "submap-sequence:obj02-area09-sub00->obj02-area09-sub01:0",
      "edgeType": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj02-area09",
      "nextAreaId": "obj02-area09",
      "edgeSourceArea": "obj02-area09",
      "edgeTargetArea": "obj02-area09",
      "sourceNode": "obj02-area09-sub00",
      "targetNode": "obj02-area09-sub01",
      "transitionClass": "same-area-submap-sequence",
      "transitionSemantics": {
        "transitionClass": "same-area-submap-sequence",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "coordinateConfidence": "submap-order-only",
        "evidence": [
          {
            "source": "cv2r-submap-order",
            "value": "obj02-area09-sub00 -> obj02-area09-sub01",
            "note": "Adjacent submaps in one area record."
          }
        ],
        "note": "Submap order indicates a layout sequence, not a complete world coordinate."
      },
      "routineEvidence": {
        "status": "not-applicable"
      },
      "status": "satisfied",
      "relationship": "target-submap-right-of-source-submap",
      "placementSource": "cv2r-submap-order",
      "spatialClaim": "submap-order-relative-layout",
      "proposedPlacement": {
        "x": 12064,
        "y": 4608
      },
      "appliedPlacement": {
        "x": 12064,
        "y": 4608
      }
    },
    {
      "edgeId": "submap-sequence:obj02-area09-sub01->obj02-area09-sub02:1",
      "edgeType": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj02-area09",
      "nextAreaId": "obj02-area09",
      "edgeSourceArea": "obj02-area09",
      "edgeTargetArea": "obj02-area09",
      "sourceNode": "obj02-area09-sub01",
      "targetNode": "obj02-area09-sub02",
      "transitionClass": "same-area-submap-sequence",
      "transitionSemantics": {
        "transitionClass": "same-area-submap-sequence",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "coordinateConfidence": "submap-order-only",
        "evidence": [
          {
            "source": "cv2r-submap-order",
            "value": "obj02-area09-sub01 -> obj02-area09-sub02",
            "note": "Adjacent submaps in one area record."
          }
        ],
        "note": "Submap order indicates a layout sequence, not a complete world coordinate."
      },
      "routineEvidence": {
        "status": "not-applicable"
      },
      "status": "satisfied",
      "relationship": "target-submap-right-of-source-submap",
      "placementSource": "cv2r-submap-order",
      "spatialClaim": "submap-order-relative-layout",
      "proposedPlacement": {
        "x": 13088,
        "y": 4608
      },
      "appliedPlacement": {
        "x": 13088,
        "y": 4608
      }
    },
    {
      "edgeId": "submap-sequence:obj03-area00-sub00->obj03-area00-sub01:0",
      "edgeType": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj03-area00",
      "nextAreaId": "obj03-area00",
      "edgeSourceArea": "obj03-area00",
      "edgeTargetArea": "obj03-area00",
      "sourceNode": "obj03-area00-sub00",
      "targetNode": "obj03-area00-sub01",
      "transitionClass": "same-area-submap-sequence",
      "transitionSemantics": {
        "transitionClass": "same-area-submap-sequence",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "coordinateConfidence": "submap-order-only",
        "evidence": [
          {
            "source": "cv2r-submap-order",
            "value": "obj03-area00-sub00 -> obj03-area00-sub01",
            "note": "Adjacent submaps in one area record."
          }
        ],
        "note": "Submap order indicates a layout sequence, not a complete world coordinate."
      },
      "routineEvidence": {
        "status": "not-applicable"
      },
      "status": "satisfied",
      "relationship": "target-submap-right-of-source-submap",
      "placementSource": "cv2r-submap-order",
      "spatialClaim": "submap-order-relative-layout",
      "proposedPlacement": {
        "x": 1056,
        "y": 32
      },
      "appliedPlacement": {
        "x": 1056,
        "y": 32
      }
    },
    {
      "edgeId": "submap-sequence:obj03-area02-sub00->obj03-area02-sub01:0",
      "edgeType": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj03-area02",
      "nextAreaId": "obj03-area02",
      "edgeSourceArea": "obj03-area02",
      "edgeTargetArea": "obj03-area02",
      "sourceNode": "obj03-area02-sub00",
      "targetNode": "obj03-area02-sub01",
      "transitionClass": "same-area-submap-sequence",
      "transitionSemantics": {
        "transitionClass": "same-area-submap-sequence",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "coordinateConfidence": "submap-order-only",
        "evidence": [
          {
            "source": "cv2r-submap-order",
            "value": "obj03-area02-sub00 -> obj03-area02-sub01",
            "note": "Adjacent submaps in one area record."
          }
        ],
        "note": "Submap order indicates a layout sequence, not a complete world coordinate."
      },
      "routineEvidence": {
        "status": "not-applicable"
      },
      "status": "satisfied",
      "relationship": "target-submap-right-of-source-submap",
      "placementSource": "cv2r-submap-order",
      "spatialClaim": "submap-order-relative-layout",
      "proposedPlacement": {
        "x": 3616,
        "y": 32
      },
      "appliedPlacement": {
        "x": 3616,
        "y": 32
      }
    },
    {
      "edgeId": "submap-sequence:obj03-area03-sub00->obj03-area03-sub01:0",
      "edgeType": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj03-area03",
      "nextAreaId": "obj03-area03",
      "edgeSourceArea": "obj03-area03",
      "edgeTargetArea": "obj03-area03",
      "sourceNode": "obj03-area03-sub00",
      "targetNode": "obj03-area03-sub01",
      "transitionClass": "same-area-submap-sequence",
      "transitionSemantics": {
        "transitionClass": "same-area-submap-sequence",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "coordinateConfidence": "submap-order-only",
        "evidence": [
          {
            "source": "cv2r-submap-order",
            "value": "obj03-area03-sub00 -> obj03-area03-sub01",
            "note": "Adjacent submaps in one area record."
          }
        ],
        "note": "Submap order indicates a layout sequence, not a complete world coordinate."
      },
      "routineEvidence": {
        "status": "not-applicable"
      },
      "status": "satisfied",
      "relationship": "target-submap-right-of-source-submap",
      "placementSource": "cv2r-submap-order",
      "spatialClaim": "submap-order-relative-layout",
      "proposedPlacement": {
        "x": 3360,
        "y": 2912
      },
      "appliedPlacement": {
        "x": 3360,
        "y": 2912
      }
    },
    {
      "edgeId": "submap-sequence:obj03-area03-sub01->obj03-area03-sub02:1",
      "edgeType": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj03-area03",
      "nextAreaId": "obj03-area03",
      "edgeSourceArea": "obj03-area03",
      "edgeTargetArea": "obj03-area03",
      "sourceNode": "obj03-area03-sub01",
      "targetNode": "obj03-area03-sub02",
      "transitionClass": "same-area-submap-sequence",
      "transitionSemantics": {
        "transitionClass": "same-area-submap-sequence",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "coordinateConfidence": "submap-order-only",
        "evidence": [
          {
            "source": "cv2r-submap-order",
            "value": "obj03-area03-sub01 -> obj03-area03-sub02",
            "note": "Adjacent submaps in one area record."
          }
        ],
        "note": "Submap order indicates a layout sequence, not a complete world coordinate."
      },
      "routineEvidence": {
        "status": "not-applicable"
      },
      "status": "satisfied",
      "relationship": "target-submap-right-of-source-submap",
      "placementSource": "cv2r-submap-order",
      "spatialClaim": "submap-order-relative-layout",
      "proposedPlacement": {
        "x": 4384,
        "y": 2912
      },
      "appliedPlacement": {
        "x": 4384,
        "y": 2912
      }
    },
    {
      "edgeId": "submap-sequence:obj03-area03-sub02->obj03-area03-sub03:2",
      "edgeType": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj03-area03",
      "nextAreaId": "obj03-area03",
      "edgeSourceArea": "obj03-area03",
      "edgeTargetArea": "obj03-area03",
      "sourceNode": "obj03-area03-sub02",
      "targetNode": "obj03-area03-sub03",
      "transitionClass": "same-area-submap-sequence",
      "transitionSemantics": {
        "transitionClass": "same-area-submap-sequence",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "coordinateConfidence": "submap-order-only",
        "evidence": [
          {
            "source": "cv2r-submap-order",
            "value": "obj03-area03-sub02 -> obj03-area03-sub03",
            "note": "Adjacent submaps in one area record."
          }
        ],
        "note": "Submap order indicates a layout sequence, not a complete world coordinate."
      },
      "routineEvidence": {
        "status": "not-applicable"
      },
      "status": "satisfied",
      "relationship": "target-submap-right-of-source-submap",
      "placementSource": "cv2r-submap-order",
      "spatialClaim": "submap-order-relative-layout",
      "proposedPlacement": {
        "x": 5408,
        "y": 2912
      },
      "appliedPlacement": {
        "x": 5408,
        "y": 2912
      }
    },
    {
      "edgeId": "submap-sequence:obj03-area03-sub03->obj03-area03-sub04:3",
      "edgeType": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj03-area03",
      "nextAreaId": "obj03-area03",
      "edgeSourceArea": "obj03-area03",
      "edgeTargetArea": "obj03-area03",
      "sourceNode": "obj03-area03-sub03",
      "targetNode": "obj03-area03-sub04",
      "transitionClass": "same-area-submap-sequence",
      "transitionSemantics": {
        "transitionClass": "same-area-submap-sequence",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "coordinateConfidence": "submap-order-only",
        "evidence": [
          {
            "source": "cv2r-submap-order",
            "value": "obj03-area03-sub03 -> obj03-area03-sub04",
            "note": "Adjacent submaps in one area record."
          }
        ],
        "note": "Submap order indicates a layout sequence, not a complete world coordinate."
      },
      "routineEvidence": {
        "status": "not-applicable"
      },
      "status": "satisfied",
      "relationship": "target-submap-right-of-source-submap",
      "placementSource": "cv2r-submap-order",
      "spatialClaim": "submap-order-relative-layout",
      "proposedPlacement": {
        "x": 5664,
        "y": 2912
      },
      "appliedPlacement": {
        "x": 5664,
        "y": 2912
      }
    },
    {
      "edgeId": "submap-sequence:obj04-area00-sub00->obj04-area00-sub01:0",
      "edgeType": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj04-area00",
      "nextAreaId": "obj04-area00",
      "edgeSourceArea": "obj04-area00",
      "edgeTargetArea": "obj04-area00",
      "sourceNode": "obj04-area00-sub00",
      "targetNode": "obj04-area00-sub01",
      "transitionClass": "same-area-submap-sequence",
      "transitionSemantics": {
        "transitionClass": "same-area-submap-sequence",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "coordinateConfidence": "submap-order-only",
        "evidence": [
          {
            "source": "cv2r-submap-order",
            "value": "obj04-area00-sub00 -> obj04-area00-sub01",
            "note": "Adjacent submaps in one area record."
          }
        ],
        "note": "Submap order indicates a layout sequence, not a complete world coordinate."
      },
      "routineEvidence": {
        "status": "not-applicable"
      },
      "status": "satisfied",
      "relationship": "target-submap-right-of-source-submap",
      "placementSource": "cv2r-submap-order",
      "spatialClaim": "submap-order-relative-layout",
      "proposedPlacement": {
        "x": 3360,
        "y": 1952
      },
      "appliedPlacement": {
        "x": 3360,
        "y": 1952
      }
    },
    {
      "edgeId": "submap-sequence:obj04-area01-sub00->obj04-area01-sub01:0",
      "edgeType": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj04-area01",
      "nextAreaId": "obj04-area01",
      "edgeSourceArea": "obj04-area01",
      "edgeTargetArea": "obj04-area01",
      "sourceNode": "obj04-area01-sub00",
      "targetNode": "obj04-area01-sub01",
      "transitionClass": "same-area-submap-sequence",
      "transitionSemantics": {
        "transitionClass": "same-area-submap-sequence",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "coordinateConfidence": "submap-order-only",
        "evidence": [
          {
            "source": "cv2r-submap-order",
            "value": "obj04-area01-sub00 -> obj04-area01-sub01",
            "note": "Adjacent submaps in one area record."
          }
        ],
        "note": "Submap order indicates a layout sequence, not a complete world coordinate."
      },
      "routineEvidence": {
        "status": "not-applicable"
      },
      "status": "satisfied",
      "relationship": "target-submap-right-of-source-submap",
      "placementSource": "cv2r-submap-order",
      "spatialClaim": "submap-order-relative-layout",
      "proposedPlacement": {
        "x": 544,
        "y": 992
      },
      "appliedPlacement": {
        "x": 544,
        "y": 992
      }
    },
    {
      "edgeId": "submap-sequence:obj04-area03-sub00->obj04-area03-sub01:0",
      "edgeType": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj04-area03",
      "nextAreaId": "obj04-area03",
      "edgeSourceArea": "obj04-area03",
      "edgeTargetArea": "obj04-area03",
      "sourceNode": "obj04-area03-sub00",
      "targetNode": "obj04-area03-sub01",
      "transitionClass": "same-area-submap-sequence",
      "transitionSemantics": {
        "transitionClass": "same-area-submap-sequence",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "coordinateConfidence": "submap-order-only",
        "evidence": [
          {
            "source": "cv2r-submap-order",
            "value": "obj04-area03-sub00 -> obj04-area03-sub01",
            "note": "Adjacent submaps in one area record."
          }
        ],
        "note": "Submap order indicates a layout sequence, not a complete world coordinate."
      },
      "routineEvidence": {
        "status": "not-applicable"
      },
      "status": "satisfied",
      "relationship": "target-submap-right-of-source-submap",
      "placementSource": "cv2r-submap-order",
      "spatialClaim": "submap-order-relative-layout",
      "proposedPlacement": {
        "x": 13600,
        "y": 3648
      },
      "appliedPlacement": {
        "x": 13600,
        "y": 3648
      }
    },
    {
      "edgeId": "boundary-transition:obj00-area00-sub00->obj02-area00-sub00:right",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj00-area00",
      "nextAreaId": "obj02-area00",
      "edgeSourceArea": "obj00-area00",
      "edgeTargetArea": "obj02-area00",
      "sourceNode": "obj00-area00-sub00",
      "targetNode": "obj02-area00-sub00",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x02 0x00",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x02",
          "0x00"
        ],
        "target": {
          "objset": 2,
          "objsetHex": "0x02",
          "area": 0,
          "areaHex": "0x00"
        }
      },
      "routineEvidence": {
        "status": "routine-observed",
        "stepId": "jova-to-woods",
        "matchStatus": "direct",
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
        ]
      },
      "status": "placed",
      "relationship": "next-area-right-of-current-area",
      "placementSource": "rom-topology-side",
      "spatialClaim": "rom-topology-side",
      "proposedPlacement": {
        "x": 8224,
        "y": 32
      },
      "appliedPlacement": {
        "x": 8224,
        "y": 32
      }
    },
    {
      "edgeId": "boundary-transition:obj00-area00-sub00->obj02-area07-sub02:left",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "forward",
      "direction": "left",
      "currentAreaId": "obj00-area00",
      "nextAreaId": "obj02-area07",
      "edgeSourceArea": "obj00-area00",
      "edgeTargetArea": "obj02-area07",
      "sourceNode": "obj00-area00-sub00",
      "targetNode": "obj02-area07-sub02",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x02 0x07",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x02",
          "0x07"
        ],
        "target": {
          "objset": 2,
          "objsetHex": "0x02",
          "area": 7,
          "areaHex": "0x07"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "placed",
      "relationship": "next-area-left-of-current-area",
      "placementSource": "rom-topology-side",
      "spatialClaim": "rom-topology-side",
      "proposedPlacement": {
        "x": 5152,
        "y": 32
      },
      "appliedPlacement": {
        "x": 5152,
        "y": 32
      }
    },
    {
      "edgeId": "boundary-transition:obj02-area00-sub00->obj00-area00-sub00:left",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "reverse",
      "direction": "left",
      "currentAreaId": "obj00-area00",
      "nextAreaId": "obj02-area00",
      "edgeSourceArea": "obj02-area00",
      "edgeTargetArea": "obj00-area00",
      "sourceNode": "obj02-area00-sub00",
      "targetNode": "obj00-area00-sub00",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x00 0x00",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x00",
          "0x00"
        ],
        "target": {
          "objset": 0,
          "objsetHex": "0x00",
          "area": 0,
          "areaHex": "0x00"
        }
      },
      "routineEvidence": {
        "status": "routine-observed",
        "stepId": "woods-to-jova",
        "matchStatus": "direct",
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
        ]
      },
      "status": "satisfied",
      "relationship": "next-area-right-of-current-area",
      "placementSource": "rom-topology-side",
      "spatialClaim": "rom-topology-side",
      "proposedPlacement": {
        "x": 8224,
        "y": 32
      },
      "appliedPlacement": {
        "x": 8224,
        "y": 32
      }
    },
    {
      "edgeId": "boundary-transition:obj02-area07-sub02->obj00-area00-sub00:right",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "reverse",
      "direction": "right",
      "currentAreaId": "obj00-area00",
      "nextAreaId": "obj02-area07",
      "edgeSourceArea": "obj02-area07",
      "edgeTargetArea": "obj00-area00",
      "sourceNode": "obj02-area07-sub02",
      "targetNode": "obj00-area00-sub00",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x00 0x00",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x00",
          "0x00"
        ],
        "target": {
          "objset": 0,
          "objsetHex": "0x00",
          "area": 0,
          "areaHex": "0x00"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "satisfied",
      "relationship": "next-area-left-of-current-area",
      "placementSource": "rom-topology-side",
      "spatialClaim": "rom-topology-side",
      "proposedPlacement": {
        "x": 5152,
        "y": 32
      },
      "appliedPlacement": {
        "x": 5152,
        "y": 32
      }
    },
    {
      "edgeId": "boundary-transition:obj00-area01-sub00->obj02-area00-sub03:left",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "reverse",
      "direction": "left",
      "currentAreaId": "obj02-area00",
      "nextAreaId": "obj00-area01",
      "edgeSourceArea": "obj00-area01",
      "edgeTargetArea": "obj02-area00",
      "sourceNode": "obj00-area01-sub00",
      "targetNode": "obj02-area00-sub03",
      "transitionClass": "object-set-load-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-load-boundary",
        "coordinateConfidence": "horizontal-side-plus-load-marker",
        "note": "Transition crosses object set/area and carries the load marker.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFC 0x02 0x00",
            "note": "Transition crosses object set/area and carries the load marker."
          }
        ]
      },
      "transition": {
        "kind": "objset-area-load",
        "marker": "0xFC",
        "bytes": [
          "0xFC",
          "0x02",
          "0x00"
        ],
        "target": {
          "objset": 2,
          "objsetHex": "0x02",
          "area": 0,
          "areaHex": "0x00"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "placed",
      "relationship": "next-area-right-of-current-area",
      "placementSource": "rom-topology-side",
      "spatialClaim": "rom-topology-side",
      "proposedPlacement": {
        "x": 11296,
        "y": 32
      },
      "appliedPlacement": {
        "x": 11296,
        "y": 32
      }
    },
    {
      "edgeId": "boundary-transition:obj02-area00-sub03->obj02-area01-sub00:right",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj02-area00",
      "nextAreaId": "obj02-area01",
      "edgeSourceArea": "obj02-area00",
      "edgeTargetArea": "obj02-area01",
      "sourceNode": "obj02-area00-sub03",
      "targetNode": "obj02-area01-sub00",
      "transitionClass": "same-object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "same-object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition stays in the current object set and changes area.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0x00 0x00 0x01",
            "note": "Transition stays in the current object set and changes area."
          }
        ]
      },
      "transition": {
        "kind": "same-objset-area",
        "marker": "0x00",
        "bytes": [
          "0x00",
          "0x00",
          "0x01"
        ],
        "target": {
          "objset": 2,
          "objsetHex": "0x02",
          "area": 1,
          "areaHex": "0x01"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "placed",
      "relationship": "next-area-right-of-current-area",
      "placementSource": "rom-topology-side-plus-deterministic-overlap-solver",
      "spatialClaim": "solver-derived-layout",
      "proposedPlacement": {
        "x": 11296,
        "y": 32
      },
      "appliedPlacement": {
        "x": 11296,
        "y": 992
      },
      "solverAdjustment": {
        "source": "deterministic-overlap-avoidance",
        "shifts": 1,
        "rowStep": 960,
        "note": "The edge direction is ROM-derived; the row shift is a generic solver layout choice, not a ROM coordinate."
      }
    },
    {
      "edgeId": "boundary-transition:obj02-area01-sub00->obj02-area00-sub03:left",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "reverse",
      "direction": "left",
      "currentAreaId": "obj02-area00",
      "nextAreaId": "obj02-area01",
      "edgeSourceArea": "obj02-area01",
      "edgeTargetArea": "obj02-area00",
      "sourceNode": "obj02-area01-sub00",
      "targetNode": "obj02-area00-sub03",
      "transitionClass": "same-object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "same-object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition stays in the current object set and changes area.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0x00 0x00 0x00",
            "note": "Transition stays in the current object set and changes area."
          }
        ]
      },
      "transition": {
        "kind": "same-objset-area",
        "marker": "0x00",
        "bytes": [
          "0x00",
          "0x00",
          "0x00"
        ],
        "target": {
          "objset": 2,
          "objsetHex": "0x02",
          "area": 0,
          "areaHex": "0x00"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "conflict",
      "relationship": "next-area-right-of-current-area",
      "placementSource": "existing-placement-conflict",
      "spatialClaim": "none",
      "proposedPlacement": {
        "x": 11296,
        "y": 32
      },
      "appliedPlacement": {
        "x": 11296,
        "y": 992
      },
      "conflict": {
        "reason": "Existing deterministic graph placement does not satisfy this additional ROM edge.",
        "dx": 0,
        "dy": 960
      }
    },
    {
      "edgeId": "boundary-transition:obj00-area03-sub00->obj02-area07-sub00:right",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "reverse",
      "direction": "right",
      "currentAreaId": "obj02-area07",
      "nextAreaId": "obj00-area03",
      "edgeSourceArea": "obj00-area03",
      "edgeTargetArea": "obj02-area07",
      "sourceNode": "obj00-area03-sub00",
      "targetNode": "obj02-area07-sub00",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x02 0x07",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x02",
          "0x07"
        ],
        "target": {
          "objset": 2,
          "objsetHex": "0x02",
          "area": 7,
          "areaHex": "0x07"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "placed",
      "relationship": "next-area-left-of-current-area",
      "placementSource": "rom-topology-side",
      "spatialClaim": "rom-topology-side",
      "proposedPlacement": {
        "x": 4128,
        "y": 32
      },
      "appliedPlacement": {
        "x": 4128,
        "y": 32
      }
    },
    {
      "edgeId": "boundary-transition:obj02-area06-sub00->obj02-area07-sub00:right",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "reverse",
      "direction": "right",
      "currentAreaId": "obj02-area07",
      "nextAreaId": "obj02-area06",
      "edgeSourceArea": "obj02-area06",
      "edgeTargetArea": "obj02-area07",
      "sourceNode": "obj02-area06-sub00",
      "targetNode": "obj02-area07-sub00",
      "transitionClass": "same-object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "same-object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition stays in the current object set and changes area.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0x00 0x00 0x07",
            "note": "Transition stays in the current object set and changes area."
          }
        ]
      },
      "transition": {
        "kind": "same-objset-area",
        "marker": "0x00",
        "bytes": [
          "0x00",
          "0x00",
          "0x07"
        ],
        "target": {
          "objset": 2,
          "objsetHex": "0x02",
          "area": 7,
          "areaHex": "0x07"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "placed",
      "relationship": "next-area-left-of-current-area",
      "placementSource": "rom-topology-side-plus-deterministic-overlap-solver",
      "spatialClaim": "solver-derived-layout",
      "proposedPlacement": {
        "x": 4640,
        "y": 32
      },
      "appliedPlacement": {
        "x": 4640,
        "y": 992
      },
      "solverAdjustment": {
        "source": "deterministic-overlap-avoidance",
        "shifts": 1,
        "rowStep": 960,
        "note": "The edge direction is ROM-derived; the row shift is a generic solver layout choice, not a ROM coordinate."
      }
    },
    {
      "edgeId": "boundary-transition:obj02-area07-sub00->obj00-area03-sub00:left",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "forward",
      "direction": "left",
      "currentAreaId": "obj02-area07",
      "nextAreaId": "obj00-area03",
      "edgeSourceArea": "obj02-area07",
      "edgeTargetArea": "obj00-area03",
      "sourceNode": "obj02-area07-sub00",
      "targetNode": "obj00-area03-sub00",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x00 0x03",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x00",
          "0x03"
        ],
        "target": {
          "objset": 0,
          "objsetHex": "0x00",
          "area": 3,
          "areaHex": "0x03"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "satisfied",
      "relationship": "next-area-left-of-current-area",
      "placementSource": "rom-topology-side",
      "spatialClaim": "rom-topology-side",
      "proposedPlacement": {
        "x": 4128,
        "y": 32
      },
      "appliedPlacement": {
        "x": 4128,
        "y": 32
      }
    },
    {
      "edgeId": "boundary-transition:obj00-area01-sub00->obj02-area03-sub00:right",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj00-area01",
      "nextAreaId": "obj02-area03",
      "edgeSourceArea": "obj00-area01",
      "edgeTargetArea": "obj02-area03",
      "sourceNode": "obj00-area01-sub00",
      "targetNode": "obj02-area03-sub00",
      "transitionClass": "object-set-load-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-load-boundary",
        "coordinateConfidence": "horizontal-side-plus-load-marker",
        "note": "Transition crosses object set/area and carries the load marker.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFC 0x02 0x03",
            "note": "Transition crosses object set/area and carries the load marker."
          }
        ]
      },
      "transition": {
        "kind": "objset-area-load",
        "marker": "0xFC",
        "bytes": [
          "0xFC",
          "0x02",
          "0x03"
        ],
        "target": {
          "objset": 2,
          "objsetHex": "0x02",
          "area": 3,
          "areaHex": "0x03"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "placed",
      "relationship": "next-area-right-of-current-area",
      "placementSource": "rom-topology-side",
      "spatialClaim": "rom-topology-side",
      "proposedPlacement": {
        "x": 12320,
        "y": 32
      },
      "appliedPlacement": {
        "x": 12320,
        "y": 32
      }
    },
    {
      "edgeId": "boundary-transition:obj01-area02-sub00->obj00-area01-sub00:right",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "reverse",
      "direction": "right",
      "currentAreaId": "obj00-area01",
      "nextAreaId": "obj01-area02",
      "edgeSourceArea": "obj01-area02",
      "edgeTargetArea": "obj00-area01",
      "sourceNode": "obj01-area02-sub00",
      "targetNode": "obj00-area01-sub00",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x00 0x01",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x00",
          "0x01"
        ],
        "target": {
          "objset": 0,
          "objsetHex": "0x00",
          "area": 1,
          "areaHex": "0x01"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "placed",
      "relationship": "next-area-left-of-current-area",
      "placementSource": "rom-topology-side-plus-deterministic-overlap-solver",
      "spatialClaim": "solver-derived-layout",
      "proposedPlacement": {
        "x": 11040,
        "y": 32
      },
      "appliedPlacement": {
        "x": 11040,
        "y": 992
      },
      "solverAdjustment": {
        "source": "deterministic-overlap-avoidance",
        "shifts": 1,
        "rowStep": 960,
        "note": "The edge direction is ROM-derived; the row shift is a generic solver layout choice, not a ROM coordinate."
      }
    },
    {
      "edgeId": "boundary-transition:obj01-area01-sub00->obj02-area01-sub00:left",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "reverse",
      "direction": "left",
      "currentAreaId": "obj02-area01",
      "nextAreaId": "obj01-area01",
      "edgeSourceArea": "obj01-area01",
      "edgeTargetArea": "obj02-area01",
      "sourceNode": "obj01-area01-sub00",
      "targetNode": "obj02-area01-sub00",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x02 0x01",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x02",
          "0x01"
        ],
        "target": {
          "objset": 2,
          "objsetHex": "0x02",
          "area": 1,
          "areaHex": "0x01"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "placed",
      "relationship": "next-area-right-of-current-area",
      "placementSource": "rom-topology-side",
      "spatialClaim": "rom-topology-side",
      "proposedPlacement": {
        "x": 11808,
        "y": 992
      },
      "appliedPlacement": {
        "x": 11808,
        "y": 992
      }
    },
    {
      "edgeId": "boundary-transition:obj02-area01-sub00->obj01-area01-sub00:right",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj02-area01",
      "nextAreaId": "obj01-area01",
      "edgeSourceArea": "obj02-area01",
      "edgeTargetArea": "obj01-area01",
      "sourceNode": "obj02-area01-sub00",
      "targetNode": "obj01-area01-sub00",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x01 0x01",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x01",
          "0x01"
        ],
        "target": {
          "objset": 1,
          "objsetHex": "0x01",
          "area": 1,
          "areaHex": "0x01"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "satisfied",
      "relationship": "next-area-right-of-current-area",
      "placementSource": "rom-topology-side",
      "spatialClaim": "rom-topology-side",
      "proposedPlacement": {
        "x": 11808,
        "y": 992
      },
      "appliedPlacement": {
        "x": 11808,
        "y": 992
      }
    },
    {
      "edgeId": "boundary-transition:obj00-area03-sub00->obj03-area02-sub01:left",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "forward",
      "direction": "left",
      "currentAreaId": "obj00-area03",
      "nextAreaId": "obj03-area02",
      "edgeSourceArea": "obj00-area03",
      "edgeTargetArea": "obj03-area02",
      "sourceNode": "obj00-area03-sub00",
      "targetNode": "obj03-area02-sub01",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x03 0x02",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x03",
          "0x02"
        ],
        "target": {
          "objset": 3,
          "objsetHex": "0x03",
          "area": 2,
          "areaHex": "0x02"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "placed",
      "relationship": "next-area-left-of-current-area",
      "placementSource": "rom-topology-side",
      "spatialClaim": "rom-topology-side",
      "proposedPlacement": {
        "x": 3104,
        "y": 32
      },
      "appliedPlacement": {
        "x": 3104,
        "y": 32
      }
    },
    {
      "edgeId": "boundary-transition:obj03-area02-sub01->obj00-area03-sub00:right",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "reverse",
      "direction": "right",
      "currentAreaId": "obj00-area03",
      "nextAreaId": "obj03-area02",
      "edgeSourceArea": "obj03-area02",
      "edgeTargetArea": "obj00-area03",
      "sourceNode": "obj03-area02-sub01",
      "targetNode": "obj00-area03-sub00",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x00 0x03",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x00",
          "0x03"
        ],
        "target": {
          "objset": 0,
          "objsetHex": "0x00",
          "area": 3,
          "areaHex": "0x03"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "satisfied",
      "relationship": "next-area-left-of-current-area",
      "placementSource": "rom-topology-side",
      "spatialClaim": "rom-topology-side",
      "proposedPlacement": {
        "x": 3104,
        "y": 32
      },
      "appliedPlacement": {
        "x": 3104,
        "y": 32
      }
    },
    {
      "edgeId": "boundary-transition:obj01-area03-sub00->obj02-area06-sub00:right",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "reverse",
      "direction": "right",
      "currentAreaId": "obj02-area06",
      "nextAreaId": "obj01-area03",
      "edgeSourceArea": "obj01-area03",
      "edgeTargetArea": "obj02-area06",
      "sourceNode": "obj01-area03-sub00",
      "targetNode": "obj02-area06-sub00",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x02 0x06",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x02",
          "0x06"
        ],
        "target": {
          "objset": 2,
          "objsetHex": "0x02",
          "area": 6,
          "areaHex": "0x06"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "placed",
      "relationship": "next-area-left-of-current-area",
      "placementSource": "rom-topology-side",
      "spatialClaim": "rom-topology-side",
      "proposedPlacement": {
        "x": 4384,
        "y": 992
      },
      "appliedPlacement": {
        "x": 4384,
        "y": 992
      }
    },
    {
      "edgeId": "boundary-transition:obj02-area06-sub00->obj01-area03-sub00:left",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "forward",
      "direction": "left",
      "currentAreaId": "obj02-area06",
      "nextAreaId": "obj01-area03",
      "edgeSourceArea": "obj02-area06",
      "edgeTargetArea": "obj01-area03",
      "sourceNode": "obj02-area06-sub00",
      "targetNode": "obj01-area03-sub00",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x01 0x03",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x01",
          "0x03"
        ],
        "target": {
          "objset": 1,
          "objsetHex": "0x01",
          "area": 3,
          "areaHex": "0x03"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "satisfied",
      "relationship": "next-area-left-of-current-area",
      "placementSource": "rom-topology-side",
      "spatialClaim": "rom-topology-side",
      "proposedPlacement": {
        "x": 4384,
        "y": 992
      },
      "appliedPlacement": {
        "x": 4384,
        "y": 992
      }
    },
    {
      "edgeId": "boundary-transition:obj02-area02-sub00->obj02-area03-sub03:left",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "reverse",
      "direction": "left",
      "currentAreaId": "obj02-area03",
      "nextAreaId": "obj02-area02",
      "edgeSourceArea": "obj02-area02",
      "edgeTargetArea": "obj02-area03",
      "sourceNode": "obj02-area02-sub00",
      "targetNode": "obj02-area03-sub03",
      "transitionClass": "same-object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "same-object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition stays in the current object set and changes area.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0x00 0x00 0x03",
            "note": "Transition stays in the current object set and changes area."
          }
        ]
      },
      "transition": {
        "kind": "same-objset-area",
        "marker": "0x00",
        "bytes": [
          "0x00",
          "0x00",
          "0x03"
        ],
        "target": {
          "objset": 2,
          "objsetHex": "0x02",
          "area": 3,
          "areaHex": "0x03"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "placed",
      "relationship": "next-area-right-of-current-area",
      "placementSource": "rom-topology-side",
      "spatialClaim": "rom-topology-side",
      "proposedPlacement": {
        "x": 14368,
        "y": 32
      },
      "appliedPlacement": {
        "x": 14368,
        "y": 32
      }
    },
    {
      "edgeId": "boundary-transition:obj02-area03-sub00->obj02-area04-sub01:left",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "forward",
      "direction": "left",
      "currentAreaId": "obj02-area03",
      "nextAreaId": "obj02-area04",
      "edgeSourceArea": "obj02-area03",
      "edgeTargetArea": "obj02-area04",
      "sourceNode": "obj02-area03-sub00",
      "targetNode": "obj02-area04-sub01",
      "transitionClass": "same-object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "same-object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition stays in the current object set and changes area.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0x00 0x00 0x04",
            "note": "Transition stays in the current object set and changes area."
          }
        ]
      },
      "transition": {
        "kind": "same-objset-area",
        "marker": "0x00",
        "bytes": [
          "0x00",
          "0x00",
          "0x04"
        ],
        "target": {
          "objset": 2,
          "objsetHex": "0x02",
          "area": 4,
          "areaHex": "0x04"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "placed",
      "relationship": "next-area-left-of-current-area",
      "placementSource": "rom-topology-side-plus-deterministic-overlap-solver",
      "spatialClaim": "solver-derived-layout",
      "proposedPlacement": {
        "x": 11040,
        "y": 32
      },
      "appliedPlacement": {
        "x": 11040,
        "y": 1952
      },
      "solverAdjustment": {
        "source": "deterministic-overlap-avoidance",
        "shifts": 2,
        "rowStep": 960,
        "note": "The edge direction is ROM-derived; the row shift is a generic solver layout choice, not a ROM coordinate."
      }
    },
    {
      "edgeId": "boundary-transition:obj02-area03-sub03->obj02-area02-sub00:right",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj02-area03",
      "nextAreaId": "obj02-area02",
      "edgeSourceArea": "obj02-area03",
      "edgeTargetArea": "obj02-area02",
      "sourceNode": "obj02-area03-sub03",
      "targetNode": "obj02-area02-sub00",
      "transitionClass": "same-object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "same-object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition stays in the current object set and changes area.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0x00 0x00 0x02",
            "note": "Transition stays in the current object set and changes area."
          }
        ]
      },
      "transition": {
        "kind": "same-objset-area",
        "marker": "0x00",
        "bytes": [
          "0x00",
          "0x00",
          "0x02"
        ],
        "target": {
          "objset": 2,
          "objsetHex": "0x02",
          "area": 2,
          "areaHex": "0x02"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "satisfied",
      "relationship": "next-area-right-of-current-area",
      "placementSource": "rom-topology-side",
      "spatialClaim": "rom-topology-side",
      "proposedPlacement": {
        "x": 14368,
        "y": 32
      },
      "appliedPlacement": {
        "x": 14368,
        "y": 32
      }
    },
    {
      "edgeId": "boundary-transition:obj02-area04-sub01->obj02-area03-sub00:right",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "reverse",
      "direction": "right",
      "currentAreaId": "obj02-area03",
      "nextAreaId": "obj02-area04",
      "edgeSourceArea": "obj02-area04",
      "edgeTargetArea": "obj02-area03",
      "sourceNode": "obj02-area04-sub01",
      "targetNode": "obj02-area03-sub00",
      "transitionClass": "same-object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "same-object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition stays in the current object set and changes area.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0x00 0x00 0x03",
            "note": "Transition stays in the current object set and changes area."
          }
        ]
      },
      "transition": {
        "kind": "same-objset-area",
        "marker": "0x00",
        "bytes": [
          "0x00",
          "0x00",
          "0x03"
        ],
        "target": {
          "objset": 2,
          "objsetHex": "0x02",
          "area": 3,
          "areaHex": "0x03"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "conflict",
      "relationship": "next-area-left-of-current-area",
      "placementSource": "existing-placement-conflict",
      "spatialClaim": "none",
      "proposedPlacement": {
        "x": 11040,
        "y": 32
      },
      "appliedPlacement": {
        "x": 11040,
        "y": 1952
      },
      "conflict": {
        "reason": "Existing deterministic graph placement does not satisfy this additional ROM edge.",
        "dx": 0,
        "dy": 1920
      }
    },
    {
      "edgeId": "boundary-transition:obj02-area05-sub00->obj02-area03-sub03:left",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "reverse",
      "direction": "left",
      "currentAreaId": "obj02-area03",
      "nextAreaId": "obj02-area05",
      "edgeSourceArea": "obj02-area05",
      "edgeTargetArea": "obj02-area03",
      "sourceNode": "obj02-area05-sub00",
      "targetNode": "obj02-area03-sub03",
      "transitionClass": "same-object-set-load-boundary",
      "transitionSemantics": {
        "transitionClass": "same-object-set-load-boundary",
        "coordinateConfidence": "horizontal-side-plus-load-marker",
        "note": "Transition stays in the current object set and carries the load marker.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFA 0x00 0x03",
            "note": "Transition stays in the current object set and carries the load marker."
          }
        ]
      },
      "transition": {
        "kind": "same-objset-area-load",
        "marker": "0xFA",
        "bytes": [
          "0xFA",
          "0x00",
          "0x03"
        ],
        "target": {
          "objset": 2,
          "objsetHex": "0x02",
          "area": 3,
          "areaHex": "0x03"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "placed",
      "relationship": "next-area-right-of-current-area",
      "placementSource": "rom-topology-side-plus-deterministic-overlap-solver",
      "spatialClaim": "solver-derived-layout",
      "proposedPlacement": {
        "x": 14368,
        "y": 32
      },
      "appliedPlacement": {
        "x": 14368,
        "y": 992
      },
      "solverAdjustment": {
        "source": "deterministic-overlap-avoidance",
        "shifts": 1,
        "rowStep": 960,
        "note": "The edge direction is ROM-derived; the row shift is a generic solver layout choice, not a ROM coordinate."
      }
    },
    {
      "edgeId": "boundary-transition:obj01-area02-sub00->obj02-area05-sub01:left",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "forward",
      "direction": "left",
      "currentAreaId": "obj01-area02",
      "nextAreaId": "obj02-area05",
      "edgeSourceArea": "obj01-area02",
      "edgeTargetArea": "obj02-area05",
      "sourceNode": "obj01-area02-sub00",
      "targetNode": "obj02-area05-sub01",
      "transitionClass": "object-set-load-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-load-boundary",
        "coordinateConfidence": "horizontal-side-plus-load-marker",
        "note": "Transition crosses object set/area and carries the load marker.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFC 0x02 0x05",
            "note": "Transition crosses object set/area and carries the load marker."
          }
        ]
      },
      "transition": {
        "kind": "objset-area-load",
        "marker": "0xFC",
        "bytes": [
          "0xFC",
          "0x02",
          "0x05"
        ],
        "target": {
          "objset": 2,
          "objsetHex": "0x02",
          "area": 5,
          "areaHex": "0x05"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "conflict",
      "relationship": "next-area-left-of-current-area",
      "placementSource": "existing-placement-conflict",
      "spatialClaim": "none",
      "proposedPlacement": {
        "x": 9760,
        "y": 992
      },
      "appliedPlacement": {
        "x": 14368,
        "y": 992
      },
      "conflict": {
        "reason": "Existing deterministic graph placement does not satisfy this additional ROM edge.",
        "dx": 4608,
        "dy": 0
      }
    },
    {
      "edgeId": "boundary-transition:obj02-area05-sub01->obj01-area02-sub00:right",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "reverse",
      "direction": "right",
      "currentAreaId": "obj01-area02",
      "nextAreaId": "obj02-area05",
      "edgeSourceArea": "obj02-area05",
      "edgeTargetArea": "obj01-area02",
      "sourceNode": "obj02-area05-sub01",
      "targetNode": "obj01-area02-sub00",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x01 0x02",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x01",
          "0x02"
        ],
        "target": {
          "objset": 1,
          "objsetHex": "0x01",
          "area": 2,
          "areaHex": "0x02"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "conflict",
      "relationship": "next-area-left-of-current-area",
      "placementSource": "existing-placement-conflict",
      "spatialClaim": "none",
      "proposedPlacement": {
        "x": 9760,
        "y": 992
      },
      "appliedPlacement": {
        "x": 14368,
        "y": 992
      },
      "conflict": {
        "reason": "Existing deterministic graph placement does not satisfy this additional ROM edge.",
        "dx": 4608,
        "dy": 0
      }
    },
    {
      "edgeId": "boundary-transition:obj01-area01-sub00->obj02-area04-sub00:right",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj01-area01",
      "nextAreaId": "obj02-area04",
      "edgeSourceArea": "obj01-area01",
      "edgeTargetArea": "obj02-area04",
      "sourceNode": "obj01-area01-sub00",
      "targetNode": "obj02-area04-sub00",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x02 0x04",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x02",
          "0x04"
        ],
        "target": {
          "objset": 2,
          "objsetHex": "0x02",
          "area": 4,
          "areaHex": "0x04"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "conflict",
      "relationship": "next-area-right-of-current-area",
      "placementSource": "existing-placement-conflict",
      "spatialClaim": "none",
      "proposedPlacement": {
        "x": 12064,
        "y": 992
      },
      "appliedPlacement": {
        "x": 11040,
        "y": 1952
      },
      "conflict": {
        "reason": "Existing deterministic graph placement does not satisfy this additional ROM edge.",
        "dx": -1024,
        "dy": 960
      }
    },
    {
      "edgeId": "boundary-transition:obj02-area04-sub00->obj01-area01-sub00:left",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "reverse",
      "direction": "left",
      "currentAreaId": "obj01-area01",
      "nextAreaId": "obj02-area04",
      "edgeSourceArea": "obj02-area04",
      "edgeTargetArea": "obj01-area01",
      "sourceNode": "obj02-area04-sub00",
      "targetNode": "obj01-area01-sub00",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x01 0x01",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x01",
          "0x01"
        ],
        "target": {
          "objset": 1,
          "objsetHex": "0x01",
          "area": 1,
          "areaHex": "0x01"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "conflict",
      "relationship": "next-area-right-of-current-area",
      "placementSource": "existing-placement-conflict",
      "spatialClaim": "none",
      "proposedPlacement": {
        "x": 12064,
        "y": 992
      },
      "appliedPlacement": {
        "x": 11040,
        "y": 1952
      },
      "conflict": {
        "reason": "Existing deterministic graph placement does not satisfy this additional ROM edge.",
        "dx": -1024,
        "dy": 960
      }
    },
    {
      "edgeId": "boundary-transition:obj03-area01-sub00->obj03-area02-sub00:right",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "reverse",
      "direction": "right",
      "currentAreaId": "obj03-area02",
      "nextAreaId": "obj03-area01",
      "edgeSourceArea": "obj03-area01",
      "edgeTargetArea": "obj03-area02",
      "sourceNode": "obj03-area01-sub00",
      "targetNode": "obj03-area02-sub00",
      "transitionClass": "same-object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "same-object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition stays in the current object set and changes area.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0x00 0x00 0x02",
            "note": "Transition stays in the current object set and changes area."
          }
        ]
      },
      "transition": {
        "kind": "same-objset-area",
        "marker": "0x00",
        "bytes": [
          "0x00",
          "0x00",
          "0x02"
        ],
        "target": {
          "objset": 3,
          "objsetHex": "0x03",
          "area": 2,
          "areaHex": "0x02"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "placed",
      "relationship": "next-area-left-of-current-area",
      "placementSource": "rom-topology-side",
      "spatialClaim": "rom-topology-side",
      "proposedPlacement": {
        "x": 2080,
        "y": 32
      },
      "appliedPlacement": {
        "x": 2080,
        "y": 32
      }
    },
    {
      "edgeId": "boundary-transition:obj03-area02-sub00->obj03-area04-sub00:left",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "forward",
      "direction": "left",
      "currentAreaId": "obj03-area02",
      "nextAreaId": "obj03-area04",
      "edgeSourceArea": "obj03-area02",
      "edgeTargetArea": "obj03-area04",
      "sourceNode": "obj03-area02-sub00",
      "targetNode": "obj03-area04-sub00",
      "transitionClass": "same-object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "same-object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition stays in the current object set and changes area.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0x00 0x00 0x04",
            "note": "Transition stays in the current object set and changes area."
          }
        ]
      },
      "transition": {
        "kind": "same-objset-area",
        "marker": "0x00",
        "bytes": [
          "0x00",
          "0x00",
          "0x04"
        ],
        "target": {
          "objset": 3,
          "objsetHex": "0x03",
          "area": 4,
          "areaHex": "0x04"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "placed",
      "relationship": "next-area-left-of-current-area",
      "placementSource": "rom-topology-side-plus-deterministic-overlap-solver",
      "spatialClaim": "solver-derived-layout",
      "proposedPlacement": {
        "x": 2592,
        "y": 32
      },
      "appliedPlacement": {
        "x": 2592,
        "y": 992
      },
      "solverAdjustment": {
        "source": "deterministic-overlap-avoidance",
        "shifts": 1,
        "rowStep": 960,
        "note": "The edge direction is ROM-derived; the row shift is a generic solver layout choice, not a ROM coordinate."
      }
    },
    {
      "edgeId": "boundary-transition:obj03-area04-sub00->obj03-area02-sub00:right",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "reverse",
      "direction": "right",
      "currentAreaId": "obj03-area02",
      "nextAreaId": "obj03-area04",
      "edgeSourceArea": "obj03-area04",
      "edgeTargetArea": "obj03-area02",
      "sourceNode": "obj03-area04-sub00",
      "targetNode": "obj03-area02-sub00",
      "transitionClass": "same-object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "same-object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition stays in the current object set and changes area.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0x00 0x00 0x02",
            "note": "Transition stays in the current object set and changes area."
          }
        ]
      },
      "transition": {
        "kind": "same-objset-area",
        "marker": "0x00",
        "bytes": [
          "0x00",
          "0x00",
          "0x02"
        ],
        "target": {
          "objset": 3,
          "objsetHex": "0x03",
          "area": 2,
          "areaHex": "0x02"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "conflict",
      "relationship": "next-area-left-of-current-area",
      "placementSource": "existing-placement-conflict",
      "spatialClaim": "none",
      "proposedPlacement": {
        "x": 2592,
        "y": 32
      },
      "appliedPlacement": {
        "x": 2592,
        "y": 992
      },
      "conflict": {
        "reason": "Existing deterministic graph placement does not satisfy this additional ROM edge.",
        "dx": 0,
        "dy": 960
      }
    },
    {
      "edgeId": "boundary-transition:obj01-area03-sub00->obj04-area00-sub01:left",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "forward",
      "direction": "left",
      "currentAreaId": "obj01-area03",
      "nextAreaId": "obj04-area00",
      "edgeSourceArea": "obj01-area03",
      "edgeTargetArea": "obj04-area00",
      "sourceNode": "obj01-area03-sub00",
      "targetNode": "obj04-area00-sub01",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x04 0x00",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x04",
          "0x00"
        ],
        "target": {
          "objset": 4,
          "objsetHex": "0x04",
          "area": 0,
          "areaHex": "0x00"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "placed",
      "relationship": "next-area-left-of-current-area",
      "placementSource": "rom-topology-side-plus-deterministic-overlap-solver",
      "spatialClaim": "solver-derived-layout",
      "proposedPlacement": {
        "x": 2336,
        "y": 992
      },
      "appliedPlacement": {
        "x": 2336,
        "y": 1952
      },
      "solverAdjustment": {
        "source": "deterministic-overlap-avoidance",
        "shifts": 1,
        "rowStep": 960,
        "note": "The edge direction is ROM-derived; the row shift is a generic solver layout choice, not a ROM coordinate."
      }
    },
    {
      "edgeId": "boundary-transition:obj04-area00-sub01->obj01-area03-sub00:right",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "reverse",
      "direction": "right",
      "currentAreaId": "obj01-area03",
      "nextAreaId": "obj04-area00",
      "edgeSourceArea": "obj04-area00",
      "edgeTargetArea": "obj01-area03",
      "sourceNode": "obj04-area00-sub01",
      "targetNode": "obj01-area03-sub00",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x01 0x03",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x01",
          "0x03"
        ],
        "target": {
          "objset": 1,
          "objsetHex": "0x01",
          "area": 3,
          "areaHex": "0x03"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "conflict",
      "relationship": "next-area-left-of-current-area",
      "placementSource": "existing-placement-conflict",
      "spatialClaim": "none",
      "proposedPlacement": {
        "x": 2336,
        "y": 992
      },
      "appliedPlacement": {
        "x": 2336,
        "y": 1952
      },
      "conflict": {
        "reason": "Existing deterministic graph placement does not satisfy this additional ROM edge.",
        "dx": 0,
        "dy": 960
      }
    },
    {
      "edgeId": "boundary-transition:obj00-area02-sub00->obj02-area02-sub00:left",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "reverse",
      "direction": "left",
      "currentAreaId": "obj02-area02",
      "nextAreaId": "obj00-area02",
      "edgeSourceArea": "obj00-area02",
      "edgeTargetArea": "obj02-area02",
      "sourceNode": "obj00-area02-sub00",
      "targetNode": "obj02-area02-sub00",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x02 0x02",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x02",
          "0x02"
        ],
        "target": {
          "objset": 2,
          "objsetHex": "0x02",
          "area": 2,
          "areaHex": "0x02"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "placed",
      "relationship": "next-area-right-of-current-area",
      "placementSource": "rom-topology-side",
      "spatialClaim": "rom-topology-side",
      "proposedPlacement": {
        "x": 14880,
        "y": 32
      },
      "appliedPlacement": {
        "x": 14880,
        "y": 32
      }
    },
    {
      "edgeId": "boundary-transition:obj02-area02-sub00->obj00-area02-sub00:right",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj02-area02",
      "nextAreaId": "obj00-area02",
      "edgeSourceArea": "obj02-area02",
      "edgeTargetArea": "obj00-area02",
      "sourceNode": "obj02-area02-sub00",
      "targetNode": "obj00-area02-sub00",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x00 0x02",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x00",
          "0x02"
        ],
        "target": {
          "objset": 0,
          "objsetHex": "0x00",
          "area": 2,
          "areaHex": "0x02"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "satisfied",
      "relationship": "next-area-right-of-current-area",
      "placementSource": "rom-topology-side",
      "spatialClaim": "rom-topology-side",
      "proposedPlacement": {
        "x": 14880,
        "y": 32
      },
      "appliedPlacement": {
        "x": 14880,
        "y": 32
      }
    },
    {
      "edgeId": "boundary-transition:obj03-area01-sub00->obj03-area00-sub01:left",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "forward",
      "direction": "left",
      "currentAreaId": "obj03-area01",
      "nextAreaId": "obj03-area00",
      "edgeSourceArea": "obj03-area01",
      "edgeTargetArea": "obj03-area00",
      "sourceNode": "obj03-area01-sub00",
      "targetNode": "obj03-area00-sub01",
      "transitionClass": "same-object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "same-object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition stays in the current object set and changes area.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0x00 0x00 0x00",
            "note": "Transition stays in the current object set and changes area."
          }
        ]
      },
      "transition": {
        "kind": "same-objset-area",
        "marker": "0x00",
        "bytes": [
          "0x00",
          "0x00",
          "0x00"
        ],
        "target": {
          "objset": 3,
          "objsetHex": "0x03",
          "area": 0,
          "areaHex": "0x00"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "placed",
      "relationship": "next-area-left-of-current-area",
      "placementSource": "rom-topology-side",
      "spatialClaim": "rom-topology-side",
      "proposedPlacement": {
        "x": 32,
        "y": 32
      },
      "appliedPlacement": {
        "x": 32,
        "y": 32
      }
    },
    {
      "edgeId": "boundary-transition:obj00-area04-sub00->obj03-area04-sub00:right",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "reverse",
      "direction": "right",
      "currentAreaId": "obj03-area04",
      "nextAreaId": "obj00-area04",
      "edgeSourceArea": "obj00-area04",
      "edgeTargetArea": "obj03-area04",
      "sourceNode": "obj00-area04-sub00",
      "targetNode": "obj03-area04-sub00",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x03 0x04",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x03",
          "0x04"
        ],
        "target": {
          "objset": 3,
          "objsetHex": "0x03",
          "area": 4,
          "areaHex": "0x04"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "placed",
      "relationship": "next-area-left-of-current-area",
      "placementSource": "rom-topology-side",
      "spatialClaim": "rom-topology-side",
      "proposedPlacement": {
        "x": 1568,
        "y": 992
      },
      "appliedPlacement": {
        "x": 1568,
        "y": 992
      }
    },
    {
      "edgeId": "boundary-transition:obj03-area04-sub00->obj00-area04-sub00:left",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "forward",
      "direction": "left",
      "currentAreaId": "obj03-area04",
      "nextAreaId": "obj00-area04",
      "edgeSourceArea": "obj03-area04",
      "edgeTargetArea": "obj00-area04",
      "sourceNode": "obj03-area04-sub00",
      "targetNode": "obj00-area04-sub00",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x00 0x04",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x00",
          "0x04"
        ],
        "target": {
          "objset": 0,
          "objsetHex": "0x00",
          "area": 4,
          "areaHex": "0x04"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "satisfied",
      "relationship": "next-area-left-of-current-area",
      "placementSource": "rom-topology-side",
      "spatialClaim": "rom-topology-side",
      "proposedPlacement": {
        "x": 1568,
        "y": 992
      },
      "appliedPlacement": {
        "x": 1568,
        "y": 992
      }
    },
    {
      "edgeId": "boundary-transition:obj04-area00-sub00->obj04-area00-sub01:left",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "forward",
      "direction": "left",
      "currentAreaId": "obj04-area00",
      "nextAreaId": "obj04-area00",
      "edgeSourceArea": "obj04-area00",
      "edgeTargetArea": "obj04-area00",
      "sourceNode": "obj04-area00-sub00",
      "targetNode": "obj04-area00-sub01",
      "transitionClass": "same-object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "same-object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition stays in the current object set and changes area.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0x00 0x00 0x00",
            "note": "Transition stays in the current object set and changes area."
          }
        ]
      },
      "transition": {
        "kind": "same-objset-area",
        "marker": "0x00",
        "bytes": [
          "0x00",
          "0x00",
          "0x00"
        ],
        "target": {
          "objset": 4,
          "objsetHex": "0x04",
          "area": 0,
          "areaHex": "0x00"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "conflict",
      "relationship": "next-area-left-of-current-area",
      "placementSource": "existing-placement-conflict",
      "spatialClaim": "none",
      "proposedPlacement": {
        "x": 288,
        "y": 1952
      },
      "appliedPlacement": {
        "x": 2336,
        "y": 1952
      },
      "conflict": {
        "reason": "Existing deterministic graph placement does not satisfy this additional ROM edge.",
        "dx": 2048,
        "dy": 0
      }
    },
    {
      "edgeId": "boundary-transition:obj00-area02-sub00->obj03-area00-sub00:right",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj00-area02",
      "nextAreaId": "obj03-area00",
      "edgeSourceArea": "obj00-area02",
      "edgeTargetArea": "obj03-area00",
      "sourceNode": "obj00-area02-sub00",
      "targetNode": "obj03-area00-sub00",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x03 0x00",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x03",
          "0x00"
        ],
        "target": {
          "objset": 3,
          "objsetHex": "0x03",
          "area": 0,
          "areaHex": "0x00"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "conflict",
      "relationship": "next-area-right-of-current-area",
      "placementSource": "existing-placement-conflict",
      "spatialClaim": "none",
      "proposedPlacement": {
        "x": 15904,
        "y": 32
      },
      "appliedPlacement": {
        "x": 32,
        "y": 32
      },
      "conflict": {
        "reason": "Existing deterministic graph placement does not satisfy this additional ROM edge.",
        "dx": -15872,
        "dy": 0
      }
    },
    {
      "edgeId": "boundary-transition:obj03-area00-sub00->obj00-area02-sub00:left",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "reverse",
      "direction": "left",
      "currentAreaId": "obj00-area02",
      "nextAreaId": "obj03-area00",
      "edgeSourceArea": "obj03-area00",
      "edgeTargetArea": "obj00-area02",
      "sourceNode": "obj03-area00-sub00",
      "targetNode": "obj00-area02-sub00",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x00 0x02",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x00",
          "0x02"
        ],
        "target": {
          "objset": 0,
          "objsetHex": "0x00",
          "area": 2,
          "areaHex": "0x02"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "conflict",
      "relationship": "next-area-right-of-current-area",
      "placementSource": "existing-placement-conflict",
      "spatialClaim": "none",
      "proposedPlacement": {
        "x": 15904,
        "y": 32
      },
      "appliedPlacement": {
        "x": 32,
        "y": 32
      },
      "conflict": {
        "reason": "Existing deterministic graph placement does not satisfy this additional ROM edge.",
        "dx": -15872,
        "dy": 0
      }
    },
    {
      "edgeId": "boundary-transition:obj01-area00-sub00->obj03-area00-sub01:left",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "reverse",
      "direction": "left",
      "currentAreaId": "obj03-area00",
      "nextAreaId": "obj01-area00",
      "edgeSourceArea": "obj01-area00",
      "edgeTargetArea": "obj03-area00",
      "sourceNode": "obj01-area00-sub00",
      "targetNode": "obj03-area00-sub01",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x03 0x00",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x03",
          "0x00"
        ],
        "target": {
          "objset": 3,
          "objsetHex": "0x03",
          "area": 0,
          "areaHex": "0x00"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "placed",
      "relationship": "next-area-right-of-current-area",
      "placementSource": "rom-topology-side-plus-deterministic-overlap-solver",
      "spatialClaim": "solver-derived-layout",
      "proposedPlacement": {
        "x": 2080,
        "y": 32
      },
      "appliedPlacement": {
        "x": 2080,
        "y": 1952
      },
      "solverAdjustment": {
        "source": "deterministic-overlap-avoidance",
        "shifts": 2,
        "rowStep": 960,
        "note": "The edge direction is ROM-derived; the row shift is a generic solver layout choice, not a ROM coordinate."
      }
    },
    {
      "edgeId": "boundary-transition:obj03-area00-sub01->obj01-area00-sub00:right",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj03-area00",
      "nextAreaId": "obj01-area00",
      "edgeSourceArea": "obj03-area00",
      "edgeTargetArea": "obj01-area00",
      "sourceNode": "obj03-area00-sub01",
      "targetNode": "obj01-area00-sub00",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x01 0x00",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x01",
          "0x00"
        ],
        "target": {
          "objset": 1,
          "objsetHex": "0x01",
          "area": 0,
          "areaHex": "0x00"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "conflict",
      "relationship": "next-area-right-of-current-area",
      "placementSource": "existing-placement-conflict",
      "spatialClaim": "none",
      "proposedPlacement": {
        "x": 2080,
        "y": 32
      },
      "appliedPlacement": {
        "x": 2080,
        "y": 1952
      },
      "conflict": {
        "reason": "Existing deterministic graph placement does not satisfy this additional ROM edge.",
        "dx": 0,
        "dy": 1920
      }
    },
    {
      "edgeId": "boundary-transition:obj00-area04-sub00->obj04-area01-sub01:left",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "forward",
      "direction": "left",
      "currentAreaId": "obj00-area04",
      "nextAreaId": "obj04-area01",
      "edgeSourceArea": "obj00-area04",
      "edgeTargetArea": "obj04-area01",
      "sourceNode": "obj00-area04-sub00",
      "targetNode": "obj04-area01-sub01",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x04 0x01",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x04",
          "0x01"
        ],
        "target": {
          "objset": 4,
          "objsetHex": "0x04",
          "area": 1,
          "areaHex": "0x01"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "placed",
      "relationship": "next-area-left-of-current-area",
      "placementSource": "rom-topology-side",
      "spatialClaim": "rom-topology-side",
      "proposedPlacement": {
        "x": 288,
        "y": 992
      },
      "appliedPlacement": {
        "x": 288,
        "y": 992
      }
    },
    {
      "edgeId": "boundary-transition:obj04-area01-sub01->obj00-area04-sub00:right",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "reverse",
      "direction": "right",
      "currentAreaId": "obj00-area04",
      "nextAreaId": "obj04-area01",
      "edgeSourceArea": "obj04-area01",
      "edgeTargetArea": "obj00-area04",
      "sourceNode": "obj04-area01-sub01",
      "targetNode": "obj00-area04-sub00",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x00 0x04",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x00",
          "0x04"
        ],
        "target": {
          "objset": 0,
          "objsetHex": "0x00",
          "area": 4,
          "areaHex": "0x04"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "satisfied",
      "relationship": "next-area-left-of-current-area",
      "placementSource": "rom-topology-side",
      "spatialClaim": "rom-topology-side",
      "proposedPlacement": {
        "x": 288,
        "y": 992
      },
      "appliedPlacement": {
        "x": 288,
        "y": 992
      }
    },
    {
      "edgeId": "boundary-transition:obj01-area00-sub00->obj03-area03-sub00:right",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj01-area00",
      "nextAreaId": "obj03-area03",
      "edgeSourceArea": "obj01-area00",
      "edgeTargetArea": "obj03-area03",
      "sourceNode": "obj01-area00-sub00",
      "targetNode": "obj03-area03-sub00",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x03 0x03",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x03",
          "0x03"
        ],
        "target": {
          "objset": 3,
          "objsetHex": "0x03",
          "area": 3,
          "areaHex": "0x03"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "placed",
      "relationship": "next-area-right-of-current-area",
      "placementSource": "rom-topology-side-plus-deterministic-overlap-solver",
      "spatialClaim": "solver-derived-layout",
      "proposedPlacement": {
        "x": 2336,
        "y": 1952
      },
      "appliedPlacement": {
        "x": 2336,
        "y": 2912
      },
      "solverAdjustment": {
        "source": "deterministic-overlap-avoidance",
        "shifts": 1,
        "rowStep": 960,
        "note": "The edge direction is ROM-derived; the row shift is a generic solver layout choice, not a ROM coordinate."
      }
    },
    {
      "edgeId": "boundary-transition:obj03-area03-sub00->obj01-area00-sub00:left",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "reverse",
      "direction": "left",
      "currentAreaId": "obj01-area00",
      "nextAreaId": "obj03-area03",
      "edgeSourceArea": "obj03-area03",
      "edgeTargetArea": "obj01-area00",
      "sourceNode": "obj03-area03-sub00",
      "targetNode": "obj01-area00-sub00",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x01 0x00",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x01",
          "0x00"
        ],
        "target": {
          "objset": 1,
          "objsetHex": "0x01",
          "area": 0,
          "areaHex": "0x00"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "conflict",
      "relationship": "next-area-right-of-current-area",
      "placementSource": "existing-placement-conflict",
      "spatialClaim": "none",
      "proposedPlacement": {
        "x": 2336,
        "y": 1952
      },
      "appliedPlacement": {
        "x": 2336,
        "y": 2912
      },
      "conflict": {
        "reason": "Existing deterministic graph placement does not satisfy this additional ROM edge.",
        "dx": 0,
        "dy": 960
      }
    },
    {
      "edgeId": "boundary-transition:obj04-area01-sub00->obj01-area04-sub00:left",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "forward",
      "direction": "left",
      "currentAreaId": "obj04-area01",
      "nextAreaId": "obj01-area04",
      "edgeSourceArea": "obj04-area01",
      "edgeTargetArea": "obj01-area04",
      "sourceNode": "obj04-area01-sub00",
      "targetNode": "obj01-area04-sub00",
      "transitionClass": "special-transport-candidate",
      "transitionSemantics": {
        "transitionClass": "special-transport-candidate",
        "placementMode": "connector-only",
        "ordinaryAdjacency": false,
        "coordinateConfidence": "endpoint-known-position-unknown",
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x01 0x04",
            "note": "The edge target is decoded from the ROM transition table."
          },
          {
            "source": "cv2r-location-metadata",
            "value": "Deborah Cliff (In Tornado) -> Bodley Mansion - Door",
            "note": "One endpoint is labeled as a tornado submap in the reverse-engineered source."
          }
        ],
        "note": "This edge should be rendered as a connector until the transport event coordinates are decoded."
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x01",
          "0x04"
        ],
        "target": {
          "objset": 1,
          "objsetHex": "0x01",
          "area": 4,
          "areaHex": "0x04"
        }
      },
      "routineEvidence": {
        "status": "routine-observed",
        "stepId": "deborah-cliff-to-bodley-door",
        "matchStatus": "source-area-candidate",
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
        ]
      },
      "status": "connector-only",
      "relationship": "connector-only-not-adjacent",
      "placementSource": "deterministic-connector-layout",
      "spatialClaim": "none",
      "appliedPlacement": {
        "x": 7200,
        "y": 3648
      },
      "solverAdjustment": {
        "source": "connector-only-route-break",
        "note": "Transition rules do not provide true transport coordinates, so this edge remains a connector."
      }
    },
    {
      "edgeId": "boundary-transition:obj01-area04-sub00->obj03-area03-sub04:left",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "reverse",
      "direction": "left",
      "currentAreaId": "obj03-area03",
      "nextAreaId": "obj01-area04",
      "edgeSourceArea": "obj01-area04",
      "edgeTargetArea": "obj03-area03",
      "sourceNode": "obj01-area04-sub00",
      "targetNode": "obj03-area03-sub04",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x03 0x03",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x03",
          "0x03"
        ],
        "target": {
          "objset": 3,
          "objsetHex": "0x03",
          "area": 3,
          "areaHex": "0x03"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "conflict",
      "relationship": "next-area-right-of-current-area",
      "placementSource": "existing-placement-conflict",
      "spatialClaim": "none",
      "proposedPlacement": {
        "x": 5920,
        "y": 2912
      },
      "appliedPlacement": {
        "x": 7200,
        "y": 3648
      },
      "conflict": {
        "reason": "Existing deterministic graph placement does not satisfy this additional ROM edge.",
        "dx": 1280,
        "dy": 736
      }
    },
    {
      "edgeId": "boundary-transition:obj03-area03-sub04->obj01-area04-sub00:right",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj03-area03",
      "nextAreaId": "obj01-area04",
      "edgeSourceArea": "obj03-area03",
      "edgeTargetArea": "obj01-area04",
      "sourceNode": "obj03-area03-sub04",
      "targetNode": "obj01-area04-sub00",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x01 0x04",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x01",
          "0x04"
        ],
        "target": {
          "objset": 1,
          "objsetHex": "0x01",
          "area": 4,
          "areaHex": "0x04"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "conflict",
      "relationship": "next-area-right-of-current-area",
      "placementSource": "existing-placement-conflict",
      "spatialClaim": "none",
      "proposedPlacement": {
        "x": 5920,
        "y": 2912
      },
      "appliedPlacement": {
        "x": 7200,
        "y": 3648
      },
      "conflict": {
        "reason": "Existing deterministic graph placement does not satisfy this additional ROM edge.",
        "dx": 1280,
        "dy": 736
      }
    },
    {
      "edgeId": "boundary-transition:obj01-area04-sub00->obj04-area02-sub00:right",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj01-area04",
      "nextAreaId": "obj04-area02",
      "edgeSourceArea": "obj01-area04",
      "edgeTargetArea": "obj04-area02",
      "sourceNode": "obj01-area04-sub00",
      "targetNode": "obj04-area02-sub00",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x04 0x02",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x04",
          "0x02"
        ],
        "target": {
          "objset": 4,
          "objsetHex": "0x04",
          "area": 2,
          "areaHex": "0x02"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "placed",
      "relationship": "next-area-right-of-current-area",
      "placementSource": "rom-topology-side",
      "spatialClaim": "rom-topology-side",
      "proposedPlacement": {
        "x": 7456,
        "y": 3648
      },
      "appliedPlacement": {
        "x": 7456,
        "y": 3648
      }
    },
    {
      "edgeId": "boundary-transition:obj04-area02-sub00->obj01-area04-sub00:left",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "reverse",
      "direction": "left",
      "currentAreaId": "obj01-area04",
      "nextAreaId": "obj04-area02",
      "edgeSourceArea": "obj04-area02",
      "edgeTargetArea": "obj01-area04",
      "sourceNode": "obj04-area02-sub00",
      "targetNode": "obj01-area04-sub00",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x01 0x04",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x01",
          "0x04"
        ],
        "target": {
          "objset": 1,
          "objsetHex": "0x01",
          "area": 4,
          "areaHex": "0x04"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "satisfied",
      "relationship": "next-area-right-of-current-area",
      "placementSource": "rom-topology-side",
      "spatialClaim": "rom-topology-side",
      "proposedPlacement": {
        "x": 7456,
        "y": 3648
      },
      "appliedPlacement": {
        "x": 7456,
        "y": 3648
      }
    },
    {
      "edgeId": "boundary-transition:obj00-area05-sub00->obj04-area02-sub00:left",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "reverse",
      "direction": "left",
      "currentAreaId": "obj04-area02",
      "nextAreaId": "obj00-area05",
      "edgeSourceArea": "obj00-area05",
      "edgeTargetArea": "obj04-area02",
      "sourceNode": "obj00-area05-sub00",
      "targetNode": "obj04-area02-sub00",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x04 0x02",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x04",
          "0x02"
        ],
        "target": {
          "objset": 4,
          "objsetHex": "0x04",
          "area": 2,
          "areaHex": "0x02"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "placed",
      "relationship": "next-area-right-of-current-area",
      "placementSource": "rom-topology-side",
      "spatialClaim": "rom-topology-side",
      "proposedPlacement": {
        "x": 8480,
        "y": 3648
      },
      "appliedPlacement": {
        "x": 8480,
        "y": 3648
      }
    },
    {
      "edgeId": "boundary-transition:obj04-area02-sub00->obj00-area05-sub00:right",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj04-area02",
      "nextAreaId": "obj00-area05",
      "edgeSourceArea": "obj04-area02",
      "edgeTargetArea": "obj00-area05",
      "sourceNode": "obj04-area02-sub00",
      "targetNode": "obj00-area05-sub00",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x00 0x05",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x00",
          "0x05"
        ],
        "target": {
          "objset": 0,
          "objsetHex": "0x00",
          "area": 5,
          "areaHex": "0x05"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "satisfied",
      "relationship": "next-area-right-of-current-area",
      "placementSource": "rom-topology-side",
      "spatialClaim": "rom-topology-side",
      "proposedPlacement": {
        "x": 8480,
        "y": 3648
      },
      "appliedPlacement": {
        "x": 8480,
        "y": 3648
      }
    },
    {
      "edgeId": "boundary-transition:obj00-area05-sub00->obj02-area08-sub00:right",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj00-area05",
      "nextAreaId": "obj02-area08",
      "edgeSourceArea": "obj00-area05",
      "edgeTargetArea": "obj02-area08",
      "sourceNode": "obj00-area05-sub00",
      "targetNode": "obj02-area08-sub00",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x02 0x08",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x02",
          "0x08"
        ],
        "target": {
          "objset": 2,
          "objsetHex": "0x02",
          "area": 8,
          "areaHex": "0x08"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "placed",
      "relationship": "next-area-right-of-current-area",
      "placementSource": "rom-topology-side",
      "spatialClaim": "rom-topology-side",
      "proposedPlacement": {
        "x": 9504,
        "y": 3648
      },
      "appliedPlacement": {
        "x": 9504,
        "y": 3648
      }
    },
    {
      "edgeId": "boundary-transition:obj02-area08-sub00->obj00-area05-sub00:left",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "reverse",
      "direction": "left",
      "currentAreaId": "obj00-area05",
      "nextAreaId": "obj02-area08",
      "edgeSourceArea": "obj02-area08",
      "edgeTargetArea": "obj00-area05",
      "sourceNode": "obj02-area08-sub00",
      "targetNode": "obj00-area05-sub00",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x00 0x05",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x00",
          "0x05"
        ],
        "target": {
          "objset": 0,
          "objsetHex": "0x00",
          "area": 5,
          "areaHex": "0x05"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "satisfied",
      "relationship": "next-area-right-of-current-area",
      "placementSource": "rom-topology-side",
      "spatialClaim": "rom-topology-side",
      "proposedPlacement": {
        "x": 9504,
        "y": 3648
      },
      "appliedPlacement": {
        "x": 9504,
        "y": 3648
      }
    },
    {
      "edgeId": "boundary-transition:obj00-area06-sub00->obj02-area08-sub02:left",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "reverse",
      "direction": "left",
      "currentAreaId": "obj02-area08",
      "nextAreaId": "obj00-area06",
      "edgeSourceArea": "obj00-area06",
      "edgeTargetArea": "obj02-area08",
      "sourceNode": "obj00-area06-sub00",
      "targetNode": "obj02-area08-sub02",
      "transitionClass": "object-set-load-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-load-boundary",
        "coordinateConfidence": "horizontal-side-plus-load-marker",
        "note": "Transition crosses object set/area and carries the load marker.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFC 0x02 0x08",
            "note": "Transition crosses object set/area and carries the load marker."
          }
        ]
      },
      "transition": {
        "kind": "objset-area-load",
        "marker": "0xFC",
        "bytes": [
          "0xFC",
          "0x02",
          "0x08"
        ],
        "target": {
          "objset": 2,
          "objsetHex": "0x02",
          "area": 8,
          "areaHex": "0x08"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "placed",
      "relationship": "next-area-right-of-current-area",
      "placementSource": "rom-topology-side",
      "spatialClaim": "rom-topology-side",
      "proposedPlacement": {
        "x": 11552,
        "y": 3648
      },
      "appliedPlacement": {
        "x": 11552,
        "y": 3648
      }
    },
    {
      "edgeId": "boundary-transition:obj02-area08-sub02->obj02-area09-sub00:right",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj02-area08",
      "nextAreaId": "obj02-area09",
      "edgeSourceArea": "obj02-area08",
      "edgeTargetArea": "obj02-area09",
      "sourceNode": "obj02-area08-sub02",
      "targetNode": "obj02-area09-sub00",
      "transitionClass": "same-object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "same-object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition stays in the current object set and changes area.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0x00 0x00 0x09",
            "note": "Transition stays in the current object set and changes area."
          }
        ]
      },
      "transition": {
        "kind": "same-objset-area",
        "marker": "0x00",
        "bytes": [
          "0x00",
          "0x00",
          "0x09"
        ],
        "target": {
          "objset": 2,
          "objsetHex": "0x02",
          "area": 9,
          "areaHex": "0x09"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "placed",
      "relationship": "next-area-right-of-current-area",
      "placementSource": "rom-topology-side-plus-deterministic-overlap-solver",
      "spatialClaim": "solver-derived-layout",
      "proposedPlacement": {
        "x": 11552,
        "y": 3648
      },
      "appliedPlacement": {
        "x": 11552,
        "y": 4608
      },
      "solverAdjustment": {
        "source": "deterministic-overlap-avoidance",
        "shifts": 1,
        "rowStep": 960,
        "note": "The edge direction is ROM-derived; the row shift is a generic solver layout choice, not a ROM coordinate."
      }
    },
    {
      "edgeId": "boundary-transition:obj02-area09-sub00->obj02-area08-sub02:left",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "reverse",
      "direction": "left",
      "currentAreaId": "obj02-area08",
      "nextAreaId": "obj02-area09",
      "edgeSourceArea": "obj02-area09",
      "edgeTargetArea": "obj02-area08",
      "sourceNode": "obj02-area09-sub00",
      "targetNode": "obj02-area08-sub02",
      "transitionClass": "same-object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "same-object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition stays in the current object set and changes area.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0x00 0x00 0x08",
            "note": "Transition stays in the current object set and changes area."
          }
        ]
      },
      "transition": {
        "kind": "same-objset-area",
        "marker": "0x00",
        "bytes": [
          "0x00",
          "0x00",
          "0x08"
        ],
        "target": {
          "objset": 2,
          "objsetHex": "0x02",
          "area": 8,
          "areaHex": "0x08"
        }
      },
      "routineEvidence": {
        "status": "routine-observed",
        "stepId": "dora-part-3-to-part-2",
        "matchStatus": "direct",
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
        ]
      },
      "status": "conflict",
      "relationship": "next-area-right-of-current-area",
      "placementSource": "existing-placement-conflict",
      "spatialClaim": "none",
      "proposedPlacement": {
        "x": 11552,
        "y": 3648
      },
      "appliedPlacement": {
        "x": 11552,
        "y": 4608
      },
      "conflict": {
        "reason": "Existing deterministic graph placement does not satisfy this additional ROM edge.",
        "dx": 0,
        "dy": 960
      }
    },
    {
      "edgeId": "boundary-transition:obj00-area06-sub00->obj04-area03-sub00:right",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj00-area06",
      "nextAreaId": "obj04-area03",
      "edgeSourceArea": "obj00-area06",
      "edgeTargetArea": "obj04-area03",
      "sourceNode": "obj00-area06-sub00",
      "targetNode": "obj04-area03-sub00",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x04 0x03",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x04",
          "0x03"
        ],
        "target": {
          "objset": 4,
          "objsetHex": "0x04",
          "area": 3,
          "areaHex": "0x03"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "placed",
      "relationship": "next-area-right-of-current-area",
      "placementSource": "rom-topology-side",
      "spatialClaim": "rom-topology-side",
      "proposedPlacement": {
        "x": 12576,
        "y": 3648
      },
      "appliedPlacement": {
        "x": 12576,
        "y": 3648
      }
    },
    {
      "edgeId": "boundary-transition:obj04-area03-sub00->obj00-area06-sub00:left",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "reverse",
      "direction": "left",
      "currentAreaId": "obj00-area06",
      "nextAreaId": "obj04-area03",
      "edgeSourceArea": "obj04-area03",
      "edgeTargetArea": "obj00-area06",
      "sourceNode": "obj04-area03-sub00",
      "targetNode": "obj00-area06-sub00",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x00 0x06",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x00",
          "0x06"
        ],
        "target": {
          "objset": 0,
          "objsetHex": "0x00",
          "area": 6,
          "areaHex": "0x06"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "satisfied",
      "relationship": "next-area-right-of-current-area",
      "placementSource": "rom-topology-side",
      "spatialClaim": "rom-topology-side",
      "proposedPlacement": {
        "x": 12576,
        "y": 3648
      },
      "appliedPlacement": {
        "x": 12576,
        "y": 3648
      }
    },
    {
      "edgeId": "boundary-transition:obj04-area03-sub01->obj05-area00-sub00:right",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj04-area03",
      "nextAreaId": "obj05-area00",
      "edgeSourceArea": "obj04-area03",
      "edgeTargetArea": "obj05-area00",
      "sourceNode": "obj04-area03-sub01",
      "targetNode": "obj05-area00-sub00",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x05 0x00",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x05",
          "0x00"
        ],
        "target": {
          "objset": 5,
          "objsetHex": "0x05",
          "area": 0,
          "areaHex": "0x00"
        }
      },
      "routineEvidence": {
        "status": "routine-observed",
        "stepId": "bridge-to-castlevania",
        "matchStatus": "direct",
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
        ]
      },
      "status": "placed",
      "relationship": "next-area-right-of-current-area",
      "placementSource": "rom-topology-side",
      "spatialClaim": "rom-topology-side",
      "proposedPlacement": {
        "x": 14624,
        "y": 3648
      },
      "appliedPlacement": {
        "x": 14624,
        "y": 3648
      }
    },
    {
      "edgeId": "boundary-transition:obj05-area00-sub00->obj04-area03-sub01:left",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "reverse",
      "direction": "left",
      "currentAreaId": "obj04-area03",
      "nextAreaId": "obj05-area00",
      "edgeSourceArea": "obj05-area00",
      "edgeTargetArea": "obj04-area03",
      "sourceNode": "obj05-area00-sub00",
      "targetNode": "obj04-area03-sub01",
      "transitionClass": "object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition crosses to an area that may use another object set.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x04 0x03",
            "note": "Transition crosses to an area that may use another object set."
          }
        ]
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x04",
          "0x03"
        ],
        "target": {
          "objset": 4,
          "objsetHex": "0x04",
          "area": 3,
          "areaHex": "0x03"
        }
      },
      "routineEvidence": {
        "status": "routine-observed",
        "stepId": "castlevania-to-bridge",
        "matchStatus": "direct",
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
        ]
      },
      "status": "satisfied",
      "relationship": "next-area-right-of-current-area",
      "placementSource": "rom-topology-side",
      "spatialClaim": "rom-topology-side",
      "proposedPlacement": {
        "x": 14624,
        "y": 3648
      },
      "appliedPlacement": {
        "x": 14624,
        "y": 3648
      }
    },
    {
      "edgeId": "boundary-transition:obj05-area00-sub00->obj05-area00-sub00:right",
      "edgeType": "boundary-transition",
      "confidence": "rom-area-transition",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj05-area00",
      "nextAreaId": "obj05-area00",
      "edgeSourceArea": "obj05-area00",
      "edgeTargetArea": "obj05-area00",
      "sourceNode": "obj05-area00-sub00",
      "targetNode": "obj05-area00-sub00",
      "transitionClass": "same-object-set-boundary",
      "transitionSemantics": {
        "transitionClass": "same-object-set-boundary",
        "coordinateConfidence": "horizontal-side-only",
        "note": "Transition stays in the current object set and changes area.",
        "placementMode": "ordinary-adjacency",
        "ordinaryAdjacency": true,
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0x00 0x00 0x00",
            "note": "Transition stays in the current object set and changes area."
          }
        ]
      },
      "transition": {
        "kind": "same-objset-area",
        "marker": "0x00",
        "bytes": [
          "0x00",
          "0x00",
          "0x00"
        ],
        "target": {
          "objset": 5,
          "objsetHex": "0x05",
          "area": 0,
          "areaHex": "0x00"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "conflict",
      "relationship": "next-area-right-of-current-area",
      "placementSource": "existing-placement-conflict",
      "spatialClaim": "none",
      "proposedPlacement": {
        "x": 15648,
        "y": 3648
      },
      "appliedPlacement": {
        "x": 14624,
        "y": 3648
      },
      "conflict": {
        "reason": "Existing deterministic graph placement does not satisfy this additional ROM edge.",
        "dx": -1024,
        "dy": 0
      }
    }
  ],
  "unresolved": [
    {
      "edgeId": "boundary-transition:obj02-area09-sub02->unresolved:right",
      "edgeType": "boundary-transition",
      "confidence": "unresolved-target",
      "traversal": "forward",
      "direction": "right",
      "currentAreaId": "obj02-area09",
      "nextAreaId": "obj00-area09",
      "edgeSourceArea": "obj02-area09",
      "edgeTargetArea": "obj00-area09",
      "sourceNode": "obj02-area09-sub02",
      "transitionClass": "unresolved-target",
      "transitionSemantics": {
        "transitionClass": "unresolved-target",
        "placementMode": "unresolved",
        "ordinaryAdjacency": false,
        "coordinateConfidence": "target-not-in-atlas",
        "evidence": [
          {
            "source": "rom-area-transition-bytes",
            "value": "0xFF 0x00 0x09",
            "note": "Transition target is not currently represented by the exterior atlas."
          }
        ],
        "note": "The transition is preserved as metadata until the target is decoded or intentionally excluded."
      },
      "transition": {
        "kind": "objset-area",
        "marker": "0xFF",
        "bytes": [
          "0xFF",
          "0x00",
          "0x09"
        ],
        "target": {
          "objset": 0,
          "objsetHex": "0x00",
          "area": 9,
          "areaHex": "0x09"
        }
      },
      "routineEvidence": {
        "status": "not-observed"
      },
      "status": "unresolved",
      "reason": "target area is not renderable in the recipe atlas",
      "spatialClaim": "none"
    }
  ],
  "skipped": []
};
