import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

export default function AnalysisLoading() {
  const navigate = useNavigate();
  const { analysisData } = useUser();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Analyzing ingredients...",
    "Checking compatibility...",
    "Cross-referencing our database...",
    "Generating your routine..."
  ];

  // Redirect if no analysis data (shouldn't happen in normal flow)
  useEffect(() => {
    if (!analysisData) {
      console.warn('No analysis data found, redirecting to product input');
      navigate('/product-input');
    }
  }, [analysisData, navigate]);

  useEffect(() => {
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    // Change step text
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 2500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, []);

  // Navigate to results when progress completes
  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        navigate('/results');
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [progress, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#F8F5F1', paddingBottom: '80px' }}>
      {/* Flask Icon Circle */}
      <div className="relative mb-16">
        {/* Outer glow circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 rounded-full opacity-20 animate-pulse" style={{ backgroundColor: '#A9D1B0' }}></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full opacity-30 animate-pulse" style={{ backgroundColor: '#A9D1B0', animationDelay: '0.5s' }}></div>
        </div>
        
        {/* Main circle */}
        <div className="relative w-32 h-32 rounded-full shadow-lg flex items-center justify-center" style={{ backgroundColor: '#FFFFFF' }}>
          <svg className="w-16 h-16" fill="#A9D1B0" viewBox="0 0 24 24">
            <path d="M6 2C5.448 2 5 2.448 5 3V5H4C3.448 5 3 5.448 3 6V8C3 8.552 3.448 9 4 9V19C4 20.105 4.895 21 6 21H18C19.105 21 20 20.105 20 19V9C20.552 9 21 8.552 21 8V6C21 5.448 20.552 5 20 5H19V3C19 2.448 18.552 2 18 2H6ZM7 4H17V5H7V4ZM6 7H18V9H17H7H6V7ZM6 11H18V19H6V11ZM10 13V17H14V13H10Z"/>
          </svg>
        </div>
      </div>

      {/* Progress Section */}
      <div className="w-full max-w-sm">
        {/* Status Text and Percentage */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-gray-600 font-medium text-sm">
            {steps[currentStep]}
          </p>
          <span className="text-gray-500 font-semibold text-sm">
            {progress}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%`, backgroundColor: '#A9D1B0' }}
          ></div>
        </div>

        {/* Current Step Text */}
        <p className="text-gray-400 text-xs mt-3 text-center">
          {steps[(currentStep + 1) % steps.length]}
        </p>
      </div>
    </div>
  );
}
