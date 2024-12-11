import { Flex } from '@radix-ui/themes'
import { useAudioContext } from '../../context/AudioContext'
import CustomSlider from '../CustomSlider/CustomSlider'



const CrossFader = () => {
    const { handleChangeCrossFadeValue } = useAudioContext()

    return (
        <Flex style={{borderTop: '1px solid', borderBottom: '1px solid'}} p={"3"} height="20%"  width={"100%"} align={"center"}>
            <CustomSlider
                min={0}
                max={10}
                orientation={'horizontal'}
                onValueChange={(v: number[]) =>
                    handleChangeCrossFadeValue(v[0] / 10)
                }
                defaultValue={5}
            />
        </Flex>
    )
}

export default CrossFader
