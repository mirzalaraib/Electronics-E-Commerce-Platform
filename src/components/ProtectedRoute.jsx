import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const { login, signup } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="spinner">Loading Session...</div>
      </div>
    );
  }

  // Simple admin check: let's say user is admin if email is admin@boat.com or ends with @boat.com (or mock admin status)
  const isAdmin = user && (user.email === 'admin@boat.com' || user.email === 'admin@gmail.com' || user.email.startsWith('admin@'));

  if (!user) {
    const handleAuthSubmit = async (e) => {
      e.preventDefault();
      setError('');
      try {
        if (isSignUp) {
          await signup(email, password, name);
        } else {
          await login(email, password);
        }
      } catch (err) {
        setError(err.message || 'Authentication failed');
      }
    };

    return (
      <div className="modal-overlay" style={{ position: 'relative', minHeight: '80vh', background: 'transparent' }}>
        <div className="modal-content" style={{ boxShadow: 'none', border: '1px solid var(--border)' }}>
          <h2 className="modal-title">{isSignUp ? 'Create Account' : 'Account Login'}</h2>
          {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{error}</div>}
          <form onSubmit={handleAuthSubmit}>
            {isSignUp && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                required
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>
          <div className="form-switch-prompt">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <span className="form-switch-link" onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? 'Login' : 'Sign Up'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <h2 style={{ color: 'var(--error)', marginBottom: '1rem' }}>Access Denied</h2>
        <p style={{ color: 'var(--text-muted)' }}>You must be logged in as an Administrator to view this panel.</p>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.85rem' }}>Hint: Use admin@boat.com to log in as administrator.</p>
      </div>
    );
  }

  return children;
};
