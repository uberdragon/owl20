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

      // Replay stored settings to the newly discovered iframe
      if (this.settings) {
        this.sendSettingsToIframe(iframe, this.settings);
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

  // Returns an array of warning objects for settings known to cause problems
  // with owl20. Each entry has a stable { id, message } shape so the Owlbear
  // extension can key on the ID rather than parsing text.
  // Returns [] if no issues are found.
  checkBrokenSettings(settings) {
    const warnings = [];

    if (!settings) return warnings;

    // Digital dice produce pre-rendered HTML without structured roll data;
    // owl20 receives the rendered result but the Owlbear extension may not be
    // able to parse dice details from it.
    if (settings['use-digital-dice'] === true) {
      warnings.push({
        id: 'digital-dice',
        message:
          'D&D Beyond Digital Dice is enabled. Roll data sent to Owlbear may be ' +
          'missing structured dice details. Disable Digital Dice in Beyond20 for ' +
          'best results.'
      });
    }

    // Whispered rolls are not dispatched to VTTs via the DOM API, so they will
    // never reach owl20 / the Owlbear extension.
    if (settings['whisper-type'] !== undefined && settings['whisper-type'] !== '0' && settings['whisper-type'] !== 0) {
      warnings.push({
        id: 'whisper-rolls',
        message:
          'Beyond20 "Whisper Rolls to GM" is enabled. Whispered rolls are not ' +
          'forwarded to VTTs and will not appear in Owlbear Rodeo.'
      });
    }

    // When Discord integration is active Beyond20 may redirect output away
    // from the page, bypassing the DOM events that owl20 listens to.
    if (settings['discord-channels'] !== null && settings['discord-channels'] !== undefined) {
      warnings.push({
        id: 'discord',
        message:
          'Beyond20 Discord integration is enabled. Some roll events may be ' +
          'redirected to Discord instead of the page, and may not reach Owlbear Rodeo.'
      });
    }

    return warnings;
  }

  // Send settings (and any broken-settings warnings) to a single iframe.
  sendSettingsToIframe(iframe, settings) {
    if (!this.isValidIframe(iframe) || !iframe.contentWindow) return;

    iframe.contentWindow.postMessage({
      type: 'Beyond20_Loaded',
      data: settings
    }, '*');
    console.log('Owl20: Sent Beyond20 settings to iframe');

    const warnings = this.checkBrokenSettings(settings);
    if (warnings.length > 0) {
      console.warn('Owl20: Known broken settings detected', warnings);
      iframe.contentWindow.postMessage({
        type: 'Beyond20_BrokenSettings',
        data: { warnings }
      }, '*');
    }
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
