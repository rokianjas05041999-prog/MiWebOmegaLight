// Language Configuration
// Centralized language definitions and settings

export const LANGUAGE_CONFIG = {
  en: {
    name: 'English',
    flag: '🇺🇸',
    direction: 'ltr',
    file: './src/locales/en.json'
  },
  id: {
    name: 'Bahasa Indonesia',
    flag: '🇮🇩',
    direction: 'ltr',
    file: './src/locales/id.json'
  },
  ms: {
    name: 'Bahasa Melayu',
    flag: '🇲🇾',
    direction: 'ltr',
    file: './src/locales/ms.json'
  }
};

// Default language settings
export const DEFAULT_LANGUAGE = 'en';

// Language storage key
export const LANGUAGE_STORAGE_KEY = 'selected-language';

// Translation attribute for DOM elements
export const TRANSLATE_ATTRIBUTE = 'data-translate';
