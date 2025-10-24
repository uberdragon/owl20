# Owl20 - Beyond20 to Owlbear Rodeo Bridge

A Chrome extension that bridges Beyond20 dice rolls to Owlbear Rodeo, displaying roll results in both the main page and any iframes on the page.

## Features

- **Beyond20 Integration**: Listens for Beyond20 roll events on Owlbear Rodeo pages
- **Iframe Support**: Automatically detects and injects roll displays into iframes
- **Cross-Origin Handling**: Uses postMessage for cross-origin iframe communication
- **Multiple Themes**: Dark, Light, Fantasy, Sci-Fi, and Horror themes
- **Real-time Display**: Shows rolls instantly as they happen
- **Persistent History**: Maintains roll history with configurable limits
- **Clean Interface**: Removes non-functional buttons from Beyond20 displays

## How It Works

### Beyond20 Event Flow

1. **User makes roll** in D&D Beyond character sheet
2. **Beyond20 processes** the roll and sends it to custom domains
3. **Owl20 Bridge receives** the `Beyond20_RenderedRoll` or `Beyond20_Roll` event
4. **Bridge displays** the roll in:
   - Main Owlbear Rodeo page
   - All detected iframes on the page
   - Cross-origin iframes via postMessage

### Iframe Detection

The extension automatically:
- Scans for iframes when the page loads
- Monitors for new iframes added dynamically
- Injects roll displays into accessible iframes
- Uses postMessage for cross-origin iframes

## Installation

### Development Installation

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select this directory
5. The extension will be installed and ready to use

### Production Installation

*Coming soon - will be available on the Chrome Web Store*

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
3. Make rolls using Beyond20 - they will appear in:
   - The main Owlbear Rodeo page
   - Any iframes on the page
4. All participants will see the rolls in real-time

## Configuration

Click the extension icon to open the settings popup where you can configure:

- **Enable Bridge**: Toggle the extension on/off
- **Theme**: Choose from Dark, Light, Fantasy, Sci-Fi, or Horror themes
- **Max Rolls**: Maximum number of rolls to keep in history (5-200)
- **Clear All Rolls**: Remove all rolls from displays

## Technical Details

### Event Listening

The extension listens for these Beyond20 events:
- `Beyond20_RenderedRoll`: Pre-rendered roll HTML from Beyond20
- `Beyond20_Roll`: Raw roll data
- `Beyond20_Loaded`: Beyond20 initialization complete

### Iframe Handling

- **Same-origin iframes**: Direct DOM manipulation
- **Cross-origin iframes**: postMessage communication
- **Dynamic iframes**: MutationObserver for detection

### Message Format

```javascript
// Sent to cross-origin iframes
{
  type: 'OWL20_ROLL',
  data: {
    character: 'Character Name',
    html: '<div>Roll HTML</div>',
    // ... other roll data
  }
}
```

## Development

### Project Structure

```
owl20/
├── manifest.json          # Extension manifest
├── content.js             # Main content script
├── background.js          # Background service worker
├── popup.html             # Settings popup HTML
├── popup.js               # Settings popup script
├── icons/                 # Extension icons
└── README.md              # This file
```

### Key Components

- **Owl20Bridge Class**: Main bridge logic
- **Iframe Detection**: Automatic iframe scanning and injection
- **Event Handling**: Beyond20 event listeners
- **Theme System**: Multiple visual themes
- **Settings Management**: Chrome storage integration

## Troubleshooting

### Rolls Not Appearing

1. Verify Beyond20 is configured with `https://www.owlbear.rodeo/*` in custom domains
2. Check that the extension is enabled
3. Reload the Owlbear Rodeo page
4. Check browser console for error messages

### Iframes Not Working

1. Check if iframes are cross-origin (expected limitation)
2. Verify iframes are loading properly
3. Check console for postMessage errors

### Extension Not Working

1. Ensure you're on an Owlbear Rodeo page (`https://www.owlbear.rodeo/*`)
2. Check that the extension has the necessary permissions
3. Try reloading the extension in `chrome://extensions/`

## Browser Compatibility

- Chrome (Manifest V3)
- Edge (Chromium-based)
- Other Chromium-based browsers

## License

MIT License - feel free to modify and distribute!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and feature requests, please create an issue in the GitHub repository.
