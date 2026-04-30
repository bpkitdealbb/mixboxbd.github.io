const CACHE_NAME = 'mix-box-v2.2'; // ভার্সন আপডেট করেছি
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://i.postimg.cc/8zKG1ndp/20260113-210931.png?v=2'
];

// ইনস্টল এবং অ্যাক্টিভেট হওয়ার সাথে সাথে পুরোনোটা রিপ্লেস করা
self.addEventListener('install', event => {
  self.skipWaiting(); // গুরুত্বপূর্ণ: অপেক্ষা না করে সাথে সাথে ইনস্টল করো
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  self.clients.claim(); // গুরুত্বপূর্ণ: সব ক্লায়েন্টকে নতুন ভার্সন কন্ট্রোল করতে দাও
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// ফেচ হ্যান্ডলার
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
