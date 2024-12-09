import { moveInstrumentation } from '../../scripts/scripts.js';
import { TEASER_BLOCK_VARIATION } from '../../scripts/constant.js';
import {
  isDesktop,
  isTablet,
  isMobile,
  isLargeDesktop,
} from '../../scripts/utils.js';

function generateTeaserHeader(headline) {
  if (!headline) return;

  const titleElement = headline.querySelector('p');

  if (!titleElement) {
    return '';
  }

  const span = document.createElement('span');
  let updatedClass = 'wds2-type-display-m';

  if (isMobile() || isTablet()) {
    updatedClass = 'wds2-type-display-s';
  } else if (isDesktop() || isLargeDesktop()) {
    updatedClass = 'wds2-type-display-m';
  }

  span.className = `${updatedClass}`;
  span.textContent = titleElement.textContent;

  moveInstrumentation(titleElement, span);

  return span.outerHTML;
}

// Function to apply subheadline and add both classes (light-m and teaser-variant1__desc)
function applySubheadlineClass(subheadline) {
  if (!subheadline) return;

  const pTag = subheadline.querySelector('p');
  if (pTag) {
    pTag.classList.add('wds2-type-body-light-m', 'teaser-variant1__desc');
  }
}

// Function to build CTA (Call-to-Action) button
function buildCta(cta, ctaTitle, ctaVariant) {
  const anchor = cta?.querySelector('.button-container a');
  const elementP = ctaTitle?.querySelector('p');

  if (!anchor) return null;

  const url = anchor.getAttribute('href') || '#';
  const title = ctaTitle ? ctaTitle.textContent : (anchor.getAttribute('title') || '');
  const clsList = anchor.getAttribute('class')?.split(' ')[1] || 'tertiary';
  const variant = ctaVariant ? ctaVariant.textContent : clsList;
  const button = document.createElement('wds-button');
  const span = document.createElement('span');

  button.setAttribute('background', 'light');
  button.setAttribute('variant', variant);
  button.setAttribute('data-src', url);
  span.textContent = title;
  span.classList.add('teasercta-text', 'wds2-type-action-button-m');
  button.appendChild(span);

  if (elementP) {
    moveInstrumentation(elementP, span);
  } else {
    moveInstrumentation(anchor, span);
  }

  return button;
}

// Function to bind the event to the CTA button
function bindEvent(block) {
  const wdsButton = block.querySelector('wds-button');
  if (wdsButton && !wdsButton.isEventBound) {
    wdsButton.addEventListener('click', () => {
      const url = wdsButton.getAttribute('data-src');
      if (url && url !== '#') {
        window.location.href = url;
      }
    });
    wdsButton.isEventBound = true;
  }
}

// Function to handle background color based on the provided value
function addBgColor(bgColor, block) {
  const bgColorVal = bgColor || '';
  const parentElem = block.closest('.teaser-container');
  if (parentElem) {
    if (bgColorVal === 'false' || bgColorVal === '') {
      parentElem.classList.add('no-bg');
    } else {
      parentElem.classList.remove('no-bg');
    }
  }
}

