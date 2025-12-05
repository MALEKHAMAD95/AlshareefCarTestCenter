import { useEffect, useMemo, useState } from 'react'
import classNames from '@/utils/classNames'
import ScrollBar from '@/components/ui/ScrollBar'
import Logo from '@/components/template/Logo'
import { useThemeStore } from '@/store/themeStore'
import { useSessionUser } from '@/store/authStore'
import { useRouteKeyStore } from '@/store/routeKeyStore'
import useMenuActive from '@/utils/hooks/useMenuActive'
import useTranslation from '@/utils/hooks/useTranslation'
import navigationConfig from '@/configs/navigation.config'
import appConfig, { APP_NAME } from '@/configs/app.config'
import { Link } from 'react-router-dom'
import AuthorityCheck from '@/components/shared/AuthorityCheck'
import VerticalMenuIcon from './VerticalMenuContent/VerticalMenuIcon'
import {
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import {
    SIDE_NAV_WIDTH,
    SIDE_NAV_COLLAPSED_WIDTH,
} from '@/constants/theme.constant'
import { TbX, TbSearch, TbArrowRight, TbUserPlus, TbPhoneCall, TbCalendar, TbClipboard, TbChevronRight, TbMoon, TbSun } from 'react-icons/tb'
import { THEME_ENUM } from '@/constants/theme.constant'

const sideNavStyle = {
    width: SIDE_NAV_WIDTH,
    minWidth: SIDE_NAV_WIDTH,
}

const sideNavCollapseStyle = {
    width: SIDE_NAV_COLLAPSED_WIDTH,
    minWidth: SIDE_NAV_COLLAPSED_WIDTH,
}

const DEFAULT_COMPANY_NAME = APP_NAME || 'DeepCRM'

const quickActions = [
    { key: 'appointmentBooking', label: 'حجز دور', icon: TbCalendar, path: '/appointment-booking' },
    { key: 'reservations', label: 'الحجوزات', icon: TbClipboard, path: '/reservations' },
    { key: 'vehicleEntry', label: 'إدخال المركبة', icon: TbPhoneCall, path: '/vehicle-entry' },
    { key: 'accounting', label: 'شاشة المحاسبة', icon: TbUserPlus, path: '/accounting' },
]

const SideNav = ({
    translationSetup = appConfig.activeNavTranslation,
    background = true,
    className,
    contentClass,
    mode,
}) => {
    const defaultMode = useThemeStore((state) => state.mode)
    const setMode = useThemeStore((state) => state.setMode)
    const direction = useThemeStore((state) => state.direction)
    const sideNavCollapse = useThemeStore(
        (state) => state.layout.sideNavCollapse,
    )
    const setSideNavCollapse = useThemeStore(
        (state) => state.setSideNavCollapse,
    )

    const currentRouteKey = useRouteKeyStore((state) => state.currentRouteKey)

    const user = useSessionUser((state) => state.user)
    const userAuthority = user.authority

    const { activedRoute } = useMenuActive(
        navigationConfig,
        currentRouteKey,
    )

    const [expandedKeys, setExpandedKeys] = useState(() =>
        activedRoute?.parentKey ? [activedRoute.parentKey] : [],
    )

    useEffect(() => {
        if (activedRoute?.parentKey) {
            setExpandedKeys([activedRoute.parentKey])
        }
    }, [activedRoute?.parentKey])

    const { t } = useTranslation(!translationSetup)

    const navigationTree = useMemo(() => navigationConfig, [])

    const toggleCollapseSection = (key) => {
        setExpandedKeys((prev) =>
            prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
        )
    }

    const toggleTheme = () => {
        const newMode = defaultMode === THEME_ENUM.MODE_DARK ? THEME_ENUM.MODE_LIGHT : THEME_ENUM.MODE_DARK
        setMode(newMode)
        document.documentElement.classList.toggle('dark')
    }

    const getUserInitials = (name) => {
        if (!name) return 'U'
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()
    }

    const renderNavLinkContent = (nav) => {
        const title = t(nav.translateKey, nav.title)
        const badgeValue =
            nav.badge?.value ??
            nav.badge ??
            nav.meta?.badge?.value ??
            nav.meta?.count ??
            nav.count
        const hasNotification = nav.meta?.notification

        return (
            <>
                <span className="app-side-bar__nav-icon">
                    <VerticalMenuIcon icon={nav.icon} />
                </span>
                <span className="app-side-bar__nav-text">{title}</span>
                {badgeValue ? (
                    <span className="app-side-bar__badge">{badgeValue}</span>
                ) : hasNotification ? (
                    <span className="app-side-bar__notification-dot" />
                ) : null}
                <span className="app-side-bar__tooltip">{title}</span>
            </>
        )
    }

    const renderNavItems = (items, level = 0) => {
        // Group items by section if they have section headers
        let currentSection = null
        const groupedItems = []
        
        items.forEach((nav) => {
            if (nav.type === 'title') {
                currentSection = nav
                groupedItems.push({ type: 'section', nav })
            } else {
                groupedItems.push({ type: 'item', nav, section: currentSection })
            }
        })

        return (
            <>
                {groupedItems.map(({ type, nav, section }, index) => {
                    if (type === 'section') {
                        return (
                            <div key={nav.key} className="app-side-bar__section-header">
                                {t(nav.translateKey, nav.title)}
                            </div>
                        )
                    }

                    return (
                        <AuthorityCheck
                            key={nav.key}
                            userAuthority={userAuthority}
                            authority={nav.authority}
                        >
                            {nav.type === NAV_ITEM_TYPE_ITEM && (
                                <div
                                    className={classNames(
                                        'sidebar-menu-item',
                                        activedRoute?.key === nav.key && 'active',
                                    )}
                                >
                                    {nav.isExternalLink ? (
                                        <a
                                            href={nav.path}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="app-side-bar__nav-link"
                                        >
                                            {renderNavLinkContent(nav)}
                                        </a>
                                    ) : (
                                        <Link
                                            to={nav.path}
                                            className="app-side-bar__nav-link"
                                        >
                                            {renderNavLinkContent(nav)}
                                        </Link>
                                    )}
                                </div>
                            )}
                            {nav.type === NAV_ITEM_TYPE_COLLAPSE && (
                                <>
                                    <div
                                        className={classNames(
                                            'sidebar-menu-item',
                                            activedRoute?.parentKey === nav.key && 'active',
                                        )}
                                    >
                                        <button
                                            type="button"
                                            className="app-side-bar__nav-link"
                                            onClick={() => {
                                                if (sideNavCollapse) {
                                                    setSideNavCollapse(false)
                                                    setTimeout(() => {
                                                        toggleCollapseSection(nav.key)
                                                    }, 150)
                                                } else {
                                                    toggleCollapseSection(nav.key)
                                                }
                                            }}
                                        >
                                            {renderNavLinkContent(nav)}
                                            <TbChevronRight
                                                className={classNames(
                                                    'sidebar-collapse-btn',
                                                    expandedKeys.includes(nav.key) && 'rotated',
                                                )}
                                            />
                                        </button>
                                    </div>
                                    <div
                                        className={classNames(
                                            'sidebar-submenu',
                                            expandedKeys.includes(nav.key) && 'open',
                                        )}
                                    >
                                        {nav.subMenu?.map((subNav) => (
                                            <AuthorityCheck
                                                key={subNav.key}
                                                userAuthority={userAuthority}
                                                authority={subNav.authority}
                                            >
                                                <Link
                                                    to={subNav.path}
                                                    className={classNames(
                                                        'sidebar-submenu-item',
                                                        activedRoute?.key === subNav.key && 'active',
                                                    )}
                                                >
                                                    {subNav.icon && (
                                                        <VerticalMenuIcon icon={subNav.icon} />
                                                    )}
                                                    <span>{t(subNav.translateKey, subNav.title)}</span>
                                                </Link>
                                            </AuthorityCheck>
                                        ))}
                                    </div>
                                </>
                            )}
                        </AuthorityCheck>
                    )
                })}
            </>
        )
    }

    return (
        <div
            style={sideNavCollapse ? sideNavCollapseStyle : sideNavStyle}
            className={classNames(
                'side-nav',
                'app-side-bar',
                background && 'side-nav-bg',
                !sideNavCollapse && 'side-nav-expand',
                sideNavCollapse && 'app-side-bar--collapsed',
                className,
            )}
            data-direction={direction}
        >
            <div className="app-side-bar__inner">
                {/* Logo and Title */}
                <div className="app-side-bar__logo-row">
                    <div
                        className="app-side-bar__logo-link"
                        onClick={() => setSideNavCollapse(!sideNavCollapse)}
                        style={{ cursor: 'pointer' }}
                    >
                        <Logo
                            imgClass="max-h-10"
                            mode={mode || defaultMode}
                            type={sideNavCollapse ? 'streamline' : 'full'}
                        />
                    </div>
                </div>

                {/* Search */}
                <div className="app-side-bar__search">
                    <div className="app-side-bar__search-container">
                        <div className="app-side-bar__search-inner">
                            <TbSearch className="app-side-bar__search-icon" />
                            <input
                                type="text"
                                placeholder={t('nav.search', 'Search...')}
                                className="app-side-bar__search-input"
                            />
                            <button className="app-side-bar__search-button">
                                <TbArrowRight />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="app-side-bar__quick-actions">
                    <h2 className="app-side-bar__quick-title">
                        {t('nav.quickActions', 'QUICK ACTIONS')}
                    </h2>
                    <div className="app-side-bar__quick-grid">
                        {quickActions.map((action) => (
                            <Link
                                key={action.key}
                                to={action.path}
                                className="app-side-bar__quick-btn"
                            >
                                <action.icon />
                                <span>{t(`nav.quickAction.${action.key}`, action.label)}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Main Navigation */}
                <div className={classNames('app-side-bar__content', contentClass)}>
                    <ScrollBar style={{ height: '100%' }} direction={direction}>
                        <nav className="app-side-bar__sections">
                            {renderNavItems(navigationTree)}
                        </nav>
                    </ScrollBar>
                </div>

                {/* User Profile and Theme Toggle */}
                <div className="app-side-bar__user-profile">
                    <div className="app-side-bar__user-container">
                        <div className="app-side-bar__user-info">
                            <div className="app-side-bar__user-avatar">
                                <span>{getUserInitials(user.userName || user.name)}</span>
                                <span className="app-side-bar__status-indicator" />
                            </div>
                            <div className="app-side-bar__user-details">
                                <p className="app-side-bar__user-name">
                                    {user.userName || user.name || t('nav.UserDropdown.Anonymous', 'Anonymous')}
                                </p>
                                <p className="app-side-bar__user-role">
                                    {user.role || user.email || t('nav.UserDropdown.NoEmailAvailable', 'No email available')}
                                </p>
                            </div>
                        </div>

                        <div className="app-side-bar__theme-controls">
                            <TbMoon className="app-side-bar__theme-icon" />
                            <label className="app-side-bar__theme-switch">
                                <input
                                    type="checkbox"
                                    checked={defaultMode === THEME_ENUM.MODE_DARK}
                                    onChange={toggleTheme}
                                />
                                <span className="app-side-bar__theme-slider" />
                            </label>
                            <TbSun className="app-side-bar__theme-icon" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SideNav
