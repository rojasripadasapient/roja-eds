/* eslint-disable import/prefer-default-export */
function isDesktop() {
    return window.innerWidth >= 1024;
  }

  function isMobile() {
    return window.innerWidth < 768;
  }

  function isTablet() {
    return window.innerWidth >= 768 && window.innerWidth <= 1023;
  }

  function isLargeDesktop() {
    return window.innerWidth >= 1500;
  }

  function convertData(rawData) {
    // Helper function to parse the raw string into an object
    function parseDataString(dataString) {
      try {
        // Step 1: Replace '=' with ':' to fix the structure
        let formattedString = dataString.replace(/=/g, ':');

        // Step 2: Ensure all object keys are wrapped in double quotes
        formattedString = formattedString.replace(
          /([a-zA-Z0-9_]+(?: [a-zA-Z0-9_]+)*)(?=\s*:)/g,
          '"$1"',
        );

        // Step 3: Quote string values that are not already quoted (e.g., 29800-PLATINUM_PLUS_2_ROW)
        /* eslint-disable no-useless-escape */
        formattedString = formattedString.replace(
          /(:\s*)([a-zA-Z0-9-_]+)(?=[,\}])/g,
          '$1"$2"',
        );

        // Step 4: Ensure URLs are wrapped in double quotes
        formattedString = formattedString.replace(
          /(:\s*)(\/[^\s,}]+)/g,
          '$1"$2"',
        );

        formattedString = formattedString.replace(
          /"features":\s?\[(.*?)\]/g,
          (match, featuresContent) => {
            const quotedFeatures = featuresContent.split(',').map((item) => `"${item.trim().replace(/"/g, '\\"')}"`).join(', ');

            return `features: [${quotedFeatures}]`;
          },
        );

        // Step 6: Replace "null" with actual null values
        formattedString = formattedString.replace(/"null"/g, 'null');

        // Parse the formatted string to JSON
        return JSON.parse(formattedString);
      } catch (error) {
        return [];
      }
    }

    // Parsing grade data and version data
    const gradeData = Object.keys(rawData.gradeDataList).reduce((acc, grade) => {
      acc[grade] = parseDataString(rawData.gradeDataList[grade]);
      return acc;
    }, {});

    const versionData = Object.keys(rawData.versionDataList).reduce((acc, version) => {
      acc[version] = parseDataString(rawData.versionDataList[version]);
      return acc;
    }, {});

    // Building the final structured data
    const structuredData = {
      modelDetails: rawData.modelDetails,
      gradeDataList: gradeData,
      versionDataList: versionData,
      modelName: rawData.modelName,
    };

    return structuredData;
  }

  function constructVersionData(rawData) {
    // Helper function to get images (desktop, tablet, mobile) from the data
    function getImagesForVersion(gradeVersion, modelGrade) {
      function getImageForType(imageType, version, grade) {
        // Check in versionDataList for the specific version and grade
        const versionData = rawData.versionDataList[grade];
        if (versionData) {
          const versionArray = versionData[version];
          if (versionArray && versionArray.length > 0) {
            const versionImage = versionArray.find((data) => data[imageType]);
            if (versionImage) {
              return versionImage[imageType] || null;
            }
          }
        }

        // Check gradeDataList if no image is found in versionDataList
        const gradeData = rawData.gradeDataList[grade];
        if (gradeData) {
          const gradeImage = gradeData.find((data) => data[imageType]);
          if (gradeImage) {
            return gradeImage[imageType] || null;
          }
        }

        // Fallback to modelDetails if no image is found
        return rawData.modelDetails[imageType] || null;
      }

      // Get images for desktop, tablet, and mobile
      const desktopImage = getImageForType('desktopImage', gradeVersion, modelGrade);
      const tabletImage = getImageForType('tabletImage', gradeVersion, modelGrade);
      const mobileImage = getImageForType('mobileImage', gradeVersion, modelGrade);

      return {
        desktopImage,
        tabletImage,
        mobileImage,
      };
    }

    // Helper function to extract features for a version
    function getFeaturesForVersion(version, grade) {
      const versionData = rawData.versionDataList[grade];
      if (versionData) {
        const versionArray = versionData[version];
        if (versionArray && versionArray.length > 0) {
          const featureData = versionArray.find((data) => data.features);
          return featureData ? featureData.features : [];
        }
      }
      return [];
    }

    // Iterate over versionDataList and construct the result array
    const result = [];

    Object.entries(rawData.versionDataList).forEach(([grade, gradeData]) => {
      Object.entries(gradeData).forEach(([version, data]) => {
        const images = getImagesForVersion(version, grade);
        const features = getFeaturesForVersion(version, grade);
        const { versionKey = '' } = data.find((item) => Object.keys(item)[0] === 'versionKey');

        result.push({
          version,
          grade,
          features,
          images,
          versionKey,
        });
      });
    });

    const updatedResult = result.map((item) => {
      const { gradeKey } = rawData.gradeDataList[item.grade].find((gradeData) => Object.keys(gradeData)[0] === 'gradeKey');
      return { ...item, gradeKey };
    });

    return updatedResult;
  }

  function mapPrices(apiResponse, items) {
    // 23-x-trail will be fetched from the vehiclespreadsheet once created.
    const { Retail: { grades } } = apiResponse['23-x-trail'];

    return items.map((item) => {
      const { gradeKey, versionKey } = item;

      // Check if the gradeKey exists in the API response
      if (grades[gradeKey]) {
        const { versions } = grades[gradeKey];

        // Check if the versionKey exists in the versions
        if (versions[versionKey]) {
          let price = parseFloat(versions[versionKey]);
          price = Math.floor(price);

          // Format the price with commas
          const formattedPrice = new Intl.NumberFormat('en-US').format(price);

          return {
            ...item,
            msrp: formattedPrice,
          };
        }
      }

      // Return the original item if no match is found
      return item;
    });
  }

  export {
    isDesktop,
    isMobile,
    convertData,
    constructVersionData,
    mapPrices,
    isTablet,
    isLargeDesktop,
  };
