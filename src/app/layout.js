import "./globals.css";
import AppFooter from "@/components/home/AppFooter";
import Header from "@/components/home/Header";
import { Poppins } from "next/font/google";

// Global font configuration used across the full application.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "900"],
  display: "swap",
});

// Base SEO and browser tab metadata.
export const metadata = {
  title: "Fashion Mart",
  description: "Website clone project",
  icons: {
    icon: "/images/tab-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    // Root document shell used by all pages/components.
    <html lang="en" className="h-full antialiased">
      {/* Global font class is attached to body so all content inherits Poppins. */}
      <body className={`${poppins.className} min-h-full`}>
        {/* App-wide header shared by all pages. */}
        <Header />

        {/* Current route content. */}
        {children}

        {/* App-wide footer shared by all pages. */}
        <AppFooter />
      </body>
    </html>
  );
}
