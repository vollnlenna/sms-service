import React, { useEffect, useState } from 'react';
import {
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendSms } from '../services/smsGateway';
import { formatPhoneTail } from '../utils/phone';

export default function SmsSendScreen() {
  const [deviceId, setDeviceId] = useState<number | null>(null);
  const [toTail, setToTail] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const v = await AsyncStorage.getItem('deviceId');
      setDeviceId(v ? Number(v) : null);
    })();
  }, []);

  const handleSend = async () => {
    if (!deviceId) {
      return Alert.alert('deviceId not found');
    }
    if (!text.trim()) {
      return Alert.alert('Сообщение пустое');
    }

    setLoading(true);

    try {
      await sendSms(toTail, text);
      setText('');
      setToTail('');
      Alert.alert('SMS отправлено');
    } catch (e: any) {
      Alert.alert('Ошибка отправки', e?.message || '');
    } finally {
      setLoading(false);
    }
  };

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Отправка SMS</Text>

        <View style={styles.phoneRow}>
          <Text style={styles.plus7}>+7</Text>

          <TextInput
              style={styles.phoneInput}
              value={formatPhoneTail(toTail)}
              onChangeText={t => setToTail(t.replace(/\D/g, '').slice(0, 10))}
              keyboardType="phone-pad"
              placeholder="000 000 00 00"
              placeholderTextColor="#888"
          />
        </View>

        <Text style={styles.label}>Сообщение:</Text>
        <TextInput
            style={[styles.input, styles.textArea]}
            value={text}
            onChangeText={setText}
            multiline
            placeholderTextColor="#888"
        />

        <TouchableOpacity style={styles.btn} onPress={handleSend}>
          {loading ? (
              <ActivityIndicator color="#000" />
          ) : (
              <Text style={styles.btnText}>Отправить</Text>
          )}
        </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: '700', color: '#000' },
  label: { textAlign: 'left', alignSelf: 'flex-start', fontWeight: '600', color: '#000' },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  plus7: { fontWeight: '700', marginRight: 8, fontSize: 16, color: '#000' },
  phoneInput: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 0,
    fontSize: 16,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    padding: 10,
    color: '#000',
  },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  btn: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  btnText: { color: '#000', fontWeight: '600' },
});
