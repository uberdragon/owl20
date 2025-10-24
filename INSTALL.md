# Owl20 Installation Guide

## Quick Start

### 1. Install the Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `owl20` folder
5. The extension should now appear in your extensions list

### 2. Configure Beyond20

1. Open Beyond20 settings (click the Beyond20 icon in your browser toolbar)
2. Go to "More Options" or "Advanced Options"
3. Find "List of custom domains to load Beyond20"
4. Add this line: `https://www.owlbear.rodeo/*`
5. Save settings

### 3. Test the Integration

1. Open an Owlbear Rodeo session
2. Open a D&D Beyond character sheet in another tab
3. Make a roll using Beyond20 (click any dice button)
4. The roll should appear in:
   - The main Owlbear Rodeo page
   - Any iframes on the page

## How It Works

### Beyond20 Event Flow

1. **User makes roll** in D&D Beyond character sheet
2. **Beyond20 processes** the roll and sends it to custom domains
3. **Owl20 Bridge receives** the `Beyond20_RenderedRoll` event
4. **Bridge displays** the roll in:
   - Main Owlbear Rodeo page (bottom-right corner)
   - All detected iframes on the page
   - Cross-origin iframes via postMessage

### Iframe Detection

The extension automatically:
- Scans for iframes when the page loads
- Monitors for new iframes added dynamically
- Injects roll displays into accessible iframes
- Uses postMessage for cross-origin iframes

## Configuration Options

Click the extension icon to open settings:

- **Enable Bridge**: Toggle the extension on/off
- **Theme**: Choose from Dark, Light, Fantasy, Sci-Fi, or Horror themes
- **Max Rolls**: Maximum number of rolls to keep in history (5-200)
- **Clear All Rolls**: Remove all rolls from displays

## Troubleshooting

### Rolls Not Appearing

1. **Check Beyond20 Configuration**:
   - Verify Beyond20 is configured with `https://www.owlbear.rodeo/*` in custom domains
   - Make sure Beyond20 is working (try rolling in Roll20 or Foundry first)

2. **Check Extension Status**:
   - Ensure the extension is enabled in `chrome://extensions/`
   - Check that you're on an Owlbear Rodeo page (`https://www.owlbear.rodeo/*`)

3. **Check Console**:
   - Open browser console (F12 → Console)
   - Look for "Owl20:" messages
   - Check for any error messages

### Iframes Not Working

1. **Cross-Origin Limitation**:
   - Some iframes may be cross-origin and cannot be directly modified
   - The extension will use postMessage for these iframes
   - This is expected behavior for security reasons

2. **Iframe Detection**:
   - The extension automatically detects iframes
   - Check console for "Owl20: Found X iframes" message
   - If no iframes are detected, there may not be any on the page

### Extension Not Working

1. **Permissions**:
   - Ensure the extension has permission to run on Owlbear Rodeo
   - Check `chrome://extensions/` for any permission issues

2. **Reload**:
   - Try reloading the extension in `chrome://extensions/`
   - Reload the Owlbear Rodeo page
   - Restart Chrome if needed

## Advanced Usage

### Custom Themes

You can modify the CSS in `content.js` to create custom themes:

```javascript
// Add to injectMainStyles() or injectIframeStyles()
.owl20-theme-custom {
  background: rgba(255, 0, 255, 0.9);
  border: 2px solid #FF00FF;
}
```

### Message Format

For cross-origin iframe communication, the extension sends:

```javascript
{
  type: 'OWL20_ROLL',
  data: {
    character: 'Character Name',
    html: '<div>Roll HTML</div>',
    timestamp: Date.now()
  }
}
```

## Need Help?

If you're having issues:

1. Check the browser console for error messages (F12 → Console)
2. Verify all setup steps were completed correctly
3. Try reloading both the extension and the Owlbear Rodeo page
4. Create an issue in the GitHub repository with details about your problem

## Features

- ✅ **Real-time Roll Display**: Shows Beyond20 rolls instantly
- ✅ **Iframe Support**: Works with iframes on the page
- ✅ **Cross-Origin Handling**: Uses postMessage for cross-origin iframes
- ✅ **Multiple Themes**: 5 different visual themes
- ✅ **Persistent History**: Maintains roll history
- ✅ **Clean Interface**: Removes non-functional buttons
- ✅ **Auto-Detection**: Automatically finds and injects into iframes
