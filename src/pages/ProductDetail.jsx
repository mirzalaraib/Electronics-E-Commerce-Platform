import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { appwriteService } from '../services/appwrite';
import { useCart } from '../context/CartContext';
import { Plus, Minus, ShoppingCart, ChevronLeft } from 'lucide-react';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const prod = await appwriteService.products.get(id);
        setProduct(prod);
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="spinner">Loading Product Details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem' }}>
        <h2>Product Not Found</h2>
        <Link to="/" className="btn btn-secondary" style={{ marginTop: '1.5rem' }}>
          Back to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 3000);
  };

  let specs = {};
  if (product.specifications) {
    try {
      specs = JSON.parse(product.specifications);
    } catch (e) {
      // Fallback if specifications is not a valid JSON string
      specs = { Description: product.specifications };
    }
  }

  const imageUrl = appwriteService.storage.getFilePreview(product.imageID);

  return (
    <div className="product-detail-container">
      <div style={{ gridColumn: '1 / -1', marginBottom: '-1.5rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)' }}>
          <ChevronLeft size={16} /> Back to Products
        </Link>
      </div>

      <div className="product-detail-img-col">
        <img src={imageUrl} alt={product.name} className="product-detail-img" />
      </div>

      <div className="product-detail-info-col">
        <span className="product-detail-category">Premium Audio</span>
        <h1 className="product-detail-name">{product.name}</h1>
        <div className="product-detail-price">₹{product.price}</div>
        
        <p className="product-detail-desc">{product.description}</p>

        <div className="product-detail-action-row">
          <div className="quantity-selector">
            <button className="quantity-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
              <Minus size={16} />
            </button>
            <span className="quantity-val">{quantity}</span>
            <button className="quantity-btn" onClick={() => setQuantity(quantity + 1)}>
              <Plus size={16} />
            </button>
          </div>

          <button className="btn btn-primary" onClick={handleAddToCart}>
            <ShoppingCart size={18} /> Add to Cart
          </button>
        </div>

        {addedMessage && (
          <div style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            ✓ Added {quantity} item(s) to cart successfully!
          </div>
        )}

        {Object.keys(specs).length > 0 && (
          <div className="specs-section">
            <h3 className="specs-title">Technical Specifications</h3>
            <div className="specs-grid">
              {Object.entries(specs).map(([key, val]) => (
                <div key={key} className="spec-item">
                  <span className="spec-label">{key}</span>
                  <span className="spec-value">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
