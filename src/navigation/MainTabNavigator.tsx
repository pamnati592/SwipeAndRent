import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import HomeStackNavigator from './HomeStackNavigator';
import AIPlannerScreen from '../screens/AIPlannerScreen';
import AddItemScreen from '../screens/AddItemScreen';
import ChatsScreen from '../screens/ChatsScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type MainTabParamList = {
  HomeStack: undefined;
  AIPlanner: undefined;
  AddItem: undefined;
  Chats: undefined;
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
      <Tab.Screen name="Chats" component={ChatsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
