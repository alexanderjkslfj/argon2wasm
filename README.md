# argon2wasm

Simple js/ts library for argon2. Compatible with Web, Node.js and Deno.

Binds to WASM which is transpiled from Rust code which uses the [argon2](https://crates.io/crates/argon2) crate.

Uses blocking code; not suited for lots of concurrent hashing operations.

## How to build

To transpile the Rust code to WASM, you must have Rust and Cargo installed on your system.

Execute the following code using bash.

```bash
# install wasm-pack, the Rust to WASM transpiler, to your system
cargo install wasm-pack

# get the code
git clone https://github.com/alexanderjkslfj/argon2wasm.git

# enter directory
cd ./argon2wasm

# run build script
./build.sh
```

The build script creates a "dist" directory.

This contains the wasm (in the "pkg" directory) as well as js and ts bindings to said wasm (in the "lib" directory).

## Usage

TBA
