import { loadCSS } from '../../../scripts/aem.js';
import { isDesktop } from '../../../scripts/utils.js';

function handleStickyNavVisibility() {
  const mainNav = document.querySelector('#nissan_global_header'); // Main navigation element
  const secondaryNav = document.querySelector('.secondary-nav-container'); // Secondary navigation element
  const stickyNav = document.querySelector('.sticky-navigation-container');

  if (!mainNav || !secondaryNav || !stickyNav) {
    return;
  }

  // Track visibility of both elements
  let isMainNavVisible = true;
  let isSecondaryNavVisible = true;

  // Function to toggle the sticky navigation
  function toggleStickyNav() {
    // Show sticky nav only when both elements are out of the viewport
    if (!isMainNavVisible && !isSecondaryNavVisible) {
      stickyNav.classList.add('visible'); // Show sticky nav
    } else {
      stickyNav.classList.remove('visible'); // Hide sticky nav
    }
  }

  // Intersection Observer callback
  function observerCallback(entries) {
    entries.forEach((entry) => {
      if (entry.target === mainNav) {
        isMainNavVisible = entry.isIntersecting; // Update main nav visibility
      } else if (entry.target === secondaryNav) {
        isSecondaryNavVisible = entry.isIntersecting; // Update secondary nav visibility
      }
    });

    toggleStickyNav(); // Update sticky nav visibility
  }

  // Intersection Observer setup
  const observer = new IntersectionObserver(observerCallback, {
    root: null, // Observe within the viewport
    threshold: 0, // Trigger as soon as any part is visible
  });

  // Observe both main and secondary navigation
  observer.observe(mainNav);
  observer.observe(secondaryNav);
}

/**
* loads and decorates the header, mainly the nav
* @param {Element} block The header block element
*/

export default async function decorate(block) {
  const headerElement = document.createElement('div');
  headerElement.id = 'nissan_global_header';
  headerElement.classList.add('helios', 'nissan-eds-main-header');
  block.appendChild(headerElement);

  loadCSS('https://header-footer-global-np.heliosnissan.net/Nissan/header-footer/es-MX/css/PACE-header-footer-v3.min.css');

  if (isDesktop()) {
    handleStickyNavVisibility();
  }
}