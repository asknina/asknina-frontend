import { createStore } from 'zustand/vanilla'
import { DialogProps, Conversation } from "@/types/chat";
import { createTitle } from '@/lib/util/utilities';
import { createNewConversation, deleteConversation, getConversation, getConversationMessages, respondToChat, saveConversationDetails, updateConversationMessages } from '@/lib/firebase/data/chats';
import { MessageType } from '@axflow/models/shared';

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
    updateConversationMessages: (conversationId: string, messages: MessageType[]) => void
    deleteConversation: (userId: string, conversationId: string) => void
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
                    currentConversation: defaultInitState.currentConversation,
                    currentConvoMessages: []
                }))
            }
        },
        createConversation: async (userId, messages, promptQuestion = "") => {
            const title = promptQuestion ? promptQuestion : createTitle()
            await createNewConversation(userId, title, messages, promptQuestion).then(async (convoId) => {
                const convo = await getConversation(convoId)
                set((state) => ({ conversations: [...state.conversations, convo], currentConversation: convo }))
                get().setCurrentConversation(convo.conversationId)
            })
        },
        deleteConversation: async (userId: string, conversationId: string) => {
            await deleteConversation(userId, conversationId)
            const newConvos = get().conversations.filter(convo => convo.conversationId !== conversationId)
            get().setConversations(newConvos)
        },
        respondToMessage: async (conversationId: string, messageId: string, response: boolean) => {
            await respondToChat(conversationId, messageId, response).then((updatedMessage) => {
                const updateMessageIdx = get().currentConvoMessages.findIndex(msg => msg.id == messageId)
                const updatedConvoMessages = [...get().currentConvoMessages]
                updatedConvoMessages[updateMessageIdx] = updatedMessage
                set({
                    currentConvoMessages: updatedConvoMessages
                })
            })
        },
        updateConversation: async (conversationId: string, convoDetails: Partial<Conversation>) => {
            await saveConversationDetails(conversationId, convoDetails).then(() => {
                const updateIndex = get().conversations.findIndex(convo => convo.conversationId == conversationId)
                const updatedConvos = [...get().conversations]
                updatedConvos[updateIndex] = { ...updatedConvos[updateIndex], ...convoDetails }
                get().setConversations(updatedConvos)
                if (get().currentConversation.conversationId == conversationId) {
                    set((state) => ({ currentConversation: { ...state.currentConversation, ...convoDetails } }))
                }

            })
        },
        updateConversationMessages: async (conversationId: string, messages: MessageType[]) => {
            return await updateConversationMessages(
                conversationId,
                messages
            ).then(async () => {
                const newMessagesForConvo = [
                    ...(get().currentConversation?.messages || []),
                    ...(messages.map(msg => msg.id)),
                ];
                // update Conversation

                get().updateConversation(conversationId, {
                    messages: newMessagesForConvo,
                });
            });
        }
    }))
}