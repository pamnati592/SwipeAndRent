import { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, Dimensions, PanResponder, Animated, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

const MOCK_ITEMS = [
  { id: '1', title: 'Professional Camera', subtitle: 'Canon EOS R5', price: '₪45/day', distance: '2.3 km', emoji: '📷' },
  { id: '2', title: 'Gaming Console', subtitle: 'PlayStation 5', price: '₪30/day', distance: '1.1 km', emoji: '🎮' },
  { id: '3', title: 'Camping Tent', subtitle: '4-person tent', price: '₪20/day', distance: '3.5 km', emoji: '⛺' },
];

export default function HomeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [actionPanel, setActionPanel] = useState(false);
  const position = useRef(new Animated.ValueXY()).current;

  const currentItem = MOCK_ITEMS[currentIndex % MOCK_ITEMS.length];
  const nextItem = MOCK_ITEMS[(currentIndex + 1) % MOCK_ITEMS.length];

  function resetPosition() {
    Animated.spring(position, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
  }

  function swipeOut(direction: 'left' | 'right') {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(position, { toValue: { x, y: 0 }, duration: 250, useNativeDriver: false }).start(() => {
      position.setValue({ x: 0, y: 0 });
      setCurrentIndex((prev) => prev + 1);
      if (direction === 'right') setActionPanel(true);
    });
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy / 4 });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) swipeOut('right');
        else if (gesture.dx < -SWIPE_THRESHOLD) swipeOut('left');
        else resetPosition();
      },
    })
  ).current;

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: ['-15deg', '0deg', '15deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Search Bar */}
      <View style={styles.topBar}>
        <TextInput style={styles.searchInput} placeholder="Search..." placeholderTextColor="#888" />
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Card Feed */}
      <View style={styles.feed}>
        <View style={[styles.card, styles.backCard]}>
          <View style={styles.imageArea}>
            <Text style={styles.itemEmoji}>{nextItem.emoji}</Text>
          </View>
        </View>

        <Animated.View
          style={[styles.card, { transform: [...position.getTranslateTransform(), { rotate }] }]}
          {...panResponder.panHandlers}
        >
          <View style={styles.imageArea}>
            <Text style={styles.itemEmoji}>{currentItem.emoji}</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.itemTitle}>{currentItem.title}</Text>
            <Text style={styles.itemSubtitle}>{currentItem.subtitle}</Text>
            <Text style={styles.itemPrice}>{currentItem.price}</Text>
            <Text style={styles.itemDistance}>📍 {currentItem.distance}</Text>
          </View>
          <View style={styles.swipeButtons}>
            <TouchableOpacity style={styles.swipeBtn} onPress={() => swipeOut('left')}>
              <Text style={styles.swipeBtnText}>✕</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.swipeBtn} onPress={() => swipeOut('right')}>
              <Text style={styles.swipeBtnText}>♥</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {[
          { icon: '🏠', label: 'Home', active: true },
          { icon: '✨', label: 'AI Planner', active: false },
          { icon: '❤️', label: 'Wishlist', active: false },
          { icon: '💬', label: 'Chats', active: false },
          { icon: '👤', label: 'Profile', active: false },
        ].map((tab) => (
          <TouchableOpacity key={tab.label} style={styles.navTab}>
            <Text style={styles.navIcon}>{tab.icon}</Text>
            <Text style={[styles.navLabel, tab.active && styles.navLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Action Panel - Bottom Sheet */}
      <Modal visible={actionPanel} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>{MOCK_ITEMS[(currentIndex - 1 + MOCK_ITEMS.length) % MOCK_ITEMS.length].title}</Text>

            <TouchableOpacity style={styles.sheetButton} onPress={() => setActionPanel(false)}>
              <Text style={styles.sheetButtonText}>🏷️ Rent</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sheetButton} onPress={() => setActionPanel(false)}>
              <Text style={styles.sheetButtonText}>🛒 Purchase</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sheetButton} onPress={() => setActionPanel(false)}>
              <Text style={styles.sheetButtonText}>❤️ Add to Wishlist</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sheetCancelButton} onPress={() => setActionPanel(false)}>
              <Text style={styles.sheetCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#242424', borderBottomWidth: 1, borderBottomColor: '#333', gap: 8,
  },
  searchInput: {
    flex: 1, height: 40, backgroundColor: '#2a2a2a',
    borderWidth: 1, borderColor: '#3a3a3a', borderRadius: 8,
    paddingHorizontal: 12, color: '#fff', fontSize: 14,
  },
  filterButton: {
    width: 40, height: 40, backgroundColor: '#2a2a2a',
    borderWidth: 1, borderColor: '#3a3a3a', borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  filterIcon: { fontSize: 18 },
  feed: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  card: {
    width: '100%', maxWidth: 320, height: 460,
    backgroundColor: '#2a2a2a', borderRadius: 16,
    borderWidth: 2, borderColor: '#3a3a3a', overflow: 'hidden',
  },
  backCard: { position: 'absolute', transform: [{ scale: 0.95 }], opacity: 0.5 },
  imageArea: {
    height: 220, backgroundColor: '#333',
    alignItems: 'center', justifyContent: 'center',
    borderBottomWidth: 1, borderBottomColor: '#3a3a3a',
  },
  itemEmoji: { fontSize: 64 },
  cardContent: { padding: 16, gap: 4 },
  itemTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  itemSubtitle: { fontSize: 14, color: '#888' },
  itemPrice: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginTop: 8 },
  itemDistance: { fontSize: 13, color: '#888' },
  swipeButtons: {
    position: 'absolute', bottom: 16, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'center', gap: 24,
  },
  swipeBtn: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#242424', borderWidth: 2, borderColor: '#3a3a3a',
    alignItems: 'center', justifyContent: 'center',
  },
  swipeBtnText: { fontSize: 22, color: '#fff' },
  bottomNav: {
    height: 72, backgroundColor: '#242424',
    borderTopWidth: 1, borderTopColor: '#333',
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-around', paddingHorizontal: 8,
  },
  navTab: { alignItems: 'center', gap: 2 },
  navIcon: { fontSize: 22 },
  navLabel: { fontSize: 10, color: '#666' },
  navLabelActive: { color: '#fff' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  bottomSheet: {
    backgroundColor: '#242424', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, gap: 12,
  },
  sheetHandle: {
    width: 40, height: 4, backgroundColor: '#444',
    borderRadius: 2, alignSelf: 'center', marginBottom: 8,
  },
  sheetTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  sheetButton: {
    height: 56, backgroundColor: '#2a2a2a',
    borderWidth: 2, borderColor: '#3a3a3a', borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  sheetButtonText: { color: '#fff', fontSize: 16, fontWeight: '500' },
  sheetCancelButton: {
    height: 48, alignItems: 'center', justifyContent: 'center',
  },
  sheetCancelText: { color: '#666', fontSize: 14 },
});
