import { isMenuPageRendering } from './util.js';

/**
 * this method generates the HTML structure of the Menu layout
 * @param rootDocument
 * @returns {Promise<void>}
 */
export const layout = async function createMenusHtmlLayout(rootDocument) {
  if (!isMenuPageRendering()) {
    return;
  }
  const beveragesFirstSectionSelector = '.section.beverages-heading';
  const beveragesFirstSectionElement = rootDocument.querySelector(
    beveragesFirstSectionSelector,
  );

  const beveragesSecondSectionSelector = '.section.beverages-content';
  const beveragesSecondSectionElement = rootDocument.querySelector(
    beveragesSecondSectionSelector,
  );

  if (beveragesFirstSectionElement && beveragesSecondSectionElement) {
    // create a new root div element for Beverages Menu
    const beveragesMenu = document.createElement('div');
    beveragesMenu.className = 'beverages-menu';
    rootDocument.querySelector('main').append(beveragesMenu);

    beveragesMenu.appendChild(beveragesFirstSectionElement);
    beveragesMenu.appendChild(beveragesSecondSectionElement);
  }

  const foodFirstSectionSelector = '.section.sweets';
  const foodFirstSectionElement = rootDocument.querySelector(
    foodFirstSectionSelector,
  );

  const foodSecondSectionSelector = '.section.brioche-savory';
  const foodSecondSectionElement = rootDocument.querySelector(
    foodSecondSectionSelector,
  );

  const foodThirdSectionSelector = '.section.sides';
  const foodThirdSectionElement = rootDocument.querySelector(
    foodThirdSectionSelector,
  );

  if (
    foodFirstSectionElement
    && foodSecondSectionElement
    && foodThirdSectionElement
  ) {
    // create a new root div element for Beverages Menu
    const foodMenu = document.createElement('div');
    foodMenu.className = 'food-menu';
    rootDocument.querySelector('main').append(foodMenu);

    foodMenu.appendChild(foodFirstSectionElement);
    foodMenu.appendChild(foodSecondSectionElement);
    foodMenu.appendChild(foodThirdSectionElement);
  }
};

/**
 * This method creates nested html elements to place grid
 * & flex items in their respective containers
 * @param rootDocument
 * @returns {Promise<void>}
 */
export const nestedTable = async function createAlcoholBevarageNestedTable(
  rootDocument,
) {
  const rootSelector = '.section.beverages-content';
  const beverageContentDocumentRoot = rootDocument.querySelector(rootSelector);

  if (!beverageContentDocumentRoot) {
    return;
  }

  const coffeeTable = beverageContentDocumentRoot.querySelector(
    `${rootSelector} > div:nth-last-child(-n + 5)`,
  );
  const alcoholicBeverageTableHeading = beverageContentDocumentRoot.querySelector(
    `${rootSelector} > div:nth-last-child(-n + 4)`,
  );
  const wineTable = beverageContentDocumentRoot.querySelector(
    `${rootSelector} > div:nth-last-child(-n + 3)`,
  );
  const champagneTable = beverageContentDocumentRoot.querySelector(
    `${rootSelector} > div:nth-last-child(-n + 2)`,
  );
  const beerTable = beverageContentDocumentRoot.querySelector(
    `${rootSelector} > div:nth-last-child(-n + 1)`,
  );

  // create a new parents table div for top section
  const beverageContentCoffeeTableDiv = document.createElement('div');
  beverageContentCoffeeTableDiv.className = 'beverages-content-coffee';
  rootDocument
    .querySelector(`${rootSelector}`)
    .append(beverageContentCoffeeTableDiv);
  beverageContentCoffeeTableDiv.append(coffeeTable);

  // create a new parents table div for bottom section
  const beverageContentAlcoholTableDiv = document.createElement('div');
  beverageContentAlcoholTableDiv.className = 'beverages-content-alcohol';
  rootDocument
    .querySelector(`${rootSelector}`)
    .append(beverageContentAlcoholTableDiv);

  // create a new nested table div element
  const alcoholBeverageNestedTableDiv = document.createElement('div');
  alcoholBeverageNestedTableDiv.className = 'alcohol-beverages-table';
  beverageContentAlcoholTableDiv.append(alcoholBeverageNestedTableDiv);

  // create a new nested table div element
  const wineChampagneNestedTableDiv = document.createElement('div');
  wineChampagneNestedTableDiv.className = 'wine-champagne-left-table';
  wineChampagneNestedTableDiv.appendChild(wineTable);
  wineChampagneNestedTableDiv.appendChild(champagneTable);

  alcoholBeverageNestedTableDiv.appendChild(alcoholicBeverageTableHeading);
  alcoholBeverageNestedTableDiv.appendChild(wineChampagneNestedTableDiv);
  alcoholBeverageNestedTableDiv.appendChild(beerTable);
};
