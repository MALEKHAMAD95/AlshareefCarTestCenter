
import { initReactI18next } from 'react-i18next';
import en from './lang/en.json';
import ar from './lang/ar.json';
import appConfig from '@/configs/app.config';
import i18n from 'i18next';
const resources = {
    ar: {
        translation: ar,
    },
    en: {
        translation: en,
    }
}

i18n.use(initReactI18next).init({
    resources,
    fallbackLng: appConfig.locale,
    lng: appConfig.locale,
    interpolation: {
        escapeValue: false,
    },
})

export const dateLocales = {
    en: () => import('dayjs/locale/en'),
    ar: () => import('dayjs/locale/ar'),
}
export default i18n
