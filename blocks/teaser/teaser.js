export default async function decorate(block) {
    const features = [...block.children]
      .slice(0, 8)
      .map((row) => row.firstElementChild);
    const elements = [...block.children];
    const [imageAlt, headline, subheadline, cta] = elements;
    const pictureContainer = block.querySelector('picture');
    const img = pictureContainer?.querySelector('img');

    if (img) {
      if (!img.getAttribute('alt') || img.getAttribute('alt') === '') {
        img.setAttribute('alt', imageAlt?.textContent.trim() || 'Default Alt Text');
      }
    }

    const image = document.createElement('img');
    image.src = 'https://via.placeholder.com/600x400';
    image.alt = imageAlt?.textContent?.trim() || 'Sample Image';

    // Check if headline and subheadline are defined
    if (headline) {
      headline.innerHTML = headline?.innerHTML || 'Sample Title';
    }

    if (subheadline) {
      subheadline.innerHTML = subheadline?.innerHTML || 'This is the description text for the image.';
    }

    // Check if CTA element exists
    if (cta) {
      cta.innerHTML = cta?.innerHTML || 'Call to Action';
      cta.href = cta?.href || '#';
    }

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
              <a href="${cta?.href || '#'}" class="teaser__cta-button wds2-type-action-button-m">${cta?.textContent || 'Call to Action'}</a>
          </div>
          </div>
      </div>
    `;

    // Append the dynamically created container to the block
    block.innerHTML = '';
    block.classList.add('teaser-comp');
    block.appendChild(container);
  }