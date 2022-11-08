import initialize, { hash, verify } from "../pkg/argon2wasm.js"

// true if init has been called
let initializing = false

// true if init has finished
let initialized = false

const argon2 = {
    hash,
    verify
}

export interface ConfiguredArgon2 {
    hash: (password: string) => string,
    verify: (password: string, hash: string) => boolean
}

/**
 * 
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

export default function init(): Promise<void> {
    if (initializing) throw "init has already been called"

    initializing = true

    return new Promise(res => {
        initialize().then(() => {
            initialized = true
            res()
        })
    })
}