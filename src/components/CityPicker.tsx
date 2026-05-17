import { useEffect, useMemo, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList,
  Modal, ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  autocompleteCities, getPlaceDetails, reverseGeocodeToCity,
  newSessionToken, type PlaceSuggestion,
} from '../services/places';
import { getCurrentLocationOnce } from '../hooks/useUserLocation';

export type CityValue = {
  city: string;
  lat: number;
  lng: number;
};

type Props = {
  value: CityValue | null;
  onChange: (value: CityValue) => void;
  placeholder?: string;
  // Optional initial text to show when value is null (e.g., legacy city string
  // from DB that doesn't yet have coordinates). The picker still requires a
  // fresh selection before saving.
  initialDisplayText?: string;
};

export default function CityPicker({
  value, onChange, placeholder = 'Choose a city', initialDisplayText,
}: Props) {
  const [open, setOpen] = useState(false);
  const displayText =
    value?.city ?? initialDisplayText ?? '';

  return (
    <>
      <TouchableOpacity
        style={styles.field}
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.fieldText, !displayText && styles.fieldPlaceholder]}>
          {displayText || placeholder}
        </Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <PickerModal
          onCancel={() => setOpen(false)}
          onSelect={(v) => {
            onChange(v);
            setOpen(false);
          }}
        />
      </Modal>
    </>
  );
}

function PickerModal({
  onCancel, onSelect,
}: {
  onCancel: () => void;
  onSelect: (v: CityValue) => void;
}) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingPlace, setLoadingPlace] = useState<string | null>(null);
  const [loadingGps, setLoadingGps] = useState(false);

  // One session token per modal instance — bundles all autocomplete+details
  // calls into a single Google billing transaction.
  const sessionToken = useMemo(() => newSessionToken(), []);

  // Debounce search input to avoid hammering the Places API on every keystroke.
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) { setSuggestions([]); return; }
    setLoadingSearch(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await autocompleteCities(query, sessionToken);
        setSuggestions(results);
      } catch (e: any) {
        Alert.alert('Search failed', e?.message ?? 'Could not search cities');
      } finally {
        setLoadingSearch(false);
      }
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, sessionToken]);

  async function handleSelectSuggestion(s: PlaceSuggestion) {
    try {
      setLoadingPlace(s.placeId);
      const place = await getPlaceDetails(s.placeId, sessionToken);
      onSelect(place);
    } catch (e: any) {
      Alert.alert('Could not resolve city', e?.message ?? 'Try again');
    } finally {
      setLoadingPlace(null);
    }
  }

  async function handleUseMyLocation() {
    try {
      setLoadingGps(true);
      const coords = await getCurrentLocationOnce();
      if (!coords) {
        Alert.alert(
          'Location unavailable',
          'Allow location access in Settings to use this feature.',
        );
        return;
      }
      const place = await reverseGeocodeToCity(coords.latitude, coords.longitude);
      onSelect(place);
    } catch (e: any) {
      Alert.alert('Could not detect city', e?.message ?? 'Try again');
    } finally {
      setLoadingGps(false);
    }
  }

  return (
    <SafeAreaView style={styles.modalContainer}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onCancel} style={styles.headerBtn}>
            <Text style={styles.headerBtnText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Choose city</Text>
          <View style={styles.headerBtn} />
        </View>

        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search city..."
            placeholderTextColor="#666"
            value={query}
            onChangeText={setQuery}
            autoFocus
            autoCorrect={false}
            returnKeyType="search"
          />
          {loadingSearch && <ActivityIndicator color="#888" style={styles.searchSpinner} />}
        </View>

        <TouchableOpacity
          style={styles.gpsRow}
          onPress={handleUseMyLocation}
          disabled={loadingGps}
        >
          {loadingGps
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.gpsRowText}>📍 Use my current location</Text>
          }
        </TouchableOpacity>

        <FlatList
          data={suggestions}
          keyExtractor={(s) => s.placeId}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                {query.trim() ? 'No matches' : 'Start typing to search'}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionRow}
              onPress={() => handleSelectSuggestion(item)}
              disabled={loadingPlace !== null}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.suggestionPrimary}>{item.primaryText}</Text>
                {item.secondaryText
                  ? <Text style={styles.suggestionSecondary}>{item.secondaryText}</Text>
                  : null}
              </View>
              {loadingPlace === item.placeId && <ActivityIndicator color="#888" />}
            </TouchableOpacity>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#2a2a2a', borderWidth: 1, borderColor: '#3a3a3a',
    borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12, minHeight: 48,
  },
  fieldText: { flex: 1, color: '#fff', fontSize: 15 },
  fieldPlaceholder: { color: '#666' },
  chevron: { color: '#666', fontSize: 22, marginLeft: 8 },

  modalContainer: { flex: 1, backgroundColor: '#1a1a1a' },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#2a2a2a',
  },
  headerBtn: { minWidth: 60 },
  headerBtnText: { color: '#fff', fontSize: 15 },
  modalTitle: { color: '#fff', fontSize: 16, fontWeight: '600' },

  searchBox: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, position: 'relative' },
  searchInput: {
    height: 44, backgroundColor: '#2a2a2a', borderWidth: 1, borderColor: '#3a3a3a',
    borderRadius: 10, paddingHorizontal: 14, color: '#fff', fontSize: 15,
  },
  searchSpinner: { position: 'absolute', right: 28, top: 24 },

  gpsRow: {
    marginHorizontal: 16, marginBottom: 12, height: 48,
    backgroundColor: '#2a2a2a', borderWidth: 1, borderColor: '#3a3a3a',
    borderRadius: 10, alignItems: 'center', justifyContent: 'center',
  },
  gpsRowText: { color: '#fff', fontSize: 14, fontWeight: '500' },

  suggestionRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#222',
  },
  suggestionPrimary: { color: '#fff', fontSize: 15 },
  suggestionSecondary: { color: '#888', fontSize: 12, marginTop: 2 },

  empty: { alignItems: 'center', paddingTop: 40 },
  emptyText: { color: '#666', fontSize: 14 },
});
