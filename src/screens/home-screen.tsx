import React from 'react';

import {Button, StyleSheet, Text, View} from 'react-native';
import {Colors} from 'react-native-paper';
import createIpfsClient from 'ipfs-http-client';
import {inspect} from 'util';

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

const Section: React.FC<{
  title: string;
}> = ({children, title}) => {
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};
const inspectIPFSId = async () => {
  const ipfsClient = createIpfsClient('http://localhost:5001');
  try {
    console.log('IPFS ID', {result: inspect(await ipfsClient.id())});
  } catch (error) {
    console.error('IPFS ID', {error});
  }
};

const HomeScreen = () => {
  return (
    <View
      style={{
        backgroundColor: Colors.white,
      }}>
      <Section title="IPFS ID Test">
        <Button onPress={inspectIPFSId} title="Press Me">
          Press me
        </Button>
      </Section>
    </View>
  );
};

export default HomeScreen;
