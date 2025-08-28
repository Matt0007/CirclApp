import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { CityInput } from "../components/profileForm/CityInput";
import { ScrollView, View } from "react-native";
import { YStack } from "tamagui";

export default function Test() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled">
      <YStack padding="$5" space="$6" flex={1}>
        <CityInput
          value="Paris"
          onChangeText={(text) => console.log(text)}
          onCitySelect={(city) => console.log(city)}
          onValidationChange={(isValid) => console.log(isValid)}
        />
      </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
