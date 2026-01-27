if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.log('Service Worker registered:', registration);

        // Check for updates periodically (every hour)
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;

          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              // New service worker available
              console.log('New version available');

              // Notify user
              if (window.confirm('New version available! Reload to update?')) {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
              } else {
                // Soft prompt to user
                const event = new CustomEvent('swUpdate', {
                  detail: { registration }
                });
                window.dispatchEvent(event);
              }
            }
          });
        });
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });

    // Listen for service worker controller change
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('New service worker is controlling the page');
      window.location.reload();
    });
  });

  // Cache update notification handler
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data.type === 'CACHE_UPDATED') {
      console.log('Cache updated:', event.data.message);
    }
  });
}