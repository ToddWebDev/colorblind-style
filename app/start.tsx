import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { colors } from '@/src/constants/theme'

export default function StartScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <View style={[styles.circle, styles.red]} />
          <View style={[styles.circle, styles.green]} />
          <View style={styles.overlap} />
        </View>
      </View>

      <Text style={styles.title}>Let's get started!</Text>
      <Text style={styles.subtitle}>Confidently match your clothes.</Text>

      <TouchableOpacity
        style={styles.startButton}
        onPress={() => router.replace('/(tabs)/camera')}
      >
        <Text style={styles.startButtonText}>START</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logo: {
    width: 80,
    height: 65,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
    width: 20,
    height: 40,
    backgroundColor: colors.tertiary,
    borderRadius: 10,
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 32,
  },
  startButton: {
    width: 140,
    height: 140,
    borderRadius: 80,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 2,
  },
})
