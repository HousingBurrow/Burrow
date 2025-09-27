import type { Metadata } from "next";
import "./globals.css";
import { Provider } from "@/components/ui/provider";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "@/stack/client";
import { Header } from "@/components/header";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Burrow",
  description: "Your one stop shop for everything subleasing",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <StackProvider app={stackClientApp}>
          <StackTheme>
            <Provider>
              <div
                style={{
                  minHeight: "100vh",
                  minWidth: "100vw",
                  height: "100vh",
                  width: "100vw",
                }}
              >
                <Suspense fallback={<div style={{ padding: "1rem" }}>Loading...</div>}>
                  <Header />
                </Suspense>

                <div style={{ height: "100%", width: "100%" }}>{children}</div>
              </div>
            </Provider>
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
