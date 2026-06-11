import { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, Modal, StyleSheet,
  ActivityIndicator, Animated, Dimensions,
} from 'react-native';
import { Clapperboard, X, Play, Square, Leaf, Rewind } from 'lucide-react-native';
import { useDemoContext, type TheaterSlide, type DemoRole } from '../contexts/DemoContext';
import { useTheme } from '../theme/ThemeContext';
import TapFlash from './TapFlash';

const { width: SW, height: SH } = Dimensions.get('window');

export default function DemoOverlay() {
  const { colors } = useTheme();
  const { demoState, startDemo, stopDemo } = useDemoContext();
  const [open, setOpen] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownRole   = useRef<DemoRole | null>(null);
  const countdownTarget = useRef<number | null>(null);

  // Synchronized start: both simulators share the Mac's clock, so each phone
  // counts down to the same wall-clock instant (next 10s boundary, ≥4s away).
  // Press Run on both phones within that window and the scripts fire together.
  function armDemo(role: DemoRole) {
    countdownRole.current = role;
    const now = Date.now();
    const target = Math.ceil((now + 4000) / 10000) * 10000;
    countdownTarget.current = target;
    setOpen(false);
    setCountdown(Math.ceil((target - now) / 1000));
  }

  const isCounting = countdown !== null;
  useEffect(() => {
    if (!isCounting) return;
    let fireTimer: ReturnType<typeof setTimeout> | null = null;

    const fire = () => {
      setCountdown(null);
      countdownTarget.current = null;
      const role = countdownRole.current;
      countdownRole.current = null;
      if (role) startDemo(role);
    };

    const iv = setInterval(() => {
      const target = countdownTarget.current;
      if (target === null) return;
      const remaining = target - Date.now();
      // Final stretch: stop polling and fire a precise timer at the exact
      // shared clock tick, so both phones start within a few ms of each other.
      if (remaining <= 250) {
        clearInterval(iv);
        fireTimer = setTimeout(fire, Math.max(0, remaining));
        return;
      }
      setCountdown(Math.ceil(remaining / 1000));
    }, 100);

    return () => {
      clearInterval(iv);
      if (fireTimer) clearTimeout(fireTimer);
    };
  }, [isCounting]);

  // ── Swipe gesture animation ───────────────────────────────────────────────
  const swipeX   = useRef(new Animated.Value(0)).current;
  const swipeO   = useRef(new Animated.Value(0)).current;
  const loopRef  = useRef<Animated.CompositeAnimation | null>(null);

  const sig = demoState.demoSwipeSignal;
  const isLeft  = sig?.dir === 'left';
  const isRight = sig?.dir === 'right';
  const isSwipe = !!sig;

  useEffect(() => {
    if (!isSwipe) {
      loopRef.current?.stop();
      swipeX.setValue(0);
      swipeO.setValue(0);
      return;
    }
    swipeX.setValue(0);
    swipeO.setValue(0);
    // Single pass only — a second loop would show a "swipe" with no card moving.
    // right: 15%→65%, left: 65%→15%
    const startPct = isLeft ? 0.65 : 0.15;
    const endPct   = isLeft ? 0.15 : 0.65;
    swipeX.setValue(startPct);
    // Total 420ms — finishes and fades out together with the card animation,
    // well before the signal window closes (so it never lingers after the card).
    loopRef.current = Animated.parallel([
      Animated.timing(swipeX, { toValue: endPct, duration: 420, useNativeDriver: true }),
      Animated.sequence([
        Animated.timing(swipeO, { toValue: 1, duration: 80, useNativeDriver: true }),
        Animated.timing(swipeO, { toValue: 1, duration: 230, useNativeDriver: true }),
        Animated.timing(swipeO, { toValue: 0, duration: 110, useNativeDriver: true }),
      ]),
    ]);
    loopRef.current.start();
    return () => { loopRef.current?.stop(); };
  }, [isSwipe, isLeft]);

  const translateX = swipeX.interpolate({ inputRange: [0, 1], outputRange: [0, SW] });

  // ── Category tap — single ripple, like one real finger tap ───────────────
  const catScale = useRef(new Animated.Value(1)).current;
  const catO     = useRef(new Animated.Value(0)).current;
  const catAnim  = useRef<Animated.CompositeAnimation | null>(null);
  const isCat = !!demoState.categoryOverride;

  useEffect(() => {
    if (!isCat) {
      catAnim.current?.stop();
      catO.setValue(0);
      catScale.setValue(1);
      return;
    }
    catO.setValue(0);
    catScale.setValue(0.6);
    catAnim.current = Animated.sequence([
      Animated.parallel([
        Animated.timing(catO, { toValue: 1, duration: 130, useNativeDriver: true }),
        Animated.timing(catScale, { toValue: 1.15, duration: 220, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(catO, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(catScale, { toValue: 1.7, duration: 400, useNativeDriver: true }),
      ]),
    ]);
    catAnim.current.start();
    return () => { catAnim.current?.stop(); };
  }, [isCat]);


  return (
    <>
      {/* ── Full-screen theater slide — Modal guarantees it floats above native nav.
            The Modal itself is transparent; the container supplies the black
            background, except for the rewind which stays see-through so the
            screens are visible flipping backwards behind the flicker. ── */}
      <Modal
        visible={!!demoState.theaterSlide}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => {}}
      >
        <View style={[
          styles.theaterModal,
          demoState.theaterSlide?.type === 'rewind' && styles.theaterModalRewind,
        ]}>
          {demoState.theaterSlide && (
            <TheaterSlideContent slide={demoState.theaterSlide} colors={colors} />
          )}
        </View>
      </Modal>

      {/* ── Countdown before the script starts ── */}
      <Modal
        visible={countdown !== null}
        transparent={false}
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => {}}
      >
        <TouchableOpacity
          style={styles.theaterModal}
          activeOpacity={1}
          onPress={() => {
            // Tap to cancel — if the two phones show different numbers they
            // targeted different clock ticks; cancel and press Run again.
            countdownTarget.current = null;
            countdownRole.current = null;
            setCountdown(null);
          }}
        >
          <View style={ts.center}>
            <Text style={styles.countdownRole}>
              {countdownRole.current === 'lender' ? '📱 Lender — Ori' : '📱 Renter — Nati'}
            </Text>
            <Text style={styles.countdownNum}>{countdown}</Text>
            <Text style={styles.countdownHint}>Get ready… (tap to cancel)</Text>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── Swipe finger hint ── */}
      {isSwipe && (
        <Animated.View
          pointerEvents="none"
          style={[styles.swipeContainer, { opacity: swipeO, transform: [{ translateX }] }]}
        >
          <View style={[styles.swipeFinger, isLeft && styles.swipeFingerLeft]} />
          <View style={[styles.swipeTrail, isLeft && styles.swipeTrailLeft]} />
        </Animated.View>
      )}

      {/* ── Category tap pulse ── */}
      {isCat && (
        <Animated.View
          pointerEvents="none"
          style={[styles.catPulse, { opacity: catO, transform: [{ scale: catScale }] }]}
        />
      )}

      {/* ── FAB ── */}
      <TouchableOpacity style={styles.fab} onPress={() => setOpen(true)} activeOpacity={0.85}>
        <Clapperboard size={20} color="#fff" strokeWidth={2} />
      </TouchableOpacity>

      {/* ── Control modal ── */}
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <View style={styles.overlay}>
          <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
            <View style={styles.sheetHeader}>
              <Clapperboard size={18} color={colors.text} />
              <Text style={[styles.sheetTitle, { color: colors.text }]}>Demo Mode</Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <X size={22} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            {demoState.isActive ? (
              <View style={[styles.statusBox, { backgroundColor: colors.card }]}>
                <ActivityIndicator color={colors.primary} size="small" />
                <Text style={[styles.statusRole, { color: colors.primary }]}>
                  {demoState.role === 'lender' ? '📱 Lender (Ori)' : '📱 Renter (Nati)'}
                </Text>
                <Text style={[styles.statusStep, { color: colors.text }]}>{demoState.step}</Text>
              </View>
            ) : demoState.step ? (
              <View style={[styles.statusBox, { backgroundColor: colors.card }]}>
                <Text style={[styles.statusStep, { color: colors.textMuted }]}>{demoState.step}</Text>
              </View>
            ) : null}

            {!demoState.isActive ? (
              <>
                <TouchableOpacity
                  style={[styles.roleBtn, { backgroundColor: '#1d4ed8' }]}
                  onPress={() => armDemo('lender')}
                >
                  <Play size={16} color="#fff" fill="#fff" />
                  <Text style={styles.roleBtnText}>▶  Run Lender Script</Text>
                  <Text style={styles.roleBtnSub}>Ori — approves, shows QR pickup, scans QR return</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.roleBtn, { backgroundColor: '#15803d' }]}
                  onPress={() => armDemo('renter')}
                >
                  <Play size={16} color="#fff" fill="#fff" />
                  <Text style={styles.roleBtnText}>▶  Run Renter Script</Text>
                  <Text style={styles.roleBtnSub}>Nati — requests, scans QR pickup, shows QR return</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[styles.roleBtn, { backgroundColor: colors.danger }]}
                onPress={() => { stopDemo(); setOpen(false); }}
              >
                <Square size={16} color="#fff" fill="#fff" />
                <Text style={styles.roleBtnText}>■  Stop Demo</Text>
              </TouchableOpacity>
            )}

            <Text style={[styles.hint, { color: colors.textFaint }]}>
              Press Run on both phones within a few seconds — both countdowns target the same clock tick, so the scripts start in perfect sync.
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
}

