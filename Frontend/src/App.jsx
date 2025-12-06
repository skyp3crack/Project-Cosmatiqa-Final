import { useState } from 'react';
import './App.css';
import WelcomePage from './Components/WelcomePage/WelcomePage';

function App() {
  const [currentPage, setCurrentPage] = useState('welcome');

  const handleGetStarted = () => {
    setCurrentPage('onboarding');
    // Later we'll navigate to onboarding page
  };

  return (
    <div>
      {currentPage === 'welcome' && (
        <WelcomePage onGetStarted={handleGetStarted} />
      )}
      {/* Add other pages here later */}
    </div>
  );
}

export default App
