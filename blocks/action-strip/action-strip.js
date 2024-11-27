import { moveInstrumentation } from '../../scripts/scripts.js';

function buildCtaButton(cta, ctaTitle, ctaVariant, index) {
    const anchor = cta?.querySelector('.button-container a');
    const title = ctaTitle ? ctaTitle.textContent : '';

    if (!anchor) return null;

    const url = anchor.getAttribute('href') || '#';

    const button = document.createElement('wds-button');
    const span = document.createElement('span');
    const iconWrapper = document.createElement('span');

    const iconNames = [
        'icon-exterior_view',
        'icon-trade-in-quote',
        'icon-transportation',
        'icon-download-brochure'
    ];

    const iconAltTexts = [
        'Exterior View',
        'Trade-in Quote',
        'Transportation',
        'Download Brochure'
    ];

    const iconName = iconNames[index] || '';
    const iconAltText = iconAltTexts[index] || '';

    const icon = document.createElement('wds-icon');
    icon.setAttribute('iconName', iconName);
    icon.className = 'action-strip__icon';
    icon.setAttribute('aria-label', iconAltText);

    iconWrapper.appendChild(icon);

    button.setAttribute('data-src', url);
    button.appendChild(iconWrapper);
    span.textContent = title;
    span.classList.add('action-strip-title', 'wds2-type-action-button-m');
    button.appendChild(span);

    const anchorTag = document.createElement('a');
    anchorTag.setAttribute('href', url);
    anchorTag.appendChild(button);

    moveInstrumentation(cta || anchor, span);

    return anchorTag;
}

function addBgColor(bgColor, block) {
    const bgColorVal = bgColor || '';
    const parentElem = block.closest('.action-stripe-container');
    if (parentElem) {
        if (bgColorVal === 'false' || bgColorVal === '') {
            parentElem.classList.add('no-bg');
        } else {
            parentElem.classList.remove('no-bg');
        }
    }
}

function observeShadowDomChanges() {
    // Observe changes to wds-button shadow DOM
    const wdsButtons = document.querySelectorAll('wds-button');

    wdsButtons.forEach((wdsButton) => {
        const wdsButtonShadowRoot = wdsButton.shadowRoot;

        if (wdsButtonShadowRoot) {
            const observer = new MutationObserver((mutationsList) => {
                mutationsList.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        console.log('Child nodes have been added or removed in wds-button shadow DOM.');
                    } else if (mutation.type === 'attributes') {
                        console.log(`Attribute ${mutation.attributeName} was modified in wds-button.`);
                    }
                });
            });

            observer.observe(wdsButtonShadowRoot, {
                childList: true,
                attributes: true,
                subtree: true
            });
        }
    });

    // Observe changes to wds-icon shadow DOM
    const wdsIcons = document.querySelectorAll('wds-icon');
    wdsIcons.forEach((wdsIcon) => {
        const wdsIconShadowRoot = wdsIcon.shadowRoot;

        if (wdsIconShadowRoot) {
            const iconObserver = new MutationObserver((mutationsList) => {
                mutationsList.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        console.log('Child nodes have been added or removed in wds-icon shadow DOM.');
                    } else if (mutation.type === 'attributes') {
                        console.log(`Attribute ${mutation.attributeName} was modified in wds-icon.`);
                    }
                });
            });

            iconObserver.observe(wdsIconShadowRoot, {
                childList: true,
                attributes: true,
                subtree: true
            });
        }
    });
}

