interface IhttpClient {
    path: string
    options?: RequestInit
}
const API_URL = import.meta.env.VITE_API_URL

const httpClient = async (params:IhttpClient):Promise<Response> => {
    
    const {path, options} = params

    const resp = await fetch(`${API_URL}/${path}`, options)

    return resp
}

export default httpClient
