import React, { createContext, useContext } from "react";

export type TrayContextValue = {
  open: () => void;
  close: () => void;
  next: () => void;
  back: () => void;
  index: number;
  total: number;
  setTotal: (n: number) => void;
  setContent: (node: React.ReactNode) => void;
  setFooter: (node: React.ReactNode) => void;
  setHeader: (node: React.ReactNode) => void;

  isOpen: () => boolean;
};

const TrayContext = createContext<TrayContextValue | null>(null);

export const useTray = () => {
  const ctx = useContext(TrayContext);
  if (!ctx) {
    throw new Error("Tray components must be used within <TrayProvider>.");
  }
  return ctx;
};

export { TrayContext };