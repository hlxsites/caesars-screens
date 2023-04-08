import {
  getKey,
  startsWithTemplateLiteral,
  endsWithTemplateLiteral,
  placeholderMap,
} from '../../scripts/menu-content-parser.js';

/**
 * Decorate Table HTML with specific class selectors so that,
 * it can be handled efficiently by the Menu Builder component
 * @param block
 */
function instrumentMultipleVariantTable(block) {
  if (!block.children) {
    return;
  }

  const blockImmediateChildren = [...block.children];

  blockImmediateChildren.forEach((row) => {
    const placeholdersDivs = [...row.querySelectorAll('div')].filter(
      (div) => div.innerText.includes(startsWithTemplateLiteral)
        && div.innerText.includes(endsWithTemplateLiteral),
    );

    if (placeholdersDivs.length > 0) {
      if (row.children.length === 3) {
        // handling three column placement
        for (let i = 0; i < placeholdersDivs.length; i += 1) {
          placeholdersDivs[i].style.display = 'none';
          if (row.children[1] === placeholdersDivs[i]) {
            placeholderMap.set(
              `${getKey(placeholdersDivs[i].textContent)}:variant1-price`,
              placeholdersDivs[i],
            );
          } else if (row.children[2] === placeholdersDivs[i]) {
            placeholderMap.set(
              `${getKey(placeholdersDivs[i].textContent)}:variant2-price`,
              placeholdersDivs[i],
            );
          }
        }
      }

      if (row.children.length === 1) {
        // handling single column placement

        for (let i = 0; i < placeholdersDivs.length; i += 1) {
          placeholdersDivs[i].style.display = 'none';
          placeholderMap.set(
            getKey(placeholdersDivs[i].textContent),
            placeholdersDivs[i],
          );
        }
      }
    }
  });
}

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  instrumentMultipleVariantTable(block);
}
