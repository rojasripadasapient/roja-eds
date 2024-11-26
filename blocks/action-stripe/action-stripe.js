// import { moveInstrumentation } from '../../scripts/scripts.js';
 
// // Builds a CTA button with an icon, title, and URL.
// function buildCtaButton(cta, ctaTitle, ctaVariant) {
//   const anchor = cta?.querySelector('.button-container a');
//   const elementP = ctaTitle?.querySelector('p');
  
//   // If no anchor element found, return null
//   if (!anchor) return null;
  
//   const url = anchor.getAttribute('href') || '#';
//   const title = ctaTitle ? ctaTitle.textContent : (anchor.getAttribute('title') || '');
// //   const clsList = anchor.getAttribute('class')?.split(' ')[1] || 'tertiary';
// //   const variant = ctaVariant ? ctaVariant.textContent : clsList;
  
//   // Create the button
//   const button = document.createElement('wds-button');
//   const span = document.createElement('span');
  
//   button.setAttribute('background', 'light');
//   //button.setAttribute('variant', variant);
//   button.setAttribute('data-src', url);  // Attach the URL to the button
//   span.textContent = title;
//   button.appendChild(span);
  
//   // Move instrumentation if necessary
//   moveInstrumentation(elementP || anchor, span);
  
//   // Wrap the button in an anchor tag
//   const anchorTag = document.createElement('a');
//   anchorTag.setAttribute('href', url);
//   anchorTag.appendChild(button);
  
//   return anchorTag;  // Return the anchor wrapping the button
// }
 
// // Binds the click event to the action strip and uses event delegation for teaser__cta.
// function bindButtonEvents(actionStrip) {
//   actionStrip.addEventListener('click', (event) => {
//     let teaserCta, url, anchor;
 
//     // Check if the click happened on a teaser__cta (button area) or an icon area
//     if (event.target.closest('.teaser__cta')) {
//       teaserCta = event.target.closest('.teaser__cta');  // Find .teaser__cta container
//     } else if (event.target.closest('.icon-container')) {
//       // Find the closest .teaser__cta inside the icon container
//       const iconContainer = event.target.closest('.icon-container');
//       teaserCta = iconContainer.querySelector('.teaser__cta');
//     }
 
//     if (teaserCta) {
//       anchor = teaserCta.querySelector('a');
//       url = anchor ? anchor.getAttribute('href') : null;
 
//       // If a valid URL is found, prevent the default action (which is _blank) and perform redirection
//       if (url && url !== '#') {
//         event.preventDefault();  // Prevent the default behavior (e.g., opening in _blank)
//         console.log(`Redirecting to: ${url}`);
//         window.location.href = url;  // Redirect to the URL
//       } else {
//         console.log('No valid URL found for the button.');
//       }
//     }
//   });
// }
 
// // Creates the HTML structure for the action strip with flexbox layout.
// function createActionStrip() {
//   const actionStrip = document.createElement('div');
//   actionStrip.classList.add('actionstrip');  // Add a class for styling
  
//   actionStrip.innerHTML = `
//     <div class="flex-container">
//       <!-- Icon Containers -->
//       <div class="icon-container">
//         <div class="teaser__cta">
//         <i class="icon icon-exterior_view"></i>
//         </div>
//       </div>
//       <div class="icon-container">
//         <div class="teaser__cta">
//           <i class="icon icon-trade-in-quote"></i>
//         </div>
//       </div>
//       <div class="icon-container">
//         <div class="teaser__cta">
//           <i class="icon icon-transportation"></i>
//         </div>
//       </div>
//       <div class="icon-container">
//         <div class="teaser__cta">
//           <i class="icon icon-download-brochure"></i>
//         </div>
//       </div>
//       <!-- Button Containers -->
//       <div class="button-container">
//         <div class="teaser__cta"></div>
//       </div>
//       <div class="button-container">
//         <div class="teaser__cta"></div>
//       </div>
//     </div>
//   `;
  
//   return actionStrip;
// }
 
// // Populates the action strip with buttons.
// function populateActionStrip(actionStrip, buttons) {
//   const iconContainers = actionStrip.querySelectorAll('.icon-container');
//   const buttonContainers = actionStrip.querySelectorAll('.button-container');
  
