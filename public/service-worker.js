importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.1.1/workbox-sw.js');

if (workbox){
  workbox.precaching.precacheAndRoute([
	    { url: '/', revision: '1' },
	    { url: '/manifest.json', revision: '1' },
	    { url: '/index.html', revision: '1' },
	    { url: '/nav.html', revision: '1' },
	    { url: '/match.html', revision: '1' },
	    { url: '/team.html', revision: '1' },
	    { url: '/pages/index.html', revision: '1' },
	    { url: '/pages/about.html', revision: '1' },
	    { url: '/pages/team.html', revision: '1' },
	    { url: '/pages/match.html', revision: '1' },
	    { url: '/pages/favourite.html', revision: '1' },
	    { url: '/css/materialize.min.css', revision: '1' },
	    { url: '/js/materialize.min.js', revision: '1' },
	    { url: '/js/nav.js', revision: '1' },
	    { url: '/js/api.js', revision: '1' },
	    { url: '/js/database.js', revision: '1' },
	    { url: '/js/idb.js', revision: '1' },
	    { url: '/icon.png', revision: '1' },
  ]);
  workbox.routing.registerRoute(
	  new RegExp('/pages/'),
	  workbox.strategies.staleWhileRevalidate({
		  cacheName: 'pages'
	  })
  );
  workbox.routing.registerRoute(
	/\.(?:png|gif|jpg|jpeg|svg)$/,
	workbox.strategies.cacheFirst()
  );

  console.log(`Workbox berhasil dimuat`);
}
else{
  console.log(`Workbox gagal dimuat`);
}

self.addEventListener('push', function(event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  var options = {
    body: body,
    icon: 'img/notification.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});