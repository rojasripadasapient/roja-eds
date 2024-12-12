import { moveInstrumentation } from '../../scripts/scripts.js';
import { isDesktop } from '../../scripts/utils.js';

// Function to set the active link
function setSecondaryNavActiveLink(link) {
  const navLinks = document.querySelectorAll('.secondary-nav__link');
  navLinks.forEach((navLink) => navLink.classList.remove('active'));
  link.classList.add('active');

  // Store both the link name and URL in localStorage
  const activeLinkData = {
    id: link.getAttribute('data-link-id'),
    pathname: new URL(link.href).pathname,
  };
  sessionStorage.setItem('activeSecondaryNavLink', JSON.stringify(activeLinkData));
}

// Function to initialize the active link from localStorage
function initializeSecondaryNavActiveLink() {
  const activeLinkData = JSON.parse(sessionStorage.getItem('activeSecondaryNavLink'));

  if (activeLinkData) {
    const currentPathname = window.location.pathname;
    const activeLink = document.querySelector(`.secondary-nav__link[data-link-id="${activeLinkData.id}"]`);

    // Check if the stored URL matches the current URL
    if (activeLink && activeLinkData.pathname === currentPathname) {
      activeLink.classList.add('active');
    }
  }
}

// Common function to toggle dropdown visibility and active classes
function toggleDropdown(isVisible, dropdownElement, displayType = 'block', delay = 300, ...toggleElements) {
  if (isVisible) {
    dropdownElement.classList.add('active');
    setTimeout(() => {
      dropdownElement.style.display = displayType;
    }, 0);
  } else {
    dropdownElement.classList.remove('active');
    setTimeout(() => {
      dropdownElement.style.display = 'none';
    }, delay);
  }

  // Toggle active class on any additional elements passed
  toggleElements.forEach((element) => element.classList.toggle('active', isVisible));
}

function bindEvent(block) {
  const secondaryNavWrapper = block.querySelector('#secondary-nav-wrapper');
  const carNameWrapper = block.querySelector('#secondary-nav-car-name-wrapper');
  const modelName = block.querySelector('#secondary-nav-model-name');
  const dropdownMenu = block.querySelector('#secondary-nav-dropdown-menu');
  const wdsButton = block.querySelector('wds-button');
  const navLinks = block.querySelectorAll('.secondary-nav__link');

  // Function to apply styles to the button
  function applyButtonStyles(button) {
    button.style.cssText = `
      font-size: 12px;
      font-style: normal;
      font-weight: 700;
      line-height: 20px;
      padding: 6px 20px;
      font-family: var(--wds2-type-action-filter-fontFamily);
    `;
    wdsButton.style.lineHeight = 'normal';
  }

  function observeForElementAndStyle() {
    // Create an observer to watch for changes in the body (for both wdsButton and other elements)
    const observer = new MutationObserver(() => {
      // Check if the necessary elements exist in the DOM
      if (wdsButton && secondaryNavWrapper && carNameWrapper && modelName) {
        // Styling the button inside the shadow DOM
        if (wdsButton?.shadowRoot) {
          const shadowButton = wdsButton.shadowRoot.querySelector('button');
          if (shadowButton) {
            applyButtonStyles(shadowButton);
          } else {
            // Observer for shadowRoot if the button isn't found immediately
            const shadowObserver = new MutationObserver(() => {
              const shadowBtn = wdsButton.shadowRoot.querySelector('button');
              if (shadowBtn) {
                applyButtonStyles(shadowBtn);
                shadowObserver.disconnect(); // Disconnect once styled
              }
            });
            shadowObserver.observe(wdsButton.shadowRoot, { childList: true, subtree: true });
          }
        }

        // Disconnect the main observer once the elements are processed
        observer.disconnect();
      }
    });

    // Start observing the body for the addition of relevant elements
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (isDesktop()) {
    dropdownMenu.className = 'secondary-nav__dropdown--desktop';
  }

  wdsButton?.addEventListener('click', () => {
    const url = wdsButton.getAttribute('data-src');
    if (url) {
      window.location.href = url;
    }
  });

  // Add click event listeners to nav links
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent default link behavior
      setSecondaryNavActiveLink(link);
      window.location.href = link.href; // Navigate to the clicked link
    });
  });

  observeForElementAndStyle();
}

