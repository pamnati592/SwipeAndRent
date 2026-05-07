import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Image, ActivityIndicator, Modal, ScrollView,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../services/supabase';

const CATEGORY_EMOJI: Record<string, string> = {
  photography: '📷', gaming: '🎮', camping: '⛺',
  diy: '🔧', music: '🎸', sports: '⚽',
};

type ResultItem = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  city: string | null;
  daily_price: number;
  sale_price: number | null;
  photos: string[] | null;
  owner_id: string;
  reason: string;
  score: number;
};

type MarkedDates = Record<string, {
  startingDay?: boolean;
  endingDay?: boolean;
  color?: string;
  textColor?: string;
}>;

function buildPeriodMarks(start: string, end: string): MarkedDates {
  const marks: MarkedDates = {};
  const cur = new Date(start);
  const last = new Date(end);
  while (cur <= last) {
    const key = cur.toISOString().split('T')[0];
    marks[key] = {
      color: '#8b5cf6',
      textColor: '#fff',
      startingDay: key === start,
      endingDay: key === end,
    };
    cur.setDate(cur.getDate() + 1);
  }
  return marks;
}

const TODAY = new Date().toISOString().split('T')[0];

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function formatDate(d: string | null) {
  if (!d) return 'Select';
  const [, m, day] = d.split('-');
  return `${parseInt(day)} ${MONTHS[parseInt(m) - 1]}`;
}

