# CV2 Guide Map WebGL App

This is the first static interactive guide-map app. It renders a small
Simon’s Quest route slice from ROM-derived tile data at runtime:

`Dead River - Part 1 -> Belasco Marsh -> Jova -> Berkeley Mansion Door`

The app intentionally does not load map PNG textures. It loads `slice.json` and
`slice-data.bin`, asks Rust-compiled WebAssembly to decode CHR/layout/metatile
data, and renders the resulting tilemaps with WebGL2.

## Tooling

Install Rust with `rustup`, then add the browser WASM target and wasm-pack:

```sh
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"
rustup target add wasm32-unknown-unknown
cargo install wasm-pack
```

Install the web dependencies:

```sh
npm install --prefix web/guide-map
```

## Build

From the repo root:

```sh
npm run guide:slice:dead-river-berkeley
npm run guide:wasm:build
npm run guide:web:build
```

For local development:

```sh
npm run guide:web:dev
```

The app is fully static after `vite build`.
