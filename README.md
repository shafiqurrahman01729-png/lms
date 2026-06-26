# 🔥 Codemyst LMS — নতুন Client Firebase Setup Guide
> এই গাইড অনুসরণ করলে যেকোনো নতুন client-এর জন্য সম্পূর্ণ LMS ৩০ মিনিটে ready হবে।

---

## ✅ STEP 1 — Firebase Project তৈরি

1. [https://console.firebase.google.com](https://console.firebase.google.com) এ যান
2. **"Add project"** → Project name দিন (যেমন: `ribd-lms`)
3. Google Analytics: **disable** করতে পারেন (optional)
4. **"Create project"** → Continue

---

## ✅ STEP 2 — Web App যোগ করো

1. Project home → **`</>`** (Web) আইকনে ক্লিক
2. App nickname দিন → **"Also set up Firebase Hosting"** চেক করুন
3. **Register app** → firebaseConfig কপি করো
4. এই config `config.js` এর `firebase: { ... }` block এ বসাও

---

## ✅ STEP 3 — Authentication চালু করো

1. বাম মেনু → **Authentication** → **Get started**
2. **Sign-in method** ট্যাব → **Email/Password** → Enable → Save
3. ব্যস, Auth ready ✓

> ⚠️ Google Sign-in, Phone Auth লাগবে না।

---

## ✅ STEP 4 — Firestore Database তৈরি

1. বাম মেনু → **Firestore Database** → **Create database**
2. Mode: **Production mode** (rules পরে ঠিক করবো)
3. Location: **asia-south1 (Mumbai)** — বাংলাদেশের জন্য সবচেয়ে কাছে
4. **Enable** → Done ✓

---

## ✅ STEP 5 — Firestore Rules সেট করো

**Firestore → Rules** ট্যাবে গিয়ে এই rules paste করো:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ── Helper functions ──────────────────────────
    function isLoggedIn() {
      return request.auth != null;
    }
    function isOwner(uid) {
      return request.auth.uid == uid;
    }
    function isAdmin() {
      return isLoggedIn() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    // ── users collection ──────────────────────────
    match /users/{uid} {
      allow read:   if isLoggedIn() && (isOwner(uid) || isAdmin());
      allow create: if isLoggedIn() && isOwner(uid);
      allow update: if isLoggedIn() && (isOwner(uid) || isAdmin());
      allow delete: if isAdmin();
    }
    // ── courses collection ────────────────────────
    match /courses/{courseId} {
      allow read:   if isLoggedIn() || resource.data.published == true;
      allow write:  if isAdmin();
      // student শুধু avgRating ও totalRatings update করতে পারবে
      allow update: if isLoggedIn() &&
                       request.resource.data.diff(resource.data).affectedKeys()
                         .hasOnly(['avgRating', 'totalRatings']);
    }
    // ── lessons subcollection ─────────────────────
    match /courses/{courseId}/lessons/{lessonId} {
      allow read:   if isLoggedIn();
      allow write:  if isAdmin();
    }
    // ── progress subcollection ────────────────────
    match /courses/{courseId}/progress/{uid} {
      allow read:   if isLoggedIn() && (isOwner(uid) || isAdmin());
      allow write:  if isLoggedIn() && isOwner(uid);
    }
    // ── notices collection ────────────────────────
    match /notices/{id} {
      allow read:   if isLoggedIn();
      allow write:  if isAdmin();
    }
    // ── siteSettings collection ───────────────────
    match /siteSettings/{doc} {
      allow read:   if true;   // public — landing page এ দরকার
      allow write:  if isAdmin();
    }
    // ── certificates collection ───────────────────
    match /certificates/{id} {
      allow read:   if true;  // public — verification এর জন্য
      allow create: if isLoggedIn() && request.resource.data.userId == request.auth.uid;
      allow delete: if isAdmin();
    }
    match /payments/{id} {
  		allow create: if isLoggedIn() && request.resource.data.userId == request.auth.uid;
  		allow read:   if isLoggedIn() && (resource.data.userId == request.auth.uid || isAdmin());
  		allow update: if isAdmin();
  		allow delete: if isAdmin();
    }
    // ── ratings collection ────────────────────────
    match /ratings/{id} {
      allow read:   if isLoggedIn();
      allow create: if isLoggedIn() && request.resource.data.userId == request.auth.uid;
      allow update: if isLoggedIn() && resource.data.userId == request.auth.uid;
      allow delete: if isAdmin();
    }
    match /userProgress/{uid} {
  		allow read, write: if isLoggedIn() && isOwner(uid);
  		match /courses/{courseId} {
    		allow read, write: if isLoggedIn() && isOwner(uid);
  		}
		}
  }
}
```

**Publish** → Done ✓

---

## ✅ STEP 6 — Firestore Indexes তৈরি করো

**Firestore → Indexes → Composite** ট্যাব → **Add index**

নিচের indexes গুলো একটা একটা করে তৈরি করো:

| Collection | Fields | Order |
|---|---|---|
| `courses` | `isPublished` ASC, `createdAt` DESC | — |
| `courses` | `category` ASC, `isPublished` ASC | — |
| `notices` | `pinned` DESC, `createdAt` DESC | — |
| `users` | `role` ASC, `createdAt` DESC | — |

> 💡 **Shortcut:** App চালালে console এ যদি index error আসে, সেই error এর link এ click করলেই auto index তৈরি হয়।

---

## ✅ STEP 7 — Firestore Initial Data সেটআপ

### 7a. Admin User তৈরি

1. প্রথমে সাইটে গিয়ে **Register** করো client-এর admin email দিয়ে
2. Firebase Console → **Firestore → users** collection → সেই user-এর document খোলো
3. `role` field এর value **`student`** থেকে **`admin`** করো → Save

### 7b. Site Settings (Landing Page Content)

**Firestore → siteSettings → main** document তৈরি করো এই fields দিয়ে:

```
appName:       "Risalatul Islam BD"           (string)
pageTitle:     "RIBD LMS — ইসলামী শিক্ষা"    (string)
metaDesc:      "অনলাইনে ইসলামী শিক্ষা..."     (string)
logoUrl:       "https://..."                   (string — logo image URL)
faviconUrl:    "https://..."                   (string — favicon URL, optional)
heroTitle:     "আপনার শিরোনাম এখানে"          (string)
heroDesc:      "সাবটাইটেল এখানে"              (string)
heroCta:       "শুরু করুন"                    (string)
eyebrow:       "Trusted Platform"              (string)
primaryColor:  "#0070f3"                       (string — hex color)
accentColor:   "#f59e0b"                       (string — hex color, optional)
contactEmail:  "info@ribd.com"                 (string)
stats:         (array)
  - { value: "500+", label: "শিক্ষার্থী" }
  - { value: "20+",  label: "কোর্স" }
  - { value: "15+",  label: "শিক্ষক" }
  - { value: "95%",  label: "সন্তুষ্টি" }
