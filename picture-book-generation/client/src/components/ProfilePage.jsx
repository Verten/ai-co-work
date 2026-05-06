import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { storybooks } from '../api';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [storybookList, setStorybookList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchStorybooks();
  }, []);

  const fetchStorybooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await storybooks.list();
      setStorybookList(data);
    } catch (err) {
      setError(err.message || 'Failed to load storybooks');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id) => {
    navigate(`/preview/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this storybook?')) {
      return;
    }

    try {
      setDeletingId(id);
      await storybooks.delete(id);
      setStorybookList(storybookList.filter((sb) => sb.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete storybook');
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    const statusClass = `status-badge status-${status}`;
    const statusText = status === 'published' ? 'Published' : 'Draft';
    return <span className={statusClass}>{statusText}</span>;
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading your storybooks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-error">
          <p className="error-text">{error}</p>
          <button className="btn btn-primary" onClick={fetchStorybooks}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="welcome-info">
            <h1 className="welcome-title">Welcome, {user?.username}!</h1>
            <p className="welcome-subtitle">Manage your picture books</p>
          </div>
          <button className="btn btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="storybooks-section">
          <h2 className="section-title">Your Storybooks</h2>

          {storybookList.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <p className="empty-text">No storybooks yet</p>
              <p className="empty-hint">Create your first storybook on the homepage</p>
            </div>
          ) : (
            <div className="storybooks-list">
              {storybookList.map((storybook) => (
                <div key={storybook.id} className="storybook-card">
                  <div className="storybook-info">
                    <h3 className="storybook-title">{storybook.title}</h3>
                    <div className="storybook-meta">
                      {getStatusBadge(storybook.status)}
                      <span className="storybook-date">
                        Created {formatDate(storybook.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="storybook-actions">
                    <button
                      className="btn btn-view"
                      onClick={() => handleView(storybook.id)}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(storybook.id)}
                      disabled={deletingId === storybook.id}
                    >
                      {deletingId === storybook.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;