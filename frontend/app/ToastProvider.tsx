"use client";

import dynamic from "next/dynamic";

const ToastContainer = dynamic(() => import("./components/Toast"), { ssr: false });

export default function ToastProvider() {
  return <ToastContainer />;
}
