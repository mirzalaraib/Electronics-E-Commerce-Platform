# Appwrite Database Setup Guide

Step-by-step instructions to set up your Appwrite backend for the Electronics E-Commerce platform.

---

## Prerequisites
- Computer with internet connection
- Web browser (Chrome/Firefox/Edge)
- Your project files ready

---

## STEP 1: Create Appwrite Account

1. Open your browser and go to: **https://cloud.appwrite.io**
2. Click **"Sign Up"** (top right corner)
3. Enter your email address
4. Create a password (save it somewhere safe)
5. Verify your email if prompted
6. Log in to your new account

**✅ Expected Result:** You should see the Appwrite dashboard

---

## STEP 2: Create a New Project

1. Click **"Create Project"** button (big button on dashboard)
2. Enter project details:
   - **Project ID:** `electronics_store` (all lowercase, no spaces)
   - **Project Name:** Electronics Store
   - **Description:** E-commerce platform for electronics
3. Click **"Create"**

**✅ Expected Result:** Project dashboard opens

---

## STEP 3: Get Your Project Credentials

1. In your project dashboard, look at the top bar
2. You'll see:
   - **Project ID:** (copy this - something like `electronics_store`)
   - **API Endpoint:** `https://cloud.appwrite.io/v1` (this is standard)

3. **Save these somewhere** - you'll need them later

**📝 Note down:**
- Project ID: `__________________________`
- Endpoint: `https://cloud.appwrite.io/v1`

---

## STEP 4: Enable Authentication

1. In left sidebar, click **"Authentication"**
2. Click **"Settings"** tab
3. Under **"Sign In Method"**:
   - Find **"Email/Password"**
   - Toggle it **ON** (green/enabled)
4. Scroll down and make sure **"Email Verification"** is OFF (for development)
5. Click **"Save"**

**✅ Expected Result:** Email/Password authentication enabled

---

## STEP 5: Create Database

1. In left sidebar, click **"Databases"**
2. Click **"Create Database"**
3. Enter:
   - **Database ID:** `electronics_store`
   - **Database Name:** Electronics Store DB
4. Click **"Create"**

**✅ Expected Result:** Database created successfully

---

## STEP 6: Create First Collection - UsersProfile

1. Click **"Create Collection"** button
2. Enter collection details:
   - **Collection ID:** `user_profiles`
   - **Collection Name:** User Profiles
3. Click **"Create"**

4. **Now add 3 attributes (fields):**
   
   Click **"Add Attribute"** three times:

   **Attribute 1:**
   - Name: `phone`
   - Type: String
   - Size: 50
   - Required: Yes
   - Click "Create"

   **Attribute 2:**
   - Name: `address`
   - Type: String
   - Size: 500
   - Required: No
   - Click "Create"

   **Attribute 3:**
   - Name: `fullName`
   - Type: String
   - Size: 200
   - Required: Yes
   - Click "Create"

**✅ Expected Result:** Collection "user_profiles" with 3 attributes

---

## STEP 7: Create Second Collection - Categories

1. Click **"Create Collection"**
2. Enter:
   - **Collection ID:** `categories`
   - **Collection Name:** Categories
3. Click **"Create"**

4. **Add 2 attributes:**

   **Attribute 1:**
   - Name: `title`
   - Type: String
   - Size: 100
   - Required: Yes
   - Click "Create"

   **Attribute 2:**
   - Name: `imageID`
   - Type: String
   - Size: 500
   - Required: No
   - Click "Create"

**✅ Expected Result:** Collection "categories" with 2 attributes

---

## STEP 8: Create Third Collection - Products

1. Click **"Create Collection"**
2. Enter:
   - **Collection ID:** `products`
   - **Collection Name:** Products
3. Click **"Create"**

