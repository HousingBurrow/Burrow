import type { Metadata } from "next";
import "./globals.css";
import { Provider } from "@/components/ui/provider";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { Suspense } from "react";
import { Header } from "@/components/header";
import { stackServerApp } from "@/stack/server";
import ClientProviders from "@/components/client-providers";

export const metadata: Metadata = {
  title: "Burrow",
  description: "Your one stop shop for everything subleasing",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <StackProvider app={stackServerApp}>
          <StackTheme>
            <Provider>
              <ClientProviders>
                <Suspense>
                <div
                  style={{
                    minHeight: "100vh",
                    minWidth: "100vw",
                    height: "100vh",
                    width: "100vw",
                  }}
                >
                  <Header />

                  <div style={{ height: "100%", width: "100%" }}>
                    {children}
                  </div>
                </div>
                </Suspense>
              </ClientProviders>
            </Provider>
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
