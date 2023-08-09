import { updatePosDataLoaded } from './menu-calibrator.js';
import { isMenuPageRendering } from './util.js';

const POS_ENDPOINT = '/screens/menus/pos-data1.json';
const COFFEE_HEADING = 'COFFEE';
const SINGLE_COFFEE = 'SINGLE';
const DOUBLE_COFFEE = 'DOUBLE';
const MEDIUM_COFFEE = 'MEDIUM';
const LARGE_COFFEE = 'LARGE';
const SIXTEEN_OZ = '16 oz';
const TWENTY_OZ = '20 oz';
const AMERICANO = 'americano';

const ALCOHOLIC_BEVERAGES_HEADING = 'ALCOHOLIC BEVERAGES';
const WINE_HEADING = 'Wine';
const CHAMPAGNE_HEADING = 'Champagne';
const BEER_HEADING = 'Beer';

const SWEETS = 'SWEETS';
const BRIOCHE = 'BRIOCHE';
const SAVORY = 'SAVORY';
const SIDES = 'SIDES';

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

function categoriseItems(menuData) {
  const itemsMap = {};
  let category;
  menuData.forEach((menuItem) => {
    const productName = menuItem.Product_Name || '';
    const variant1Price = menuItem.Variant1_price || '';
    const variant2Price = menuItem.Variant2_price || '';
    const { isOutOfStock = '' } = menuItem;
    const { isCategory = '' } = menuItem;
    if (isCategory.toLowerCase() === 'yes') {
      category = productName.toLowerCase();
      itemsMap[category] = {
        price: variant1Price,
        data: [],
      };
    } else if (category && isOutOfStock.toLowerCase() !== 'true') {
      itemsMap[category].data.push({
        productName,
        variant1Price,
        variant2Price,
      });
    }
  });
  return itemsMap;
}

function addMenuItemRow(root, itemsArray = []) {
  const parentDiv = document.createElement('div');
  itemsArray.forEach((item) => {
    if (item !== undefined) {
      const childDiv = document.createElement('div');
      childDiv.innerHTML = item;
      parentDiv.appendChild(childDiv);
    }
  });
  root.appendChild(parentDiv);
}

function addAmericanoCoffeeItem(coffeeTableDiv, coffeeItems) {
  let index;
  const americanoCoffeeItem = coffeeItems.find((item, i) => {
    if (item.productName.toLowerCase() === AMERICANO) {
      index = i;
      return true;
    }
    return false;
  });
  if (!americanoCoffeeItem) {
    return;
  }
  addMenuItemRow(coffeeTableDiv, [americanoCoffeeItem.productName,
    americanoCoffeeItem.variant1Price, americanoCoffeeItem.variant2Price]);
  coffeeItems.splice(index, 1);
}

function checkAndUpdatePlaceholders(item) {
  if (item.productName && item.productName.includes('+')
      && (item.variant1Price || item.variant2Price)) {
    const price = item.variant1Price ? item.variant1Price : item.variant2Price;
    item.productName = item.productName.replace('+', `+${price}`);
    item.variant1Price = undefined;
    item.variant2Price = undefined;
  }
  if (item.productName && /\n/.exec(item.productName)) {
    const breakLine = document.createElement('br');
    item.productName = item.productName.replace('\n', breakLine.outerHTML);
    item.variant1Price = undefined;
  }
}

function updateMenuCoffeeItems(beveragesItemsMap) {
  const coffeeItems = beveragesItemsMap.coffee || { data: [] };
  const coffeeItemsWrapper = document.querySelector('.coffee-table');
  if (!coffeeItemsWrapper || coffeeItems.data.length === 0) {
    return;
  }
  const coffeeHeading = document.createElement('h3');
  coffeeHeading.innerText = COFFEE_HEADING;
  addMenuItemRow(coffeeItemsWrapper, [coffeeHeading.outerHTML, SINGLE_COFFEE, DOUBLE_COFFEE]);
  addAmericanoCoffeeItem(coffeeItemsWrapper, coffeeItems.data);
  addMenuItemRow(coffeeItemsWrapper, ['', MEDIUM_COFFEE, LARGE_COFFEE]);
  addMenuItemRow(coffeeItemsWrapper, ['', SIXTEEN_OZ, TWENTY_OZ]);
  coffeeItems.data.forEach((item) => {
    checkAndUpdatePlaceholders(item);
    addMenuItemRow(coffeeItemsWrapper, [item.productName, item.variant1Price, item.variant2Price]);
  });
}

