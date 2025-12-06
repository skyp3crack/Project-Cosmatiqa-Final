import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const [isHovered, setIsHovered] = React.useState(false);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/onboarding');
  };

  return (
    <div 
      style={{ 
        backgroundColor: '#FFFFFF',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 16px'
      }}
    >
      <div 
        style={{ 
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center'
        }}
      >
        {/* Logo Container */}
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
          <div 
            style={{ 
              backgroundColor: '#2D6F5C',
              borderRadius: '16px',
              width: '200px',
              height: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(45, 111, 92, 0.3)'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              {/* Leaf Icon SVG */}
              <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                <svg 
                  width="100" 
                  height="100" 
                  viewBox="0 0 120 120" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Water drop outline */}
                  <path 
                    d="M60 20C60 20 40 45 40 65C40 76.046 49.954 85 60 85C70.046 85 80 76.046 80 65C80 45 60 20 60 20Z" 
                    stroke="#C5E86C" 
                    strokeWidth="3" 
                    fill="none"
                  />
                  
                  {/* Leaf stem */}
                  <line 
                    x1="60" 
                    y1="45" 
                    x2="60" 
                    y2="70" 
                    stroke="#C5E86C" 
                    strokeWidth="2.5"
                  />
                  
                  {/* Left leaves */}
                  <path 
                    d="M60 50 Q50 48 48 55" 
                    stroke="#C5E86C" 
                    strokeWidth="2.5" 
                    fill="none"
                  />
                  <ellipse 
                    cx="48" 
                    cy="56" 
                    rx="8" 
                    ry="10" 
                    fill="#2D6F5C" 
                    stroke="#C5E86C" 
                    strokeWidth="2"
                  />
                  
                  <path 
                    d="M60 58 Q52 56 50 62" 
                    stroke="#C5E86C" 
                    strokeWidth="2.5" 
                    fill="none"
                  />
                  <ellipse 
                    cx="49" 
                    cy="63" 
                    rx="7" 
                    ry="9" 
                    fill="#2D6F5C" 
                    stroke="#C5E86C" 
                    strokeWidth="2"
                  />
                  
                  {/* Right leaves */}
                  <path 
                    d="M60 50 Q70 48 72 55" 
                    stroke="#C5E86C" 
                    strokeWidth="2.5" 
                    fill="none"
                  />
                  <ellipse 
                    cx="72" 
                    cy="56" 
                    rx="8" 
                    ry="10" 
                    fill="#2D6F5C" 
                    stroke="#C5E86C" 
                    strokeWidth="2"
                  />
                  
                  <path 
                    d="M60 58 Q68 56 70 62" 
                    stroke="#C5E86C" 
                    strokeWidth="2.5" 
                    fill="none"
                  />
                  <ellipse 
                    cx="71" 
                    cy="63" 
                    rx="7" 
                    ry="9" 
                    fill="#2D6F5C" 
                    stroke="#C5E86C" 
                    strokeWidth="2"
                  />
                </svg>
              </div>
              
              {/* Brand text */}
              <div>
                <h1 
                  style={{ 
                    color: '#FFFFFF',
                    fontSize: '24px',
                    fontWeight: '300',
                    letterSpacing: '0.3em',
                    marginBottom: '4px',
                    margin: '0 0 4px 0'
                  }}
                >
                  COSMATIQA
                </h1>
                <p 
                  style={{ 
                    color: '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: '300',
                    letterSpacing: '0.15em',
                    opacity: 0.8,
                    margin: 0
                  }}
                >
                  SKINCARE CHECKER
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Heading */}
        <h2 
          style={{ 
            color: '#1a1a1a',
            fontSize: '32px',
            fontWeight: '700',
            lineHeight: '1.2',
            marginBottom: '16px',
            margin: '0 0 16px 0'
          }}
        >
          Your Personalized Skincare Journey Starts Here
        </h2>

        {/* Subtext */}
        <p 
          style={{ 
            color: '#6B7280',
            fontSize: '16px',
            lineHeight: '1.5',
            marginBottom: '32px',
            margin: '0 0 32px 0'
          }}
        >
          Analyze ingredients, avoid conflicts, and optimize your routine for healthier skin.
        </p>

        {/* CTA Button */}
        <button 
          onClick={handleGetStarted}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ 
            backgroundColor: '#7BA788',
            color: '#FFFFFF',
            fontSize: '18px',
            fontWeight: '500',
            padding: '16px 24px',
            borderRadius: '9999px',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            transition: 'all 0.3s ease',
            transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
            opacity: isHovered ? 0.9 : 1,
            boxShadow: isHovered ? '0 8px 20px rgba(123, 167, 136, 0.3)' : 'none'
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
