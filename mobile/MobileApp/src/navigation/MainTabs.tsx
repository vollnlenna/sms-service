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
              tabBarLabelPosition: 'below-icon',
              tabBarStyle: {
                  height: 60,
                  paddingBottom: 0,
              },
              tabBarIconStyle: { display: 'none' },
              tabBarLabelStyle: {
                  fontSize: 14,
                  fontWeight: '600',
                  width: '100%',
                  textAlign: 'center',
                  flex: 1,
                  textAlignVertical: 'center',
                  lineHeight: 60,
                  margin: 0,
                  padding: 0,
              },
              tabBarItemStyle: {
                  justifyContent: 'center',
                  alignItems: 'center',
              },
          }}
        >
          <Tab.Screen
              name="SmsSend"
              component={SmsSendScreen}
              options={{ tabBarLabel: 'Отправка SMS' }}
          />
          <Tab.Screen
              name="Sent"
              component={SentScreen}
              options={{ tabBarLabel: 'Исходящие' }}
          />
          <Tab.Screen
              name="Received"
              component={ReceivedScreen}
              options={{ tabBarLabel: 'Входящие' }}
          />
        </Tab.Navigator>
    );
}
