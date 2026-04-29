import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SmsSendScreen() {
  return (
    <View style={styles.container}>
      <Text>Отправка SMS</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
