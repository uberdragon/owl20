# Owl20 - Beyond20 to Owlbear Rodeo Bridge

A Chrome extension that bridges Beyond20 dice roll data to Owlbear Rodeo iframes. This extension focuses purely on data transmission - it listens for Beyond20 events and passes the raw JSON data to iframes without any visual display.

## Features

- **Beyond20 Integration**: Listens for Beyond20 roll events on Owlbear Rodeo pages
- **Iframe Support**: Automatically detects and passes data to all iframes on the page
- **Cross-Origin Handling**: Uses postMessage for cross-origin iframe communication
- **Same-Origin Support**: Uses CustomEvent for same-origin iframe communication
- **Data-Only Transmission**: No visual elements - purely passes JSON data
- **Minimal Permissions**: Only requires scripting permission and Owlbear host access

## How It Works

### Beyond20 Event Flow

1. **User makes roll** in D&D Beyond character sheet
2. **Beyond20 processes** the roll and sends it to custom domains
3. **Owl20 Bridge receives** the `Beyond20_RenderedRoll` or `Beyond20_Roll` event
4. **Bridge transmits** the raw roll data to:
   - All detected iframes on the page
   - Same-origin iframes via CustomEvent
   - Cross-origin iframes via postMessage

### Iframe Detection

The extension automatically:
- Scans for iframes when the page loads
- Monitors for new iframes added dynamically
- Passes roll data to owl20 iframe if detected

## Installation

### Development Installation

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select this directory
5. The extension will be installed and ready to use

### Production Installation

**Coming soon!** The extension has been submitted to:
- Chrome Web Store
- Microsoft Edge Add-ons
- Firefox Add-ons (AMO)

Once approved, it will be available for installation directly from your browser's extension store.

## Setup Instructions

### Step 1: Configure Beyond20

1. Open Beyond20 settings in your browser
2. Go to "Advanced Options"
3. Find "List of custom domains to load Beyond20"
4. Add `https://www.owlbear.rodeo/*` to the list
5. Save settings

### Step 2: Use the Extension

1. Open an Owlbear Rodeo session
2. Open a D&D Beyond character sheet in another tab
3. Make rolls using Beyond20 - the roll data will be transmitted to:
   - All iframes on the Owlbear Rodeo page
   - Same-origin iframes receive `Beyond20_Roll` custom events
   - Cross-origin iframes receive postMessage with roll data

### Owl20-Owlbear
This extension requires the Owl20-Owlbear extension be installed AND toggled on in the Owlbear Rodeo Room.

## Data Format

### Same-Origin Iframes
Receive a `Beyond20_Roll` custom event:
```javascript
document.addEventListener('Beyond20_Roll', (event) => {
  const rollData = event.detail[0]; // Raw Beyond20 roll data
  // Process the roll data as needed
});
```

### Cross-Origin Iframes
Receive postMessage events:
```javascript
window.addEventListener('message', (event) => {
  if (event.data.type === 'Beyond20_Roll') {
    const rollData = event.data.data; // Raw Beyond20 roll data
    // Process the roll data as needed
  }
});
```

## Technical Details

### Event Listening

The extension listens for these Beyond20 events:
- `Beyond20_RenderedRoll`: Pre-rendered roll HTML from Beyond20
- `Beyond20_Roll`: Raw roll data
- `Beyond20_Loaded`: Beyond20 initialization complete

### Iframe Handling

- **Same-origin iframes**: CustomEvent dispatch with roll data
- **Cross-origin iframes**: postMessage communication
- **Dynamic iframes**: MutationObserver for detection

### Message Format

```javascript
// Sent to cross-origin iframes
{
  type: 'Beyond20_Roll',
  data: {
    // Raw Beyond20 roll data object
    character: 'Character Name',
    html: '<div>Roll HTML</div>',
    // ... other roll data properties
  }
}
```

## Development

### Project Structure

```
owl20/
├── manifest.json          # Extension manifest
├── content.js             # Main content script (data bridge)
├── icons/                 # Extension icons
├── .gitignore            # Git ignore file
├── package.json          # NPM package configuration
└── README.md             # This file
```

### Key Components

- **Owl20Bridge Class**: Main data bridge logic
- **Iframe Detection**: Automatic iframe scanning
- **Event Handling**: Beyond20 event listeners
- **Data Transmission**: CustomEvent and postMessage handling

## Troubleshooting

### Data Not Transmitting

1. Verify Beyond20 is configured with `https://www.owlbear.rodeo/*` in custom domains
2. Check that the extension is enabled
3. Reload the Owlbear Rodeo page
4. Check browser console for error messages

### Iframes Not Receiving Data

1. Check if iframes are cross-origin (use postMessage listener)
2. Verify iframes are loading properly
3. Check console for postMessage errors
4. Ensure iframes are listening for the correct events

### Extension Not Working

1. Ensure you're on an Owlbear Rodeo page (`https://www.owlbear.rodeo/*`)
2. Check that the extension has the necessary permissions
3. Try reloading the extension in `chrome://extensions/`

## Browser Compatibility

- Chrome (Manifest V3)
- Edge (Chromium-based)
- Other Chromium-based browsers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with Beyond20 and Owlbear Rodeo
5. Submit a pull request

## Support

For issues and feature requests, please create an issue in the [GitHub repository](https://github.com/uberdragon/owl20/issues).

## License

MIT License - feel free to modify and distribute!
