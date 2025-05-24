import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { poppins } from "@/assets/fonts/index";
import AuthUserProvider from "@/providers/AuthUserProvider";
import ReactQuery from "@/providers/ReactQuery";
import ToasterProvider from "@/providers/ToasterProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const metadata: Metadata = {
  title: "Vertex",
  description: "Vertex is a modern professional networking platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} antialiased`}>
        <ThemeProvider>
          <NuqsAdapter>
            <ReactQuery>
              <AuthUserProvider>
                {children}
                <ReactQueryDevtools />
                <Toaster />
                <ToasterProvider />
              </AuthUserProvider>
            </ReactQuery>
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
