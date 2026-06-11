import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

// Demo helper: a finger-tap dot that pulses once whenever `trigger` changes to
// a new non-null value. Position it over the element being "pressed".
export default function TapFlash({ trigger, style }: { trigger: number | null; style?: StyleProp<ViewStyle> }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale   = useRef(new Animated.Value(0.6)).current;
  // `undefined` = not yet mounted. A trigger already present at mount is stale
  // (e.g. left over from a previous slide) and must not fire a phantom tap.
  const lastTrigger = useRef<number | null | undefined>(undefined);

  useEffect(() => {
    if (lastTrigger.current === undefined) { lastTrigger.current = trigger; return; }
    if (trigger == null || trigger === lastTrigger.current) return;
    lastTrigger.current = trigger;
    opacity.setValue(0);
    scale.setValue(0.6);
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0.85, duration: 110, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 110, useNativeDriver: true }),
      ]),
      Animated.delay(130),
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 340, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1.7, duration: 340, useNativeDriver: true }),
      ]),
    ]).start();
  }, [trigger]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.dot, style, { opacity, transform: [{ scale }] }]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    position: 'absolute',
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 2, borderColor: 'rgba(0,0,0,0.18)',
    shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 9999, elevation: 12,
  },
});
