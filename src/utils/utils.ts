export const omitAddress = (address: string) => {
    if (!address) return ''
    const startStr = address.substring(0, 6)
    const endStr = address.substring(address.length - 4, address.length)
    return `${startStr}...${endStr}`
}