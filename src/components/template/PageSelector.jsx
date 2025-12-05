import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Dropdown from '@/components/ui/Dropdown'
import classNames from 'classnames'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import { HiCheck } from 'react-icons/hi'
import { IoMdCash } from 'react-icons/io'
import { IoIosBookmark } from 'react-icons/io'
import { useTranslation } from 'react-i18next'

import {
    FcBusinessman,
    FcLock,
    FcSettings,
    FcList
} from 'react-icons/fc'

const pageList = [
    {
        active: true,
        label: 'Users',
        path: '/users',
        icon: FcBusinessman, // Replaced LuUsers with FcBusinessman
    },
    {
        active: true,
        label: 'UsersRights',
        path: '/usersRights',
        icon: FcLock, // Replaced LuShield with FcLock
    },
        {
        active: true,
        label: 'Lookup',
        path: '/Lookup',
        icon: FcList, // Replaced LuShield with FcLock
    },
]

const _PageSelector = ({ className }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const { t, i18n } = useTranslation('translation')
    const translationPath = 'nav.PageSelector.'

    // Determine directionality based on language
    const isRtl = i18n.language === 'ar'

    const activePage = useMemo(() => {
        const currentPage = pageList.find((page) => {
            if (page.path.includes('/OrderStatus/')) {
                return location.pathname.includes(page.path)
            }
            return page.path === location.pathname
        })
        return currentPage?.label || ''
    }, [location.pathname])

    const selectedPage = (
        <div className={classNames(className, 'flex items-center')}>
            <FcSettings size={24} /> {/* Replaced LuFileStack with FcSettings */}
        </div>
    )

    return (
        <Dropdown renderTitle={selectedPage} placement={isRtl ? 'bottom-start' : 'bottom-end'}>
            {pageList.map((page) => (
                <Dropdown.Item
                    key={page.label}
                    disabled={!page.active}
                    className="justify-between"
                    eventKey={page.label}
                    onClick={() => navigate(page.path)}
                >
                    <span className="flex items-center">
                        <page.icon size={18} className={isRtl ? 'ltr:mr-2 rtl:ml-2' : 'ltr:mr-2 rtl:ml-2'} />
                        <span>{t(`${translationPath}${page.label}`)}</span>
                    </span>
                    {activePage === page.label && (
                        <HiCheck className="text-emerald-500 text-lg" />
                    )}
                </Dropdown.Item>
            ))}
        </Dropdown>
    )
}

const PageSelector = withHeaderItem(_PageSelector)

export default PageSelector