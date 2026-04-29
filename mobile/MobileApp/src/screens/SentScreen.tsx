import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SentScreen() {
  return (
    <View style={styles.container}>
      <Text>Исходящие</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
