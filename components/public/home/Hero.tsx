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
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
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
    <section className="pt-16 pb-16 md:pt-20 md:pb-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col space-y-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              The AI Welcome Email <span className="text-primary">Specialist</span> for SaaS Businesses
            </h1>
            <p className="text-xl text-muted-foreground">
              Transform business email signups into engaged customers with personalized welcome emails that feel hand-crafted.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 rounded-lg shadow-sm border">
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
                    className="w-full px-3 py-2 border rounded-md border-input bg-background"
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
                    className="w-full px-3 py-2 border rounded-md border-input bg-background"
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
                  className="flex-1 px-3 py-2 border rounded-md border-input bg-background"
                />
                <Button type="submit" variant="default" className="uppercase font-bold">
                  Try It Free
                </Button>
              </div>
              
              {formStatus.message && (
                <div className={`p-3 rounded-md ${formStatus.type === 'error' ? 'bg-destructive/10 text-destructive' : formStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-muted'}`}>
                  {formStatus.message}
                </div>
              )}
              
              {jobStatus && (
                <div className="mt-4">
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full transition-all duration-500" 
                      style={{ width: `${jobStatus.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm mt-2 text-muted-foreground">{jobStatus.message}</p>
                </div>
              )}
              
              <p className="text-xs text-muted-foreground">
                See the magic for yourself – submit your business email and watch Agent Email craft a personalized welcome message just for you.
              </p>
            </form>
          </div>
          
          <div className="relative hidden md:block">
            <div className="relative h-[400px] w-full">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image 
                  src="/images/agent-smith.png" 
                  alt="Agent Email AI Character" 
                  width={350} 
                  height={400} 
                  className="w-auto h-auto object-contain"
                  priority
                />
              </div>
            </div>
            
            <style jsx>{`
              @keyframes float1 {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
                100% { transform: translateY(0px); }
              }
              @keyframes float2 {
                0% { transform: translateY(0px); }
                50% { transform: translateY(10px); }
                100% { transform: translateY(0px); }
              }
              @keyframes float3 {
                0% { transform: translateX(0px); }
                50% { transform: translateX(-10px); }
                100% { transform: translateX(0px); }
              }
              .float-card-1 {
                animation: float1 4s ease-in-out infinite;
              }
              .float-card-2 {
                animation: float2 5s ease-in-out infinite;
              }
              .float-card-3 {
                animation: float3 6s ease-in-out infinite;
              }
            `}</style>
            
            <div className="absolute top-10 right-10 bg-card p-3 rounded-lg shadow-lg border flex items-center space-x-2 float-card-1">
              <span className="text-primary text-xl">🤖</span>
              <span>AI-Powered Research</span>
            </div>
            
            <div className="absolute bottom-20 left-0 bg-card p-3 rounded-lg shadow-lg border flex items-center space-x-2 float-card-2">
              <span className="text-primary text-xl">✉️</span>
              <span>Personalized Emails</span>
            </div>
            
            <div className="absolute bottom-40 right-0 bg-card p-3 rounded-lg shadow-lg border flex items-center space-x-2 float-card-3">
              <span className="text-primary text-xl">⚙️</span>
              <span>Automated Workflow</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
