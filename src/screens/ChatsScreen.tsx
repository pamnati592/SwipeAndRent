import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Chats — Coming Soon</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a', alignItems: 'center', justifyContent: 'center' },
  text: { color: '#666', fontSize: 16 },
});
