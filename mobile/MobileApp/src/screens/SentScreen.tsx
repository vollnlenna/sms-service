import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  getSentMessages,
  deleteMessage,
  type Message,
} from '../api/messagesApi';
import { onMessagesChanged } from '../services/smsGateway';
import { useDeviceId } from '../hooks/useDeviceId';

export default function SentScreen() {
  const deviceId = useDeviceId();
  const [items, setItems] = useState<Message[]>([]);

  const load = useCallback(async () => {
    if (!deviceId) {
      return;
    }
    const data = await getSentMessages(deviceId);
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

  const handleDelete = (id: number) => {
    Alert.alert('Удаление', 'Удалить сообщение?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          await deleteMessage(id);
          load().catch(() => {});
        },
      },
    ]);
  };

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Исходящие</Text>

        <ScrollView contentContainerStyle={styles.list}>
          {items.map(msg => (
              <View key={msg.id_message} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.phone}>{msg.phone_to}</Text>
                  <Text style={styles.status}>{msg.status}</Text>
                </View>

                <Text style={styles.text}>{msg.text}</Text>

                <View style={styles.cardFooter}>
                  <Text style={styles.date}>
                    {new Date(msg.created_at).toLocaleString('ru-RU')}
                  </Text>
                  <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => handleDelete(msg.id_message)}
                  >
                    <Text style={styles.deleteText}>Удалить</Text>
                  </TouchableOpacity>
                </View>
              </View>
          ))}

          {items.length === 0 && (
              <Text style={styles.empty}>Пока пусто</Text>
          )}
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  phone: { fontWeight: 'bold', fontSize: 16, color: '#000' },
  status: { color: '#000', fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  text: { color: '#000', marginBottom: 6, fontSize: 15 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 4,
  },
  date: { color: '#666', fontSize: 12 },
  deleteBtn: { padding: 4 },
  deleteText: { color: 'red', fontWeight: '600' },
  empty: { opacity: 0.7, marginTop: 12, color: '#000' },
});
