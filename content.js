// Owl20 - Beyond20 to Owlbear Bridge (Data Only)
console.log('Owl20: Content script loaded');

class Owl20Bridge {
  constructor() {
    this.iframes = [];
    this.init();
  }

  init() {
    console.log('Owl20: Initializing data bridge');
    this.setupEventListeners();
    this.findIframes();
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
  }

  handleBeyond20Roll(rollData) {
    console.log('Owl20: Processing Beyond20 roll data', rollData);
    
    // Send raw JSON data to all iframes
    this.sendToIframes(rollData);
  }

  sendToIframes(rollData) {
    this.iframes.forEach(iframe => {
      try {
        // Try direct access first (same-origin)
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        if (iframeDoc) {
          // Dispatch custom event in iframe with roll data
          const event = new CustomEvent('Beyond20_Roll', {
            detail: [rollData]
          });
          iframeDoc.dispatchEvent(event);
          console.log('Owl20: Sent roll data to same-origin iframe');
        }
      } catch (error) {
        // Cross-origin, use postMessage
        iframe.contentWindow.postMessage({
          type: 'Beyond20_Roll',
          data: rollData
        }, '*');
        console.log('Owl20: Sent roll data to cross-origin iframe via postMessage');
      }
    });
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
