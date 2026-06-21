import React from 'react';
import './FormContainer.css';

export const FormContainer = ({ children, title, subtitle, className = '' }) => {
  return (
    <div className={`form-container ${className}`}>
      <div className="form-card">
        {title && (
          <div className="form-header">
            <h1 className="form-title">{title}</h1>
            {subtitle && <p className="form-subtitle">{subtitle}</p>}
          </div>
        )}
        <div className="form-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FormContainer;
