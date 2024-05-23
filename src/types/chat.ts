
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
    messages: string[]
    promptQuestion?: string;
}

export interface AdditionalMessageDetails {
    response?: { liked: boolean, timeResponded: string }
}