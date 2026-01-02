import { t } from '@lingui/core/macro'
import { Badge } from './ui/badge'
import { cn } from '@/lib/utils'

interface Props {
	variant?: 'inline' | 'over'
	className?: string
}

export default function LastUsedBadge({ variant = 'over', className }: Props) {
	return (
		<Badge
			className={cn(
				variant === 'over' && 'absolute -top-2.5 right-1',
				className,
			)}
		>{t`Lastest`}</Badge>
	)
}
