import { Box } from '@radix-ui/themes'
import BrowseYTList from '../BrowseYTList/BrowseYTList'
import { useState } from 'react'

import Playlist from '../Playlist/Playlist'
import SideMenu from './Menu'

type PanelSelected = "playlist" | "ytbrowse"

const BottomPanels = () => {

    const [panelSelected, setPanelSelected] = useState<PanelSelected>("playlist")

    return (
        <>
            <Box width={'20%'}>
                <SideMenu panelSelected={panelSelected} setPanelSelected={setPanelSelected}/>
            </Box>
            <Box flexGrow={'1'} overflow={"hidden"}>
                {panelSelected === "ytbrowse" ? 
                    <BrowseYTList />
                :
                    <Playlist />
                }
                
            </Box>
        </>
    )
}

export default BottomPanels
