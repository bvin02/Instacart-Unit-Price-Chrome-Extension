console.log("Instacart website detected."); // content.js only runs when "matches": ["https://*.instacart.com/*"]

// Unit Price Display -- default style attributes
const BUTTON_BORDER = 'none';
const BUTTON_BORDER_RADIUS = '12px';
const BUTTON_PADDING = '5px 10px';
const BUTTON_CURSOR = 'text';
let BUTTON_FONT_SIZE = '13px';
let BUTTON_COLOR = '#4a4a4a';

// Get the current font details from background.js
chrome.runtime.sendMessage({ action: 'getFontDetails' }, (response) => {
    if (response) {
        console.log('current font size and color updated.');
        BUTTON_FONT_SIZE = response.fontSize;
        BUTTON_COLOR = response.fontColor;
    }
});

runExtension()

// check if the page is changed because that deletes the cart button and its listener
let currentUrl = window.location.href;
setInterval(() => {
    if (window.location.href !== currentUrl) {
        console.log('URL changed to:', window.location.href, '\nRunning extension code again...');
        currentUrl = window.location.href;
        runExtension()
    }
}, 1000);


function runExtension() {
    // Search for the Cart Button responsible for dynamically generating cart pop-up
    // Cart Button has a dynamically generated class name
    // General location of the Cart Button:
        //    <header id="commonHeader" ...> 
        //        <div ...> 
        //            <div ...> 
        //                <div>...</div>...
        //                <button>...</button>                // -> CART BUTTON
        //            </div>
        //            ...
        //        </div> 
        //    </header>
    // It is the only button inside element -> #commonHeader > div > div
    // Instacart's HTML skeleton is unlikely to change, hence chosen CSS selector is dependable
    // First observe mutations on the HTML header, since the Cart Button is dynamically loaded
    // Next, add an event listener to detect the button being clicked
    // Consequently, use a mutation observer to detect the cart dialog popping up
    // Use debounce timer which detects a short period of inactivity to ensure all cart content has been loaded

    // Observe the <header> element specifically
    const header = document.querySelector('header');
    console.log("Checks for header in DOM:", document.body.contains(header));
    console.log('Header has loaded.')
    const buttonObserver = new MutationObserver(() => {
        const cartButton = document.querySelector('#commonHeader > div > div > button');
        if (cartButton) {
            // buttonObserver.disconnect(); // -> Prevented event listener from reattaching if the cart button got replaced
            console.log('Cart Button has loaded.');
            console.log(cartButton);
            cartButton.addEventListener('click', () => {
                console.log('Cart Button clicked!');
                const popupObserver = new MutationObserver((mutations) => {
                    const cartBody = document.getElementById('cart-body');
                    if (cartBody) {
                        popupObserver.disconnect(); // stop observing once cart-body is loaded
                        console.log('Cart Detected. Waiting for 1000ms for all mutations to process...');
                        const cartObserver = new MutationObserver(debounce((mutation) => {
                            onMutations(mutation, cartBody);
                        }, 1000));
                        cartObserver.observe(cartBody, {
                            childList:true,
                            //subtree:true
                        });
                        
                    } else {
                        console.log('Waiting for Cart to pop up...')
                    }
                });
                popupObserver.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            });

        } else {
            console.log('Waiting for Cart Button to load...');
        }
    });
    buttonObserver.observe(header, {
        childList: true, // Observe direct child elements (e.g., when a button is added)
        subtree: true    // Observe all descendants (sub-elements inside <header>)
    });
}

