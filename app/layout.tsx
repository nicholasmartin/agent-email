import { Inter } from "next/font/google";
import { SidebarProvider } from "@/context/SidebarContext";
import { PostHogProvider } from "@/components/PostHogProvider";
import "./globals.css";

export const metadata = {
  title: "Agent Email - Personalized Welcome Emails for B2B and SaaS",
  description: "Generate personalized and relevant welcome emails to trials and opt-ins using AI.",
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
      <body className="font-inter">
        <PostHogProvider>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
