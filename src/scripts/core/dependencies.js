// Core Dependencies
// Imports all necessary dependencies for the application

// External libraries
import 'iconify-icon';

// Core utilities
import { DOMUtils } from '../utils/dom.js';
import { StorageUtils } from '../utils/storage.js';
import { HttpUtils } from '../utils/http.js';

// Make utilities available globally for convenience
if (typeof window !== 'undefined') {
  window.DOMUtils = DOMUtils;
  window.StorageUtils = StorageUtils;
  window.HttpUtils = HttpUtils;
}

export {
  DOMUtils,
  StorageUtils,
  HttpUtils
};
