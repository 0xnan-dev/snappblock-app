import * as React from 'react';
import Authcore from 'react-native-authcore';
import {Button, View} from 'react-native';

interface SignInScreenProps {}

interface SignInScreenState {}

const authcore = new Authcore({
  baseUrl: 'https://authcore.like.co',
  socialLoginPaneStyle: 'bottom', // Location for social login pane, either `top` or `bottom`, default to be `bottom`
  language: 'en', // Language for sign in page. Currently allow `en` or `zh-hk` only
});

export default class SignInScreen extends React.Component<
  SignInScreenProps,
  SignInScreenState
> {
  private _onPressAuthCoreSignUpButton = async () => {
    try {
      const {accessToken, refreshToken, idToken, currentUser} =
        await authcore.webAuth.signin();
      console.log("accessToken", accessToken)
      console.log("refreshToken", refreshToken)
      console.log("idToken", idToken)
      console.log("currentUser", currentUser)
      return {
        accessToken,
        refreshToken,
        idToken,
      };
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    return (
      <View>
        <Button title="SignUp" preset="primary" onPress={this._onPressAuthCoreSignUpButton} />
      </View>
    );
  }
}
