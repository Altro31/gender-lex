import { getUserProfile } from "@/services/profile"
import ProfileView from "./profile-view"

export default async function ProfileContainer() {
	const user = await getUserProfile()

	return <ProfileView user={user} />
}
