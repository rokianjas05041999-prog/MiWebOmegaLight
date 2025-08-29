// Language Manager
// Manages multi-language functionality and translation loading

import { DOMUtils } from '../utils/dom.js';
import { StorageUtils } from '../utils/storage.js';
import { HttpUtils } from '../utils/http.js';
import { LANGUAGE_CONFIG, DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY, TRANSLATE_ATTRIBUTE } from '../configs/language.config.js';

export class LanguageManager {
  constructor() {
    this.languages = LANGUAGE_CONFIG;
    this.translations = {};
    this.currentLanguage = DEFAULT_LANGUAGE;
    this.showLanguageSwitcher = false;
    this.isLoading = false;
    this.loadQueue = [];
    
    this.init();
  }

  async init() {
    try {
      // Load saved language
      const savedLanguage = StorageUtils.getLocal(LANGUAGE_STORAGE_KEY, DEFAULT_LANGUAGE);
      this.currentLanguage = savedLanguage;

      // Load translations
      await this.loadLanguageTranslations(this.currentLanguage);
      
      // Apply language
      this.applyLanguage(this.currentLanguage);
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Render language options
      this.renderLanguageOptions();
      
      console.log(`Language Manager initialized with: ${this.currentLanguage}`);
    } catch (error) {
      console.error('Language Manager initialization failed:', error);
    }
  }

  setupEventListeners() {
    // Language switcher toggle
    const languageToggle = DOMUtils.select('[data-language-toggle]');
    
    if (languageToggle) {
      DOMUtils.addEventListener(languageToggle, 'click', () => {
        this.toggleLanguageSwitcher();
      });
    }

    // Close on click outside
    DOMUtils.addEventListener(document, 'click', (event) => {
      const languageSwitcher = DOMUtils.select('[data-language-switcher]');
      const languageToggle = DOMUtils.select('[data-language-toggle]');
      
      if (languageSwitcher && 
          !languageSwitcher.contains(event.target) && 
          !languageToggle.contains(event.target)) {
        this.hideLanguageSwitcher();
      }
    });
  }

  toggleLanguageSwitcher() {
    this.showLanguageSwitcher = !this.showLanguageSwitcher;
    const switcher = DOMUtils.select('[data-language-switcher]');
    
    if (switcher) {
      DOMUtils.toggleClass(switcher, 'show', this.showLanguageSwitcher);
    }
  }

  hideLanguageSwitcher() {
    this.showLanguageSwitcher = false;
    const switcher = DOMUtils.select('[data-language-switcher]');
    
    if (switcher) {
      DOMUtils.toggleClass(switcher, 'show', false);
    }
  }

  renderLanguageOptions() {
    const container = DOMUtils.select('[data-language-options]');
    if (!container) return;

    container.innerHTML = '';

    Object.entries(this.languages).forEach(([key, language]) => {
      const option = DOMUtils.createElement('button', {
        className: `language-option flex items-center justify-between w-full p-3 text-left transition-colors rounded-lg ${
          this.currentLanguage === key ? 'active border' : ''
        }`,
        'data-language': key
      });

      option.innerHTML = `
        <div class="flex items-center space-x-3">
          <span class="text-lg">${language.flag}</span>
          <span class="text-sm font-medium text-gray-900">${language.name}</span>
        </div>
        ${this.currentLanguage === key ? '<iconify-icon icon="heroicons:check" class="text-blue-600"></iconify-icon>' : ''}
      `;

      DOMUtils.addEventListener(option, 'click', () => {
        this.switchLanguage(key);
      });

      container.appendChild(option);
    });
  }

