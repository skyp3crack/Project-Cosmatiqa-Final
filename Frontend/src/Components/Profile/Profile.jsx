import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { 
  ArrowLeft, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Zap, 
  Clock, 
  Sparkles,
  Sun,
  Moon,
  CheckCircle2,
  AlertCircle,
  ClipboardList,
  AlertCircle as AlertCircleIcon,
  Bolt,
  X,
  Lightbulb
} from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { userProfile: contextProfile, analysisData } = useUser();
  
  // Get userId from context or use a placeholder (will be replaced with Clerk)
  // Try to get from context first, then from localStorage as fallback
  const getUserId = () => {
    if (contextProfile?.userId) return contextProfile.userId;
    // Try to get from localStorage (where onboarding might have stored it)
    const stored = localStorage.getItem('userProfile');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.userId;
      } catch (e) {
        return null;
      }
    }
    return null;
  };
  
  const userId = getUserId();
  
  // Fetch user profile from Convex
  const profile = useQuery(
    api.functions.users.getUserProfile,
    userId ? { userId } : "skip"
  );
  
  // Fetch latest analysis results
  const latestAnalysis = useQuery(
    api.functions.analysis.getAnalysisResults,
    analysisData?.analysisId ? { analysisId: analysisData.analysisId } : "skip"
  );
  
  const [activeTab, setActiveTab] = useState('summary'); // 'summary', 'warnings', 'benefits', 'conflicts', 'routine'
  
  // Use context profile if Convex profile not available
  // Also check localStorage as fallback
  const getDisplayProfile = () => {
    if (profile) return profile;
    if (contextProfile) return contextProfile;
    
    // Try localStorage as last resort
    try {
      const stored = localStorage.getItem('userProfile');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed;
      }
    } catch (e) {
      console.error('Error parsing stored profile:', e);
    }
    
    return null;
  };
  
  const displayProfile = getDisplayProfile();
  
  // Get recommendations from latest analysis
  const recommendations = latestAnalysis?.analysis?.recommendations || [];
  // Get detailed conflicts from latest analysis
  const detailedConflicts = latestAnalysis?.conflicts || [];
  // Get ingredient benefits from latest analysis (for top 3 ingredients)
  // Parse from analysisData if it's a string, or use directly if it's an object
  let ingredientBenefits = [];
  if (latestAnalysis?.analysis?.analysisData) {
    try {
      const analysisData = typeof latestAnalysis.analysis.analysisData === 'string' 
        ? JSON.parse(latestAnalysis.analysis.analysisData) 
        : latestAnalysis.analysis.analysisData;
      // ingredientBenefits is nested inside aiAnalysis
      ingredientBenefits = analysisData?.aiAnalysis?.ingredientBenefits || [];
    } catch (e) {
      console.error('Error parsing analysisData:', e);
    }
  }
  
  // Categorize recommendations
  const categorizeRecommendations = () => {
    if (recommendations.length === 0) {
      return {
        summary: [],
        warnings: [],
        benefits: [],
        conflicts: [],
        routine: []
      };
    }
    
    const categorized = {
      summary: [],
      warnings: [],
      benefits: [],
      conflicts: [],
      routine: []
    };
    
    recommendations.forEach((rec) => {
      const recLower = rec.toLowerCase();
      
      // Check for warnings
      if (rec.includes('⚠️') || rec.includes('INGREDIENT WARNINGS') || recLower.includes('warning')) {
        // Extract individual warnings
        if (rec.includes('-')) {
          const lines = rec.split('\n');
          lines.forEach(line => {
            if (line.trim().startsWith('-') && line.includes(':')) {
              categorized.warnings.push(line.trim().substring(1).trim());
            }
          });
        } else {
          categorized.warnings.push(rec);
        }
      }
      // Check for benefits
      else if (rec.includes('✅') || rec.includes('BENEFICIAL INGREDIENTS') || recLower.includes('beneficial')) {
        if (rec.includes('-')) {
          const lines = rec.split('\n');
          lines.forEach(line => {
            if (line.trim().startsWith('-') && line.includes(':')) {
              categorized.benefits.push(line.trim().substring(1).trim());
            }
          });
        } else {
          categorized.benefits.push(rec);
        }
      }
      // Check for routine suggestions
      else if (recLower.includes('routine:') || recLower.includes('morning routine') || recLower.includes('evening routine')) {
        categorized.routine.push(rec);
      }
      // Check for conflicts (but we'll use detailed conflicts instead)
      else if (recLower.includes('conflict') || (recLower.includes('found') && recLower.includes('conflict'))) {
        // Don't add to conflicts array - we'll use detailedConflicts instead
        categorized.summary.push(rec);
      }
      // Everything else goes to summary
      else {
        categorized.summary.push(rec);
      }
    });
    
    return categorized;
  };
  
  const categorizedRecs = categorizeRecommendations();
  
  // Update conflicts count to use detailed conflicts
  categorizedRecs.conflicts = detailedConflicts; // This will be used for display
  
  // Get active tab content
  const getActiveTabContent = () => {
    switch (activeTab) {
      case 'warnings':
        return categorizedRecs.warnings;
      case 'benefits':
        return categorizedRecs.benefits;
      case 'conflicts':
        return detailedConflicts; // Return detailed conflict objects
      case 'routine':
        return categorizedRecs.routine;
      default:
        return categorizedRecs.summary;
    }
  };
  
  const activeContent = getActiveTabContent();
  const hasContent = activeTab === 'conflicts' 
    ? detailedConflicts.length > 0 
    : activeContent.length > 0;
  
  // Tab configuration
  const tabs = [
    { id: 'summary', label: 'Summary', icon: ClipboardList, count: categorizedRecs.summary.length },
    { id: 'warnings', label: 'Warnings', icon: AlertTriangle, count: categorizedRecs.warnings.length },
    { id: 'benefits', label: 'Benefits', icon: CheckCircle, count: categorizedRecs.benefits.length },
    { id: 'conflicts', label: 'Conflicts', icon: Bolt, count: detailedConflicts.length },
    { id: 'routine', label: 'Routine', icon: Clock, count: categorizedRecs.routine.length },
  ].filter(tab => tab.count > 0); // Only show tabs with content
  
  useEffect(() => {
    // Set first available tab as active if current tab has no content
    try {
      const currentContent = getActiveTabContent();
      const availableTabs = tabs;
      if (currentContent.length === 0 && availableTabs.length > 0) {
        setActiveTab(availableTabs[0].id);
      }
    } catch (error) {
      console.error('Error in useEffect:', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recommendations]);
  
  const handleBack = () => {
    navigate('/results');
  };
  
  // Early return if no profile data at all - but only after queries have resolved
  if (profile === undefined || latestAnalysis === undefined) {
    // Still loading, show loading state
    return (
      <div style={{ 
        backgroundColor: '#F8F5F1',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', color: '#6B7280', marginBottom: '8px' }}>Loading profile...</div>
        </div>
      </div>
    );
  }

  // Only show "No Profile Found" if we're sure there's no data (not just loading)
  // Check after queries have resolved (not undefined)
  if (!displayProfile && profile === null && !contextProfile) {
    return (
      <div style={{ 
        backgroundColor: '#F8F5F1',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <h2 style={{ fontSize: '18px', color: '#1a1a1a', marginBottom: '12px' }}>No Profile Found</h2>
          <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '20px' }}>
            Please complete the onboarding process first.
          </p>
          <button
            onClick={() => navigate('/onboarding')}
            style={{
              backgroundColor: '#A9D1B0',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Go to Onboarding
          </button>
        </div>
      </div>
    );
  }
  
  const getSkinTypeDisplay = (skinType) => {
    const types = {
      oily: 'Oily',
      dry: 'Dry',
      combination: 'Combination',
      normal: 'Normal',
      sensitive: 'Sensitive'
    };
    return types[skinType] || skinType;
  };
  
  // Format content for display (only for non-conflict tabs)
  const formatContent = (content) => {
    if (activeTab === 'conflicts') {
      // Conflicts are already objects, don't format
      return content;
    }
    
    if (Array.isArray(content)) {
      return content.map((item, idx) => {
        // Check if it's a routine suggestion
        if (typeof item === 'string') {
          const isMorningRoutine = item.toLowerCase().includes('morning');
          const isEveningRoutine = item.toLowerCase().includes('evening');
          
          if (isMorningRoutine || isEveningRoutine) {
            // Return object with icon and text for rendering
            return {
              type: 'routine',
              isMorning: isMorningRoutine,
              text: item.replace(/^(Morning|Evening) routine:?\s*/i, '')
            };
          }
        }
        
        return item;
      });
    }
    return content;
  };
  
  const formattedContent = formatContent(activeContent);
  
  // Add loading state
  if (profile === undefined || latestAnalysis === undefined) {
    return (
      <div style={{ 
        backgroundColor: '#FFFFFF',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', color: '#6B7280', marginBottom: '8px' }}>Loading profile...</div>
        </div>
      </div>
    );
  }
  
  // Helper to get severity styling
  const getSeverityStyle = (severity) => {
    const severityLower = (severity || '').toLowerCase();
    if (severityLower === 'high' || severityLower === 'severe') {
      return {
        bg: '#FFF5F3', // Light version of Soft Coral/Peach
        border: '#FFB3A7', // Soft Coral/Peach warning
        label: '#FF6B5A', // Darker coral
        icon: Zap,
        labelText: 'HIGH RISK'
      };
    } else if (severityLower === 'medium' || severityLower === 'moderate') {
      return {
        bg: '#FFFBF0', // Light version of yellow
        border: '#FAD28B', // Yellow for caution
        label: '#E6A84A', // Darker yellow
        icon: AlertTriangle,
        labelText: 'MEDIUM RISK'
      };
    } else {
      return {
        bg: '#F0F9FF',
        border: '#DBEAFE',
        label: '#3B82F6',
        icon: AlertCircle,
        labelText: 'LOW RISK'
      };
    }
  };
  
  return (
    <div 
      style={{ 
        backgroundColor: '#F8F5F1', // Light Cream background
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
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px', paddingTop: '16px' }}>
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
            My Profile
          </h1>
        </div>

        {/* User Information Section */}
        <div 
          style={{ 
            backgroundColor: '#FFFFFF', // Soft White card background
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}
        >
          <h2 
            style={{ 
              fontSize: '18px',
              fontWeight: '700',
              color: '#1a1a1a',
              marginBottom: '20px'
            }}
          >
            Profile Information
          </h2>
          
          {/* Skin Type */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '4px', fontWeight: '600' }}>
              SKIN TYPE
            </div>
            <div style={{ fontSize: '16px', color: '#1a1a1a', fontWeight: '500' }}>
              {displayProfile?.skinType ? getSkinTypeDisplay(displayProfile.skinType) : 'Not set'}
            </div>
          </div>
          
          {/* Concerns */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '8px', fontWeight: '600' }}>
              CONCERNS
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
              {displayProfile?.goals && displayProfile.goals.length > 0 ? (
                displayProfile.goals.map((goal, idx) => (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: '#A9D1B0', // Sage Green accent
                      color: '#FFFFFF',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '500'
                    }}
                  >
                    {goal}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: '14px', color: '#9CA3AF' }}>No concerns specified</span>
              )}
            </div>
          </div>
          
          {/* Preferences - Top 3 Best Ingredients */}
          <div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '8px', fontWeight: '600' }}>
              PREFERENCES
            </div>
            <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.6', marginBottom: '8px' }}>
              Top 3 ingredients best for your {displayProfile?.skinType ? getSkinTypeDisplay(displayProfile.skinType).toLowerCase() : 'skin type'}:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {ingredientBenefits.length > 0 ? (
                ingredientBenefits.slice(0, 3).map((benefit, idx) => {
                  // Handle different possible structures: {ingredient, reason} or {ingredient, benefit}
                  const ingredientName = benefit.ingredient || `Ingredient ${idx + 1}`;
                  const benefitText = benefit.reason || benefit.benefit || '';
                  
                  return (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: '#F8F5F1', // Light Cream background
                        borderLeft: '3px solid #A9D1B0', // Sage Green accent
                        padding: '10px 12px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px'
                      }}
                    >
                      <Sparkles size={14} style={{ color: '#A9D1B0', marginTop: '2px' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>
                          {ingredientName}
                        </div>
                        {benefitText && (
                          <div style={{ fontSize: '12px', color: '#6B7280', lineHeight: '1.5' }}>
                            {benefitText}
                          </div>
                        )}
                        {benefit.product && (
                          <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px', fontStyle: 'italic' }}>
                            Found in: {benefit.product}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{
                  backgroundColor: '#F8F5F1',
                  borderLeft: '3px solid #A9D1B0',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#6B7280',
                  fontStyle: 'italic'
                }}>
                  Complete an analysis to see personalized ingredient recommendations
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Latest Recommendations Section */}
        {recommendations.length > 0 && (
          <div 
            style={{ 
              backgroundColor: '#FFFFFF', // Soft White card background
              borderRadius: '12px',
              padding: '0',
              border: '1px solid #E5E7EB',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div style={{ padding: '20px', borderBottom: '1px solid #E5E7EB' }}>
              <h2 
                style={{ 
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  marginBottom: '0'
                }}
              >
                Latest Recommendations
              </h2>
            </div>
            
            {/* Navigation Tabs */}
            {tabs.length > 1 && (
              <div 
                style={{ 
                  display: 'flex',
                  overflowX: 'auto',
                  borderBottom: '1px solid #E5E7EB',
                  backgroundColor: '#F8F5F1', // Light Cream background
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      flex: '1',
                      minWidth: '80px',
                      padding: '12px 8px',
                      background: 'none',
                      border: 'none',
                      borderBottom: activeTab === tab.id ? '2px solid #A9D1B0' : '2px solid transparent', // Sage Green accent
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.2s',
                      backgroundColor: activeTab === tab.id ? '#FFFFFF' : 'transparent'
                    }}
                  >
                    {React.createElement(tab.icon, { size: 18, style: { color: activeTab === tab.id ? '#A9D1B0' : '#6B7280' } })}
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: activeTab === tab.id ? '600' : '500',
                      color: activeTab === tab.id ? '#A9D1B0' : '#6B7280' // Sage Green for active tab
                    }}>
                      {tab.label}
                    </span>
                    {tab.count > 0 && (
                      <span style={{
                        fontSize: '10px',
                        backgroundColor: activeTab === tab.id ? '#A9D1B0' : '#9CA3AF', // Sage Green for active badge
                        color: '#FFFFFF',
                        borderRadius: '10px',
                        padding: '2px 6px',
                        minWidth: '18px',
                        textAlign: 'center'
                      }}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
            
            {/* Content Area */}
            <div style={{ padding: '20px', minHeight: '100px' }}>
              {hasContent ? (
                <div>
                  {activeTab === 'conflicts' ? (
                    // Detailed conflict cards
                    detailedConflicts.map((conflict, idx) => {
                      const style = getSeverityStyle(conflict.severity);
                      return (
                        <div
                          key={idx}
                          style={{
                            marginBottom: idx < detailedConflicts.length - 1 ? '20px' : '0',
                            paddingBottom: idx < detailedConflicts.length - 1 ? '20px' : '0',
                            borderBottom: idx < detailedConflicts.length - 1 ? '1px solid #E5E7EB' : 'none'
                          }}
                        >
                          <div style={{
                            backgroundColor: style.bg,
                            borderRadius: '12px',
                            padding: '16px',
                            border: `1px solid ${style.border}`
                          }}>
                            {/* Severity Badge */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              marginBottom: '12px'
                            }}>
                              {React.createElement(style.icon, { size: 16, style: { color: style.label } })}
                              <span style={{
                                fontSize: '10px',
                                fontWeight: '700',
                                color: style.label,
                                letterSpacing: '0.05em'
                              }}>
                                {style.labelText}
                              </span>
                            </div>
                            
                            {/* Conflict Ingredients */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              marginBottom: '12px',
                              flexWrap: 'wrap'
                            }}>
                              <span style={{
                                fontSize: '15px',
                                fontWeight: '600',
                                color: '#1a1a1a'
                              }}>
                                {conflict.ingredientA?.inciName || 'Unknown Ingredient'}
                              </span>
                              {React.createElement(X, { size: 18, style: { color: style.label } })}
                              <span style={{
                                fontSize: '15px',
                                fontWeight: '600',
                                color: '#1a1a1a'
                              }}>
                                {conflict.ingredientB?.inciName || 'Unknown Ingredient'}
                              </span>
                            </div>
                            
                            {/* Products Involved */}
                            {(conflict.productA || conflict.productB) && (
                              <div style={{
                                fontSize: '12px',
                                color: '#6B7280',
                                marginBottom: '12px',
                                paddingLeft: '4px'
                              }}>
                                <div style={{ marginBottom: '4px' }}>
                                  <strong>Product A:</strong> {conflict.productA?.productName || 'Unknown'}
                                </div>
                                <div>
                                  <strong>Product B:</strong> {conflict.productB?.productName || 'Unknown'}
                                </div>
                              </div>
                            )}
                            
                            {/* Conflict Type */}
                            {conflict.conflictType && (
                              <div style={{
                                fontSize: '12px',
                                color: '#9CA3AF',
                                marginBottom: '12px',
                                paddingLeft: '4px'
                              }}>
                                <strong>Type:</strong> {conflict.conflictType}
                              </div>
                            )}
                            
                            {/* Explanation */}
                            {conflict.explanation && (
                              <div style={{
                                fontSize: '13px',
                                color: '#1a1a1a',
                                lineHeight: '1.6',
                                marginBottom: '12px',
                                padding: '10px',
                                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                borderRadius: '6px'
                              }}>
                                <strong style={{ color: style.label }}>Why this matters:</strong>
                                <p style={{ margin: '6px 0 0 0', whiteSpace: 'pre-wrap' }}>
                                  {conflict.explanation}
                                </p>
                              </div>
                            )}
                            
                            {/* Recommendation */}
                            {conflict.recommendation && (
                              <div style={{
                                fontSize: '13px',
                                color: '#1a1a1a',
                                lineHeight: '1.6',
                                padding: '10px',
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                borderRadius: '6px',
                                borderLeft: `3px solid ${style.label}`
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                                  {React.createElement(Lightbulb, { size: 16, style: { color: style.label } })}
                                  <strong style={{ color: style.label }}>Recommendation:</strong>
                                </div>
                                <p style={{ margin: '6px 0 0 0', whiteSpace: 'pre-wrap' }}>
                                  {conflict.recommendation}
                                </p>
                              </div>
                            )}
                            
                            {/* Temporal Conflict Indicator */}
                            {conflict.isTemporalConflict && (
                              <div style={{
                                fontSize: '11px',
                                color: '#F59E0B',
                                marginTop: '8px',
                                padding: '6px 10px',
                                backgroundColor: '#FFFBEB',
                                borderRadius: '6px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}>
                                {React.createElement(Clock, { size: 14, style: { color: '#F59E0B' } })}
                                <span>Used at the same time (AM/PM)</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    // Other tabs (summary, warnings, benefits, routine)
                    formattedContent.map((item, idx) => {
                      const isWarning = activeTab === 'warnings';
                      const isBenefit = activeTab === 'benefits';
                      const isRoutine = activeTab === 'routine';
                      
                      return (
                        <div
                          key={idx}
                          style={{
                            marginBottom: idx < formattedContent.length - 1 ? '16px' : '0',
                            paddingBottom: idx < formattedContent.length - 1 ? '16px' : '0',
                            borderBottom: idx < formattedContent.length - 1 ? '1px solid #E5E7EB' : 'none'
                          }}
                        >
                          {isWarning && (
                            <div style={{
                              backgroundColor: '#FFF5F3', // Light version of Soft Coral/Peach
                              borderLeft: '3px solid #FFB3A7', // Soft Coral/Peach warning
                              padding: '12px',
                              borderRadius: '8px',
                              marginBottom: '8px'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                <AlertTriangle size={16} style={{ color: '#FFB3A7', marginTop: '2px' }} />
                                <p style={{ 
                                  fontSize: '14px', 
                                  color: '#1a1a1a', 
                                  lineHeight: '1.6', 
                                  margin: 0,
                                  whiteSpace: 'pre-wrap'
                                }}>
                                  {item}
                                </p>
                              </div>
                            </div>
                          )}
                          
                          {isBenefit && (
                            <div style={{
                              backgroundColor: '#F0FDF4',
                              borderLeft: '3px solid #A9D1B0', // Sage Green accent
                              padding: '12px',
                              borderRadius: '8px',
                              marginBottom: '8px'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                <span style={{ fontSize: '16px', marginTop: '2px' }}>✅</span>
                                <p style={{ 
                                  fontSize: '14px', 
                                  color: '#1a1a1a', 
                                  lineHeight: '1.6', 
                                  margin: 0,
                                  whiteSpace: 'pre-wrap'
                                }}>
                                  {item}
                                </p>
                              </div>
                            </div>
                          )}
                          
                          {isRoutine && (
                            <div style={{
                              backgroundColor: '#F0F9FF',
                              borderLeft: '3px solid #A9D1B0',
                              padding: '12px',
                              borderRadius: '8px',
                              marginBottom: '8px',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '8px'
                            }}>
                              {typeof item === 'object' && item.type === 'routine' ? (
                                <>
                                  {item.isMorning ? (
                                    <Sun size={16} style={{ color: '#A9D1B0', marginTop: '2px' }} />
                                  ) : (
                                    <Moon size={16} style={{ color: '#A9D1B0', marginTop: '2px' }} />
                                  )}
                                  <p style={{ 
                                    fontSize: '14px', 
                                    color: '#1a1a1a', 
                                    lineHeight: '1.6', 
                                    margin: 0,
                                    whiteSpace: 'pre-wrap',
                                    fontWeight: '500'
                                  }}>
                                    {item.text}
                                  </p>
                                </>
                              ) : (
                                <p style={{ 
                                  fontSize: '14px', 
                                  color: '#1a1a1a', 
                                  lineHeight: '1.6', 
                                  margin: 0,
                                  whiteSpace: 'pre-wrap',
                                  fontWeight: '500'
                                }}>
                                  {item}
                                </p>
                              )}
                            </div>
                          )}
                          
                          {!isWarning && !isBenefit && !isRoutine && (
                            <div style={{
                              backgroundColor: '#F9FAFB',
                              borderRadius: '12px',
                              padding: '16px',
                              border: '1px solid #E5E7EB'
                            }}>
                              {/* Parse and structure the summary text */}
                              {(() => {
                                const text = typeof item === 'string' ? item : String(item);
                                const lines = text.split('\n').filter(line => line.trim());
                                
                                // Check if it's a safety score summary
                                const safetyMatch = text.match(/(safe|caution|high.?risk|risk score|score:?\s*\d+\/10)/i);
                                const conflictMatch = text.match(/found\s+(\d+)\s+conflict/i);
                                const routineMatch = text.match(/(morning|evening)\s+routine:/i);
                                
                                return (
                                  <div>
                                    {/* Safety Score Card */}
                                    {safetyMatch && (
                                      <div style={{
                                        backgroundColor: text.toLowerCase().includes('safe') ? '#F0FDF4' : 
                                                         text.toLowerCase().includes('caution') ? '#FFFBF0' : '#FFF5F3',
                                        borderRadius: '8px',
                                        padding: '12px',
                                        marginBottom: '16px',
                                        borderLeft: `4px solid ${text.toLowerCase().includes('safe') ? '#A9D1B0' : 
                                                                   text.toLowerCase().includes('caution') ? '#FAD28B' : '#FFB3A7'}`
                                      }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                          {text.toLowerCase().includes('safe') ? (
                                            <CheckCircle2 size={18} style={{ color: '#16A34A' }} />
                                          ) : text.toLowerCase().includes('caution') ? (
                                            <AlertTriangle size={18} style={{ color: '#D97706' }} />
                                          ) : (
                                            <Zap size={18} style={{ color: '#DC2626' }} />
                                          )}
                                          <span style={{ 
                                            fontSize: '15px', 
                                            fontWeight: '700',
                                            color: text.toLowerCase().includes('safe') ? '#16A34A' : 
                                                   text.toLowerCase().includes('caution') ? '#D97706' : '#DC2626'
                                          }}>
                                            {text.match(/routine is (SAFE|safe|CAUTION|caution|HIGH.?RISK|high.?risk)/i)?.[1]?.toUpperCase() || 
                                             text.match(/(\d+\/10)/)?.[1] || 'Routine Analysis'}
                                          </span>
                                        </div>
                                        {text.match(/score:?\s*(\d+\/10)/i) && (
                                          <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                                            Safety Score: <strong>{text.match(/score:?\s*(\d+\/10)/i)?.[1]}</strong>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                    
                                    {/* Conflict Count Card */}
                                    {conflictMatch && (
                                      <div style={{
                                        backgroundColor: '#FFF5F3', // Light version of Soft Coral/Peach
                                        borderRadius: '8px',
                                        padding: '12px',
                                        marginBottom: '16px',
                                        borderLeft: '4px solid #FFB3A7' // Soft Coral/Peach warning
                                      }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                          <Zap size={18} style={{ color: '#FFB3A7' }} />
                                          <span style={{ fontSize: '14px', fontWeight: '600', color: '#DC2626' }}>
                                            Found {conflictMatch[1]} potential conflict{conflictMatch[1] !== '1' ? 's' : ''}
                                          </span>
                                        </div>
                                        {text.includes('high-severity') || text.includes('Review') && (
                                          <p style={{ fontSize: '12px', color: '#991B1B', marginTop: '6px', marginBottom: 0 }}>
                                            Review high-severity conflicts immediately.
                                          </p>
                                        )}
                                      </div>
                                    )}
                                    
                                    {/* Main Summary Text */}
                                    <div style={{
                                      fontSize: '14px',
                                      color: '#1a1a1a',
                                      lineHeight: '1.8',
                                      marginTop: safetyMatch || conflictMatch ? '12px' : '0'
                                    }}>
                                      {lines.map((line, lineIdx) => {
                                        const trimmedLine = line.trim();
                                        
                                        // Skip if it's already displayed in cards above
                                        if (safetyMatch && trimmedLine.toLowerCase().includes('routine is')) return null;
                                        if (conflictMatch && trimmedLine.toLowerCase().includes('found') && trimmedLine.toLowerCase().includes('conflict')) return null;
                                        
                                        // Format routine suggestions
                                        if (routineMatch && trimmedLine.toLowerCase().includes('routine:')) {
                                          return (
                                            <div key={lineIdx} style={{
                                              backgroundColor: '#F0F9FF',
                                              borderRadius: '8px',
                                              padding: '10px 12px',
                                              marginBottom: '8px',
                                              borderLeft: '3px solid #3B82F6'
                                            }}>
                                              <span style={{ fontWeight: '600', color: '#1E40AF' }}>
                                                {trimmedLine.match(/(Morning|Evening)\s+Routine:/i)?.[0] || 'Routine:'}
                                              </span>
                                              <span style={{ marginLeft: '8px' }}>
                                                {trimmedLine.replace(/(Morning|Evening)\s+Routine:\s*/i, '')}
                                              </span>
                                            </div>
                                          );
                                        }
                                        
                                        // Format bullet points or list items
                                        if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•') || trimmedLine.match(/^\d+\./)) {
                                          return (
                                            <div key={lineIdx} style={{
                                              display: 'flex',
                                              alignItems: 'flex-start',
                                              gap: '8px',
                                              marginBottom: '8px',
                                              paddingLeft: '8px'
                                            }}>
                                              <span style={{ color: '#6B7280', marginTop: '4px' }}>•</span>
                                              <span>{trimmedLine.replace(/^[-•\d+\.]\s*/, '')}</span>
                                            </div>
                                          );
                                        }
                                        
                                        // Format paragraphs
                                        if (trimmedLine.length > 0) {
                                          return (
                                            <p key={lineIdx} style={{
                                              margin: lineIdx === 0 ? '0 0 12px 0' : '0 0 12px 0',
                                              color: '#374151'
                                            }}>
                                              {trimmedLine}
                                            </p>
                                          );
                                        }
                                        
                                        return null;
                                      })}
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '20px',
                  color: '#9CA3AF',
                  fontSize: '14px'
                }}>
                  No {tabs.find(t => t.id === activeTab)?.label.toLowerCase() || 'content'} available
                </div>
              )}
            </div>
          </div>
        )}
        
        {recommendations.length === 0 && (
          <div 
            style={{ 
              backgroundColor: '#F9FAFB',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              border: '1px solid #E5E7EB'
            }}
          >
            <p style={{ fontSize: '14px', color: '#9CA3AF' }}>
              No analysis recommendations available yet. Complete a routine analysis to see personalized recommendations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

