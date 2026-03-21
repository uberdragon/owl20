# Owl20 - Beyond20 to Owlbear Rodeo Bridge

A Browser extension that bridges Beyond20 dice roll data to Owlbear Rodeo iframes. This extension focuses purely on data transmission - it listens for Beyond20 events and passes the raw JSON data to iframes without any visual display.

> **For end users**: Visit [owl20.uberdragon.org](https://owl20.uberdragon.org) for installation instructions and setup guide.
>
> Chrome: [Web Store](https://chromewebstore.google.com/detail/owl20-beyond20-to-owlbear/lpogdhcmmpkmafhdlbonpfjfmgcilhjp) · Edge: [Add-ons](https://microsoftedge.microsoft.com/addons/detail/owl20-beyond20-to-owlbe/bofhilfebkhnchmngeaplaeodjobgdcf) · Firefox: [Add-ons](https://addons.mozilla.org/en-US/firefox/addon/owl20-beyond20-owlbear-bridge/)

## Architecture Overview

### Core Components

- **Owl20Bridge Class**: Main data bridge logic in `content.js`
- **Event Listeners**: Captures Beyond20 events (`Beyond20_RenderedRoll`, `Beyond20_Roll`, `Beyond20_Loaded`, `Beyond20_NewSettings`)
- **Iframe Detection**: Automatic scanning and monitoring via MutationObserver
- **Data Transmission**: Cross-origin iframe communication via postMessage

### Data Flow

```
D&D Beyond → Beyond20 Extension → Owl20 Bridge → Owlbear Rodeo Owl20 Iframes
```

1. **User makes roll** in D&D Beyond character sheet
2. **Beyond20 processes** the roll and sends it to custom domains
3. **Owl20 Bridge receives** the `Beyond20_RenderedRoll` or `Beyond20_Roll` event
4. **Bridge transmits** the raw roll data to all detected iframes

### Settings Flow

```
Beyond20 Extension → Beyond20_Loaded / Beyond20_NewSettings → Owl20 Bridge → Owlbear Iframes
```

Because `Beyond20_Loaded` fires before iframes exist, the bridge caches settings and replays them to each iframe as it is discovered. When settings change, `Beyond20_NewSettings` pushes the update to all live iframes immediately. If any settings are known to cause problems with the bridge, a `Beyond20_BrokenSettings` message is also sent so the Owlbear extension can surface a warning to the user.

## Website Features

The Owl20 documentation website ([owl20.uberdragon.org](https://owl20.uberdragon.org)) features an immersive space-themed design:

- **Twinkling Star Background**: Animated starfield with 170 stars that randomly twinkle and glow
- **Floating Container Animation**: The main content container gently floats in space with subtle circular motions
- **Modern UI**: Clean, accessible design with smooth animations
- **Accessibility**: All animations respect `prefers-reduced-motion` settings

The starfield is implemented using pure CSS and JavaScript for optimal performance.

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
document.addEventListener('Beyond20_RenderedRoll', handleRoll);
document.addEventListener('Beyond20_Roll', handleRoll);
document.addEventListener('Beyond20_Loaded', handleLoaded);     // caches settings
document.addEventListener('Beyond20_NewSettings', handleSettings); // pushes to iframes
```

### Iframe Communication

Uses postMessage for cross-origin iframe communication:

```javascript
iframe.contentWindow.postMessage({ type, data }, '*');
```

### Message Types Sent to Iframes

| `type` | `data` | When |
|---|---|---|
| `Beyond20_Roll` | Beyond20 roll object | On every roll event |
| `Beyond20_Loaded` | Beyond20 settings object | When iframe is discovered and settings are known, or on `NewSettings` |
| `Beyond20_BrokenSettings` | `{ warnings: string[] }` | When a known-bad setting is detected |

#### Roll message example

```javascript
{
  type: 'Beyond20_Roll',
  data: {
    character: 'Character Name',
    html: '<div>Roll HTML</div>',
    roll: { dice: '1d20', result: 15, total: 18 },
    // ... other Beyond20 roll properties
  }
}
```

#### Settings message example

```javascript
{ type: 'Beyond20_Loaded', data: { /* Beyond20 settings object */ } }
```

#### Broken settings warning example

```javascript
{
  type: 'Beyond20_BrokenSettings',
  data: {
    warnings: [
      { id: 'digital-dice',  message: 'D&D Beyond Digital Dice is enabled...' },
      { id: 'whisper-rolls', message: 'Beyond20 "Whisper Rolls to GM" is enabled...' },
      { id: 'discord',       message: 'Beyond20 Discord integration is enabled...' }
    ]
  }
}
```

Each warning carries a stable `id` (kebab-case) so the receiving extension can key on it without parsing text, and a human-readable `message` for display.

### Known Broken Settings

The bridge detects the following Beyond20 settings as incompatible and sends a `Beyond20_BrokenSettings` warning:

| ID | Setting | Reason |
|---|---|---|
| `digital-dice` | Digital Dice enabled | Roll data may lack structured dice details |
| `whisper-rolls` | Whisper Rolls to GM | Whispered rolls are not forwarded to VTTs |
| `discord` | Discord integration enabled | Some roll events may be redirected away from the page |

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
├── README.md             # This file
└── docs/                      # Website documentation
    ├── index.html             # User-facing documentation
    ├── about.html
    ├── faq.html
    ├── privacy.html
    ├── header-template.html   # Single source of truth for site header/nav (injected at deploy)
    ├── css/
    │   ├── styles.css         # Main website styling
    │   └── starfield.css      # Twinkling star background styles
    └── js/
        ├── header.js          # Header active-state enhancement
        ├── script.js          # Website functionality
        └── starfield.js       # Animated starfield implementation
```

## Key Classes and Methods

### Owl20Bridge Class

```javascript
class Owl20Bridge {
  constructor() {
    this.iframes  = [];
    this.settings = null;   // cached Beyond20 settings
    this.init();
  }

  // Lifecycle
  init()                         // Initialize event listeners and find iframes
  setupEventListeners()          // Set up Beyond20 event listeners

  // Iframe management
  observeIframes()               // Watch for iframe changes via MutationObserver
  findIframes()                  // Find existing iframes on page
  addIframe(iframe)              // Add iframe; replays cached settings if available
  removeIframe(iframe)           // Remove iframe from tracking array
  isValidIframe(iframe)          // Validate iframe before use
  shouldIncludeIframe(iframe)    // Check if iframe URL matches owl20/localhost

  // Roll forwarding
  handleBeyond20Roll(rollData)   // Process Beyond20 roll events
  sendToIframes(rollData)        // Send roll data to all valid iframes

  // Settings forwarding
  sendSettingsToIframe(iframe, settings)  // Push settings (+ warnings) to one iframe
  sendSettingsToIframes(settings)         // Push settings to all tracked iframes

  // Broken settings detection
  checkBrokenSettings(settings)  // Returns string[] of warnings for bad settings
}
```

## Testing

### Manual Testing

1. **Setup Test Environment**:
   - Install Beyond20 extension
   - Configure Beyond20 with `https://www.owlbear.rodeo/*`
   - Load Owl20 extension in developer mode

2. **Test Scenarios**:
   - Cross-origin iframe communication via postMessage
   - Dynamic iframe detection and removal
   - Multiple iframe handling
   - Scene changes in Owlbear (iframe replacement)
   - Error handling and edge cases (null contentWindow, stale references)
   - Settings replay: load the page with Beyond20 already active, then open Owlbear — iframe should receive `Beyond20_Loaded` with settings
   - Settings update: change a Beyond20 setting while Owlbear is open — iframe should receive the new settings
   - Broken settings: enable Digital Dice or Whisper mode — iframe should receive `Beyond20_BrokenSettings` with warnings

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
   - Verify iframe is fully loaded before sending messages
   - Check for stale iframe references (especially after Owlbear scene changes)
   - Use DevTools to inspect postMessage events
   - Check console for "Removing invalid Owl20 iframe" warnings

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
