import { loadScript } from '../../scripts/aem.js';

/**
* Loads and decorates the footer
* @param {Element} block The footer block element
*/

export default async function decorate(block) {
  const footerElement = document.createElement('div');
  footerElement.id = 'nissan_global_footer';
  footerElement.classList.add('helios', 'nissan-eds-main-footer');

  block.textContent = '';
  block.appendChild(footerElement);

  loadScript('https://header-footer-global-np.heliosnissan.net/Nissan/header-footer/es-MX/js/vendor/jquery-2.2.4.min.js');
  loadScript('https://header-footer-global-np.heliosnissan.net/Nissan/header-footer/es-MX/js/vendor/modernizr.min.js');
  loadScript('https://header-footer-global-np.heliosnissan.net/Nissan/header-footer/es-MX/js/PACE-header-footer-v3.min.js');
}