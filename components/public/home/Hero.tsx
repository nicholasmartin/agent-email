"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
  className?: string;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  [key: string]: any;
};

const Button = ({ children, variant = 'default', className = '', href, type = 'button', ...props }: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  
  const variants = {
    default: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };
  
  const sizeClasses = "h-10 py-2 px-4";
  
  const classes = `${baseStyles} ${variants[variant]} ${sizeClasses} ${className}`;
  
  if (href) {
    return <Link href={href} className={classes} {...props}>{children}</Link>;
  }
  
  return <button type={type} className={classes} {...props}>{children}</button>;
};

export function Hero() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [formStatus, setFormStatus] = useState<{
    message: string;
    type: 'success' | 'error' | 'loading' | '';
    jobId?: string;
  }>({
    message: '',
    type: '',
  });
  const [jobStatus, setJobStatus] = useState<{
    status: string;
    progress: number;
    message: string;
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus({ message: 'Processing your request...', type: 'loading' });

    try {
      // Submit form data to the demo registration endpoint
      const response = await fetch('/api/demo/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-form-secret': process.env.NEXT_PUBLIC_WEBSITE_FORM_SECRET || ''
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setFormStatus({
        message: 'Success! We\'re generating your personalized email.',
        type: 'success',
        jobId: data.jobId
      });

      // Start polling for job status
      if (data.jobId) {
        pollJobStatus(data.jobId);
      }
    } catch (error: any) {
      setFormStatus({
        message: error.message || 'An error occurred. Please try again.',
        type: 'error'
      });
    }
  };

  const pollJobStatus = async (jobId: string) => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/demo/status/${jobId}`, {
          headers: {
            'x-form-secret': process.env.NEXT_PUBLIC_WEBSITE_FORM_SECRET || ''
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch status');
        }
        
        const data = await response.json();
        
        setJobStatus({
          status: data.status,
          progress: data.progress,
          message: data.statusMessage
        });
        
        if (data.status !== 'completed' && data.status !== 'failed' && data.status !== 'rejected') {
          // Continue polling if job is not complete
          setTimeout(checkStatus, 3000);
        }
      } catch (error) {
        console.error('Error checking job status:', error);
      }
    };
    
    // Start polling
    checkStatus();
  };

  return (
    <section className="relative overflow-hidden bg-gray-900 py-20">
      {/* Background gradient elements */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-900 rounded-full mix-blend-screen filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-900 rounded-full mix-blend-screen filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-900 rounded-full mix-blend-screen filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col space-y-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-4">
                The AI Welcome Email <span className="font-extrabold">Specialist</span> for B2B & SaaS
              </h1>
              <p className="text-xl text-gray-300 max-w-lg">
                Transform business email signups into engaged customers with personalized welcome emails that feel hand-crafted.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input 
                    type="text" 
                    id="firstName" 
                    name="firstName" 
                    placeholder="First Name" 
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  />
                </div>
                <div>
                  <input 
                    type="text" 
                    id="lastName" 
                    name="lastName" 
                    placeholder="Last Name" 
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-lg border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="Business Email Address" 
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-3 border rounded-lg border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                />
                <Button type="submit" variant="default" className="uppercase font-bold text-base px-6">
                  Try It Free
                </Button>
              </div>
              
              {formStatus.message && (
                <div className={`p-4 rounded-lg ${formStatus.type === 'error' ? 'bg-red-900/30 text-red-300' : formStatus.type === 'success' ? 'bg-green-900/30 text-green-300' : 'bg-indigo-900/30 text-indigo-300'}`}>
                  {formStatus.message}
                </div>
              )}
              
              {jobStatus && (
                <div className="mt-4">
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${jobStatus.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm mt-2 text-gray-300">{jobStatus.message}</p>
                </div>
              )}
              
              <p className="text-xs text-gray-400">
                See the magic for yourself – submit your business email and watch Agent Email craft a personalized welcome message just for you.
              </p>
            </form>
          </div>
          
          <div className="relative hidden md:block">
            <div className="relative h-[500px] w-full perspective-1000">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full max-w-lg">
                  <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-900 rounded-full mix-blend-screen filter blur-xl opacity-30 animate-blob"></div>
                  <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-900 rounded-full mix-blend-screen filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                  <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-900 rounded-full mix-blend-screen filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
                  <Image 
                    src="/images/agent-smith.png" 
                    alt="Agent Email AI Character" 
                    width={400} 
                    height={450} 
                    className="relative z-10 w-auto h-auto object-contain drop-shadow-2xl animate-float"
                    priority
                  />
                </div>
              </div>
            </div>
            
            <style jsx>{`
              @keyframes blob {
                0% { transform: translate(0px, 0px) scale(1); }
                33% { transform: translate(30px, -50px) scale(1.1); }
                66% { transform: translate(-20px, 20px) scale(0.9); }
                100% { transform: translate(0px, 0px) scale(1); }
              }
              .animate-blob {
                animation: blob 7s infinite;
              }
              .animation-delay-2000 {
                animation-delay: 2s;
              }
              .animation-delay-4000 {
                animation-delay: 4s;
              }
            `}</style>
            
            <div className="absolute top-10 right-10 bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 flex items-center space-x-3 animate-float">
              <span className="text-2xl">🤖</span>
              <span className="font-medium text-gray-200">AI-Powered Research</span>
            </div>
            
            <div className="absolute bottom-20 left-0 bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 flex items-center space-x-3 animate-float animation-delay-2000">
              <span className="text-2xl">✉️</span>
              <span className="font-medium text-gray-200">Personalized Emails</span>
            </div>
            
            <div className="absolute bottom-40 right-0 bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 flex items-center space-x-3 animate-float animation-delay-4000">
              <span className="text-2xl">⚙️</span>
              <span className="font-medium text-gray-200">Automated Workflow</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