//   // Add the buttons to their respective containers
//   Object.keys(buttons).forEach((key, index) => {
//     if (buttons[key]) {
//       if (index < iconContainers.length) {
//         iconContainers[index].querySelector('.teaser__cta').innerHTML = buttons[key].outerHTML;  // Set the HTML of the teaser__cta to include the anchor-wrapped button
//       } else {
//         buttonContainers[index - iconContainers.length].querySelector('.teaser__cta').innerHTML = buttons[key].outerHTML;  // For button containers
//       }
//     }
//   });
// }
 
// // Main function to decorate the block and build the action strip with buttons.
// export default function decorate(block) {
//   // Extract the first 9 rows of the block to get action strip elements
//   const actionStripElements = [...block.children].slice(1, 10).map(row => row.firstElementChild);
//   const bgColorElem = [...block.children].slice(0, 1);
//   const bgColor = bgColorElem[0]?.querySelector('p').textContent;
  
//   console.log(bgColor); // For debugging
//   block.innerHTML = '';
 
//   // Create the action strip container
//   const actionStrip = createActionStrip();
 
//   // Build the CTA buttons based on the extracted elements
//   const buttons = {
//     primary: actionStripElements[0] ? buildCtaButton(actionStripElements[0]) : null,
//     secondary: actionStripElements[1] ? buildCtaButton(actionStripElements[1], actionStripElements[2], actionStripElements[3]) : null,
//     tertiary: actionStripElements[4] ? buildCtaButton(actionStripElements[4], actionStripElements[5], actionStripElements[6]) : null,
//     quarter: actionStripElements[7] ? buildCtaButton(actionStripElements[7], actionStripElements[8]) : null,
//   };
 
//   // Populate the action strip with buttons
//   populateActionStrip(actionStrip, buttons);
 
//   // Append the populated action strip to the block
//   block.appendChild(actionStrip);
 
//   // Bind event listeners for button redirection using event delegation
//   bindButtonEvents(actionStrip);
// }
 
 
 
// import { moveInstrumentation } from '../../scripts/scripts.js';
 
// // Builds a CTA button with an icon, title, and URL.
// function buildCtaButton(cta, ctaTitle, ctaVariant) {
//   const anchor = cta?.querySelector('.button-container a');
//   const elementP = ctaTitle?.querySelector('p');
  
//   // If no anchor element found, return null
//   if (!anchor) return null;
  
//   const url = anchor.getAttribute('href') || '#';
//   const title = ctaTitle ? ctaTitle.textContent : (anchor.getAttribute('title') || '');
//   const clsList = (anchor?.getAttribute('class') || '').split(' ');
 
//   // Extract the variant from ctaVariant textContent or fallback to clsList[1] or default 'tertiary'
//   const variant = (ctaVariant && ctaVariant.textContent.trim()) || (clsList[1] && clsList[1].trim()) || 'tertiary';
  
//   // Create the button
//   const button = document.createElement('wds-button');
//   const spanIcon = document.createElement('i');
//   const span = document.createElement('span');
  
//   button.setAttribute('background', 'light');
//   button.setAttribute('variant', variant);
//   button.setAttribute('data-src', url);  // Attach the URL to the button
//   spanIcon.classList.add('icon', 'icon-exterior_view');
//   span.textContent = title;
//   button.appendChild(spanIcon);
//   button.appendChild(span);
  
//   // Move instrumentation if necessary
//   moveInstrumentation(elementP || anchor, span);
  
//   // Wrap the button in an anchor tag
//   const anchorTag = document.createElement('a');
//   anchorTag.setAttribute('href', url);
//   anchorTag.appendChild(button);
  
//   return anchorTag;  // Return the anchor wrapping the button
// }
 
// // Binds the click event to the action strip and uses event delegation for teaser__cta.
// function bindButtonEvents(actionStrip) {
//   actionStrip.addEventListener('click', (event) => {
//     let teaserCta, url, anchor;
 
//     // Check if the click happened on a teaser__cta (button area) or an icon area
//     if (event.target.closest('.teaser__cta')) {
//       teaserCta = event.target.closest('.teaser__cta');  // Find .teaser__cta container
//     } else if (event.target.closest('.icon-container')) {
//       // Find the closest .teaser__cta inside the icon container
//       const iconContainer = event.target.closest('.icon-container');
//       teaserCta = iconContainer.querySelector('.teaser__cta');
//     }
 
