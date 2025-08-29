// Contact Form Component
// Handles contact form validation and submission

import { DOMUtils } from '../utils/dom.js';
import { HttpUtils } from '../utils/http.js';

export class ContactForm {
  constructor() {
    this.form = null;
    this.formData = {
      name: '',
      email: '',
      phone: '',
      company: '',
      message: ''
    };
    this.errors = {};
    this.isSubmitting = false;
    this.hasAttemptedSubmit = false; // Track if user has tried to submit
    this.touchedFields = new Set(); // Track which fields have been interacted with
    
    this.init();
  }

  init() {
    console.log('🔍 ContactForm: Looking for form element [data-contact-simple-form]');
    this.form = DOMUtils.select('[data-contact-simple-form]');
    if (!this.form) {
      console.warn('❌ ContactForm: Form element not found [data-contact-simple-form]');
      return;
    }

    this.setupEventListeners();
    this.renderForm();
    console.log('✅ ContactForm: Initialization complete');
  }

  setupEventListeners() {
  }

  /**
   * Re-initialize the form (useful when content is dynamically loaded)
   */
  reinit() {
    console.log('🔄 ContactForm: Re-initializing...');
    
    // Reset state
    this.form = null;
    this.formData = {
      name: '',
      email: '',
      phone: '',
      company: '',
      message: ''
    };
    this.errors = {};
    this.isSubmitting = false;
    this.hasAttemptedSubmit = false;
    this.touchedFields = new Set();
    
    // Re-initialize
    this.init();
  }

  /**
   * Force scan for form elements (useful for debugging)
   */
  forceScan() {
    console.log('🔍 ContactForm: Force scanning for form elements...');
    const forms = document.querySelectorAll('[data-contact-simple-form]');
    console.log(`Found ${forms.length} forms with [data-contact-simple-form]`);
    
    const allForms = document.querySelectorAll('form');
    console.log(`Found ${allForms.length} total forms on page`);
    
    if (forms.length > 0) {
      this.form = forms[0];
      this.setupEventListeners();
      console.log('✅ ContactForm: Form found and re-initialized');
    }
  }

