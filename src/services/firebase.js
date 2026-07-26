import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if Firebase is configured
const isConfigured = firebaseConfig.apiKey && firebaseConfig.projectId;

// Initialize Firebase
let app, auth, db, storage;

if (isConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

// ==========================================
// MOCK DATA INITIALIZATION FOR LOCAL FALLBACK
// ==========================================
const initMockData = () => {
  if (!localStorage.getItem('mock_categories')) {
    const defaultCategories = [
      { $id: 'cat_headphones', title: 'Headphones', imageID: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' },
      { $id: 'cat_watches', title: 'Smart Watches', imageID: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80' },
      { $id: 'cat_earbuds', title: 'Wireless Earbuds', imageID: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80' },
      { $id: 'cat_speakers', title: 'Bluetooth Speakers', imageID: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80' }
    ];
    localStorage.setItem('mock_categories', JSON.stringify(defaultCategories));
  }

  if (!localStorage.getItem('mock_products')) {
    const defaultProducts = [
      {
        $id: 'prod_1',
        name: 'Rockerz 400',
        price: 1299,
        description: "Let's put an end to your worries about wires hanging and getting tangled with boAt Rockerz 400 and connect with any Bluetooth device. Dead batteries can kill your vibe. boAt Rockerz Bluetooth headphones are designed to play up to 8 hours.",
        categoryID: 'cat_headphones',
        imageID: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
        specifications: JSON.stringify({ 'Battery Life': '8 Hours', 'Bluetooth Version': 'v5.0', 'Driver Size': '40mm', 'Warranty': '1 Year' })
      },
      {
        $id: 'prod_2',
        name: 'boAt Storm Watch',
        price: 1999,
        description: 'The boAt Storm smartwatch is the perfect companion for your fitness transformation. Its daily activity tracker and 9 sports modes will make track tracking your progress simple.',
        categoryID: 'cat_watches',
        imageID: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
        specifications: JSON.stringify({ 'Screen Size': '1.3 Inches', 'Water Resistance': '5ATM', 'Battery Life': 'Up to 10 Days', 'Heart Rate Sensor': 'Yes' })
      },
      {
        $id: 'prod_3',
        name: 'Airdopes 131',
        price: 999,
        description: 'Sleek. Comfortable. Stylish. And a splash of outstanding acoustic powers. Airdopes 131 wireless earbuds are equipped with 13mm drivers that offer you beyond ordinary sound.',
        categoryID: 'cat_earbuds',
        imageID: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80',
        specifications: JSON.stringify({ 'Driver Size': '13mm', 'Playback Time': 'Up to 15 Hours', 'IPX Rating': 'IPX4 Water Resistant', 'Voice Assistant': 'Google & Siri' })
      },
      {
        $id: 'prod_4',
        name: 'Stone 500 Speaker',
        price: 1600,
        description: 'Experience 10W RMS stereo sound and groove with your gang on Stone 500. The dynamic RGB lights will add to the vibe of your party.',
        categoryID: 'cat_speakers',
        imageID: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80',
        specifications: JSON.stringify({ 'Output Power': '10W RMS', 'RGB Lights': 'Yes', 'Battery Capacity': '2000mAh', 'Bluetooth Version': 'v5.0' })
      }
    ];
    localStorage.setItem('mock_products', JSON.stringify(defaultProducts));
  }

  if (!localStorage.getItem('mock_orders')) {
    localStorage.setItem('mock_orders', JSON.stringify([]));
  }

  if (!localStorage.getItem('mock_profiles')) {
    localStorage.setItem('mock_profiles', JSON.stringify({}));
  }
};

initMockData();

// Helper to write mock local changes
const getLocal = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const setLocal = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// ==========================================
// SERVICE IMPLEMENTATION
// ==========================================
export const firebaseService = {
  isMock: !isConfigured,

  // --- AUTHENTICATION ---
  auth: {
    signup: async (email, password, name) => {
      if (!isConfigured) {
        // Mock Signup
        const users = getLocal('mock_users') || [];
        if (users.find(u => u.email === email)) {
          throw new Error('User already exists');
        }
        const newUser = { $id: 'u_' + Math.random().toString(36).substr(2, 9), email, name };
        users.push({ ...newUser, password });
        setLocal('mock_users', users);
        // Automatically login
        localStorage.setItem('mock_current_user', JSON.stringify(newUser));
        return newUser;
      }
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Update profile with name
        await updateProfile(userCredential.user, { displayName: name });
        // Create empty profile doc in Firestore
        const userRef = doc(db, 'user_profiles', userCredential.user.uid);
        await setDoc(userRef, {
          phone: '',
          address: '',
          fullName: name,
          email: email
        });
        return { $id: userCredential.user.uid, email, name };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    login: async (email, password) => {
      if (!isConfigured) {
        const users = getLocal('mock_users') || [];
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) {
          throw new Error('Invalid email or password');
        }
        const { password: _, ...safeUser } = user;
        localStorage.setItem('mock_current_user', JSON.stringify(safeUser));
        return safeUser;
      }
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { $id: userCredential.user.uid, email: userCredential.user.email, name: userCredential.user.displayName };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    logout: async () => {
      if (!isConfigured) {
        localStorage.removeItem('mock_current_user');
        return true;
      }
      try {
        await signOut(auth);
        return true;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    getCurrentUser: async () => {
      if (!isConfigured) {
        const user = localStorage.getItem('mock_current_user');
        return user ? JSON.parse(user) : null;
      }
      return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          unsubscribe();
          if (user) {
            resolve({ $id: user.uid, email: user.email, name: user.displayName });
          } else {
            resolve(null);
          }
        });
      });
    }
  },

  // --- USER PROFILES ---
  profile: {
    get: async (userId) => {
      if (!isConfigured) {
        const profiles = JSON.parse(localStorage.getItem('mock_profiles') || '{}');
        return profiles[userId] || { phone: '', address: '', fullName: '' };
      }
      try {
        const docRef = doc(db, 'user_profiles', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return { $id: docSnap.id, ...docSnap.data() };
        }
        return { phone: '', address: '', fullName: '' };
      } catch (error) {
        return { phone: '', address: '', fullName: '' };
      }
    },

    update: async (userId, data) => {
      if (!isConfigured) {
        const profiles = JSON.parse(localStorage.getItem('mock_profiles') || '{}');
        profiles[userId] = { ...profiles[userId], ...data };
        localStorage.setItem('mock_profiles', JSON.stringify(profiles));
        return profiles[userId];
      }
      try {
        const docRef = doc(db, 'user_profiles', userId);
        await updateDoc(docRef, data);
        const docSnap = await getDoc(docRef);
        return { $id: docSnap.id, ...docSnap.data() };
      } catch (error) {
        throw new Error(error.message);
      }
    }
  },

  // --- CATEGORIES ---
  categories: {
    list: async () => {
      if (!isConfigured) {
        return getLocal('mock_categories');
      }
      try {
        const q = query(collection(db, 'categories'), orderBy('title'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ $id: doc.id, ...doc.data() }));
      } catch (error) {
        throw new Error(error.message);
      }
    },

    create: async (title, imageID) => {
      if (!isConfigured) {
        const categories = getLocal('mock_categories');
        const newCat = { $id: 'cat_' + Date.now(), title, imageID };
        categories.push(newCat);
        setLocal('mock_categories', categories);
        return newCat;
      }
      try {
        const docRef = await addDoc(collection(db, 'categories'), { title, imageID });
        return { $id: docRef.id, title, imageID };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    update: async (id, data) => {
      if (!isConfigured) {
        const categories = getLocal('mock_categories');
        const index = categories.findIndex(c => c.$id === id);
        if (index !== -1) {
          categories[index] = { ...categories[index], ...data };
          setLocal('mock_categories', categories);
          return categories[index];
        }
        throw new Error('Category not found');
      }
      try {
        const docRef = doc(db, 'categories', id);
        await updateDoc(docRef, data);
        const docSnap = await getDoc(docRef);
        return { $id: docSnap.id, ...docSnap.data() };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    delete: async (id) => {
      if (!isConfigured) {
        const categories = getLocal('mock_categories');
        const filtered = categories.filter(c => c.$id !== id);
        setLocal('mock_categories', filtered);
        return true;
      }
      try {
        await deleteDoc(doc(db, 'categories', id));
        return true;
      } catch (error) {
        throw new Error(error.message);
      }
    }
  },

  // --- PRODUCTS ---
  products: {
    list: async (search = '', categoryID = '') => {
      if (!isConfigured) {
        let products = getLocal('mock_products');
        if (categoryID) {
          products = products.filter(p => p.categoryID === categoryID);
        }
        if (search) {
          products = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
        }
        return products;
      }
      try {
        let q = query(collection(db, 'products'), orderBy('name'));
        
        if (categoryID) {
          q = query(collection(db, 'products'), where('categoryID', '==', categoryID), orderBy('name'));
        }
        
        const querySnapshot = await getDocs(q);
        let products = querySnapshot.docs.map(doc => ({ $id: doc.id, ...doc.data() }));
        
        if (search) {
          products = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
        }
        
        return products;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    get: async (id) => {
      if (!isConfigured) {
        const products = getLocal('mock_products');
        const prod = products.find(p => p.$id === id);
        if (!prod) throw new Error('Product not found');
        return prod;
      }
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return { $id: docSnap.id, ...docSnap.data() };
        }
        throw new Error('Product not found');
      } catch (error) {
        throw new Error(error.message);
      }
    },

    create: async (data) => {
      if (!isConfigured) {
        const products = getLocal('mock_products');
        const newProd = { $id: 'prod_' + Date.now(), ...data };
        products.push(newProd);
        setLocal('mock_products', products);
        return newProd;
      }
      try {
        const docRef = await addDoc(collection(db, 'products'), data);
        return { $id: docRef.id, ...data };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    update: async (id, data) => {
      if (!isConfigured) {
        const products = getLocal('mock_products');
        const index = products.findIndex(p => p.$id === id);
        if (index !== -1) {
          products[index] = { ...products[index], ...data };
          setLocal('mock_products', products);
          return products[index];
        }
        throw new Error('Product not found');
      }
      try {
        const docRef = doc(db, 'products', id);
        await updateDoc(docRef, data);
        const docSnap = await getDoc(docRef);
        return { $id: docSnap.id, ...docSnap.data() };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    delete: async (id) => {
      if (!isConfigured) {
        const products = getLocal('mock_products');
        const filtered = products.filter(p => p.$id !== id);
        setLocal('mock_products', filtered);
        return true;
      }
      try {
        await deleteDoc(doc(db, 'products', id));
        return true;
      } catch (error) {
        throw new Error(error.message);
      }
    }
  },

  // --- ORDERS ---
  orders: {
    create: async (orderDetails, items) => {
      const orderId = 'order_' + Math.random().toString(36).substr(2, 9);
      if (!isConfigured) {
        const orders = getLocal('mock_orders');
        const newOrder = {
          $id: orderId,
          ...orderDetails,
          items: items,
          status: 'Pending',
          $createdAt: new Date().toISOString()
        };
        orders.unshift(newOrder);
        setLocal('mock_orders', orders);
        return newOrder;
      }
      try {
        // Create master order document
        const orderDoc = await addDoc(collection(db, 'orders'), {
          userID: orderDetails.userID,
          customerName: orderDetails.customerName,
          phone: orderDetails.phone,
          address: orderDetails.address,
          totalPrice: Number(orderDetails.totalPrice),
          quantity: Number(orderDetails.quantity),
          status: 'Pending',
          paymentMethod: orderDetails.paymentMethod || 'COD',
          createdAt: serverTimestamp()
        });

        // Create individual items linked to order ID
        for (const item of items) {
          await addDoc(collection(db, 'order_items'), {
            orderID: orderDoc.id,
            productID: item.productID,
            productName: item.productName,
            price: Number(item.price),
            quantity: Number(item.quantity),
            imageID: item.imageID
          });
        }

        return { $id: orderDoc.id, ...orderDetails };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    listUserOrders: async (userID) => {
      if (!isConfigured) {
        const orders = getLocal('mock_orders');
        return orders.filter(o => o.userID === userID);
      }
      try {
        const q = query(collection(db, 'orders'), where('userID', '==', userID), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        // Populate items for each order
        const ordersWithItems = [];
        for (const doc of querySnapshot.docs) {
          const itemsQuery = query(collection(db, 'order_items'), where('orderID', '==', doc.id));
          const itemsSnapshot = await getDocs(itemsQuery);
          ordersWithItems.push({
            $id: doc.id,
            ...doc.data(),
            items: itemsSnapshot.docs.map(itemDoc => ({ $id: itemDoc.id, ...itemDoc.data() }))
          });
        }
        return ordersWithItems;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    listAll: async () => {
      if (!isConfigured) {
        return getLocal('mock_orders');
      }
      try {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        // Populate items for each order
        const ordersWithItems = [];
        for (const doc of querySnapshot.docs) {
          const itemsQuery = query(collection(db, 'order_items'), where('orderID', '==', doc.id));
          const itemsSnapshot = await getDocs(itemsQuery);
          ordersWithItems.push({
            $id: doc.id,
            ...doc.data(),
            items: itemsSnapshot.docs.map(itemDoc => ({ $id: itemDoc.id, ...itemDoc.data() }))
          });
        }
        return ordersWithItems;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    updateStatus: async (orderID, status) => {
      if (!isConfigured) {
        const orders = getLocal('mock_orders');
        const index = orders.findIndex(o => o.$id === orderID);
        if (index !== -1) {
          orders[index].status = status;
          setLocal('mock_orders', orders);
          return orders[index];
        }
        throw new Error('Order not found');
      }
      try {
        const docRef = doc(db, 'orders', orderID);
        await updateDoc(docRef, { status });
        const docSnap = await getDoc(docRef);
        return { $id: docSnap.id, ...docSnap.data() };
      } catch (error) {
        throw new Error(error.message);
      }
    }
  },

  // --- STORAGE ---
  storage: {
    uploadFile: async (file) => {
      if (!isConfigured) {
        // Return a mock object URL for the uploaded file
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              $id: 'file_' + Date.now(),
              mockUrl: reader.result
            });
          };
          reader.readAsDataURL(file);
        });
      }
      try {
        const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        return { $id: storageRef.name, downloadURL };
      } catch (error) {
        throw new Error(error.message);
      }
    },

    getFilePreview: (fileId) => {
      if (!isConfigured || fileId.startsWith('http') || fileId.startsWith('data:')) {
        return fileId;
      }
      // If it's a Firebase storage path, return the download URL
      if (fileId && !fileId.startsWith('http')) {
        // For mock data or Firebase storage paths, construct URL if needed
        // In production, you'd store the full download URL in the database
        return fileId;
      }
      return fileId || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80';
    }
  }
};