import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { Tray } from "@/components/action-tray";
import { useTray } from "@/components/action-tray/context";
import DrawerButton from "../content/drawer-button";
import { PressableScale } from "@/components/ui/utils/pressable-scale";
import Header from "../content/header";
import { SymbolView } from "expo-symbols";
import { TrayTextInput } from "../text-input";

const HowToHelpExample = () => {
  const { next, back, close } = useTray();
  const [address, setAddress] = useState("");
  return (
    <Tray.Root>
      <Tray.Trigger>
        <PressableScale
          style={{
            backgroundColor: "#F5F5FA",
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 36,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text className="text-2xl font-sfBold">New Wallet</Text>
        </PressableScale>
      </Tray.Trigger>

      <Tray.Content scale>
        <View className="gap-y-4">
          <Header
            step={1}
            leftLabel="New Wallet"
            shouldClose
            onBack={back}
            onClose={close}
          />

          <View
            style={{
              height: 1,
              width: "100%",
              backgroundColor: "#F7F7F7",
            }}
          />

          <DrawerButton
            variant="card"
            icon="plus"
            label="Create New"
            description="Create a fresh address with no previous history"
            iconColor="#3590FF"
            onPress={next}
          />

          <DrawerButton
            variant="card"
            icon="arrow.trianglehead.clockwise.rotate.90"
            label="Add Existing"
            description="Add an existing wallet by importing or restoring"
            iconColor="#3DCA46"
            onPress={next}
          />

          <DrawerButton
            variant="card"
            icon="binoculars.fill"
            label="Watch"
            description="Keep track of a wallet using an address or ENS name"
            iconColor="#62778B"
            onPress={next}
          />
        </View>
      </Tray.Content>

      <Tray.Content scale>
        <View className="gap-y-4">
          <Header
            step={1}
            leftLabel="Watch Address"
            shouldClose
            onBack={back}
            onClose={close}
          />

          <View
            style={{
              height: 1,
              width: "100%",
              backgroundColor: "#F7F7F7",
            }}
          />

          <View className="">
            <TrayTextInput
              value={address}
              onChangeText={setAddress}
              placeholder="ENS or Address"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              returnKeyType="done"
              className="font-sfRegular text-xl"
              style={{
                width: "100%",
                paddingVertical: 14,
                paddingHorizontal: 16,
                borderRadius: 16,
                backgroundColor: "#F7F8F8",
                color: "#000",
                fontSize: 18,
                lineHeight: 26,
                letterSpacing: 0.2,
              }}
            />
          </View>

          <View className="flex-1 justify-center items-center p-12">
            <SymbolView
              name="binoculars.fill"
              size={65}
              tintColor={"#E6E6E6"}
            />

            <Text
              className=" mt-2 text-center text-[#E6E6E6]"
              style={{
                fontSize: 18,
                lineHeight: 26,
                letterSpacing: 0.2,
              }}
            >
              Search or paste an address to start watching a wallet
            </Text>
          </View>

          <PressableScale
            onPress={() => {}}
            style={{
              width: "100%",
              height: 50,
              alignItems: "center",
              backgroundColor: "#3EB2FE",
              borderRadius: 50,
              justifyContent: "center",
              paddingHorizontal: 20,
            }}
          >
            <Text className="text-white font-sfBold text-2xl">Next</Text>
          </PressableScale>
        </View>
      </Tray.Content>
    </Tray.Root>
  );
};

export default HowToHelpExample;
