import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Onboarding2() {
  const navigate = useNavigate();
  const [skinSensitivity, setSkinSensitivity] = useState('Somewhat');
  const [experience, setExperience] = useState('Intermediate');
  const [mainGoals, setMainGoals] = useState(['Reduce signs']);
  const [budget, setBudget] = useState('$$$ Mid-range');
  const [ingredients, setIngredients] = useState(['Fragrance-free', 'Cruelty-free']);

  const sensitivityOptions = ['Not Sensitive', 'Somewhat', 'Very Sensitive'];
  const experienceOptions = [
    { label: 'Beginner', subtitle: "I'm just starting out" },
    { label: 'Intermediate', subtitle: 'I have a basic skin care routine' },
    { label: 'Advanced', subtitle: 'Experienced with many ingredients' }
  ];
  const goalOptions = ['Clear acne', 'Reduce signs', 'Even skin tone', 'Hydrate & repair'];
  const budgetOptions = ['$ Drugstore', '$$$ Mid-range', '$$$$ Luxury', 'No preference'];
  const ingredientOptions = ['Fragrance-free', 'Natural/Organic', 'Vegan', 'Cruelty-free', 'No preference'];

  const toggleGoal = (goal) => {
    if (mainGoals.includes(goal)) {
      setMainGoals(mainGoals.filter(g => g !== goal));
    } else {
      setMainGoals([...mainGoals, goal]);
    }
  };

  const toggleIngredient = (ingredient) => {
    if (ingredients.includes(ingredient)) {
      setIngredients(ingredients.filter(i => i !== ingredient));
    } else {
      setIngredients([...ingredients, ingredient]);
    }
  };

  const handleContinue = () => {
    const step2Data = {
      skinSensitivity,
      experience,
      mainGoals,
      budget,
      ingredients
    };
    // Save to localStorage
    localStorage.setItem('skinPreferences', JSON.stringify(step2Data));
    // Navigate to product input
    navigate('/onboarding-3');
  };

  const handleBack = () => {
    // Navigate back to step 1
    navigate('/onboarding');
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      padding: '0',
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
      backgroundColor: 'white'
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
      borderRadius: '10px',
      backgroundColor: '#e5e7eb'
    },
    progressBarActive: {
      backgroundColor: '#10b981'
    },
    content: {
      padding: '20px 16px',
      maxWidth: '600px',
      margin: '0 auto'
    },
    section: {
      marginBottom: '28px'
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '12px'
    },
    sectionSubtitle: {
      fontSize: '13px',
      color: '#6b7280',
      marginBottom: '10px'
    },
    optionsRow: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap'
    },
    optionButton: {
      padding: '10px 18px',
      fontSize: '13px',
      fontWeight: '500',
      borderRadius: '20px',
      border: '1px solid #d1d5db',
      backgroundColor: 'white',
      color: '#4b5563',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    optionButtonSelected: {
      backgroundColor: '#10b981',
      color: 'white',
      borderColor: '#10b981'
    },
    experienceCard: {
      padding: '14px 16px',
      borderRadius: '12px',
      border: '2px solid #e5e7eb',
      backgroundColor: 'white',
      marginBottom: '10px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      position: 'relative'
    },
    experienceCardSelected: {
      borderColor: '#10b981',
      backgroundColor: '#f0fdf4'
    },
    experienceLabel: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '4px'
    },
    experienceSubtitle: {
      fontSize: '12px',
      color: '#6b7280'
    },
    radioCircle: {
      position: 'absolute',
      right: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      border: '2px solid #d1d5db',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    radioCircleSelected: {
      borderColor: '#10b981',
      backgroundColor: '#10b981'
    },
    radioInner: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: 'white'
    },
    continueButton: {
      width: '100%',
      padding: '16px',
      backgroundColor: '#10b981',
      color: 'white',
      fontSize: '15px',
      fontWeight: '600',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      marginTop: '32px',
      marginBottom: '20px'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={handleBack} style={styles.backButton}>
          <ChevronLeft size={20} color="#6b7280" />
        </button>
        <span style={styles.headerText}>Tell Us More</span>
      </div>

      {/* Progress */}
      <div style={styles.progressContainer}>
        <div style={styles.progressLabel}>Step 2 of 3</div>
        <div style={styles.progressBars}>
          <div style={{...styles.progressBar, ...styles.progressBarActive}}></div>
          <div style={{...styles.progressBar, ...styles.progressBarActive}}></div>
          <div style={{...styles.progressBar}}></div>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* Skin Sensitivity */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>How sensitive is your skin?</div>
          <div style={styles.optionsRow}>
            {sensitivityOptions.map(option => (
              <button
                key={option}
                onClick={() => setSkinSensitivity(option)}
                style={{
                  ...styles.optionButton,
                  ...(skinSensitivity === option ? styles.optionButtonSelected : {})
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Your skincare experience</div>
          {experienceOptions.map(option => (
            <div
              key={option.label}
              onClick={() => setExperience(option.label)}
              style={{
                ...styles.experienceCard,
                ...(experience === option.label ? styles.experienceCardSelected : {})
              }}
            >
              <div style={styles.experienceLabel}>{option.label}</div>
              <div style={styles.experienceSubtitle}>{option.subtitle}</div>
              <div style={{
                ...styles.radioCircle,
                ...(experience === option.label ? styles.radioCircleSelected : {})
              }}>
                {experience === option.label && <div style={styles.radioInner}></div>}
              </div>
            </div>
          ))}
        </div>

        {/* Main Goals */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>What's your main goal?</div>
          <div style={styles.sectionSubtitle}>Select one</div>
          <div style={styles.optionsRow}>
            {goalOptions.map(goal => (
              <button
                key={goal}
                onClick={() => toggleGoal(goal)}
                style={{
                  ...styles.optionButton,
                  ...(mainGoals.includes(goal) ? styles.optionButtonSelected : {})
                }}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Budget preference</div>
          <div style={styles.sectionSubtitle}>Optional</div>
          <div style={styles.optionsRow}>
            {budgetOptions.map(option => (
              <button
                key={option}
                onClick={() => setBudget(option)}
                style={{
                  ...styles.optionButton,
                  ...(budget === option ? styles.optionButtonSelected : {})
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Ingredient Preferences */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Ingredient preferences</div>
          <div style={styles.sectionSubtitle}>Select all that apply</div>
          <div style={styles.optionsRow}>
            {ingredientOptions.map(ingredient => (
              <button
                key={ingredient}
                onClick={() => toggleIngredient(ingredient)}
                style={{
                  ...styles.optionButton,
                  ...(ingredients.includes(ingredient) ? styles.optionButtonSelected : {})
                }}
              >
                {ingredient}
              </button>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <button onClick={handleContinue} style={styles.continueButton}>
          Continue
        </button>
      </div>
    </div>
  );
}