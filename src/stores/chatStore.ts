import { atom } from 'jotai';

export type InitialQuestionState = {
    promptNumber: number,
    question: string
}

export type ChatState = {
    initialQuestion: InitialQuestionState
    systemMessage: number
    messages: any[]
}

export const defaultInitialQuestion: InitialQuestionState = {
    promptNumber: 0,
    question: "",
};

export const defaultChatState: ChatState = {
    initialQuestion: defaultInitialQuestion,
    systemMessage: 0,
    messages: []
};

// Base atoms
export const initialQuestionAtom = atom<InitialQuestionState>(defaultInitialQuestion);
export const systemMessageAtom = atom<number>(0);
export const messagesAtom = atom<any[]>([]);