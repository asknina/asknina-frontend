import { createStore } from 'zustand/vanilla'
import { DialogProps, Conversation } from "@/types/chat";
import { createTitle } from '@/lib/util/utilities';
import { createNewConversation, getConversation, getConversationMessages, respondToChat, saveConversationDetails } from '@/lib/firebase/data/chats';

export type ConversationState = {
    conversations: Conversation[]
    currentConversation: Conversation
    currentConvoMessages: DialogProps[]
}

export type ConversationActions = {
    createConversation: (userId: string, messages: any[], promptQuestion?: string) => Promise<void>
    setConversations: (conversations: Conversation[]) => void
    setCurrentConversation: (conversationId: string) => Promise<void>
    respondToMessage: (conversationId: string, messageId: string, response: boolean) => Promise<void>
    updateConversation: (conversationId: string, conversationDetails: Partial<Conversation>) => void
}

export type ConversationStore = ConversationState & ConversationActions

export const defaultInitState: ConversationState = {
    conversations: [],
    currentConversation: { title: "", conversationId: "", messages: [], promptQuestion: "" },
    currentConvoMessages: []
}

export const createConversationStore = (
    initState: ConversationState = defaultInitState,
) => {
    return createStore<ConversationStore>()((set, get) => ({
        ...initState,
        setConversations: (conversations) => set(() => ({ conversations: conversations })),
        setCurrentConversation: async (conversationId) => {
            if (conversationId) {
                const conversation = await getConversation(conversationId)
                const convoMessages = await getConversationMessages(conversationId)
                set(() => ({
                    currentConversation: conversation,
                    currentConvoMessages: convoMessages
                }))
            } else {
                set(() => ({
                    currentConversation: defaultInitState.currentConversation
                }))
            }
        },
        createConversation: async (userId, messages, promptQuestion) => {
            return await createNewConversation(userId, createTitle(), messages, promptQuestion).then(async (convoId) => {
                const convo = await getConversation(convoId)
                console.log({ convo })
                set((state) => ({ conversations: [...state.conversations, convo], currentConversation: convo }))
            })
        },
        respondToMessage: async (conversationId: string, messageId: string, response: boolean) => {
            await respondToChat(conversationId, messageId, response).then((updatedMessage) => {
                const updateMessageIdx = get().currentConvoMessages.findIndex(msg => msg.id == messageId)
                const updatedConvoMessages = [...get().currentConvoMessages]
                updatedConvoMessages[updateMessageIdx] = updatedMessage
                set(({
                    currentConvoMessages: updatedConvoMessages
                }))
            })
        },
        updateConversation: async (conversationId: string, convoDetails: Partial<Conversation>) => {
            await saveConversationDetails(conversationId, convoDetails).then(() => {
                const updateIndex = get().conversations.findIndex(convo => convo.conversationId == conversationId)
                const updatedconvos = [...get().conversations]
                updatedconvos[updateIndex] = { ...updatedconvos[updateIndex], ...convoDetails }
                set({ conversations: updatedconvos })
            })
        }
    }))
}