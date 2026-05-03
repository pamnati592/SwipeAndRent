import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import type { NavigatorScreenParams } from '@react-navigation/native';
import { useUnreadCount } from '../hooks/useUnreadCount';
import HomeStackNavigator from './HomeStackNavigator';
import ChatsStackNavigator from './ChatsStackNavigator';
import type { ChatsStackParamList } from './ChatsStackNavigator';
import AIPlannerScreen from '../screens/AIPlannerScreen';
import AddItemScreen from '../screens/AddItemScreen';
import ProfileStackNavigator from './ProfileStackNavigator';

export type MainTabParamList = {
  HomeStack: undefined;
  AIPlanner: undefined;
  AddItem: undefined;
  Chats: NavigatorScreenParams<ChatsStackParamList>;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Partial<Record<keyof MainTabParamList, string>> = {
  HomeStack: '🏠',
  AIPlanner: '✨',
  Chats: '💬',
  Profile: '👤',
};

const TAB_LABELS: Partial<Record<keyof MainTabParamList, string>> = {
  HomeStack: 'Home',
  AIPlanner: 'AI Planner',
  Chats: 'Chats',
  Profile: 'Profile',
};

export default function MainTabNavigator() {
  const unreadCount = useUnreadCount();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => {
          if (route.name === 'AddItem') {
            return (
              <View style={{
                width: 48, height: 48, borderRadius: 24,
                backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
                marginBottom: 12,
              }}>
                <Text style={{ fontSize: 26, color: '#000', lineHeight: 30 }}>+</Text>
              </View>
            );
          }
          return (
            <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.4 }}>
              {TAB_ICONS[route.name]}
            </Text>
          );
        },
        tabBarLabel: ({ focused }) => {
          if (route.name === 'AddItem') return null;
          return (
            <Text style={{ fontSize: 10, color: focused ? '#fff' : '#666' }}>
              {TAB_LABELS[route.name]}
            </Text>
          );
        },
        tabBarStyle: {
          height: 72,
          backgroundColor: '#242424',
          borderTopColor: '#333',
          borderTopWidth: 1,
          paddingBottom: 8,
        },
      })}
    >
      <Tab.Screen name="HomeStack" component={HomeStackNavigator} />
      <Tab.Screen name="AIPlanner" component={AIPlannerScreen} />
      <Tab.Screen name="AddItem" component={AddItemScreen} />
      <Tab.Screen
        name="Chats"
        component={ChatsStackNavigator}
        options={{ tabBarBadge: unreadCount > 0 ? unreadCount : undefined }}
      />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
}
