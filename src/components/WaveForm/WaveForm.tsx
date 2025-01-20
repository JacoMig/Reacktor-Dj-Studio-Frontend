import { useCallback, useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import { useAudioContext } from '../../context/AudioContext'
import RegionsPlugin, { Region } from 'wavesurfer.js/dist/plugins/regions.esm.js'
import { Box, Flex, Spinner } from '@radix-ui/themes'

let scale = 1

const WaveForm = ({
    type,
    isSongLoading,
}: {
    type: 'A' | 'B'
    isSongLoading: boolean
}) => {
    const { Tracks, initToneAndWaveSurfer } = useAudioContext()
    const [currentRegion, setCurrentRegion] = useState<Region>()   
    const waveClass = `waveformContainer-${type}`

    const isLooping = Tracks[type].isLooping

    const regionPluginRef = useRef<RegionsPlugin>()
    const timeLoopingUpdateRef = useRef<() => void>(() => {})
    

    useEffect(() => {
        if (
            !Tracks[type].wavesurfer ||
            Tracks[type].wavesurfer.current instanceof WaveSurfer
        )
            return
        console.log('WaveSurfer.create: ', type)

        regionPluginRef.current = RegionsPlugin.create()

        Tracks[type].wavesurfer.current = WaveSurfer.create({
            container: `.${waveClass}`,
            waveColor: '#ffffff',
            progressColor: '#e54666',
            height: 'auto',
            minPxPerSec: 1,
            normalize: false,
            plugins: [regionPluginRef.current],
        })
        regionPluginRef.current.enableDragSelection({
            color: 'rgba(255, 80, 50, 0.4)',
        })

        regionPluginRef.current.on('region-created', (r) => {
            timeLoopingUpdateRef.current()
            const regions = regionPluginRef?.current?.getRegions()
            setCurrentRegion(r)
            if (regions && regions.length > 1) {
               regions.filter((reg) => reg.id !== r.id).forEach((reg) => reg.remove())
            }
            
            console.log('regions', regions);
            console.log('region-created', r);
        })
        
        initToneAndWaveSurfer(type)
    }, [Tracks[type].wavesurfer])

    useEffect(() => {
        if (!isLooping) {
            timeLoopingUpdateRef.current()
            return
        }
        if (currentRegion) {
            const currentPlayer = Tracks[type].wavesurfer?.current
            currentPlayer?.setTime(currentRegion.start)
            
            timeLoopingUpdateRef.current = wavesurferTimeUpdate(
                currentRegion
            ) 
           console.log('currentRegion', currentRegion); 
        }
       
            
    }, [isLooping, currentRegion])

    const wavesurferTimeUpdate = (region: Region) => {
        const currentPlayer = Tracks[type].wavesurfer?.current
        if (currentPlayer)
            return currentPlayer.on('timeupdate', (t) => {
                const end = region.end
                const start = region.start
                if (t > end) {
                    currentPlayer.setTime(start)
                }
            })
        else return () => {}
    }

    const onWheel = useCallback(
        (e: React.WheelEvent) => {
            if (
                !Tracks[type].wavesurfer ||
                !(Tracks[type].wavesurfer.current instanceof WaveSurfer)
            )
                return
            if (e.deltaY > 0) {
                if (scale > 50) return
                scale += 2
            }

            if (e.deltaY < 0) {
                if (scale < 1) return
                scale -= 2
            }
            Tracks[type].wavesurfer.current.zoom(scale)
        },
        [Tracks[type].wavesurfer]
    )

    return (
        <>
            {isSongLoading && (
                <Flex justify={'center'} align={'center'} height={'100%'}>
                    <Spinner
                        style={{ color: 'var(--pink-9)' }}
                        size={'3'}
                    ></Spinner>
                </Flex>
            )}
            <Box
                className={`${waveClass} ${isSongLoading ? 'hidden' : ''}`}
                height={'90%'}
                onWheel={onWheel}
            ></Box>
        </>
    )
}

export default WaveForm
