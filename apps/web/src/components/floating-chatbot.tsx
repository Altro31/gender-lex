"use client"

import type React from "react"

import { useState, useRef, useEffect, useOptimistic } from "react"
import { sendMessage, getMessages } from "@/services/chatbot"
import { useAction } from "next-safe-action/hooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"

interface Message {
	id: string
	content: string
	sender: "user" | "bot"
	timestamp: Date
}

export default function FloatingChatbot() {
	const [isOpen, setIsOpen] = useState(false)
	const [messages, setMessages] = useState<Message[]>([
		{
			id: "1",
			content:
				"¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?",
			sender: "bot",
			timestamp: new Date(),
		},
	])
	const [inputValue, setInputValue] = useState("")
	const [isTyping, setIsTyping] = useState(false)
	const [isLoadingHistory, setIsLoadingHistory] = useState(false)
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)

	const { execute, isExecuting } = useAction(sendMessage, {
		onSuccess: ({ data }) => {
			if (data?.data) {
				setMessages((prev) => [
					...prev,
					{
						id: data.data.userMessage.id,
						content: data.data.userMessage.content,
						sender: "user" as const,
						timestamp: new Date(data.data.userMessage.createdAt),
					},
					{
						id: data.data.botMessage.id,
						content: data.data.botMessage.content,
						sender: "bot" as const,
						timestamp: new Date(data.data.botMessage.createdAt),
					},
				])
			}
			setIsTyping(false)
		},
		onError: () => {
			setIsTyping(false)
		},
	})

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
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
				.then((history) => {
					if (history && history.length > 0) {
						const formattedMessages = history.map((msg: any) => ({
							id: msg.id,
							content: msg.content,
							sender: msg.sender as "user" | "bot",
							timestamp: new Date(msg.createdAt),
						}))
						setMessages([...formattedMessages])
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
		setInputValue("")
		setIsTyping(true)

		// Execute the action to send message to backend
		execute({ content })
	}

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault()
			handleSendMessage()
		}
	}

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString("es-ES", {
			hour: "2-digit",
			minute: "2-digit",
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
									{messages.map((message) => (
										<div
											key={message.id}
											className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
										>
											{message.sender === "bot" && (
												<Avatar className="mt-1 h-8 w-8">
													<AvatarFallback className="bg-blue-100 text-blue-600">
														<Bot className="h-4 w-4" />
													</AvatarFallback>
												</Avatar>
											)}

											<div
												className={`max-w-[70%] rounded-lg px-3 py-2 ${
													message.sender === "user"
														? "bg-blue-600 text-white"
														: "bg-gray-100 text-gray-900"
												}`}
											>
												<p className="text-sm">
													{message.content}
												</p>
												<p
													className={`mt-1 text-xs ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}
												>
													{formatTime(
														message.timestamp,
													)}
												</p>
											</div>

											{message.sender === "user" && (
												<Avatar className="mt-1 h-8 w-8">
													<AvatarFallback className="bg-gray-100 text-gray-600">
														<User className="h-4 w-4" />
													</AvatarFallback>
												</Avatar>
											)}
										</div>
									))}

									{/* Typing Indicator */}
									{isTyping && (
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
																"0.1s",
														}}
													></div>
													<div
														className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
														style={{
															animationDelay:
																"0.2s",
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
							<div className="flex w-full gap-2">
								<Input
									ref={inputRef}
									value={inputValue}
									onChange={(e) =>
										setInputValue(e.target.value)
									}
									onKeyPress={handleKeyPress}
									placeholder="Escribe tu mensaje..."
									disabled={isTyping}
									className="flex-1"
								/>
								<Button
									onClick={handleSendMessage}
									disabled={!inputValue.trim() || isTyping}
									size="sm"
									className="px-3"
								>
									<Send className="h-4 w-4" />
								</Button>
							</div>
						</CardFooter>
					</Card>
				</div>
			)}
		</>
	)
}
