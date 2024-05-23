import {
    doc,
    setDoc,
    getDoc,
    getDocs,
    collection,
    addDoc,
    updateDoc,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { getUser } from "./users";
import { AdditionalMessageDetails, Conversation } from "@/types/chat";
import { createTitle } from "@/lib/util/utilities";
import { MessageType } from "@axflow/models/shared";

// user --> {conversations: ["1", "2"], userId, username, etc.}
// conversation --> {title: "something", messages: [1: chats, 2: chats]}

export async function getConversation(conversationId: string): Promise<Conversation> {
    const convoData = (await getDoc(doc(db, "conversations", conversationId))).data();
    return { ...convoData, conversationId: conversationId } as Conversation
}

// get conversations
export async function getAllUserConversations(
    userId: string
): Promise<Conversation[]> {
    const user = await getUser(userId);
    return await Promise.all(
        user?.conversations?.map(async (conversationId: string) => {
            return await getConversation(conversationId);
        })
    );
}

export async function getConversationMessages(
    conversationId: string
): Promise<any[]> {
    const snapshot = await getDocs(collection(db, "conversations", conversationId, "messages"))
    return snapshot.docs.map(message => message.data());
}

export async function getMessage(
    conversationId: string,
    messageId: string
): Promise<any> {
    const snapshot = await getDoc(doc(db, "conversations", conversationId, "messages", messageId))
    return snapshot.data()
}


// save conversations
export async function createNewConversation(
    userId: string,
    title: string,
    messages: any,
    promptQuestion?: string
): Promise<any> {
    const partialConvo: Partial<Conversation> = { title }
    if (promptQuestion) {
        partialConvo.promptQuestion = promptQuestion
    }
    const convoDoc = await addDoc(collection(db, `conversations`), partialConvo);

    messages?.forEach(async (message: any) => {
        await addMessageToConversation(convoDoc.id, message)
    });

    const user = await getUser(userId);
    const newConvos = [...(user?.conversations || []), convoDoc.id];
    return await updateDoc(doc(db, "users", userId), {
        conversations: newConvos,
    }).then(() => {
        return convoDoc.id
    });
}

export async function updateConversationMessages(
    conversationId: string,
    messages: any
) {
    return Promise.all(messages?.map(async (message: any) => {
        if (message) {
            return await addMessageToConversation(conversationId, message)
        }
    }));
}

export async function saveConversationDetails(
    conversationId: string,
    conversation: Partial<Conversation>
) {
    return await updateDoc(doc(db, "conversations", conversationId), conversation)
}

// add chat
export async function addMessageToConversation(conversationId: string, message: MessageType & AdditionalMessageDetails) {
    const messageDoc = await setDoc(doc(db, "conversations", conversationId, "messages", message.id), message);
    return await getConversation(conversationId).then(async (conversation) => {
        if (conversation) {
            const messagesList = [...(conversation.messages || []), message.id];
            return await saveConversationDetails(conversationId, { messages: messagesList });
        } else {
            console.error("something went wrong with fetching conversation");
        }
    });
}

// update chat
export async function respondToChat(
    conversationId: string,
    messageId: string,
    response: boolean
) {
    return await updateDoc(doc(db, "conversations", conversationId, "messages", messageId), {
        liked: response, timeResponded: serverTimestamp()
    }).then(async () => {
        return await getMessage(conversationId, messageId)
    })
}
