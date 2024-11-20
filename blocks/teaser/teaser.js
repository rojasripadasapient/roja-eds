/*
import { moveInstrumentation } from '../../scripts/scripts.js';
function buildCta(cta) {
  const anchor = cta.querySelector('.button-container a');
  const url = anchor.getAttribute('href') || '#';
  const title = anchor.getAttribute('title') || 'Default Title';
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
console.log(button);
  // Instrumentation
  moveInstrumentation(anchor, span);

  return button;
}


export default async function decorate(block) {
    // const features = [...block.children]
    //   .slice(0, 8)
    //   .map((row) => row.firstElementChild);
    //   console.log(features);
    const elements = [...block.children].slice(1, 6);
    console.log(elements);
    const ctaElement = buildCta(elements[3]);
    console.log(ctaElement);
    //buildCta(elements[5]);
    console.log(elements[5]);
    const [imageAlt, headline, subheadline] = elements;
    const pictureContainer = block.querySelector('picture');
    const img = pictureContainer?.querySelector('img');

    if (img) {
      if (!img.getAttribute('alt') || img.getAttribute('alt') === '') {
        img.setAttribute('alt', imageAlt?.textContent.trim());
      }
    }

    // if (ctaButtonElement) {
    //   wrapper.appendChild(ctaButtonElement);
    // }

    // const image = document.createElement('img');
    // image.src = 'https://via.placeholder.com/600x400';
    // image.alt = imageAlt?.textContent?.trim() || 'Sample Image';

    // Check if headline and subheadline are defined
    if (headline) {
      headline.innerHTML = headline?.innerHTML || 'Sample Title';
    }

    if (subheadline) {
      subheadline.innerHTML = subheadline?.innerHTML || 'This is the description text for the image.';
    }

    // Check if CTA element exists
    // if (cta) {
    //   cta.innerHTML = cta?.innerHTML || 'Call to Action';
    //   cta.href = cta?.href || '#';
    //   console.log(cta);
    // }

    // Create a new container for the dynamic content
    const container = document.createElement('div');
    container.innerHTML = `
      <div class="teaser__container flex">
        <div class="teaser__title wds2-type-display-m mobile-title">${headline ? headline.innerHTML : 'Default Headline'}</div>
          <div class="teaser__image">
              ${pictureContainer ? pictureContainer.outerHTML : ''}
          </div>
          <div class="teaser__text">
              <div class="teaser__title wds2-type-display-m desktop-title">${headline ? headline.innerHTML : 'Default Headline'}</div>
              <div class="teaser__description wds2-type-body-light-m">${subheadline ? subheadline.innerHTML : 'Default Subheadline'}</div>
              <div class="teaser__cta">
              <a href="${ctaElement?.url || '#'}" class="teaser__cta-button wds2-type-action-button-m">${ctaElement.innerHTML}</a>
          </div>
          </div>
      </div>
    `;

    // Append the dynamically created container to the block
    block.innerHTML = '';
    block.classList.add('teaser-comp');
    block.appendChild(container);
  }
*/

import { moveInstrumentation } from '../../scripts/scripts.js';

