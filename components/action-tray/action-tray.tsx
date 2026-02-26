import React, {
  useCallback,
  useImperativeHandle,
  useMemo,
  forwardRef,
  useState,
} from "react";
import {
  StyleProp,
  StyleSheet,
  ViewStyle,
  LayoutChangeEvent,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  LinearTransition,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
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

  content?: React.ReactNode;
  footer?: React.ReactNode;
};

export type ActionTrayRef = {
  open: () => void;
  close: () => void;
  isActive: () => boolean;
};

const ActionTray = forwardRef<ActionTrayRef, ActionTrayProps>(
  ({ style, onClose, content, footer }, ref) => {
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
      const height = totalHeight.value || SCREEN_HEIGHT;
      return 1 - translateY.value / height;
    });

    const heightEasing = Easing.bezier(0.26, 1, 0.5, 1).factory();

    const layoutAnimationConfig = useMemo(
      () => LinearTransition.duration(MORPH_DURATION).easing(heightEasing),
      [],
    );

    const scrollTo = useCallback((destination: number) => {
      "worklet";

      active.value = destination !== SCREEN_HEIGHT;

      translateY.value = withSpring(destination, {
        damping: 50,
        stiffness: 400,
        mass: 0.8,
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
          return active.value;
        },
      }),
      [close, scrollTo],
    );

    const gesture = Gesture.Pan()
      .onStart(() => {
        context.value = { y: translateY.value };
      })
      .onUpdate((e) => {
        if (e.translationY >= 0) {
          translateY.value = e.translationY + context.value.y;
        }
      })
      .onEnd((e) => {
        const projectedEnd = translateY.value + e.velocityY / 60;
        const shouldClose =
          projectedEnd > totalHeight.value * 0.5 || e.velocityY > 1000;

        if (shouldClose) {
          if (onClose) runOnJS(onClose)();
          else close();
        } else {
          scrollTo(0);
        }
      });

    const rTrayStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
    }));

    const rFooterSpacerStyle = useAnimatedStyle(() => ({
      height: footer ? footerHeight.value : 0,
    }));

    const handleLayout = (e: LayoutChangeEvent) => {
      const h = e.nativeEvent.layout.height;
      contentHeight.value = h;

      if (!layoutEnabled && h > 0) setLayoutEnabled(true);
    };

    const handleFooterLayout = (e: LayoutChangeEvent) => {
      footerHeight.value = e.nativeEvent.layout.height;
    };

    const shouldUseLayoutAnimation = layoutEnabled && !isClosingJS;

    return (
      <>
        <Backdrop
          onTap={onClose ?? close}
          isActive={active}
          progress={progress}
        />

        <GestureDetector gesture={gesture}>
          <Animated.View
            style={[styles.container, { bottom }, rTrayStyle, style]}
            layout={
              shouldUseLayoutAnimation ? layoutAnimationConfig : undefined
            }
            onLayout={handleLayout}
          >
            <Animated.View style={styles.content}>
              <Animated.View>{content}</Animated.View>

              <Animated.View style={rFooterSpacerStyle} />
            </Animated.View>
          </Animated.View>
        </GestureDetector>

        {footer && (
          <Animated.View
            onLayout={handleFooterLayout}
            style={[
              styles.footer,
              { bottom, left: HORIZONTAL_MARGIN, right: HORIZONTAL_MARGIN },
              rTrayStyle,
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
  container: {
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
