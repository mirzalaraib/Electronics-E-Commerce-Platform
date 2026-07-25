# Testing & Server Startup Guide

Complete step-by-step guide to start your server and test every feature of the Electronics E-Commerce platform.

---

## 📋 Prerequisites Checklist

Before starting, make sure you have:
- [ ] Node.js installed (version 16 or higher)
- [ ] VS Code or any code editor
- [ ] Terminal/Command Prompt access
- [ ] Appwrite database set up (using DATABASE_SETUP.md)
- [ ] `.env` file configured with credentials

---

## 🚀 PART 1: STARTING THE SERVER

### Step 1.1: Open Your Project

1. Open VS Code
2. Go to **File → Open Folder**
3. Select your project folder: `d:/heyyy`
4. Wait for VS Code to load all files

**✅ Expected:** You should see all project files in the left sidebar

---

### Step 1.2: Open Terminal in VS Code

1. Click **Terminal** menu at the top
2. Click **New Terminal**
3. A terminal panel will open at the bottom

**✅ Expected:** Terminal opens with command prompt showing your project path

---

### Step 1.3: Install Dependencies (First Time Only)

In the terminal, type this command and press Enter:

```bash
npm install
```

**What this does:**
- Downloads all required packages (React, Appwrite, etc.)
- Creates `node_modules` folder
- May take 2-5 minutes depending on internet speed

**You'll see:**
- Lots of text scrolling
- Progress indicators
- At the end: `added XXX packages in Xs`

**✅ Expected Result:** Installation completes without errors

**⚠️ Common Issues:**
- If you see "npm not recognized" → Install Node.js from https://nodejs.org
- If you see permission errors → Run VS Code as Administrator

---

### Step 1.4: Start Development Server

After installation completes, type:

```bash
npm run dev
```

**What this does:**
- Starts the Vite development server
- Compiles your code
- Opens the app on a local port

