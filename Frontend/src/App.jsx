import { useState } from 'react';
import './App.css';
import WelcomePage from './Components/WelcomePage/WelcomePage';
import ResultsLoading from './Components/ResultsDashboard/ResultsLoading';
import DetailedView from './Components/DeatailedView/DetailedView';
import ProductInput from './Components/ProductInput/ProductInput';
import AnalysisLoading from './Components/AnalysisLoading/Analysis';

function App() {
  const [currentPage, setCurrentPage] = useState('analysis'); // Set to analysis

  const handleGetStarted = () => {
    setCurrentPage('onboarding');
    // Later we'll navigate to onboarding page
  };

  return (
    <div>
      {currentPage === 'welcome' && (
        <WelcomePage onGetStarted={handleGetStarted} />
      )}
      {currentPage === 'results' && (
        <ResultsLoading />
      )}
      {currentPage === 'detailed' && (
        <DetailedView />
      )}
      {currentPage === 'productinput' && (
        <ProductInput />
      )}
      {currentPage === 'analysis' && (
        <AnalysisLoading />
      )}
      {/* Add other pages here later */}
    </div>
  );
}

export default App
