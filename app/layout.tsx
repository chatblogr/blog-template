// import localFont from "next/font/local";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Theme } from "@radix-ui/themes";
import { Metadata } from "next";
import { SITENAME } from "@/constants";
import Script from "next/script";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Chat and Blog",
  description: "Chat, Save and Publish a blog.",
  openGraph: {
    title: "Chat and Blog",
    description: "Chat, Save and Publish a blog.",
    url: `https://${SITENAME}`,
    type: "website",
    images: `https://${SITENAME}/images/facebook.png`,
  },
  twitter: {
    card: "summary",
    images: `https://${SITENAME}/images/twitter.png`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-HPND068965"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-HPND068965');
          `}
        </Script>
        <Theme>{children}</Theme>
      </body>
    </html>
  );
}
