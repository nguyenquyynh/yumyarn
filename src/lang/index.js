import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './translations/en.json';
import vi from './translations/vi.json';
import jp from './translations/jp.json';
import cn from './translations/cn.json';
import fr from './translations/fr.json';

const resources = {
    en: { translation: en },
    vi: { translation: vi },
    jp: { translation: jp },
    cn: { translation: cn },
    fr: { translation: fr },
};

i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    resources,
    lng: 'vi',
    interpolation: {
        escapeValue: false,
    },
});

export const I18nProvider = ({ children }) => {
    const setting = useSelector(state => state.setting);

    useEffect(() => {
        if (setting && setting.language) {
           i18n.changeLanguage(setting.language)
        }
    },[setting]);

    return children;
};

export const t = (...args) => i18n.t(...args);
export default i18n;
