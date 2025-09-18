import React, { memo } from 'react';
import SearchInput from '../common/SearchInput';
import LiveIndicator from '../common/LiveIndicator';
import NotificationIcon from '../common/NotificationIcon';
import ProfileSection from '../common/ProfileSection';

const Header = ({ 
  onSearch, 
  liveData, 
  userProfile,
  className = '',
  ...props 
}) => {
  return (
    <header className={`header ${className}`} {...props}>
      <SearchInput 
        onSearch={onSearch} 
        placeholder="검색" 
        ariaLabel="검색"
      />
      <div className="header__actions">
        <LiveIndicator 
          isLive={liveData.isLive} 
          currentTime={liveData.currentTime} 
        />
        <NotificationIcon 
          icon="🔔" 
          ariaLabel="알림"
          hasNotification={liveData.newMessages > 0}
        />
        <NotificationIcon 
          icon="⚙️" 
          ariaLabel="설정"
        />
        <ProfileSection 
          profilePicture={userProfile.picture}
          name={userProfile.name}
        />
      </div>
    </header>
  );
};

Header.displayName = 'Header';
export default memo(Header);
