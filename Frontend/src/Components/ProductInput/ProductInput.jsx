import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Sun, Moon, Sunset } from 'lucide-react';

export default function ProductInput() {
  const navigate = useNavigate();
  const { userProfile, setAnalysisData } = useUser();
  const analyzeRoutine = useAction(api.functions.analysis.analyzeRoutine);
  
  const [products, setProducts] = useState([
    { 
      id: 1, 
      name: 'Drunk Elephant C-Firma Fresh Day Serum', 
      ingredients: '15% L-Ascorbic Acid (Vitamin C), Ferulic Acid, Vitamin E (Alpha Tocopherol)', 
      time: 'AM' 
    },
    { 
      id: 2, 
      name: 'The Ordinary Granactive Retinoid 2% Emulsion', 
      ingredients: '2% Granactive Retinoid (Hydroxypinacolone Retinoate), Retinol (in a lower concentration), Squalane, Glycerin', 
      time: 'Both' 
    }
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const addProduct = () => {
    setProducts([...products, { 
      id: Date.now(), 
      name: '', 
      ingredients: '', 
      time: 'AM' 
    }]);
  };

  const removeProduct = (id) => {
    if (products.length > 2) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const updateProduct = (id, field, value) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleBack = () => {
    navigate('/onboarding');
  };

  const handleAnalyze = async () => {
    // Validate input
    const filledProducts = products.filter(p => p.name && p.ingredients);
    if (filledProducts.length < 2) {
      alert('Please add at least 2 products with ingredients');
      return;
    }

    console.log('🚀 ===== STARTING ANALYSIS =====');
    console.log('📦 Products to analyze:', filledProducts.length);
    console.log('📋 Product details:', filledProducts.map(p => ({ name: p.name, time: p.time })));
    
    setIsAnalyzing(true);
    try {
      // Get userId from userProfile (saved during onboarding)
      const userId = userProfile?.userId || `temp_user_${Date.now()}`;
      
      console.log('👤 User ID:', userId);
      console.log('📤 Calling analyzeRoutine action...');
      console.log('⏳ This will call the backend LLM function - watch Convex terminal for logs!');
      
      // Call Convex mutation to analyze routine
      const result = await analyzeRoutine({
        userId,
        routineName: `Routine ${new Date().toLocaleDateString()}`,
        products: filledProducts.map(p => ({
          name: p.name,
          ingredientList: p.ingredients,
          usageTiming: p.time,
        })),
      });

      console.log('✅ Analysis complete! Result:', {
        analysisId: result.analysisId,
        routineId: result.routineId,
        safetyScore: result.safetyScore,
        conflictsFound: result.conflictsFound,
        ingredientsAnalyzed: result.ingredientsAnalyzed,
      });

      // Save result to context
      setAnalysisData({
        analysisId: result.analysisId,
        routineId: result.routineId,
        safetyScore: result.safetyScore,
        conflictsFound: result.conflictsFound,
        ingredientsAnalyzed: result.ingredientsAnalyzed,
      });

      console.log('📊 Navigating to analysis loading page...');
      // Navigate to loading/results page
      navigate('/analysis');
    } catch (error) {
      console.error('❌ Analysis failed:', error);
      console.error('Error details:', error.message, error.stack);
      alert('Failed to analyze routine. Please try again.');
    } finally {
      setIsAnalyzing(false);
      console.log('🏁 Analysis handler complete');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ paddingBottom: '80px' }}>
      {/* Header Section - Outside of white box */}
      <div className="mb-6 px-4 pt-6">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={handleBack}
            className="text-gray-700 hover:text-gray-900"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Add Your Products</h1>
        </div>
        <p className="text-gray-500 text-sm text-center px-8">
          Paste the ingredient list from each product you use.
        </p>
      </div>

      {/* White Container Box */}
      <div className="bg-white rounded-t-3xl p-6 shadow-sm min-h-screen">
        {/* Product Cards */}
        <div className="space-y-8">
          {products.map((product, index) => (
            <div key={product.id} className="relative">
              {/* Trash Icon - Top Right */}
              {products.length > 1 && (
                <button 
                  onClick={() => removeProduct(product.id)}
                  className="absolute -top-2 right-0 text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              )}

              {/* Product Name */}
              <div className="mb-4">
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  placeholder={index === 0 ? "e.g., The Ordinary Niacinamide 10%" : "e.g., CeraVe Foaming Cleanser"}
                  value={product.name}
                  onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder-gray-400"
                />
              </div>

              {/* Ingredients */}
              <div className="mb-4">
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Ingredients
                </label>
                <textarea
                  placeholder="Paste ingredients here...&#10;e.g., Aqua (Water), Niacinamide, Pentylene Glycol..."
                  value={product.ingredients}
                  onChange={(e) => updateProduct(product.id, 'ingredients', e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder-gray-400 resize-none"
                />
              </div>

              {/* When do you use this */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-3">
                  When do you use this?
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => updateProduct(product.id, 'time', 'AM')}
                    className={`flex-1 py-3 px-4 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                      product.time === 'AM'
                        ? 'bg-green-100 text-green-700 border-2 border-green-300'
                        : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Sun size={16} style={{ color: product.time === 'AM' ? '#16A34A' : '#6B7280' }} />
                    AM
                  </button>
                  <button
                    onClick={() => updateProduct(product.id, 'time', 'PM')}
                    className={`flex-1 py-3 px-4 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                      product.time === 'PM'
                        ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                        : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Moon size={16} style={{ color: product.time === 'PM' ? '#9333EA' : '#6B7280' }} />
                    PM
                  </button>
                  <button
                    onClick={() => updateProduct(product.id, 'time', 'Both')}
                    className={`flex-1 py-3 px-4 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
                      product.time === 'Both'
                        ? 'bg-green-100 text-green-700 border-2 border-green-300'
                        : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Sunset size={16} style={{ color: product.time === 'Both' ? '#16A34A' : '#6B7280' }} />
                    Both
                  </button>
                </div>
              </div>

              {/* Divider between products */}
              {index < products.length - 1 && (
                <div className="mt-8 border-t border-gray-100"></div>
              )}
            </div>
          ))}
        </div>

        {/* Add Another Product Button */}
        <button
          onClick={addProduct}
          className="w-full mt-8 py-3.5 px-4 bg-white border-2 border-dashed border-green-300 rounded-xl text-green-600 font-medium text-sm hover:border-green-400 hover:bg-green-50 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Another Product
        </button>

        {/* Analyze Button */}
        <button 
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="w-full mt-6 py-4 bg-green-400 hover:bg-green-500 text-white font-semibold rounded-2xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analyzing...
            </span>
          ) : (
            'Analyze My Routine'
          )}
        </button>
        <p className="text-center text-xs text-gray-400 mt-3">
          Minimum 2 products required
        </p>
      </div>
    </div>
  );
}
