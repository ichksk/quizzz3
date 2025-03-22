"use client";
import { ReactNode } from "react";

import { Confirm } from "@/components/confirm";

export default function ConfirmLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Confirm.Root />
      {children}
    </>
  );
}