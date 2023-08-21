const MENU_CAFE_FONT_SIZE_CACHE_KEY = 'menu-cafe-fontSize';

let cssLoaded = false;
let posDataLoaded = false;

/* eslint-disable no-promise-executor-return */
function delayTimer(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function getOffset(element) {
  return Math.abs(window.innerHeight - element.offsetHeight);
}

export async function calibrateMenu(htmlElement, fontsizeFactor, delayTime = 0) {
  const cachedFontSize = localStorage.getItem(MENU_CAFE_FONT_SIZE_CACHE_KEY);
  if (cachedFontSize) {
    htmlElement.style.fontSize = `${cachedFontSize}%`;
    return;
  }
  let fontSize = 20; // optimal initial fontsize(fits 360 * 640)
  let prevOffset = -1;
  // 198% fontsize works fine for a 4k display so 250% limit should be fine
  while (fontSize < 250) {
    fontSize += fontsizeFactor;
    htmlElement.style.fontSize = `${fontSize}%`;
    const currentOffset = getOffset(htmlElement);
    // Keep increasing fontsize if the offset between window and html element is decreasing,
    // break the loop if it increases
    if (prevOffset !== -1 && currentOffset >= prevOffset && prevOffset < 50) {
      fontSize -= fontsizeFactor;
      localStorage.setItem(MENU_CAFE_FONT_SIZE_CACHE_KEY, fontSize.toString());
      htmlElement.style.fontSize = `${fontSize}%`;
      window.dispatchEvent(new Event('resize'));
      break;
    }
    prevOffset = currentOffset;
    if (delayTime) {
      // eslint-disable-next-line no-await-in-loop
      await delayTimer(delayTime); // add delay if needed on specific native platforms
    }
  }
}

export async function calibrateMenuForPlayer(htmlElement) {
  while (!cssLoaded || !posDataLoaded) {
    // eslint-disable-next-line no-await-in-loop
    await delayTimer(5);
  }
  await calibrateMenu(htmlElement, 0.3, 15);
}

export async function calibrateMenuForWeb(htmlElement) {
  while (!cssLoaded || !posDataLoaded) {
    // eslint-disable-next-line no-await-in-loop
    await delayTimer(5);
  }
  // calibration required for landscape only since scrolling is expected in portrait
  if (window.innerWidth / window.innerHeight <= 1 || window.innerWidth <= 900) {
    return;
  }
  await calibrateMenu(htmlElement, 3);
}

export function updatePosDataLoaded() {
  posDataLoaded = true;
}

export function updateCssLoaded() {
  cssLoaded = true;
}
