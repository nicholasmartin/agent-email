"use client";

import Link from 'next/link';

type PricingTierProps = {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: {
    text: string;
    href: string;
  };
  popular?: boolean;
  timeframe?: string;
};

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
  className?: string;
  href?: string;
  [key: string]: any;
};

const Button = ({ children, variant = 'default', className = '', href, ...props }: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  
  const variants = {
    default: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };
  
  const sizeClasses = "h-10 py-2 px-4";
  
  const classes = `${baseStyles} ${variants[variant]} ${sizeClasses} ${className}`;
  
  if (href) {
    return <Link href={href} className={classes} {...props}>{children}</Link>;
  }
  
  return <button className={classes} {...props}>{children}</button>;
};

export function Pricing() {
  return (
    <section id="pricing" className="relative overflow-hidden bg-gray-900 py-20">
      {/* Background gradient elements */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-900 rounded-full mix-blend-screen filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-900 rounded-full mix-blend-screen filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-900 rounded-full mix-blend-screen filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-4">
          Our "Pricing" <span className="text-primary">(Eventually?)</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          We're in early development, so everything is currently free! But here's what our pricing <em>could</em> look like in an alternate universe where we've lost all sense of proportion:
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Free During Beta Plan */}
          
          <div className="bg-gray-800 p-8 rounded-xl shadow-xl border border-indigo-700 flex flex-col relative">
            <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
              MOST POPULAR
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-100 mb-2">Free During Beta</h3>
              <p className="text-gray-300">Yes, actually free. No credit card needed. No hidden fees. No kidding.</p>
            </div>
            
            <div className="mb-6">
              <p className="text-4xl font-bold text-gray-100">$0<span className="text-xl text-gray-400 font-normal">/mo</span></p>
              <p className="text-sm text-gray-400 mt-1">Billed monthly</p>
            </div>
            
            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-center">
                <svg
                  className="mr-3 h-5 w-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-300">All features included</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="mr-3 h-5 w-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-300">Unlimited usage</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="mr-3 h-5 w-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-300">Our eternal gratitude</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="mr-3 h-5 w-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-300">Updates as we build them</span>
              </li>
            </ul>
            
            <Button className="w-full py-6 text-base bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600" href="/signup">
              Register for Free
            </Button>
          </div>
          
          {/* Professional Plan */}
          <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 flex flex-col">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-100 mb-2">Wildly Unnecessary</h3>
              <p className="text-gray-300">For those who enjoy lighting money on fire for entertainment purposes.</p>
            </div>
            
            <div className="mb-6">
              <p className="text-4xl font-bold text-gray-100">$9,999<span className="text-xl text-gray-400 font-normal">/mo</span></p>
              <p className="text-sm text-gray-400 mt-1">Billed monthly</p>
            </div>
            
            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-center">
                <svg
                  className="mr-3 h-5 w-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-300">Exactly the same as free</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="mr-3 h-5 w-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-300">A digital high-five</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="mr-3 h-5 w-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-300">Your name in a text file</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="mr-3 h-5 w-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-300">We'll pronounce your name correctly</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="mr-3 h-5 w-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-300">A poem about your generosity</span>
              </li>
            </ul>
            
            <Button variant="outline" className="w-full py-6 text-base border-gray-600 text-gray-200 hover:bg-gray-700">
              Probably Don't Click
            </Button>
          </div>
          
          {/* Enterprise Plan */}
          <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 flex flex-col">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-100 mb-2">Comically Expensive</h3>
              <p className="text-gray-300">For billionaires who accidentally clicked on our website.</p>
            </div>
            
            <div className="mb-6">
              <p className="text-4xl font-bold text-gray-100">$1,000,000<span className="text-xl text-gray-400 font-normal">/lifetime</span></p>
              <p className="text-sm text-gray-400 mt-1">One-time payment</p>
            </div>
            
            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-center">
                <svg
                  className="mr-3 h-5 w-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-300">Still identical to free tier</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="mr-3 h-5 w-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-300">We'll name a server after you</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="mr-3 h-5 w-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-300">A handwritten thank-you note*</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="mr-3 h-5 w-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-300">Virtual cake on your birthday</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="mr-3 h-5 w-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-300">We'll laugh at your jokes</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="mr-3 h-5 w-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-300">* Note may be AI-generated</span>
              </li>
            </ul>
            
            <Button variant="outline" className="w-full py-6 text-base border-gray-600 text-gray-200 hover:bg-gray-700">
              Contact Our Therapist
            </Button>
          </div>
        </div>
        
        <div className="mt-16 bg-gray-800/50 p-8 rounded-xl border border-indigo-900/50">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold text-gray-100 mb-2">* All joking aside</h3>
              <p className="text-gray-300">This app is completely free while in development. We're focused on building something amazing first!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}