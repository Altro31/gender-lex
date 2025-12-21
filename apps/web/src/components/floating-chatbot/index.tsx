'use client'

import type React from 'react'

import { ChatMessage } from '@repo/db/models'
import { useState, useRef, useEffect } from 'react'
import { useChat } from 'ai/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'

export default function FloatingChatbot() {
	const [isOpen, setIsOpen] = useState(false)
	const [messages, setMessages] = useState<ChatMessage[]>([
		{
			id: '1',
			content:
				'¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?',
			sender: 'bot',
			createdAt: new Date(),
			updatedAt: new Date(),
			conversationId: '1',
		},
	])
	const [inputValue, setInputValue] = useState('')
	const [isTyping, setIsTyping] = useState(false)
	const [isLoadingHistory, setIsLoadingHistory] = useState(false)
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)

	const { messages, input, handleInputChange, handleSubmit, isLoading } =
		useChat({
			api: '/api/chat',
			initialMessages: [
				{
					id: 'welcome',
					role: 'assistant',
					content:
						'¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?',
				},
			],
		})

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}

	useEffect(() => {
		scrollToBottom()
	}, [messages])

	useEffect(() => {
		if (isOpen && inputRef.current) {
			inputRef.current.focus()
		}
		// Load message history when chat opens
		if (isOpen && !isLoadingHistory && messages.length === 1) {
			setIsLoadingHistory(true)
			getMessages()
				.then(history => {
					if (!history.error) {
						setMessages(history.data)
					}
				})
				.catch(() => {
					// Keep initial message on error
				})
				.finally(() => {
					setIsLoadingHistory(false)
				})
		}
	}, [isOpen, isLoadingHistory, messages.length])

	const handleSendMessage = async () => {
		if (!inputValue.trim() || isExecuting) return

		const content = inputValue
		setInputValue('')
		setIsTyping(true)

		// Execute the action to send message to backend
		execute({ content })
	}

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSubmit(e as any)
		}
	}

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString('es-ES', {
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	return (
		<>
			{/* Floating Button */}
			<div className="fixed right-6 bottom-6 z-50">
				<Button
					onClick={() => setIsOpen(!isOpen)}
					size="lg"
					className="h-14 w-14 rounded-full bg-blue-600 shadow-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-xl"
				>
					{isOpen ? (
						<X className="h-6 w-6" />
					) : (
						<MessageCircle className="h-6 w-6" />
					)}
				</Button>
			</div>

			{/* Chat Window */}
			{isOpen && (
				<div className="fixed right-6 bottom-24 z-40 h-96 w-80 shadow-2xl sm:w-96">
					<Card className="flex h-full flex-col">
						<CardHeader className="rounded-t-lg bg-blue-600 pb-3 text-white">
							<div className="flex items-center gap-3">
								<Avatar className="h-8 w-8">
									<AvatarFallback className="bg-blue-500 text-white">
										<Bot className="h-4 w-4" />
									</AvatarFallback>
								</Avatar>
								<div>
									<CardTitle className="text-lg">
										Asistente Virtual
									</CardTitle>
									<p className="text-sm text-blue-100">
										En línea
									</p>
								</div>
							</div>
						</CardHeader>

						<CardContent className="flex-1 p-0">
							<ScrollArea className="h-full p-4">
								<div className="space-y-4">
									{messages.map(message => (
										<div
											key={message.id}
											className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
										>
											{message.role === 'assistant' && (
												<Avatar className="mt-1 h-8 w-8">
													<AvatarFallback className="bg-blue-100 text-blue-600">
														<Bot className="h-4 w-4" />
													</AvatarFallback>
												</Avatar>
											)}

											<div
												className={`max-w-[70%] rounded-lg px-3 py-2 ${
													message.role === 'user'
														? 'bg-blue-600 text-white'
														: 'bg-gray-100 text-gray-900'
												}`}
											>
												<p className="text-sm whitespace-pre-wrap">
													{message.content}
												</p>
												<p
													className={`mt-1 text-xs ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}
												>
													{formatTime(
														message.createdAt,
													)}
												</p>
											</div>

											{message.role === 'user' && (
												<Avatar className="mt-1 h-8 w-8">
													<AvatarFallback className="bg-gray-100 text-gray-600">
														<User className="h-4 w-4" />
													</AvatarFallback>
												</Avatar>
											)}
										</div>
									))}

									{/* Typing Indicator */}
									{isLoading && (
										<div className="flex justify-start gap-3">
											<Avatar className="mt-1 h-8 w-8">
												<AvatarFallback className="bg-blue-100 text-blue-600">
													<Bot className="h-4 w-4" />
												</AvatarFallback>
											</Avatar>
											<div className="rounded-lg bg-gray-100 px-3 py-2">
												<div className="flex space-x-1">
													<div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
													<div
														className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
														style={{
															animationDelay:
																'0.1s',
														}}
													></div>
													<div
														className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
														style={{
															animationDelay:
																'0.2s',
														}}
													></div>
												</div>
											</div>
										</div>
									)}

									<div ref={messagesEndRef} />
								</div>
							</ScrollArea>
						</CardContent>

						<CardFooter className="border-t p-4">
							<form
								onSubmit={handleSubmit}
								className="flex w-full gap-2"
							>
								<Input
									ref={inputRef}
									value={input}
									onChange={handleInputChange}
									onKeyUp={handleKeyPress}
									placeholder="Escribe tu mensaje..."
									disabled={isLoading}
									className="flex-1"
								/>
								<Button
									type="submit"
									disabled={!input.trim() || isLoading}
									size="sm"
									className="px-3"
								>
									<Send className="h-4 w-4" />
								</Button>
							</form>
						</CardFooter>
					</Card>
				</div>
			)}
		</>
	)
}
