import React from 'react';

/**
 * Card component for containing content
 * 
 * @param {Object} props - Component props
 * @param {'default'|'elevated'|'bordered'} props.variant - Card style variant
 * @param {boolean} props.hoverable - Whether card should have hover effect
 * @param {React.ReactNode} props.children - Card content
 */
const Card = ({
  variant = 'default',
  hoverable = false,
  children,
  className = '',
  ...props
}) => {
  // Base classes
  const baseClasses = 'rounded-2xl p-4 transition-all';
  
  // Variant classes
  const variantClasses = {
    default: 'bg-card-background',
    elevated: 'bg-card-background shadow-lg',
    bordered: 'bg-card-background border border-border'
  };
  
  // Hover effect
  const hoverClass = hoverable ? 'hover:shadow-lg hover:translate-y-[-2px]' : '';
  
  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
