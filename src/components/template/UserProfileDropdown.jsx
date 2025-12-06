import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import { useSessionUser } from '@/store/authStore'
import { Link } from 'react-router-dom'
import { FcBusinessman, FcExport, FcConferenceCall, FcSettings } from 'react-icons/fc'
import { useAuth } from '@/auth'
import { useTranslation } from 'react-i18next'
import { useTranslationValue } from '@/locales'

const dropdownItemList = []

const _UserDropdown = () => {
    const { avatar, userName, email } = useSessionUser((state) => state.user)
    const { signOut } = useAuth()
    const { t } = useTranslation(useTranslationValue)
    const translationPath = 'nav.UserDropdown.'

    const handleSignOut = () => {
        signOut()
    }

    const avatarProps = {
        ...(avatar ? { src: avatar } : { icon: '' }), // Replaced PiUserDuotone
    }

    return (
        <Dropdown
            className="flex"
            toggleClassName="flex items-center"
            renderTitle={
                <div className="cursor-pointer flex items-center">
                    <Avatar size={32} {...avatarProps} />
                </div>
            }
            placement="bottom-end"
        >
            <Dropdown.Item variant="header">
                <div className="py-2 px-3 flex items-center gap-3">
                    <Avatar {...avatarProps} />
                    <div>
                        <div className="font-bold text-gray-900 dark:text-gray-100">
                            {userName || t(`${translationPath}Anonymous`)}
                        </div>
                        <div className="text-xs">
                            {email || t(`${translationPath}NoEmailAvailable`)}
                        </div>
                    </div>
                </div>
            </Dropdown.Item>
            <Dropdown.Item variant="divider" />
            {dropdownItemList.map((item) => (
                <Dropdown.Item
                    key={item.label}
                    eventKey={item.label}
                    className="px-0"
                >
                    <Link className="flex h-full w-full px-2" to={item.path}>
                        <span className="flex gap-2 items-center w-full">
                            <span className="text-xl">{item.icon}</span>
                            <span>{t(`${translationPath}${item.label}`)}</span>
                        </span>
                    </Link>
                </Dropdown.Item>
            ))}
            <Dropdown.Item
                eventKey="UserManagement"
                className="gap-2"
                disabled
                onClick={() => {}}
            >
                <span className="text-xl">
                    <FcConferenceCall /> {/* Replaced LuUsers */}
                </span>
                <span>{t(`${translationPath}UserManagement`)}</span>
            </Dropdown.Item>
            <Dropdown.Item
                eventKey="Settings"
                className="gap-2"
                disabled
                onClick={() => {}}
            >
                <span className="text-xl">
                    <FcSettings /> {/* Replaced LuSettings */}
                </span>
                <span>{t(`${translationPath}Settings`)}</span>
            </Dropdown.Item>
            <Dropdown.Item
                eventKey="SignOut"
                className="gap-2"
                onClick={handleSignOut}
            >
                <span className="text-xl">
                    <FcExport /> {/* Replaced PiSignOutDuotone */}
                </span>
                <span>{t(`${translationPath}SignOut`)}</span>
            </Dropdown.Item>
        </Dropdown>
    )
}

const UserDropdown = withHeaderItem(_UserDropdown)

export default UserDropdown