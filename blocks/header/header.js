import { loadCSS } from '../../../scripts/aem.js';

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
}