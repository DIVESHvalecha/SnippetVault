// Content script — injected into every page.
// Listens for Ctrl+Shift+S (Cmd+Shift+S on Mac) to trigger the popup
// with whatever text is currently selected.

document.addEventListener('keydown', async (e) => {
    const isMac = navigator.platform.toUpperCase().includes('MAC');
    const trigger = isMac
        ? e.metaKey && e.shiftKey && e.key === 'S'
        : e.ctrlKey && e.shiftKey && e.key === 'S';

    if (!trigger) return;

    const selected = window.getSelection()?.toString().trim();
    if (!selected) return;

    // Store selected text via background so popup can read it
    chrome.runtime.sendMessage({ type: 'STORE_CODE', code: selected });
});

// Listen for save triggers from background
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'STORE_CODE') {
        chrome.storage.session.set({ pendingCode: message.code });
    }
});
