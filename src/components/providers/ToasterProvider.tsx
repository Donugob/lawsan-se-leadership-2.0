"use client";

import { Toaster } from "react-hot-toast";

export const ToasterProvider = () => {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#081d0f", // forest-900
          color: "#fff",
          borderRadius: "16px",
          padding: "12px 24px",
          fontSize: "14px",
          fontWeight: "600",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
        success: {
          iconTheme: {
            primary: "#d4ba54", // gold-500
            secondary: "#081d0f",
          },
        },
        error: {
          style: {
            background: "#7f1d1d", // red-900
          },
        },
      }}
    />
  );
};
