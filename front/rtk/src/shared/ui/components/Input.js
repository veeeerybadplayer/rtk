import React from 'react';
import './Input.css';

export const Input = React.forwardRef(({
  label,
  error,
  size = 'md',
  type = 'text',
  placeholder,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="input-wrapper">
      {label && (
        <label className="input-label">
          {label}
          {props.required && <span className="input-required">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`input input--${size} ${error ? 'input--error' : ''} ${className}`}
        placeholder={placeholder}
        disabled={disabled}
        {...props}
      />
      {error && <span className="input-error">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
