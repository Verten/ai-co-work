import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="home-page">
      <div className="home-container">
        {user && (
          <div className="welcome-section">
            <h1 className="welcome-title">Welcome back, {user.username}!</h1>
            <p className="welcome-subtitle">Create magical picture books with AI</p>
          </div>
        )}

        {!user && (
          <div className="welcome-section">
            <h1 className="welcome-title">Picture Book Generator</h1>
            <p className="welcome-subtitle">Create magical picture books with AI</p>
          </div>
        )}

        <div className="cards-section">
          <div
            className="card"
            onClick={() => handleCardClick('/chat')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleCardClick('/chat')}
          >
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h2 className="card-title">Chat Generation</h2>
            <p className="card-description">
              Describe your story through conversation and let AI create unique illustrations
            </p>
          </div>

          <div
            className="card"
            onClick={() => handleCardClick('/random')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleCardClick('/random')}
          >
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <h2 className="card-title">Random Generation</h2>
            <p className="card-description">
              Generate random stories and images with a single click
            </p>
          </div>
        </div>

        {!user && (
          <div className="auth-prompt">
            <p>
              <Link to="/login" className="auth-link">Login</Link>
              {' or '}
              <Link to="/register" className="auth-link">Register</Link>
              {' to save your creations'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;