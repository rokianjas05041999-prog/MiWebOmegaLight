/**
 * Theme Manager
 * Manages theme switching functionality and applies themes to the application
 * 
 * Features:
 * - Dynamic theme switching with CSS variables
 * - Theme persistence via localStorage
 * - Dark mode support with proper contrast
 * - Typography and color management
 * - Event-driven theme updates
 */

import { DOMUtils } from '../utils/dom.js';
import { StorageUtils } from '../utils/storage.js';
import { THEME_CONFIG, DEFAULT_THEME, THEME_STORAGE_KEY } from '../configs/theme.config.js';

export class ThemeManager {
  constructor() {
    this.themes = THEME_CONFIG;
    this.currentTheme = DEFAULT_THEME;
    this.showThemeSwitcher = false;
    
    this.init();
  }

  // ===== INITIALIZATION METHODS =====

  init() {
    // Load saved theme from localStorage
    const savedTheme = StorageUtils.getLocal(THEME_STORAGE_KEY, DEFAULT_THEME);
    this.currentTheme = savedTheme;
    
    // Apply theme
    this.applyTheme(this.currentTheme);
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Render theme options
    this.renderThemeOptions();
    
    console.log(`Theme Manager initialized with: ${this.currentTheme}`);
  }

  setupEventListeners() {
    // Theme switcher toggle
    const themeToggle = DOMUtils.select('[data-theme-toggle]');
    
    if (themeToggle) {
      DOMUtils.addEventListener(themeToggle, 'click', () => {
        this.toggleThemeSwitcher();
      });
    }

    // Close on click outside
    DOMUtils.addEventListener(document, 'click', (event) => {
      const themeSwitcher = DOMUtils.select('[data-theme-switcher]');
      const themeToggle = DOMUtils.select('[data-theme-toggle]');
      
      if (themeSwitcher && 
          !themeSwitcher.contains(event.target) && 
          !themeToggle.contains(event.target)) {
        this.hideThemeSwitcher();
      }
    });
  }

  // ===== UI MANAGEMENT METHODS =====

  toggleThemeSwitcher() {
    this.showThemeSwitcher = !this.showThemeSwitcher;
    const switcher = DOMUtils.select('[data-theme-switcher]');
    
    if (switcher) {
      DOMUtils.toggleClass(switcher, 'show', this.showThemeSwitcher);
    }
  }

  hideThemeSwitcher() {
    this.showThemeSwitcher = false;
    const switcher = DOMUtils.select('[data-theme-switcher]');
    
    if (switcher) {
      DOMUtils.toggleClass(switcher, 'show', false);
    }
  }

  renderThemeOptions() {
    const container = DOMUtils.select('[data-theme-options]');
    if (!container) return;

    container.innerHTML = '';

    Object.entries(this.themes).forEach(([key, theme]) => {
      const option = DOMUtils.createElement('button', {
        className: `theme-option flex items-center justify-between w-full p-3 text-left transition-colors rounded-lg ${
          this.currentTheme === key ? 'active border' : ''
        }`,
        'data-theme': key
      });

      option.innerHTML = `
        <div class="flex items-center space-x-3">
          <div class="theme-color-indicator" style="background-color: ${theme.primary[500]}"></div>
          <div>
            <div class="text-sm font-medium text-gray-900">${theme.name}</div>
            <div class="text-xs text-gray-500" style="font-family: ${theme.typography.headingFamily}">${theme.typography.headingFamily.replace(/'/g, '').split(',')[0]} - ${theme.name.split(' ')[1] || 'Modern'} & ${theme.name.split(' ')[0]}</div>
          </div>
        </div>
        ${this.currentTheme === key ? '<iconify-icon icon="heroicons:check" class="text-blue-600"></iconify-icon>' : ''}
      `;

      DOMUtils.addEventListener(option, 'click', () => {
        this.switchTheme(key);
      });

      container.appendChild(option);
    });
  }

  // ===== THEME SWITCHING METHODS =====

