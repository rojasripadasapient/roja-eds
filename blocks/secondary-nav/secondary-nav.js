import { moveInstrumentation } from '../../../../scripts/scripts.js';
import { isDesktop, isMobile } from '../../../../scripts/utils.js';

// Function to set the active link
function setActiveLink(link) {
  const navLinks = document.querySelectorAll('.sticky-nav__link');
  navLinks.forEach((navLink) => navLink.classList.remove('active'));
  link.classList.add('active');

  // Store both the link name and URL in localStorage
  const activeLinkData = {
    id: link.getAttribute('data-id'),
    pathname: new URL(link.href).pathname,
  };
  sessionStorage.setItem('activeNavLink', JSON.stringify(activeLinkData));
}

// Function to initialize the active link from localStorage
function initializeActiveLink() {
  const activeLinkData = JSON.parse(sessionStorage.getItem('activeNavLink'));
  if (activeLinkData) {
    const currentPathname = window.location.pathname;
    const activeLink = document.querySelector(`.sticky-nav__link[data-id="${activeLinkData.id}"]`);

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
  const stickyNavWrapper = block.querySelector('#sticky-nav-wrapper');
  const carNameWrapper = block.querySelector('#car-name-wrapper');
  const modelName = block.querySelector('#model-name');
  const dropdownMenu = block.querySelector('#dropdown-menu');
  const dropdownIcon = block.querySelector('#dropdown-icon');
  const iconWrapper = block.querySelector('#icon-wrapper');
  const wdsButton = block.querySelector('wds-button');
  const navLinks = block.querySelectorAll('.sticky-nav__link');

  let isMobileDropdownVisible = false;

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

  function adjustCarNameVisibilityForSmallerDevices() {
    if (!stickyNavWrapper || !wdsButton || !carNameWrapper || !modelName) return;

    if (isMobile()) {
      const totalWidth = stickyNavWrapper.offsetWidth;
      const ctaWidth = wdsButton.offsetWidth;
      const carNameWidth = carNameWrapper.offsetWidth;
      const requiredSpace = carNameWidth + ctaWidth + 20;

      modelName.style.display = totalWidth >= requiredSpace ? 'block' : 'none';
    } else {
      modelName.style.display = 'block';
    }
  }

  function observeForElementAndStyle() {
    // Create an observer to watch for changes in the body (for both wdsButton and other elements)
    const observer = new MutationObserver(() => {
      // Check if the necessary elements exist in the DOM
      if (wdsButton && stickyNavWrapper && carNameWrapper && modelName) {
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

        // Adjust car name visibility for smaller devices
        adjustCarNameVisibilityForSmallerDevices();

        // Disconnect the main observer once the elements are processed
        observer.disconnect();
      }
    });

    // Start observing the body for the addition of relevant elements
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Function to show or hide the mobile dropdown
  function toggleMobileDropdown() {
    isMobileDropdownVisible = !isMobileDropdownVisible;
    toggleDropdown(
      isMobileDropdownVisible,
      dropdownMenu,
      'block',
      300,
      dropdownIcon,
      iconWrapper,
    );
  }

  function handleKeyDownMobile(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      toggleMobileDropdown();
    }
  }

  function bindMobileListeners() {
    carNameWrapper.addEventListener('click', toggleMobileDropdown);
    carNameWrapper.addEventListener('keydown', handleKeyDownMobile);
  }

  function handleMobileResize() {
    isMobileDropdownVisible = false;
    dropdownMenu.className = 'sticky-nav__dropdown--mobile';
    carNameWrapper.tabIndex = 0;
    bindMobileListeners();
  }

  if (isDesktop()) {
    dropdownMenu.className = 'sticky-nav__dropdown--desktop';
  } else {
    handleMobileResize();
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
      setActiveLink(link);
      window.location.href = link.href; // Navigate to the clicked link
    });
  });

  observeForElementAndStyle();
}

