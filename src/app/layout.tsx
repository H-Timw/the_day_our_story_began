import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";
import { LanguageProvider } from "@/contexts/language-context";
import { ThemeProvider } from "./components/theme-provider";
import "./globals.css";

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Day Our Story Began",
  description: "Keep your precious memories close, forever <3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className={`${firaCode.variable} antialiased`}>
        <LanguageProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            themes={["light", "dark", "lover"]}
          >
            {children}
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
