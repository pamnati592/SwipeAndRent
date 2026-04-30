import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../services/supabase';

const ROLES = [
  { value: 'renter', label: 'Renter', description: 'I want to rent items from others', emoji: '🛒' },
  { value: 'lender', label: 'Lender', description: 'I want to lend my items out', emoji: '📦' },
  { value: 'both', label: 'Both', description: 'I want to rent and lend', emoji: '🔄' },
] as const;

const INTERESTS = [
  { value: 'photography', label: 'Photography', emoji: '📷' },
  { value: 'camping', label: 'Camping', emoji: '⛺' },
  { value: 'diy', label: 'DIY & Tools', emoji: '🔧' },
  { value: 'gaming', label: 'Gaming', emoji: '🎮' },
  { value: 'music', label: 'Music', emoji: '🎵' },
  { value: 'sports', label: 'Sports', emoji: '🚲' },
  { value: 'cooking', label: 'Cooking', emoji: '🍳' },
  { value: 'art', label: 'Art & Craft', emoji: '🎨' },
  { value: 'water_sports', label: 'Water Sports', emoji: '🌊' },
  { value: 'winter_sports', label: 'Winter Sports', emoji: '❄️' },
  { value: 'film', label: 'Film & Video', emoji: '🎬' },
  { value: 'outdoor', label: 'Outdoor', emoji: '🏕️' },
];

type Role = 'renter' | 'lender' | 'both';

