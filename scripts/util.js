const PLAYER_DEBUG_MODE_ENABLED = 'player-debug-mode-enabled';

export function isScreensPlayer() {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return userAgent.includes('tizen')
      || userAgent.includes('electron')
      || userAgent.includes('cros')
      || localStorage.getItem(PLAYER_DEBUG_MODE_ENABLED) === 'true';
}
