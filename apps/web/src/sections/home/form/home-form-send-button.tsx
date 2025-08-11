import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useFormStatus } from "react-dom"

interface Props {
	disabled?: boolean
}

export default function HomeFormSendButton({ disabled = false }: Props) {
	const t = useTranslations()
	const { pending } = useFormStatus()

	return (
		<Button
			size="sm"
			className="cursor-pointer rounded-lg transition-opacity"
			disabled={disabled || pending}
			type="submit"
		>
			{pending && <Loader2 className="animate-spin" />}
			<span>{pending ? t("Actions.analyzing") : t("Actions.send")}</span>
		</Button>
	)
}
