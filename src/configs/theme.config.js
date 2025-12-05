import { THEME_ENUM } from '@/constants/theme.constant'

export const themeConfig = {
    themeSchema: "orange",
    direction: THEME_ENUM.DIR_RTL,
    mode: THEME_ENUM.MODE_LIGHT,
    panelExpand: false,
    controlSize: 'md',
     themeSchema : THEME_ENUM.THEME_SCHEMA,
    layout: {
        type: THEME_ENUM.LAYOUT_COLLAPSIBLE_SIDE,
        sideNavCollapse: false,
    },
}
