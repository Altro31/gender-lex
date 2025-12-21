'use client'
import {
	Conversation,
	ConversationContent,
	ConversationScrollButton,
} from '@/components/ai-elements/conversation'
import {
	Message,
	MessageAction,
	MessageActions,
	MessageContent,
	MessageResponse,
} from '@/components/ai-elements/message'
import {
	PromptInput,
	PromptInputBody,
	PromptInputFooter,
	type PromptInputMessage,
	PromptInputSubmit,
	PromptInputTextarea,
	PromptInputTools,
} from '@/components/ai-elements/prompt-input'
import {
	Reasoning,
	ReasoningContent,
	ReasoningTrigger,
} from '@/components/ai-elements/reasoning'
import { Button } from '@/components/ui/button'
import { fetchServerSentEvents, useChat } from '@tanstack/ai-react'
import type { ChatStatus } from 'ai'
import { CopyIcon, MessageCircle, RefreshCcwIcon, X } from 'lucide-react'
import { Activity, useState } from 'react'
import { Loader } from '../ai-elements/loader'

export default function FloatingChatbot() {
	const [isOpen, setIsOpen] = useState(false)
	const [input, setInput] = useState('')
	const { messages, sendMessage, isLoading, error, reload } = useChat({
		connection: fetchServerSentEvents('/api/chat'),
	})

	const handleSubmit = (message: PromptInputMessage) => {
		const hasText = Boolean(message.text)
		if (!hasText) {
			return
		}
		sendMessage(message.text)
		setInput('')
	}

	const status: ChatStatus = isLoading
		? 'streaming'
		: error
			? 'error'
			: 'ready'

	return (
		<>
			<div className="fixed right-6 bottom-6 z-50">
				<Button
					onClick={() => setIsOpen(!isOpen)}
					size="lg"
					className="group relative h-16 w-16 rounded-full shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl"
				>
					<div className="absolute inset-0 rounded-full bg-blue-400/20 blur-xl transition-opacity duration-300 group-hover:opacity-100 opacity-0" />
					{isOpen ? (
						<X className="relative h-6 w-6 text-white transition-transform duration-300 group-hover:rotate-90" />
					) : (
						<MessageCircle className="relative h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110" />
					)}
				</Button>
			</div>

			<Activity mode={isOpen ? 'visible' : 'hidden'}>
				<div className="fixed right-6 bottom-24 z-40 h-128 w-80 sm:w-96 animate-in slide-in-from-bottom-4 fade-in duration-300">
					<div className="flex h-full flex-col rounded-2xl border border-border/50 bg-background/95 shadow-2xl backdrop-blur-xl">
						<div className="flex items-center justify-between border-b border-border/50 bg-linear-to-r from-blue-600/10 to-purple-600/10 px-5 py-4 rounded-t-2xl">
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
									<MessageCircle className="h-5 w-5 text-white" />
								</div>
								<div>
									<h3 className="font-semibold text-foreground">
										Asistente AI
									</h3>
									<p className="text-xs text-muted-foreground">
										En línea
									</p>
								</div>
							</div>
						</div>

						<div className="flex-1 overflow-hidden px-4 py-3">
							<Conversation className="h-full">
								<ConversationContent>
									{messages.map(message => (
										<div key={message.id}>
											{message.parts.map((part, i) => {
												switch (part.type) {
													case 'text':
														return (
															<Message
																key={`${message.id}-${i}`}
																from={
																	message.role
																}
															>
																<MessageContent>
																	<MessageResponse>
																		{
																			part.content
																		}
																	</MessageResponse>
																</MessageContent>
																{message.role ===
																	'assistant' &&
																	i ===
																		messages.length -
																			1 && (
																		<MessageActions>
																			<MessageAction
																				onClick={() =>
																					reload()
																				}
																				label="Retry"
																			>
																				<RefreshCcwIcon className="size-3" />
																			</MessageAction>
																			<MessageAction
																				onClick={() =>
																					navigator.clipboard.writeText(
																						part.content,
																					)
																				}
																				label="Copy"
																			>
																				<CopyIcon className="size-3" />
																			</MessageAction>
																		</MessageActions>
																	)}
															</Message>
														)
													case 'thinking':
														return (
															<Reasoning
																key={`${message.id}-${i}`}
																className="w-full"
																isStreaming={
																	status ===
																		'streaming' &&
																	i ===
																		message
																			.parts
																			.length -
																			1 &&
																	message.id ===
																		messages.at(
																			-1,
																		)?.id
																}
															>
																<ReasoningTrigger />
																<ReasoningContent>
																	{
																		part.content
																	}
																</ReasoningContent>
															</Reasoning>
														)
													default:
														return null
												}
											})}
										</div>
									))}
									{isLoading && <Loader />}
								</ConversationContent>
								<ConversationScrollButton />
							</Conversation>
						</div>

						<div className="border-t border-border/50 bg-muted/30 px-4 py-3 rounded-b-2xl">
							<PromptInput
								onSubmit={handleSubmit}
								globalDrop
								multiple
								className="rounded-xl border-border/50 bg-background shadow-sm transition-shadow duration-200 focus-within:shadow-md"
							>
								<PromptInputBody>
									<PromptInputTextarea
										onChange={e => setInput(e.target.value)}
										value={input}
										placeholder="Escribe tu mensaje..."
										className="placeholder:text-muted-foreground/60"
									/>
								</PromptInputBody>
								<PromptInputFooter>
									<PromptInputTools></PromptInputTools>
									<PromptInputSubmit
										disabled={!input && !status}
										status={status}
									/>
								</PromptInputFooter>
							</PromptInput>
						</div>
					</div>
				</div>
			</Activity>
		</>
	)
}
