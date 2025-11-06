import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as Localization from 'expo-localization'

import en from './locales/en.json'
import vi from './locales/vi.json'

const userLang = Localization.getLocales()[0].languageCode

i18n.use(initReactI18next).init({
    lng: userLang === 'vi' ? 'vi' : 'en',
    fallbackLng: 'en',
    resources: {
        en: { translation: en },
        vi: { translation: vi },
    },
    interpolation: { escapeValue: false },
})

export default i18n
