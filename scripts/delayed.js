// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './lib-franklin.js';

const MENU_CAFE_FONT_SIZE_CACHE_KEY = 'menu-cafe-fontSize';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// FixMe: workaround to set the fluid/responsiveness typography

function isScrollbarHidden(element) {
  // const mainElement = document.querySelector('main');
  // console.log(Math.abs(window.innerHeight - element.offsetHeight));
  return Math.abs(window.innerHeight - element.offsetHeight); // threshhold = 2
}

function delayTimer(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

/**
 * Temporary Workaround: Increase the fontSize of the page until Scroll Bar appears
 * @returns {Promise<void>}
 */
async function checkAndSetTypography() {
  const startTime = new Date();
  const htmlElement = document.querySelector('html');
  const cachedFontSize = null;//localStorage.getItem(MENU_CAFE_FONT_SIZE_CACHE_KEY);
  if (cachedFontSize) {
    htmlElement.style.fontSize = `${cachedFontSize}%`;
  } else {
    let fontSize = 10; // default fontSize for 1200x800 resolution
    /* eslint-disable no-await-in-loop */
    let prevOffset = Number.MAX_SAFE_INTEGER;
    while (true) {
      fontSize += 0.75;
      localStorage.setItem(MENU_CAFE_FONT_SIZE_CACHE_KEY, fontSize.toString());
      htmlElement.style.fontSize = `${fontSize}%`;
      window.dispatchEvent(new Event('resize'));
      const currentOffset = isScrollbarHidden(htmlElement);
      if (prevOffset !== -1 && currentOffset > prevOffset || fontSize > 200) {
        fontSize -= 1;
        localStorage.setItem(MENU_CAFE_FONT_SIZE_CACHE_KEY, fontSize.toString());
        htmlElement.style.fontSize = `${fontSize}%`;
        window.dispatchEvent(new Event('resize'));
        break;
      }
      prevOffset = currentOffset;
      await delayTimer(20); // add delay if needed on specific native platforms
    }
  }
  htmlElement.querySelector('.beverages-menu').style.backgroundColor = '#601014';
  htmlElement.querySelector('.food-menu').style.backgroundColor = '#000';
  htmlElement.querySelector('.spinner').style.display = 'none';
  // remove the vertical scroll once menu is calibrated
  htmlElement.style.overflow = 'hidden';
  // unhide the main element once menu is ready
  htmlElement.querySelector('main').style.opacity = '1';
  const endTime = new Date();
  console.log(`Menu calibration time: ${endTime - startTime}ms`);
}

await checkAndSetTypography();
