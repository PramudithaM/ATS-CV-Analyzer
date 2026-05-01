import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "AI CV Analyzer",
  description: "Analyze your CV with AI and get personalized feedback to improve your chances of landing your dream job.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning={true} >
        {children}
        </body>
    </html>
  );
}
