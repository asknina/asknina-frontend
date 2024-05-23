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