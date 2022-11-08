#!/bin/bash

# transpiles rust to wasm with js bindings
wasm-pack build --target web

# removes existing dist folder
[ -e dist ] && rm -r dist

# creates new dist folder
mkdir dist

# copies js/ts libs as well as the packaged wasm to dist
cp -r lib dist/lib
cp -r pkg dist/pkg

echo "Built to ./dist successful."