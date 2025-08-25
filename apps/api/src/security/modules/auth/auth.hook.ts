import { Hook, AfterHook, AuthHookContext } from '@mguay/nestjs-better-auth'

@Hook()
export class AuthHooks {
	@AfterHook('/sign-in/anonymous')
	after(ctx: AuthHookContext) {
		console.log(JSON.stringify(ctx))
	}
}
