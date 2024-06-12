import {
    doc,
    setDoc,
    getDoc,
    getDocs,
    collection,
    addDoc,
    updateDoc,
    serverTimestamp,
    deleteDoc,
    Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { getUser } from "./users";
import { AdditionalMessageDetails, Conversation, MessageInfo } from "@/types/chat";
import { MessageType } from "@axflow/models/shared";

// user --> {conversations: ["1", "2"], userId, username, etc.}
// conversation --> {title: "something", messages: [{0: uid, 1: uid, 2: uid}, {0: uid, 1: uid}]}
// messages --> {uid: "something", ...other fields, systemPrompt: "string"}

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
    // Fetch the conversation
    const convo = await getConversation(conversationId);


    const allMessages: MessageInfo[] = convo.messages;
    const allMessageContent: Record<string, any> = {};

    // messages = [{0: test, 1: uid, 2: uid}, {0: test}]
    // Extract message IDs from JSON strings
    const allMessageIds: string[] = allMessages.flatMap((msgUidObj: MessageInfo) => Object.values(msgUidObj));

    // Fetch all messages and populate allMessageContent
    await Promise.all(allMessageIds.map(async (msgId) => {
        const message = await getMessage(msgId);
        allMessageContent[msgId] = message;
    }));

    // Process and map messages with their content
    const mapObj = allMessages.map(messageArrObj => {
        // replace the uid with the actual object
        const newObj = messageArrObj;
        Object.keys(messageArrObj).forEach((messageIndex: string) => {
            const fetched = allMessageContent[messageArrObj[parseInt(messageIndex)]];
            newObj[parseInt(messageIndex)] = fetched;
        });
        return newObj;
    });
    return mapObj;

}

export async function getMessage(
    messageId: string
): Promise<any> {
    const snapshot = await getDoc(doc(db, "messages", messageId))
    return snapshot.data()
}


// save conversations
export async function createNewConversation(
    userId: string,
    title: string,
    messages: any[],
    promptQuestion?: string
): Promise<any> {
    const partialConvo: Partial<Conversation> = { title, messages: [] }
    if (promptQuestion) {
        partialConvo.promptQuestion = promptQuestion
    }
    const convoDoc = await addDoc(collection(db, `conversations`), partialConvo);

    await messages.reduce(
        async (
            previousPromise,
            message: MessageType & { saved?: boolean },
            index: number
        ) => {
            await previousPromise;
            if (!message.saved) {
                await addMessageToConversation(
                    convoDoc.id,
                    // @ts-ignore message includes the saved field
                    { ...message, saved: true },
                    index
                );
            }
        },
        Promise.resolve()
    );

    const user = await getUser(userId);
    const newConvos = [...(user?.conversations || []), convoDoc.id];
    return await updateDoc(doc(db, "users", userId), {
        conversations: newConvos,
    }).then(() => {
        return convoDoc.id
    });
}

export async function deleteConversation(
    userId: string,
    conversationId: string
): Promise<any> {
    //    deleteDocument
    await deleteDoc(doc(db, "conversations", conversationId))
    // delete from user list
    const user = await getUser(userId);
    const filteredConvos = [...(user?.conversations || [])]?.filter(convoId => convoId !== conversationId)
    return await updateDoc(doc(db, "users", userId), {
        conversations: filteredConvos,
    });
}

export async function updateConversationMessage(
    conversationId: string,
    message: any,
    index?: number
) {
    return await addMessageToConversation(conversationId, message, index)
}

export async function saveConversationDetails(
    conversationId: string,
    conversation: Partial<Conversation>
) {
    return await updateDoc(doc(db, "conversations", conversationId), conversation)
}

// add chat
export async function addMessageToConversation(conversationId: string, message: MessageType & AdditionalMessageDetails, convoIndex?: number) {
    if (message?.id) {
        const messageDoc = await setDoc(doc(db, "messages", message.id), message);

        return await getConversation(conversationId).then(async (conversation) => {
            if (conversation?.messages) {
                let messagesList: MessageInfo[] = conversation.messages
                if (convoIndex) {
                    const currentIndexMessages: MessageInfo = messagesList[convoIndex] ?? {}
                    if (Object.keys(currentIndexMessages).length) {
                        const nextIndex = Math.max(...Object.keys(currentIndexMessages).map(val => parseInt(val))) + 1;
                        messagesList[convoIndex] = { ...currentIndexMessages, [nextIndex]: message.id }
                    } else {
                        messagesList[convoIndex] = { 0: message.id }
                    }
                } else {
                    messagesList.push({ '0': message.id })
                }

                await saveConversationDetails(conversationId, { messages: messagesList });
                return messagesList
            } else {
                console.error("something went wrong with fetching conversation");
            }
        });
    }
}

// update chat
export async function respondToChat(
    messageId: string,
    response: boolean
) {
    return await updateDoc(doc(db, "messages", messageId), {
        response:
            { liked: response, timeResponded: Timestamp.now() }
    }).then(async () => {
        return await getMessage(messageId)
    })
}


// one time run
// export async function messagesFormatMigration() {
//     const querySnapshot = await getDocs(collection(db, "conversations"));
//     querySnapshot.forEach(async (document) => {
//         // doc.data() is never undefined for query doc snapshots
//         const convo = document.data()
//         if (convo?.messages?.length) {
//             // check if messages format is 
//             if (typeof convo.messages[0] === 'string' || convo.messages[0] instanceof String) {
//                 const allMessages = await getOldMessages(document.id)
//                 // add to messages
//                 await Promise.all(allMessages.map(async message => {
//                     return await setDoc(doc(db, "messages", message.id), message);
//                 }))

//                 const sortedMessages = allMessages.sort((msgA, msgB) =>
//                     msgB.created > msgA.created ? -1 : 1)
//                 // 
//                 const newMessagesObj = sortedMessages.map(message => { return { 0: message.id } })
//                 await saveConversationDetails(document.id, { messages: newMessagesObj })
//             }
//         }
//     });
// }

// const getOldMessages = async (conversationId: string) => {
//     const querySnapshot = await getDocs(collection(db, "conversations", conversationId, "messages"));
//     const allMessages: any[] = []
//     querySnapshot.forEach((doc) => allMessages.push(doc.data()));
//     return allMessages
// }
// // getAllConversations

// // if conversations/conversationId/messages exists

// // add each of the messages in the subcollection to messages

// // change the messages object to be:
// // 1. get all the messages and content
// // 2. sorted array by created timestamp
// // 3. map object to new format
