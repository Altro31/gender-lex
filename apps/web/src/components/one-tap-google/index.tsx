import { cookies } from 'next/headers'
import OneTapGoogleTrigger from './one-tap-google-trigger'

export async function OneTapGoogle() {
	const cookiesStore = await cookies()
	const oneTapGoogle = cookiesStore.get('one-tap-google')

	const disableOneTapGoogle = async () => {
		'use server'

		cookiesStore.delete('one-tap-google')
	}

	return (
		<OneTapGoogleTrigger disableOneTapGoogleAction={disableOneTapGoogle} />
	)
}
