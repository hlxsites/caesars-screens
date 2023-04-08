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
function instrumentSingleVariantTable(block) {
  if (!block.children) {
    return;
  }

  const blockImmediateChildren = [...block.children];

  blockImmediateChildren.forEach((row) => {
    const placeholdersDivs = [...row.querySelectorAll('div')].filter(
      (div) => div.innerText.includes(startsWithTemplateLiteral)
        && div.innerText.includes(endsWithTemplateLiteral),
    );
    for (let i = 0; i < placeholdersDivs.length; i += 1) {
      placeholdersDivs[i].style.display = 'none';
      placeholderMap.set(
        getKey(placeholdersDivs[i].textContent),
        placeholdersDivs[i],
      );
    }
  });
}

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  instrumentSingleVariantTable(block);
}
