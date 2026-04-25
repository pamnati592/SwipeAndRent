import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, View } from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import PhoneVerificationScreen from '../screens/PhoneVerificationScreen';
import { onAuthStateChange } from '../services/auth.service';
import { supabase } from '../services/supabase';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  PhoneVerification: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const [session, setSession] = useState<any>(undefined);
  const [phoneVerified, setPhoneVerified] = useState<boolean>(false);

  useEffect(() => {
    const { data: listener } = onAuthStateChange(async (newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('phone_verified')
          .eq('id', newSession.user.id)
          .single();
        setPhoneVerified(data?.phone_verified ?? false);
      } else {
        setPhoneVerified(false);
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // still loading — don't flash Login before checking session
  if (session === undefined) {
    return (
      <View style={{ flex: 1, backgroundColor: '#1a1a1a', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!session ? (
            <Stack.Screen name="Login" component={LoginScreen} />
          ) : !phoneVerified ? (
            <Stack.Screen name="PhoneVerification" component={PhoneVerificationScreen} />
          ) : (
            <Stack.Screen name="Home" component={HomeScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
