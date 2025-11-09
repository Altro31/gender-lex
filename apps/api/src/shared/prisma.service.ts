import { Effect } from "effect"

import { createEffectPrisma } from "@/lib/prisma-effect"
import { decrypt, encrypt } from "@repo/auth/encrypt"
import { enhance, type PrismaClient } from "@repo/db"
import {
    PrismaClient as PrismaClientClass,
    adapter,
    extension,
} from "@repo/db/client"
import { AuthService } from "./auth.service"
Effect.acquireUseRelease
class RawPrismaService extends Effect.Service<RawPrismaService>()(
    "RawPrismaService",
    { succeed: new PrismaClientClass({ adapter }).$extends(extension) },
) {}

// new PrismaClientClass({ adapter }).$extends(extension) }
export class PrismaService extends Effect.Service<PrismaService>()(
    "PrismaService",
    {
        effect: Effect.gen(function* () {
            const prisma = yield* RawPrismaService
            return createEffectPrisma(prisma as unknown as PrismaClient)
        }),
        dependencies: [RawPrismaService.Default],
    },
) {
    static provide = Effect.provide(this.Default)
}

export class EnhancedPrismaService extends Effect.Service<EnhancedPrismaService>()(
    "EnhancedPrismaService",
    {
        effect: Effect.gen(function* () {
            const prisma = yield* RawPrismaService
            const { user } = yield* AuthService

            const enhanced = enhance(
                prisma as any,
                { user },
                {
                    logPrismaQuery: true,
                    encryption: {
                        encrypt: async (_, __, plain) =>
                            encrypt(plain, process.env.ENCRYPTION_KEY || ""),
                        decrypt: async (_, __, plain) =>
                            decrypt(plain, process.env.ENCRYPTION_KEY || ""),
                    },
                },
            ) as PrismaClient
            return createEffectPrisma(enhanced)
        }),
        dependencies: [RawPrismaService.Default, AuthService.Default],
    },
) {
    static provide = Effect.provide(this.Default)
}
