import React from "react";
import { View, Text } from "react-native";
import OnboardingExample from "./onboarding-example";
import HowToHelpExample from "./new-wallet";

const ActionTrayExamples = () => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#FFF",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <OnboardingExample />

      <HowToHelpExample />
    </View>
  );
};

export default ActionTrayExamples;
