import React, { useLayoutEffect, useCallback, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import RegisterDeviceScreen from '../screens/RegisterDeviceScreen';
import MainTabs from './MainTabs';

export type RootStackParamList = {
  Register: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function LogoutButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.logoutText}>Выйти</Text>
    </TouchableOpacity>
  );
}

export default function RootNavigator({
  deviceId,
  onRegistered,
}: {
  deviceId: number | null;
  onRegistered: (id: number | null) => void;
}) {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {deviceId === null ? (
          <Stack.Screen name="Register" options={{ headerShown: false }}>
            {props => (
              <RegisterDeviceScreen {...props} onRegistered={onRegistered} />
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Main">
            {props => (
              <MainScreenWrapper
                {...props}
                deviceId={deviceId}
                onLogout={async () => {
                  await AsyncStorage.removeItem('deviceId');
                  onRegistered(null);
                }}
              />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function MainScreenWrapper({
  navigation,
  deviceId,
  onLogout,
}: {
  navigation: any;
  deviceId: number;
  onLogout: () => void;
}) {
  const onLogoutRef = useRef(onLogout);

  useLayoutEffect(() => {
    onLogoutRef.current = onLogout;
  }, [onLogout]);

  const headerRight = useCallback(() => {
    return (
      <LogoutButton
        onPress={() => {
          onLogoutRef.current();
        }}
      />
    );
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `ID: ${deviceId}`,
      headerRight,
    });
  }, [navigation, deviceId, headerRight]);

  return <MainTabs />;
}

const styles = StyleSheet.create({
  logoutText: {
    marginRight: 12,
    fontWeight: '600',
  },
});
