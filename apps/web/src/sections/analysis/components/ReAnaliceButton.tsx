import { cn } from '@/lib/utils'
import { model } from '@/stores/model'
import type { Signal } from '@preact/signals-react'
import { RefreshCcw } from 'lucide-react'
import type { ComponentProps } from 'react'
import { Button } from '~ui/button'

interface Props extends ComponentProps<typeof Button> {
    dataModel: Signal<string>
}

export default function ReAnaliceButton({
    dataModel,
    className,
    ...props
}: Props) {
    const sameModel = model.value === dataModel.valueOf()

    if (!model.value && !global) model.value = document.body.dataset.model

    return (
        <Button
            size="icon"
            variant="ghost"
            className={cn(
                'group relative left-0 cursor-pointer opacity-100 transition-[opacity,left] transition-discrete duration-200 ease-in starting:left-11 starting:opacity-50',
                sameModel && 'hidden',
                className,
            )}
            {...props}
        >
            <RefreshCcw className="rotate-0 transition-transform duration-500 ease-in-out group-hover:-rotate-90" />
        </Button>
    )
}
