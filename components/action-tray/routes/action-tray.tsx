import React, { useCallback, useMemo, useRef, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { MaterialCommunityIcons, Octicons } from "@expo/vector-icons";

import { PressableScale } from "@/components/ui/utils/pressable-scale";
import Header from "../content/header";
import { useActionTray } from "../context/action-tray-context";

export const Palette = {
  primary: "#4290F6",
  background: "#FFF",
  surface: "#F1F1F4",
  text: "#B3B3B6",
};

const ActionTray = () => {
  const { openTray, closeTray, returnStep } = useActionTray();

  const contentMap = useMemo(
    () => ({
      0: (
        <View className="gap-y-4">
          <View style={{ gap: 24 }}>
            <Header
              step={0}
              onClose={closeTray}
              leftLabel="Content One"
              shouldClose
            />

            <View
              style={{
                height: 1,
                width: "100%",
                backgroundColor: "#F7F7F7",
              }}
            />
          </View>
          <Text className="text-2xl font-sfBold">This is a test title</Text>

         

          <Text className="text-black font-sfRegular text-lg"   style={{ fontSize: 18, lineHeight: 26, letterSpacing: 0.2 }}>
            This is some example test that spans over multiple lines bla bla bla
            test test test many wods. this is a new sentence and we'll see how
            that fares too.
          </Text>
        </View>
      ),
      1: (
        <View className="gap-y-4">
          <View style={{ gap: 24 }}>
            <Header
              step={1}
              onClose={closeTray}
              onBack={returnStep}
              leftLabel="Content Two"
              shouldClose
            />

            <View
              style={{
                height: 1,
                width: "100%",
                backgroundColor: "#F7F7F7",
              }}
            />
          </View>
          <Text className="text-2xl font-sfBold">Different heading</Text>


  <Text className="text-black font-sfRegular text-lg"   style={{ fontSize: 18, lineHeight: 26, letterSpacing: 0.2 }}>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quod sint magnam laboriosam veniam similique dolorum mollitia perferendis odio numquam cumque, harum corporis quisquam consequatur amet labore optio exercitationem est eaque adipisci animi culpa cum maiores ipsum! At alias voluptas nihil!
          </Text>

          
          <Text className="text-black font-sfRegular text-lg"   style={{ fontSize: 18, lineHeight: 26, letterSpacing: 0.2 }}>
            Here's a lot more text. Lorem ipsum dolor amet. Lorem ipsum dolor
            amet. Lorem ipsum dolor amet. Lorem ipsum dolor amet. Lorem ipsum
            dolor amet. Lorem ipsum dolor amet.
          </Text>

          <Text className="text-black font-sfRegular text-lg"   style={{ fontSize: 18, lineHeight: 26, letterSpacing: 0.2 }}>
            This is some example test that spans over multiple lines bla bla bla
            test test test many wods. this is a new sentence and we'll see how
            that fares too.
          </Text>

          
        </View>
      ),
      2: (
        <View className="gap-y-4">
          <View style={{ gap: 24 }}>
            <Header
              step={3}
              onClose={closeTray}
              onBack={returnStep}
              leftLabel="Content Three"
              shouldClose
            />

            <View
              style={{
                height: 1,
                width: "100%",
                backgroundColor: "#F7F7F7",
              }}
            />
          </View>
          <Text className="text-2xl font-sfBold">Another heading</Text>

          <Text className="text-black  font-sfRegular text-lg"   style={{ fontSize: 18, lineHeight: 26, letterSpacing: 0.2 }}>
            Lorem ipsum dolor amet. Lorem ipsum dolor amet. Lorem ipsum dolor
            amet. Lorem ipsum dolor amet. Lorem ipsum dolor amet.
          </Text>

          <Text className="text-black  font-sfRegular text-lg"   style={{ fontSize: 18, lineHeight: 26, letterSpacing: 0.2 }}>
            This is some example test that spans over multiple lines bla bla bla
            test test test many wods. this is a new sentence and we'll see how
            that fares too.
          </Text>
        </View>
      ),
    }),
    [],
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Palette.background,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <PressableScale
        style={[
          {
            backgroundColor: "#F5F5FA",
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 36,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
        onPress={() => openTray(0, contentMap)}
      >
        <Text className="text-2xl font-sfBold ">Action Tray</Text>
      </PressableScale>
    </View>
  );
};

export default ActionTray;
