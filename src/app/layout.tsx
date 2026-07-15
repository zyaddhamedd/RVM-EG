import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://join-rvm-eg.vercel.app"),
  title: "RVM EG | Creator Application",
  description: "Apply to become an RVM EG Creator. Create authentic content and work with leading brands.",
  openGraph: {
    title: "RVM EG | Creator Application",
    description: "Apply to become an RVM EG Creator. Create authentic content and work with leading brands.",
    url: "/",
    siteName: "RVM EG",
    images: [
      {
        url: "/assets/og-rvm.jpg",
        width: 1200,
        height: 630,
        alt: "RVM EG Creator Network",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RVM EG | Creator Application",
    description: "Apply to become an RVM EG Creator. Create authentic content and work with leading brands.",
    images: ["/assets/og-rvm.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
