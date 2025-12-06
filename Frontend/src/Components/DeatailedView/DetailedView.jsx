import React from 'react';

export default function DetailedView() {
  return (
    <div className="min-h-screen bg-white overflow-y-auto">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white w-full">
          {/* Header */}
          <div className="p-6 pb-4 border-b border-gray-100">
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-lg font-semibold text-gray-800 pr-8">
                The Ordinary Retinol 0.5% <span className="text-red-500">✕</span> Paula's Choice C15 Booster
              </h2>
              <button className="text-gray-400 hover:text-gray-600 text-2xl leading-none -mt-1">
                ✕
              </button>
            </div>
            <div className="inline-block bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-2">
              High Severity Conflict
            </div>
            <p className="text-gray-600 text-sm">
              Combining these products may lead to irritation and reduced effectiveness.
            </p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Why This Is a Problem */}
            <section>
              <h3 className="text-base font-bold text-gray-900 mb-3">
                Why This Is a Problem
              </h3>
              <div className="text-sm text-gray-700 space-y-3 leading-relaxed">
                <p>
                  When used together in the same routine, certain active ingredients can destabilize each other, making them less effective. This combination can also be harsh on the skin barrier, leading to increased sensitivity, redness, and irritation reactions.
                </p>
                <p>
                  The key issue lies with the interaction between{' '}
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">
                    Retinol
                  </span>{' '}
                  and{' '}
                  <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded font-medium">
                    Vitamin C
                  </span>
                  . Both are powerful antioxidants but operate best at different pH levels. Using them simultaneously can neutralize their benefits and potentially cause adverse reactions.
                </p>
              </div>
            </section>

            {/* What You Should Do */}
            <section>
              <h3 className="text-base font-bold text-gray-900 mb-3">
                What You Should Do
              </h3>
              <div className="space-y-3">
                {/* Morning */}
                <div className="bg-amber-50 rounded-xl p-4 flex gap-3">
                  <div className="text-2xl">☀️</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                      Use Vitamin C in the Morning
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Apply your Vitamin C serum during your AM routine to take advantage of its protective antioxidant properties against daily environmental stressors.
                    </p>
                  </div>
                </div>

                {/* Night */}
                <div className="bg-indigo-50 rounded-xl p-4 flex gap-3">
                  <div className="text-2xl">🌙</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                      Use Retinol at Night
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Retinol can make your skin more sensitive to sunlight. Apply it only in your PM routine to support skin renewal while you sleep.
                    </p>
                  </div>
                </div>

                {/* Same Day */}
                <div className="bg-gray-50 rounded-xl p-4 flex gap-3">
                  <div className="text-2xl">⏰</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                      If Using on the Same Day
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Never apply them back-to-back. The best practice is to separate them into your AM routine (Vitamin C) and PM (Retinol) routines as mentioned above.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* For Your Sensitive Skin */}
            <section>
              <h3 className="text-base font-bold text-gray-900 mb-3">
                For Your Sensitive Skin
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Since your skin is prone to sensitivity, it's crucial to introduce these active ingredients slowly and avoid using them on the same day initially. You could alternate nights between Retinol and a hydrating serum.
              </p>
            </section>

            {/* Important Note */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex gap-3">
                <div className="text-red-500 text-xl flex-shrink-0">⚠️</div>
                <div>
                  <h4 className="font-bold text-red-800 mb-2 text-sm">
                    Important Note
                  </h4>
                  <p className="text-sm text-red-700 leading-relaxed">
                    Always wear a broad-spectrum sunscreen with SPF 30 or higher during the day when using Retinol, as it increases photosensitivity. If irritation occurs, stop use and consult a dermatologist.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

