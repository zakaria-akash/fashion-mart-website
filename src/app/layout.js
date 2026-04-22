import "./globals.css";

export const metadata = {
  title: "Nickelfox Website Clone",
  description: "Website clone project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
