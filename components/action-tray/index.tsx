import React, {
  useCallback,
  useImperativeHandle,
  useMemo,
  forwardRef,
  useState,
} from "react";
import {
  Dimensions,
  StyleProp,
  StyleSheet,
  ViewStyle,
  LayoutChangeEvent,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  EntryExitAnimationFunction,
  LinearTransition,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Backdrop } from "./backdrop";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BORDER_RADIUS,
  HORIZONTAL_MARGIN,
  MORPH_DURATION,
  PADDING,
  SCREEN_HEIGHT,
} from "./constants";

type ActionTrayProps = {
  style?: StyleProp<ViewStyle>;
  onClose?: () => void;
  contentMap: Record<number, React.ReactNode>;
  step: number;
  footer?: React.ReactNode;
  scale?: boolean;
};

export type ActionTrayRef = {
  open: () => void;
  isActive: () => boolean;
  close: () => void;
};

const ActionTray = forwardRef<ActionTrayRef, ActionTrayProps>(
  ({ style, onClose, contentMap, step, footer, scale = true }, ref) => {
    const translateY = useSharedValue(SCREEN_HEIGHT);
    const contentHeight = useSharedValue(0);
    const footerHeight = useSharedValue(0);
    const active = useSharedValue(false);
    const isClosing = useSharedValue(false);
    const context = useSharedValue({ y: 0 });

    const [layoutEnabled, setLayoutEnabled] = useState(false);
    const [isClosingJS, setIsClosingJS] = useState(false);

    const { bottom } = useSafeAreaInsets();

    const totalHeight = useDerivedValue(() => {
      return contentHeight.value + bottom;
    });

    const progress = useDerivedValue(() => {
      const height = totalHeight.value > 0 ? totalHeight.value : SCREEN_HEIGHT;
      return 1 - translateY.value / height;
    });

    const heightEasing = Easing.bezier(0.26, 1, 0.5, 1).factory();

    const layoutAnimationConfig = useMemo(
      () => LinearTransition.duration(MORPH_DURATION).easing(heightEasing),
      [],
    );

    const MorphEntering: EntryExitAnimationFunction = () => {
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

    const MorphExiting: EntryExitAnimationFunction = () => {
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

    const scrollTo = useCallback((destination: number) => {
      "worklet";

      active.value = destination !== SCREEN_HEIGHT;

      translateY.value = withSpring(destination, {
        damping: 50,
        stiffness: 400,
        mass: 0.8,
        overshootClamping: false,
      });
    }, []);

    const close = useCallback(() => {
      "worklet";

      isClosing.value = true;
      runOnJS(setIsClosingJS)(true);

      scrollTo(SCREEN_HEIGHT);
    }, [scrollTo]);

    useImperativeHandle(
      ref,
      () => ({
        open: () => {
          "worklet";

          isClosing.value = false;
          runOnJS(setIsClosingJS)(false);

          runOnJS(Haptics.selectionAsync)();
          scrollTo(0);
        },
        close,
        isActive: () => {
          "worklet";
          return active.value;
        },
      }),
      [close, scrollTo],
    );

    const gesture = Gesture.Pan()
      .onStart(() => {
        context.value = { y: translateY.value };
      })
      .onUpdate((event) => {
        if (event.translationY >= 0) {
          translateY.value = event.translationY + context.value.y;
        } else {
          translateY.value = context.value.y;
        }
      })
      .onEnd((event) => {
        const projectedEnd = translateY.value + event.velocityY / 60;

        const shouldClose =
          projectedEnd > totalHeight.value * 0.5 || event.velocityY > 1000;

        if (shouldClose) {
          if (onClose) runOnJS(onClose)();
          else close();
        } else {
          scrollTo(0);
        }
      });

    const rActionTrayStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
    }));

    const rFooterSpacerStyle = useAnimatedStyle(() => ({
      height: footer ? footerHeight.value : 0,
    }));

    const handleLayout = (event: LayoutChangeEvent) => {
      const h = event.nativeEvent.layout.height;
      contentHeight.value = h;

      const footerReady = !footer || footerHeight.value > 0;
      const contentReady = h > 0;

      if (!layoutEnabled && contentReady && footerReady) {
        setLayoutEnabled(true);
      }
    };

    const handleFooterLayout = (e: LayoutChangeEvent) => {
      const h = e.nativeEvent.layout.height;
      footerHeight.value = h;

      if (!layoutEnabled && contentHeight.value > 0) {
        setLayoutEnabled(true);
      }
    };

    const shouldUseLayoutAnimation = layoutEnabled && !isClosingJS;

    const content = useMemo(() => contentMap[step] || null, [step, contentMap]);
    const contentKey = useMemo(() => `step-${step}`, [step]);

    return (
      <>
        <Backdrop
          onTap={onClose ?? close}
          isActive={active}
          progress={progress}
        />

        <GestureDetector gesture={gesture}>
          <Animated.View
            style={[
              styles.actionTrayContainer,
              { bottom: bottom },
              rActionTrayStyle,
              style,
            ]}
             layout={
              shouldUseLayoutAnimation
                ? layoutAnimationConfig
                : undefined
            }
            onLayout={handleLayout}
          >
            <Animated.View style={styles.content}>
              <Animated.View
                key={contentKey}
                entering={MorphEntering}
                exiting={MorphExiting}
              >
                {content}
              </Animated.View>
              <Animated.View style={rFooterSpacerStyle} />
            </Animated.View>
          </Animated.View>
        </GestureDetector>
        {footer && (
          <Animated.View
            onLayout={handleFooterLayout}
            style={[
              styles.footer,
              {
                bottom,
                left: HORIZONTAL_MARGIN,
                right: HORIZONTAL_MARGIN,
              },
              rActionTrayStyle,
            ]}
          >
            {footer}
          </Animated.View>
        )}
      </>
    );
  },
);

const styles = StyleSheet.create({
  actionTrayContainer: {
    position: "absolute",
    left: HORIZONTAL_MARGIN,
    right: HORIZONTAL_MARGIN,
    backgroundColor: "white",
    borderRadius: BORDER_RADIUS,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  content: {
    padding: PADDING,
    // overflow: "hidden",
  },
  footer: {
    position: "absolute",
    paddingHorizontal: PADDING,
    paddingTop: 6,
    paddingBottom: PADDING,
    backgroundColor: "white",
    borderBottomLeftRadius: BORDER_RADIUS,
    borderBottomRightRadius: BORDER_RADIUS,
  },
});

export { ActionTray };
