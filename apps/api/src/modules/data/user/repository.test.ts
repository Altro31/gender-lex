import { UserRepository } from "@/modules/data/user/repository"
import { describe, expect, it } from "bun:test"

describe("UserRepository", () => {
    it("should be defined as an Effect Service", () => {
        expect(UserRepository).toBeDefined()
        expect(UserRepository.Default).toBeDefined()
    })

    it("should have static provide method", () => {
        expect(UserRepository.provide).toBeDefined()
        expect(typeof UserRepository.provide).toBe("function")
    })
})
