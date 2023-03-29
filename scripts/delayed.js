// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './lib-franklin.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// FixMe: workaround to set the fluid/responsiveness typography

async function isScrollbarHidden(element) {
  return element.offsetHeight < element.scrollHeight - 2; // threshhold = 2
}

/* function delayTimer(ms) {
  return new Promise((res) => setTimeout(res, ms));
} */

/**
 * Temporary Workaround: Increase the fontSize of the page until Scroll Bar appears
 * @returns {Promise<void>}
 */
async function checkAndSetTypography() {
  const htmlElement = document.querySelector('html');
  let fontSize = 73; // default fontSize for 1200x800 resolution
  /* eslint-disable no-await-in-loop */
  while (await isScrollbarHidden(htmlElement)) {
    if (fontSize > 200) {
      break;
    }
    fontSize += 1;
    htmlElement.style.fontSize = `${fontSize}%`;
    window.dispatchEvent(new Event('resize'));
    // await delayTimer(100); // add delay if needed on specific native platforms
  }
  htmlElement.style.opacity = '1';
  htmlElement.querySelector('.beverages-menu').style.backgroundColor = '#601014'; // background-color: #601014;
  htmlElement.querySelector('.food-menu').style.backgroundColor = '#000'; // background-color: #000;
}

setTimeout(() => {
  checkAndSetTypography();
}, 500);
