import { moveInstrumentation } from '../../scripts/scripts.js';

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

// function teaserVariantTwo(block) {
//   // Select the elements for the two sections (slicing the children of the block)
//   const var2elements = [...block.children].slice(5, 11).map((row) => row.firstElementChild);
//   const var2elements2 = [...block.children].slice(11, 18).map((row) => row.firstElementChild);
//   console.log(var2elements);
//   console.log(var2elements2);

//   // Log to check the size and contents of var2elements
//   console.log('var2elements:', var2elements);
//   console.log('var2elements length:', var2elements.length); // Check how many elements are in the array

//   // Get the CTA buttons for each section, with fallback in case they don't exist
//   const ctaElement1 = var2elements[3] ? buildCta(var2elements[3], var2elements[4], var2elements[5] ) : null;
//   const ctaElement2 = var2elements2[3] ? buildCta(var2elements2[3] , var2elements2[4], var2elements2[5]) : null;

//   console.log(var2elements[3]);
//   console.log(var2elements[4]);
//   console.log(var2elements[5]);

//   console.log(var2elements2[3]);
//   console.log(var2elements2[4]);
//   console.log(var2elements2[5]);

//   // Log the CTA elements to see if they are being built
//   console.log('ctaElement1:', ctaElement1);
//   console.log('ctaElement2:', ctaElement2);


//   // Extracting image alt, headline, and subheadline for each section
//   const [imageAlt1, headline1, subheadline1] = var2elements;
//   const [imageAlt2, headline2, subheadline2] = var2elements2;

//   //console.log(imageAlt1, headline1, subheadline1, imageAlt2, headline2, subheadline2);
//   console.log(var2elements2.imageAlt1);
//   console.log(var2elements2.imageAlt2);


//   // Select all the picture containers (assuming there are two images)
//   const pictureContainers = block.querySelectorAll('picture');
//   const images = Array.from(pictureContainers).map(picture => picture.querySelector('img'));

//   console.log(images);

//   // Set alt attributes for the images
//   images.forEach((img, index) => {
//     if (img && !img.getAttribute('alt')) {
//       img.setAttribute('alt', index === 0 ? imageAlt1?.textContent.trim() : imageAlt2?.textContent.trim());
//     }
//   });

//   // Create the container for the teaser
//   const container = document.createElement('div');
//   container.innerHTML = `
//     <div class="varianttwo__container flex">
//       <!-- Section 1: First Image, Headline, Subheadline, and CTA -->
//       <div class="teaser__section">
//         <div class="teaser__image">${pictureContainers[0] ? pictureContainers[0].outerHTML : ''}</div>
//         <div class="teaser__text">
//           <div class="teaser__title wds2-type-display-m">${headline1 ? headline1.innerHTML : ''}</div>
//           <div class="teaser__description wds2-type-body-light-m">${subheadline1 ? subheadline1.innerHTML : ''}</div>
//           <div class="teaser__cta"></div>
//         </div>
//       </div>
//       <!-- Section 2: Second Image, Headline, Subheadline, and CTA -->
//       <div class="teaser__section">
//         <div class="teaser__image">${pictureContainers[1] ? pictureContainers[1].outerHTML : ''}</div>
//         <div class="teaser__text">
//           <div class="teaser__title wds2-type-display-m">${headline2 ? headline2.innerHTML : ''}</div>
//           <div class="teaser__description wds2-type-body-light-m">${subheadline2 ? subheadline2.innerHTML : ''}</div>
//           <div class="teaser__cta"></div>
//         </div>
//       </div>
//     </div>
//   `;

//   // Insert the CTA buttons into each section
//   const ctaContainer1 = container.querySelectorAll('.teaser__cta')[0]; // First CTA container
//   const ctaContainer2 = container.querySelectorAll('.teaser__cta')[1]; // Second CTA container
//   if (ctaElement1) ctaContainer1?.appendChild(ctaElement1);
//   console.log(ctaElement1);
//   if (ctaElement2) ctaContainer2?.appendChild(ctaElement2);
//   console.log(ctaElement2);

//   // Clear the original block content and append the new container
//   block.innerHTML = '';
//   block.classList.add('teaser-comp');
//   block.appendChild(container);

//   // Bind the event to handle button click (for navigation)
//   bindEvent(block);
// }

function teaserVariantTwo(block) {
  // Select the elements for the two sections (slicing the children of the block)
  const var2elements = [...block.children].slice(5, 11).map((row) => row.firstElementChild);
  const var2elements2 = [...block.children].slice(11, 18).map((row) => row.firstElementChild);

  // Log to check the size and contents of var2elements
  console.log('var2elements:', var2elements);
  console.log('var2elements length:', var2elements.length); // Check how many elements are in the array

  // Get the CTA buttons for each section, with fallback in case they don't exist
  const ctaElement1 = var2elements[3] ? buildCta(var2elements[3], var2elements[4], var2elements[5]) : null;
  const ctaElement2 = var2elements2[3] ? buildCta(var2elements2[3], var2elements2[4], var2elements2[5]) : null;

  // Extracting image alt, headline, and subheadline for each section
  const [imageAlt1, headline1, subheadline1] = var2elements;
  const [imageAlt2, headline2, subheadline2] = var2elements2;

  // Select all the picture containers (assuming there are two images for var2)
  const pictureContainers = block.querySelectorAll('picture');
  const images = Array.from(pictureContainers).map(picture => picture.querySelector('img'));

  // Log the images to debug
  console.log('pictureContainers:', pictureContainers);
  console.log('images:', images);

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
        <div class="teaser__image">${pictureContainers[0] ? pictureContainers[0].outerHTML : ''}</div>
        <div class="teaser__text">
          <div class="teaser__title wds2-type-display-m">${headline1 ? headline1.innerHTML : ''}</div>
          <div class="teaser__description wds2-type-body-light-m">${subheadline1 ? subheadline1.innerHTML : ''}</div>
          <div class="teaser__cta"></div>
        </div>
      </div>
      <!-- Section 2: Second Image, Headline, Subheadline, and CTA -->
      <div class="teaser__section">
        <div class="teaser__image">${pictureContainers[1] ? pictureContainers[1].outerHTML : ''}</div>
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
 