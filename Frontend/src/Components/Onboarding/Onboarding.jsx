import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

const skinTypes = ['Normal', 'Oily', 'Dry', 'Combination', 'Sensitive'];

const skinConcerns = [
  'Acne',
  'Aging',
  'Hyperpigmentation',
  'Dryness',
  'Redness',
  'Oiliness',
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { setUserProfile } = useUser();
  const createProfile = useMutation(api.functions.users.createOrUpdateProfile);
  
  const [skinType, setSkinType] = useState('Normal');
  const [selectedConcerns, setSelectedConcerns] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleConcern = (concern) => {
    if (selectedConcerns.includes(concern)) {
      setSelectedConcerns(selectedConcerns.filter((c) => c !== concern));
    } else if (selectedConcerns.length < 3) {
      setSelectedConcerns([...selectedConcerns, concern]);
    }
  };

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      // Generate a temporary userId (in production, this would come from Clerk)
      const tempUserId = `temp_user_${Date.now()}`;
      
      // Save to Convex backend
      const result = await createProfile({
        userId: tempUserId,
        skinType: skinType.toLowerCase(),
        sensitivities: selectedConcerns,
        goals: selectedConcerns, // Using concerns as goals for now
      });

      // Also save to local context for immediate access
      // Include all fields that Profile component expects
      setUserProfile({ 
        userId: tempUserId,
        skinType: skinType.toLowerCase(), 
        sensitivities: selectedConcerns,
        goals: selectedConcerns, // Profile component uses 'goals' field
        concerns: selectedConcerns, // Keep for backwards compatibility
        profileId: result.profileId,
      });

      navigate('/product-input');
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50 flex items-center justify-center p-4" style={{ paddingBottom: '100px' }}>
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-amber-200/30 rounded-full blur-3xl" />

      <div className="w-full max-w-md">
        {/* Breadcrumb */}
        <p className="text-stone-500 text-sm mb-3 font-medium tracking-wide">
          Onboarding / <span className="text-stone-700">Skin Profile</span>
        </p>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={handleBack}
                className="w-10 h-10 rounded-full bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center transition-colors group"
              >
                <svg
                  className="w-5 h-5 text-emerald-600 group-hover:-translate-x-0.5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h1 className="text-lg font-semibold text-stone-800 tracking-tight">
                Create Profile
              </h1>
            </div>

            {/* Progress Bar */}
            <div className="flex gap-2 mb-8">
              <div className="flex-1 h-1.5 rounded-full bg-emerald-500" />
              <div className="flex-1 h-1.5 rounded-full bg-stone-200" />
              <div className="flex-1 h-1.5 rounded-full bg-stone-200" />
            </div>

            {/* Illustration */}
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center relative overflow-hidden">
                {/* Skincare bottles illustration */}
                <svg
                  viewBox="0 0 100 100"
                  className="w-24 h-24"
                  fill="none"
                >
                  {/* Back bottle */}
                  <rect
                    x="25"
                    y="35"
                    width="20"
                    height="40"
                    rx="3"
                    fill="#D4A574"
                  />
                  <rect
                    x="30"
                    y="28"
                    width="10"
                    height="8"
                    rx="2"
                    fill="#C4956A"
                  />
                  {/* Front bottle */}
                  <rect
                    x="45"
                    y="40"
                    width="25"
                    height="35"
                    rx="4"
                    fill="#E8C9A0"
                  />
                  <rect
                    x="52"
                    y="32"
                    width="11"
                    height="10"
                    rx="2"
                    fill="#D4B896"
                  />
                  {/* Plant leaves */}
                  <path
                    d="M60 25 Q70 15 75 25 Q70 30 60 25"
                    fill="#5D8A66"
                  />
                  <path
                    d="M62 28 Q72 22 78 32 Q70 35 62 28"
                    fill="#4A7A56"
                  />
                  <path
                    d="M58 30 Q65 20 72 28 Q65 34 58 30"
                    fill="#6B9A76"
                  />
                  {/* Decorative dots */}
                  <circle cx="32" cy="50" r="2" fill="#C4956A" opacity="0.5" />
                  <circle cx="38" cy="55" r="1.5" fill="#C4956A" opacity="0.5" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-stone-800 mb-2 tracking-tight">
                Find Your Perfect
                <br />
                Skincare Routine
              </h2>
              <p className="text-stone-500 text-sm leading-relaxed px-4">
                We'll analyze ingredient conflicts and create a personalized
                plan for your skin.
              </p>
            </div>

            {/* Skin Type Dropdown */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-stone-700 mb-2">
                What's your skin type?
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-3.5 bg-stone-50 border border-stone-200 rounded-xl text-left text-stone-700 font-medium flex items-center justify-between hover:border-stone-300 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
                >
                  {skinType}
                  <svg
                    className={`w-5 h-5 text-stone-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-stone-200 rounded-xl shadow-lg overflow-hidden">
                    {skinTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setSkinType(type);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-emerald-50 transition-colors ${
                          skinType === type
                            ? 'bg-emerald-50 text-emerald-700 font-medium'
                            : 'text-stone-700'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Skin Concerns */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-stone-700">
                  Select your skin concerns
                </label>
                <span className="text-xs text-stone-400 font-medium">
                  Select up to 3
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {skinConcerns.map((concern) => {
                  const isSelected = selectedConcerns.includes(concern);
                  return (
                    <button
                      key={concern}
                      onClick={() => toggleConcern(concern)}
                      disabled={!isSelected && selectedConcerns.length >= 3}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200 disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
                    >
                      {concern}
                      {isSelected && (
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="px-6 pb-6">
            <button
              onClick={handleContinue}
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving Profile...' : 'Continue'}
            </button>
          </div>
        </div>

        {/* Footer hint */}
        <p className="text-center text-stone-400 text-xs mt-4">
          Your data is secure and never shared
        </p>
      </div>
    </div>
  );
}
