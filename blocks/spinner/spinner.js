/**
 * Relocate Spinner HTML element at the body so that main
 * content can be hidden (opacity:0) until calibration is in process
 * @param block
 */
function splitIntoChildren(block) {
  if (!block.children) {
    return;
  }

  const spinnerTextArray = [...block.innerText.trim().concat('...')];

  const parentDivElement = document.createElement('div');
  parentDivElement.classList += block.classList;
  document.querySelector('body').append(parentDivElement);

  block.closest('.section').remove();

  spinnerTextArray.forEach((letter) => {
    const divElement = document.createElement('div');
    divElement.classList.add('spinner-letter');
    divElement.textContent = letter;
    parentDivElement.append(divElement);
  });
}

export default function decorate(block) {
  block.classList.add('spinner');
  splitIntoChildren(block);
}
