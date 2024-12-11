let timer: ReturnType<typeof setTimeout>
export const debounce = function (delay: number, cb: () => void) {
    return function () {
        clearTimeout(timer)

        timer = setTimeout(() => {
            cb()
        }, delay)
    }
}
