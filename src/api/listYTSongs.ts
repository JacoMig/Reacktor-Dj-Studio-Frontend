import httpClient from "../http/httpClient"

export type SearchVideoResponse = {
    timestamp: string,
    videoId: string,
    thumbnail?: string,
    title: string,
    url: string
}[]

export type SearchResponse = {
    count: number
    videos:SearchVideoResponse
}

const listYTSongs = async (q:string):Promise<SearchResponse> => {
    const options = {
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'GET',
    }
    const list = await httpClient({
        path: `search?q=${q}`,
        options 
    })

    return await list.json()
}

export default listYTSongs