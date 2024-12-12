import { moveInstrumentation } from '../../scripts/scripts.js';
import { getApigeeAccessToken, getApigeeUrl, removeLocalStorageItem } from '../../scripts/spreadsheet-utils.js';

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

  const offerBtn = block.querySelector('.offer-btn');
  const wdsOverlay = block.querySelector('wds-overlay');

  offerBtn?.addEventListener('click', () => {
    if (wdsOverlay?.shadowRoot) {
      const { shadowRoot } = wdsOverlay;
      const elem = shadowRoot.querySelector('.wds-overlay-content-wrapper');
      if (elem) {
        elem.classList.add('open');
        elem.style.position = 'fixed';
        document.body.classList.add('no-scroll');
      }
    }
  });

  if (wdsOverlay?.shadowRoot) {
    const { shadowRoot } = wdsOverlay;
    const observer = new MutationObserver(() => {
      const button = shadowRoot.querySelector('.close-button');
      if (button) {
        button?.addEventListener('click', () => {
          const elem = shadowRoot.querySelector('.wds-overlay-content-wrapper');
          elem.classList.toggle('open');
          document.body.classList.remove('no-scroll');
        });
        observer.disconnect();
      }
    });
    observer.observe(shadowRoot, { childList: true, subtree: true });
  }
}

function applyHeadLineClass(headline) {
  if (!headline) return;

  const heading = headline.querySelector('h1, h2, h3, h4, h5, h6');
  if (!heading) return;

  const classes = {
    H1: 'wds2-type-display-l wds2-type-display-xl',
    H2: 'wds2-type-display-m wds2-type-display-l',
    H3: 'wds2-type-display-s wds2-type-display-m',
    H4: 'wds2-type-display-xs wds2-type-display-s',
    H5: 'wds2-type-display-xs wds2-type-display-xs',
    H6: 'wds2-type-display-xs wds2-type-display-xs',
  };

  const headClass = classes[heading.tagName] || 'wds2-type-display-m wds2-type-display-m';
  const largeScreen = window.matchMedia('(min-width: 1024px)');
  const selectedClass = largeScreen.matches ? headClass.split(' ')[1] : headClass.split(' ')[0];

  heading.classList.add(selectedClass);
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

async function makeApiCall(offerId) {
  const domain = await getApigeeUrl();
  const url = `${domain}/v2/offers/${offerId}`;
  const accessToken = await getApigeeAccessToken();
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accesstoken: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      removeLocalStorageItem('pchUprPublicAccessToken');
      return makeApiCall();
    }
    // eslint-disable-next-line no-console
    console.log(`Error: ${response.statusText}`);
    // throw new Error(`Error: ${response.statusText}`);
    return '';
  }

  const data = await response.json();
  return data;
}

