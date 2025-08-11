"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
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

const initialMessages: Message[] = [
	{
		id: "1",
		content: "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?",
		sender: "bot",
		timestamp: new Date(),
	},
]

const botResponses = [
	{
		keywords: ["hola", "hello", "hi", "buenos días", "buenas tardes"],
		response: "¡Hola! ¿Cómo estás? ¿En qué puedo ayudarte?",
	},
	{
		keywords: ["modelo", "modelos", "llm"],
		response:
			"Puedo ayudarte con la gestión de modelos LLM. Puedes crear, editar y configurar diferentes modelos desde la sección de Modelos.",
	},
	{
		keywords: ["preset", "presets", "configuración"],
		response:
			"Los presets te permiten combinar múltiples modelos con configuraciones específicas. Visita la sección de Presets para crear nuevas combinaciones.",
	},
	{
		keywords: ["análisis", "sesgo", "sesgos", "género"],
		response:
			"Puedo ayudarte con los análisis de sesgos de género. En la sección de Análisis puedes ver todos los análisis realizados y sus resultados.",
	},
	{
		keywords: ["ayuda", "help", "soporte"],
		response:
			"Estoy aquí para ayudarte. Puedes preguntarme sobre modelos, presets, análisis o cualquier funcionalidad de la plataforma.",
	},
	{
		keywords: ["gracias", "thanks", "thank you"],
		response: "¡De nada! Si necesitas algo más, no dudes en preguntarme.",
	},
	{
		keywords: ["adiós", "bye", "hasta luego", "chao"],
		response:
			"¡Hasta luego! Que tengas un buen día. Estaré aquí cuando me necesites.",
	},
]

const defaultResponse =
	"Entiendo tu consulta. Para obtener ayuda más específica, puedes navegar por las diferentes secciones de la aplicación o contactar con nuestro equipo de soporte."

export default function FloatingChatbot() {
	const [isOpen, setIsOpen] = useState(false)
	const [messages, setMessages] = useState<Message[]>(initialMessages)
	const [inputValue, setInputValue] = useState("")
	const [isTyping, setIsTyping] = useState(false)
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)

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
	}, [isOpen])

	const getBotResponse = (userMessage: string): string => {
		const lowerMessage = userMessage.toLowerCase()

		for (const response of botResponses) {
			if (
				response.keywords.some((keyword) =>
					lowerMessage.includes(keyword),
				)
			) {
				return response.response
			}
		}

		return defaultResponse
	}

	const handleSendMessage = async () => {
		if (!inputValue.trim()) return

		const userMessage: Message = {
			id: Date.now().toString(),
			content: inputValue,
			sender: "user",
			timestamp: new Date(),
		}

		setMessages((prev) => [...prev, userMessage])
		setInputValue("")
		setIsTyping(true)

		// Simulate bot thinking time
		setTimeout(
			() => {
				const botResponse: Message = {
					id: (Date.now() + 1).toString(),
					content: getBotResponse(userMessage.content),
					sender: "bot",
					timestamp: new Date(),
				}

				setMessages((prev) => [...prev, botResponse])
				setIsTyping(false)
			},
			1000 + Math.random() * 1000,
		) // Random delay between 1-2 seconds
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
