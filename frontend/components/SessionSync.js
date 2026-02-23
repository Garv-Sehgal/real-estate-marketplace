"use client";

import { useEffect } from "react";
import { refreshUserSession } from "@/lib/auth";

export default function SessionSync() {
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    refreshUserSession().catch(() => {
      // token invalid → auto logout
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    });
  }, []);

  return null;
}