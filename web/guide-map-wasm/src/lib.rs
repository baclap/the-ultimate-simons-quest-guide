use wasm_bindgen::prelude::*;

const TILE_SIZE: usize = 8;
const TILE_BYTES: usize = 16;
const TILES_PER_ROW: usize = 16;
const BLOCK_TILES: usize = 4;

fn pattern_pixel(chr: &[u8], tile_index: usize, x: usize, y: usize) -> u8 {
    let offset = tile_index * TILE_BYTES;
    if offset + 15 >= chr.len() {
        return 0;
    }
    let low = chr[offset + y];
    let high = chr[offset + y + 8];
    let bit = 7 - x;
    ((low >> bit) & 1) | (((high >> bit) & 1) << 1)
}

fn palette_bits(attribute: u8, tile_row: usize, tile_col: usize) -> u8 {
    let quadrant = if tile_row >= 2 { 2 } else { 0 } + if tile_col >= 2 { 1 } else { 0 };
    (attribute >> (quadrant * 2)) & 0x03
}

#[wasm_bindgen]
pub fn decode_chr_atlas(chr: &[u8]) -> Vec<u8> {
    let tile_count = chr.len() / TILE_BYTES;
    let rows = (tile_count + TILES_PER_ROW - 1) / TILES_PER_ROW;
    let width = TILES_PER_ROW * TILE_SIZE;
    let height = rows * TILE_SIZE;
    let mut atlas = vec![0u8; width * height];

    for tile_index in 0..tile_count {
        let tile_x = (tile_index % TILES_PER_ROW) * TILE_SIZE;
        let tile_y = (tile_index / TILES_PER_ROW) * TILE_SIZE;
        for y in 0..TILE_SIZE {
            for x in 0..TILE_SIZE {
                atlas[(tile_y + y) * width + tile_x + x] = pattern_pixel(chr, tile_index, x, y);
            }
        }
    }

    atlas
}

#[wasm_bindgen]
pub fn expand_segment_tilemap(
    layout_blocks: &[u8],
    metatile_tiles: &[u8],
    metatile_attributes: &[u8],
    block_width: u32,
    block_height: u32,
) -> Vec<u8> {
    let block_width = block_width as usize;
    let block_height = block_height as usize;
    let tile_width = block_width * BLOCK_TILES;
    let tile_height = block_height * BLOCK_TILES;
    let mut tilemap = vec![0u8; tile_width * tile_height * 4];

    for block_y in 0..block_height {
        for block_x in 0..block_width {
            let block_index = layout_blocks
                .get(block_y * block_width + block_x)
                .copied()
                .unwrap_or(0) as usize;
            let attribute = metatile_attributes.get(block_index).copied().unwrap_or(0);
            for tile_row in 0..BLOCK_TILES {
                for tile_col in 0..BLOCK_TILES {
                    let source = block_index * 16 + tile_row * BLOCK_TILES + tile_col;
                    let tile_index = metatile_tiles.get(source).copied().unwrap_or(0);
                    let palette = palette_bits(attribute, tile_row, tile_col);
                    let out_tile_x = block_x * BLOCK_TILES + tile_col;
                    let out_tile_y = block_y * BLOCK_TILES + tile_row;
                    let out = (out_tile_y * tile_width + out_tile_x) * 4;
                    tilemap[out] = tile_index;
                    tilemap[out + 1] = palette;
                    tilemap[out + 2] = 0;
                    tilemap[out + 3] = 255;
                }
            }
        }
    }

    tilemap
}

#[wasm_bindgen]
pub fn free_buffer(_ptr: u32, _len: u32) {}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn decodes_chr_plane_bits() {
        let mut chr = vec![0u8; 16];
        chr[0] = 0b1000_0000;
        chr[8] = 0b0100_0000;
        let atlas = decode_chr_atlas(&chr);
        assert_eq!(atlas[0], 1);
        assert_eq!(atlas[1], 2);
        assert_eq!(atlas[2], 0);
    }

    #[test]
    fn expands_metatile_layout() {
        let layout = [1u8];
        let mut tiles = vec![0u8; 256 * 16];
        for index in 0..16 {
            tiles[16 + index] = index as u8;
        }
        let mut attrs = vec![0u8; 256];
        attrs[1] = 0b11_10_01_00;
        let tilemap = expand_segment_tilemap(&layout, &tiles, &attrs, 1, 1);
        assert_eq!(tilemap.len(), 4 * 4 * 4);
        assert_eq!(tilemap[0], 0);
        assert_eq!(tilemap[4], 1);
        assert_eq!(tilemap[5], 0);
        assert_eq!(tilemap[(2 * 4 + 2) * 4 + 1], 3);
    }
}
