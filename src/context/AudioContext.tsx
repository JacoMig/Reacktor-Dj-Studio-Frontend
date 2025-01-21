import { createContext, ReactNode, useContext,  useRef, useState } from 'react'
import { CrossFade, Filter, Gain, Player } from 'tone'
import WaveSurfer from 'wavesurfer.js'
import { guess } from 'web-audio-beat-detector'
import { tracksPeakMeterAnimation } from '../lib/tracksPeakMeterAnimation'

type Track = {
    audioBuffer?: AudioBuffer
    blob?: Blob
    title?: string
    bpm?: number
    currentBpm?: number
    volume?: number
    bufferLoaded?: boolean
    isLoading?: boolean
    isLooping?: boolean
    remainingTime?: number
    low?: number
    mid?: number
    high?: number
    id?: number
    setAudioBuffer?: React.Dispatch<
        React.SetStateAction<undefined | AudioBuffer>
    >
    player?: React.MutableRefObject<Player | undefined>
    wavesurfer?: React.MutableRefObject<WaveSurfer | undefined>
    filter?: React.MutableRefObject<Filter | undefined>
}

interface IAudioContext {
    Tracks: {
        A: Track
        B: Track
    }
    bpm: number
    setMasterVolume: (volume: number) => void
    peakMeterMasterAnimation: () => () => void
    setBpm: React.Dispatch<React.SetStateAction<number>>
    loadBufferToPlayer: (
        audioBuffer: AudioBuffer,
        blob: Blob,
        type: 'A' | 'B'
    ) => void
    handleTrackOptions: (options: Track, type: 'A' | 'B') => void
    initToneAndWaveSurfer: (type: 'A' | 'B') => void
    handleChangeCrossFadeValue: (v: number) => void
    tooggleFilter: (type: 'A' | 'B', isLowPassConnected: boolean) => void
}

const AudioContext = createContext<IAudioContext>({} as IAudioContext)

