import React, {
  useLayoutEffect,
  useCallback,
  useRef,
  useEffect,
  createContext,
  useContext,
} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  startIncomingSmsListener,
  stopIncomingSmsListener,
  startPendingMessagesPoll,
  stopPendingMessagesPoll,
} from '../services/smsGateway';

import RegisterDeviceScreen from '../screens/RegisterDeviceScreen';
import MainTabs from './MainTabs';

export type RootStackParamList = {
  Register: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppContext = createContext<{
  deviceId: number | null;
  onRegistered: (id: number | null) => void;
}>({
  deviceId: null,
  onRegistered: () => {},
});

function RegisterScreen(props: any) {
  const { onRegistered } = useContext(AppContext);
  return <RegisterDeviceScreen {...props} onRegistered={onRegistered} />;
}

function MainScreen(props: any) {
  const { deviceId, onRegistered } = useContext(AppContext);
  return (
    <MainScreenWrapper
      {...props}
      deviceId={deviceId!}
      onLogout={async () => {
        stopPendingMessagesPoll();
        await AsyncStorage.removeItem('deviceId');
        onRegistered(null);
      }}
    />
  );
}

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
    <AppContext.Provider value={{ deviceId, onRegistered }}>
      <NavigationContainer>
        <Stack.Navigator>
          {deviceId === null ? (
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
          ) : (
            <Stack.Screen name="Main" component={MainScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
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

  useEffect(() => {
    const init = async () => {
      await startIncomingSmsListener();
      await startPendingMessagesPoll();
    };

    init().catch(() => {});

    return () => {
      stopIncomingSmsListener();
      stopPendingMessagesPoll();
    };
  }, []);

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
    color: '#000',
  },
});
