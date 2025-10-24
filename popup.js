// Owl20 - Popup Script
document.addEventListener('DOMContentLoaded', () => {
  const enabledToggle = document.getElementById('enabled');
  const themeSelect = document.getElementById('theme');
  const maxRollsInput = document.getElementById('maxRolls');
  const saveButton = document.getElementById('saveSettings');
  const clearButton = document.getElementById('clearRolls');
  const statusDiv = document.getElementById('status');

  // Load current settings
  loadSettings();

  // Event listeners
  enabledToggle.addEventListener('click', toggleEnabled);
  saveButton.addEventListener('click', saveSettings);
  clearButton.addEventListener('click', clearRolls);

  function loadSettings() {
    chrome.runtime.sendMessage({ action: 'getSettings' }, (response) => {
      if (response && response.settings) {
        const settings = response.settings;
        
        // Update UI with current settings
        enabledToggle.classList.toggle('active', settings.enabled !== false);
        themeSelect.value = settings.theme || 'dark';
        maxRollsInput.value = settings.maxRolls || 50;
      }
    });
  }

  function toggleEnabled() {
    enabledToggle.classList.toggle('active');
  }

  function saveSettings() {
    const settings = {
      enabled: enabledToggle.classList.contains('active'),
      theme: themeSelect.value,
      maxRolls: parseInt(maxRollsInput.value)
    };

    chrome.runtime.sendMessage({ 
      action: 'updateSettings', 
      settings: settings 
    }, (response) => {
      if (response && response.success) {
        showStatus('Settings saved successfully!', 'success');
      } else {
        showStatus('Failed to save settings', 'error');
      }
    });
  }

  function clearRolls() {
    chrome.runtime.sendMessage({ action: 'clearRolls' }, (response) => {
      if (response && response.success) {
        showStatus('All rolls cleared!', 'success');
      } else {
        showStatus('Failed to clear rolls', 'error');
      }
    });
  }

  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
    
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 3000);
  }
});