**You'll see output like:**
```
  VITE v8.1.1  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**✅ Expected Result:** Server starts successfully

---

### Step 1.5: Open App in Browser

1. Open your web browser (Chrome/Firefox/Edge)
2. Type in address bar: **http://localhost:5173**
3. Press Enter

**✅ Expected Result:** You see your Electronics Store homepage!

---

## 🧪 PART 2: TESTING EVERY FEATURE

Follow these tests in order. Check each one as you complete it.

---

## 🏠 TEST 1: Homepage Loads Correctly

### What to check:
- [ ] Hero banner is visible at the top
- [ ] Featured product image shows
- [ ] Category circles are visible (Headphones, Watches, etc.)
- [ ] Product grid loads below
- [ ] "Shop Now" button is visible
- [ ] Navbar shows logo "Boat"
- [ ] Footer is visible at bottom

### How to test:
1. Look at the page - does it look like a modern electronics store?
2. Are there products displayed in a grid?
3. Do you see 4 category circles?

**✅ PASS CRITERIA:** Page loads without errors, all sections visible

**❌ FAIL?** 
- Open browser console (F12)
- Check for error messages
- Most likely: Appwrite not configured yet → App will show mock data

---

## 🔍 TEST 2: Search Functionality

### What to check:
- [ ] Search bar is in navbar
- [ ] Typing filters products in real-time
- [ ] Empty results show "No products found"

### How to test:
1. In the search bar (top navbar), type: **"boat"**
2. Press Enter or wait
3. Products should filter to show only items with "boat" in name
4. Clear search bar
5. Type: **"xyz123nonexistent"**
6. Should show: "No products found. Try adjustments..."

**✅ PASS CRITERIA:** Search filters products correctly

**❌ FAIL?**
- Check Home.jsx line 33: `const searchVal = searchFilter || searchParams.get('search') || '';`
- Verify appwriteService.products.list() is called

---

## 📂 TEST 3: Category Filtering

### What to check:
- [ ] Clicking category circles filters products
- [ ] Clicking "All Products" shows all items
- [ ] Selected category is highlighted
- [ ] Sidebar categories also work

### How to test:
1. Click on **"Headphones"** category circle
2. Only headphone products should show
3. Click **"Smart Watches"**
4. Watch products should show
5. Click **"All Products"**
6. All products should show again
7. Try sidebar categories on the left

**✅ PASS CRITERIA:** Category filters work correctly

---

## 💰 TEST 4: Price Sorting

### What to check:
- [ ] "Sort By Price" dropdown exists
- [ ] "Price: Low to High" works
- [ ] "Price: High to Low" works

### How to test:
1. On homepage, find "Sort By Price" dropdown (in sidebar)
2. Select **"Price: Low to High"**
3. Products should reorder from cheapest to most expensive
4. Select **"Price: High to Low"**
5. Products should reorder from most expensive to cheapest

**✅ PASS CRITERIA:** Sorting works correctly

---

## 🛍️ TEST 5: Product Detail Page

### What to check:
- [ ] Clicking product opens detail page
- [ ] Product image displays
- [ ] Name, price, description shown
- [ ] Specifications displayed (if any)
- [ ] Quantity selector works (+/-)
- [ ] "Add to Cart" button works
- [ ] Success message appears after adding

### How to test:
1. Click on any product card
2. You should go to `/product/prod_1` (or similar)
3. Check:
   - Large product image on left
   - Product name, price on right
   - Description text
   - Technical specifications section
   - Quantity selector with +/- buttons
   - "Add to Cart" button
4. Click **"-"** button → quantity should decrease
5. Click **"+"** button → quantity should increase
6. Click **"Add to Cart"**
7. Green message: "✓ Added X item(s) to cart successfully!"
8. Click **"Back to Products"** link

**✅ PASS CRITERIA:** Product detail page works end-to-end

---

## 🛒 TEST 6: Shopping Cart

### What to check:
- [ ] Cart icon in navbar shows item count
- [ ] Clicking icon opens cart drawer
- [ ] Cart items display correctly
- [ ] Quantity can be increased/decreased
- [ ] Items can be removed
- [ ] Coupon codes work
- [ ] Subtotal and Total calculate correctly

### How to test:
1. Add 2-3 different products to cart
2. Look at navbar - cart icon should show badge with number (e.g., "3")
3. Click cart icon
4. Cart drawer slides in from right
5. Verify:
   - All added products are listed
   - Each shows: image, name, price, quantity controls
   - Subtotal is sum of all items
   - Total matches subtotal (no discount yet)
6. Test quantity controls:
   - Click **"-"** on an item → quantity decreases
   - Click **"+"** → quantity increases
   - If quantity reaches 0 → item removed
7. Click **trash icon** → item removed immediately
8. Test coupon:
   - Type: **"DISCOUNT10"** in coupon box
   - Click **"Apply"**
   - Should show: "10% Discount Applied!"
   - Total should decrease by 10%
   - Type: **"FREESHIP"**
   - Click **"Apply"**
   - Should show: "Rs 50 Shipping Discount Applied!"
   - Total should decrease by ₹50
9. Click **X** or outside cart to close

**✅ PASS CRITERIA:** Cart fully functional

---

## 🔐 TEST 7: User Registration

### What to check:
- [ ] Can access login form
- [ ] Can switch to signup mode
- [ ] Signup creates new account
- [ ] Error for duplicate email

### How to test:
1. Click **User icon** in navbar (or go to `/dashboard`)
2. If not logged in, you'll see login form
3. Check form fields:
   - Full Name (only in signup mode)
   - Email Address
   - Password
4. Click **"Sign Up"** link at bottom
5. Form switches to signup mode
6. Enter test data:
   - Name: `Test User`
   - Email: `test123@example.com`
   - Password: `testpassword123`
7. Click **"Sign Up"** button
8. Should redirect to `/dashboard`
9. You should see: "Hi, Test User" in navbar

**✅ PASS CRITERIA:** Signup works, user logged in

**❌ FAIL?**
- Check AuthContext.jsx signup function
- Check appwrite.js auth.signup implementation

---

## 🔑 TEST 8: User Login

### What to check:
- [ ] Can login with existing credentials
- [ ] Invalid credentials show error
- [ ] Logout works

### How to test:
1. Click **Logout** icon in navbar (if logged in)
2. Click **User icon** again
3. You should see login form
4. Enter wrong credentials:
   - Email: `wrong@test.com`
   - Password: `wrongpass`
5. Click **"Sign In"**
6. Should show error: "Invalid email or password"
7. Enter correct credentials (from signup above):
   - Email: `test123@example.com`
   - Password: `testpassword123`
8. Click **"Sign In"**
9. Should login successfully

**✅ PASS CRITERIA:** Login/logout works

---

## 👤 TEST 9: User Dashboard

### What to check:
- [ ] Dashboard page loads
- [ ] Profile form is pre-filled
- [ ] Can update profile
- [ ] Order history section exists
- [ ] Sign out button works

### How to test:
1. Make sure you're logged in (if not, login first)
2. Click **"Dashboard"** link in navbar
3. You should see:
   - "My Dashboard" heading
   - "Profile Metadata" card on left
   - "My Orders" card on right
   - "Sign Out" button top right
4. Check profile form:
   - Full Name should be pre-filled
   - Phone might be empty
   - Address might be empty
5. Update profile:
   - Change Full Name
   - Add Phone: `9876543210`
   - Add Address: `123 Test Street, Test City`
   - Click **"Save Profile Changes"**
   - Should show: "Profile updated successfully!"
6. Go to **"My Orders"** section
   - Should show: "You have not placed any orders yet." (no orders yet)
7. Click **"Sign Out"**
8. Should log out and redirect to home

**✅ PASS CRITERIA:** Dashboard fully functional

---

## 💵 TEST 10: Checkout Process

### What to check:
- [ ] Empty cart shows message
- [ ] Checkout form validates fields
- [ ] Profile data pre-fills
- [ ] Can place order
- [ ] Order confirmation shows
- [ ] Cart clears after order

### How to test:
1. Make sure you have items in cart (add 1-2 products)
2. Go to cart
3. Click **"Proceed to Checkout"**
4. Should redirect to `/checkout`
5. Check form:
   - Full Name should be pre-filled (from profile)
   - Phone should be pre-filled
   - Address should be pre-filled
6. Modify any field if needed
7. Select **"Cash on Delivery (COD)"**
8. Check "Order Summary" on right:
   - Lists all cart items
   - Shows quantities and prices
   - Shows Grand Total
9. Click **"Place COD Order"**
10. Should show success page:
    - Green checkmark icon
    - "Order Placed!" heading
    - Order ID (like: `order_abc123xyz`)
    - Two buttons: "Track Order" and "Continue Shopping"
11. Cart should now be empty

**✅ PASS CRITERIA:** Order placed successfully

---

## 📋 TEST 11: Order History in Dashboard

### What to check:
- [ ] Previous order appears in dashboard
- [ ] Order details are correct
- [ ] Status shows as "Pending"

### How to test:
1. From order confirmation page, click **"Track Order"**
2. Should go to `/dashboard`
3. In "My Orders" section:
   - Your order should be listed
   - Shows Order ID
   - Shows date
   - Shows items ordered (name, quantity, price)
   - Shows total paid
   - Shows payment method: COD
   - Shows status: Pending (or similar)
4. Status should be in orange/yellow badge

**✅ PASS CRITERIA:** Order appears correctly

---

## 🔧 PART 3: ADMIN PANEL TESTING

### Test 12: Admin Login

**What to check:**
- [ ] Can login as admin
- [ ] Admin link appears in navbar
- [ ] Non-admin emails don't see admin link

**How to test:**
1. Logout if currently logged in
2. Click **User icon**
3. Login with:
   - Email: `admin@boat.com`
   - Password: (password you created in Appwrite)
4. After login, check navbar:
   - Should show: "Hi, Admin User"
   - Should show: **"Admin Panel"** link (only for admin emails)
5. Click **"Admin Panel"**
6. Should go to `/admin`

**✅ PASS CRITERIA:** Admin access works

**❌ FAIL?**
- Verify admin email in Appwrite is exactly: `admin@boat.com`
- Check ProtectedRoute.jsx line 23: admin check logic

---

### Test 13: Admin Dashboard KPIs

**What to check:**
- [ ] KPI cards display
- [ ] Revenue shows (0 if no delivered orders)
- [ ] Total Products count shows
- [ ] Pending Orders count shows

**How to test:**
1. In Admin Panel, you should see 3 KPI cards at top:
   - **DELIVERED REVENUE** (with sparkles icon)
   - **TOTAL PRODUCTS** (with package icon)
   - **PENDING ORDERS** (with list icon)
2. Check values:
   - Revenue: Should be ₹0 (no delivered orders yet)
   - Total Products: Should be 0 (no products added yet)
   - Pending Orders: Should show at least 1 (the test order you placed)

**✅ PASS CRITERIA:** KPIs render correctly

---

### Test 14: Admin - Add Category

**What to check:**
- [ ] Categories tab works
- [ ] Can add new category
- [ ] Image upload works
- [ ] Category appears in list

**How to test:**
1. In Admin Panel, click **"Categories"** tab
2. Table should be empty (or show existing categories)
3. Click **"Add Category"** button
4. Modal window opens
5. Fill form:
   - Category Title: `Headphones`
   - Category Image File: Choose any image from your computer (JPG/PNG)
6. Click **"Save Category"**
7. Modal closes
8. Category should appear in table:
   - Shows image thumbnail
   - Shows "Headphones"
   - Shows category ID
9. Add another category:
   - Title: `Smart Watches`
   - Image: Choose another image
   - Click Save

**✅ PASS CRITERIA:** Categories created successfully

---

### Test 15: Admin - Add Product

**What to check:**
- [ ] Products tab works
- [ ] Can add new product
- [ ] Can select category
- [ ] Image upload works
- [ ] Product appears in list

**How to test:**
1. Click **"Products"** tab
2. Table should be empty
3. Click **"Add Product"** button
4. Modal opens with form
5. Fill form:
   - Product Name: `Test Headphone`
   - Price: `1499`
   - Description: `High quality wireless headphones`
   - Category: Select "Headphones"
   - Specifications: `{"Battery": "8 Hours", "Bluetooth": "v5.0"}`
   - Product Image File: Choose any image
6. Click **"Save Product"**
7. Modal closes
8. Product should appear in table:
   - Shows image
   - Shows "Test Headphone"
   - Shows category: "Headphones"
   - Shows price: ₹1499
9. Add 2-3 more products to different categories

**✅ PASS CRITERIA:** Products created successfully

---

### Test 16: Admin - Edit Product

**What to check:**
- [ ] Can edit existing product
- [ ] Changes save correctly

**How to test:**
1. In Products tab, find a product
2. Click **Edit button** (pencil icon)
3. Modal opens with pre-filled data
4. Change price: `1999`
5. Change name: `Test Headphone Pro`
6. Click **"Save Product"**
7. Table should update with new values

**✅ PASS CRITERIA:** Product edited successfully

---

### Test 17: Admin - Delete Product

**What to check:**
- [ ] Can delete product
- [ ] Confirmation dialog appears
- [ ] Product removed from list

**How to test:**
1. In Products tab, click **Delete button** (trash icon)
2. Browser confirm dialog: "Delete this product?"
3. Click **OK**
4. Product should disappear from table

**✅ PASS CRITERIA:** Product deleted successfully

---

### Test 18: Admin - View Orders

**What to check:**
- [ ] Orders tab shows all orders
- [ ] Customer details visible
- [ ] Order items listed
- [ ] Status displayed

**How to test:**
1. Click **"Orders"** tab
2. You should see table with orders
3. Each order row shows:
   - Order ID (like: `order_abc123`)
   - Customer Name
   - Phone number
   - Address
   - Items (product names with quantities)
   - Total Price
   - Status (Pending)
   - "Update Status" button
4. Verify your test order is there

**✅ PASS CRITERIA:** Orders display correctly

---

### Test 19: Admin - Update Order Status

**What to check:**
- [ ] Can update order status
- [ ] Status options available
- [ ] Status saves to database

**How to test:**
1. In Orders tab, find your test order
2. Click **"Update Status"** button
3. Dropdown appears with options:
   - Pending
   - Processing
   - Shipped
   - Delivered
4. Select **"Processing"**
5. Click **Checkmark button** (save)
6. Should refresh and show "Processing" in green/purple
7. Test updating to other statuses

**✅ PASS CRITERIA:** Status updates successfully

---

### Test 20: Admin - KPI Updates

**What to check:**
- [ ] Revenue updates when orders marked delivered
- [ ] Product count accurate
- [ ] Pending orders count accurate

**How to test:**
1. Note current Pending Orders count (e.g., 1)
2. Change order status to "Delivered"
3. Check KPIs:
   - Pending Orders should decrease by 1
   - Delivered Revenue should increase by order total
   - Total Products should match your product count

**✅ PASS CRITERIA:** KPIs update in real-time

---

## 🎨 PART 4: UI/UX TESTING

### Test 21: Responsive Design

**What to check:**
- [ ] Layout adapts to mobile screens
- [ ] Hamburger menu appears (if implemented)
- [ ] Product grid adjusts columns
- [ ] Cart drawer works on mobile

**How to test:**
1. Press **F12** to open DevTools
2. Click **Toggle Device Toolbar** icon (or Ctrl+Shift+M)
3. Select **"iPhone 12 Pro"** or similar
4. Verify:
   - Navbar adjusts (search may hide)
   - Product grid becomes 1-2 columns
   - Category circles wrap
   - Cart drawer takes full width
5. Try different screen sizes

**✅ PASS CRITERIA:** Responsive on all screen sizes

---

### Test 22: Animations & Transitions

**What to check:**
- [ ] Hover effects on products
- [ ] Smooth cart drawer animation
- [ ] Button hover states
- [ ] Loading spinners appear

**How to test:**
1. Hover over product cards:
   - Should lift slightly
   - Shadow should appear
   - Image should scale
2. Open cart:
   - Should slide in smoothly from right
3. Hover over buttons:
   - Should have color transitions
4. Refresh page while loading:
   - Should see "Searching Products..." spinner

**✅ PASS CRITERIA:** Animations smooth and professional

---

## 🔗 PART 5: INTEGRATION TESTING

### Test 23: Complete User Journey

**Scenario:** New user browses, adds to cart, and purchases

**Steps:**
1. Open incognito window (Ctrl+Shift+N)
2. Go to http://localhost:5173
3. Browse products
4. Search for "headphone"
5. Filter by "Headphones" category
6. Click on a product
7. Select quantity: 2
8. Click "Add to Cart"
9. View cart, verify 2 items
10. Click "Proceed to Checkout"
11. Sign up with new email
12. Fill shipping details
13. Place order
14. Go to dashboard, see order
15. Logout

**✅ PASS CRITERIA:** Complete flow works seamlessly

---

### Test 24: Complete Admin Journey

**Scenario:** Admin manages store

**Steps:**
1. Login as admin
2. Go to Admin Panel
3. Add 3 categories with images
4. Add 5 products across categories
5. Check KPIs (products count should be 5)
6. View orders
7. Update order status to "Shipped"
8. Logout
9. Login as customer
10. Check dashboard - status should show "Shipped"

**✅ PASS CRITERIA:** Admin workflow complete

---

## 🐛 PART 6: ERROR HANDLING TESTS

### Test 25: Error Scenarios

**What to check:**
- [ ] Invalid coupon shows error
- [ ] Empty required fields show validation
- [ ] Network errors handled gracefully

**How to test:**
1. Try invalid coupon: **"INVALIDCODE"**
   - Should show: "Invalid Coupon Code"
2. Go to checkout with empty cart
   - Should show: "Your Cart is Empty"
3. Try checkout without filling required fields
   - Should show: "Please fill out all shipping details"
4. Open console (F12) and check for errors during normal use
   - Should be minimal/none

**✅ PASS CRITERIA:** Errors handled gracefully

---

## 📊 FINAL CHECKLIST

Mark each as completed:

### Server & Setup
- [ ] Server starts without errors
- [ ] App loads at localhost:5173
- [ ] No console errors on load
- [ ] Mock data appears (if Appwrite not configured)

### Customer Features
- [ ] Homepage displays correctly
- [ ] Search works
- [ ] Category filters work
- [ ] Price sorting works
- [ ] Product detail page works
- [ ] Add to cart works
- [ ] Cart drawer works
- [ ] Quantity controls work
- [ ] Remove items works
- [ ] Coupon codes work
- [ ] Signup works
- [ ] Login works
- [ ] Logout works
- [ ] Checkout works
- [ ] Order placement works
- [ ] Dashboard loads
- [ ] Profile update works
- [ ] Order history shows

### Admin Features
- [ ] Admin login works
- [ ] Admin panel accessible
- [ ] KPIs display
- [ ] Can add categories
- [ ] Can add products
- [ ] Can edit products
- [ ] Can delete products
- [ ] Can view orders
- [ ] Can update order status
- [ ] KPIs update correctly

### UI/UX
- [ ] Dark theme looks good
- [ ] Responsive on mobile
- [ ] Animations smooth
- [ ] Loading states show
- [ ] Error messages display

### Data Persistence
- [ ] Cart persists on page refresh
- [ ] Profile saves to database
- [ ] Orders saved to database
- [ ] Products visible after refresh

---

## 🎉 SUCCESS!

If all tests pass, your application is **fully functional and ready for production!**

---

## 🚨 Troubleshooting Guide

### Server won't start
```bash
# Try deleting node_modules and reinstalling
rm -rf node_modules
npm install
npm run dev
```

### Port 5173 already in use
```bash
# Use different port
npm run dev -- --port 3000
```

### Products not loading
1. Check `.env` file has correct credentials
2. Check Appwrite collections exist
3. Check browser console for errors
4. Verify Appwrite project is not paused

### Images not showing
1. Check storage bucket permissions
2. Verify imageID is correct
3. For mock data, ensure image URLs are accessible

### Can't login as admin
1. Verify email is exactly: `admin@boat.com`
2. Check password is correct
3. Verify authentication enabled in Appwrite

### Cart clears on refresh
1. Check localStorage is enabled in browser
2. Check for JavaScript errors
3. Verify CartContext is wrapping app

---

## 📈 Performance Testing

### Check Load Times
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Refresh page
4. Check:
   - Page loads in < 2 seconds
   - No failed requests (red)
   - Images load properly

### Check Console
1. Go to **Console** tab in DevTools
2. Look for errors (red text)
3. Should have minimal/no errors
4. Warnings (yellow) are okay

---

## 🎯 Next Steps After Testing

1. **Add More Data:**
   - Add 10-20 products via admin panel
   - Add 4-5 categories
   - Upload real product images

2. **Test Edge Cases:**
   - Very long product names
   - Very high prices (99999+)
   - Large quantity orders (100+)
   - Multiple orders by same user

3. **User Acceptance Testing:**
   - Ask a friend to use the app
   - Watch them try to complete a purchase
   - Note any confusion or issues

4. **Prepare for Deployment:**
   - Build production version: `npm run build`
   - Test build locally: `npm run preview`
   - Deploy to Vercel/Netlify

5. **Security Audit:**
   - Verify `.env` is in `.gitignore`
   - Check all sensitive data is protected
   - Test with multiple user accounts

---

## 📞 Getting Help

If tests fail:
1. **Check the console** (F12) for error messages
2. **Verify DATABASE_SETUP.md** was followed correctly
3. **Check .env file** has correct values
4. **Review PROJECT_EXPLAINED.md** for code flow
5. **Ask for help** with:
   - Exact error message
   - What you were trying to do
   - Screenshot if possible

---

**Your app is now fully tested and ready! 🚀**