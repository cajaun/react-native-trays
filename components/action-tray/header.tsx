import React, { useEffect } from "react";
import { useTray } from "./context";

type TrayHeaderProps = {
  children: React.ReactNode;
};

export const TrayHeader: React.FC<TrayHeaderProps> = ({ children }) => {
  const { setHeader } = useTray();

  useEffect(() => {
    setHeader(children);
    return () => setHeader(null);
  }, [children, setHeader]);

  return null;
};

TrayHeader.displayName = "TrayHeader";