export default function OnboardingScreen({ onFinished }: { onFinished: () => void }) {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role | null>(null);
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  function toggleInterest(value: string) {
    setInterests((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]
    );
  }

  async function finish() {
    if (interests.length < 3) {
      Alert.alert('Almost there', 'Please select at least 3 interests');
      return;
    }
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update({
          role,
          full_name: fullName.trim(),
          city: city.trim(),
          interests,
          onboarding_complete: true,
        })
        .eq('id', user.id);

      if (error) throw error;
      onFinished();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressBar}>
        {[1, 2, 3].map((s) => (
          <View key={s} style={[styles.progressSegment, step >= s && styles.progressSegmentActive]} />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* STEP 1 – Role */}
        {step === 1 && (
          <>
            <Text style={styles.title}>How will you use SwipeAndRent?</Text>
            <Text style={styles.subtitle}>You can change this later in your profile</Text>

            {ROLES.map((r) => (
              <TouchableOpacity
                key={r.value}
                style={[styles.roleCard, role === r.value && styles.roleCardSelected]}
                onPress={() => setRole(r.value)}
              >
                <Text style={styles.roleEmoji}>{r.emoji}</Text>
                <View style={styles.roleText}>
                  <Text style={[styles.roleLabel, role === r.value && styles.roleLabelSelected]}>
                    {r.label}
                  </Text>
                  <Text style={styles.roleDescription}>{r.description}</Text>
                </View>
                <View style={[styles.radioOuter, role === r.value && styles.radioOuterSelected]}>
                  {role === r.value && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.nextButton, !role && styles.nextButtonDisabled]}
              onPress={() => role && setStep(2)}
              disabled={!role}
            >
              <Text style={styles.nextButtonText}>Continue</Text>
            </TouchableOpacity>
          </>
        )}

        {/* STEP 2 – Details */}
        {step === 2 && (
          <>
            <Text style={styles.title}>Tell us about yourself</Text>
            <Text style={styles.subtitle}>This helps others know who they're renting to</Text>

            <Text style={styles.label}>Full name</Text>
            <TextInput
              style={styles.input}
              placeholder="Your full name"
              placeholderTextColor="#555"
              value={fullName}
              onChangeText={setFullName}
              autoFocus
            />

            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Tel Aviv"
              placeholderTextColor="#555"
              value={city}
              onChangeText={setCity}
            />

            <TouchableOpacity
              style={[styles.nextButton, (!fullName.trim() || !city.trim()) && styles.nextButtonDisabled]}
              onPress={() => (fullName.trim() && city.trim()) && setStep(3)}
              disabled={!fullName.trim() || !city.trim()}
            >
              <Text style={styles.nextButtonText}>Continue</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          </>
        )}

        {/* STEP 3 – Interests */}
        {step === 3 && (
          <>
            <Text style={styles.title}>What are you into?</Text>
            <Text style={styles.subtitle}>
              Select at least 3 — we'll use these to show you relevant items
            </Text>

            <View style={styles.interestsGrid}>
              {INTERESTS.map((item) => {
                const selected = interests.includes(item.value);
                return (
                  <TouchableOpacity
                    key={item.value}
                    style={[styles.interestChip, selected && styles.interestChipSelected]}
                    onPress={() => toggleInterest(item.value)}
                  >
                    <Text style={styles.interestEmoji}>{item.emoji}</Text>
                    <Text style={[styles.interestLabel, selected && styles.interestLabelSelected]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.selectionCount}>
              {interests.length} selected{interests.length < 3 ? ` (need ${3 - interests.length} more)` : ' ✓'}
            </Text>

            <TouchableOpacity
              style={[styles.nextButton, (interests.length < 3 || loading) && styles.nextButtonDisabled]}
              onPress={finish}
              disabled={interests.length < 3 || loading}
            >
              {loading
                ? <ActivityIndicator color="#000" />
                : <Text style={styles.nextButtonText}>Let's go!</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={() => setStep(2)}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  progressBar: { flexDirection: 'row', gap: 6, paddingHorizontal: 24, paddingTop: 16 },
  progressSegment: { flex: 1, height: 4, backgroundColor: '#2a2a2a', borderRadius: 2 },
  progressSegmentActive: { backgroundColor: '#fff' },
  content: { padding: 24, paddingBottom: 48, gap: 12 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginTop: 16, marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#888', marginBottom: 16 },
  label: { fontSize: 13, color: '#888', marginBottom: 6, marginTop: 4 },
  input: {
    height: 48, backgroundColor: '#2a2a2a', borderWidth: 2,
    borderColor: '#3a3a3a', borderRadius: 8, paddingHorizontal: 16, color: '#fff', fontSize: 15,
  },
  roleCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#2a2a2a', borderWidth: 2, borderColor: '#3a3a3a',
    borderRadius: 12, padding: 16,
  },
  roleCardSelected: { borderColor: '#fff', backgroundColor: '#2f2f2f' },
  roleEmoji: { fontSize: 28 },
  roleText: { flex: 1 },
  roleLabel: { fontSize: 16, fontWeight: '600', color: '#aaa' },
  roleLabelSelected: { color: '#fff' },
  roleDescription: { fontSize: 13, color: '#666', marginTop: 2 },
  radioOuter: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: '#555',
    alignItems: 'center', justifyContent: 'center',
  },
  radioOuterSelected: { borderColor: '#fff' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff' },
  interestsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  interestChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#2a2a2a', borderWidth: 2, borderColor: '#3a3a3a',
    borderRadius: 24, paddingHorizontal: 14, paddingVertical: 10,
  },
  interestChipSelected: { borderColor: '#fff', backgroundColor: '#2f2f2f' },
  interestEmoji: { fontSize: 16 },
  interestLabel: { fontSize: 13, color: '#888' },
  interestLabelSelected: { color: '#fff' },
  selectionCount: { fontSize: 13, color: '#666', textAlign: 'center' },
  nextButton: {
    height: 52, backgroundColor: '#fff', borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', marginTop: 8,
  },
  nextButtonDisabled: { backgroundColor: '#2a2a2a' },
  nextButtonText: { fontSize: 16, fontWeight: '600', color: '#000' },
  backButton: { alignItems: 'center', paddingVertical: 8 },
  backButtonText: { color: '#666', fontSize: 14 },
});
