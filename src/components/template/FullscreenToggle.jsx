import FullIconSvg from '@/assets/svg/SystemIcons/FullIconSvg'
import { useState } from 'react'
import { HiArrowsPointingOut, HiArrowsPointingIn } from 'react-icons/hi2'

const FullscreenToggle = () => {
    const [isFullscreen, setIsFullscreen] = useState(false)

    const toggleFullscreen = () => {
        if (!isFullscreen) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`)
            })
        } else {
            document.exitFullscreen().catch((err) => {
                console.error(`Error attempting to exit fullscreen: ${err.message}`)
            })
        }
        setIsFullscreen(!isFullscreen)
    }

    return (
        <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
            {isFullscreen ? (
                <FullIconSvg width={24} height={24} />
            ) : (
                <FullIconSvg width={24} height={24} />
            )}
        </button>
    )
}

export default FullscreenToggle