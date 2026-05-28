import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://svoils.vercel.app"),
  title: { default: "Sri Venkateswara Oils — Pure Groundnuts & Cold Pressed Oils", template: "%s | SV Oils" },
  description: "Buy pure farm-fresh groundnuts and cold-pressed oils. Natural, chemical-free, delivered to your doorstep!",
  verification: { google: "Fj-U1UtssEQL8TjCnXPHrEChITt8hyGsETJF2H9ZjMs" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