function updateAlchoholCategoryItem(categoryClass, category, beveragesItemsMap) {
  if (!categoryClass || !category || !beveragesItemsMap[category.toLowerCase()]
        || beveragesItemsMap[category.toLowerCase()].data.length === 0) {
    return;
  }
  const categoryTable = document.querySelector(categoryClass);
  if (!categoryTable) {
    return;
  }
  addMenuItemRow(categoryTable, [category, '']);
  const categoryItems = beveragesItemsMap[category.toLowerCase()].data;
  categoryItems.forEach((item) => {
    addMenuItemRow(categoryTable, [item.productName, item.variant1Price]);
  });
}

function updateMenuAlcoholItems(beveragesItemsMap) {
  const alcoholWrapper = document.querySelector('.alcohol-beverages-table');
  if (!alcoholWrapper) {
    return;
  }
  const alcholicBeveragesHeadingWrapper = document.createElement('div');
  alcholicBeveragesHeadingWrapper.classList.add('default-content-wrapper');
  const alcholicBeveragesHeading = document.createElement('h3');
  alcholicBeveragesHeading.innerText = ALCOHOLIC_BEVERAGES_HEADING;
  alcholicBeveragesHeadingWrapper.appendChild(alcholicBeveragesHeading);
  alcoholWrapper.insertBefore(alcholicBeveragesHeadingWrapper, alcoholWrapper.firstChild);

  updateAlchoholCategoryItem('.wine-table', WINE_HEADING, beveragesItemsMap);
  updateAlchoholCategoryItem('.champagne-table', CHAMPAGNE_HEADING, beveragesItemsMap);
  updateAlchoholCategoryItem('.beer-table', BEER_HEADING, beveragesItemsMap);
}

function updateFoodMenuItems(categoryClass, category, foodItemsMap, rowItemCount) {
  const categoryItems = foodItemsMap[category.toLowerCase()];
  const categoryTable = document.querySelector(categoryClass);
  if (!categoryTable || !categoryItems || categoryItems.data.length === 0) {
    return;
  }
  const categoryHeading = document.createElement('h3');
  categoryHeading.innerText = category;
  addMenuItemRow(categoryTable, [categoryHeading.outerHTML, categoryItems.price]);

  if (rowItemCount === 4) {
    for (let index = 0; index < categoryItems.data.length; index += 2) {
      if (index + 1 < categoryItems.data.length) {
        addMenuItemRow(categoryTable, [
          categoryItems.data[index].productName,
          categoryItems.data[index].variant1Price,
          categoryItems.data[index + 1].productName,
          categoryItems.data[index + 1].variant1Price,
        ]);
      } else {
        addMenuItemRow(categoryTable, [
          categoryItems.data[index].productName,
          categoryItems.data[index].variant1Price,
          '',
          '',
        ]);
      }
    }
  } else {
    // default row item count is 2
    categoryItems.data.forEach((item) => {
      addMenuItemRow(categoryTable, [item.productName, item.variant1Price]);
    });
  }
}

function processBeveragesFoodMenuSections(menuJsonPayload) {
  // Loop through the Beverages Menu section data to access individual product details
  const beveragesItemsMap = categoriseItems(menuJsonPayload.Beverages.data) || {};
  updateMenuCoffeeItems(beveragesItemsMap);
  updateMenuAlcoholItems(beveragesItemsMap);

  // Loop through the Food Menu Section data to access individual product details
  const foodItemsMap = categoriseItems(menuJsonPayload.Food.data) || {};
  updateFoodMenuItems('.sweets-table', SWEETS, foodItemsMap);
  updateFoodMenuItems('.brioche-savory-table', BRIOCHE, foodItemsMap);
  updateFoodMenuItems('.brioche-savory-table', SAVORY, foodItemsMap);
  updateFoodMenuItems('.sides-table', SIDES, foodItemsMap, 4);
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
