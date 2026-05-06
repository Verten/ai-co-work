import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { storybooks } from '../api';
import './PreviewPage.css';

const PreviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [storybook, setStorybook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStorybook = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await storybooks.get(id);
        setStorybook(data);
      } catch (err) {
        setError(err.message || 'Failed to load storybook');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStorybook();
    }
  }, [id]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (storybook && currentPage < storybook.pages.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleThumbnailClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="preview-page">
        <div className="preview-loading">
          <div className="loading-spinner"></div>
          <p>Loading storybook...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="preview-page">
        <div className="preview-error">
          <p className="error-text">{error}</p>
          <button className="btn btn-back" onClick={handleBack}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!storybook || !storybook.pages || storybook.pages.length === 0) {
    return (
      <div className="preview-page">
        <div className="preview-error">
          <p className="error-text">Storybook not found</p>
          <button className="btn btn-back" onClick={handleBack}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentPageData = storybook.pages.find(
    (p) => p.page_number === currentPage
  ) || storybook.pages[0];

  return (
    <div className="preview-page">
      <div className="preview-header">
        <h1 className="preview-title">{storybook.title}</h1>
      </div>

      <div className="preview-main">
        <div className="preview-content">
          {/* Page display */}
          <div className="page-display">
            <button
              className="nav-btn nav-btn-prev"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              ◀
            </button>

            <div className="page-card">
              <div className="page-image-container">
                {currentPageData.image_url ? (
                  <img
                    src={currentPageData.image_url}
                    alt={`Page ${currentPage}`}
                    className="page-image"
                  />
                ) : (
                  <div className="page-image-placeholder">No image</div>
                )}
              </div>
              <div className="page-text-container">
                <p className="page-text">{currentPageData.text}</p>
              </div>
            </div>

            <button
              className="nav-btn nav-btn-next"
              onClick={handleNextPage}
              disabled={currentPage === storybook.pages.length}
              aria-label="Next page"
            >
              ▶
            </button>
          </div>

          {/* Page indicator */}
          <div className="page-indicator">
            第 {currentPage} / {storybook.pages.length} 页
          </div>

          {/* Thumbnail navigation */}
          <div className="thumbnail-nav">
            {storybook.pages.map((page) => (
              <button
                key={page.page_number}
                className={`thumbnail ${currentPage === page.page_number ? 'active' : ''}`}
                onClick={() => handleThumbnailClick(page.page_number)}
                aria-label={`Go to page ${page.page_number}`}
              >
                <div className="thumbnail-image-container">
                  {page.image_url ? (
                    <img
                      src={page.image_url}
                      alt={`Thumbnail ${page.page_number}`}
                      className="thumbnail-image"
                    />
                  ) : (
                    <div className="thumbnail-placeholder">
                      <span>{page.page_number}</span>
                    </div>
                  )}
                </div>
                <span className="thumbnail-label">{page.page_number}</span>
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="preview-actions">
            <button className="btn btn-back-action" onClick={handleBack}>
              返回
            </button>
            <button className="btn btn-print" onClick={handlePrint}>
              打印
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;
