import initWasm, { decode_chr_atlas, expand_segment_tilemap } from './vendor/guide-map-wasm/guide_map_wasm.js';
import {
  Cv2DialogLayout,
  NES_PALETTE,
  createGlyphMap,
  isCv2DialogRuleLine,
  normalizeCv2DialogText,
  renderCv2DialogFrameToRgba
} from './dialog.js?v=right-of-camilla-map';

const CACHE_KEY = 'guide-music-5';
const SLICE_URL = `./assets/slices/jova-to-berkeley/slice.json?v=${CACHE_KEY}`;
const FONT_URL = `./assets/fonts/cv2-dialog.json?v=${CACHE_KEY}`;
const MUSIC_DATA_URL = `./assets/audio/cv2-music-data.js?v=${CACHE_KEY}`;
const MUSIC_WORKLET_URL = `./assets/audio/cv2-apu-worklet.js?v=${CACHE_KEY}`;
const OVERWORLD_VIEW_ID = 'overworld';
const BERKELEY_MANSION_VIEW_ID = 'berkeley-mansion';
const BRAHM_MANSION_VIEW_ID = 'brahm-mansion';
const JOVA_CHURCH_VIEW_ID = 'jova-church';
const JOVA_THORN_WHIP_ROOM_VIEW_ID = 'jova-thorn-whip-room';
const JOVA_HOLY_WATER_ROOM_VIEW_ID = 'jova-holy-water-room';
const VEROS_DAGGER_ROOM_VIEW_ID = 'veros-dagger-room';
const VEROS_CHURCH_VIEW_ID = 'veros-church';
const VEROS_CHAIN_WHIP_ROOM_VIEW_ID = 'veros-chain-whip-room';
const ALJIBA_GARLIC_ROOM_VIEW_ID = 'aljiba-garlic-room';
const ALJIBA_BOOK_OLD_LADY_ROOM_VIEW_ID = 'aljiba-book-old-lady-room';
const ALJIBA_LAURELS_ROOM_VIEW_ID = 'aljiba-laurels-room';
const ALBA_GARLIC_ROOM_VIEW_ID = 'alba-garlic-room';
const ALBA_CHURCH_VIEW_ID = 'alba-church';
const ALBA_LAURELS_ROOM_VIEW_ID = 'alba-laurels-room';
const ONDOL_MORNING_STAR_ROOM_VIEW_ID = 'ondol-morning-star-room';
const ONDOL_DEATH_STAR_LADY_ROOM_VIEW_ID = 'ondol-death-star-lady-room';
const ONDOL_LAURELS_ROOM_VIEW_ID = 'ondol-laurels-room';
const LAUBER_MANSION_VIEW_ID = 'lauber-mansion';
const DOINA_GET_BACK_LADY_ROOM_VIEW_ID = 'doina-get-back-lady-room';
const DOINA_LAURELS_ROOM_VIEW_ID = 'doina-laurels-room';
const YOMI_EMPTY_ROOM_VIEW_ID = 'yomi-empty-room';
const YOMI_GIRLFRIEND_ROOM_VIEW_ID = 'yomi-girlfriend-room';
const LARUBA_MANSION_VIEW_ID = 'laruba-mansion';
const BODLEY_MANSION_VIEW_ID = 'bodley-mansion';
const CASTLEVANIA_VIEW_ID = 'castlevania';
const MUSIC_TRACK_IDS = {
  daytimeTown: 0x39,
  bloodyTears: 0x3d,
  nighttime: 0x41,
  mansion: 0x45,
  castlevania: 0x49,
  draculaBattle: 0x4d
};
const DEFAULT_MUSIC_SEGMENT_ID = 'town-of-jova';
const DRACULA_MUSIC_ACTOR_URL_CODE = 'dracula';
const TOWN_SEGMENT_IDS = new Set([
  'town-of-ondol',
  'town-of-alba',
  'town-of-jova',
  'town-of-veros',
  'town-of-aljiba',
  'town-of-doina',
  'town-of-yomi'
]);
const MANSION_VIEW_IDS = new Set([
  BERKELEY_MANSION_VIEW_ID,
  BRAHM_MANSION_VIEW_ID,
  LAUBER_MANSION_VIEW_ID,
  LARUBA_MANSION_VIEW_ID,
  BODLEY_MANSION_VIEW_ID
]);
const VIEW_TRANSITION_MS = 140;
const VIEW_TRANSITION_HOLD_MS = 40;
const STARTUP_LOAD_OVERWORLD_START = 0.1;
const STARTUP_LOAD_OVERWORLD_END = 0.82;
const STARTUP_LOAD_SCENE_START = 0.9;
const STARTUP_LOAD_SCENE_END = 0.98;
const NES_SCREEN_WIDTH = 256;
const NES_SCREEN_HEIGHT = 224;
const MOBILE_SPAWN_CAMERA_PADDING = 0.94;
const DESKTOP_SPAWN_CAMERA_PADDING = 0.47;
const OVERLAY_SCREEN_CULL_MARGIN_PX = 96;
const LABEL_SCREEN_CULL_MARGIN_PX = 240;

const ROUTE_SEGMENT_IDS = [
  'deborah-cliff',
  'jam-wasteland',
  'town-of-ondol',
  'sadam-woods-part-3',
  'storigoi-graveyard',
  'sadam-woods-part-2',
  'sadam-woods-part-1',
  'town-of-alba',
  'vrad-mountain-part-2',
  'vrad-mountain-part-1',
  'dead-river-part-2',
  'dead-river-part-1',
  'belasco-marsh',
  'brahm-mansion-door',
  'dead-river-to-brahm',
  'town-of-jova',
  'jova-woods',
  'south-bridge',
  'veros-woods-part-1',
  'veros-woods-part-2',
  'town-of-veros',
  'dabis-path-part-1',
  'dabis-path-part-2',
  'aljiba-woods-part-1',
  'aljiba-woods-part-2',
  'aljiba-woods-part-3',
  'town-of-aljiba',
  'camilla-cemetery',
  'joma-marsh-part-1',
  'laruba-mansion-door',
  'joma-marsh-part-2',
  'debious-woods',
  'uta-lower-road-2',
  'uta-lower-road-1',
  'uta-road',
  'bodley-mansion-door',
  'wicked-ditch',
  'town-of-doina',
  'north-bridge',
  'dora-woods-part-1',
  'dora-woods-part-2',
  'town-of-yomi',
  'vrad-graveyard',
  'west-bridge',
  'castlevania',
  'dora-woods-part-3',
  'east-bridge',
  'denis-marsh',
  'lower-road',
  'yuba-lake',
  'lauber-mansion-door',
  'denis-woods-part-1',
  'berkeley-mansion-door',
  'denis-woods-part-2',
  'denis-woods-part-3'
];
const ROUTE_SEGMENT_ID_SET = new Set(ROUTE_SEGMENT_IDS);

