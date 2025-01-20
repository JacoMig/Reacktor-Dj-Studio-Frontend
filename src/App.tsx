import Track from './components/Track/Track'
import { AudioProvider } from './context/AudioContext'
import '@radix-ui/themes/styles.css'
import MainMixer from './components/MainMixer/MainMixer'
import './App.css'
import { Box, Flex } from '@radix-ui/themes'
import BottomPanels from './components/BottomPanels/BottomPanels'

import { ToastProvider } from './context/ToastContext'

function App() {
    return (
        <>
            <AudioProvider>
                <ToastProvider>
                    <Flex
                        style={{ background: 'var(--slate-4)' }}
                        justify={'center'}
                        align={'center'}
                        height={'100vh'}
                        overflow={'hidden'}
                    >
                        <Box
                            className="mainContainer"
                            height={'90vh'}
                            p={'8'}
                            style={{ background: 'var(--gray-1)' }}
                        >
                            <Flex height="65%">
                                <Track type="A" />
                                <MainMixer />
                                <Track type="B" />
                            </Flex>
                            <Flex
                                mt={'3'}
                                height={'35%'}
                                className="ChooseSongsContainer"
                            >
                                <BottomPanels />
                            </Flex>
                        </Box>
                    </Flex>
                </ToastProvider>
            </AudioProvider>
        </>
    )
}

export default App
