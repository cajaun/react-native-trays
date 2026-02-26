import React, { useMemo, useRef, useState, useCallback } from "react";
import {
  ActionTray,
  ActionTrayRef,
} from "@/components/action-tray/action-tray";
import { TrayContext } from "./context";

type Props = {
  children: React.ReactNode;
};

export const TrayProvider: React.FC<Props> = ({ children }) => {
  const trayRef = useRef<ActionTrayRef>(null);

  const [content, setContent] = useState<React.ReactNode>(null);
  const [footer, setFooter] = useState<React.ReactNode>(null);
  const [header, setHeader] = useState<React.ReactNode>(null);

  const [index, setIndex] = useState(0);
  const [total, setTotal] = useState(0);

  const open = useCallback(() => {
    trayRef.current?.open();
  }, []);

  const close = useCallback(() => {
    trayRef.current?.close();
  }, []);

  const next = useCallback(() => {
    setIndex((i) => Math.min(i + 1, total - 1));
  }, [total]);

  const back = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  const isOpen = useCallback(() => {
    return trayRef.current?.isActive?.() ?? false;
  }, []);

const builtContent = useMemo(
  () => (
    <React.Fragment key={`tray-step-${index}`}>
      {header}
      {content}
    </React.Fragment>
  ),
  [header, content, index],
);

  const ctxValue = useMemo(
    () => ({
      open,
      close,
      next,
      back,
      index,
      total,
      setContent,
      setFooter,
      setHeader,
      isOpen,
      setTotal,
    }),
    [open, close, next, back, index, total, isOpen],
  );

  return (
    <TrayContext.Provider value={ctxValue}>
      {children}

      <ActionTray
        ref={trayRef}
        content={builtContent}
        footer={footer ?? undefined}
        onClose={close}
      />
    </TrayContext.Provider>
  );
};
