import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://svoils.vercel.app"),
  title: {
    default: "Sri Venkateswara Oils — Pure Groundnuts & Cold Pressed Oils",
    template: "%s | Sri Venkateswara Oils",
  },
  description: "Buy pure farm-fresh groundnuts and cold-pressed groundnut & coconut oils. Natural, chemical-free, delivered to your doorstep. Order on WhatsApp!",
  keywords: [
    "groundnut oil", "coconut oil", "cold pressed oil", "fresh groundnuts",
    "pure groundnut oil", "natural oils", "farm fresh groundnuts",
    "Sri Venkateswara Oils", "SV Oils", "groundnuts online"
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://svoils.vercel.app",
    siteName: "Sri Venkateswara Oils",
    title: "Sri Venkateswara Oils — Pure Groundnuts & Cold Pressed Oils",
    description: "Buy pure farm-fresh groundnuts and cold-pressed oils. Natural, chemical-free!",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Sri Venkateswara Oils" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sri Venkateswara Oils — Pure Groundnuts & Cold Pressed Oils",
    description: "Buy pure farm-fresh groundnuts and cold-pressed oils. Natural, chemical-free!",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  verification: {
    google: "Fj-U1UtssEQL8TjCnXPHrEChITt8hyGsETJF2H9ZjMs",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
