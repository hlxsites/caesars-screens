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

  alcoholBeverageNestedTableDiv.appendChild(wineChampagneNestedTableDiv);
  alcoholBeverageNestedTableDiv.appendChild(beerTable);
};

// Function to create a table
function createTable(tableClass) {
  const tableWrapper = document.createElement('div');
  tableWrapper.classList.add('table-wrapper');
  const table = document.createElement('div');
  table.classList.add('table', tableClass, 'block');
  table.setAttribute('data-block-name', 'table');
  table.setAttribute('data-block-status', 'initialized');
  tableWrapper.appendChild(table);
  return tableWrapper;
}

export function buildMenuStructure(mainElement) {
  if (!isMenuPageRendering()) {
    return;
  }
  // empty main before creating structure
  mainElement.innerHTML = '';
  // Section 1: beverages-heading
  const section1 = document.createElement('div');
  section1.classList.add('section', 'beverages-heading');
  section1.setAttribute('data-section-status', 'initialized');
  const beveragesHeadingWrapper = document.createElement('div');
  beveragesHeadingWrapper.classList.add('default-content-wrapper');
  const beveragesHeading = document.createElement('p');
  beveragesHeading.textContent = 'BEVERAGES';
  beveragesHeadingWrapper.appendChild(beveragesHeading);
  section1.appendChild(beveragesHeadingWrapper);
  mainElement.appendChild(section1);

  // Section 2: beverages-content
  const section2 = document.createElement('div');
  section2.classList.add('section', 'beverages-content', 'table-container');
  section2.setAttribute('data-section-status', 'initialized');

  // Coffee table
  const coffeeTable = createTable('coffee-table');
  section2.appendChild(coffeeTable);

  // Wine table
  const wineTable = createTable('wine-table');
  section2.appendChild(wineTable);

  // Champagne table
  const champagneTable = createTable('champagne-table');
  section2.appendChild(champagneTable);

  // Beer table
  const beerTable = createTable('beer-table');
  section2.appendChild(beerTable);

  mainElement.appendChild(section2);

  // Section 3: sweets
  const section3 = document.createElement('div');
  section3.classList.add('section', 'sweets', 'table-container');
  section3.setAttribute('data-section-status', 'initialized');
  const sweetsTable = createTable('sweets-table');
  section3.appendChild(sweetsTable);
  mainElement.appendChild(section3);

  // Section 4: brioche-savory
  const section4 = document.createElement('div');
  section4.classList.add('section', 'brioche-savory', 'table-container');
  section4.setAttribute('data-section-status', 'initialized');
  const briocheSavoryTable = createTable('brioche-savory-table');
  section4.appendChild(briocheSavoryTable);
  mainElement.appendChild(section4);

  // Section 5: sides
  const section5 = document.createElement('div');
  section5.classList.add('section', 'sides', 'table-container');
  section5.setAttribute('data-section-status', 'initialized');
  const foodHeadingWrapper = document.createElement('div');
  foodHeadingWrapper.classList.add('default-content-wrapper');
  const foodHeadingParagraph = document.createElement('p');
  foodHeadingParagraph.textContent = 'FOOD';
  foodHeadingWrapper.appendChild(foodHeadingParagraph);
  section5.appendChild(foodHeadingWrapper);

  const sidesTable = createTable('sides-table');
  section5.appendChild(sidesTable);
  mainElement.appendChild(section5);

  // Section 6: spinner
  const section6 = document.createElement('div');
  section6.classList.add('section', 'calibrating', 'spinner-container');
  section6.setAttribute('data-section-status', 'initialized');
  const spinnerWrapper = document.createElement('div');
  spinnerWrapper.classList.add('spinner-wrapper');
  const calibratingSpinner = document.createElement('div');
  calibratingSpinner.classList.add('spinner', 'calibrating', 'block');
  calibratingSpinner.setAttribute('data-block-name', 'spinner');
  calibratingSpinner.setAttribute('data-block-status', 'initialized');
  const spinnerContent = document.createElement('div');
  spinnerContent.textContent = '...';
  calibratingSpinner.appendChild(spinnerContent);
  spinnerWrapper.appendChild(calibratingSpinner);
  section6.appendChild(spinnerWrapper);
  mainElement.appendChild(section6);
}
