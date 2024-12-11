import { useCallback, useState } from 'react'
import ListTable from './ListTable'
import { Box, TextField } from '@radix-ui/themes'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { debounce } from '../../lib/debounce'
import listYTSongs, { SearchResponse, SearchVideoResponse } from '../../api/listYTSongs'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { queryStaleTime } from '../../common'


const BrowseYTList = () => {
    
    const [inputFieldValue, setInputFieldValue] = useState<string>('')
    const [songs, setSongs] = useState<SearchVideoResponse>([])
    const [isLoadingSongs, setIsLoadingSongs] = useState(false)
    const queryClient = useQueryClient()

    const handleSearchYtSongs = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsLoadingSongs(true)
        const query = e.target.value
        setInputFieldValue(query)
       
        debounce(500, async () => {
            let data:SearchResponse | undefined =  undefined
            try {
                data = await queryClient.fetchQuery<SearchResponse>({
                    queryKey: ["listYTSongs", query],
                    queryFn: async () => await listYTSongs(query),
                    staleTime: queryStaleTime,
                })
            } catch (error) {
                console.log(error)
            } finally {
                if(data) {
                    setSongs(data.videos)
                    setIsLoadingSongs(false)
                }
            }
        })()
    }, []) 

    
   
    return (
        <Box>
            <TextField.Root
                value={inputFieldValue}
                onChange={handleSearchYtSongs}
                size="2"
                placeholder="Search songs from you tube"
            >
            
                <TextField.Slot>
                    <MagnifyingGlassIcon height="16" width="16" />
                </TextField.Slot>
            </TextField.Root>
            <Box height={"100%"} overflowY={"auto"} p={"5"}>
                <ListTable isLoading={isLoadingSongs} songs={songs}/>
            </Box>
        </Box>
    )
}

export default BrowseYTList
