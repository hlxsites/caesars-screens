import isScreensPlayer from './util.js';

const MENU_CAFE_FONT_SIZE_CACHE_KEY = 'menu-cafe-fontSize';

let cssLoaded = false, posDataLoaded = false;

/* eslint-disable no-promise-executor-return */
function delayTimer(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function getOffset(element) {
  return Math.abs(window.innerHeight - element.offsetHeight);
}

export async function calibrateMenuForPlayer(htmlElement) {
  const cachedFontSize = localStorage.getItem(MENU_CAFE_FONT_SIZE_CACHE_KEY);
  if (cachedFontSize) {
    htmlElement.style.fontSize = `${cachedFontSize}%`;
    return;
  }
  let fontSize = 30; // optimal initial fontsize(fits 360 * 640)
  let prevOffset = -1;
  // 198% fontsize works fine for a 4k display so 250% limit should be fine
  while (fontSize < 250) {
    fontSize += 0.75;
    htmlElement.style.fontSize = `${fontSize}%`;
    const currentOffset = getOffset(htmlElement);
    // Keep increasing fontsize if the offset between window and html element is decreasing,
    // break the loop if it increases
    if (prevOffset !== -1 && currentOffset >= prevOffset && prevOffset < 50) {
      fontSize -= 0.75;
      localStorage.setItem(MENU_CAFE_FONT_SIZE_CACHE_KEY, fontSize.toString());
      htmlElement.style.fontSize = `${fontSize}%`;
      window.dispatchEvent(new Event('resize'));
      break;
    }
    prevOffset = currentOffset;
    // eslint-disable-next-line no-await-in-loop
    await delayTimer(15); // add delay if needed on specific native platforms
  }
}

function showMenu() {
  if (posDataLoaded && cssLoaded && !isScreensPlayer()) {
    delayTimer(50).then(() => {
      document.getElementsByTagName('main')[0].style.opacity = '1';
    });
  }
}

export function updatePosDataLoaded() {
  posDataLoaded = true;
  showMenu();
}

export function updateCssLoaded() {
  cssLoaded = true;
  showMenu();
}
