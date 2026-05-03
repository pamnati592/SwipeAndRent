import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert,
  ActivityIndicator, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../navigation/ProfileStackNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/supabase';
import { TEST_ACCOUNTS } from '../config/testAccounts';

type Nav = NativeStackNavigationProp<ProfileStackParamList, 'ProfileMain'>;

const SESSIONS_KEY = 'sar_test_sessions';   // { [label]: { access_token, refresh_token } }
const CURRENT_KEY  = 'sar_current_label';

async function saveCurrent(label: string) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;
  const sessions = JSON.parse(await AsyncStorage.getItem(SESSIONS_KEY) ?? '{}');
  sessions[label] = { access_token: session.access_token, refresh_token: session.refresh_token };
  await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  await AsyncStorage.setItem(CURRENT_KEY, label);
}

export default function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const [loading, setLoading]         = useState(false);
  const [switchModal, setSwitchModal] = useState(false);
  const [switchingTo, setSwitchingTo] = useState<string | null>(null);

  async function handleLogout() {
    Alert.alert('Log out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out', style: 'destructive',
        onPress: async () => {
          setLoading(true);
          await AsyncStorage.removeItem(CURRENT_KEY);
          await supabase.auth.signOut();
          setLoading(false);
        },
      },
    ]);
  }

  async function switchTo(label: string, email: string, password: string) {
    setSwitchingTo(label);
    try {
      // Save the current session before leaving it
      const currentLabel = await AsyncStorage.getItem(CURRENT_KEY);
      if (currentLabel) await saveCurrent(currentLabel);

      // Try a cached session first — instant if tokens are still valid
      const sessions = JSON.parse(await AsyncStorage.getItem(SESSIONS_KEY) ?? '{}');
      const cached = sessions[label];
      if (cached) {
        const { error } = await supabase.auth.setSession(cached);
        if (!error) {
          await AsyncStorage.setItem(CURRENT_KEY, label);
          setSwitchModal(false);
          return;
        }
        // Cached tokens expired — fall through to fresh sign-in
      }

      // First time switching to this user: sign in with credentials
      if (!email || !password) {
        Alert.alert('Not configured', `Add credentials for "${label}" in src/config/testAccounts.ts`);
        return;
      }
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { Alert.alert('Sign-in failed', error.message); return; }

      // Cache the new session so next switch is instant
      const updated = JSON.parse(await AsyncStorage.getItem(SESSIONS_KEY) ?? '{}');
      updated[label] = { access_token: data.session!.access_token, refresh_token: data.session!.refresh_token };
      await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
      await AsyncStorage.setItem(CURRENT_KEY, label);
      setSwitchModal(false);
    } finally {
      setSwitchingTo(null);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('MyItems')}>
          <Text style={styles.menuIcon}>📦</Text>
          <Text style={styles.menuLabel}>My Items</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => setSwitchModal(true)}>
          <Text style={styles.menuIcon}>🔀</Text>
          <Text style={styles.menuLabel}>Switch User</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

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

      <Modal visible={switchModal} transparent animationType="slide" onRequestClose={() => setSwitchModal(false)}>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Switch User</Text>
            <Text style={styles.sheetSubtitle}>First switch signs in once — after that it's instant</Text>

            {TEST_ACCOUNTS.map(account => (
              <TouchableOpacity
                key={account.label}
                style={[styles.accountBtn, switchingTo === account.label && styles.accountBtnLoading]}
                onPress={() => switchTo(account.label, account.email, account.password)}
                disabled={!!switchingTo}
              >
                {switchingTo === account.label
                  ? <ActivityIndicator color="#000" size="small" />
                  : (
                    <>
                      <View style={styles.accountAvatar}>
                        <Text style={styles.accountAvatarText}>{account.label.charAt(0).toUpperCase()}</Text>
                      </View>
                      <Text style={styles.accountLabel}>{account.label}</Text>
                      <Text style={styles.accountEmail} numberOfLines={1}>
                        {account.email || 'Not configured'}
                      </Text>
                    </>
                  )
                }
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.cancelBtn} onPress={() => setSwitchModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a', paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', paddingTop: 16, paddingBottom: 20 },

  menu: { gap: 8 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#242424', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 16,
    borderWidth: 1, borderColor: '#2a2a2a',
  },
  menuIcon: { fontSize: 20 },
  menuLabel: { flex: 1, fontSize: 16, color: '#fff', fontWeight: '500' },
  menuArrow: { fontSize: 22, color: '#555', fontWeight: '300' },

  spacer: { flex: 1 },
  logoutBtn: {
    backgroundColor: '#c0392b', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', marginBottom: 24,
  },
  logoutBtnDisabled: { opacity: 0.5 },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#242424', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 40, gap: 12,
  },
  sheetHandle: { width: 40, height: 4, backgroundColor: '#444', borderRadius: 2, alignSelf: 'center', marginBottom: 4 },
  sheetTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  sheetSubtitle: { fontSize: 13, color: '#666', marginBottom: 4 },

  accountBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#2a2a2a', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    borderWidth: 1, borderColor: '#3a3a3a',
    minHeight: 56, justifyContent: 'center',
  },
  accountBtnLoading: { opacity: 0.6 },
  accountAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#3a3a3a', alignItems: 'center', justifyContent: 'center',
  },
  accountAvatarText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  accountLabel: { fontSize: 16, fontWeight: '600', color: '#fff', flex: 1 },
  accountEmail: { fontSize: 12, color: '#666', maxWidth: 160 },

  cancelBtn: { height: 48, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  cancelText: { color: '#fff', fontSize: 15 },
});
