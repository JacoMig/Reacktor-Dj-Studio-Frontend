import { useCallback, useEffect, useRef } from 'react'
import WaveSurfer from 'wavesurfer.js'
import { useAudioContext } from '../../context/AudioContext'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'
import { Box } from '@radix-ui/themes'

let scale = 1

const WaveForm = ({ type }: { type: 'A' | 'B' }) => {
    const { Tracks, initToneAndWaveSurfer } = useAudioContext()
    const waveClass = `waveformContainer-${type}`
    const isLooping = Tracks[type].isLooping
   

    const regionPluginRef = useRef<RegionsPlugin>()
    const unsuscribeTimeUpdateRef = useRef<() => void>(() => {})
    const getRegions = regionPluginRef?.current?.getRegions()

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
            barWidth: 2,
            barGap: 1,
            barRadius: 2,
          
            plugins: [regionPluginRef.current],
        })
        regionPluginRef.current.enableDragSelection({
            color: 'rgba(255, 80, 50, 0.4)',
        })


        regionPluginRef.current.on('region-created', (r) => {
            unsuscribeTimeUpdateRef.current()
            const regions = regionPluginRef?.current?.getRegions()
            if (regions && regions.length > 1) {
                regions[regions.findIndex((reg) => reg.id !== r.id)].remove()
            }
        })

        initToneAndWaveSurfer(type)
    }, [Tracks[type].wavesurfer])

   

    useEffect(() => {
        if(!isLooping) {
            unsuscribeTimeUpdateRef.current()
            return
        }
        if(getRegions && getRegions.length) 
            unsuscribeTimeUpdateRef.current = wavesurferTimeUpdate(getRegions[0])
          
        
    }, [isLooping, getRegions])

    const wavesurferTimeUpdate = (region: any) => {
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

    return <Box className={waveClass} height={'90%'} onWheel={onWheel}></Box>
}

export default WaveForm
