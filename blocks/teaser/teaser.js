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

function buildCta(cta) {
  console.log(cta);
  const anchor = cta.querySelector('.button-container a');
  const url = anchor.getAttribute('href') || '#';
  const title = anchor.getAttribute('title') || 'Default Title';
  const clsList = (anchor.getAttribute('class') || '').split(' ');
  const variant = clsList[3] || 'tertiary';

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
  if (wdsButton) {
    wdsButton.addEventListener('click', () => {
      const url = wdsButton.getAttribute('data-src');
      if (url && url !== '#') {
        window.location.href = url;
      } else {
        console.log('No valid URL found');
      }
    });
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
    headline.innerHTML = headline?.innerHTML || 'Sample Title';
  }

  if (subheadline) {
    subheadline.innerHTML = subheadline?.innerHTML || 'This is the description text for the image.';
  }

  const container = document.createElement('div');
  container.innerHTML = `
    <div class="variantone__container flex">
      <div class="teaser__title wds2-type-display-m mobile-title">${headline ? headline.innerHTML : 'Default Headline'}</div>
      <div class="teaser__image">${pictureContainer ? pictureContainer.outerHTML : ''}</div>
      <div class="teaser__text">
        <div class="teaser__title wds2-type-display-m desktop-title">${headline ? headline.innerHTML : 'Default Headline'}</div>
        <div class="teaser__description wds2-type-body-light-m">${subheadline ? subheadline.innerHTML : 'Default Subheadline'}</div>
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

function teaserVariantTwo(block) {
  // Select the elements for the two sections (slicing the children of the block)
  const var2elements = [...block.children].slice(5, 9).map((row) => row.firstElementChild);
  const var2elements2 = [...block.children].slice(11, 16).map((row) => row.firstElementChild);
  console.log(var2elements);
  console.log(var2elements2);

  // Log to check the size and contents of var2elements
  console.log('var2elements:', var2elements);
  console.log('var2elements length:', var2elements.length); // Check how many elements are in the array

  // Get the CTA buttons for each section, with fallback in case they don't exist
  const ctaElement1 = var2elements[3] ? buildCta(var2elements[3]) : null;
  const ctaElement2 = var2elements2[3] ? buildCta(var2elements2[3]) : null;

  // Log the CTA elements to see if they are being built
  console.log('ctaElement1:', ctaElement1);
  console.log('ctaElement2:', ctaElement2);


  // Extracting image alt, headline, and subheadline for each section
  const [imageAlt1, headline1, subheadline1] = var2elements;
  const [imageAlt2, headline2, subheadline2] = var2elements2;

  console.log(imageAlt1, headline1, subheadline1, imageAlt2, headline2, subheadline2);

  // Select all the picture containers (assuming there are two images)
  const pictureContainers = block.querySelectorAll('picture');
  const images = Array.from(pictureContainers).map(picture => picture.querySelector('img'));

  // Set alt attributes for the images
  images.forEach((img, index) => {
    if (img && !img.getAttribute('alt')) {
      img.setAttribute('alt', index === 0 ? imageAlt1?.textContent.trim() : imageAlt2?.textContent.trim());
    }
  });

  // Create the container for the teaser
  const container = document.createElement('div');
  container.innerHTML = `
    <div class="varianttwo__container">
      <!-- Section 1: First Image, Headline, Subheadline, and CTA -->
      <div class="teaser__section">
        <div class="teaser__image">${pictureContainers[0] ? pictureContainers[0].outerHTML : ''}</div>
        <div class="teaser__text">
          <div class="teaser__title wds2-type-display-m desktop-title">${headline1 ? headline1.innerHTML : 'Default Headline'}</div>
          <div class="teaser__description wds2-type-body-light-m">${subheadline1 ? subheadline1.innerHTML : 'Default Subheadline'}</div>
          <div class="teaser__cta"></div>
        </div>
      </div>
      <!-- Section 2: Second Image, Headline, Subheadline, and CTA -->
      <div class="teaser__section">
        <div class="teaser__image">${pictureContainers[1] ? pictureContainers[1].outerHTML : ''}</div>
        <div class="teaser__text">
          <div class="teaser__title wds2-type-display-m desktop-title">${headline2 ? headline2.innerHTML : 'Default Headline'}</div>
          <div class="teaser__description wds2-type-body-light-m">${subheadline2 ? subheadline2.innerHTML : 'Default Subheadline'}</div>
          <div class="teaser__cta"></div>
        </div>
      </div>
    </div>
  `;

  // Insert the CTA buttons into each section
  const ctaContainer1 = container.querySelectorAll('.teaser__cta')[0]; // First CTA container
  const ctaContainer2 = container.querySelectorAll('.teaser__cta')[1]; // Second CTA container
  if (ctaElement1) ctaContainer1?.appendChild(ctaElement1);
  if (ctaElement2) ctaContainer2?.appendChild(ctaElement2);

  // Clear the original block content and append the new container
  block.innerHTML = '';
  block.classList.add('teaser-comp');
  block.appendChild(container);

  // Bind the event to handle button click (for navigation)
  bindEvent(block);
}


export default async function decorate(block) {
  const teaserVariant = [...block.children].slice(0, 1);
  const teaserVariantVal = teaserVariant[0].innerText.trim();

  if (teaserVariantVal === 'var1') {
    teaserVariantOne(block);
  } else if (teaserVariantVal === 'var2') {
    teaserVariantTwo(block);
  }

  bindEvent(block);
}