//     if (teaserCta) {
//       anchor = teaserCta.querySelector('a');
//       url = anchor ? anchor.getAttribute('href') : null;
 
//       // If a valid URL is found, prevent the default action (which is _blank) and perform redirection
//       if (url && url !== '#') {
//         event.preventDefault();  // Prevent the default behavior (e.g., opening in _blank)
//         console.log(`Redirecting to: ${url}`);
//         window.location.href = url;  // Redirect to the URL
//       } else {
//         console.log('No valid URL found for the button.');
//       }
//     }
//   });
// }
 
// // Creates the HTML structure for the action strip with flexbox layout.
// function createActionStrip() {
//   const actionStrip = document.createElement('div');
//   actionStrip.classList.add('actionstrip');  // Add a class for styling
  
//   actionStrip.innerHTML = `
//     <div class="flex-container">
//       <!-- Icon Containers -->
//       <div class="icon-container">
//         <div class="teaser__cta">
//         <i class="icon icon-exterior_view"></i>
//         </div>
//       </div>
//       <div class="icon-container">
//         <div class="teaser__cta">
//           <i class="icon icon-trade-in-quote"></i>
//         </div>
//       </div>
//       <div class="icon-container">
//         <div class="teaser__cta">
//           <i class="icon icon-transportation"></i>
//         </div>
//       </div>
//       <div class="icon-container">
//         <div class="teaser__cta">
//           <i class="icon icon-download-brochure"></i>
//         </div>
//       </div>
//       <!-- Button Containers -->
//       <div class="button-container">
//         <div class="teaser__cta"></div>
//       </div>
//       <div class="button-container">
//         <div class="teaser__cta"></div>
//       </div>
//     </div>
//   `;
  
//   return actionStrip;
// }
 
// // Populates the action strip with buttons.
// function populateActionStrip(actionStrip, buttons) {
//   const iconContainers = actionStrip.querySelectorAll('.icon-container');
//   const buttonContainers = actionStrip.querySelectorAll('.button-container');
  
//   // Add the buttons to their respective containers
//   Object.keys(buttons).forEach((key, index) => {
//     if (buttons[key]) {
//       if (index < iconContainers.length) {
//         iconContainers[index].querySelector('.teaser__cta').innerHTML = buttons[key].outerHTML;  // Set the HTML of the teaser__cta to include the anchor-wrapped button
//       } else {
//         buttonContainers[index - iconContainers.length].querySelector('.teaser__cta').innerHTML = buttons[key].outerHTML;  // For button containers
//       }
//     }
//   });
// }
 
// // Main function to decorate the block and build the action strip with buttons.
// export default function decorate(block) {
//   // Extract the first 9 rows of the block to get action strip elements
//   const actionStripElements = [...block.children].slice(1, 10).map(row => row.firstElementChild);
//   const bgColorElem = [...block.children].slice(0, 1);
//   const bgColor = bgColorElem[0]?.querySelector('p').textContent;
  
//   console.log(bgColor); // For debugging
//   block.innerHTML = '';
 
//   // Create the action strip container
//   const actionStrip = createActionStrip();
 
//   // Build the CTA buttons based on the extracted elements
//   const buttons = {
//     primary: actionStripElements[0] ? buildCtaButton(actionStripElements[0]) : null,
//     secondary: actionStripElements[1] ? buildCtaButton(actionStripElements[1], actionStripElements[2], actionStripElements[3]) : null,
//     tertiary: actionStripElements[4] ? buildCtaButton(actionStripElements[4], actionStripElements[5], actionStripElements[6]) : null,
//     quarter: actionStripElements[7] ? buildCtaButton(actionStripElements[7], actionStripElements[8]) : null,
//   };
 
//   // Populate the action strip with buttons
//   populateActionStrip(actionStrip, buttons);
 
//   // Append the populated action strip to the block
//   block.appendChild(actionStrip);
 
//   // Bind event listeners for button redirection using event delegation
//   bindButtonEvents(actionStrip);
// }
 
 
import { moveInstrumentation } from '../../scripts/scripts.js';
//import { loadScript } from '../../../scripts/aem.js';
 