  setupEventListeners() {
    if (!this.form) return;

    // Form submission
    DOMUtils.addEventListener(this.form, 'submit', (e) => {
      e.preventDefault();
      this.hasAttemptedSubmit = true; // Mark that user has attempted to submit
      this.handleSubmit();
    });

    // Input validation and interaction tracking
    const inputs = this.form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      // Track when field is focused (user starts interacting)
      DOMUtils.addEventListener(input, 'focus', () => {
        this.touchedFields.add(input.name);
      });

      // Validate on blur only if form has been submitted or field has been touched and has content
      DOMUtils.addEventListener(input, 'blur', () => {
        if (this.hasAttemptedSubmit || (this.touchedFields.has(input.name) && input.value.trim())) {
          this.validateField(input.name, input.value);
          this.updateFieldError(input.name);
        }
      });

      // Update form data and clear errors when user types
      DOMUtils.addEventListener(input, 'input', () => {
        this.formData[input.name] = input.value;
        
        // Only validate and clear errors if user has attempted submit or field was previously touched
        if (this.hasAttemptedSubmit || this.touchedFields.has(input.name)) {
          // Clear existing timeout for this field
          if (this.validationTimeouts && this.validationTimeouts[input.name]) {
            clearTimeout(this.validationTimeouts[input.name]);
          }
          
          // Initialize validationTimeouts if not exists
          if (!this.validationTimeouts) {
            this.validationTimeouts = {};
          }
          
          // Debounce validation for 500ms to avoid too frequent validation
          this.validationTimeouts[input.name] = setTimeout(() => {
            this.validateField(input.name, input.value);
            this.updateFieldError(input.name);
          }, 500);
        }
      });
    });
  }

  validateField(name, value) {
    const trimmedValue = value.trim();

    switch (name) {
      case 'name':
        if (!trimmedValue) {
          this.errors.name = 'Name is required';
        } else if (trimmedValue.length < 2) {
          this.errors.name = 'Name must be at least 2 characters';
        } else {
          delete this.errors.name;
        }
        break;

      case 'email':
        if (!trimmedValue) {
          this.errors.email = 'Email is required';
        } else if (!this.isValidEmail(trimmedValue)) {
          this.errors.email = 'Please enter a valid email address';
        } else {
          delete this.errors.email;
        }
        break;

      case 'phone':
        if (trimmedValue && !this.isValidPhone(trimmedValue)) {
          this.errors.phone = 'Please enter a valid phone number';
        } else {
          delete this.errors.phone;
        }
        break;

      case 'message':
        if (!trimmedValue) {
          this.errors.message = 'Message is required';
        } else if (trimmedValue.length < 10) {
          this.errors.message = 'Message must be at least 10 characters';
        } else {
          delete this.errors.message;
        }
        break;
    }
  }

  validateForm() {
    this.errors = {};
    
    Object.entries(this.formData).forEach(([key, value]) => {
      if (key !== 'phone' && key !== 'company') { // Phone and company are optional
        this.validateField(key, value);
      }
    });

    return Object.keys(this.errors).length === 0;
  }

  updateFieldError(fieldName) {
    const errorElement = DOMUtils.select(`[data-error="${fieldName}"]`);
    const inputElement = DOMUtils.select(`[name="${fieldName}"]`);
    
    if (this.errors[fieldName]) {
      if (errorElement) {
        errorElement.textContent = this.errors[fieldName];
        errorElement.classList.remove('hidden');
      }
      if (inputElement) {
        inputElement.classList.add('border-red-500', 'focus:border-red-500');
        inputElement.classList.remove('border-gray-300', 'focus:border-primary-500');
      }
    } else {
      if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.add('hidden');
      }
      if (inputElement) {
        inputElement.classList.remove('border-red-500', 'focus:border-red-500');
        inputElement.classList.add('border-gray-300', 'focus:border-primary-500');
      }
    }
  }

  async handleSubmit() {
    if (this.isSubmitting) return;

    // Collect form data
    const formElement = this.form;
    const formData = new FormData(formElement);
    
    this.formData = {};
    for (let [key, value] of formData.entries()) {
      this.formData[key] = value;
    }

    // Validate
    if (!this.validateForm()) {
      Object.keys(this.errors).forEach(fieldName => {
        this.updateFieldError(fieldName);
      });
      return;
    }

    this.isSubmitting = true;
    this.updateSubmitButton(true);

    try {
      // Simulate API call (replace with actual endpoint)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success
      this.showMessage('success', 'Thank you! Your message has been sent successfully.');
      this.resetForm();
    } catch (error) {
      // Error
      this.showMessage('error', 'Sorry, there was an error sending your message. Please try again.');
      console.error('Form submission error:', error);
    } finally {
      this.isSubmitting = false;
      this.updateSubmitButton(false);
    }
  }

  updateSubmitButton(isLoading) {
    const submitBtn = DOMUtils.select('[data-submit-btn]');
    const submitText = DOMUtils.select('[data-submit-text]');
    const submitLoader = DOMUtils.select('[data-submit-loader]');
    
    if (submitBtn) {
      submitBtn.disabled = isLoading;
      DOMUtils.toggleClass(submitBtn, 'opacity-75', isLoading);
      DOMUtils.toggleClass(submitBtn, 'cursor-not-allowed', isLoading);
    }
    
    if (submitText) {
      submitText.textContent = isLoading ? 'Sending...' : 'Send Message';
    }
    
    if (submitLoader) {
      DOMUtils.toggleClass(submitLoader, 'hidden', !isLoading);
    }
  }

  showMessage(type, message) {
    const messageContainer = DOMUtils.select('[data-form-message]');
    if (!messageContainer) return;

    const isSuccess = type === 'success';
    const bgColor = isSuccess ? 'bg-green-50' : 'bg-red-50';
    const textColor = isSuccess ? 'text-green-800' : 'text-red-800';
    const borderColor = isSuccess ? 'border-green-200' : 'border-red-200';
    const icon = isSuccess ? 'heroicons:check-circle' : 'heroicons:exclamation-triangle';

    messageContainer.innerHTML = `
      <div class="flex items-center p-4 rounded-lg border ${bgColor} ${borderColor}">
        <iconify-icon icon="${icon}" class="w-5 h-5 ${textColor} mr-3"></iconify-icon>
        <p class="${textColor} text-sm font-medium">${message}</p>
      </div>
    `;

    messageContainer.classList.remove('hidden');

    // Auto hide after 5 seconds
    setTimeout(() => {
      messageContainer.classList.add('hidden');
    }, 5000);
  }

  resetForm() {
    if (!this.form) return;

    this.form.reset();
    this.formData = {
      name: '',
      email: '',
      phone: '',
      company: '',
      message: ''
    };
    this.errors = {};
    this.hasAttemptedSubmit = false; // Reset submit attempt flag
    this.touchedFields = new Set(); // Reset touched fields
    
    // Clear validation timeouts
    if (this.validationTimeouts) {
      Object.values(this.validationTimeouts).forEach(timeout => clearTimeout(timeout));
      this.validationTimeouts = {};
    }

    // Clear all error displays
    Object.keys(this.formData).forEach(fieldName => {
      this.updateFieldError(fieldName);
    });
  }

  renderForm() {
    // This method can be used to dynamically render the form if needed
    // For now, we assume the form HTML is already in the page
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPhone(phone) {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }
}
