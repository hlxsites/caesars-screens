export function isScreensPlayer() {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return true;
  // return userAgent.includes('tizen') || userAgent.includes('electron') || userAgent.includes('cros');
}
