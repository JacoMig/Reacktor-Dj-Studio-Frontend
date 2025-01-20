import { Flex, Spinner, Table } from '@radix-ui/themes'
import { SearchVideoResponse } from '../../api/listYTSongs'
import { useAudioContext } from '../../context/AudioContext'
import getYTSongBuffer, { GetYTSongBufferResponse } from '../../api/getYTSongBuffer'
import {  useQueryClient } from '@tanstack/react-query'
import { queryStaleTime } from '../../common'
import ListTable from '../../ListTable/ListTable'
import { useToast } from '../../context/ToastContext'


const YTListTable = ({
    songs,
    isLoading,
}: {
    songs: SearchVideoResponse
    isLoading: boolean
}) => {
    const { handleTrackOptions, loadBufferToPlayer, Tracks } = useAudioContext()
    const queryClient = useQueryClient()
    const {addToast} = useToast()
    
    const sendAudioToTrack = async (
        type: 'A' | 'B',
        videoId: string,
        title?: string
    ) => {
        handleTrackOptions(
            {
                isLoading: true,
            },
            type
        )
        let data:GetYTSongBufferResponse | undefined =  undefined
        try {
            data = await queryClient.fetchQuery<GetYTSongBufferResponse>({
                queryKey: ["getYTBufferSong", videoId],
                queryFn: async () => await getYTSongBuffer(videoId),
                staleTime: queryStaleTime,
            })
        } catch (error) {
            console.log(error)
            addToast({
                message: 'Youtube service temporarly unavailable',
                variant: 'destructive',
            })
        } finally {
            if(data) {
                loadBufferToPlayer(data.audioBuffer, data.blob, type)
            }
            handleTrackOptions(
                {
                    title: data ? title : Tracks[type].title,
                    isLoading: false,
                },
                type
            )
        }
       
    }

    return (
        <>
            {isLoading && (
                <Flex
                    width={'100%'}
                    justify={'center'}
                    align={'center'}
                    height={'100%'}
                >
                    {' '}
                    <Spinner size={'3'} />{' '}
                </Flex>
            )}
            {!isLoading && songs && (
                <Table.Root variant="ghost">
                    {songs.map((s) => 
                        <ListTable 
                            onSendToTrackA={() => sendAudioToTrack(
                                'A',
                                s.videoId!,
                                s.title
                            )}
                            onSendToTrackB={() => sendAudioToTrack(
                                'B',
                                s.videoId!,
                                s.title
                            )}
                            song={s}
                            key={s.videoId}
                        />
                    )}
                </Table.Root>
            )}
        </>
    )
}

export default YTListTable
