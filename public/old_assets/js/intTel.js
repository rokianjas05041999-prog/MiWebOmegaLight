// intTel.js - Phone Input Module
(function() {
    'use strict';
    
    // Private variables
    let phoneInstances = new Map();
    
    // Phone Input Class
    class PhoneInputManager {
        constructor(inputSelector, options = {}) {
            this.inputElement = typeof inputSelector === 'string' 
                ? document.querySelector(inputSelector) 
                : inputSelector;
                
            if (!this.inputElement) {
                console.error('Phone input element not found');
                return;
            }
            
            this.defaultOptions = {
                allowDropdown: true,
                autoHideDialCode: false,
                autoPlaceholder: "aggressive",
                initialCountry: "id",
                nationalMode: false,
                separateDialCode: true,
                preferredCountries: ["id", "my", "sg", "th", "ph"],
                utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js"
            };
            
            this.options = { ...this.defaultOptions, ...options };
            this.iti = null;
            this.errorElement = null;
            this.validElement = null;
            
            this.init();
        }
        
        init() {
            // Load CSS if not already loaded
            this.loadCSS();
            
            // Initialize intl-tel-input
            this.initializePlugin();
            
            // Setup validation elements
            this.setupValidationElements();
            
            // Bind events
            this.bindEvents();
            
            // Store instance
            phoneInstances.set(this.inputElement.id || this.inputElement, this);
        }
        
        loadCSS() {
            const cssId = 'intl-tel-input-css';
            if (!document.getElementById(cssId)) {
                const link = document.createElement('link');
                link.id = cssId;
                link.rel = 'stylesheet';
                link.href = 'https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/css/intlTelInput.css';
                document.head.appendChild(link);
                
                // Add custom styles
                this.addCustomStyles();
            }
        }
        
        addCustomStyles() {
            const styleId = 'intl-tel-custom-styles';
            if (!document.getElementById(styleId)) {
                const style = document.createElement('style');
                style.id = styleId;
                style.textContent = `
                    .iti { width: 100%; }
                    .iti__flag-container { border-right: 1px solid #d1d5db; }
                    .iti__selected-flag { 
                        padding: 0 8px; 
                        border-radius: 0.5rem 0 0 0.5rem; 
                        background: #f9fafb; 
                    }
                    .iti__country-list { 
                        border-radius: 0.5rem; 
                        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); 
                    }
                    .iti__country:hover { background-color: #f3f4f6; }
                    .iti__country.iti__highlight { background-color: #dbeafe; }
                    .iti input[type=tel] {
                        width: 100%;
                        padding: 0.5rem 0.75rem;
                        border: 1px solid #d1d5db;
                        border-radius: 0 0.5rem 0.5rem 0;
                        border-left: none;
                        outline: none;
                        transition: all 0.2s;
                    }
                    .iti input[type=tel]:focus {
                        border-color: #3b82f6;
                        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                    }
                `;
                document.head.appendChild(style);
            }
        }
        
        initializePlugin() {
            // Wait for intlTelInput to be available
            if (typeof window.intlTelInput === 'undefined') {
                this.loadScript().then(() => {
                    this.iti = window.intlTelInput(this.inputElement, this.options);
                });
            } else {
                this.iti = window.intlTelInput(this.inputElement, this.options);
            }
        }
        
        loadScript() {
            return new Promise((resolve, reject) => {
                const scriptId = 'intl-tel-input-js';
                if (document.getElementById(scriptId)) {
                    resolve();
                    return;
                }
                
                const script = document.createElement('script');
                script.id = scriptId;
                script.src = 'https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/intlTelInput.min.js';
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }
        
        setupValidationElements() {
            const inputId = this.inputElement.id;
            
            // Create error element if not exists
            this.errorElement = document.getElementById(`${inputId}Error`) || 
                              document.getElementById('phoneError');
            
            // Create valid element if not exists  
            this.validElement = document.getElementById(`${inputId}Valid`) || 
                               document.getElementById('phoneValid');
                               
            // Create elements if they don't exist
            if (!this.errorElement) {
                this.errorElement = document.createElement('div');
                this.errorElement.id = `${inputId}Error`;
                this.errorElement.className = 'mt-1 text-sm text-red-600 hidden';
                this.inputElement.parentNode.appendChild(this.errorElement);
            }
            
            if (!this.validElement) {
                this.validElement = document.createElement('div');
                this.validElement.id = `${inputId}Valid`;
                this.validElement.className = 'mt-1 text-sm text-green-600 hidden';
                this.validElement.textContent = '✓ Valid phone number';
                this.inputElement.parentNode.appendChild(this.validElement);
            }
        }
        
        bindEvents() {
            // Input validation
            this.inputElement.addEventListener('input', () => {
                this.validatePhone();
            });
            
            // Country change
            this.inputElement.addEventListener('countrychange', () => {
                this.onCountryChange();
            });
        }
        
        validatePhone() {
            if (!this.iti) return false;
            
            const isValid = this.iti.isValidNumber();
            const hasValue = this.inputElement.value.trim() !== '';
            
            if (isValid) {
                this.showValid();
                return true;
            } else if (hasValue) {
                this.showError('Please enter a valid phone number');
                return false;
            } else {
                this.hideValidation();
                return false;
            }
        }
        
        showError(message) {
            if (this.errorElement) {
                this.errorElement.textContent = message;
                this.errorElement.classList.remove('hidden');
            }
            if (this.validElement) {
                this.validElement.classList.add('hidden');
            }
            this.inputElement.classList.remove('border-green-500');
            this.inputElement.classList.add('border-red-500');
        }
        
        showValid() {
            if (this.validElement) {
                this.validElement.classList.remove('hidden');
            }
            if (this.errorElement) {
                this.errorElement.classList.add('hidden');
            }
            this.inputElement.classList.remove('border-red-500');
            this.inputElement.classList.add('border-green-500');
        }
        
        hideValidation() {
            if (this.errorElement) {
                this.errorElement.classList.add('hidden');
            }
            if (this.validElement) {
                this.validElement.classList.add('hidden');
            }
            this.inputElement.classList.remove('border-red-500', 'border-green-500');
        }
        
        onCountryChange() {
            if (!this.iti) return;
            
            const countryData = this.iti.getSelectedCountryData();
            const event = new CustomEvent('phoneCountryChange', {
                detail: {
                    country: countryData,
                    instance: this
                }
            });
            this.inputElement.dispatchEvent(event);
        }
        
        // Public methods
        getNumber() {
            return this.iti ? this.iti.getNumber() : '';
        }
        
        getCountryData() {
            return this.iti ? this.iti.getSelectedCountryData() : null;
        }
        
        isValid() {
            return this.iti ? this.iti.isValidNumber() : false;
        }
        
        setCountry(countryCode) {
            if (this.iti) {
                this.iti.setCountry(countryCode);
            }
        }
        
        destroy() {
            if (this.iti) {
                this.iti.destroy();
            }
            phoneInstances.delete(this.inputElement.id || this.inputElement);
        }
    }
    
    // Global API
    window.IntTelPhone = {
        // Initialize phone input
        init: function(selector, options) {
            return new PhoneInputManager(selector, options);
        },
        
        // Get instance by selector
        getInstance: function(selector) {
            const element = typeof selector === 'string' 
                ? document.querySelector(selector) 
                : selector;
            return phoneInstances.get(element?.id || element);
        },
        
        // Initialize all phone inputs with data attribute
        initAll: function() {
            const phoneInputs = document.querySelectorAll('[data-phone-input]');
            phoneInputs.forEach(input => {
                const options = input.dataset.phoneOptions 
                    ? JSON.parse(input.dataset.phoneOptions) 
                    : {};
                new PhoneInputManager(input, options);
            });
        }
    };
    
    // Auto initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            window.IntTelPhone.initAll();
        });
    } else {
        window.IntTelPhone.initAll();
    }
    
})();
