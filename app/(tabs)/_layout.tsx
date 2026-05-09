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
          title: 'Photos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='images-outline' size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
