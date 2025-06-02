import { Link, Stack } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';

import React from 'react';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Página não encontrada' }} />
      <View style={styles.container}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 10 }}>404</Text>
        <Text style={{ fontSize: 18, marginBottom: 20, textAlign: 'center' }}>
          Ops! A página que você procura não foi encontrada.
        </Text>
        <Link href="/(tabs)/appointment" style={styles.link}>
          <Text style={{ color: '#007AFF', fontSize: 16 }}>Voltar para a tela inicial</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
