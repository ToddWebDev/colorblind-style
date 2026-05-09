import { useEffect } from 'react'
import { StyleSheet, View, Text, Animated } from 'react-native'
import { router } from 'expo-router'
import { colors } from '@/src/constants/theme'

export default function SplashScreen() {
  const logoOpacity = new Animated.Value(0)
  const textOpacity = new Animated.Value(0)

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.delay(1000),
    ]).start(() => {
      router.replace('/start')
    })
  }, [])

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, { opacity: logoOpacity }]}>
        <View style={styles.logo}>
          <View style={[styles.circle, styles.red]} />
          <View style={[styles.circle, styles.green]} />
          <View style={styles.overlap} />
        </View>
      </Animated.View>
      <Animated.View style={{ opacity: textOpacity }}>
        <Text style={styles.title}>Colorblind</Text>
        <Text style={styles.subtitle}>S T Y L E</Text>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6B8FB5',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 100,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    position: 'absolute',
    opacity: 0.9,
  },
  red: {
    backgroundColor: colors.primary,
    left: 0,
  },
  green: {
    backgroundColor: colors.secondary,
    right: 0,
  },
  overlap: {
    width: 40,
    height: 70,
    backgroundColor: colors.tertiary,
    borderRadius: 25,
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    letterSpacing: 6,
  },
})
