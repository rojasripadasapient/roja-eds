document.addEventListener("DOMContentLoaded", function() {
    // Get dropdown element
    const variantDropdown = document.querySelector("[name='teaser']");

    // Define the fields to toggle for each variant
    const variant1Fields = [
        "variant1Image", "imageAltVariant1", "variant1Title", "variant1Text",
        "variant1Link", "variant1LinkText", "variant1LinkTitle", "variant1LinkType"
    ];
    const variant2Fields = [
        "variant2Image1", "image1AltVariant2", "variant2Title1", "variant2Text1",
        "variant2Link", "variant2LinkText", "variant2LinkTitle", "variant2LinkType",
        "variant2Image2", "image2AltVariant2", "variant2Title2", "variant2Text2"
    ];

    // Helper function to toggle visibility of fields
    function toggleFields(showVariant1) {
        variant1Fields.forEach(fieldName => {
            const fieldElement = document.querySelector(`[name='${fieldName}']`);
            if (fieldElement) {
                fieldElement.closest(".field-container").style.display = showVariant1 ? "block" : "none";
            }
        });
        variant2Fields.forEach(fieldName => {
            const fieldElement = document.querySelector(`[name='${fieldName}']`);
            if (fieldElement) {
                fieldElement.closest(".field-container").style.display = showVariant1 ? "none" : "block";
            }
        });
    }

    // Set initial visibility based on current selection
    toggleFields(variantDropdown.value === "variant1");

    // Add event listener for dropdown change
    variantDropdown.addEventListener("change", function() {
        toggleFields(this.value === "variant1");
    });
});
