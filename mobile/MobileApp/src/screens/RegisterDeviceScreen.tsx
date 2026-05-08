import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { registerDevice } from '../api/devicesApi';
import { formatPhoneTail, normalizeTailToE164 } from '../utils/phone';

type Props = {
  onRegistered: (deviceId: number) => void;
};

export default function RegisterDeviceScreen({ onRegistered }: Props) {
  const deviceName = useMemo(() => {
    const brand = DeviceInfo.getBrand?.() ?? '';
    const model = DeviceInfo.getModel?.() ?? '';
    const name = `${brand} ${model}`.trim();
    return name || 'Android Device';
  }, []);

  const [phoneTail, setPhoneTail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const fullPhone = normalizeTailToE164(phoneTail);

    if (!fullPhone || phoneTail.length !== 10) {
      Alert.alert('Ошибка', 'Введите номер полностью');
      return;
    }

    setLoading(true);

    try {
      const device = await registerDevice({
        name: deviceName,
        phone_number: fullPhone,
      });

      await AsyncStorage.setItem('deviceId', String(device.id_device));
      await AsyncStorage.setItem('devicePhoneNumber', fullPhone);

      onRegistered(device.id_device);
    } catch (e: any) {
      Alert.alert(
        'Ошибка регистрации',
        e?.response?.data?.message ||
          e?.message ||
          'Не удалось подключиться к серверу',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Подключение устройства</Text>

      <View style={styles.phoneRow}>
        <Text style={styles.plus7}>+7</Text>
        <TextInput
          style={styles.phoneInput}
          value={formatPhoneTail(phoneTail)}
          onChangeText={t => setPhoneTail(t.replace(/\D/g, '').slice(0, 10))}
          placeholder="000 000 00 00"
          placeholderTextColor="#888"
          keyboardType="phone-pad"
          maxLength={14}
        />
      </View>

      <TouchableOpacity
        style={[styles.btn, loading && styles.btnDisabled]}
        onPress={handleRegister}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.btnText}>Подключить</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    color: '#000',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  plus7: {
    fontWeight: '700',
    marginRight: 8,
    fontSize: 16,
    color: '#000',
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  btn: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  btnText: {
    fontWeight: '700',
    color: '#000',
  },
});
