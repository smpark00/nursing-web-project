import React, { memo } from 'react';

const NotificationIcon = ({
  icon,
  ariaLabel,
  onClick,
  className = '',
  hasNotification = false,
  ...props
}) => {
  return (
    <div className="header__notifications">
      <button
        className={`header__notification-icon ${className}`}
        onClick={onClick}
        aria-label={ariaLabel}
        type="button"
        {...props}
      >
        {icon}
        {hasNotification && (
          <span 
            className="header__notification-badge"
            aria-label="새 알림"
          />
        )}
      </button>
    </div>
  );
};

NotificationIcon.displayName = 'NotificationIcon';
export default memo(NotificationIcon);
