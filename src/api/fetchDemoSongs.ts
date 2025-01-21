import httpClient from "../http/httpClient";

export type LoadDemoSongDataResponse = {
    contentType?: string,
    blob?: string,
    title?: string
}[]

export type LoadDemoSongResponse = {
    count: number
    data: LoadDemoSongDataResponse
}

export const loadDemoSongs = async () => {
    const options = {
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'GET',
    }
    const response = await httpClient({
        path: `loadDemoSongs`,
        options 
    })
    
    if(!response.ok)
        throw new Error(`Failed to fetch demo songs`)
    
    const list:LoadDemoSongResponse = await response.json()
    
    return list.data.map((file) => {
        const binary = atob(file.blob!); 
        const array = new Uint8Array(binary.length);
    
        for (let i = 0; i < binary.length; i++) {
          array[i] = binary.charCodeAt(i);
        }
    
        const blob = new Blob([array], { type: file.contentType });
        return new File([blob], file.title!, { type: file.contentType });
    });
   
    
}