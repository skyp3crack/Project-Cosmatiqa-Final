import React, { useState } from 'react';
import { ChevronLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
  const navigate = useNavigate();
  const [skinType, setSkinType] = useState('Normal');
  const [selectedConcerns, setSelectedConcerns] = useState(['Acne', 'Dryness']);
  
  const concerns = [
    'Acne',
    'Aging',
    'Hyperpigmentation',
    'Dryness',
    'Redness',
    'Oiliness'
  ];

  const toggleConcern = (concern) => {
    if (selectedConcerns.includes(concern)) {
      setSelectedConcerns(selectedConcerns.filter(c => c !== concern));
    } else if (selectedConcerns.length < 3) {
      setSelectedConcerns([...selectedConcerns, concern]);
    }
  };

  const handleContinue = () => {
    const profileData = {
      skinType,
      concerns: selectedConcerns
    };
    // Save to localStorage so step 2 can access it
    localStorage.setItem('skinProfile', JSON.stringify(profileData));
    // Navigate to step 2
    navigate('/onboarding-2');
  };

  const handleBack = () => {
    // Navigate back to welcome page
    navigate('/');
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #e9d5ff 0%, #c4b5fd 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    },
    mainCard: {
      width: '100%',
      maxWidth: '260px',
      backgroundColor: 'white',
      borderRadius: '24px',
      boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)',
      border: '3px solid #c4b5fd',
      overflow: 'hidden'
    },
    header: {
      padding: '16px 16px 20px 16px',
      borderBottom: '1px solid #f3f4f6'
    },
    headerTop: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '16px'
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
      cursor: 'pointer',
      flexShrink: 0
    },
    headerTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#111827',
      flex: 1,
      textAlign: 'center'
    },
    progressBars: {
      display: 'flex',
      gap: '8px',
      marginTop: '12px'
    },
    progressBar: {
      height: '4px',
      flex: 1,
      borderRadius: '10px'
    },
    contentArea: {
      padding: '24px 20px 24px 20px'
    },
    heroContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '24px'
    },
    heroCircle: {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #d97706 0%, #ea580c 50%, #b45309 100%)',
      boxShadow: '0 8px 20px rgba(234, 88, 12, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'visible'
    },
    heroInner: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #fde68a 0%, #fef3c7 100%)',
      position: 'relative',
      zIndex: 2
    },
    heroHand: {
      width: '48px',
      height: '38px',
      background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)',
      borderRadius: '50% 50% 50% 20%',
      position: 'absolute',
      bottom: '-10px',
      left: '8px',
      transform: 'rotate(-15deg)',
      zIndex: 1
    },
    leafContainer: {
      position: 'absolute',
      top: '18px',
      right: '12px',
      zIndex: 3
    },
    title: {
      fontSize: '22px',
      fontWeight: 'bold',
      color: '#111827',
      textAlign: 'center',
      lineHeight: '1.3',
      marginBottom: '12px'
    },
    subtitle: {
      fontSize: '12px',
      color: '#6b7280',
      textAlign: 'center',
      lineHeight: '1.5',
      marginBottom: '24px'
    },
    formSection: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      fontSize: '13px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '10px'
    },
    selectWrapper: {
      position: 'relative'
    },
    select: {
      width: '100%',
      padding: '10px 12px',
      fontSize: '13px',
      border: '1px solid #d1d5db',
      borderRadius: '10px',
      backgroundColor: 'white',
      color: '#374151',
      appearance: 'none',
      cursor: 'pointer',
      outline: 'none'
    },
    dropdownIcon: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      color: '#6b7280'
    },
    concernsHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px'
    },
    concernsCount: {
      fontSize: '11px',
      color: '#9ca3af'
    },
    concernsGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px'
    },
    concernButton: {
      padding: '8px 16px',
      fontSize: '12px',
      fontWeight: '500',
      borderRadius: '20px',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'all 0.2s'
    },
    concernButtonSelected: {
      backgroundColor: '#86efac',
      color: '#065f46'
    },
    concernButtonUnselected: {
      backgroundColor: '#f9fafb',
      color: '#4b5563',
      border: '1px solid #e5e7eb'
    },
    xCircle: {
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      backgroundColor: '#10b981',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    continueButton: {
      width: '100%',
      padding: '16px',
      backgroundColor: '#86efac',
      color: '#065f46',
      fontSize: '14px',
      fontWeight: '600',
      border: 'none',
      borderRadius: '14px',
      cursor: 'pointer',
      marginTop: '24px',
      transition: 'background-color 0.2s'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainCard}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerTop}>
            <button onClick={handleBack} style={styles.backButton}>
              <ChevronLeft size={18} color="#8b5cf6" />
            </button>
            <span style={styles.headerTitle}>Create Profile</span>
            <div style={{width: '32px'}}></div>
          </div>
          
          <div style={styles.progressBars}>
            <div style={{...styles.progressBar, backgroundColor: '#86efac'}}></div>
            <div style={{...styles.progressBar, backgroundColor: '#e5e7eb'}}></div>
            <div style={{...styles.progressBar, backgroundColor: '#e5e7eb'}}></div>
          </div>
        </div>

        {/* Content */}
        <div style={styles.contentArea}>
          {/* Hero Image */}
          <div style={styles.heroContainer}>
            <div style={styles.heroCircle}>
              <div style={styles.heroHand}></div>
              <div style={styles.heroInner}></div>
              <div style={styles.leafContainer}>
                <svg width="38" height="55" viewBox="0 0 40 60" fill="none">
                  <path d="M20 5 Q15 15, 10 25 Q8 30, 7 35" stroke="#2d5016" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                  <ellipse cx="12" cy="15" rx="4" ry="8" fill="#4a7c25" transform="rotate(-25 12 15)"/>
                  <ellipse cx="11" cy="22" rx="4" ry="8" fill="#4a7c25" transform="rotate(-30 11 22)"/>
                  <ellipse cx="9" cy="29" rx="3.5" ry="7" fill="#4a7c25" transform="rotate(-35 9 29)"/>
                  <ellipse cx="28" cy="15" rx="4" ry="8" fill="#4a7c25" transform="rotate(25 28 15)"/>
                  <ellipse cx="29" cy="22" rx="4" ry="8" fill="#4a7c25" transform="rotate(30 29 22)"/>
                  <ellipse cx="31" cy="29" rx="3.5" ry="7" fill="#4a7c25" transform="rotate(35 31 29)"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 style={styles.title}>
            Find Your Perfect<br />Skincare Routine
          </h1>
          <p style={styles.subtitle}>
            We'll analyze ingredient conflicts and create a<br />personalized plan for your skin.
          </p>

          {/* Skin Type */}
          <div style={styles.formSection}>
            <label style={styles.label}>What's your skin type?</label>
            <div style={styles.selectWrapper}>
              <select value={skinType} onChange={(e) => setSkinType(e.target.value)} style={styles.select}>
                <option>Normal</option>
                <option>Dry</option>
                <option>Oily</option>
                <option>Combination</option>
                <option>Sensitive</option>
              </select>
              <svg style={styles.dropdownIcon} width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Skin Concerns */}
          <div>
            <div style={styles.concernsHeader}>
              <label style={styles.label}>Select your skin concerns</label>
              <span style={styles.concernsCount}>Select up to 3</span>
            </div>
            <div style={styles.concernsGrid}>
              {concerns.map((concern) => {
                const isSelected = selectedConcerns.includes(concern);
                return (
                  <button
                    key={concern}
                    onClick={() => toggleConcern(concern)}
                    style={{
                      ...styles.concernButton,
                      ...(isSelected ? styles.concernButtonSelected : styles.concernButtonUnselected)
                    }}
                  >
                    {concern}
                    {isSelected && (
                      <div style={styles.xCircle}>
                        <X size={10} color="white" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Continue Button */}
          <button onClick={handleContinue} style={styles.continueButton}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}