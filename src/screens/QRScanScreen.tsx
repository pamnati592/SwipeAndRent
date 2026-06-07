import { useState, useMemo, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { ChevronLeft, Check, TriangleAlert } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ChatsStackParamList } from '../navigation/ChatsStackNavigator';
import { supabase } from '../services/supabase';
import { getCurrentLocationOnce } from '../hooks/useUserLocation';
import { metersBetween } from '../utils/format';
import { useTheme } from '../theme/ThemeContext';
import type { ThemeColors } from '../theme/colors';
import { CHECKLIST_ITEMS, PROXIMITY_LIMIT_M, type QrPayload } from './qrShared';

type Props = NativeStackScreenProps<ChatsStackParamList, 'QRScan'>;

// Lender side of the handoff: confirm condition checklist, then scan the
// renter's QR. Verifies the two devices are within 50m before advancing status.
export default function QRScanScreen({ navigation, route }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { transactionId, phase, itemTitle } = route.params;

  const [permission, requestPermission] = useCameraPermissions();
  const [checked, setChecked] = useState<boolean[]>(CHECKLIST_ITEMS.map(() => false));
  const [step, setStep] = useState<'checklist' | 'scan'>('checklist');
  const [processing, setProcessing] = useState(false);
  const handledRef = useRef(false); // guard against the camera firing onBarcodeScanned repeatedly

  const allChecked = checked.every(Boolean);

  function toggle(i: number) {
    setChecked(prev => prev.map((v, idx) => (idx === i ? !v : v)));
  }

  async function confirmAndScan() {
    setProcessing(true);
    try {
      const { error } = await supabase.rpc('confirm_condition', { p_tx: transactionId, p_phase: phase });
      if (error) throw error;
      if (!permission?.granted) {
        const res = await requestPermission();
        if (!res.granted) {
          Alert.alert('Camera needed', 'Allow camera access to scan the rental QR code.');
          return;
        }
      }
      handledRef.current = false;
      setStep('scan');
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Could not start scanning.');
    } finally {
      setProcessing(false);
    }
  }

  async function onScanned(result: BarcodeScanningResult) {
    if (handledRef.current || processing) return;
    let payload: QrPayload;
    try {
      payload = JSON.parse(result.data);
    } catch {
      return; // not our QR — keep scanning
    }
    if (payload.t !== transactionId || payload.p !== phase || !payload.k) {
      return; // wrong code — keep scanning
    }
    handledRef.current = true;
    setProcessing(true);
    try {
      const coords = await getCurrentLocationOnce();
      if (!coords) {
        Alert.alert('Location needed', 'Enable location to verify you are with the renter.');
        handledRef.current = false;
        return;
      }
      const distance = metersBetween(coords, { latitude: payload.lat, longitude: payload.lng });
      if (distance > PROXIMITY_LIMIT_M) {
        Alert.alert('Too far apart', `You must be within ${PROXIMITY_LIMIT_M}m of the renter (currently ~${Math.round(distance)}m).`);
        handledRef.current = false;
        return;
      }
      const { data: newStatus, error } = await supabase.rpc('scan_qr_handoff', {
        p_tx: transactionId, p_token: payload.k, p_phase: phase,
      });
      if (error) throw error;
      Alert.alert(
        phase === 'pickup' ? 'Item handed over' : 'Return complete',
        phase === 'pickup' ? 'The rental is now active.' : 'The rental is complete.',
        [{ text: 'Done', onPress: () => navigation.goBack() }],
      );
      void newStatus;
    } catch (e: any) {
      Alert.alert('Scan failed', e.message ?? 'Could not complete the handoff.');
      handledRef.current = false;
    } finally {
      setProcessing(false);
    }
  }

  const title = phase === 'pickup' ? 'Hand Off' : 'Complete Return';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.backBtn} />
      </View>

      {step === 'checklist' ? (
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.itemName} numberOfLines={1}>{itemTitle}</Text>
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
            style={[styles.primaryBtn, (!allChecked || processing) && styles.btnDisabled]}
            onPress={confirmAndScan}
            disabled={!allChecked || processing}
          >
            {processing ? <ActivityIndicator color={colors.btnText} /> : <Text style={styles.primaryBtnText}>Confirm & Scan QR</Text>}
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <View style={styles.scanWrap}>
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={onScanned}
          />
          <View style={styles.scanOverlay} pointerEvents="none">
            <View style={styles.scanFrame} />
            <Text style={styles.scanHint}>Point at the renter's QR code</Text>
          </View>
          {processing && (
            <View style={styles.processing}>
              <ActivityIndicator color={colors.white} />
              <Text style={styles.processingText}>Verifying…</Text>
            </View>
          )}
        </View>
      )}
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
  scanWrap: { flex: 1, backgroundColor: '#000' },
  scanOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', gap: 20 },
  scanFrame: {
    width: 250, height: 250, borderRadius: 24,
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.9)',
  },
  scanHint: { color: '#fff', fontSize: 15, fontWeight: '600' },
  processing: {
    ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  processingText: { color: '#fff', fontSize: 15 },
});
