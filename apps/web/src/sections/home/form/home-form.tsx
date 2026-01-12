import { RHFUploadRegister } from "@/sections/home/components/upload/upload-area";
import HomeFormContainer from "@/sections/home/form/home-form-container";
import HomeFormProvider from "@/sections/home/form/home-form-provider";
import { cookies } from "next/headers";

export default async function HomeForm() {
  const cookieStore = await cookies();
  const reqCookie = cookieStore.get("preset.last-used");
  return (
    <HomeFormProvider lastUsedPreset={reqCookie?.value}>
      <RHFUploadRegister />
      <HomeFormContainer />
    </HomeFormProvider>
  );
}
