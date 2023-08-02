import {
  sampleRUM,
  buildBlock,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
} from './lib-franklin.js';

import isScreensPlayer from './util.js';

import { updateCssLoaded } from './menu-calibrator.js';

import { layout, nestedTable } from './menu-builder.js';

import { populateValuesContent } from './menu-content-parser.js';

const LCP_BLOCKS = []; // add your LCP blocks to the list
window.hlx.RUM_GENERATION = 'project-1'; // add your RUM generation information here

const CAFE_MENU = 'cafe menu';
const VIEW_MENU = 'view menu';

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  if (
    h1
    && picture
    // eslint-disable-next-line no-bitwise
    && h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING
  ) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * loads everything needed to get to LCP.
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    await waitForLCP(LCP_BLOCKS);
  }
}

/**
 * Adds the favicon.
 * @param {string} href The favicon URL
 */
export function addFavIcon(href) {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  link.href = href;
  const existingLink = document.querySelector('head link[rel="icon"]');
  if (existingLink) {
    existingLink.parentElement.replaceChild(link, existingLink);
  } else {
    document.getElementsByTagName('head')[0].appendChild(link);
  }
}

/**
 * loads everything that doesn't need to be delayed.
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`, updateCssLoaded);
  addFavIcon(`${window.hlx.codeBasePath}/styles/favicon.ico`);

  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

export function configureForWeb() {
  const htmlElement = document.querySelector('html');
  htmlElement.querySelector('.beverages-menu').style.backgroundColor = '#601014';
  htmlElement.querySelector('.food-menu').style.backgroundColor = '#000';
  htmlElement.style.backgroundColor = 'black';
  window.setTimeout(() => {
    document.querySelector('main').style.opacity = '1';
  }, 1000);
}

/**
 * loads everything that happens a lot later, without impacting
 * the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 0);
}

function isViewMenuPageRendering() {
  return document.title && document.title.toLowerCase() === VIEW_MENU;
}

function renderViewMenuPage() {
  loadCSS(`${window.hlx.codeBasePath}/styles/button-styles.css`, () => {
    document.querySelector('.view-menu-button').style.opacity = 1;
  });
}

function isMenuPageRendering() {
  return document.title && document.title.toLowerCase() === CAFE_MENU;
}

async function renderMenuPage() {
  await nestedTable(document);
  await layout(document);
  await populateValuesContent();
  if (isScreensPlayer()) {
    loadDelayed();
  } else {
    configureForWeb();
  }
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  if (isMenuPageRendering()) {
    await renderMenuPage();
  } else if (isViewMenuPageRendering()) {
    console.log('view page');
    await renderViewMenuPage();
  }
}

loadPage();
