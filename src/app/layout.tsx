import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "RVM EG | Creator Application",
  description: "Apply to become an RVM EG Creator. Create authentic content and work with leading brands.",
  openGraph: {
    title: "RVM EG | Creator Application",
    description: "Apply to become an RVM EG Creator. Create authentic content and work with leading brands.",
    url: "/",
    siteName: "RVM EG",
    images: [
      {
        url: "/assets/logorvm.png",
        width: 1200,
        height: 630,
        alt: "RVM EG Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RVM EG | Creator Application",
    description: "Apply to become an RVM EG Creator. Create authentic content and work with leading brands.",
    images: ["/assets/logorvm.png"],
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
