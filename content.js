// Prevent multiple class declarations
if (typeof window.Owl20Bridge === 'undefined') {
  window.Owl20Bridge = class Owl20Bridge {
  constructor() {
    this.iframes = [];
    this.settings = null;
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

    // Listen for Beyond20 loaded event - fired when Beyond20 extension is active.
    // Iframes almost never exist this early, so we store settings and push them
    // to each iframe as it is added.
    document.addEventListener('Beyond20_Loaded', (event) => {
      const settings = event.detail && event.detail[0] ? event.detail[0] : null;
      console.log('Owl20: Beyond20 detected and loaded', settings);
      this.settings = settings;
      // Iframes are unlikely to exist yet, but push to any that already do
      if (settings) {
        this.sendSettingsToIframes(settings);
      }
    });

    // Listen for Beyond20 settings changes - fired when the user updates settings.
    // Iframes are running by this point, so push immediately.
    document.addEventListener('Beyond20_NewSettings', (event) => {
      const settings = event.detail && event.detail[0] ? event.detail[0] : null;
      console.log('Owl20: Beyond20 settings updated', settings);
      this.settings = settings;
      if (settings) {
        this.sendSettingsToIframes(settings);
      }
    });

    // Listen for iframe changes
    this.observeIframes();
  }

  observeIframes() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // Handle added iframes
          mutation.addedNodes.forEach((node) => {
            if (node.tagName === 'IFRAME') {
              this.addIframe(node);
            }
          });
          // Handle removed iframes
          mutation.removedNodes.forEach((node) => {
            if (node.tagName === 'IFRAME') {
              this.removeIframe(node);
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
  }

  addIframe(iframe) {
    if (this.iframes.includes(iframe)) return;

    // Only add iframes that contain "owl20" or "localhost" in their URL
    if (this.shouldIncludeIframe(iframe)) {
      this.iframes.push(iframe);
      console.log('Owl20: Found iframe to owl20-owlbear', iframe.src);

      if (this.settings) {
        // Send immediately in case the iframe is already loaded, and also on
        // the load event to handle slow machines where the iframe isn't ready yet.
        this.sendSettingsToIframe(iframe, this.settings);
        iframe.addEventListener('load', () => this.sendSettingsToIframe(iframe, this.settings));
      }
    }
  }

  removeIframe(iframe) {
    const index = this.iframes.indexOf(iframe);
    if (index > -1) {
      this.iframes.splice(index, 1);
      console.log('Owl20: Removed stale iframe reference', iframe.src);
    }
  }

  isValidIframe(iframe) {
    // Check if iframe exists and has a valid contentWindow
    return iframe && iframe.contentWindow !== null;
  }

  shouldIncludeIframe(iframe) {
    const url = iframe.src || '';
    return url.includes('owl20') || url.includes('localhost');
  }

  handleBeyond20Roll(rollData) {
    this.sendToIframes(rollData);
  }

  sendSettingsToIframe(iframe, settings) {
    if (!this.isValidIframe(iframe) || !iframe.contentWindow) return;

    iframe.contentWindow.postMessage({
      type: 'Beyond20_Loaded',
      data: settings
    }, '*');
    console.log('Owl20: Sent Beyond20 settings to iframe');
  }

  // Send settings to all tracked iframes.
  sendSettingsToIframes(settings) {
    this.iframes = this.iframes.filter(iframe => this.isValidIframe(iframe));
    this.iframes.forEach(iframe => this.sendSettingsToIframe(iframe, settings));
  }

  sendToIframes(rollData) {
    // Clean up stale iframe references before sending
    this.iframes = this.iframes.filter(iframe => this.isValidIframe(iframe));

    for (let i = this.iframes.length - 1; i >= 0; i--) {
      const iframe = this.iframes[i];

      // Validate iframe before attempting to use it
      if (!this.isValidIframe(iframe)) {
        this.removeIframe(iframe);
        continue;
      }

      if (iframe.contentWindow) {
        iframe.contentWindow.postMessage({
          type: 'Beyond20_Roll',
          data: rollData
        }, '*');
        console.log('Owl20: Sent roll data to Owl20 iframe via postMessage');
      } else {
        // contentWindow is null, remove the iframe
        this.removeIframe(iframe);
      }
    }
  }
  };
}

// Initialize the bridge (prevent multiple initializations)
if (!window.owl20Bridge) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (!window.owl20Bridge) {
        window.owl20Bridge = new window.Owl20Bridge();
      }
    });
  } else {
    window.owl20Bridge = new window.Owl20Bridge();
  }
}
