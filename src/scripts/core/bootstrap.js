// Application Bootstrap
// Initializes and starts the TechCorp application

import { App } from './App.js';

/**
 * Bootstrap function to initialize the application
 */
function bootstrap() {
  console.log('🌟 Starting TechCorp Application Bootstrap...');
  
  try {
    // Create and initialize app instance
    const app = new App();
    
    // Start the application
    app.init();
    
    // Make app available globally for debugging
    if (typeof window !== 'undefined') {
      window.TechCorpApp = app;
    }
    
    console.log('🚀 Application bootstrap completed');
    return app;
    
  } catch (error) {
    console.error('❌ Application bootstrap failed:', error);
    throw error;
  }
}

// Auto-start the application
const app = bootstrap();

// Export the app instance
export default app;