export default function AIPlannerScreen() {
  const navigation = useNavigation<any>();

  const [query, setQuery] = useState('');
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [pickingStart, setPickingStart] = useState(true);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ResultItem[] | null>(null);

  function onDayPress(day: { dateString: string }) {
    if (pickingStart) {
      setStartDate(day.dateString);
      setEndDate(null);
      setPickingStart(false);
    } else {
      if (day.dateString < (startDate ?? '')) {
        setStartDate(day.dateString);
        setEndDate(null);
      } else {
        setEndDate(day.dateString);
        setCalendarVisible(false);
        setPickingStart(true);
      }
    }
  }

  const markedDates: MarkedDates = startDate && endDate
    ? buildPeriodMarks(startDate, endDate)
    : startDate
    ? { [startDate]: { startingDay: true, endingDay: true, color: '#8b5cf6', textColor: '#fff' } }
    : {};

  async function handleSearch() {
    if (!query.trim()) {
      Alert.alert('Type a query', 'Describe what you\'re looking for.');
      return;
    }
    setLoading(true);
    setResults(null);
    try {
      const res = await supabase.functions.invoke('ai-search', {
        body: { query: query.trim(), start_date: startDate, end_date: endDate },
      });
      if (res.error) throw res.error;
      setResults(res.data?.results ?? []);
    } catch (err: any) {
      Alert.alert('Search failed', err?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  function openItem(item: ResultItem) {
    navigation.navigate('HomeStack', {
      screen: 'ItemDetail',
      params: {
        item: {
          id: item.id,
          owner_id: item.owner_id,
          title: item.title,
          description: item.description,
          daily_price: item.daily_price,
          sale_price: item.sale_price ?? null,
          category: item.category,
          city: item.city,
          photos: item.photos,
        },
      },
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>✨ AI Planner</Text>
          <Text style={styles.subtitle}>Describe what you need and let AI find it</Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. tent for a camping weekend in the mountains"
            placeholderTextColor="#555"
            value={query}
            onChangeText={setQuery}
            multiline
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />

          <Text style={styles.label}>Dates (optional)</Text>
          <View style={styles.dateRow}>
            <TouchableOpacity
              style={styles.dateBtn}
              onPress={() => { setPickingStart(true); setCalendarVisible(true); }}
            >
              <Text style={styles.dateBtnIcon}>📅</Text>
              <Text style={styles.dateBtnText}>{formatDate(startDate)}</Text>
            </TouchableOpacity>
            <Text style={styles.dateArrow}>→</Text>
            <TouchableOpacity
              style={styles.dateBtn}
              onPress={() => { setPickingStart(false); setCalendarVisible(true); }}
            >
              <Text style={styles.dateBtnIcon}>📅</Text>
              <Text style={styles.dateBtnText}>{formatDate(endDate)}</Text>
            </TouchableOpacity>
            {(startDate || endDate) ? (
              <TouchableOpacity
                style={styles.clearDates}
                onPress={() => { setStartDate(null); setEndDate(null); }}
              >
                <Text style={styles.clearDatesText}>✕</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          <TouchableOpacity
            style={[styles.searchBtn, loading && { opacity: 0.6 }]}
            onPress={handleSearch}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.searchBtnText}>Search with AI</Text>
            }
          </TouchableOpacity>

          {results !== null && (
            results.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={styles.emptyText}>No matching items found.</Text>
                <Text style={styles.emptyHint}>Try a different search or broader dates.</Text>
              </View>
            ) : (
              <View>
                <Text style={styles.resultsHeader}>{results.length} result{results.length !== 1 ? 's' : ''}</Text>
                {results.map(item => (
                  <TouchableOpacity key={item.id} style={styles.card} onPress={() => openItem(item)}>
                    <View style={styles.cardMedia}>
                      {item.photos?.[0]
                        ? <Image source={{ uri: item.photos[0] }} style={styles.cardImage} />
                        : <Text style={styles.cardEmoji}>{CATEGORY_EMOJI[item.category] ?? '📦'}</Text>
                      }
                    </View>
                    <View style={styles.cardBody}>
                      <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                      <Text style={styles.cardMeta}>{item.city ?? ''} · ₪{item.daily_price}/day</Text>
                      <Text style={styles.cardReason} numberOfLines={2}>{item.reason}</Text>
                    </View>
                    <Text style={styles.cardArrow}>›</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={calendarVisible} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => { setCalendarVisible(false); setPickingStart(true); }}
        >
          <View style={styles.calendarSheet} onStartShouldSetResponder={() => true}>
            <Text style={styles.calendarHint}>
              {pickingStart ? 'Tap to set start date' : 'Tap to set end date'}
            </Text>
            <Calendar
              minDate={TODAY}
              onDayPress={onDayPress}
              markingType="period"
              markedDates={markedDates}
              theme={{
                backgroundColor: '#1e1e1e',
                calendarBackground: '#1e1e1e',
                textSectionTitleColor: '#888',
                dayTextColor: '#fff',
                todayTextColor: '#8b5cf6',
                selectedDayBackgroundColor: '#8b5cf6',
                selectedDayTextColor: '#fff',
                monthTextColor: '#fff',
                arrowColor: '#8b5cf6',
                textDisabledColor: '#444',
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  scroll: { padding: 20, paddingBottom: 40 },
  title: { color: '#fff', fontSize: 26, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: '#888', fontSize: 14, marginBottom: 20 },
  input: {
    backgroundColor: '#2a2a2a',
    color: '#fff',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 20,
  },
  label: { color: '#888', fontSize: 13, marginBottom: 8 },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 8 },
  dateBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#333',
  },
  dateBtnIcon: { fontSize: 16 },
  dateBtnText: { color: '#fff', fontSize: 14 },
  dateArrow: { color: '#555', fontSize: 18 },
  clearDates: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#333', alignItems: 'center', justifyContent: 'center',
  },
  clearDatesText: { color: '#aaa', fontSize: 14 },
  searchBtn: {
    backgroundColor: '#8b5cf6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 28,
  },
  searchBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  resultsHeader: { color: '#888', fontSize: 13, marginBottom: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#242424',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  cardMedia: {
    width: 80, height: 80,
    backgroundColor: '#2e2e2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImage: { width: 80, height: 80 },
  cardEmoji: { fontSize: 34 },
  cardBody: { flex: 1, padding: 12 },
  cardTitle: { color: '#fff', fontSize: 15, fontWeight: '600', marginBottom: 2 },
  cardMeta: { color: '#888', fontSize: 12, marginBottom: 4 },
  cardReason: { color: '#a78bfa', fontSize: 12, fontStyle: 'italic' },
  cardArrow: { color: '#555', fontSize: 24, paddingRight: 12 },
  emptyState: { alignItems: 'center', paddingTop: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: '#fff', fontSize: 17, fontWeight: '600', marginBottom: 6 },
  emptyHint: { color: '#666', fontSize: 14 },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  calendarSheet: {
    backgroundColor: '#1e1e1e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: 36,
  },
  calendarHint: { color: '#aaa', fontSize: 14, textAlign: 'center', marginBottom: 8 },
});
