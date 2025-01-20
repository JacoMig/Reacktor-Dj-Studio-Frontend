import { render, screen, fireEvent } from '@testing-library/react'
import Playlist from './Playlist'
import '@testing-library/jest-dom';
import { useAudioContext } from '../../context/AudioContext'
import { getAudioContext } from '../../lib/audioContextSingleTone'
import { getAllFromCache, saveToCache, getRecordById } from '../../lib/dbHelper'

jest.mock('../../context/AudioContext')
jest.mock('../../lib/audioContextSingleTone')
jest.mock('../../lib/dbHelper')

const mockHandleTrackOptions = jest.fn()
const mockLoadBufferToPlayer = jest.fn()
const mockAudioContext = {
    decodeAudioData: jest.fn(),
}

describe('Playlist Component', () => {
    beforeEach(() => {
        (useAudioContext as jest.Mock).mockReturnValue({
            handleTrackOptions: mockHandleTrackOptions,
            loadBufferToPlayer: mockLoadBufferToPlayer,
        });
        (getAudioContext as jest.Mock).mockReturnValue(mockAudioContext);
        (getAllFromCache as jest.Mock).mockResolvedValue([]);
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('renders upload button and search input', () => {
        render(<Playlist />)
        expect(screen.getByText('Upload a song')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Search songs...')).toBeInTheDocument()
    })

    test('triggers file input click on upload button click', () => {
        render(<Playlist />)
        const uploadButton = screen.getByText('Upload a song')
        const fileInput = screen.getByTestId('file-input')
        fireEvent.click(uploadButton)
        expect(fileInput).toBeInTheDocument()
    })

    test('filters songs based on search query', async () => {
        (getAllFromCache as jest.Mock).mockResolvedValue([
            { id: 1, data: { title: 'Song One' } },
            { id: 2, data: { title: 'Another Song' } },
        ])
        render(<Playlist />)
        const searchInput = screen.getByPlaceholderText('Search songs...')
        fireEvent.change(searchInput, { target: { value: 'Another' } })
        expect(await screen.findByText('Another Song')).toBeInTheDocument()
        expect(screen.queryByText('Song One')).not.toBeInTheDocument()
    })

    test('handles file change and adds song to playlist', async () => {
        const mockFile = new Blob(['song content'], { type: 'audio/mp3' })
        const mockFileInput = new File([mockFile], 'test-song.mp3', { type: 'audio/mp3' });
        (saveToCache as jest.Mock).mockResolvedValue(1)
        render(<Playlist />)
        const fileInput = screen.getByTestId('file-input')
        fireEvent.change(fileInput, { target: { files: [mockFileInput] } })
        expect(await screen.findByText('test-song')).toBeInTheDocument()
    })

    test('sends song to track A', async () => {
        (getRecordById as jest.Mock).mockResolvedValue({
            data: { blob: new Blob(['song content'], { type: 'audio/mp3' }), title: 'test-song' },
        })
        mockAudioContext.decodeAudioData.mockResolvedValue('decoded-audio-data')
        render(<Playlist />)
        const sendToTrackAButton = screen.getByText('Send to Track A')
        fireEvent.click(sendToTrackAButton)
        expect(mockHandleTrackOptions).toHaveBeenCalledWith({ isLoading: true }, 'A')
        expect(mockLoadBufferToPlayer).toHaveBeenCalledWith('decoded-audio-data', expect.any(Blob), 'A')
        expect(mockHandleTrackOptions).toHaveBeenCalledWith({ title: 'test-song' }, 'A')
    })
})