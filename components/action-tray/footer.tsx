import React from "react";

type TrayFooterProps = {
  children: React.ReactNode;
};

export const TrayFooter: React.FC<TrayFooterProps> = ({ children }) => {
  return <>{children}</>;
};

TrayFooter.displayName = "TrayFooter";