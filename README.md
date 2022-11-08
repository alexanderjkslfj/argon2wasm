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
// import the module
import init, {Argon2} from "./dist/lib/argon2.mjs"

// initialize the module
init().then(() => {

  // create a ConfiguredArgon2 object
  const argon2 = new Argon2({algorithm: "Argon2id"})
  
  // create a hash of "myPassword" using the configuration defined in the argon2 object
  const password = "myPassword"
  const hash = argon2.hash(password)
  
  // check if "myPassword" is successfully verified when matched against the hash of "myPassword"
  const doesCorrectPasswordWork = argon2.verify("myPassword", hash)
  // check if a different string is successfully verified when matched against the same hash
  const doesIncorrectPasswordWork = argon2.verify("notMyPassword", hash)
  
  // check if the results of the prior checks are as expected
  if(doesCorrectPasswordWork && !doesIncorrectPasswordWork) {
    console.log("The hashing module works!")
  } else {
    console.warn("The hashing module doesn't work.")
  }
})
```

## Documentation

### init
**init** is the default export of the module. It must be called and fully awaited before the **Argon2** method is first called. **init** must only be called once.

### Argon2
The **Argon2** method returns a **ConfiguredArgon2** object which you can use for hashing and verifying.

It takes an options object as an optional parameter, with the following optional fields:


**algorithm**     - *string*  - Which algorithm to use. Allows "Argon2i", "Argon2d" and "Argon2id". Default is "Argon2id".

**version**       - *number*  - Which version of argon2 to use. Allows 16 and 19. Default is 19.

**pepper**        - *string*  - Which pepper to use. Default is an empty string, which means no pepper is used.

**memoryCost**    - *number*  - Which memory cost to use. Default is 4096.

**iterationCost** - *number*  - Which iteration cost to use. Default is 3.

**parallelism**   - *number*  - What level of parallelism to use. Default is 1.

**outputLen**     - *number*  - Which output length to use. Default is 32.


It returns a **ConfiguredArgon2** object with the given configuration.

### ConfiguredArgon2

A **ConfiguredArgon2** object can be created using **Argon2**. It has two methods, **hash** and **verify**.

#### hash

The hash method hashes a given string.

It has only one parameter, "password".

**password**  - *string*  - The string to create a hash of

It returns the hash as a string.

#### verify

The verify method verifies whether a given string matches a given hash.

It uses two parameters, "password" and "hash".

**password**  - *string*  - The cleartext password to match against the hash

**hash**      - *string*  - The hash to match against.

Returns true if the password matches the hash, else it returns false.
