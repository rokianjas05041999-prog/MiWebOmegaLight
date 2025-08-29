// Component Configuration
// Mapping for component names and their variations

/**
 * Layout component mappings
 * Maps data-layout attribute values to actual component files
 */
export const LAYOUT_COMPONENTS = {
  'header': 'header',
  'footer': 'footer'
};

/**
 * Section component mappings  
 * Maps data-section attribute values to actual component files
 */
export const SECTION_COMPONENTS = {
  'hero': 'hero',
  'categories': 'categories',
  'about': 'about',
  'stats': 'stats',
  'gallery': 'gallery',
  'products': 'products',
  'blog': 'blog',
  'brands': 'brands',
  'testimonials': 'testimonials',
  'contact': 'contact',
  'team': 'team',
  'faqs': 'faqs',
  'detail-general': 'detail-general',
  'detail-category': 'detail-category',
  'detail-product': 'detail-product',
  'detail-article': 'detail-article',
  'detail-portfolio': 'detail-portfolio',
  'detail-team': 'detail-team',
  'detail-faq': 'detail-faq',
  'archive-product': 'archive-product',
  'archive-article': 'archive-article',
  'archive-category': 'archive-category',
  'archive-portfolio': 'archive-portfolio',
  'archive-team': 'archive-team',
  'archive-faqs': 'archive-faqs',
  'related-content': 'related-content'
};

/**
 * Component loading order
 * Components will be loaded in this order to handle dependencies
 */
export const COMPONENT_LOAD_ORDER = {
  layouts: ['header', 'footer'],
  sections: [
    'hero',
    'categories',
    'about',
    'stats',
    'gallery',
    'products',
    'blog',
    'brands',
    'testimonials',
    'team',
    'faqs',
    'contact'
  ]
};

/**
 * Get component name for layout
 * @param {string} layoutName - Layout name from data-layout
 */
export function getLayoutComponentName(layoutName) {
  return LAYOUT_COMPONENTS[layoutName] || `${layoutName}-simple`;
}

/**
 * Get component name for section
 * @param {string} sectionName - Section name from data-section  
 */
export function getSectionComponentName(sectionName) {
  return SECTION_COMPONENTS[sectionName] || `${sectionName}-simple`;
}

/**
 * Get all components that should be loaded for current page
 * Automatically detects from DOM elements
 */
export function getPageComponents() {
  const layouts = [];
  const sections = [];

  // Find layout components
  document.querySelectorAll('[data-layout]').forEach(element => {
    const layoutName = element.getAttribute('data-layout');
    if (layoutName && !layouts.includes(layoutName)) {
      layouts.push(layoutName);
    }
  });

  // Find section components  
  document.querySelectorAll('[data-section]').forEach(element => {
    const sectionName = element.getAttribute('data-section');
    if (sectionName && !sections.includes(sectionName)) {
      sections.push(sectionName);
    }
  });

  return { layouts, sections };
}

/**
 * Get component data from element attributes
 * @param {HTMLElement} element - Element with data-section or data-layout
 */
export function getComponentData(element) {
  const data = {};
  
  // Get all data-* attributes except data-section and data-layout
  Array.from(element.attributes).forEach(attr => {
    if (attr.name.startsWith('data-') && 
        !['data-section', 'data-layout'].includes(attr.name)) {
      // Convert data-attribute-name to attributeName
      const key = attr.name.replace('data-', '').replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      data[key] = attr.value;
    }
  });
  
  return data;
}

/**
 * Validate if component exists
 * @param {string} componentName - Component name to validate
 * @param {string} section - Component section (layouts/sections)
 */
export function validateComponent(componentName, section = 'sections') {
  // In a real implementation, you might check if the file exists
  // For now, we'll just validate against our known components
  const knownComponents = {
    layouts: Object.values(LAYOUT_COMPONENTS),
    sections: Object.values(SECTION_COMPONENTS)
  };
  
  return knownComponents[section]?.includes(componentName) || false;
}

/**
 * Get missing components
 * @param {Array} layouts - Layout components to check
 * @param {Array} sections - Section components to check
 */
export function getMissingComponents(layouts, sections) {
  const missing = {
    layouts: [],
    sections: []
  };
  
  layouts.forEach(layout => {
    const componentName = getLayoutComponentName(layout);
    if (!validateComponent(componentName, 'layouts')) {
      missing.layouts.push({ name: layout, component: componentName });
    }
  });
  
  sections.forEach(section => {
    const componentName = getSectionComponentName(section);
    if (!validateComponent(componentName, 'sections')) {
      missing.sections.push({ name: section, component: componentName });
    }
  });
  
  return missing;
}