// Owl20 - Background Script (Data Only)
console.log('Owl20: Background script loaded');

// Cross-browser compatibility: Use chrome API (auto-available in Chrome/Edge)
// or browser API (Firefox)
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

// Handle extension installation
browserAPI.runtime.onInstalled.addListener((details) => {
  console.log('Owl20: Extension installed/updated', details);
});

// Content script is automatically injected via manifest.json
// No need for manual injection in background script
