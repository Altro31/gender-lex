import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useFormStatus } from "react-dom"
import { useFormState } from "react-hook-form"

interface Props {
	disabled?: boolean
}

export default function HomeFormSendButton({ disabled = false }: Props) {
	const t = useTranslations()
	const { isSubmitting, isValid } = useFormState()

	return (
		<Button
			size="sm"
			className="cursor-pointer rounded-lg transition-opacity"
			disabled={!isValid || isSubmitting}
			type="submit"
		>
			{isSubmitting && <Loader2 className="animate-spin" />}
			<span>
				{isSubmitting ? t("Actions.analyzing") : t("Actions.send")}
			</span>
		</Button>
	)
}
