# Local Vendor Note

This directory is a local, read-only reference copy of `tonylukasavage/cv2r`, used for Castlevania II location, actor, door, palette, and bank metadata.

The upstream package metadata declares the project license as ISC. No standalone license file was present in the cloned repository snapshot.

Only two tiny local dependency shims were added under `node_modules/` so `lib/core.js` can be loaded without installing the full randomizer dependency tree:

- `camelcase`
- `lodash`