4. **Add 6 attributes:**

   **Attribute 1:**
   - Name: `name`
   - Type: String
   - Size: 200
   - Required: Yes
   - Click "Create"

   **Attribute 2:**
   - Name: `price`
   - Type: Integer
   - Required: Yes
   - Click "Create"

   **Attribute 3:**
   - Name: `description`
   - Type: String
   - Size: 2000
   - Required: Yes
   - Click "Create"

   **Attribute 4:**
   - Name: `categoryID`
   - Type: String
   - Size: 100
   - Required: Yes
   - Click "Create"

   **Attribute 5:**
   - Name: `imageID`
   - Type: String
   - Size: 500
   - Required: Yes
   - Click "Create"

   **Attribute 6:**
   - Name: `specifications`
   - Type: String
   - Size: 2000
   - Required: No
   - Click "Create"

**✅ Expected Result:** Collection "products" with 6 attributes

---

## STEP 9: Create Fourth Collection - Orders

1. Click **"Create Collection"**
2. Enter:
   - **Collection ID:** `orders`
   - **Collection Name:** Orders
3. Click **"Create"**

4. **Add 8 attributes:**

   **Attribute 1:**
   - Name: `userID`
   - Type: String
   - Size: 100
   - Required: Yes
   - Click "Create"

   **Attribute 2:**
   - Name: `customerName`
   - Type: String
   - Size: 200
   - Required: Yes
   - Click "Create"

   **Attribute 3:**
   - Name: `phone`
   - Type: String
   - Size: 50
   - Required: Yes
   - Click "Create"

   **Attribute 4:**
   - Name: `address`
   - Type: String
   - Size: 500
   - Required: Yes
   - Click "Create"

   **Attribute 5:**
   - Name: `totalPrice`
   - Type: Integer
   - Required: Yes
   - Click "Create"

   **Attribute 6:**
   - Name: `quantity`
   - Type: Integer
   - Required: Yes
   - Click "Create"

   **Attribute 7:**
   - Name: `status`
   - Type: String
   - Size: 50
   - Required: Yes
   - Click "Create"

   **Attribute 8:**
   - Name: `paymentMethod`
   - Type: String
   - Size: 50
   - Required: Yes
   - Click "Create"

**✅ Expected Result:** Collection "orders" with 8 attributes

---

## STEP 10: Create Fifth Collection - OrderItems

1. Click **"Create Collection"**
2. Enter:
   - **Collection ID:** `order_items`
   - **Collection Name:** Order Items
3. Click **"Create"**

4. **Add 6 attributes:**

   **Attribute 1:**
   - Name: `orderID`
   - Type: String
   - Size: 100
   - Required: Yes
   - Click "Create"

   **Attribute 2:**
   - Name: `productID`
   - Type: String
   - Size: 100
   - Required: Yes
   - Click "Create"

   **Attribute 3:**
   - Name: `productName`
   - Type: String
   - Size: 200
   - Required: Yes
   - Click "Create"

   **Attribute 4:**
   - Name: `price`
   - Type: Integer
   - Required: Yes
   - Click "Create"

   **Attribute 5:**
   - Name: `quantity`
   - Type: Integer
   - Required: Yes
   - Click "Create"

   **Attribute 6:**
   - Name: `imageID`
   - Type: String
   - Size: 500
   - Required: Yes
   - Click "Create"

**✅ Expected Result:** Collection "order_items" with 6 attributes

---

## STEP 11: Set Up Permissions (IMPORTANT!)

For each of the 5 collections, we need to set permissions:

### For user_profiles:
1. Click on "user_profiles" collection
2. Click **"Settings"** tab
3. Scroll to **"Permissions"**
4. Add these permissions:
   - **Read:** Any (allows users to read their own profile)
   - **Create:** Any (allows creating profile)
   - **Update:** Any (allows updating profile)
   - **Delete:** None (no one should delete profiles)
5. Click "Update"

### For categories:
1. Click on "categories" collection
2. Click **"Settings"** tab
3. Permissions:
   - **Read:** Any
   - **Create:** Any
   - **Update:** Any
   - **Delete:** Any
4. Click "Update"

