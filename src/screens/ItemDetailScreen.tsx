import { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Image, FlatList, TouchableOpacity,
  ScrollView, Dimensions, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../navigation/HomeStackNavigator';

const SCREEN_WIDTH = Dimensions.get('window').width;

const CATEGORY_EMOJI: Record<string, string> = {
  photography: '📷',
  gaming: '🎮',
  camping: '⛺',
  diy: '🔧',
  music: '🎸',
  sports: '⚽',
};

type Props = NativeStackScreenProps<HomeStackParamList, 'ItemDetail'>;

export default function ItemDetailScreen({ navigation, route }: Props) {
  const { item } = route.params;
  const photos = item.photos?.filter(Boolean) ?? [];
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Photo gallery */}
        <View style={styles.galleryContainer}>
          {photos.length > 0 ? (
            <>
              <FlatList
                data={photos}
                keyExtractor={(_, i) => String(i)}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(e) => {
                  const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                  setActiveIndex(index);
                }}
                renderItem={({ item: photoUrl }) => (
                  <Image
                    source={{ uri: photoUrl }}
                    style={styles.photo}
                    resizeMode="cover"
                    onError={(e) => console.warn('Item photo failed to load:', photoUrl, e.nativeEvent.error)}
                  />
                )}
              />
              {photos.length > 1 && (
                <View style={styles.dotRow}>
                  {photos.map((_, i) => (
                    <View
                      key={i}
                      style={[styles.dot, i === activeIndex && styles.dotActive]}
                    />
                  ))}
                </View>
              )}
            </>
          ) : (
            <View style={styles.emojiPlaceholder}>
              <Text style={styles.emojiText}>
                {CATEGORY_EMOJI[item.category] ?? '📦'}
              </Text>
            </View>
          )}
        </View>

        {/* Item details */}
        <View style={styles.details}>
          <Text style={styles.title}>{item.title}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.price}>₪{item.daily_price}/day</Text>
            {item.sale_price != null && (
              <Text style={styles.salePrice}>Buy: ₪{item.sale_price}</Text>
            )}
          </View>

          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{item.category}</Text>
            </View>
            {item.city && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>📍 {item.city}</Text>
              </View>
            )}
          </View>

          {item.description ? (
            <>
              <Text style={styles.sectionLabel}>About this item</Text>
              <Text style={styles.description}>{item.description}</Text>
            </>
          ) : null}

          {/* Action buttons */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>🏷️ Rent</Text>
            </TouchableOpacity>

            {item.sale_price != null && (
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionBtnText}>🛒 Buy</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnSecondary]}>
              <Text style={styles.actionBtnTextSecondary}>❤️ Wishlist</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnSecondary]}>
              <Text style={styles.actionBtnTextSecondary}>💬 Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  backButton: { paddingHorizontal: 20, paddingVertical: 12 },
  backText: { color: '#fff', fontSize: 15, fontWeight: '500' },

  galleryContainer: { width: SCREEN_WIDTH, backgroundColor: '#242424' },
  photo: { width: SCREEN_WIDTH, height: 320 },
  emojiPlaceholder: {
    width: SCREEN_WIDTH, height: 320,
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#333',
  },
  emojiText: { fontSize: 80 },
  dotRow: {
    flexDirection: 'row', justifyContent: 'center', gap: 6,
    paddingVertical: 10, backgroundColor: '#1a1a1a',
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#444' },
  dotActive: { backgroundColor: '#fff' },

  details: { padding: 24, gap: 12 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  metaRow: { flexDirection: 'row', alignItems: 'baseline', gap: 16 },
  price: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  salePrice: { fontSize: 14, color: '#888' },

  tagRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  tag: {
    paddingHorizontal: 12, paddingVertical: 6,
    backgroundColor: '#2a2a2a', borderRadius: 20,
    borderWidth: 1, borderColor: '#3a3a3a',
  },
  tagText: { color: '#aaa', fontSize: 13 },

  sectionLabel: { fontSize: 13, color: '#666', marginTop: 8 },
  description: { fontSize: 15, color: '#ccc', lineHeight: 22 },

  actions: { gap: 10, marginTop: 16 },
  actionBtn: {
    height: 54, backgroundColor: '#fff',
    borderRadius: 12, alignItems: 'center', justifyContent: 'center',
  },
  actionBtnText: { color: '#000', fontSize: 16, fontWeight: '700' },
  actionBtnSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1, borderColor: '#3a3a3a',
  },
  actionBtnTextSecondary: { color: '#fff', fontSize: 16, fontWeight: '500' },
});
