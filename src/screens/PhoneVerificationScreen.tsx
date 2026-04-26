import { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../services/supabase';

export default function PhoneVerificationScreen({ onVerified }: { onVerified: () => void }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);

  async function sendCode() {
    if (!phone.trim()) return;
    // DEV bypass: skip real SMS, go straight to OTP entry
    setStep('otp');
  }

  async function verifyCode() {
    const code = otp.join('');
    if (code.length < 6) return;
    try {
      setLoading(true);

      // DEV bypass: any phone + code "123456"
      if (code === '123456') {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('profiles').upsert({ id: user.id, phone_verified: true });
        }
        onVerified();
        return;
      }

      const { error } = await supabase.auth.verifyOtp({ phone, token: code, type: 'sms' });
      if (error) throw error;

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').upsert({ id: user.id, phone_verified: true });
      }
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleOtpChange(text: string, index: number) {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) inputs.current[index + 1]?.focus();
    if (!text && index > 0) inputs.current[index - 1]?.focus();
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.inner}>
        <View style={styles.progressBar}>
          {[...Array(5)].map((_, i) => (
            <View key={i} style={[styles.progressDot, i <= (step === 'otp' ? 4 : 3) && styles.progressDotActive]} />
          ))}
        </View>

        {step === 'phone' ? (
          <>
            <Text style={styles.title}>Verify your phone</Text>
            <Text style={styles.subtitle}>We'll send you a verification code via SMS</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Phone number</Text>
              <TextInput
                style={styles.input}
                placeholder="+972 50 000 0000"
                placeholderTextColor="#555"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                autoFocus
              />
            </View>

            <Text style={styles.note}>Standard SMS rates may apply</Text>

            <TouchableOpacity style={styles.button} onPress={sendCode} disabled={loading || !phone.trim()}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send code</Text>}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.title}>Enter verification code</Text>
            <Text style={styles.subtitle}>We sent a code to {phone}</Text>

            <View style={styles.otpRow}>
              {otp.map((digit, i) => (
                <TextInput
                  key={i}
                  ref={(r) => { inputs.current[i] = r; }}
                  style={styles.otpInput}
                  maxLength={1}
                  keyboardType="number-pad"
                  value={digit}
                  onChangeText={(t) => handleOtpChange(t, i)}
                  autoFocus={i === 0}
                />
              ))}
            </View>

            <Text style={styles.note}>Dev mode: use 123456 to bypass SMS verification</Text>

            <TouchableOpacity style={styles.button} onPress={verifyCode} disabled={loading || otp.join('').length < 6}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify code</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setStep('phone')} style={styles.backLink}>
              <Text style={styles.backLinkText}>Change phone number</Text>
            </TouchableOpacity>
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  inner: { flex: 1, paddingHorizontal: 24, paddingTop: 32 },
  progressBar: { flexDirection: 'row', gap: 4, marginBottom: 32 },
  progressDot: { flex: 1, height: 4, backgroundColor: '#3a3a3a', borderRadius: 2 },
  progressDotActive: { backgroundColor: '#888' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#888', marginBottom: 32 },
  field: { marginBottom: 8 },
  label: { fontSize: 14, color: '#888', marginBottom: 8 },
  input: {
    height: 48, backgroundColor: '#2a2a2a', borderWidth: 2,
    borderColor: '#3a3a3a', borderRadius: 8, paddingHorizontal: 16, color: '#fff', fontSize: 16,
  },
  note: { fontSize: 12, color: '#555', marginBottom: 32 },
  button: {
    height: 48, backgroundColor: '#3a3a3a', borderRadius: 8,
    alignItems: 'center', justifyContent: 'center', marginTop: 'auto', marginBottom: 16,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  otpRow: { flexDirection: 'row', gap: 10, justifyContent: 'center', marginBottom: 40 },
  otpInput: {
    width: 44, height: 56, backgroundColor: '#2a2a2a', borderWidth: 2,
    borderColor: '#3a3a3a', borderRadius: 8, textAlign: 'center', color: '#fff', fontSize: 22,
  },
  backLink: { alignItems: 'center', marginBottom: 16 },
  backLinkText: { color: '#888', fontSize: 14 },
});
