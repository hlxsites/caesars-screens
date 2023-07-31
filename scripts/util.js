const PLAYER_DEBUG_MODE_ENABLED = 'player-debug-mode-enabled';

export default function isScreensPlayer() {
  // const userAgent = window.navigator.userAgent.toLowerCase();
  return true;
  // return userAgent.includes('tizen')
  //     || userAgent.includes('electron')
  //     || userAgent.includes('cros')
  //     || localStorage.getItem(PLAYER_DEBUG_MODE_ENABLED) === 'true';
}