export const AudioProvider = ({ children }: { children: ReactNode }) => {
    const [Tracks, setTracks] = useState<
        Omit<
            IAudioContext,
            | 'initToneAndWaveSurfer'
            | 'loadBufferToPlayer'
            | 'handleTrackOptions'
            | 'handleChangeCrossFadeValue'
            | 'bpm'
            | 'setBpm'
            | 'tooggleFilter'
            | 'setMasterVolume'
            | 'peakMeterMasterAnimation' 
        >
    >({
        Tracks: {
            A: {
                player: useRef<Player>(),
                isLoading: false,
                wavesurfer: useRef<WaveSurfer>(),
                isLooping: false,
                filter: useRef<Filter>(),
                remainingTime: undefined
            },
            B: {
                player: useRef<Player>(),
                isLoading: false,
                wavesurfer: useRef<WaveSurfer>(),
                isLooping: false,
                filter: useRef<Filter>(),
                remainingTime: undefined
            },
        },
    })
    const [mainBpm, setMainBpm] = useState(120)

    const master = useRef<Gain>(new Gain(1).toDestination())

    const setMasterVolume = (volume: number) => {
        master.current.gain.value = volume
    }

    const crossfade = useRef<CrossFade>()

    const handleTrackOptions = (options: Track, type: 'A' | 'B') => {
        setTracks((state) => ({
            Tracks: {
                ...state.Tracks,
                [type]: {
                    ...state.Tracks[type],
                    ...options,
                },
            },
        }))
    }

    const handleChangeCrossFadeValue = (v: number) => {
        if (!crossfade.current || !(crossfade.current instanceof CrossFade))
            return
        crossfade.current.fade.value = v
    }

    const loadBufferToPlayer = async (
        audioBuffer: AudioBuffer,
        blob: Blob,
        type: 'A' | 'B'
    ) => {
        if (
            !Tracks.Tracks[type].wavesurfer ||
            !(Tracks.Tracks[type].wavesurfer.current instanceof WaveSurfer)
        )
            return

        const wavesurfer = Tracks.Tracks[type].wavesurfer.current
        
        let getOriginalBPM:{
            bpm: number;
            offset: number;
        } | undefined = undefined
        try {
            getOriginalBPM = await guess(audioBuffer, {
                minTempo: 60,
                maxTempo: 220,
            })
        } catch(e) {
            console.error('guess bpm fails: ', e);
        }
        

        const url = URL.createObjectURL(new Blob([blob], { type: 'audio/mp3' }))

        const peaks = [
            audioBuffer.getChannelData(0),
            audioBuffer.getChannelData(1),
        ]

        const duration = audioBuffer.duration

        wavesurfer
            .load(url, peaks, duration)
            .then(() => {
                handleTrackOptions(
                    {
                        blob,
                        bufferLoaded: true,
                        audioBuffer,
                        bpm: getOriginalBPM?.bpm || 0,
                        volume: 5,
                        currentBpm: getOriginalBPM?.bpm || 0,
                        isLoading: false,
                        remainingTime: duration,
                    },
                    type
                )
            })
            .catch((e) => console.log(e))
    }

    const tooggleFilter = (type: 'A' | 'B', isLowPassConnected: boolean) => {
        if (
            !(crossfade.current instanceof CrossFade) ||
            !crossfade.current ||
            !Tracks.Tracks[type].filter?.current
        )
            return

        const crossfadeKey = type.toLowerCase() as 'a' | 'b'
        const filterNode = Tracks.Tracks[type].filter.current
        const crossfadeNode = crossfade.current

        if (isLowPassConnected) {
            filterNode.toDestination()
            crossfadeNode[crossfadeKey].disconnect()
            crossfadeNode[crossfadeKey].connect(filterNode)
        } else {
            filterNode.disconnect()
            crossfadeNode[crossfadeKey].disconnect(filterNode)
            crossfadeNode[crossfadeKey].toDestination()
        }
    }

   
    const peakMeterMasterAnimation = () => {
        const analyserNode = master.current.context.createAnalyser()
        master.current.connect(analyserNode)
        const levelMeterElements = document.querySelectorAll<HTMLDivElement>(
            `.peakMeterMaster`
        )
        return tracksPeakMeterAnimation(analyserNode, levelMeterElements)
    }

    let peakAnimationMaster: () => void = () => {}

    const initToneAndWaveSurfer = (type: 'A' | 'B') => {

        if (!(crossfade.current instanceof CrossFade)) {
            crossfade.current = new CrossFade(0.5) 
            crossfade.current.fade.value = 0.5
        }

        if (
            !Tracks.Tracks[type].wavesurfer ||
            !(Tracks.Tracks[type].wavesurfer.current instanceof WaveSurfer) ||
            !crossfade.current
        )
            return

        console.log('initToneAndWaveSurfer; ', type)

        const wavesurfer = Tracks.Tracks[type].wavesurfer.current

         const analyserNode = crossfade.current.context.createAnalyser()

        const mediaNode = crossfade.current.context.createMediaElementSource(
            wavesurfer.getMediaElement()
        )

        if (Tracks.Tracks[type].filter) 
            Tracks.Tracks[type].filter.current = new Filter({
                type: 'lowpass',
            }) 

        const gainNode = new Gain(1)
            
        if (type === 'A') {
            crossfade.current.a.connect(master.current)
            gainNode.connect(crossfade.current.a)
        } else {
            crossfade.current.b.connect(master.current)
            gainNode.connect(crossfade.current.b)
        }

        mediaNode.connect(analyserNode)

        mediaNode.connect(gainNode.input)
        
        
        const levelMeterElements = document.querySelectorAll<HTMLDivElement>(
            `.peakMeter${type}`
        )
        let tracksPeakMeter: () => void = () => {} 

        wavesurfer.on('ready', function () {
            wavesurfer.setVolume(0.5)
        })

        wavesurfer.on('play', () => {
            tracksPeakMeter = tracksPeakMeterAnimation(analyserNode, levelMeterElements)
            peakAnimationMaster = peakMeterMasterAnimation()
        })

        wavesurfer.on('pause', () => {
            tracksPeakMeter()
            peakAnimationMaster()
        }) 
    }

    return (
        <AudioContext.Provider
            value={{
                Tracks: Tracks.Tracks,
                bpm: mainBpm,
                peakMeterMasterAnimation,
                setMasterVolume,
                setBpm: setMainBpm,
                loadBufferToPlayer,
                handleTrackOptions,
                tooggleFilter,
                initToneAndWaveSurfer,
                handleChangeCrossFadeValue,
            }}
        >
            {children}
        </AudioContext.Provider>
    )
}

export const useAudioContext = () => {
    const context = useContext(AudioContext)

    if (!context) {
        throw new Error('context must be used with an AudioProvider')
    }
    return context
}
