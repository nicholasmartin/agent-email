import { Inter } from "next/font/google";
import { SidebarProvider } from "@/context/SidebarContext";
import { PostHogProvider } from "@/components/PostHogProvider";
import { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

const siteUrl = process.env.SITE_URL || 'https://agent-email.magloft.com';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Agent Email - Personalized Welcome Emails for B2B and SaaS",
    template: "%s | Agent Email"
  },
  description: "Generate personalized and relevant welcome emails to trials and opt-ins using AI. Increase engagement and conversion rates with tailored communication.",
  keywords: ["email automation", "AI email", "personalized emails", "B2B email", "SaaS email", "welcome emails", "lead nurturing", "email marketing"],
  authors: [{ name: "Agent Email Team" }],
  creator: "Agent Email",
  publisher: "Agent Email",
  formatDetection: {
    email: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Agent Email",
    title: "Agent Email - Personalized Welcome Emails for B2B and SaaS",
    description: "Generate personalized and relevant welcome emails to trials and opt-ins using AI. Increase engagement and conversion rates with tailored communication.",
    // We're not specifying images here since Next.js will use the opengraph-image.png file automatically
  },
  twitter: {
    card: "summary_large_image",
    title: "Agent Email - Personalized Welcome Emails",
    description: "Generate personalized and relevant welcome emails to trials and opt-ins using AI.",
    creator: "@AgentEmail",
    // We're not specifying images here since Next.js will use the twitter-image.png file automatically
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    // Add verification codes when you have them
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      {/* Google tag (gtag.js) */}
      <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-17049338259" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-17049338259');
          
          // Conversion tracking function
          function gtag_report_conversion(url) {
            var callback = function () {
              if (typeof(url) != 'undefined') {
                window.location = url;
              }
            };
            gtag('event', 'conversion', {
                'send_to': 'AW-17049338259/d6Z6CN6lhcEaEJOD4cE_',
                'value': 10000.0,
                'currency': 'IDR',
                'event_callback': callback
            });
            return false;
          }
        `}
      </Script>
      <body className="font-inter overflow-x-hidden">
        <PostHogProvider>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
