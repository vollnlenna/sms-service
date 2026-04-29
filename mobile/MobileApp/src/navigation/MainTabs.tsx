import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SmsSendScreen from '../screens/SmsSendScreen';
import SentScreen from '../screens/SentScreen';
import ReceivedScreen from '../screens/ReceivedScreen';

export type TabParamList = {
  SmsSend: undefined;
  Sent: undefined;
  Received: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#666',
        tabBarIcon: () => null,
        tabBarStyle: {
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 16,
          fontWeight: '600',
          marginTop: -10,
        },
      }}
    >
      <Tab.Screen
        name="SmsSend"
        component={SmsSendScreen}
        options={{ tabBarLabel: 'Отправка SMS', tabBarIcon: () => null }}
      />
      <Tab.Screen
        name="Sent"
        component={SentScreen}
        options={{ tabBarLabel: 'Исходящие', tabBarIcon: () => null }}
      />
      <Tab.Screen
        name="Received"
        component={ReceivedScreen}
        options={{ tabBarLabel: 'Входящие', tabBarIcon: () => null }}
      />
    </Tab.Navigator>
  );
}