// Allows generating meaningful error messages when executed from a javascript host.
extern crate console_error_panic_hook;
use std::panic;

use wasm_bindgen::prelude::*;

use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Algorithm, Argon2, Params, Version,
};

// executed when wasm is initialized
#[wasm_bindgen(start)]
pub fn main() -> Result<(), JsValue> {
    // initialize meaningful error logging
    panic::set_hook(Box::new(console_error_panic_hook::hook));
    Ok(())
}

/// A wrapper for Argon2::new using javascript compatible parameters.
/// 
/// Does not check for validity of passed parameters.
pub fn create_argon<'a>(
    algorithm: &str,
    version: u32,
    pepper: &'a str,
    memory_cost: u32,
    iteration_cost: u32,
    parallelism: u32,
    output_len: usize,
) -> Argon2<'a> {

    // convert algorithm string given in parameter to algorithm id usable by Argon2::new
    let algo;
    match algorithm {
        "Argon2i" => algo = Algorithm::Argon2i,
        "Argon2d" => algo = Algorithm::Argon2d,
        "Argon2id" => algo = Algorithm::Argon2id,
        _ => algo = Algorithm::Argon2id,
    };

    // convert version string to Version object usable by Argon2::new
    let ver = Version::try_from(version).ok().unwrap();

    // convert other parameters to Params object usable by Argon2::new
    let params = Params::new(memory_cost, iteration_cost, parallelism, Some(output_len))
        .ok()
        .unwrap();

    // use correct constructor depending on whether pepper is used
    if pepper.len() == 0 {
        return Argon2::new(algo, ver, params);
    } else {
        return Argon2::new_with_secret(pepper.as_bytes(), algo, ver, params)
            .ok()
            .unwrap();
    }

}

// accessible from javascript host
#[wasm_bindgen]
/// Hashes a password using the given parameters.
/// 
/// Expects parameters to be valid and complete.
pub fn hash(
    password: &str,
    algorithm: &str,
    version: u32,
    pepper: &str,
    memory_cost: u32,
    iteration_cost: u32,
    parallelism: u32,
    output_len: usize,
) -> String {
    let argon2 = create_argon(
        algorithm,
        version,
        pepper,
        memory_cost,
        iteration_cost,
        parallelism,
        output_len,
    );

    let salt = SaltString::generate(&mut OsRng);

    let password_hash = argon2.hash_password(password.as_bytes(), &salt);
    if password_hash.is_ok() {
        return password_hash.unwrap().to_string();
    } else {
        return String::from("");
    }
}

// accessible from javascript host
#[wasm_bindgen]
/// Verifies the password matches the hash.
/// 
/// Provided parameters must match parameters used for the passed hash. Expects parameters to be valid and complete.
pub fn verify(
    password: &str,
    hash: &str,
    algorithm: &str,
    version: u32,
    pepper: &str,
    memory_cost: u32,
    iteration_cost: u32,
    parallelism: u32,
    output_len: usize,
) -> bool {

    let argon2 = create_argon(
        algorithm,
        version,
        pepper,
        memory_cost,
        iteration_cost,
        parallelism,
        output_len,
    );

    let parsed_hash = PasswordHash::new(hash).ok().unwrap();

    return argon2
        .verify_password(password.as_bytes(), &parsed_hash)
        .is_ok();

}
