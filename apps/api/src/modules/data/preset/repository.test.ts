import { PresetRepository } from "@/modules/data/preset/repository"
import { describe, expect, it } from "bun:test"

describe("PresetRepository", () => {
    it("should be defined as an Effect Service", () => {
        expect(PresetRepository).toBeDefined()
        expect(PresetRepository.Default).toBeDefined()
    })

    it("should have static provide method", () => {
        expect(PresetRepository.provide).toBeDefined()
        expect(typeof PresetRepository.provide).toBe("function")
    })
})
