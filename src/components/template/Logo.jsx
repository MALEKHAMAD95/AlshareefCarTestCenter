import { APP_NAME } from '@/configs/app.config'
import classNames from 'classnames'

const LOGO_SRC_PATH = '/img/logo/'

const Logo = (props) => {
    const {
        type = 'full',
        mode = 'light',
        className,
        imgClass,
        style,
        logoWidth = 'auto',
    } = props

    // Use logo-dark for light mode and logo-white for dark mode
    const logoFile = mode === 'dark' ? 'logo-white.png' : 'logo-dark.png'

    return (
        <div
            className={classNames('logo', className)}
            style={{
                ...style,
                ...{ width: logoWidth },
            }}
        >
            <img
                className={imgClass}
                src={`${LOGO_SRC_PATH}${logoFile}`}
                alt={`${APP_NAME} logo`}
            />
        </div>
    )
}

export default Logo
