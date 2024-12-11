import { Box, Button, Flex } from '@radix-ui/themes'
import { KnobBase } from '../KnobBase/KnobBase'
import { useAudioContext } from '../../context/AudioContext'
import { useState } from 'react'

const LowPassFilter = ({ type }: { type: 'A' | 'B' }) => {
    const { Tracks, tooggleFilter } = useAudioContext()
    const valueRaw = (Tracks[type].filter?.current?.frequency.value ||
        160) as number
    const [myValue, setMyValue] = useState(valueRaw)
    const [isLowPassConnected, setIsLowPassConnected] = useState(false)

    const onSetNewValue = (newValue: number) => {
        /* if(newValue >= 1200) {
            tooggleFilter(type)
            return
        } */
        Tracks[type].filter?.current?.set({
            frequency: newValue,
        })

        setMyValue(newValue)
    }
    const toggleLowPass = () => {
        tooggleFilter(type, !isLowPassConnected)
        setIsLowPassConnected((state) => !state)
    }

    return (
        <Flex
            height={'100%'}
            align={'center'}
            gap={'2'}
            width={'60%'}
            direction={'column'}
            pb={'2'}
        >
            <Box height={'70%'}>
                <KnobBase
                    valueDefault={0}
                    valueMin={100}
                    valueMax={5000}
                    valueRaw={myValue}
                    onValueRawChange={onSetNewValue}
                    label="Lowpass"
                    valueRawDisplayFn={(v:number) => `${v.toFixed(0)} Hz`}
                />
            </Box>
            <Box> 
                <Button
                    size="1"
                    color="red"
                    style={{
                        color: 'var(--gray-12)',
                        borderColor: 'var(--red-7)',
                        boxShadow: 'inset 0 0 0 1px var(--red-7)',
                    }}
                    variant={`${isLowPassConnected ? 'classic' : 'ghost'}`}
                    onClick={toggleLowPass}
                >
                    ON/OFF
                </Button>
           </Box> 
        </Flex>
    )
}

export default LowPassFilter
