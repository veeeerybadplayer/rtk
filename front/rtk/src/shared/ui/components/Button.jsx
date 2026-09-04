import React from 'react';
import './Button.css';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  ...props
}) => {
  return (
    <button
      type={type}
      className={`button button--${variant} button--${size} ${
        fullWidth ? 'button--full-width' : ''
      } ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
