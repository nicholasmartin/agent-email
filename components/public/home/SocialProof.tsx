"use client";

import React from 'react';

// Define the props interface for the LogoPlaceholder component
interface LogoPlaceholderProps {
  name: string;
  icon: 'cube' | 'lightbulb' | 'rocket' | 'star' | 'globe';
}

export function SocialProof() {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              "Trusted by Industry Leaders" <span className="text-blue-500">(Someday!)</span>
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              We're still in early development, so no industry giants are using us yet. But here are some companies we've imagined using our product in our dreams:
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16 py-8">
            <LogoPlaceholder name="Completely Made Up Inc." icon="cube" />
            <LogoPlaceholder name="Wishful Thinking LLC" icon="lightbulb" />
            <LogoPlaceholder name="Not Real Corp." icon="rocket" />
            <LogoPlaceholder name="Figment of Imagination" icon="star" />
            <LogoPlaceholder name="Future Client™" icon="globe" />
          </div>
          <div className="mt-4 max-w-[700px] text-sm text-gray-400 italic">
            <p>* Your logo could be here! We're building something amazing and looking for early adopters who want to help shape the future of this product. Maybe you'll be our first real industry leader?</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Logo placeholder component with animated elements
function LogoPlaceholder({ name, icon }: LogoPlaceholderProps) {
  // Define which SVG icon to use based on the icon prop
  const renderIcon = () => {
    switch (icon) {
      case 'cube':
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        );
      case 'lightbulb':
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18h6M10 22h4M12 2v1M12 9v4M4.22 10a7 7 0 0 1 14.09-3.44M22 22l-1-1M18 18l-1-1M2 22l1-1M6 18l1-1M17 14a5 5 0 1 0-10 0 5 5 0 0 0 10 0z"></path>
          </svg>
        );
      case 'rocket':
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
          </svg>
        );
      case 'star':
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        );
      case 'globe':
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        );
      default:
        return <div>Icon not found</div>;
    }
  };

  return (
    <div className="group perspective-1000">
      <div className="relative flex flex-col items-center justify-center h-24 w-44 rounded-lg bg-gray-800 border border-gray-700 overflow-hidden transition-all duration-500 transform group-hover:shadow-lg hover:scale-105 group-hover:border-blue-400">
        {/* Background animation */}
        <div className="absolute inset-0 opacity-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full animate-pulse bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-25"></div>
          <div className="absolute -inset-1 bg-grid-white/5 opacity-20"></div>
        </div>
        
        {/* Icon with animation */}
        <div className="text-blue-400 group-hover:text-blue-300 transition-all duration-300 animate-float">
          {renderIcon()}
        </div>
        
        {/* Company name */}
        <div className="mt-2 font-mono text-xs text-gray-300 max-w-full px-2 truncate group-hover:text-white transition-all duration-300">
          {name}
        </div>
      </div>
    </div>
  );
}

