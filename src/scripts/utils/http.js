// HTTP Utilities
// Helper functions untuk fetch requests

export class HttpUtils {
  /**
   * Fetch JSON dengan error handling
   */
  static async fetchJSON(url, options = {}) {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Fetch error:', error);
      return { success: false, data: null, error: error.message };
    }
  }

  /**
   * Fetch text dengan error handling
   */
  static async fetchText(url, options = {}) {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();
      return { success: true, data, error: null };
    } catch (error) {
      console.error('Fetch error:', error);
      return { success: false, data: null, error: error.message };
    }
  }

  /**
   * POST request dengan JSON
   */
  static async postJSON(url, data, options = {}) {
    return this.fetchJSON(url, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
  }

  /**
   * PUT request dengan JSON
   */
  static async putJSON(url, data, options = {}) {
    return this.fetchJSON(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options
    });
  }

  /**
   * DELETE request
   */
  static async deleteRequest(url, options = {}) {
    return this.fetchJSON(url, {
      method: 'DELETE',
      ...options
    });
  }

  /**
   * Upload file dengan progress
   */
  static async uploadFile(url, file, onProgress = null, options = {}) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();

      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            onProgress(percentComplete);
          }
        });
      }

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve({ success: true, data: response, error: null });
          } catch (error) {
            resolve({ success: true, data: xhr.responseText, error: null });
          }
        } else {
          reject({ success: false, data: null, error: `HTTP error! status: ${xhr.status}` });
        }
      });

      xhr.addEventListener('error', () => {
        reject({ success: false, data: null, error: 'Network error' });
      });

      xhr.open('POST', url);

      // Add custom headers
      if (options.headers) {
        Object.entries(options.headers).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value);
        });
      }

      xhr.send(formData);
    });
  }
}
