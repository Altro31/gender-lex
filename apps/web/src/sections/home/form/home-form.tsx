import { RHFUploadRegister } from "@/sections/home/components/upload/upload-area"
import HomeFormContainer from "@/sections/home/form/home-form-container"
import HomeFormProvider from "@/sections/home/form/home-form-provider"
import { getLastUsedPreset } from "@/services/preset"

export default async function HomeForm() {
	const preset = await getLastUsedPreset()
	return (
		<HomeFormProvider lastUsedPreset={preset!}>
			<RHFUploadRegister />
			<HomeFormContainer />
		</HomeFormProvider>
	)
}
