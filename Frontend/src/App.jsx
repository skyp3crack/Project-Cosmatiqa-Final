import { Routes, Route } from 'react-router-dom';
import './App.css';
import WelcomePage from './Components/WelcomePage/WelcomePage';
import Onboarding from './Components/Onboarding/Onboarding';
import ResultsLoading from './Components/ResultsDashboard/ResultsLoading';
import DetailedView from './Components/DeatailedView/DetailedView';
import ProductInput from './Components/ProductInput/ProductInput';
import AnalysisLoading from './Components/AnalysisLoading/Analysis';

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/product-input" element={<ProductInput />} />
      <Route path="/analysis" element={<AnalysisLoading />} />
      <Route path="/results" element={<ResultsLoading />} />
      <Route path="/detailed" element={<DetailedView />} />
    </Routes>
  );
}

export default App;
