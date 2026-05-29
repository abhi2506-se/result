// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Sora, JetBrains_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { AuthProvider } from "@/components/shared/auth-provider";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ACEM Result Portal | Azad College of Engineering & Management",
    template: "%s | ACEM Result Portal",
  },
  description:
    "Official Sessional & PUT Result Portal for Azad College of Engineering & Management. View, download and track your academic results.",
  keywords: [
    "ACEM",
    "Result Portal",
    "College Results",
    "Sessional Results",
    "PUT Results",
    "Engineering College",
  ],
  authors: [{ name: "ACEM IT Department" }],
  creator: "Azad College of Engineering & Management",
  openGraph: {
    type: "website",
    locale: "en_IN",
    title: "ACEM Result Portal",
    description: "Official Academic Result Portal for ACEM Students",
    siteName: "ACEM Result Portal",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0f1e",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sora.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans antialiased bg-[#080c18] text-white min-h-screen">
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "rgba(10, 15, 30, 0.95)",
                  color: "#e2e8f0",
                  border: "1px solid rgba(99, 179, 237, 0.2)",
                  backdropFilter: "blur(12px)",
                  fontFamily: "var(--font-sora)",
                  fontSize: "14px",
                  borderRadius: "12px",
                  padding: "12px 16px",
                },
                success: {
                  iconTheme: { primary: "#06b6d4", secondary: "#0a0f1e" },
                },
                error: {
                  iconTheme: { primary: "#f87171", secondary: "#0a0f1e" },
                },
              }}
            />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
