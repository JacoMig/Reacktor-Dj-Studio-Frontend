import { Button, Flex, Table, TextField } from '@radix-ui/themes'
import { useEffect, useRef, useState } from 'react'
import { SearchVideoResponse } from '../../api/listYTSongs'
import {
    getAllFromCache,
    getRecordById,
    removeRecordById,
    saveToCache,
} from '../../lib/dbHelper'
import { PLAYLIST_TABLE } from '../../constants'
import ListTable from '../../ListTable/ListTable'
import { useAudioContext } from '../../context/AudioContext'
import { getAudioContext } from '../../lib/audioContextSingleTone'
import { UploadIcon } from '@radix-ui/react-icons'
import { useDropzone } from 'react-dropzone'
import { useToast } from '../../context/ToastContext'

const APP_URL = import.meta.env.VITE_APP_URL

type PlayListSong = {
    blob: Blob
    title: string
}

type ListItemSong = SearchVideoResponse[number]



const Playlist = () => {
    const { handleTrackOptions, loadBufferToPlayer } = useAudioContext()
    const audioCtx = getAudioContext()
    const {addToast} = useToast()
    const [itemSongs, setItemSongs] = useState<ListItemSong[]>([])

    const [searchQuery, setSearchQuery] = useState<string>('')

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value)
    }
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const onTriggerUpload = () => {
        if (fileInputRef.current) fileInputRef.current.click()
    }

   

    const onSendToTrack = async (id: number, type: 'A' | 'B') => {
        handleTrackOptions(
            {
                isLoading: true,
            },
            type
        )
        const songData = await getRecordById(PLAYLIST_TABLE, id)
        if (!songData) return

        const blob = songData.data.blob
        const arrayBuffer = await blob.arrayBuffer()
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)
        loadBufferToPlayer(audioBuffer, blob, type)
        handleTrackOptions(
            {
                title: songData.data.title,
            },
            type
        )
    }

    const getAllCachedSongs = async () => {
        const cached = await getAllFromCache(PLAYLIST_TABLE)
        const arr: ListItemSong[] = []
        cached.forEach((c) => {
            arr.push({
                id: c.id,
                thumbnail: `${APP_URL}/placeholder-music.jpg`,
                title: c.data.title,
            })
        })
        setItemSongs(arr.sort((a, b) => b.id! - a.id!))
    }

    const removeSong = async (id: number) => {
        try {
            await removeRecordById(PLAYLIST_TABLE, id)
        } catch (e) {
            console.log(`Error removing song: `, e)
            throw e
        }
        setItemSongs((state) => state.filter((s) => s.id !== id))
        
    }

    const filteredSongs = itemSongs.filter((song) => {
        if (!searchQuery) return true
        return song.title.toLowerCase().includes(searchQuery.toLowerCase())
    })

    useEffect(() => {
        getAllCachedSongs()
    }, [])

    const onDrop = async (acceptedFiles: File[]) => {
       
        const audioFiles = acceptedFiles.filter(
            (file) =>
                file.type === 'audio/mpeg' ||
                file.type === 'audio/wav' ||
                file.type === 'audio/flac'
        )

        if (audioFiles.length === 0) {
            addToast({
                message: 'Please upload only MP3, WAV, or FLAC files.',
                variant: 'destructive',
            })
            console.info('Please upload only MP3, WAV, or FLAC files.')
            return
        }

        acceptedFiles.forEach( async (file) => {
            try {
               
                if (file) {
                    const title = file.name.substring(
                        0,
                        file.name.lastIndexOf('.')
                    )
                    const savedId = await saveToCache<PlayListSong>(
                        title,
                        {
                            blob: file,
                            title,
                        },
                        PLAYLIST_TABLE
                    )
                    setItemSongs((state) => {
                        return [
                            ...state,
                            {
                                thumbnail: `${APP_URL}/placeholder-music.jpg`,
                                title,
                                id: Number(savedId),
                            },
                        ].sort((a, b) => b.id! - a.id!)
                    })
                }
            } catch (error) {
                console.error('Error handling file change:', error)
                addToast({
                    message: 'Error upload file',
                    variant: 'destructive',
                })
            }
          })
    }

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'audio/mpeg': ['.mp3'],
            'audio/wav': ['.wav'],
            'audio/flac': ['.flac'],
        },
    })

    return (
        <Flex direction={'column'} height={'100%'} >
            <Flex p={'4'} justify={'start'} align={"center"} gap={'4'}>
                <input
                    {...getInputProps()}
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                />
                <Button
                    {...getRootProps()}
                    onClick={onTriggerUpload}
                    size={"4"}
                    color="tomato"
                    style={{border: '2px dashed white' }}
                >
                    <UploadIcon style={{ marginRight: '8px' }} /> Upload / Drag & Drop a song
                </Button>
                <TextField.Root
                    value={searchQuery}
                    onChange={handleSearchChange}
                    size="3"
                    placeholder="Search songs..."
                    color="jade"
                    style={{ maxWidth: '30%', flexGrow: 1 }}
                ></TextField.Root>
            </Flex>
            <Table.Root variant="ghost" style={{overflowY: 'auto'}}>
                {filteredSongs.length
                    ? filteredSongs.map((song, i) => (
                          <ListTable
                              onSendToTrackA={() =>
                                  onSendToTrack(song.id!, 'A')
                              }
                              onSendToTrackB={() =>
                                  onSendToTrack(song.id!, 'B')
                              }
                              song={song}
                              key={`playlist-song-${i}`}
                              removeTrack={() => removeSong(song.id!)}
                          />
                      ))
                    : null}
            </Table.Root>
        </Flex>
    )
}

export default Playlist
