import * as Slider from '@radix-ui/react-slider'
import './CustomSlider.css'

interface ICustomSlider {
    min: number | 0
    max: number | 10
    orientation?: 'vertical' | 'horizontal'
    defaultValue: number | 5
    onValueChange: (value: number[]) => void
    thumbSize?: "small" | "large" 
}

const CustomSlider = (props: ICustomSlider) => {
    const { min, max, orientation, defaultValue, onValueChange, thumbSize } = props
    const thumbClass = `slider-thumb ${thumbSize ? thumbSize : "large"}`
    
    return (
       
            <Slider.Root
                className="slider-root"
                orientation={orientation}
                defaultValue={[defaultValue]}
                max={max}
                min={min}
                onValueChange={onValueChange}
                step={1}
            >
                <Slider.Track className="slider-track">
                    <Slider.Range className="slider-range" />
                </Slider.Track>
                <Slider.Thumb className={thumbClass} />
            </Slider.Root>
        
    )
}

export default CustomSlider
