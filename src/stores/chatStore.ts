import { createStore } from 'zustand/vanilla'

export type InitialQuestionState = {
    promptNumber: number,
    question: string
}
export type ChatState = {
    initialQuestion: InitialQuestionState
    systemMessage: number
    messages: any[]
}

export type ChatActions = {
    setInitialQuestion: (question: InitialQuestionState) => void
    setMessages: (messages: any[]) => void
}

export type ChatStore = ChatState & ChatActions

export const defaultInitState: ChatState = {
    initialQuestion: {
        promptNumber: 0,
        question: "",
    },
    systemMessage: 0,
    messages: []
}

export const createChatStore = (
    initState: ChatState = defaultInitState,
) => {
    return createStore<ChatStore>()((set) => ({
        ...initState,
        setInitialQuestion: (question: InitialQuestionState) => set(() => ({ initialQuestion: question })),
        setMessages: (messages) => set(() => ({ messages: messages })),

    }))
}