// Function to bind events to a dynamically added dropdown element
function bindOverflowDropdown(block) {
  const overflowOption = block.querySelector('#secondary-nav-overflow-option');
  const overflowDropDownIcon = block.querySelector('#secondary-nav-overflow-dropdown-icon');
  const overflowDropdown = block.querySelector('#secondary-nav-overflow-dropdown');

  let isDesktopDropdownVisible = false;

  // Function to show or hide the desktop dropdown
  function toggleDesktopDropdown() {
    isDesktopDropdownVisible = !isDesktopDropdownVisible;
    toggleDropdown(
      isDesktopDropdownVisible,
      overflowDropdown,
      'flex',
      300,
      overflowOption,
      overflowDropDownIcon,
    );
  }

  function handleKeyDownDesktop(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      toggleDesktopDropdown();
    }
  }

  overflowOption.addEventListener('click', toggleDesktopDropdown);
  overflowOption.addEventListener('keydown', handleKeyDownDesktop);
}

function isValidCta(cta) {
  // Check if the CTA structure contains the required elements
  return cta && cta.querySelector('.button-container a');
}

// Function to build the CTA button HTML
function buildCta(cta) {
  const anchor = cta.querySelector('.button-container a');
  const url = anchor.getAttribute('href') || '#';
  const title = anchor.getAttribute('title') || '';
  const clsList = (anchor.getAttribute('class') || '').split(' ');
  const variant = clsList[1] || 'secondary';

  // Create the <wds-button> element
  const button = document.createElement('wds-button');
  const span = document.createElement('span');
  button.setAttribute('background', 'light');
  button.setAttribute('variant', variant);
  button.setAttribute('data-src', url);
  span.textContent = title;
  button.appendChild(span);

  // Instrumentation
  moveInstrumentation(anchor, span);

  return button;
}

// Function to build each navigation item
function buildNavItem(item) {
  // Validate the required elements
  const anchor = isValidCta(item);
  const titleElement = item.children[0];
  const listItem = document.createElement('li');

  moveInstrumentation(item, listItem);

  if (!anchor || !titleElement) {
    return listItem.outerHTML;
  }

  // Crate link
  const link = document.createElement('a');

  // Set attributes and content
  const url = anchor.getAttribute('href') || '#';
  const title = titleElement.textContent?.trim() || 'Untitled';
  link.className = 'secondary-nav__link wds2-type-body-regular-s';
  link.setAttribute('data-id', title.replace(/\s+/g, '').toLowerCase());
  link.href = url;
  link.textContent = title;
  listItem.appendChild(link);

  // Move instrumentation if applicable
  const paragraphElement = titleElement.querySelector('p');
  if (paragraphElement) {
    moveInstrumentation(paragraphElement, link);
  }

  // Return the list item as an HTML string or DOM node
  return listItem.outerHTML;
}