// Function to handle teaser variant 1
function teaserVariantOne(bgColor, block) {
  const elements = [...block.children].slice(2, 7);
  const ctaElement = buildCta(elements[3]);
  const [imageAlt, headline, subheadline] = elements;
  const pictureContainer = block.querySelector('picture');
  const img = pictureContainer?.querySelector('img');

  addBgColor(bgColor, block);

  if (img && (!img.getAttribute('alt') || img.getAttribute('alt') === '')) {
    img.setAttribute('alt', imageAlt?.textContent.trim());
  }

  if (subheadline) {
    subheadline.innerHTML = subheadline?.innerHTML || '';
  }

  applySubheadlineClass(subheadline);

  const container = document.createElement('div');
  container.classList.add('container');
  container.innerHTML = `
    <div class="row">
      <div class="col-sm-2 col-md-12 col-l-12 col-xl-12">
        <div class="variantone__container">
          <div class="teaser__image">${pictureContainer ? pictureContainer.outerHTML : ''}</div>
          <div class="teaser__text">
            <div class="teaser__title desktop-title">${headline ? generateTeaserHeader(headline) : ''}</div>
            <div class="teaser__description">${subheadline ? subheadline.innerHTML : ''}</div>
            <div class="teaser__cta"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  const ctaContainer = container.querySelector('.teaser__cta');
  ctaContainer?.appendChild(ctaElement);

  block.innerHTML = '';
  block.classList.add('teaser-comp');
  block.appendChild(container);

  bindEvent(block);
}

// Function to handle teaser variant 2
function teaserVariantTwo(bgColor, block) {
  const var2elements = [...block.children].slice(6, 12).map((row) => row.firstElementChild);
  const var2elements2 = [...block.children].slice(12, 18).map((row) => row.firstElementChild);
  const ctaElement1 = var2elements[3]
    ? buildCta(var2elements[3], var2elements[4], var2elements[5])
    : null;
  const ctaElement2 = var2elements2[3]
    ? buildCta(var2elements2[3], var2elements2[4], var2elements2[5])
    : null;
  const [imageAlt1, headline1, subheadline1] = var2elements;
  const [imageAlt2, headline2, subheadline2] = var2elements2;
  const pictureContainers = block.querySelectorAll('picture');

  const images = Array.from(pictureContainers).map((picture) => picture.querySelector('img'));

  if (images[0] && (!images[0].getAttribute('alt') || images[0].getAttribute('alt') === '')) {
    images[0].setAttribute('alt', imageAlt1?.textContent.trim());
  }

  if (images[1] && (!images[1].getAttribute('alt') || images[1].getAttribute('alt') === '')) {
    images[1].setAttribute('alt', imageAlt2?.textContent.trim());
  }

  addBgColor(bgColor, block);

  const container = document.createElement('div');
  container.classList.add('container');
  container.innerHTML = `
    <div class="row">
      <div class="col-sm-2 col-md-12 col-l-12 col-xl-12">
        <div class="varianttwo__container flex">
          <div class="teaser__section">
            <div class="teaser__image">${pictureContainers[0] ? pictureContainers[0].outerHTML : ''}</div>
            <div class="teaser__text">
              <div class="teaser__title">${headline1 ? headline1.innerHTML : ''}</div>
              <div class="teaser__description">${subheadline1 ? subheadline1.innerHTML : ''}</div>
              <div class="teaser__cta"></div>
            </div>
          </div>
          <div class="teaser__section">
            <div class="teaser__image">${pictureContainers[1] ? pictureContainers[1].outerHTML : ''}</div>
            <div class="teaser__text">
              <div class="teaser__title">${headline2 ? headline2.innerHTML : ''}</div>
              <div class="teaser__description">${subheadline2 ? subheadline2.innerHTML : ''}</div>
              <div class="teaser__cta"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const teaserTitles = container.querySelectorAll('.teaser__title p');
  teaserTitles.forEach((pTag) => {
    pTag.classList.add('wds2-type-display-xs');
  });

  const teaserDescriptions = container.querySelectorAll('.teaser__description p');
  teaserDescriptions.forEach((pTag) => {
    pTag.classList.add('wds2-type-body-light-m');
  });

  const ctaContainer1 = container.querySelectorAll('.teaser__cta')[0];
  const ctaContainer2 = container.querySelectorAll('.teaser__cta')[1];

  if (ctaElement1) ctaContainer1?.appendChild(ctaElement1);
  if (ctaElement2) ctaContainer2?.appendChild(ctaElement2);

  block.innerHTML = '';
  block.classList.add('teaser-comp');
  block.appendChild(container);

  bindEvent(ctaContainer1);
  bindEvent(ctaContainer2);
}

// Main export function that decorates the block based on variant
export default async function decorate(block) {
  const teaserVariant = [...block.children].slice(1, 2);
  const teaserVariantVal = teaserVariant[0].innerText.trim();
  const allVariants = [...block.children].slice(1);
  const bgColorElem = [...block.children].slice(0, 1);
  const bgColor = bgColorElem[0]?.querySelector('p')?.textContent;

  allVariants.forEach((variantBlock) => { variantBlock.style.display = 'none'; });

  if (teaserVariantVal === TEASER_BLOCK_VARIATION.VARIANT_1) {
    teaserVariantOne(bgColor, block);
  } else if (teaserVariantVal === TEASER_BLOCK_VARIATION.VARIANT_2) {
    teaserVariantTwo(bgColor, block);
  }

  bindEvent(block);
}