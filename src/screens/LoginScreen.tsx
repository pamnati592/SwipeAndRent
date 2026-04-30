import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '../services/auth.service';

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleGoogle() {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailAuth() {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    try {
      setLoading(true);
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>S&R</Text>
          </View>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        {!showEmailForm ? (
          /* Social Buttons */
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.socialButton} onPress={handleGoogle} disabled={loading}>
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton} disabled>
              <Text style={[styles.socialButtonText, styles.disabledText]}>Continue with Apple</Text>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.socialButton} onPress={() => setShowEmailForm(true)}>
              <Text style={styles.socialButtonText}>Continue with Email</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Email / Password Form */
          <View style={styles.buttonsContainer}>
            <Text style={styles.formTitle}>{isSignUp ? 'Create Account' : 'Sign In'}</Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.primaryButton} onPress={handleEmailAuth} disabled={loading}>
              {loading
                ? <ActivityIndicator color="#000" />
                : <Text style={styles.primaryButtonText}>{isSignUp ? 'Sign Up' : 'Sign In'}</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
              <Text style={styles.toggleText}>
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowEmailForm(false)}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.terms}>By continuing, you agree to our Terms & Privacy</Text>
      </KeyboardAvoidingView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 40, paddingHorizontal: 24 },
  logoContainer: { alignItems: 'center' },
  logo: {
    width: 80, height: 80, backgroundColor: '#3a3a3a',
    borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 24,
  },
  logoText: { fontSize: 22, fontWeight: 'bold', color: '#aaa' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#888' },
  buttonsContainer: { width: '100%', gap: 12 },
  formTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  socialButton: {
    width: '100%', height: 48, backgroundColor: '#2a2a2a',
    borderWidth: 2, borderColor: '#3a3a3a', borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  socialButtonText: { color: '#fff', fontSize: 14 },
  disabledText: { color: '#555' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#3a3a3a' },
  dividerText: { color: '#666', fontSize: 12 },
  input: {
    width: '100%', height: 48, backgroundColor: '#2a2a2a',
    borderWidth: 2, borderColor: '#3a3a3a', borderRadius: 8,
    paddingHorizontal: 16, color: '#fff', fontSize: 14,
  },
  primaryButton: {
    width: '100%', height: 48, backgroundColor: '#fff',
    borderRadius: 8, alignItems: 'center', justifyContent: 'center',
  },
  primaryButtonText: { color: '#000', fontSize: 15, fontWeight: '600' },
  toggleText: { color: '#888', fontSize: 13, textAlign: 'center' },
  backText: { color: '#666', fontSize: 13, textAlign: 'center' },
  terms: { fontSize: 12, color: '#555', textAlign: 'center' },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center', justifyContent: 'center',
  },
});
