"use client";
import React from "react";
import { useSelector } from "react-redux";
import Login from "@/components/Login";
import { RootState } from "@/redux/store";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector((state: RootState) => state.auth.user);

  console.log("AuthWrapper - Current user:", user);

  // During SSR, render children without auth check
  if (typeof window === "undefined") {
    return <>{children}</>;
  }

  return user ? <>{children}</> : <Login />;
};

export default AuthWrapper;