  switchTheme(themeKey) {
    if (!this.themes[themeKey]) return;

    this.currentTheme = themeKey;
    StorageUtils.setLocal(THEME_STORAGE_KEY, themeKey);
    
    this.applyTheme(themeKey);
    this.renderThemeOptions();
    this.hideThemeSwitcher();

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { theme: themeKey, themeData: this.themes[themeKey] }
    }));
  }

  // ===== THEME APPLICATION METHODS =====

  applyTheme(themeKey) {
    const theme = this.themes[themeKey];
    if (!theme) return;

    const root = document.documentElement;
    const body = document.body;

    // Apply data-theme attribute for CSS-based styling
    root.setAttribute('data-theme', themeKey);
    body.setAttribute('data-theme', themeKey);

    // Apply color variables
    this._applyColorVariables(root, theme, themeKey);
    
    // Apply typography variables
    this._applyTypographyVariables(root, theme);
    
    // Apply theme shortcuts
    this._applyThemeShortcuts(root, theme, themeKey);
    
    // Apply body styles
    this._applyBodyStyles(body, theme, themeKey);
    
    console.log(`Theme ${themeKey} applied successfully. Dark mode: ${themeKey === 'dark'}`);
  }

  _applyColorVariables(root, theme, themeKey) {
    // Apply primary color variables
    Object.entries(theme.primary).forEach(([shade, color]) => {
      root.style.setProperty(`--color-primary-${shade}`, color);
    });

    // Apply secondary color variables (use primary if not defined)
    const secondary = theme.secondary || theme.primary;
    Object.entries(secondary).forEach(([shade, color]) => {
      root.style.setProperty(`--color-secondary-${shade}`, color);
    });

    // Apply accent color variables (use secondary if not defined)
    const accent = theme.accent || theme.secondary || theme.primary;
    Object.entries(accent).forEach(([shade, color]) => {
      root.style.setProperty(`--color-accent-${shade}`, color);
    });

    // Apply neutral color variables
    if (theme.neutral) {
      Object.entries(theme.neutral).forEach(([shade, color]) => {
        root.style.setProperty(`--color-neutral-${shade}`, color);
      });
    }

    // Apply overlay color based on primary color with 80% opacity
    this._applyOverlayColor(root, theme, themeKey);
  }

  _applyTypographyVariables(root, theme) {
    Object.entries(theme.typography).forEach(([property, value]) => {
      root.style.setProperty(`--font-${property.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
    });
  }

  _applyThemeShortcuts(root, theme, themeKey) {
    const isDark = themeKey === 'dark';
    
    // Primary shortcuts
    root.style.setProperty(`--primary`, isDark ? theme.primary[500] : theme.primary[600]);
    root.style.setProperty(`--primary-hover`, isDark ? theme.primary[400] : theme.primary[700]);
    root.style.setProperty(`--primary-light`, isDark ? theme.primary[900] : theme.primary[100]);
    root.style.setProperty(`--primary-dark`, isDark ? theme.primary[100] : theme.primary[900]);

    // Text colors - Fix untuk dark mode contrast
    if (isDark) {
      root.style.setProperty(`--text-primary`, theme.neutral[900]); // White text
      root.style.setProperty(`--text-secondary`, theme.neutral[600]); // Light gray text
      root.style.setProperty(`--text-muted`, theme.neutral[500]); // Muted gray text
    } else {
      root.style.setProperty(`--text-primary`, theme.neutral[900]);
      root.style.setProperty(`--text-secondary`, theme.neutral[600]);
      root.style.setProperty(`--text-muted`, theme.neutral[500]);
    }

    // Background colors - Fix untuk dark mode
    if (isDark) {
      root.style.setProperty(`--bg-primary`, theme.neutral[50]); // Dark background
      root.style.setProperty(`--bg-secondary`, theme.neutral[100]); // Slightly lighter dark
      root.style.setProperty(`--bg-dark`, theme.neutral[900]); // Light for contrast
    } else {
      root.style.setProperty(`--bg-primary`, '#ffffff');
      root.style.setProperty(`--bg-secondary`, theme.neutral[50]);
      root.style.setProperty(`--bg-dark`, theme.neutral[900]);
    }

    // Border colors - Fix untuk dark mode
    if (isDark) {
      root.style.setProperty(`--border-color`, theme.neutral[300]); // Lighter border in dark mode
      root.style.setProperty(`--border-focus`, theme.primary[400]);
    } else {
      root.style.setProperty(`--border-color`, theme.neutral[300]);
      root.style.setProperty(`--border-focus`, theme.primary[500]);
    }
  }

  _applyOverlayColor(root, theme, themeKey) {
    const primaryColor = theme.primary[800] || theme.primary[700] || theme.primary[600];
    if (primaryColor) {
      try {
        // Convert hex to rgba with 0.8 opacity
        const hex = primaryColor.replace('#', '');
        
        // Validate hex format (should be 6 characters)
        if (hex.length === 6) {
          const r = parseInt(hex.substr(0, 2), 16);
          const g = parseInt(hex.substr(2, 2), 16);
          const b = parseInt(hex.substr(4, 2), 16);
          const overlayColor = `rgba(${r}, ${g}, ${b}, 0.8)`;
          root.style.setProperty(`--overlay-primary`, overlayColor);
          
          // Debug log untuk memastikan overlay color teraplikasi
          console.log(`Theme ${themeKey}: Applied overlay color ${overlayColor} from primary ${primaryColor}`);
        } else {
          console.warn(`Invalid hex color format for theme ${themeKey}: ${primaryColor}`);
        }
      } catch (error) {
        console.error(`Error converting color for theme ${themeKey}:`, error);
      }
    }
  }

  _applyBodyStyles(body, theme, themeKey) {
    const isDark = themeKey === 'dark';
    
    // Update body styles untuk dark mode
    if (isDark) {
      body.style.backgroundColor = theme.neutral[50]; // Dark background
      body.style.color = theme.neutral[900]; // Light text
    } else {
      body.style.backgroundColor = '#ffffff';
      body.style.color = theme.neutral[900];
    }

    // Update body font
    body.style.fontFamily = theme.typography.fontFamily;
  }

  // ===== UTILITY METHODS =====

  getCurrentTheme() {
    return {
      key: this.currentTheme,
      data: this.themes[this.currentTheme]
    };
  }
}
