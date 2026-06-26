self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  // ক্যাশ বা অফলাইন ম্যানেজমেন্টের জন্য (আপাতত বেসিক সচল রাখার জন্য এটিই যথেষ্ট)
});