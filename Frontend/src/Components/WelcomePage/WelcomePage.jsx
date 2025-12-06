import React from 'react';

const WelcomePage = ({ onGetStarted }) => {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        backgroundColor: '#c5c5c5',
        backgroundImage: 'radial-gradient(circle, #999 1px, transparent 1px)',
        backgroundSize: '30px 30px'
      }}
    >
      {/* Header */}
      <h2 className="text-2xl md:text-3xl text-gray-700 font-light mb-8">
        Welcome to Cosmatiqa
      </h2>

      {/* Main Card */}
      <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-8 md:p-12">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div 
            className="w-64 h-64 flex items-center justify-center rounded-lg"
            style={{ backgroundColor: '#2d5f4f' }}
          >
            {/* Placeholder for logo - replace with your actual logo image */}
            <div className="text-center text-white">
              <div className="text-6xl mb-2">🍃</div>
              <p className="text-sm uppercase tracking-wider">Cosmatiqa</p>
            </div>
            {/* Uncomment below and add your logo image */}
            {/* <img 
              src="/src/assets/cosmatiqa-logo.png" 
              alt="Cosmatiqa Logo" 
              className="w-full h-full object-contain p-8"
            /> */}
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-6 leading-tight">
          Your Personalized Skincare Journey Starts Here
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-center text-base md:text-lg mb-12 leading-relaxed">
          Analyze ingredients, avoid conflicts, and optimize your routine for healthier skin.
        </p>

        {/* Get Started Button */}
        <button
          onClick={onGetStarted}
          className="w-full py-4 rounded-xl font-semibold text-lg text-white transition-all duration-200 hover:shadow-lg hover:scale-105"
          style={{ backgroundColor: '#6b9d8a' }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#5d8978'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#6b9d8a'}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
