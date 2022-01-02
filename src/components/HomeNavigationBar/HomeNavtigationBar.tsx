import React, { FC } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Layout } from '../../constants';

export interface HomeNavigationBarProps {
  onClickCamera?: () => void;
  onClickSend?: () => void;
}

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
    width: Layout.window.width - 44 * 2,
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

export const HomeNavigationBar: FC<HomeNavigationBarProps> = ({
  onClickCamera,
  onClickSend,
}) => {
  return (
    <TouchableOpacity activeOpacity={1} style={styles.navigationBar}>
      <TouchableOpacity
        onPress={() => onClickCamera && onClickCamera()}
        style={styles.btnBack}
      >
        <Icon name="camera" size={24} />
      </TouchableOpacity>

      <View style={styles.centerBar}>
        {/* <Icon name="instagram" size={20} /> */}
      </View>

      <TouchableOpacity
        onPress={() => onClickSend && onClickSend()}
        style={styles.btnMessenger}
      >
        <View>
          <Icon name="send" size={20} />
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
