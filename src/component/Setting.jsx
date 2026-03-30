import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../api/customerapi';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleManageAccount = () => {
    navigate('/profile');
    setIsOpen(false);
  };

  const handleEditProfile = () => {
    navigate('/updateprofile');
    setIsOpen(false);
  };

  const handleSettings = () => {
    navigate('/settings');
    setIsOpen(false);
  };

  const handleNotifications = () => {
    navigate('/notifications');
    setIsOpen(false);
  };

  const handleHelp = () => {
    window.open('https://gmail.com', '_blank');
    setIsOpen(false);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      localStorage.removeItem("authToken");
      navigate('/home');
    }
    setIsOpen(false);
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Generate color from name
  const getAvatarColor = (name) => {
    if (!name) return '#2d6a4f';
    const colors = [
      '#2d6a4f', '#d62828', '#f77f00', '#06aed5', '#7209b7',
      '#3a86ff', '#fb5607', '#8338ec', '#ffbe0b', '#06a77d'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div style={styles.container} ref={dropdownRef}>
      <button 
        style={styles.profileButton} 
        onClick={toggleDropdown}
        aria-label="Profile"
      >
        {loading ? (
          <div style={styles.loadingSpinner}>⏳</div>
        ) : profile?.profileImage ? (
          <img 
            src={profile.profileImage} 
            alt="Profile" 
            style={styles.profileImage}
          />
        ) : (
          <div style={{
            ...styles.avatarInitials,
            background: getAvatarColor(profile?.name || 'User')
          }}>
            {getInitials(profile?.name || 'User')}
          </div>
        )}
      </button>

      {isOpen && (
        <div style={styles.dropdown}>
          {/* Profile Header Section */}
          <div style={styles.profileHeader}>
            <div style={styles.profileHeaderTop}>
              {profile?.profileImage ? (
                <img 
                  src={profile.profileImage} 
                  alt="Profile" 
                  style={styles.largeAvatar}
                />
              ) : (
                <div style={{
                  ...styles.largeAvatar,
                  ...styles.avatarInitials,
                  background: getAvatarColor(profile?.name || 'User'),
                  fontSize: '32px'
                }}>
                  {getInitials(profile?.name || 'User')}
                </div>
              )}
              <div style={styles.profileName}>
                {profile?.name || 'User'}
              </div>
              <div style={styles.profileSubtitle}>
                Track your nutrition and health goals
              </div>
            </div>
            
            <button style={styles.primaryButton} onClick={handleManageAccount}>
              View Profile
            </button>
          </div>

          {/* Menu Items */}
          <div style={styles.menuSection}>
            <button style={styles.menuItem} onClick={handleEditProfile}>
              <span style={styles.menuIcon}>✏️</span>
              <span style={styles.menuText}>Edit profile</span>
            </button>

            <button style={styles.menuItem} onClick={handleSettings}>
              <span style={styles.menuIcon}>⚙️</span>
              <span style={styles.menuText}>Settings</span>
            </button>

            <button style={styles.menuItem} onClick={handleNotifications}>
              <span style={styles.menuIcon}>🔔</span>
              <span style={styles.menuText}>Notifications</span>
            </button>

            <button style={styles.menuItem} onClick={handleHelp}>
              <span style={styles.menuIcon}>❓</span>
              <span style={styles.menuText}>Help & Support</span>
            </button>

            <button style={{...styles.menuItem, ...styles.signOutItem}} onClick={handleLogout}>
              <span style={styles.menuIcon}>🚪</span>
              <span style={styles.menuText}>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
  },
  profileButton: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    padding: 0,
    overflow: 'hidden',
    transition: 'opacity 0.2s ease',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '50%',
  },
  avatarInitials: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: '16px',
    borderRadius: '50%',
  },
  loadingSpinner: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  dropdown: {
    position: 'absolute',
    top: '48px',
    right: '0',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
    width: '320px',
    overflow: 'hidden',
    zIndex: 1000,
    animation: 'fadeIn 0.2s ease-out',
  },
  profileHeader: {
    background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)',
    padding: '24px',
    textAlign: 'center',
  },
  profileHeaderTop: {
    marginBottom: '16px',
  },
  largeAvatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    margin: '0 auto 12px',
    objectFit: 'cover',
  },
  profileName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '4px',
  },
  profileSubtitle: {
    fontSize: '13px',
    color: '#666',
    lineHeight: '1.4',
  },
  primaryButton: {
    width: '100%',
    padding: '10px 20px',
    background: '#2d6a4f',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
  },
  menuSection: {
    padding: '8px 0',
  },
  menuItem: {
    width: '100%',
    padding: '12px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#333',
    textAlign: 'left',
    transition: 'background 0.2s ease',
  },
  menuIcon: {
    fontSize: '18px',
    width: '20px',
    textAlign: 'center',
  },
  menuText: {
    flex: 1,
  },
  signOutItem: {
    borderTop: '1px solid #e0e0e0',
    marginTop: '8px',
    paddingTop: '16px',
  },
};

// Add CSS animation
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    button:hover {
      opacity: 0.9;
    }
    
    [data-menu-item]:hover {
      background: #f5f5f5 !important;
    }
  `;
  
  if (!document.querySelector('style[data-profile-menu]')) {
    styleSheet.setAttribute('data-profile-menu', 'true');
    document.head.appendChild(styleSheet);
  }
}

export default ProfileDropdown;