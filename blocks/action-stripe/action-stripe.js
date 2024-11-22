import { moveInstrumentation } from '../../scripts/scripts.js';

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
}

/**
* Creates the HTML structure for the action strip.
* @returns {Element} - The action strip container with buttons.
*/
function createActionStrip() {
  const actionStrip = document.createElement('div');
  actionStrip.innerHTML = `
    <div class="actionstrip">
      <div class="actionstrip_icon">
        <div class="row">
          <div class="col-sm-2 col-md-12 col-l-12 col-xl-12">
            <wds-action-strip background="light">
              <wds-action-strip-icon slot="fourIcons" variant="four-icons" iconname="icon-car" class="p-btn"></wds-action-strip-icon>
              <wds-action-strip-icon slot="fourIcons" variant="four-icons" iconname="icon-trade-in-quote" class="p-btn"></wds-action-strip-icon>
              <wds-action-strip-icon slot="fourIcons" variant="four-icons" iconname="icon-onboarding_to_ownership" class="p-btn"></wds-action-strip-icon>
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
* Main function to decorate the block and build the action strip with buttons.
* @param {Element} block - The block to decorate.
*/
export default function decorate(block) {
  // Extract the first 9 rows of the block to get action strip elements
  const actionStripElements = [...block.children].slice(0, 9).map(row => row.firstElementChild);

  // Build the CTA buttons based on the extracted elements
  const buttons = {
    primary: actionStripElements[0] ? buildCtaButton(actionStripElements[0]) : null,
    secondary: actionStripElements[1] && actionStripElements[2] && actionStripElements[3] ? buildCtaButton(actionStripElements[1], actionStripElements[2], actionStripElements[3]) : null,
    tertiary: actionStripElements[4] && actionStripElements[5] && actionStripElements[6] ? buildCtaButton(actionStripElements[4], actionStripElements[5], actionStripElements[6]) : null,
    quarter: actionStripElements[7] && actionStripElements[8] ? buildCtaButton(actionStripElements[7], actionStripElements[8]) : null,
  };

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