### For products:
1. Click on "products" collection
2. Click **"Settings"** tab
3. Permissions:
   - **Read:** Any
   - **Create:** Any
   - **Update:** Any
   - **Delete:** Any
4. Click "Update"

### For orders:
1. Click on "orders" collection
2. Click **"Settings"** tab
3. Permissions:
   - **Read:** Any
   - **Create:** Any
   - **Update:** Any
   - **Delete:** None
4. Click "Update"

### For order_items:
1. Click on "order_items" collection
2. Click **"Settings"** tab
3. Permissions:
   - **Read:** Any
   - **Create:** Any
   - **Update:** None
   - **Delete:** None
4. Click "Update"

**✅ Expected Result:** All collections have proper permissions

---

## STEP 12: Create Storage Bucket

1. In left sidebar, click **"Storage"**
2. Click **"Create Bucket"**
3. Enter:
   - **Bucket ID:** `images`
   - **Bucket Name:** Product & Category Images
   - **Permissions:** 
     - Enable "Read" for Any
     - Enable "Create" for Any
     - Enable "Update" for Any
4. Click **"Create"**

**✅ Expected Result:** Storage bucket "images" created

---

## STEP 13: Configure Environment Variables

1. Go back to your VS Code project
2. Open the `.env` file in the root folder
3. Replace the content with:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id_here
VITE_APPWRITE_DATABASE_ID=electronics_store
VITE_APPWRITE_PRODUCTS_COLLECTION_ID=products
VITE_APPWRITE_CATEGORIES_COLLECTION_ID=categories
VITE_APPWRITE_ORDERS_COLLECTION_ID=orders
VITE_APPWRITE_ORDER_ITEMS_COLLECTION_ID=order_items
VITE_APPWRITE_PROFILES_COLLECTION_ID=user_profiles
VITE_APPWRITE_IMAGES_BUCKET_ID=images
```

4. **IMPORTANT:** Replace `your_project_id_here` with your actual Project ID from Step 3

5. Save the file (Ctrl+S)

**⚠️ NEVER SHARE THIS FILE WITH ANYONE - IT CONTAINS SECRET KEYS!**

---

## STEP 14: Add Indexes (For Better Performance)

### For Products collection:
1. Go back to Appwrite dashboard
2. Click on **"Products"** collection
3. Click **"Indexes"** tab
4. Click **"Create Index"**
5. Create 3 indexes:

   **Index 1:**
   - Index ID: `categoryID_eq`
   - Type: Key
   - Key: `categoryID`
   - Order: Ascending
   - Click "Create"

   **Index 2:**
   - Index ID: `name_search`
   - Type: Fulltext
   - Key: `name`
   - Click "Create"

   **Index 3:**
   - Index ID: `created_at_desc`
   - Type: Key
   - Key: `$createdAt`
   - Order: Descending
   - Click "Create"

### For Orders collection:
1. Click on **"Orders"** collection
2. Click **"Indexes"** tab
3. Create 3 indexes:

   **Index 1:**
   - Index ID: `userID_eq`
   - Type: Key
   - Key: `userID`
   - Order: Ascending
   - Click "Create"

   **Index 2:**
   - Index ID: `created_at_desc`
   - Type: Key
   - Key: `$createdAt`
   - Order: Descending
   - Click "Create"

   **Index 3:**
   - Index ID: `status_eq`
   - Type: Key
   - Key: `status`
   - Order: Ascending
   - Click "Create"

### For OrderItems collection:
1. Click on **"Order Items"** collection
2. Click **"Indexes"** tab
3. Create 1 index:

   **Index 1:**
   - Index ID: `orderID_eq`
   - Type: Key
   - Key: `orderID`
   - Order: Ascending
   - Click "Create"

**✅ Expected Result:** All indexes created for fast queries

---

## STEP 15: Create Admin User

1. Go back to your project in the browser
2. Click on **"Authentication"** in left sidebar
3. Go to **"Users"** tab
4. Click **"Create User"**
5. Enter:
   - **Email:** `admin@boat.com`
   - **Password:** (create a strong password, save it!)
   - **Name:** Admin User
6. Click **"Create"**

**📝 SAVE THIS PASSWORD - YOU'LL NEED IT TO LOGIN AS ADMIN!**

**✅ Expected Result:** Admin user created

---

## STEP 16: Test Your Setup

1. Open your terminal in VS Code
2. Run the following command:

```bash
npm install
```

Wait for it to finish (may take 1-2 minutes)

Then run:

```bash
npm run dev
```

3. Open your browser to: **http://localhost:5173**

**You should see:**
- Hero banner
- Category circles
- Products (sample data will load from mock if Appwrite not connected)

**If Appwrite is configured correctly, you'll see real data from your collections!**

---

## STEP 17: Test Admin Login

1. Click the **User icon** in top right (or go to /dashboard)
2. Login with admin credentials:
   - Email: `admin@boat.com`
   - Password: (the password you set)
3. After login, you should see an **"Admin Panel"** link in navbar
4. Click it to access /admin

**You should see:**
- KPI cards (Revenue, Products, Pending Orders)
- Tabs: Products, Categories, Orders
- All tabs will be empty (no data yet)

---

## STEP 18: Add Your First Category

1. In Admin Panel, click **"Categories"** tab
2. Click **"Add Category"** button
3. Enter:
   - **Category Title:** `Headphones`
   - **Category Image File:** Choose any image file from your computer
4. Click **"Save Category"**

**✅ Expected Result:** Category appears in the list

---

## STEP 19: Add Your First Product

1. Click **"Products"** tab
2. Click **"Add Product"** button
3. Fill in the form:
   - **Product Name:** `My First Product`
   - **Price:** `999`
   - **Description:** `This is a test product`
   - **Category:** Select "Headphones"
   - **Specifications:** `{"Color": "Black", "Warranty": "1 Year"}`
   - **Product Image File:** Choose any image
4. Click **"Save Product"**

**✅ Expected Result:** Product appears in the list

---

## STEP 20: Test User Flow

1. Go back to Home page
2. You should see your new product
3. Click on it to view details
4. Add to cart
5. Go to cart, proceed to checkout
6. Create a new user account (use different email than admin)
7. Place order
8. Check dashboard - you should see your order!

---

## STEP 21: Test Admin Order Management

1. Login as admin again
2. Go to Admin Panel → Orders tab
3. You should see the order you just placed
4. Click **"Update Status"**
5. Change status from "Pending" to "Processing"
6. Click save
7. Check your user dashboard - status should be updated!

---

## 🎉 CONGRATULATIONS!

If you've completed all steps, your database is fully set up and working!

**What you now have:**
- ✅ Appwrite project configured
- ✅ 5 database collections created
- ✅ Storage bucket for images
- ✅ Permissions configured
- ✅ Admin user created
- ✅ Indexes added for performance
- ✅ Environment variables set
- ✅ Application tested and working

---

## Common Issues & Solutions

### Issue 1: "Project not found" error
**Solution:** Double-check your Project ID in `.env` file

### Issue 2: Images not loading
**Solution:** Make sure storage bucket permissions are set to "Any" for read

### Issue 3: Can't create products
**Solution:** Check collection permissions - all should allow "Any" to create

### Issue 4: Orders not showing in admin
**Solution:** Make sure you're logged in as admin@boat.com

### Issue 5: Products not loading
**Solution:** Check browser console (F12) for errors, verify collections exist

---

## Next Steps

1. **Add more products** through admin panel
2. **Add more categories**
3. **Test complete user flow:**
   - Browsing → Cart → Checkout → Order → Track
4. **Customize the UI** if you want
5. **Deploy** to Vercel/Netlify (when ready)

---

## Need Help?

If you get stuck at any step:
1. Check the error message in browser console (F12)
2. Verify all collection IDs match exactly
3. Verify `.env` has correct credentials
4. Make sure Appwrite project is not paused

**Your app is now ready to use! 🚀**