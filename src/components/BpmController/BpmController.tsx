import { Box, Button, Flex } from '@radix-ui/themes'
import { useAudioContext } from '../../context/AudioContext'

import { MinusIcon, PlusIcon } from '@radix-ui/react-icons'
import { useCallback } from 'react'
import { KnobBase } from '../KnobBase/KnobBase'

const BpmController = ({ type }: { type: 'A' | 'B' }) => {
    const { Tracks, handleTrackOptions } = useAudioContext()
    const currentTrack = Tracks[type]
    const currentBpm = Tracks[type].currentBpm || 120
    

    const onChangeBpm = (v: number) => {
        const originalBpm = currentTrack.bpm
        if (!originalBpm) return
        currentTrack.wavesurfer?.current?.setPlaybackRate(v / originalBpm)
        handleTrackOptions({ currentBpm: v }, type)
    }

    const syncBpm = () => {
        const otherTrackBpm =
            type === 'A' ? Tracks['B'].currentBpm : Tracks['A'].currentBpm

        if (Tracks[type].bpm && otherTrackBpm) {
            
            Tracks[type].wavesurfer?.current?.playPause()    
            Tracks[type].wavesurfer?.current?.setPlaybackRate(
                otherTrackBpm / Tracks[type].bpm
            )
           
            handleTrackOptions({ currentBpm: otherTrackBpm }, type)
           
        }
    }

    const restartPlay = useCallback(() => {
        Tracks[type].wavesurfer?.current?.playPause()
     }, [Tracks[type].wavesurfer?.current])

    

    return (
        <Flex
            height={'100%'}
            align={'center'}
            gap={'2'}
            width={'40%'}
            direction={'column'}
            pb={'2'}
        >
            <Box height={'70%'}>
                <KnobBase
                    valueDefault={currentBpm}
                    valueMin={60}
                    valueMax={200}
                    valueRaw={currentBpm}
                    onValueRawChange={(newValue: number) =>
                        onChangeBpm(newValue)
                    }
                    label="Bpm"
                />
            </Box>
            <Box>
                <Flex gap="2" className="BpmButtonsRow" justify={'between'}>
                    <Button
                        onClick={() => onChangeBpm(currentBpm + 1)}
                        size="1"
                        variant="outline"
                        color="red"
                        style={{
                            color: 'var(--gray-12)',
                            borderColor: 'var(--red-7)',
                            boxShadow: 'inset 0 0 0 1px var(--red-7)',
                        }}
                    >
                        <PlusIcon />
                    </Button>
                    <Button
                        size="1"
                        color="red"
                        style={{
                            color: 'var(--gray-12)',
                            borderColor: 'var(--red-7)',
                            boxShadow: 'inset 0 0 0 1px var(--red-7)',
                            minWidth: '55px'
                        }}
                        variant={"outline"}
                        onMouseDown={syncBpm}
                        onMouseUp={restartPlay}
                    >
                        Sync
                    </Button>
                    <Button
                        onClick={() => onChangeBpm(currentBpm - 1)}
                        size="1"
                        variant="outline"
                        color="red"
                        style={{
                            color: 'var(--gray-12)',
                            borderColor: 'var(--red-7)',
                            boxShadow: 'inset 0 0 0 1px var(--red-7)',
                        }}
                    >
                        <MinusIcon />
                    </Button>
                </Flex>
            </Box>
        </Flex>
    )
}

export default BpmController
