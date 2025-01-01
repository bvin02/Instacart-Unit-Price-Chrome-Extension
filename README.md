# Instacart-Unit-Price-Chrome-Extension
This is a chrome extension for Instacart. It seamlessly integrates new calculated unit prices (per lb/oz/unit) into the shopping cart. This is achieved via DOM manipulation in Javascript while handling race conditions.

### Credits
> Idea proposed by Ayush and posted on https://aayushg.com/ideas.
> 
> This chrome extension is created by **Bhavin Gupta** and all filetypes used in this project include .json, .js, .html, .css, .png


---

## Simple Download Instructions
1. Download the project repo
2. Navigate to chrome://extensions/
3. Toggle 'Developer Mode' on
4. Select 'Load Unpacked' and select the project repo
5. Pin the extension to allow easy access to the customization menu

## Functionality
| **Without the extension** | **With the extension** |
| :-----------: |  :-----------: | 
| ![image](https://github.com/user-attachments/assets/39981036-30af-4600-b3ba-fbd205d84248) | ![image](https://github.com/user-attachments/assets/c16f096a-2425-4a50-bebf-f2ab36410e85) |

## Format Customization
Clicking on the extension pops up the customization menu.
| extension bar | >click< | customization menu |
| :---: | :---: | :---: |
| ![image](https://github.com/user-attachments/assets/639fad1b-af07-4583-86ee-10865f1f501d) | ---> | ![image](https://github.com/user-attachments/assets/caecadb9-1322-4cc7-8ae6-c7ea74e288aa) |

Users have the choice of changing:
- text color -> using a color picker.
- font size -> using three preset options from small, middle, large which correspond to 12px, 13px, 14px respectively.

Users can reload the page, or simply close and re open the cart to observe the changes take effect.

---

# Publishing
This project is scheduled to be published on the Chrome Extension Store soon.
