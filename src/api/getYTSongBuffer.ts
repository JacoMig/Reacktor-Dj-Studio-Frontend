import { YTSTREAMS_TABLE } from '../constants'
import httpClient from '../http/httpClient'
import { getAudioContext } from '../lib/audioContextSingleTone'
import { CachedData, getRecordByKey, saveToCache } from '../lib/dbHelper'

export type GetYTSongBufferResponse = {
    audioBuffer: AudioBuffer
    blob: Blob
}

const options = (videoId: string) => ({
    headers: {
        'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
        videoId,
    }),
})

const getYTSongBuffer = async (
    videoId: string
): Promise<GetYTSongBufferResponse> => {
    const audioCtx = getAudioContext()
    
    const cachedData = await getRecordByKey<CachedData>(videoId, YTSTREAMS_TABLE)

    if (cachedData) {
        console.log('Serving from cache')
        
        return {
            blob: cachedData.blob,
            audioBuffer: await audioCtx.decodeAudioData(cachedData.arrayBuffer),
        }
    }

    try {
        const response = await httpClient({
            path: `getStream`,
            options: options(videoId),
        })
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`); // response.status will be 403
        }
        
        const stream = await response;
        const blob = await stream.blob()
        const arrayBuffer = await blob.arrayBuffer()
        
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)

        await saveToCache<CachedData>(videoId, {
            blob,
            arrayBuffer,
        }, YTSTREAMS_TABLE)
    
        console.log('Data cached in IndexedDB')
    
        return {
            audioBuffer,
            blob
        }

    } catch(error) {
        throw new Error('Fail to fetching yt stream of ' + videoId + ' ' + error)
    }
   
}

export default getYTSongBuffer
