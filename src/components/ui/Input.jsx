import React from 'react';

/**
 * Input component for text entry
 * 
 * @param {Object} props - Component props
 * @param {string} props.type - Input type (text, email, password, etc.)
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.label - Input label
 * @param {string} props.error - Error message
 * @param {boolean} props.disabled - Whether input is disabled
 */
const Input = ({
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  label = '',
  error = '',
  disabled = false,
  className = '',
  ...props
}) => {
  // Base classes
  const baseClasses = 'w-full rounded-lg border bg-input-background px-4 py-2 text-text-primary transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent';
  
  // Error and disabled states
  const stateClasses = error 
    ? 'border-error' 
    : disabled 
      ? 'border-border opacity-60 cursor-not-allowed' 
      : 'border-border';
  
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="mb-1 block text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`${baseClasses} ${stateClasses}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default Input;
