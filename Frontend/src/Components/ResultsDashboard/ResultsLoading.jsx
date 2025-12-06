import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Loader2, Sun, Moon, Sunset, FileText, ArrowLeft, AlertTriangle, CheckCircle, X, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

const ResultsDashboard = () => {
  const navigate = useNavigate();
  const { analysisData } = useUser();
  const [expandedSections, setExpandedSections] = useState({});

  // Fetch full analysis results from Convex
  const results = useQuery(
    api.functions.analysis.getAnalysisResults,
    analysisData?.analysisId ? { analysisId: analysisData.analysisId } : "skip"
  );

  // Redirect if no analysis data - but only after checking localStorage as fallback
  useEffect(() => {
    // Check context first
    if (analysisData?.analysisId) {
      return; // Has analysis data, no need to redirect
    }
    
    // Check localStorage as fallback
    try {
      const stored = localStorage.getItem('analysisData');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.analysisId) {
          return; // Found in localStorage, no need to redirect
        }
      }
    } catch (e) {
      console.error('Error parsing stored analysisData:', e);
    }
    
    // Only redirect if we're sure there's no data
    // Give it a small delay to allow context to load
    const timeout = setTimeout(() => {
      if (!analysisData?.analysisId) {
        console.warn('No analysis ID found, redirecting to product input');
        navigate('/product-input');
      }
    }, 500);
    
    return () => clearTimeout(timeout);
  }, [analysisData, navigate]);

  const handleBack = () => {
    navigate('/product-input');
  };

  const handleSeeDetails = () => {
    navigate('/detailed');
  };

  // Loading state
  if (!results) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#FFFFFF'
      }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 size={48} style={{ color: '#A9D1B0', marginBottom: '16px', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: '#6B7280', fontSize: '16px' }}>Loading results...</p>
        </div>
      </div>
    );
  }

  const { analysis, conflicts, products } = results;
  const safetyScore = analysis?.overallSafetyScore || 0;
  const conflictsCount = conflicts?.length || 0;
  const recommendations = analysis?.recommendations || [];

  // Process AI recommendations: truncate and structure by keywords
  const processRecommendations = (recs) => {
    if (!recs || recs.length === 0) return { sections: [], beneficialPart: null };
    
    // Join all recommendations into one text
    let fullText = recs.join('\n\n');
    
    // Find and separate beneficial part
    const beneficialKeywords = ['BENEFICIAL INGREDIENTS', 'BENEFICIAL', '✅'];
    let beneficialPart = null;
    let mainText = fullText;
    
    for (const keyword of beneficialKeywords) {
      const beneficialIndex = fullText.indexOf(keyword);
      if (beneficialIndex !== -1) {
        mainText = fullText.substring(0, beneficialIndex).trim();
        beneficialPart = fullText.substring(beneficialIndex).trim();
        break;
      }
    }
    
    // Truncate if over 500 words
    const words = mainText.split(/\s+/);
    if (words.length > 500) {
      mainText = words.slice(0, 500).join(' ') + '...';
    }
    
    // Split by section keywords (case-insensitive matching)
    const sectionKeywords = [
      'OVERALL SAFETY & RISK ASSESSMENT',
      'KEY CONFLICTS IDENTIFIED',
      'PERSONALIZED RECOMMENDATIONS FOR',
      'COMBINATION SKIN-SPECIFIC STRATEGY',
      'MISSING INGREDIENTS',
      'FREQUENCY ADJUSTMENT',
      'MONITORING',
      'CONCLUSION'
    ];
    
    const sections = [];
    let remainingText = mainText;
    
    // Find all section markers (case-insensitive)
    const markers = [];
    const textUpper = remainingText.toUpperCase();
    
    for (const keyword of sectionKeywords) {
      const keywordUpper = keyword.toUpperCase();
      const index = textUpper.indexOf(keywordUpper);
      if (index !== -1) {
        markers.push({ keyword, index });
      }
    }
    
    // Sort markers by position
    markers.sort((a, b) => a.index - b.index);
    
    if (markers.length === 0) {
      // No sections found, return as single section
      sections.push({ title: 'Recommendations', content: mainText });
    } else {
      // Extract content before first section
      if (markers[0].index > 0) {
        const introContent = remainingText.substring(0, markers[0].index).trim();
        if (introContent) {
          sections.push({ title: 'Introduction', content: introContent });
        }
      }
      
      // Extract each section
      for (let i = 0; i < markers.length; i++) {
        const marker = markers[i];
        const nextMarker = markers[i + 1];
        const startIndex = marker.index;
        const endIndex = nextMarker ? nextMarker.index : remainingText.length;
        
        // Extract section title line (from keyword to newline or end of section)
        const sectionText = remainingText.substring(startIndex, endIndex);
        const newlineIndex = sectionText.indexOf('\n');
        const sectionTitle = newlineIndex !== -1 
          ? sectionText.substring(0, newlineIndex).trim()
          : marker.keyword;
        
        // Extract section content (after title line)
        const contentStartIndex = startIndex + (newlineIndex !== -1 ? newlineIndex + 1 : marker.keyword.length);
        const sectionContent = remainingText.substring(contentStartIndex, endIndex).trim();
        
        if (sectionContent) {
          sections.push({
            title: sectionTitle,
            content: sectionContent
          });
        }
      }
    }
    
    return { sections, beneficialPart };
  };

  const { sections: recommendationSections, beneficialPart } = processRecommendations(recommendations);

  // Helper to get severity styling
  const getSeverityStyle = (severity) => {
    const styles = {
      severe: {
        bg: '#FFF5F5',
        border: '#FEE2E2',
        label: '#FFB3A7',
        icon: X,
        iconColor: '#EF4444',
      },
      moderate: {
        bg: '#FFFBEB',
        border: '#FEF3C7',
        label: '#FAD28B',
        icon: AlertTriangle,
        iconColor: '#F59E0B',
      },
      mild: {
        bg: '#F0F9FF',
        border: '#DBEAFE',
        label: '#93C5FD',
        icon: Info,
        iconColor: '#3B82F6',
      },
    };
    return styles[severity] || styles.mild;
  };

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
          margin: '0 auto',
          paddingBottom: '80px' // Space for bottom navigation
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
          <button 
            onClick={handleBack}
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
            <ArrowLeft size={24} color="#1a1a1a" />
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
          <div style={{ position: 'relative', width: '180px', height: '180px', minWidth: '180px', minHeight: '180px' }}>
            <ResponsiveContainer width={180} height={180}>
              <RadialBarChart
                innerRadius="60%"
                outerRadius="90%"
                data={[
                  {
                    name: 'score',
                    value: safetyScore,
                    fill: safetyScore >= 7 ? '#A9D1B0' : safetyScore >= 5 ? '#FAD28B' : '#FFB3A7'
                  },
                  {
                    name: 'remaining',
                    value: 10 - safetyScore,
                    fill: '#E5E7EB'
                  }
                ]}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  dataKey="value"
                  cornerRadius={10}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div 
              style={{ 
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none'
              }}
            >
              <div style={{ fontSize: '48px', fontWeight: '700', color: '#1a1a1a', lineHeight: '1' }}>
                {safetyScore.toFixed(1)}
                <span style={{ fontSize: '24px', fontWeight: '500', color: '#9CA3AF' }}>/10</span>
              </div>
              <div style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '4px' }}>
                Your Routine Score
              </div>
            </div>
          </div>
        </div>

        {/* Alert */}
        {conflictsCount > 0 && (
          <div 
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginBottom: '32px'
            }}
          >
            <AlertTriangle size={16} style={{ color: '#FFB3A7' }} />
            <span style={{ fontSize: '14px', color: '#FFB3A7', fontWeight: '500' }}>
              {conflictsCount} conflict{conflictsCount !== 1 ? 's' : ''} detected
            </span>
          </div>
        )}

        {conflictsCount === 0 && (
          <div 
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginBottom: '32px'
            }}
          >
            <CheckCircle size={16} style={{ color: '#A9D1B0' }} />
            <span style={{ fontSize: '14px', color: '#A9D1B0', fontWeight: '500' }}>
              No conflicts detected! Your routine looks great.
            </span>
          </div>
        )}

        {/* Identified Conflicts Section */}
        {conflictsCount > 0 && (
          <>
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

            {conflicts.map((conflict, index) => {
              const style = getSeverityStyle(conflict.severity);
              return (
                <div 
                  key={index}
                  style={{ 
                    backgroundColor: style.bg,
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '16px',
                    border: `1px solid ${style.border}`
                  }}
                >
                  <div 
                    style={{ 
                      fontSize: '10px',
                      fontWeight: '700',
                      color: style.label,
                      letterSpacing: '0.05em',
                      marginBottom: '8px',
                      textAlign: 'center'
                    }}
                  >
                    {conflict.severity.toUpperCase()} RISK
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a' }}>
                      {conflict.ingredientA?.inciName || 'Unknown'}
                    </span>
                    {React.createElement(style.icon, { size: 18, style: { color: style.iconColor } })}
                    <span style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a' }}>
                      {conflict.ingredientB?.inciName || 'Unknown'}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.5', marginBottom: '12px', margin: '0 0 12px 0', textAlign: 'center' }}>
                    {conflict.recommendation || 'No specific recommendation available.'}
                  </p>
                  {conflict.conflictType && (
                    <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '12px', margin: '0 0 12px 0', textAlign: 'center' }}>
                      Type: {conflict.conflictType}
                    </p>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button 
                      onClick={handleSeeDetails}
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
                </div>
              );
            })}
          </>
        )}

        {/* AI Recommendations Section */}
        {recommendations.length > 0 && (
          <>
            <h2 
              style={{ 
                fontSize: '20px',
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: '16px',
                marginTop: '32px'
              }}
            >
              AI Recommendations
            </h2>
            
            <div 
              style={{ 
                backgroundColor: '#F0F9FF',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px',
                border: '1px solid #DBEAFE'
              }}
            >
              {/* Structured Sections */}
              {recommendationSections.map((section, idx) => {
                const sectionId = `section-${idx}`;
                const isExpanded = expandedSections[sectionId] || false;
                const shouldTruncate = section.content.length > 50;
                const displayContent = shouldTruncate && !isExpanded 
                  ? section.content.substring(0, 50) + '...'
                  : section.content;
                
                return (
                  <div 
                    key={idx}
                    style={{ 
                      marginBottom: idx < recommendationSections.length - 1 ? '20px' : '0',
                      paddingBottom: idx < recommendationSections.length - 1 ? '20px' : '0',
                      borderBottom: idx < recommendationSections.length - 1 ? '1px solid #DBEAFE' : 'none'
                    }}
                  >
                    <h3 style={{ 
                      fontSize: '15px',
                      fontWeight: '700',
                      color: '#1a1a1a',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {section.title}
                    </h3>
                    <div style={{ 
                      fontSize: '13px', 
                      color: '#6B7280', 
                      lineHeight: '1.6',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {displayContent}
                    </div>
                    {shouldTruncate && (
                      <button
                        onClick={() => setExpandedSections(prev => ({
                          ...prev,
                          [sectionId]: !prev[sectionId]
                        }))}
                        style={{
                          marginTop: '8px',
                          background: 'none',
                          border: 'none',
                          color: '#3B82F6',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '0'
                        }}
                      >
                        {isExpanded ? (
                          <>
                            Show less
                            <ChevronUp size={14} />
                          </>
                        ) : (
                          <>
                            Show more
                            <ChevronDown size={14} />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
              
              {/* Beneficial Ingredients Section (if exists) */}
              {beneficialPart && (
                <div style={{ 
                  marginTop: '20px',
                  paddingTop: '20px',
                  borderTop: '1px solid #DBEAFE'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{ 
                      marginTop: '2px',
                      backgroundColor: '#A9D1B0',
                      borderRadius: '4px',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <CheckCircle size={16} style={{ color: '#FFFFFF' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ 
                        fontSize: '14px', 
                        color: '#1a1a1a', 
                        lineHeight: '1.6', 
                        margin: 0,
                        whiteSpace: 'pre-wrap'
                      }}>
                        {beneficialPart.replace(/^✅\s*/, '').replace(/✅/g, '')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Your Products Section */}
        <h2 
          style={{ 
            fontSize: '20px',
            fontWeight: '700',
            color: '#1a1a1a',
            marginBottom: '16px',
            marginTop: recommendations.length > 0 ? '0' : '32px'
          }}
        >
          Your Products
        </h2>

        {/* Group products by timing */}
        {['AM', 'PM', 'both'].map(timing => {
          const timingProducts = products?.filter(p => p.usageTime === timing) || [];
          if (timingProducts.length === 0) return null;

          return (
            <div 
              key={timing}
              style={{ 
                backgroundColor: timing === 'AM' ? '#FFFBEB' : timing === 'PM' ? '#F3F4F6' : '#F0F9FF',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                {timing === 'AM' ? (
                  <Sun size={20} style={{ color: '#A9D1B0' }} />
                ) : timing === 'PM' ? (
                  <Moon size={20} style={{ color: '#A9D1B0' }} />
                ) : (
                  <Sunset size={20} style={{ color: '#A9D1B0' }} />
                )}
                <span style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a' }}>
                  {timing === 'both' ? 'AM & PM' : timing.toUpperCase()} Routine
                </span>
              </div>
              <div style={{ paddingLeft: '28px' }}>
                {timingProducts.map((product, idx) => (
                  <p key={idx} style={{ fontSize: '14px', color: '#6B7280', margin: idx < timingProducts.length - 1 ? '0 0 6px 0' : '0' }}>
                    {product.productName}
                  </p>
                ))}
              </div>
            </div>
          );
        })}

        {/* Continue Button - Always visible at bottom */}
        <div style={{ 
          marginTop: '32px', 
          marginBottom: '32px',
          padding: '0 0 20px 0',
          position: 'sticky',
          bottom: '0',
          backgroundColor: '#FFFFFF',
          zIndex: 10
        }}>
          <button
            onClick={() => navigate('/profile')}
            style={{
              width: '100%',
              backgroundColor: '#A9D1B0',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#8FC19F'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#A9D1B0'}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
