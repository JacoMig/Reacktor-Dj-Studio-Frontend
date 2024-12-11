import httpClient from '../http/httpClient'

export type GetYTSongBufferResponse = {
    audioBuffer: AudioBuffer,
    blob: Blob
}

const getYTSongBuffer = async (videoId: string):Promise<GetYTSongBufferResponse> => {
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
   
    const audioCtx = new AudioContext()

    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)

    return {
        audioBuffer,
        blob
    }
}


export default getYTSongBuffer