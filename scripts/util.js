const PLAYER_DEBUG_MODE_ENABLED = 'player-debug-mode-enabled';
const CAFE_MENU = 'cafe menu';
const VIEW_MENU = 'view menu';

export function isScreensPlayer() {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return userAgent.includes('tizen')
      || userAgent.includes('electron')
      || userAgent.includes('cros')
      || localStorage.getItem(PLAYER_DEBUG_MODE_ENABLED) === 'true';
}

export function isViewMenuPageRendering() {
  return document.title && document.title.toLowerCase() === VIEW_MENU;
}

export function isMenuPageRendering() {
  return document.title && document.title.toLowerCase() === CAFE_MENU;
}
