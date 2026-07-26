import React, { useState, useEffect } from 'react';
import { firebaseService } from '../services/firebase';
import { Package, FolderOpen, ListOrdered, Plus, Edit2, Trash2, Check, X, FileImage, Sparkles } from 'lucide-react';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  
  // Data States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [showProductModal, setShowProductModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null); // Null for create, object for edit
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productSpecs, setProductSpecs] = useState('{}');
  const [productImageFile, setProductImageFile] = useState(null);
  const [productImageId, setProductImageId] = useState('');

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryTitle, setCategoryTitle] = useState('');
  const [categoryImageFile, setCategoryImageFile] = useState(null);
  const [categoryImageId, setCategoryImageId] = useState('');

  const [orderUpdatingId, setOrderUpdatingId] = useState(null);
  const [newOrderStatus, setNewOrderStatus] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const prodList = await firebaseService.products.list();
      const catList = await firebaseService.categories.list();
      const ordList = await firebaseService.orders.listAll();
      
      setProducts(prodList);
      setCategories(catList);
      setOrders(ordList);
    } catch (err) {
      console.error('Admin Load Failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // --- PRODUCT CRUD HANDLING ---
  const openProductCreate = () => {
    setCurrentProduct(null);
    setProductName('');
    setProductPrice('');
    setProductDesc('');
    setProductCategory(categories[0]?.$id || '');
    setProductSpecs('{"Battery Life": "10 Hours", "Bluetooth": "v5.0"}');
    setProductImageFile(null);
    setProductImageId('');
    setShowProductModal(true);
  };

  const openProductEdit = (product) => {
    setCurrentProduct(product);
    setProductName(product.name);
    setProductPrice(product.price);
    setProductDesc(product.description);
    setProductCategory(product.categoryID);
    setProductSpecs(product.specifications || '{}');
    setProductImageFile(null);
    setProductImageId(product.imageID);
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      let finalImgId = productImageId;
      if (productImageFile) {
        const uploadRes = await firebaseService.storage.uploadFile(productImageFile);
        finalImgId = uploadRes.mockUrl || uploadRes.$id;
      }

      if (!finalImgId) {
        alert('Please choose an image for the product');
        return;
      }

      const productPayload = {
        name: productName,
        price: Number(productPrice),
        description: productDesc,
        categoryID: productCategory,
        imageID: finalImgId,
        specifications: productSpecs
      };

      if (currentProduct) {
        await firebaseService.products.update(currentProduct.$id, productPayload);
      } else {
        await firebaseService.products.create(productPayload);
      }
      
      setShowProductModal(false);
      loadAllData();
    } catch (err) {
      console.error(err);
      alert('Error saving product: ' + err.message);
    }
  };

  const handleProductDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
        await firebaseService.products.delete(id);
      loadAllData();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  // --- CATEGORY CRUD HANDLING ---
  const openCategoryCreate = () => {
    setCurrentCategory(null);
    setCategoryTitle('');
    setCategoryImageFile(null);
    setCategoryImageId('');
    setShowCategoryModal(true);
  };

  const openCategoryEdit = (category) => {
    setCurrentCategory(category);
    setCategoryTitle(category.title);
    setCategoryImageFile(null);
    setCategoryImageId(category.imageID);
    setShowCategoryModal(true);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      let finalImgId = categoryImageId;
      if (categoryImageFile) {
        const uploadRes = await firebaseService.storage.uploadFile(categoryImageFile);
        finalImgId = uploadRes.mockUrl || uploadRes.$id;
      }

      if (!finalImgId) {
        alert('Please select a category image');
        return;
      }

      if (currentCategory) {
        await firebaseService.categories.update(currentCategory.$id, { title: categoryTitle, imageID: finalImgId });
      } else {
        await firebaseService.categories.create(categoryTitle, finalImgId);
      }

      setShowCategoryModal(false);
      loadAllData();
    } catch (err) {
      console.error(err);
      alert('Error saving category: ' + err.message);
    }
  };

  const handleCategoryDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
        await firebaseService.categories.delete(id);
      loadAllData();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  // --- ORDER STATUS UPDATES ---
  const startOrderStatusUpdate = (order) => {
    setOrderUpdatingId(order.$id);
    setNewOrderStatus(order.status);
  };

  const saveOrderStatus = async (orderId) => {
    try {
      await firebaseService.orders.updateStatus(orderId, newOrderStatus);
      setOrderUpdatingId(null);
      loadAllData();
    } catch (err) {
      alert('Status update failed: ' + err.message);
    }
  };

  // Calculations for KPIs
  const totalRevenue = orders.reduce((sum, o) => o.status.toLowerCase() === 'delivered' ? sum + o.totalPrice : sum, 0);
  const pendingOrders = orders.filter(o => o.status.toLowerCase() === 'pending').length;

  return (
    <div className="dashboard-container" style={{ maxWidth: '1200px' }}>
      <div className="dashboard-header">
        <div>
          <h1>Admin Control Panel</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Monitor shop metrics, manage products, categories and fulfill customer orders</p>
        </div>
      </div>

      {/* Admin KPIs */}
      <div className="categories-circles" style={{ margin: '0 0 2rem 0', justifyContent: 'flex-start', gap: '1.5rem', maxWidth: 'none' }}>
        <div className="profile-card" style={{ flex: '1 1 220px', padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '0.75rem', borderRadius: '50%' }}>
            <Sparkles size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>DELIVERED REVENUE</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>₹{totalRevenue}</div>
          </div>
        </div>

        <div className="profile-card" style={{ flex: '1 1 220px', padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--primary)', padding: '0.75rem', borderRadius: '50%' }}>
            <Package size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TOTAL PRODUCTS</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{products.length}</div>
          </div>
        </div>

        <div className="profile-card" style={{ flex: '1 1 220px', padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', padding: '0.75rem', borderRadius: '50%' }}>
            <ListOrdered size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>PENDING ORDERS</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{pendingOrders} / {orders.length}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
          Products
        </button>
        <button className={`admin-tab ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>
          Categories
        </button>
        <button className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
          Orders
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
          <div className="spinner">Retrieving Store Data...</div>
        </div>
      ) : (
        <div>
          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Catalog Products</h3>
                <button className="btn btn-primary" onClick={openProductCreate}>
                  <Plus size={16} /> Add Product
                </button>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((prod) => (
                      <tr key={prod.$id}>
                        <td>
                          <img 
                            src={firebaseService.storage.getFilePreview(prod.imageID)} 
                            alt={prod.name} 
                            className="admin-product-thumb" 
                          />
                        </td>
                        <td style={{ fontWeight: 600 }}>{prod.name}</td>
                        <td>{categories.find(c => c.$id === prod.categoryID)?.title || 'Uncategorized'}</td>
                        <td style={{ color: 'var(--accent)', fontWeight: 600 }}>₹{prod.price}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem' }} onClick={() => openProductEdit(prod)}>
                              <Edit2 size={14} />
                            </button>
                            <button className="btn btn-danger" style={{ padding: '0.4rem 0.6rem' }} onClick={() => handleProductDelete(prod.$id)}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CATEGORIES TAB */}
          {activeTab === 'categories' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Store Categories</h3>
                <button className="btn btn-primary" onClick={openCategoryCreate}>
                  <Plus size={16} /> Add Category
                </button>
              </div>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Category ID</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr key={cat.$id}>
                        <td>
                          <img 
                            src={firebaseService.storage.getFilePreview(cat.imageID)} 
                            alt={cat.title} 
                            className="admin-product-thumb" 
                          />
                        </td>
                        <td style={{ fontWeight: 600 }}>{cat.title}</td>
                        <td><code>{cat.$id}</code></td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem' }} onClick={() => openCategoryEdit(cat)}>
                              <Edit2 size={14} />
                            </button>
                            <button className="btn btn-danger" style={{ padding: '0.4rem 0.6rem' }} onClick={() => handleCategoryDelete(cat.$id)}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div>
              <h3 style={{ marginBottom: '1.5rem' }}>Customer Orders</h3>

              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer Details</th>
                      <th>Items (Qty)</th>
                      <th>Total Price</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((ord) => (
                      <tr key={ord.$id}>
                        <td><code>{ord.$id}</code></td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{ord.customerName}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Phone: {ord.phone}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Address: {ord.address}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.85rem' }}>
                            {ord.items && ord.items.map((item, i) => (
                              <div key={i}>{item.productName} (x{item.quantity})</div>
                            ))}
                          </div>
                        </td>
                        <td style={{ color: 'var(--accent)', fontWeight: 600 }}>₹{ord.totalPrice}</td>
                        <td>
                          {orderUpdatingId === ord.$id ? (
                            <select 
                              value={newOrderStatus} 
                              onChange={(e) => setNewOrderStatus(e.target.value)}
                              className="form-input"
                              style={{ padding: '0.25rem', fontSize: '0.85rem' }}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          ) : (
                            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{ord.status}</span>
                          )}
                        </td>
                        <td>
                          {orderUpdatingId === ord.$id ? (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button className="btn btn-success" style={{ padding: '0.4rem' }} onClick={() => saveOrderStatus(ord.$id)}>
                                <Check size={14} />
                              </button>
                              <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={() => setOrderUpdatingId(null)}>
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => startOrderStatusUpdate(ord)}>
                              Update Status
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PRODUCT CREATION/EDIT MODAL */}
      {showProductModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '550px' }}>
            <h2 className="modal-title">{currentProduct ? 'Edit Product' : 'Add New Product'}</h2>
            
            <form onSubmit={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  value={productName} 
                  onChange={(e) => setProductName(e.target.value)} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    required 
                    value={productPrice} 
                    onChange={(e) => setProductPrice(e.target.value)} 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select 
                    className="form-input" 
                    value={productCategory} 
                    onChange={(e) => setProductCategory(e.target.value)}
                    required
                  >
                    {categories.map(c => (
                      <option key={c.$id} value={c.$id}>{c.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-input" 
                  required 
                  rows="3"
                  value={productDesc} 
                  onChange={(e) => setProductDesc(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Specifications (JSON Format)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={productSpecs} 
                  onChange={(e) => setProductSpecs(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Product Image File</label>
                <input 
                  type="file" 
                  accept="image/*"
                  className="form-input"
                  style={{ border: 'dashed 1px var(--border)' }}
                  onChange={(e) => setProductImageFile(e.target.files[0])}
                />
                {productImageId && !productImageFile && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Current Image ID: {productImageId}</span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Save Product
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowProductModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY CREATION/EDIT MODAL */}
      {showCategoryModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">{currentCategory ? 'Edit Category' : 'Add Category'}</h2>
            
            <form onSubmit={handleCategorySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Category Title</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  value={categoryTitle} 
                  onChange={(e) => setCategoryTitle(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category Image File</label>
                <input 
                  type="file" 
                  accept="image/*"
                  className="form-input"
                  style={{ border: 'dashed 1px var(--border)' }}
                  onChange={(e) => setCategoryImageFile(e.target.files[0])}
                />
                {categoryImageId && !categoryImageFile && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Current Image ID: {categoryImageId}</span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Save Category
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCategoryModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
