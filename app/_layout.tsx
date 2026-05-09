import { initDatabase } from '@/src/db/schema'
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import 'react-native-reanimated'

import { useColorScheme } from '@/components/useColorScheme'

export { ErrorBoundary } from 'expo-router'

export const unstable_settings = {
  initialRouteName: '(tabs)',
}

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  useEffect(() => {
    initDatabase()
    SplashScreen.hideAsync()
  }, [])

  return <RootLayoutNav />
}

function RootLayoutNav() {
  const colorScheme = useColorScheme()

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerBackTitle: '' }}>
        <Stack.Screen name='index' options={{ headerShown: false }} />
        <Stack.Screen name='start' options={{ headerShown: false }} />
        <Stack.Screen
          name='(tabs)'
          options={{ headerShown: false, title: 'Home', headerBackTitle: '' }}
        />
        <Stack.Screen
          name='results'
          options={{
            headerShown: true,
            title: 'Color Match Result',
            headerTintColor: '#E05C3A',
          }}
        />
        <Stack.Screen
          name='details'
          options={{
            headerShown: true,
            title: 'Match Details',
            headerTintColor: '#E05C3A',
          }}
        />
      </Stack>
    </ThemeProvider>
  )
}
