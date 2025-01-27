
export const debounce = function (delay: number, cb: (query:string) => void) {
    let timer: ReturnType<typeof setTimeout>
    return function (query:string) {
        clearTimeout(timer)

        timer = setTimeout(() => {
            cb(query)
        }, delay)
    }
}
