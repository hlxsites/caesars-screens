import { updatePosDataLoaded } from './menu-calibrator.js';
import { isMenuPageRendering } from './util.js';

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
  // Access the "Beverages" category's data
  const beveragesData = menuJsonPayload.Beverages.data;

  // Loop through the Beverages Menu section data to access individual product details
  beveragesData.forEach((menuItem) => {
    const variant1Price = menuItem.Variant1_price;
    const variant2Price = menuItem.Variant2_price;
    const sku = menuItem.SKU;
    const { isOutOfStock } = menuItem;
    if (placeholderMap.has(`{{${sku}}}`)) {
      updateMenuItem(
        sku,
        placeholderMap.get(`{{${sku}}}`),
        variant1Price,
        isOutOfStock,
      );
    }
    if (placeholderMap.has(`{{${sku}}}:variant1-price`)) {
      updateMenuItem(
        sku,
        placeholderMap.get(`{{${sku}}}:variant1-price`),
        variant1Price,
        isOutOfStock,
      );
    }
    if (placeholderMap.has(`{{${sku}}}:variant2-price`)) {
      updateMenuItem(
        sku,
        placeholderMap.get(`{{${sku}}}:variant2-price`),
        variant2Price,
        isOutOfStock,
      );
    }
  });

  // Access the "Food" category's data
  const foodData = menuJsonPayload.Food.data;

  // Loop through the Food Menu Section data to access individual product details
  foodData.forEach((product) => {
    const variant1Price = product.Variant1_price;
    const sku = product.SKU;
    const { isOutOfStock } = product;

    const targetElement = placeholderMap.get(`{{${sku}}}`);

    if (targetElement) {
      updateMenuItem(sku, targetElement, variant1Price, isOutOfStock);
    }
  });
}

/**
 * parse value JSON and mutate Menu HTML content
 * @param elements
 * @returns {Promise<void>}
 */
export async function populateValuesContent() {
  if (!isMenuPageRendering()) {
    return;
  }
  await fetch(POS_ENDPOINT)
    .then((response) => response.json())
    .then((menu) => {
      processBeveragesFoodMenuSections(menu);
      updatePosDataLoaded();
    })
    .catch((error) => {
      // Handle any errors that occurred during the HTTP request
      // eslint-disable-next-line no-console
      console.warn(` Error in processing the menu item prices : ${error}`);
    });
}