const OVERVIEW_LABEL_SCALE = 0.3;
const OVERVIEW_LABEL_TEXT = new Map([
  ['deborah-cliff', 'Deborah Cliff'],
  ['jam-wasteland', 'Jam Wasteland'],
  ['sadam-woods-part-3', 'Sadam Woods'],
  ['storigoi-graveyard', 'Storigoi Graveyard'],
  ['sadam-woods-part-2', 'Sadam Woods'],
  ['sadam-woods-part-1', 'Sadam Woods'],
  ['vrad-mountain-part-2', 'Vrad Mountain'],
  ['vrad-mountain-part-1', 'Vrad Mountain'],
  ['dead-river-part-2', 'Dead River'],
  ['dead-river-part-1', 'Dead River'],
  ['dead-river-to-brahm', 'Dead River'],
  ['brahm-mansion-door', "Brahm's Mansion"],
  ['veros-woods-part-1', 'Veros Woods'],
  ['dabis-path-part-1', "Dabi's Path"],
  ['aljiba-woods-part-1', 'Aljiba Woods'],
  ['denis-woods-part-1', 'Denis Woods'],
  ['denis-woods-part-2', 'Denis Woods'],
  ['berkeley-mansion-door', 'Berkeley Mansion'],
  ['lauber-mansion-door', 'Lauber Mansion'],
  ['joma-marsh-part-1', 'Joma Marsh'],
  ['joma-marsh-part-2', 'Joma Marsh'],
  ['debious-woods', 'Debious Woods'],
  ['laruba-mansion-door', 'Laruba Mansion'],
  ['uta-lower-road-2', 'Uta Lower Road'],
  ['uta-lower-road-1', 'Uta Lower Road'],
  ['uta-road', 'Wicked Ditch'],
  ['bodley-mansion-door', 'Bodley Mansion'],
  ['wicked-ditch', 'Wicked Ditch'],
  ['north-bridge', 'North Bridge'],
  ['dora-woods-part-1', 'Dora Woods'],
  ['dora-woods-part-2', 'Dora Woods'],
  ['dora-woods-part-3', 'Dora Woods'],
  ['east-bridge', 'East Bridge'],
  ['denis-marsh', 'Denis Marsh'],
  ['vrad-graveyard', 'Vrad Graveyard'],
  ['west-bridge', 'West Bridge']
]);
const OVERVIEW_LABEL_HIDDEN_IDS = new Set([
  'sadam-woods-part-1',
  'sadam-woods-part-3',
  'vrad-mountain-part-1',
  'dead-river-part-1',
  'dead-river-to-brahm',
  'veros-woods-part-2',
  'dabis-path-part-2',
  'aljiba-woods-part-2',
  'aljiba-woods-part-3',
  'denis-woods-part-2',
  'denis-woods-part-3',
  'joma-marsh-part-2',
  'uta-lower-road-1',
  'uta-road',
  'dora-woods-part-2',
  'dora-woods-part-3'
]);
const LABEL_BELOW_SEGMENT_IDS = new Set([
  'vrad-mountain-part-2',
  'vrad-mountain-part-1',
  'storigoi-graveyard',
  'brahm-mansion-door',
  'brahm-mansion-death-fight',
  'brahm-mansion-orb-room',
  'laruba-mansion-camilla-fight',
  'laruba-mansion-orb-room',
  'dead-river-to-brahm',
  'town-of-veros',
  'lower-road',
  'yuba-lake',
  'lauber-mansion-door',
  'laruba-mansion-door',
  'bodley-mansion-door',
  'uta-lower-road-1',
  'town-of-yomi',
  'vrad-graveyard',
  'west-bridge'
]);
const LABEL_BOUNDS_SEGMENT_IDS = new Map([
  ['uta-lower-road-1', ['uta-lower-road-1', 'uta-lower-road-1-revealed-route']],
  ['yuba-lake', ['yuba-lake', 'yuba-lake-revealed-route']]
]);
const OVERVIEW_LABEL_BOUNDS_SEGMENT_IDS = new Map([
  ['sadam-woods-part-2', ['sadam-woods-part-3', 'sadam-woods-part-2', 'sadam-woods-part-1']],
  ['vrad-mountain-part-2', ['vrad-mountain-part-2', 'vrad-mountain-part-1']],
  ['dead-river-part-2', ['dead-river-part-2', 'dead-river-part-1', 'dead-river-to-brahm']],
  ['veros-woods-part-1', ['veros-woods-part-1', 'veros-woods-part-2']],
  ['dabis-path-part-1', ['dabis-path-part-1', 'dabis-path-part-2']],
  ['aljiba-woods-part-1', ['aljiba-woods-part-1', 'aljiba-woods-part-2', 'aljiba-woods-part-3']],
  ['denis-woods-part-1', ['denis-woods-part-1', 'denis-woods-part-2', 'denis-woods-part-3']],
  ['joma-marsh-part-1', ['joma-marsh-part-1', 'joma-marsh-part-2']],
  ['uta-lower-road-2', ['uta-lower-road-2', 'uta-lower-road-1', 'uta-lower-road-1-revealed-route']],
  ['dora-woods-part-1', ['dora-woods-part-1', 'dora-woods-part-2', 'dora-woods-part-3']],
  ['yuba-lake', ['yuba-lake', 'yuba-lake-revealed-route']]
]);
const OVERWORLD_ROUTE_CONNECTORS = [
  {
    id: 'dead-river-brahm-route-connector',
    fromSegmentId: 'dead-river-part-1',
    toSegmentId: 'dead-river-to-brahm',
    visibilityLayer: 'secrets',
    fromAnchorX: 0.5,
    toAnchorX: 1,
    toAnchorY: 0.5,
    bendYRatio: 1
  },
  {
    id: 'deborah-cliff-bodley-route-connector',
    fromFeatureId: 'deborah-cliff-red-crystal-kneel-tornado',
    toSegmentId: 'bodley-mansion-door',
    visibilityLayer: 'secrets',
    fromAnchorX: 0.5,
    fromAnchorY: 0,
    toAnchorX: 0.5,
    toAnchorY: 0,
    bendDistanceConnectorId: 'dead-river-brahm-route-connector',
    bendDirection: 'up'
  }
];
const ROUTE_CONNECTOR_DASH_WORLD_PX = 8;
const ROUTE_CONNECTOR_MIN_SCREEN_PX = 1;
const ROUTE_CONNECTOR_MIN_DASH_SCREEN_PX = 4;
const SECRET_FEATURE_HIGHLIGHT_SHAPE_VIEWBOX_SIZE = 96;
const LABEL_COLLISION_PADDING = 6;
const LABEL_MAP_GAP = 10;
const LABEL_LEADER_THRESHOLD = 3;
const LABEL_DIALOG_SCALE = 1.25;
const LABEL_DIALOG_MIN_TEXT_COLUMNS = 6;
const LABEL_DIALOG_GREY_BORDER = [255, 255, 255, 61];
const GUIDE_AUTHORED_DIALOG_GREY_BORDER = [61, 61, 61, 255];
const GUIDE_AUTHORED_DIALOG_TONE = 'guide-authored';
const ITEM_MENTION_CHARACTER_RE = /[A-Z0-9']/;
const ITEM_BADGE_TILE_COLUMNS = 3;
const ITEM_BADGE_TILE_ROWS = 3;
const ITEM_BADGE_GAP_PX = 6;
const ITEM_BADGE_HEART_ICON_ID = 'heart';
const MENU_ITEM_ICON_PALETTE = ['0x0F', '0x11', '0x20', '0x15'];
const CHROME_ICON_SIZE = 16;
const CHROME_ICON_PALETTE = {
  W: [...NES_PALETTE[0x20], 255],
  G: [...NES_PALETTE[0x2d], 255],
  Y: [...NES_PALETTE[0x27], 255]
};
const CHROME_ICONS = {
  sun: [
    '................',
    '.......Y........',
    '..Y....Y....Y...',
    '...Y.......Y....',
    '.....YYYYY......',
    '....YYYYYYY.....',
    '...YYYYYYYYY....',
    'YY.YYYYYYYYY.YY.',
    '...YYYYYYYYY....',
    '...YYYYYYYYY....',
    '....YYYYYYY.....',
    '.....YYYYY......',
    '...Y.......Y....',
    '..Y....Y....Y...',
    '.......Y........',
    '................'
  ],
  moon: [
    '................',
    '........WWWW....',
    '......WWWW......',
    '.....WWWW.......',
    '....WWWWW.......',
    '...WWWWW........',
    '...WWWWW........',
    '...WWWWW........',
    '...WWWWW........',
    '...WWWWW........',
    '...WWWWW........',
    '....WWWWW.......',
    '.....WWWW.......',
    '......WWWW......',
    '........WWWW....',
    '................'
  ],
  layers: [
    '................',
    '.WWWWWWWWWW.....',
    '.W........W.....',
    '.W........WGGGG.',
    '.W........W...G.',
    '.W........W...G.',
    '.W........W...G.',
    '.W........W...G.',
    '.W........W...G.',
    '.W........W...G.',
    '.W........W...G.',
    '.W........W...G.',
    '.W........W...G.',
    '.WWWWWWWWWW...G.',
    '.....G........G.',
    '.....GGGGGGGGGG.'
  ],
  back: [
    '................',
    '................',
    '......W.........',
    '.....WW.........',
    '....WWW.........',
    '...WWWWWWWWW....',
    '..WWWWWWWWWW....',
    '.WWWWWWWWWWW....',
    '..WWWWWWWWWW....',
    '...WWWWWWWWW....',
    '....WWW.........',
    '.....WW.........',
    '......W.........',
    '................',
    '................',
    '................'
  ],
  reset: [
    '......W.........',
    '.....WW.........',
    '....WWWWWW......',
    '.....WW...WW....',
    '...W..W.....W...',
    '..W..........W..',
    '..W..........W..',
    '.W............W.',
    '.W............W.',
    '.W............W.',
    '.W............W.',
    '..W..........W..',
    '..W..........W..',
    '...W........W...',
    '....WW....WW....',
    '......WWWW......'
  ],
  audioOn: [
    '................',
    '................',
    '.........WW.....',
    '........WWW.....',
    '.......WWWW.....',
    '.....WWWWWW...W.',
    '....WWWWWWW.W..W',
    '....WWWWWWW..W.W',
    '....WWWWWWW..W.W',
    '....WWWWWWW.W..W',
    '.....WWWWWW...W.',
    '.......WWWW.....',
    '........WWW.....',
    '.........WW.....',
    '................',
    '................'
  ],
  audioOff: [
    '................',
    '................',
    '.........WW.....',
    '........WWW..W..',
    '.......WWWW.W...',
    '.....WWWWWWW....',
    '....WWWWWWW.....',
    '....WWWWWW......',
    '....WWWWW.W.....',
    '....WWWW.WW.....',
    '.....WW.WWW.....',
    '.....W.WWWW.....',
    '....W...WWW.....',
    '...W.....WW.....',
    '................',
    '................'
  ]
};

const MAP_VIEWS = {
  [OVERWORLD_VIEW_ID]: {
    id: OVERWORLD_VIEW_ID,
    label: 'Town of Jova to Camilla Cemetery',
    ariaLabel: 'Castlevania II exterior guide map',
    supportsPalette: true,
    defaultVariant: 'day',
    labelSegmentIds: ROUTE_SEGMENT_IDS,
    hasFloatingProjection: true,
    hasDoorHotspots: true,
    renderer: null
  },
  [BERKELEY_MANSION_VIEW_ID]: {
    id: BERKELEY_MANSION_VIEW_ID,
    label: 'Berkeley Mansion',
    ariaLabel: 'Berkeley Mansion interior map',
    supportsPalette: false,
    fixedVariant: 'fixed',
    sceneUrl: `./assets/scenes/berkeley-mansion/slice.json?v=${CACHE_KEY}`,
    renderer: null
  },
  [BRAHM_MANSION_VIEW_ID]: {
    id: BRAHM_MANSION_VIEW_ID,
    label: "Brahm's Mansion",
    ariaLabel: "Brahm's Mansion interior map",
    supportsPalette: false,
    fixedVariant: 'fixed',
    sceneUrl: `./assets/scenes/brahm-mansion/slice.json?v=${CACHE_KEY}`,
    renderer: null
  },
  [JOVA_CHURCH_VIEW_ID]: {
    id: JOVA_CHURCH_VIEW_ID,
    label: 'Jova Church',
    ariaLabel: 'Jova Church interior map',
    supportsPalette: false,
    fixedVariant: 'day',
    sceneUrl: `./assets/scenes/jova-church/slice.json?v=${CACHE_KEY}`,
    renderer: null
  },
  [JOVA_THORN_WHIP_ROOM_VIEW_ID]: {
    id: JOVA_THORN_WHIP_ROOM_VIEW_ID,
    label: 'Jova Thorn Whip Room',
    ariaLabel: 'Jova Thorn Whip Room interior map',
    supportsPalette: false,
    fixedVariant: 'day',
    sceneUrl: `./assets/scenes/jova-thorn-whip-room/slice.json?v=${CACHE_KEY}`,
    renderer: null
  },
  [JOVA_HOLY_WATER_ROOM_VIEW_ID]: {
    id: JOVA_HOLY_WATER_ROOM_VIEW_ID,
    label: 'Jova Holy Water Room',
    ariaLabel: 'Jova Holy Water Room interior map',
    supportsPalette: false,
    fixedVariant: 'day',
    sceneUrl: `./assets/scenes/jova-holy-water-room/slice.json?v=${CACHE_KEY}`,
    renderer: null
  },
  [VEROS_DAGGER_ROOM_VIEW_ID]: {
    id: VEROS_DAGGER_ROOM_VIEW_ID,
    label: 'Veros Dagger Room',
    ariaLabel: 'Veros Dagger Room interior map',
    supportsPalette: false,
    fixedVariant: 'day',
    sceneUrl: `./assets/scenes/veros-dagger-room/slice.json?v=${CACHE_KEY}`,
    renderer: null
  },
  [VEROS_CHURCH_VIEW_ID]: {
    id: VEROS_CHURCH_VIEW_ID,
    label: 'Veros Church',
    ariaLabel: 'Veros Church interior map',
    supportsPalette: false,
    fixedVariant: 'day',
    sceneUrl: `./assets/scenes/veros-church/slice.json?v=${CACHE_KEY}`,
    renderer: null
  },
  [VEROS_CHAIN_WHIP_ROOM_VIEW_ID]: {
    id: VEROS_CHAIN_WHIP_ROOM_VIEW_ID,
    label: 'Veros Chain Whip Room',
    ariaLabel: 'Veros Chain Whip Room interior map',
    supportsPalette: false,
    fixedVariant: 'day',
    sceneUrl: `./assets/scenes/veros-chain-whip-room/slice.json?v=${CACHE_KEY}`,
    renderer: null
  },
  [ALJIBA_GARLIC_ROOM_VIEW_ID]: {
    id: ALJIBA_GARLIC_ROOM_VIEW_ID,
    label: 'Aljiba Garlic Room',
    ariaLabel: 'Aljiba Garlic Room interior map',
    supportsPalette: false,
    fixedVariant: 'day',
    sceneUrl: `./assets/scenes/aljiba-garlic-room/slice.json?v=${CACHE_KEY}`,
    renderer: null
  },
  [ALJIBA_BOOK_OLD_LADY_ROOM_VIEW_ID]: {
    id: ALJIBA_BOOK_OLD_LADY_ROOM_VIEW_ID,
    label: 'Aljiba Book And Old Lady Room',
    ariaLabel: 'Aljiba Book and Old Lady interior map',
    supportsPalette: false,
    fixedVariant: 'day',
    sceneUrl: `./assets/scenes/aljiba-book-old-lady-room/slice.json?v=${CACHE_KEY}`,
    renderer: null
  },
  [ALJIBA_LAURELS_ROOM_VIEW_ID]: {
    id: ALJIBA_LAURELS_ROOM_VIEW_ID,
    label: 'Aljiba Laurels Room',
    ariaLabel: 'Aljiba Laurels Room interior map',
    supportsPalette: false,
    fixedVariant: 'day',
    sceneUrl: `./assets/scenes/aljiba-laurels-room/slice.json?v=${CACHE_KEY}`,
    renderer: null
  },
  [ALBA_GARLIC_ROOM_VIEW_ID]: {
    id: ALBA_GARLIC_ROOM_VIEW_ID,
    label: 'Alba Garlic Room',
    ariaLabel: 'Alba Garlic Room interior map',
    supportsPalette: false,
    fixedVariant: 'day',
    sceneUrl: `./assets/scenes/alba-garlic-room/slice.json?v=${CACHE_KEY}`,
    renderer: null
  },
  [ALBA_CHURCH_VIEW_ID]: {
    id: ALBA_CHURCH_VIEW_ID,
    label: 'Alba Church',
    ariaLabel: 'Alba Church interior map',
    supportsPalette: false,
    fixedVariant: 'day',
    sceneUrl: `./assets/scenes/alba-church/slice.json?v=${CACHE_KEY}`,
    renderer: null
  },
  [ALBA_LAURELS_ROOM_VIEW_ID]: {
    id: ALBA_LAURELS_ROOM_VIEW_ID,
    label: 'Alba Laurels Room',
    ariaLabel: 'Alba Laurels Room interior map',
    supportsPalette: false,
    fixedVariant: 'day',
    sceneUrl: `./assets/scenes/alba-laurels-room/slice.json?v=${CACHE_KEY}`,
    renderer: null
  },
  [ONDOL_MORNING_STAR_ROOM_VIEW_ID]: {
    id: ONDOL_MORNING_STAR_ROOM_VIEW_ID,
    label: 'Ondol Morning Star Room',
    ariaLabel: 'Ondol Morning Star Room interior map',
    supportsPalette: false,
    fixedVariant: 'day',
    sceneUrl: `./assets/scenes/ondol-morning-star-room/slice.json?v=${CACHE_KEY}`,
    renderer: null
  },
  [ONDOL_DEATH_STAR_LADY_ROOM_VIEW_ID]: {
    id: ONDOL_DEATH_STAR_LADY_ROOM_VIEW_ID,
    label: 'Ondol Death Star Lady Room',
    ariaLabel: 'Ondol Death Star Lady Room interior map',
    supportsPalette: false,
    fixedVariant: 'day',
    sceneUrl: `./assets/scenes/ondol-death-star-lady-room/slice.json?v=${CACHE_KEY}`,
    renderer: null
  },
  [ONDOL_LAURELS_ROOM_VIEW_ID]: {
    id: ONDOL_LAURELS_ROOM_VIEW_ID,
    label: 'Ondol Laurels Room',
    ariaLabel: 'Ondol Laurels Room interior map',
    supportsPalette: false,
    fixedVariant: 'day',
    sceneUrl: `./assets/scenes/ondol-laurels-room/slice.json?v=${CACHE_KEY}`,
    renderer: null
  },
  [LAUBER_MANSION_VIEW_ID]: {
    id: LAUBER_MANSION_VIEW_ID,
    label: 'Lauber Mansion',
    ariaLabel: 'Lauber Mansion interior map',
    supportsPalette: false,
    fixedVariant: 'fixed',
    sceneUrl: `./assets/scenes/lauber-mansion/slice.json?v=${CACHE_KEY}`,
    renderer: null
  },
  [DOINA_GET_BACK_LADY_ROOM_VIEW_ID]: {
    id: DOINA_GET_BACK_LADY_ROOM_VIEW_ID,
    label: 'Doina GET BACK! Lady Room',
    ariaLabel: 'Doina GET BACK! Lady interior map',
    supportsPalette: false,
    fixedVariant: 'day',
    sceneUrl: `./assets/scenes/doina-get-back-lady-room/slice.json?v=${CACHE_KEY}`,
    renderer: null
  },
  [DOINA_LAURELS_ROOM_VIEW_ID]: {
    id: DOINA_LAURELS_ROOM_VIEW_ID,
    label: 'Doina Laurels Room',
    ariaLabel: 'Doina Laurels Room interior map',
    supportsPalette: false,
    fixedVariant: 'day',
    sceneUrl: `./assets/scenes/doina-laurels-room/slice.json?v=${CACHE_KEY}`,
    renderer: null
  },
  [YOMI_EMPTY_ROOM_VIEW_ID]: {
    id: YOMI_EMPTY_ROOM_VIEW_ID,
    label: 'Yomi Empty Room',
    ariaLabel: 'Yomi Empty Room interior map',
    supportsPalette: false,
    fixedVariant: 'day',
    sceneUrl: `./assets/scenes/yomi-empty-room/slice.json?v=${CACHE_KEY}`,
    renderer: null
  },
  [YOMI_GIRLFRIEND_ROOM_VIEW_ID]: {
    id: YOMI_GIRLFRIEND_ROOM_VIEW_ID,
    label: 'Yomi Girlfriend Room',
    ariaLabel: 'Yomi Girlfriend Room interior map',
    supportsPalette: false,
    fixedVariant: 'day',
    sceneUrl: `./assets/scenes/yomi-girlfriend-room/slice.json?v=${CACHE_KEY}`,
    renderer: null
  },
  [LARUBA_MANSION_VIEW_ID]: {
    id: LARUBA_MANSION_VIEW_ID,
    label: 'Laruba Mansion',
    ariaLabel: 'Laruba Mansion interior map',
    supportsPalette: false,
    fixedVariant: 'fixed',
    sceneUrl: `./assets/scenes/laruba-mansion/slice.json?v=${CACHE_KEY}`,
    renderer: null
  },
  [BODLEY_MANSION_VIEW_ID]: {
    id: BODLEY_MANSION_VIEW_ID,
    label: 'Bodley Mansion',
    ariaLabel: 'Bodley Mansion interior map',
    supportsPalette: false,
    fixedVariant: 'fixed',
    sceneUrl: `./assets/scenes/bodley-mansion/slice.json?v=${CACHE_KEY}`,
    renderer: null
  },
  [CASTLEVANIA_VIEW_ID]: {
    id: CASTLEVANIA_VIEW_ID,
    label: 'Castlevania',
    ariaLabel: 'Castlevania interior map',
    supportsPalette: false,
    fixedVariant: 'fixed',
    sceneUrl: `./assets/scenes/castlevania/slice.json?v=${CACHE_KEY}`,
    renderer: null
  }
};

const MIN_CAMERA_SCALE = 0.03;
const PAN_INERTIA_DECAY_PER_SECOND = 5.2;
const PAN_INERTIA_MAX_SPEED = 7.5;
const PAN_INERTIA_STOP_SPEED = 0.018;
const PAN_RELEASE_MIN_SCREEN_SPEED = 0.42;
const PAN_RELEASE_HISTORY_MS = 100;
const PAN_RELEASE_STALE_MS = 180;
const FLOATING_VEROS_SEGMENT_ID = 'town-of-veros';
const FLOATING_VEROS_LEFT_SEGMENT_ID = 'veros-woods-part-2';
const FLOATING_VEROS_RIGHT_SEGMENT_ID = 'dabis-path-part-1';
const FLOATING_VEROS_SIDE_HYSTERESIS = 96;
const FLOATING_VEROS_EASE_MS = 180;
const FLOATING_VEROS_FRAME_MS = 48;
const FLOATING_VEROS_SNAP_EPSILON = 0.25;

const dom = {
  mapCanvas: document.querySelector('#map-canvas'),
  sceneCanvas: document.querySelector('#scene-canvas'),
  overlay: document.querySelector('#overlay-layer'),
  viewTransition: document.querySelector('#view-transition'),
  loadingOverlay: document.querySelector('#loading-overlay'),
  loadingMeter: document.querySelector('#loading-meter'),
  loadingMeterFill: document.querySelector('#loading-meter-fill'),
  status: document.querySelector('#status'),
  guideCard: document.querySelector('#guide-card'),
  dialogBox: document.querySelector('#dialog-box'),
  dialogFrameCanvas: document.querySelector('#dialog-frame-canvas'),
  dialogCloseFrameCanvas: document.querySelector('#dialog-close-frame-canvas'),
  dialogText: document.querySelector('#dialog-text'),
  dialogClose: document.querySelector('#dialog-close'),
  guideInspector: document.querySelector('#guide-inspector'),
  guideInspectorTitle: document.querySelector('#guide-inspector-title'),
  guideInspectorSummary: document.querySelector('#guide-inspector-summary'),
  guideInspectorList: document.querySelector('#guide-inspector-list'),
  guideInspectorClose: document.querySelector('#guide-inspector-close'),
  audioToggle: document.querySelector('#audio-toggle'),
  audioToggleIcon: document.querySelector('#audio-toggle-icon'),
  paletteToggle: document.querySelector('#palette-toggle'),
  paletteToggleIcon: document.querySelector('#palette-toggle-icon'),
  resetToggle: document.querySelector('#reset-toggle'),
  resetToggleIcon: document.querySelector('#reset-toggle-icon'),
  optionsToggle: document.querySelector('#options-toggle'),
  optionsToggleIcon: document.querySelector('#options-toggle-icon'),
  optionsPanel: document.querySelector('#options-panel'),
  labelsToggle: document.querySelector('#toggle-labels'),
  sectionOutlinesToggle: document.querySelector('#toggle-section-outlines'),
  highlightDoorsToggle: document.querySelector('#toggle-highlight-doors'),
  showCharactersToggle: document.querySelector('#toggle-show-characters'),
  showSecretsToggle: document.querySelector('#toggle-show-secrets'),
  highlightCharactersToggle: document.querySelector('#toggle-highlight-characters'),
  highlightMapObjectsToggle: document.querySelector('#toggle-highlight-map-objects'),
  highlightSecretsToggle: document.querySelector('#toggle-highlight-secrets')
};

for (const [name, element] of Object.entries(dom)) {
  if (!element) {
    throw new Error(`Missing guide DOM element: ${name}`);
  }
}

function setStatus(message) {
  dom.status.textContent = message;
}

function setLoadingState({
  active = true,
  title = 'LOADING',
  label = 'STARTING',
  progress = 0,
  error = false
} = {}) {
  const clampedProgress = clamp(progress, 0, 1);
  const percent = Math.round(clampedProgress * 100);
  const wasActive = dom.loadingOverlay.classList.contains('is-active');
  const resetsFromHidden = active && !wasActive && clampedProgress <= 0.001;
  if (resetsFromHidden) {
    dom.loadingMeterFill.style.transition = 'none';
  }
  dom.loadingOverlay.classList.toggle('is-active', active);
  dom.loadingOverlay.classList.toggle('is-error', Boolean(error));
  dom.loadingOverlay.setAttribute('aria-label', error ? `${title}: ${label}` : `Loading Castlevania II guide, ${percent}%`);
  dom.loadingMeter.setAttribute('aria-valuenow', String(percent));
  dom.loadingMeter.setAttribute('aria-valuetext', label ? `${percent}% ${label}` : `${percent}%`);
  dom.loadingMeterFill.style.transform = `scaleX(${clampedProgress.toFixed(4)})`;
  if (resetsFromHidden) {
    dom.loadingMeterFill.getBoundingClientRect();
    requestAnimationFrame(() => {
      dom.loadingMeterFill.style.transition = '';
    });
  }
}

function hideLoadingState() {
  setLoadingState({ active: false, progress: 1, label: 'READY' });
}

function scaledProgressReporter(start, end, labelPrefix = '') {
  return ({ progress = 0, label = '' } = {}) => {
    const scaled = start + clamp(progress, 0, 1) * (end - start);
    const stageLabel = [labelPrefix, label].filter(Boolean).join(' - ');
    setLoadingState({ active: true, label: stageLabel || 'LOADING', progress: scaled });
  };
}

function nextPaint() {
  return new Promise((resolve) => {
    let resolved = false;
    const finish = () => {
      if (resolved) return;
      resolved = true;
      resolve();
    };
    requestAnimationFrame(finish);
    setTimeout(finish, 50);
  });
}

function assertGl(value, label) {
  if (!value) {
    throw new Error(`Unable to create ${label}.`);
  }
  return value;
}

function rangeView(data, range) {
  return new Uint8Array(data, range.offset, range.length);
}

function drawChromeIcon(canvas, rows) {
  if (!canvas || !rows) return;
  if (canvas.width !== CHROME_ICON_SIZE || canvas.height !== CHROME_ICON_SIZE) {
    canvas.width = CHROME_ICON_SIZE;
    canvas.height = CHROME_ICON_SIZE;
  }

  const context = canvas.getContext('2d', { alpha: true });
  if (!context) return;
  context.imageSmoothingEnabled = false;
  context.clearRect(0, 0, CHROME_ICON_SIZE, CHROME_ICON_SIZE);

  for (let y = 0; y < CHROME_ICON_SIZE; y += 1) {
    const row = rows[y] || '';
    for (let x = 0; x < CHROME_ICON_SIZE; x += 1) {
      const color = CHROME_ICON_PALETTE[row[x]];
      if (!color) {
        continue;
      }
      context.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3] / 255})`;
      context.fillRect(x, y, 1, 1);
    }
  }
}

function compileShader(gl, type, source) {
  const shader = assertGl(gl.createShader(type), 'shader');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) || 'unknown shader error';
    gl.deleteShader(shader);
    throw new Error(log);
  }
  return shader;
}

function createProgram(gl) {
  const vertexSource = `#version 300 es
in vec2 a_position;
in vec2 a_uv;
uniform vec2 u_resolution;
uniform vec3 u_camera;
uniform vec2 u_segment_offset;
out vec2 v_uv;

void main() {
  vec2 world_position = a_position + u_segment_offset;
  vec2 screen = (world_position - u_camera.xy) * u_camera.z + (u_resolution * 0.5);
  vec2 clip = (screen / u_resolution) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  v_uv = a_uv;
}
`;

  const fragmentSource = `#version 300 es
precision highp float;

uniform sampler2D u_tilemap;
uniform sampler2D u_chr;
uniform sampler2D u_palette;
uniform vec2 u_segment_size;
in vec2 v_uv;
out vec4 out_color;

void main() {
  ivec2 pixel = ivec2(floor(v_uv * u_segment_size));
  ivec2 tile_coord = pixel / 8;
  ivec2 in_tile = pixel - (tile_coord * 8);
  vec4 tile_sample = texelFetch(u_tilemap, tile_coord, 0);
  int tile_index = int(round(tile_sample.r * 255.0)) + int(round(tile_sample.b * 255.0)) * 256;
  int palette_id = int(round(tile_sample.g * 255.0));
  int atlas_x = (tile_index % 16) * 8 + in_tile.x;
  int atlas_y = (tile_index / 16) * 8 + in_tile.y;
  int color_id = int(round(texelFetch(u_chr, ivec2(atlas_x, atlas_y), 0).r * 255.0));
  int palette_index = color_id == 0 ? 0 : palette_id * 4 + color_id;
  out_color = texelFetch(u_palette, ivec2(palette_index, 0), 0);
}
`;

  const program = assertGl(gl.createProgram(), 'program');
  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program) || 'unknown program link error';
    gl.deleteProgram(program);
    throw new Error(log);
  }
  return program;
}

function createSpriteProgram(gl) {
  const vertexSource = `#version 300 es
in vec2 a_position;
in vec2 a_uv;
in float a_palette;
uniform vec2 u_resolution;
uniform vec3 u_camera;
out vec2 v_uv;
out float v_palette;

void main() {
  vec2 screen = (a_position - u_camera.xy) * u_camera.z + (u_resolution * 0.5);
  vec2 clip = (screen / u_resolution) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  v_uv = a_uv;
  v_palette = a_palette;
}
`;

  const fragmentSource = `#version 300 es
precision highp float;

uniform sampler2D u_chr;
uniform sampler2D u_palette;
in vec2 v_uv;
in float v_palette;
out vec4 out_color;

void main() {
  int color_id = int(round(texture(u_chr, v_uv).r * 255.0));
  if (color_id == 0) {
    discard;
  }
  int palette_index = int(round(v_palette)) * 4 + color_id;
  out_color = texelFetch(u_palette, ivec2(palette_index, 0), 0);
}
`;

  const program = assertGl(gl.createProgram(), 'sprite program');
  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program) || 'unknown sprite program link error';
    gl.deleteProgram(program);
    throw new Error(log);
  }
  return program;
}

function createProjectionProgram(gl) {
  const vertexSource = `#version 300 es
in vec2 a_position;
uniform vec2 u_resolution;
uniform vec3 u_camera;
uniform vec4 u_rect;
out vec2 v_world;

void main() {
  v_world = u_rect.xy + a_position * u_rect.zw;
  vec2 screen = (v_world - u_camera.xy) * u_camera.z + (u_resolution * 0.5);
  vec2 clip = (screen / u_resolution) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}
`;

  const fragmentSource = `#version 300 es
precision highp float;

in vec2 v_world;
out vec4 out_color;

void main() {
  float diagonal = mod(v_world.x + v_world.y, 64.0);
  float stripe = step(diagonal, 32.0);
  vec3 base = vec3(0.032, 0.032, 0.030);
  vec3 mark = vec3(0.230, 0.230, 0.214);
  out_color = vec4(mix(base, mark, stripe * 0.42), 1.0);
}
`;

  const program = assertGl(gl.createProgram(), 'projection program');
  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program) || 'unknown projection program link error';
    gl.deleteProgram(program);
    throw new Error(log);
  }
  return program;
}

function createTexture(gl, width, height, internalFormat, format, data) {
  const texture = assertGl(gl.createTexture(), 'texture');
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format, gl.UNSIGNED_BYTE, data);
  return texture;
}

function paletteTexture(gl, paletteBytes) {
  const rgba = new Uint8Array(16 * 4);
  for (let index = 0; index < 16; index += 1) {
    const [red, green, blue] = NES_PALETTE[paletteBytes[index] & 0x3f] || [0, 0, 0];
    rgba[index * 4] = red;
    rgba[index * 4 + 1] = green;
    rgba[index * 4 + 2] = blue;
    rgba[index * 4 + 3] = 255;
  }
  return createTexture(gl, 16, 1, gl.RGBA8, gl.RGBA, rgba);
}

function createVertexBuffer(gl, segment) {
  const { x, y, width, height } = segment.position;
  const vertices = new Float32Array([
    x, y, 0, 0,
    x + width, y, 1, 0,
    x, y + height, 0, 1,
    x, y + height, 0, 1,
    x + width, y, 1, 0,
    x + width, y + height, 1, 1
  ]);
  const buffer = assertGl(gl.createBuffer(), 'vertex buffer');
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  return buffer;
}

function createUnitQuadBuffer(gl) {
  const vertices = new Float32Array([
    0, 0,
    1, 0,
    0, 1,
    0, 1,
    1, 0,
    1, 1
  ]);
  const buffer = assertGl(gl.createBuffer(), 'unit quad buffer');
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  return buffer;
}

function resizeCanvas(gl, canvas) {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
  const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
  }
  return dpr;
}

function loadDataUrl(manifestUrl, dataFile) {
  const manifest = new URL(manifestUrl, window.location.href);
  const dataUrl = new URL(dataFile, manifest);
  dataUrl.search = manifest.search;
  return dataUrl.toString();
}

async function fetchArrayBufferWithProgress(url, {
  cache = 'no-store',
  onProgress = null,
  start = 0,
  end = 1,
  label = 'Loading data'
} = {}) {
  const response = await fetch(url, { cache });
  if (!response.ok) {
    throw new Error(`Unable to load ${url}`);
  }

  const contentLength = Number.parseInt(response.headers.get('content-length') || '', 10);
  if (!response.body || !Number.isFinite(contentLength) || contentLength <= 0) {
    const buffer = await response.arrayBuffer();
    onProgress?.({ progress: end, label });
    return buffer;
  }

  const reader = response.body.getReader();
  const chunks = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.byteLength;
    const loadedProgress = received / contentLength;
    onProgress?.({
      progress: start + clamp(loadedProgress, 0, 1) * (end - start),
      label
    });
  }

  const bytes = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  onProgress?.({ progress: end, label });
  return bytes.buffer;
}

async function fetchJsonWithProgress(url, options = {}) {
  const buffer = await fetchArrayBufferWithProgress(url, options);
  return JSON.parse(new TextDecoder().decode(buffer));
}

function numericByte(value) {
  if (Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.toLowerCase().startsWith('0x')) {
    return Number.parseInt(value.slice(2), 16);
  }
  return Number.parseInt(value, 10);
}

function paletteBytesFromHex(bytes = MENU_ITEM_ICON_PALETTE) {
  return bytes.map((value) => numericByte(value) & 0x3f);
}

function pushSpriteQuad(vertices, x, y, tileIndex, paletteIndex, flipHorizontal, flipVertical, chrSet) {
  const atlas = chrSet.decodedAtlas;
  const tileSize = 8;
  const tileX = (tileIndex % atlas.tilesPerRow) * tileSize;
  const tileY = Math.floor(tileIndex / atlas.tilesPerRow) * tileSize;
  const left = tileX / atlas.width;
  const right = (tileX + tileSize) / atlas.width;
  const top = tileY / atlas.height;
  const bottom = (tileY + tileSize) / atlas.height;
  const u0 = flipHorizontal ? right : left;
  const u1 = flipHorizontal ? left : right;
  const v0 = flipVertical ? bottom : top;
  const v1 = flipVertical ? top : bottom;

  vertices.push(
    x, y, u0, v0, paletteIndex,
    x + tileSize, y, u1, v0, paletteIndex,
    x, y + tileSize, u0, v1, paletteIndex,
    x, y + tileSize, u0, v1, paletteIndex,
    x + tileSize, y, u1, v0, paletteIndex,
    x + tileSize, y + tileSize, u1, v1, paletteIndex
  );
}

function pushSprite(vertices, actor, actorClass, frame, chrSet, displayOffset = { x: 0, y: 0 }) {
  const spriteHeight = actorClass.largeSprites ? 16 : 8;
  const staticOffset = frame.staticPreviewOffset || { x: 0, y: 0 };
  const sprites = frame.sprites || [];
  // NES sprite-overlap priority favors lower OAM indexes, so draw later entries first.
  for (let spriteIndex = sprites.length - 1; spriteIndex >= 0; spriteIndex -= 1) {
    const sprite = sprites[spriteIndex];
    const tile = numericByte(sprite.tile);
    const palette = Number.isFinite(sprite.palette) ? sprite.palette : numericByte(sprite.attr) & 0x03;
    const flipHorizontal = actor.flipHorizontal ? !sprite.flipHorizontal : sprite.flipHorizontal;
    const xOffset = actor.flipHorizontal ? -sprite.xOffset - 8 : sprite.xOffset;
    const x = actor.worldX + displayOffset.x + staticOffset.x + xOffset;
    const y = actor.worldY + displayOffset.y + staticOffset.y + sprite.yOffset;

    if (!actorClass.largeSprites) {
      pushSpriteQuad(
        vertices,
        x,
        y,
        tile,
        palette,
        flipHorizontal,
        sprite.flipVertical,
        chrSet
      );
      continue;
    }

    const tableOffset = (tile & 0x01) ? 256 : 0;
    const baseTile = tableOffset + (tile & 0xfe);
    const topTile = sprite.flipVertical ? baseTile + 1 : baseTile;
    const bottomTile = sprite.flipVertical ? baseTile : baseTile + 1;
    pushSpriteQuad(
      vertices,
      x,
      y,
      topTile,
      palette,
      flipHorizontal,
      sprite.flipVertical,
      chrSet
    );
    pushSpriteQuad(
      vertices,
      x,
      y + spriteHeight / 2,
      bottomTile,
      palette,
      flipHorizontal,
      sprite.flipVertical,
      chrSet
    );
  }
}

function actorClassStaticPreviewFrame(actorClass) {
  const staticPreview = actorClass.staticPreview;
  if (!staticPreview || staticPreview.mode !== 'single-selector') {
    return null;
  }

  if (Number.isInteger(staticPreview.frameIndex)) {
    return actorClass.frames[staticPreview.frameIndex] || null;
  }

  if (staticPreview.selector != null) {
    const selector = numericByte(staticPreview.selector);
    return actorClass.frames.find((frame) => numericByte(frame.selector) === selector) || null;
  }

  return null;
}

class ActorRenderer {
  constructor(gl) {
    this.gl = gl;
    this.program = createSpriteProgram(gl);
    this.locations = {
      position: gl.getAttribLocation(this.program, 'a_position'),
      uv: gl.getAttribLocation(this.program, 'a_uv'),
      palette: gl.getAttribLocation(this.program, 'a_palette'),
      resolution: assertGl(gl.getUniformLocation(this.program, 'u_resolution'), 'sprite u_resolution'),
      camera: assertGl(gl.getUniformLocation(this.program, 'u_camera'), 'sprite u_camera'),
      chr: assertGl(gl.getUniformLocation(this.program, 'u_chr'), 'sprite u_chr'),
      paletteTexture: assertGl(gl.getUniformLocation(this.program, 'u_palette'), 'sprite u_palette')
    };
    this.buffer = assertGl(gl.createBuffer(), 'sprite vertex buffer');
    this.manifest = null;
    this.chrTextures = new Map();
    this.spritePaletteTextures = new Map();
    this.actorClassById = new Map();
    this.chrSetById = new Map();
  }

  prepare(manifest, chrTextures, spritePaletteTextures) {
    this.manifest = manifest;
    this.chrTextures = chrTextures;
    this.spritePaletteTextures = spritePaletteTextures;
    this.actorClassById = new Map((manifest.actorClasses || []).map((actorClass) => [actorClass.id, actorClass]));
    this.chrSetById = new Map((manifest.chrSets || []).map((chrSet) => [chrSet.id, chrSet]));
  }

  render(camera, variant, shouldRenderActor, displayOffsetForSegment = () => ({ x: 0, y: 0 })) {
    const actors = this.manifest?.actors || [];
    if (actors.length === 0) {
      return;
    }

    const batches = new Map();
    const now = performance.now();
    for (const actor of actors) {
      if (!actor.classId || !shouldRenderActor(actor)) {
        continue;
      }
      const actorClass = this.actorClassById.get(actor.classId);
      if (!actorClass || actorClass.frames.length === 0) {
        continue;
      }
      const paletteId = actor.paletteByVariant?.[variant]
        || actor.paletteByVariant?.day
        || actor.paletteByVariant?.night;
      const paletteTexture = this.spritePaletteTextures.get(paletteId);
      const chrTexture = this.chrTextures.get(actorClass.chrSet);
      const chrSet = this.chrSetById.get(actorClass.chrSet);
      if (!paletteTexture || !chrTexture || !chrSet) {
        continue;
      }

      const frameDurationMs = Number.isFinite(actorClass.frameDurationMs) && actorClass.frameDurationMs > 0
        ? actorClass.frameDurationMs
        : 360;
      const blink = actorClass.blink;
      if (blink) {
        const visibleFrames = Number.isFinite(blink.visibleFrames) && blink.visibleFrames > 0
          ? Math.floor(blink.visibleFrames)
          : 1;
        const hiddenFrames = Number.isFinite(blink.hiddenFrames) && blink.hiddenFrames > 0
          ? Math.floor(blink.hiddenFrames)
          : 1;
        const blinkCycleFrames = visibleFrames + hiddenFrames;
        const blinkFrame = Math.floor(now / frameDurationMs) % blinkCycleFrames;
        if (blinkFrame >= visibleFrames) {
          continue;
        }
      }

      const key = `${actorClass.chrSet}\0${paletteId}`;
      if (!batches.has(key)) {
        batches.set(key, {
          vertices: [],
          chrTexture,
          paletteTexture
        });
      }
      const frameIndex = Math.floor(now / frameDurationMs);
      const frame = actorClassStaticPreviewFrame(actorClass)
        || actorClass.frames[frameIndex % actorClass.frames.length];
      pushSprite(
        batches.get(key).vertices,
        actor,
        actorClass,
        frame,
        chrSet,
        displayOffsetForSegment(actor.segmentId)
      );
    }

    if (batches.size === 0) {
      return;
    }

    const gl = this.gl;
    gl.useProgram(this.program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform2f(this.locations.resolution, gl.canvas.width, gl.canvas.height);
    gl.uniform3f(this.locations.camera, camera.x, camera.y, camera.scale);
    gl.uniform1i(this.locations.chr, 0);
    gl.uniform1i(this.locations.paletteTexture, 1);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.enableVertexAttribArray(this.locations.position);
    gl.vertexAttribPointer(this.locations.position, 2, gl.FLOAT, false, 20, 0);
    gl.enableVertexAttribArray(this.locations.uv);
    gl.vertexAttribPointer(this.locations.uv, 2, gl.FLOAT, false, 20, 8);
    gl.enableVertexAttribArray(this.locations.palette);
    gl.vertexAttribPointer(this.locations.palette, 1, gl.FLOAT, false, 20, 16);

    for (const batch of batches.values()) {
      const data = new Float32Array(batch.vertices);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, batch.chrTexture);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, batch.paletteTexture);
      gl.drawArrays(gl.TRIANGLES, 0, data.length / 5);
    }
  }
}

class SecretFeatureRenderer {
  constructor(gl) {
    this.gl = gl;
    this.program = createSpriteProgram(gl);
    this.locations = {
      position: gl.getAttribLocation(this.program, 'a_position'),
      uv: gl.getAttribLocation(this.program, 'a_uv'),
      palette: gl.getAttribLocation(this.program, 'a_palette'),
      resolution: assertGl(gl.getUniformLocation(this.program, 'u_resolution'), 'secret feature u_resolution'),
      camera: assertGl(gl.getUniformLocation(this.program, 'u_camera'), 'secret feature u_camera'),
      chr: assertGl(gl.getUniformLocation(this.program, 'u_chr'), 'secret feature u_chr'),
      paletteTexture: assertGl(gl.getUniformLocation(this.program, 'u_palette'), 'secret feature u_palette')
    };
    this.buffer = assertGl(gl.createBuffer(), 'secret feature vertex buffer');
    this.manifest = null;
    this.chrTextures = new Map();
    this.spritePaletteTextures = new Map();
    this.chrSetById = new Map();
  }

  prepare(manifest, chrTextures, spritePaletteTextures) {
    this.manifest = manifest;
    this.chrTextures = chrTextures;
    this.spritePaletteTextures = spritePaletteTextures;
    this.chrSetById = new Map((manifest.chrSets || []).map((chrSet) => [chrSet.id, chrSet]));
  }

  render(camera, variant, shouldRenderFeature, displayOffsetForSegment = () => ({ x: 0, y: 0 })) {
    const features = this.manifest?.secretFeatures || [];
    if (features.length === 0) {
      return;
    }

    const batches = new Map();
    const now = performance.now();
    for (const feature of features) {
      if (!shouldRenderFeature(feature)) {
        continue;
      }
      const render = feature.render;
      if (!render?.frames?.length) {
        continue;
      }
      const paletteId = render.paletteByVariant?.[variant]
        || render.paletteByVariant?.day
        || render.paletteByVariant?.night
        || render.paletteByVariant?.fixed;
      const paletteTexture = this.spritePaletteTextures.get(paletteId);
      const chrTexture = this.chrTextures.get(render.chrSet);
      const chrSet = this.chrSetById.get(render.chrSet);
      if (!paletteTexture || !chrTexture || !chrSet) {
        continue;
      }

      const key = `${render.chrSet}\0${paletteId}`;
      if (!batches.has(key)) {
        batches.set(key, {
          vertices: [],
          chrTexture,
          paletteTexture
        });
      }
      const frameDurationMs = Number.isFinite(render.frameDurationMs) && render.frameDurationMs > 0
        ? render.frameDurationMs
        : 360;
      const blink = render.blink;
      if (blink) {
        const visibleFrames = Number.isFinite(blink.visibleFrames) && blink.visibleFrames > 0
          ? Math.floor(blink.visibleFrames)
          : 1;
        const hiddenFrames = Number.isFinite(blink.hiddenFrames) && blink.hiddenFrames > 0
          ? Math.floor(blink.hiddenFrames)
          : 1;
        const blinkCycleFrames = visibleFrames + hiddenFrames;
        const blinkFrame = Math.floor(now / frameDurationMs) % blinkCycleFrames;
        if (blinkFrame >= visibleFrames) {
          continue;
        }
      }
      const position = secretFeatureWorldPosition(feature, now);
      if (position.hidden) {
        continue;
      }
      const activeAnimation = activeSecretAnimation(feature, now);
      let frameIndex = activeAnimation
        ? Math.floor((now - activeAnimation.startedAt) / frameDurationMs)
        : Math.floor(now / frameDurationMs);
      const traceAnimation = feature.animation?.type === 'trace-path' ? feature.animation : null;
      if (
        traceAnimation
        && Number.isFinite(position.elapsedFrameExact)
        && Number.isFinite(traceAnimation.frameIntervalFrames)
        && traceAnimation.frameIntervalFrames > 0
      ) {
        const activeFrameStart = Number.isFinite(traceAnimation.activeFrameStart)
          ? traceAnimation.activeFrameStart
          : 0;
        frameIndex = position.elapsedFrameExact < activeFrameStart
          ? 0
          : Math.floor((position.elapsedFrameExact - activeFrameStart) / traceAnimation.frameIntervalFrames);
      }
      const frame = render.frames[frameIndex % render.frames.length];
      pushSprite(
        batches.get(key).vertices,
        position,
        render,
        frame,
        chrSet,
        displayOffsetForSegment(position.segmentId || feature.segmentId)
      );
    }

    if (batches.size === 0) {
      return;
    }

    const gl = this.gl;
    gl.useProgram(this.program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform2f(this.locations.resolution, gl.canvas.width, gl.canvas.height);
    gl.uniform3f(this.locations.camera, camera.x, camera.y, camera.scale);
    gl.uniform1i(this.locations.chr, 0);
    gl.uniform1i(this.locations.paletteTexture, 1);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.enableVertexAttribArray(this.locations.position);
    gl.vertexAttribPointer(this.locations.position, 2, gl.FLOAT, false, 20, 0);
    gl.enableVertexAttribArray(this.locations.uv);
    gl.vertexAttribPointer(this.locations.uv, 2, gl.FLOAT, false, 20, 8);
    gl.enableVertexAttribArray(this.locations.palette);
    gl.vertexAttribPointer(this.locations.palette, 1, gl.FLOAT, false, 20, 16);

    for (const batch of batches.values()) {
      const data = new Float32Array(batch.vertices);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, batch.chrTexture);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, batch.paletteTexture);
      gl.drawArrays(gl.TRIANGLES, 0, data.length / 5);
    }
  }
}

class TileRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = assertGl(canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false
    }), 'WebGL2 context');
    this.program = createProgram(this.gl);
    this.projectionProgram = createProjectionProgram(this.gl);
    this.locations = {
      position: this.gl.getAttribLocation(this.program, 'a_position'),
      uv: this.gl.getAttribLocation(this.program, 'a_uv'),
      resolution: assertGl(this.gl.getUniformLocation(this.program, 'u_resolution'), 'u_resolution'),
      camera: assertGl(this.gl.getUniformLocation(this.program, 'u_camera'), 'u_camera'),
      segmentOffset: assertGl(this.gl.getUniformLocation(this.program, 'u_segment_offset'), 'u_segment_offset'),
      segmentSize: assertGl(this.gl.getUniformLocation(this.program, 'u_segment_size'), 'u_segment_size'),
      tilemap: assertGl(this.gl.getUniformLocation(this.program, 'u_tilemap'), 'u_tilemap'),
      chr: assertGl(this.gl.getUniformLocation(this.program, 'u_chr'), 'u_chr'),
      palette: assertGl(this.gl.getUniformLocation(this.program, 'u_palette'), 'u_palette')
    };
    this.projectionLocations = {
      position: this.gl.getAttribLocation(this.projectionProgram, 'a_position'),
      resolution: assertGl(this.gl.getUniformLocation(this.projectionProgram, 'u_resolution'), 'projection u_resolution'),
      camera: assertGl(this.gl.getUniformLocation(this.projectionProgram, 'u_camera'), 'projection u_camera'),
      rect: assertGl(this.gl.getUniformLocation(this.projectionProgram, 'u_rect'), 'projection u_rect')
    };
    this.projectionVertexBuffer = createUnitQuadBuffer(this.gl);
    this.manifest = null;
    this.segments = [];
    this.segmentById = new Map();
    this.segmentDisplayOffsets = new Map();
    this.projectionRects = [];
    this.actorClassById = new Map();
    this.chrTextures = new Map();
    this.decodedChrAtlases = new Map();
    this.spritePaletteTextures = new Map();
    this.actorRenderer = new ActorRenderer(this.gl);
    this.secretFeatureRenderer = new SecretFeatureRenderer(this.gl);
    this.camera = { x: 0, y: 0, scale: 1 };
  }

  async load(manifestUrl, { onProgress = null } = {}) {
    onProgress?.({ progress: 0.02, label: 'Loading manifest' });
    const manifest = await fetchJsonWithProgress(manifestUrl, {
      cache: 'no-store',
      onProgress,
      start: 0.02,
      end: 0.14,
      label: 'Loading manifest'
    });
    const data = await fetchArrayBufferWithProgress(loadDataUrl(manifestUrl, manifest.dataFile), {
      cache: 'no-store',
      onProgress,
      start: 0.16,
      end: 0.64,
      label: 'Loading map data'
    });
    await this.prepare(manifest, data, {
      onProgress: ({ progress, label }) => {
        onProgress?.({
          progress: 0.66 + clamp(progress, 0, 1) * 0.32,
          label
        });
      }
    });
    onProgress?.({ progress: 1, label: 'Ready' });
    return manifest;
  }

  async prepare(manifest, data, { onProgress = null } = {}) {
    const gl = this.gl;
    const chrTextures = new Map();
    const chrSetById = new Map((manifest.chrSets || []).map((chrSet) => [chrSet.id, chrSet]));
    const tileSetById = new Map((manifest.tileSets || []).map((tileSet) => [tileSet.id, tileSet]));
    const paletteById = new Map((manifest.palettes || []).map((palette) => [palette.id, palette]));
    const spritePaletteTextures = new Map();
    this.decodedChrAtlases = new Map();
    this.segmentById = new Map();
    this.segmentDisplayOffsets = new Map();
    this.projectionRects = [];
    const workTotal = Math.max(
      1,
      (manifest.chrSets || []).length
        + (manifest.spritePalettes || []).length
        + (manifest.segments || []).length
    );
    let workDone = 0;
    const reportPreparedWork = async (label) => {
      workDone += 1;
      onProgress?.({ progress: workDone / workTotal, label });
      if (workDone % 4 === 0 || workDone === workTotal) {
        await nextPaint();
      }
    };

    for (const chrSet of manifest.chrSets || []) {
      const decoded = decode_chr_atlas(rangeView(data, chrSet.data));
      this.decodedChrAtlases.set(chrSet.id, {
        width: chrSet.decodedAtlas.width,
        height: chrSet.decodedAtlas.height,
        tilesPerRow: chrSet.decodedAtlas.tilesPerRow,
        pixels: decoded
      });
      chrTextures.set(chrSet.id, createTexture(
        gl,
        chrSet.decodedAtlas.width,
        chrSet.decodedAtlas.height,
        gl.R8,
        gl.RED,
        decoded
      ));
      await reportPreparedWork('Decoding CHR');
    }

    for (const palette of manifest.spritePalettes || []) {
      spritePaletteTextures.set(palette.id, paletteTexture(gl, rangeView(data, palette.data)));
      await reportPreparedWork('Preparing sprite palettes');
    }

    this.manifest = manifest;
    this.chrTextures = chrTextures;
    this.spritePaletteTextures = spritePaletteTextures;
    this.actorClassById = new Map((manifest.actorClasses || []).map((actorClass) => [actorClass.id, actorClass]));
    this.segments = [];
    for (const record of manifest.segments || []) {
      const tileSet = tileSetById.get(record.tileSet);
      const chrSet = chrSetById.get(record.chrSet);
      if (!tileSet || !chrSet) {
        throw new Error(`Segment ${record.id} has incomplete texture references.`);
      }
      const tilemap = expand_segment_tilemap(
        rangeView(data, record.layoutBlocks),
        rangeView(data, tileSet.metatileTiles),
        rangeView(data, tileSet.metatileAttributes),
        record.blockWidth,
        record.blockHeight
      );
      const paletteTextures = {};
      for (const [variant, paletteId] of Object.entries(record.palettes || {})) {
        const palette = paletteById.get(paletteId);
        if (!palette) {
          throw new Error(`Segment ${record.id} is missing palette ${paletteId}.`);
        }
        paletteTextures[variant] = paletteTexture(gl, rangeView(data, palette.data));
      }
      const renderSegment = {
        record,
        vertexBuffer: createVertexBuffer(gl, record),
        tilemapTexture: createTexture(gl, record.tileWidth, record.tileHeight, gl.RGBA8, gl.RGBA, tilemap),
        chrTexture: assertGl(chrTextures.get(chrSet.id) || null, `CHR texture ${chrSet.id}`),
        paletteTextures
      };
      this.segmentById.set(record.id, record);
      this.segments.push(renderSegment);
      await reportPreparedWork('Building map tiles');
    }
    this.actorRenderer.prepare(manifest, chrTextures, spritePaletteTextures);
    this.secretFeatureRenderer.prepare(manifest, chrTextures, spritePaletteTextures);
  }

  resetCamera(padding = 0.88) {
    if (!this.manifest) return;
    resizeCanvas(this.gl, this.canvas);
    const world = this.manifest.world || {};
    const worldX = Number.isFinite(world.x) ? world.x : 0;
    const worldY = Number.isFinite(world.y) ? world.y : 0;
    const worldWidth = Math.max(1, world.width || 1);
    const worldHeight = Math.max(1, world.height || 1);
    this.camera.x = worldX + worldWidth / 2;
    this.camera.y = worldY + worldHeight / 2;
    this.camera.scale = Math.min(
      this.canvas.width / worldWidth,
      this.canvas.height / worldHeight
    ) * padding;
    this.camera.scale = Math.max(MIN_CAMERA_SCALE, this.camera.scale);
  }

  zoomAt(screenX, screenY, nextScale) {
    const beforeX = this.camera.x + (screenX - this.canvas.width / 2) / this.camera.scale;
    const beforeY = this.camera.y + (screenY - this.canvas.height / 2) / this.camera.scale;
    this.camera.scale = Math.max(MIN_CAMERA_SCALE, Math.min(26, nextScale));
    this.camera.x = beforeX - (screenX - this.canvas.width / 2) / this.camera.scale;
    this.camera.y = beforeY - (screenY - this.canvas.height / 2) / this.camera.scale;
  }

  render(variant, shouldRenderSegment = () => true) {
    if (!this.manifest) return;
    const gl = this.gl;
    resizeCanvas(gl, this.canvas);
    gl.disable(gl.BLEND);
    gl.clearColor(0.015, 0.015, 0.014, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    this.renderProjectionRects();
    gl.useProgram(this.program);
    gl.uniform2f(this.locations.resolution, this.canvas.width, this.canvas.height);
    gl.uniform3f(this.locations.camera, this.camera.x, this.camera.y, this.camera.scale);
    gl.uniform1i(this.locations.tilemap, 0);
    gl.uniform1i(this.locations.chr, 1);
    gl.uniform1i(this.locations.palette, 2);

    for (const segment of this.segments) {
      if (!shouldRenderSegment(segment.record)) {
        continue;
      }
      if (segment.record.presentationBackground === 'black') {
        continue;
      }
      const preferredVariant = segment.paletteTextures[variant]
        ? variant
        : segment.record.defaultVariant || Object.keys(segment.paletteTextures)[0];
      const palette = segment.paletteTextures[preferredVariant];
      if (!palette) continue;

      gl.bindBuffer(gl.ARRAY_BUFFER, segment.vertexBuffer);
      gl.enableVertexAttribArray(this.locations.position);
      gl.vertexAttribPointer(this.locations.position, 2, gl.FLOAT, false, 16, 0);
      gl.enableVertexAttribArray(this.locations.uv);
      gl.vertexAttribPointer(this.locations.uv, 2, gl.FLOAT, false, 16, 8);
      gl.uniform2f(this.locations.segmentSize, segment.record.position.width, segment.record.position.height);
      const displayOffset = this.displayOffsetForSegment(segment.record.id);
      gl.uniform2f(this.locations.segmentOffset, displayOffset.x, displayOffset.y);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, segment.tilemapTexture);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, segment.chrTexture);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, palette);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  }

  renderProjectionRects() {
    if (!this.projectionRects.length) {
      return;
    }
    const gl = this.gl;
    gl.useProgram(this.projectionProgram);
    gl.uniform2f(this.projectionLocations.resolution, this.canvas.width, this.canvas.height);
    gl.uniform3f(this.projectionLocations.camera, this.camera.x, this.camera.y, this.camera.scale);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.projectionVertexBuffer);
    gl.enableVertexAttribArray(this.projectionLocations.position);
    gl.vertexAttribPointer(this.projectionLocations.position, 2, gl.FLOAT, false, 8, 0);

    for (const rect of this.projectionRects) {
      if (rect.width <= 0 || rect.height <= 0) {
        continue;
      }
      gl.uniform4f(this.projectionLocations.rect, rect.x, rect.y, rect.width, rect.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  }

  displayOffsetForSegment(segmentId) {
    return this.segmentDisplayOffsets.get(segmentId) || { x: 0, y: 0 };
  }
}

const state = {
  variant: 'day',
  labels: true,
  sectionOutlines: true,
  highlightDoors: true,
  showCharacters: true,
  showSecrets: true,
  highlightCharacters: true,
  highlightMapObjects: true,
  highlightSecrets: true,
  activeViewId: OVERWORLD_VIEW_ID,
  transitioning: false
};

const DEFAULT_GUIDE_STATE = {
  variant: 'day',
  labels: true,
  sectionOutlines: true,
  highlightDoors: true,
  showCharacters: true,
  showSecrets: true,
  highlightCharacters: true,
  highlightMapObjects: true,
  highlightSecrets: true
};

const VIEW_OPTION_DEFINITIONS = [
  { key: 'labels', code: 'labels' },
  { key: 'sectionOutlines', code: 'sections' },
  { key: 'showCharacters', code: 'characters' },
  { key: 'showSecrets', code: 'secrets' },
  { key: 'highlightDoors', code: 'doors' },
  { key: 'highlightCharacters', code: 'characterHighlights' },
  { key: 'highlightMapObjects', code: 'mapObjects' },
  { key: 'highlightSecrets', code: 'secretHighlights' }
];
const URL_STATE_SAVE_DELAY_MS = 1200;
const URL_CAMERA_POSITION_DIGITS = 1;
const URL_CAMERA_SCALE_DIGITS = 3;
let urlStateSaveTimer = null;
let urlStateTrackingReady = false;
let lastUrlStateSignature = null;

let mapRenderer;
let sceneRenderer;
let loadedSceneViewId = null;
const sceneLoadPromises = new Map();
let dialogRenderer;
let labelRenderer;
let itemIconRenderer;
let activeGuideModel = null;
let activeInspectorModel = null;
const activeSecretAnimations = new Map();
let pendingReturnFocus = null;
let viewTransitionToken = 0;
let transitionTargetViewId = null;
let labels = [];
let sectionOutlines = [];
let routeConnectors = [];
let routeConnectorSvg;
let hotspots = [];
let destructibleHotspots = [];
let actorHotspots = [];
let secretFeatureHotspots = [];
let itemBadges = [];
let doorItemBadges = [];
let secretFeatureItemBadges = [];
let labelLeaderSvg;
const overlayActionByElement = new WeakMap();
const overlayBoxCache = new WeakMap();
let lastLabelCollisionSignature = null;
const floatingProjection = {
  currentX: null,
  lastFrameMs: null,
  side: null,
  targetX: null
};
const panInertia = {
  active: false,
  lastFrameMs: null,
  renderer: null,
  vx: 0,
  vy: 0
};
let guideMusicTracksById = null;
let guideMusicDataPromise = null;
const expandedGuideMusicTracks = new Map();
let guideMusicAudioContext = null;
let guideMusicNode = null;
let guideMusicReadyPromise = null;
let guideMusicMuted = true;
let guideMusicCurrentTrackId = null;
let guideMusicDesiredTrackId = MUSIC_TRACK_IDS.daytimeTown;
let guideMusicLastSegmentId = DEFAULT_MUSIC_SEGMENT_ID;
let guideMusicLastActorClassId = null;
let guideMusicLastActorId = null;
let guideMusicPlayToken = 0;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function currentView() {
  return MAP_VIEWS[state.activeViewId] || MAP_VIEWS[OVERWORLD_VIEW_ID];
}

function viewForRenderer(renderer) {
  return Object.values(MAP_VIEWS).find((view) => view.renderer === renderer) || currentView();
}

function activeRenderer() {
  return currentView().renderer;
}

function isGuideMusicDraculaActor(actor) {
  return actor?.classId === 'dracula'
    || actor?.id === 'castlevania-dracula-fight-dracula'
    || actor?.label === 'Dracula';
}

function isDraculaMusicContext() {
  return guideMusicLastActorClassId === 'dracula'
    || guideMusicLastActorId === 'castlevania-dracula-fight-dracula';
}

async function ensureGuideMusicTracks() {
  if (guideMusicTracksById) {
    return guideMusicTracksById;
  }
  if (!guideMusicDataPromise) {
    guideMusicDataPromise = import(MUSIC_DATA_URL).then(({ GUIDE_MUSIC_DATA: data }) => {
      guideMusicTracksById = new Map(data.tracks.map((track) => [track.soundId, track]));
      return guideMusicTracksById;
    });
  }
  return guideMusicDataPromise;
}

function expandGuideMusicTrack(track) {
  if (expandedGuideMusicTracks.has(track.soundId)) {
    return expandedGuideMusicTracks.get(track.soundId);
  }
  const frames = Array.from({ length: track.frameCount }, () => []);
  let frameIndex = 0;
  for (let index = 0; index < track.events.length; index += 3) {
    frameIndex += track.events[index];
    const register = track.events[index + 1];
    const value = track.events[index + 2];
    if (frames[frameIndex]) {
      frames[frameIndex].push(register, value);
    }
  }
  expandedGuideMusicTracks.set(track.soundId, frames);
  return frames;
}

function guideMusicTrackIdForState() {
  const view = currentView();
  if (view.id === CASTLEVANIA_VIEW_ID) {
    return isDraculaMusicContext()
      ? MUSIC_TRACK_IDS.draculaBattle
      : MUSIC_TRACK_IDS.castlevania;
  }
  if (MANSION_VIEW_IDS.has(view.id)) {
    return MUSIC_TRACK_IDS.mansion;
  }
  if (view.id !== OVERWORLD_VIEW_ID) {
    return MUSIC_TRACK_IDS.daytimeTown;
  }
  if (state.variant === 'night') {
    return MUSIC_TRACK_IDS.nighttime;
  }
  return TOWN_SEGMENT_IDS.has(guideMusicLastSegmentId)
    ? MUSIC_TRACK_IDS.daytimeTown
    : MUSIC_TRACK_IDS.bloodyTears;
}

function guideMusicTrackIdForViewIntent(viewId) {
  const view = MAP_VIEWS[viewId] || MAP_VIEWS[OVERWORLD_VIEW_ID];
  if (view.id === CASTLEVANIA_VIEW_ID) {
    return MUSIC_TRACK_IDS.castlevania;
  }
  if (MANSION_VIEW_IDS.has(view.id)) {
    return MUSIC_TRACK_IDS.mansion;
  }
  if (view.id !== OVERWORLD_VIEW_ID) {
    return MUSIC_TRACK_IDS.daytimeTown;
  }
  return guideMusicTrackIdForState();
}

function updateGuideMusicControl() {
  const label = guideMusicMuted ? 'Unmute guide music' : 'Mute guide music';
  drawChromeIcon(dom.audioToggleIcon, guideMusicMuted ? CHROME_ICONS.audioOff : CHROME_ICONS.audioOn);
  dom.audioToggle.setAttribute('aria-label', label);
  dom.audioToggle.title = label;
  dom.audioToggle.setAttribute('aria-pressed', guideMusicMuted ? 'false' : 'true');
}

async function ensureGuideMusicAudio() {
  if (guideMusicAudioContext && guideMusicNode) {
    if (guideMusicAudioContext.state === 'suspended') {
      await guideMusicAudioContext.resume();
    }
    return guideMusicNode;
  }
  if (guideMusicReadyPromise) {
    await guideMusicReadyPromise;
    return guideMusicNode;
  }

  guideMusicReadyPromise = (async () => {
    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextConstructor) {
      throw new Error('Web Audio is not available in this browser.');
    }
    guideMusicAudioContext = new AudioContextConstructor({ latencyHint: 'interactive' });
    if (!guideMusicAudioContext.audioWorklet) {
      throw new Error('AudioWorklet is not available. Use the HTTPS guide URL for music playback.');
    }
    await guideMusicAudioContext.audioWorklet.addModule(MUSIC_WORKLET_URL);
    guideMusicNode = new AudioWorkletNode(guideMusicAudioContext, 'cv2-apu', {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      outputChannelCount: [2]
    });
    guideMusicNode.connect(guideMusicAudioContext.destination);
    await guideMusicAudioContext.resume();
  })();

  try {
    await guideMusicReadyPromise;
  } finally {
    guideMusicReadyPromise = null;
  }
  return guideMusicNode;
}

async function playGuideMusicTrack(trackId) {
  guideMusicDesiredTrackId = trackId;
  if (guideMusicMuted) {
    return;
  }
  if (guideMusicCurrentTrackId === trackId) {
    if (guideMusicAudioContext?.state === 'suspended') {
      await guideMusicAudioContext.resume();
    }
    return;
  }
  const tracksById = await ensureGuideMusicTracks();
  const track = tracksById.get(trackId);
  if (!track) {
    return;
  }

  const token = ++guideMusicPlayToken;
  const node = await ensureGuideMusicAudio();
  if (token !== guideMusicPlayToken || guideMusicMuted) {
    return;
  }

  node.port.postMessage({ type: 'reset' });
  node.port.postMessage({
    type: 'track',
    frames: expandGuideMusicTrack(track),
    startFrame: 0,
    endFrame: track.loop?.endFrame || track.frameCount,
    loopStartFrame: track.loop?.startFrame || 0,
    loopEndFrame: track.loop?.endFrame || track.frameCount,
    canLoop: true
  });
  node.port.postMessage({ type: 'play' });
  guideMusicCurrentTrackId = trackId;
}

function stopGuideMusic() {
  guideMusicPlayToken += 1;
  guideMusicCurrentTrackId = null;
  guideMusicNode?.port.postMessage({ type: 'stop' });
}

function syncGuideMusicToTrack(trackId) {
  guideMusicDesiredTrackId = trackId;
  if (!guideMusicMuted) {
    playGuideMusicTrack(guideMusicDesiredTrackId).catch((error) => {
      guideMusicMuted = true;
      stopGuideMusic();
      updateGuideMusicControl();
      setStatus(error instanceof Error ? error.message : String(error));
    });
  }
}

function syncGuideMusic() {
  syncGuideMusicToTrack(guideMusicTrackIdForState());
}

function saveGuideMusicUrlStateNow() {
  if (urlStateTrackingReady) {
    saveUrlViewStateNow();
  }
}

function noteGuideMusicViewChange(viewId, previousViewId = null) {
  if (viewId !== CASTLEVANIA_VIEW_ID || previousViewId !== CASTLEVANIA_VIEW_ID) {
    guideMusicLastActorClassId = null;
    guideMusicLastActorId = null;
  }
  syncGuideMusic();
}

function noteGuideMusicViewIntent(viewId, { segmentId = null } = {}) {
  if (segmentId) {
    guideMusicLastSegmentId = segmentId;
  }
  guideMusicLastActorClassId = null;
  guideMusicLastActorId = null;
  syncGuideMusicToTrack(guideMusicTrackIdForViewIntent(viewId));
}

function noteGuideMusicInteraction({ segmentId = null, actor = null } = {}) {
  if (segmentId) {
    guideMusicLastSegmentId = segmentId;
  }
  if (actor) {
    guideMusicLastActorClassId = isGuideMusicDraculaActor(actor) ? 'dracula' : actor.classId || null;
    guideMusicLastActorId = actor.id || null;
  } else {
    guideMusicLastActorClassId = null;
    guideMusicLastActorId = null;
  }
  syncGuideMusic();
  saveGuideMusicUrlStateNow();
}

async function toggleGuideMusicMute() {
  guideMusicMuted = !guideMusicMuted;
  updateGuideMusicControl();
  if (guideMusicMuted) {
    stopGuideMusic();
    return;
  }

  try {
    await playGuideMusicTrack(guideMusicDesiredTrackId);
  } catch (error) {
    guideMusicMuted = true;
    stopGuideMusic();
    updateGuideMusicControl();
    setStatus(error instanceof Error ? error.message : String(error));
  }
}

function formatUrlNumber(value, digits) {
  return String(Number(value.toFixed(digits)));
}

function parseFiniteUrlNumber(value) {
  if (value == null || value === '') {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function cameraStateFromParams(params, prefix = '') {
  const x = parseFiniteUrlNumber(params.get(`${prefix}x`));
  const y = parseFiniteUrlNumber(params.get(`${prefix}y`));
  const scale = parseFiniteUrlNumber(params.get(`${prefix}z`) ?? params.get(`${prefix}scale`));
  return x == null || y == null || scale == null
    ? null
    : { x, y, scale };
}

function cameraStateFromRenderer(renderer) {
  return renderer?.camera
    ? {
      x: renderer.camera.x,
      y: renderer.camera.y,
      scale: renderer.camera.scale
    }
    : null;
}

function cameraStateUrlEntries(prefix, camera) {
  if (!camera) {
    return [];
  }
  return [
    [`${prefix}x`, formatUrlNumber(camera.x, URL_CAMERA_POSITION_DIGITS)],
    [`${prefix}y`, formatUrlNumber(camera.y, URL_CAMERA_POSITION_DIGITS)],
    [`${prefix}z`, formatUrlNumber(camera.scale, URL_CAMERA_SCALE_DIGITS)]
  ];
}

function currentViewOptionCodes() {
  return VIEW_OPTION_DEFINITIONS
    .filter((definition) => Boolean(state[definition.key]))
    .map((definition) => definition.code);
}

function parseUrlMusicState(params) {
  const segmentId = params.get('music');
  const actorCode = params.get('musicActor');
  return {
    segmentId: ROUTE_SEGMENT_ID_SET.has(segmentId) ? segmentId : null,
    actorClassId: actorCode === DRACULA_MUSIC_ACTOR_URL_CODE ? 'dracula' : null,
    actorId: actorCode === DRACULA_MUSIC_ACTOR_URL_CODE ? 'castlevania-dracula-fight-dracula' : null
  };
}

function applyUrlMusicState(music) {
  if (!music) {
    return;
  }
  if (music.segmentId) {
    guideMusicLastSegmentId = music.segmentId;
  }
  guideMusicLastActorClassId = music.actorClassId;
  guideMusicLastActorId = music.actorId;
  syncGuideMusic();
}

function musicStateUrlEntries() {
  const segmentId = ROUTE_SEGMENT_ID_SET.has(guideMusicLastSegmentId)
    ? guideMusicLastSegmentId
    : DEFAULT_MUSIC_SEGMENT_ID;
  const entries = [['music', segmentId]];
  if (isDraculaMusicContext()) {
    entries.push(['musicActor', DRACULA_MUSIC_ACTOR_URL_CODE]);
  }
  return entries;
}

function parseUrlViewState() {
  const rawHash = window.location.hash.replace(/^#/, '');
  if (!rawHash || !rawHash.includes('=')) {
    return null;
  }
  const params = new URLSearchParams(rawHash);
  const knownKeys = ['view', 'x', 'y', 'z', 'scale', 'owx', 'owy', 'owz', 'owscale', 'palette', 'variant', 'opts', 'music', 'musicActor'];
  if (!knownKeys.some((key) => params.has(key))) {
    return null;
  }

  const requestedViewId = params.get('view') || OVERWORLD_VIEW_ID;
  const viewId = MAP_VIEWS[requestedViewId] ? requestedViewId : OVERWORLD_VIEW_ID;
  const palette = params.get('palette') || params.get('variant');
  const opts = params.has('opts')
    ? new Set(params.get('opts').split(/[,.]/).map((item) => item.trim()).filter(Boolean))
    : null;

  return {
    viewId,
    camera: cameraStateFromParams(params),
    overworldCamera: cameraStateFromParams(params, 'ow'),
    variant: palette === 'day' || palette === 'night' ? palette : null,
    options: opts,
    music: parseUrlMusicState(params)
  };
}

function applyUrlViewOptions(options) {
  if (!options) return;
  for (const definition of VIEW_OPTION_DEFINITIONS) {
    state[definition.key] = options.has(definition.code);
  }
}

function applyUrlCameraState(renderer, camera) {
  if (!renderer || !camera) return;
  renderer.camera.x = camera.x;
  renderer.camera.y = camera.y;
  renderer.camera.scale = Math.max(MIN_CAMERA_SCALE, Math.min(26, camera.scale));
  clampGuideCamera(renderer);
}

function encodeUrlViewState() {
  const renderer = activeRenderer();
  if (!renderer) {
    return null;
  }
  const params = [
    ['view', state.activeViewId],
    ...cameraStateUrlEntries('', cameraStateFromRenderer(renderer)),
    ['palette', state.variant],
    ['opts', currentViewOptionCodes().join('.')],
    ...musicStateUrlEntries()
  ];
  if (state.activeViewId !== OVERWORLD_VIEW_ID) {
    params.push(...cameraStateUrlEntries('ow', cameraStateFromRenderer(mapRenderer)));
  }
  return params
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
}

function replaceUrlViewState(signature) {
  if (!signature || signature === lastUrlStateSignature) {
    return;
  }
  const url = new URL(window.location.href);
  url.hash = signature;
  try {
    window.history.replaceState(window.history.state, '', url.toString());
    lastUrlStateSignature = signature;
  } catch (error) {
    console.warn('Unable to update guide URL state.', error);
  }
}

function scheduleUrlViewStateSave() {
  if (!urlStateTrackingReady || urlStateSaveTimer != null) {
    return;
  }
  urlStateSaveTimer = window.setTimeout(() => {
    urlStateSaveTimer = null;
    replaceUrlViewState(encodeUrlViewState());
  }, URL_STATE_SAVE_DELAY_MS);
}

function saveUrlViewStateNow() {
  if (!urlStateTrackingReady) {
    return;
  }
  if (urlStateSaveTimer != null) {
    window.clearTimeout(urlStateSaveTimer);
    urlStateSaveTimer = null;
  }
  replaceUrlViewState(encodeUrlViewState());
}

function clearUrlViewState() {
  if (urlStateSaveTimer != null) {
    window.clearTimeout(urlStateSaveTimer);
    urlStateSaveTimer = null;
  }
  const signature = encodeUrlViewState();
  const url = new URL(window.location.href);
  url.hash = '';
  try {
    window.history.replaceState(window.history.state, '', url.toString());
    lastUrlStateSignature = signature;
  } catch (error) {
    console.warn('Unable to clear guide URL state.', error);
  }
}

function observeUrlViewState() {
  if (!urlStateTrackingReady) {
    return;
  }
  const signature = encodeUrlViewState();
  if (signature && signature !== lastUrlStateSignature) {
    scheduleUrlViewStateSave();
  }
}

function primeUrlViewStateTracking() {
  lastUrlStateSignature = encodeUrlViewState();
  urlStateTrackingReady = true;
}

function viewNeedsLoad(view) {
  return Boolean(view?.sceneUrl)
    && !(loadedSceneViewId === view.id && view.renderer === sceneRenderer);
}

async function ensureViewLoaded(viewId, { onProgress = null } = {}) {
  const view = MAP_VIEWS[viewId] || MAP_VIEWS[OVERWORLD_VIEW_ID];
  if (view.id === OVERWORLD_VIEW_ID) {
    return mapRenderer;
  }
  if (!view.sceneUrl) {
    return view.renderer;
  }
  if (loadedSceneViewId === view.id && view.renderer === sceneRenderer) {
    return sceneRenderer;
  }
  if (!sceneLoadPromises.has(view.id)) {
    const loadPromise = sceneRenderer.load(view.sceneUrl, { onProgress }).then(() => {
      for (const candidate of Object.values(MAP_VIEWS)) {
        if (candidate.id !== OVERWORLD_VIEW_ID) {
          candidate.renderer = null;
        }
      }
      view.renderer = sceneRenderer;
      loadedSceneViewId = view.id;
      return sceneRenderer;
    }).finally(() => {
      // The scene canvas is shared, so a completed load is not reusable after another view loads.
      if (sceneLoadPromises.get(view.id) === loadPromise) {
        sceneLoadPromises.delete(view.id);
      }
    });
    sceneLoadPromises.set(view.id, loadPromise);
  }
  return sceneLoadPromises.get(view.id);
}

function activeVariant(view = currentView()) {
  return view.supportsPalette
    ? state.variant
    : view.fixedVariant || view.defaultVariant || 'fixed';
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function visibleBounds(segmentIds, renderer = activeRenderer()) {
  if (!renderer) return undefined;
  const segments = segmentIds
    .map((segmentId) => renderer.segmentById.get(segmentId))
    .filter((segment) => segment && segmentRecordVisible(segment));
  if (segments.length === 0) {
    return undefined;
  }
  const minX = Math.min(...segments.map((segment) => segment.position.x));
  const minY = Math.min(...segments.map((segment) => segment.position.y));
  const maxX = Math.max(...segments.map((segment) => segment.position.x + segment.position.width));
  const maxY = Math.max(...segments.map((segment) => segment.position.y + segment.position.height));
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}

function manifestBounds(renderer) {
  if (!renderer?.manifest) return undefined;
  const world = renderer.manifest.world || {};
  return {
    x: Number.isFinite(world.x) ? world.x : 0,
    y: Number.isFinite(world.y) ? world.y : 0,
    width: world.width,
    height: world.height
  };
}

function viewBounds(view = currentView(), renderer = view.renderer) {
  if (!renderer) return undefined;
  return view.id === OVERWORLD_VIEW_ID
    ? visibleBounds(ROUTE_SEGMENT_IDS, renderer)
    : manifestBounds(renderer);
}

function focusBounds(bounds, padding = 0.84, renderer = activeRenderer()) {
  if (!bounds || !renderer) return;
  resizeCanvas(renderer.gl, renderer.canvas);
  const safeWidth = Math.max(1, bounds.width);
  const safeHeight = Math.max(1, bounds.height);
  renderer.camera.x = bounds.x + bounds.width / 2;
  renderer.camera.y = bounds.y + bounds.height / 2;
  renderer.camera.scale = Math.min(
    renderer.canvas.width / safeWidth,
    renderer.canvas.height / safeHeight
  ) * padding;
  renderer.camera.scale = Math.max(MIN_CAMERA_SCALE, Math.min(12, renderer.camera.scale));
}

function compactViewport() {
  return window.innerWidth <= 760;
}

function focusVisibleRoute() {
  stopPanInertia();
  focusActiveView({ reset: true });
}

function playerSpawnActor(view = currentView()) {
  const renderer = view.renderer;
  return renderer?.manifest?.actors?.find((actor) => actor.kind === 'player') || null;
}

function actorWorldPoint(actor, renderer = activeRenderer()) {
  const offset = segmentDisplayOffset(actor.segmentId, renderer);
  return {
    x: actor.worldX + offset.x,
    y: actor.worldY + offset.y
  };
}

function spawnFocusBounds(view = currentView(), renderer = view.renderer) {
  const actor = playerSpawnActor(view);
  if (!actor || !renderer) {
    return null;
  }
  const segment = renderer.segmentById.get(actor.segmentId);
  if (!segment) {
    return null;
  }

  const segmentPosition = segmentDisplayPosition(segment, renderer);
  const point = actorWorldPoint(actor, renderer);
  const width = Math.min(NES_SCREEN_WIDTH, segmentPosition.width);
  const height = Math.min(NES_SCREEN_HEIGHT, segmentPosition.height);
  const maxX = segmentPosition.x + segmentPosition.width - width;
  const maxY = segmentPosition.y + segmentPosition.height - height;
  const screenX = Math.floor((point.x - segmentPosition.x) / NES_SCREEN_WIDTH);
  const screenY = Math.floor((point.y - segmentPosition.y) / NES_SCREEN_HEIGHT);

  return {
    x: clamp(segmentPosition.x + screenX * NES_SCREEN_WIDTH, segmentPosition.x, maxX),
    y: clamp(segmentPosition.y + screenY * NES_SCREEN_HEIGHT, segmentPosition.y, maxY),
    width,
    height
  };
}

function focusActiveView({ reset = true, view = currentView() } = {}) {
  if (!reset || !view.renderer) return;
  const bounds = spawnFocusBounds(view, view.renderer) || viewBounds(view);
  const padding = compactViewport() ? MOBILE_SPAWN_CAMERA_PADDING : DESKTOP_SPAWN_CAMERA_PADDING;
  focusBounds(bounds, padding, view.renderer);
  clampGuideCamera(view.renderer);
}

function clampGuideCamera(renderer = activeRenderer()) {
  if (!renderer?.manifest) return;
  const view = viewForRenderer(renderer);
  const bounds = viewBounds(view, renderer) || manifestBounds(renderer);
  if (!bounds) return;
  resizeCanvas(renderer.gl, renderer.canvas);
  const safeScale = Math.max(0.0001, renderer.camera.scale);
  const viewWidth = renderer.canvas.width / safeScale;
  const viewHeight = renderer.canvas.height / safeScale;
  const marginX = Math.max(viewWidth * 0.42, bounds.width * 0.08);
  const marginY = Math.max(viewHeight * 0.42, bounds.height * 0.24);
  renderer.camera.x = clamp(
    renderer.camera.x,
    bounds.x - marginX,
    bounds.x + bounds.width + marginX
  );
  renderer.camera.y = clamp(
    renderer.camera.y,
    bounds.y - marginY,
    bounds.y + bounds.height + marginY
  );
}

function stopPanInertia() {
  panInertia.active = false;
  panInertia.lastFrameMs = null;
  panInertia.renderer = null;
  panInertia.vx = 0;
  panInertia.vy = 0;
}

function startPanInertia(vx, vy, renderer = activeRenderer()) {
  const speed = Math.hypot(vx, vy);
  if (!renderer || speed < PAN_INERTIA_STOP_SPEED) {
    stopPanInertia();
    return;
  }

  const speedScale = Math.min(speed, PAN_INERTIA_MAX_SPEED) / speed;
  panInertia.active = true;
  panInertia.lastFrameMs = null;
  panInertia.renderer = renderer;
  panInertia.vx = vx * speedScale;
  panInertia.vy = vy * speedScale;
}

function applyPanInertia(now = performance.now()) {
  const renderer = panInertia.renderer || activeRenderer();
  if (!panInertia.active || !renderer) {
    return;
  }

  if (panInertia.lastFrameMs === null) {
    panInertia.lastFrameMs = now;
    return;
  }

  const dt = Math.min(48, Math.max(0, now - panInertia.lastFrameMs));
  panInertia.lastFrameMs = now;
  if (dt <= 0) {
    return;
  }

  const expectedX = renderer.camera.x + panInertia.vx * dt;
  const expectedY = renderer.camera.y + panInertia.vy * dt;
  renderer.camera.x = expectedX;
  renderer.camera.y = expectedY;
  clampGuideCamera(renderer);

  if (Math.abs(renderer.camera.x - expectedX) > 0.001) {
    panInertia.vx = 0;
  }
  if (Math.abs(renderer.camera.y - expectedY) > 0.001) {
    panInertia.vy = 0;
  }

  const decay = Math.exp((-PAN_INERTIA_DECAY_PER_SECOND * dt) / 1000);
  panInertia.vx *= decay;
  panInertia.vy *= decay;

  if (Math.hypot(panInertia.vx, panInertia.vy) < PAN_INERTIA_STOP_SPEED) {
    stopPanInertia();
  }
}

function worldToScreen(renderer, x, y) {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  return {
    x: ((x - renderer.camera.x) * renderer.camera.scale + renderer.canvas.width / 2) / dpr,
    y: ((y - renderer.camera.y) * renderer.camera.scale + renderer.canvas.height / 2) / dpr
  };
}

function worldRectToScreen(renderer, rect) {
  const start = worldToScreen(renderer, rect.x, rect.y);
  const end = worldToScreen(renderer, rect.x + rect.width, rect.y + rect.height);
  return {
    left: Math.min(start.x, end.x),
    top: Math.min(start.y, end.y),
    width: Math.abs(end.x - start.x),
    height: Math.abs(end.y - start.y)
  };
}

function routeConnectorVisible(connector, renderer) {
  if (currentView().id !== OVERWORLD_VIEW_ID) {
    return false;
  }
  if (connector.visibilityLayer === 'secrets' && !state.showSecrets) {
    return false;
  }
  const fromSegmentId = routeConnectorFromSegmentId(connector, renderer);
  return fromSegmentId
    && segmentIdVisible(fromSegmentId, renderer)
    && segmentIdVisible(connector.toSegmentId, renderer);
}

function routeConnectorFeature(connector, renderer) {
  if (!connector.fromFeatureId) {
    return null;
  }
  return (renderer.manifest.secretFeatures || [])
    .find((feature) => feature.id === connector.fromFeatureId) || null;
}

function routeConnectorFromSegmentId(connector, renderer) {
  if (connector.fromSegmentId) {
    return connector.fromSegmentId;
  }
  return routeConnectorFeature(connector, renderer)?.segmentId || null;
}

function routeConnectorAnchorPoint(rect, anchorX, anchorY) {
  return {
    x: rect.x + rect.width * anchorX,
    y: rect.y + rect.height * anchorY
  };
}

function routeConnectorSourceRect(connector, renderer) {
  const feature = routeConnectorFeature(connector, renderer);
  if (feature) {
    return secretFeatureWorldRect(feature, renderer);
  }
  const fromSegment = renderer.segmentById.get(connector.fromSegmentId);
  return fromSegment ? segmentDisplayPosition(fromSegment, renderer) : null;
}

function routeConnectorEndpointPoints(connector, renderer) {
  const toSegment = renderer.segmentById.get(connector.toSegmentId);
  const fromRect = routeConnectorSourceRect(connector, renderer);
  if (!fromRect || !toSegment) {
    return null;
  }

  const toRect = segmentDisplayPosition(toSegment, renderer);
  return {
    start: routeConnectorAnchorPoint(
      fromRect,
      connector.fromAnchorX ?? 0.5,
      connector.fromAnchorY ?? (connector.fromFeatureId ? 0.5 : 1)
    ),
    end: routeConnectorAnchorPoint(
      toRect,
      connector.toAnchorX ?? 0.5,
      connector.toAnchorY ?? 0
    )
  };
}

function routeConnectorClearanceBendY(connector, renderer, start, end) {
  if (connector.bendClearance !== 'above-segments') {
    return null;
  }

  const left = Math.min(start.x, end.x);
  const right = Math.max(start.x, end.x);
  const crossedRects = renderer.segments
    .map((segment) => segmentDisplayPosition(segment.record, renderer))
    .filter((rect) => rect.x < right && rect.x + rect.width > left);
  if (crossedRects.length === 0) {
    return null;
  }

  const top = Math.min(...crossedRects.map((rect) => rect.y));
  const sectionHeights = crossedRects
    .map((rect) => rect.height)
    .filter((height) => Number.isFinite(height) && height > 0);
  if (sectionHeights.length === 0) {
    return null;
  }
  const sectionHeight = Math.min(...sectionHeights);
  const clearance = sectionHeight * (connector.bendClearanceSegmentHeights ?? 0.5);
  return top - clearance;
}

function routeConnectorMatchedDistanceBendY(connector, renderer, start) {
  if (!connector.bendDistanceConnectorId) {
    return null;
  }

  const reference = OVERWORLD_ROUTE_CONNECTORS
    .find((candidate) => candidate.id === connector.bendDistanceConnectorId);
  if (!reference || reference === connector) {
    return null;
  }

  const referencePoints = routeConnectorEndpointPoints(reference, renderer);
  if (!referencePoints) {
    return null;
  }

  const referenceBendY = routeConnectorClearanceBendY(
    reference,
    renderer,
    referencePoints.start,
    referencePoints.end
  ) ?? referencePoints.start.y
    + (referencePoints.end.y - referencePoints.start.y) * (reference.bendYRatio ?? 1);
  const referenceDistance = Math.abs(referenceBendY - referencePoints.start.y);
  const direction = connector.bendDirection === 'up' ? -1 : 1;
  return start.y + referenceDistance * direction;
}

function routeConnectorWorldPoints(connector, renderer) {
  const endpoints = routeConnectorEndpointPoints(connector, renderer);
  if (!endpoints) {
    return [];
  }

  const { start, end } = endpoints;
  const bendY = routeConnectorMatchedDistanceBendY(connector, renderer, start)
    ?? routeConnectorClearanceBendY(connector, renderer, start, end)
    ?? start.y + (end.y - start.y) * (connector.bendYRatio ?? 1);

  const points = [
    start,
    { x: start.x, y: bendY },
    { x: end.x, y: bendY },
    end
  ];
  return points.filter((point, index) => {
    const previous = points[index - 1];
    return !previous || previous.x !== point.x || previous.y !== point.y;
  });
}

function anchorWorldRect(model) {
  if (!model) {
    return null;
  }
  return typeof model.anchorWorldRect === 'function'
    ? model.anchorWorldRect()
    : model.anchorWorldRect || null;
}

function panelPlacementOptions(anchorRect, panelRect, margin, safeTop) {
  const centerX = anchorRect.left + anchorRect.width / 2;
  const centerY = anchorRect.top + anchorRect.height / 2;
  return [
    {
      name: 'above',
      left: centerX - panelRect.width / 2,
      top: anchorRect.top - panelRect.height - 10
    },
    {
      name: 'below',
      left: centerX - panelRect.width / 2,
      top: anchorRect.top + anchorRect.height + 10
    },
    {
      name: 'right',
      left: anchorRect.left + anchorRect.width + 10,
      top: centerY - panelRect.height / 2
    },
    {
      name: 'left',
      left: anchorRect.left - panelRect.width - 10,
      top: centerY - panelRect.height / 2
    }
  ].map((option) => ({
    ...option,
    fits: option.left >= margin
      && option.left + panelRect.width <= window.innerWidth - margin
      && option.top >= safeTop
      && option.top + panelRect.height <= window.innerHeight - margin
  }));
}

function placeAnchoredPanel(panel, model, preferred = 'above') {
  const worldRect = anchorWorldRect(model);
  const renderer = activeRenderer();
  if (!worldRect || panel.hidden || !renderer) {
    return;
  }
  const anchorRect = worldRectToScreen(renderer, worldRect);
  const panelRect = panel.getBoundingClientRect();
  if (panelRect.width <= 0 || panelRect.height <= 0) {
    return;
  }

  const margin = compactViewport() ? 8 : 14;
  const safeTop = compactViewport() ? 66 : 76;
  const placements = panelPlacementOptions(anchorRect, panelRect, margin, safeTop);
  const placement = placements.find((item) => item.name === preferred && item.fits)
    || placements.find((item) => item.fits)
    || placements.find((item) => item.name === preferred)
    || placements[0];

  const left = clamp(placement.left, margin, Math.max(margin, window.innerWidth - panelRect.width - margin));
  const top = clamp(placement.top, safeTop, Math.max(safeTop, window.innerHeight - panelRect.height - margin));
  panel.style.left = `${Math.round(left)}px`;
  panel.style.top = `${Math.round(top)}px`;
}

function dialogScaleForMap() {
  const renderer = activeRenderer();
  if (!renderer?.canvas) {
    return compactViewport() ? 1.25 : 1;
  }
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const mapCssScale = renderer.camera.scale / dpr;
  const snapped = Math.round(mapCssScale * 2) / 2;
  return clamp(snapped, compactViewport() ? 1.25 : 1, compactViewport() ? 2 : 2);
}

function visibleWorldRect(renderer) {
  const safeScale = Math.max(0.0001, renderer.camera.scale);
  return {
    x: renderer.camera.x - renderer.canvas.width / (2 * safeScale),
    y: renderer.camera.y - renderer.canvas.height / (2 * safeScale),
    width: renderer.canvas.width / safeScale,
    height: renderer.canvas.height / safeScale
  };
}

function segmentDisplayOffset(segmentId, renderer = activeRenderer()) {
  return renderer?.displayOffsetForSegment(segmentId) || { x: 0, y: 0 };
}

function segmentDisplayPosition(segment, renderer = activeRenderer()) {
  const offset = segmentDisplayOffset(segment.id, renderer);
  return {
    x: segment.position.x + offset.x,
    y: segment.position.y + offset.y,
    width: segment.position.width,
    height: segment.position.height
  };
}

function segmentRecordVisible(segment) {
  if (!segment) return false;
  if (segment.visibilityLayer === 'secrets') {
    return state.showSecrets;
  }
  return true;
}

function labelDisplayPosition(segment, renderer = activeRenderer(), overviewLabels = false) {
  const groupMap = overviewLabels ? OVERVIEW_LABEL_BOUNDS_SEGMENT_IDS : LABEL_BOUNDS_SEGMENT_IDS;
  const groupIds = groupMap.get(segment.id);
  if (!groupIds?.length || !renderer) {
    return segmentDisplayPosition(segment, renderer);
  }
  const rects = groupIds
    .map((segmentId) => renderer.segmentById.get(segmentId))
    .filter((groupSegment) => groupSegment && segmentRecordVisible(groupSegment))
    .map((groupSegment) => segmentDisplayPosition(groupSegment, renderer));
  if (rects.length === 0) {
    return segmentDisplayPosition(segment, renderer);
  }
  const minX = Math.min(...rects.map((rect) => rect.x));
  const minY = Math.min(...rects.map((rect) => rect.y));
  const maxX = Math.max(...rects.map((rect) => rect.x + rect.width));
  const maxY = Math.max(...rects.map((rect) => rect.y + rect.height));
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}

function segmentIdVisible(segmentId, renderer = activeRenderer()) {
  if (!renderer) return false;
  return segmentRecordVisible(renderer.segmentById.get(segmentId));
}

function updateFloatingProjection() {
  if (!mapRenderer?.manifest) return;
  resizeCanvas(mapRenderer.gl, mapRenderer.canvas);
  mapRenderer.projectionRects = [];

  const floating = mapRenderer.segmentById.get(FLOATING_VEROS_SEGMENT_ID);
  const left = mapRenderer.segmentById.get(FLOATING_VEROS_LEFT_SEGMENT_ID);
  const right = mapRenderer.segmentById.get(FLOATING_VEROS_RIGHT_SEGMENT_ID);
  if (!floating || !left || !right) {
    return;
  }

  const corridorLeft = left.position.x + left.position.width;
  const corridorRight = right.position.x;
  mapRenderer.projectionRects = [{
    x: corridorLeft,
    y: floating.position.y,
    width: corridorRight - corridorLeft,
    height: floating.position.height
  }];

  const minX = corridorLeft;
  const maxX = corridorRight - floating.position.width;
  if (maxX < minX) {
    mapRenderer.projectionRects = [];
    mapRenderer.segmentDisplayOffsets.delete(floating.id);
    floatingProjection.currentX = null;
    floatingProjection.lastFrameMs = null;
    floatingProjection.side = null;
    floatingProjection.targetX = null;
    return;
  }

  const corridorMidpoint = (corridorLeft + corridorRight) / 2;
  let targetSide = floatingProjection.side
    || (mapRenderer.camera.x >= corridorMidpoint ? 'right' : 'left');
  if (mapRenderer.camera.x > corridorMidpoint + FLOATING_VEROS_SIDE_HYSTERESIS) {
    targetSide = 'right';
  } else if (mapRenderer.camera.x < corridorMidpoint - FLOATING_VEROS_SIDE_HYSTERESIS) {
    targetSide = 'left';
  }

  const targetX = targetSide === 'right' ? maxX : minX;
  const now = performance.now();
  if (floatingProjection.currentX === null || floatingProjection.targetX === null) {
    floatingProjection.currentX = targetX;
  } else {
    const lastFrameMs = floatingProjection.lastFrameMs ?? now;
    const elapsedMs = clamp(now - lastFrameMs, 0, FLOATING_VEROS_FRAME_MS);
    const blend = 1 - Math.exp(-elapsedMs / FLOATING_VEROS_EASE_MS);
    floatingProjection.currentX += (targetX - floatingProjection.currentX) * blend;
    if (Math.abs(targetX - floatingProjection.currentX) < FLOATING_VEROS_SNAP_EPSILON) {
      floatingProjection.currentX = targetX;
    }
  }
  floatingProjection.lastFrameMs = now;
  floatingProjection.side = targetSide;
  floatingProjection.targetX = targetX;

  const displayX = clamp(floatingProjection.currentX, minX, maxX);
  const displayY = floating.position.y;

  mapRenderer.segmentDisplayOffsets.set(floating.id, {
    x: displayX - floating.position.x,
    y: displayY - floating.position.y
  });
}

function hotspotWorldRect(hotspot) {
  if (!hotspot.tileRect) {
    return hotspot;
  }
  const renderer = activeRenderer();
  const segment = renderer?.segmentById.get(hotspot.segmentId);
  if (!segment) {
    return null;
  }
  const tileSize = segment.tileSize || 8;
  const position = segmentDisplayPosition(segment, renderer);
  return {
    x: position.x + hotspot.tileRect.x * tileSize,
    y: position.y + hotspot.tileRect.y * tileSize,
    width: hotspot.tileRect.width * tileSize,
    height: hotspot.tileRect.height * tileSize
  };
}

function destructibleFixtureWorldRect(fixture) {
  const renderer = activeRenderer();
  const segment = renderer?.segmentById.get(fixture.segmentId);
  if (!segment) {
    return null;
  }
  const tileSize = segment.tileSize || 8;
  const position = segmentDisplayPosition(segment, renderer);
  return {
    x: position.x + fixture.tileRect.x * tileSize,
    y: position.y + fixture.tileRect.y * tileSize,
    width: fixture.tileRect.width * tileSize,
    height: fixture.tileRect.height * tileSize
  };
}

function secretFeatureMotionOffset(feature, now = performance.now()) {
  const motion = feature.motion || {};
  if (motion.type !== 'linear-ping-pong') {
    return { x: 0, y: 0 };
  }

  const minX = Number.isFinite(motion.minOffsetX) ? motion.minOffsetX : 0;
  const maxX = Number.isFinite(motion.maxOffsetX) ? motion.maxOffsetX : minX;
  const minY = Number.isFinite(motion.minOffsetY) ? motion.minOffsetY : 0;
  const maxY = Number.isFinite(motion.maxOffsetY) ? motion.maxOffsetY : minY;
  const frameDurationMs = Number.isFinite(motion.frameDurationMs) && motion.frameDurationMs > 0
    ? motion.frameDurationMs
    : 1000 / 60;
  const speed = Number.isFinite(motion.speedPixelsPerFrame) && motion.speedPixelsPerFrame > 0
    ? motion.speedPixelsPerFrame
    : 1;
  const travel = motion.axis === 'x'
    ? Math.abs(maxX - minX)
    : Math.abs(maxY - minY);
  if (travel <= 0) {
    return { x: minX, y: minY };
  }
  const halfFrames = Number.isFinite(motion.reversalFrames) && motion.reversalFrames > 0
    ? motion.reversalFrames
    : Math.max(1, Math.round(travel / speed));
  const endpointHoldFrames = Number.isFinite(motion.endpointHoldFrames) && motion.endpointHoldFrames > 0
    ? Math.floor(motion.endpointHoldFrames)
    : 0;
  const periodFrames = halfFrames * 2 + endpointHoldFrames * 2;
  const elapsedFrame = Math.floor(now / frameDurationMs + (motion.phaseFrames || 0));
  const cycleFrame = ((elapsedFrame % periodFrames) + periodFrames) % periodFrames;
  let legFrame;
  if (endpointHoldFrames > 0 && cycleFrame > halfFrames) {
    const returnFrame = cycleFrame - halfFrames - endpointHoldFrames;
    legFrame = returnFrame <= 0
      ? halfFrames
      : Math.max(0, halfFrames - returnFrame);
  } else {
    legFrame = cycleFrame <= halfFrames ? cycleFrame : periodFrames - cycleFrame;
  }
  const amount = Math.min(travel, legFrame * speed);

  if (motion.axis === 'x') {
    const direction = maxX >= minX ? 1 : -1;
    return { x: minX + amount * direction, y: minY };
  }
  const direction = maxY >= minY ? 1 : -1;
  return { x: minX, y: minY + amount * direction };
}

function activeSecretAnimation(feature, now = performance.now()) {
  const state = activeSecretAnimations.get(feature.id);
  if (!state) {
    return null;
  }
  const durationMs = feature.animation?.durationMs;
  if (Number.isFinite(durationMs) && durationMs > 0 && now - state.startedAt > durationMs) {
    activeSecretAnimations.delete(feature.id);
    return null;
  }
  return state;
}

function secretFeatureTracePathPosition(feature, now = performance.now()) {
  const animation = feature.animation;
  if (animation?.type !== 'trace-path' || !Array.isArray(animation.points) || animation.points.length === 0) {
    return null;
  }
  const active = activeSecretAnimation(feature, now);
  const autoLoop = animation.autoLoop === true || animation.presentation?.autoLoop === true;
  if (!active && !autoLoop) {
    return null;
  }
  const frameDurationMs = Number.isFinite(animation.frameDurationMs) && animation.frameDurationMs > 0
    ? animation.frameDurationMs
    : 1000 / 60;
  const phaseFrames = Number.isFinite(animation.phaseFrames)
    ? animation.phaseFrames
    : (Number.isFinite(animation.presentation?.phaseFrames) ? animation.presentation.phaseFrames : 0);
  const durationFrames = Number.isFinite(animation.durationMs) && animation.durationMs > 0
    ? animation.durationMs / frameDurationMs
    : 0;
  let elapsedFrameExact = (active ? (now - active.startedAt) / frameDurationMs : now / frameDurationMs) + phaseFrames;
  if (autoLoop && durationFrames > 0) {
    elapsedFrameExact = ((elapsedFrameExact % durationFrames) + durationFrames) % durationFrames;
  }
  const elapsedFrame = Math.floor(elapsedFrameExact);
  let low = 0;
  let high = animation.points.length - 1;
  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    if (animation.points[mid].frame <= elapsedFrame) {
      low = mid;
    } else {
      high = mid - 1;
    }
  }
  const point = animation.points[low];
  if (point.hidden === true) {
    return {
      worldX: point.worldX,
      worldY: point.worldY,
      segmentId: point.segmentId,
      hidden: true,
      elapsedFrameExact
    };
  }
  const nextPoint = animation.interpolate ? animation.points[low + 1] : null;
  if (nextPoint && nextPoint.frame > point.frame) {
    if (nextPoint.hidden === true) {
      return {
        worldX: point.worldX,
        worldY: point.worldY,
        segmentId: point.segmentId,
        elapsedFrameExact
      };
    }
    const amount = Math.max(0, Math.min(1, (elapsedFrameExact - point.frame) / (nextPoint.frame - point.frame)));
    return {
      worldX: point.worldX + (nextPoint.worldX - point.worldX) * amount,
      worldY: point.worldY + (nextPoint.worldY - point.worldY) * amount,
      segmentId: amount < 0.5 ? point.segmentId : nextPoint.segmentId,
      elapsedFrameExact
    };
  }
  return {
    worldX: point.worldX,
    worldY: point.worldY,
    segmentId: point.segmentId,
    elapsedFrameExact
  };
}

function secretFeatureWorldPosition(feature, now = performance.now()) {
  const tracePosition = secretFeatureTracePathPosition(feature, now);
  if (tracePosition) {
    return tracePosition;
  }
  const motion = secretFeatureMotionOffset(feature, now);
  return {
    worldX: feature.worldX + motion.x,
    worldY: feature.worldY + motion.y,
    segmentId: feature.segmentId
  };
}

function secretFeatureWorldRect(feature, renderer = activeRenderer()) {
  if (feature.bounds) {
    const offset = segmentDisplayOffset(feature.segmentId, renderer);
    return {
      x: feature.worldX + offset.x,
      y: feature.worldY + offset.y,
      width: feature.bounds.width,
      height: feature.bounds.height
    };
  }
  const render = feature.render || {};
  const bounds = render.opaqueBounds || render.bounds;
  const position = secretFeatureWorldPosition(feature);
  const offset = segmentDisplayOffset(position.segmentId || feature.segmentId, renderer);
  if (bounds) {
    return {
      x: position.worldX + offset.x + bounds.minX,
      y: position.worldY + offset.y + bounds.minY,
      width: bounds.width,
      height: bounds.height
    };
  }

  return {
    x: position.worldX + offset.x - 16,
    y: position.worldY + offset.y - 8,
    width: 32,
    height: 16
  };
}

function actorClassFor(actor) {
  return actor.classId ? activeRenderer()?.actorClassById.get(actor.classId) : null;
}

function boundsForActorOrientation(actor, bounds) {
  if (
    !actor?.flipHorizontal
    || !bounds
    || !Number.isFinite(bounds.minX)
    || !Number.isFinite(bounds.maxX)
  ) {
    return bounds;
  }
  const minX = -bounds.maxX;
  const maxX = -bounds.minX;
  return {
    ...bounds,
    minX,
    maxX,
    width: maxX - minX
  };
}

function actorWorldRect(actor) {
  const renderer = activeRenderer();
  if (actor.visualTileRect && !actorIsSecret(actor)) {
    const segment = renderer?.segmentById.get(actor.segmentId);
    if (segment) {
      const tileSize = segment.tileSize || 8;
      const position = segmentDisplayPosition(segment, renderer);
      return {
        x: position.x + actor.visualTileRect.x * tileSize,
        y: position.y + actor.visualTileRect.y * tileSize,
        width: actor.visualTileRect.width * tileSize,
        height: actor.visualTileRect.height * tileSize
      };
    }
  }

  const actorClass = actorClassFor(actor);
  const bounds = boundsForActorOrientation(
    actor,
    actorClass?.previewOpaqueBounds || actorClass?.opaqueBounds || actorClass?.bounds
  );
  const offset = segmentDisplayOffset(actor.segmentId, renderer);
  if (bounds) {
    return {
      x: actor.worldX + offset.x + bounds.minX,
      y: actor.worldY + offset.y + bounds.minY,
      width: bounds.width,
      height: bounds.height
    };
  }

  return {
    x: actor.worldX + offset.x - 8,
    y: actor.worldY + offset.y - 20,
    width: 16,
    height: 28
  };
}

function actorMatchesVariant(actor) {
  return (actor.variants || ['day', 'night']).includes(activeVariant());
}

function secretFeatureMatchesVariant(feature) {
  return (feature.variants || ['day', 'night']).includes(activeVariant());
}

function hotspotMatchesVariant(hotspot) {
  return (hotspot.variants || ['day', 'night']).includes(activeVariant())
    && segmentIdVisible(hotspot.segmentId);
}

function actorIsMapObject(actor) {
  return actor.kind === 'fixture';
}

function actorIsSecret(actor) {
  return actor.kind === 'secret';
}

function actorLayerVisible(actor) {
  return actorIsMapObject(actor) || actorIsSecret(actor) || state.showCharacters;
}

function actorHighlightVisible(actor) {
  if (actorIsMapObject(actor)) {
    return state.highlightMapObjects;
  }
  if (actorIsSecret(actor)) {
    return state.highlightSecrets;
  }
  return state.highlightCharacters;
}

function shouldRenderActor(actor) {
  return Boolean(actor.classId)
    && actorMatchesVariant(actor)
    && segmentIdVisible(actor.segmentId)
    && actorLayerVisible(actor)
    && (!actorIsSecret(actor) || state.showSecrets);
}

function shouldShowActorHotspot(actor) {
  return actorMatchesVariant(actor)
    && segmentIdVisible(actor.segmentId)
    && actorLayerVisible(actor)
    && (!actorIsSecret(actor) || state.showSecrets);
}

function secretFeatureLayerVisible(feature) {
  const visibilityLayer = feature.visibilityLayer || (feature.kind === 'secret' ? 'secrets' : 'always');
  if (visibilityLayer === 'secrets') {
    return state.showSecrets;
  }
  if (visibilityLayer === 'characters') {
    return state.showCharacters;
  }
  if (visibilityLayer === 'mapObjects') {
    return true;
  }
  if (visibilityLayer === 'triggered') {
    return state.showSecrets && Boolean(activeSecretAnimation(feature));
  }
  return true;
}

function secretFeatureHighlightVisible(feature) {
  const highlightLayer = feature.highlightLayer || (feature.kind === 'secret' ? 'secrets' : 'none');
  if (highlightLayer === 'secrets') {
    return state.highlightSecrets;
  }
  if (highlightLayer === 'characters') {
    return state.highlightCharacters;
  }
  if (highlightLayer === 'mapObjects') {
    return state.highlightMapObjects;
  }
  return false;
}

function shouldRenderSecretFeature(feature) {
  return secretFeatureLayerVisible(feature)
    && secretFeatureMatchesVariant(feature)
    && segmentIdVisible(feature.segmentId)
    && Boolean(feature.render?.frames?.length);
}

function shouldShowSecretFeatureHotspot(feature) {
  return feature.interactive !== false
    && secretFeatureLayerVisible(feature)
    && secretFeatureMatchesVariant(feature)
    && segmentIdVisible(feature.segmentId);
}

function makeElement(className, tag = 'div') {
  const element = document.createElement(tag);
  element.className = className;
  element.hidden = true;
  dom.overlay.append(element);
  return element;
}

function makeSvgElement(tagName, className) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tagName);
  if (className) {
    element.setAttribute('class', className);
  }
  return element;
}

function makeSecretFeatureHighlightShape(feature) {
  if (feature.highlightShape !== 'hidden-staircase') {
    return null;
  }

  const svg = makeSvgElement('svg', 'secret-feature-highlight-shape');
  svg.setAttribute('viewBox', `0 0 ${SECRET_FEATURE_HIGHLIGHT_SHAPE_VIEWBOX_SIZE} ${SECRET_FEATURE_HIGHLIGHT_SHAPE_VIEWBOX_SIZE}`);
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');

  const stairPath = [
    'M -8 0',
    'H 0',
    'V 8 H 8',
    'V 16 H 16',
    'V 24 H 24',
    'V 32 H 32',
    'V 40 H 40',
    'V 48 H 48',
    'V 56 H 56',
    'V 64 H 64',
    'V 72 H 72',
    'V 80 H 80',
    'V 88 H 88',
    'V 96'
  ].join(' ');
  const guidePath = makeSvgElement('path', 'secret-feature-highlight-shape-guide');
  guidePath.setAttribute('d', stairPath);
  const outlinePath = makeSvgElement('path', 'secret-feature-highlight-shape-outline');
  outlinePath.setAttribute('d', stairPath);
  svg.append(guidePath, outlinePath);
  return svg;
}

function cssPixelValue(value, fallback = 0) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function overlayElements() {
  return [
    ...hotspots.map((item) => item.element),
    ...destructibleHotspots.map((item) => item.element),
    ...actorHotspots.map((item) => item.element),
    ...secretFeatureHotspots.map((item) => item.element),
    ...itemBadges.map((item) => item.element),
    ...doorItemBadges.map((item) => item.element),
    ...secretFeatureItemBadges.map((item) => item.element)
  ].filter((element) => !element.hidden && element.getClientRects().length > 0);
}

function visualRectForOverlay(element) {
  const hitRect = element.getBoundingClientRect();
  const style = getComputedStyle(element);
  const x = cssPixelValue(style.getPropertyValue('--hotspot-x'));
  const y = cssPixelValue(style.getPropertyValue('--hotspot-y'));
  const width = cssPixelValue(style.getPropertyValue('--hotspot-width'), hitRect.width);
  const height = cssPixelValue(style.getPropertyValue('--hotspot-height'), hitRect.height);
  return {
    left: hitRect.left + x,
    top: hitRect.top + y,
    right: hitRect.left + x + width,
    bottom: hitRect.top + y + height,
    width,
    height
  };
}

function containsPoint(rect, x, y) {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

function distanceToRect(rect, x, y) {
  const dx = Math.max(rect.left - x, 0, x - rect.right);
  const dy = Math.max(rect.top - y, 0, y - rect.bottom);
  return Math.hypot(dx, dy);
}

function overlayPriority(element) {
  if (element.classList.contains('item-badge')) {
    return 70;
  }
  if (element.classList.contains('actor-hotspot') && element.classList.contains('is-npc')) {
    return 65;
  }
  if (element.classList.contains('hotspot') && element.classList.contains('is-clickable')) {
    return 60;
  }
  if (element.classList.contains('actor-hotspot') && element.classList.contains('is-secret')) {
    return 32;
  }
  if (element.classList.contains('secret-feature-hotspot')) {
    return 31;
  }
  if (element.classList.contains('actor-hotspot') && element.classList.contains('is-fixture')) {
    return 30;
  }
  if (element.classList.contains('destructible-hotspot')) {
    return 24;
  }
  return 10;
}

function resolveOverlayClickTarget(event, fallback) {
  if (event.detail === 0 || (event.clientX === 0 && event.clientY === 0)) {
    return fallback;
  }

  const candidates = overlayElements().map((element) => ({
    element,
    rect: visualRectForOverlay(element),
    priority: overlayPriority(element)
  }));
  const visualHits = candidates.filter((candidate) => containsPoint(candidate.rect, event.clientX, event.clientY));
  if (visualHits.length > 0) {
    visualHits.sort((a, b) => b.priority - a.priority || (a.rect.width * a.rect.height) - (b.rect.width * b.rect.height));
    return visualHits[0].element;
  }

  const hitRect = fallback.getBoundingClientRect();
  if (!containsPoint(hitRect, event.clientX, event.clientY)) {
    return fallback;
  }
  if (fallback.classList.contains('hotspot') && fallback.classList.contains('is-clickable')) {
    return fallback;
  }

  candidates.sort((a, b) => (
    distanceToRect(a.rect, event.clientX, event.clientY) - distanceToRect(b.rect, event.clientX, event.clientY)
    || b.priority - a.priority
  ));
  return candidates[0]?.element || fallback;
}

function addGuardedClick(element, handler) {
  overlayActionByElement.set(element, handler);
  let startX = 0;
  let startY = 0;
  let moved = false;
  element.addEventListener('pointerdown', (event) => {
    startX = event.clientX;
    startY = event.clientY;
    moved = false;
  });
  element.addEventListener('pointermove', (event) => {
    if (Math.hypot(event.clientX - startX, event.clientY - startY) > 8) {
      moved = true;
    }
  });
  element.addEventListener('click', (event) => {
    if (moved) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    const target = resolveOverlayClickTarget(event, element);
    const action = overlayActionByElement.get(target) || handler;
    action(event);
  });
}

function labelSegmentsForView(view, renderer) {
  const ids = view.labelSegmentIds || renderer.segments.map((segment) => segment.record.id);
  return ids
    .map((segmentId) => renderer.segmentById.get(segmentId))
    .filter(Boolean);
}

function buildOverlays() {
  const view = currentView();
  const renderer = view.renderer;
  if (!renderer) {
    return;
  }
  dom.overlay.replaceChildren();
  labels = [];
  sectionOutlines = [];
  routeConnectors = [];
  hotspots = [];
  destructibleHotspots = [];
  actorHotspots = [];
  secretFeatureHotspots = [];
  itemBadges = [];
  doorItemBadges = [];
  secretFeatureItemBadges = [];
  routeConnectorSvg = makeSvgElement('svg', 'route-connectors');
  labelLeaderSvg = makeSvgElement('svg', 'label-leaders');
  dom.overlay.append(routeConnectorSvg);
  dom.overlay.append(labelLeaderSvg);

  for (const segment of renderer.segments) {
    const element = makeElement('segment-outline');
    element.setAttribute('aria-hidden', 'true');
    element.hidden = !state.sectionOutlines;
    sectionOutlines.push({ element, segment: segment.record });
  }

  if (view.id === OVERWORLD_VIEW_ID) {
    for (const connector of OVERWORLD_ROUTE_CONNECTORS) {
      const element = makeSvgElement('polyline', 'route-connector-line');
      element.setAttribute('aria-hidden', 'true');
      routeConnectorSvg.append(element);
      routeConnectors.push({ element, connector });
    }
  }

  const labelSegments = labelSegmentsForView(view, renderer);
  for (let index = 0; index < labelSegments.length; index += 1) {
    const segment = labelSegments[index];
    const label = makeElement('label-chip');
    const frame = document.createElement('canvas');
    const text = document.createElement('span');
    const leader = makeSvgElement('line', 'label-leader-line');
    frame.className = 'label-frame-canvas';
    text.className = 'label-chip-text';
    frame.setAttribute('aria-hidden', 'true');
    label.append(frame, text);
    labelLeaderSvg.append(leader);
    labels.push({ element: label, canvas: frame, textElement: text, leader, segment, index });

  }

  const viewHotspots = view.hasDoorHotspots ? (renderer.manifest.doorHotspots || []) : [];
  for (const hotspot of viewHotspots) {
    const element = makeElement(`hotspot is-${hotspot.type}`, 'button');
    const itemRewards = hotspotItemRewards(hotspot);
    const itemLabel = joinedItemLabels(itemRewards);
    const accessibleLabel = itemLabel ? `${hotspot.label}; contains ${itemLabel}` : hotspot.label;
    element.type = 'button';
    element.title = itemLabel ? `${hotspot.label} (${itemLabel})` : hotspot.label;
    element.setAttribute('aria-label', accessibleLabel);
    if (hotspot.opensView) {
      element.classList.add('is-clickable');
      addGuardedClick(element, () => {
        noteGuideMusicViewIntent(hotspot.opensView, { segmentId: hotspot.segmentId });
        enterView(hotspot.opensView, {
          sourceElement: element
        });
      });
    } else {
      addGuardedClick(element, () => {
        noteGuideMusicInteraction({ segmentId: hotspot.segmentId });
        showGuideInspector({
          title: hotspot.label,
          summary: hotspot.note,
          anchorWorldRect: () => hotspotWorldRect(hotspot),
          details: [{ label: 'Relationship', value: 'Guide-authored door link for this proof slice.' }]
        });
      });
    }
    hotspots.push({ element, hotspot });

    itemRewards.forEach((itemReward, rewardIndex) => {
      const badge = makeElement('item-badge is-door-badge', 'button');
      const frameCanvas = document.createElement('canvas');
      const iconCanvas = document.createElement('canvas');
      badge.type = 'button';
      badge.title = `${itemReward.itemLabel} in ${hotspot.label.replace(/^Enter\s+/i, '')}`;
      badge.setAttribute('aria-label', `${itemReward.itemLabel} details`);
      frameCanvas.className = 'item-badge-frame-canvas';
      iconCanvas.className = 'item-badge-icon-canvas';
      frameCanvas.setAttribute('aria-hidden', 'true');
      iconCanvas.setAttribute('aria-hidden', 'true');
      badge.append(frameCanvas, iconCanvas);
      addGuardedClick(badge, () => {
        noteGuideMusicInteraction({ segmentId: hotspot.segmentId });
        showItemRewardCard(hotspot, itemReward);
      });
      doorItemBadges.push({
        element: badge,
        hotspot,
        itemReward,
        rewardIndex,
        rewardCount: itemRewards.length,
        frameCanvas,
        iconCanvas,
        renderedKey: null
      });
    });
  }

  for (const fixture of renderer.manifest.destructibleFixtures || []) {
    const element = makeElement('destructible-hotspot', 'button');
    element.type = 'button';
    element.title = fixture.label;
    element.setAttribute('aria-label', fixture.label);
    addGuardedClick(element, () => showDestructibleFixtureCard(fixture));
    destructibleHotspots.push({ element, fixture });
  }

  for (const feature of renderer.manifest.secretFeatures || []) {
    if (feature.interactive === false) {
      continue;
    }
    const highlightShape = makeSecretFeatureHighlightShape(feature);
    const kindClass = feature.kind ? ` is-${feature.kind}` : '';
    const element = makeElement(`secret-feature-hotspot${kindClass}${highlightShape ? ' has-highlight-shape' : ''}`, 'button');
    element.type = 'button';
    element.title = feature.label;
    element.setAttribute('aria-label', feature.label);
    if (highlightShape) {
      element.append(highlightShape);
    }
    addGuardedClick(element, () => showSecretFeatureCard(feature));
    secretFeatureHotspots.push({ element, feature });

    if (feature.itemReward) {
      const badge = makeElement('item-badge is-secret-badge', 'button');
      const frameCanvas = document.createElement('canvas');
      const iconCanvas = document.createElement('canvas');
      badge.type = 'button';
      badge.title = `${feature.itemReward.itemLabel} details`;
      badge.setAttribute('aria-label', `${feature.itemReward.itemLabel} details`);
      frameCanvas.className = 'item-badge-frame-canvas';
      iconCanvas.className = 'item-badge-icon-canvas';
      frameCanvas.setAttribute('aria-hidden', 'true');
      iconCanvas.setAttribute('aria-hidden', 'true');
      badge.append(frameCanvas, iconCanvas);
      addGuardedClick(badge, () => {
        noteGuideMusicInteraction({ segmentId: feature.segmentId });
        showItemDetailsCard({
          item: feature.itemReward,
          anchorWorldRect: () => secretFeatureWorldRect(feature)
        });
      });
      secretFeatureItemBadges.push({ element: badge, feature, frameCanvas, iconCanvas, renderedKey: null });
    }
  }

  for (const actor of renderer.manifest.actors || []) {
    const element = makeElement(`actor-hotspot is-${actor.kind}`, 'button');
    element.type = 'button';
    element.title = actor.label;
    element.setAttribute('aria-label', actor.label);
    addGuardedClick(element, () => showActorCard(actor));
    actorHotspots.push({ element, actor });

    const actorBadgeItem = actor.itemOffer || actor.itemReward;
    if (actorBadgeItem) {
      const badge = makeElement('item-badge is-character-badge', 'button');
      const frameCanvas = document.createElement('canvas');
      const iconCanvas = document.createElement('canvas');
      badge.type = 'button';
      badge.title = `${actorBadgeItem.itemLabel} details`;
      badge.setAttribute('aria-label', `${actorBadgeItem.itemLabel} details`);
      frameCanvas.className = 'item-badge-frame-canvas';
      iconCanvas.className = 'item-badge-icon-canvas';
      frameCanvas.setAttribute('aria-hidden', 'true');
      iconCanvas.setAttribute('aria-hidden', 'true');
      badge.append(frameCanvas, iconCanvas);
      addGuardedClick(badge, () => (
        actor.itemOffer ? showItemOfferCard(actor) : showActorRewardCard(actor)
      ));
      itemBadges.push({ element: badge, actor, frameCanvas, iconCanvas, renderedKey: null });
    }
  }
  lastLabelCollisionSignature = null;
}

function setElementHidden(element, hidden) {
  if (element.hidden !== hidden) {
    element.hidden = hidden;
  }
}

function setStyleValue(element, property, value) {
  if (element.style.getPropertyValue(property) !== value) {
    element.style.setProperty(property, value);
  }
}

function setStylePx(element, property, value) {
  const rounded = Number.isInteger(value) ? value : Number(value.toFixed(3));
  setStyleValue(element, property, `${rounded}px`);
}

function setSvgVisibility(element, visible) {
  const value = visible ? 'visible' : 'hidden';
  if (element.getAttribute('visibility') !== value) {
    element.setAttribute('visibility', value);
  }
}

function screenRectVisible(rect, margin = OVERLAY_SCREEN_CULL_MARGIN_PX) {
  return rect.left + rect.width >= -margin
    && rect.left <= window.innerWidth + margin
    && rect.top + rect.height >= -margin
    && rect.top <= window.innerHeight + margin;
}

function screenPointVisible(point, margin = OVERLAY_SCREEN_CULL_MARGIN_PX) {
  return point.x >= -margin
    && point.x <= window.innerWidth + margin
    && point.y >= -margin
    && point.y <= window.innerHeight + margin;
}

function setScreenRect(element, rect) {
  const left = Math.round(rect.left);
  const top = Math.round(rect.top);
  const width = Math.max(0, Math.round(rect.width));
  const height = Math.max(0, Math.round(rect.height));
  const key = `rect:${left}:${top}:${width}:${height}`;
  if (overlayBoxCache.get(element) === key) {
    return;
  }
  setStylePx(element, 'left', left);
  setStylePx(element, 'top', top);
  setStylePx(element, 'width', width);
  setStylePx(element, 'height', height);
  overlayBoxCache.set(element, key);
}

function setHitRect(element, rect) {
  const rectWidth = Math.max(0, Math.round(rect.width));
  const rectHeight = Math.max(0, Math.round(rect.height));
  const hitWidth = Math.max(44, rectWidth);
  const hitHeight = Math.max(44, rectHeight);
  const left = Math.round(rect.left + rect.width / 2 - hitWidth / 2);
  const top = Math.round(rect.top + rect.height / 2 - hitHeight / 2);
  const visualX = Math.round((hitWidth - rectWidth) / 2);
  const visualY = Math.round((hitHeight - rectHeight) / 2);
  const key = `hit:${left}:${top}:${hitWidth}:${hitHeight}:${visualX}:${visualY}:${rectWidth}:${rectHeight}`;
  if (overlayBoxCache.get(element) !== key) {
    setStylePx(element, 'left', left);
    setStylePx(element, 'top', top);
    setStylePx(element, 'width', hitWidth);
    setStylePx(element, 'height', hitHeight);
    setStylePx(element, '--hotspot-x', visualX);
    setStylePx(element, '--hotspot-y', visualY);
    setStylePx(element, '--hotspot-width', rectWidth);
    setStylePx(element, '--hotspot-height', rectHeight);
    overlayBoxCache.set(element, key);
  }
  return { hitWidth, hitHeight, visualX, visualY };
}

function itemBadgeScale(renderer = activeRenderer()) {
  if (!renderer?.canvas) {
    return 1;
  }
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  return Math.max(0.0001, renderer.camera.scale / dpr);
}

function itemBadgeVisualRect(actor, scale) {
  const renderer = activeRenderer();
  if (!renderer) {
    return null;
  }
  const actorRect = worldRectToScreen(renderer, actorWorldRect(actor));
  return itemBadgeRectForAnchor(actorRect, scale);
}

function itemBadgeRectForAnchor(anchorRect, scale) {
  const size = ITEM_BADGE_TILE_COLUMNS * 8 * scale;
  return {
    left: anchorRect.left + anchorRect.width / 2 - size / 2,
    top: anchorRect.top - ITEM_BADGE_GAP_PX - size,
    width: size,
    height: size
  };
}

function doorItemBadgeVisualRect(item, scale) {
  const renderer = activeRenderer();
  const worldRect = hotspotWorldRect(item.hotspot);
  if (!renderer || !worldRect) {
    return null;
  }
  const rect = itemBadgeRectForAnchor(worldRectToScreen(renderer, worldRect), scale);
  if (item.rewardCount > 1) {
    const spacing = rect.width + 2 * scale;
    rect.left += (item.rewardIndex - (item.rewardCount - 1) / 2) * spacing;
  }
  return rect;
}

function secretFeatureItemBadgeVisualRect(feature, scale) {
  const renderer = activeRenderer();
  const worldRect = secretFeatureWorldRect(feature);
  if (!renderer || !worldRect) {
    return null;
  }
  return itemBadgeRectForAnchor(worldRectToScreen(renderer, worldRect), scale);
}

function itemBadgeItemId(item) {
  return item.actor?.itemOffer?.itemId
    || item.actor?.itemReward?.itemId
    || item.itemReward?.itemId
    || item.feature?.itemReward?.itemId
    || null;
}

function hotspotItemRewards(hotspot) {
  if (Array.isArray(hotspot.itemRewards) && hotspot.itemRewards.length > 0) {
    return hotspot.itemRewards;
  }
  return hotspot.itemReward ? [hotspot.itemReward] : [];
}

function joinedItemLabels(items) {
  const labels = items.map((item) => item.itemLabel).filter(Boolean);
  if (labels.length <= 1) {
    return labels[0] || '';
  }
  if (labels.length === 2) {
    return `${labels[0]} and ${labels[1]}`;
  }
  return `${labels.slice(0, -1).join(', ')}, and ${labels[labels.length - 1]}`;
}

function renderItemBadge(item, scale, placement) {
  const itemId = itemBadgeItemId(item);
  if (!dialogRenderer || !itemIconRenderer || !itemId) {
    return;
  }
  const badgeScale = Math.round(scale * 1000) / 1000;
  const key = `${itemId}`;
  const frameSize = ITEM_BADGE_TILE_COLUMNS * 8 * badgeScale;
  const iconSize = 8 * badgeScale;
  if (item.renderedKey !== key) {
    const rendered = renderCv2DialogFrameToRgba({
      atlas: dialogRenderer.atlas,
      tileColumns: ITEM_BADGE_TILE_COLUMNS,
      tileRows: ITEM_BADGE_TILE_ROWS
    });
    const context = item.frameCanvas.getContext('2d', { alpha: true });
    item.frameCanvas.width = rendered.width;
    item.frameCanvas.height = rendered.height;
    context.imageSmoothingEnabled = false;
    context.putImageData(new ImageData(rendered.rgba, rendered.width, rendered.height), 0, 0);
    itemIconRenderer.renderIcon(item.iconCanvas, itemId, 1);
    item.renderedKey = key;
  }
  setStylePx(item.frameCanvas, 'left', placement.visualX);
  setStylePx(item.frameCanvas, 'top', placement.visualY);
  setStylePx(item.frameCanvas, 'width', frameSize);
  setStylePx(item.frameCanvas, 'height', frameSize);
  setStylePx(item.iconCanvas, 'left', placement.visualX + 8 * badgeScale);
  setStylePx(item.iconCanvas, 'top', placement.visualY + 8 * badgeScale);
  setStylePx(item.iconCanvas, 'width', iconSize);
  setStylePx(item.iconCanvas, 'height', iconSize);
}

function paddedRect(rect, padding) {
  return {
    left: rect.left - padding,
    top: rect.top - padding,
    right: rect.right + padding,
    bottom: rect.bottom + padding
  };
}

function rectsOverlap(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

function labelSide(segment) {
  return LABEL_BELOW_SEGMENT_IDS.has(segment.id) || LABEL_BELOW_SEGMENT_IDS.has(segment.sourceId)
    ? 'below'
    : 'above';
}

function labelPlacement(segment, overviewLabels = false) {
  const renderer = activeRenderer();
  const position = labelDisplayPosition(segment, renderer, overviewLabels);
  const side = labelSide(segment);
  const centerX = position.x + position.width / 2;
  const mapY = side === 'above' ? position.y : position.y + position.height;
  const labelY = side === 'above'
    ? position.y - LABEL_MAP_GAP
    : position.y + position.height + LABEL_MAP_GAP;
  return {
    side,
    labelAnchor: worldToScreen(renderer, centerX, labelY),
    mapAnchor: worldToScreen(renderer, centerX, mapY)
  };
}

function labelTransform(side, offsetY = 0) {
  const base = side === 'above' ? 'translate(-50%, -100%)' : 'translate(-50%, 0)';
  return `${base} translateY(${offsetY}px)`;
}

function guideLabelText(label) {
  return String(label)
    .replace(/\s+-\s+Door$/i, '')
    .replace(/\s+-\s+Part\s+(\d+)$/i, ' $1');
}

function shiftedRect(rect, offsetY) {
  return {
    left: rect.left,
    top: rect.top + offsetY,
    right: rect.right,
    bottom: rect.bottom + offsetY
  };
}

function updateLabelLeader(item) {
  const line = item.leader;
  if (!line) return;
  if (item.element.hidden || Math.abs(item.offsetY || 0) < LABEL_LEADER_THRESHOLD) {
    setSvgVisibility(line, false);
    return;
  }

  const edgeY = item.labelAnchor.y + (item.offsetY || 0);
  line.setAttribute('x1', `${Math.round(item.labelAnchor.x)}`);
  line.setAttribute('y1', `${Math.round(edgeY)}`);
  line.setAttribute('x2', `${Math.round(item.mapAnchor.x)}`);
  line.setAttribute('y2', `${Math.round(item.mapAnchor.y)}`);
  setSvgVisibility(line, true);
}

function separateOverlappingLabels() {
  const accepted = [];
  const visibleLabels = labels
    .filter((item) => !item.element.hidden)
    .sort((a, b) => (
      a.labelAnchor.y - b.labelAnchor.y
      || a.labelAnchor.x - b.labelAnchor.x
      || a.index - b.index
    ));

  for (const item of visibleLabels) {
    let offsetY = 0;
    const direction = item.side === 'above' ? -1 : 1;
    let rect = paddedRect(item.element.getBoundingClientRect(), LABEL_COLLISION_PADDING);

    for (let attempt = 0; attempt < 12; attempt += 1) {
      const overlap = accepted.find((acceptedRect) => rectsOverlap(rect, acceptedRect));
      if (!overlap) break;
      const nextOffset = direction < 0
        ? overlap.top - rect.bottom - LABEL_COLLISION_PADDING
        : overlap.bottom - rect.top + LABEL_COLLISION_PADDING;
      offsetY += nextOffset || direction * (LABEL_COLLISION_PADDING + 1);
      rect = shiftedRect(rect, nextOffset || direction * (LABEL_COLLISION_PADDING + 1));
    }

    item.offsetY = Math.round(offsetY);
    item.element.style.transform = labelTransform(item.side, item.offsetY);
    accepted.push(paddedRect(item.element.getBoundingClientRect(), LABEL_COLLISION_PADDING));
  }

  for (const item of labels) {
    updateLabelLeader(item);
  }
}

function updateOverlays() {
  const view = currentView();
  const renderer = view.renderer;
  if (!renderer?.manifest) return;

  for (const item of sectionOutlines) {
    const visible = state.sectionOutlines && segmentRecordVisible(item.segment);
    if (!visible) {
      setElementHidden(item.element, true);
      continue;
    }
    const rect = worldRectToScreen(renderer, segmentDisplayPosition(item.segment, renderer));
    if (!screenRectVisible(rect)) {
      setElementHidden(item.element, true);
      continue;
    }
    setElementHidden(item.element, false);
    setScreenRect(item.element, rect);
  }

  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const mapCssScale = renderer.camera.scale / dpr;
  const routeStrokeWidth = Math.max(ROUTE_CONNECTOR_MIN_SCREEN_PX, mapCssScale);
  const routeDash = Math.max(ROUTE_CONNECTOR_MIN_DASH_SCREEN_PX, ROUTE_CONNECTOR_DASH_WORLD_PX * mapCssScale);
  for (const item of routeConnectors) {
    const visible = routeConnectorVisible(item.connector, renderer);
    setSvgVisibility(item.element, visible);
    if (!visible) {
      continue;
    }
    const screenPoints = routeConnectorWorldPoints(item.connector, renderer)
      .map((point) => worldToScreen(renderer, point.x, point.y))
      .map((point) => `${Math.round(point.x)},${Math.round(point.y)}`);
    item.element.setAttribute('points', screenPoints.join(' '));
    item.element.setAttribute('stroke-width', routeStrokeWidth.toFixed(3));
    item.element.setAttribute('stroke-dasharray', `${routeDash.toFixed(3)} ${routeDash.toFixed(3)}`);
  }

  const overviewLabels = view.id === OVERWORLD_VIEW_ID && renderer.camera.scale < OVERVIEW_LABEL_SCALE;
  const visibleLabelSignatureParts = [];

  for (const item of labels) {
    const hiddenInOverview = overviewLabels && OVERVIEW_LABEL_HIDDEN_IDS.has(item.segment.id);
    const hiddenByLayer = !segmentRecordVisible(item.segment);
    if (!state.labels || hiddenInOverview || hiddenByLayer) {
      setElementHidden(item.element, true);
      if (item.leader) setSvgVisibility(item.leader, false);
      continue;
    }
    const labelText = guideLabelText(overviewLabels
      ? OVERVIEW_LABEL_TEXT.get(item.segment.id) || item.segment.label
      : item.segment.label);
    const placement = labelPlacement(item.segment, overviewLabels);
    const onScreen = screenPointVisible(placement.labelAnchor, LABEL_SCREEN_CULL_MARGIN_PX)
      || screenPointVisible(placement.mapAnchor, LABEL_SCREEN_CULL_MARGIN_PX);
    if (!onScreen) {
      setElementHidden(item.element, true);
      if (item.leader) setSvgVisibility(item.leader, false);
      continue;
    }
    labelRenderer?.render(item, labelText);
    setElementHidden(item.element, false);
    item.side = placement.side;
    item.labelAnchor = placement.labelAnchor;
    item.mapAnchor = placement.mapAnchor;
    setStylePx(item.element, 'left', placement.labelAnchor.x);
    setStylePx(item.element, 'top', placement.labelAnchor.y);
    setStyleValue(item.element, 'transform', labelTransform(placement.side, item.offsetY || 0));
    visibleLabelSignatureParts.push(`${item.segment.id}:${placement.side}:${labelText}`);
  }
  if (state.labels) {
    const labelCollisionSignature = [
      state.activeViewId,
      overviewLabels ? 'overview' : 'detail',
      Math.round(renderer.camera.scale * 1000),
      visibleLabelSignatureParts.join(',')
    ].join('|');
    if (labelCollisionSignature !== lastLabelCollisionSignature) {
      for (const item of labels) {
        if (item.element.hidden) continue;
        item.offsetY = 0;
        setStyleValue(item.element, 'transform', labelTransform(item.side));
      }
      separateOverlappingLabels();
      lastLabelCollisionSignature = labelCollisionSignature;
    } else {
      for (const item of labels) {
        updateLabelLeader(item);
      }
    }
  } else {
    lastLabelCollisionSignature = null;
  }

  for (const item of hotspots) {
    const worldRect = hotspotWorldRect(item.hotspot);
    if (!hotspotMatchesVariant(item.hotspot) || !worldRect) {
      setElementHidden(item.element, true);
      continue;
    }
    const rect = worldRectToScreen(renderer, worldRect);
    if (!screenRectVisible(rect)) {
      setElementHidden(item.element, true);
      continue;
    }
    setElementHidden(item.element, false);
    setHitRect(item.element, rect);
    item.element.classList.toggle('is-highlight-hidden', !state.highlightDoors);
  }

  for (const item of destructibleHotspots) {
    const worldRect = destructibleFixtureWorldRect(item.fixture);
    if (!state.showSecrets || !segmentIdVisible(item.fixture.segmentId) || !worldRect) {
      setElementHidden(item.element, true);
      continue;
    }
    const rect = worldRectToScreen(renderer, worldRect);
    if (!screenRectVisible(rect)) {
      setElementHidden(item.element, true);
      continue;
    }
    setElementHidden(item.element, false);
    setHitRect(item.element, rect);
    item.element.classList.toggle('is-highlight-hidden', !state.highlightSecrets);
  }

  for (const item of secretFeatureHotspots) {
    const visible = shouldShowSecretFeatureHotspot(item.feature);
    if (!visible) {
      setElementHidden(item.element, true);
      continue;
    }
    const rect = worldRectToScreen(renderer, secretFeatureWorldRect(item.feature));
    if (!screenRectVisible(rect)) {
      setElementHidden(item.element, true);
      continue;
    }
    setElementHidden(item.element, false);
    setHitRect(item.element, rect);
    item.element.classList.toggle('is-highlight-hidden', !secretFeatureHighlightVisible(item.feature));
  }

  for (const item of actorHotspots) {
    const visible = shouldShowActorHotspot(item.actor);
    if (!visible) {
      setElementHidden(item.element, true);
      continue;
    }
    const rect = worldRectToScreen(renderer, actorWorldRect(item.actor));
    if (!screenRectVisible(rect)) {
      setElementHidden(item.element, true);
      continue;
    }
    setElementHidden(item.element, false);
    setHitRect(item.element, rect);
    item.element.classList.toggle('is-highlight-hidden', !actorHighlightVisible(item.actor));
  }

  for (const item of itemBadges) {
    const visible = state.labels && Boolean(item.actor.itemOffer || item.actor.itemReward) && shouldShowActorHotspot(item.actor);
    if (!visible) {
      setElementHidden(item.element, true);
      continue;
    }
    const scale = itemBadgeScale(renderer);
    const rect = itemBadgeVisualRect(item.actor, scale);
    if (!rect || !screenRectVisible(rect)) {
      setElementHidden(item.element, true);
      continue;
    }
    setElementHidden(item.element, false);
    const placement = setHitRect(item.element, rect);
    renderItemBadge(item, scale, placement);
    item.element.classList.toggle('is-highlight-hidden', !state.highlightCharacters);
  }

  for (const item of doorItemBadges) {
    const visible = state.labels && Boolean(item.itemReward) && hotspotMatchesVariant(item.hotspot);
    if (!visible) {
      setElementHidden(item.element, true);
      continue;
    }
    const scale = itemBadgeScale(renderer);
    const rect = doorItemBadgeVisualRect(item, scale);
    if (!rect || !screenRectVisible(rect)) {
      setElementHidden(item.element, true);
      continue;
    }
    setElementHidden(item.element, false);
    const placement = setHitRect(item.element, rect);
    renderItemBadge(item, scale, placement);
    item.element.classList.toggle('is-highlight-hidden', !state.highlightDoors);
  }

  for (const item of secretFeatureItemBadges) {
    const visible = state.labels && Boolean(item.feature.itemReward) && shouldShowSecretFeatureHotspot(item.feature);
    if (!visible) {
      setElementHidden(item.element, true);
      continue;
    }
    const scale = itemBadgeScale(renderer);
    const rect = secretFeatureItemBadgeVisualRect(item.feature, scale);
    if (!rect || !screenRectVisible(rect)) {
      setElementHidden(item.element, true);
      continue;
    }
    setElementHidden(item.element, false);
    const placement = setHitRect(item.element, rect);
    renderItemBadge(item, scale, placement);
    item.element.classList.toggle('is-highlight-hidden', !secretFeatureHighlightVisible(item.feature));
  }
}

class Cv2DialogRenderer {
  constructor(box, frameCanvas, closeFrameCanvas, textElement, glyphs, atlas, itemIcons = null) {
    this.box = box;
    this.frameCanvas = frameCanvas;
    this.closeFrameCanvas = closeFrameCanvas;
    this.textElement = textElement;
    this.glyphs = glyphs;
    this.atlas = atlas;
    this.itemIcons = itemIcons;
    this.itemMentionMatcherCache = null;
    this.warnedGlyphs = new Set();
    this.frameContext = this.frameCanvas.getContext('2d', { alpha: false });
    this.closeFrameContext = this.closeFrameCanvas.getContext('2d', { alpha: false });
    this.surfaces = [{
      box: this.box,
      frameCanvas: this.frameCanvas,
      frameContext: this.frameContext,
      closeFrameCanvas: this.closeFrameCanvas,
      closeFrameContext: this.closeFrameContext,
      textElement: this.textElement
    }];
  }

  reset() {
    this.ensureSurfaceCount(1);
    this.textElement.textContent = '';
    this.box.removeAttribute('aria-label');
    this.box.classList.remove('is-dialog-separator');
    this.box.parentElement?.classList.remove('is-dialog-bundle');
    this.box.parentElement?.removeAttribute('aria-label');
  }

  createSurface() {
    const box = document.createElement('div');
    const frameCanvas = document.createElement('canvas');
    const textElement = document.createElement('p');
    box.className = 'dialog-box dialog-box-secondary';
    box.setAttribute('role', 'status');
    frameCanvas.className = 'dialog-frame-canvas';
    frameCanvas.setAttribute('aria-hidden', 'true');
    textElement.className = 'dialog-text';
    box.append(frameCanvas, textElement);
    this.box.parentElement?.append(box);
    return {
      box,
      frameCanvas,
      frameContext: frameCanvas.getContext('2d', { alpha: false }),
      closeFrameCanvas: null,
      closeFrameContext: null,
      textElement
    };
  }

  ensureSurfaceCount(count) {
    while (this.surfaces.length < count) {
      this.surfaces.push(this.createSurface());
    }
    while (this.surfaces.length > count) {
      const surface = this.surfaces.pop();
      surface?.box.remove();
    }
  }

  drawFrameToCanvas(
    canvas,
    context,
    tileColumns,
    tileRows,
    scale,
    horizontalRuleTileRows = [],
    paletteOverrides = {}
  ) {
    const rendered = renderCv2DialogFrameToRgba({
      atlas: this.atlas,
      tileColumns,
      tileRows,
      horizontalRuleTileRows,
      paletteOverrides
    });
    if (canvas.width !== rendered.width) {
      canvas.width = rendered.width;
    }
    if (canvas.height !== rendered.height) {
      canvas.height = rendered.height;
    }
    context.imageSmoothingEnabled = false;
    context.putImageData(new ImageData(rendered.rgba, rendered.width, rendered.height), 0, 0);

    const cssWidth = rendered.width * scale;
    const cssHeight = rendered.height * scale;
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;
    return { cssWidth, cssHeight };
  }

  drawFrame(surface, tileColumns, tileRows, scale, horizontalRuleTileRows = [], paletteOverrides = {}, renderClose = false) {
    const { cssWidth, cssHeight } = this.drawFrameToCanvas(
      surface.frameCanvas,
      surface.frameContext,
      tileColumns,
      tileRows,
      scale,
      horizontalRuleTileRows,
      paletteOverrides
    );
    surface.box.style.width = `${cssWidth}px`;
    surface.box.style.height = `${cssHeight}px`;
    if (renderClose && surface.closeFrameCanvas && surface.closeFrameContext) {
      this.drawFrameToCanvas(surface.closeFrameCanvas, surface.closeFrameContext, 3, 3, scale, [], paletteOverrides);
    }
  }

  itemMentionMatchers() {
    if (this.itemMentionMatcherCache) {
      return this.itemMentionMatcherCache;
    }
    if (!this.itemIcons?.items?.size) {
      this.itemMentionMatcherCache = [];
      return this.itemMentionMatcherCache;
    }
    const byPhrase = new Map();
    for (const [itemId, record] of this.itemIcons.items.entries()) {
      if (!this.itemIcons.iconRecord(itemId)) {
        continue;
      }
      const phrases = [record.label, ...(record.aliases || [])]
        .map((phrase) => normalizeCv2DialogText(phrase, this.glyphs).text.replace(/\s+/g, ' ').trim())
        .filter(Boolean);
      for (const phrase of phrases) {
        const current = byPhrase.get(phrase);
        if (!current || phrase.length > current.phrase.length) {
          byPhrase.set(phrase, {
            phrase,
            itemId,
            iconId: itemId,
            label: record.label || itemId
          });
        }
      }
    }
    this.itemMentionMatcherCache = Array.from(byPhrase.values())
      .sort((a, b) => b.phrase.length - a.phrase.length || a.phrase.localeCompare(b.phrase));
    return this.itemMentionMatcherCache;
  }

  itemBodyStartLine(layout) {
    const ruleLineIndex = layout.lines.findIndex((line) => isCv2DialogRuleLine(line));
    return ruleLineIndex >= 0 ? ruleLineIndex + 1 : 0;
  }

  layoutTextMap(layout, bodyStartLine = 0) {
    let text = '';
    const map = [];
    let includedLineCount = 0;
    layout.lines.forEach((line, lineIndex) => {
      if (lineIndex < bodyStartLine || isCv2DialogRuleLine(line)) {
        return;
      }
      if (includedLineCount > 0) {
        text += ' ';
        map.push(null);
      }
      for (let column = 0; column < line.length; column += 1) {
        text += line[column];
        map.push({ lineIndex, column });
      }
      includedLineCount += 1;
    });
    return { text, map };
  }

  itemPhraseBoundary(text, index) {
    const character = text[index];
    return !character || !ITEM_MENTION_CHARACTER_RE.test(character);
  }

  findItemMentions(layout, options = {}) {
    const matchers = this.itemMentionMatchers();
    if (matchers.length === 0) {
      return [];
    }
    const { text, map } = this.layoutTextMap(layout, options.bodyStartLine || 0);
    const occupied = new Array(text.length).fill(false);
    const mentions = [];

    for (const matcher of matchers) {
      let index = text.indexOf(matcher.phrase);
      while (index !== -1) {
        const end = index + matcher.phrase.length;
        const boundaryMatches = this.itemPhraseBoundary(text, index - 1)
          && this.itemPhraseBoundary(text, end);
        const mappedIndexes = [];
        for (let cursor = index; cursor < end; cursor += 1) {
          if (map[cursor]) {
            mappedIndexes.push(cursor);
          }
        }
        const overlaps = mappedIndexes.some((cursor) => occupied[cursor]);
        if (boundaryMatches && mappedIndexes.length > 0 && !overlaps) {
          for (const cursor of mappedIndexes) {
            occupied[cursor] = true;
          }
          const segmentByLine = new Map();
          for (const cursor of mappedIndexes) {
            const position = map[cursor];
            const segment = segmentByLine.get(position.lineIndex) || {
              lineIndex: position.lineIndex,
              startColumn: position.column,
              endColumn: position.column + 1
            };
            segment.startColumn = Math.min(segment.startColumn, position.column);
            segment.endColumn = Math.max(segment.endColumn, position.column + 1);
            segmentByLine.set(position.lineIndex, segment);
          }
          mentions.push({
            itemId: matcher.itemId,
            iconId: matcher.iconId,
            label: matcher.label,
            phrase: matcher.phrase,
            segments: Array.from(segmentByLine.values()).sort((a, b) => a.lineIndex - b.lineIndex)
          });
        }
        index = text.indexOf(matcher.phrase, index + 1);
      }
    }

    return mentions.sort((a, b) => {
      const aSegment = a.segments[0];
      const bSegment = b.segments[0];
      return aSegment.lineIndex - bSegment.lineIndex || aSegment.startColumn - bSegment.startColumn;
    });
  }

  inlineIconNode(icon, scale) {
    if (!this.itemIcons || !icon?.iconId) {
      return null;
    }
    const canvas = document.createElement('canvas');
    canvas.className = 'dialog-inline-icon';
    if (icon.itemId) {
      canvas.dataset.itemId = icon.itemId;
    }
    if (icon.label) {
      canvas.title = icon.label;
    }
    canvas.setAttribute('aria-hidden', 'true');
    return this.itemIcons.renderIcon(canvas, icon.iconId, scale) ? canvas : null;
  }

  itemMentionNode(textSpan, iconNode) {
    if (!iconNode) {
      return textSpan;
    }
    const mention = document.createElement('span');
    mention.className = 'dialog-item-mention';
    mention.dataset.itemId = textSpan.dataset.itemId;
    mention.title = textSpan.title;
    mention.append(textSpan, iconNode);
    return mention;
  }

  explicitInlineIconsByLine(displayLines, inlineIcons = []) {
    const iconsByLine = new Map();
    for (const icon of inlineIcons) {
      const lineIndex = Number.isInteger(icon.lineIndex)
        ? icon.lineIndex
        : displayLines.findIndex((line) => line === icon.lineText);
      if (lineIndex < 0) {
        continue;
      }
      if (!iconsByLine.has(lineIndex)) {
        iconsByLine.set(lineIndex, []);
      }
      iconsByLine.get(lineIndex).push(icon);
    }
    return iconsByLine;
  }

  trailingMentionPunctuation(line, cursor) {
    let end = cursor;
    while (end < line.length && /[.,?!]/.test(line[end])) {
      end += 1;
    }
    return {
      text: line.slice(cursor, end),
      end
    };
  }

  renderTextElement(surface, displayLines, itemMentions, inlineIcons, scale) {
    const segmentsByLine = new Map();
    for (const mention of itemMentions) {
      const lastSegment = mention.segments.at(-1);
      for (const segment of mention.segments) {
        if (!segmentsByLine.has(segment.lineIndex)) {
          segmentsByLine.set(segment.lineIndex, []);
        }
        segmentsByLine.get(segment.lineIndex).push({
          ...segment,
          itemId: mention.itemId,
          iconId: mention.iconId,
          label: mention.label,
          renderIconAfter: segment === lastSegment
        });
      }
    }
    const inlineIconsByLine = this.explicitInlineIconsByLine(displayLines, inlineIcons);

    const fragment = document.createDocumentFragment();
    displayLines.forEach((line, lineIndex) => {
      const segments = (segmentsByLine.get(lineIndex) || [])
        .sort((a, b) => a.startColumn - b.startColumn || b.endColumn - a.endColumn);
      let cursor = 0;
      for (const segment of segments) {
        if (segment.startColumn > cursor) {
          fragment.append(document.createTextNode(line.slice(cursor, segment.startColumn)));
        }
        const span = document.createElement('span');
        span.className = 'dialog-item-text';
        span.dataset.itemId = segment.itemId;
        span.title = segment.label;
        span.textContent = line.slice(segment.startColumn, segment.endColumn);
        cursor = segment.endColumn;
        if (segment.renderIconAfter) {
          const punctuation = this.trailingMentionPunctuation(line, cursor);
          cursor = punctuation.end;
          const icon = this.inlineIconNode(segment, scale);
          fragment.append(this.itemMentionNode(span, icon));
          if (punctuation.text) {
            fragment.append(document.createTextNode(punctuation.text));
          }
        } else {
          fragment.append(span);
        }
      }
      if (cursor < line.length) {
        fragment.append(document.createTextNode(line.slice(cursor)));
      }
      for (const icon of inlineIconsByLine.get(lineIndex) || []) {
        const iconNode = this.inlineIconNode(icon, scale);
        if (iconNode) {
          fragment.append(iconNode);
        }
      }
      if (lineIndex < displayLines.length - 1) {
        fragment.append(document.createTextNode('\n'));
      }
    });
    surface.textElement.replaceChildren(fragment);
  }

  renderSurface(surface, model, constraints, renderClose) {
    const layout = Cv2DialogLayout.layout(model.dialogText, this.glyphs, constraints);
    const scale = Math.max(1, Math.min(constraints.desiredScale, constraints.maxCssWidth / ((layout.textColumns + 4) * 8)));
    const tileColumns = layout.textColumns + 4;
    const tileRows = layout.lines.length * 2 + 2;
    const horizontalRuleTileRows = layout.lines
      .map((line, index) => (isCv2DialogRuleLine(line) ? 2 + index * 2 : null))
      .filter((tileY) => tileY != null);
    surface.box.style.setProperty('--dialog-scale', String(scale));
    surface.box.style.setProperty('--dialog-text-columns', String(layout.textColumns));
    surface.box.dataset.tileColumns = String(tileColumns);
    surface.box.dataset.tileRows = String(tileRows);
    surface.box.dataset.dialogTone = model.dialogTone || 'game';
    surface.box.classList.toggle('is-dialog-separator', model.bundleRole === 'separator');
    const paletteOverrides = model.dialogTone === GUIDE_AUTHORED_DIALOG_TONE
      ? { 1: GUIDE_AUTHORED_DIALOG_GREY_BORDER }
      : {};
    this.drawFrame(surface, tileColumns, tileRows, scale, horizontalRuleTileRows, paletteOverrides, renderClose);

    if (layout.unsupported.length > 0) {
      const key = layout.unsupported.join('');
      if (!this.warnedGlyphs.has(key)) {
        this.warnedGlyphs.add(key);
        console.warn(`CV2 dialog replaced unsupported glyphs: ${layout.unsupported.join(' ')}`);
      }
    }

    const displayLines = layout.lines.map((line) => (isCv2DialogRuleLine(line) ? '' : line));
    const spokenLines = layout.lines.filter((line) => !isCv2DialogRuleLine(line));
    const dialogText = spokenLines.join(' ');
    const itemMentions = model.dialogTone === GUIDE_AUTHORED_DIALOG_TONE
      ? this.findItemMentions(layout, { bodyStartLine: this.itemBodyStartLine(layout) })
      : [];
    const inlineIcons = model.dialogTone === GUIDE_AUTHORED_DIALOG_TONE
      ? (model.inlineIcons || [])
      : [];
    this.renderTextElement(surface, displayLines, itemMentions, inlineIcons, scale);
    const spokenText = dialogText.replace(/[.?!]+$/, '');
    const titleText = model.title || '';
    const ariaText = titleText && titleText.toUpperCase() !== spokenText.toUpperCase()
      ? `${titleText}. ${spokenText}.`
      : `${spokenText}.`;
    surface.box.setAttribute('aria-label', ariaText);
    return {
      dialogText,
      fullText: layout.lines.join(' ')
    };
  }

  render(model, desiredScale = undefined) {
    const dialogModels = (model.dialogs?.length ? model.dialogs : [model])
      .map((dialogModel) => ({
        ...dialogModel,
        title: dialogModel.title || model.title,
        anchorWorldRect: dialogModel.anchorWorldRect || model.anchorWorldRect
      }));
    this.ensureSurfaceCount(dialogModels.length);
    const bundle = dialogModels.length > 1;
    this.box.parentElement?.classList.toggle('is-dialog-bundle', bundle);
    const constraints = Cv2DialogLayout.constraints(window.innerWidth, window.innerHeight, { desiredScale });
    const results = dialogModels.map((dialogModel, index) => this.renderSurface(
      this.surfaces[index],
      dialogModel,
      constraints,
      index === 0
    ));
    const scale = this.surfaces[0]?.box.style.getPropertyValue('--dialog-scale') || String(constraints.desiredScale);
    this.box.dataset.cssScale = scale;
    this.box.parentElement?.setAttribute('aria-label', results.map((result) => result.dialogText).join(' '));
    return results[0] || { dialogText: '', fullText: '' };
  }
}

class Cv2LabelRenderer {
  constructor(glyphs, atlas) {
    this.glyphs = glyphs;
    this.atlas = atlas;
    this.frameCache = new Map();
    this.warnedGlyphs = new Set();
  }

  frame(tileColumns, tileRows) {
    const key = `${tileColumns}x${tileRows}`;
    if (!this.frameCache.has(key)) {
      this.frameCache.set(key, renderCv2DialogFrameToRgba({
        atlas: this.atlas,
        tileColumns,
        tileRows,
        paletteOverrides: {
          1: LABEL_DIALOG_GREY_BORDER
        }
      }));
    }
    return this.frameCache.get(key);
  }

  render(item, sourceText) {
    if (!item.canvas || !item.textElement || item.renderedLabelText === sourceText) {
      return;
    }

    const normalized = normalizeCv2DialogText(sourceText, this.glyphs);
    const labelText = normalized.text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .join(' ');
    const layout = {
      ...normalized,
      textColumns: Math.max(LABEL_DIALOG_MIN_TEXT_COLUMNS, labelText.length),
      lines: [labelText]
    };
    const textColumns = Math.max(
      LABEL_DIALOG_MIN_TEXT_COLUMNS,
      Math.max(...layout.lines.map((line) => line.length))
    );
    const tileColumns = textColumns + 4;
    const tileRows = layout.lines.length * 2 + 2;
    const frame = this.frame(tileColumns, tileRows);
    const context = item.canvas.getContext('2d', { alpha: true });
    if (item.canvas.width !== frame.width) {
      item.canvas.width = frame.width;
    }
    if (item.canvas.height !== frame.height) {
      item.canvas.height = frame.height;
    }
    context.imageSmoothingEnabled = false;
    context.putImageData(new ImageData(frame.rgba, frame.width, frame.height), 0, 0);

    const cssWidth = frame.width * LABEL_DIALOG_SCALE;
    const cssHeight = frame.height * LABEL_DIALOG_SCALE;
    item.element.style.setProperty('--label-scale', String(LABEL_DIALOG_SCALE));
    item.element.style.setProperty('--label-text-columns', String(textColumns));
    item.element.style.width = `${cssWidth}px`;
    item.element.style.height = `${cssHeight}px`;
    item.canvas.style.width = `${cssWidth}px`;
    item.canvas.style.height = `${cssHeight}px`;
    item.textElement.textContent = layout.lines.join('\n');
    item.element.setAttribute('aria-label', layout.lines.join(' '));
    item.element.title = layout.lines.join(' ');
    item.renderedLabelText = sourceText;

    if (layout.unsupported.length > 0) {
      const key = layout.unsupported.join('');
      if (!this.warnedGlyphs.has(key)) {
        this.warnedGlyphs.add(key);
        console.warn(`CV2 label replaced unsupported glyphs: ${layout.unsupported.join(' ')}`);
      }
    }
  }
}

class Cv2ItemIconRenderer {
  constructor(atlas, itemIconManifest = null) {
    this.atlas = atlas;
    this.manifest = itemIconManifest || {};
    this.palette = paletteBytesFromHex(this.manifest.palette || MENU_ITEM_ICON_PALETTE);
    this.items = new Map(Object.entries(this.manifest.items || {}));
    this.icons = new Map(Object.entries(this.manifest.icons || {}));
  }

  iconRecord(iconId) {
    return this.items.get(iconId) || this.icons.get(iconId) || null;
  }

  iconTile(iconId) {
    const record = this.iconRecord(iconId);
    return record ? numericByte(record.iconTile) : null;
  }

  renderIcon(canvas, iconId, scale = 1) {
    const tile = this.iconTile(iconId);
    if (tile == null) {
      return false;
    }
    return this.renderTile(canvas, tile, scale);
  }

  renderTile(canvas, tileIndex, scale = 1) {
    if (!canvas || !this.atlas?.pixels) {
      return false;
    }
    const nativeSize = 8;
    if (canvas.width !== nativeSize) {
      canvas.width = nativeSize;
    }
    if (canvas.height !== nativeSize) {
      canvas.height = nativeSize;
    }
    const context = canvas.getContext('2d', { alpha: true });
    if (!context) {
      return false;
    }

    const tileX = (tileIndex % this.atlas.tilesPerRow) * nativeSize;
    const tileY = Math.floor(tileIndex / this.atlas.tilesPerRow) * nativeSize;
    const rgba = new Uint8ClampedArray(nativeSize * nativeSize * 4);
    for (let y = 0; y < nativeSize; y += 1) {
      for (let x = 0; x < nativeSize; x += 1) {
        const colorId = this.atlas.pixels[(tileY + y) * this.atlas.width + tileX + x] || 0;
        const output = (y * nativeSize + x) * 4;
        if (colorId === 0) {
          rgba[output + 3] = 0;
          continue;
        }
        const nesColor = this.palette[colorId] ?? this.palette[0] ?? 0x0f;
        const [red, green, blue] = NES_PALETTE[nesColor] || [0, 0, 0];
        rgba[output] = red;
        rgba[output + 1] = green;
        rgba[output + 2] = blue;
        rgba[output + 3] = 255;
      }
    }
    context.imageSmoothingEnabled = false;
    context.putImageData(new ImageData(rgba, nativeSize, nativeSize), 0, 0);
    const cssSize = nativeSize * scale;
    canvas.style.width = `${cssSize}px`;
    canvas.style.height = `${cssSize}px`;
    return true;
  }
}

function renderDefinitionList(list, rows = []) {
  const nodes = [];
  for (const row of rows) {
    const dt = document.createElement('dt');
    const dd = document.createElement('dd');
    dt.textContent = row.label;
    dd.textContent = row.value;
    nodes.push(dt, dd);
  }
  list.replaceChildren(...nodes);
}

function hideGuideCard() {
  activeGuideModel = null;
  dom.guideCard.hidden = true;
  dialogRenderer?.reset();
}

function renderGuideCard() {
  if (!activeGuideModel || !dialogRenderer) {
    dom.guideCard.hidden = true;
    return;
  }
  if (activeGuideModel.refresh) {
    Object.assign(activeGuideModel, activeGuideModel.refresh());
  }
  const dialogScale = dialogScaleForMap();
  dialogRenderer.render(activeGuideModel, dialogScale);
  dom.dialogBox.dataset.cssScale = String(dialogScale);
  dom.guideCard.hidden = false;
  placeAnchoredPanel(dom.guideCard, activeGuideModel, 'above');
}

function showGuideCard(model) {
  activeInspectorModel = null;
  dom.guideInspector.hidden = true;
  activeGuideModel = model;
  renderGuideCard();
}

function hideGuideInspector() {
  activeInspectorModel = null;
  dom.guideInspector.hidden = true;
  dom.guideInspectorTitle.textContent = '';
  dom.guideInspectorSummary.textContent = '';
  dom.guideInspectorList.replaceChildren();
}

function renderGuideInspector() {
  if (!activeInspectorModel) {
    dom.guideInspector.hidden = true;
    return;
  }
  if (activeInspectorModel.refresh) {
    Object.assign(activeInspectorModel, activeInspectorModel.refresh());
  }
  dom.guideInspector.hidden = false;
  dom.guideInspectorTitle.textContent = activeInspectorModel.title;
  dom.guideInspectorSummary.textContent = activeInspectorModel.summary || '';
  renderDefinitionList(dom.guideInspectorList, activeInspectorModel.details || []);
  placeAnchoredPanel(dom.guideInspector, activeInspectorModel, 'right');
}

function showGuideInspector(model) {
  hideGuideCard();
  activeInspectorModel = model;
  renderGuideInspector();
}

function hpDialogValue(value) {
  return value == null ? 'none' : String(value);
}

function isInteriorEnemyDialogContext() {
  const view = currentView();
  return view.id !== OVERWORLD_VIEW_ID && view.supportsPalette === false;
}

function singleHpDialogValue(hp) {
  return hp.day ?? hp.night;
}

function enemyDialogText(actor) {
  const hp = actor.hp || {};
  if (isInteriorEnemyDialogContext()) {
    return `${actor.label}\n----------\nHP - ${hpDialogValue(singleHpDialogValue(hp))}`;
  }
  return `${actor.label}\n----------\nDay HP - ${hpDialogValue(hp.day)}\nNight HP - ${hpDialogValue(hp.night)}`;
}

function showDestructibleFixtureCard(fixture) {
  noteGuideMusicInteraction({ segmentId: fixture.segmentId });
  const action = fixture.action || "Break these blocks with Holy Water, or equip Dracula's Nail and whip them.";
  showGuideCard({
    title: fixture.label,
    dialogText: fixture.dialogText || `${fixture.label}\n----------\n${action}`,
    dialogTone: GUIDE_AUTHORED_DIALOG_TONE,
    anchorWorldRect: () => destructibleFixtureWorldRect(fixture)
  });
}

function triggerSecretFeatureAnimation(featureId) {
  if (!featureId) {
    return;
  }
  const feature = activeRenderer()?.manifest?.secretFeatures?.find((candidate) => candidate.id === featureId);
  if (!feature?.animation) {
    return;
  }
  activeSecretAnimations.set(featureId, {
    startedAt: performance.now()
  });
}

function showSecretFeatureCard(feature) {
  noteGuideMusicInteraction({ segmentId: feature.segmentId });
  triggerSecretFeatureAnimation(feature.triggerAnimationFeatureId);

  if (Array.isArray(feature.dialogs) && feature.dialogs.length > 0) {
    showGuideCard({
      title: feature.label,
      dialogs: feature.dialogs,
      anchorWorldRect: () => secretFeatureWorldRect(feature)
    });
    return;
  }

  showGuideCard({
    title: feature.label,
    dialogText: feature.dialog?.text || `${feature.label}\n----------\n${feature.condition?.playerFacing || 'Secret guide detail.'}`,
    dialogTone: feature.dialog?.tone || GUIDE_AUTHORED_DIALOG_TONE,
    anchorWorldRect: () => secretFeatureWorldRect(feature)
  });
}

function secretGuideDialogText(actor) {
  const secret = actor.secret || {};
  const lines = [actor.label, '----------'];
  let actionLine = secret.action || null;
  if (secret.type === 'garlic-revealed-merchant') {
    const reward = actor.itemReward?.itemLabel || secret.reward;
    if (reward) {
      const rewardPhrase = /^the\b/i.test(reward) ? reward : `the ${reward}`;
      actionLine = actionLine
        ? `${actionLine} He gives Simon ${rewardPhrase}.`
        : `He gives Simon ${rewardPhrase}.`;
    }
  }
  if (actionLine) {
    lines.push(actionLine);
  }
  return lines.join('\n');
}

function itemOfferCostLine(offer) {
  if (offer.costLabel) {
    return offer.costLabel;
  }
  return `Cost - ${offer.costHearts}`;
}

function itemOfferMerchantText(offer) {
  return [
    offer.roleLabel,
    '----------',
    itemOfferCostLine(offer)
  ].join('\n');
}

function itemOfferCostIcon(offer) {
  if (!Number.isFinite(offer.costHearts)) {
    return null;
  }
  return {
    iconId: ITEM_BADGE_HEART_ICON_ID,
    lineText: itemOfferCostLine(offer).toUpperCase(),
    columnOffset: 1
  };
}

function showItemDetailsCard({ item, anchorWorldRect }) {
  if (!item) {
    return;
  }
  showGuideCard({
    title: item.itemLabel,
    dialogText: [
      item.itemLabel,
      '----------',
      item.manualText || 'Guide details for this item are not attached yet.'
    ].join('\n'),
    dialogTone: GUIDE_AUTHORED_DIALOG_TONE,
    anchorWorldRect
  });
}

function showItemOfferCard(actor) {
  noteGuideMusicInteraction({ segmentId: actor.segmentId, actor });
  showItemDetailsCard({
    item: actor.itemOffer,
    anchorWorldRect: () => actorWorldRect(actor)
  });
}

function showActorRewardCard(actor) {
  noteGuideMusicInteraction({ segmentId: actor.segmentId, actor });
  showItemDetailsCard({
    item: actor.itemReward,
    anchorWorldRect: () => actorWorldRect(actor)
  });
}

function showItemRewardCard(hotspot, itemReward = hotspot.itemReward) {
  noteGuideMusicInteraction({ segmentId: hotspot.segmentId });
  showItemDetailsCard({
    item: itemReward,
    anchorWorldRect: () => hotspotWorldRect(hotspot)
  });
}

function showItemMerchantCard(actor) {
  noteGuideMusicInteraction({ segmentId: actor.segmentId, actor });
  const offer = actor.itemOffer;
  showGuideCard({
    title: offer.roleLabel,
    anchorWorldRect: () => actorWorldRect(actor),
    dialogs: [
      {
        title: offer.roleLabel,
        dialogText: itemOfferMerchantText(offer),
        dialogTone: GUIDE_AUTHORED_DIALOG_TONE,
        inlineIcons: [itemOfferCostIcon(offer)].filter(Boolean)
      },
      {
        title: actor.label,
        dialogText: actor.text
      }
    ]
  });
}

function showStackedActorGuideCard(actor) {
  noteGuideMusicInteraction({ segmentId: actor.segmentId, actor });
  showGuideCard({
    title: actor.label,
    anchorWorldRect: () => actorWorldRect(actor),
    dialogs: [
      {
        title: actor.label,
        dialogText: actor.guideDialog.text,
        dialogTone: actor.guideDialog.tone || GUIDE_AUTHORED_DIALOG_TONE
      },
      {
        title: actor.label,
        dialogText: actor.text
      }
    ]
  });
}

function romDialogVariantGuideLine(variant) {
  if (variant.guideLine) {
    return variant.guideLine;
  }
  return variant.effect
    ? `${variant.label} has a route effect.`
    : `${variant.label} is shown normally.`;
}

function actorRomDialogVariantsModel(actor) {
  if (!state.showSecrets) {
    return {
      title: actor.label,
      dialogText: actor.text,
      dialogs: null,
      anchorWorldRect: () => actorWorldRect(actor)
    };
  }

  const [defaultVariant, secretVariant] = actor.romDialogVariants;
  return {
    title: actor.label,
    anchorWorldRect: () => actorWorldRect(actor),
    dialogs: [
      {
        title: `${actor.label} ${defaultVariant.label}`,
        dialogText: defaultVariant.text
      },
      {
        title: actor.label,
        dialogText: romDialogVariantGuideLine(secretVariant),
        dialogTone: GUIDE_AUTHORED_DIALOG_TONE,
        bundleRole: 'separator'
      },
      {
        title: `${actor.label} ${secretVariant.label}`,
        dialogText: secretVariant.text
      }
    ]
  };
}

function showActorRomDialogVariantsCard(actor) {
  noteGuideMusicInteraction({ segmentId: actor.segmentId, actor });
  showGuideCard({
    ...actorRomDialogVariantsModel(actor),
    refresh: () => actorRomDialogVariantsModel(actor)
  });
}

function showActorCard(actor) {
  noteGuideMusicInteraction({ segmentId: actor.segmentId, actor });
  if (actor.kind === 'secret') {
    showSecretCard(actor);
    return;
  }

  if (actor.kind === 'player') {
    showGuideCard({
      title: actor.label,
      dialogText: actor.guideDialog?.text || actor.label,
      dialogTone: actor.guideDialog?.tone || GUIDE_AUTHORED_DIALOG_TONE,
      anchorWorldRect: () => actorWorldRect(actor)
    });
    return;
  }

  if (actor.kind === 'enemy') {
    showGuideCard({
      title: actor.label,
      dialogText: enemyDialogText(actor),
      dialogTone: GUIDE_AUTHORED_DIALOG_TONE,
      anchorWorldRect: () => actorWorldRect(actor)
    });
    return;
  }

  if (actor.itemOffer && actor.text) {
    showItemMerchantCard(actor);
    return;
  }

  if (Array.isArray(actor.romDialogVariants) && actor.romDialogVariants.length > 1) {
    showActorRomDialogVariantsCard(actor);
    return;
  }

  if (actor.guideDialog && actor.text) {
    showStackedActorGuideCard(actor);
    return;
  }

  if (!actor.text) {
    showGuideInspector({
      title: actor.label,
      summary: 'No decoded dialogue text is attached to this actor row.',
      anchorWorldRect: () => actorWorldRect(actor),
      details: []
    });
    return;
  }

  showGuideCard({
    title: actor.label,
    dialogText: actor.text,
    anchorWorldRect: () => actorWorldRect(actor)
  });
}

function showSecretCard(actor) {
  const secret = actor.secret || {};
  const hasGuideText = Boolean(secret.action);
  const lines = [];
  if (secret.action) {
    lines.push(secret.action);
  }
  if (secret.reward) {
    lines.push(`Reward ${secret.reward}.`);
  }
  if (actor.text) {
    lines.push(actor.text);
  }
  if (actor.text && hasGuideText) {
    showGuideCard({
      title: actor.label,
      anchorWorldRect: () => actorWorldRect(actor),
      dialogs: [
        {
          title: actor.label,
          dialogText: secretGuideDialogText(actor),
          dialogTone: GUIDE_AUTHORED_DIALOG_TONE
        },
        {
          title: actor.label,
          dialogText: actor.text
        }
      ]
    });
    return;
  }

  if (actor.text) {
    showGuideCard({
      title: actor.label,
      dialogText: actor.text,
      anchorWorldRect: () => actorWorldRect(actor)
    });
    return;
  }

  showGuideCard({
    title: actor.label,
    dialogText: lines.length ? [actor.label, '----------', ...lines].join('\n') : 'Secret details are attached to this actor row.',
    dialogTone: GUIDE_AUTHORED_DIALOG_TONE,
    anchorWorldRect: () => actorWorldRect(actor)
  });
}

function syncControls() {
  const view = currentView();
  updateGuideMusicControl();
  dom.labelsToggle.checked = state.labels;
  dom.sectionOutlinesToggle.checked = state.sectionOutlines;
  dom.highlightDoorsToggle.checked = state.highlightDoors;
  dom.showCharactersToggle.checked = state.showCharacters;
  dom.showSecretsToggle.checked = state.showSecrets;
  dom.highlightCharactersToggle.checked = state.highlightCharacters;
  dom.highlightMapObjectsToggle.checked = state.highlightMapObjects;
  dom.highlightSecretsToggle.checked = state.highlightSecrets;
  if (view.supportsPalette) {
    const nextVariant = state.variant === 'day' ? 'night' : 'day';
    const currentLabel = state.variant === 'day' ? 'Day' : 'Night';
    const nextLabel = nextVariant === 'day' ? 'day' : 'night';
    const paletteLabel = `${currentLabel} palette active. Switch to ${nextLabel} palette`;
    drawChromeIcon(dom.paletteToggleIcon, state.variant === 'night' ? CHROME_ICONS.moon : CHROME_ICONS.sun);
    dom.paletteToggle.setAttribute('aria-label', paletteLabel);
    dom.paletteToggle.title = paletteLabel;
    dom.paletteToggle.setAttribute('aria-pressed', state.variant === 'night' ? 'true' : 'false');
  } else {
    drawChromeIcon(dom.paletteToggleIcon, CHROME_ICONS.back);
    dom.paletteToggle.setAttribute('aria-label', 'Return to exterior map');
    dom.paletteToggle.title = 'Return to exterior map';
    dom.paletteToggle.setAttribute('aria-pressed', 'false');
  }
  drawChromeIcon(dom.resetToggleIcon, CHROME_ICONS.reset);
  dom.resetToggle.setAttribute('aria-label', 'Reset guide to Jova spawn');
  dom.resetToggle.title = 'Reset guide to Jova spawn';
  drawChromeIcon(dom.optionsToggleIcon, CHROME_ICONS.layers);
  const layersLabel = dom.optionsPanel.hidden ? 'Show guide layers' : 'Hide guide layers';
  dom.optionsToggle.setAttribute('aria-label', layersLabel);
  dom.optionsToggle.title = layersLabel;
  dom.optionsToggle.setAttribute('aria-expanded', dom.optionsPanel.hidden ? 'false' : 'true');
}

function syncLayerStateFromControls() {
  state.labels = dom.labelsToggle.checked;
  state.sectionOutlines = dom.sectionOutlinesToggle.checked;
  state.highlightDoors = dom.highlightDoorsToggle.checked;
  state.showCharacters = dom.showCharactersToggle.checked;
  state.showSecrets = dom.showSecretsToggle.checked;
  state.highlightCharacters = dom.highlightCharactersToggle.checked;
  state.highlightMapObjects = dom.highlightMapObjectsToggle.checked;
  state.highlightSecrets = dom.highlightSecretsToggle.checked;
}

function setActiveView(viewId, { resetCamera = false } = {}) {
  const view = MAP_VIEWS[viewId] || MAP_VIEWS[OVERWORLD_VIEW_ID];
  const previousViewId = state.activeViewId;
  state.activeViewId = view.id;
  activeSecretAnimations.clear();
  for (const candidate of Object.values(MAP_VIEWS)) {
    if (!candidate.renderer?.canvas) continue;
    candidate.renderer.canvas.hidden = candidate.id !== view.id;
    candidate.renderer.canvas.setAttribute('aria-label', candidate.ariaLabel);
  }
  if (resetCamera) {
    focusActiveView({ reset: true, view });
  }
  buildOverlays();
  noteGuideMusicViewChange(view.id, previousViewId);
  syncControls();
}

async function transitionToView(viewId, { resetCamera = false, focusTarget = null } = {}) {
  const view = MAP_VIEWS[viewId] || MAP_VIEWS[OVERWORLD_VIEW_ID];
  if (state.transitioning && transitionTargetViewId === view.id) {
    return;
  }
  const needsLoader = viewNeedsLoad(view);
  const token = ++viewTransitionToken;
  state.transitioning = true;
  transitionTargetViewId = view.id;
  stopPanInertia();
  hideGuideCard();
  hideGuideInspector();
  dom.viewTransition.classList.add('is-active');
  await wait(VIEW_TRANSITION_MS);
  if (token !== viewTransitionToken) return;
  if (needsLoader) {
    setLoadingState({
      active: true,
      label: `${view.label} - LOADING MANIFEST`,
      progress: 0
    });
  }
  await ensureViewLoaded(view.id, {
    onProgress: needsLoader
      ? ({ progress, label }) => setLoadingState({
        active: true,
        label: `${view.label} - ${label}`,
        progress
      })
      : null
  });
  if (token !== viewTransitionToken) {
    if (needsLoader) {
      hideLoadingState();
    }
    return;
  }
  setActiveView(view.id, { resetCamera });
  if (needsLoader) {
    hideLoadingState();
  }
  await wait(VIEW_TRANSITION_HOLD_MS);
  if (token !== viewTransitionToken) return;
  dom.viewTransition.classList.remove('is-active');
  await wait(VIEW_TRANSITION_MS);
  if (token !== viewTransitionToken) return;
  state.transitioning = false;
  transitionTargetViewId = null;
  if (focusTarget && document.contains(focusTarget)) {
    focusTarget.focus();
  } else {
    activeRenderer()?.canvas?.focus({ preventScroll: true });
  }
}

function enterView(viewId, { sourceElement = null } = {}) {
  const nextView = MAP_VIEWS[viewId] ? viewId : OVERWORLD_VIEW_ID;
  if (nextView === state.activeViewId) {
    return;
  }
  if (sourceElement) {
    pendingReturnFocus = sourceElement;
  }
  transitionToView(nextView, {
    resetCamera: nextView !== OVERWORLD_VIEW_ID,
    focusTarget: nextView === OVERWORLD_VIEW_ID ? pendingReturnFocus : dom.paletteToggle
  }).then(() => {
    if (nextView === OVERWORLD_VIEW_ID) {
      pendingReturnFocus = null;
    }
    saveUrlViewStateNow();
  });
}

function leaveView() {
  if (state.activeViewId === OVERWORLD_VIEW_ID) {
    return;
  }
  enterView(OVERWORLD_VIEW_ID);
}

function restoreDefaultGuideState() {
  Object.assign(state, DEFAULT_GUIDE_STATE);
}

async function resetGuideToDefault() {
  stopPanInertia();
  hideGuideCard();
  hideGuideInspector();
  dom.optionsPanel.hidden = true;
  pendingReturnFocus = null;
  restoreDefaultGuideState();
  guideMusicLastSegmentId = DEFAULT_MUSIC_SEGMENT_ID;
  guideMusicLastActorClassId = null;
  guideMusicLastActorId = null;
  syncControls();

  if (state.activeViewId === OVERWORLD_VIEW_ID) {
    setActiveView(OVERWORLD_VIEW_ID, { resetCamera: true });
    activeRenderer()?.canvas?.focus({ preventScroll: true });
  } else {
    await transitionToView(OVERWORLD_VIEW_ID, {
      resetCamera: true,
      focusTarget: dom.resetToggle
    });
  }

  syncControls();
  updateOverlays();
  syncGuideMusic();
  clearUrlViewState();
}

async function initializeActiveViewFromUrl({ onSceneLoadProgress = null } = {}) {
  const urlState = parseUrlViewState();
  state.activeViewId = OVERWORLD_VIEW_ID;
  await ensureViewLoaded(OVERWORLD_VIEW_ID);

  if (urlState) {
    if (urlState.variant) {
      state.variant = urlState.variant;
    }
    applyUrlViewOptions(urlState.options);
    applyUrlCameraState(mapRenderer, urlState.overworldCamera);
    await ensureViewLoaded(urlState.viewId, { onProgress: onSceneLoadProgress });
    setActiveView(urlState.viewId, { resetCamera: !urlState.camera });
    applyUrlCameraState(activeRenderer(), urlState.camera);
    applyUrlMusicState(urlState.music);
    syncControls();
    updateOverlays();
  } else {
    setActiveView(OVERWORLD_VIEW_ID, { resetCamera: true });
  }

  primeUrlViewStateTracking();
}

function attachInput() {
  const pointers = new Map();
  let lastCentroid = null;
  let pinchStartDistance = 0;
  let pinchStartScale = 1;
  let dragHistory = [];
  let gestureRenderer = null;
  let gestureStartedOnDialog = false;
  const mapInteractionTargets = [dom.mapCanvas, dom.sceneCanvas, dom.overlay, dom.guideCard];
  const mapGestureSelector = '.hotspot, .destructible-hotspot, .secret-feature-hotspot, .actor-hotspot, .item-badge';
  const dialogGestureSelector = '.guide-card';
  const modernUiSelector = '.map-chrome, .options-panel, .guide-card, .guide-inspector, .status';

  function isDialogGestureTarget(target) {
    return target instanceof Element && Boolean(target.closest(dialogGestureSelector));
  }

  function canStartMapGesture(event) {
    const renderer = activeRenderer();
    const { target } = event;
    if (!(target instanceof Element)) {
      return false;
    }
    if (isDialogGestureTarget(target)) {
      if (target.closest('.dialog-close')) {
        return false;
      }
      return event.pointerType !== 'mouse';
    }
    return target === renderer?.canvas
      || Boolean(target.closest(mapGestureSelector));
  }

  function canWheelZoomMap(target) {
    const renderer = activeRenderer();
    if (!(target instanceof Element) || target.closest(modernUiSelector)) {
      return false;
    }
    return target === renderer?.canvas
      || target === dom.overlay
      || Boolean(target.closest('#overlay-layer, .hotspot, .destructible-hotspot, .secret-feature-hotspot, .actor-hotspot, .item-badge'));
  }

  function pointerList() {
    return [...pointers.values()];
  }

  function centroid(points) {
    return {
      x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
      y: points.reduce((sum, point) => sum + point.y, 0) / points.length
    };
  }

  function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function eventTimeMs(event) {
    return Number.isFinite(event.timeStamp) ? event.timeStamp : performance.now();
  }

  function resetDragHistory(time = performance.now(), renderer = gestureRenderer || activeRenderer()) {
    if (!renderer) {
      dragHistory = [];
      return;
    }
    dragHistory = [{
      time,
      x: renderer.camera.x,
      y: renderer.camera.y
    }];
  }

  function recordDragSample(time, renderer = gestureRenderer || activeRenderer()) {
    if (!renderer) return;
    dragHistory.push({
      time,
      x: renderer.camera.x,
      y: renderer.camera.y
    });
    const cutoff = time - PAN_RELEASE_HISTORY_MS;
    while (dragHistory.length > 2 && dragHistory[1].time < cutoff) {
      dragHistory.shift();
    }
  }

  function releaseVelocity(time = performance.now(), renderer = gestureRenderer || activeRenderer()) {
    if (dragHistory.length < 2 || time - dragHistory[dragHistory.length - 1].time > PAN_RELEASE_STALE_MS) {
      return { x: 0, y: 0 };
    }

    const cutoff = time - PAN_RELEASE_HISTORY_MS;
    const first = dragHistory.find((sample) => sample.time >= cutoff) || dragHistory[0];
    const last = dragHistory[dragHistory.length - 1];
    const dt = Math.max(1, last.time - first.time);
    const velocity = {
      x: (last.x - first.x) / dt,
      y: (last.y - first.y) / dt
    };
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const screenSpeed = Math.hypot(velocity.x, velocity.y) * (renderer?.camera.scale || 1) / dpr;
    if (screenSpeed < PAN_RELEASE_MIN_SCREEN_SPEED) {
      return { x: 0, y: 0 };
    }
    return {
      x: velocity.x,
      y: velocity.y
    };
  }

  function resetGesture(points = pointerList()) {
    lastCentroid = points.length ? centroid(points) : null;
    const renderer = gestureRenderer || activeRenderer();
    if (points.length >= 2) {
      pinchStartDistance = Math.max(1, distance(points[0], points[1]));
      pinchStartScale = renderer?.camera.scale || 1;
    } else {
      pinchStartDistance = 0;
      pinchStartScale = renderer?.camera.scale || 1;
    }
  }

  function moveByCentroid(nextCentroid, time = performance.now()) {
    const renderer = gestureRenderer || activeRenderer();
    if (!renderer) return;
    if (!lastCentroid) {
      lastCentroid = nextCentroid;
      recordDragSample(time, renderer);
      return;
    }
    if (gestureStartedOnDialog && pointers.size === 1) {
      lastCentroid = nextCentroid;
      resetDragHistory(time, renderer);
      return;
    }
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const cameraDeltaX = -((nextCentroid.x - lastCentroid.x) * dpr) / renderer.camera.scale;
    const cameraDeltaY = -((nextCentroid.y - lastCentroid.y) * dpr) / renderer.camera.scale;
    renderer.camera.x += cameraDeltaX;
    renderer.camera.y += cameraDeltaY;
    lastCentroid = nextCentroid;
    if (pointers.size === 1) {
      clampGuideCamera(renderer);
      recordDragSample(time, renderer);
    } else {
      resetDragHistory(time, renderer);
    }
  }

  function onPointerDown(event) {
    if (state.transitioning || event.button !== 0 || !canStartMapGesture(event)) {
      return;
    }
    const renderer = activeRenderer();
    if (!renderer) return;
    const startsOnDialog = isDialogGestureTarget(event.target);
    gestureRenderer = renderer;
    gestureStartedOnDialog = gestureStartedOnDialog || startsOnDialog;
    stopPanInertia();
    resetDragHistory(eventTimeMs(event), renderer);
    const captureTarget = startsOnDialog
      ? dom.guideCard
      : event.target instanceof Element
        ? event.target
        : renderer.canvas;
    if (captureTarget.setPointerCapture) {
      captureTarget.setPointerCapture(event.pointerId);
    }
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    resetGesture();
  }

  function onPointerMove(event) {
    if (!pointers.has(event.pointerId)) return;
    if (event.cancelable) {
      event.preventDefault();
    }
    const renderer = gestureRenderer || activeRenderer();
    if (!renderer) return;
    const events = pointers.size === 1 && typeof event.getCoalescedEvents === 'function'
      ? event.getCoalescedEvents()
      : [];
    const samples = events.length > 0 ? [...events, event] : [event];
    for (const sample of samples) {
      pointers.set(event.pointerId, { x: sample.clientX, y: sample.clientY });
      const points = pointerList();
      if (points.length === 0) return;
      const nextCentroid = centroid(points);
      moveByCentroid(nextCentroid, eventTimeMs(sample));
    }

    const points = pointerList();
    if (points.length >= 2) {
      const nextCentroid = centroid(points);
      const nextDistance = Math.max(1, distance(points[0], points[1]));
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      renderer.zoomAt(nextCentroid.x * dpr, nextCentroid.y * dpr, pinchStartScale * (nextDistance / pinchStartDistance));
      resetDragHistory(eventTimeMs(event), renderer);
    }
    clampGuideCamera(renderer);
  }

  function onPointerEnd(event) {
    const wasSinglePointer = pointers.size === 1;
    const renderer = gestureRenderer || activeRenderer();
    const captureTargets = [
      dom.guideCard,
      event.target instanceof Element ? event.target : null,
      renderer?.canvas
    ].filter(Boolean);
    for (const captureTarget of captureTargets) {
      if (captureTarget.hasPointerCapture?.(event.pointerId)) {
        captureTarget.releasePointerCapture(event.pointerId);
      }
    }
    pointers.delete(event.pointerId);
    if (renderer && event.type === 'pointerup' && wasSinglePointer && pointers.size === 0 && !gestureStartedOnDialog) {
      const velocity = releaseVelocity(eventTimeMs(event), renderer);
      startPanInertia(velocity.x, velocity.y, renderer);
    } else {
      stopPanInertia();
      resetDragHistory(eventTimeMs(event), renderer);
    }
    resetGesture();
    if (pointers.size === 0) {
      gestureRenderer = null;
      gestureStartedOnDialog = false;
    }
  }

  for (const target of mapInteractionTargets) {
    target.addEventListener('pointerdown', onPointerDown);
  }
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerEnd);
  window.addEventListener('pointercancel', onPointerEnd);

  for (const target of [dom.mapCanvas, dom.sceneCanvas, dom.guideCard]) {
    target.addEventListener('lostpointercapture', (event) => {
      pointers.delete(event.pointerId);
      if (pointers.size === 0) {
        gestureRenderer = null;
        gestureStartedOnDialog = false;
      }
    });
  }

  for (const nativeGestureEvent of ['gesturestart', 'gesturechange', 'gestureend']) {
    window.addEventListener(nativeGestureEvent, (event) => {
      if (event.cancelable) {
        event.preventDefault();
      }
    }, { passive: false });
  }

  window.addEventListener('wheel', (event) => {
    if (!canWheelZoomMap(event.target)) {
      return;
    }
    const renderer = activeRenderer();
    if (!renderer) return;
    event.preventDefault();
    stopPanInertia();
    resetDragHistory(eventTimeMs(event), renderer);
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const factor = Math.exp(-event.deltaY * 0.0012);
    renderer.zoomAt(event.clientX * dpr, event.clientY * dpr, renderer.camera.scale * factor);
    clampGuideCamera(renderer);
  }, { passive: false });

  function onMapKeyDown(event) {
    const renderer = activeRenderer();
    if (!renderer || event.currentTarget !== renderer.canvas) {
      return;
    }
    const panStep = 72 / renderer.camera.scale;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const centerX = renderer.canvas.width / (2 * dpr);
    const centerY = renderer.canvas.height / (2 * dpr);
    if (event.key === 'ArrowLeft') {
      renderer.camera.x -= panStep;
    } else if (event.key === 'ArrowRight') {
      renderer.camera.x += panStep;
    } else if (event.key === 'ArrowUp') {
      renderer.camera.y -= panStep;
    } else if (event.key === 'ArrowDown') {
      renderer.camera.y += panStep;
    } else if (event.key === '+' || event.key === '=') {
      renderer.zoomAt(centerX * dpr, centerY * dpr, renderer.camera.scale * 1.18);
    } else if (event.key === '-' || event.key === '_') {
      renderer.zoomAt(centerX * dpr, centerY * dpr, renderer.camera.scale / 1.18);
    } else if (event.key === 'Home' || event.key === '0') {
      focusActiveView({ reset: true });
    } else {
      return;
    }
    event.preventDefault();
    stopPanInertia();
    resetDragHistory(eventTimeMs(event), renderer);
    clampGuideCamera(renderer);
  }

  dom.mapCanvas.addEventListener('keydown', onMapKeyDown);
  dom.sceneCanvas.addEventListener('keydown', onMapKeyDown);
}

function attachControls() {
  dom.audioToggle.addEventListener('click', () => {
    toggleGuideMusicMute();
  });
  dom.paletteToggle.addEventListener('click', () => {
    if (currentView().supportsPalette) {
      state.variant = state.variant === 'day' ? 'night' : 'day';
      syncControls();
      syncGuideMusic();
      saveUrlViewStateNow();
      updateOverlays();
      renderGuideInspector();
    } else {
      leaveView();
    }
  });
  dom.resetToggle.addEventListener('click', () => {
    resetGuideToDefault();
  });
  dom.optionsToggle.addEventListener('click', () => {
    dom.optionsPanel.hidden = !dom.optionsPanel.hidden;
    syncControls();
  });
  dom.labelsToggle.addEventListener('change', () => {
    state.labels = dom.labelsToggle.checked;
  });
  dom.sectionOutlinesToggle.addEventListener('change', () => {
    state.sectionOutlines = dom.sectionOutlinesToggle.checked;
  });
  dom.highlightDoorsToggle.addEventListener('change', () => {
    state.highlightDoors = dom.highlightDoorsToggle.checked;
  });
  dom.showCharactersToggle.addEventListener('change', () => {
    state.showCharacters = dom.showCharactersToggle.checked;
  });
  dom.showSecretsToggle.addEventListener('change', () => {
    state.showSecrets = dom.showSecretsToggle.checked;
    renderGuideCard();
  });
  dom.highlightCharactersToggle.addEventListener('change', () => {
    state.highlightCharacters = dom.highlightCharactersToggle.checked;
  });
  dom.highlightMapObjectsToggle.addEventListener('change', () => {
    state.highlightMapObjects = dom.highlightMapObjectsToggle.checked;
  });
  dom.highlightSecretsToggle.addEventListener('change', () => {
    state.highlightSecrets = dom.highlightSecretsToggle.checked;
  });
  dom.dialogClose.addEventListener('click', () => {
    hideGuideCard();
  });
  dom.guideInspectorClose.addEventListener('click', () => {
    hideGuideInspector();
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && state.activeViewId !== OVERWORLD_VIEW_ID) {
      leaveView();
    } else if (event.key === 'Escape' && !dom.optionsPanel.hidden) {
      dom.optionsPanel.hidden = true;
      syncControls();
      dom.optionsToggle.focus();
    } else if (event.key === 'Escape' && !dom.guideCard.hidden) {
      hideGuideCard();
    } else if (event.key === 'Escape' && !dom.guideInspector.hidden) {
      hideGuideInspector();
    }
  });
  window.addEventListener('resize', () => {
    stopPanInertia();
    clampGuideCamera(activeRenderer());
    renderGuideCard();
    renderGuideInspector();
  });
}

function renderLoop() {
  syncLayerStateFromControls();
  applyPanInertia();
  const view = currentView();
  const renderer = view.renderer;
  if (view.hasFloatingProjection) {
    updateFloatingProjection();
  }
  const variant = activeVariant(view);
  renderer.render(variant, segmentRecordVisible);
  renderer.secretFeatureRenderer.render(
    renderer.camera,
    variant,
    shouldRenderSecretFeature,
    (segmentId) => renderer.displayOffsetForSegment(segmentId)
  );
  renderer.actorRenderer.render(
    renderer.camera,
    variant,
    shouldRenderActor,
    (segmentId) => renderer.displayOffsetForSegment(segmentId)
  );
  updateOverlays();
  if (activeGuideModel && dom.dialogBox.dataset.cssScale !== String(dialogScaleForMap())) {
    renderGuideCard();
  } else {
    placeAnchoredPanel(dom.guideCard, activeGuideModel, 'above');
  }
  placeAnchoredPanel(dom.guideInspector, activeInspectorModel, 'right');
  observeUrlViewState();
  requestAnimationFrame(renderLoop);
}

async function main() {
  setLoadingState({ active: true, label: 'INITIALIZING', progress: 0.02 });
  await initWasm();
  setLoadingState({ active: true, label: 'CREATING RENDERERS', progress: 0.08 });
  mapRenderer = new TileRenderer(dom.mapCanvas);
  sceneRenderer = new TileRenderer(dom.sceneCanvas);
  await mapRenderer.load(SLICE_URL, {
    onProgress: scaledProgressReporter(
      STARTUP_LOAD_OVERWORLD_START,
      STARTUP_LOAD_OVERWORLD_END,
      'OVERWORLD'
    )
  });
  MAP_VIEWS[OVERWORLD_VIEW_ID].renderer = mapRenderer;
  const fontManifest = await fetchJsonWithProgress(FONT_URL, {
    cache: 'no-store',
    onProgress: scaledProgressReporter(0.83, 0.88, 'DIALOG'),
    start: 0,
    end: 1,
    label: 'Loading font'
  });
  setLoadingState({ active: true, label: 'PREPARING DIALOGS', progress: 0.89 });
  const glyphs = createGlyphMap(fontManifest);
  const dialogAtlas = mapRenderer.decodedChrAtlases.get('chr-00-01')
    || mapRenderer.decodedChrAtlases.values().next().value;
  if (!dialogAtlas) {
    throw new Error('Guide slice does not include decoded CHR data for the CV2 dialog renderer.');
  }
  const itemIconManifest = mapRenderer.manifest.itemIcons || null;
  const itemIconAtlas = itemIconManifest?.chrSet
    ? (mapRenderer.decodedChrAtlases.get(itemIconManifest.chrSet) || dialogAtlas)
    : dialogAtlas;
  itemIconRenderer = new Cv2ItemIconRenderer(itemIconAtlas, itemIconManifest);
  dialogRenderer = new Cv2DialogRenderer(
    dom.dialogBox,
    dom.dialogFrameCanvas,
    dom.dialogCloseFrameCanvas,
    dom.dialogText,
    glyphs,
    dialogAtlas,
    itemIconRenderer
  );
  labelRenderer = new Cv2LabelRenderer(glyphs, dialogAtlas);
  await initializeActiveViewFromUrl({
    onSceneLoadProgress: scaledProgressReporter(
      STARTUP_LOAD_SCENE_START,
      STARTUP_LOAD_SCENE_END,
      'INTERIOR'
    )
  });
  setLoadingState({ active: true, label: 'READY', progress: 0.99 });
  attachInput();
  attachControls();
  setStatus('');
  renderLoop();
  setLoadingState({ active: true, label: 'READY', progress: 1 });
  requestAnimationFrame(() => hideLoadingState());
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  setStatus(message);
  setLoadingState({
    active: true,
    title: 'LOAD FAILED',
    label: message,
    progress: 1,
    error: true
  });
  throw error;
});
