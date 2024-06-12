import { MessageObj } from "@/types/chat"

export function createTitle() {
    const date = new Date()
    const month: string = Months[date.getMonth()]
    const day = date.getDate()
    const year = date.getFullYear()

    return `${month} ${day}, ${year}`
}

const Months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
]


export function getRandomInteger(max: number) {
    return Math.floor(Math.random() * max)
}

export function mapCurrentConvoMsgToMessage(currentConvo: MessageObj[]) {
    return currentConvo.map(msgObj => {
        const keys = Object.keys(msgObj).map(Number);
        return keys.length ? msgObj[Math.max(...keys).toString()] : msgObj[0];
    });
}