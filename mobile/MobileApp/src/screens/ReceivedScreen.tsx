import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getReceivedMessages, type Message } from '../api/messagesApi';
import { onMessagesChanged } from '../services/smsGateway';
import { useDeviceId } from '../hooks/useDeviceId';

export default function ReceivedScreen() {
  const deviceId = useDeviceId();
  const [items, setItems] = useState<Message[]>([]);

  const load = useCallback(async () => {
    if (!deviceId) {
      return;
    }
    const data = await getReceivedMessages(deviceId);
    setItems(data);
  }, [deviceId]);

  useEffect(() => {
    if (!deviceId) {
      return;
    }

    load().catch(() => {});

    const unsubscribe = onMessagesChanged(() => {
      load().catch(() => {});
    });

    return () => unsubscribe();
  }, [deviceId, load]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Входящие</Text>

      <ScrollView contentContainerStyle={styles.list}>
        {items.map(msg => (
          <View key={msg.id_message} style={styles.card}>
            <Text style={styles.phone}>{msg.phone_from}</Text>
            <Text style={styles.text}>{msg.text}</Text>
            <Text style={styles.date}>
              {new Date(msg.created_at).toLocaleString('ru-RU')}
            </Text>
          </View>
        ))}

        {items.length === 0 && <Text style={styles.empty}>Пока пусто</Text>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 10, color: '#000' },
  list: { gap: 12 },
  card: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    padding: 12,
  },
  phone: { fontWeight: 'bold', fontSize: 16, color: '#000', marginBottom: 6 },
  text: { color: '#000', marginBottom: 8, fontSize: 15 },
  date: { color: '#666', fontSize: 12 },
  empty: { opacity: 0.7, marginTop: 12, color: '#000' },
});
