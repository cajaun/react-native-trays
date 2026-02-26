import React, {
  useMemo,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  ActionTray,
  ActionTrayRef,
} from "@/components/action-tray/action-tray";
import { TrayContext, TrayDefinition } from "./context";

export const TrayProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const trayRef = useRef<ActionTrayRef>(null);
  const focusableRef =
    useRef<React.RefObject<any> | null>(null);

  const [registry, setRegistry] =
    useState<Record<string, TrayDefinition>>(
      {},
    );

  const [activeTrayId, setActiveTrayId] =
    useState<string | null>(null);

  const [index, setIndex] = useState(0);

  const registerTray = useCallback(
    (id: string, def: TrayDefinition) => {
      setRegistry((prev) => {
        if (prev[id] === def) return prev;
        return { ...prev, [id]: def };
      });
    },
    [],
  );

  const registerFocusable = useCallback(
    (ref: React.RefObject<any>) => {
      focusableRef.current = ref;
    },
    [],
  );

  useEffect(() => {
    if (!activeTrayId) return;
    focusableRef.current?.current?.focus?.();
  }, [index, activeTrayId]);

  const openTray = useCallback((id: string) => {
    trayRef.current?.open();
    setIndex(0);
    setActiveTrayId(id);
  }, []);

  const close = useCallback(() => {
    trayRef.current?.close();
  }, []);

  const activeTray = activeTrayId
    ? registry[activeTrayId]
    : undefined;

  const total = activeTray?.contents.length ?? 0;

  const next = useCallback(() => {
    setIndex((i) =>
      Math.min(i + 1, total - 1),
    );
  }, [total]);

  const back = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  const rawContent =
    activeTray?.contents[index]?.() ?? null;

  const content = useMemo(() => {
    if (!rawContent) return null;

    return (
      <React.Fragment
        key={`tray-step-${index}`}
      >
        {rawContent}
      </React.Fragment>
    );
  }, [rawContent, index]);

  const footer =
    activeTray?.footer?.() ?? null;

  const ctxValue = useMemo(
    () => ({
      openTray,
      close,
      next,
      back,
      index,
      total,
      registerTray,
      registerFocusable,
    }),
    [
      openTray,
      close,
      next,
      back,
      index,
      total,
      registerTray,
    ],
  );

  return (
    <TrayContext.Provider value={ctxValue}>
      {children}

      <ActionTray
        ref={trayRef}
        content={content}
        footer={footer}
        onClose={close}
      />
    </TrayContext.Provider>
  );
};