# argon2wasm

Simple js/ts library for argon2. Compatible with Web, Node.js and Deno.

Binds to WASM which is transpiled from Rust code which uses the [argon2](https://crates.io/crates/argon2) crate.

Uses blocking (synchronous) code; not suited for lots of concurrent hashing operations.

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

The build script creates a "dist" directory. (If a "dist" directory already exists, it is replaced.)

This directory contains the wasm code (in the "pkg" directory) as well as js and ts bindings to said wasm code (in the "lib" directory).

## How to use

Import either the argon2.mjs or the argon2.ts into your project, depending on whether you prefer js or ts.

```javascript
import init, {Argon2} from "./dist/lib/argon2.mjs"
```

Since the module imports code from "pkg", the directory structure of "dist" should remain unchanged. (Otherwise you have to manually change the import paths in the imported argon2 file.)

Example usage is as follows:

```javascript
import init, {Argon2} from "./dist/lib/argon2.mjs"

init().then(() => {
  const argon2 = new Argon2({algorithm: "Argon2id"})
  
  const password = "myPassword"
  const hash = argon2.hash(password)
  
  const doesCorrectPasswordWork = argon2.verify("myPassword", hash)
  const doesIncorrectPasswordWork = argon2.verify("notMyPassword", hash)
  
  if(doesCorrectPasswordWork && !doesIncorrectPasswordWork) {
    console.log("The hashing module works!")
  } else {
    console.warn("The hashing module doesn't work.")
  }
})
```

## Documentation

TBA
