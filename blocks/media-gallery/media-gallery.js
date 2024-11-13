import {
  decorateMain,
} from '../../scripts/scripts.js';

import {
  loadSections,
} from '../../scripts/aem.js';


export default function decorate(block) {
  const [media-galleryWrapper] = block.children;

  const blockmedia-gallery = document.createElement('blockmedia-gallery');
  blockmedia-gallery.textContent = quoteWrapper.textContent.trim();
  media-galleryWrapper.replaceChildren(blockmedia-gallery);
}



(function(document, $) {
    $(document).on("foundation-contentloaded", function() {
        const teaserSelect = $('[name="./teaser"]');

        function toggleFields() {
            const selectedVariant = teaserSelect.val();
            $('[data-show-for-variant]').each(function() {
                const variant = $(this).data('show-for-variant');
                $(this).closest(".coral-Form-fieldwrapper").toggle(variant === selectedVariant);
            });
        }

        // Initial check on load
        toggleFields();

        // Event listener for teaser dropdown change
        teaserSelect.on("change", toggleFields);
    });
})(document, Granite.$);
