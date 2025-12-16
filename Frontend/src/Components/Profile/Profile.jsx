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
  Lightbulb,
  Loader2
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
  const [hoveredProduct, setHoveredProduct] = useState(null); // { text: string, x: number, y: number, positionAbove?: boolean }
  
  // Helper function to calculate tooltip position with viewport boundary detection
  const getTooltipPosition = (rect, tooltipHeight = 50) => {
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const spaceAbove = rect.top;
    const spaceBelow = viewportHeight - rect.bottom;
    
    // Position above if not enough space below, otherwise below
    const positionAbove = spaceBelow < tooltipHeight && spaceAbove > spaceBelow;
    const top = positionAbove
      ? rect.top - tooltipHeight - 10
      : rect.bottom + 10;
    
    // Keep horizontal position centered but within viewport
    const left = Math.max(125, Math.min(rect.left + rect.width / 2, viewportWidth - 125));
    
    return { top, left, positionAbove };
  };
  
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
  
  // DEBUG: Log the entire latestAnalysis object to see what we're getting
  console.log('🔍 DEBUG: Full latestAnalysis object:', latestAnalysis);
  console.log('🔍 DEBUG: latestAnalysis.profileSummary (top level):', latestAnalysis?.profileSummary);
  console.log('🔍 DEBUG: latestAnalysis.analysis?.aiAnalysis?.profileSummary:', latestAnalysis?.analysis?.aiAnalysis?.profileSummary);
  console.log('🔍 DEBUG: latestAnalysis.analysis?.analysisData:', latestAnalysis?.analysis?.analysisData ? 'EXISTS' : 'NULL');
  
  // Get ingredient benefits and warnings from latest analysis
  // Priority: Use structured aiAnalysis field first (already parsed by backend), then fall back to parsing analysisData
  let ingredientBenefits = [];
  let ingredientWarnings = [];
  
  // Get structured routine data and AI summary
  let morningRoutine = [];
  let eveningRoutine = [];
  let aiSummary = '';
  let profileSummary = ''; // NEW: Comprehensive profile summary for Summary tab only
  
  // First try: Get from structured aiAnalysis field (from our recent backend update)
  if (latestAnalysis?.analysis?.aiAnalysis) {
    console.log('📊 Extracting data from latestAnalysis.analysis.aiAnalysis');
    ingredientBenefits = latestAnalysis.analysis.aiAnalysis.ingredientBenefits || [];
    ingredientWarnings = latestAnalysis.analysis.aiAnalysis.ingredientWarnings || [];
    morningRoutine = latestAnalysis.analysis.aiAnalysis.morningRoutine || [];
    eveningRoutine = latestAnalysis.analysis.aiAnalysis.eveningRoutine || [];
    aiSummary = latestAnalysis.analysis.aiAnalysis.summary || '';
    profileSummary = latestAnalysis.analysis.aiAnalysis.profileSummary || ''; // NEW
    
    console.log('📋 Extracted from aiAnalysis:', {
      profileSummary: profileSummary ? `✅ Found (${profileSummary.length} chars)` : '❌ Not found',
      aiSummary: aiSummary ? `✅ Found (${aiSummary.length} chars)` : '❌ Not found',
    });
    
    // Frontend safety truncation: Ensure summary doesn't exceed 300 characters
    if (aiSummary && aiSummary.length > 300) {
      const truncated = aiSummary.substring(0, 300);
      const words = truncated.split(/\s+/).slice(0, 50).join(' ');
      aiSummary = words + (words.length < aiSummary.length ? '...' : '');
    }
  }
  
  // Fallback: Parse from analysisData if aiAnalysis not available
  if (latestAnalysis?.analysis?.analysisData) {
    try {
      const analysisData = typeof latestAnalysis.analysis.analysisData === 'string' 
        ? JSON.parse(latestAnalysis.analysis.analysisData) 
        : latestAnalysis.analysis.analysisData;
      
      // DEBUG: Check what's in analysisData
      console.log('🔍 DEBUG: Parsed analysisData:', analysisData);
      console.log('🔍 DEBUG: analysisData.profileSummary (top level):', analysisData?.profileSummary);
      console.log('🔍 DEBUG: analysisData.aiAnalysis?.profileSummary:', analysisData?.aiAnalysis?.profileSummary);
      console.log('🔍 DEBUG: All keys in analysisData:', analysisData ? Object.keys(analysisData) : 'NO analysisData');
      console.log('🔍 DEBUG: All keys in analysisData.aiAnalysis:', analysisData?.aiAnalysis ? Object.keys(analysisData.aiAnalysis) : 'NO aiAnalysis');
      
      // ingredientBenefits, ingredientWarnings, routines, and summary are nested inside aiAnalysis
      if (!ingredientBenefits.length) {
        ingredientBenefits = analysisData?.aiAnalysis?.ingredientBenefits || [];
      }
      if (!ingredientWarnings.length) {
        ingredientWarnings = analysisData?.aiAnalysis?.ingredientWarnings || [];
      }
      if (!morningRoutine.length) {
        morningRoutine = analysisData?.aiAnalysis?.morningRoutine || [];
      }
      if (!eveningRoutine.length) {
        eveningRoutine = analysisData?.aiAnalysis?.eveningRoutine || [];
      }
      if (!aiSummary) {
        aiSummary = analysisData?.aiAnalysis?.summary || '';
        
        // Frontend safety truncation: Ensure summary doesn't exceed 300 characters
        if (aiSummary && aiSummary.length > 300) {
          const truncated = aiSummary.substring(0, 300);
          const words = truncated.split(/\s+/).slice(0, 50).join(' ');
          aiSummary = words + (words.length < aiSummary.length ? '...' : '');
        }
      }
      if (!profileSummary) {
        // Try multiple locations: top-level analysisData, then aiAnalysis nested
        profileSummary = analysisData?.profileSummary || analysisData?.aiAnalysis?.profileSummary || '';
        if (profileSummary) {
          const source = analysisData?.profileSummary ? 'analysisData.profileSummary (top level)' : 'analysisData.aiAnalysis.profileSummary';
          console.log(`📋 Extracted profileSummary from ${source}:`, `✅ Found (${profileSummary.length} chars)`);
        } else {
          console.log('❌ profileSummary NOT FOUND in analysisData');
          console.log('   Checked: analysisData.profileSummary, analysisData.aiAnalysis.profileSummary');
          console.log('   Available top-level fields:', analysisData ? Object.keys(analysisData) : 'NO analysisData');
          console.log('   Available aiAnalysis fields:', analysisData?.aiAnalysis ? Object.keys(analysisData.aiAnalysis) : 'NO aiAnalysis');
        }
      }
    } catch (e) {
      console.error('Error parsing analysisData:', e);
    }
  }
  
  // Also check database record directly for profileSummary (stored at top level)
  if (!profileSummary) {
    profileSummary = latestAnalysis?.profileSummary || '';
    if (profileSummary) {
      console.log('📋 Extracted profileSummary from latestAnalysis.profileSummary (top level):', `✅ Found (${profileSummary.length} chars)`);
    }
  }
  
  // Final check: Log what we have
  console.log('🎯 Final Summary Data Status:', {
    profileSummary: profileSummary ? `✅ READY (${profileSummary.length} chars)` : '❌ EMPTY',
    aiSummary: aiSummary ? `✅ READY (${aiSummary.length} chars)` : '❌ EMPTY',
    source: profileSummary 
      ? 'profileSummary column' 
      : (aiSummary 
        ? 'aiSummary (truncated)' 
        : 'categorizedRecs.summary (parsed from recommendations)')
  });
  
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
        // Skip the header line itself
        if (rec.includes('INGREDIENT WARNINGS FOR YOUR SKIN TYPE') && !rec.includes('-')) {
          // This is just the header, skip it
          return;
        }
        
        // Extract individual warnings
        const lines = rec.split('\n');
        lines.forEach(line => {
          const trimmedLine = line.trim();
          // Skip header lines
          if (trimmedLine.includes('INGREDIENT WARNINGS FOR YOUR SKIN TYPE')) {
            return;
          }
          // Extract bullet points or lines with colons (ingredient: description format)
          if ((trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) && trimmedLine.includes(':')) {
            categorized.warnings.push(trimmedLine.substring(1).trim());
          } else if (trimmedLine.includes(':') && trimmedLine.length > 10) {
            // Also catch lines with colons that aren't bullet points
            categorized.warnings.push(trimmedLine);
          }
        });
        
        // If no individual warnings extracted but it's a warning-related text, add it
        if (categorized.warnings.length === 0 && rec.length > 50) {
          // Only add if it's substantial content, not just a header
          if (!rec.includes('INGREDIENT WARNINGS FOR YOUR SKIN TYPE')) {
            categorized.warnings.push(rec);
          }
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
  
  // Parse routine text into structured schedule data
  const parseRoutineSchedule = (routineText) => {
    if (!routineText || typeof routineText !== 'string') return null;
    
    const text = routineText;
    const schedule = {
      daily: { morning: [], evening: [] },
      weekly: {},
      alternateNights: null
    };
    
    // Check for alternate nights pattern - handle multiple formats
    const alternateMatch = text.match(/alternate nights|night a|night b|night c|night \d+|alternating schedule/i);
    if (alternateMatch) {
      schedule.alternateNights = {
        nightA: { days: [], products: [] },
        nightB: { days: [], products: [] },
        nightC: { days: [], products: [] }
      };
      
      // Format 0: "NIGHT 1, 3, 5: Product Name" (numeric format)
      const numericNightPattern = /NIGHT\s+([\d,\s]+):\s*([^\n]+)/gi;
      let numericMatch;
      const numericNights = {};
      
      while ((numericMatch = numericNightPattern.exec(text)) !== null) {
        const nightsStr = numericMatch[1].trim();
        const productName = numericMatch[2].trim().split(/[\(\)]/)[0].trim(); // Get product name before parentheses
        const nights = nightsStr.split(/[,;]/).map(n => parseInt(n.trim())).filter(n => !isNaN(n));
        
        nights.forEach(nightNum => {
          if (!numericNights[nightNum]) {
            numericNights[nightNum] = [];
          }
          if (!numericNights[nightNum].includes(productName)) {
            numericNights[nightNum].push(productName);
          }
        });
      }
      
      // Convert numeric nights (1-7) to day names
      if (Object.keys(numericNights).length > 0) {
        const dayMap = { 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday', 7: 'Sunday' };
        const nightADays = [];
        const nightBDays = [];
        const nightCDays = [];
        
        Object.keys(numericNights).forEach(nightNum => {
          const num = parseInt(nightNum);
          const dayName = dayMap[num];
          if (dayName) {
            // Group: Night 1,3,5 -> Night A; Night 2,4 -> Night B; Night 6,7 -> Night C
            if ([1, 3, 5].includes(num)) {
              nightADays.push(dayName);
              numericNights[nightNum].forEach(product => {
                if (!schedule.alternateNights.nightA.products.includes(product)) {
                  schedule.alternateNights.nightA.products.push(product);
                }
              });
            } else if ([2, 4].includes(num)) {
              nightBDays.push(dayName);
              numericNights[nightNum].forEach(product => {
                if (!schedule.alternateNights.nightB.products.includes(product)) {
                  schedule.alternateNights.nightB.products.push(product);
                }
              });
            } else if ([6, 7].includes(num)) {
              nightCDays.push(dayName);
              numericNights[nightNum].forEach(product => {
                if (!schedule.alternateNights.nightC.products.includes(product)) {
                  schedule.alternateNights.nightC.products.push(product);
                }
              });
            }
          }
        });
        
        schedule.alternateNights.nightA.days = nightADays;
        schedule.alternateNights.nightB.days = nightBDays;
        schedule.alternateNights.nightC.days = nightCDays;
      }
      
      // Format 1: "Product Name (ALTERNATE NIGHTS: Monday, Wednesday, Friday)"
      const format1Pattern = /([^\(]+?)\s*\(ALTERNATE NIGHTS:\s*([^)]+)\)/gi;
      let format1Match;
      const productsByDays = {};
      
      while ((format1Match = format1Pattern.exec(text)) !== null) {
        const productName = format1Match[1].trim();
        const daysStr = format1Match[2].trim();
        const days = daysStr.split(/[,;]/).map(d => d.trim());
        
        // Group products by their days
        days.forEach(day => {
          if (!productsByDays[day]) {
            productsByDays[day] = [];
          }
          if (!productsByDays[day].includes(productName)) {
            productsByDays[day].push(productName);
          }
        });
      }
      
      // If we found products with days, assign them to Night A/B/C
      if (Object.keys(productsByDays).length > 0) {
        const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const foundDays = Object.keys(productsByDays);
        
        // Find which days are used
        const mondayWedFri = foundDays.filter(d => 
          d.toLowerCase().includes('monday') || 
          d.toLowerCase().includes('wednesday') || 
          d.toLowerCase().includes('friday')
        );
        const tueThuSat = foundDays.filter(d => 
          d.toLowerCase().includes('tuesday') || 
          d.toLowerCase().includes('thursday') || 
          d.toLowerCase().includes('saturday')
        );
        
        // Assign to Night A (Monday/Wednesday/Friday)
        if (mondayWedFri.length > 0) {
          schedule.alternateNights.nightA.days = mondayWedFri.map(d => {
            // Normalize day names
            if (d.toLowerCase().includes('monday')) return 'Monday';
            if (d.toLowerCase().includes('wednesday')) return 'Wednesday';
            if (d.toLowerCase().includes('friday')) return 'Friday';
            return d;
          });
          // Get products for these days
          mondayWedFri.forEach(day => {
            productsByDays[day]?.forEach(product => {
              if (!schedule.alternateNights.nightA.products.includes(product)) {
                schedule.alternateNights.nightA.products.push(product);
              }
            });
          });
        }
        
        // Assign to Night B (Tuesday/Thursday/Saturday)
        if (tueThuSat.length > 0) {
          schedule.alternateNights.nightB.days = tueThuSat.map(d => {
            // Normalize day names
            if (d.toLowerCase().includes('tuesday')) return 'Tuesday';
            if (d.toLowerCase().includes('thursday')) return 'Thursday';
            if (d.toLowerCase().includes('saturday')) return 'Saturday';
            return d;
          });
          // Get products for these days
          tueThuSat.forEach(day => {
            productsByDays[day]?.forEach(product => {
              if (!schedule.alternateNights.nightB.products.includes(product)) {
                schedule.alternateNights.nightB.products.push(product);
              }
            });
          });
        }
        
        // Night C gets remaining days (Sunday typically)
        const usedDays = [
          ...schedule.alternateNights.nightA.days,
          ...schedule.alternateNights.nightB.days
        ].map(d => d.toLowerCase());
        const remainingDays = allDays.filter(d => !usedDays.includes(d.toLowerCase()));
        if (remainingDays.length > 0) {
          schedule.alternateNights.nightC.days = remainingDays;
        }
      }
      
      // Format 2: "Night A (Monday/Wednesday/Friday): Product → ..." (original format)
      if (schedule.alternateNights.nightA.products.length === 0) {
        const nightAPattern = /Night A[^:]*\(([^)]+)\)[^:]*:\s*([^→]+?)(?:\s*→|$)/i;
        const nightAMatch = text.match(nightAPattern);
        if (nightAMatch) {
          schedule.alternateNights.nightA.days = nightAMatch[1].split(/[,\/]/).map(d => d.trim());
          const productText = nightAMatch[2].trim();
          const productName = productText.split(/[\(\)→]/)[0].trim();
          schedule.alternateNights.nightA.products = [productName];
        }
      }
      
      if (schedule.alternateNights.nightB.products.length === 0) {
        const nightBPattern = /Night B[^:]*\(([^)]+)\)[^:]*:\s*([^→]+?)(?:\s*→|$)/i;
        const nightBMatch = text.match(nightBPattern);
        if (nightBMatch) {
          schedule.alternateNights.nightB.days = nightBMatch[1].split(/[,\/]/).map(d => d.trim());
          const productText = nightBMatch[2].trim();
          const productName = productText.split(/[\(\)→]/)[0].trim();
          schedule.alternateNights.nightB.products = [productName];
        }
      }
      
      // Extract Night C (remaining nights) or Rest days
      const nightCPattern = /Night C[^:]*:\s*([^\n]+)/i;
      const nightCMatch = text.match(nightCPattern);
      const restDaysPattern = /(?:NIGHT\s+[\d,\s]+|Rest days?)[^:]*:\s*([^\n]+)/i;
      const restDaysMatch = text.match(restDaysPattern);
      
      if (nightCMatch || restDaysMatch) {
        const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const usedDays = [
          ...schedule.alternateNights.nightA.days,
          ...schedule.alternateNights.nightB.days
        ].map(d => d.toLowerCase());
        const remainingDays = allDays.filter(d => !usedDays.includes(d.toLowerCase()));
        
        if (remainingDays.length > 0 && schedule.alternateNights.nightC.days.length === 0) {
          schedule.alternateNights.nightC.days = remainingDays;
          
          // Extract rest day products
          const restText = (nightCMatch?.[1] || restDaysMatch?.[1] || '').trim();
          if (restText && restText.toLowerCase().includes('rest')) {
            // For rest days, extract hydrating products mentioned
            const hydratingMatch = restText.match(/(?:hydrating|moisturiz|essence|serum)[^,\.]+/gi);
            if (hydratingMatch) {
              schedule.alternateNights.nightC.products = hydratingMatch.map(p => p.trim());
            } else {
              schedule.alternateNights.nightC.products = ['Rest day - hydrating products only'];
            }
          } else if (nightCMatch) {
            const productText = nightCMatch[1].trim();
            const productName = productText.split(/[\(\)→]/)[0].trim();
            schedule.alternateNights.nightC.products = [productName];
          }
        }
      }
    }
    
    // Only extract daily routine products if we have alternate nights (more reliable)
    // Don't create mock data from generic product mentions
    if (schedule.alternateNights) {
      const lines = text.split('\n');
      lines.forEach(line => {
        const lineLower = line.toLowerCase();
        // Only extract if it's clearly part of a routine recommendation
        if (lineLower.includes('cleanser') && lineLower.includes('gentle') && !schedule.daily.morning.some(p => p.toLowerCase().includes('cleanser'))) {
          const cleanser = line.match(/cleanser[^,\.]+/i)?.[0];
          if (cleanser) schedule.daily.morning.push(cleanser.trim());
        }
        if (lineLower.includes('moisturizer') && (lineLower.includes('ceramide') || lineLower.includes('barrier')) && !schedule.daily.morning.some(p => p.toLowerCase().includes('moisturizer'))) {
          const moisturizer = line.match(/moisturizer[^,\.]+/i)?.[0];
          if (moisturizer) {
            schedule.daily.morning.push(moisturizer.trim());
            schedule.daily.evening.push(moisturizer.trim());
          }
        }
        if ((lineLower.includes('sunscreen') || lineLower.includes('spf')) && lineLower.includes('30') && !schedule.daily.morning.some(p => p.toLowerCase().includes('sun'))) {
          const spf = line.match(/(sunscreen|spf[^,\.]+)/i)?.[0];
          if (spf) schedule.daily.morning.push(spf.trim());
        }
      });
    }
    
    return schedule;
  };

  // Get active tab content
  const getActiveTabContent = () => {
    switch (activeTab) {
      case 'warnings':
        // Use structured ingredientWarnings data if available, otherwise fall back to parsed text
        return ingredientWarnings.length > 0 ? ingredientWarnings : categorizedRecs.warnings;
      case 'benefits':
        // Use structured ingredientBenefits data if available, otherwise fall back to parsed text
        return ingredientBenefits.length > 0 ? ingredientBenefits : categorizedRecs.benefits;
      case 'conflicts':
        return detailedConflicts; // Return detailed conflict objects
      case 'routine':
        // If we have structured routine data, return it; otherwise use parsed text
        if (morningRoutine.length > 0 || eveningRoutine.length > 0) {
          // Return structured data as a special marker
          return [{ type: 'structured', morningRoutine, eveningRoutine }];
        }
        return categorizedRecs.routine;
      default: // 'summary' tab
        // Debug: Log what data sources are available
        console.log('🔍 Summary Tab Debug:', {
          profileSummary: profileSummary 
            ? `✅ EXISTS (${profileSummary.length} chars): "${profileSummary.substring(0, 100)}..."`
            : '❌ EMPTY/NULL',
          aiSummary: aiSummary 
            ? `✅ EXISTS (${aiSummary.length} chars): "${aiSummary.substring(0, 100)}..."`
            : '❌ EMPTY/NULL',
          categorizedRecsLength: categorizedRecs.summary.length,
          categorizedRecsPreview: categorizedRecs.summary.length > 0 
            ? `✅ EXISTS (${categorizedRecs.summary.length} items): "${String(categorizedRecs.summary[0]).substring(0, 100)}..."`
            : '❌ EMPTY',
          willUse: profileSummary && profileSummary.trim().length > 0 
            ? 'profileSummary' 
            : (aiSummary && aiSummary.trim().length > 0 
              ? 'aiSummary' 
              : 'categorizedRecs.summary')
        });
        
        // NEW: Prioritize profileSummary (comprehensive, non-duplicative) for Summary tab
        if (profileSummary && profileSummary.trim().length > 0) {
          console.log('✅ Using profileSummary for Summary tab');
          return [profileSummary];
        }
        // Fallback to aiSummary if profileSummary not available
        if (aiSummary && aiSummary.trim().length > 0) {
          console.log('⚠️ Falling back to aiSummary (profileSummary not available)');
          return [aiSummary];
        }
        console.log('⚠️ Falling back to categorizedRecs.summary (neither profileSummary nor aiSummary available)');
        return categorizedRecs.summary;
    }
  };
  
  const activeContent = getActiveTabContent();
  const hasContent = activeTab === 'conflicts' 
    ? detailedConflicts.length > 0 
    : activeTab === 'benefits'
    ? (ingredientBenefits.length > 0 || categorizedRecs.benefits.length > 0)
    : activeTab === 'warnings'
    ? (ingredientWarnings.length > 0 || categorizedRecs.warnings.length > 0)
    : activeTab === 'summary'
    ? (profileSummary && profileSummary.trim().length > 0) || (aiSummary && aiSummary.trim().length > 0) || categorizedRecs.summary.length > 0
    : activeContent.length > 0;
  
  // Tab configuration
  // Calculate routine count: include structured routine data if available
  const routineCount = (morningRoutine.length > 0 || eveningRoutine.length > 0) 
    ? 1 // Show routine tab if structured data exists
    : categorizedRecs.routine.length;
  
  // Summary count: prioritize profileSummary, then aiSummary, otherwise use parsed summary length
  const summaryCount = (profileSummary && profileSummary.trim().length > 0)
    ? 1 // Show summary tab if profileSummary exists
    : (aiSummary && aiSummary.trim().length > 0)
    ? 1 // Fallback to aiSummary
    : categorizedRecs.summary.length;
  
  const tabs = [
    { id: 'summary', label: 'Summary', icon: ClipboardList, count: summaryCount },
    { id: 'warnings', label: 'Warnings', icon: AlertTriangle, count: Math.max(ingredientWarnings.length, categorizedRecs.warnings.length) },
    { id: 'benefits', label: 'Benefits', icon: CheckCircle, count: ingredientBenefits.length > 0 ? ingredientBenefits.length : categorizedRecs.benefits.length },
    { id: 'conflicts', label: 'Conflicts', icon: Bolt, count: detailedConflicts.length },
    { id: 'routine', label: 'Routine', icon: Clock, count: routineCount },
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

  // Close tooltip when clicking outside (for mobile)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (hoveredProduct && !event.target.closest('[data-product-tooltip]')) {
        setHoveredProduct(null);
      }
    };
    
    if (hoveredProduct) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [hoveredProduct]);
  
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
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          <Loader2 size={48} style={{ color: '#A9D1B0', marginBottom: '16px', animation: 'spin 1s linear infinite' }} />
          <div style={{ fontSize: '18px', color: '#6B7280', margin: 0 }}>Loading profile...</div>
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
    if (activeTab === 'conflicts' || activeTab === 'benefits' || activeTab === 'warnings') {
      // Conflicts, benefits, and warnings are already objects when using structured data, don't format
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
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          <Loader2 size={48} style={{ color: '#A9D1B0', marginBottom: '16px', animation: 'spin 1s linear infinite' }} />
          <div style={{ fontSize: '18px', color: '#6B7280', margin: 0 }}>Loading profile...</div>
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
              {(() => {
                // Use structured data first, fallback to parsed benefits
                let benefitsToShow = [];
                
                if (ingredientBenefits.length > 0) {
                  benefitsToShow = ingredientBenefits;
                } else if (categorizedRecs.benefits.length > 0) {
                  // Parse text-based benefits into structured format
                  benefitsToShow = categorizedRecs.benefits.slice(0, 3).map((benefit, idx) => {
                    if (typeof benefit === 'string') {
                      // Try to extract ingredient name and description
                      // Format might be: "Ingredient Name: description" or "- Ingredient Name: description"
                      const cleaned = benefit.replace(/^[-•]\s*/, '').trim();
                      const parts = cleaned.split(':');
                      if (parts.length > 1) {
                        return {
                          ingredient: parts[0]?.trim() || `Ingredient ${idx + 1}`,
                          benefit: parts.slice(1).join(':').trim() || cleaned
                        };
                      } else {
                        // If no colon, try to extract ingredient name from common patterns
                        const match = cleaned.match(/^([A-Z][a-zA-Z\s]+?)(?:\s+\(|$)/);
                        return {
                          ingredient: match ? match[1].trim() : cleaned.split(' ').slice(0, 3).join(' ') || `Ingredient ${idx + 1}`,
                          benefit: cleaned
                        };
                      }
                    }
                    return benefit;
                  });
                }
                
                return benefitsToShow.length > 0 ? (
                  benefitsToShow.slice(0, 3).map((benefit, idx) => {
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
                );
              })()}
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
                              justifyContent: 'center',
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
                            {(() => {
                              const ingredientA = conflict.ingredientA?.inciName || 'Unknown Ingredient';
                              const ingredientB = conflict.ingredientB?.inciName || 'Unknown Ingredient';
                              // Estimate if text will exceed width (roughly 30 chars per line on mobile)
                              const totalLength = ingredientA.length + ingredientB.length;
                              const shouldStack = totalLength > 30 || ingredientA.length > 20 || ingredientB.length > 20;
                              
                              return shouldStack ? (
                                // Vertical layout: ingredient on top, X in middle, ingredient on bottom
                                <div style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  gap: '8px',
                                  marginBottom: '12px'
                                }}>
                                  <span style={{
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    color: '#1a1a1a',
                                    textAlign: 'center'
                                  }}>
                                    {ingredientA}
                                  </span>
                                  {React.createElement(X, { size: 18, style: { color: style.label } })}
                                  <span style={{
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    color: '#1a1a1a',
                                    textAlign: 'center'
                                  }}>
                                    {ingredientB}
                                  </span>
                                </div>
                              ) : (
                                // Horizontal layout: ingredient X ingredient
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '8px',
                                  marginBottom: '12px',
                                  flexWrap: 'wrap'
                                }}>
                                  <span style={{
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    color: '#1a1a1a',
                                    textAlign: 'center'
                                  }}>
                                    {ingredientA}
                                  </span>
                                  {React.createElement(X, { size: 18, style: { color: style.label } })}
                                  <span style={{
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    color: '#1a1a1a',
                                    textAlign: 'center'
                                  }}>
                                    {ingredientB}
                                  </span>
                                </div>
                              );
                            })()}
                            
                            {/* Products Involved */}
                            {(conflict.productA || conflict.productB) && (
                              <div style={{
                                fontSize: '12px',
                                color: '#6B7280',
                                marginBottom: '12px',
                                textAlign: 'center'
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
                                textAlign: 'center'
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
                                borderRadius: '6px',
                                textAlign: 'center'
                              }}>
                                <strong style={{ color: style.label }}>Why this matters:</strong>
                                <p style={{ margin: '6px 0 0 0', whiteSpace: 'pre-wrap', textAlign: 'left' }}>
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
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '6px' }}>
                                  {React.createElement(Lightbulb, { size: 16, style: { color: style.label } })}
                                  <strong style={{ color: style.label }}>Recommendation:</strong>
                                </div>
                                <p style={{ margin: '6px 0 0 0', whiteSpace: 'pre-wrap', textAlign: 'left' }}>
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
                  ) : activeTab === 'warnings' && ingredientWarnings.length > 0 ? (
                    // Structured warnings from AI analysis
                    ingredientWarnings.map((warning, idx) => {
                      const severityStyle = getSeverityStyle(warning.severity?.toLowerCase() || 'mild');
                      return (
                        <div
                          key={idx}
                          style={{
                            marginBottom: idx < ingredientWarnings.length - 1 ? '20px' : '0',
                            paddingBottom: idx < ingredientWarnings.length - 1 ? '20px' : '0',
                            borderBottom: idx < ingredientWarnings.length - 1 ? '1px solid #E5E7EB' : 'none'
                          }}
                        >
                          <div style={{
                            backgroundColor: severityStyle.bg,
                            borderRadius: '12px',
                            padding: '16px',
                            border: `1px solid ${severityStyle.border}`
                          }}>
                            {/* Warning Badge */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              marginBottom: '12px'
                            }}>
                              {React.createElement(severityStyle.icon, { size: 16, style: { color: severityStyle.label } })}
                              <span style={{
                                fontSize: '10px',
                                fontWeight: '700',
                                color: severityStyle.label,
                                letterSpacing: '0.05em'
                              }}>
                                {warning.severity ? warning.severity.toUpperCase() : 'WARNING'}
                              </span>
                            </div>
                            
                            {/* Ingredient Name */}
                            <div style={{
                              fontSize: '15px',
                              fontWeight: '600',
                              color: '#1a1a1a',
                              marginBottom: '8px'
                            }}>
                              {warning.ingredient} {warning.product && `(in ${warning.product})`}
                            </div>
                            
                            {/* Concern Description */}
                            {warning.concern && (
                              <div style={{
                                fontSize: '13px',
                                color: '#1a1a1a',
                                lineHeight: '1.6',
                                marginBottom: '12px',
                                padding: '10px',
                                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                borderRadius: '6px'
                              }}>
                                <strong style={{ color: severityStyle.label }}>Why this matters:</strong>
                                <p style={{ margin: '6px 0 0 0', whiteSpace: 'pre-wrap' }}>
                                  {warning.concern}
                                </p>
                              </div>
                            )}
                            
                            {/* Recommendation */}
                            {warning.recommendation && (
                              <div style={{
                                fontSize: '13px',
                                color: '#1a1a1a',
                                lineHeight: '1.6',
                                padding: '10px',
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                borderRadius: '6px',
                                borderLeft: `3px solid ${severityStyle.label}`
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                                  {React.createElement(Lightbulb, { size: 16, style: { color: severityStyle.label } })}
                                  <strong style={{ color: severityStyle.label }}>Recommendation:</strong>
                                </div>
                                <p style={{ margin: '6px 0 0 0', whiteSpace: 'pre-wrap' }}>
                                  {warning.recommendation}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : activeTab === 'benefits' && ingredientBenefits.length > 0 ? (
                    // Structured benefits from AI analysis
                    ingredientBenefits.map((benefit, idx) => (
                      <div
                        key={idx}
                        style={{
                          marginBottom: idx < ingredientBenefits.length - 1 ? '20px' : '0',
                          paddingBottom: idx < ingredientBenefits.length - 1 ? '20px' : '0',
                          borderBottom: idx < ingredientBenefits.length - 1 ? '1px solid #E5E7EB' : 'none'
                        }}
                      >
                        <div style={{
                          backgroundColor: '#F0FDF4',
                          borderRadius: '12px',
                          padding: '16px',
                          border: '1px solid #BBF7D0'
                        }}>
                          {/* Benefit Badge */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            marginBottom: '12px'
                          }}>
                            <CheckCircle size={16} style={{ color: '#16A34A' }} />
                            <span style={{
                              fontSize: '10px',
                              fontWeight: '700',
                              color: '#16A34A',
                              letterSpacing: '0.05em'
                            }}>
                              BENEFICIAL
                            </span>
                          </div>
                          
                          {/* Ingredient Name */}
                          <div style={{
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#1a1a1a',
                            marginBottom: '8px'
                          }}>
                            {benefit.ingredient} {benefit.product && `(in ${benefit.product})`}
                          </div>
                          
                          {/* Benefit Description */}
                          {benefit.benefit && (
                            <div style={{
                              fontSize: '13px',
                              color: '#1a1a1a',
                              lineHeight: '1.6',
                              padding: '10px',
                              backgroundColor: 'rgba(255, 255, 255, 0.5)',
                              borderRadius: '6px'
                            }}>
                              <strong style={{ color: '#16A34A' }}>Why this helps:</strong>
                              <p style={{ margin: '6px 0 0 0', whiteSpace: 'pre-wrap' }}>
                                {benefit.benefit}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    // Other tabs (summary, warnings, benefits as text, routine)
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
                            borderBottom: idx < formattedContent.length - 1 ? '1px solid #E5E7EB' : 'none',
                            width: '100%',
                            boxSizing: 'border-box',
                            overflow: 'hidden'
                          }}
                        >
                          {isWarning && (
                            <div style={{
                              marginBottom: idx < formattedContent.length - 1 ? '20px' : '0',
                              paddingBottom: idx < formattedContent.length - 1 ? '20px' : '0',
                              borderBottom: idx < formattedContent.length - 1 ? '1px solid #E5E7EB' : 'none'
                            }}>
                              <div style={{
                                backgroundColor: '#FFF5F3', // Light version of Soft Coral/Peach
                                borderRadius: '12px',
                                padding: '16px',
                                border: '1px solid #FFB3A7' // Soft Coral/Peach warning
                              }}>
                                {/* Warning Badge */}
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  marginBottom: '12px'
                                }}>
                                  <AlertTriangle size={16} style={{ color: '#FF6B5A' }} />
                                  <span style={{
                                    fontSize: '10px',
                                    fontWeight: '700',
                                    color: '#FF6B5A',
                                    letterSpacing: '0.05em'
                                  }}>
                                    WARNING
                                  </span>
                                </div>
                                
                                {/* Warning Text */}
                                <div style={{
                                  fontSize: '13px',
                                  color: '#1a1a1a',
                                  lineHeight: '1.6',
                                  whiteSpace: 'pre-wrap'
                                }}>
                                  {typeof item === 'string' ? item.replace(/^⚠️\s*/, '').replace(/⚠️/g, '') : JSON.stringify(item)}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {isBenefit && (
                            <div style={{
                              marginBottom: idx < formattedContent.length - 1 ? '20px' : '0',
                              paddingBottom: idx < formattedContent.length - 1 ? '20px' : '0',
                              borderBottom: idx < formattedContent.length - 1 ? '1px solid #E5E7EB' : 'none'
                            }}>
                              <div style={{
                                backgroundColor: '#F0FDF4',
                                borderRadius: '12px',
                                padding: '16px',
                                border: '1px solid #BBF7D0'
                              }}>
                                {/* Benefit Badge */}
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  marginBottom: '12px'
                                }}>
                                  <CheckCircle size={16} style={{ color: '#16A34A' }} />
                                  <span style={{
                                    fontSize: '10px',
                                    fontWeight: '700',
                                    color: '#16A34A',
                                    letterSpacing: '0.05em'
                                  }}>
                                    BENEFICIAL
                                  </span>
                                </div>
                                
                                {/* Benefit Text */}
                                <div style={{
                                  fontSize: '13px',
                                  color: '#1a1a1a',
                                  lineHeight: '1.6',
                                  whiteSpace: 'pre-wrap'
                                }}>
                                  {typeof item === 'string' ? item.replace(/^✅\s*/, '').replace(/✅/g, '') : JSON.stringify(item)}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {isRoutine && (() => {
                            // Get routine text for parsing alternate nights
                            const routineText = typeof item === 'object' && item.type === 'routine' ? item.text : item;
                            
                            // Priority 1: Use structured routine data from AI if available
                            if (morningRoutine.length > 0 || eveningRoutine.length > 0) {
                              const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                              const dayAbbr = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                              
                              // Check if we have alternate nights pattern in the text/summary
                              const fullRoutineText = typeof routineText === 'string' ? routineText : (aiSummary || categorizedRecs.routine.join('\n'));
                              const schedule = parseRoutineSchedule(fullRoutineText);
                              
                              // Use parsed alternate nights if available, otherwise use structured data as daily routine
                              const scheduleToDisplay = schedule?.alternateNights ? {
                                daily: { morning: morningRoutine, evening: eveningRoutine },
                                alternateNights: schedule.alternateNights
                              } : {
                                daily: { morning: morningRoutine, evening: eveningRoutine },
                                alternateNights: null
                              };
                              
                              return (
                                <div style={{
                                  backgroundColor: '#F0F9FF',
                                  borderRadius: '12px',
                                  padding: '16px',
                                  marginBottom: '16px',
                                  border: '1px solid #DBEAFE'
                                }}>
                                  <div style={{
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    color: '#1a1a1a',
                                    marginBottom: '16px',
                                    textAlign: 'center'
                                  }}>
                                    Weekly Routine Schedule
                                  </div>
                                  
                                  {/* Calendar Grid - Scrollable Container */}
                                  <div style={{
                                    overflowX: 'auto',
                                    overflowY: 'visible',
                                    marginBottom: '16px',
                                    WebkitOverflowScrolling: 'touch',
                                    scrollbarWidth: 'thin',
                                    scrollbarColor: '#A9D1B0 #F0F9FF',
                                    position: 'relative',
                                    paddingBottom: '4px'
                                  }}>
                                    <div style={{
                                      display: 'grid',
                                      gridTemplateColumns: 'repeat(7, minmax(90px, 1fr))',
                                      gap: '8px',
                                      minWidth: '630px',
                                      width: 'max-content'
                                    }}>
                                      {days.map((day, idx) => {
                                        const dayLower = day.toLowerCase();
                                        let nightRoutine = null;
                                        let nightLabel = '';
                                        
                                        // Determine which night routine for this day (if alternate nights exist)
                                        if (scheduleToDisplay.alternateNights) {
                                          if (scheduleToDisplay.alternateNights.nightA.days.some(d => d.toLowerCase().includes(dayLower))) {
                                            nightRoutine = scheduleToDisplay.alternateNights.nightA.products;
                                            nightLabel = 'Night A';
                                          } else if (scheduleToDisplay.alternateNights.nightB.days.some(d => d.toLowerCase().includes(dayLower))) {
                                            nightRoutine = scheduleToDisplay.alternateNights.nightB.products;
                                            nightLabel = 'Night B';
                                          } else if (scheduleToDisplay.alternateNights.nightC.days.some(d => d.toLowerCase().includes(dayLower))) {
                                            nightRoutine = scheduleToDisplay.alternateNights.nightC.products;
                                            nightLabel = 'Night C';
                                          }
                                        }
                                        
                                        return (
                                        <div
                                          key={day}
                                          style={{
                                            backgroundColor: '#FFFFFF',
                                            borderRadius: '8px',
                                            padding: '8px',
                                            border: '1px solid #E5E7EB',
                                            minHeight: '80px',
                                            display: 'flex',
                                            flexDirection: 'column'
                                          }}
                                        >
                                          <div style={{
                                            fontSize: '11px',
                                            fontWeight: '600',
                                            color: '#6B7280',
                                            marginBottom: '6px',
                                            textAlign: 'center'
                                          }}>
                                            {dayAbbr[idx]}
                                          </div>
                                          
                                          {/* Morning */}
                                          <div style={{
                                            fontSize: '9px',
                                            color: '#9CA3AF',
                                            marginBottom: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                          }}>
                                            <Sun size={10} style={{ color: '#F59E0B' }} />
                                            <span>AM</span>
                                          </div>
                                          {morningRoutine.length > 0 && (
                                            <div style={{
                                              fontSize: '9px',
                                              color: '#1a1a1a',
                                              marginBottom: '6px',
                                              lineHeight: '1.3'
                                            }}>
                                              {morningRoutine.slice(0, 2).map((p, i) => {
                                                const isTruncated = p.length > 15;
                                                const displayText = isTruncated ? p.substring(0, 15) + '...' : p;
                                                return (
                                                  <div 
                                                    key={i}
                                                    data-product-tooltip
                                                    style={{ 
                                                      marginBottom: '2px',
                                                      cursor: isTruncated ? 'help' : 'default',
                                                      touchAction: 'manipulation'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                      if (isTruncated) {
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        const position = getTooltipPosition(rect);
                                                        setHoveredProduct({
                                                          text: p,
                                                          x: position.left,
                                                          y: position.top,
                                                          positionAbove: position.positionAbove
                                                        });
                                                      }
                                                    }}
                                                    onMouseMove={(e) => {
                                                      if (isTruncated && hoveredProduct?.text === p) {
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        const position = getTooltipPosition(rect);
                                                        setHoveredProduct({
                                                          text: p,
                                                          x: position.left,
                                                          y: position.top,
                                                          positionAbove: position.positionAbove
                                                        });
                                                      }
                                                    }}
                                                    onMouseLeave={() => {
                                                      if (isTruncated) {
                                                        setHoveredProduct(null);
                                                      }
                                                    }}
                                                    onTouchStart={(e) => {
                                                      if (isTruncated) {
                                                        e.stopPropagation();
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        const position = getTooltipPosition(rect);
                                                        const currentTooltip = hoveredProduct?.text === p;
                                                        setHoveredProduct(currentTooltip ? null : {
                                                          text: p,
                                                          x: position.left,
                                                          y: position.top,
                                                          positionAbove: position.positionAbove
                                                        });
                                                      }
                                                    }}
                                                    onClick={(e) => {
                                                      if (isTruncated) {
                                                        e.stopPropagation();
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        const position = getTooltipPosition(rect);
                                                        const currentTooltip = hoveredProduct?.text === p;
                                                        setHoveredProduct(currentTooltip ? null : {
                                                          text: p,
                                                          x: position.left,
                                                          y: position.top,
                                                          positionAbove: position.positionAbove
                                                        });
                                                      }
                                                    }}
                                                  >
                                                    • {displayText}
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          )}
                                          
                                          {/* Evening */}
                                          <div style={{
                                            fontSize: '9px',
                                            color: '#9CA3AF',
                                            marginBottom: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            marginTop: 'auto'
                                          }}>
                                            <Moon size={10} style={{ color: '#6B7280' }} />
                                            <span>PM</span>
                                          </div>
                                          {nightRoutine && nightRoutine.length > 0 ? (
                                            <div style={{
                                              fontSize: '9px',
                                              color: '#1a1a1a',
                                              backgroundColor: nightLabel === 'Night A' ? '#FEF3C7' : 
                                                              nightLabel === 'Night B' ? '#DBEAFE' : '#F3F4F6',
                                              padding: '4px',
                                              borderRadius: '4px',
                                              lineHeight: '1.3'
                                            }}>
                                              <div style={{ fontWeight: '600', marginBottom: '2px', fontSize: '8px' }}>
                                                {nightLabel}
                                              </div>
                                              {nightRoutine.map((p, i) => {
                                                const isTruncated = p.length > 20;
                                                const displayText = isTruncated ? p.substring(0, 20) + '...' : p;
                                                return (
                                                  <div 
                                                    key={i}
                                                    data-product-tooltip
                                                    style={{ 
                                                      marginBottom: '2px',
                                                      cursor: isTruncated ? 'help' : 'default',
                                                      touchAction: 'manipulation'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                      if (isTruncated) {
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        const position = getTooltipPosition(rect);
                                                        setHoveredProduct({
                                                          text: p,
                                                          x: position.left,
                                                          y: position.top,
                                                          positionAbove: position.positionAbove
                                                        });
                                                      }
                                                    }}
                                                    onMouseMove={(e) => {
                                                      if (isTruncated && hoveredProduct?.text === p) {
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        const position = getTooltipPosition(rect);
                                                        setHoveredProduct({
                                                          text: p,
                                                          x: position.left,
                                                          y: position.top,
                                                          positionAbove: position.positionAbove
                                                        });
                                                      }
                                                    }}
                                                    onMouseLeave={() => {
                                                      if (isTruncated) {
                                                        setHoveredProduct(null);
                                                      }
                                                    }}
                                                    onTouchStart={(e) => {
                                                      if (isTruncated) {
                                                        e.stopPropagation();
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        const position = getTooltipPosition(rect);
                                                        const currentTooltip = hoveredProduct?.text === p;
                                                        setHoveredProduct(currentTooltip ? null : {
                                                          text: p,
                                                          x: position.left,
                                                          y: position.top,
                                                          positionAbove: position.positionAbove
                                                        });
                                                      }
                                                    }}
                                                    onClick={(e) => {
                                                      if (isTruncated) {
                                                        e.stopPropagation();
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        const position = getTooltipPosition(rect);
                                                        const currentTooltip = hoveredProduct?.text === p;
                                                        setHoveredProduct(currentTooltip ? null : {
                                                          text: p,
                                                          x: position.left,
                                                          y: position.top,
                                                          positionAbove: position.positionAbove
                                                        });
                                                      }
                                                    }}
                                                  >
                                                    • {displayText}
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          ) : eveningRoutine.length > 0 ? (
                                            <div style={{
                                              fontSize: '9px',
                                              color: '#1a1a1a',
                                              lineHeight: '1.3'
                                            }}>
                                              {eveningRoutine.slice(0, 1).map((p, i) => {
                                                const isTruncated = p.length > 15;
                                                const displayText = isTruncated ? p.substring(0, 15) + '...' : p;
                                                return (
                                                  <div 
                                                    key={i}
                                                    data-product-tooltip
                                                    style={{ 
                                                      marginBottom: '2px',
                                                      cursor: isTruncated ? 'help' : 'default',
                                                      touchAction: 'manipulation'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                      if (isTruncated) {
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        const position = getTooltipPosition(rect);
                                                        setHoveredProduct({
                                                          text: p,
                                                          x: position.left,
                                                          y: position.top,
                                                          positionAbove: position.positionAbove
                                                        });
                                                      }
                                                    }}
                                                    onMouseMove={(e) => {
                                                      if (isTruncated && hoveredProduct?.text === p) {
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        const position = getTooltipPosition(rect);
                                                        setHoveredProduct({
                                                          text: p,
                                                          x: position.left,
                                                          y: position.top,
                                                          positionAbove: position.positionAbove
                                                        });
                                                      }
                                                    }}
                                                    onMouseLeave={() => {
                                                      if (isTruncated) {
                                                        setHoveredProduct(null);
                                                      }
                                                    }}
                                                    onTouchStart={(e) => {
                                                      if (isTruncated) {
                                                        e.stopPropagation();
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        const position = getTooltipPosition(rect);
                                                        const currentTooltip = hoveredProduct?.text === p;
                                                        setHoveredProduct(currentTooltip ? null : {
                                                          text: p,
                                                          x: position.left,
                                                          y: position.top,
                                                          positionAbove: position.positionAbove
                                                        });
                                                      }
                                                    }}
                                                    onClick={(e) => {
                                                      if (isTruncated) {
                                                        e.stopPropagation();
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        const position = getTooltipPosition(rect);
                                                        const currentTooltip = hoveredProduct?.text === p;
                                                        setHoveredProduct(currentTooltip ? null : {
                                                          text: p,
                                                          x: position.left,
                                                          y: position.top,
                                                          positionAbove: position.positionAbove
                                                        });
                                                      }
                                                    }}
                                                  >
                                                    • {displayText}
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          ) : null}
                                        </div>
                                      );
                                      })}
                                    </div>
                                  </div>
                                  
                                  {/* Legend */}
                                  <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '12px',
                                    justifyContent: 'center',
                                    fontSize: '11px',
                                    color: '#6B7280',
                                    paddingTop: '12px',
                                    borderTop: '1px solid #E5E7EB'
                                  }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <Sun size={12} style={{ color: '#F59E0B' }} />
                                      <span>Morning Routine</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <Moon size={12} style={{ color: '#6B7280' }} />
                                      <span>Evening Routine</span>
                                    </div>
                                    {scheduleToDisplay.alternateNights?.nightA.products.length > 0 && (
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#FEF3C7' }}></span>
                                        <span>Night A</span>
                                      </div>
                                    )}
                                    {scheduleToDisplay.alternateNights?.nightB.products.length > 0 && (
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#DBEAFE' }}></span>
                                        <span>Night B</span>
                                      </div>
                                    )}
                                    {scheduleToDisplay.alternateNights?.nightC.products.length > 0 && (
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#F3F4F6' }}></span>
                                        <span>Night C</span>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* Full routine details (collapsible) */}
                                  {(aiSummary || morningRoutine.length > 0 || eveningRoutine.length > 0 || categorizedRecs.routine.length > 0) && (
                                    <details style={{ marginTop: '12px' }}>
                                      <summary style={{
                                        fontSize: '12px',
                                        color: '#3B82F6',
                                        cursor: 'pointer',
                                        fontWeight: '500'
                                      }}>
                                        View full routine details
                                      </summary>
                                      <div style={{
                                        marginTop: '8px',
                                        padding: '12px',
                                        backgroundColor: '#FFFFFF',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        color: '#1a1a1a',
                                        lineHeight: '1.6',
                                        whiteSpace: 'pre-wrap'
                                      }}>
                                        {/* Show AI summary if available, otherwise show routine text */}
                                        {aiSummary || (categorizedRecs.routine.length > 0 
                                          ? categorizedRecs.routine.join('\n\n')
                                          : (typeof item === 'object' && item.type === 'routine' ? item.text : item))}
                                      </div>
                                    </details>
                                  )}
                                  
                                  {/* Tooltip for hovered products */}
                                  {hoveredProduct && (
                                    <div
                                      style={{
                                        position: 'fixed',
                                        left: `${hoveredProduct.x}px`,
                                        top: `${hoveredProduct.y}px`,
                                        transform: hoveredProduct.positionAbove ? 'translate(-50%, -100%)' : 'translateX(-50%)',
                                        backgroundColor: '#1a1a1a',
                                        color: '#FFFFFF',
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                        maxWidth: '250px',
                                        zIndex: 9999,
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                        pointerEvents: 'auto',
                                        whiteSpace: 'normal',
                                        wordWrap: 'break-word',
                                        lineHeight: '1.4',
                                        animation: 'fadeIn 0.2s ease-in',
                                        isolation: 'isolate',
                                        marginTop: hoveredProduct.positionAbove ? '-10px' : '10px'
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setHoveredProduct(null);
                                      }}
                                    >
                                      {hoveredProduct.text}
                                      {/* Arrow pointing in correct direction */}
                                      <div style={{
                                        position: 'absolute',
                                        ...(hoveredProduct.positionAbove ? { bottom: '-6px' } : { top: '-6px' }),
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: 0,
                                        height: 0,
                                        borderLeft: '6px solid transparent',
                                        borderRight: '6px solid transparent',
                                        ...(hoveredProduct.positionAbove ? { borderTop: '6px solid #1a1a1a' } : { borderBottom: '6px solid #1a1a1a' })
                                      }}></div>
                                    </div>
                                  )}
                                </div>
                              );
                            }
                            
                            // Priority 2: Parse text for alternate nights pattern (fallback)
                            // Only proceed if Priority 1 didn't render a calendar (no structured data)
                            // routineText is already declared at the start of this block
                            if (morningRoutine.length === 0 && eveningRoutine.length === 0) {
                              const schedule = parseRoutineSchedule(routineText);
                              
                              // Only show calendar if we have valid alternate nights with actual product names (not generic terms)
                              if (schedule && schedule.alternateNights && 
                                  (schedule.alternateNights.nightA.products.length > 0 || 
                                   schedule.alternateNights.nightB.products.length > 0) &&
                                  schedule.alternateNights.nightA.products.some(p => p && p.length > 5)) {
                              const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                              const dayAbbr = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                              
                              return (
                                <div style={{
                                  backgroundColor: '#F0F9FF',
                                  borderRadius: '12px',
                                  padding: '16px',
                                  marginBottom: '16px',
                                  border: '1px solid #DBEAFE'
                                }}>
                                  <div style={{
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    color: '#1a1a1a',
                                    marginBottom: '16px',
                                    textAlign: 'center'
                                  }}>
                                    Weekly Routine Schedule
                                  </div>
                                  
                                  {/* Calendar Grid - Scrollable Container */}
                                  <div style={{
                                    overflowX: 'auto',
                                    overflowY: 'visible',
                                    marginBottom: '16px',
                                    WebkitOverflowScrolling: 'touch',
                                    scrollbarWidth: 'thin',
                                    scrollbarColor: '#A9D1B0 #F0F9FF',
                                    position: 'relative',
                                    paddingBottom: '4px'
                                  }}>
                                    <div style={{
                                      display: 'grid',
                                      gridTemplateColumns: 'repeat(7, minmax(90px, 1fr))',
                                      gap: '8px',
                                      minWidth: '630px', // Minimum width for 7 columns (90px each + gaps)
                                      width: 'max-content'
                                    }}>
                                      {days.map((day, idx) => {
                                        const dayLower = day.toLowerCase();
                                        let nightRoutine = null;
                                        let nightLabel = '';
                                        
                                        // Determine which night routine for this day
                                        if (schedule.alternateNights.nightA.days.some(d => d.toLowerCase().includes(dayLower))) {
                                        nightRoutine = schedule.alternateNights.nightA.products;
                                        nightLabel = 'Night A';
                                      } else if (schedule.alternateNights.nightB.days.some(d => d.toLowerCase().includes(dayLower))) {
                                        nightRoutine = schedule.alternateNights.nightB.products;
                                        nightLabel = 'Night B';
                                      } else if (schedule.alternateNights.nightC.days.includes('remaining nights')) {
                                        nightRoutine = schedule.alternateNights.nightC.products;
                                        nightLabel = 'Night C';
                                      }
                                      
                                      return (
                                        <div
                                          key={day}
                                          style={{
                                            backgroundColor: '#FFFFFF',
                                            borderRadius: '8px',
                                            padding: '8px',
                                            border: '1px solid #E5E7EB',
                                            minHeight: '80px',
                                            display: 'flex',
                                            flexDirection: 'column'
                                          }}
                                        >
                                          <div style={{
                                            fontSize: '11px',
                                            fontWeight: '600',
                                            color: '#6B7280',
                                            marginBottom: '6px',
                                            textAlign: 'center'
                                          }}>
                                            {dayAbbr[idx]}
                                          </div>
                                          
                                          {/* Morning */}
                                          <div style={{
                                            fontSize: '9px',
                                            color: '#9CA3AF',
                                            marginBottom: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                          }}>
                                            <Sun size={10} style={{ color: '#F59E0B' }} />
                                            <span>AM</span>
                                          </div>
                                          {/* Only show morning products if they're actual product names, not generic terms */}
                                          {schedule.daily.morning.length > 0 && 
                                           schedule.daily.morning.some(p => p.length > 10) && (
                                            <div style={{
                                              fontSize: '9px',
                                              color: '#1a1a1a',
                                              marginBottom: '6px',
                                              lineHeight: '1.3'
                                            }}>
                                              {schedule.daily.morning.slice(0, 2).map((p, i) => {
                                                const isTruncated = p.length > 15;
                                                const displayText = isTruncated ? p.substring(0, 15) + '...' : p;
                                                return (
                                                  <div 
                                                    key={i}
                                                    data-product-tooltip
                                                    style={{ 
                                                      marginBottom: '2px',
                                                      cursor: isTruncated ? 'help' : 'default',
                                                      touchAction: 'manipulation'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                      if (isTruncated) {
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        const position = getTooltipPosition(rect);
                                                        setHoveredProduct({
                                                          text: p,
                                                          x: position.left,
                                                          y: position.top,
                                                          positionAbove: position.positionAbove
                                                        });
                                                      }
                                                    }}
                                                    onMouseMove={(e) => {
                                                      if (isTruncated && hoveredProduct?.text === p) {
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        const position = getTooltipPosition(rect);
                                                        setHoveredProduct({
                                                          text: p,
                                                          x: position.left,
                                                          y: position.top,
                                                          positionAbove: position.positionAbove
                                                        });
                                                      }
                                                    }}
                                                    onMouseLeave={() => {
                                                      if (isTruncated) {
                                                        setHoveredProduct(null);
                                                      }
                                                    }}
                                                    onTouchStart={(e) => {
                                                      if (isTruncated) {
                                                        e.stopPropagation();
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        const position = getTooltipPosition(rect);
                                                        const currentTooltip = hoveredProduct?.text === p;
                                                        setHoveredProduct(currentTooltip ? null : {
                                                          text: p,
                                                          x: position.left,
                                                          y: position.top,
                                                          positionAbove: position.positionAbove
                                                        });
                                                      }
                                                    }}
                                                    onClick={(e) => {
                                                      if (isTruncated) {
                                                        e.stopPropagation();
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        const position = getTooltipPosition(rect);
                                                        const currentTooltip = hoveredProduct?.text === p;
                                                        setHoveredProduct(currentTooltip ? null : {
                                                          text: p,
                                                          x: position.left,
                                                          y: position.top,
                                                          positionAbove: position.positionAbove
                                                        });
                                                      }
                                                    }}
                                                  >
                                                    • {displayText}
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          )}
                                          
                                          {/* Evening */}
                                          <div style={{
                                            fontSize: '9px',
                                            color: '#9CA3AF',
                                            marginBottom: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            marginTop: 'auto'
                                          }}>
                                            <Moon size={10} style={{ color: '#6B7280' }} />
                                            <span>PM</span>
                                          </div>
                                          {nightRoutine && nightRoutine.length > 0 ? (
                                            <div style={{
                                              fontSize: '9px',
                                              color: '#1a1a1a',
                                              backgroundColor: nightLabel === 'Night A' ? '#FEF3C7' : 
                                                              nightLabel === 'Night B' ? '#DBEAFE' : '#F3F4F6',
                                              padding: '4px',
                                              borderRadius: '4px',
                                              lineHeight: '1.3'
                                            }}>
                                              <div style={{ fontWeight: '600', marginBottom: '2px', fontSize: '8px' }}>
                                                {nightLabel}
                                              </div>
                                              {nightRoutine.map((p, i) => {
                                                const isTruncated = p.length > 20;
                                                const displayText = isTruncated ? p.substring(0, 20) + '...' : p;
                                                return (
                                                  <div 
                                                    key={i}
                                                    data-product-tooltip
                                                    style={{ 
                                                      marginBottom: '2px',
                                                      cursor: isTruncated ? 'help' : 'default',
                                                      touchAction: 'manipulation'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                      if (isTruncated) {
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        const position = getTooltipPosition(rect);
                                                        setHoveredProduct({
                                                          text: p,
                                                          x: position.left,
                                                          y: position.top,
                                                          positionAbove: position.positionAbove
                                                        });
                                                      }
                                                    }}
                                                    onMouseMove={(e) => {
                                                      if (isTruncated && hoveredProduct?.text === p) {
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        const position = getTooltipPosition(rect);
                                                        setHoveredProduct({
                                                          text: p,
                                                          x: position.left,
                                                          y: position.top,
                                                          positionAbove: position.positionAbove
                                                        });
                                                      }
                                                    }}
                                                    onMouseLeave={() => {
                                                      if (isTruncated) {
                                                        setHoveredProduct(null);
                                                      }
                                                    }}
                                                    onTouchStart={(e) => {
                                                      if (isTruncated) {
                                                        e.stopPropagation();
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        const position = getTooltipPosition(rect);
                                                        const currentTooltip = hoveredProduct?.text === p;
                                                        setHoveredProduct(currentTooltip ? null : {
                                                          text: p,
                                                          x: position.left,
                                                          y: position.top,
                                                          positionAbove: position.positionAbove
                                                        });
                                                      }
                                                    }}
                                                    onClick={(e) => {
                                                      if (isTruncated) {
                                                        e.stopPropagation();
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        const position = getTooltipPosition(rect);
                                                        const currentTooltip = hoveredProduct?.text === p;
                                                        setHoveredProduct(currentTooltip ? null : {
                                                          text: p,
                                                          x: position.left,
                                                          y: position.top,
                                                          positionAbove: position.positionAbove
                                                        });
                                                      }
                                                    }}
                                                  >
                                                    • {displayText}
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          ) : schedule.daily.evening.length > 0 ? (
                                            <div style={{
                                              fontSize: '9px',
                                              color: '#1a1a1a',
                                              lineHeight: '1.3'
                                            }}>
                                              {schedule.daily.evening.slice(0, 1).map((p, i) => {
                                                const isTruncated = p.length > 15;
                                                const displayText = isTruncated ? p.substring(0, 15) + '...' : p;
                                                return (
                                                  <div 
                                                    key={i}
                                                    data-product-tooltip
                                                    style={{ 
                                                      marginBottom: '2px',
                                                      cursor: isTruncated ? 'help' : 'default',
                                                      touchAction: 'manipulation'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                      if (isTruncated) {
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        const position = getTooltipPosition(rect);
                                                        setHoveredProduct({
                                                          text: p,
                                                          x: position.left,
                                                          y: position.top,
                                                          positionAbove: position.positionAbove
                                                        });
                                                      }
                                                    }}
                                                    onMouseMove={(e) => {
                                                      if (isTruncated && hoveredProduct?.text === p) {
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        const position = getTooltipPosition(rect);
                                                        setHoveredProduct({
                                                          text: p,
                                                          x: position.left,
                                                          y: position.top,
                                                          positionAbove: position.positionAbove
                                                        });
                                                      }
                                                    }}
                                                    onMouseLeave={() => {
                                                      if (isTruncated) {
                                                        setHoveredProduct(null);
                                                      }
                                                    }}
                                                    onTouchStart={(e) => {
                                                      if (isTruncated) {
                                                        e.stopPropagation();
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        const position = getTooltipPosition(rect);
                                                        const currentTooltip = hoveredProduct?.text === p;
                                                        setHoveredProduct(currentTooltip ? null : {
                                                          text: p,
                                                          x: position.left,
                                                          y: position.top,
                                                          positionAbove: position.positionAbove
                                                        });
                                                      }
                                                    }}
                                                    onClick={(e) => {
                                                      if (isTruncated) {
                                                        e.stopPropagation();
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        const position = getTooltipPosition(rect);
                                                        const currentTooltip = hoveredProduct?.text === p;
                                                        setHoveredProduct(currentTooltip ? null : {
                                                          text: p,
                                                          x: position.left,
                                                          y: position.top,
                                                          positionAbove: position.positionAbove
                                                        });
                                                      }
                                                    }}
                                                  >
                                                    • {displayText}
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          ) : null}
                                        </div>
                                      );
                                    })}
                                    </div>
                                  </div>
                                  
                                  {/* Legend */}
                                  <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '12px',
                                    justifyContent: 'center',
                                    fontSize: '11px',
                                    color: '#6B7280',
                                    paddingTop: '12px',
                                    borderTop: '1px solid #E5E7EB'
                                  }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <div style={{ width: '12px', height: '12px', backgroundColor: '#FEF3C7', borderRadius: '2px' }}></div>
                                      <span>Night A</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <div style={{ width: '12px', height: '12px', backgroundColor: '#DBEAFE', borderRadius: '2px' }}></div>
                                      <span>Night B</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <div style={{ width: '12px', height: '12px', backgroundColor: '#F3F4F6', borderRadius: '2px' }}></div>
                                      <span>Night C</span>
                                    </div>
                                  </div>
                                  
                                  {/* Full routine details (collapsible) */}
                                  {(aiSummary || routineText) && (
                                    <details style={{ marginTop: '12px' }}>
                                      <summary style={{
                                        fontSize: '12px',
                                        color: '#3B82F6',
                                        cursor: 'pointer',
                                        fontWeight: '500'
                                      }}>
                                        View full routine details
                                      </summary>
                                      <div style={{
                                        marginTop: '8px',
                                        padding: '12px',
                                        backgroundColor: '#FFFFFF',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        color: '#1a1a1a',
                                        lineHeight: '1.6',
                                        whiteSpace: 'pre-wrap'
                                      }}>
                                        {/* Show AI summary if available, otherwise show routine text */}
                                        {aiSummary || routineText}
                                      </div>
                                    </details>
                                  )}
                                  
                                  {/* Tooltip for hovered products */}
                                  {hoveredProduct && (
                                    <div
                                      style={{
                                        position: 'fixed',
                                        left: `${hoveredProduct.x}px`,
                                        top: `${hoveredProduct.y}px`,
                                        transform: hoveredProduct.positionAbove ? 'translate(-50%, -100%)' : 'translateX(-50%)',
                                        backgroundColor: '#1a1a1a',
                                        color: '#FFFFFF',
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                        maxWidth: '250px',
                                        zIndex: 9999,
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                        pointerEvents: 'auto',
                                        whiteSpace: 'normal',
                                        wordWrap: 'break-word',
                                        lineHeight: '1.4',
                                        animation: 'fadeIn 0.2s ease-in',
                                        isolation: 'isolate',
                                        marginTop: hoveredProduct.positionAbove ? '-10px' : '10px'
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setHoveredProduct(null);
                                      }}
                                    >
                                      {hoveredProduct.text}
                                      {/* Arrow pointing in correct direction */}
                                      <div style={{
                                        position: 'absolute',
                                        ...(hoveredProduct.positionAbove ? { bottom: '-6px' } : { top: '-6px' }),
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: 0,
                                        height: 0,
                                        borderLeft: '6px solid transparent',
                                        borderRight: '6px solid transparent',
                                        ...(hoveredProduct.positionAbove ? { borderTop: '6px solid #1a1a1a' } : { borderBottom: '6px solid #1a1a1a' })
                                      }}></div>
                                    </div>
                                  )}
                                </div>
                              );
                              }
                            }
                            
                            // Default text display - only show if we don't have structured data
                            // Don't try to parse/create calendar from text if we don't have reliable structured data
                            // routineText is already declared above
                            
                            // Default: Show text without trying to create unreliable calendar
                            return (
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
                            );
                          })()}
                          
                          {!isWarning && !isBenefit && !isRoutine && (
                            <div style={{
                              backgroundColor: '#F9FAFB',
                              borderRadius: '12px',
                              padding: '16px',
                              border: '1px solid #E5E7EB',
                              width: '100%',
                              boxSizing: 'border-box',
                              overflow: 'hidden',
                              wordWrap: 'break-word',
                              overflowWrap: 'break-word'
                            }}>
                              {/* Parse and structure the summary text */}
                              {(() => {
                                // Handle different item types properly
                                let text = '';
                                if (typeof item === 'string') {
                                  text = item;
                                } else if (typeof item === 'object' && item !== null) {
                                  // If it's an object, try to extract text or stringify safely
                                  if (item.text) {
                                    text = item.text;
                                  } else if (item.summary) {
                                    text = item.summary;
                                  } else {
                                    // Fallback: try to stringify, but handle circular references
                                    try {
                                      text = JSON.stringify(item, null, 2);
                                    } catch (e) {
                                      text = 'Unable to display content';
                                    }
                                  }
                                } else {
                                  text = String(item);
                                }
                                
                                const lines = text.split('\n').filter(line => line.trim());
                                
                                // Check if it's a safety score summary
                                const safetyMatch = text.match(/(safe|caution|high.?risk|risk score|score:?\s*\d+\/10)/i);
                                const conflictMatch = text.match(/found\s+(\d+)\s+conflict/i);
                                const routineMatch = text.match(/(morning|evening)\s+routine:/i);
                                
                                return (
                                  <div style={{ width: '100%', boxSizing: 'border-box' }}>
                                    {/* Safety Score Card */}
                                    {safetyMatch && (
                                      <div style={{
                                        backgroundColor: text.toLowerCase().includes('safe') ? '#F0FDF4' : 
                                                         text.toLowerCase().includes('caution') ? '#FFFBF0' : '#FFF5F3',
                                        borderRadius: '8px',
                                        padding: '12px',
                                        marginBottom: '16px',
                                        borderLeft: `4px solid ${text.toLowerCase().includes('safe') ? '#A9D1B0' : 
                                                                   text.toLowerCase().includes('caution') ? '#FAD28B' : '#FFB3A7'}`,
                                        width: '100%',
                                        boxSizing: 'border-box',
                                        overflow: 'hidden',
                                        wordWrap: 'break-word'
                                      }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
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
                                                   text.toLowerCase().includes('caution') ? '#D97706' : '#DC2626',
                                            wordBreak: 'break-word'
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
                                        borderLeft: '4px solid #FFB3A7', // Soft Coral/Peach warning
                                        width: '100%',
                                        boxSizing: 'border-box',
                                        overflow: 'hidden',
                                        wordWrap: 'break-word'
                                      }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                          <Zap size={18} style={{ color: '#FFB3A7' }} />
                                          <span style={{ fontSize: '14px', fontWeight: '600', color: '#DC2626', wordBreak: 'break-word' }}>
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
                                      marginTop: safetyMatch || conflictMatch ? '12px' : '0',
                                      width: '100%',
                                      boxSizing: 'border-box',
                                      overflow: 'hidden',
                                      wordWrap: 'break-word',
                                      overflowWrap: 'break-word'
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
                                              width: '100%',
                                              boxSizing: 'border-box',
                                              overflow: 'hidden',
                                              wordWrap: 'break-word',
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
                                              paddingLeft: '8px',
                                              width: '100%',
                                              boxSizing: 'border-box',
                                              overflow: 'hidden',
                                              wordWrap: 'break-word'
                                            }}>
                                              <span style={{ color: '#6B7280', marginTop: '4px', flexShrink: 0 }}>•</span>
                                              <span style={{ flex: 1, wordBreak: 'break-word', overflowWrap: 'break-word' }}>{trimmedLine.replace(/^[-•\d+\.]\s*/, '')}</span>
                                            </div>
                                          );
                                        }
                                        
                                        // Format paragraphs
                                        if (trimmedLine.length > 0) {
                                          return (
                                            <p key={lineIdx} style={{
                                              margin: lineIdx === 0 ? '0 0 12px 0' : '0 0 12px 0',
                                              color: '#374151',
                                              width: '100%',
                                              boxSizing: 'border-box',
                                              overflow: 'hidden',
                                              wordWrap: 'break-word',
                                              overflowWrap: 'break-word'
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