export default async function decorate(block) {
  const [
    heading,
    offerId,
    modalName,
    modalYear,
    offerOverlayBtnLabel,
    termsLabel,
    offerCta,
    cta,
    overlayCta1,
    overlayCta2] = [...block.children].slice(0, 10)
    .map((row) => row.firstElementChild);
  let offerDetail = '';
  const ctaElem = buildCta(cta);
  const offerData = await makeApiCall(offerId?.textContent);

  if (offerData) {
    const baseURL = 'https://www.nissan.com.mx'; // TODO: need to remove once the domain ready
    const imageData = offerData.images.detail;
    const offerCtaElem = buildCta(offerCta);
    const overlayCta1Elem = buildCta(overlayCta1);
    const overlayCta2Elem = buildCta(overlayCta2);

    offerDetail = `<div class="offer-item">
      <picture class="offer-image-wrapper">
        <source srcset="${baseURL + imageData.smallStdRes} 1x, ${baseURL + imageData.smallHiRes} 2x" media="(max-width: 600px)">
        <source srcset="${baseURL + imageData.mediumStdRes} 1x, ${baseURL + imageData.mediumHiRes} 2x" media="(max-width: 1024px)">
        <source srcset="${baseURL + imageData.largeStdRes} 1x, ${baseURL + imageData.largeHiRes} 2x" media="(min-width: 1025px)">
        <img src="${baseURL + imageData.largeStdRes}" alt="offer">
      </picture>
      <div class="offer-details">
        <div class="heading">
          <div class="wds2-type-display-s">${modalName?.outerHTML}</div>
          <div class="wds2-type-body-light-s">${modalYear?.outerHTML}</div>
        </div>
        <div class="wds2-type-body-light-s description">
          <div class="wds2-type-display-xs highlight">${offerData?.title?.headline}</div>
          <div class="wds2-type-body-regular-s">${offerData?.title?.strapline}</div>
          <div class="wds2-type-body-regular-s additional-headline">${offerData?.additionalTitle?.headline}</div>
        </div>
        <div class="offer-cta">
          <div class="offer-btn-container">
            <wds-icon class="zoom-icon" iconName="icon-zoom_in" iconSize=16></wds-icon>
            <div class="wds2-type-action-filter offer-btn">${offerOverlayBtnLabel?.textContent}</div>
          </div>
          <div class="wds2-type-disclaimer-light terms">${termsLabel?.innerHTML}</div>
        </div>
        <div class="">
          ${offerCtaElem?.innerHTML}
        </div>
      </div>
      <wds-overlay className="">
        <div class="modal-content">
          <div class="modal-heading">
            <div class="wds2-type-display-l">${modalName?.outerHTML}</div>
            <div class="wds2-type-body-light-m">${modalYear?.outerHTML}</div>
          </div>
          <div class="wds2-type-body-light-s description">
            <div class="wds2-type-display-s highlight">${offerData?.title?.headline}</div>
            <div class="wds2-type-display-xs">${offerData?.title?.strapline}</div>
            <div class="wds2-type-body-regular-m additional-headline">${offerData?.additionalTitle?.headline}</div>
          </div>
          <picture class="offer-image-wrapper">
            <source srcset="${baseURL + imageData.smallStdRes} 1x, ${baseURL + imageData.smallHiRes} 2x" media="(max-width: 600px)">
            <source srcset="${baseURL + imageData.mediumStdRes} 1x, ${baseURL + imageData.mediumHiRes} 2x" media="(max-width: 1024px)">
            <source srcset="${baseURL + imageData.largeStdRes} 1x, ${baseURL + imageData.largeHiRes} 2x" media="(min-width: 1025px)">
            <img src="${baseURL + imageData.largeStdRes}" alt="Special Offer">
          </picture>
          <div class="overlay-offer-cta-wrapper">
            ${overlayCta1Elem.innerHTML}
            ${overlayCta2Elem.innerHTML}
          </div>
          <div class="validity wds2-type-disclaimer-bold">
            <wds-icon class="offer-icon" iconName="icon-offers" iconSize=16></wds-icon>
            <span>${offerData?.validity}</span>
          </div>
          <div class="modal-offer-detail wds2-type-body-light-s">
            ${offerData?.details}
          </div>
          <div class="hr-line">
          </div>
          <div class="terms-container">
            <div class="title wds2-type-disclaimer-regular">${offerData?.legals?.main?.headline}</div>
            <div class="desc wds2-type-disclaimer-light">${offerData?.legals?.main?.details}</div>
          </div>
        </div>
      </wds-overlay>`;
  }

  const elem = document.createElement('div');
  elem.classList.add('container');
  elem.innerHTML = `<div class="row">
      <div class="col-sm-2 col-md-12 col-l-12 col-xl-12">
        <div class="offer-wrapper">
          <div class="offer-heading">${heading?.innerHTML}</div>
          <div class="offer-container">
            ${offerDetail}
          </div>
        </div>
        ${ctaElem ? `<div class="offer-cta-wrapper">${ctaElem?.innerHTML}</div>` : ''}
      </div>
    </div>`;

  block.innerHTML = '';
  block.appendChild(elem);
  applyHeadLineClass(block.querySelector('.offer-heading'));
  bindEvent(block);
}