import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';


export type PressableScaleProps = {
  children: React.ReactNode; 
  onPress?: () => void; 
  style?: StyleProp<ViewStyle>; 
  className?: string; 
};


const PressableScale: React.FC<PressableScaleProps> = ({
  children,
  onPress,
  style,
  className,
}) => {
  // Create a shared value to track the press state
  const active = useSharedValue(false);
  const ANIMATION_DURATION = 250;

  // Create a tap gesture handler
  const gesture = Gesture.Tap()
  .maxDuration(4000) // match animation duration
  .onTouchesDown(() => {
    active.value = true;
  })
  .onTouchesUp(() => {
    if (onPress) runOnJS(onPress)();
  })
  .onFinalize(() => {
    active.value = false;
  });

const rAnimatedStyle = useAnimatedStyle(() => ({
  transform: [
    {
      scale: withTiming(active.value ? 0.95 : 1, {
        duration: ANIMATION_DURATION,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      }),
    },
  ],
}), []);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[style, rAnimatedStyle]} className={className}>{children}</Animated.View>
    </GestureDetector>
  );
};

export { PressableScale };