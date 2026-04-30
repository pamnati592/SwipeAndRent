import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../services/supabase';

export default function ProfileScreen() {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    Alert.alert('Log out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          await supabase.auth.signOut();
          setLoading(false);
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.spacer} />
      <TouchableOpacity
        style={[styles.logoutBtn, loading && styles.logoutBtnDisabled]}
        onPress={handleLogout}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" size="small" />
          : <Text style={styles.logoutText}>Log out</Text>
        }
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a', paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', paddingTop: 16, paddingBottom: 12 },
  spacer: { flex: 1 },
  logoutBtn: {
    backgroundColor: '#c0392b',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  logoutBtnDisabled: { opacity: 0.5 },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
