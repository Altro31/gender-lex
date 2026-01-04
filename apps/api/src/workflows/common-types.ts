import type { User } from "better-auth"

export interface Context {
    user: User | undefined
}
