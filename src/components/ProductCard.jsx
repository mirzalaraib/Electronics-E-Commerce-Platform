import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { firebaseService } from '../services/firebase';
import { ShoppingCart } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const imageUrl = firebaseService.storage.getFilePreview(product.imageID);

  return (
    <div className="product-card">
      <Link to={`/product/${product.$id}`}>
        <div className="product-card-img-wrapper">
          <img src={imageUrl} alt={product.name} className="product-card-img" />
        </div>
      </Link>
      
      <div>
        <Link to={`/product/${product.$id}`}>
          <h3 className="product-card-name">{product.name}</h3>
        </Link>
        <p className="product-card-desc">{product.description}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="product-card-price">₹{product.price}</span>
          <button 
            className="btn btn-primary" 
            style={{ padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => addToCart(product, 1)}
            title="Add to Cart"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
