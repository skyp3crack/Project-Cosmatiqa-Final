import React from 'react';

const ResultsDashboard = () => {
  return (
    <div 
      style={{ 
        backgroundColor: '#FFFFFF',
        minHeight: '100vh',
        padding: '0px 0px 0px 0px'
      }}
    >
      <div 
        style={{ 
          maxWidth: '400px',
          margin: '0 auto'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
          <button 
            style={{ 
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0',
              marginRight: '16px',
              color: '#1a1a1a'
            }}
          >
            ←
          </button>
          <h1 
            style={{ 
              fontSize: '18px',
              fontWeight: '600',
              color: '#1a1a1a',
              margin: 0
            }}
          >
            Results Dashboard
          </h1>
        </div>

        {/* Score Circle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div style={{ position: 'relative', width: '180px', height: '180px' }}>
            <svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>
              {/* Background circle */}
              <circle
                cx="90"
                cy="90"
                r="75"
                stroke="#E5E7EB"
                strokeWidth="16"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="90"
                cy="90"
                r="75"
                stroke="#FAD28B"
                strokeWidth="16"
                fill="none"
                strokeDasharray={`${(7.5 / 10) * 471} 471`}
                strokeLinecap="round"
              />
            </svg>
            <div 
              style={{ 
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '48px', fontWeight: '700', color: '#1a1a1a', lineHeight: '1' }}>
                7.5
                <span style={{ fontSize: '24px', fontWeight: '500', color: '#9CA3AF' }}>/10</span>
              </div>
              <div style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '4px' }}>
                Your Routine Score
              </div>
            </div>
          </div>
        </div>

        {/* Alert */}
        <div 
          style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            marginBottom: '32px'
          }}
        >
          <span style={{ color: '#FFB3A7', fontSize: '16px' }}>▲</span>
          <span style={{ fontSize: '14px', color: '#FFB3A7', fontWeight: '500' }}>
            2 high-risk conflicts detected
          </span>
        </div>

        {/* Identified Conflicts Section */}
        <h2 
          style={{ 
            fontSize: '20px',
            fontWeight: '700',
            color: '#1a1a1a',
            marginBottom: '16px'
          }}
        >
          Identified Conflicts
        </h2>

        {/* Conflict Card 1 - High Risk */}
        <div 
          style={{ 
            backgroundColor: '#FFF5F5',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '16px',
            border: '1px solid #FEE2E2'
          }}
        >
          <div 
            style={{ 
              fontSize: '10px',
              fontWeight: '700',
              color: '#FFB3A7',
              letterSpacing: '0.05em',
              marginBottom: '8px'
            }}
          >
            HIGH RISK
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a' }}>
              Retinol Serum
            </span>
            <span style={{ color: '#EF4444', fontSize: '18px', fontWeight: '700' }}>✕</span>
            <span style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a' }}>
              Vitamin C Cleanser
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.5', marginBottom: '12px', margin: '0 0 12px 0' }}>
            Reduces efficacy of Vitamin C and can cause irritation.
          </p>
          <button 
            style={{ 
              background: 'none',
              border: 'none',
              color: '#A9D1B0',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              padding: '0',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            See Details <span style={{ fontSize: '12px' }}>→</span>
          </button>
        </div>

        {/* Conflict Card 2 - Medium Risk */}
        <div 
          style={{ 
            backgroundColor: '#FFFBEB',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            border: '1px solid #FEF3C7'
          }}
        >
          <div 
            style={{ 
              fontSize: '10px',
              fontWeight: '700',
              color: '#FAD28B',
              letterSpacing: '0.05em',
              marginBottom: '8px'
            }}
          >
            MEDIUM RISK
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a' }}>
              AHA/BHA Toner
            </span>
            <span style={{ color: '#F59E0B', fontSize: '18px', fontWeight: '700' }}>⚠</span>
            <span style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a' }}>
              Benzoyl Peroxide
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.5', marginBottom: '12px', margin: '0 0 12px 0' }}>
            Can cause excessive dryness and over-exfoliation.
          </p>
          <button 
            style={{ 
              background: 'none',
              border: 'none',
              color: '#A9D1B0',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              padding: '0',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            See Details <span style={{ fontSize: '12px' }}>→</span>
          </button>
        </div>

        {/* Recommended Routine Section */}
        <h2 
          style={{ 
            fontSize: '20px',
            fontWeight: '700',
            color: '#1a1a1a',
            marginBottom: '16px'
          }}
        >
          Recommended Routine
        </h2>

        {/* Morning Routine */}
        <div 
          style={{ 
            backgroundColor: '#FFFBEB',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '20px' }}>☀️</span>
            <span style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a' }}>
              Morning Routine
            </span>
          </div>
          <div style={{ paddingLeft: '28px' }}>
            <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 6px 0' }}>
              Gentle Hydrating Cleanser
            </p>
            <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 6px 0' }}>
              Vitamin C Serum
            </p>
            <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 6px 0' }}>
              Hyaluronic Acid Moisturizer
            </p>
            <p style={{ fontSize: '14px', color: '#6B7280', margin: '0' }}>
              Broad-Spectrum SPF 50
            </p>
          </div>
        </div>

        {/* Evening Routine */}
        <div 
          style={{ 
            backgroundColor: '#F3F4F6',
            borderRadius: '12px',
            padding: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '20px' }}>🌙</span>
            <span style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a' }}>
              Evening Routine
            </span>
          </div>
          <div style={{ paddingLeft: '28px' }}>
            <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 6px 0' }}>
              Gentle Hydrating Cleanser
            </p>
            <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 6px 0' }}>
              Retinol Serum (Mon, Wed, Fri)
            </p>
            <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 6px 0' }}>
              AHA/BHA Toner (Tue, Thu)
            </p>
            <p style={{ fontSize: '14px', color: '#6B7280', margin: '0' }}>
              Niacinamide Moisturizer
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;