import React from "react";
import { Text, View, LayoutChangeEvent } from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  interpolate,
  useSharedValue,
} from "react-native-reanimated";
import { SymbolView } from "expo-symbols";
import { PressableScale } from "@/components/ui/utils/pressable-scale";
import * as Haptics from "expo-haptics";


export default function Header({
  step = 0,
  onClose,
  onBack,
  leftLabel,
  shouldClose,

}: {
  step: number;
  onClose: () => void;
  onBack?: () => void;
  leftLabel?: React.ReactNode | string;
  shouldClose?: boolean;

}) {
  const showBack = step > 0;

  const containerWidth = useSharedValue(0);
  const titleWidth = useSharedValue(0);

  const onContainerLayout = (e: LayoutChangeEvent) => {
    containerWidth.value = e.nativeEvent.layout.width;
  };

  const onTitleLayout = (e: LayoutChangeEvent) => {
    titleWidth.value = e.nativeEvent.layout.width;
  };


  const progress = useDerivedValue(() =>
    withSpring(showBack ? 1 : 0, {
      stiffness: 750,
      damping: 75,
    })
  );


  const rTitleStyle = useAnimatedStyle(() => {
    const center =
      containerWidth.value / 2 - titleWidth.value / 2;

    return {
      position: "absolute",
      left: 0,
      transform: [
        {
          translateX: interpolate(
            progress.value,
            [0, 1],
            [0, center]
          ),
        },
      ],
    };
  });


  const rBackStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      {
        translateX: interpolate(progress.value, [0, 1], [-20, 0]),
      },
    ],
  }));


    const handleBackPress = async () => {
      await Haptics.selectionAsync();
    onBack?.();
  };

  const handleClosePress = async () => {
      await Haptics.selectionAsync();
    onClose();
  };

  return (
    <View style={{ gap: 24 }}>
      <View
        onLayout={onContainerLayout}
        style={{
          paddingVertical: 12,
          justifyContent: "center",
        }}
      >

        <Animated.View
          onLayout={onTitleLayout}
          style={rTitleStyle}
        >
          {typeof leftLabel === "string" ? (
            <Text
             
              className = "text-2xl font-sfMedium"
            >
              {leftLabel}
            </Text>
          ) : (
            leftLabel
          )}
        </Animated.View>

 
        {showBack && (
          <Animated.View
            style={[
              {
                position: "absolute",
                left: 0,
              },
              rBackStyle,
            ]}
          >
            <PressableScale
             onPress={handleBackPress}
              className="p-3 rounded-full bg-[#F5F5FA]"
            >
              <SymbolView
                name="chevron.left"
                type="palette"
                size={18}
                weight="semibold"
                tintColor={"#94999F"}
              />
            </PressableScale>
          </Animated.View>
        )}

   
        {shouldClose && (
          <PressableScale
                  onPress={handleClosePress}
            className="p-3 rounded-full bg-[#F5F5FA]"
            style={{
              position: "absolute",
              right: 0,
            }}
          >
            <SymbolView
              name="xmark"
              type="palette"
              size={18}
              weight="semibold"
              tintColor={"#94999F"}
            />
          </PressableScale>
        )}
      </View>
    </View>
  );
}
