import {
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { Stack } from "expo-router";
import "./global.css";
import { ActionTrayProvider } from "@/components/action-tray/context/action-tray-context";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
<ActionTrayProvider>


        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
</ActionTrayProvider>
    </GestureHandlerRootView>
  );
}
