import { moveInstrumentation } from '../../../../scripts/scripts.js';

/*
 * Todo: Need to remove the mock url from this function
 * Based on the response grade and model id we need to revamp this code
 */
async function fetchDynamicPrice(modelID) {
  if (!modelID) {
    return null;
  }
  // const uprUrl = 'https://www.nissan.fr/content/nissan_prod/fr_FR/univ-price/individual-vehicles-price-data/individualVehiclesPriceJSON_NAVARAD23B_navara-my18.html';
  // const uprUrl = `https://www.nissan.fr/content/nissan_prod/fr_FR/univ-price/individual-vehicles-price-data/individualVehiclesPriceJSON_${modelID}.html`;
  const mockAPI = 'https://run.mocky.io/v3/7d9240d7-c98b-47d6-a717-4d5b57831f41';

  try {
    const response = await fetch(mockAPI);
    if (!response.ok) throw new Error('Failed to fetch price');

    const data = await response.json();
    const vechicleModelId = modelID.split('_');
    return data[vechicleModelId[1]]?.Retail?.modelPrice || null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Fetch error:', error);
    return null;
  }
}

async function buildFeatureBlock(featuresList) {
  let dynamicPrice = await fetchDynamicPrice(featuresList[1].textContent);

  if (dynamicPrice) {
    dynamicPrice = Number(dynamicPrice).toLocaleString(); // Format with commas
  } else {
    dynamicPrice = '40,125'; // Todo: Static as of now. Once UPR ready we will change
  }
  const largeScreen = window.matchMedia('(min-width: 1024px)');
  const specValClass = largeScreen.matches ? 'wds2-type-display-s' : 'wds2-type-display-xs';
  const specClass = largeScreen.matches ? 'wds2-type-body-light-s' : 'wds2-type-disclaimer-light';

  let featureContainer = '';
  for (let i = 0; i < featuresList.length; i += 1) {
    if (featuresList[i]) {
      featureContainer += '<div class="feature-item">';
      if (i === 0) {
        featureContainer += `<div class="${specValClass}">${dynamicPrice ? `&pound;${dynamicPrice}` : ''}</div><div class="${specClass}">${featuresList[i].innerHTML}</div>`;
      } else {
        featureContainer += `<div class="${specValClass}">${featuresList[i + 1].innerHTML}</div><div class="${specClass}">${featuresList[i].innerHTML}</div>`;
      }
      featureContainer += '</div>';
    }
    i += 1;
  }
  return featureContainer;
}

function buildCta(cta) {
  const anchor = cta.querySelector('.button-container a');
  if (!anchor) {
    return '';
  }
  const url = anchor.getAttribute('href');
  const buttonClass = anchor.getAttribute('class')?.split(' ')[1] || 'tertiary';

  const ctaElem = document.createElement('div');
  ctaElem.innerHTML = `
    <wds-button background="light" variant="${buttonClass}" data-src="${url}">
      <span>${anchor.textContent}</span>
    </wds-button>
  `;

  moveInstrumentation(anchor, ctaElem.querySelector('span'));

  return ctaElem;
}

function applyHeadLineClass(headline) {
  const heading = headline?.querySelector('h1, h2, h3, h4, h5, h6');
  const classes = {
    H1: 'wds2-type-display-l wds2-type-display-xl',
    H2: 'wds2-type-display-m wds2-type-display-l',
    H3: 'wds2-type-display-s wds2-type-display-m',
    H4: 'wds2-type-display-xs wds2-type-display-s',
    H5: 'wds2-type-display-xs wds2-type-display-xs',
    H6: 'wds2-type-display-xs wds2-type-display-xs',
  };

  const headClass = classes[heading?.tagName] || 'wds2-type-display-m wds2-type-display-m';
  const largeScreen = window.matchMedia('(min-width: 1024px)');

  heading?.classList.add(largeScreen.matches ? headClass.split(' ')[1] : headClass.split(' ')[0]);
}

function bindEvent(block) {
  const wdsButton = block.querySelector('wds-button');
  wdsButton?.addEventListener('click', () => {
    const url = wdsButton.getAttribute('data-src');
    if (url) {
      window.location.href = url;
    } else {
      // eslint-disable-next-line no-console
      console.log('No URL found');
    }
  });
}

export default async function decorate(block) {
  const features = [...block.children]
    .slice(0, 8)
    .map((row) => row.firstElementChild);

  const elements = [...block.children].slice(9, 14);
  const [imageAlt, headline, subheadline, cta] = elements;
  const pictureContainer = block.querySelector('picture');
  const img = pictureContainer?.querySelector('img');

  if (img) {
    if (!img.getAttribute('alt') || img.getAttribute('alt') === '') {
      img.setAttribute('alt', imageAlt.textContent.trim());
    }
  }

  applyHeadLineClass(headline);
  const featureItem = await buildFeatureBlock(features);

  const container = document.createElement('div');
  container.innerHTML = `
    <div class="row full-bleed">
      <div class="hero-image col-sm-2 col-md-12 col-l-12 col-xl-12">
        ${pictureContainer ? pictureContainer.outerHTML : ''}
      </div>
    </div>
    <div class="row container bleed">
      <div class="hero-overlay hero-overlay-s col-sm-2 col-md-7 col-l-7 col-xl-7">
        <div class="headline wds2-type-display-m">${headline?.innerHTML}</div>
        <div class="subheadline wds2-type-body-light-m">${subheadline?.innerHTML}</div>
        <div class="cta-wrapper wds2-type-action-button-m">
          ${buildCta(cta).innerHTML}
        </div>
        <div class="hero-features row wds2-type-body-regular-m">
          ${featureItem}
        </div>
      </div>
      <div class="hero-overlay hero-overlay-m col-sm-2 col-md-5 col-l-5 col-xl-5">
        <div class="hero-features row">
          ${featureItem}
        </div>
      </div>
    </div>
  `;

  block.innerHTML = ''; // Clear existing content
  block.classList.add('hero-intro-comp');
  block.appendChild(container); // Add new content
  bindEvent(block);
}