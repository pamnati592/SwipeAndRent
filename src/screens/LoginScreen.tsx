import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { signInWithGoogle } from '../services/auth.service';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const socialButtons = [
  { label: 'Continue with Google', onPress: 'google' },
  { label: 'Continue with Apple', onPress: 'apple' },
  { label: 'Continue with Facebook', onPress: 'facebook' },
];

export default function LoginScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleGoogle() {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error: any) {
      Alert.alert('שגיאה', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>S&R</Text>
        </View>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleGoogle}
          disabled={loading}
        >
          <View style={styles.socialIcon} />
          <Text style={styles.socialButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton} disabled>
          <View style={styles.socialIcon} />
          <Text style={styles.socialButtonText}>Continue with Apple</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton} disabled>
          <View style={styles.socialIcon} />
          <Text style={styles.socialButtonText}>Continue with Facebook</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.socialButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.socialButtonText}>Continue with Email</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.guestButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.guestButtonText}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>

      {/* Loading */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      <Text style={styles.terms}>By continuing, you agree to our Terms & Privacy</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#1a1a1a',
    alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 40, paddingHorizontal: 24,
  },
  logoContainer: { alignItems: 'center' },
  logo: {
    width: 80, height: 80, backgroundColor: '#3a3a3a',
    borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 24,
  },
  logoText: { fontSize: 22, fontWeight: 'bold', color: '#aaa' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#888' },
  buttonsContainer: { width: '100%', gap: 12 },
  socialButton: {
    width: '100%', height: 48, backgroundColor: '#2a2a2a',
    borderWidth: 2, borderColor: '#3a3a3a', borderRadius: 8,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12,
  },
  socialIcon: { width: 20, height: 20, backgroundColor: '#555', borderRadius: 10 },
  socialButtonText: { color: '#fff', fontSize: 14 },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#3a3a3a' },
  dividerText: { color: '#666', fontSize: 12 },
  guestButton: {
    width: '100%', height: 48,
    borderWidth: 2, borderColor: '#3a3a3a', borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  guestButtonText: { color: '#888', fontSize: 14 },
  terms: { fontSize: 12, color: '#555', textAlign: 'center' },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center', justifyContent: 'center',
  },
});