// ── Theater slide content renderer ───────────────────────────────────────────

function TheaterSlideContent({ slide, colors }: { slide: TheaterSlide; colors: any }) {
  const scoreAnim  = useRef(new Animated.Value(0)).current;
  const rewindAnim = useRef(new Animated.Value(0)).current;

  // Auto "tap" on interactive slides: the pay button / the lock-screen notification
  const [slideTapTs, setSlideTapTs] = useState<number | null>(null);
  useEffect(() => {
    setSlideTapTs(null);
    if (slide.type === 'payment' || (slide.type === 'lockscreen' && slide.notif)) {
      const t = setTimeout(() => setSlideTapTs(Date.now()), 2100);
      return () => clearTimeout(t);
    }
  }, [slide]);

  useEffect(() => {
    if (slide.type === 'score') {
      Animated.timing(scoreAnim, { toValue: 1, duration: 1200, delay: 300, useNativeDriver: false }).start();
    }
    if (slide.type === 'rewind') {
      const flicker = Animated.loop(
        Animated.sequence([
          Animated.timing(rewindAnim, { toValue: 1, duration: 90, useNativeDriver: true }),
          Animated.timing(rewindAnim, { toValue: 0.2, duration: 70, useNativeDriver: true }),
          Animated.timing(rewindAnim, { toValue: 0.8, duration: 60, useNativeDriver: true }),
          Animated.timing(rewindAnim, { toValue: 0.35, duration: 90, useNativeDriver: true }),
        ])
      );
      flicker.start();
      return () => flicker.stop();
    }
  }, [slide.type]);

  if (slide.type === 'transition') {
    return (
      <View style={ts.center}>
        <Text style={ts.transitionText}>{slide.text}</Text>
      </View>
    );
  }

  if (slide.type === 'lockscreen') {
    const now = new Date();
    const hh = now.getHours().toString().padStart(2, '0');
    const mm = now.getMinutes().toString().padStart(2, '0');
    const dateLine = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    return (
      <View style={ts.lockWrap}>
        <Text style={ts.lockDate}>{dateLine}</Text>
        <Text style={ts.lockClock}>{hh}:{mm}</Text>
        {slide.notif && (
          <View style={ts.lockNotif}>
            <View style={ts.lockNotifHeader}>
              <View style={ts.lockNotifIcon}><Text style={ts.lockNotifIconText}>U</Text></View>
              <Text style={ts.lockNotifApp}>USEIT</Text>
              <Text style={ts.lockNotifTime}>now</Text>
            </View>
            <Text style={ts.lockNotifTitle}>{slide.notif.title}</Text>
            <Text style={ts.lockNotifBody}>{slide.notif.body}</Text>
            <TapFlash trigger={slideTapTs} style={{ alignSelf: 'center', top: 24 }} />
          </View>
        )}
        <Text style={ts.lockHint}>{slide.notif ? 'Tap to open' : 'Swipe up to unlock'}</Text>
      </View>
    );
  }

  if (slide.type === 'rewind') {
    // VHS-style rewind: flickering scan lines + pulsing ◀◀
    return (
      <View style={ts.center}>
        <Animated.View style={[ts.rewindLines, { opacity: rewindAnim }]}>
          {[0.18, 0.34, 0.5, 0.66, 0.82].map(p => (
            <View key={p} style={[ts.rewindLine, { top: SH * p }]} />
          ))}
        </Animated.View>
        <Animated.View style={{ opacity: rewindAnim, alignItems: 'center', gap: 12 }}>
          <Rewind size={72} color="#fff" fill="#fff" strokeWidth={1} />
          <Text style={ts.rewindText}>REW</Text>
        </Animated.View>
      </View>
    );
  }

  if (slide.type === 'notification') {
    return (
      <View style={ts.center}>
        <View style={[ts.notifCard, { backgroundColor: colors.surface }]}>
          <Text style={[ts.notifTitle, { color: colors.text }]}>{slide.title}</Text>
          <Text style={[ts.notifBody, { color: colors.textSecondary }]}>{slide.body}</Text>
        </View>
      </View>
    );
  }

  if (slide.type === 'payment') {
    return (
      <View style={ts.center}>
        <View style={[ts.payCard, { backgroundColor: colors.surface }]}>
          <Text style={[ts.payTitle, { color: colors.text }]}>Confirm Rental</Text>
          <Text style={[ts.payItem, { color: colors.textMuted }]}>{slide.itemTitle}</Text>
          <View style={[ts.payDivider, { backgroundColor: colors.border }]} />
          <Row label="Rental (2 days)" value={slide.amount} colors={colors} />
          <Row label="Service fee" value={slide.serviceFee} colors={colors} muted />
          <View style={[ts.payDivider, { backgroundColor: colors.border }]} />
          <Row label="Total" value={slide.total} colors={colors} bold />
          <View style={[ts.payBtn, { backgroundColor: colors.btn }]}>
            <Text style={[ts.payBtnText, { color: colors.btnText }]}>Confirm & Pay</Text>
            <TapFlash trigger={slideTapTs} style={{ alignSelf: 'center', top: 6 }} />
          </View>
        </View>
      </View>
    );
  }

  if (slide.type === 'score') {
    const pct = slide.before / 5;
    const pctAfter = slide.after / 5;
    return (
      <View style={ts.center}>
        <View style={[ts.scoreCard, { backgroundColor: colors.surface }]}>
          <View style={ts.scoreHeader}>
            <Leaf size={16} color="#22c55e" strokeWidth={2.5} />
            <Text style={[ts.scoreLabel, { color: colors.textMuted }]}>Your Impact Score</Text>
            <View style={ts.scoreDelta}>
              <Text style={ts.scoreDeltaText}>↑ {slide.delta}</Text>
            </View>
          </View>
          <Text style={ts.scoreNum}>{slide.after.toFixed(1)}</Text>
          <View style={[ts.scoreTrack, { backgroundColor: colors.cardAlt ?? '#333' }]}>
            <Animated.View style={[ts.scoreFill, {
              width: scoreAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [`${pct * 100}%`, `${pctAfter * 100}%`],
              }),
            }]} />
          </View>
          {slide.co2 && (
            <Text style={[ts.scoreCo2, { color: colors.textMuted }]}>
              🌿 ~{slide.co2} kg CO₂ saved this rental
            </Text>
          )}
        </View>
      </View>
    );
  }

  return null;
}