function bindButtonEvents(actionStrip) {
    function shadowRootElementsFromDom() {
        const wdsButtons = document.querySelectorAll('wds-button');

        wdsButtons.forEach((wdsButton) => {
            const wdsButtonShadowRoot = wdsButton.shadowRoot;

            if (wdsButtonShadowRoot) {
                const wdsButtonShadowbutton = wdsButtonShadowRoot.querySelector('button');
                if (wdsButtonShadowbutton) {
                    wdsButtonShadowbutton.style.cssText = `
                        background-color: transparent;
                        border: none;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    `;
                    wdsButtonShadowbutton.classList.remove('button--primary', 'light', 'small');
                }
            }

            const wdsIcon = wdsButton.querySelector('wds-icon');
            const wdsIconShadowRoot = wdsIcon.shadowRoot;
            const wdsIconContent = wdsIconShadowRoot.querySelector('.icon-container');
            wdsIconContent.style.cssText = `
                width: 24px;
            `;

            if (wdsIcon) {
                wdsIcon.style.fontSize = '24px';
                wdsIcon.style.verticalAlign = 'middle';

                const iconClassName = wdsIcon.className || '';
                const styleTag = document.createElement('style');

                document.head.appendChild(styleTag);

                const styleSheet = styleTag.sheet;

                styleSheet.insertRule(
                    `.${iconClassName}::before {
                        font-size: 24px !important;
                    }`, styleSheet.cssRules.length
                );
            }
        });
    }

    // Observe changes to shadow DOM elements
    observeShadowDomChanges();

    setTimeout(shadowRootElementsFromDom, 0);

    actionStrip.addEventListener('click', (event) => {
        let actionStripCta, url, anchor;

        if (event.target.closest('.actionstrip__cta')) {
            actionStripCta = event.target.closest('.actionstrip__cta');
        } else if (event.target.closest('.action-strip-icon-container')) {
            const iconContainer = event.target.closest('.action-strip-icon-container');
            actionStripCta = iconContainer.querySelector('.actionstrip__cta');
        }

        if (actionStripCta) {
            anchor = actionStripCta.querySelector('a');
            url = anchor ? anchor.getAttribute('href') : null;

            if (url && url !== '#') {
                event.preventDefault();
                window.location.href = url;
            } else {
                console.log('No valid URL found for the button.');
            }
        }
    });
}

function createActionStrip() {
    const actionStrip = document.createElement('div');

    actionStrip.classList.add('actionstrip');
    actionStrip.innerHTML = `
      <div class="flex-container flex">
        <div class="action-strip-icon-container">
          <div class="actionstrip__cta">
          </div>
        </div>
        <div class="action-strip-icon-container">
          <div class="actionstrip__cta">
          </div>
        </div>
        <div class="action-strip-icon-container">
          <div class="actionstrip__cta">
          </div>
        </div>
        <div class="action-strip-icon-container">
          <div class="actionstrip__cta">
          </div>
        </div>
    `;

    return actionStrip;
}

function populateActionStrip(actionStrip, buttons) {
    const iconContainers = actionStrip.querySelectorAll('.action-strip-icon-container');
    const buttonContainers = actionStrip.querySelectorAll('.button-container');

    Object.keys(buttons).forEach((key, index) => {
      if (buttons[key]) {
        if (index < iconContainers.length) {
          iconContainers[index].querySelector('.actionstrip__cta').innerHTML = buttons[key].outerHTML;
        } else {
          buttonContainers[index - iconContainers.length].querySelector('.actionstrip__cta').innerHTML = buttons[key].outerHTML;
        }
      }
    });
}

export default function decorate(block) {
    const actionStripElements = [...block.children].slice(1, 10).map(row => row.firstElementChild);
    const bgColorElem = [...block.children].slice(0, 1);
    const bgColor = bgColorElem[0]?.querySelector('p').textContent;

    addBgColor(bgColor, block);

    block.innerHTML = '';

    const actionStrip = createActionStrip();
    const buttons = {
        primary: actionStripElements[0] ? buildCtaButton(actionStripElements[0], actionStripElements[0], null, 0) : null,
        secondary: actionStripElements[1] && actionStripElements[2] ? buildCtaButton(actionStripElements[1], actionStripElements[2], null, 1) : null,
        tertiary: actionStripElements[3] && actionStripElements[4] ? buildCtaButton(actionStripElements[3], actionStripElements[4], null, 2) : null,
        quarter: actionStripElements[5] && actionStripElements[6] ? buildCtaButton(actionStripElements[5], actionStripElements[6], null, 3) : null,
    };

    populateActionStrip(actionStrip, buttons);

    block.appendChild(actionStrip);
    bindButtonEvents(actionStrip);
}