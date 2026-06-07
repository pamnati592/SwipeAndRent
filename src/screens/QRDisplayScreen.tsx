import { useState, useEffect, useMemo, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { ChevronLeft, Check, CircleCheck, TriangleAlert } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ChatsStackParamList } from '../navigation/ChatsStackNavigator';
import { supabase } from '../services/supabase';
import { getCurrentLocationOnce } from '../hooks/useUserLocation';
import { useTheme } from '../theme/ThemeContext';
import type { ThemeColors } from '../theme/colors';
import { CHECKLIST_ITEMS, type QrPayload, type QrPhase } from './qrShared';

type Props = NativeStackScreenProps<ChatsStackParamList, 'QRDisplay'>;

// Renter side of the handoff: confirm condition checklist, then show a QR that
// the lender scans. Polls the transaction so we can show success once the
// lender's scan advances the status.
export default function QRDisplayScreen({ navigation, route }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { transactionId, phase, itemTitle } = route.params;

  const [checked, setChecked] = useState<boolean[]>(CHECKLIST_ITEMS.map(() => false));
  const [step, setStep] = useState<'checklist' | 'qr' | 'done'>('checklist');
  const [payload, setPayload] = useState<QrPayload | null>(null);
  const [working, setWorking] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const allChecked = checked.every(Boolean);
  const successStatus = phase === 'pickup' ? 'active' : 'completed';

  function toggle(i: number) {
    setChecked(prev => prev.map((v, idx) => (idx === i ? !v : v)));
  }

  async function confirmAndShow() {
    setWorking(true);
    try {
      const coords = await getCurrentLocationOnce();
      if (!coords) {
        Alert.alert('Location needed', 'Enable location so the lender can verify you are together.');
        return;
      }
      const { error: cErr } = await supabase.rpc('confirm_condition', { p_tx: transactionId, p_phase: phase });
      if (cErr) throw cErr;
      const { data: token, error: tErr } = await supabase.rpc('ensure_qr_token', { p_tx: transactionId, p_phase: phase });
      if (tErr) throw tErr;
      setPayload({ t: transactionId, k: token as string, p: phase, lat: coords.latitude, lng: coords.longitude });
      setStep('qr');
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Could not start the handoff.');
    } finally {
      setWorking(false);
    }
  }

  // Poll for the lender's scan while the QR is on screen.
  useEffect(() => {
    if (step !== 'qr') return;
    pollRef.current = setInterval(async () => {
      const { data } = await supabase
        .from('transactions')
        .select('status')
        .eq('id', transactionId)
        .single();
      if (data?.status === successStatus) setStep('done');
    }, 3000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [step, transactionId, successStatus]);

  async function reportIssue() {
    Alert.alert('Report an issue?', 'This puts the rental into dispute and holds the payment until an admin reviews it.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Report', style: 'destructive', onPress: async () => {
          const { error } = await supabase.rpc('report_issue', { p_tx: transactionId });
          if (error) { Alert.alert('Error', error.message); return; }
          navigation.goBack();
        },
      },
    ]);
  }

  const title = phase === 'pickup' ? 'Pickup' : 'Return';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.itemName} numberOfLines={1}>{itemTitle}</Text>

        {step === 'checklist' && (
          <>
            <Text style={styles.sectionLabel}>Confirm item condition</Text>
            {CHECKLIST_ITEMS.map((label, i) => (
              <TouchableOpacity key={label} style={[styles.checkRow, checked[i] && styles.checkRowOn]} onPress={() => toggle(i)}>
                <Text style={styles.checkText}>{label}</Text>
                <View style={[styles.checkbox, checked[i] && styles.checkboxOn]}>
                  {checked[i] && <Check size={15} color={colors.white} strokeWidth={3} />}
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.primaryBtn, (!allChecked || working) && styles.btnDisabled]}
              onPress={confirmAndShow}
              disabled={!allChecked || working}
            >
              {working ? <ActivityIndicator color={colors.btnText} /> : <Text style={styles.primaryBtnText}>Confirm & Show QR</Text>}
            </TouchableOpacity>
          </>
        )}

        {step === 'qr' && payload && (
          <View style={styles.qrWrap}>
            <Text style={styles.sectionLabel}>Show this to the lender</Text>
            <View style={styles.qrCard}>
              <QRCode value={JSON.stringify(payload)} size={232} backgroundColor="#ffffff" color="#000000" />
            </View>
            <View style={styles.waitRow}>
              <ActivityIndicator color={colors.textMuted} size="small" />
              <Text style={styles.waitText}>Waiting for the lender to scan…</Text>
            </View>
          </View>
        )}

        {step === 'done' && (
          <View style={styles.doneWrap}>
            <CircleCheck size={64} color={colors.success} />
            <Text style={styles.doneTitle}>{phase === 'pickup' ? 'Handed over!' : 'Returned!'}</Text>
            <Text style={styles.doneSub}>
              {phase === 'pickup' ? 'The rental is now active.' : 'The rental is complete.'}
            </Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.primaryBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        )}

        {step !== 'done' && (
          <TouchableOpacity style={styles.reportBtn} onPress={reportIssue}>
            <TriangleAlert size={16} color={colors.danger} />
            <Text style={styles.reportText}>Report an issue</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 8, paddingVertical: 8,
    borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.surface,
  },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '700', color: colors.text },
  scroll: { padding: 20, gap: 14 },
  itemName: { fontSize: 15, color: colors.textMuted, textAlign: 'center' },
  sectionLabel: { fontSize: 13, color: colors.textFaint, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  checkRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.card, borderRadius: 12, padding: 16,
    borderWidth: 1.5, borderColor: colors.border,
  },
  checkRowOn: { borderColor: colors.success },
  checkText: { flex: 1, color: colors.text, fontSize: 15 },
  checkbox: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: colors.borderStrong,
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: colors.success, borderColor: colors.success },
  primaryBtn: {
    height: 54, backgroundColor: colors.btn, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginTop: 8,
  },
  primaryBtnText: { color: colors.btnText, fontSize: 16, fontWeight: '700' },
  btnDisabled: { opacity: 0.4 },
  qrWrap: { alignItems: 'center', gap: 16, marginTop: 8 },
  qrCard: { backgroundColor: '#ffffff', padding: 20, borderRadius: 20 },
  waitRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  waitText: { color: colors.textMuted, fontSize: 14 },
  doneWrap: { alignItems: 'center', gap: 10, marginTop: 24 },
  doneTitle: { fontSize: 22, fontWeight: '700', color: colors.text },
  doneSub: { fontSize: 15, color: colors.textMuted, marginBottom: 12 },
  reportBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14, marginTop: 8 },
  reportText: { color: colors.danger, fontSize: 14, fontWeight: '600' },
});
