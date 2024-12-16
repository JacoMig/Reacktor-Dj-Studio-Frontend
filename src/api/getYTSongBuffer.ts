import httpClient from '../http/httpClient'
import { getFromCache, saveToCache } from '../lib/dbHelper'

export type GetYTSongBufferResponse = {
    audioBuffer: AudioBuffer
    blob: Blob
}

const getYTSongBuffer = async (
    videoId: string
): Promise<GetYTSongBufferResponse> => {
    const audioCtx = new AudioContext()

    const cachedData = await getFromCache(videoId)

    if (cachedData) {
        console.log('Serving from cache')

        return {
            blob: cachedData.blob,
            audioBuffer: await audioCtx.decodeAudioData(cachedData.arrayBuffer),
        }
    }

    const options = {
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            videoId,
        }),
    }
    const stream = await httpClient({
        path: `getStream`,
        options,
    })

    const blob = await stream.blob()
    const arrayBuffer = await blob.arrayBuffer()

    await saveToCache(videoId, {
        blob,
        arrayBuffer,
    })

    console.log('Data cached in IndexedDB')

    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)

   

    return {
        audioBuffer,
        blob
    }
}

export default getYTSongBuffer
