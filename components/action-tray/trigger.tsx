import React from "react";
import { Pressable, PressableProps } from "react-native";
import { useTray } from "./context";

type TrayTriggerProps = PressableProps & {
  children: React.ReactNode;
};

export const TrayTrigger: React.FC<TrayTriggerProps> = ({
  children,
  onPress,
  ...rest
}) => {
  const { open } = useTray();

  return (
    <Pressable
      {...rest}
      onPress={(e) => {
        onPress?.(e);
        open();
      }}
    >
      {children}
    </Pressable>
  );
};

TrayTrigger.displayName = "TrayTrigger";