  async loadLanguageTranslations(languageKey) {
    if (this.translations[languageKey]) {
      return this.translations[languageKey];
    }

    if (this.isLoading) {
      return new Promise((resolve) => {
        this.loadQueue.push({ languageKey, resolve });
      });
    }

    this.isLoading = true;

    try {
      const language = this.languages[languageKey];
      if (!language) {
        throw new Error(`Language ${languageKey} not found`);
      }

      const result = await HttpUtils.fetchJSON(language.file);
      
      if (result.success) {
        this.translations[languageKey] = result.data;
        
        // Process queue
        this.loadQueue.forEach(({ languageKey: qKey, resolve }) => {
          if (qKey === languageKey) {
            resolve(this.translations[languageKey]);
          }
        });
        this.loadQueue = this.loadQueue.filter(item => item.languageKey !== languageKey);
        
        return this.translations[languageKey];
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error(`Failed to load language ${languageKey}:`, error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  async switchLanguage(languageKey) {
    if (!this.languages[languageKey]) return;

    try {
      // Load translations if not cached
      await this.loadLanguageTranslations(languageKey);
      
      this.currentLanguage = languageKey;
      StorageUtils.setLocal(LANGUAGE_STORAGE_KEY, languageKey);
      
      this.applyLanguage(languageKey);
      this.renderLanguageOptions();
      this.hideLanguageSwitcher();

      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { language: languageKey, translations: this.translations[languageKey] }
      }));
    } catch (error) {
      console.error('Failed to switch language:', error);
    }
  }

  applyLanguage(languageKey) {
    const translations = this.translations[languageKey];
    if (!translations) return;

    // Update all elements with data-translate attribute
    const elements = DOMUtils.selectAll(`[${TRANSLATE_ATTRIBUTE}]`);
    console.log(`🔄 Applying language ${languageKey} to ${elements.length} elements`);
    
    elements.forEach(element => {
      const key = element.getAttribute(TRANSLATE_ATTRIBUTE);
      const translatedText = this.translate(key);
      if (translatedText !== key) {
        this.setElementContent(element, translatedText);
      }
    });

    // Update document direction if needed
    const language = this.languages[languageKey];
    if (language.direction) {
      document.documentElement.dir = language.direction;
    }

    console.log(`Language applied: ${languageKey}`);
  }

  /**
   * Force re-apply language translations to all elements
   * Useful after components are dynamically loaded
   */
  reapplyLanguage() {
    if (this.currentLanguage && this.translations[this.currentLanguage]) {
      console.log('🔄 Force re-applying language translations...');
      this.applyLanguage(this.currentLanguage);
    }
  }

  /**
   * Safely set element content, allowing basic HTML tags like <br>
   * @param {HTMLElement} element - Target element
   * @param {string} content - Content to set (may contain HTML)
   */
  setElementContent(element, content) {
    // List of allowed HTML tags for translation
    const allowedTags = ['br', 'strong', 'em', 'span'];
    
    // Check if content contains HTML tags
    const hasHTML = /<[^>]+>/.test(content);
    
    if (hasHTML) {
      // Validate that only allowed tags are used
      const tagMatches = content.match(/<\/?([a-zA-Z]+)[^>]*>/g) || [];
      const isValid = tagMatches.every(tag => {
        const tagName = tag.match(/<\/?([a-zA-Z]+)/)?.[1]?.toLowerCase();
        return allowedTags.includes(tagName);
      });
      
      if (isValid) {
        // Safe to use innerHTML for allowed tags
        element.innerHTML = content;
      } else {
        // Fallback to textContent for security
        console.warn(`Translation contains unsafe HTML tags: ${content}`);
        element.textContent = content;
      }
    } else {
      // Check if content contains newline characters
      if (content.includes('\n')) {
        // Convert newlines to <br> tags for proper display
        element.innerHTML = content.replace(/\n/g, '<br>');
      } else {
        // No HTML or newlines, use textContent
        element.textContent = content;
      }
    }
  }

  translate(key, fallback = '') {
    const translations = this.translations[this.currentLanguage];
    if (!translations) return fallback || key;
    
    // Handle nested keys like 'navigation.home', 'hero.title', 'services.items.0.title', etc.
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        // Check if k is a numeric index (for arrays)
        const index = parseInt(k);
        if (!isNaN(index) && Array.isArray(value)) {
          value = value[index];
        } else if (k in value) {
          value = value[k];
        } else {
          return fallback || key;
        }
      } else {
        return fallback || key;
      }
    }
    
    return typeof value === 'string' ? value : fallback || key;
  }

  getCurrentLanguage() {
    return {
      key: this.currentLanguage,
      data: this.languages[this.currentLanguage],
      translations: this.translations[this.currentLanguage]
    };
  }
}
