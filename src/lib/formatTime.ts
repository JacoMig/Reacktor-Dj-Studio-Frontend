export const formatTime = (time?: string) => {
    if (!time) return '0:00'
    const minutes = Math.floor(Number(time) / 60)
    const seconds = Math.floor(Number(time) - minutes * 60)
        .toString()
        .padStart(2, '0')
    return `${minutes}:${seconds}`
}