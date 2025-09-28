// app/layout.tsx
import { ConfigProvider } from "antd";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { Provider } from "@/components/ui/provider";
import ClientProviders from "@/components/client-providers";
import { Suspense } from "react";
import { Header } from "@/components/header";
import { stackServerApp } from "@/stack/server"; // server-only
import "./globals.css";
import Loading from "./loading";

export const metadata = {
  title: "Burrow",
  description: "Your one stop shop for everything subleasing",
  icons: {
    icon: "/peeking-prairie-dog.png",
    shortcut: "/peeking-prairie-dog.png",
    apple: "/peeking-prairie-dog.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <StackProvider app={stackServerApp}>
          <StackTheme>
            <Provider>
              <ClientProviders>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: "#6F826A", // primary color
                      colorError: "#9A3F3F",
                      borderRadius: 8,
                      colorText: "#000000",
                      colorBgBase: "#ffffff",
                    },
                  }}
                >
                  <Suspense>
                    <div style={{ width: "100%", minHeight: "100vh" }}>
                      <Header /> {/* Header can be a client component */}
                      <div style={{ width: "100%" }}>{children}</div>
                    </div>
                  </Suspense>
                </ConfigProvider>
              </ClientProviders>
            </Provider>
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
