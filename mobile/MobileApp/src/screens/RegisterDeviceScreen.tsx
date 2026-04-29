import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { registerDevice } from '../api/devicesApi';

function formatTail(digits: string) {
  const d = digits.replace(/\D/g, '').slice(0, 10);
  const g1 = d.slice(0, 3);
  const g2 = d.slice(3, 6);
  const g3 = d.slice(6, 8);
  const g4 = d.slice(8, 10);

  const parts: string[] = [];
  if (g1.length) parts.push(g1);
  if (g2.length) parts.push(g2);
  if (g3.length) parts.push(g3);
  if (g4.length) parts.push(g4);

  return parts.join(' ');
}

function normalizeTailToE164(tailDigits: string) {
  const tail = tailDigits.replace(/\D/g, '').slice(0, 10);
  if (tail.length !== 10) return null;
  return `+7${tail}`;
}

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
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [confirmation, setConfirmation] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

  const requestCode = async () => {
    setError(null);

    const fullPhone = normalizeTailToE164(phoneTail);
    if (!fullPhone) {
      setError('Введите номер полностью');
      return;
    }

    if (Platform.OS === 'android') {
      const isEmu = await DeviceInfo.isEmulator();
      if (isEmu) {
        auth().settings.appVerificationDisabledForTesting = true;
      }
    }

    setLoading(true);
    try {
      const conf = await auth().signInWithPhoneNumber(fullPhone);
      setConfirmation(conf);
      setStep('code');
    } catch (e: any) {
      setError(e?.message ?? 'Не удалось отправить код');
    } finally {
      setLoading(false);
    }
  };

  const confirmAndRegister = async () => {
    setError(null);

    if (!confirmation) {
      setError('Код подтверждения не запрошен');
      return;
    }

    const fullPhone = normalizeTailToE164(phoneTail);
    if (!fullPhone) {
      setError('Некорректный номер');
      return;
    }

    if (!code.trim()) {
      setError('Введите код подтверждения');
      return;
    }

    setLoading(true);
    try {
      await confirmation.confirm(code.trim());

      const device = await registerDevice({
        name: deviceName,
        phone_number: fullPhone,
      });

      await AsyncStorage.setItem('deviceId', String(device.id_device));
      onRegistered(device.id_device);
    } catch (e: any) {
      setError(
        e?.message ??
          'Не удалось подтвердить код / зарегистрировать устройство',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Подключение устройства</Text>

      {step === 'phone' && (
        <>
          <View style={styles.phoneRow}>
            <Text style={styles.plus7}>+7</Text>
            <TextInput
              style={styles.phoneInput}
              value={formatTail(phoneTail)}
              onChangeText={t =>
                setPhoneTail(t.replace(/\D/g, '').slice(0, 10))
              }
              placeholder="000 000 00 00"
              keyboardType="phone-pad"
              maxLength={14}
            />
          </View>

          {!!error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity
            style={styles.btn}
            onPress={requestCode}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.btnText}>Далее</Text>
            )}
          </TouchableOpacity>
        </>
      )}

      {step === 'code' && (
        <>
          <TextInput
            style={styles.input}
            value={code}
            onChangeText={t => setCode(t.replace(/\D/g, '').slice(0, 6))}
            placeholder="Код подтверждения"
            keyboardType="number-pad"
            maxLength={6}
          />

          {!!error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity
            style={styles.btn}
            onPress={confirmAndRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.btnText}>Подтвердить и подключить</Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
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
  plus7: { fontWeight: '700', marginRight: 8, fontSize: 16 },
  phoneInput: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 0,
    fontSize: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  btn: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnText: { fontWeight: '700' },
  error: { color: 'red', marginBottom: 12, textAlign: 'center' },
});
