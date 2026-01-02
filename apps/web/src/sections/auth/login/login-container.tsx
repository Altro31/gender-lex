import TermsAndConditions from '@/components/terms-and-conditions'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import LoginForm from '@/sections/auth/login/form/login-form'
import LoginFormContainer from '@/sections/auth/login/form/login-form-container'
import { t } from '@lingui/core/macro'
import { ArrowLeft, Lock } from 'lucide-react'
import Link from 'next/link'
import SocialLoginButtons from './components/social-login-buttons'
import { getLocale } from '@/locales/utils/locale'

export default async function LoginContainer() {
	const locale = await getLocale()
	return (
		<div className="flex min-h-screen w-full items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* Back Button */}
				<div className="mb-6">
					<Link href={`/${locale}`}>
						<Button variant="ghost" size="sm">
							<ArrowLeft />
							{t`Back to home`}
						</Button>
					</Link>
				</div>

				<Card className="border-0 shadow-xl">
					<CardHeader className="space-y-1 pb-2">
						<div className="mb-1 flex justify-center">
							<div className="bg-primary flex size-12 items-center justify-center rounded-xl">
								<Lock className="size-6 text-primary-foreground" />
							</div>
						</div>
						<CardTitle className=" text-center text-2xl font-bold">
							{t`Login`}
						</CardTitle>
						<CardDescription className="text-muted-foreground text-center">
							{t`Enter your account to continue`}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Social Login Buttons */}
						<SocialLoginButtons />

						{/* Login Form */}
						<LoginFormContainer>
							<LoginForm />
						</LoginFormContainer>
					</CardContent>
					<CardFooter>
						<p className="flex-1 text-center text-sm text-muted-foreground">
							{t`Don't you have an account?`}{' '}
							<Link href={`/${locale}/auth/register`}>
								{t`Register here`}
							</Link>
						</p>
					</CardFooter>
				</Card>

				{/* Footer */}
				<div className="mt-8 text-center text-xs text-muted-foreground">
					<TermsAndConditions />
				</div>
			</div>
		</div>
	)
}
