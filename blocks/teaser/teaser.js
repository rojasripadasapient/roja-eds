import { moveInstrumentation } from '../../scripts/scripts.js';

function buildCta(cta, ctaTitle, ctaVariant) {
  const anchor = cta?.querySelector('.button-container a');
  if (!anchor) return null;
  const url = anchor.getAttribute('href') || '#';
  const title = ctaTitle ? ctaTitle.textContent : (anchor.getAttribute('title') || '');
  console.log(title);
  const variant = ctaVariant ? ctaVariant.textContent : (anchor.classList[3] || 'secondary');
  console.log(variant);
  const button = document.createElement('wds-button');
  const span = document.createElement('span');

  button.setAttribute('background', 'light');
  button.setAttribute('variant', variant);
  button.setAttribute('data-src', url);
  span.textContent = title;
  button.appendChild(span);

  moveInstrumentation(anchor, span);

  return button;
}

function bindEvent(block) {
  const wdsButton = block.querySelector('wds-button');
  if (wdsButton && !wdsButton._isEventBound) {  // Check if the event is already bound
    wdsButton.addEventListener('click', () => {
      const url = wdsButton.getAttribute('data-src');
      console.log(url);
      if (url && url !== '#') {
        window.location.href = url;
      } else {
        console.log('No valid URL found');
      }
    });
    wdsButton._isEventBound = true;  // Mark the event as bound
  }
}

