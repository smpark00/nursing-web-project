import React, { memo } from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  type = 'button',
  ariaLabel,
  ...props
}) => {
  const baseClasses = 'button';
  const variantClasses = {
    primary: 'button--primary',
    secondary: 'button--secondary',
    outline: 'button--outline',
    ghost: 'button--ghost',
    danger: 'button--danger'
  };
  const sizeClasses = {
    small: 'button--small',
    medium: 'button--medium',
    large: 'button--large'
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabled && 'button--disabled',
    loading && 'button--loading',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="button__spinner" aria-hidden="true" />}
      <span className={loading ? 'button__content--loading' : 'button__content'}>
        {children}
      </span>
    </button>
  );
};

Button.displayName = 'Button';
export default memo(Button);
