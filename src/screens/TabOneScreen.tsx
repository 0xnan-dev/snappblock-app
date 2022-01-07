import { Text, View } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';

import { MainTabScreenProps } from '../types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

export function TabOneScreen({ navigation }: MainTabScreenProps<'TabOne'>) {
  return (
    <View>
      <Text>Tab One</Text>
      <View
        _light={{ color: '#eee' }}
        _dark={{ color: 'rgba(255,255,255,0.1)' }}
      />
      Hellow
    </View>
  );
}
