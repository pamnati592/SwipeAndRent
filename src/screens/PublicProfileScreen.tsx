import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Image, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../navigation/HomeStackNavigator';
import type { Item } from '../types/item';
import { supabase } from '../services/supabase';

const CATEGORY_EMOJI: Record<string, string> = {
  photography: '📷',
  gaming: '🎮',
  camping: '⛺',
  diy: '🔧',
  music: '🎸',
  sports: '⚽',
};

type Props = NativeStackScreenProps<HomeStackParamList, 'PublicProfile'>;

export default function PublicProfileScreen({ navigation, route }: Props) {
  const { userId, userName } = route.params;
  const [items, setItems] = useState<Item[]>([]);
  const [city, setCity] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [profileRes, itemsRes] = await Promise.all([
        supabase.from('profiles').select('city').eq('id', userId).single(),
        supabase
          .from('items')
          .select('id, owner_id, title, description, daily_price, sale_price, category, city, photos')
          .eq('owner_id', userId)
          .eq('verification_status', 'live')
          .eq('is_hidden', false),
      ]);
      if (profileRes.data) setCity((profileRes.data as any).city ?? null);
      if (itemsRes.data) setItems(itemsRes.data as Item[]);
      setLoading(false);
    }
    load();
  }, [userId]);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarInitial}>{userName.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{userName}</Text>
        {city && <Text style={styles.city}>📍 {city}</Text>}
      </View>

      <Text style={styles.sectionTitle}>Listings</Text>

      {loading ? (
        <ActivityIndicator color="#fff" style={{ marginTop: 40 }} />
      ) : items.length === 0 ? (
        <Text style={styles.empty}>No active listings</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const cover = item.photos?.find(Boolean);
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('ItemDetail', { item })}
              >
                {cover ? (
                  <Image source={{ uri: cover }} style={styles.cardImage} resizeMode="cover" />
                ) : (
                  <View style={styles.cardEmoji}>
                    <Text style={styles.cardEmojiText}>{CATEGORY_EMOJI[item.category] ?? '📦'}</Text>
                  </View>
                )}
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.cardPrice}>₪{item.daily_price}/day</Text>
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
  backButton: { paddingHorizontal: 20, paddingVertical: 12 },
  backText: { color: '#fff', fontSize: 15, fontWeight: '500' },

  header: { alignItems: 'center', paddingVertical: 24, gap: 8 },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#3a3a3a', alignItems: 'center', justifyContent: 'center',
  },
  avatarInitial: { color: '#fff', fontSize: 30, fontWeight: '700' },
  name: { color: '#fff', fontSize: 22, fontWeight: '700' },
  city: { color: '#888', fontSize: 14 },

  sectionTitle: {
    color: '#666', fontSize: 12, fontWeight: '600', letterSpacing: 1,
    paddingHorizontal: 20, marginBottom: 12,
  },

  list: { paddingHorizontal: 20, gap: 12, paddingBottom: 32 },
  empty: { color: '#555', textAlign: 'center', marginTop: 40, fontSize: 15 },

  card: {
    flexDirection: 'row', backgroundColor: '#242424',
    borderRadius: 12, overflow: 'hidden', alignItems: 'center',
  },
  cardImage: { width: 80, height: 80 },
  cardEmoji: {
    width: 80, height: 80, backgroundColor: '#333',
    alignItems: 'center', justifyContent: 'center',
  },
  cardEmojiText: { fontSize: 32 },
  cardInfo: { flex: 1, paddingHorizontal: 14, gap: 4 },
  cardTitle: { color: '#fff', fontSize: 15, fontWeight: '600' },
  cardPrice: { color: '#aaa', fontSize: 13 },
});
