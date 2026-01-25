import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Theme } from "@radix-ui/themes";
import { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import { getBlog } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export async function generateMetadata(): Promise<Metadata> {
  const blog = await getBlog();
  const title = blog.blogName;
  const description = blog.description;
  const customDomain = blog.customDomain;

  return title
    ? {
        title,
        description,
        openGraph: {
          title,
          description,
          url: customDomain,
          type: "article",
          images: `${customDomain}/images/facebook.png`,
        },
        twitter: {
          card: "summary",
          images: `${customDomain}/images/twitter.png`,
        },
      }
    : {};
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { analyticsId } = await getBlog();
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
        {analyticsId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${analyticsId}');
              `}
            </Script>
          </>
        )}
        <Theme>{children}</Theme>
      </body>
    </html>
  );
}
