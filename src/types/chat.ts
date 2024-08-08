import { MessageType } from "@axflow/models/shared";
import { FieldValue } from "firebase/firestore";

export interface DialogProps {
    role: SystemRoles;
    content: string;
    id: string;
    created: number;
}

export enum SystemRoles {
    USER = "user",
    SYSTEM = "system",
    ASSISTANT = "assistant",
}

export interface Conversation {
    conversationId: string;
    title: string;
    messages: MessageInfo[];
    promptQuestion?: string;
    created?: FieldValue;
}

export interface MessageInfo {
    [key: string]: string
}

export interface MessageObj {
    [key: string]: MessageType
}

export interface AdditionalMessageDetails {
    response?: { liked: boolean, timeResponded: string }
    created?: FieldValue | number
    updated?: FieldValue | number
}