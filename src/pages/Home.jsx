import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { appwriteService } from '../services/appwrite';
import { ProductCard } from '../components/ProductCard';
import { Filter, SlidersHorizontal } from 'lucide-react';

export const Home = ({ searchFilter = '' }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  // Load Categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const catList = await appwriteService.categories.list();
        setCategories(catList);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Load Products when category, search, or sorting changes
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const searchVal = searchFilter || searchParams.get('search') || '';
        const prodList = await appwriteService.products.list(searchVal, selectedCategory);
        
        // Handle sorting in client side for simplicity and reliability
        let sorted = [...prodList];
        if (sortBy === 'price-low') {
          sorted.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
          sorted.sort((a, b) => b.price - a.price);
        }
        
        setProducts(sorted);
      } catch (err) {
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [selectedCategory, searchFilter, searchParams, sortBy]);

  const featuredProduct = products.find(p => p.$id === 'prod_1') || products[0];

  return (
    <div>
      {/* Hero Banner Section */}
      {featuredProduct && (
        <div className="hero">
          <div className="hero-content">
            <span className="hero-subtitle">Premium Electronics Collection</span>
            <h1 className="hero-title">{featuredProduct.name}</h1>
            <p className="hero-description">{featuredProduct.description}</p>
            <button 
              className="btn btn-primary"
              onClick={() => {
                const element = document.getElementById('products-section');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Shop Now
            </button>
          </div>
          <div className="hero-image-container">
            <img 
              src={appwriteService.storage.getFilePreview(featuredProduct.imageID)} 
              alt={featuredProduct.name} 
              className="hero-image" 
            />
          </div>
        </div>
      )}

      {/* Circle Categories Nav */}
      <div className="categories-circles">
        <div className="category-circle-card" onClick={() => setSelectedCategory('')}>
          <div className="category-circle-img-wrapper" style={{ border: selectedCategory === '' ? '2px solid var(--primary)' : '' }}>
            <img 
              src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500&q=80" 
              alt="All" 
              className="category-circle-img" 
            />
          </div>
          <span className="category-circle-title" style={{ color: selectedCategory === '' ? 'var(--primary)' : '' }}>All Products</span>
        </div>
        {categories.map((cat) => {
          const imgUrl = appwriteService.storage.getFilePreview(cat.imageID);
          const isSelected = selectedCategory === cat.$id;
          return (
            <div key={cat.$id} className="category-circle-card" onClick={() => setSelectedCategory(cat.$id)}>
              <div className="category-circle-img-wrapper" style={{ border: isSelected ? '2px solid var(--primary)' : '' }}>
                <img src={imgUrl} alt={cat.title} className="category-circle-img" />
              </div>
              <span className="category-circle-title" style={{ color: isSelected ? 'var(--primary)' : '' }}>{cat.title}</span>
            </div>
          );
        })}
      </div>

      {/* Store Container */}
      <div id="products-section" className="store-container">
        {/* Sidebar Filters */}
        <aside className="sidebar">
          <h3 className="sidebar-title">Filters</h3>
          <div className="category-list">
            <div 
              className={`category-item ${selectedCategory === '' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('')}
            >
              All Categories
            </div>
            {categories.map((cat) => (
              <div 
                key={cat.$id} 
                className={`category-item ${selectedCategory === cat.$id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.$id)}
              >
                {cat.title}
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Sort By Price</h4>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input"
              style={{ padding: '0.5rem' }}
            >
              <option value="">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="products-section">
          <div className="products-header">
            <h2>Our Products</h2>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {products.length} {products.length === 1 ? 'product' : 'products'} found
            </span>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', minHeight: '30vh', alignItems: 'center' }}>
              <div className="spinner">Searching Products...</div>
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
              No products found. Try adjustments to your filters or search query.
            </div>
          ) : (
            <div className="products-grid">
              {products.map((prod) => (
                <ProductCard key={prod.$id} product={prod} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
