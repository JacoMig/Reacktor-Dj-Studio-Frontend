
export const debounce = function (delay: number, cb: () => void) {
    let timer: ReturnType<typeof setTimeout>
    return function () {
        clearTimeout(timer)

        timer = setTimeout(() => {
            cb()
        }, delay)
    }
}
