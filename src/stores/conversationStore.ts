import { atom } from 'jotai';
import { Conversation, MessageObj } from "@/types/chat";
import { createTitle } from '@/lib/util/utilities';
import {
    createNewConversation,
    deleteConversation as deleteConvoFromDB,
    getConversation,
    getConversationMessages,
    respondToChat,
    saveConversationDetails,
    updateConversationMessage as updateConvoMessageInDB
} from '@/lib/firebase/data/chats';
import { MessageType } from '@axflow/models/shared';

export const defaultConversation: Conversation = {
    title: "",
    conversationId: "",
    messages: [],
    promptQuestion: ""
};

// Base atoms
export const conversationsAtom = atom<Conversation[]>([]);
export const currentConversationAtom = atom<Conversation>(defaultConversation);
export const currentConvoMessagesAtom = atom<MessageObj[]>([]);

// Action atoms
export const setCurrentConversationAtom = atom(
    null,
    async (get, set, conversationId: string) => {
        if (conversationId) {
            const conversation = await getConversation(conversationId);
            const convoMessages = await getConversationMessages(conversationId);
            set(currentConversationAtom, conversation);
            set(currentConvoMessagesAtom, convoMessages);
        } else {
            set(currentConversationAtom, defaultConversation);
            set(currentConvoMessagesAtom, []);
        }
    }
);

export const createConversationAtom = atom(
    null,
    async (get, set, { userId, messages, promptQuestion = "" }: {
        userId: string;
        messages: any[];
        promptQuestion?: string
    }) => {
        const title = promptQuestion || createTitle();
        const convoId = await createNewConversation(userId, title, messages, promptQuestion);
        const convo = await getConversation(convoId);

        const currentConvos = get(conversationsAtom);
        set(conversationsAtom, [...currentConvos, convo]);
        set(currentConversationAtom, convo);

        // Trigger setCurrentConversation
        await set(setCurrentConversationAtom, convo.conversationId);
    }
);

export const deleteConversationAtom = atom(
    null,
    async (get, set, { userId, conversationId }: { userId: string; conversationId: string }) => {
        await deleteConvoFromDB(userId, conversationId);
        const currentConvos = get(conversationsAtom);
        const newConvos = currentConvos.filter(convo => convo.conversationId !== conversationId);
        set(conversationsAtom, newConvos);
    }
);

export const respondToMessageAtom = atom(
    null,
    async (get, set, { messageId, response }: { messageId: string; response: boolean }) => {
        await respondToChat(messageId, response);
    }
);

export const updateConversationAtom = atom(
    null,
    async (get, set, { conversationId, convoDetails }: {
        conversationId: string;
        convoDetails: Partial<Conversation>
    }) => {
        await saveConversationDetails(conversationId, convoDetails);

        const currentConvos = get(conversationsAtom);
        const updatedConversations = currentConvos.map(convo =>
            convo.conversationId === conversationId ? { ...convo, ...convoDetails } : convo
        );
        set(conversationsAtom, updatedConversations);

        const currentConvo = get(currentConversationAtom);
        if (currentConvo.conversationId === conversationId) {
            set(currentConversationAtom, { ...currentConvo, ...convoDetails });
        }
    }
);

export const updateConversationMessageAtom = atom(
    null,
    async (get, set, { conversationId, message, index }: {
        conversationId: string;
        message: MessageType;
        index?: number
    }) => {
        await updateConvoMessageInDB(conversationId, message, index);
    }
);