const BASE_URL = 'http://localhost:8080';

// ─── Context Menu Setup ────────────────────────────────────────────────────────

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'save-snippet',
        title: 'Save to Snippet Vault',
        contexts: ['selection'],
    });
});

// ─── Context Menu Click ────────────────────────────────────────────────────────

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId !== 'save-snippet') return;

    const selectedText = info.selectionText?.trim();
    if (!selectedText) return;

    // Store the selected text so popup can read it immediately on open
    await chrome.storage.session.set({ pendingCode: selectedText });

    // Open the popup (works in MV3 by opening the extension popup page)
    chrome.action.openPopup().catch(() => {
        // openPopup() may fail in some contexts — fallback: open as a new tab
        chrome.tabs.create({
            url: chrome.runtime.getURL('popup/popup.html')
        });
    });
});

// ─── Message Listener (from content script) ────────────────────────────────────

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'GET_PENDING_CODE') {
        chrome.storage.session.get('pendingCode').then(({ pendingCode }) => {
            sendResponse({ code: pendingCode || '' });
            // Clear after reading so it does not persist across opens
            chrome.storage.session.remove('pendingCode');
        });
        return true; // keep channel open for async response
    }
});
