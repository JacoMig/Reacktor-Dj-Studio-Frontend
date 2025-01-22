import httpClient from '../http/httpClient'

export type LoadDemoSongDataResponse = {
    url: string
    title: string
}[]

export type LoadDemoSongResponse = {
    count: number
    data: LoadDemoSongDataResponse
}

export const fetchDemoSongsKeys =
    async (): Promise<LoadDemoSongDataResponse> => {
        const options = {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'GET',
        }
        const response = await httpClient({
            path: `getDemoSongKeys`,
            options,
        })

        if (!response.ok) throw new Error(`Failed to fetch demo keys`)

        const list: LoadDemoSongResponse = await response.json()

        return list.data
    }

export const fetchDemoSongByUrl = async (
    demoSong: LoadDemoSongDataResponse[number]
): Promise<File> => {
    const options = {
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'GET',
    }

    const response = await fetch(demoSong.url, {
        ...options,
    })

    if (!response.ok) throw new Error(`Failed to fetch demo song by url`)

    const data = await response.blob()

    return new File([data], demoSong.title, { type: 'audio/mp3' })
}