// Helper function to create a button from the given CTA details
function buildCta(cta, ctaTitle, ctaVariant) {
  const anchor = cta?.querySelector('.button-container a');
  if (!anchor) return null;

  const url = anchor.getAttribute('href') || '#';
  const title = ctaTitle ? ctaTitle.textContent : (anchor.getAttribute('title') || '');
  const variant = ctaVariant ? ctaVariant.textContent : (anchor.classList[1] || 'secondary');

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

// Helper function to bind the CTA button click event
function bindEvent(button) {
  button.addEventListener('click', () => {
    const url = button.getAttribute('data-src');
    if (url && url !== '#') {
      window.location.href = url;
    } else {
      console.log('No valid URL found');
    }
  });
}

// Function to process and render Teaser Variant 1
function renderTeaserVariantOne(block) {
  const elements = [...block.children].slice(1, 6);
  const ctaElement = buildCta(elements[3]);
  const [imageAlt, headline, subheadline] = elements;
  const pictureContainer = block.querySelector('picture');
  const img = pictureContainer?.querySelector('img');

  if (img && (!img.getAttribute('alt') || img.getAttribute('alt') === '')) {
    img.setAttribute('alt', imageAlt?.textContent.trim());
  }

  headline.innerHTML = headline?.innerHTML || 'Sample Title';
  subheadline.innerHTML = subheadline?.innerHTML || 'This is the description text for the image.';

  const container = document.createElement('div');
  container.innerHTML = `
    <div class="variantone__container flex">
      <div class="teaser__title wds2-type-display-m mobile-title">${headline.innerHTML}</div>
      <div class="teaser__image">${pictureContainer ? pictureContainer.outerHTML : ''}</div>
      <div class="teaser__text">
        <div class="teaser__title wds2-type-display-m desktop-title">${headline.innerHTML}</div>
        <div class="teaser__description wds2-type-body-light-m">${subheadline.innerHTML}</div>
        <div class="teaser__cta">${ctaElement ? ctaElement.outerHTML : ''}</div>
      </div>
    </div>
  `;

  block.innerHTML = ''; // Clear existing content
  block.classList.add('teaser-comp');
  block.appendChild(container);

  // Bind the CTA event
  const ctaButton = container.querySelector('wds-button');
  if (ctaButton) bindEvent(ctaButton);
}

// Function to process and render Teaser Variant 2
function renderTeaserVariantTwo(block) {
  const elements = [...block.children].slice(5, 11).map(row => row.firstElementChild);
  const elements2 = [...block.children].slice(11, 18).map(row => row.firstElementChild);

  const [imageAlt1, headline1, subheadline1] = elements;
  const [imageAlt2, headline2, subheadline2] = elements2;

  const pictureContainers = block.querySelectorAll('picture');
  const images = Array.from(pictureContainers).map(picture => picture.querySelector('img'));

  // Set alt attributes for images if missing
  images.forEach((img, index) => {
    if (img && !img.getAttribute('alt')) {
      img.setAttribute('alt', index === 0 ? imageAlt1?.textContent.trim() : imageAlt2?.textContent.trim());
    }
  });

  const container = document.createElement('div');
  container.innerHTML = `
    <div class="varianttwo__container flex">
      <!-- Section 1 -->
      <div class="teaser__section">
        <div class="teaser__image">${pictureContainers[0]?.outerHTML || ''}</div>
        <div class="teaser__text">
          <div class="teaser__title wds2-type-display-m">${headline1?.innerHTML || 'Default Headline'}</div>
          <div class="teaser__description wds2-type-body-light-m">${subheadline1?.innerHTML || 'Default Subheadline'}</div>
          <div class="teaser__cta"></div>
        </div>
      </div>
      <!-- Section 2 -->
      <div class="teaser__section">
        <div class="teaser__image">${pictureContainers[1]?.outerHTML || ''}</div>
        <div class="teaser__text">
          <div class="teaser__title wds2-type-display-m">${headline2?.innerHTML || 'Default Headline'}</div>
          <div class="teaser__description wds2-type-body-light-m">${subheadline2?.innerHTML || 'Default Subheadline'}</div>
          <div class="teaser__cta"></div>
        </div>
      </div>
    </div>
  `;

  block.innerHTML = ''; // Clear existing content
  block.classList.add('teaser-comp');
  block.appendChild(container);

  // Insert and bind CTA events
  const ctaContainers = container.querySelectorAll('.teaser__cta');
  if (ctaContainers.length > 0) {
    const ctaButton1 = buildCta(elements[3], elements[4], elements[5]);
    const ctaButton2 = buildCta(elements2[3], elements2[4], elements2[5]);

    if (ctaButton1) {
      ctaContainers[0].appendChild(ctaButton1);
      bindEvent(ctaButton1);
    }

    if (ctaButton2) {
      ctaContainers[1].appendChild(ctaButton2);
      bindEvent(ctaButton2);
    }
  }
}

// Main function to manage variants and rendering
export default async function decorate(block) {
  const teaserVariantVal = block.firstElementChild?.innerText.trim() || '';

  // Get all the variant blocks, except for the first one (the variant selector)
  const allVariants = [...block.children].slice(1);

  // Hide all variant blocks initially
  allVariants.forEach(variantBlock => {
    variantBlock.style.display = 'none';
  });

  // Show the selected variant based on the teaserVariantVal
  if (teaserVariantVal === 'var1') {
    renderTeaserVariantOne(block);
  } else if (teaserVariantVal === 'var2') {
    renderTeaserVariantTwo(block);
  }

  // Bind CTA event for the block (just in case it's needed for the block)
  bindEvent(block);
}
