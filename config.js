// ============================================================
//  LMS CONFIG FILE
//  ⚠️ শুধু এই ফাইলটি পরিবর্তন করুন নতুন client এর জন্য
// ============================================================

const LMS_CONFIG = {

  // ── 1. FIREBASE CONFIG ─────────────────────────────────
  firebase: {
    apiKey: "AIzaSyD41LQfLRymx3kLd8tD1ZuXS_s0aMe85n4",
    authDomain: "codemyst-lms2.firebaseapp.com",
    projectId: "codemyst-lms2",
    storageBucket: "codemyst-lms2.firebasestorage.app",
    messagingSenderId: "827010164292",
    appId: "1:827010164292:web:4aeebb24cb290654823e11",
    measurementId: "G-NTR0GJZDN1"
  },

  // ── 2. SCHOOL / INSTITUTE INFO ─────────────────────────
  school: {
    name: "Codemyst Academy",
    tagline: "Learn. Build. Grow.",
    logo: "https://i.imgur.com/placeholder-logo.png", // logo URL দিন
    favicon: "",                                        // favicon URL (optional)
    address: "Dhaka, Bangladesh",
    phone: "+880 1700-000000",
    email: "info@codemyst.dev",
    website: "https://codemyst.dev"
  },

  // ── 3. BRANDING / COLORS ───────────────────────────────
  theme: {
    primaryColor:   "#4F46E5",   // Main brand color
    secondaryColor: "#06B6D4",   // Accent color
    darkBg:         "#0F172A",   // Dark background
    lightBg:        "#F8FAFC",   // Light background
    fontFamily:     "'Sora', sans-serif"
  },

  // ── 4. FEATURES (চালু/বন্ধ করুন) ───────────────────────
  features: {
    enableVideoLessons:    true,
    enableQuiz:            true,
    enableCertificate:     true,
    enableLiveClass:       false,  // Zoom/Meet link support
    enableAssignment:      true,
    enableDiscussion:      false,
    enablePayment:         false,  // bKash/SSLCommerz (future)
    enableMultiLanguage:   false
  },

  // ── 5. SOCIAL LINKS ────────────────────────────────────
  social: {
    facebook:  "https://facebook.com/",
    youtube:   "https://youtube.com/",
    whatsapp:  "",
    telegram:  ""
  },

  // ── 6. LANDING PAGE TEXT ──────────────────────────────
  landing: {
    heroTitle:    "আপনার স্বপ্নের ক্যারিয়ার শুরু হোক আজই",
    heroSubtitle: "দক্ষ শিক্ষকদের সাথে অনলাইনে শিখুন, যেকোনো সময়, যেকোনো জায়গা থেকে।",
    ctaText:      "বিনামূল্যে শুরু করুন",
    stats: [
      { value: "500+", label: "শিক্ষার্থী" },
      { value: "20+",  label: "কোর্স" },
      { value: "15+",  label: "শিক্ষক" },
      { value: "95%",  label: "সন্তুষ্টি" }
    ]
  }

};
