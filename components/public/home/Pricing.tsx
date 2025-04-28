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

const PricingTier = ({ name, price, description, features, cta, popular = false, timeframe = "/month" }: PricingTierProps) => (
  <div className={`rounded-lg border ${popular ? 'border-primary' : 'border-border'} p-6 shadow-sm relative flex flex-col h-full ${popular ? 'transform hover:scale-105 transition-transform duration-300' : ''}`}>
    {popular && (
      <div className="absolute -top-3 left-0 right-0 flex justify-center">
        <span className="bg-primary text-primary-foreground text-xs font-semibold py-1 px-3 rounded-full">
          Only Sensible Choice
        </span>
      </div>
    )}
    <div className="mb-4 mt-2">
      <h3 className="text-lg font-bold">{name}</h3>
      <div className="mt-2 flex items-baseline">
        <span className="text-3xl font-bold">${price}</span>
        <span className="ml-1 text-sm text-muted-foreground">{timeframe}</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
    <ul className="mb-6 mt-4 space-y-2 flex-grow">
      {features.map((feature: string, index: number) => (
        <li key={index} className="flex items-center text-sm">
          <svg
            className="mr-2 h-4 w-4 text-primary"
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
          {feature}
        </li>
      ))}
    </ul>
    <Button
      variant={popular ? 'default' : 'outline'}
      className="w-full"
      href={cta.href}
    >
      {cta.text}
    </Button>
  </div>
);

export function Pricing() {
  return (
    <section id="pricing" className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Our "Pricing" <span className="text-primary">(Eventually?)</span>
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              We're in early development, so everything is currently free! But here's what our pricing <em>could</em> look like in an alternate universe where we've lost all sense of proportion:
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
          <PricingTier
            name="Free During Beta"
            price="0"
            timeframe="/forever"
            description="Yes, actually free. No credit card needed. No hidden fees. No kidding."
            features={[
              "All features included",
              "Unlimited usage",
              "Community support",
              "Our eternal gratitude",
              "Updates as we build them"
            ]}
            cta={{ text: "Get Started", href: "/signup" }}
            
          />
          <PricingTier
            name="Wildly Unnecessary"
            price="9,999"
            description="For those who enjoy lighting money on fire for entertainment purposes."
            features={[
              "Exactly the same as free",
              "A digital high-five",
              "Your name in a text file",
              "We'll pronounce your name correctly",
              "A poem about your generosity"
            ]}
            cta={{ text: "Probably Don't Click", href: "#" }}
          />
          <PricingTier
            name="Comically Expensive"
            price="1,000,000"
            timeframe="/lifetime"
            description="For billionaires who accidentally clicked on our website."
            features={[
              "Still identical to free tier",
              "We'll name a server after you",
              "A handwritten thank-you note*",
              "Virtual cake on your birthday",
              "We'll laugh at your jokes",
              "* Note may be AI-generated"
            ]}
            cta={{ text: "Contact Our Therapist", href: "#" }}
          />
        </div>
        <div className="text-center mt-4 text-sm text-muted-foreground italic">
          <p>* All joking aside, this app is completely free while in development. We're focused on building something amazing first!</p>
        </div>
      </div>
    </section>
  );
}