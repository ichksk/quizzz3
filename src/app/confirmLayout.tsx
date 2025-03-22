"use client";
import { Confirm } from "@/components/confirm";
import { ReactNode } from "react";

export default function ConfirmLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Confirm.Root />
      {children}
    </>
  );
}