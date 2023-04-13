export const sleep = async (time: number): Promise<void> => {
    return new Promise((resovle) => setTimeout(() => resovle(), time * 1000))
}

export const omitAddress = (address: string) => {
    if (!address) return ''
    const startStr = address.substring(0, 6)
    const endStr = address.substring(address.length - 4, address.length)
    return `${startStr}...${endStr}`
}