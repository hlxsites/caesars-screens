// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './lib-franklin.js';

import { calibrateMenuForPlayer } from './menu-calibrator.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

/**
 * Temporary Workaround: Increase the fontSize of the page until Scroll Bar appears
 * @returns {Promise<void>}
 */
async function checkAndSetTypography() {
  const startTime = new Date();
  const htmlElement = document.querySelector('html');
  await calibrateMenuForPlayer(htmlElement);
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
