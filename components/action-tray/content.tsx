import React from "react";
import Animated, {
  Easing,
  EntryExitAnimationFunction,
  withTiming,
} from "react-native-reanimated";
import { MORPH_DURATION } from "./constants";

type Props = {
  children: React.ReactNode;
  transitionKey?: string | number;
  scale?: boolean;
};

const createMorphEntering = (scale: boolean): EntryExitAnimationFunction => {
  return () => {
    "worklet";

    return {
      initialValues: {
        opacity: 0,
        transform: [...(scale ? [{ scale: 0.95 }] : []), { translateY: 6 }],
      },
      animations: {
        opacity: withTiming(1, {
          duration: MORPH_DURATION,
          easing: Easing.bezier(0.26, 0.08, 0.25, 1),
        }),
        transform: [
          ...(scale
            ? [
                {
                  scale: withTiming(1, {
                    duration: MORPH_DURATION,
                    easing: Easing.bezier(0.26, 0.08, 0.25, 1),
                  }),
                },
              ]
            : []),
          {
            translateY: withTiming(0, {
              duration: MORPH_DURATION,
              easing: Easing.bezier(0.26, 0.08, 0.25, 1),
            }),
          },
        ],
      },
    };
  };
};

const createMorphExiting = (scale: boolean): EntryExitAnimationFunction => {
  return () => {
    "worklet";

    return {
      initialValues: {
        opacity: 1,
        transform: [...(scale ? [{ scale: 1 }] : []), { translateY: 0 }],
      },
      animations: {
        opacity: withTiming(0, {
          duration: 190,
          easing: Easing.bezier(0.26, 0.08, 0.25, 1),
        }),
        transform: [
          ...(scale
            ? [
                {
                  scale: withTiming(0.95, {
                    duration: 190,
                    easing: Easing.bezier(0.26, 0.08, 0.25, 1),
                  }),
                },
              ]
            : []),
          {
            translateY: withTiming(6, {
              duration: 190,
              easing: Easing.bezier(0.26, 0.08, 0.25, 1),
            }),
          },
        ],
      },
    };
  };
};

export const TrayContent: React.FC<Props> = ({
  children,
  transitionKey,
  scale = true,
}) => {
  return (
    <Animated.View
      entering={createMorphEntering(scale)}
      exiting={createMorphExiting(scale)}
    >
      {children}
    </Animated.View>
  );
};

TrayContent.displayName = "TrayContent";
