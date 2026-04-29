import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [deviceId, setDeviceId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const v = await AsyncStorage.getItem('deviceId');
      setDeviceId(v ? Number(v) : null);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator />
      </View>
    );
  }

  return <RootNavigator deviceId={deviceId} onRegistered={setDeviceId} />;
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
});
