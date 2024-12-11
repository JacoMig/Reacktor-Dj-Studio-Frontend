import { useState } from 'react'
import { useAudioContext } from '../../context/AudioContext'
import { Box, Button, Flex, Text } from '@radix-ui/themes'
import {
    PauseIcon,
    PlayIcon,
    StopIcon,
    SymbolIcon,
} from '@radix-ui/react-icons'
import WaveForm from '../WaveForm/WaveForm'
import BpmController from '../BpmController/BpmController'
import LowPassFilter from '../LowPassFilter/LowPassFilter'

interface ITrack {
    type: 'A' | 'B'
    // audioBuffer: AudioBuffer
}

const Track = (props: ITrack) => {
    const { type } = props
    const { Tracks, handleTrackOptions /* , bpm  */ } = useAudioContext()
    const [isPlaying, setIsPlaying] = useState(false)
    /*  const [isTrackSync, setIsTrackSync] = useState({
        A: false,
        B: false,
    }) */

    const currentPlayer = Tracks[type].wavesurfer?.current

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

    /*  const syncBpm = () => {
        const originalBpm = Tracks[type].bpm
        if (originalBpm) {
            if (isTrackSync[type])
                Tracks[type].wavesurfer?.current?.setPlaybackRate(1)
            else
                Tracks[type].wavesurfer?.current?.setPlaybackRate(
                    bpm / originalBpm
                )

            setIsTrackSync((state) => ({
                ...state,
                [type]: !state[type],
            }))
        }
    } */

    /*  const isLoadingBuffer = useMemo(() => {
        return Tracks[type].isLoading
    }, []) */

    return (
        <Box className="Track" flexGrow={'1'} maxWidth={'40%'}>
            <Flex direction={'column'} gap={'4'} height={'100%'}>
                <Flex>
                    <BpmController type={type} />
                    <LowPassFilter type={type} />
                </Flex>

                <Box height={'50%'}>
                    {Tracks[type].title && (
                        <Box height={'10%'} mb={'2'}>
                            <Text>{Tracks[type].title}</Text>
                        </Box>
                    )}
                    <WaveForm type={type} />
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
                        variant={`${
                            Tracks[type].isLooping ? 'solid' : 'outline'
                        }`}
                        size={'2'}
                    >
                        <SymbolIcon />
                    </Button>
                    {/*  <Button style={{flexGrow: 1}} onClick={syncBpm} size={"3"} color={isTrackSync[type] ? "orange" : "amber"} variant="soft">
                        {isTrackSync[type] ? "Unsync Bpm" : "Sync Bpm"}
                    </Button> */}
                </Flex>
            </Flex>
        </Box>
    )
}

export default Track
