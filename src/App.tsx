import Track from './components/Track/Track'
import BrowseYTList from './components/BrowseYTList/BrowseYTList'
import { AudioProvider } from './context/AudioContext'
import '@radix-ui/themes/styles.css'
import MainMixer from './components/MainMixer/MainMixer'
import './App.css'
import { Box, Flex } from '@radix-ui/themes'


function App() {
    return (
        <>
            <AudioProvider>
                <Flex justify={'center'} align={'center'} height={'100vh'}>
                    <Box
                        width={{ md: '80vw', lg: '1450px' }}
                        className="mainContainer"
                        height={'80vh'}
                        p={'8'}
                    >
                        <Flex height="65%">
                            <Track type="A" />
                            <MainMixer />
                            <Track type="B" />
                        </Flex>
                        <Flex mt={"3"} height={'35%'} className="ChooseSongsContainer">
                            <BrowseYTList />
                        </Flex>
                    </Box>
                </Flex>
            </AudioProvider>
        </>
    )
}

export default App
