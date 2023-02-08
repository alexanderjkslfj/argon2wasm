import initialize, { hash, verify } from "../pkg/argon2wasm.js"

// true if init has finished
let initialized = false

// promises waiting for init to finish
let initcalls: null | (() => unknown)[] = null

const argon2 = {
    hash,
    verify
}

export interface ConfiguredArgon2 {
    hash: (password: string) => string,
    verify: (password: string, hash: string) => boolean
}

/**
 * Creates an Argon2 object containing the configurations passed as parameters.
 * 
 * Parameters, if given, are expected to be valid.
 * @param options the configuration options of the argon2 object
 * @returns a configured argon2 object with the methods hash and verify
 * 
 * @example
 * const argon2: ConfiguredArgon2 = new Argon2({algorithm: "Argon2id"});
 * 
 * const myHash: string = argon2.hash("myPassword");
 * 
 * const correctPassword: boolean = argon2.verify("myPassword", myHash);
 * const incorrectPassword: boolean = argon2.verify("notMyPassword", myHash);
 * 
 * if(correctPassword && !incorrectPassword) console.log("Success!!");
 * 
 */
export function Argon2(options?: {
    algorithm?: "Argon2i" | "Argon2d" | "Argon2id",
    version?: 16 | 19,
    pepper?: string,
    memoryCost?: number,
    iterationCost?: number,
    parallelism?: number,
    outputLen?: number
}): ConfiguredArgon2 {
    if (!initialized) throw "Argon has not yet been initialized"

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

    return {
        hash(password: string): string {
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

        verify(password: string, hash: string): boolean {
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
}

/**
 * Initializes the module.
 * @returns a promise that resolves when the initialization finishes (or has finished)
 */
export default function init(): Promise<void> {
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