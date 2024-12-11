import { createContext, ReactNode, useContext, useRef, useState } from 'react'
import { CrossFade, EQ3, Filter, Gain, Player } from 'tone'
import { Tone } from 'tone/build/esm/core/Tone'

import WaveSurfer from 'wavesurfer.js'
import { guess } from 'web-audio-beat-detector'

type Track = {
    audioBuffer?: AudioBuffer
    blob?: Blob
    title?: string
    bpm?: number
    currentBpm?: number
    volume?: number
    pausePosition?: number
    bufferLoaded?: boolean
    isLoading?: boolean
    isLooping?: boolean
    low?: number
    mid?: number
    high?: number
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
        >
    >({
        Tracks: {
            A: {
                player: useRef<Player>(),
                isLoading: false,
                wavesurfer: useRef<WaveSurfer>(),
                isLooping: false,
                filter: useRef<Filter>(),
            },
            B: {
                player: useRef<Player>(),
                isLoading: false,
                wavesurfer: useRef<WaveSurfer>(),
                isLooping: false,
                filter: useRef<Filter>(),
            },
        },
    })
    const [mainBpm, setMainBpm] = useState(120)

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

        const getOriginalBPM = await guess(audioBuffer, {
            minTempo: 60,
            maxTempo: 220,
        })

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
                        bpm: getOriginalBPM.bpm,
                        pausePosition: 0,
                        volume: 5,
                        currentBpm: getOriginalBPM.bpm,
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

            const crossfadeKey = type.toLowerCase() as 'a' | 'b';
            const filterNode = Tracks.Tracks[type].filter.current;
            const crossfadeNode = crossfade.current;
            
            if (isLowPassConnected) {
                filterNode.toDestination()
                crossfadeNode[crossfadeKey].disconnect();
                crossfadeNode[crossfadeKey].connect(filterNode);
            } else {
               /*  crossfadeNode.a.disconnect();
                crossfadeNode.b.disconnect(); */
                filterNode.disconnect();
                crossfadeNode[crossfadeKey].disconnect(filterNode);
                crossfadeNode[crossfadeKey].toDestination()
               
            } 
       
    }

    const initToneAndWaveSurfer = (type: 'A' | 'B') => {
        if (!(crossfade.current instanceof CrossFade)) {
            crossfade.current = new CrossFade(0.5)/* .toDestination() */
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
        const pcmData = new Float32Array(analyserNode.fftSize)

        const mediaNode = crossfade.current.context.createMediaElementSource(
            wavesurfer.getMediaElement()
        )

        if (Tracks.Tracks[type].filter) {
            Tracks.Tracks[type].filter.current = new Filter({
                type: 'lowpass'})/* .toDestination() */

            const gainNode = new Gain()

            if (type === 'A') {
                // Tracks.Tracks[type].filter.current.connect(crossfade.current.a)
                crossfade.current.a.connect(Tracks.Tracks[type].filter.current)
                crossfade.current.a.toDestination()
                gainNode.connect(crossfade.current.a)
            } else {
                crossfade.current.b.toDestination()
                gainNode.connect(crossfade.current.b)
                //crossfade.current.b.connect(Tracks.Tracks[type].filter.current)
            }

            mediaNode.connect(analyserNode)
            mediaNode.connect(gainNode.input)
        }

        let levelAnimationID: number | null = null

        let levelMeterElements: NodeListOf<HTMLDivElement>

        wavesurfer.on('ready', function () {
            wavesurfer.setVolume(0.5)

            levelMeterElements = document.querySelectorAll<HTMLDivElement>(
                `.peakMeter${type}`
            )
        })

        wavesurfer.on('play', () => {
            let levelValue = 0
            const onFrame = () => {
                analyserNode.getFloatTimeDomainData(pcmData)
                let sumSquares = 0.0
                for (const amplitude of pcmData) {
                    sumSquares += amplitude * amplitude
                }

                const value =
                    Math.floor(Math.sqrt(sumSquares / pcmData.length) * 1000) /
                    2

                levelValue = 100 - value
                levelMeterElements.forEach((l) => {
                    if (l)
                        l.style.setProperty(
                            '--levelheight',
                            `inset(${levelValue}% 0 0 0)`
                        )
                })
                levelAnimationID = requestAnimationFrame(onFrame)
            }
            onFrame()
        })

        wavesurfer.on('pause', () => {
            if (levelAnimationID) cancelAnimationFrame(levelAnimationID)
            levelMeterElements.forEach((l) => {
                if (l) l.style.setProperty('--levelheight', `inset(100% 0 0 0)`)
            })
        })
    }

    return (
        <AudioContext.Provider
            value={{
                Tracks: Tracks.Tracks,
                bpm: mainBpm,
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
