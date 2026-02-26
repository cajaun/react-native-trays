import React, { useMemo, useEffect } from "react";
import { useTray } from "./context";

type TrayRootProps = {
  children: React.ReactNode;
};

export const TrayRoot: React.FC<TrayRootProps> = ({ children }) => {
  const {
    index,
    setContent,
    setFooter,
    setTotal,
  } = useTray();



  const { outside, contents, footer } = useMemo(() => {
    const outsideNodes: React.ReactNode[] = [];
    const contentNodes: React.ReactNode[] = [];
    let footerNode: React.ReactNode = null;

    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) {
        outsideNodes.push(child);
        return;
      }

      const name = (child.type as any)?.displayName;

      if (name === "TrayContent") {
        contentNodes.push(child);
        return;
      }

      if (name === "TrayFooter") {
        footerNode = child;
        return;
      }

      outsideNodes.push(child);
    });

    return {
      outside: outsideNodes,
      contents: contentNodes,
      footer: footerNode,
    };
  }, [children]);



  useEffect(() => {
    setTotal(contents.length);
  }, [contents.length, setTotal]);


  useEffect(() => {
    setContent(contents[index] ?? null);
  }, [index, contents, setContent]);


  useEffect(() => {
    setFooter(footer ?? null);
  }, [footer, setFooter]);

  return <>{outside}</>;
};

TrayRoot.displayName = "TrayRoot";