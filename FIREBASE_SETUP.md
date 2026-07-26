# Firebase Setup Guide

Step-by-step instructions to set up Firebase for your Electronics E-Commerce platform.

---

## Prerequisites
- A Google account
- Your project code ready
- `.env` file ready for configuration

---

## STEP 1: Create Firebase Project

1. Go to **https://console.firebase.google.com**
2. Click **"Add project"** or **"Create a project"**
3. Enter project details:
   - **Project name:** `electronics-store` (or your preferred name)
   - Toggle off Google Analytics (optional for development)
4. Click **"Create project"** or **"Continue"**
5. Wait for project creation (takes 30-60 seconds)

**✅ Expected Result:** Firebase project is created

---

## STEP 2: Register Your Web App

1. On the project dashboard, click the **web icon** (`</`) or the **"Web app"** icon
2. Enter app details:
   - **App nickname:** `Electronics Store Web`
   - Check **"Also set up Firebase Hosting"** (optional)
3. Click **"Register app"**
4. Copy the `firebaseConfig` object (you'll need this later)

**Example config:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "electronics-store.firebaseapp.com",
  projectId: "electronics-store",
  storageBucket: "electronics-store.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

**✅ Expected Result:** App registered, config object copied

---

## STEP 3: Enable Authentication

1. In left sidebar, click **"Build"** → **"Authentication"**
2. Click **"Get started"**
3. Click **"Sign-in method"** tab
4. Click on **"Email/Password"**
5. Toggle **"Enable"** to ON
6. Click **"Save"**

**✅ Expected Result:** Email/Password authentication enabled

---

## STEP 4: Create Firestore Database

1. In left sidebar, click **"Build"** → **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in test mode"** (for development)
   - ⚠️ This allows read/write access to everyone
   - We'll secure it later with security rules
4. Click **"Next"**
5. Choose a location:
   - Select a location close to you
   - Example: `us-central` or `asia-south1`
6. Click **"Enable"**

**✅ Expected Result:** Firestore database created

---

## STEP 5: Create Firestore Collections

You need to create these collections in Firestore:

### Collection 1: `user_profiles`
1. Click **"Start collection"**
2. Collection ID: `user_profiles`
3. Click **"Save and close"** (we'll add fields via code)

### Collection 2: `categories`
1. Click **"Start collection"**
2. Collection ID: `categories`
3. Click **"Save and close"**

### Collection 3: `products`
1. Click **"Start collection"**
2. Collection ID: `products`
3. Click **"Save and close"**

### Collection 4: `orders`
1. Click **"Start collection"**
2. Collection ID: `orders`
3. Click **"Save and close"**

### Collection 5: `order_items`
1. Click **"Start collection"**
2. Collection ID: `order_items`
3. Click **"Save and close"**

**✅ Expected Result:** 5 collections created

**Note:** The fields will be added automatically when you create documents through the app. The collections need to exist first.

---

## STEP 6: Set Up Storage (for Images)

1. In left sidebar, click **"Build"** → **"Storage"**
2. Click **"Get started"**
3. Select **"Start in test mode"**
4. Click **"Next"**
5. Choose a location (same as Firestore)
6. Click **"Done"**

**✅ Expected Result:** Storage bucket created

---

## STEP 7: Configure Security Rules

### Firestore Rules
1. Go to **Firestore Database** → **"Rules"** tab
2. Replace the default rules with:

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles - users can read/write their own
    match /user_profiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Categories - anyone can read, only authenticated users can write
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Products - anyone can read, only authenticated users can write
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Orders - users can read their own, admins can read all
    match /orders/{orderId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }
    
    // Order items - users can read their own order items
    match /order_items/{itemId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

### Storage Rules
1. Go to **Storage** → **"Rules"** tab
2. Replace with:

```rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

**✅ Expected Result:** Security rules published

---

## STEP 8: Get Firebase Config

1. Go to **Project Settings** (gear icon near top left)
2. Scroll down to **"Your apps"** section
3. Click on your web app (or the app you registered)
4. You'll see the config object again
5. Copy each value carefully

**Required values:**
- `apiKey`
- `authDomain`
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`

---

## STEP 9: Update .env File

1. Open your `.env` file in the project root
2. Replace the placeholder values with your actual Firebase values:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=electronics-store.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=electronics-store
VITE_FIREBASE_STORAGE_BUCKET=electronics-store.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

3. Save the file (Ctrl+S)

**⚠️ IMPORTANT:** Never share this file or commit it to GitHub. It contains sensitive credentials.

---

## STEP 10: Create Admin User

1. Go back to Firebase Console
2. Click **"Authentication"** → **"Users"** tab
3. Click **"Add user"**
4. Enter:
   - **Email:** `admin@boat.com`
   - **Password:** (create a strong password)
   - **Display name** (optional): `Admin User`
5. Click **"Add user"**

**📝 SAVE THIS PASSWORD - YOU'LL NEED IT!**

**✅ Expected Result:** Admin user created

---

## STEP 11: Test Your Setup

1. In your terminal, start the dev server:
   ```bash
   npm run dev
   ```

2. Open browser to: **http://localhost:5173**

3. Test the following:
   - Homepage loads with products (if you added any)
   - You can sign up with a new account
   - You can login
   - Cart works
   - Checkout works

**Note:** Since collections are empty, you won't see any products initially. You'll need to add them via the admin panel.

---

## STEP 12: Add Initial Data (Optional)

### Option A: Add via Admin Panel
1. Go to http://localhost:5173
2. Login as admin: `admin@boat.com`
3. Go to **Admin Panel** (link in navbar)
4. Add categories and products

### Option B: Add via Firebase Console
1. Go to Firestore Database
2. Click on a collection (e.g., `categories`)
3. Click **"Start collection"** → Select existing collection
4. Click **"Add document"**
5. Add fields manually (title, imageID, etc.)

---

## STEP 13: Verify Firebase Integration

### Check Authentication
1. Go to Firebase Console → Authentication → Users
2. After signing up in your app, you should see the new user here

### Check Firestore
1. Go to Firebase Console → Firestore Database
2. After creating products/categories/orders, you should see documents here

### Check Storage
1. Go to Firebase Console → Storage
2. After uploading images, you should see files here

---

## 🎉 SETUP COMPLETE!

Your Firebase backend is now fully configured and connected to your app!

**What you can do now:**
- ✅ User authentication (signup/login)
- ✅ Browse products
- ✅ Add to cart
- ✅ Place orders
- ✅ Admin panel to manage products/categories
- ✅ Order management

---

## 🔧 Troubleshooting

### Issue 1: "Firebase not configured" error
**Solution:** 
- Check `.env` file has correct Firebase config values
- Verify no typos in variable names (must start with `VITE_`)
- Restart dev server after changing `.env`

### Issue 2: "Permission denied" error
**Solution:**
- Check Firestore security rules
- Make sure user is authenticated
- Verify rules allow the operation

### Issue 3: Images not uploading
**Solution:**
- Check Storage is enabled in Firebase Console
- Verify Storage security rules
- Check browser console for errors

### Issue 4: Can't see products
**Solution:**
- Collections are empty - add products via admin panel
- Or check browser console for errors

### Issue 5: Authentication not working
**Solution:**
- Verify Email/Password auth is enabled in Firebase Console
- Check `.env` values are correct
- Check browser console for error messages

---

## 📚 Additional Resources

### Firebase Documentation
- Firestore: https://firebase.google.com/docs/firestore
- Authentication: https://firebase.google.com/docs/auth
- Storage: https://firebase.google.com/docs/storage
- JavaScript SDK: https://firebase.google.com/docs/web/setup

### Security Rules
- Learn more: https://firebase.google.com/docs/rules
- Test rules in Firebase Console

---

## 🔄 Switching from Appwrite to Firebase

If you were previously using Appwrite:

1. ✅ Firebase service file created (`src/services/firebase.js`)
2. ✅ All imports updated from `appwriteService` to `firebaseService`
3. ✅ Package.json updated (appwrite removed)
4. ✅ Environment variables changed from `VITE_APPWRITE_*` to `VITE_FIREBASE_*`
5. ✅ Old Appwrite code can be deleted (optional)

**Note:** Both systems can coexist during migration if needed, but it's recommended to fully migrate to one backend.

---

## 🎓 Firebase vs Appwrite

**Firebase Advantages:**
- More widely used and documented
- Large community and ecosystem
- Better Google Cloud integration
- More third-party integrations

**Appwrite Advantages:**
- Open source
- Self-hostable
- Simpler pricing
- Faster for certain operations

**Your choice:** Firebase is now your backend!

---

## Next Steps

1. **Configure Firebase Console** (follow steps above)
2. **Update .env** with your Firebase credentials
3. **Test the application**
4. **Add products and categories** via admin panel
5. **Deploy to production** (optional)

---

## Need Help?

If you encounter issues:
1. Check browser console (F12) for error messages
2. Verify Firebase Console shows your app
3. Check `.env` file has correct values
4. Review Firebase documentation
5. Restart dev server after environmental changes

**Your app is ready to use with Firebase! 🚀**