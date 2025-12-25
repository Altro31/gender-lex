import { Button } from '@/components/ui/button'
import { MessageCircle, X } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import FloatingChatbotChat from './floating-chatbot-chat'

export default function FloatingChatbot() {
	return (
		<Popover>
			<PopoverTrigger
				className="fixed right-6 bottom-6 z-50 group h-16 w-16 rounded-full shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl"
				render={<Button size="lg" />}
			>
				<div className="absolute inset-0 rounded-full bg-blue-400/20 blur-xl transition-opacity duration-300 group-hover:opacity-100 opacity-0" />
				<X className="group-not-data-popup-open:hidden relative h-6 w-6 text-white transition-transform duration-300 group-hover:rotate-90" />
				<MessageCircle className="group-data-popup-open:hidden relative h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110" />
			</PopoverTrigger>
			<PopoverContent className="h-128 w-80 sm:w-96 p-0" sideOffset={12}>
				<FloatingChatbotChat />
			</PopoverContent>
		</Popover>
	)
}
