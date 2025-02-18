import type { Metadata } from "next";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { poppins } from "@/assets/fonts/index";
import AuthUserProvider from "@/providers/AuthUserProvider";
import ReactQuery from "@/providers/ReactQuery";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} antialiased`}>
        <NuqsAdapter>
          <ThemeProvider>
            <ReactQuery>
              <AuthUserProvider>
                {children}
                <Toaster />
              </AuthUserProvider>
            </ReactQuery>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
