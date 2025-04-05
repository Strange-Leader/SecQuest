import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ChallengeOneScreen from '../screens/ChallengeOne/ChallengeOneScreen';
import ChallengeTwoScreen from '../screens/ChallengeTwo/ChallengeTwoScreen';
import ChallengeThreeScreen from '../screens/ChallengeThree/ChallengeThreeScreen';
import ChallengeFour from '../screens/ChallengeFour/ChallengeFour';
import ChallengeFive from '../screens/ChallengeFive/ChallengeFive';
import ChallengeSix from '../screens/ChallengeSix/ChallengeSix';
import ChallengeSeven from '../screens/ChallengeSeven/ChallengeSeven';
import ChallengeEight from '../screens/ChallengeEight/ChallengeEight';
import ChallengeNine from '../screens/ChallengeNine/ChallengeNine';
import FlagScreen from '../screens/ChallengeOne/FlagScreen';
import AdminPanelScreen from '../screens/ChallengeTwo/AdminPanelScreen';
import {RootStackParamList} from '../types/navigation';
import ErrorBoundary from '../components/ErrorBoundary';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <ErrorBoundary>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'CTF Challenge'}}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={({route}) => ({
            title: route.params.challenge.name,
          })}
        />
        <Stack.Screen
          name="ChallengeOne"
          component={ChallengeOneScreen}
          options={{title: 'Challenge One - Login Bypass'}}
        />
        <Stack.Screen
          name="ChallengeTwo"
          component={ChallengeTwoScreen}
          options={{title: 'Challenge Two - Admin Access'}}
        />
        <Stack.Screen
          name="ChallengeThree"
          component={ChallengeThreeScreen}
          options={{title: 'Challenge Three - XSS'}}
        />
        <Stack.Screen
          name="ChallengeFour"
          component={ChallengeFour}
          options={{title: 'Challenge Four - SQL Injection'}}
        />
        <Stack.Screen
          name="ChallengeFive"
          component={ChallengeFive}
          options={{title: 'Challenge Five - TLS Bypass'}}
        />
        <Stack.Screen
          name="ChallengeSix"
          component={ChallengeSix}
          options={{title: 'Challenge Six - License Check'}}
        />
        <Stack.Screen
          name="ChallengeSeven"
          component={ChallengeSeven}
          options={{title: 'Challenge Seven - AI Model'}}
        />
        <Stack.Screen
          name="ChallengeEight"
          component={ChallengeEight}
          options={{title: 'Challenge Eight - Local Storage'}}
        />
        <Stack.Screen
          name="ChallengeNine"
          component={ChallengeNine}
          options={{title: 'Challenge Nine - Crypto'}}
        />
        <Stack.Screen
          name="Flag"
          component={FlagScreen}
          options={({route}) => ({
            title: 'Flag',
          })}
        />
        <Stack.Screen
          name="AdminPanel"
          component={AdminPanelScreen}
          options={{title: 'Admin Panel'}}
        />
      </Stack.Navigator>
    </ErrorBoundary>
  );
};

export default RootNavigator;
