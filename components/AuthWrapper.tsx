"use client";
import React from "react";
import { useSelector } from "react-redux";
import Login from "@/components/Login";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return isAuthenticated ? <>{children}</> : <Login />;
};

export default AuthWrapper;