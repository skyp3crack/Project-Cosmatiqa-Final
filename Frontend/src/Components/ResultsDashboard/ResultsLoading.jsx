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
  const [showScoreTooltip, setShowScoreTooltip] = useState(false);

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

  // Close tooltip when clicking outside (for mobile)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showScoreTooltip && !event.target.closest('[data-score-tooltip]')) {
        setShowScoreTooltip(false);
      }
    };
    
    if (showScoreTooltip) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showScoreTooltip]);

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
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          <Loader2 size={48} style={{ color: '#A9D1B0', marginBottom: '16px', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: '#6B7280', fontSize: '16px', margin: 0 }}>Loading results...</p>
        </div>
      </div>
    );
  }

  const { analysis, conflicts, products } = results;
  const safetyScore = analysis?.overallSafetyScore || 0;
  const conflictsCount = conflicts?.length || 0;
  
  // Get structured AI data instead of parsing text
  const aiAnalysis = analysis?.aiAnalysis;
  const aiSummary = aiAnalysis?.summary || '';
  const ingredientWarnings = aiAnalysis?.ingredientWarnings || [];
  const ingredientBenefits = aiAnalysis?.ingredientBenefits || [];
  const morningRoutine = aiAnalysis?.morningRoutine || [];
  const eveningRoutine = aiAnalysis?.eveningRoutine || [];

  // Parse summary into sections (only for the summary text)
  const parseSummarySections = (summaryText) => {
    if (!summaryText) return [];
    
    // Split by common section markers (case-insensitive)
    const sectionPatterns = [
      /(OVERALL SAFETY[^\n]*)/i,
      /(KEY CONFLICTS IDENTIFIED[^\n]*)/i,
      /(CRITICAL RECOMMENDATIONS[^\n]*)/i,
      /(PERSONALIZED RECOMMENDATIONS[^\n]*)/i,
      /(INGREDIENT-LEVEL ADJUSTMENTS[^\n]*)/i,
      /(MISSING INGREDIENTS[^\n]*)/i,
      /(FREQUENCY ADJUSTMENT[^\n]*)/i,
      /(MONITORING[^\n]*)/i,
      /(CONCLUSION[^\n]*)/i,
    ];
    
    const sections = [];
    let remainingText = summaryText;
    
    // Find all section markers
    const markers = [];
    sectionPatterns.forEach((pattern) => {
      const match = remainingText.match(pattern);
      if (match) {
        markers.push({
          index: match.index,
          title: match[1].trim(),
        });
      }
    });
    
    // Sort markers by position
    markers.sort((a, b) => a.index - b.index);
    
    // Extract sections
    markers.forEach((marker, idx) => {
      const nextMarker = markers[idx + 1];
      const startIndex = marker.index;
      const endIndex = nextMarker ? nextMarker.index : summaryText.length;
      
      // Extract title (first line)
      const sectionText = summaryText.substring(startIndex, endIndex);
      const titleMatch = sectionText.match(/^([^\n]+)/);
      const title = titleMatch ? titleMatch[1].trim() : marker.title;
      
      // Extract content (after title)
      const contentStart = startIndex + title.length;
      const content = summaryText.substring(contentStart, endIndex).trim();
      
      if (content) {
        sections.push({ title, content });
      }
    });
    
    // If no sections found, return summary as single section
    if (sections.length === 0 && summaryText.trim()) {
      sections.push({ 
        title: 'Analysis Summary', 
        content: summaryText.trim() 
      });
    }
    
    return sections;
  };

  const summarySections = parseSummarySections(aiSummary);

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
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '32px',
          paddingTop: '8px'
        }}>
          <button 
            onClick={handleBack}
            style={{ 
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '8px',
              marginRight: '12px',
              color: '#1a1a1a',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <ArrowLeft size={22} color="#1a1a1a" />
          </button>
          <h1 
            style={{ 
              fontSize: '20px',
              fontWeight: '700',
              color: '#1a1a1a',
              margin: 0,
              letterSpacing: '-0.5px'
            }}
          >
            Results Dashboard
          </h1>
        </div>

        {/* Score Card */}
        <div 
          style={{ 
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '32px 24px',
            marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            border: '1px solid #F3F4F6'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <div style={{ position: 'relative', width: '200px', height: '200px', minWidth: '200px', minHeight: '200px' }}>
              {/* SVG Circle Progress Ring */}
              <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
                {/* Background circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="85"
                  fill="none"
                  stroke="#F3F4F6"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Progress circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="85"
                  fill="none"
                  stroke={safetyScore >= 7 ? '#A9D1B0' : safetyScore >= 5 ? '#FAD28B' : '#FFB3A7'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 85}`}
                  strokeDashoffset={`${2 * Math.PI * 85 * (1 - safetyScore / 10)}`}
                  style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                />
              </svg>
              <div 
                data-score-tooltip
                style={{ 
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  pointerEvents: 'auto',
                  cursor: 'help',
                  touchAction: 'manipulation'
                }}
                onMouseEnter={() => setShowScoreTooltip(true)}
                onMouseLeave={() => setShowScoreTooltip(false)}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  setShowScoreTooltip(!showScoreTooltip);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowScoreTooltip(!showScoreTooltip);
                }}
              >
                <div style={{ 
                  fontSize: '56px', 
                  fontWeight: '700', 
                  color: safetyScore >= 7 ? '#A9D1B0' : safetyScore >= 5 ? '#FAD28B' : '#FFB3A7',
                  lineHeight: '1'
                }}>
                  {safetyScore.toFixed(1)}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#6B7280', 
                  marginTop: '8px',
                  fontWeight: '500',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}>
                  Routine Score
                </div>
                
                {/* Tooltip */}
                {showScoreTooltip && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-80px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: '#1a1a1a',
                      color: '#FFFFFF',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      whiteSpace: 'nowrap',
                      zIndex: 1000,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      pointerEvents: 'none'
                    }}
                  >
                    Score: {safetyScore.toFixed(1)} / 10
                    <div style={{
                      position: 'absolute',
                      bottom: '-6px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 0,
                      height: 0,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: '6px solid #1a1a1a'
                    }}></div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Score Status Badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '20px',
              backgroundColor: safetyScore >= 7 
                ? '#F0FDF4' 
                : safetyScore >= 5 
                ? '#FFFBEB' 
                : '#FFF5F3',
              border: `1px solid ${safetyScore >= 7 ? '#BBF7D0' : safetyScore >= 5 ? '#FDE68A' : '#FECACA'}`
            }}>
              {safetyScore >= 7 ? (
                <>
                  <CheckCircle size={16} style={{ color: '#16A34A' }} />
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#16A34A' }}>Safe Routine</span>
                </>
              ) : safetyScore >= 5 ? (
                <>
                  <AlertTriangle size={16} style={{ color: '#D97706' }} />
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#D97706' }}>Caution Needed</span>
                </>
              ) : (
                <>
                  <AlertTriangle size={16} style={{ color: '#DC2626' }} />
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#DC2626' }}>High Risk</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Conflicts Alert Card */}
        {conflictsCount > 0 && (
          <div 
            style={{ 
              backgroundColor: '#FFF5F3',
              borderRadius: '16px',
              padding: '16px 20px',
              marginBottom: '32px',
              border: '1px solid #FECACA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 2px 4px rgba(255, 107, 90, 0.1)'
            }}
          >
            <div style={{
              backgroundColor: '#FF6B5A',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <AlertTriangle size={18} style={{ color: '#FFFFFF' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a', marginBottom: '2px' }}>
                {conflictsCount} Conflict{conflictsCount !== 1 ? 's' : ''} Detected
              </div>
              <div style={{ fontSize: '12px', color: '#6B7280' }}>
                Review recommendations below
              </div>
            </div>
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

        {/* AI Summary Sections */}
        {summarySections.length > 0 && (
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
              Analysis Summary
            </h2>
            
            {summarySections.map((section, idx) => {
              const sectionId = `summary-${idx}`;
              const isExpanded = expandedSections[sectionId] || false;
              const shouldTruncate = section.content.length > 300;
              const displayContent = shouldTruncate && !isExpanded 
                ? section.content.substring(0, 300) + '...'
                : section.content;
              
              return (
                <div 
                  key={idx}
                  style={{ 
                    backgroundColor: '#F0F9FF',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '16px',
                    border: '1px solid #DBEAFE'
                  }}
                >
                  <h3 style={{ 
                    fontSize: '15px',
                    fontWeight: '700',
                    color: '#1a1a1a',
                    marginBottom: '12px',
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
                        marginTop: '12px',
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
                        <>Show less <ChevronUp size={14} /></>
                      ) : (
                        <>Show more <ChevronDown size={14} /></>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* Ingredient Warnings - Structured */}
        {ingredientWarnings.length > 0 && (
          <>
            <h2 
              style={{ 
                fontSize: '20px',
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: '16px',
                marginTop: summarySections.length > 0 ? '32px' : '32px'
              }}
            >
              ⚠️ Ingredient Warnings
            </h2>
            
            {ingredientWarnings.map((warning, idx) => {
              const severityStyle = getSeverityStyle(warning.severity?.toLowerCase() || 'mild');
              return (
                <div 
                  key={idx}
                  style={{ 
                    backgroundColor: severityStyle.bg,
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '12px',
                    border: `1px solid ${severityStyle.border}`
                  }}
                >
                  <div style={{ 
                    fontSize: '10px',
                    fontWeight: '700',
                    color: severityStyle.label,
                    letterSpacing: '0.05em',
                    marginBottom: '8px'
                  }}>
                    {warning.severity?.toUpperCase() || 'WARNING'}
                  </div>
                  <div style={{ 
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    marginBottom: '8px'
                  }}>
                    {warning.ingredient} {warning.product && `(in ${warning.product})`}
                  </div>
                  <p style={{ 
                    fontSize: '13px',
                    color: '#6B7280',
                    lineHeight: '1.5',
                    marginBottom: '8px',
                    margin: '0 0 8px 0'
                  }}>
                    {warning.concern}
                  </p>
                  {warning.recommendation && (
                    <p style={{ 
                      fontSize: '13px',
                      color: '#1a1a1a',
                      fontWeight: '500',
                      margin: '0',
                      lineHeight: '1.5'
                    }}>
                      💡 {warning.recommendation}
                    </p>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* Ingredient Benefits - Structured */}
        {ingredientBenefits.length > 0 && (
          <>
            <h2 
              style={{ 
                fontSize: '20px',
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: '16px',
                marginTop: ingredientWarnings.length > 0 || summarySections.length > 0 ? '32px' : '32px'
              }}
            >
              ✅ Beneficial Ingredients
            </h2>
            
            <div style={{ 
              backgroundColor: '#F0FDF4',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              border: '1px solid #BBF7D0'
            }}>
              {ingredientBenefits.map((benefit, idx) => (
                <div 
                  key={idx}
                  style={{ 
                    marginBottom: idx < ingredientBenefits.length - 1 ? '16px' : '0',
                    paddingBottom: idx < ingredientBenefits.length - 1 ? '16px' : '0',
                    borderBottom: idx < ingredientBenefits.length - 1 ? '1px solid #BBF7D0' : 'none'
                  }}
                >
                  <div style={{ 
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    marginBottom: '4px'
                  }}>
                    {benefit.ingredient} {benefit.product && `(in ${benefit.product})`}
                  </div>
                  <p style={{ 
                    fontSize: '13px',
                    color: '#6B7280',
                    lineHeight: '1.5',
                    margin: '0'
                  }}>
                    {benefit.benefit}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Routine Recommendations - Structured */}
        {(morningRoutine.length > 0 || eveningRoutine.length > 0) && (
          <>
            <h2 
              style={{ 
                fontSize: '20px',
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: '16px',
                marginTop: ingredientBenefits.length > 0 || ingredientWarnings.length > 0 || summarySections.length > 0 ? '32px' : '32px'
              }}
            >
              📅 Recommended Routine
            </h2>
            
            {morningRoutine.length > 0 && (
              <div style={{ 
                backgroundColor: '#FFFBEB',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '12px',
                border: '1px solid #FEF3C7'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Sun size={20} style={{ color: '#F59E0B' }} />
                  <span style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a' }}>
                    Morning Routine
                  </span>
                </div>
                <div style={{ paddingLeft: '28px' }}>
                  {morningRoutine.map((product, idx) => (
                    <p key={idx} style={{ fontSize: '14px', color: '#6B7280', margin: idx < morningRoutine.length - 1 ? '0 0 6px 0' : '0' }}>
                      {product}
                    </p>
                  ))}
                </div>
              </div>
            )}
            
            {eveningRoutine.length > 0 && (
              <div style={{ 
                backgroundColor: '#F3F4F6',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px',
                border: '1px solid #E5E7EB'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Moon size={20} style={{ color: '#6B7280' }} />
                  <span style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a' }}>
                    Evening Routine
                  </span>
                </div>
                <div style={{ paddingLeft: '28px' }}>
                  {eveningRoutine.map((product, idx) => (
                    <p key={idx} style={{ fontSize: '14px', color: '#6B7280', margin: idx < eveningRoutine.length - 1 ? '0 0 6px 0' : '0' }}>
                      {product}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Your Products Section */}
        <h2 
          style={{ 
            fontSize: '20px',
            fontWeight: '700',
            color: '#1a1a1a',
            marginBottom: '16px',
            marginTop: (summarySections.length > 0 || ingredientWarnings.length > 0 || ingredientBenefits.length > 0 || morningRoutine.length > 0 || eveningRoutine.length > 0) ? '32px' : '0'
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
