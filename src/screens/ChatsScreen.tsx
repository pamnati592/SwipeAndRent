import { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ChatsStackParamList } from '../navigation/ChatsStackNavigator';
import { supabase } from '../services/supabase';

type ConversationRow = {
  id: string;
  renter_id: string;
  lender_id: string;
  last_message: string | null;
  last_message_at: string | null;
  item_title: string;
  renter_name: string;
  lender_name: string;
};

type Props = {
  navigation: NativeStackNavigationProp<ChatsStackParamList, 'ConversationsList'>;
};

export default function ChatsScreen({ navigation }: Props) {
  const [conversations, setConversations] = useState<ConversationRow[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadConversations();
    }, [])
  );

  async function loadConversations() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    setCurrentUserId(user.id);

    const { data, error } = await supabase
      .from('conversations')
      .select(`
        id, renter_id, lender_id, last_message, last_message_at,
        items(title),
        renter:profiles!conversations_renter_id_fkey(full_name),
        lender:profiles!conversations_lender_id_fkey(full_name)
      `)
      .order('last_message_at', { ascending: false });

    if (!error && data) {
      setConversations(
        (data as any[]).map((c) => ({
          id: c.id,
          renter_id: c.renter_id,
          lender_id: c.lender_id,
          last_message: c.last_message,
          last_message_at: c.last_message_at,
          item_title: c.items?.title ?? 'Item',
          renter_name: c.renter?.full_name ?? 'Renter',
          lender_name: c.lender?.full_name ?? 'Lender',
        }))
      );
    }
    setLoading(false);
  }

  function otherName(conv: ConversationRow): string {
    if (!currentUserId) return '';
    return conv.renter_id === currentUserId ? conv.lender_name : conv.renter_name;
  }

  function formatTime(iso: string | null): string {
    if (!iso) return '';
    const d = new Date(iso);
    const diffMs = Date.now() - d.getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays === 0) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diffDays === 1) return 'Yesterday';
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
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
      <Text style={styles.header}>Chats</Text>

      {conversations.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>💬</Text>
          <Text style={styles.emptyTitle}>No conversations yet</Text>
          <Text style={styles.emptySubtext}>Tap "Chat" on any item to start one</Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(c) => c.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item: conv }) => {
            const name = otherName(conv);
            return (
              <TouchableOpacity
                style={styles.row}
                onPress={() =>
                  navigation.navigate('ChatRoom', {
                    conversationId: conv.id,
                    itemTitle: conv.item_title,
                    otherUserName: name,
                  })
                }
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={styles.rowContent}>
                  <View style={styles.rowTop}>
                    <Text style={styles.userName} numberOfLines={1}>{name}</Text>
                    <Text style={styles.time}>{formatTime(conv.last_message_at)}</Text>
                  </View>
                  <Text style={styles.itemTitle} numberOfLines={1}>📦 {conv.item_title}</Text>
                  <Text style={styles.lastMessage} numberOfLines={1}>
                    {conv.last_message ?? 'No messages yet'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  header: {
    fontSize: 24, fontWeight: 'bold', color: '#fff',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: '#2a2a2a',
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, paddingBottom: 60 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#fff' },
  emptySubtext: { fontSize: 14, color: '#666' },
  separator: { height: 1, backgroundColor: '#2a2a2a', marginLeft: 76 },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#2a2a2a', borderWidth: 1, borderColor: '#3a3a3a',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 20, color: '#fff', fontWeight: '600' },
  rowContent: { flex: 1, gap: 2 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  userName: { fontSize: 15, fontWeight: '600', color: '#fff', flex: 1, marginRight: 8 },
  time: { fontSize: 12, color: '#666' },
  itemTitle: { fontSize: 12, color: '#666' },
  lastMessage: { fontSize: 13, color: '#888', marginTop: 1 },
});
