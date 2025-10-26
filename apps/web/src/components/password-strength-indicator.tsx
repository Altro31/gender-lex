import { cn } from "@/lib/utils"
import { Select } from "@lingui/react/macro"

interface Props {
	password: string
}

export default function PasswordStrengthIndicator({ password }: Props) {
	const strength = getStrength(password)
	const type = getStrengthType(strength)
	const percentage = (strength / 5) * 100

	return (
		<div className="space-y-2">
			<div className="flex items-center gap-2">
				<div className="h-2 flex-1 rounded-full bg-gray-200">
					<div
						className={cn(
							"h-2 w-[var(--password-strength)] rounded-full transition-[width,background] duration-300",
							type === "weak" && "bg-red-500",
							type === "medium" && "bg-yellow-500",
							type === "strong" && "bg-green-500",
						)}
						style={
							{
								"--password-strength": `${percentage}%`,
							} as React.CSSProperties
						}
					/>
				</div>
				<span className="text-xs text-gray-600">
					<Select
						value={type}
						_weak="Weak"
						_medium="Medium"
						_strong="Strong"
						other="Other"
					/>
				</span>
			</div>
		</div>
	)
}

function getStrengthType(strength: number) {
	if (strength <= 2) return "weak"
	if (strength <= 3) return "medium"
	return "strong"
}

function getStrength(password: string) {
	let strength = 0
	if (password.length >= 8) strength++
	if (/[a-z]/.test(password)) strength++
	if (/[A-Z]/.test(password)) strength++
	if (/\d/.test(password)) strength++
	if (/[^a-zA-Z\d]/.test(password)) strength++
	return strength
}
