import { useCallback, useEffect, useState } from 'react'
import YTListTable from './YTListTable'
import { Box, TextField } from '@radix-ui/themes'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { debounce } from '../../lib/debounce'
import listYTSongs, { SearchResponse, SearchVideoResponse } from '../../api/listYTSongs'
import {  useQueryClient } from '@tanstack/react-query'
import { queryStaleTime } from '../../common'


const BrowseYTList = () => {
    
    const [inputFieldValue, setInputFieldValue] = useState<string>('')
    const [songs, setSongs] = useState<SearchVideoResponse>([])
    const [isLoadingSongs, setIsLoadingSongs] = useState(false)
    const [error, setError] = useState<Error>()
    const queryClient = useQueryClient()
    const cachedSongs = queryClient.getQueryData<SearchResponse>(["listYTSongs"])


    const handleSearchYtSongs = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsLoadingSongs(true)
        const query = e.target.value
        setInputFieldValue(query)
       
        debounce(500, async () => {
            let data:SearchResponse | undefined =  undefined
            try {
                queryClient.invalidateQueries( {
                    queryKey: ['listYTSongs'],
                    refetchType: 'active',
                });

                data = await queryClient.fetchQuery<SearchResponse>({
                    queryKey: ["listYTSongs"],
                    queryFn: async () => await listYTSongs(query),
                    staleTime: queryStaleTime,
                })
                
                
            } catch (error) {
                console.log(error)
                if (error instanceof Error) 
                    setError(error); 
                else 
                    setError(new Error("An unknown error occurred")); 
                  
            } finally {
                if(data) {
                    setSongs(data.videos)
                }
                setIsLoadingSongs(false)
            }
        })()
    }, []) 

    useEffect(() => {
        if(cachedSongs) 
            setSongs(cachedSongs.videos)
        
    }, [])

    return (
        <Box height={"100%"} overflowY={"auto"}>
            <Box p={"3"} >
            <TextField.Root
                value={inputFieldValue}
                onChange={handleSearchYtSongs}
                size="2"
                placeholder="Search songs from you tube"
                color="jade"
            >
            
                <TextField.Slot>
                    <MagnifyingGlassIcon height="16" width="16" />
                </TextField.Slot>
            </TextField.Root>
            </Box>
            <Box height={"100%"} p={"5"} > 
                {error && !isLoadingSongs ? 
                    <p style={{color: 'var(--red-9)'}}>{error.message}</p>
                : 
                    <YTListTable isLoading={isLoadingSongs} songs={songs}/>
                }
                
           </Box> 
        </Box>
    )
}

export default BrowseYTList
