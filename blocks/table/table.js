export const startsWithTemplateLiteral = '{{';
export const endsWithTemplateLiteral = '}}';
export default function decorate(block) {
    const cols = [...block.firstElementChild.children];
    block.classList.add(`columns-${cols.length}-cols`);

    instrumentMenuTable(block);
}

function instrumentMenuTable(block) {

    if (!block.children) {
      return;
    }

    const blockImmediateChildren = [...block.children];

    blockImmediateChildren.forEach( (row) => {

        if (row.children.length > 0 && row.children[0].textContent.startsWith(startsWithTemplateLiteral) && row.children[0].textContent.endsWith(endsWithTemplateLiteral)) {
            row.children[0].classList.add('item-name');
        } else if (row.children.length > 0 && row.children[0].textContent.indexOf(startsWithTemplateLiteral) > 0 && row.children[0].textContent.indexOf(endsWithTemplateLiteral) > 0) {
            row.children[0].classList.add('variant1-price');
        }

        if (row.children.length > 1) {
            row.children[1].classList.add('variant1-price');
        }

        if (row.children.length > 2) {
            row.children[2].classList.add('variant2-price');
        }
    });
}