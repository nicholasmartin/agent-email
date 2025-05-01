"use client";

export function ProblemSolution() {
  return (
    <>
      {/* Micro-Agent Section */}
      <section className="relative overflow-hidden bg-gray-900 py-20">
        {/* Background gradient elements */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-900 rounded-full mix-blend-screen filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-900 rounded-full mix-blend-screen filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-900 rounded-full mix-blend-screen filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              The Micro-Agent That Fits Your Workflow
            </h2>
            <p className="max-w-[900px] text-gray-300 md:text-xl">
              Agent Email isn't another bloated platform you need to learn.<br />
              It's a specialized AI agent with one mission: <strong>Turn email addresses into personalized welcome emails.</strong>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 rounded-full bg-indigo-900/50 flex items-center justify-center mb-6">
                <span className="text-3xl">🔌</span>
              </div>
              <p className="text-lg font-semibold text-gray-100">Seamlessly plugs into your existing systems</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 rounded-full bg-purple-900/50 flex items-center justify-center mb-6">
                <span className="text-3xl">⚙️</span>
              </div>
              <p className="text-lg font-semibold text-gray-100">No disruption to your current processes</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 rounded-full bg-blue-900/50 flex items-center justify-center mb-6">
                <span className="text-3xl">🚀</span>
              </div>
              <p className="text-lg font-semibold text-gray-100">Deploy in minutes, not days</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dilemma Section */}
      <section className="py-20 bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              The Welcome Email Dilemma
            </h2>
            <p className="text-gray-300 md:text-xl max-w-3xl">
              See how Agent Email transforms common welcome email challenges into opportunities
            </p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-10">
            {/* Problems Column */}
            <div className="md:col-span-2 bg-gray-900 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
              <div className="bg-red-900/50 p-5 flex items-center space-x-3 border-b border-gray-700">
                <span className="text-2xl">⚠️</span>
                <h3 className="font-bold text-lg text-gray-100">Common Challenges</h3>
              </div>
              <div className="p-6 space-y-5">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-red-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 text-sm">✕</span>
                  </div>
                  <p className="text-gray-300">Generic welcome emails get ignored</p>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-red-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 text-sm">✕</span>
                  </div>
                  <p className="text-gray-300">Manual research takes too much time</p>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-red-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 text-sm">✕</span>
                  </div>
                  <p className="text-gray-300">New signups drift away without engagement</p>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-red-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 text-sm">✕</span>
                  </div>
                  <p className="text-gray-300">Too early to invest resources in manual follow-up</p>
                </div>
              </div>
            </div>
            
            {/* Divider */}
            <div className="hidden md:flex flex-col items-center justify-center">
              <div className="h-1/3 w-px bg-gray-700"></div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center my-4 shadow-md">
                <span className="text-white">→</span>
              </div>
              <div className="h-1/3 w-px bg-gray-700"></div>
            </div>
            
            {/* Solutions Column */}
            <div className="md:col-span-2 bg-gray-900 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
              <div className="bg-indigo-900/50 p-5 flex items-center space-x-3 border-b border-gray-700">
                <span className="text-2xl">✓</span>
                <h3 className="font-bold text-lg text-gray-100">Agent Email Solutions</h3>
              </div>
              <div className="p-6 space-y-5">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-indigo-600 text-sm">✓</span>
                  </div>
                  <p className="text-gray-300">Messages that feel hand-crafted and personal</p>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-indigo-600 text-sm">✓</span>
                  </div>
                  <p className="text-gray-300">Instant website analysis and personalization</p>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-indigo-600 text-sm">✓</span>
                  </div>
                  <p className="text-gray-300">Capture attention when interest is highest</p>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-indigo-600 text-sm">✓</span>
                  </div>
                  <p className="text-gray-300">Automated personalization at scale</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


    </>
  );
}
