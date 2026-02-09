import { UserService } from "@/modules/data/user/service"
import { describe, expect, it } from "bun:test"
import { Effect } from "effect"

describe("UserService", () => {
    it("should be defined as an Effect Service", () => {
        expect(UserService).toBeDefined()
        expect(UserService.Default).toBeDefined()
    })

    it("should have static provide method", () => {
        expect(UserService.provide).toBeDefined()
        expect(typeof UserService.provide).toBe("function")
    })

    it("should successfully initialize service", async () => {
        const result = await Effect.gen(function* () {
            const userService = yield* UserService
            return userService
        }).pipe(Effect.provide(UserService.Default), Effect.runPromise)

        expect(result).toBeDefined()
    })
})