/**
* Builds a CTA button with an icon, title, and URL.
* @param {Element} cta - The CTA element.
* @param {Element} ctaTitle - The element containing the CTA title.
* @param {Element} ctaVariant - The variant element (optional).
* @returns {Element|null} - The generated wds-action-strip-icon button or null.
*/
function buildCtaButton(cta, ctaTitle, ctaVariant) {
    const anchor = cta?.querySelector('.button-container a');
    const elementP = ctaTitle?.querySelector('p');
   
    // If no anchor element found, return null
    if (!anchor) return null;
   
    const url = anchor.getAttribute('href') || '#';
    const title = ctaTitle ? ctaTitle.textContent : (anchor.getAttribute('title') || '');
    const variant = ctaVariant ? ctaVariant.textContent : (anchor.classList[3] || 'secondary');
   
    // Create the button
    const button = document.createElement('wds-action-strip-icon');
    const span = document.createElement('span');
   
    button.setAttribute('background', 'light');
    button.setAttribute('variant', variant);
    button.setAttribute('data-src', url);  // Attach the URL to the button
    span.textContent = title;
    span.classList.add('action-strip-title', 'wds2-type-action-button-m');
    button.appendChild(span);
   
    // Move instrumentation if necessary
    moveInstrumentation(elementP || anchor, span);
   
    return button;
  }
   
  /**
  * Binds the click event to the buttons in the action strip.
  * @param {Element} block - The container element for the action strip.
  */
  function bindButtonEvents(block) {
    const buttons = block.querySelectorAll('wds-action-strip-icon');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const url = button.getAttribute('data-src');
            if (url && url !== '#') {
                window.location.href = url;  // Redirect to the URL
            } else {
                console.log('No valid URL found');
            }
        });
    });
 
    const wdsActionStrip = document.querySelector('wds-action-strip');
    if (wdsActionStrip && wdsActionStrip.shadowRoot) {
        const shadowRoot = wdsActionStrip.shadowRoot;
        
        // Set up a MutationObserver to wait for the container div to be added to the shadow DOM
        const observer = new MutationObserver((mutationsList) => {
            mutationsList.forEach(mutation => {
                if (mutation.type === 'childList') {
                    // This function applies styles to all icons
                    function wdsIconTest () {
                        // Loop through each 'wds-action-strip-icon' element
                        const wdsActionStripIcons = document.querySelectorAll('wds-action-strip-icon');
                        wdsActionStripIcons.forEach(wdsActionStripIcon => {
                            // Access the shadow root of each 'wds-action-strip-icon'
                            const wdsActionStripIconShadowRoot = wdsActionStripIcon.shadowRoot;
                            
                            // Make sure the shadowRoot exists before querying elements inside it
                            if (wdsActionStripIconShadowRoot) {
                                // Apply styling to the 'span.action-icons.four-icons' for each icon
                                const actionIconSpan = wdsActionStripIconShadowRoot.querySelector('span.action-icons.four-icons');
                                if (actionIconSpan) {
                                    actionIconSpan.style.fontSize = '24px';
                                }
 
                                // Access the 'wds-icon' inside each 'wds-action-strip-icon'
                                const wdsIcon = wdsActionStripIconShadowRoot.querySelector('wds-icon');
                                if (wdsIcon && wdsIcon.shadowRoot) {
                                    const iconContainer = wdsIcon.shadowRoot.querySelector('span.icon-container');
                                    const iconDescription = wdsIcon.shadowRoot.querySelector('span.icon-description');
                                    
                                    // Apply styles to icon-container and icon-description for each icon
                                    if (iconContainer) {
                                        iconContainer.style.display = 'flex';
                                        iconContainer.style.flexDirection = 'row';
                                        iconContainer.style.textAlign = 'left';
                                    }
                                    if (iconDescription) {
                                        iconDescription.style.margin = '0 0 0 14px';
                                    }
                                }
                            }
                        });
                    }
                    setTimeout(wdsIconTest, 0); // Make sure styles are applied after the mutation
 
                    // Try to find the container div with class 'container light' and remove 'light' class
                    const containerDiv = shadowRoot.querySelector('div.container.light');
                    if (containerDiv) {
                        containerDiv.classList.remove('light');
                        containerDiv.style.flexDirection = 'row';
                        containerDiv.style.alignItems = 'center';
                    }
                    observer.disconnect(); // Stop observing once we have processed the target div
                }
            });
        });
    
        // Start observing the shadow DOM for changes
        observer.observe(shadowRoot, { childList: true, subtree: true });
    } else {
        console.log('No shadow root found');
    }
}
 
   
  /**
  * Creates the HTML structure for the action strip.
  * @returns {Element} - The action strip container with buttons.
  */
  function createActionStrip() {
    //loadScript('https://libs-europe.nissan-cdn.net/etc/designs/nissan-pace-vlp-plus/clientlibs-24.09.30.NISSAN-5/libs/analyticsManager.min.js');
 
    const actionStrip = document.createElement('div');
    actionStrip.innerHTML = `
      <div class="actionstrip">
        <div class="actionstrip_icon">
          <div class="row">
            <div class="col-sm-2 col-md-12 col-l-12 col-xl-12">
              <wds-action-strip>
                <wds-action-strip-icon slot="fourIcons" variant="four-icons" iconname="icon-exterior_view" class="p-btn"></wds-action-strip-icon>
                <wds-action-strip-icon slot="fourIcons" variant="four-icons" iconname="icon-trade-in-quote" class="p-btn"></wds-action-strip-icon>
                <wds-action-strip-icon slot="fourIcons" variant="four-icons" iconname="icon-transportation" class="p-btn"></wds-action-strip-icon>
                <wds-action-strip-icon slot="fourIcons" variant="four-icons" iconname="icon-download-brochure" class="p-btn"></wds-action-strip-icon>
              </wds-action-strip>
            </div>
          </div>
        </div>
      </div>
    `;
    return actionStrip;
  }
   
  /**
  * Populates the action strip with buttons.
  * @param {Element} actionStrip - The action strip container.
  * @param {Object} buttons - An object containing the buttons (primary, secondary, tertiary, quarter).
  */
  function populateActionStrip(actionStrip, buttons) {
    const icons = actionStrip.querySelectorAll('wds-action-strip-icon');
    Object.keys(buttons).forEach((key, index) => {
      if (buttons[key]) {
        icons[index].innerHTML = buttons[key].innerHTML;
        icons[index].setAttribute('data-src', buttons[key].getAttribute('data-src'));  // Set the URL for each button
      }
    });
  }
   
  /**
  * Add specific class to the promo element based on the option
  * @param {HTMLElement} bgColor - The bgcolor element.
  * @param {HTMLElement} block - The block containing the promo content.
  */
  function addBgColor(bgColor, block) {
      const bgColorVal = bgColor;
      const parentElem = block.closest('.action-stripe-container');
      if (parentElem) {
        if (bgColorVal === 'true') {
          parentElem.classList.add('no-bg');
        } else {
          parentElem.classList.remove('no-bg');
        }
      }
    }
   
  /**
  * Main function to decorate the block and build the action strip with buttons.
  * @param {Element} block - The block to decorate.
  */
  export default function decorate(block) {
    // Extract the first 9 rows of the block to get action strip elements
    const actionStripElements = [...block.children].slice(1, 10).map(row => row.firstElementChild);
    const bgColorElem = [...block.children].slice(0, 1);
      const bgColor = bgColorElem[0]?.querySelector('p').textContent;
      const theme = block.querySelectorAll('p');
      console.log(theme);
      console.log(theme.innerHTML);
    console.log(bgColor);
    addBgColor(bgColor, block);
    
    // Build the CTA buttons based on the extracted elements
    const buttons = {
      primary: actionStripElements[0] ? buildCtaButton(actionStripElements[0]) : null,
      secondary: actionStripElements[1] ? buildCtaButton(actionStripElements[1], actionStripElements[2], actionStripElements[3]) : null,
      tertiary: actionStripElements[4] ? buildCtaButton(actionStripElements[4], actionStripElements[5], actionStripElements[6]) : null,
      quarter: actionStripElements[7] ? buildCtaButton(actionStripElements[7], actionStripElements[8]) : null,
    };
   
    console.log(actionStripElements);
   
    block.innerHTML = '';
   
    // Create the action strip container
    const actionStrip = createActionStrip();
   
    // Populate the action strip with buttons
    populateActionStrip(actionStrip, buttons);
   
    // Append the populated action strip to the block
    block.appendChild(actionStrip);
   
    // Bind event listeners for button redirection
    bindButtonEvents(actionStrip);
  }