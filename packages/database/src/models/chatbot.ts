import { Schema } from 'effect'

export type ChatConversationId = typeof ChatConversationId.Type
export const ChatConversationId = Schema.String.pipe(
	Schema.brand('ChatConversationId'),
)

export type ChatMessageId = typeof ChatMessageId.Type
export const ChatMessageId = Schema.String.pipe(Schema.brand('ChatMessageId'))

export class ChatConversation extends Schema.TaggedClass<ChatConversation>()(
	'ChatConversation',
	{
		id: ChatConversationId,
		userId: Schema.String,
		createdAt: Schema.Date,
		updatedAt: Schema.Date,
	},
) {}

export class ChatMessage extends Schema.TaggedClass<ChatMessage>()(
	'ChatMessage',
	{
		id: ChatMessageId,
		conversationId: ChatConversationId,
		content: Schema.String,
		sender: Schema.String,
		createdAt: Schema.Date,
		updatedAt: Schema.Date,
	},
) {}
