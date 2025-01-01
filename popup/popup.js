let text_color = '#4a4a4a';
let text_size = '13px';

console.log('POPUP RUNNING');

const buttonClass = document.getElementsByClassName('font-size-buttons');
const textColorPicker = document.getElementById('textColorPicker');
const smallFontSize = document.querySelector('#small');
const mediumFontSize = document.querySelector('#medium');
const largeFontSize = document.querySelector('#large');
const reloadButton = document.querySelector('#reload');
const resetButton = document.querySelector('#reset');
// get font size and color data from background.js
chrome.runtime.sendMessage({ action: 'getFontDetails' }, (response) => {
    if (response) {
        console.log('current font size and color updated.');
        text_color = response.fontColor;
        text_size = response.fontSize;
        textColorPicker.value = text_color;
        if (text_size === "13px") {
            // medium
            mediumFontSize.style.backgroundColor = '#2d7459';
            smallFontSize.style.backgroundColor = '#66c6a1';
            largeFontSize.style.backgroundColor = '#66c6a1';
        } else if (text_size === "14px") {
            // large
            largeFontSize.style.backgroundColor = '#2d7459';
            smallFontSize.style.backgroundColor = '#66c6a1';
            mediumFontSize.style.backgroundColor = '#66c6a1';
        } else if (text_size === "12px") {
            // small
            smallFontSize.style.backgroundColor = '#2d7459';
            mediumFontSize.style.backgroundColor = '#66c6a1';
            largeFontSize.style.backgroundColor = '#66c6a1';
        }
    }
});

reloadButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
        chrome.tabs.reload(tabs[0].id);
    }
    });
});

resetButton.addEventListener("click", () => {
    text_color = '#4a4a4a';
    text_size = '13px';
    updateFontSize(text_size);
    updateFontColor(text_color);
});

smallFontSize.addEventListener('click', () => updateFontSize('12px'));
mediumFontSize.addEventListener('click', () => updateFontSize('13px'));
largeFontSize.addEventListener('click', () => updateFontSize('14px'));
textColorPicker.addEventListener('input', (event) => {
    updateFontColor(event.target.value);
});

function updateFontSize(fontSize) {
    text_size = fontSize;
    // update popup.html
    updateFontButton(fontSize);
    // update background.js
    console.log('fontSize', fontSize, 'text_color', text_color)
    const fontColor = text_color;
    chrome.runtime.sendMessage(
        { action: 'updateFontDetails', fontSize, fontColor},
        (response) => {
            console.log('Font size updated:', response);
        }
    );
}
function updateFontButton(fontSize) {
    smallFontSize.style.backgroundColor = '#66c6a1';
    mediumFontSize.style.backgroundColor = '#66c6a1';
    largeFontSize.style.backgroundColor = '#66c6a1';
    if (fontSize === '12px') {
        smallFontSize.style.backgroundColor = '#2d7459';
    } else if (fontSize === '13px') {
        mediumFontSize.style.backgroundColor = '#2d7459';
    } else if (fontSize === '14px') {
        largeFontSize.style.backgroundColor = '#2d7459';
    }
}

function updateFontColor(fontColor) {
    text_color = fontColor;
    textColorPicker.value = fontColor;
    const fontSize = text_size;
    chrome.runtime.sendMessage(
        { action: 'updateFontDetails', fontSize, fontColor },
        (response) => {
            console.log('Font color updated:', response);
        }
    );
}