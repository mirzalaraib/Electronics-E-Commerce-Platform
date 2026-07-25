import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'electronics_store';
const productsCol = import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID || 'products';
const categoriesCol = import.meta.env.VITE_APPWRITE_CATEGORIES_COLLECTION_ID || 'categories';
const ordersCol = import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID || 'orders';
const orderItemsCol = import.meta.env.VITE_APPWRITE_ORDER_ITEMS_COLLECTION_ID || 'order_items';
const profilesCol = import.meta.env.VITE_APPWRITE_PROFILES_COLLECTION_ID || 'user_profiles';
const imagesBucket = import.meta.env.VITE_APPWRITE_IMAGES_BUCKET_ID || 'images';

// Check if Appwrite is properly configured
const isConfigured = projectId && projectId !== 'project_placeholder';

let client, account, databases, storage;

if (isConfigured) {
  client = new Client().setEndpoint(endpoint).setProject(projectId);
  account = new Account(client);
  databases = new Databases(client);
  storage = new Storage(client);
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
        description: "Let's put an end to your worries about wires hanging and getting tangled with BoAt Rockerz 400 and connect with any Bluetooth device. Dead batteries can kill your vibe. boAt Rockerz Bluetooth headphones are designed to play up to 8 hours.",
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
export const appwriteService = {
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
        const userId = ID.unique();
        await account.create(userId, email, password, name);
        // Create user profile document in profiles collection
        await account.createEmailPasswordSession(email, password);
        const currentUser = await account.get();
        // Create empty profile doc
        try {
          await databases.createDocument(databaseId, profilesCol, currentUser.$id, {
            phone: '',
            address: '',
            fullName: name
          });
        } catch (e) {
          console.warn("Could not auto-create profile doc", e);
        }
        return currentUser;
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
        await account.createEmailPasswordSession(email, password);
        return await account.get();
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
        await account.deleteSession('current');
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
      try {
        return await account.get();
      } catch (error) {
        return null;
      }
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
        return await databases.getDocument(databaseId, profilesCol, userId);
      } catch (error) {
        // If not found, return empty fields
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
        try {
          return await databases.updateDocument(databaseId, profilesCol, userId, data);
        } catch (e) {
          // If document doesn't exist, create it
          return await databases.createDocument(databaseId, profilesCol, userId, data);
        }
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
        const res = await databases.listDocuments(databaseId, categoriesCol);
        return res.documents;
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
        return await databases.createDocument(databaseId, categoriesCol, ID.unique(), { title, imageID });
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
        return await databases.updateDocument(databaseId, categoriesCol, id, data);
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
        await databases.deleteDocument(databaseId, categoriesCol, id);
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
        const queries = [];
        if (categoryID) {
          queries.push(Query.equal('categoryID', categoryID));
        }
        if (search) {
          queries.push(Query.search('name', search));
        }
        const res = await databases.listDocuments(databaseId, productsCol, queries);
        return res.documents;
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
        return await databases.getDocument(databaseId, productsCol, id);
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
        return await databases.createDocument(databaseId, productsCol, ID.unique(), data);
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
        return await databases.updateDocument(databaseId, productsCol, id, data);
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
        await databases.deleteDocument(databaseId, productsCol, id);
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
          items: items, // Attach items for convenience in local mock
          status: 'Pending',
          $createdAt: new Date().toISOString()
        };
        orders.unshift(newOrder);
        setLocal('mock_orders', orders);
        return newOrder;
      }
      try {
        // Create master order document
        const orderDoc = await databases.createDocument(databaseId, ordersCol, ID.unique(), {
          userID: orderDetails.userID,
          totalPrice: Number(orderDetails.totalPrice),
          quantity: Number(orderDetails.quantity),
          status: 'Pending',
          paymentMethod: orderDetails.paymentMethod || 'COD',
          address: orderDetails.address,
          phone: orderDetails.phone,
          customerName: orderDetails.customerName
        });

        // Create individual items linked to order ID
        for (const item of items) {
          await databases.createDocument(databaseId, orderItemsCol, ID.unique(), {
            orderID: orderDoc.$id,
            productID: item.productID,
            productName: item.productName,
            price: Number(item.price),
            quantity: Number(item.quantity),
            imageID: item.imageID
          });
        }

        return orderDoc;
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
        const res = await databases.listDocuments(databaseId, ordersCol, [
          Query.equal('userID', userID),
          Query.orderDesc('$createdAt')
        ]);
        
        // Populate items for each order
        const ordersWithItems = [];
        for (const doc of res.documents) {
          const itemsRes = await databases.listDocuments(databaseId, orderItemsCol, [
            Query.equal('orderID', doc.$id)
          ]);
          ordersWithItems.push({
            ...doc,
            items: itemsRes.documents
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
        const res = await databases.listDocuments(databaseId, ordersCol, [
          Query.orderDesc('$createdAt')
        ]);

        const ordersWithItems = [];
        for (const doc of res.documents) {
          const itemsRes = await databases.listDocuments(databaseId, orderItemsCol, [
            Query.equal('orderID', doc.$id)
          ]);
          ordersWithItems.push({
            ...doc,
            items: itemsRes.documents
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
        return await databases.updateDocument(databaseId, ordersCol, orderID, { status });
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
        return await storage.createFile(imagesBucket, ID.unique(), file);
      } catch (error) {
        throw new Error(error.message);
      }
    },

    getFilePreview: (fileId) => {
      if (!isConfigured || fileId.startsWith('http') || fileId.startsWith('data:')) {
        return fileId; // If it's already a URL or mock URL
      }
      try {
        return storage.getFilePreview(imagesBucket, fileId).href;
      } catch (error) {
        return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80';
      }
    }
  }
};
