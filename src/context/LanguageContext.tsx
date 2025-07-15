"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { id } from '@/translations/id';
import { en } from '@/translations/en';

type Language = 'id' | 'en';
type TranslationKey = string;

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: TranslationKey) => string;
    isChanging: boolean;
}

const translations = {
    id,
    en
};

const LanguageContext = createContext<LanguageContextType>({
    language: 'id',
    setLanguage: () => {},
    t: () => '',
    isChanging: false
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('id');
    const [isChanging, setIsChanging] = useState(false);

    const t = useCallback((key: TranslationKey): string => {
        const keys = key.split('.');
        let value: any = translations[language];

        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                return key; // Return key if translation not found
            }
        }

        return value || key;
    }, [language]);

    const handleLanguageChange = (lang: Language) => {
        setIsChanging(true);
        setLanguage(lang);
        // Reset isChanging after animation duration (300ms)
        setTimeout(() => setIsChanging(false), 300);
    };

    return (
        <LanguageContext.Provider value={{ 
            language, 
            setLanguage: handleLanguageChange, 
            t,
            isChanging 
        }}>
            {children}
        </LanguageContext.Provider>
    );
};
