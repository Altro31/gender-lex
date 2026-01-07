import { getSession } from "@/lib/auth/auth-server";
import OneTapGoogleTrigger from "./one-tap-google-trigger";

export async function OneTapGoogle() {
  const session = await getSession();
  return !session && <OneTapGoogleTrigger />;
}
