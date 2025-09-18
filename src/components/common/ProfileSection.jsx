import React, { memo } from 'react';

const ProfileSection = ({
  profilePicture,
  name,
  onClick,
  className = '',
  ...props
}) => {
  return (
    <div className={`header__profile ${className}`} {...props}>
      <button
        className="header__profile-picture"
        onClick={onClick}
        aria-label="프로필"
        type="button"
      >
        {profilePicture}
      </button>
      <span className="header__profile-name">{name}</span>
    </div>
  );
};

ProfileSection.displayName = 'ProfileSection';
export default memo(ProfileSection);
