import initialize, { hash, verify } from "../pkg/argon2wasm.js"

// true if init has finished
let initialized = false

/**
 * promises waiting for init to finish
 * @type {null | (() => unknown)[]}
 */
let initcalls = null

const argon2 = {
    hash,
    verify
}

/**
 * Creates an Argon2 object containing the configurations passed as parameters.
 * 
 * Parameters, if given, are expected to be valid.
 * @param {{algorithm?: "Argon2i" | "Argon2d" | "Argon2id",version?: 16 | 19,pepper?: string,memoryCost?: number,iterationCost?: number,parallelism?: number,outputLen?: number}} [options] the configuration options of the argon2 object
 * @returns {{hash: (password: string) => string, verify: (password: string, hash: string) => boolean}} a configured argon2 object with the methods hash and verify
 * 
 * @example
 * const argon2 = new Argon2({algorithm: "Argon2id"});
 * 
 * const myHash = argon2.hash("myPassword");
 * 
 * const correctPassword = argon2.verify("myPassword", myHash);
 * const incorrectPassword = argon2.verify("notMyPassword", myHash);
 * 
 * if(correctPassword && !incorrectPassword) console.log("Success!!");
 * 
 */
export function Argon2(options) {
    if (!initialized) throw "Argon2 has not yet been initialized"

    const algorithm = options?.algorithm || "Argon2id"
    const version = options?.version || 19
    const pepper = options?.pepper || ""
    const memoryCost = options?.memoryCost || 4096
    const iterationCost = options?.iterationCost || 3
    const parallelism = options?.parallelism || 1
    const outputLen = options?.outputLen || 32

    if (!["Argon2i", "Argon2d", "Argon2id"].includes(algorithm))
        throw `Invalid algorithm: ${algorithm}`

    if (version !== 16 && version !== 19)
        throw `Invalid version: ${version}`

    /**
     * @type {{hash: (password: string) => string, verify: (password: string, hash: string) => boolean}}
     */
    const configuredArgon2 = {
        hash(password) {
            return argon2.hash(
                password,
                algorithm,
                version,
                pepper,
                memoryCost,
                iterationCost,
                parallelism,
                outputLen
            )
        },

        verify(password, hash) {
            return argon2.verify(
                password,
                hash,
                algorithm,
                version,
                pepper,
                memoryCost,
                iterationCost,
                parallelism,
                outputLen
            )
        }
    }

    return configuredArgon2
}

/**
 * Initializes the module.
 * @returns {Promise<void>} a promise that resolves when the initialization finishes (or has finished)
 */
export default function init() {
    return new Promise(res => {
        if (initialized) {
            res()
        } else {
            if (initcalls === null) {
                initcalls = [res]

                initialize().then(() => {
                    initialized = true

                    if (initcalls !== null) {

                        for (const initcall of initcalls) {
                            initcall()
                        }

                        initcalls.length = 0

                    }
                })
            } else {
                initcalls.push(res)
            }
        }
    })
}