export default function decorate(block) {
  // Ensure the block exists and has children
  if (!block || !block.children) {
    return;
  }

  const elements = Array.from(block.children);
  const firstElement = elements[0];
  const ctaButton = elements[1] || null;
  const anchors = elements.slice(2) || [];

  const firstChild = firstElement?.children[0];
  const modelName = firstChild?.textContent || '';

  const container = document.createElement('div');
  container.className = 'secondary-nav';

  const wrapper = document.createElement('div');
  wrapper.className = 'secondary-nav__wrapper';
  wrapper.id = 'secondary-nav-wrapper';

  const carNameWrapper = document.createElement('div');
  carNameWrapper.className = 'secondary-nav__car-name-wrapper';
  carNameWrapper.id = 'secondary-nav-car-name-wrapper';

  const iconWrapper = document.createElement('div');
  iconWrapper.className = 'secondary-nav__icon-wrapper';
  iconWrapper.id = 'secondary-nav-icon-wrapper';

  const icon = document.createElement('wds-icon');
  icon.setAttribute('iconName', 'icon-down-arrow');
  icon.className = 'secondary-nav__dropdown-icon';
  icon.id = 'secondary-nav-dropdown-icon';

  iconWrapper.appendChild(icon);

  const modelNameElement = document.createElement('span');
  modelNameElement.className = 'secondary-nav__car-name wds2-type-body-bold-s';
  modelNameElement.id = 'secondary-nav-model-name';
  modelNameElement.textContent = modelName;

  carNameWrapper.appendChild(iconWrapper);
  carNameWrapper.appendChild(modelNameElement);
  const paragraph = firstChild?.querySelector('p');
  if (paragraph) {
    moveInstrumentation(paragraph, modelNameElement);
  }

  const dropdownMenu = document.createElement('div');
  dropdownMenu.className = 'secondary-nav__dropdown--desktop';
  dropdownMenu.id = 'secondary-nav-dropdown-menu';

  const nav = document.createElement('nav');
  const ul = document.createElement('ul');
  ul.className = 'secondary-nav__list';
  nav.appendChild(ul);
  dropdownMenu.appendChild(nav);

  // Create a new parent div for the dropdown and the button
  const linksButtonSection = document.createElement('div');
  linksButtonSection.className = 'secondary-nav__links-button-section';
  linksButtonSection.appendChild(dropdownMenu);

  if (isValidCta(ctaButton)) {
    const ctaButtonElement = buildCta(ctaButton);
    if (ctaButtonElement) {
      linksButtonSection.appendChild(ctaButtonElement);
    }
  }

  wrapper.appendChild(carNameWrapper);
  wrapper.appendChild(linksButtonSection);

  block.textContent = '';
  container.appendChild(wrapper);
  block.appendChild(container);
  block.classList.add('secondary-nav-comp');

  function renderSecondaryNavItems() {
    const secondaryNavWrapper = container.querySelector('#secondary-nav-wrapper');
    const modelNameWrapper = container.querySelector('#secondary-nav-car-name-wrapper');
    const dropdownList = container.querySelector('#secondary-nav-dropdown-menu .secondary-nav__list');

    // Ensure the necessary elements exist
    if (!secondaryNavWrapper || !modelNameWrapper || !dropdownList) return;

    // Start rendering logic
    dropdownList.innerHTML = '';
    // Calculate available space considering the minimum padding of 32px between sections (64px)
    const availableSpace = secondaryNavWrapper.offsetWidth - (modelNameWrapper.offsetWidth + (document.querySelector('wds-button')?.offsetWidth || 0) + 64);
    const visibleItems = [];
    const overflowItems = [];
    let dropdownItemGap = 0;

    anchors?.forEach((anchor) => {
      const navItemHtml = buildNavItem(anchor);
      const tempItem = document.createElement('li');
      tempItem.innerHTML = navItemHtml;

      dropdownList.appendChild(tempItem);
      dropdownItemGap += 24;

      // Check if adding this item exceeds the available space
      if ((dropdownList.offsetWidth + dropdownItemGap) > availableSpace) {
        overflowItems.push(navItemHtml);
        dropdownList.removeChild(tempItem);
      } else {
        visibleItems.push(navItemHtml);
      }
    });

    if (visibleItems.length > 0) {
      // Render visible items
      dropdownList.innerHTML = visibleItems.map((item) => item).join('');
    }

    // If there are overflow items, create a "More" dropdown
    if (overflowItems.length > 0) {
      // Create the main list item for overflow
      const overflowHtml = document.createElement('li');
      overflowHtml.className = 'secondary-nav__overflow-li';

      // Create the overflow option div
      const overflowOptionDiv = document.createElement('div');
      overflowOptionDiv.className = 'secondary-nav__overflow-option';
      overflowOptionDiv.tabIndex = 0;
      overflowOptionDiv.id = 'secondary-nav-overflow-option';

      // Create the title span
      const overflowTitle = document.createElement('span');
      overflowTitle.className = 'secondary-nav__overflow-title wds2-type-body-regular-s';
      overflowTitle.textContent = 'More';

      // Create the icon
      const overflowIcon = document.createElement('wds-icon');
      overflowIcon.setAttribute('iconName', 'icon-down-arrow');
      overflowIcon.className = 'secondary-nav__overflow-dropdown-icon';
      overflowIcon.id = 'secondary-nav-overflow-dropdown-icon';

      // Append title and icon to the overflow option div
      overflowOptionDiv.appendChild(overflowTitle);
      overflowOptionDiv.appendChild(overflowIcon);

      // Create the overflow dropdown div
      const overflowDropdownDiv = document.createElement('div');
      overflowDropdownDiv.className = 'secondary-nav__overflow-dropdown';
      overflowDropdownDiv.id = 'secondary-nav-overflow-dropdown';

      // Create the list for overflow items
      const overflowList = document.createElement('ul');
      overflowList.className = 'secondary-nav__overflow-option-list';

      // Populate list with overflow items
      overflowItems.forEach((item) => {
        const listItem = item;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = listItem;

        // Now, append the first child (the actual element) of the tempDiv
        overflowList.appendChild(tempDiv.firstChild);
      });

      // Append list to dropdown div
      overflowDropdownDiv.appendChild(overflowList);

      // Append overflow option div and dropdown div to the main list item
      overflowHtml.appendChild(overflowOptionDiv);
      overflowHtml.appendChild(overflowDropdownDiv);
      // Append the main list item to the dropdown menu
      dropdownList.appendChild(overflowHtml);

      bindOverflowDropdown(overflowHtml);
    }

    initializeSecondaryNavActiveLink();
  }

  setTimeout(renderSecondaryNavItems, 100);
  bindEvent(block);
}