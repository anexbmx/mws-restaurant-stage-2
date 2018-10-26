const cacheName = "restaurant-v2";
const contentImgsCache = "restaurant-imgs-v2";
self.addEventListener('install', (event) => {
 event.waitUntil(
   caches.open(cacheName).then((cache) => {
     return cache.addAll([
       '/',
       '/index.html',
       '/restaurant.html',
       '/favicon.ico',
       'css/styles.css',
       'js/bundle.min.js',
       'js/bundle_restaurant.min.js'
       ]).then(() => {
        console.log('Finished caching all files!');
      }).catch((error) => {
        console.log('Caching threw an error: ', error);
      })
    })
   );
});

self.addEventListener('activate',(event)=>{
  event.waitUntil(
    caches.keys().then((keys)=>{
      return Promise.all(
        keys.map((key)=>{
          if(key!=cacheName)
            return caches.delete(key);
        })
        )
    })
    );
})


self.addEventListener('fetch', function(event) {
  const requestUrl = new URL(event.request.url);
  console.log(requestUrl.pathname)
  if (requestUrl.pathname.startsWith('/img/')) {
    event.respondWith(servePhoto(event.request));
    return;
  }

  event.respondWith(
    
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      } else {
        return fetch(event.request).then(function(response) {
          let responseClone = response.clone();
          caches.open(cacheName).then(function(cache) {
            cache.put(event.request, responseClone);
          });
          return response;
        }).catch(function() {
          return new Response('<h1>This page Not visited or cached!</h1>'
            , {
            headers: {'Content-Type': 'text/html'}
          });
        })
      }
    })
  )
});

function servePhoto(request) {

  return caches.open(contentImgsCache).then((cache) => {
    return cache.match(request.url).then((response) => {
      if(response) return response;

      return fetch(request).then((function (networkResponse) {
        cache.put(request.url, networkResponse.clone());
        return networkResponse;
      }))
    })
  })
}