// Function to bind events to a dynamically added dropdown element
function bindOverflowDropdown(block) {
  const overflowOption = block.querySelector('#overflow-option');
  const overflowDropDownIcon = block.querySelector('#overflow-dropdown-icon');
  const overflowDropdown = block.querySelector('#overflow-dropdown');

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
  link.className = 'sticky-nav__link wds2-type-disclaimer-regular';
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
  container.className = 'sticky-nav';

  const wrapper = document.createElement('div');
  wrapper.className = 'sticky-nav__wrapper';
  wrapper.id = 'sticky-nav-wrapper';

  const carNameWrapper = document.createElement('div');
  carNameWrapper.className = 'sticky-nav__car-name-wrapper';
  carNameWrapper.id = 'car-name-wrapper';

  const iconWrapper = document.createElement('div');
  iconWrapper.className = 'sticky-nav__icon-wrapper';
  iconWrapper.id = 'icon-wrapper';

  const icon = document.createElement('wds-icon');
  icon.setAttribute('iconName', 'icon-down-arrow');
  icon.className = 'sticky-nav__dropdown-icon';
  icon.id = 'dropdown-icon';

  iconWrapper.appendChild(icon);

  const modelNameElement = document.createElement('span');
  modelNameElement.className = 'sticky-nav__car-name wds2-type-disclaimer-bold';
  modelNameElement.id = 'model-name';
  modelNameElement.textContent = modelName;

  carNameWrapper.appendChild(iconWrapper);
  carNameWrapper.appendChild(modelNameElement);
  const paragraph = firstChild?.querySelector('p');
  if (paragraph) {
    moveInstrumentation(paragraph, modelNameElement);
  }

  const dropdownMenu = document.createElement('div');
  dropdownMenu.className = 'sticky-nav__dropdown--desktop';
  dropdownMenu.id = 'dropdown-menu';

  const nav = document.createElement('nav');
  const ul = document.createElement('ul');
  ul.className = 'sticky-nav__list';
  nav.appendChild(ul);
  dropdownMenu.appendChild(nav);

  wrapper.appendChild(carNameWrapper);
  wrapper.appendChild(dropdownMenu);

  if (isValidCta(ctaButton)) {
    const ctaButtonElement = buildCta(ctaButton);
    if (ctaButtonElement) {
      wrapper.appendChild(ctaButtonElement);
    }
  }

  block.textContent = '';
  container.appendChild(wrapper);
  block.appendChild(container);
  block.classList.add('sticky-nav-comp');

  function renderNavItems() {
    const observer = new MutationObserver(() => {
      const stickyNavWrapper = container.querySelector('#sticky-nav-wrapper');
      const modelNameWrapper = container.querySelector('#car-name-wrapper');
      const dropdownList = container.querySelector('#dropdown-menu .sticky-nav__list');

      // Ensure the necessary elements exist
      if (!stickyNavWrapper || !modelNameWrapper || !dropdownList) return;

      // Start rendering logic
      dropdownList.innerHTML = '';
      // Check for mobile screen size
      if (!isDesktop() && anchors?.length) {
        dropdownList.innerHTML = anchors.map(buildNavItem).join('');
        observer.disconnect(); // Disconnect observer once done
        return;
      }

      // Calculate available space considering the minimum padding of 32px between sections (64px)
      const availableSpace = stickyNavWrapper.offsetWidth - (modelNameWrapper.offsetWidth + (document.querySelector('wds-button')?.offsetWidth || 0) + 64);
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
        overflowHtml.className = 'sticky-nav__overflow-li';

        // Create the overflow option div
        const overflowOptionDiv = document.createElement('div');
        overflowOptionDiv.className = 'sticky-nav__overflow-option';
        overflowOptionDiv.tabIndex = 0;
        overflowOptionDiv.id = 'overflow-option';

        // Create the title span
        const overflowTitle = document.createElement('span');
        overflowTitle.className = 'sticky-nav__overflow-title wds2-type-disclaimer-regular';
        overflowTitle.textContent = 'More';

        // Create the icon
        const overflowIcon = document.createElement('wds-icon');
        overflowIcon.setAttribute('iconName', 'icon-down-arrow');
        overflowIcon.className = 'sticky-nav__overflow-dropdown-icon';
        overflowIcon.id = 'overflow-dropdown-icon';

        // Append title and icon to the overflow option div
        overflowOptionDiv.appendChild(overflowTitle);
        overflowOptionDiv.appendChild(overflowIcon);

        // Create the overflow dropdown div
        const overflowDropdownDiv = document.createElement('div');
        overflowDropdownDiv.className = 'sticky-nav__overflow-dropdown';
        overflowDropdownDiv.id = 'overflow-dropdown';

        // Create the list for overflow items
        const overflowList = document.createElement('ul');
        overflowList.className = 'sticky-nav__overflow-option-list';

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

      initializeActiveLink();

      observer.disconnect(); // Disconnect observer once done
    });

    // Start observing the body for changes in childList and subtree
    observer.observe(document.body, { childList: true, subtree: true });
  }

  renderNavItems();
  bindEvent(block);
}