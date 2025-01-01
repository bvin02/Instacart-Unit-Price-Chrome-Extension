chrome.runtime.onInstalled.addListener(() => {
    console.log("Instacart Unit Price Extension Installed");
});

// Unit Price Display -- default style attributes
let fontSize = '13px';
let fontColor = '#4a4a4a';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getFontDetails') {
        // Send current font details to the sender
        setTimeout(() => {
            sendResponse({ fontSize, fontColor });
        }, 1000)
    } else if (message.action === 'updateFontDetails') {
        // Update the font details when requested by popup
        fontSize = message.fontSize;
        fontColor = message.fontColor;
        setTimeout(() => {
            console.log('Font updated to', message.fontSize, message.fontColor);
            sendResponse({ status: 'success' });
        }, 1000)
    }
    return true;
});