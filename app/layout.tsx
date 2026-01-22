import type { Metadata, Viewport } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const isDev = process.env.NEXT_PUBLIC_APP_ENV === "development";

export const metadata: Metadata = {
  title: isDev ? "NWZ Dev" : "NWZ & CO.",
  description: "NWZ Shop System",
  icons: {
    icon: isDev ? "/logo-dev.jpg" : "/logo.jpg",
    apple: isDev ? "/logo-dev.jpg" : "/logo.jpg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: isDev ? "NWZ Dev" : "NWZ & CO.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${robotoMono.variable} antialiased bg-black text-white font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
