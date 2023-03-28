const POS_ENDPOINT = '/screens/menus/pos-data.json';

const OUT_OF_STOCK = '%%not_available%%';

export const startsWithTemplateLiteral = '{{';
export const endsWithTemplateLiteral = '}}';


/**
 * parse value JSON and mutate Menu HTML content
 * @param elements
 * @returns {Promise<void>}
 */
export async function populateValuesContent(elementsMap) {

    fetch(POS_ENDPOINT)
        .then(response => response.json())
        .then(menu => {
            processMenuSection(elementsMap, menu);
        })
        .catch(error => {
            // Handle any errors that occurred during the HTTP request
            console.log(error);
        });
}

/**
 * todo: this needs to be revisited - current iteration based implementation is not performant
 * @param classList
 * @param menuJsonPayload
 * @param key
 * @returns {*|string}
 */
function computeContentValue(classList, menuJsonPayload, key) {
    for (let {SKU, Variant1_price, Variant2_price, isOutOfStock} of menuJsonPayload.Beverages.data) {

        if (isOutOfStock === 'true') {
            return OUT_OF_STOCK;
        }

        if (SKU === key) {
            if (classList.contains('variant1-price')) {
                return Variant1_price;
            }

            if (classList.contains('variant2-price')) {
                return Variant2_price;
            }

            return ' '; // return empty value to ensure not break Menu when prices can't be fetched from the POS
        }
    }
}

/**
 * This method will replace the placeholders (i.e.variables) with respective prices and unhide the Menu item
 * @param elements
 * @param beveragesCoffeeEntries
 */
function processMenuSection(elementsMap, menuJsonPayload) {

    elementsMap.forEach(function (targetElement, placeholderTemplate) {
        const key = placeholderTemplate.substring(placeholderTemplate.indexOf(startsWithTemplateLiteral) + 2, placeholderTemplate.indexOf(endsWithTemplateLiteral));
        const targetValue = computeContentValue(targetElement.classList, menuJsonPayload, key);

        if (targetValue === OUT_OF_STOCK) {
            targetElement.parentElement.style.display = 'none';
        }

        if (targetValue) {
            targetElement.textContent = targetElement.textContent.replace(`{{${key}}}`, targetValue);
            targetElement.style.display = ''; // unhide after setting the value
        }
    });
}