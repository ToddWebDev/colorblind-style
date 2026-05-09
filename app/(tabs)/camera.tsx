import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { useMatchStore } from '@/src/store/useMatchStore'
import { analyzeMatch } from '@/src/color/engine'

export default function CameraScreen() {
  const { setCurrentMatch } = useMatchStore()

  // Good Match Simulation
  // const simulateMatch = () => {
  //   const result = analyzeMatch(
  //     { r: 204, g: 173, b: 82 },
  //     { r: 210, g: 105, b: 80 },
  //   )
  //   setCurrentMatch(result)
  //   router.push('/results')
  // }

  // Poor Match Simulation
  const simulateMatch = () => {
    const result = analyzeMatch(
      { r: 128, g: 128, b: 128 },
      { r: 140, g: 130, b: 125 },
    )
    setCurrentMatch(result)
    router.push('/results')
  }

  return (
    <View style={styles.container}>
      <View style={styles.viewfinder}>
        <View style={styles.crosshair} />
      </View>
      <View style={styles.toolbar}>
        <Text style={styles.instruction}>
          Hold the target over what you want to wear
        </Text>
        <TouchableOpacity style={styles.simulateButton} onPress={simulateMatch}>
          <Text style={styles.simulateButtonText}>Simulate Match (Dev)</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  viewfinder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crosshair: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  toolbar: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 20,
    alignItems: 'center',
    gap: 16,
  },
  instruction: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  simulateButton: {
    backgroundColor: '#E05C3A',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  simulateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
})
