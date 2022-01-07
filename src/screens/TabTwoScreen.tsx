import { Text, View } from 'native-base';
import React from 'react';

export function TabTwoScreen() {
  return (
    <View flex={1} alignItems="center" justifyContent="center">
      <Text fontSize={20} fontWeight="bold">
        Tab Two
      </Text>
      <View
        marginX={7}
        height={1}
        width="80%"
        _light={{ color: '#eee' }}
        _dark={{ color: 'rgba(255,255,255,0.1)' }}
      />
      Hellow
    </View>
  );
}
