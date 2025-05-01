"use client";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-gray-900 relative overflow-hidden">
      {/* Background gradient elements */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-900 rounded-full mix-blend-screen filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 -right-4 w-72 h-72 bg-indigo-900 rounded-full mix-blend-screen filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            How Agent Email Works
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 relative hover:shadow-xl transition-shadow duration-300">
            <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
              1
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-100">Collect & Investigate</h3>
            <p className="text-gray-300">
              Receives an email address from your signup form or CRM and automatically researches their business website
            </p>
          </div>
          
          <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 relative hover:shadow-xl transition-shadow duration-300">
            <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
              2
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-100">Analyze & Craft</h3>
            <p className="text-gray-300">
              Uses AI to understand their business needs and creates a personalized welcome email that speaks directly to their challenges
            </p>
          </div>
          
          <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 relative hover:shadow-xl transition-shadow duration-300">
            <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
              3
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-100">Deliver & Convert</h3>
            <p className="text-gray-300">
              Provides ready-to-send email copy through your existing platform, turning cold signups into engaged prospects
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
