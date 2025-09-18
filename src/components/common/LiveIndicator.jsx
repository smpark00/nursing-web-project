import React, { memo } from 'react';

const LiveIndicator = ({
  isLive = true,
  currentTime,
  className = '',
  ...props
}) => {
  const formatTime = (date) => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <div className={`header__live-indicator ${className}`} {...props}>
      <div 
        className={`header__live-dot ${isLive ? 'header__live-dot--pulsing' : ''}`}
        aria-hidden="true"
      />
      <span className="header__live-text">LIVE</span>
      <span className="header__live-time">
        {formatTime(currentTime)}
      </span>
    </div>
  );
};

LiveIndicator.displayName = 'LiveIndicator';
export default memo(LiveIndicator);
