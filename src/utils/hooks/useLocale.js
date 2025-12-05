import { useEffect } from 'react';
import { useLocaleStore } from '@/store/localeStore';
import useDirection from './useDirection';
import { DIR_LTR, DIR_RTL } from '@/constants/theme.constant';
import i18n from 'i18next';

const useLocale = () => {
    const currentLang = useLocaleStore((state) => state.currentLang)
    const [, setDirection] = useDirection()
    useEffect(() => {
        if (i18n.language !== currentLang) {
            const formattedLang = currentLang.replace(
                /-([a-z])/g,
                function (g) {
                    return g[1].toUpperCase()
                },
            )
            i18n.changeLanguage(formattedLang)
        }


        if (currentLang === 'ar') {
            setDirection(DIR_RTL)
        } else {
            setDirection(DIR_LTR)
        }

    }, [currentLang, setDirection])

    return {
        locale: currentLang,
    }
}

export default useLocale
