import { Text, ViewStyle, TextStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import * as Haptic from "expo-haptics";
import { SFSymbol, SymbolView } from "expo-symbols";
import { PressableScale } from "@/components/ui/utils/pressable-scale";

export default function DrawerButton({
  onPress,
  icon,
  label,
  className,
  textColor,
  iconColor,
}: {
  onPress: () => void;
  icon?: SFSymbol;
  label: string;
  className?: string;
  textColor?: string;
  iconColor?: string;
}) {
  const isButtonActive = useSharedValue(false);

  const handlePress = () => {
    Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Light);
    onPress();
  };

  const rButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: isButtonActive.value ? 0.96 : 1 }],
  }));

  const baseStyle: ViewStyle = {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderCurve: "continuous",
    alignItems: "center",
  };

  return (
    <Animated.View style={rButtonStyle}>
      <PressableScale
      className={className}
        style={[baseStyle]}
        onPress={handlePress}
      >
        {icon && <SymbolView size={25} name={icon} tintColor={iconColor}     weight="bold"/>}
        <Text
        className ="font-bold text-xl"
        style={{color: textColor}}
        >
          {label}
        </Text>
      </PressableScale>
    </Animated.View>
  );
}
