import { Avatar, Button, Flex, Table } from '@radix-ui/themes'
import { SearchVideoResponse } from '../api/listYTSongs'
import { TrashIcon } from '@radix-ui/react-icons'

interface IListTable {
    onSendToTrackA: () => void
    onSendToTrackB: () => void
    song: SearchVideoResponse[number]
    removeTrack?: () => void
}

const ListTable = (props: IListTable) => {
    const { song: s, onSendToTrackA, onSendToTrackB, removeTrack } = props
    return (
        <Table.Body>
            <Table.Row>
                <Table.RowHeaderCell>
                    <Avatar src={s.thumbnail} fallback="A" />
                </Table.RowHeaderCell>
                <Table.Cell>
                    {s.title} | {s.timestamp}
                </Table.Cell>
                <Table.Cell>
                    <Flex gap={'3'}>
                        <Button
                            onClick={onSendToTrackA}
                            color="plum"
                            style={{
                                color: 'var(--gray-12)',
                            }}
                            variant="outline"
                        >
                            A
                        </Button>
                        <Button
                            onClick={onSendToTrackB}
                            color="plum"
                            style={{
                                color: 'var(--gray-12)',
                            }}
                            variant="outline"
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
