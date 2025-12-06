import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  // Load from localStorage on mount
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const stored = localStorage.getItem('userProfile');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });
  
  const [analysisData, setAnalysisData] = useState(() => {
    try {
      const stored = localStorage.getItem('analysisData');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  // Save to localStorage whenever userProfile changes
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
    } else {
      localStorage.removeItem('userProfile');
    }
  }, [userProfile]);

  // Save to localStorage whenever analysisData changes
  useEffect(() => {
    if (analysisData) {
      localStorage.setItem('analysisData', JSON.stringify(analysisData));
    } else {
      localStorage.removeItem('analysisData');
    }
  }, [analysisData]);
  
  return (
    <UserContext.Provider value={{ 
      userProfile, 
      setUserProfile,
      analysisData,
      setAnalysisData
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

