import {
  decorateMain,
} from '../../scripts/scripts.js';

import {
  loadSections,
} from '../../scripts/aem.js';



(function(document, $) {
    $(document).on("foundation-contentloaded", function() {
        const media-gallerySelect = $('[name="./media-gallery"]');

        function toggleFields() {
            const selectedVariant = teasermedia-gallerySelect.val();
            $('[data-show-for-variant]').each(function() {
                const variant = $(this).data('show-for-variant');
                $(this).closest(".coral-Form-fieldwrapper").toggle(variant === selectedVariant);
            });
        }

        // Initial check on load
        toggleFields();

        // Event listener for teaser dropdown change
        media-gallerySelect.on("change", toggleFields);
    });
})(document, Granite.$);
