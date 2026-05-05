import { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator,
  Modal, Alert,
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

type ItemRow = {
  id: string;
  title: string;
  category: string;
  verification_status: string;
  daily_price: number;
  available_from: string | null;
  available_to: string | null;
  bookings: Booking[];
};

const CATEGORY_EMOJI: Record<string, string> = {
  photography: '📷', gaming: '🎮', camping: '⛺',
  diy: '🔧', music: '🎸', sports: '⚽',
};

const STATUS_COLORS: Record<string, string> = {
  pending:   '#f0a500',
  approved:  '#4da6ff',
  active:    '#4cd964',
  completed: '#666',
  rejected:  '#888',
};

const STATUS_LABELS: Record<string, string> = {
  pending:  'Pending',
  approved: 'Approved',
  active:   'Active',
  completed:'Done',
  rejected: 'Declined',
};

type Props = NativeStackScreenProps<ProfileStackParamList, 'MyItems'>;

function fmt(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function buildPeriodMarks(start: string | null, end: string | null): Record<string, any> {
  if (!start) return {};
  const marks: Record<string, any> = {};
  const cur = new Date(start);
  const last = end ? new Date(end) : new Date(start);
  let i = 0;
  while (cur <= last) {
    const d = cur.toISOString().split('T')[0];
    marks[d] = { color: '#fff', textColor: '#000', startingDay: i === 0, endingDay: cur.getTime() >= last.getTime() };
    cur.setDate(cur.getDate() + 1);
    i++;
  }
  return marks;
}

export default function MyItemsScreen({ navigation }: Props) {
  const [items, setItems] = useState<ItemRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<ItemRow | null>(null);
  const [availStart, setAvailStart] = useState<string | null>(null);
  const [availEnd, setAvailEnd] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  async function load() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const [itemsRes, txRes] = await Promise.all([
      supabase
        .from('items')
        .select('id, title, category, verification_status, daily_price, available_from, available_to')
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
        available_from: item.available_from ?? null,
        available_to: item.available_to ?? null,
        bookings: txByItem[item.id] ?? [],
      }))
    );
    setLoading(false);
  }

  function itemAvailability(item: ItemRow): { label: string; color: string } {
    const active = item.bookings.find(b => b.status === 'active');
    if (active) return { label: 'Rented', color: '#4cd964' };
    const approved = item.bookings.find(b => b.status === 'approved');
    if (approved) return { label: 'Booked', color: '#4da6ff' };
    const pending = item.bookings.find(b => b.status === 'pending');
    if (pending) return { label: `${item.bookings.filter(b => b.status === 'pending').length} pending`, color: '#f0a500' };
    return { label: 'Available', color: '#4cd964' };
  }

  function openAvailEditor(item: ItemRow) {
    setEditItem(item);
    setAvailStart(item.available_from ?? null);
    setAvailEnd(item.available_to ?? null);
  }

  function onAvailDayPress(day: { dateString: string }) {
    const d = day.dateString;
    if (!availStart || (availStart && availEnd)) {
      setAvailStart(d);
      setAvailEnd(null);
    } else if (d < availStart) {
      setAvailStart(d);
      setAvailEnd(null);
    } else {
      setAvailEnd(d);
    }
  }

  async function saveAvailability() {
    if (!editItem) return;
    setSaving(true);
    const { error } = await supabase
      .from('items')
      .update({ available_from: availStart, available_to: availEnd })
      .eq('id', editItem.id);
    setSaving(false);
    if (error) { Alert.alert('Error', error.message); return; }
    setItems(prev => prev.map(i =>
      i.id === editItem.id ? { ...i, available_from: availStart, available_to: availEnd } : i
    ));
    setEditItem(null);
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color="#fff" style={{ flex: 1 }} />
      </SafeAreaView>
    );
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
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => {
            const avail = itemAvailability(item);
            return (
              <View style={styles.card}>
                <TouchableOpacity style={styles.cardHeader} onPress={() => openAvailEditor(item)}>
                  <Text style={styles.emoji}>{CATEGORY_EMOJI[item.category] ?? '📦'}</Text>
                  <View style={styles.cardMeta}>
                    <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.itemPrice}>₪{item.daily_price}/day</Text>
                    {item.available_from ? (
                      <Text style={styles.availRange}>
                        📅 {fmt(item.available_from)}{item.available_to ? ` → ${fmt(item.available_to)}` : '+'}
                      </Text>
                    ) : (
                      <Text style={styles.availRangeMuted}>Tap to set availability</Text>
                    )}
                  </View>
                  <View style={[styles.availBadge, { backgroundColor: avail.color + '22', borderColor: avail.color }]}>
                    <Text style={[styles.availText, { color: avail.color }]}>{avail.label}</Text>
                  </View>
                </TouchableOpacity>

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

      {/* Availability date editor modal */}
      <Modal visible={!!editItem} transparent animationType="slide" onRequestClose={() => setEditItem(null)}>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Set Availability</Text>
            <Text style={styles.sheetSubtitle}>
              {editItem?.title} · {availStart ? `${fmt(availStart)}${availEnd ? ` → ${fmt(availEnd)}` : ' (pick end)'}` : 'Tap start date'}
            </Text>

            <Calendar
              markingType="period"
              markedDates={buildPeriodMarks(availStart, availEnd)}
              onDayPress={onAvailDayPress}
              minDate={new Date().toISOString().split('T')[0]}
              theme={{
                backgroundColor: '#242424',
                calendarBackground: '#242424',
                textSectionTitleColor: '#666',
                selectedDayBackgroundColor: '#fff',
                selectedDayTextColor: '#000',
                todayTextColor: '#fff',
                dayTextColor: '#fff',
                textDisabledColor: '#444',
                monthTextColor: '#fff',
                arrowColor: '#fff',
              }}
            />

            <View style={styles.sheetActions}>
              <TouchableOpacity style={styles.clearBtn} onPress={() => { setAvailStart(null); setAvailEnd(null); }}>
                <Text style={styles.clearBtnText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, (!availStart || saving) && styles.saveBtnDisabled]}
                onPress={saveAvailability}
                disabled={!availStart || saving}
              >
                {saving
                  ? <ActivityIndicator color="#000" size="small" />
                  : <Text style={styles.saveBtnText}>Save</Text>
                }
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditItem(null)}>
              <Text style={styles.cancelText}>Cancel</Text>
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
  separator: { height: 12 },

  card: {
    backgroundColor: '#242424', borderRadius: 16,
    borderWidth: 1, borderColor: '#2a2a2a', padding: 16, gap: 12,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  emoji: { fontSize: 32 },
  cardMeta: { flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: '600', color: '#fff' },
  itemPrice: { fontSize: 13, color: '#888', marginTop: 2 },
  availRange: { fontSize: 12, color: '#4da6ff', marginTop: 3 },
  availRangeMuted: { fontSize: 12, color: '#444', marginTop: 3 },
  availBadge: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20, borderWidth: 1,
  },
  availText: { fontSize: 12, fontWeight: '600' },

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

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#242424', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 40, gap: 16,
  },
  sheetHandle: { width: 40, height: 4, backgroundColor: '#444', borderRadius: 2, alignSelf: 'center', marginBottom: 4 },
  sheetTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  sheetSubtitle: { fontSize: 13, color: '#888', marginTop: -8 },
  sheetActions: { flexDirection: 'row', gap: 12 },
  clearBtn: {
    flex: 1, height: 48,
    borderWidth: 1, borderColor: '#444', borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  clearBtnText: { color: '#aaa', fontWeight: '600' },
  saveBtn: {
    flex: 2, height: 48, backgroundColor: '#fff',
    borderRadius: 12, alignItems: 'center', justifyContent: 'center',
  },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { color: '#000', fontWeight: '700', fontSize: 15 },
  cancelBtn: { height: 44, alignItems: 'center', justifyContent: 'center' },
  cancelText: { color: '#666', fontSize: 15 },
});
