"use client";
import React from "react";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Provider } from "react-redux";
import store from "@/redux/store";
import AuthWrapper from "@/components/AuthWrapper";
import { PersistGate } from "redux-persist/integration/react"; // Import PersistGate
import { persistor } from "@/redux/store"; // Import persistor

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className="h-full">
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
              disableTransitionOnChange
            >
              <AuthWrapper>{children}</AuthWrapper>
            </ThemeProvider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}