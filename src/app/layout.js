import "./globals.css";
import AppFooter from "@/components/home/AppFooter";
import Header from "@/components/home/Header";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { Poppins } from "next/font/google";

/**
 * Global font configuration using Next.js font optimization.
 * Poppins is used for all branding and body text.
 */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "900"],
  display: "swap",
});

/**
 * SEO and Document Metadata.
 */
export const metadata = {
  title: "Fashion Mart",
  description: "High-fidelity website clone project built with Next.js and MongoDB.",
  icons: {
    icon: "/images/tab-icon.png",
  },
};

/**
 * RootLayout Component
 * Defines the master shell for the entire application.
 * Includes app-wide providers for authentication and notifications.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${poppins.className} min-h-full`}>
        {/* Global Toast notifications layer */}
        <ToastProvider>
          {/* Global User session management layer */}
          <AuthProvider>
            {/* Global navigation header */}
            <Header />

            {/* Dynamic page content */}
            {children}

            {/* Global site footer */}
            <AppFooter />
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
