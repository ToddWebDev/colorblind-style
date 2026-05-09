import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#E05C3A',
        tabBarStyle: {
          backgroundColor: '#fff',
        },
      }}
    >
      <Tabs.Screen
        name='camera'
        options={{
          title: 'Color Match',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='camera-outline' size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='saved'
        options={{
          title: 'Saved Matches',
          headerShown: true,
          headerTintColor: '#E05C3A',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='bookmark-outline' size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
