import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userProfile, setUserProfile] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  
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

