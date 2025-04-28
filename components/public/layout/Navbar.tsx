"use client";

import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { User } from '@supabase/supabase-js';

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
};

const NavLink = ({ href, children }: NavLinkProps) => (
  <Link href={href} className="text-sm font-medium transition-colors hover:text-primary">
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
  
  return <button className={classes} {...props}>{children}</button>;
};

type NavbarProps = {
  user: User | null;
};

export function Navbar({ user }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            
          <svg 
  viewBox="0 0 24 24" 
  fill="none" 
  stroke="currentColor" 
  stroke-width="2" 
  stroke-linecap="round" 
  stroke-linejoin="round" 
  className="h-6 w-6 text-primary"
>
  <circle cx="12" cy="12" r="10" />
  
  
  <rect x="6.5" y="8" width="5" height="3.5" rx="1" fill="currentColor" stroke="currentColor" />

  
  <rect x="12.5" y="8" width="5" height="3.5" rx="1" fill="currentColor" stroke="currentColor" />

 
  <line x1="11.5" y1="9.75" x2="12.5" y2="9.75" stroke="currentColor" />


  <line x1="6.5" y1="9" x2="5" y2="8" stroke="currentColor" />
  <line x1="17.5" y1="9" x2="19" y2="8" stroke="currentColor" />
</svg>


            
            <span className="font-bold">Agent Email</span>
          </Link>
        </div>
        <nav className="hidden md:flex gap-6">
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#testimonials">Testimonials</NavLink>
          <NavLink href="#pricing">Pricing</NavLink>
          <NavLink href="#faq">FAQ</NavLink>
        </nav>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-accent"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.752 15.002C20.5633 15.8568 19.1636 16.3464 17.7081 16.4138C16.2526 16.4813 14.8079 16.1247 13.5346 15.3835C12.2614 14.6423 11.2077 13.5515 10.5019 12.2391C9.79607 10.9266 9.46937 9.44922 9.55846 7.9703C9.64755 6.49139 10.1422 5.07075 10.988 3.86223C9.34869 4.2261 7.84429 5.0292 6.64472 6.17154C5.44516 7.31388 4.59427 8.75412 4.18537 10.3398C3.77647 11.9256 3.82554 13.5969 4.32616 15.1565C4.82677 16.7161 5.75884 18.1037 7.01745 19.1539C8.27606 20.2041 9.81521 20.875 11.4391 21.0826C13.063 21.2901 14.7153 21.0253 16.2016 20.3167C17.6879 19.6081 18.9445 18.4879 19.8178 17.0878C20.691 15.6877 21.1455 14.0647 21.133 12.4111C21.144 13.3037 21.0225 14.1925 20.775 15.041L21.752 15.002Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M4 12L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M22 12L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M19.7782 4.22166L18.364 5.63587" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M5.63602 18.364L4.22181 19.7782" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M19.7782 19.7782L18.364 18.364" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M5.63602 5.63593L4.22181 4.22171" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </button>
          {user ? (
            <Button href="/dashboard" variant="default">Dashboard</Button>
          ) : (
            <>
              <Button href="/signin" variant="ghost">Sign in</Button>
              <Button href="/signup" variant="default">Sign Up</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
