import { useEffect, useState } from 'react'
import { useAudioContext } from '../../context/AudioContext'
import { Box, Button, Flex,  Text } from '@radix-ui/themes'
import {
    PauseIcon,
    PlayIcon,
    StopIcon,
    SymbolIcon,
} from '@radix-ui/react-icons'
import WaveForm from '../WaveForm/WaveForm'
import BpmController from '../BpmController/BpmController'
import LowPassFilter from '../LowPassFilter/LowPassFilter'
import { useQuery } from '@tanstack/react-query'
import { fetchDemoSongs } from '../../api/fetchDemoSongs'




interface ITrack {
    type: 'A' | 'B'
    // audioBuffer: AudioBuffer
}

const Track = (props: ITrack) => {
    const { type } = props
    const { Tracks, handleTrackOptions, loadBufferToPlayer } = useAudioContext()
    const [isPlaying, setIsPlaying] = useState(false)

    const demoSong = type === 'A' ? 'dj-krush.mp3' : 'kruder-dorfmeister.mp3'

    const {
        data,
        isSuccess,
        isLoading: isDemoSongLoading,
    } = useQuery({
        queryKey: [`loadDemoSong${type}`],
        queryFn: async () => await fetchDemoSongs(demoSong),
        refetchOnMount: false,
        retry: false,
    })

    const onLoadingDemoTracks = async () => {
        if (isSuccess) {
            loadBufferToPlayer(data.audioBuffer, data.blob, type)
            const title = demoSong.replace('.mp3', '')
            handleTrackOptions(
                {
                    title,
                },
                type
            )
        }
    }

    useEffect(() => {
        onLoadingDemoTracks()
    }, [isSuccess])

    const currentPlayer = Tracks[type].wavesurfer?.current
    const isCurrentTrackLoading = Tracks[type].isLoading

    const startClick = () => {
        if (!currentPlayer) return

        if (isPlaying) currentPlayer.pause()
        else currentPlayer.play()

        setIsPlaying((state) => !state)
    }

    const stopClick = () => {
        if (!currentPlayer) return
        setIsPlaying(false)
        currentPlayer.stop()
    }

    const toggleLoop = () => {
        handleTrackOptions(
            {
                isLooping: !Tracks[type].isLooping,
            },
            type
        )
    }

    const textColor = type === 'A' ? 'teal' : 'jade'

    return (
        <Box className="Track" flexGrow={'1'} maxWidth={'40%'}>
            <Text size={'6'} color={textColor}>
                Track {type}
            </Text>
            <Flex direction={'column'} gap={'4'} height={'100%'}>
                <Flex>
                    <BpmController type={type} />
                    <LowPassFilter type={type} />
                </Flex>

                <Box height={'50%'}>
                    {Tracks[type].title && (
                        <Box height={'10%'}>
                            <Text>{Tracks[type].title}</Text>
                        </Box>
                    )}
                    <WaveForm
                        type={type}
                        isSongLoading={
                            (isDemoSongLoading ||
                                isCurrentTrackLoading) as boolean
                        }
                    />
                </Box>
                <Flex justify={'between'} gap={'4'} className="buttonsRow">
                    <Button
                        disabled={!Tracks[type].bufferLoaded}
                        onClick={startClick}
                        variant={`${isPlaying ? 'classic' : 'outline'}`}
                        highContrast={true}
                        color="gray"
                        size={'2'}
                    >
                        {isPlaying ? <PauseIcon /> : <PlayIcon />}
                    </Button>
                    <Button
                        onClick={stopClick}
                        highContrast={true}
                        color="gray"
                        variant="outline"
                        size={'2'}
                    >
                        <StopIcon />
                    </Button>
                    <Button
                        onClick={toggleLoop}
                        color={`${Tracks[type].isLooping ? 'amber' : 'gray'}`}
                        highContrast={true}
                        title='Loop over the selection'
                        variant={`${
                            Tracks[type].isLooping ? 'solid' : 'outline'
                        }`}
                        size={'2'}
                    >
                        <SymbolIcon />
                    </Button>
                </Flex>
            </Flex>
        </Box>
    )
}

export default Track
