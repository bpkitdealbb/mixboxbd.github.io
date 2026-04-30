const CACHE_NAME = 'mix-box-v1.1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://i.postimg.cc/8zKG1ndp/20260113-210931.png?v=2'
];

// ফাইলগুলো ক্যাশ (Cache) করা হচ্ছে
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// অফলাইনে ক্যাশ থেকে ডেটা লোড করা হচ্ছে
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // যদি ক্যাশে ডেটা থাকে তবে সেটি দেখাবে, না থাকলে নেটওয়ার্ক থেকে আনবে
        return response || fetch(event.request);
      })
  );
});
