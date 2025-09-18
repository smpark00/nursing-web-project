import React, { memo } from 'react';

const SearchInput = ({
  placeholder = '검색',
  value,
  onChange,
  onKeyDown,
  className = '',
  ariaLabel,
  disabled = false,
  ...props
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  return (
    <div className={`header__search ${className}`}>
      <input
        type="text"
        className="header__search-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel || placeholder}
        disabled={disabled}
        {...props}
      />
    </div>
  );
};

SearchInput.displayName = 'SearchInput';
export default memo(SearchInput);