function teaserVariantOne(block) {
  console.log("hei I am var1");
  const elements = [...block.children].slice(1, 6);
  const ctaElement = buildCta(elements[3]);
  const [imageAlt, headline, subheadline] = elements;
  const pictureContainer = block.querySelector('picture');
  const img = pictureContainer?.querySelector('img');

  if (img && (!img.getAttribute('alt') || img.getAttribute('alt') === '')) {
    img.setAttribute('alt', imageAlt?.textContent.trim());
  }

  if (headline) {
    headline.innerHTML = headline?.innerHTML || '';
  }

  if (subheadline) {
    subheadline.innerHTML = subheadline?.innerHTML || '';
  }

  const container = document.createElement('div');
  container.innerHTML = `
    <div class="variantone__container flex">
      <div class="teaser__title wds2-type-display-m mobile-title">${headline ? headline.innerHTML : ''}</div>
      <div class="teaser__image">${pictureContainer ? pictureContainer.outerHTML : ''}</div>
      <div class="teaser__text">
        <div class="teaser__title wds2-type-display-m desktop-title">${headline ? headline.innerHTML : ''}</div>
        <div class="teaser__description wds2-type-body-light-m">${subheadline ? subheadline.innerHTML : ''}</div>
        <div class="teaser__cta"></div>
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

import { moveInstrumentation } from '../../scripts/scripts.js';

function teaserVariantTwo(block) {
  // Select the elements for the two sections (slicing the children of the block)
  const var2elements = [...block.children].slice(5, 11).map((row) => row.firstElementChild);
  const var2elements2 = [...block.children].slice(11, 18).map((row) => row.firstElementChild);

  // Get the CTA buttons for each section, with fallback in case they don't exist
  const ctaElement1 = var2elements[3] ? buildCta(var2elements[3], var2elements[4], var2elements[5]) : null;
  const ctaElement2 = var2elements2[3] ? buildCta(var2elements2[3], var2elements2[4], var2elements2[5]) : null;

  // Extracting image alt, headline, and subheadline for each section
  const [imageAlt1, headline1, subheadline1] = var2elements;
  const [imageAlt2, headline2, subheadline2] = var2elements2;

  // Select all the picture containers (assuming there are two images for var2)
  const pictureContainers = block.querySelectorAll('picture');
  const images = Array.from(pictureContainers).map(picture => picture.querySelector('img'));

  // Ensure that the correct images are being assigned the correct alt text
  if (images[0] && (!images[0].getAttribute('alt') || images[0].getAttribute('alt') === '')) {
    images[0].setAttribute('alt', imageAlt1?.textContent.trim());
  }

  if (images[1] && (!images[1].getAttribute('alt') || images[1].getAttribute('alt') === '')) {
    images[1].setAttribute('alt', imageAlt2?.textContent.trim());
  }

  // Create the container for the teaser
  const container = document.createElement('div');
  container.innerHTML = `
    <div class="varianttwo__container flex">
      <!-- Section 1: First Image, Headline, Subheadline, and CTA -->
      <div class="teaser__section">
        <div class="teaser__image">${pictureContainers[1] ? pictureContainers[1].outerHTML : ''}</div>
        <div class="teaser__text">
          <div class="teaser__title wds2-type-display-m">${headline1 ? headline1.innerHTML : ''}</div>
          <div class="teaser__description wds2-type-body-light-m">${subheadline1 ? subheadline1.innerHTML : ''}</div>
          <div class="teaser__cta"></div>
        </div>
      </div>
      <!-- Section 2: Second Image, Headline, Subheadline, and CTA -->
      <div class="teaser__section">
        <div class="teaser__image">${pictureContainers[2] ? pictureContainers[2].outerHTML : ''}</div>
        <div class="teaser__text">
          <div class="teaser__title wds2-type-display-m">${headline2 ? headline2.innerHTML : ''}</div>
          <div class="teaser__description wds2-type-body-light-m">${subheadline2 ? subheadline2.innerHTML : ''}</div>
          <div class="teaser__cta"></div>
        </div>
      </div>
    </div>
  `;

  // Insert the CTA buttons into each section
  const ctaContainer1 = container.querySelectorAll('.teaser__cta')[0]; // First CTA container
  const ctaContainer2 = container.querySelectorAll('.teaser__cta')[1]; // Second CTA container

  // Ensure both CTA elements are not null before appending
  if (ctaElement1) {
    ctaContainer1?.appendChild(ctaElement1);
    const anchor1 = ctaElement1.querySelector('a');
    const span1 = ctaElement1.querySelector('span');
    if (anchor1 && span1) {
      moveInstrumentation(anchor1, span1); // Call for the first button only if both elements exist
    }
  } else {
    console.error('CTA Element 1 is null!');
  }

  if (ctaElement2) {
    ctaContainer2?.appendChild(ctaElement2);
    const anchor2 = ctaElement2.querySelector('a');
    const span2 = ctaElement2.querySelector('span');
    if (anchor2 && span2) {
      moveInstrumentation(anchor2, span2); // Call for the second button only if both elements exist
    }
  } else {
    console.error('CTA Element 2 is null!');
  }

  // Clear the original block content and append the new container
  block.innerHTML = '';
  block.classList.add('teaser-comp');
  block.appendChild(container);

  // Reinitialize inline editing for both sections to ensure AEM hooks are applied to dynamically added elements
  reinitializeInlineEditing(); // Call this to trigger AEM inline editing hooks
  bindEvent(ctaContainer1);  // Pass only the container of the first section
  bindEvent(ctaContainer2);  // Pass only the container of the second section
}

// Helper function to reinitialize inline editing (you may need to adapt this based on your AEM setup)
function reinitializeInlineEditing() {
  if (window && window.editable) {
    // Reinitialize inline editing hooks for your custom components
    window.editable.enableInlineEditing();
  }
}

export default async function decorate(block) {
  const teaserVariant = [...block.children].slice(0, 1);
  const teaserVariantVal = teaserVariant[0].innerText.trim();
  const allVariants = [...block.children].slice(1); // All the content except the first item (variant selector)

  allVariants.forEach(variantBlock => {
    variantBlock.style.display = 'none'; // Hide all blocks initially
  });

  if (teaserVariantVal === 'var1') {
    teaserVariantOne(block);
  } else if (teaserVariantVal === 'var2') {
    teaserVariantTwo(block);
  }

  bindEvent(block);
}