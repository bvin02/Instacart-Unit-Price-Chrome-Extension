# Instacart-Unit-Price-Chrome-Extension
This is a chrome extension for Instacart. It seamlessly integrates new calculated unit prices (per lb/oz/unit) into the shopping cart. This is achieved via DOM manipulation in Javascript while handling race conditions.

### Credits
> Idea proposed by Ayush and posted on https://aayushg.com/ideas.
> 
> This chrome extension is created by **Bhavin Gupta** and all filetypes used in this project include .json, .js, .html, .css, .png


---

## Local Download Instructions
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
Launched on [Chrome Web Store](https://chromewebstore.google.com/detail/instacart-unit-price/eoooeedgjbbaaijdhaffbedmambfemof)

<a href="https://www.producthunt.com/posts/chrome-web-store-dd523bc8-3725-47a1-bff5-b7e9ac06fb29?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-chrome&#0045;web&#0045;store&#0045;dd523bc8&#0045;3725&#0045;47a1&#0045;bff5&#0045;b7e9ac06fb29" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=944950&theme=light&t=1742832223608" alt="Chrome&#0032;Web&#0032;Store - Instacart&#0032;unit&#0032;price | Product Hunt" style="width: 187px; height: 40px;" width="250" height="54" /></a>
