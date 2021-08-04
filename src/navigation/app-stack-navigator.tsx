import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/home-screen';
import SignInScreen from '../screens/sign-in-screen';
const Stack = createStackNavigator();

function AppStackNavigator() {
  const isSignedIn = false
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{gestureEnabled: false}}>
        {isSignedIn ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <Stack.Screen name="SignIn" component={SignInScreen} />
        )}

    </Stack.Navigator>
  );
}

export default AppStackNavigator;
