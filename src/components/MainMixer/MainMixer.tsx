import { Box, Flex } from '@radix-ui/themes'
import { useAudioContext } from '../../context/AudioContext'

import PeakMeter from '../PeakMeter/PeakMeter'
import CustomSlider from '../CustomSlider/CustomSlider'
import CrossFader from '../CrossFader/CrossFader'

const MainMixer = () => {
    const { Tracks } = useAudioContext()

    const onChangeFaderVolume = (value: number, type: 'A' | 'B') => {
        Tracks[type].wavesurfer?.current?.setVolume(value / 10)
    }

    return (
        <Flex
            height={'100%'}
            direction={'column'}
            align={'center'}
            width={'20%'}
        >
            <Flex height={'50%'} width={"100%"} style={{marginTop: "auto"}} justify={'between'}>
                <Box>
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
                </Box>
                <Box>
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
                </Box>
            </Flex>
            <Box style={{ marginTop: 'auto' }} width={'100%'}>
                <CrossFader />
            </Box>
        </Flex>
    )
}

export default MainMixer
