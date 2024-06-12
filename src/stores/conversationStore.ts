import { createStore } from 'zustand/vanilla'
import { Conversation, MessageObj } from "@/types/chat";
import { createTitle } from '@/lib/util/utilities';
import { createNewConversation, deleteConversation, getConversation, getConversationMessages, respondToChat, saveConversationDetails, updateConversationMessage } from '@/lib/firebase/data/chats';
import { MessageType } from '@axflow/models/shared';

export type ConversationState = {
    conversations: Conversation[]
    currentConversation: Conversation
    currentConvoMessages: MessageObj[]
}


export type ConversationActions = {
    createConversation: (userId: string, messages: any[], promptQuestion?: string) => Promise<void>
    setConversations: (conversations: Conversation[]) => void
    setCurrentConversation: (conversationId: string) => Promise<void>
    setCurrentConversationMessages: (messages: MessageObj[]) => void
    respondToMessage: (messageId: string, response: boolean, convoIndex: number) => Promise<void>
    updateConversation: (conversationId: string, conversationDetails: Partial<Conversation>) => void
    updateConversationMessage: (conversationId: string, message: MessageType, index?: number) => void
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
        setConversations: (conversations) => set(() => ({ conversations })),
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
        setCurrentConversationMessages: (messages: MessageObj[]) => {
            set(() => ({
                currentConvoMessages: messages
            }))
        },
        createConversation: async (userId, messages, promptQuestion = "") => {
            const title = promptQuestion || createTitle()
            const convoId = await createNewConversation(userId, title, messages, promptQuestion);
            const convo = await getConversation(convoId);
            set((state) => ({
                conversations: [...state.conversations, convo],
                currentConversation: convo
            }));
            await get().setCurrentConversation(convo.conversationId);
        },
        deleteConversation: async (userId: string, conversationId: string) => {
            await deleteConversation(userId, conversationId)
            const newConvos = get().conversations.filter(convo => convo.conversationId !== conversationId)
            set({ conversations: newConvos });
        },
        respondToMessage: async (messageId: string, response: boolean, convoIndex: number) => {
            const updatedMessage = await respondToChat(messageId, response)
        },
        updateConversation: async (conversationId: string, convoDetails: Partial<Conversation>) => {
            await saveConversationDetails(conversationId, convoDetails)
            set((state) => {
                const updatedConversations = state.conversations.map(convo =>
                    convo.conversationId === conversationId ? { ...convo, ...convoDetails } : convo
                );
                return { conversations: updatedConversations };
            });
            if (get().currentConversation.conversationId === conversationId) {
                set((state) => ({
                    currentConversation: { ...state.currentConversation, ...convoDetails }
                }));
            }
        }
        ,
        updateConversationMessage: async (conversationId: string, message: MessageType, index?: number) => {
            await updateConversationMessage(conversationId, message, index);
        }
    }))
}