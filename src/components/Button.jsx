import React from 'react';

export const Button = ({
  children,
  icon = null,
  onClick,
  className = '',
  disabled = false,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-primary text-white hover:bg-orange-600 focus:ring-primary',
    secondary: 'bg-gray-200 text-secondary hover:bg-gray-300 focus:ring-gray-400',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
    outline: 'border-2 border-primary text-primary hover:bg-orange-50 focus:ring-primary',
    ghost: 'text-primary hover:bg-orange-50 focus:ring-primary',
  };

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      {...props}
    >
      <span className="inline-flex items-center justify-center gap-2">
        {icon}
        <span>{children}</span>
      </span>
    </button>
  );
};
