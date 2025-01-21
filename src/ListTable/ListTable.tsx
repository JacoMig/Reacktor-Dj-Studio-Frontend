import { Avatar, Button, Flex, Table } from '@radix-ui/themes'
import { SearchVideoResponse } from '../api/listYTSongs'
import { TrashIcon } from '@radix-ui/react-icons'
import { useAudioContext } from '../context/AudioContext'
import { useCallback } from 'react'

interface IListTable {
    onSendToTrackA: () => void
    onSendToTrackB: () => void
    song: SearchVideoResponse[number]
    removeTrack?: () => void
}

const ListTable = (props: IListTable) => {
    
    const {Tracks} = useAudioContext()

    const { song: s, onSendToTrackA, onSendToTrackB, removeTrack } = props
   
    const isButtonActive = useCallback((type: 'A' | 'B') => {
        return Tracks[type].id === s.id
    }, [s, Tracks])

    return (
        <Table.Body>
            <Table.Row>
                <Table.RowHeaderCell>
                    <Avatar src={s.thumbnail} fallback="A" />
                </Table.RowHeaderCell>
                <Table.Cell style={{width: '60%', fontSize: '1.2rem'}}>
                    {s.title} {s.timestamp}
                </Table.Cell>
                <Table.Cell>
                    <Flex gap={'3'}>
                        <Button
                            onClick={onSendToTrackA}
                            color="plum"
                            style={{
                                color: 'var(--gray-12)',
                            }}
                            variant={isButtonActive('A') ? 'classic' : 'outline'}
                        >
                            A
                        </Button>
                        <Button
                            onClick={onSendToTrackB}
                            color="plum"
                            style={{
                                color: 'var(--gray-12)',
                            }}
                            variant={isButtonActive('B') ? 'classic' : 'outline'}
                        >
                            B
                        </Button>
                        {removeTrack && (
                            <Button
                                variant="solid"
                                color="red"
                                onClick={removeTrack}
                            >
                                <TrashIcon />
                            </Button>
                        )}
                    </Flex>
                </Table.Cell>
            </Table.Row>
        </Table.Body>
    )
}

export default ListTable
