"use client";

import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
};

const NavLink = ({ href, children }: NavLinkProps) => (
  <Link href={href} className="text-sm font-medium text-gray-300 transition-colors hover:text-indigo-400">
    {children}
  </Link>
);

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
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };
  
  const sizeClasses = "h-10 py-2 px-4";
  
  const classes = `${baseStyles} ${variants[variant]} ${sizeClasses} ${className}`;
  
  if (href) {
    return <Link href={href} className={classes} {...props}>{children}</Link>;
  }
  
  return <button className={classes} {...props}>{children}</button>;
};

type NavbarProps = {
  user: User | null;
};

export function Navbar({ user }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Close menu when clicking outside or pressing escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isMenuOpen && !target.closest('#mobile-menu') && !target.closest('#menu-button')) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('click', handleClickOutside);
    
    // Prevent scrolling when mobile menu is open
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900 shadow-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="h-6 w-6 text-indigo-400"
            >
              <circle cx="12" cy="12" r="10" />
              <rect x="6.5" y="8" width="5" height="3.5" rx="1" fill="currentColor" stroke="currentColor" />
              <rect x="12.5" y="8" width="5" height="3.5" rx="1" fill="currentColor" stroke="currentColor" />
              <line x1="11.5" y1="9.75" x2="12.5" y2="9.75" stroke="currentColor" />
              <line x1="6.5" y1="9" x2="5" y2="8" stroke="currentColor" />
              <line x1="17.5" y1="9" x2="19" y2="8" stroke="currentColor" />
            </svg>
            <span className="font-bold text-white">Agent Email</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#testimonials">Testimonials</NavLink>
          <NavLink href="#pricing">Pricing</NavLink>
          <NavLink href="#faq">FAQ</NavLink>
          <NavLink href="/api">API</NavLink>
        </nav>
        
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button 
            id="menu-button"
            className="md:hidden text-gray-300 hover:text-white focus:outline-none" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              className="w-6 h-6"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          
          {user ? (
            <Button href="/dashboard" variant="default">Dashboard</Button>
          ) : (
            <>
              <Button href="/signin" variant="ghost" className="hidden md:inline-flex text-gray-300 hover:text-white">Sign in</Button>
              <Button href="/signup" variant="default">Sign Up</Button>
            </>
          )}
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div 
          id="mobile-menu"
          className="md:hidden fixed inset-0 z-40 bg-gray-900 bg-opacity-95 backdrop-blur-sm overflow-y-auto"
        >
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-5 right-5 text-white hover:text-indigo-400 p-2 focus:outline-none z-50"
            aria-label="Close menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex flex-col p-8 pt-20 space-y-8">
            <nav className="flex flex-col space-y-6">
              <Link 
                href="#features" 
                className="text-xl font-medium text-white hover:text-indigo-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                href="#testimonials" 
                className="text-xl font-medium text-white hover:text-indigo-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </Link>
              <Link 
                href="#pricing" 
                className="text-xl font-medium text-white hover:text-indigo-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                href="#faq" 
                className="text-xl font-medium text-white hover:text-indigo-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link 
                href="/api" 
                className="text-xl font-medium text-white hover:text-indigo-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                API
              </Link>
            </nav>
            
            {!user && (
              <div className="flex flex-col space-y-4">
                <Link 
                  href="/signin" 
                  className="w-full py-3 text-center rounded-md text-white bg-gray-800 hover:bg-gray-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link 
                  href="/signup" 
                  className="w-full py-3 text-center rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
