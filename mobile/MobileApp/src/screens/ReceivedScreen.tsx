import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ReceivedScreen() {
  return (
    <View style={styles.container}>
      <Text>Входящие</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
