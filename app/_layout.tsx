import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import "./global.css";
import { TrayProvider } from "@/components/action-tray/provider";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <TrayProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
      </TrayProvider>
    </GestureHandlerRootView>
  );
}