```

---

## ✅ STEP 8 — Firebase Hosting Deploy

Terminal / Firebase CLI:

```bash
# প্রথমবার — Firebase CLI install
npm install -g firebase-tools

# Login
firebase login

# Project folder এ যাও
cd your-project-folder

# Init (প্রথমবার)
firebase init hosting
# → Use existing project → client-এর project select করো
# → Public directory: . (dot — current folder)
# → Single-page app: No
# → Overwrite index.html: No

# Deploy
firebase deploy --only hosting
```

> প্রতিবার update এর পর শুধু `firebase deploy --only hosting` চালালেই হবে।

---

## ✅ STEP 9 — PWA Manifest আপডেট

`manifest.json` এ client-এর নাম দাও:

```json
{
  "short_name": "RIBD",
  "name": "Risalatul Islam BD",
  "theme_color": "#0070f3"
}
```

---

## 📋 Final Checklist

- [ ] Firebase project তৈরি
- [ ] Web app register + config.js update
- [ ] Email/Password Auth enable
- [ ] Firestore create (asia-south1)
- [ ] Firestore rules publish
- [ ] Indexes তৈরি
- [ ] Admin user role set
- [ ] siteSettings/main document তৈরি
- [ ] Firebase Hosting deploy
- [ ] manifest.json update
- [ ] সাইট live test — Login, Dashboard, Admin panel check

---

## 🚨 Common Errors

| Error | কারণ | সমাধান |
|---|---|---|
| `permission-denied` | Rules সঠিক নয় | Rules আবার check করো |
| `firebaseConfig not found` | config.js load হয়নি | HTML এ `<script src="config.js">` আছে কিনা দেখো |
| Blank page after login | Admin role নেই | Firestore এ role: "admin" দাও |
| Index error in console | Composite index নেই | Error এর link এ click করো |

---

*Generated by Codemyst LMS System*
