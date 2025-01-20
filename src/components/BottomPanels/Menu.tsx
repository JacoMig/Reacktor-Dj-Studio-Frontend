import { ListBulletIcon } from '@radix-ui/react-icons'
import { Button, Flex } from '@radix-ui/themes'
import YouTubeIcon from '../../assets/youtube-icon.svg'
import "./Menu.css"

type PanelSelected = 'playlist' | 'ytbrowse'



const SideMenu = ({
    setPanelSelected,
    panelSelected
}: {
    setPanelSelected: (
        value: React.SetStateAction<PanelSelected>
    ) => void,
    panelSelected: PanelSelected
}) => {
    return (
        <Flex className='SideMenu' direction={'column'} align="start">
            <div>
                <Button
                    onClick={() => setPanelSelected('playlist')}
                    color="ruby"
                    variant={'outline'}
                    style={{background: `${panelSelected === "playlist" ? "var(--green-7)" : ""}`}}
                >
                    <ListBulletIcon /> Playlist
                </Button>
            </div>
            <div>
                <Button
                    onClick={() => setPanelSelected('ytbrowse')}
                    color="ruby"
                    variant={'outline'}
                    style={{background: `${panelSelected === "ytbrowse" ? "var(--green-7)" : ""}`}}
                >
                    <img style={{ width: '25px' }} src={YouTubeIcon} />
                    Browse youtube songs
                </Button>
            </div>
        </Flex>
    )
}

export default SideMenu
