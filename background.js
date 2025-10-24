// Owl20 - Background Script (Data Only)
console.log('Owl20: Background script loaded');

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Owl20: Extension installed/updated', details);
});

// Content script is automatically injected via manifest.json
// No need for manual injection in background script
