import { RHFUploadRegister } from "@/sections/home/components/upload/upload-area";
import HomeFormContainer from "@/sections/home/form/home-form-container";
import HomeFormProvider from "@/sections/home/form/home-form-provider";

export default function HomeForm() {
  return (
    <HomeFormProvider>
      <RHFUploadRegister />
      <HomeFormContainer />
    </HomeFormProvider>
  );
}
