import type { Metadata, Viewport } from "next";
import "./globals.css";
import PWARegister from "@/components/pwa/PWARegister";
import InstallPrompt from "@/components/pwa/InstallPrompt";

export const metadata: Metadata = {
  title: {
    default: "موکب خادم الرضا(ع)",
    template: "%s | موکب خادم الرضا(ع)",
  },

  description:
    "اهداف، برنامه‌ها و گزارش نذورات موکب خادم الرضا(ع)",

  applicationName: "موکب خادم الرضا(ع)",

  appleWebApp: {
    capable: true,
    title: "موکب خادم الرضا(ع)",
    statusBarStyle: "default",
  },

  formatDetection: {
    telephone: false,
  },

  icons: {
    icon: [
      {
        url: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],

    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,

  themeColor: "#09967c",

  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
    >
      <body>
    <PWARegister />
    <InstallPrompt />
    {children}
</body>
    </html>
  );
}
