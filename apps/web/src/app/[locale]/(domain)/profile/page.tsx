import { setServerLocale } from '@/locales/request'
import ProfileContainer from '@/sections/profile/view/profile-container'
import { getUserProfile } from '@/services/profile'
import { t } from '@lingui/core/macro'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
	await setServerLocale()

	return {
		title: t`Profile` + ' | GenderLex',
		description: t`Manage your profile and account settings`,
	}
}

export default async function ProfilePage() {
	const user = await getUserProfile()

	return <ProfileContainer user={user} />
}
