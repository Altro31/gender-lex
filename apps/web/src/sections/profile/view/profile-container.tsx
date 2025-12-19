import { getUserProfile } from '@/services/profile'
import ProfileView from './profile-view'

interface Props {
	user: getUserProfile
}

export default async function ProfileContainer({ user }: Props) {
	return <ProfileView user={user} />
}
