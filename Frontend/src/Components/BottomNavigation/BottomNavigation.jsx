import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { FileText, BarChart3, User } from 'lucide-react';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile, analysisData } = useUser();

  // Determine which tab should be active
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/onboarding' || path === '/product-input') {
      return 'input';
    } else if (path === '/results' || path === '/analysis' || path === '/detailed') {
      return 'result';
    } else if (path === '/profile') {
      return 'profile';
    }
    return null;
  };

  const activeTab = getActiveTab();

  // Handle navigation
  const handleNavigate = (tab) => {
    if (tab === 'input') {
      // Go to product-input if profile exists, otherwise onboarding
      if (userProfile) {
        navigate('/product-input');
      } else {
        navigate('/onboarding');
      }
    } else if (tab === 'result') {
      // Go to results if analysis exists, otherwise product-input
      if (analysisData?.analysisId) {
        navigate('/results');
      } else {
        navigate('/product-input');
      }
    } else if (tab === 'profile') {
      navigate('/profile');
    }
  };

  // Don't show navigation on welcome page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF', // Soft White
        borderTop: '1px solid #E5E7EB',
        padding: '8px 0',
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.05)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        maxWidth: '400px',
        margin: '0 auto'
      }}
    >
      {/* Input Tab */}
      <button
        onClick={() => handleNavigate('input')}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px 12px',
          color: activeTab === 'input' ? '#A9D1B0' : '#9CA3AF', // Sage Green when active
          transition: 'color 0.2s'
        }}
      >
        <FileText size={20} style={{ color: activeTab === 'input' ? '#A9D1B0' : '#9CA3AF' }} />
        <span style={{ 
          fontSize: '11px', 
          fontWeight: activeTab === 'input' ? '600' : '500'
        }}>
          Input
        </span>
      </button>

      {/* Result Tab */}
      <button
        onClick={() => handleNavigate('result')}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px 12px',
          color: activeTab === 'result' ? '#A9D1B0' : '#9CA3AF', // Sage Green when active
          transition: 'color 0.2s',
          position: 'relative'
        }}
      >
        <BarChart3 size={20} style={{ color: activeTab === 'result' ? '#A9D1B0' : '#9CA3AF' }} />
        <span style={{ 
          fontSize: '11px', 
          fontWeight: activeTab === 'result' ? '600' : '500'
        }}>
          Result
        </span>
        {analysisData?.analysisId && (
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '20px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#A9D1B0', // Sage Green dot
          }} />
        )}
      </button>

      {/* Profile Tab */}
      <button
        onClick={() => handleNavigate('profile')}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px 12px',
          color: activeTab === 'profile' ? '#A9D1B0' : '#9CA3AF', // Sage Green when active
          transition: 'color 0.2s'
        }}
      >
        <User size={20} style={{ color: activeTab === 'profile' ? '#A9D1B0' : '#9CA3AF' }} />
        <span style={{ 
          fontSize: '11px', 
          fontWeight: activeTab === 'profile' ? '600' : '500'
        }}>
          Profile
        </span>
      </button>
    </div>
  );
};

export default BottomNavigation;

