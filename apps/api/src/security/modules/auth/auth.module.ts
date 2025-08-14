import { AuthModule as BetterAuthModuleLibrary } from '@mguay/nestjs-better-auth'
import { Module } from '@nestjs/common'

@Module({
	imports: [
		BetterAuthModuleLibrary.forRootAsync({
			async useFactory() {
				const { auth } = await import('@repo/auth')
				return { auth }
			},
		}),
	],
})
export class AuthModule {}
