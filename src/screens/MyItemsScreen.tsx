import { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator,
  Modal, Alert, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { supabase } from '../services/supabase';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../navigation/ProfileStackNavigator';

type Booking = {
  id: string;
  start_date: string;
  end_date: string;
  status: string;
  renter_name: string;
  conversation_id: string | null;
};

type BlockedRange = {
  id: string;
  blocked_from: string;
  blocked_to: string;
};

type ItemRow = {
  id: string;
  title: string;
  category: string;
  verification_status: string;
  daily_price: number;
  is_hidden: boolean;
  bookings: Booking[];
};

const CATEGORY_EMOJI: Record<string, string> = {
  photography: '📷', gaming: '🎮', camping: '⛺',
  diy: '🔧', music: '🎸', sports: '⚽',
};

const STATUS_COLORS: Record<string, string> = {
  pending: '#f0a500', approved: '#4da6ff',
  active: '#4cd964', completed: '#666', rejected: '#888',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending', approved: 'Approved',
  active: 'Active', completed: 'Done', rejected: 'Declined',
};

type Props = NativeStackScreenProps<ProfileStackParamList, 'MyItems'>;

function fmt(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function expandRange(from: string, to: string): string[] {
  const dates: string[] = [];
  const cur = new Date(from);
  const last = new Date(to);
  while (cur <= last) {
    dates.push(cur.toISOString().split('T')[0]);
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

function buildCalendarMarks(
  existingRanges: BlockedRange[],
  selStart: string | null,
  selEnd: string | null,
): Record<string, any> {
  const marks: Record<string, any> = {};

  // Existing blocked ranges → red
  existingRanges.forEach(r => {
    const days = expandRange(r.blocked_from, r.blocked_to);
    days.forEach((d, i) => {
      marks[d] = {
        color: '#7b1c1c', textColor: '#ff9999',
        startingDay: i === 0, endingDay: i === days.length - 1,
      };
    });
  });

  // Current selection → white (overrides red)
  if (selStart) {
    const end = selEnd ?? selStart;
    const days = expandRange(selStart, end);
    days.forEach((d, i) => {
      marks[d] = {
        color: '#fff', textColor: '#000',
        startingDay: i === 0, endingDay: i === days.length - 1,
      };
    });
  }

  return marks;
}

export default function MyItemsScreen({ navigation }: Props) {
  const [items, setItems] = useState<ItemRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Availability editor state
  const [editItem, setEditItem] = useState<ItemRow | null>(null);
  const [blockedRanges, setBlockedRanges] = useState<BlockedRange[]>([]);
  const [loadingRanges, setLoadingRanges] = useState(false);
  const [selStart, setSelStart] = useState<string | null>(null);
  const [selEnd, setSelEnd] = useState<string | null>(null);
  const [addingRange, setAddingRange] = useState(false);

  useFocusEffect(useCallback(() => { load(); }, []));

  async function load() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const [itemsRes, txRes] = await Promise.all([
      supabase
        .from('items')
        .select('id, title, category, verification_status, daily_price, is_hidden')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('transactions')
        .select('id, item_id, start_date, end_date, status, conversation_id, renter:profiles!transactions_renter_id_fkey(full_name)')
        .eq('lender_id', user.id)
        .in('status', ['pending', 'approved', 'active'])
        .order('start_date', { ascending: true }),
    ]);

    if (!itemsRes.data) { setLoading(false); return; }

    const txByItem: Record<string, Booking[]> = {};
    (txRes.data ?? []).forEach((tx: any) => {
      if (!txByItem[tx.item_id]) txByItem[tx.item_id] = [];
      txByItem[tx.item_id].push({
        id: tx.id,
        start_date: tx.start_date,
        end_date: tx.end_date,
        status: tx.status,
        renter_name: tx.renter?.full_name ?? 'Renter',
        conversation_id: tx.conversation_id ?? null,
      });
    });

    setItems(
      (itemsRes.data as any[]).map(item => ({
        ...item,
        is_hidden: item.is_hidden ?? false,
        bookings: txByItem[item.id] ?? [],
      }))
    );
    setLoading(false);
  }

  function itemAvailability(item: ItemRow): { label: string; color: string } {
    if (item.is_hidden) return { label: 'Hidden', color: '#666' };
    const active = item.bookings.find(b => b.status === 'active');
    if (active) return { label: 'Rented', color: '#4cd964' };
    const approved = item.bookings.find(b => b.status === 'approved');
    if (approved) return { label: 'Booked', color: '#4da6ff' };
    const pending = item.bookings.find(b => b.status === 'pending');
    if (pending) return { label: `${item.bookings.filter(b => b.status === 'pending').length} pending`, color: '#f0a500' };
    return { label: 'Available', color: '#4cd964' };
  }

  async function toggleHidden(item: ItemRow) {
    const next = !item.is_hidden;
    const { error } = await supabase.from('items').update({ is_hidden: next }).eq('id', item.id);
    if (error) { Alert.alert('Error', error.message); return; }
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_hidden: next } : i));
  }

  async function openBlockEditor(item: ItemRow) {
    setEditItem(item);
    setSelStart(null);
    setSelEnd(null);
    setLoadingRanges(true);
    const { data } = await supabase
      .from('item_blocked_dates')
      .select('id, blocked_from, blocked_to')
      .eq('item_id', item.id)
      .order('blocked_from');
    setBlockedRanges((data ?? []) as BlockedRange[]);
    setLoadingRanges(false);
  }

  function onCalendarDayPress(day: { dateString: string }) {
    const d = day.dateString;
    if (!selStart || (selStart && selEnd)) {
      setSelStart(d); setSelEnd(null);
    } else if (d < selStart) {
      setSelStart(d); setSelEnd(null);
    } else {
      setSelEnd(d);
    }
  }

  async function addRange() {
    if (!editItem || !selStart || !selEnd) return;
    setAddingRange(true);

    // Block if it overlaps an approved or active booking
    const { data: conflicts } = await supabase
      .from('transactions')
      .select('start_date, end_date')
      .eq('item_id', editItem.id)
      .in('status', ['approved', 'active'])
      .lte('start_date', selEnd)
      .gte('end_date', selStart);

    if (conflicts && conflicts.length > 0) {
      const c = conflicts[0];
      Alert.alert(
        'Cannot block these dates',
        `They overlap with an approved or active booking (${fmt(c.start_date)} → ${fmt(c.end_date)}).`
      );
      setAddingRange(false);
      return;
    }

    const { data, error } = await supabase
      .from('item_blocked_dates')
      .insert({ item_id: editItem.id, blocked_from: selStart, blocked_to: selEnd })
      .select('id, blocked_from, blocked_to')
      .single();

    if (error) { Alert.alert('Error', error.message); }
    else if (data) {
      setBlockedRanges(prev =>
        [...prev, data as BlockedRange].sort((a, b) => a.blocked_from.localeCompare(b.blocked_from))
      );
    }
    setSelStart(null);
    setSelEnd(null);
    setAddingRange(false);
  }

  async function deleteRange(id: string) {
    const { error } = await supabase.from('item_blocked_dates').delete().eq('id', id);
    if (!error) setBlockedRanges(prev => prev.filter(r => r.id !== id));
  }

  async function clearAllRanges() {
    if (!editItem) return;
    Alert.alert('Clear all blocked dates?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear all', style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.from('item_blocked_dates').delete().eq('item_id', editItem.id);
          if (!error) setBlockedRanges([]);
        },
      },
    ]);
  }

  if (loading) {
    return <SafeAreaView style={styles.container}><ActivityIndicator color="#fff" style={{ flex: 1 }} /></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Items</Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyTitle}>No items yet</Text>
          <Text style={styles.emptySubtext}>Tap + to list your first item</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={i => i.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const avail = itemAvailability(item);
            return (
              <View style={[styles.card, item.is_hidden && styles.cardHidden]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.emoji}>{CATEGORY_EMOJI[item.category] ?? '📦'}</Text>
                  <View style={styles.cardMeta}>
                    <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.itemPrice}>₪{item.daily_price}/day</Text>
                  </View>
                  <View style={[styles.availBadge, { backgroundColor: avail.color + '22', borderColor: avail.color }]}>
                    <Text style={[styles.availText, { color: avail.color }]}>{avail.label}</Text>
                  </View>
                </View>

                {/* Action row */}
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => openBlockEditor(item)}>
                    <Text style={styles.actionBtnText}>🚫 Blocked dates</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, item.is_hidden && styles.actionBtnActive]}
                    onPress={() => toggleHidden(item)}
                  >
                    <Text style={styles.actionBtnText}>{item.is_hidden ? '👁 Show item' : '🙈 Hide item'}</Text>
                  </TouchableOpacity>
                </View>

                {item.bookings.length > 0 && (
                  <View style={styles.bookingsSection}>
                    <Text style={styles.bookingsSectionTitle}>Upcoming bookings</Text>
                    {item.bookings.map(b => (
                      <TouchableOpacity
                        key={b.id}
                        style={styles.bookingRow}
                        disabled={!b.conversation_id}
                        onPress={() => {
                          if (!b.conversation_id) return;
                          (navigation as any).getParent()?.navigate('Chats', {
                            screen: 'ChatRoom',
                            params: {
                              conversationId: b.conversation_id,
                              itemTitle: item.title,
                              otherUserName: b.renter_name,
                              targetTransactionId: b.id,
                            },
                          });
                        }}
                      >
                        <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[b.status] ?? '#666' }]} />
                        <Text style={styles.bookingDates}>{fmt(b.start_date)} → {fmt(b.end_date)}</Text>
                        <Text style={styles.bookingRenter} numberOfLines={1}>{b.renter_name}</Text>
                        <View style={styles.bookingRight}>
                          <Text style={[styles.bookingStatus, { color: STATUS_COLORS[b.status] ?? '#666' }]}>
                            {STATUS_LABELS[b.status] ?? b.status}
                          </Text>
                          {b.conversation_id && <Text style={styles.bookingChevron}>›</Text>}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            );
          }}
        />
      )}

      {/* Blocked dates editor */}
      <Modal visible={!!editItem} transparent animationType="slide" onRequestClose={() => setEditItem(null)}>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Block Unavailable Dates</Text>
            <Text style={styles.sheetSubtitle}>
              {editItem?.title} · dates renters <Text style={{ color: '#f44336' }}>cannot</Text> book
            </Text>

            {loadingRanges ? (
              <ActivityIndicator color="#fff" style={{ marginVertical: 16 }} />
            ) : (
              <ScrollView style={styles.sheetScroll} showsVerticalScrollIndicator={false}>
                {/* Existing blocked ranges */}
                {blockedRanges.length > 0 && (
                  <View style={styles.rangesSection}>
                    <View style={styles.rangesHeader}>
                      <Text style={styles.rangesTitle}>Currently blocked</Text>
                      <TouchableOpacity onPress={clearAllRanges}>
                        <Text style={styles.clearAllText}>Clear all</Text>
                      </TouchableOpacity>
                    </View>
                    {blockedRanges.map(r => (
                      <View key={r.id} style={styles.rangeRow}>
                        <Text style={styles.rangeIcon}>🚫</Text>
                        <Text style={styles.rangeText}>{fmt(r.blocked_from)} → {fmt(r.blocked_to)}</Text>
                        <TouchableOpacity onPress={() => deleteRange(r.id)} style={styles.rangeDeleteBtn}>
                          <Text style={styles.rangeDeleteText}>✕</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}

                {/* Calendar to add a new range */}
                <Text style={styles.addTitle}>
                  {selStart
                    ? selEnd
                      ? `Selected: ${fmt(selStart)} → ${fmt(selEnd)}`
                      : `From ${fmt(selStart)} · pick end date`
                    : 'Tap a start date on the calendar'}
                </Text>

                <Calendar
                  markingType="period"
                  markedDates={buildCalendarMarks(blockedRanges, selStart, selEnd)}
                  onDayPress={onCalendarDayPress}
                  minDate={new Date().toISOString().split('T')[0]}
                  theme={{
                    backgroundColor: '#2a2a2a',
                    calendarBackground: '#2a2a2a',
                    textSectionTitleColor: '#666',
                    selectedDayBackgroundColor: '#fff',
                    selectedDayTextColor: '#000',
                    todayTextColor: '#4da6ff',
                    dayTextColor: '#fff',
                    textDisabledColor: '#444',
                    monthTextColor: '#fff',
                    arrowColor: '#fff',
                  }}
                />

                <TouchableOpacity
                  style={[styles.addBtn, (!selStart || !selEnd || addingRange) && styles.addBtnDisabled]}
                  onPress={addRange}
                  disabled={!selStart || !selEnd || addingRange}
                >
                  {addingRange
                    ? <ActivityIndicator color="#000" size="small" />
                    : <Text style={styles.addBtnText}>+ Add blocked period</Text>
                  }
                </TouchableOpacity>
              </ScrollView>
            )}

            <TouchableOpacity style={styles.doneBtn} onPress={() => setEditItem(null)}>
              <Text style={styles.doneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#2a2a2a',
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backText: { color: '#fff', fontSize: 22, fontWeight: '300' },
  title: { fontSize: 20, fontWeight: '700', color: '#fff' },

  list: { padding: 16, gap: 12 },

  card: {
    backgroundColor: '#242424', borderRadius: 16,
    borderWidth: 1, borderColor: '#2a2a2a', padding: 16, gap: 12,
  },
  cardHidden: { opacity: 0.5 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  emoji: { fontSize: 32 },
  cardMeta: { flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: '600', color: '#fff' },
  itemPrice: { fontSize: 13, color: '#888', marginTop: 2 },
  availBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  availText: { fontSize: 12, fontWeight: '600' },

  actionRow: { flexDirection: 'row', gap: 8 },
  actionBtn: {
    flex: 1, height: 36,
    backgroundColor: '#2a2a2a', borderRadius: 8,
    borderWidth: 1, borderColor: '#3a3a3a',
    alignItems: 'center', justifyContent: 'center',
  },
  actionBtnActive: { borderColor: '#4da6ff', backgroundColor: '#0a1a2a' },
  actionBtnText: { color: '#aaa', fontSize: 12, fontWeight: '500' },

  bookingsSection: { gap: 8, borderTopWidth: 1, borderTopColor: '#2a2a2a', paddingTop: 12 },
  bookingsSectionTitle: { fontSize: 11, color: '#555', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  bookingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  bookingDates: { fontSize: 13, color: '#ccc', flex: 1 },
  bookingRenter: { fontSize: 13, color: '#888', maxWidth: 80 },
  bookingRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  bookingStatus: { fontSize: 12, fontWeight: '600' },
  bookingChevron: { fontSize: 16, color: '#555', fontWeight: '300' },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, paddingBottom: 60 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#fff' },
  emptySubtext: { fontSize: 14, color: '#666' },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#1e1e1e', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 0, maxHeight: '90%',
  },
  sheetHandle: { width: 40, height: 4, backgroundColor: '#444', borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  sheetTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  sheetSubtitle: { fontSize: 13, color: '#888', marginBottom: 4 },
  sheetScroll: { marginTop: 8 },

  rangesSection: { marginBottom: 16, gap: 8 },
  rangesHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rangesTitle: { fontSize: 12, color: '#666', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  clearAllText: { fontSize: 12, color: '#f44336' },
  rangeRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#2a1a1a', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10,
    borderWidth: 1, borderColor: '#4a2a2a',
  },
  rangeIcon: { fontSize: 14 },
  rangeText: { flex: 1, color: '#ff9999', fontSize: 14, fontWeight: '500' },
  rangeDeleteBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  rangeDeleteText: { color: '#f44336', fontSize: 14, fontWeight: '600' },

  addTitle: { fontSize: 13, color: '#aaa', textAlign: 'center', marginBottom: 8, minHeight: 18 },
  addBtn: {
    height: 48, backgroundColor: '#fff', borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginTop: 12, marginBottom: 8,
  },
  addBtnDisabled: { opacity: 0.35 },
  addBtnText: { color: '#000', fontWeight: '700', fontSize: 15 },

  doneBtn: {
    height: 52, alignItems: 'center', justifyContent: 'center',
    borderTopWidth: 1, borderTopColor: '#2a2a2a', marginTop: 4, marginHorizontal: -24,
  },
  doneBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
