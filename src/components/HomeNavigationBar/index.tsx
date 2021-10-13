import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SCREEN_WIDTH} from '../../lib/constants';
// import {navigation} from '../../navigation/rootNavigation';

const index = ({navigation}: any) => {
  return (
    <TouchableOpacity activeOpacity={1} style={styles.navigationBar}>
      <TouchableOpacity
        onPress={() => navigation.navigate('PhotoStack', {navigation})}
        style={styles.btnBack}>
        <Icon name="camera" size={24} />
      </TouchableOpacity>
      <View style={styles.centerBar}>
        {/* <Icon name="instagram" size={20} /> */}
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('Direct')}
        style={styles.btnMessenger}>
        <View>
          <Icon name="send" size={20} />
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default index;

const styles = StyleSheet.create({
  navigationBar: {
    flexDirection: 'row',
    height: 44,
    width: '100%',
    alignItems: 'center',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  centerBar: {
    height: 44,
    width: SCREEN_WIDTH - 44 * 2,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  logo: {
    resizeMode: 'contain',
    height: 30,
    width: 100,
  },
  btnBack: {
    height: 44,
    width: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnMessenger: {
    height: 44,
    width: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unRead: {
    position: 'absolute',
    top: -5,
    right: -5,
    height: 20,
    width: 20,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
});
