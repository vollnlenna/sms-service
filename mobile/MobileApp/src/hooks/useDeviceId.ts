import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useDeviceId() {
  const [deviceId, setDeviceId] = useState<number | null>(null);

  useEffect(() => {
    const init = async () => {
      const v = await AsyncStorage.getItem('deviceId');
      setDeviceId(v ? Number(v) : null);
    };

    init().catch(() => {});
  }, []);

  return deviceId;
}