function Row({ label, value, colors, muted, bold }: { label: string; value: string; colors: any; muted?: boolean; bold?: boolean }) {
  return (
    <View style={ts.payRow}>
      <Text style={[ts.payRowLabel, { color: muted ? colors.textMuted : colors.text }]}>{label}</Text>
      <Text style={[ts.payRowValue, { color: colors.text, fontWeight: bold ? '700' : '400' }]}>{value}</Text>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  theaterModal: {
    flex: 1,
    backgroundColor: '#000',
  },
  theaterModalRewind: {
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  countdownRole: {
    color: 'rgba(255,255,255,0.7)', fontSize: 16, fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 1,
  },
  countdownNum: { color: '#fff', fontSize: 120, fontWeight: '800', marginVertical: 12 },
  countdownHint: { color: 'rgba(255,255,255,0.5)', fontSize: 15 },
  swipeContainer: {
    position: 'absolute',
    top: SH * 0.54,
    zIndex: 998,
    alignItems: 'center',
  },
  swipeFinger: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.85)',
    shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 6,
  },
  swipeFingerLeft: { backgroundColor: 'rgba(255,120,120,0.85)' },
  swipeTrail: {
    position: 'absolute', top: 18, left: -30,
    width: 30, height: 8, borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  swipeTrailLeft: {
    left: 44, backgroundColor: 'rgba(255,120,120,0.25)',
  },
  catPulse: {
    position: 'absolute',
    top: 115, left: 90,   // approximate Cameras chip position
    width: 52, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.5)',
    zIndex: 997,
  },
  fab: {
    position: 'absolute', bottom: 100, right: 16,
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center', justifyContent: 'center', zIndex: 999,
  },
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center', padding: 24,
  },
  sheet: { width: '100%', borderRadius: 20, padding: 20, gap: 14 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sheetTitle: { flex: 1, fontSize: 17, fontWeight: '700' },
  statusBox: { borderRadius: 12, padding: 14, gap: 6, alignItems: 'center' },
  statusRole: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  statusStep: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  roleBtn: { borderRadius: 14, paddingVertical: 14, paddingHorizontal: 18, gap: 4, alignItems: 'center' },
  roleBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  roleBtnSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, textAlign: 'center' },
  hint: { fontSize: 12, textAlign: 'center', lineHeight: 17 },
});

