const POS_ENDPOINT = '/screens/menus/pos-data.json';

export const startsWithTemplateLiteral = '{{';
export const endsWithTemplateLiteral = '}}';

export const placeholderMap = new Map();

export function getKey(keyLabel) {
  if (
    keyLabel.startsWith(startsWithTemplateLiteral)
    && keyLabel.endsWith(endsWithTemplateLiteral)
  ) {
    return keyLabel;
  }
  if (
    keyLabel.includes(startsWithTemplateLiteral)
    && keyLabel.includes(endsWithTemplateLiteral)
  ) {
    return keyLabel.substring(
      keyLabel.indexOf(startsWithTemplateLiteral),
      keyLabel.indexOf(endsWithTemplateLiteral) + 2,
    );
  }
  return keyLabel;
}

/* eslint no-restricted-syntax: "error" */
/**
 * This method will replace the placeholders (i.e.variables) with respective prices
 * and unhide the Menu item
 * @param elements
 * @param beveragesCoffeeEntries
 */
function updateMenuItem(SKU, targetElement, targetPrice, isOutOfStock) {
  if (
    isOutOfStock.trim().toLowerCase() === 'true'
    || isOutOfStock.trim().toLowerCase() === 'yes'
  ) {
    targetElement.parentElement.style.display = 'none'; // already set
    return;
  }

  targetElement.textContent = targetElement.textContent.replace(
    startsWithTemplateLiteral + SKU + endsWithTemplateLiteral,
    targetPrice,
  );
  targetElement.style.display = ''; // unhide the element after setting the price
}

function processBeveragesFoodMenuSections(menuJsonPayload) {
  for (const {
    SKU,
    Variant1_price: variant1Price,
    Variant2_price: variant2Price,
    isOutOfStock,
  } of menuJsonPayload.Beverages.data) {
    if (placeholderMap.has(`{{${SKU}}}`)) {
      updateMenuItem(
        SKU,
        placeholderMap.get(`{{${SKU}}}`),
        variant1Price,
        isOutOfStock,
      );
    }
    if (placeholderMap.has(`{{${SKU}}}:variant1-price`)) {
      updateMenuItem(
        SKU,
        placeholderMap.get(`{{${SKU}}}:variant1-price`),
        variant1Price,
        isOutOfStock,
      );
    }
    if (placeholderMap.has(`{{${SKU}}}:variant2-price`)) {
      updateMenuItem(
        SKU,
        placeholderMap.get(`{{${SKU}}}:variant2-price`),
        variant2Price,
        isOutOfStock,
      );
    }
  }

  for (const {
    SKU,
    Variant1_price: variant1Price,
    isOutOfStock,
  } of menuJsonPayload.Food.data) {
    const targetElement = placeholderMap.get(`{{${SKU}}}`);

    if (targetElement) {
      updateMenuItem(SKU, targetElement, variant1Price, isOutOfStock);
    }
  }
}

/**
 * parse value JSON and mutate Menu HTML content
 * @param elements
 * @returns {Promise<void>}
 */
export async function populateValuesContent() {
  fetch(POS_ENDPOINT)
    .then((response) => response.json())
    .then((menu) => {
      processBeveragesFoodMenuSections(menu);
    })
    .catch((error) => {
      // Handle any errors that occurred during the HTTP request
      // eslint-disable-next-line no-console
      console.warn(error);
    });
}
