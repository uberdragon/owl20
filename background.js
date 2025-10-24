// Owl20 - Background Script
console.log('Owl20: Background script loaded');

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Owl20: Extension installed/updated', details);
  
  // Set default settings
  chrome.storage.sync.get(['owl20Settings'], (result) => {
    if (!result.owl20Settings) {
    const defaultSettings = {
      enabled: true,
      theme: 'dark',
      position: 'bottom-right',
      maxRolls: 50
    };
    chrome.storage.sync.set({ owl20Settings: defaultSettings });
  }
  });
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Owl20: Received message', request);
  
  switch (request.action) {
    case 'getSettings':
      chrome.storage.sync.get(['owl20Settings'], (result) => {
        sendResponse({ settings: result.owl20Settings || {} });
      });
      return true; // Keep message channel open for async response
      
    case 'updateSettings':
      chrome.storage.sync.set({ owl20Settings: request.settings }, () => {
        // Notify all Owlbear tabs about the settings update
        chrome.tabs.query({ url: 'https://www.owlbear.rodeo/*' }, (tabs) => {
          tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, { 
              action: 'updateSettings', 
              settings: request.settings 
            }).catch(err => {
              console.log('Owl20: Could not send settings to tab', tab.id, err);
            });
          });
        });
        sendResponse({ success: true });
      });
      return true;
      
    case 'clearRolls':
      // Clear rolls in all Owlbear tabs
      chrome.tabs.query({ url: 'https://www.owlbear.rodeo/*' }, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, { action: 'clearRolls' });
        });
      });
      sendResponse({ success: true });
      return true;
      
    default:
      sendResponse({ error: 'Unknown action' });
  }
});

// Handle tab updates to inject content script if needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('owlbear.rodeo')) {
    // Ensure content script is injected
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    }).catch(err => {
      console.log('Owl20: Content script already injected or error:', err);
    });
  }
});
