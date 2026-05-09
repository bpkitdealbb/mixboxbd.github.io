const CACHE_NAME = 'mix-box-v1.2'; // ভার্সন আপডেট করেছি
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
    'https://res.cloudinary.com/dkowkawiq/image/upload/v1778256089/Visit_us_mixboxbd._github.io_20260508_215908_0000_x2xhms.png?v=2'
];

// ইনস্টল এবং অ্যাক্টিভেট
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  self.clients.claim();
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// ফেচ হ্যান্ডলার (স্মার্ট ক্যাশিং স্ট্র্যাটেজি)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // যদি ক্যাশে থাকে, তবে ব্যাকগ্রাউন্ডে নেটওয়ার্ক থেকে আপডেট চেক করবে
      if (response) {
        // নেটওয়ার্ক রিকোয়েস্ট পাঠিয়ে ক্যাশ আপডেট করার চেষ্টা (নীরবে)
        fetch(event.request).then(networkResponse => {
            caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, networkResponse.clone());
            });
        }).catch(() => {}); // নেটওয়ার্ক ফেইল করলে ইগনোর করুন
        
        // ক্যাশ থেকে রেসপন্স দিন
        return response;
      }
      
      // যদি ক্যাশে না থাকে, নেটওয়ার্ক থেকে আনুন এবং ক্যাশ করুন
      return fetch(event.request).then(response => {
        // ভ্যালিড রেসপন্স চেক করুন
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          });

        return response;
      });
    })
  );
});
