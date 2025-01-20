import { Box, Button, Flex, Text } from '@radix-ui/themes'
import { useAudioContext } from '../../context/AudioContext'

import PeakMeter from '../PeakMeter/PeakMeter'
import CustomSlider from '../CustomSlider/CustomSlider'
import CrossFader from '../CrossFader/CrossFader'
import { SpeakerOffIcon } from '@radix-ui/react-icons'
import { useState } from 'react'

const MainMixer = () => {
    const { Tracks, setMasterVolume } = useAudioContext()
    const [onMute, setOnMute] = useState({
        A: false,
        B: false,
    })

    const onChangeFaderVolume = (value: number, type: 'A' | 'B' | 'Master') => {
        if (type === 'Master') setMasterVolume(value / 10)
        else Tracks[type].wavesurfer?.current?.setVolume(value / 10)
    }

    const onMuteTrack = (type: 'A' | 'B') => {
        Tracks[type].wavesurfer?.current?.setMuted(
            !Tracks[type].wavesurfer?.current?.getMuted()
        )
        setOnMute((state) => ({
            ...state,
            [type]: !state[type],
        }))
    }
   

    return (
        <Flex
            height={'100%'}
            direction={'column'}
            align={'center'}
            width={'20%'}
        >
            {
                <Flex
                    className="VolumeFadersContainer"
                    height={'50%'}
                    width={'100%'}
                    style={{ marginTop: 'auto' }}
                    justify={'between'}
                >
                    <Flex direction={'column'} align={'center'} gap={'4'}>
                        <Text size={'3'}>Vol A</Text>
                        <PeakMeter className="peakMeterA">
                            <CustomSlider
                                min={0}
                                max={10}
                                orientation={'vertical'}
                                onValueChange={(v: number[]) =>
                                    onChangeFaderVolume(v[0], 'A')
                                }
                                defaultValue={5}
                            />
                        </PeakMeter>
                        <Button
                            size={'3'}
                            variant={onMute['A'] ? 'classic' : 'outline'}
                            color={onMute['A'] ? 'amber' : 'gray'}
                            onClick={() => onMuteTrack('A')}
                        >
                            <SpeakerOffIcon />
                        </Button>
                    </Flex>
                    <Flex direction={'column'} align={'center'} gap={'4'}>
                        <Text size={'3'}>Master</Text>
                        <PeakMeter className="peakMeterMaster">
                            <CustomSlider
                                min={0}
                                max={10}
                                orientation={'vertical'}
                                onValueChange={(v: number[]) =>
                                    onChangeFaderVolume(v[0], 'Master')
                                }
                                defaultValue={5}
                            />
                        </PeakMeter>
                    </Flex>
                    <Flex direction={'column'} align={'center'} gap={'4'}>
                        <Text size={'3'}>Vol B</Text>
                        <PeakMeter className="peakMeterB">
                            <CustomSlider
                                min={0}
                                max={10}
                                orientation={'vertical'}
                                onValueChange={(v: number[]) =>
                                    onChangeFaderVolume(v[0], 'B')
                                }
                                defaultValue={5}
                            />
                        </PeakMeter>
                        <Button
                            size={'3'}
                            variant={onMute['B'] ? 'classic' : 'outline'}
                            color={onMute['B'] ? 'amber' : 'gray'}
                            onClick={() => onMuteTrack('B')}
                        >
                            <SpeakerOffIcon />
                        </Button>
                    </Flex>
                </Flex>
            }
            <Box style={{ marginTop: 'auto' }} width={'100%'}>
                <CrossFader />
            </Box>
        </Flex>
    )
}

export default MainMixer
