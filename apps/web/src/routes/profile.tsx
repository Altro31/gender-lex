import { createFileRoute } from "@tanstack/react-router";
import ProfileContainer from "@/sections/profile/view/profile-container";
import { getUserProfile } from "@/services/profile";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  loader: async () => {
    const user = await getUserProfile();
    return { user };
  },
});

function ProfilePage() {
  const { user } = Route.useLoaderData();
  return <ProfileContainer user={user} />;
}
