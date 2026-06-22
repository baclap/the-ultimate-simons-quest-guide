# CV2 Icon Editor

Standalone editor for the guide chrome icon grids. It is intentionally kept
outside `guide/` so the production guide source only carries the final copied
icon data.

From the project root:

```sh
python3 -m http.server 4181 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:4181/tools/icon-editor/
```

Copy the generated 16x16 grid into the guide runtime icon definitions when an
icon is ready.
