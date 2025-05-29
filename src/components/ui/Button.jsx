import React from 'react';

/**
 * Button component with multiple variants
 * 
 * @param {Object} props - Component props
 * @param {'primary'|'secondary'|'outline'|'ghost'|'link'} props.variant - Button style variant
 * @param {'sm'|'md'|'lg'} props.size - Button size
 * @param {boolean} props.fullWidth - Whether button should take full width
 * @param {boolean} props.isLoading - Whether button is in loading state
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} props.onClick - Click handler
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  children,
  onClick,
  className = '',
  ...props
}) => {
  // Base classes
  const baseClasses = 'rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-accent hover:bg-accent-hover text-button-text shadow-sm',
    secondary: 'bg-card-background hover:bg-opacity-80 text-text-primary border border-border',
    outline: 'border border-accent text-accent hover:bg-accent hover:bg-opacity-10',
    ghost: 'hover:bg-accent hover:bg-opacity-10 text-text-primary',
    link: 'text-accent hover:underline p-0'
  };
  
  // Width class
  const widthClass = fullWidth ? 'w-full' : '';
  
  // Disabled and loading states
  const stateClasses = (disabled || isLoading) 
    ? 'opacity-60 cursor-not-allowed' 
    : 'cursor-pointer';
  
  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${stateClasses} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {children}
        </div>
      ) : children}
    </button>
  );
};

export default Button;
