let jsonData = {
  fields: [
    { component: "text", name: "spec1", label: "Spec1", value: "" },
    { component: "text", name: "spec2", label: "Spec2", value: "" },
    { component: "text", name: "spec3", label: "Spec3", value: "" },
    { component: "text", name: "spec4", label: "Spec4", value: "" }
  ]
};

const tooltips = {
  spec1: "Enter the first specification for the offer.",
  spec2: "Enter the second specification for the offer.",
  spec3: "Enter the third specification for the offer.",
  spec4: "Enter the fourth specification for the offer."
};

// Add tooltips dynamically
jsonData.fields.forEach(field => {
  if (tooltips[field.name]) {
    field.tooltip = tooltips[field.name];
  }
});

console.log(JSON.stringify(jsonData, null, 2));
