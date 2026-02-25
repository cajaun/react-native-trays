import {
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { Stack } from "expo-router";
import "./global.css";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

        <Stack>
        </Stack>

    </GestureHandlerRootView>
  );
}
