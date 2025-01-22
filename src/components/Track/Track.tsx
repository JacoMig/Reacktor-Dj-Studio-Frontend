import { useEffect,  useState } from 'react'
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
import { formatTime } from '../../lib/formatTime'


interface ITrack {
    type: 'A' | 'B'
}

const Track = (props: ITrack) => {
    const { type } = props
    const { Tracks, handleTrackOptions } = useAudioContext()
    const [isPlaying, setIsPlaying] = useState(false)

    
    const currentTrack = Tracks[type]
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
                isLooping: !currentTrack.isLooping,
            },
            type
        )
    }

    useEffect(() => {
        if (!currentPlayer) return 
        currentPlayer.on('timeupdate', () => {
            handleTrackOptions(
                {
                    remainingTime:
                        currentPlayer.getDuration() -
                        currentPlayer.getCurrentTime(),
                },
                type
            )
        })
        
    }, [currentPlayer])

    

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
                    <Flex justify={'between'} gap={'4'}>
                        {currentTrack.title && (
                            <Box className='songTitleText' height={'10%'}>
                                <Text>{currentTrack.title}</Text>
                            </Box>
                        )}
                        <Box height={'10%'}>
                            <Text>
                                {currentTrack.remainingTime ? formatTime(
                                    currentTrack.remainingTime?.toFixed(2)
                                ) : null}
                            </Text>
                        </Box>
                    </Flex>
                    <WaveForm
                        type={type}
                        isSongLoading={
                            (isCurrentTrackLoading) as boolean
                        }
                    />
                </Box>
                <Flex justify={'between'} gap={'4'} className="buttonsRow">
                    <Button
                        disabled={!currentTrack.bufferLoaded}
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
                        color={`${currentTrack.isLooping ? 'amber' : 'gray'}`}
                        highContrast={true}
                        title="Loop over the selection"
                        variant={`${
                            currentTrack.isLooping ? 'solid' : 'outline'
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
