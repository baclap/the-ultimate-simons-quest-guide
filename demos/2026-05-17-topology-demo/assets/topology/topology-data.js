window.EXTERIOR_TOPOLOGY = {
  "schemaVersion": 1,
  "source": {
    "rom": "local iNES ROM",
    "renderer": "rom-area-transition-topology",
    "notes": [
      "Topology edges come from area-record transition triples at offsets 3..8.",
      "Submap sequence edges come from cv2r submap order within one area record.",
      "This is an adjacency graph, not final world-coordinate placement."
    ]
  },
  "constants": {
    "areaTablePointers": "0xF7AB",
    "screenRecordPointersOffset": "0x09"
  },
  "summary": {
    "nodes": 55,
    "areas": 32,
    "edges": 87,
    "submapSequenceEdges": 23,
    "boundaryTransitionEdges": 64,
    "unresolvedBoundaryEdges": 1,
    "templatePendingNodes": 5,
    "routeCount": 1
  },
  "nodes": [
    {
      "id": "obj00-area00-sub00",
      "atlasId": "obj00-area00-sub00-jova",
      "areaId": "obj00-area00",
      "name": "Jova",
      "objset": 0,
      "objsetHex": "0x00",
      "area": 0,
      "areaHex": "0x00",
      "submap": 0,
      "submapHex": "0x00",
      "category": "town-exteriors",
      "atlasImage": "images/obj00-area00-sub00-jova.png",
      "screenRecordPointerAddress": "0xFA08",
      "screenRecordAddress": "0xFA3A",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj00-area01-sub00",
      "atlasId": "obj00-area01-sub00-veros",
      "areaId": "obj00-area01",
      "name": "Veros",
      "objset": 0,
      "objsetHex": "0x00",
      "area": 1,
      "areaHex": "0x01",
      "submap": 0,
      "submapHex": "0x00",
      "category": "town-exteriors",
      "atlasImage": "images/obj00-area01-sub00-veros.png",
      "screenRecordPointerAddress": "0x8660",
      "screenRecordAddress": "0x86AC",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj00-area02-sub00",
      "atlasId": "obj00-area02-sub00-aljiba",
      "areaId": "obj00-area02",
      "name": "Aljiba",
      "objset": 0,
      "objsetHex": "0x00",
      "area": 2,
      "areaHex": "0x02",
      "submap": 0,
      "submapHex": "0x00",
      "category": "town-exteriors",
      "atlasImage": "images/obj00-area02-sub00-aljiba.png",
      "screenRecordPointerAddress": "0xFACB",
      "screenRecordAddress": "0xFB1E",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj00-area03-sub00",
      "atlasId": "obj00-area03-sub00-alba",
      "areaId": "obj00-area03",
      "name": "Alba",
      "objset": 0,
      "objsetHex": "0x00",
      "area": 3,
      "areaHex": "0x03",
      "submap": 0,
      "submapHex": "0x00",
      "category": "town-exteriors",
      "atlasImage": "images/obj00-area03-sub00-alba.png",
      "screenRecordPointerAddress": "0xFA13",
      "screenRecordAddress": "0xFA3B",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj00-area04-sub00",
      "atlasId": "obj00-area04-sub00-ondol",
      "areaId": "obj00-area04",
      "name": "Ondol",
      "objset": 0,
      "objsetHex": "0x00",
      "area": 4,
      "areaHex": "0x04",
      "submap": 0,
      "submapHex": "0x00",
      "category": "town-exteriors",
      "atlasImage": "images/obj00-area04-sub00-ondol.png",
      "screenRecordPointerAddress": "0x866B",
      "screenRecordAddress": "0x86AD",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj00-area05-sub00",
      "atlasId": "obj00-area05-sub00-doina",
      "areaId": "obj00-area05",
      "name": "Doina",
      "objset": 0,
      "objsetHex": "0x00",
      "area": 5,
      "areaHex": "0x05",
      "submap": 0,
      "submapHex": "0x00",
      "category": "town-exteriors",
      "atlasImage": "images/obj00-area05-sub00-doina.png",
      "screenRecordPointerAddress": "0xFAD6",
      "screenRecordAddress": "0xFB1F",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj00-area06-sub00",
      "atlasId": "obj00-area06-sub00-yomi",
      "areaId": "obj00-area06",
      "name": "Yomi",
      "objset": 0,
      "objsetHex": "0x00",
      "area": 6,
      "areaHex": "0x06",
      "submap": 0,
      "submapHex": "0x00",
      "category": "town-exteriors",
      "atlasImage": "images/obj00-area06-sub00-yomi.png",
      "screenRecordPointerAddress": "0xFAE1",
      "screenRecordAddress": "0xFB20",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj01-area00-sub00",
      "atlasId": "obj01-area00-sub00-laruba-mansion-door",
      "areaId": "obj01-area00",
      "name": "Laruba Mansion - Door",
      "objset": 1,
      "objsetHex": "0x01",
      "area": 0,
      "areaHex": "0x00",
      "submap": 0,
      "submapHex": "0x00",
      "category": "mansion-door-exteriors",
      "atlasImage": "images/obj01-area00-sub00-laruba-mansion-door.png",
      "screenRecordPointerAddress": "0x88D0",
      "screenRecordAddress": "0x88E3",
      "templateStatus": "template-pending"
    },
    {
      "id": "obj01-area01-sub00",
      "atlasId": "obj01-area01-sub00-berkeley-mansion-door",
      "areaId": "obj01-area01",
      "name": "Berkeley Mansion - Door",
      "objset": 1,
      "objsetHex": "0x01",
      "area": 1,
      "areaHex": "0x01",
      "submap": 0,
      "submapHex": "0x00",
      "category": "mansion-door-exteriors",
      "atlasImage": "images/obj01-area01-sub00-berkeley-mansion-door.png",
      "screenRecordPointerAddress": "0x8D43",
      "screenRecordAddress": "0x8D61",
      "templateStatus": "template-pending"
    },
    {
      "id": "obj01-area02-sub00",
      "atlasId": "obj01-area02-sub00-rover-mansion-door",
      "areaId": "obj01-area02",
      "name": "Rover Mansion - Door",
      "objset": 1,
      "objsetHex": "0x01",
      "area": 2,
      "areaHex": "0x02",
      "submap": 0,
      "submapHex": "0x00",
      "category": "mansion-door-exteriors",
      "atlasImage": "images/obj01-area02-sub00-rover-mansion-door.png",
      "screenRecordPointerAddress": "0x9253",
      "screenRecordAddress": "0x9257",
      "templateStatus": "template-pending"
    },
    {
      "id": "obj01-area03-sub00",
      "atlasId": "obj01-area03-sub00-brahm-mansion-door",
      "areaId": "obj01-area03",
      "name": "Brahm Mansion - Door",
      "objset": 1,
      "objsetHex": "0x01",
      "area": 3,
      "areaHex": "0x03",
      "submap": 0,
      "submapHex": "0x00",
      "category": "mansion-door-exteriors",
      "atlasImage": "images/obj01-area03-sub00-brahm-mansion-door.png",
      "screenRecordPointerAddress": "0x9684",
      "screenRecordAddress": "0x9697",
      "templateStatus": "template-pending"
    },
    {
      "id": "obj01-area04-sub00",
      "atlasId": "obj01-area04-sub00-bodley-mansion-door",
      "areaId": "obj01-area04",
      "name": "Bodley Mansion - Door",
      "objset": 1,
      "objsetHex": "0x01",
      "area": 4,
      "areaHex": "0x04",
      "submap": 0,
      "submapHex": "0x00",
      "category": "mansion-door-exteriors",
      "atlasImage": "images/obj01-area04-sub00-bodley-mansion-door.png",
      "screenRecordPointerAddress": "0x9A5A",
      "screenRecordAddress": "0x9A69",
      "templateStatus": "template-pending"
    },
    {
      "id": "obj02-area00-sub00",
      "atlasId": "obj02-area00-sub00-jova-woods",
      "areaId": "obj02-area00",
      "name": "Jova Woods",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 0,
      "areaHex": "0x00",
      "submap": 0,
      "submapHex": "0x00",
      "category": "western-overworld",
      "atlasImage": "images/obj02-area00-sub00-jova-woods.png",
      "screenRecordPointerAddress": "0xA152",
      "screenRecordAddress": "0xA1A0",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj02-area00-sub01",
      "atlasId": "obj02-area00-sub01-jova-veros-bridge",
      "areaId": "obj02-area00",
      "name": "Jova-Veros Bridge",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 0,
      "areaHex": "0x00",
      "submap": 1,
      "submapHex": "0x01",
      "category": "western-overworld",
      "atlasImage": "images/obj02-area00-sub01-jova-veros-bridge.png",
      "screenRecordPointerAddress": "0xA154",
      "screenRecordAddress": "0xA1A1",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj02-area00-sub02",
      "atlasId": "obj02-area00-sub02-veros-woods-part-1",
      "areaId": "obj02-area00",
      "name": "Veros Woods - Part 1",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 0,
      "areaHex": "0x00",
      "submap": 2,
      "submapHex": "0x02",
      "category": "western-overworld",
      "atlasImage": "images/obj02-area00-sub02-veros-woods-part-1.png",
      "screenRecordPointerAddress": "0xA156",
      "screenRecordAddress": "0xA1A2",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj02-area00-sub03",
      "atlasId": "obj02-area00-sub03-veros-woods-part-2",
      "areaId": "obj02-area00",
      "name": "Veros Woods - Part 2",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 0,
      "areaHex": "0x00",
      "submap": 3,
      "submapHex": "0x03",
      "category": "western-overworld",
      "atlasImage": "images/obj02-area00-sub03-veros-woods-part-2.png",
      "screenRecordPointerAddress": "0xA158",
      "screenRecordAddress": "0xA1A3",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj02-area01-sub00",
      "atlasId": "obj02-area01-sub00-denis-woods-part-1",
      "areaId": "obj02-area01",
      "name": "Denis Woods - Part 1",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 1,
      "areaHex": "0x01",
      "submap": 0,
      "submapHex": "0x00",
      "category": "western-overworld",
      "atlasImage": "images/obj02-area01-sub00-denis-woods-part-1.png",
      "screenRecordPointerAddress": "0xA163",
      "screenRecordAddress": "0xA1A8",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj02-area02-sub00",
      "atlasId": "obj02-area02-sub00-aljiba-woods-part-3",
      "areaId": "obj02-area02",
      "name": "Aljiba Woods - Part 3",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 2,
      "areaHex": "0x02",
      "submap": 0,
      "submapHex": "0x00",
      "category": "western-overworld",
      "atlasImage": "images/obj02-area02-sub00-aljiba-woods-part-3.png",
      "screenRecordPointerAddress": "0xA6A3",
      "screenRecordAddress": "0xA6D0",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj02-area03-sub00",
      "atlasId": "obj02-area03-sub00-dabi-s-path-part-1",
      "areaId": "obj02-area03",
      "name": "Dabi's Path - Part 1",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 3,
      "areaHex": "0x03",
      "submap": 0,
      "submapHex": "0x00",
      "category": "western-overworld",
      "atlasImage": "images/obj02-area03-sub00-dabi-s-path-part-1.png",
      "screenRecordPointerAddress": "0xA6AE",
      "screenRecordAddress": "0xA6D1",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj02-area03-sub01",
      "atlasId": "obj02-area03-sub01-dabi-s-path-part-2",
      "areaId": "obj02-area03",
      "name": "Dabi's Path - Part 2",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 3,
      "areaHex": "0x03",
      "submap": 1,
      "submapHex": "0x01",
      "category": "western-overworld",
      "atlasImage": "images/obj02-area03-sub01-dabi-s-path-part-2.png",
      "screenRecordPointerAddress": "0xA6B0",
      "screenRecordAddress": "0xA6D6",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj02-area03-sub02",
      "atlasId": "obj02-area03-sub02-aljiba-woods-part-1",
      "areaId": "obj02-area03",
      "name": "Aljiba Woods - Part 1",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 3,
      "areaHex": "0x03",
      "submap": 2,
      "submapHex": "0x02",
      "category": "western-overworld",
      "atlasImage": "images/obj02-area03-sub02-aljiba-woods-part-1.png",
      "screenRecordPointerAddress": "0xA6B2",
      "screenRecordAddress": "0xA6D7",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj02-area03-sub03",
      "atlasId": "obj02-area03-sub03-aljiba-woods-part-2",
      "areaId": "obj02-area03",
      "name": "Aljiba Woods - Part 2",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 3,
      "areaHex": "0x03",
      "submap": 3,
      "submapHex": "0x03",
      "category": "western-overworld",
      "atlasImage": "images/obj02-area03-sub03-aljiba-woods-part-2.png",
      "screenRecordPointerAddress": "0xA6B4",
      "screenRecordAddress": "0xA6D8",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj02-area04-sub00",
      "atlasId": "obj02-area04-sub00-denis-woods-part-2",
      "areaId": "obj02-area04",
      "name": "Denis Woods - Part 2",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 4,
      "areaHex": "0x04",
      "submap": 0,
      "submapHex": "0x00",
      "category": "western-overworld",
      "atlasImage": "images/obj02-area04-sub00-denis-woods-part-2.png",
      "screenRecordPointerAddress": "0xA6BF",
      "screenRecordAddress": "0xA6DD",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj02-area04-sub01",
      "atlasId": "obj02-area04-sub01-denis-woods-part-3",
      "areaId": "obj02-area04",
      "name": "Denis Woods - Part 3",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 4,
      "areaHex": "0x04",
      "submap": 1,
      "submapHex": "0x01",
      "category": "western-overworld",
      "atlasImage": "images/obj02-area04-sub01-denis-woods-part-3.png",
      "screenRecordPointerAddress": "0xA6C1",
      "screenRecordAddress": "0xA6DE",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj02-area05-sub00",
      "atlasId": "obj02-area05-sub00-yuba-lake-path",
      "areaId": "obj02-area05",
      "name": "Yuba Lake Path",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 5,
      "areaHex": "0x05",
      "submap": 0,
      "submapHex": "0x00",
      "category": "western-overworld",
      "atlasImage": "images/obj02-area05-sub00-yuba-lake-path.png",
      "screenRecordPointerAddress": "0xA6CC",
      "screenRecordAddress": "0xA6DF",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj02-area05-sub01",
      "atlasId": "obj02-area05-sub01-yuba-lake",
      "areaId": "obj02-area05",
      "name": "Yuba Lake",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 5,
      "areaHex": "0x05",
      "submap": 1,
      "submapHex": "0x01",
      "category": "western-overworld",
      "atlasImage": "images/obj02-area05-sub01-yuba-lake.png",
      "screenRecordPointerAddress": "0xA6CE",
      "screenRecordAddress": "0xA6E0",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj02-area06-sub00",
      "atlasId": "obj02-area06-sub00-dead-river-to-brahm",
      "areaId": "obj02-area06",
      "name": "Dead River to Brahm",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 6,
      "areaHex": "0x06",
      "submap": 0,
      "submapHex": "0x00",
      "category": "western-overworld",
      "atlasImage": "images/obj02-area06-sub00-dead-river-to-brahm.png",
      "screenRecordPointerAddress": "0xA16E",
      "screenRecordAddress": "0xA19D",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj02-area07-sub00",
      "atlasId": "obj02-area07-sub00-dead-river-part-2",
      "areaId": "obj02-area07",
      "name": "Dead River - Part 2",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 7,
      "areaHex": "0x07",
      "submap": 0,
      "submapHex": "0x00",
      "category": "western-overworld",
      "atlasImage": "images/obj02-area07-sub00-dead-river-part-2.png",
      "screenRecordPointerAddress": "0xA179",
      "screenRecordAddress": "0xA19D",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj02-area07-sub01",
      "atlasId": "obj02-area07-sub01-dead-river-part-1",
      "areaId": "obj02-area07",
      "name": "Dead River - Part 1",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 7,
      "areaHex": "0x07",
      "submap": 1,
      "submapHex": "0x01",
      "category": "western-overworld",
      "atlasImage": "images/obj02-area07-sub01-dead-river-part-1.png",
      "screenRecordPointerAddress": "0xA17B",
      "screenRecordAddress": "0xA19E",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj02-area07-sub02",
      "atlasId": "obj02-area07-sub02-belasco-marsh",
      "areaId": "obj02-area07",
      "name": "Belasco Marsh",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 7,
      "areaHex": "0x07",
      "submap": 2,
      "submapHex": "0x02",
      "category": "western-overworld",
      "atlasImage": "images/obj02-area07-sub02-belasco-marsh.png",
      "screenRecordPointerAddress": "0xA17D",
      "screenRecordAddress": "0xA19F",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj02-area08-sub00",
      "atlasId": "obj02-area08-sub00-north-bridge",
      "areaId": "obj02-area08",
      "name": "North Bridge",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 8,
      "areaHex": "0x08",
      "submap": 0,
      "submapHex": "0x00",
      "category": "western-overworld",
      "atlasImage": "images/obj02-area08-sub00-north-bridge.png",
      "screenRecordPointerAddress": "0xA188",
      "screenRecordAddress": "0xA1A9",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj02-area08-sub01",
      "atlasId": "obj02-area08-sub01-dora-woods-part-1",
      "areaId": "obj02-area08",
      "name": "Dora Woods - Part 1",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 8,
      "areaHex": "0x08",
      "submap": 1,
      "submapHex": "0x01",
      "category": "western-overworld",
      "atlasImage": "images/obj02-area08-sub01-dora-woods-part-1.png",
      "screenRecordPointerAddress": "0xA18A",
      "screenRecordAddress": "0xA1AA",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj02-area08-sub02",
      "atlasId": "obj02-area08-sub02-dora-woods-part-2",
      "areaId": "obj02-area08",
      "name": "Dora Woods - Part 2",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 8,
      "areaHex": "0x08",
      "submap": 2,
      "submapHex": "0x02",
      "category": "western-overworld",
      "atlasImage": "images/obj02-area08-sub02-dora-woods-part-2.png",
      "screenRecordPointerAddress": "0xA18C",
      "screenRecordAddress": "0xA1AB",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj02-area09-sub00",
      "atlasId": "obj02-area09-sub00-dora-woods-part-3",
      "areaId": "obj02-area09",
      "name": "Dora Woods - Part 3",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 9,
      "areaHex": "0x09",
      "submap": 0,
      "submapHex": "0x00",
      "category": "western-overworld",
      "atlasImage": "images/obj02-area09-sub00-dora-woods-part-3.png",
      "screenRecordPointerAddress": "0xA197",
      "screenRecordAddress": "0xA1B0",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj02-area09-sub01",
      "atlasId": "obj02-area09-sub01-long-bridge-to-bordia-mountains-dead-end-swamp",
      "areaId": "obj02-area09",
      "name": "Long Bridge to Bordia Mountains (Dead End Swamp)",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 9,
      "areaHex": "0x09",
      "submap": 1,
      "submapHex": "0x01",
      "category": "western-overworld",
      "atlasImage": "images/obj02-area09-sub01-long-bridge-to-bordia-mountains-dead-end-swamp.png",
      "screenRecordPointerAddress": "0xA199",
      "screenRecordAddress": "0xA1B1",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj02-area09-sub02",
      "atlasId": "obj02-area09-sub02-bordia-mountains-dead-end-swamp",
      "areaId": "obj02-area09",
      "name": "Bordia Mountains (Dead End Swamp)",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 9,
      "areaHex": "0x09",
      "submap": 2,
      "submapHex": "0x02",
      "category": "western-overworld",
      "atlasImage": "images/obj02-area09-sub02-bordia-mountains-dead-end-swamp.png",
      "screenRecordPointerAddress": "0xA19B",
      "screenRecordAddress": "0xA1B2",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj03-area00-sub00",
      "atlasId": "obj03-area00-sub00-camilla-cemetery",
      "areaId": "obj03-area00",
      "name": "Camilla Cemetery",
      "objset": 3,
      "objsetHex": "0x03",
      "area": 0,
      "areaHex": "0x00",
      "submap": 0,
      "submapHex": "0x00",
      "category": "eastern-overworld",
      "atlasImage": "images/obj03-area00-sub00-camilla-cemetery.png",
      "screenRecordPointerAddress": "0xB37B",
      "screenRecordAddress": "0xB3A2",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj03-area00-sub01",
      "atlasId": "obj03-area00-sub01-joma-marsh-part-1",
      "areaId": "obj03-area00",
      "name": "Joma Marsh - Part 1",
      "objset": 3,
      "objsetHex": "0x03",
      "area": 0,
      "areaHex": "0x00",
      "submap": 1,
      "submapHex": "0x01",
      "category": "eastern-overworld",
      "atlasImage": "images/obj03-area00-sub01-joma-marsh-part-1.png",
      "screenRecordPointerAddress": "0xB37D",
      "screenRecordAddress": "0xB3A3",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj03-area01-sub00",
      "atlasId": "obj03-area01-sub00-storigoi-graveyard-blob-boost",
      "areaId": "obj03-area01",
      "name": "Storigoi Graveyard (Blob Boost)",
      "objset": 3,
      "objsetHex": "0x03",
      "area": 1,
      "areaHex": "0x01",
      "submap": 0,
      "submapHex": "0x00",
      "category": "eastern-overworld",
      "atlasImage": "images/obj03-area01-sub00-storigoi-graveyard-blob-boost.png",
      "screenRecordPointerAddress": "0xB388",
      "screenRecordAddress": "0xB3A4",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj03-area02-sub00",
      "atlasId": "obj03-area02-sub00-sadam-woods-part-2",
      "areaId": "obj03-area02",
      "name": "Sadam Woods - Part 2",
      "objset": 3,
      "objsetHex": "0x03",
      "area": 2,
      "areaHex": "0x02",
      "submap": 0,
      "submapHex": "0x00",
      "category": "eastern-overworld",
      "atlasImage": "images/obj03-area02-sub00-sadam-woods-part-2.png",
      "screenRecordPointerAddress": "0xB393",
      "screenRecordAddress": "0xB3A5",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj03-area02-sub01",
      "atlasId": "obj03-area02-sub01-sadam-woods-part-1",
      "areaId": "obj03-area02",
      "name": "Sadam Woods - Part 1",
      "objset": 3,
      "objsetHex": "0x03",
      "area": 2,
      "areaHex": "0x02",
      "submap": 1,
      "submapHex": "0x01",
      "category": "eastern-overworld",
      "atlasImage": "images/obj03-area02-sub01-sadam-woods-part-1.png",
      "screenRecordPointerAddress": "0xB395",
      "screenRecordAddress": "0xB3AA",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj03-area03-sub00",
      "atlasId": "obj03-area03-sub00-joma-marsh-part-2",
      "areaId": "obj03-area03",
      "name": "Joma Marsh - Part 2",
      "objset": 3,
      "objsetHex": "0x03",
      "area": 3,
      "areaHex": "0x03",
      "submap": 0,
      "submapHex": "0x00",
      "category": "eastern-overworld",
      "atlasImage": "images/obj03-area03-sub00-joma-marsh-part-2.png",
      "screenRecordPointerAddress": "0xB7D0",
      "screenRecordAddress": "0xB7DA",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj03-area03-sub01",
      "atlasId": "obj03-area03-sub01-joma-marsh-part-3-fire-and-skulls",
      "areaId": "obj03-area03",
      "name": "Joma Marsh - Part 3 (Fire and Skulls)",
      "objset": 3,
      "objsetHex": "0x03",
      "area": 3,
      "areaHex": "0x03",
      "submap": 1,
      "submapHex": "0x01",
      "category": "eastern-overworld",
      "atlasImage": "images/obj03-area03-sub01-joma-marsh-part-3-fire-and-skulls.png",
      "screenRecordPointerAddress": "0xB7D2",
      "screenRecordAddress": "0xB7DB",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj03-area03-sub02",
      "atlasId": "obj03-area03-sub02-debious-woods-part-3",
      "areaId": "obj03-area03",
      "name": "Debious Woods - Part 3",
      "objset": 3,
      "objsetHex": "0x03",
      "area": 3,
      "areaHex": "0x03",
      "submap": 2,
      "submapHex": "0x02",
      "category": "eastern-overworld",
      "atlasImage": "images/obj03-area03-sub02-debious-woods-part-3.png",
      "screenRecordPointerAddress": "0xB7D4",
      "screenRecordAddress": "0xB7DC",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj03-area03-sub03",
      "atlasId": "obj03-area03-sub03-debious-woods-part-2",
      "areaId": "obj03-area03",
      "name": "Debious Woods - Part 2",
      "objset": 3,
      "objsetHex": "0x03",
      "area": 3,
      "areaHex": "0x03",
      "submap": 3,
      "submapHex": "0x03",
      "category": "eastern-overworld",
      "atlasImage": "images/obj03-area03-sub03-debious-woods-part-2.png",
      "screenRecordPointerAddress": "0xB7D6",
      "screenRecordAddress": "0xB7DD",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj03-area03-sub04",
      "atlasId": "obj03-area03-sub04-debious-woods-part-1",
      "areaId": "obj03-area03",
      "name": "Debious Woods - Part 1",
      "objset": 3,
      "objsetHex": "0x03",
      "area": 3,
      "areaHex": "0x03",
      "submap": 4,
      "submapHex": "0x04",
      "category": "eastern-overworld",
      "atlasImage": "images/obj03-area03-sub04-debious-woods-part-1.png",
      "screenRecordPointerAddress": "0xB7D8",
      "screenRecordAddress": "0xB7DE",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj03-area04-sub00",
      "atlasId": "obj03-area04-sub00-sadam-woods-part-3",
      "areaId": "obj03-area04",
      "name": "Sadam Woods - Part 3",
      "objset": 3,
      "objsetHex": "0x03",
      "area": 4,
      "areaHex": "0x04",
      "submap": 0,
      "submapHex": "0x00",
      "category": "eastern-overworld",
      "atlasImage": "images/obj03-area04-sub00-sadam-woods-part-3.png",
      "screenRecordPointerAddress": "0xB3A0",
      "screenRecordAddress": "0xB3AB",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj04-area00-sub00",
      "atlasId": "obj04-area00-sub00-vrad-mountain-part-2-diamond-dude",
      "areaId": "obj04-area00",
      "name": "Vrad Mountain - Part 2 (Diamond Dude)",
      "objset": 4,
      "objsetHex": "0x04",
      "area": 0,
      "areaHex": "0x00",
      "submap": 0,
      "submapHex": "0x00",
      "category": "mountains-and-castle-approach",
      "atlasImage": "images/obj04-area00-sub00-vrad-mountain-part-2-diamond-dude.png",
      "screenRecordPointerAddress": "0xAE75",
      "screenRecordAddress": "0xAE9E",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj04-area00-sub01",
      "atlasId": "obj04-area00-sub01-vrad-mountain-part-1",
      "areaId": "obj04-area00",
      "name": "Vrad Mountain - Part 1",
      "objset": 4,
      "objsetHex": "0x04",
      "area": 0,
      "areaHex": "0x00",
      "submap": 1,
      "submapHex": "0x01",
      "category": "mountains-and-castle-approach",
      "atlasImage": "images/obj04-area00-sub01-vrad-mountain-part-1.png",
      "screenRecordPointerAddress": "0xAE77",
      "screenRecordAddress": "0xAE9F",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj04-area01-sub00",
      "atlasId": "obj04-area01-sub00-deborah-cliff-in-tornado",
      "areaId": "obj04-area01",
      "name": "Deborah Cliff (In Tornado)",
      "objset": 4,
      "objsetHex": "0x04",
      "area": 1,
      "areaHex": "0x01",
      "submap": 0,
      "submapHex": "0x00",
      "category": "mountains-and-castle-approach",
      "atlasImage": "images/obj04-area01-sub00-deborah-cliff-in-tornado.png",
      "screenRecordPointerAddress": "0xAE82",
      "screenRecordAddress": "0xAEA4",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj04-area01-sub01",
      "atlasId": "obj04-area01-sub01-jam-wasteland-deborah-cliff",
      "areaId": "obj04-area01",
      "name": "Jam Wasteland (Deborah Cliff)",
      "objset": 4,
      "objsetHex": "0x04",
      "area": 1,
      "areaHex": "0x01",
      "submap": 1,
      "submapHex": "0x01",
      "category": "mountains-and-castle-approach",
      "atlasImage": "images/obj04-area01-sub01-jam-wasteland-deborah-cliff.png",
      "screenRecordPointerAddress": "0xAE84",
      "screenRecordAddress": "0xAEA0",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj04-area02-sub00",
      "atlasId": "obj04-area02-sub00-wicked-ditch",
      "areaId": "obj04-area02",
      "name": "Wicked Ditch",
      "objset": 4,
      "objsetHex": "0x04",
      "area": 2,
      "areaHex": "0x02",
      "submap": 0,
      "submapHex": "0x00",
      "category": "mountains-and-castle-approach",
      "atlasImage": "images/obj04-area02-sub00-wicked-ditch.png",
      "screenRecordPointerAddress": "0xAE8F",
      "screenRecordAddress": "0xAEA1",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj04-area03-sub00",
      "atlasId": "obj04-area03-sub00-vrad-graveyard",
      "areaId": "obj04-area03",
      "name": "Vrad Graveyard",
      "objset": 4,
      "objsetHex": "0x04",
      "area": 3,
      "areaHex": "0x03",
      "submap": 0,
      "submapHex": "0x00",
      "category": "mountains-and-castle-approach",
      "atlasImage": "images/obj04-area03-sub00-vrad-graveyard.png",
      "screenRecordPointerAddress": "0xAE9A",
      "screenRecordAddress": "0xAEA2",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj04-area03-sub01",
      "atlasId": "obj04-area03-sub01-castlevania-bridge",
      "areaId": "obj04-area03",
      "name": "Castlevania Bridge",
      "objset": 4,
      "objsetHex": "0x04",
      "area": 3,
      "areaHex": "0x03",
      "submap": 1,
      "submapHex": "0x01",
      "category": "mountains-and-castle-approach",
      "atlasImage": "images/obj04-area03-sub01-castlevania-bridge.png",
      "screenRecordPointerAddress": "0xAE9C",
      "screenRecordAddress": "0xAEA3",
      "templateStatus": "atlas-rendered"
    },
    {
      "id": "obj05-area00-sub00",
      "atlasId": "obj05-area00-sub00-castlevania",
      "areaId": "obj05-area00",
      "name": "Castlevania",
      "objset": 5,
      "objsetHex": "0x05",
      "area": 0,
      "areaHex": "0x00",
      "submap": 0,
      "submapHex": "0x00",
      "category": "castlevania-exterior",
      "atlasImage": "images/obj05-area00-sub00-castlevania.png",
      "screenRecordPointerAddress": "0xBC61",
      "screenRecordAddress": "0xBC65",
      "templateStatus": "atlas-rendered"
    }
  ],
  "areas": [
    {
      "id": "obj00-area00",
      "label": "Jova",
      "objset": 0,
      "objsetHex": "0x00",
      "area": 0,
      "areaHex": "0x00",
      "category": "town-exteriors",
      "nodeIds": [
        "obj00-area00-sub00"
      ],
      "atlasIds": [
        "obj00-area00-sub00-jova"
      ],
      "maxSubmap": 0,
      "areaRecord": {
        "areaTablePointerAddress": "0xF7AB",
        "areaTableAddress": "0x8042",
        "areaRecordPointerAddress": "0x8042",
        "areaRecordAddress": "0xF9FF",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFF",
          "0x02",
          "0x07"
        ],
        "rightBytes": [
          "0xFF",
          "0x02",
          "0x00"
        ]
      },
      "transitions": {
        "left": {
          "side": "left",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x02",
            "0x07"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 2,
            "third": 7
          },
          "target": {
            "objset": 2,
            "area": 7
          }
        },
        "right": {
          "side": "right",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x02",
            "0x00"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 2,
            "third": 0
          },
          "target": {
            "objset": 2,
            "area": 0
          }
        }
      }
    },
    {
      "id": "obj00-area01",
      "label": "Veros",
      "objset": 0,
      "objsetHex": "0x00",
      "area": 1,
      "areaHex": "0x01",
      "category": "town-exteriors",
      "nodeIds": [
        "obj00-area01-sub00"
      ],
      "atlasIds": [
        "obj00-area01-sub00-veros"
      ],
      "maxSubmap": 0,
      "areaRecord": {
        "areaTablePointerAddress": "0xF7AB",
        "areaTableAddress": "0x8042",
        "areaRecordPointerAddress": "0x8044",
        "areaRecordAddress": "0x8657",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFC",
          "0x02",
          "0x00"
        ],
        "rightBytes": [
          "0xFC",
          "0x02",
          "0x03"
        ]
      },
      "transitions": {
        "left": {
          "side": "left",
          "kind": "objset-area-load",
          "bytes": [
            "0xFC",
            "0x02",
            "0x00"
          ],
          "marker": "0xFC",
          "raw": {
            "marker": 252,
            "second": 2,
            "third": 0
          },
          "target": {
            "objset": 2,
            "area": 0
          }
        },
        "right": {
          "side": "right",
          "kind": "objset-area-load",
          "bytes": [
            "0xFC",
            "0x02",
            "0x03"
          ],
          "marker": "0xFC",
          "raw": {
            "marker": 252,
            "second": 2,
            "third": 3
          },
          "target": {
            "objset": 2,
            "area": 3
          }
        }
      }
    },
    {
      "id": "obj00-area02",
      "label": "Aljiba",
      "objset": 0,
      "objsetHex": "0x00",
      "area": 2,
      "areaHex": "0x02",
      "category": "town-exteriors",
      "nodeIds": [
        "obj00-area02-sub00"
      ],
      "atlasIds": [
        "obj00-area02-sub00-aljiba"
      ],
      "maxSubmap": 0,
      "areaRecord": {
        "areaTablePointerAddress": "0xF7AB",
        "areaTableAddress": "0x8042",
        "areaRecordPointerAddress": "0x8046",
        "areaRecordAddress": "0xFAC2",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFF",
          "0x02",
          "0x02"
        ],
        "rightBytes": [
          "0xFF",
          "0x03",
          "0x00"
        ]
      },
      "transitions": {
        "left": {
          "side": "left",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x02",
            "0x02"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 2,
            "third": 2
          },
          "target": {
            "objset": 2,
            "area": 2
          }
        },
        "right": {
          "side": "right",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x03",
            "0x00"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 3,
            "third": 0
          },
          "target": {
            "objset": 3,
            "area": 0
          }
        }
      }
    },
    {
      "id": "obj00-area03",
      "label": "Alba",
      "objset": 0,
      "objsetHex": "0x00",
      "area": 3,
      "areaHex": "0x03",
      "category": "town-exteriors",
      "nodeIds": [
        "obj00-area03-sub00"
      ],
      "atlasIds": [
        "obj00-area03-sub00-alba"
      ],
      "maxSubmap": 0,
      "areaRecord": {
        "areaTablePointerAddress": "0xF7AB",
        "areaTableAddress": "0x8042",
        "areaRecordPointerAddress": "0x8048",
        "areaRecordAddress": "0xFA0A",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFF",
          "0x03",
          "0x02"
        ],
        "rightBytes": [
          "0xFF",
          "0x02",
          "0x07"
        ]
      },
      "transitions": {
        "left": {
          "side": "left",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x03",
            "0x02"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 3,
            "third": 2
          },
          "target": {
            "objset": 3,
            "area": 2
          }
        },
        "right": {
          "side": "right",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x02",
            "0x07"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 2,
            "third": 7
          },
          "target": {
            "objset": 2,
            "area": 7
          }
        }
      }
    },
    {
      "id": "obj00-area04",
      "label": "Ondol",
      "objset": 0,
      "objsetHex": "0x00",
      "area": 4,
      "areaHex": "0x04",
      "category": "town-exteriors",
      "nodeIds": [
        "obj00-area04-sub00"
      ],
      "atlasIds": [
        "obj00-area04-sub00-ondol"
      ],
      "maxSubmap": 0,
      "areaRecord": {
        "areaTablePointerAddress": "0xF7AB",
        "areaTableAddress": "0x8042",
        "areaRecordPointerAddress": "0x804A",
        "areaRecordAddress": "0x8662",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFF",
          "0x04",
          "0x01"
        ],
        "rightBytes": [
          "0xFF",
          "0x03",
          "0x04"
        ]
      },
      "transitions": {
        "left": {
          "side": "left",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x04",
            "0x01"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 4,
            "third": 1
          },
          "target": {
            "objset": 4,
            "area": 1
          }
        },
        "right": {
          "side": "right",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x03",
            "0x04"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 3,
            "third": 4
          },
          "target": {
            "objset": 3,
            "area": 4
          }
        }
      }
    },
    {
      "id": "obj00-area05",
      "label": "Doina",
      "objset": 0,
      "objsetHex": "0x00",
      "area": 5,
      "areaHex": "0x05",
      "category": "town-exteriors",
      "nodeIds": [
        "obj00-area05-sub00"
      ],
      "atlasIds": [
        "obj00-area05-sub00-doina"
      ],
      "maxSubmap": 0,
      "areaRecord": {
        "areaTablePointerAddress": "0xF7AB",
        "areaTableAddress": "0x8042",
        "areaRecordPointerAddress": "0x804C",
        "areaRecordAddress": "0xFACD",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFF",
          "0x04",
          "0x02"
        ],
        "rightBytes": [
          "0xFF",
          "0x02",
          "0x08"
        ]
      },
      "transitions": {
        "left": {
          "side": "left",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x04",
            "0x02"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 4,
            "third": 2
          },
          "target": {
            "objset": 4,
            "area": 2
          }
        },
        "right": {
          "side": "right",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x02",
            "0x08"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 2,
            "third": 8
          },
          "target": {
            "objset": 2,
            "area": 8
          }
        }
      }
    },
    {
      "id": "obj00-area06",
      "label": "Yomi",
      "objset": 0,
      "objsetHex": "0x00",
      "area": 6,
      "areaHex": "0x06",
      "category": "town-exteriors",
      "nodeIds": [
        "obj00-area06-sub00"
      ],
      "atlasIds": [
        "obj00-area06-sub00-yomi"
      ],
      "maxSubmap": 0,
      "areaRecord": {
        "areaTablePointerAddress": "0xF7AB",
        "areaTableAddress": "0x8042",
        "areaRecordPointerAddress": "0x804E",
        "areaRecordAddress": "0xFAD8",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFC",
          "0x02",
          "0x08"
        ],
        "rightBytes": [
          "0xFF",
          "0x04",
          "0x03"
        ]
      },
      "transitions": {
        "left": {
          "side": "left",
          "kind": "objset-area-load",
          "bytes": [
            "0xFC",
            "0x02",
            "0x08"
          ],
          "marker": "0xFC",
          "raw": {
            "marker": 252,
            "second": 2,
            "third": 8
          },
          "target": {
            "objset": 2,
            "area": 8
          }
        },
        "right": {
          "side": "right",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x04",
            "0x03"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 4,
            "third": 3
          },
          "target": {
            "objset": 4,
            "area": 3
          }
        }
      }
    },
    {
      "id": "obj01-area00",
      "label": "Laruba Mansion - Door",
      "objset": 1,
      "objsetHex": "0x01",
      "area": 0,
      "areaHex": "0x00",
      "category": "mansion-door-exteriors",
      "nodeIds": [
        "obj01-area00-sub00"
      ],
      "atlasIds": [
        "obj01-area00-sub00-laruba-mansion-door"
      ],
      "maxSubmap": 0,
      "areaRecord": {
        "areaTablePointerAddress": "0xF7AD",
        "areaTableAddress": "0x873C",
        "areaRecordPointerAddress": "0x873C",
        "areaRecordAddress": "0x88C7",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFF",
          "0x03",
          "0x00"
        ],
        "rightBytes": [
          "0xFF",
          "0x03",
          "0x03"
        ]
      },
      "transitions": {
        "left": {
          "side": "left",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x03",
            "0x00"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 3,
            "third": 0
          },
          "target": {
            "objset": 3,
            "area": 0
          }
        },
        "right": {
          "side": "right",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x03",
            "0x03"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 3,
            "third": 3
          },
          "target": {
            "objset": 3,
            "area": 3
          }
        }
      }
    },
    {
      "id": "obj01-area01",
      "label": "Berkeley Mansion - Door",
      "objset": 1,
      "objsetHex": "0x01",
      "area": 1,
      "areaHex": "0x01",
      "category": "mansion-door-exteriors",
      "nodeIds": [
        "obj01-area01-sub00"
      ],
      "atlasIds": [
        "obj01-area01-sub00-berkeley-mansion-door"
      ],
      "maxSubmap": 0,
      "areaRecord": {
        "areaTablePointerAddress": "0xF7AD",
        "areaTableAddress": "0x873C",
        "areaRecordPointerAddress": "0x873E",
        "areaRecordAddress": "0x8D3A",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFF",
          "0x02",
          "0x01"
        ],
        "rightBytes": [
          "0xFF",
          "0x02",
          "0x04"
        ]
      },
      "transitions": {
        "left": {
          "side": "left",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x02",
            "0x01"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 2,
            "third": 1
          },
          "target": {
            "objset": 2,
            "area": 1
          }
        },
        "right": {
          "side": "right",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x02",
            "0x04"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 2,
            "third": 4
          },
          "target": {
            "objset": 2,
            "area": 4
          }
        }
      }
    },
    {
      "id": "obj01-area02",
      "label": "Rover Mansion - Door",
      "objset": 1,
      "objsetHex": "0x01",
      "area": 2,
      "areaHex": "0x02",
      "category": "mansion-door-exteriors",
      "nodeIds": [
        "obj01-area02-sub00"
      ],
      "atlasIds": [
        "obj01-area02-sub00-rover-mansion-door"
      ],
      "maxSubmap": 0,
      "areaRecord": {
        "areaTablePointerAddress": "0xF7AD",
        "areaTableAddress": "0x873C",
        "areaRecordPointerAddress": "0x8740",
        "areaRecordAddress": "0x924A",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFC",
          "0x02",
          "0x05"
        ],
        "rightBytes": [
          "0xFF",
          "0x00",
          "0x01"
        ]
      },
      "transitions": {
        "left": {
          "side": "left",
          "kind": "objset-area-load",
          "bytes": [
            "0xFC",
            "0x02",
            "0x05"
          ],
          "marker": "0xFC",
          "raw": {
            "marker": 252,
            "second": 2,
            "third": 5
          },
          "target": {
            "objset": 2,
            "area": 5
          }
        },
        "right": {
          "side": "right",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x00",
            "0x01"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 0,
            "third": 1
          },
          "target": {
            "objset": 0,
            "area": 1
          }
        }
      }
    },
    {
      "id": "obj01-area03",
      "label": "Brahm Mansion - Door",
      "objset": 1,
      "objsetHex": "0x01",
      "area": 3,
      "areaHex": "0x03",
      "category": "mansion-door-exteriors",
      "nodeIds": [
        "obj01-area03-sub00"
      ],
      "atlasIds": [
        "obj01-area03-sub00-brahm-mansion-door"
      ],
      "maxSubmap": 0,
      "areaRecord": {
        "areaTablePointerAddress": "0xF7AD",
        "areaTableAddress": "0x873C",
        "areaRecordPointerAddress": "0x8742",
        "areaRecordAddress": "0x967B",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFF",
          "0x04",
          "0x00"
        ],
        "rightBytes": [
          "0xFF",
          "0x02",
          "0x06"
        ]
      },
      "transitions": {
        "left": {
          "side": "left",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x04",
            "0x00"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 4,
            "third": 0
          },
          "target": {
            "objset": 4,
            "area": 0
          }
        },
        "right": {
          "side": "right",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x02",
            "0x06"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 2,
            "third": 6
          },
          "target": {
            "objset": 2,
            "area": 6
          }
        }
      }
    },
    {
      "id": "obj01-area04",
      "label": "Bodley Mansion - Door",
      "objset": 1,
      "objsetHex": "0x01",
      "area": 4,
      "areaHex": "0x04",
      "category": "mansion-door-exteriors",
      "nodeIds": [
        "obj01-area04-sub00"
      ],
      "atlasIds": [
        "obj01-area04-sub00-bodley-mansion-door"
      ],
      "maxSubmap": 0,
      "areaRecord": {
        "areaTablePointerAddress": "0xF7AD",
        "areaTableAddress": "0x873C",
        "areaRecordPointerAddress": "0x8744",
        "areaRecordAddress": "0x9A51",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFF",
          "0x03",
          "0x03"
        ],
        "rightBytes": [
          "0xFF",
          "0x04",
          "0x02"
        ]
      },
      "transitions": {
        "left": {
          "side": "left",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x03",
            "0x03"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 3,
            "third": 3
          },
          "target": {
            "objset": 3,
            "area": 3
          }
        },
        "right": {
          "side": "right",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x04",
            "0x02"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 4,
            "third": 2
          },
          "target": {
            "objset": 4,
            "area": 2
          }
        }
      }
    },
    {
      "id": "obj02-area00",
      "label": "Jova Woods -> Veros Woods - Part 2",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 0,
      "areaHex": "0x00",
      "category": "western-overworld",
      "nodeIds": [
        "obj02-area00-sub00",
        "obj02-area00-sub01",
        "obj02-area00-sub02",
        "obj02-area00-sub03"
      ],
      "atlasIds": [
        "obj02-area00-sub00-jova-woods",
        "obj02-area00-sub01-jova-veros-bridge",
        "obj02-area00-sub02-veros-woods-part-1",
        "obj02-area00-sub03-veros-woods-part-2"
      ],
      "maxSubmap": 3,
      "areaRecord": {
        "areaTablePointerAddress": "0xF7AF",
        "areaTableAddress": "0x9EE5",
        "areaRecordPointerAddress": "0x9EE5",
        "areaRecordAddress": "0xA149",
        "maxSubmap": 3,
        "leftBytes": [
          "0xFF",
          "0x00",
          "0x00"
        ],
        "rightBytes": [
          "0x00",
          "0x00",
          "0x01"
        ]
      },
      "transitions": {
        "left": {
          "side": "left",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x00",
            "0x00"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 0,
            "third": 0
          },
          "target": {
            "objset": 0,
            "area": 0
          }
        },
        "right": {
          "side": "right",
          "kind": "same-objset-area",
          "bytes": [
            "0x00",
            "0x00",
            "0x01"
          ],
          "marker": "0x00",
          "raw": {
            "marker": 0,
            "second": 0,
            "third": 1
          },
          "target": {
            "objset": 2,
            "area": 1
          }
        }
      }
    },
    {
      "id": "obj02-area01",
      "label": "Denis Woods - Part 1",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 1,
      "areaHex": "0x01",
      "category": "western-overworld",
      "nodeIds": [
        "obj02-area01-sub00"
      ],
      "atlasIds": [
        "obj02-area01-sub00-denis-woods-part-1"
      ],
      "maxSubmap": 0,
      "areaRecord": {
        "areaTablePointerAddress": "0xF7AF",
        "areaTableAddress": "0x9EE5",
        "areaRecordPointerAddress": "0x9EE7",
        "areaRecordAddress": "0xA15A",
        "maxSubmap": 0,
        "leftBytes": [
          "0x00",
          "0x00",
          "0x00"
        ],
        "rightBytes": [
          "0xFF",
          "0x01",
          "0x01"
        ]
      },
      "transitions": {
        "left": {
          "side": "left",
          "kind": "same-objset-area",
          "bytes": [
            "0x00",
            "0x00",
            "0x00"
          ],
          "marker": "0x00",
          "raw": {
            "marker": 0,
            "second": 0,
            "third": 0
          },
          "target": {
            "objset": 2,
            "area": 0
          }
        },
        "right": {
          "side": "right",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x01",
            "0x01"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 1,
            "third": 1
          },
          "target": {
            "objset": 1,
            "area": 1
          }
        }
      }
    },
    {
      "id": "obj02-area02",
      "label": "Aljiba Woods - Part 3",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 2,
      "areaHex": "0x02",
      "category": "western-overworld",
      "nodeIds": [
        "obj02-area02-sub00"
      ],
      "atlasIds": [
        "obj02-area02-sub00-aljiba-woods-part-3"
      ],
      "maxSubmap": 0,
      "areaRecord": {
        "areaTablePointerAddress": "0xF7AF",
        "areaTableAddress": "0x9EE5",
        "areaRecordPointerAddress": "0x9EE9",
        "areaRecordAddress": "0xA69A",
        "maxSubmap": 0,
        "leftBytes": [
          "0x00",
          "0x00",
          "0x03"
        ],
        "rightBytes": [
          "0xFF",
          "0x00",
          "0x02"
        ]
      },
      "transitions": {
        "left": {
          "side": "left",
          "kind": "same-objset-area",
          "bytes": [
            "0x00",
            "0x00",
            "0x03"
          ],
          "marker": "0x00",
          "raw": {
            "marker": 0,
            "second": 0,
            "third": 3
          },
          "target": {
            "objset": 2,
            "area": 3
          }
        },
        "right": {
          "side": "right",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x00",
            "0x02"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 0,
            "third": 2
          },
          "target": {
            "objset": 0,
            "area": 2
          }
        }
      }
    },
    {
      "id": "obj02-area03",
      "label": "Dabi's Path - Part 1 -> Aljiba Woods - Part 2",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 3,
      "areaHex": "0x03",
      "category": "western-overworld",
      "nodeIds": [
        "obj02-area03-sub00",
        "obj02-area03-sub01",
        "obj02-area03-sub02",
        "obj02-area03-sub03"
      ],
      "atlasIds": [
        "obj02-area03-sub00-dabi-s-path-part-1",
        "obj02-area03-sub01-dabi-s-path-part-2",
        "obj02-area03-sub02-aljiba-woods-part-1",
        "obj02-area03-sub03-aljiba-woods-part-2"
      ],
      "maxSubmap": 3,
      "areaRecord": {
        "areaTablePointerAddress": "0xF7AF",
        "areaTableAddress": "0x9EE5",
        "areaRecordPointerAddress": "0x9EEB",
        "areaRecordAddress": "0xA6A5",
        "maxSubmap": 3,
        "leftBytes": [
          "0x00",
          "0x00",
          "0x04"
        ],
        "rightBytes": [
          "0x00",
          "0x00",
          "0x02"
        ]
      },
      "transitions": {
        "left": {
          "side": "left",
          "kind": "same-objset-area",
          "bytes": [
            "0x00",
            "0x00",
            "0x04"
          ],
          "marker": "0x00",
          "raw": {
            "marker": 0,
            "second": 0,
            "third": 4
          },
          "target": {
            "objset": 2,
            "area": 4
          }
        },
        "right": {
          "side": "right",
          "kind": "same-objset-area",
          "bytes": [
            "0x00",
            "0x00",
            "0x02"
          ],
          "marker": "0x00",
          "raw": {
            "marker": 0,
            "second": 0,
            "third": 2
          },
          "target": {
            "objset": 2,
            "area": 2
          }
        }
      }
    },
    {
      "id": "obj02-area04",
      "label": "Denis Woods - Part 2 -> Denis Woods - Part 3",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 4,
      "areaHex": "0x04",
      "category": "western-overworld",
      "nodeIds": [
        "obj02-area04-sub00",
        "obj02-area04-sub01"
      ],
      "atlasIds": [
        "obj02-area04-sub00-denis-woods-part-2",
        "obj02-area04-sub01-denis-woods-part-3"
      ],
      "maxSubmap": 1,
      "areaRecord": {
        "areaTablePointerAddress": "0xF7AF",
        "areaTableAddress": "0x9EE5",
        "areaRecordPointerAddress": "0x9EED",
        "areaRecordAddress": "0xA6B6",
        "maxSubmap": 1,
        "leftBytes": [
          "0xFF",
          "0x01",
          "0x01"
        ],
        "rightBytes": [
          "0x00",
          "0x00",
          "0x03"
        ]
      },
      "transitions": {
        "left": {
          "side": "left",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x01",
            "0x01"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 1,
            "third": 1
          },
          "target": {
            "objset": 1,
            "area": 1
          }
        },
        "right": {
          "side": "right",
          "kind": "same-objset-area",
          "bytes": [
            "0x00",
            "0x00",
            "0x03"
          ],
          "marker": "0x00",
          "raw": {
            "marker": 0,
            "second": 0,
            "third": 3
          },
          "target": {
            "objset": 2,
            "area": 3
          }
        }
      }
    },
    {
      "id": "obj02-area05",
      "label": "Yuba Lake Path -> Yuba Lake",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 5,
      "areaHex": "0x05",
      "category": "western-overworld",
      "nodeIds": [
        "obj02-area05-sub00",
        "obj02-area05-sub01"
      ],
      "atlasIds": [
        "obj02-area05-sub00-yuba-lake-path",
        "obj02-area05-sub01-yuba-lake"
      ],
      "maxSubmap": 1,
      "areaRecord": {
        "areaTablePointerAddress": "0xF7AF",
        "areaTableAddress": "0x9EE5",
        "areaRecordPointerAddress": "0x9EEF",
        "areaRecordAddress": "0xA6C3",
        "maxSubmap": 1,
        "leftBytes": [
          "0xFA",
          "0x00",
          "0x03"
        ],
        "rightBytes": [
          "0xFF",
          "0x01",
          "0x02"
        ]
      },
      "transitions": {
        "left": {
          "side": "left",
          "kind": "same-objset-area-load",
          "bytes": [
            "0xFA",
            "0x00",
            "0x03"
          ],
          "marker": "0xFA",
          "raw": {
            "marker": 250,
            "second": 0,
            "third": 3
          },
          "target": {
            "objset": 2,
            "area": 3
          }
        },
        "right": {
          "side": "right",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x01",
            "0x02"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 1,
            "third": 2
          },
          "target": {
            "objset": 1,
            "area": 2
          }
        }
      }
    },
    {
      "id": "obj02-area06",
      "label": "Dead River to Brahm",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 6,
      "areaHex": "0x06",
      "category": "western-overworld",
      "nodeIds": [
        "obj02-area06-sub00"
      ],
      "atlasIds": [
        "obj02-area06-sub00-dead-river-to-brahm"
      ],
      "maxSubmap": 0,
      "areaRecord": {
        "areaTablePointerAddress": "0xF7AF",
        "areaTableAddress": "0x9EE5",
        "areaRecordPointerAddress": "0x9EF1",
        "areaRecordAddress": "0xA165",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFF",
          "0x01",
          "0x03"
        ],
        "rightBytes": [
          "0x00",
          "0x00",
          "0x07"
        ]
      },
      "transitions": {
        "left": {
          "side": "left",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x01",
            "0x03"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 1,
            "third": 3
          },
          "target": {
            "objset": 1,
            "area": 3
          }
        },
        "right": {
          "side": "right",
          "kind": "same-objset-area",
          "bytes": [
            "0x00",
            "0x00",
            "0x07"
          ],
          "marker": "0x00",
          "raw": {
            "marker": 0,
            "second": 0,
            "third": 7
          },
          "target": {
            "objset": 2,
            "area": 7
          }
        }
      }
    },
    {
      "id": "obj02-area07",
      "label": "Dead River - Part 2 -> Belasco Marsh",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 7,
      "areaHex": "0x07",
      "category": "western-overworld",
      "nodeIds": [
        "obj02-area07-sub00",
        "obj02-area07-sub01",
        "obj02-area07-sub02"
      ],
      "atlasIds": [
        "obj02-area07-sub00-dead-river-part-2",
        "obj02-area07-sub01-dead-river-part-1",
        "obj02-area07-sub02-belasco-marsh"
      ],
      "maxSubmap": 2,
      "areaRecord": {
        "areaTablePointerAddress": "0xF7AF",
        "areaTableAddress": "0x9EE5",
        "areaRecordPointerAddress": "0x9EF3",
        "areaRecordAddress": "0xA170",
        "maxSubmap": 2,
        "leftBytes": [
          "0xFF",
          "0x00",
          "0x03"
        ],
        "rightBytes": [
          "0xFF",
          "0x00",
          "0x00"
        ]
      },
      "transitions": {
        "left": {
          "side": "left",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x00",
            "0x03"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 0,
            "third": 3
          },
          "target": {
            "objset": 0,
            "area": 3
          }
        },
        "right": {
          "side": "right",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x00",
            "0x00"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 0,
            "third": 0
          },
          "target": {
            "objset": 0,
            "area": 0
          }
        }
      }
    },
    {
      "id": "obj02-area08",
      "label": "North Bridge -> Dora Woods - Part 2",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 8,
      "areaHex": "0x08",
      "category": "western-overworld",
      "nodeIds": [
        "obj02-area08-sub00",
        "obj02-area08-sub01",
        "obj02-area08-sub02"
      ],
      "atlasIds": [
        "obj02-area08-sub00-north-bridge",
        "obj02-area08-sub01-dora-woods-part-1",
        "obj02-area08-sub02-dora-woods-part-2"
      ],
      "maxSubmap": 2,
      "areaRecord": {
        "areaTablePointerAddress": "0xF7AF",
        "areaTableAddress": "0x9EE5",
        "areaRecordPointerAddress": "0x9EF5",
        "areaRecordAddress": "0xA17F",
        "maxSubmap": 2,
        "leftBytes": [
          "0xFF",
          "0x00",
          "0x05"
        ],
        "rightBytes": [
          "0x00",
          "0x00",
          "0x09"
        ]
      },
      "transitions": {
        "left": {
          "side": "left",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x00",
            "0x05"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 0,
            "third": 5
          },
          "target": {
            "objset": 0,
            "area": 5
          }
        },
        "right": {
          "side": "right",
          "kind": "same-objset-area",
          "bytes": [
            "0x00",
            "0x00",
            "0x09"
          ],
          "marker": "0x00",
          "raw": {
            "marker": 0,
            "second": 0,
            "third": 9
          },
          "target": {
            "objset": 2,
            "area": 9
          }
        }
      }
    },
    {
      "id": "obj02-area09",
      "label": "Dora Woods - Part 3 -> Bordia Mountains (Dead End Swamp)",
      "objset": 2,
      "objsetHex": "0x02",
      "area": 9,
      "areaHex": "0x09",
      "category": "western-overworld",
      "nodeIds": [
        "obj02-area09-sub00",
        "obj02-area09-sub01",
        "obj02-area09-sub02"
      ],
      "atlasIds": [
        "obj02-area09-sub00-dora-woods-part-3",
        "obj02-area09-sub01-long-bridge-to-bordia-mountains-dead-end-swamp",
        "obj02-area09-sub02-bordia-mountains-dead-end-swamp"
      ],
      "maxSubmap": 2,
      "areaRecord": {
        "areaTablePointerAddress": "0xF7AF",
        "areaTableAddress": "0x9EE5",
        "areaRecordPointerAddress": "0x9EF7",
        "areaRecordAddress": "0xA18E",
        "maxSubmap": 2,
        "leftBytes": [
          "0x00",
          "0x00",
          "0x08"
        ],
        "rightBytes": [
          "0xFF",
          "0x00",
          "0x09"
        ]
      },
      "transitions": {
        "left": {
          "side": "left",
          "kind": "same-objset-area",
          "bytes": [
            "0x00",
            "0x00",
            "0x08"
          ],
          "marker": "0x00",
          "raw": {
            "marker": 0,
            "second": 0,
            "third": 8
          },
          "target": {
            "objset": 2,
            "area": 8
          }
        },
        "right": {
          "side": "right",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x00",
            "0x09"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 0,
            "third": 9
          },
          "target": {
            "objset": 0,
            "area": 9
          }
        }
      }
    },
    {
      "id": "obj03-area00",
      "label": "Camilla Cemetery -> Joma Marsh - Part 1",
      "objset": 3,
      "objsetHex": "0x03",
      "area": 0,
      "areaHex": "0x00",
      "category": "eastern-overworld",
      "nodeIds": [
        "obj03-area00-sub00",
        "obj03-area00-sub01"
      ],
      "atlasIds": [
        "obj03-area00-sub00-camilla-cemetery",
        "obj03-area00-sub01-joma-marsh-part-1"
      ],
      "maxSubmap": 1,
      "areaRecord": {
        "areaTablePointerAddress": "0xF7B1",
        "areaTableAddress": "0xB280",
        "areaRecordPointerAddress": "0xB280",
        "areaRecordAddress": "0xB372",
        "maxSubmap": 1,
        "leftBytes": [
          "0xFF",
          "0x00",
          "0x02"
        ],
        "rightBytes": [
          "0xFF",
          "0x01",
          "0x00"
        ]
      },
      "transitions": {
        "left": {
          "side": "left",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x00",
            "0x02"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 0,
            "third": 2
          },
          "target": {
            "objset": 0,
            "area": 2
          }
        },
        "right": {
          "side": "right",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x01",
            "0x00"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 1,
            "third": 0
          },
          "target": {
            "objset": 1,
            "area": 0
          }
        }
      }
    },
    {
      "id": "obj03-area01",
      "label": "Storigoi Graveyard (Blob Boost)",
      "objset": 3,
      "objsetHex": "0x03",
      "area": 1,
      "areaHex": "0x01",
      "category": "eastern-overworld",
      "nodeIds": [
        "obj03-area01-sub00"
      ],
      "atlasIds": [
        "obj03-area01-sub00-storigoi-graveyard-blob-boost"
      ],
      "maxSubmap": 0,
      "areaRecord": {
        "areaTablePointerAddress": "0xF7B1",
        "areaTableAddress": "0xB280",
        "areaRecordPointerAddress": "0xB282",
        "areaRecordAddress": "0xB37F",
        "maxSubmap": 0,
        "leftBytes": [
          "0x00",
          "0x00",
          "0x00"
        ],
        "rightBytes": [
          "0x00",
          "0x00",
          "0x02"
        ]
      },
      "transitions": {
        "left": {
          "side": "left",
          "kind": "same-objset-area",
          "bytes": [
            "0x00",
            "0x00",
            "0x00"
          ],
          "marker": "0x00",
          "raw": {
            "marker": 0,
            "second": 0,
            "third": 0
          },
          "target": {
            "objset": 3,
            "area": 0
          }
        },
        "right": {
          "side": "right",
          "kind": "same-objset-area",
          "bytes": [
            "0x00",
            "0x00",
            "0x02"
          ],
          "marker": "0x00",
          "raw": {
            "marker": 0,
            "second": 0,
            "third": 2
          },
          "target": {
            "objset": 3,
            "area": 2
          }
        }
      }
    },
    {
      "id": "obj03-area02",
      "label": "Sadam Woods - Part 2 -> Sadam Woods - Part 1",
      "objset": 3,
      "objsetHex": "0x03",
      "area": 2,
      "areaHex": "0x02",
      "category": "eastern-overworld",
      "nodeIds": [
        "obj03-area02-sub00",
        "obj03-area02-sub01"
      ],
      "atlasIds": [
        "obj03-area02-sub00-sadam-woods-part-2",
        "obj03-area02-sub01-sadam-woods-part-1"
      ],
      "maxSubmap": 1,
      "areaRecord": {
        "areaTablePointerAddress": "0xF7B1",
        "areaTableAddress": "0xB280",
        "areaRecordPointerAddress": "0xB284",
        "areaRecordAddress": "0xB38A",
        "maxSubmap": 1,
        "leftBytes": [
          "0x00",
          "0x00",
          "0x04"
        ],
        "rightBytes": [
          "0xFF",
          "0x00",
          "0x03"
        ]
      },
      "transitions": {
        "left": {
          "side": "left",
          "kind": "same-objset-area",
          "bytes": [
            "0x00",
            "0x00",
            "0x04"
          ],
          "marker": "0x00",
          "raw": {
            "marker": 0,
            "second": 0,
            "third": 4
          },
          "target": {
            "objset": 3,
            "area": 4
          }
        },
        "right": {
          "side": "right",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x00",
            "0x03"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 0,
            "third": 3
          },
          "target": {
            "objset": 0,
            "area": 3
          }
        }
      }
    },
    {
      "id": "obj03-area03",
      "label": "Joma Marsh - Part 2 -> Debious Woods - Part 1",
      "objset": 3,
      "objsetHex": "0x03",
      "area": 3,
      "areaHex": "0x03",
      "category": "eastern-overworld",
      "nodeIds": [
        "obj03-area03-sub00",
        "obj03-area03-sub01",
        "obj03-area03-sub02",
        "obj03-area03-sub03",
        "obj03-area03-sub04"
      ],
      "atlasIds": [
        "obj03-area03-sub00-joma-marsh-part-2",
        "obj03-area03-sub01-joma-marsh-part-3-fire-and-skulls",
        "obj03-area03-sub02-debious-woods-part-3",
        "obj03-area03-sub03-debious-woods-part-2",
        "obj03-area03-sub04-debious-woods-part-1"
      ],
      "maxSubmap": 4,
      "areaRecord": {
        "areaTablePointerAddress": "0xF7B1",
        "areaTableAddress": "0xB280",
        "areaRecordPointerAddress": "0xB286",
        "areaRecordAddress": "0xB7C7",
        "maxSubmap": 4,
        "leftBytes": [
          "0xFF",
          "0x01",
          "0x00"
        ],
        "rightBytes": [
          "0xFF",
          "0x01",
          "0x04"
        ]
      },
      "transitions": {
        "left": {
          "side": "left",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x01",
            "0x00"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 1,
            "third": 0
          },
          "target": {
            "objset": 1,
            "area": 0
          }
        },
        "right": {
          "side": "right",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x01",
            "0x04"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 1,
            "third": 4
          },
          "target": {
            "objset": 1,
            "area": 4
          }
        }
      }
    },
    {
      "id": "obj03-area04",
      "label": "Sadam Woods - Part 3",
      "objset": 3,
      "objsetHex": "0x03",
      "area": 4,
      "areaHex": "0x04",
      "category": "eastern-overworld",
      "nodeIds": [
        "obj03-area04-sub00"
      ],
      "atlasIds": [
        "obj03-area04-sub00-sadam-woods-part-3"
      ],
      "maxSubmap": 0,
      "areaRecord": {
        "areaTablePointerAddress": "0xF7B1",
        "areaTableAddress": "0xB280",
        "areaRecordPointerAddress": "0xB288",
        "areaRecordAddress": "0xB397",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFF",
          "0x00",
          "0x04"
        ],
        "rightBytes": [
          "0x00",
          "0x00",
          "0x02"
        ]
      },
      "transitions": {
        "left": {
          "side": "left",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x00",
            "0x04"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 0,
            "third": 4
          },
          "target": {
            "objset": 0,
            "area": 4
          }
        },
        "right": {
          "side": "right",
          "kind": "same-objset-area",
          "bytes": [
            "0x00",
            "0x00",
            "0x02"
          ],
          "marker": "0x00",
          "raw": {
            "marker": 0,
            "second": 0,
            "third": 2
          },
          "target": {
            "objset": 3,
            "area": 2
          }
        }
      }
    },
    {
      "id": "obj04-area00",
      "label": "Vrad Mountain - Part 2 (Diamond Dude) -> Vrad Mountain - Part 1",
      "objset": 4,
      "objsetHex": "0x04",
      "area": 0,
      "areaHex": "0x00",
      "category": "mountains-and-castle-approach",
      "nodeIds": [
        "obj04-area00-sub00",
        "obj04-area00-sub01"
      ],
      "atlasIds": [
        "obj04-area00-sub00-vrad-mountain-part-2-diamond-dude",
        "obj04-area00-sub01-vrad-mountain-part-1"
      ],
      "maxSubmap": 1,
      "areaRecord": {
        "areaTablePointerAddress": "0xF7B3",
        "areaTableAddress": "0xAE64",
        "areaRecordPointerAddress": "0xAE64",
        "areaRecordAddress": "0xAE6C",
        "maxSubmap": 1,
        "leftBytes": [
          "0x00",
          "0x00",
          "0x00"
        ],
        "rightBytes": [
          "0xFF",
          "0x01",
          "0x03"
        ]
      },
      "transitions": {
        "left": {
          "side": "left",
          "kind": "same-objset-area",
          "bytes": [
            "0x00",
            "0x00",
            "0x00"
          ],
          "marker": "0x00",
          "raw": {
            "marker": 0,
            "second": 0,
            "third": 0
          },
          "target": {
            "objset": 4,
            "area": 0
          }
        },
        "right": {
          "side": "right",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x01",
            "0x03"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 1,
            "third": 3
          },
          "target": {
            "objset": 1,
            "area": 3
          }
        }
      }
    },
    {
      "id": "obj04-area01",
      "label": "Deborah Cliff (In Tornado) -> Jam Wasteland (Deborah Cliff)",
      "objset": 4,
      "objsetHex": "0x04",
      "area": 1,
      "areaHex": "0x01",
      "category": "mountains-and-castle-approach",
      "nodeIds": [
        "obj04-area01-sub00",
        "obj04-area01-sub01"
      ],
      "atlasIds": [
        "obj04-area01-sub00-deborah-cliff-in-tornado",
        "obj04-area01-sub01-jam-wasteland-deborah-cliff"
      ],
      "maxSubmap": 1,
      "areaRecord": {
        "areaTablePointerAddress": "0xF7B3",
        "areaTableAddress": "0xAE64",
        "areaRecordPointerAddress": "0xAE66",
        "areaRecordAddress": "0xAE79",
        "maxSubmap": 1,
        "leftBytes": [
          "0xFF",
          "0x01",
          "0x04"
        ],
        "rightBytes": [
          "0xFF",
          "0x00",
          "0x04"
        ]
      },
      "transitions": {
        "left": {
          "side": "left",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x01",
            "0x04"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 1,
            "third": 4
          },
          "target": {
            "objset": 1,
            "area": 4
          }
        },
        "right": {
          "side": "right",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x00",
            "0x04"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 0,
            "third": 4
          },
          "target": {
            "objset": 0,
            "area": 4
          }
        }
      }
    },
    {
      "id": "obj04-area02",
      "label": "Wicked Ditch",
      "objset": 4,
      "objsetHex": "0x04",
      "area": 2,
      "areaHex": "0x02",
      "category": "mountains-and-castle-approach",
      "nodeIds": [
        "obj04-area02-sub00"
      ],
      "atlasIds": [
        "obj04-area02-sub00-wicked-ditch"
      ],
      "maxSubmap": 0,
      "areaRecord": {
        "areaTablePointerAddress": "0xF7B3",
        "areaTableAddress": "0xAE64",
        "areaRecordPointerAddress": "0xAE68",
        "areaRecordAddress": "0xAE86",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFF",
          "0x01",
          "0x04"
        ],
        "rightBytes": [
          "0xFF",
          "0x00",
          "0x05"
        ]
      },
      "transitions": {
        "left": {
          "side": "left",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x01",
            "0x04"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 1,
            "third": 4
          },
          "target": {
            "objset": 1,
            "area": 4
          }
        },
        "right": {
          "side": "right",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x00",
            "0x05"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 0,
            "third": 5
          },
          "target": {
            "objset": 0,
            "area": 5
          }
        }
      }
    },
    {
      "id": "obj04-area03",
      "label": "Vrad Graveyard -> Castlevania Bridge",
      "objset": 4,
      "objsetHex": "0x04",
      "area": 3,
      "areaHex": "0x03",
      "category": "mountains-and-castle-approach",
      "nodeIds": [
        "obj04-area03-sub00",
        "obj04-area03-sub01"
      ],
      "atlasIds": [
        "obj04-area03-sub00-vrad-graveyard",
        "obj04-area03-sub01-castlevania-bridge"
      ],
      "maxSubmap": 1,
      "areaRecord": {
        "areaTablePointerAddress": "0xF7B3",
        "areaTableAddress": "0xAE64",
        "areaRecordPointerAddress": "0xAE6A",
        "areaRecordAddress": "0xAE91",
        "maxSubmap": 1,
        "leftBytes": [
          "0xFF",
          "0x00",
          "0x06"
        ],
        "rightBytes": [
          "0xFF",
          "0x05",
          "0x00"
        ]
      },
      "transitions": {
        "left": {
          "side": "left",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x00",
            "0x06"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 0,
            "third": 6
          },
          "target": {
            "objset": 0,
            "area": 6
          }
        },
        "right": {
          "side": "right",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x05",
            "0x00"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 5,
            "third": 0
          },
          "target": {
            "objset": 5,
            "area": 0
          }
        }
      }
    },
    {
      "id": "obj05-area00",
      "label": "Castlevania",
      "objset": 5,
      "objsetHex": "0x05",
      "area": 0,
      "areaHex": "0x00",
      "category": "castlevania-exterior",
      "nodeIds": [
        "obj05-area00-sub00"
      ],
      "atlasIds": [
        "obj05-area00-sub00-castlevania"
      ],
      "maxSubmap": 1,
      "areaRecord": {
        "areaTablePointerAddress": "0xF7B5",
        "areaTableAddress": "0xBC56",
        "areaRecordPointerAddress": "0xBC56",
        "areaRecordAddress": "0xBC58",
        "maxSubmap": 1,
        "leftBytes": [
          "0xFF",
          "0x04",
          "0x03"
        ],
        "rightBytes": [
          "0x00",
          "0x00",
          "0x00"
        ]
      },
      "transitions": {
        "left": {
          "side": "left",
          "kind": "objset-area",
          "bytes": [
            "0xFF",
            "0x04",
            "0x03"
          ],
          "marker": "0xFF",
          "raw": {
            "marker": 255,
            "second": 4,
            "third": 3
          },
          "target": {
            "objset": 4,
            "area": 3
          }
        },
        "right": {
          "side": "right",
          "kind": "same-objset-area",
          "bytes": [
            "0x00",
            "0x00",
            "0x00"
          ],
          "marker": "0x00",
          "raw": {
            "marker": 0,
            "second": 0,
            "third": 0
          },
          "target": {
            "objset": 5,
            "area": 0
          }
        }
      }
    }
  ],
  "edges": [
    {
      "id": "submap-sequence:obj02-area00-sub00->obj02-area00-sub01:0",
      "type": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "direction": "right",
      "source": "obj02-area00-sub00",
      "sourceArea": "obj02-area00",
      "target": "obj02-area00-sub01",
      "targetArea": "obj02-area00",
      "note": "Adjacent submaps in the same area record."
    },
    {
      "id": "submap-sequence:obj02-area00-sub01->obj02-area00-sub02:1",
      "type": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "direction": "right",
      "source": "obj02-area00-sub01",
      "sourceArea": "obj02-area00",
      "target": "obj02-area00-sub02",
      "targetArea": "obj02-area00",
      "note": "Adjacent submaps in the same area record."
    },
    {
      "id": "submap-sequence:obj02-area00-sub02->obj02-area00-sub03:2",
      "type": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "direction": "right",
      "source": "obj02-area00-sub02",
      "sourceArea": "obj02-area00",
      "target": "obj02-area00-sub03",
      "targetArea": "obj02-area00",
      "note": "Adjacent submaps in the same area record."
    },
    {
      "id": "submap-sequence:obj02-area03-sub00->obj02-area03-sub01:0",
      "type": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "direction": "right",
      "source": "obj02-area03-sub00",
      "sourceArea": "obj02-area03",
      "target": "obj02-area03-sub01",
      "targetArea": "obj02-area03",
      "note": "Adjacent submaps in the same area record."
    },
    {
      "id": "submap-sequence:obj02-area03-sub01->obj02-area03-sub02:1",
      "type": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "direction": "right",
      "source": "obj02-area03-sub01",
      "sourceArea": "obj02-area03",
      "target": "obj02-area03-sub02",
      "targetArea": "obj02-area03",
      "note": "Adjacent submaps in the same area record."
    },
    {
      "id": "submap-sequence:obj02-area03-sub02->obj02-area03-sub03:2",
      "type": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "direction": "right",
      "source": "obj02-area03-sub02",
      "sourceArea": "obj02-area03",
      "target": "obj02-area03-sub03",
      "targetArea": "obj02-area03",
      "note": "Adjacent submaps in the same area record."
    },
    {
      "id": "submap-sequence:obj02-area04-sub00->obj02-area04-sub01:0",
      "type": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "direction": "right",
      "source": "obj02-area04-sub00",
      "sourceArea": "obj02-area04",
      "target": "obj02-area04-sub01",
      "targetArea": "obj02-area04",
      "note": "Adjacent submaps in the same area record."
    },
    {
      "id": "submap-sequence:obj02-area05-sub00->obj02-area05-sub01:0",
      "type": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "direction": "right",
      "source": "obj02-area05-sub00",
      "sourceArea": "obj02-area05",
      "target": "obj02-area05-sub01",
      "targetArea": "obj02-area05",
      "note": "Adjacent submaps in the same area record."
    },
    {
      "id": "submap-sequence:obj02-area07-sub00->obj02-area07-sub01:0",
      "type": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "direction": "right",
      "source": "obj02-area07-sub00",
      "sourceArea": "obj02-area07",
      "target": "obj02-area07-sub01",
      "targetArea": "obj02-area07",
      "note": "Adjacent submaps in the same area record."
    },
    {
      "id": "submap-sequence:obj02-area07-sub01->obj02-area07-sub02:1",
      "type": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "direction": "right",
      "source": "obj02-area07-sub01",
      "sourceArea": "obj02-area07",
      "target": "obj02-area07-sub02",
      "targetArea": "obj02-area07",
      "note": "Adjacent submaps in the same area record."
    },
    {
      "id": "submap-sequence:obj02-area08-sub00->obj02-area08-sub01:0",
      "type": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "direction": "right",
      "source": "obj02-area08-sub00",
      "sourceArea": "obj02-area08",
      "target": "obj02-area08-sub01",
      "targetArea": "obj02-area08",
      "note": "Adjacent submaps in the same area record."
    },
    {
      "id": "submap-sequence:obj02-area08-sub01->obj02-area08-sub02:1",
      "type": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "direction": "right",
      "source": "obj02-area08-sub01",
      "sourceArea": "obj02-area08",
      "target": "obj02-area08-sub02",
      "targetArea": "obj02-area08",
      "note": "Adjacent submaps in the same area record."
    },
    {
      "id": "submap-sequence:obj02-area09-sub00->obj02-area09-sub01:0",
      "type": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "direction": "right",
      "source": "obj02-area09-sub00",
      "sourceArea": "obj02-area09",
      "target": "obj02-area09-sub01",
      "targetArea": "obj02-area09",
      "note": "Adjacent submaps in the same area record."
    },
    {
      "id": "submap-sequence:obj02-area09-sub01->obj02-area09-sub02:1",
      "type": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "direction": "right",
      "source": "obj02-area09-sub01",
      "sourceArea": "obj02-area09",
      "target": "obj02-area09-sub02",
      "targetArea": "obj02-area09",
      "note": "Adjacent submaps in the same area record."
    },
    {
      "id": "submap-sequence:obj03-area00-sub00->obj03-area00-sub01:0",
      "type": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "direction": "right",
      "source": "obj03-area00-sub00",
      "sourceArea": "obj03-area00",
      "target": "obj03-area00-sub01",
      "targetArea": "obj03-area00",
      "note": "Adjacent submaps in the same area record."
    },
    {
      "id": "submap-sequence:obj03-area02-sub00->obj03-area02-sub01:0",
      "type": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "direction": "right",
      "source": "obj03-area02-sub00",
      "sourceArea": "obj03-area02",
      "target": "obj03-area02-sub01",
      "targetArea": "obj03-area02",
      "note": "Adjacent submaps in the same area record."
    },
    {
      "id": "submap-sequence:obj03-area03-sub00->obj03-area03-sub01:0",
      "type": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "direction": "right",
      "source": "obj03-area03-sub00",
      "sourceArea": "obj03-area03",
      "target": "obj03-area03-sub01",
      "targetArea": "obj03-area03",
      "note": "Adjacent submaps in the same area record."
    },
    {
      "id": "submap-sequence:obj03-area03-sub01->obj03-area03-sub02:1",
      "type": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "direction": "right",
      "source": "obj03-area03-sub01",
      "sourceArea": "obj03-area03",
      "target": "obj03-area03-sub02",
      "targetArea": "obj03-area03",
      "note": "Adjacent submaps in the same area record."
    },
    {
      "id": "submap-sequence:obj03-area03-sub02->obj03-area03-sub03:2",
      "type": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "direction": "right",
      "source": "obj03-area03-sub02",
      "sourceArea": "obj03-area03",
      "target": "obj03-area03-sub03",
      "targetArea": "obj03-area03",
      "note": "Adjacent submaps in the same area record."
    },
    {
      "id": "submap-sequence:obj03-area03-sub03->obj03-area03-sub04:3",
      "type": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "direction": "right",
      "source": "obj03-area03-sub03",
      "sourceArea": "obj03-area03",
      "target": "obj03-area03-sub04",
      "targetArea": "obj03-area03",
      "note": "Adjacent submaps in the same area record."
    },
    {
      "id": "submap-sequence:obj04-area00-sub00->obj04-area00-sub01:0",
      "type": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "direction": "right",
      "source": "obj04-area00-sub00",
      "sourceArea": "obj04-area00",
      "target": "obj04-area00-sub01",
      "targetArea": "obj04-area00",
      "note": "Adjacent submaps in the same area record."
    },
    {
      "id": "submap-sequence:obj04-area01-sub00->obj04-area01-sub01:0",
      "type": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "direction": "right",
      "source": "obj04-area01-sub00",
      "sourceArea": "obj04-area01",
      "target": "obj04-area01-sub01",
      "targetArea": "obj04-area01",
      "note": "Adjacent submaps in the same area record."
    },
    {
      "id": "submap-sequence:obj04-area03-sub00->obj04-area03-sub01:0",
      "type": "submap-sequence",
      "confidence": "cv2r-submap-order",
      "direction": "right",
      "source": "obj04-area03-sub00",
      "sourceArea": "obj04-area03",
      "target": "obj04-area03-sub01",
      "targetArea": "obj04-area03",
      "note": "Adjacent submaps in the same area record."
    },
    {
      "id": "boundary-transition:obj00-area00-sub00->obj02-area07-sub02:left",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "left",
      "source": "obj00-area00-sub00",
      "sourceArea": "obj00-area00",
      "target": "obj02-area07-sub02",
      "targetArea": "obj02-area07",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AB",
        "areaTableAddress": "0x8042",
        "areaRecordPointerAddress": "0x8042",
        "areaRecordAddress": "0xF9FF",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFF",
          "0x02",
          "0x07"
        ],
        "rightBytes": [
          "0xFF",
          "0x02",
          "0x00"
        ]
      },
      "note": "Jova exits left to Belasco Marsh."
    },
    {
      "id": "boundary-transition:obj00-area00-sub00->obj02-area00-sub00:right",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "right",
      "source": "obj00-area00-sub00",
      "sourceArea": "obj00-area00",
      "target": "obj02-area00-sub00",
      "targetArea": "obj02-area00",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AB",
        "areaTableAddress": "0x8042",
        "areaRecordPointerAddress": "0x8042",
        "areaRecordAddress": "0xF9FF",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFF",
          "0x02",
          "0x07"
        ],
        "rightBytes": [
          "0xFF",
          "0x02",
          "0x00"
        ]
      },
      "note": "Jova exits right to Jova Woods."
    },
    {
      "id": "boundary-transition:obj00-area01-sub00->obj02-area00-sub03:left",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "left",
      "source": "obj00-area01-sub00",
      "sourceArea": "obj00-area01",
      "target": "obj02-area00-sub03",
      "targetArea": "obj02-area00",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AB",
        "areaTableAddress": "0x8042",
        "areaRecordPointerAddress": "0x8044",
        "areaRecordAddress": "0x8657",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFC",
          "0x02",
          "0x00"
        ],
        "rightBytes": [
          "0xFC",
          "0x02",
          "0x03"
        ]
      },
      "note": "Veros exits left to Veros Woods - Part 2."
    },
    {
      "id": "boundary-transition:obj00-area01-sub00->obj02-area03-sub00:right",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "right",
      "source": "obj00-area01-sub00",
      "sourceArea": "obj00-area01",
      "target": "obj02-area03-sub00",
      "targetArea": "obj02-area03",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AB",
        "areaTableAddress": "0x8042",
        "areaRecordPointerAddress": "0x8044",
        "areaRecordAddress": "0x8657",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFC",
          "0x02",
          "0x00"
        ],
        "rightBytes": [
          "0xFC",
          "0x02",
          "0x03"
        ]
      },
      "note": "Veros exits right to Dabi's Path - Part 1."
    },
    {
      "id": "boundary-transition:obj00-area02-sub00->obj02-area02-sub00:left",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "left",
      "source": "obj00-area02-sub00",
      "sourceArea": "obj00-area02",
      "target": "obj02-area02-sub00",
      "targetArea": "obj02-area02",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AB",
        "areaTableAddress": "0x8042",
        "areaRecordPointerAddress": "0x8046",
        "areaRecordAddress": "0xFAC2",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFF",
          "0x02",
          "0x02"
        ],
        "rightBytes": [
          "0xFF",
          "0x03",
          "0x00"
        ]
      },
      "note": "Aljiba exits left to Aljiba Woods - Part 3."
    },
    {
      "id": "boundary-transition:obj00-area02-sub00->obj03-area00-sub00:right",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "right",
      "source": "obj00-area02-sub00",
      "sourceArea": "obj00-area02",
      "target": "obj03-area00-sub00",
      "targetArea": "obj03-area00",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AB",
        "areaTableAddress": "0x8042",
        "areaRecordPointerAddress": "0x8046",
        "areaRecordAddress": "0xFAC2",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFF",
          "0x02",
          "0x02"
        ],
        "rightBytes": [
          "0xFF",
          "0x03",
          "0x00"
        ]
      },
      "note": "Aljiba exits right to Camilla Cemetery."
    },
    {
      "id": "boundary-transition:obj00-area03-sub00->obj03-area02-sub01:left",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "left",
      "source": "obj00-area03-sub00",
      "sourceArea": "obj00-area03",
      "target": "obj03-area02-sub01",
      "targetArea": "obj03-area02",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AB",
        "areaTableAddress": "0x8042",
        "areaRecordPointerAddress": "0x8048",
        "areaRecordAddress": "0xFA0A",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFF",
          "0x03",
          "0x02"
        ],
        "rightBytes": [
          "0xFF",
          "0x02",
          "0x07"
        ]
      },
      "note": "Alba exits left to Sadam Woods - Part 1."
    },
    {
      "id": "boundary-transition:obj00-area03-sub00->obj02-area07-sub00:right",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "right",
      "source": "obj00-area03-sub00",
      "sourceArea": "obj00-area03",
      "target": "obj02-area07-sub00",
      "targetArea": "obj02-area07",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AB",
        "areaTableAddress": "0x8042",
        "areaRecordPointerAddress": "0x8048",
        "areaRecordAddress": "0xFA0A",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFF",
          "0x03",
          "0x02"
        ],
        "rightBytes": [
          "0xFF",
          "0x02",
          "0x07"
        ]
      },
      "note": "Alba exits right to Dead River - Part 2."
    },
    {
      "id": "boundary-transition:obj00-area04-sub00->obj04-area01-sub01:left",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "left",
      "source": "obj00-area04-sub00",
      "sourceArea": "obj00-area04",
      "target": "obj04-area01-sub01",
      "targetArea": "obj04-area01",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AB",
        "areaTableAddress": "0x8042",
        "areaRecordPointerAddress": "0x804A",
        "areaRecordAddress": "0x8662",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFF",
          "0x04",
          "0x01"
        ],
        "rightBytes": [
          "0xFF",
          "0x03",
          "0x04"
        ]
      },
      "note": "Ondol exits left to Jam Wasteland (Deborah Cliff)."
    },
    {
      "id": "boundary-transition:obj00-area04-sub00->obj03-area04-sub00:right",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "right",
      "source": "obj00-area04-sub00",
      "sourceArea": "obj00-area04",
      "target": "obj03-area04-sub00",
      "targetArea": "obj03-area04",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AB",
        "areaTableAddress": "0x8042",
        "areaRecordPointerAddress": "0x804A",
        "areaRecordAddress": "0x8662",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFF",
          "0x04",
          "0x01"
        ],
        "rightBytes": [
          "0xFF",
          "0x03",
          "0x04"
        ]
      },
      "note": "Ondol exits right to Sadam Woods - Part 3."
    },
    {
      "id": "boundary-transition:obj00-area05-sub00->obj04-area02-sub00:left",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "left",
      "source": "obj00-area05-sub00",
      "sourceArea": "obj00-area05",
      "target": "obj04-area02-sub00",
      "targetArea": "obj04-area02",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AB",
        "areaTableAddress": "0x8042",
        "areaRecordPointerAddress": "0x804C",
        "areaRecordAddress": "0xFACD",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFF",
          "0x04",
          "0x02"
        ],
        "rightBytes": [
          "0xFF",
          "0x02",
          "0x08"
        ]
      },
      "note": "Doina exits left to Wicked Ditch."
    },
    {
      "id": "boundary-transition:obj00-area05-sub00->obj02-area08-sub00:right",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "right",
      "source": "obj00-area05-sub00",
      "sourceArea": "obj00-area05",
      "target": "obj02-area08-sub00",
      "targetArea": "obj02-area08",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AB",
        "areaTableAddress": "0x8042",
        "areaRecordPointerAddress": "0x804C",
        "areaRecordAddress": "0xFACD",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFF",
          "0x04",
          "0x02"
        ],
        "rightBytes": [
          "0xFF",
          "0x02",
          "0x08"
        ]
      },
      "note": "Doina exits right to North Bridge."
    },
    {
      "id": "boundary-transition:obj00-area06-sub00->obj02-area08-sub02:left",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "left",
      "source": "obj00-area06-sub00",
      "sourceArea": "obj00-area06",
      "target": "obj02-area08-sub02",
      "targetArea": "obj02-area08",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AB",
        "areaTableAddress": "0x8042",
        "areaRecordPointerAddress": "0x804E",
        "areaRecordAddress": "0xFAD8",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFC",
          "0x02",
          "0x08"
        ],
        "rightBytes": [
          "0xFF",
          "0x04",
          "0x03"
        ]
      },
      "note": "Yomi exits left to Dora Woods - Part 2."
    },
    {
      "id": "boundary-transition:obj00-area06-sub00->obj04-area03-sub00:right",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "right",
      "source": "obj00-area06-sub00",
      "sourceArea": "obj00-area06",
      "target": "obj04-area03-sub00",
      "targetArea": "obj04-area03",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AB",
        "areaTableAddress": "0x8042",
        "areaRecordPointerAddress": "0x804E",
        "areaRecordAddress": "0xFAD8",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFC",
          "0x02",
          "0x08"
        ],
        "rightBytes": [
          "0xFF",
          "0x04",
          "0x03"
        ]
      },
      "note": "Yomi exits right to Vrad Graveyard."
    },
    {
      "id": "boundary-transition:obj01-area00-sub00->obj03-area00-sub01:left",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "left",
      "source": "obj01-area00-sub00",
      "sourceArea": "obj01-area00",
      "target": "obj03-area00-sub01",
      "targetArea": "obj03-area00",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AD",
        "areaTableAddress": "0x873C",
        "areaRecordPointerAddress": "0x873C",
        "areaRecordAddress": "0x88C7",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFF",
          "0x03",
          "0x00"
        ],
        "rightBytes": [
          "0xFF",
          "0x03",
          "0x03"
        ]
      },
      "note": "Laruba Mansion - Door exits left to Joma Marsh - Part 1."
    },
    {
      "id": "boundary-transition:obj01-area00-sub00->obj03-area03-sub00:right",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "right",
      "source": "obj01-area00-sub00",
      "sourceArea": "obj01-area00",
      "target": "obj03-area03-sub00",
      "targetArea": "obj03-area03",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AD",
        "areaTableAddress": "0x873C",
        "areaRecordPointerAddress": "0x873C",
        "areaRecordAddress": "0x88C7",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFF",
          "0x03",
          "0x00"
        ],
        "rightBytes": [
          "0xFF",
          "0x03",
          "0x03"
        ]
      },
      "note": "Laruba Mansion - Door exits right to Joma Marsh - Part 2."
    },
    {
      "id": "boundary-transition:obj01-area01-sub00->obj02-area01-sub00:left",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "left",
      "source": "obj01-area01-sub00",
      "sourceArea": "obj01-area01",
      "target": "obj02-area01-sub00",
      "targetArea": "obj02-area01",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AD",
        "areaTableAddress": "0x873C",
        "areaRecordPointerAddress": "0x873E",
        "areaRecordAddress": "0x8D3A",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFF",
          "0x02",
          "0x01"
        ],
        "rightBytes": [
          "0xFF",
          "0x02",
          "0x04"
        ]
      },
      "note": "Berkeley Mansion - Door exits left to Denis Woods - Part 1."
    },
    {
      "id": "boundary-transition:obj01-area01-sub00->obj02-area04-sub00:right",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "right",
      "source": "obj01-area01-sub00",
      "sourceArea": "obj01-area01",
      "target": "obj02-area04-sub00",
      "targetArea": "obj02-area04",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AD",
        "areaTableAddress": "0x873C",
        "areaRecordPointerAddress": "0x873E",
        "areaRecordAddress": "0x8D3A",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFF",
          "0x02",
          "0x01"
        ],
        "rightBytes": [
          "0xFF",
          "0x02",
          "0x04"
        ]
      },
      "note": "Berkeley Mansion - Door exits right to Denis Woods - Part 2."
    },
    {
      "id": "boundary-transition:obj01-area02-sub00->obj02-area05-sub01:left",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "left",
      "source": "obj01-area02-sub00",
      "sourceArea": "obj01-area02",
      "target": "obj02-area05-sub01",
      "targetArea": "obj02-area05",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AD",
        "areaTableAddress": "0x873C",
        "areaRecordPointerAddress": "0x8740",
        "areaRecordAddress": "0x924A",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFC",
          "0x02",
          "0x05"
        ],
        "rightBytes": [
          "0xFF",
          "0x00",
          "0x01"
        ]
      },
      "note": "Rover Mansion - Door exits left to Yuba Lake."
    },
    {
      "id": "boundary-transition:obj01-area02-sub00->obj00-area01-sub00:right",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "right",
      "source": "obj01-area02-sub00",
      "sourceArea": "obj01-area02",
      "target": "obj00-area01-sub00",
      "targetArea": "obj00-area01",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AD",
        "areaTableAddress": "0x873C",
        "areaRecordPointerAddress": "0x8740",
        "areaRecordAddress": "0x924A",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFC",
          "0x02",
          "0x05"
        ],
        "rightBytes": [
          "0xFF",
          "0x00",
          "0x01"
        ]
      },
      "note": "Rover Mansion - Door exits right to Veros."
    },
    {
      "id": "boundary-transition:obj01-area03-sub00->obj04-area00-sub01:left",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "left",
      "source": "obj01-area03-sub00",
      "sourceArea": "obj01-area03",
      "target": "obj04-area00-sub01",
      "targetArea": "obj04-area00",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AD",
        "areaTableAddress": "0x873C",
        "areaRecordPointerAddress": "0x8742",
        "areaRecordAddress": "0x967B",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFF",
          "0x04",
          "0x00"
        ],
        "rightBytes": [
          "0xFF",
          "0x02",
          "0x06"
        ]
      },
      "note": "Brahm Mansion - Door exits left to Vrad Mountain - Part 1."
    },
    {
      "id": "boundary-transition:obj01-area03-sub00->obj02-area06-sub00:right",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "right",
      "source": "obj01-area03-sub00",
      "sourceArea": "obj01-area03",
      "target": "obj02-area06-sub00",
      "targetArea": "obj02-area06",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AD",
        "areaTableAddress": "0x873C",
        "areaRecordPointerAddress": "0x8742",
        "areaRecordAddress": "0x967B",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFF",
          "0x04",
          "0x00"
        ],
        "rightBytes": [
          "0xFF",
          "0x02",
          "0x06"
        ]
      },
      "note": "Brahm Mansion - Door exits right to Dead River to Brahm."
    },
    {
      "id": "boundary-transition:obj01-area04-sub00->obj03-area03-sub04:left",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "left",
      "source": "obj01-area04-sub00",
      "sourceArea": "obj01-area04",
      "target": "obj03-area03-sub04",
      "targetArea": "obj03-area03",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AD",
        "areaTableAddress": "0x873C",
        "areaRecordPointerAddress": "0x8744",
        "areaRecordAddress": "0x9A51",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFF",
          "0x03",
          "0x03"
        ],
        "rightBytes": [
          "0xFF",
          "0x04",
          "0x02"
        ]
      },
      "note": "Bodley Mansion - Door exits left to Debious Woods - Part 1."
    },
    {
      "id": "boundary-transition:obj01-area04-sub00->obj04-area02-sub00:right",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "right",
      "source": "obj01-area04-sub00",
      "sourceArea": "obj01-area04",
      "target": "obj04-area02-sub00",
      "targetArea": "obj04-area02",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AD",
        "areaTableAddress": "0x873C",
        "areaRecordPointerAddress": "0x8744",
        "areaRecordAddress": "0x9A51",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFF",
          "0x03",
          "0x03"
        ],
        "rightBytes": [
          "0xFF",
          "0x04",
          "0x02"
        ]
      },
      "note": "Bodley Mansion - Door exits right to Wicked Ditch."
    },
    {
      "id": "boundary-transition:obj02-area00-sub00->obj00-area00-sub00:left",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "left",
      "source": "obj02-area00-sub00",
      "sourceArea": "obj02-area00",
      "target": "obj00-area00-sub00",
      "targetArea": "obj00-area00",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AF",
        "areaTableAddress": "0x9EE5",
        "areaRecordPointerAddress": "0x9EE5",
        "areaRecordAddress": "0xA149",
        "maxSubmap": 3,
        "leftBytes": [
          "0xFF",
          "0x00",
          "0x00"
        ],
        "rightBytes": [
          "0x00",
          "0x00",
          "0x01"
        ]
      },
      "note": "Jova Woods exits left to Jova."
    },
    {
      "id": "boundary-transition:obj02-area00-sub03->obj02-area01-sub00:right",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "right",
      "source": "obj02-area00-sub03",
      "sourceArea": "obj02-area00",
      "target": "obj02-area01-sub00",
      "targetArea": "obj02-area01",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AF",
        "areaTableAddress": "0x9EE5",
        "areaRecordPointerAddress": "0x9EE5",
        "areaRecordAddress": "0xA149",
        "maxSubmap": 3,
        "leftBytes": [
          "0xFF",
          "0x00",
          "0x00"
        ],
        "rightBytes": [
          "0x00",
          "0x00",
          "0x01"
        ]
      },
      "note": "Veros Woods - Part 2 exits right to Denis Woods - Part 1."
    },
    {
      "id": "boundary-transition:obj02-area01-sub00->obj02-area00-sub03:left",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "left",
      "source": "obj02-area01-sub00",
      "sourceArea": "obj02-area01",
      "target": "obj02-area00-sub03",
      "targetArea": "obj02-area00",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AF",
        "areaTableAddress": "0x9EE5",
        "areaRecordPointerAddress": "0x9EE7",
        "areaRecordAddress": "0xA15A",
        "maxSubmap": 0,
        "leftBytes": [
          "0x00",
          "0x00",
          "0x00"
        ],
        "rightBytes": [
          "0xFF",
          "0x01",
          "0x01"
        ]
      },
      "note": "Denis Woods - Part 1 exits left to Veros Woods - Part 2."
    },
    {
      "id": "boundary-transition:obj02-area01-sub00->obj01-area01-sub00:right",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "right",
      "source": "obj02-area01-sub00",
      "sourceArea": "obj02-area01",
      "target": "obj01-area01-sub00",
      "targetArea": "obj01-area01",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AF",
        "areaTableAddress": "0x9EE5",
        "areaRecordPointerAddress": "0x9EE7",
        "areaRecordAddress": "0xA15A",
        "maxSubmap": 0,
        "leftBytes": [
          "0x00",
          "0x00",
          "0x00"
        ],
        "rightBytes": [
          "0xFF",
          "0x01",
          "0x01"
        ]
      },
      "note": "Denis Woods - Part 1 exits right to Berkeley Mansion - Door."
    },
    {
      "id": "boundary-transition:obj02-area02-sub00->obj02-area03-sub03:left",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "left",
      "source": "obj02-area02-sub00",
      "sourceArea": "obj02-area02",
      "target": "obj02-area03-sub03",
      "targetArea": "obj02-area03",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AF",
        "areaTableAddress": "0x9EE5",
        "areaRecordPointerAddress": "0x9EE9",
        "areaRecordAddress": "0xA69A",
        "maxSubmap": 0,
        "leftBytes": [
          "0x00",
          "0x00",
          "0x03"
        ],
        "rightBytes": [
          "0xFF",
          "0x00",
          "0x02"
        ]
      },
      "note": "Aljiba Woods - Part 3 exits left to Aljiba Woods - Part 2."
    },
    {
      "id": "boundary-transition:obj02-area02-sub00->obj00-area02-sub00:right",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "right",
      "source": "obj02-area02-sub00",
      "sourceArea": "obj02-area02",
      "target": "obj00-area02-sub00",
      "targetArea": "obj00-area02",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AF",
        "areaTableAddress": "0x9EE5",
        "areaRecordPointerAddress": "0x9EE9",
        "areaRecordAddress": "0xA69A",
        "maxSubmap": 0,
        "leftBytes": [
          "0x00",
          "0x00",
          "0x03"
        ],
        "rightBytes": [
          "0xFF",
          "0x00",
          "0x02"
        ]
      },
      "note": "Aljiba Woods - Part 3 exits right to Aljiba."
    },
    {
      "id": "boundary-transition:obj02-area03-sub00->obj02-area04-sub01:left",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "left",
      "source": "obj02-area03-sub00",
      "sourceArea": "obj02-area03",
      "target": "obj02-area04-sub01",
      "targetArea": "obj02-area04",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AF",
        "areaTableAddress": "0x9EE5",
        "areaRecordPointerAddress": "0x9EEB",
        "areaRecordAddress": "0xA6A5",
        "maxSubmap": 3,
        "leftBytes": [
          "0x00",
          "0x00",
          "0x04"
        ],
        "rightBytes": [
          "0x00",
          "0x00",
          "0x02"
        ]
      },
      "note": "Dabi's Path - Part 1 exits left to Denis Woods - Part 3."
    },
    {
      "id": "boundary-transition:obj02-area03-sub03->obj02-area02-sub00:right",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "right",
      "source": "obj02-area03-sub03",
      "sourceArea": "obj02-area03",
      "target": "obj02-area02-sub00",
      "targetArea": "obj02-area02",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AF",
        "areaTableAddress": "0x9EE5",
        "areaRecordPointerAddress": "0x9EEB",
        "areaRecordAddress": "0xA6A5",
        "maxSubmap": 3,
        "leftBytes": [
          "0x00",
          "0x00",
          "0x04"
        ],
        "rightBytes": [
          "0x00",
          "0x00",
          "0x02"
        ]
      },
      "note": "Aljiba Woods - Part 2 exits right to Aljiba Woods - Part 3."
    },
    {
      "id": "boundary-transition:obj02-area04-sub00->obj01-area01-sub00:left",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "left",
      "source": "obj02-area04-sub00",
      "sourceArea": "obj02-area04",
      "target": "obj01-area01-sub00",
      "targetArea": "obj01-area01",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AF",
        "areaTableAddress": "0x9EE5",
        "areaRecordPointerAddress": "0x9EED",
        "areaRecordAddress": "0xA6B6",
        "maxSubmap": 1,
        "leftBytes": [
          "0xFF",
          "0x01",
          "0x01"
        ],
        "rightBytes": [
          "0x00",
          "0x00",
          "0x03"
        ]
      },
      "note": "Denis Woods - Part 2 exits left to Berkeley Mansion - Door."
    },
    {
      "id": "boundary-transition:obj02-area04-sub01->obj02-area03-sub00:right",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "right",
      "source": "obj02-area04-sub01",
      "sourceArea": "obj02-area04",
      "target": "obj02-area03-sub00",
      "targetArea": "obj02-area03",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AF",
        "areaTableAddress": "0x9EE5",
        "areaRecordPointerAddress": "0x9EED",
        "areaRecordAddress": "0xA6B6",
        "maxSubmap": 1,
        "leftBytes": [
          "0xFF",
          "0x01",
          "0x01"
        ],
        "rightBytes": [
          "0x00",
          "0x00",
          "0x03"
        ]
      },
      "note": "Denis Woods - Part 3 exits right to Dabi's Path - Part 1."
    },
    {
      "id": "boundary-transition:obj02-area05-sub00->obj02-area03-sub03:left",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "left",
      "source": "obj02-area05-sub00",
      "sourceArea": "obj02-area05",
      "target": "obj02-area03-sub03",
      "targetArea": "obj02-area03",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AF",
        "areaTableAddress": "0x9EE5",
        "areaRecordPointerAddress": "0x9EEF",
        "areaRecordAddress": "0xA6C3",
        "maxSubmap": 1,
        "leftBytes": [
          "0xFA",
          "0x00",
          "0x03"
        ],
        "rightBytes": [
          "0xFF",
          "0x01",
          "0x02"
        ]
      },
      "note": "Yuba Lake Path exits left to Aljiba Woods - Part 2."
    },
    {
      "id": "boundary-transition:obj02-area05-sub01->obj01-area02-sub00:right",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "right",
      "source": "obj02-area05-sub01",
      "sourceArea": "obj02-area05",
      "target": "obj01-area02-sub00",
      "targetArea": "obj01-area02",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AF",
        "areaTableAddress": "0x9EE5",
        "areaRecordPointerAddress": "0x9EEF",
        "areaRecordAddress": "0xA6C3",
        "maxSubmap": 1,
        "leftBytes": [
          "0xFA",
          "0x00",
          "0x03"
        ],
        "rightBytes": [
          "0xFF",
          "0x01",
          "0x02"
        ]
      },
      "note": "Yuba Lake exits right to Rover Mansion - Door."
    },
    {
      "id": "boundary-transition:obj02-area06-sub00->obj01-area03-sub00:left",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "left",
      "source": "obj02-area06-sub00",
      "sourceArea": "obj02-area06",
      "target": "obj01-area03-sub00",
      "targetArea": "obj01-area03",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AF",
        "areaTableAddress": "0x9EE5",
        "areaRecordPointerAddress": "0x9EF1",
        "areaRecordAddress": "0xA165",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFF",
          "0x01",
          "0x03"
        ],
        "rightBytes": [
          "0x00",
          "0x00",
          "0x07"
        ]
      },
      "note": "Dead River to Brahm exits left to Brahm Mansion - Door."
    },
    {
      "id": "boundary-transition:obj02-area06-sub00->obj02-area07-sub00:right",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "right",
      "source": "obj02-area06-sub00",
      "sourceArea": "obj02-area06",
      "target": "obj02-area07-sub00",
      "targetArea": "obj02-area07",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AF",
        "areaTableAddress": "0x9EE5",
        "areaRecordPointerAddress": "0x9EF1",
        "areaRecordAddress": "0xA165",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFF",
          "0x01",
          "0x03"
        ],
        "rightBytes": [
          "0x00",
          "0x00",
          "0x07"
        ]
      },
      "note": "Dead River to Brahm exits right to Dead River - Part 2."
    },
    {
      "id": "boundary-transition:obj02-area07-sub00->obj00-area03-sub00:left",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "left",
      "source": "obj02-area07-sub00",
      "sourceArea": "obj02-area07",
      "target": "obj00-area03-sub00",
      "targetArea": "obj00-area03",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AF",
        "areaTableAddress": "0x9EE5",
        "areaRecordPointerAddress": "0x9EF3",
        "areaRecordAddress": "0xA170",
        "maxSubmap": 2,
        "leftBytes": [
          "0xFF",
          "0x00",
          "0x03"
        ],
        "rightBytes": [
          "0xFF",
          "0x00",
          "0x00"
        ]
      },
      "note": "Dead River - Part 2 exits left to Alba."
    },
    {
      "id": "boundary-transition:obj02-area07-sub02->obj00-area00-sub00:right",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "right",
      "source": "obj02-area07-sub02",
      "sourceArea": "obj02-area07",
      "target": "obj00-area00-sub00",
      "targetArea": "obj00-area00",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AF",
        "areaTableAddress": "0x9EE5",
        "areaRecordPointerAddress": "0x9EF3",
        "areaRecordAddress": "0xA170",
        "maxSubmap": 2,
        "leftBytes": [
          "0xFF",
          "0x00",
          "0x03"
        ],
        "rightBytes": [
          "0xFF",
          "0x00",
          "0x00"
        ]
      },
      "note": "Belasco Marsh exits right to Jova."
    },
    {
      "id": "boundary-transition:obj02-area08-sub00->obj00-area05-sub00:left",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "left",
      "source": "obj02-area08-sub00",
      "sourceArea": "obj02-area08",
      "target": "obj00-area05-sub00",
      "targetArea": "obj00-area05",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AF",
        "areaTableAddress": "0x9EE5",
        "areaRecordPointerAddress": "0x9EF5",
        "areaRecordAddress": "0xA17F",
        "maxSubmap": 2,
        "leftBytes": [
          "0xFF",
          "0x00",
          "0x05"
        ],
        "rightBytes": [
          "0x00",
          "0x00",
          "0x09"
        ]
      },
      "note": "North Bridge exits left to Doina."
    },
    {
      "id": "boundary-transition:obj02-area08-sub02->obj02-area09-sub00:right",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "right",
      "source": "obj02-area08-sub02",
      "sourceArea": "obj02-area08",
      "target": "obj02-area09-sub00",
      "targetArea": "obj02-area09",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AF",
        "areaTableAddress": "0x9EE5",
        "areaRecordPointerAddress": "0x9EF5",
        "areaRecordAddress": "0xA17F",
        "maxSubmap": 2,
        "leftBytes": [
          "0xFF",
          "0x00",
          "0x05"
        ],
        "rightBytes": [
          "0x00",
          "0x00",
          "0x09"
        ]
      },
      "note": "Dora Woods - Part 2 exits right to Dora Woods - Part 3."
    },
    {
      "id": "boundary-transition:obj02-area09-sub00->obj02-area08-sub02:left",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "left",
      "source": "obj02-area09-sub00",
      "sourceArea": "obj02-area09",
      "target": "obj02-area08-sub02",
      "targetArea": "obj02-area08",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AF",
        "areaTableAddress": "0x9EE5",
        "areaRecordPointerAddress": "0x9EF7",
        "areaRecordAddress": "0xA18E",
        "maxSubmap": 2,
        "leftBytes": [
          "0x00",
          "0x00",
          "0x08"
        ],
        "rightBytes": [
          "0xFF",
          "0x00",
          "0x09"
        ]
      },
      "note": "Dora Woods - Part 3 exits left to Dora Woods - Part 2."
    },
    {
      "id": "boundary-transition:obj02-area09-sub02->unresolved:right",
      "type": "boundary-transition",
      "confidence": "unresolved-target",
      "direction": "right",
      "source": "obj02-area09-sub02",
      "sourceArea": "obj02-area09",
      "targetArea": "obj00-area09",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7AF",
        "areaTableAddress": "0x9EE5",
        "areaRecordPointerAddress": "0x9EF7",
        "areaRecordAddress": "0xA18E",
        "maxSubmap": 2,
        "leftBytes": [
          "0x00",
          "0x00",
          "0x08"
        ],
        "rightBytes": [
          "0xFF",
          "0x00",
          "0x09"
        ]
      },
      "note": "Bordia Mountains (Dead End Swamp) exits right to non-atlas target obj00-area09."
    },
    {
      "id": "boundary-transition:obj03-area00-sub00->obj00-area02-sub00:left",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "left",
      "source": "obj03-area00-sub00",
      "sourceArea": "obj03-area00",
      "target": "obj00-area02-sub00",
      "targetArea": "obj00-area02",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7B1",
        "areaTableAddress": "0xB280",
        "areaRecordPointerAddress": "0xB280",
        "areaRecordAddress": "0xB372",
        "maxSubmap": 1,
        "leftBytes": [
          "0xFF",
          "0x00",
          "0x02"
        ],
        "rightBytes": [
          "0xFF",
          "0x01",
          "0x00"
        ]
      },
      "note": "Camilla Cemetery exits left to Aljiba."
    },
    {
      "id": "boundary-transition:obj03-area00-sub01->obj01-area00-sub00:right",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "right",
      "source": "obj03-area00-sub01",
      "sourceArea": "obj03-area00",
      "target": "obj01-area00-sub00",
      "targetArea": "obj01-area00",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7B1",
        "areaTableAddress": "0xB280",
        "areaRecordPointerAddress": "0xB280",
        "areaRecordAddress": "0xB372",
        "maxSubmap": 1,
        "leftBytes": [
          "0xFF",
          "0x00",
          "0x02"
        ],
        "rightBytes": [
          "0xFF",
          "0x01",
          "0x00"
        ]
      },
      "note": "Joma Marsh - Part 1 exits right to Laruba Mansion - Door."
    },
    {
      "id": "boundary-transition:obj03-area01-sub00->obj03-area00-sub01:left",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "left",
      "source": "obj03-area01-sub00",
      "sourceArea": "obj03-area01",
      "target": "obj03-area00-sub01",
      "targetArea": "obj03-area00",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7B1",
        "areaTableAddress": "0xB280",
        "areaRecordPointerAddress": "0xB282",
        "areaRecordAddress": "0xB37F",
        "maxSubmap": 0,
        "leftBytes": [
          "0x00",
          "0x00",
          "0x00"
        ],
        "rightBytes": [
          "0x00",
          "0x00",
          "0x02"
        ]
      },
      "note": "Storigoi Graveyard (Blob Boost) exits left to Joma Marsh - Part 1."
    },
    {
      "id": "boundary-transition:obj03-area01-sub00->obj03-area02-sub00:right",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "right",
      "source": "obj03-area01-sub00",
      "sourceArea": "obj03-area01",
      "target": "obj03-area02-sub00",
      "targetArea": "obj03-area02",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7B1",
        "areaTableAddress": "0xB280",
        "areaRecordPointerAddress": "0xB282",
        "areaRecordAddress": "0xB37F",
        "maxSubmap": 0,
        "leftBytes": [
          "0x00",
          "0x00",
          "0x00"
        ],
        "rightBytes": [
          "0x00",
          "0x00",
          "0x02"
        ]
      },
      "note": "Storigoi Graveyard (Blob Boost) exits right to Sadam Woods - Part 2."
    },
    {
      "id": "boundary-transition:obj03-area02-sub00->obj03-area04-sub00:left",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "left",
      "source": "obj03-area02-sub00",
      "sourceArea": "obj03-area02",
      "target": "obj03-area04-sub00",
      "targetArea": "obj03-area04",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7B1",
        "areaTableAddress": "0xB280",
        "areaRecordPointerAddress": "0xB284",
        "areaRecordAddress": "0xB38A",
        "maxSubmap": 1,
        "leftBytes": [
          "0x00",
          "0x00",
          "0x04"
        ],
        "rightBytes": [
          "0xFF",
          "0x00",
          "0x03"
        ]
      },
      "note": "Sadam Woods - Part 2 exits left to Sadam Woods - Part 3."
    },
    {
      "id": "boundary-transition:obj03-area02-sub01->obj00-area03-sub00:right",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "right",
      "source": "obj03-area02-sub01",
      "sourceArea": "obj03-area02",
      "target": "obj00-area03-sub00",
      "targetArea": "obj00-area03",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7B1",
        "areaTableAddress": "0xB280",
        "areaRecordPointerAddress": "0xB284",
        "areaRecordAddress": "0xB38A",
        "maxSubmap": 1,
        "leftBytes": [
          "0x00",
          "0x00",
          "0x04"
        ],
        "rightBytes": [
          "0xFF",
          "0x00",
          "0x03"
        ]
      },
      "note": "Sadam Woods - Part 1 exits right to Alba."
    },
    {
      "id": "boundary-transition:obj03-area03-sub00->obj01-area00-sub00:left",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "left",
      "source": "obj03-area03-sub00",
      "sourceArea": "obj03-area03",
      "target": "obj01-area00-sub00",
      "targetArea": "obj01-area00",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7B1",
        "areaTableAddress": "0xB280",
        "areaRecordPointerAddress": "0xB286",
        "areaRecordAddress": "0xB7C7",
        "maxSubmap": 4,
        "leftBytes": [
          "0xFF",
          "0x01",
          "0x00"
        ],
        "rightBytes": [
          "0xFF",
          "0x01",
          "0x04"
        ]
      },
      "note": "Joma Marsh - Part 2 exits left to Laruba Mansion - Door."
    },
    {
      "id": "boundary-transition:obj03-area03-sub04->obj01-area04-sub00:right",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "right",
      "source": "obj03-area03-sub04",
      "sourceArea": "obj03-area03",
      "target": "obj01-area04-sub00",
      "targetArea": "obj01-area04",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7B1",
        "areaTableAddress": "0xB280",
        "areaRecordPointerAddress": "0xB286",
        "areaRecordAddress": "0xB7C7",
        "maxSubmap": 4,
        "leftBytes": [
          "0xFF",
          "0x01",
          "0x00"
        ],
        "rightBytes": [
          "0xFF",
          "0x01",
          "0x04"
        ]
      },
      "note": "Debious Woods - Part 1 exits right to Bodley Mansion - Door."
    },
    {
      "id": "boundary-transition:obj03-area04-sub00->obj00-area04-sub00:left",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "left",
      "source": "obj03-area04-sub00",
      "sourceArea": "obj03-area04",
      "target": "obj00-area04-sub00",
      "targetArea": "obj00-area04",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7B1",
        "areaTableAddress": "0xB280",
        "areaRecordPointerAddress": "0xB288",
        "areaRecordAddress": "0xB397",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFF",
          "0x00",
          "0x04"
        ],
        "rightBytes": [
          "0x00",
          "0x00",
          "0x02"
        ]
      },
      "note": "Sadam Woods - Part 3 exits left to Ondol."
    },
    {
      "id": "boundary-transition:obj03-area04-sub00->obj03-area02-sub00:right",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "right",
      "source": "obj03-area04-sub00",
      "sourceArea": "obj03-area04",
      "target": "obj03-area02-sub00",
      "targetArea": "obj03-area02",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7B1",
        "areaTableAddress": "0xB280",
        "areaRecordPointerAddress": "0xB288",
        "areaRecordAddress": "0xB397",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFF",
          "0x00",
          "0x04"
        ],
        "rightBytes": [
          "0x00",
          "0x00",
          "0x02"
        ]
      },
      "note": "Sadam Woods - Part 3 exits right to Sadam Woods - Part 2."
    },
    {
      "id": "boundary-transition:obj04-area00-sub00->obj04-area00-sub01:left",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "left",
      "source": "obj04-area00-sub00",
      "sourceArea": "obj04-area00",
      "target": "obj04-area00-sub01",
      "targetArea": "obj04-area00",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7B3",
        "areaTableAddress": "0xAE64",
        "areaRecordPointerAddress": "0xAE64",
        "areaRecordAddress": "0xAE6C",
        "maxSubmap": 1,
        "leftBytes": [
          "0x00",
          "0x00",
          "0x00"
        ],
        "rightBytes": [
          "0xFF",
          "0x01",
          "0x03"
        ]
      },
      "note": "Vrad Mountain - Part 2 (Diamond Dude) exits left to Vrad Mountain - Part 1."
    },
    {
      "id": "boundary-transition:obj04-area00-sub01->obj01-area03-sub00:right",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "right",
      "source": "obj04-area00-sub01",
      "sourceArea": "obj04-area00",
      "target": "obj01-area03-sub00",
      "targetArea": "obj01-area03",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7B3",
        "areaTableAddress": "0xAE64",
        "areaRecordPointerAddress": "0xAE64",
        "areaRecordAddress": "0xAE6C",
        "maxSubmap": 1,
        "leftBytes": [
          "0x00",
          "0x00",
          "0x00"
        ],
        "rightBytes": [
          "0xFF",
          "0x01",
          "0x03"
        ]
      },
      "note": "Vrad Mountain - Part 1 exits right to Brahm Mansion - Door."
    },
    {
      "id": "boundary-transition:obj04-area01-sub00->obj01-area04-sub00:left",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "left",
      "source": "obj04-area01-sub00",
      "sourceArea": "obj04-area01",
      "target": "obj01-area04-sub00",
      "targetArea": "obj01-area04",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7B3",
        "areaTableAddress": "0xAE64",
        "areaRecordPointerAddress": "0xAE66",
        "areaRecordAddress": "0xAE79",
        "maxSubmap": 1,
        "leftBytes": [
          "0xFF",
          "0x01",
          "0x04"
        ],
        "rightBytes": [
          "0xFF",
          "0x00",
          "0x04"
        ]
      },
      "note": "Deborah Cliff (In Tornado) exits left to Bodley Mansion - Door."
    },
    {
      "id": "boundary-transition:obj04-area01-sub01->obj00-area04-sub00:right",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "right",
      "source": "obj04-area01-sub01",
      "sourceArea": "obj04-area01",
      "target": "obj00-area04-sub00",
      "targetArea": "obj00-area04",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7B3",
        "areaTableAddress": "0xAE64",
        "areaRecordPointerAddress": "0xAE66",
        "areaRecordAddress": "0xAE79",
        "maxSubmap": 1,
        "leftBytes": [
          "0xFF",
          "0x01",
          "0x04"
        ],
        "rightBytes": [
          "0xFF",
          "0x00",
          "0x04"
        ]
      },
      "note": "Jam Wasteland (Deborah Cliff) exits right to Ondol."
    },
    {
      "id": "boundary-transition:obj04-area02-sub00->obj01-area04-sub00:left",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "left",
      "source": "obj04-area02-sub00",
      "sourceArea": "obj04-area02",
      "target": "obj01-area04-sub00",
      "targetArea": "obj01-area04",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7B3",
        "areaTableAddress": "0xAE64",
        "areaRecordPointerAddress": "0xAE68",
        "areaRecordAddress": "0xAE86",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFF",
          "0x01",
          "0x04"
        ],
        "rightBytes": [
          "0xFF",
          "0x00",
          "0x05"
        ]
      },
      "note": "Wicked Ditch exits left to Bodley Mansion - Door."
    },
    {
      "id": "boundary-transition:obj04-area02-sub00->obj00-area05-sub00:right",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "right",
      "source": "obj04-area02-sub00",
      "sourceArea": "obj04-area02",
      "target": "obj00-area05-sub00",
      "targetArea": "obj00-area05",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7B3",
        "areaTableAddress": "0xAE64",
        "areaRecordPointerAddress": "0xAE68",
        "areaRecordAddress": "0xAE86",
        "maxSubmap": 0,
        "leftBytes": [
          "0xFF",
          "0x01",
          "0x04"
        ],
        "rightBytes": [
          "0xFF",
          "0x00",
          "0x05"
        ]
      },
      "note": "Wicked Ditch exits right to Doina."
    },
    {
      "id": "boundary-transition:obj04-area03-sub00->obj00-area06-sub00:left",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "left",
      "source": "obj04-area03-sub00",
      "sourceArea": "obj04-area03",
      "target": "obj00-area06-sub00",
      "targetArea": "obj00-area06",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7B3",
        "areaTableAddress": "0xAE64",
        "areaRecordPointerAddress": "0xAE6A",
        "areaRecordAddress": "0xAE91",
        "maxSubmap": 1,
        "leftBytes": [
          "0xFF",
          "0x00",
          "0x06"
        ],
        "rightBytes": [
          "0xFF",
          "0x05",
          "0x00"
        ]
      },
      "note": "Vrad Graveyard exits left to Yomi."
    },
    {
      "id": "boundary-transition:obj04-area03-sub01->obj05-area00-sub00:right",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "right",
      "source": "obj04-area03-sub01",
      "sourceArea": "obj04-area03",
      "target": "obj05-area00-sub00",
      "targetArea": "obj05-area00",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7B3",
        "areaTableAddress": "0xAE64",
        "areaRecordPointerAddress": "0xAE6A",
        "areaRecordAddress": "0xAE91",
        "maxSubmap": 1,
        "leftBytes": [
          "0xFF",
          "0x00",
          "0x06"
        ],
        "rightBytes": [
          "0xFF",
          "0x05",
          "0x00"
        ]
      },
      "note": "Castlevania Bridge exits right to Castlevania."
    },
    {
      "id": "boundary-transition:obj05-area00-sub00->obj04-area03-sub01:left",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "left",
      "source": "obj05-area00-sub00",
      "sourceArea": "obj05-area00",
      "target": "obj04-area03-sub01",
      "targetArea": "obj04-area03",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7B5",
        "areaTableAddress": "0xBC56",
        "areaRecordPointerAddress": "0xBC56",
        "areaRecordAddress": "0xBC58",
        "maxSubmap": 1,
        "leftBytes": [
          "0xFF",
          "0x04",
          "0x03"
        ],
        "rightBytes": [
          "0x00",
          "0x00",
          "0x00"
        ]
      },
      "note": "Castlevania exits left to Castlevania Bridge."
    },
    {
      "id": "boundary-transition:obj05-area00-sub00->obj05-area00-sub00:right",
      "type": "boundary-transition",
      "confidence": "rom-area-transition",
      "direction": "right",
      "source": "obj05-area00-sub00",
      "sourceArea": "obj05-area00",
      "target": "obj05-area00-sub00",
      "targetArea": "obj05-area00",
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
      "sourceRecord": {
        "areaTablePointerAddress": "0xF7B5",
        "areaTableAddress": "0xBC56",
        "areaRecordPointerAddress": "0xBC56",
        "areaRecordAddress": "0xBC58",
        "maxSubmap": 1,
        "leftBytes": [
          "0xFF",
          "0x04",
          "0x03"
        ],
        "rightBytes": [
          "0x00",
          "0x00",
          "0x00"
        ]
      },
      "note": "Castlevania exits right to Castlevania."
    }
  ],
  "routes": [
    {
      "id": "jova-to-castlevania-area-path",
      "label": "Jova to Castlevania topology path",
      "source": "obj00-area00",
      "target": "obj05-area00",
      "areaIds": [
        "obj00-area00",
        "obj02-area07",
        "obj00-area03",
        "obj03-area02",
        "obj03-area04",
        "obj00-area04",
        "obj04-area01",
        "obj01-area04",
        "obj04-area02",
        "obj00-area05",
        "obj02-area08",
        "obj00-area06",
        "obj04-area03",
        "obj05-area00"
      ],
      "edgeIds": [
        "boundary-transition:obj00-area00-sub00->obj02-area07-sub02:left",
        "boundary-transition:obj00-area03-sub00->obj02-area07-sub00:right",
        "boundary-transition:obj00-area03-sub00->obj03-area02-sub01:left",
        "boundary-transition:obj03-area02-sub00->obj03-area04-sub00:left",
        "boundary-transition:obj00-area04-sub00->obj03-area04-sub00:right",
        "boundary-transition:obj00-area04-sub00->obj04-area01-sub01:left",
        "boundary-transition:obj04-area01-sub00->obj01-area04-sub00:left",
        "boundary-transition:obj01-area04-sub00->obj04-area02-sub00:right",
        "boundary-transition:obj00-area05-sub00->obj04-area02-sub00:left",
        "boundary-transition:obj00-area05-sub00->obj02-area08-sub00:right",
        "boundary-transition:obj00-area06-sub00->obj02-area08-sub02:left",
        "boundary-transition:obj00-area06-sub00->obj04-area03-sub00:right",
        "boundary-transition:obj04-area03-sub01->obj05-area00-sub00:right"
      ],
      "status": "rom-transition-derived",
      "note": "Shortest undirected area-level path through resolved ROM transition edges. This is topology, not final world coordinates."
    }
  ]
};