// Defining the debounce function
function debounce(func, delay) {
    let timeout;
    return function (...args) {
        // Clear the previous timeout
        clearTimeout(timeout);

        // Set a new timeout to invoke the function after the delay
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// Define the callback function when when mutations occur after a pause
function onMutations(mutation, cartBody) {
    const ulElement = cartBody.querySelector('ul');
    if (ulElement) {
        console.log('Cart item list container found.')
        const itemList = Array.from(ulElement.children);
        if (itemList !== null && itemList.length !== 0) {
            console.log('Cart item list found.');
            // console.log(itemList);
            console.log('Cart Information:')
            console.log('------------');
            // information needed: price of item, count of item, unit of item
            // CSS selector format: div >  div > 1st out of 2 divs > 2nd out of 2 divs > div -> array of child of form [product, count, cost]
            let number = 0;
            itemList.forEach((li) => {
                // itemDiv is the div class parent to three divs which contain all product info
                // check if <section> is present. This comes when there is a promotion of specific items
                // inside section, products are listed in -> ul in each li
                // itemDiv is in div > div > div > 2nd div > div

                let promotion = li.querySelectorAll('section');

                if (promotion.length !== null && promotion.length !== 0) {
                    promotion.forEach((section) => {
                        promotionUlElement = section.querySelector('ul');
                        if (promotionUlElement) {
                            const promotionItemList = Array.from(promotionUlElement.children);
                            if (promotionItemList !== null && promotionItemList.length !== 0) {
                                promotionItemList.forEach((promotionLi) => {
                                    number += 1;
                                    console.log('item ' + number + ' - promotion');

                                    const itemDiv = promotionLi.querySelector('div > div > div > div:nth-child(2) > div');

                                    if (itemDiv) {
                                        const item = Array.from(itemDiv.children);
                                        if (item.length === 3) {                                            
                                            // console.log('item', item);

                                            const productInfo = extractProductInfo(item); // return -> [name, label, cost, multiplier];
                    
                                            const measurement = decodeQuantity(productInfo[0], productInfo[1]); // return -> [measurementValue, measurementUnit]
                                            
                                            const unitPrice = calculateUnitPrice(productInfo[2], productInfo[3], measurement); // decimal to the hundredths

                                            createOutputDisplay(itemDiv, unitPrice, measurement);
                                        } else {
                                            console.log("Product currently out of stock");
                                        }
                                    }
                                });
                            }
                        }
                    });
                } else {
                    number += 1;
                    console.log('item ' + number);

                    // read data and perform calculations
                    const itemDiv = li.querySelector('div > div > div > div:nth-child(2) > div');
                    if (itemDiv) {
                        const item = Array.from(itemDiv.children);
                        if (item.length === 3) {
                            // console.log('item', item);

                            const productInfo = extractProductInfo(item); // return -> [name, label, cost, multiplier];

                            const measurement = decodeQuantity(productInfo[0], productInfo[1]); // return -> [measurementValue, measurementUnit]

                            const unitPrice = calculateUnitPrice(productInfo[2], productInfo[3], measurement); // decimal to the hundredths

                            createOutputDisplay(itemDiv, unitPrice, measurement);
                        } else {
                            console.log("Product currently out of stock");
                        }
                    } else {
                        console.log('product\'s itemDiv not found');
                    }
                }
            });
        } else {
            console.log('Cart item list not found! Extension will not function.')
        }
    } else {
        console.log('Cart item list container not found! Extension will not function.')
    }
}

function extractProductInfo(item) {
    // cost is usually resting inside a <div> otherwise a <span> if there is a discounted price
    let cost = item[2].querySelector('div');
    if (cost) {
        // div handler
        cost = cost.textContent;
        cost = cost.substring(1);
    } else {
        // span handler
        const money = item[2].querySelector('span');
        money.style.fontWeight = 900;
        cost = money.textContent;
        cost = cost.substring(cost.indexOf('$')+1);
        cost = parseFloat(cost);
    }
    // count is resting inside div > div > button > span as the text content
    let multiplier = item[1].querySelector('div > div > button > span');
    if (multiplier) {
        multiplier = multiplier.textContent;
        multiplier = multiplier.split(" ")[0];
    } else {
        multiplier = 1;
    }
    // name is inside 1st out of 2 div > button > span > h3 -> text content 
    let name = item[0].querySelector('div > button > span > h3');
    if (name) {
        name = name.textContent;
        name = name.replace(/No\. \d/, '')
        name = name.replace('-', ' ').toLowerCase();
    } else {
        name = "name not found";
    }
    // label is inside 2nd out of 2 div -> text content
    let label = item[0].querySelector('div:nth-child(2)');
    if (label) {
        label = label.textContent;
        label = label.replace('-', ' ').toLowerCase();
    } else {
        label = "quantity label not found";
    }
    console.log('name is: ' + name + '; quantity label is: ' + label + '; cost is: $' + cost + '; multiplier is: ' + multiplier);
    return [name, label, cost, multiplier];
}

function decodeQuantity(name, label) {
    // Regex to match "number x unit" pattern 
    const pattern = /(\d+(\.\d+)?)(\s*x\s?)(\d+(\.\d+)?)/;
    let description = name;
    let measurementValue;
    let measurementUnit;

    // Quanity is in name
    if (pattern.test(description)) {
        // If it matches, extract the first number before 'x'
        const match = description.match(pattern);
        measurementValue = match ? match[1].trim() : null;
        measurementUnit = 'unit';
    } else {
        // Look for last number and measurement unit in the string
        const regex = /(\d+(\.\d+)?)(\s+)(\w+)/g;
        const matches = description.match(regex);
        const lastMatch = matches ? matches[matches.length - 1] : null;
        const numberAndWord = lastMatch ? lastMatch.split(/\s+/) : null;
        measurementValue = numberAndWord ? numberAndWord[0].trim() : null;
        measurementUnit = numberAndWord ? numberAndWord[1].replace('s', '').trim() : null;
    }
    // Quanity is in label
    if (measurementValue === null) {
        description = label.replace('-', ' ');
        if (pattern.test(description)) {
            // If it matches, extract the first number before 'x'
            const match = description.match(pattern);
            measurementValue = match ? match[1].trim() : null;
            measurementUnit = 'unit';
        } else {
            const regex = /(\d+(\.\d+)?)(\s+)(\w+)/g;
            const matches = description.match(regex);
            const lastMatch = matches ? matches[matches.length - 1] : null;
            const numberAndWord = lastMatch ? lastMatch.split(/\s+/) : null;
            measurementValue = numberAndWord ? numberAndWord[0].trim() : null;
            measurementUnit = numberAndWord ? numberAndWord[1].replace('s', '').trim() : null;
        }
    }
    if (measurementValue === null) {
        measurementValue = 1.00;
    } else {
        measurementValue = parseFloat(measurementValue);
    }
    if (measurementUnit === 'fl') {
        measurementUnit = 'fl oz';
    } else if (measurementUnit === null) {
        measurementUnit = 'unit';
    } else if (measurementUnit === "pack") {
        measurementUnit = 'unit';
    }
    return [measurementValue, measurementUnit];
}

function calculateUnitPrice(cost, multiplier, measurement) {
    let unitPrice = cost / (multiplier * measurement[0]);
    unitPrice = unitPrice.toFixed(2);
    console.log(`Unit Price: $${unitPrice} / ${measurement[1]}`);
    console.log('------------');
    return unitPrice;
}

function createOutputDisplay(productItemDiv, unitPrice, measurement) {
    chrome.runtime.sendMessage({ action: 'getFontDetails' }, (response) => {
        if (response) {
            console.log('new font size and color updated.');
            BUTTON_FONT_SIZE = response.fontSize;
            BUTTON_COLOR = response.fontColor;
        }
    });
    let outputDisplay = productItemDiv.querySelector('div');
    if (outputDisplay) {
        // delete the existing unit price display
        const unitPriceLabel = outputDisplay.querySelector('.instacart-extension-unit-price');
        if (unitPriceLabel) {
            outputDisplay.removeChild(unitPriceLabel);
        }
        let newUnitPriceLabel = document.createElement('button');
        newUnitPriceLabel.className = 'instacart-extension-unit-price';
        // STYLING
        newUnitPriceLabel.style.border = BUTTON_BORDER; // no border outline
        newUnitPriceLabel.style.borderRadius = BUTTON_BORDER_RADIUS; // rounded boundary
        newUnitPriceLabel.style.padding = BUTTON_PADDING; // vertical and horizontal padding
        newUnitPriceLabel.style.cursor = BUTTON_CURSOR; // Normal cursor
        newUnitPriceLabel.style.fontSize = BUTTON_FONT_SIZE; // Reduced font size
        newUnitPriceLabel.style.color = BUTTON_COLOR; // Dark gray font color
        // add the unit price display
        newUnitPriceLabel.innerHTML = "$" + unitPrice + " / " + measurement[1];
        outputDisplay.appendChild(newUnitPriceLabel);
    }
}