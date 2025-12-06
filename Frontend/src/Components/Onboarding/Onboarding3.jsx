import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Onboarding3() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    // Load data from localStorage
    const skinProfile = JSON.parse(localStorage.getItem('skinProfile') || '{}');
    const skinPreferences = JSON.parse(localStorage.getItem('skinPreferences') || '{}');
    
    setProfileData({
      skinType: skinProfile.skinType || 'Normal',
      concerns: skinProfile.concerns || [],
      sensitivity: skinPreferences.skinSensitivity || 'Somewhat',
      experience: skinPreferences.experience || 'Intermediate',
      goal: skinPreferences.mainGoals?.[0] || 'Clear Acne',
      budget: skinPreferences.budget || '$$$ Mid-range',
      preferences: skinPreferences.ingredients || []
    });
  }, []);

  const handleBack = () => {
    navigate('/onboarding2');
  };

  const handleComplete = () => {
    // Navigate to product input or dashboard
    navigate('/product-input');
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    header: {
      backgroundColor: 'white',
      padding: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    backButton: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      backgroundColor: '#f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      cursor: 'pointer'
    },
    headerText: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#111827'
    },
    progressContainer: {
      padding: '16px',
      backgroundColor: 'white',
      borderBottom: '1px solid #f3f4f6'
    },
    progressLabel: {
      fontSize: '13px',
      color: '#6b7280',
      marginBottom: '8px'
    },
    progressBars: {
      display: 'flex',
      gap: '6px'
    },
    progressBar: {
      height: '4px',
      flex: 1,
      borderRadius: '10px'
    },
    content: {
      padding: '24px 16px',
      maxWidth: '600px',
      margin: '0 auto'
    },
    heroContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '32px'
    },
    heroCircle: {
      width: '140px',
      height: '140px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #86efac 0%, #10b981 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
      position: 'relative'
    },
    heroInnerCircle: {
      width: '110px',
      height: '110px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    leafIcon: {
      width: '50px',
      height: '50px',
      color: '#065f46'
    },
    title: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#111827',
      marginBottom: '24px',
      textAlign: 'center'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    },
    row: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: '12px',
      paddingBottom: '12px',
      borderBottom: '1px solid #f3f4f6'
    },
    rowLast: {
      borderBottom: 'none'
    },
    label: {
      fontSize: '14px',
      color: '#10b981',
      fontWeight: '500'
    },
    value: {
      fontSize: '14px',
      color: '#374151',
      fontWeight: '500',
      textAlign: 'right'
    },
    completeButton: {
      width: '100%',
      padding: '16px',
      backgroundColor: '#10b981',
      color: 'white',
      fontSize: '16px',
      fontWeight: '600',
      border: 'none',
      borderRadius: '14px',
      cursor: 'pointer',
      marginTop: '16px',
      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
      transition: 'all 0.2s'
    }
  };

  if (!profileData) {
    return <div style={styles.container}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={handleBack} style={styles.backButton}>
          <ChevronLeft size={20} color="#6b7280" />
        </button>
        <span style={styles.headerText}>Confirm & Complete</span>
      </div>

      {/* Progress */}
      <div style={styles.progressContainer}>
        <div style={styles.progressLabel}>Step 3 of 3</div>
        <div style={styles.progressBars}>
          <div style={{...styles.progressBar, backgroundColor: '#10b981'}}></div>
          <div style={{...styles.progressBar, backgroundColor: '#10b981'}}></div>
          <div style={{...styles.progressBar, backgroundColor: '#10b981'}}></div>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* Hero Image */}
        <div style={styles.heroContainer}>
          <div style={styles.heroCircle}>
            <div style={styles.heroInnerCircle}>
              <svg style={styles.leafIcon} viewBox="0 0 50 50" fill="none" stroke="currentColor">
                <path d="M25 5 Q20 15, 15 25 Q13 30, 12 35" strokeWidth="2.5" strokeLinecap="round"/>
                <ellipse cx="17" cy="15" rx="5" ry="9" fill="currentColor" opacity="0.8" transform="rotate(-25 17 15)"/>
                <ellipse cx="16" cy="23" rx="5" ry="9" fill="currentColor" opacity="0.8" transform="rotate(-30 16 23)"/>
                <ellipse cx="14" cy="31" rx="4" ry="8" fill="currentColor" opacity="0.8" transform="rotate(-35 14 31)"/>
                <ellipse cx="33" cy="15" rx="5" ry="9" fill="currentColor" opacity="0.8" transform="rotate(25 33 15)"/>
                <ellipse cx="34" cy="23" rx="5" ry="9" fill="currentColor" opacity="0.8" transform="rotate(30 34 23)"/>
                <ellipse cx="36" cy="31" rx="4" ry="8" fill="currentColor" opacity="0.8" transform="rotate(35 36 31)"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 style={styles.title}>Your Profile at a Glance</h1>

        {/* Profile Summary Card */}
        <div style={styles.card}>
          <div style={styles.row}>
            <span style={styles.label}>Skin Type</span>
            <span style={styles.value}>{profileData.skinType}</span>
          </div>
          
          <div style={styles.row}>
            <span style={styles.label}>Concerns</span>
            <span style={styles.value}>{profileData.concerns.join(', ')}</span>
          </div>
          
          <div style={styles.row}>
            <span style={styles.label}>Sensitivity</span>
            <span style={styles.value}>{profileData.sensitivity}</span>
          </div>
          
          <div style={styles.row}>
            <span style={styles.label}>Experience</span>
            <span style={styles.value}>{profileData.experience}</span>
          </div>
          
          <div style={styles.row}>
            <span style={styles.label}>Goal</span>
            <span style={styles.value}>{profileData.goal}</span>
          </div>
          
          <div style={styles.row}>
            <span style={styles.label}>Budget</span>
            <span style={styles.value}>{profileData.budget}</span>
          </div>
          
          <div style={{...styles.row, ...styles.rowLast}}>
            <span style={styles.label}>Preferences</span>
            <span style={styles.value}>{profileData.preferences.join(', ')}</span>
          </div>
        </div>

        {/* Complete Button */}
        <button 
          onClick={handleComplete} 
          style={styles.completeButton}
          onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
        >
          Complete Profile
        </button>
      </div>
    </div>
  );
}