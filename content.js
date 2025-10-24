// Owl20 - Beyond20 to Owlbear Bridge
console.log('Owl20: Content script loaded');

class Owl20Bridge {
  constructor() {
    this.iframes = [];
    this.rollHistory = [];
    this.settings = {
      enabled: true,
      theme: 'dark',
      position: 'bottom-right',
      maxRolls: 50
    };
    this.init();
  }

  init() {
    console.log('Owl20: Initializing bridge');
    this.loadSettings();
    this.setupEventListeners();
    this.findIframes();
    this.createRollDisplay();
  }

  loadSettings() {
    chrome.storage.sync.get(['owl20Settings'], (result) => {
      if (result.owl20Settings) {
        this.settings = { ...this.settings, ...result.owl20Settings };
        console.log('Owl20: Settings loaded', this.settings);
      }
    });
  }

  setupEventListeners() {
    // Listen for Beyond20 custom events
    document.addEventListener('Beyond20_RenderedRoll', (event) => {
      console.log('Owl20: Received Beyond20 rendered roll', event.detail);
      if (event.detail && event.detail[0]) {
        this.handleBeyond20Roll(event.detail[0]);
      }
    });

    // Listen for Beyond20 roll events
    document.addEventListener('Beyond20_Roll', (event) => {
      console.log('Owl20: Received Beyond20 roll', event.detail);
      if (event.detail && event.detail[0]) {
        this.handleBeyond20Roll(event.detail[0]);
      }
    });

    // Listen for Beyond20 loaded event
    document.addEventListener('Beyond20_Loaded', () => {
      console.log('Owl20: Beyond20 detected and loaded');
    });

    // Listen for iframe changes
    this.observeIframes();

    // Listen for settings updates
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'updateSettings') {
        this.settings = { ...this.settings, ...request.settings };
        this.updateRollDisplay();
        sendResponse({ success: true });
      } else if (request.action === 'clearRolls') {
        this.clearRolls();
        sendResponse({ success: true });
      }
    });
  }

  observeIframes() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.tagName === 'IFRAME') {
              this.addIframe(node);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  findIframes() {
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => this.addIframe(iframe));
    console.log(`Owl20: Found ${iframes.length} iframes`);
  }

  addIframe(iframe) {
    if (this.iframes.includes(iframe)) return;
    
    this.iframes.push(iframe);
    console.log('Owl20: Added iframe', iframe.src);
    
    // Try to inject roll display into iframe
    this.injectIntoIframe(iframe);
  }

  injectIntoIframe(iframe) {
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      if (iframeDoc) {
        this.createIframeRollDisplay(iframeDoc);
      }
    } catch (error) {
      console.log('Owl20: Cannot access iframe (cross-origin)', error.message);
      // For cross-origin iframes, we'll use postMessage
      this.setupIframeMessaging(iframe);
    }
  }

  setupIframeMessaging(iframe) {
    // Set up message passing for cross-origin iframes
    iframe.addEventListener('load', () => {
      console.log('Owl20: Iframe loaded, setting up messaging');
    });
  }

  createIframeRollDisplay(iframeDoc) {
    // Create roll display inside iframe
    const rollContainer = iframeDoc.createElement('div');
    rollContainer.id = 'owl20-rolls';
    rollContainer.className = `owl20-rolls owl20-theme-${this.settings.theme}`;
    
    // Add to iframe
    iframeDoc.body.appendChild(rollContainer);
    
    // Inject styles
    this.injectIframeStyles(iframeDoc);
    
    console.log('Owl20: Created roll display in iframe');
  }

  injectIframeStyles(iframeDoc) {
    const style = iframeDoc.createElement('style');
    style.textContent = `
      .owl20-rolls {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 300px;
        max-height: 400px;
        overflow-y: auto;
        z-index: 10000;
        background: rgba(0, 0, 0, 0.9);
        border-radius: 8px;
        padding: 10px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }

      .owl20-roll {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        margin-bottom: 8px;
        padding: 12px;
        border-left: 4px solid #4CAF50;
        animation: slideIn 0.3s ease-out;
      }

      .owl20-roll-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.8);
      }

      .owl20-character-name {
        font-weight: bold;
        color: #4CAF50;
      }

      .owl20-roll-timestamp {
        font-size: 10px;
        color: rgba(255, 255, 255, 0.6);
      }

      .owl20-roll-content {
        font-size: 14px;
        line-height: 1.4;
      }

      .owl20-roll-content .beyond20-message {
        color: white;
      }

      .owl20-roll-content .beyond20-message * {
        color: inherit;
      }

      /* Hide non-functional buttons */
      .owl20-roll-content button,
      .owl20-roll-content .beyond20-message button,
      .owl20-roll-content input[type="button"],
      .owl20-roll-content input[type="submit"] {
        display: none !important;
      }

      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      /* Theme variations */
      .owl20-theme-light {
        background: rgba(255, 255, 255, 0.95);
        color: #333;
      }

      .owl20-theme-fantasy {
        background: rgba(139, 69, 19, 0.9);
        border: 2px solid #8B4513;
      }

      .owl20-theme-scifi {
        background: rgba(0, 100, 200, 0.9);
        border: 2px solid #0064C8;
      }

      .owl20-theme-horror {
        background: rgba(139, 0, 0, 0.9);
        border: 2px solid #8B0000;
      }
    `;
    iframeDoc.head.appendChild(style);
  }

  createRollDisplay() {
    // Create main roll display for the page
    this.rollDisplay = document.createElement('div');
    this.rollDisplay.id = 'owl20-main-rolls';
    this.rollDisplay.className = `owl20-main-rolls owl20-theme-${this.settings.theme}`;
    this.rollDisplay.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 300px;
      max-height: 400px;
      overflow-y: auto;
      z-index: 10000;
      background: rgba(0, 0, 0, 0.9);
      border-radius: 8px;
      padding: 10px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      display: none;
    `;
    
    document.body.appendChild(this.rollDisplay);
    this.injectMainStyles();
  }

  injectMainStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .owl20-main-rolls {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 300px;
        max-height: 400px;
        overflow-y: auto;
        z-index: 10000;
        background: rgba(0, 0, 0, 0.9);
        border-radius: 8px;
        padding: 10px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }

      .owl20-main-roll {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        margin-bottom: 8px;
        padding: 12px;
        border-left: 4px solid #4CAF50;
        animation: slideIn 0.3s ease-out;
      }

      .owl20-main-roll-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.8);
      }

      .owl20-main-character-name {
        font-weight: bold;
        color: #4CAF50;
      }

      .owl20-main-roll-timestamp {
        font-size: 10px;
        color: rgba(255, 255, 255, 0.6);
      }

      .owl20-main-roll-content {
        font-size: 14px;
        line-height: 1.4;
      }

      .owl20-main-roll-content .beyond20-message {
        color: white;
      }

      .owl20-main-roll-content .beyond20-message * {
        color: inherit;
      }

      /* Hide non-functional buttons */
      .owl20-main-roll-content button,
      .owl20-main-roll-content .beyond20-message button,
      .owl20-main-roll-content input[type="button"],
      .owl20-main-roll-content input[type="submit"] {
        display: none !important;
      }

      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      /* Theme variations */
      .owl20-theme-light {
        background: rgba(255, 255, 255, 0.95);
        color: #333;
      }

      .owl20-theme-fantasy {
        background: rgba(139, 69, 19, 0.9);
        border: 2px solid #8B4513;
      }

      .owl20-theme-scifi {
        background: rgba(0, 100, 200, 0.9);
        border: 2px solid #0064C8;
      }

      .owl20-theme-horror {
        background: rgba(139, 0, 0, 0.9);
        border: 2px solid #8B0000;
      }
    `;
    document.head.appendChild(style);
  }

  handleBeyond20Roll(rollData) {
    if (!this.settings.enabled) return;

    console.log('Owl20: Processing Beyond20 roll', rollData);
    
    // Create roll element
    const rollElement = this.createRollElement(rollData);
    
    // Add to main display
    this.rollDisplay.appendChild(rollElement);
    this.rollDisplay.style.display = 'block';
    
    // Add to history
    this.rollHistory.push({
      data: rollData,
      timestamp: Date.now(),
      element: rollElement
    });
    
    // Limit history
    if (this.rollHistory.length > this.settings.maxRolls) {
      const oldRoll = this.rollHistory.shift();
      if (oldRoll.element && oldRoll.element.parentNode) {
        oldRoll.element.parentNode.removeChild(oldRoll.element);
      }
    }
    
    // Send to all iframes
    this.sendToIframes(rollData, rollElement);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      if (rollElement.parentNode) {
        rollElement.style.opacity = '0.5';
      }
    }, 10000);
  }

  createRollElement(rollData) {
    const rollDiv = document.createElement('div');
    rollDiv.className = 'owl20-main-roll';
    
    const characterName = rollData.character || 'Unknown';
    const timestamp = new Date().toLocaleTimeString();
    
    rollDiv.innerHTML = `
      <div class="owl20-main-roll-header">
        <span class="owl20-main-character-name">${this.escapeHtml(characterName)}</span>
        <span class="owl20-main-roll-timestamp">${timestamp}</span>
      </div>
      <div class="owl20-main-roll-content">
        ${rollData.html || '<div class="roll-placeholder">Roll executed</div>'}
      </div>
    `;
    
    return rollDiv;
  }

  sendToIframes(rollData, rollElement) {
    this.iframes.forEach(iframe => {
      try {
        // Try direct access first
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        if (iframeDoc) {
          this.addRollToIframe(iframeDoc, rollData);
        }
      } catch (error) {
        // Cross-origin, use postMessage
        iframe.contentWindow.postMessage({
          type: 'OWL20_ROLL',
          data: rollData
        }, '*');
      }
    });
  }

  addRollToIframe(iframeDoc, rollData) {
    const rollContainer = iframeDoc.getElementById('owl20-rolls');
    if (rollContainer) {
      const rollElement = iframeDoc.createElement('div');
      rollElement.className = 'owl20-roll';
      
      const characterName = rollData.character || 'Unknown';
      const timestamp = new Date().toLocaleTimeString();
      
      rollElement.innerHTML = `
        <div class="owl20-roll-header">
          <span class="owl20-character-name">${this.escapeHtml(characterName)}</span>
          <span class="owl20-roll-timestamp">${timestamp}</span>
        </div>
        <div class="owl20-roll-content">
          ${rollData.html || '<div class="roll-placeholder">Roll executed</div>'}
        </div>
      `;
      
      rollContainer.appendChild(rollElement);
      
      // Auto-hide after 10 seconds
      setTimeout(() => {
        if (rollElement.parentNode) {
          rollElement.style.opacity = '0.5';
        }
      }, 10000);
    }
  }

  updateRollDisplay() {
    // Update theme for all displays
    const displays = document.querySelectorAll('.owl20-main-rolls, .owl20-rolls');
    displays.forEach(display => {
      display.className = display.className.replace(/owl20-theme-\w+/, `owl20-theme-${this.settings.theme}`);
    });
  }

  clearRolls() {
    // Clear main display
    this.rollDisplay.innerHTML = '';
    this.rollDisplay.style.display = 'none';
    
    // Clear iframe displays
    this.iframes.forEach(iframe => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        if (iframeDoc) {
          const rollContainer = iframeDoc.getElementById('owl20-rolls');
          if (rollContainer) {
            rollContainer.innerHTML = '';
          }
        }
      } catch (error) {
        // Cross-origin, use postMessage
        iframe.contentWindow.postMessage({
          type: 'OWL20_CLEAR'
        }, '*');
      }
    });
    
    // Clear history
    this.rollHistory = [];
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize the bridge
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.owl20Bridge = new Owl20Bridge();
  });
} else {
  window.owl20Bridge = new Owl20Bridge();
}
