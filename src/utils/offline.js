/**
 * Service worker registration and offline utilities for Bongo-Lab.
 * @module offline
 */

/**
 * Register the service worker for PWA offline support.
 */
export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New content available — could show an update prompt
          console.log('Bongo-Lab: nouvelle version disponible.');
        }
      });
    });
  } catch (error) {
    console.error('Erreur d\'enregistrement du service worker:', error);
  }
}

/**
 * Check if the app is currently online.
 * @returns {boolean}
 */
export function isOnline() {
  return navigator.onLine;
}

/**
 * Listen for online/offline status changes.
 * @param {function} callback - Called with boolean (true = online)
 * @returns {function} Cleanup function to remove listeners
 */
export function onConnectivityChange(callback) {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}
