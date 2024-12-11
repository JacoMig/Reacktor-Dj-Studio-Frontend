import { Avatar, Button, Flex, Spinner, Table } from '@radix-ui/themes'
import { SearchVideoResponse } from '../../api/listYTSongs'
import { useAudioContext } from '../../context/AudioContext'
import getYTSongBuffer, { GetYTSongBufferResponse } from '../../api/getYTSongBuffer'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { queryStaleTime } from '../../common'

const ListTable = ({
    songs,
    isLoading,
}: {
    songs: SearchVideoResponse
    isLoading: boolean
}) => {
    const { handleTrackOptions, loadBufferToPlayer } = useAudioContext()
    const queryClient = useQueryClient()

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
        } finally {
            if(data) {
                loadBufferToPlayer(data.audioBuffer, data.blob, type)
                handleTrackOptions(
                    {
                        title,
                        isLoading: false,
                    },
                    type
                )
            }
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
                    {songs.map((s) => {
                        return (
                            <Table.Body key={s.videoId}>
                                <Table.Row>
                                    <Table.RowHeaderCell>
                                        <Avatar
                                            src={s.thumbnail}
                                            fallback="A"
                                        />
                                    </Table.RowHeaderCell>
                                    <Table.Cell>
                                        {s.title} | {s.timestamp}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Button
                                            onClick={() =>
                                                sendAudioToTrack(
                                                    'A',
                                                    s.videoId,
                                                    s.title
                                                )
                                            }
                                            color="plum"
                                            style={{
                                                color: 'var(--gray-12)',
                                            }}
                                            variant="outline"
                                        >
                                            A
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                sendAudioToTrack(
                                                    'B',
                                                    s.videoId,
                                                    s.title
                                                )
                                            }
                                            color="plum"
                                            style={{
                                                color: 'var(--gray-12)',
                                            }}
                                            variant="outline"
                                        >
                                            B
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        )
                    })}
                </Table.Root>
            )}
        </>
    )
}

export default ListTable