const ts = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  transitionText: {
    color: '#fff', fontSize: 28, fontWeight: '700',
    textAlign: 'center', lineHeight: 38,
  },
  lockWrap: { flex: 1, alignItems: 'center', paddingTop: SH * 0.12, padding: 24 },
  lockDate: { color: 'rgba(255,255,255,0.85)', fontSize: 18, fontWeight: '600' },
  lockClock: { color: '#fff', fontSize: 84, fontWeight: '300', letterSpacing: 2, marginTop: 2 },
  lockNotif: {
    width: SW - 32, marginTop: 36, borderRadius: 18, padding: 14, gap: 4,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  lockNotifHeader: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 4 },
  lockNotifIcon: {
    width: 20, height: 20, borderRadius: 5, backgroundColor: '#1d4ed8',
    alignItems: 'center', justifyContent: 'center',
  },
  lockNotifIconText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  lockNotifApp: { flex: 1, color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },
  lockNotifTime: { color: 'rgba(255,255,255,0.5)', fontSize: 12 },
  lockNotifTitle: { color: '#fff', fontSize: 14, fontWeight: '700' },
  lockNotifBody: { color: 'rgba(255,255,255,0.85)', fontSize: 13, lineHeight: 18 },
  lockHint: { position: 'absolute', bottom: 40, alignSelf: 'center', color: 'rgba(255,255,255,0.45)', fontSize: 13 },
  rewindLines: { ...StyleSheet.absoluteFillObject },
  rewindLine: {
    position: 'absolute', left: 0, right: 0, height: 3,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  rewindText: { color: '#fff', fontSize: 22, fontWeight: '800', letterSpacing: 6 },
  notifCard: {
    width: SW - 48, borderRadius: 20, padding: 20, gap: 8,
    shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 }, elevation: 12,
  },
  notifTitle: { fontSize: 17, fontWeight: '700' },
  notifBody: { fontSize: 14, lineHeight: 20 },
  payCard: {
    width: SW - 48, borderRadius: 20, padding: 20, gap: 10,
    shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 }, elevation: 12,
  },
  payTitle: { fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 2 },
  payItem: { fontSize: 14, textAlign: 'center' },
  payDivider: { height: 1, marginVertical: 4 },
  payRow: { flexDirection: 'row', justifyContent: 'space-between' },
  payRowLabel: { fontSize: 14 },
  payRowValue: { fontSize: 14 },
  payBtn: {
    height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 6,
  },
  payBtnText: { fontSize: 16, fontWeight: '700' },
  scoreCard: {
    width: SW - 48, borderRadius: 20, padding: 20, gap: 10,
    shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 }, elevation: 12,
  },
  scoreHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  scoreLabel: { flex: 1, fontSize: 13, fontWeight: '600' },
  scoreDelta: { backgroundColor: 'rgba(34,197,94,0.15)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  scoreDeltaText: { color: '#22c55e', fontSize: 12, fontWeight: '700' },
  scoreNum: { fontSize: 48, fontWeight: '800', color: '#22c55e' },
  scoreTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  scoreFill: { height: 6, borderRadius: 3, backgroundColor: '#22c55e' },
  scoreCo2: { fontSize: 13 },
});
