# Owl20 - Beyond20 to Owlbear Rodeo Bridge

A Browser extension that bridges Beyond20 dice roll data to Owlbear Rodeo iframes. This extension focuses purely on data transmission - it listens for Beyond20 events and passes the raw JSON data to iframes without any visual display.

> **For end users**: Visit [owl20.uberdragon.org](https://owl20.uberdragon.org) for installation instructions and setup guide.
>
> Chrome: [Web Store](https://chromewebstore.google.com/detail/owl20-beyond20-to-owlbear/lpogdhcmmpkmafhdlbonpfjfmgcilhjp) · Edge: [Add-ons](https://microsoftedge.microsoft.com/addons/detail/owl20-beyond20-to-owlbe/bofhilfebkhnchmngeaplaeodjobgdcf) · Firefox: [Add-ons](https://addons.mozilla.org/en-US/firefox/addon/owl20-beyond20-owlbear-bridge/)

## Architecture Overview

### Core Components

- **Owl20Bridge Class**: Main data bridge logic in `content.js`
- **Event Listeners**: Captures Beyond20 events (`Beyond20_RenderedRoll`, `Beyond20_Roll`, `Beyond20_Loaded`)
- **Iframe Detection**: Automatic scanning and monitoring via MutationObserver
- **Data Transmission**: Dual-mode communication (CustomEvent for same-origin, postMessage for cross-origin)

### Data Flow

```
D&D Beyond → Beyond20 Extension → Owl20 Bridge → Owlbear Rodeo Owl20 Iframes
```

1. **User makes roll** in D&D Beyond character sheet
2. **Beyond20 processes** the roll and sends it to custom domains
3. **Owl20 Bridge receives** the `Beyond20_RenderedRoll` or `Beyond20_Roll` event
4. **Bridge transmits** the raw roll data to all detected iframes

## Development Setup

### Prerequisites

- Chrome/Edge/Firefox browser
- Basic understanding of browser extensions and iframe communication
- Beyond20 extension for testing

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/uberdragon/owl20.git
   cd owl20
   ```

2. Load the extension in developer mode:
   - Open `chrome://extensions/` (or equivalent for your browser)
   - Enable "Developer mode"
   - Click "Load unpacked" and select the project directory

3. Configure Beyond20 for testing:
   - Add `https://www.owlbear.rodeo/*` to Beyond20's custom domains
   - Visit an Owlbear Rodeo session to test

## Technical Implementation

### Event Handling

The extension listens for these Beyond20 events:

```javascript
// Primary events captured
document.addEventListener('Beyond20_RenderedRoll', handleRoll);
document.addEventListener('Beyond20_Roll', handleRoll);
document.addEventListener('Beyond20_Loaded', handleLoaded);
```

### Iframe Communication

#### Same-Origin Iframes
Uses CustomEvent for direct communication:

```javascript
// Dispatch to same-origin iframes
const event = new CustomEvent('Beyond20_Roll', {
  detail: [rollData]
});
iframe.contentDocument.dispatchEvent(event);
```

#### Cross-Origin Iframes
Uses postMessage for cross-origin communication:

```javascript
// Send to cross-origin iframes
iframe.contentWindow.postMessage({
  type: 'Beyond20_Roll',
  data: rollData
}, '*');
```

### Message Format

#### CustomEvent (Same-Origin)
```javascript
// Event detail structure
{
  detail: [{
    character: 'Character Name',
    html: '<div>Roll HTML</div>',
    roll: {
      dice: '1d20',
      result: 15,
      total: 18
    },
    // ... other Beyond20 roll properties
  }]
}
```

#### PostMessage (Cross-Origin)
```javascript
// Message structure
{
  type: 'Beyond20_Roll',
  data: {
    character: 'Character Name',
    html: '<div>Roll HTML</div>',
    roll: {
      dice: '1d20',
      result: 15,
      total: 18
    },
    // ... other Beyond20 roll properties
  }
}
```

## Project Structure

```
owl20/
├── manifest.json          # Extension manifest (Manifest V3)
├── content.js             # Main content script (Owl20Bridge class)
├── icons/                 # Extension icons (16px to 128px)
│   ├── owl20-16.png
│   ├── owl20-24.png
│   ├── owl20-32.png
│   ├── owl20-48.png
│   ├── owl20-96.png
│   └── owl20-128.png
├── package.json           # NPM package configuration
├── README.md             # This file
└── docs/                 # Website documentation
    ├── index.html        # User-facing documentation
    ├── script.js         # Website functionality
    └── styles.css        # Website styling
```

## Key Classes and Methods

### Owl20Bridge Class

```javascript
class Owl20Bridge {
  constructor() {
    this.iframes = new Set();
    this.init();
  }
  
  // Core methods
  init()                    // Initialize event listeners
  scanForIframes()         // Scan page for iframes
  handleRoll(event)        // Process Beyond20 roll events
  transmitToIframes(data)  // Send data to all iframes
  isOwlbearIframe(iframe)  // Check if iframe is Owlbear-related
}
```

## Testing

### Manual Testing

1. **Setup Test Environment**:
   - Install Beyond20 extension
   - Configure Beyond20 with `https://www.owlbear.rodeo/*`
   - Load Owl20 extension in developer mode

2. **Test Scenarios**:
   - Same-origin iframe communication
   - Cross-origin iframe communication
   - Dynamic iframe detection
   - Multiple iframe handling
   - Error handling and edge cases

3. **Debug Tools**:
   - Browser DevTools Console
   - Extension DevTools
   - Network tab for postMessage debugging

### Integration Testing

Test with the [Owl20-Owlbear OBR Extension](https://github.com/mvoncken/owl20-owlbear):

1. Install both extensions
2. Create Owlbear Rodeo session
3. Enable Owl20 OBR extension in room
4. Make rolls from D&D Beyond character sheet
5. Verify data appears in Owlbear Rodeo

## Browser Compatibility

- **Chrome**: Manifest V3 support
- **Edge**: Chromium-based (full compatibility)
- **Firefox**: WebExtensions API
- **Other Chromium browsers**: Should work with Manifest V3 support

## Contributing

### Development Workflow

1. **Fork and Clone**:
   ```bash
   git clone https://github.com/your-username/owl20.git
   cd owl20
   ```

2. **Create Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**:
   - Follow existing code style
   - Add comments for complex logic
   - Test thoroughly with Beyond20 and Owlbear Rodeo

4. **Test Your Changes**:
   - Load extension in developer mode
   - Test all communication scenarios
   - Verify error handling

5. **Submit Pull Request**:
   - Clear description of changes
   - Reference any related issues
   - Include testing notes

### Code Style Guidelines

- Use meaningful variable and function names
- Add comments for complex iframe detection logic
- Follow existing event handling patterns
- Maintain backward compatibility with Beyond20 events

### Areas for Contribution

- **Performance**: Optimize iframe detection and scanning
- **Error Handling**: Improve edge case handling
- **Browser Support**: Add support for additional browsers
- **Testing**: Add automated test suite
- **Documentation**: Improve API documentation

## Troubleshooting Development Issues

### Common Development Problems

1. **Extension Not Loading**:
   - Check manifest.json syntax
   - Verify file paths in manifest
   - Check browser console for errors

2. **Events Not Firing**:
   - Verify Beyond20 is configured correctly
   - Check if you're on an Owlbear Rodeo page
   - Use console.log to debug event listeners

3. **Iframe Communication Issues**:
   - Check same-origin vs cross-origin
   - Verify iframe is fully loaded before sending messages
   - Use DevTools to inspect postMessage events

### Debugging Tools

- **Browser DevTools**: Console, Network, Sources tabs
- **Extension DevTools**: chrome://extensions/ → Details → Inspect views
- **Beyond20 Debug**: Check Beyond20 console messages
- **PostMessage Debug**: Monitor window message events

## License

MIT License - see LICENSE file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/uberdragon/owl20/issues)
- **User Documentation**: [owl20.uberdragon.org](https://owl20.uberdragon.org)
- **OBR Extension**: [Owl20-Owlbear Repository](https://github.com/mvoncken/owl20-owlbear)
