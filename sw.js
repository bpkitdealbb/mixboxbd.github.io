const CACHE_NAME = 'mix-box-v1.2'; // ভার্সন আবার বাড়িয়ে দিন
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://i.postimg.cc/8zKG1ndp/20260113-210931.png?v=2'
];

// ==========================================
// ইনস্টল এবং নতুন ভার্সন এক্টিভেট করার লজিক
// ==========================================
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // এটি খুবই গুরুত্বপূর্ণ: নতুন ওয়ার্কার ইনস্টল হলে সে পুরোনোটাকে জোর করে রিপ্লেস করবে
        return self.skipWaiting();
      })
  );
});

// একটিভেট ইভেন্ট
self.addEventListener('activate', event => {
  // পুরোনো ক্যাশগুলো ডিলিট করার লজিক
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  
  // এটি নিশ্চিত করবে যে নতুন ওয়ার্কার সাথে সাথে সব ক্লায়েন্টকে কন্ট্রোল করবে
  return self.clients.claim();
});

// ==========================================
// ফেচ ইভেন্ট (ডেটা লোড করা)
// ==========================================
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // যদি ক্যাশে থাকে তবে দেখাবে, না থাকলে নেটওয়ার্ক থেকে আনবে এবং ক্যাশে সেভ করবে
        if (response) {
          return response;
        }
        
        // নেটওয়ার্ক থেকে ডেটা আনা এবং ক্যাশ করা
        return fetch(event.request).then(response => {
          // চেক করা যে রেসপন্স ভ্যালিড কিনা
          if(!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // রেসপন্স ক্লোন করে ক্যাশে রাখা
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
