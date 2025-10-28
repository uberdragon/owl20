# Creating the Open Graph Image

The Open Graph image is displayed when the site is shared on Discord, Twitter, and other social platforms.

## Current Setup

I've created an HTML template (`og-image.html`) that matches your site's design. You need to capture this as a PNG image.

## Option 1: Screenshot (Quickest)

1. Open `og-image.html` in your browser
2. Take a screenshot using a tool like:
   - Windows Snipping Tool / Snip & Sketch
   - Browser extension (Full Page Screen Capture, etc.)
3. Save as `og-image.png` in the `docs` folder
4. The image should be 1200x630 pixels

## Option 2: Automated

Use a service like:
- https://splashify.com/
- https://github.com/vercel/og-image (if you want to set up your own)
- Any headless browser screenshot tool (Puppeteer, Playwright)

## Update Meta Tags

Once you have `og-image.png`, update the meta tags in `index.html`:

```html
<meta property="og:image" content="https://owl20.uberdragon.org/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:image" content="https://owl20.uberdragon.org/og-image.png">
```

