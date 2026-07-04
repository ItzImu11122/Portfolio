import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "Imran Hossen - Professional Developer Portfolio & Android Apps Showcase",
  description: "Explore premium Android applications, utility softwares, NGO platforms, and specialized systems. Built by Senior Software Engineer, UI/UX Designer & Product Designer.",
  keywords: "Android, NextJS, Portfolio, Developer, Bangla Apps, Software Engineer, Firebase, Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="dark"
      style={{ colorScheme: 'dark' }}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700;800;900&family=Hind+Siliguri:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-customBg-light text-customText-light dark:bg-customBg-dark dark:text-customText-dark">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
