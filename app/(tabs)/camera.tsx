import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useEffect, useRef } from 'react'
import { router } from 'expo-router'
import { useColorSampler } from '@/src/hooks/useColorSampler'
import { colors } from '@/src/constants/theme'

const MOCK_COLORS = [
  { r: 204, g: 173, b: 82 },
  { r: 210, g: 105, b: 80 },
  { r: 30, g: 100, b: 200 },
  { r: 34, g: 139, b: 34 },
]

function colorFromHsl({
  h,
  s,
  l,
}: {
  h: number
  s: number
  l: number
}): string {
  return `hsl(${h}, ${s}%, ${l}%)`
}

export default function CameraScreen() {
  // Analogous Match Simulation
  // const simulateMatch = () => {
  //   const result = analyzeMatch(
  //     { r: 204, g: 173, b: 82 }, // Mustard
  //     { r: 210, g: 105, b: 80 }, // Coral
  //   )
  //   setCurrentMatch(result)
  //   router.push('/results')
  // }

  // Complementary Match Simulation
  // const simulateMatch = () => {
  //   const result = analyzeMatch(
  //     { r: 30, g: 100, b: 200 }, // Blue ~H:210
  //     { r: 220, g: 120, b: 30 }, // Orange ~H:30
  //   )
  //   setCurrentMatch(result)
  //   router.push('/results')
  // }

  // Triadic Match Simulation
  // const simulateMatch = () => {
  //   const result = analyzeMatch(
  //     { r: 220, g: 60, b: 60 }, // Red
  //     { r: 60, g: 60, b: 220 }, // Blue
  //   )
  //   setCurrentMatch(result)
  //   router.push('/results')
  // }

  // Split-complementary Match Simulation
  // const simulateMatch = () => {
  //   const result = analyzeMatch(
  //     { r: 30, g: 100, b: 200 }, // Blue ~H:210
  //     { r: 220, g: 200, b: 30 }, // Yellow-green ~H:55
  //   )
  //   setCurrentMatch(result)
  //   router.push('/results')
  // }

  // Poor Match Simulation
  // const simulateMatch = () => {
  //   const result = analyzeMatch(
  //     { r: 128, g: 128, b: 128 },
  //     { r: 140, g: 130, b: 125 },
  //   )
  //   setCurrentMatch(result)
  //   router.push('/results')
  // }

  const {
    cameraState,
    liveColorName,
    liveHsl,
    storedColor1,
    startAcquiring,
    cancelAcquiring,
    simulateLiveSampling,
    reset,
  } = useColorSampler()

  const pulseAnim = useRef(new Animated.Value(1)).current
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null)
  const badgeOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (storedColor1) {
      Animated.timing(badgeOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start()
    } else {
      badgeOpacity.setValue(0)
    }
  }, [storedColor1])

  useEffect(() => {
    if (cameraState === 'acquiring_1' || cameraState === 'acquiring_2') {
      pulseLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.4,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      )
      pulseLoop.current.start()
    } else {
      pulseLoop.current?.stop()
      pulseAnim.setValue(1)
    }
  }, [cameraState])

  useEffect(() => {
    if (cameraState === 'color2_locked') {
      router.push('/results')
    }
  }, [cameraState])

  const mockIndex = useRef(0)

  const handleMockPress = () => {
    const index = cameraState === 'color1_locked' ? 1 : 0
    const target = MOCK_COLORS[index]
    simulateLiveSampling(target)
    startAcquiring(target)
  }

  const isAcquiring =
    cameraState === 'acquiring_1' || cameraState === 'acquiring_2'

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.container}>
        {/* Low light warning */}
        {cameraState === 'low_light' && (
          <View style={styles.warningBanner}>
            <Text style={styles.warningText}>Turn your lights on</Text>
          </View>
        )}

        {/* Hold steady banner */}
        {isAcquiring && (
          <View style={styles.holdBanner}>
            <Text style={styles.holdText}>Hold Steady</Text>
          </View>
        )}

        {/* Color 1 badge */}
        {storedColor1 && (
          <Animated.View
            style={[
              styles.colorBadge,
              {
                backgroundColor: colorFromHsl(storedColor1.hsl),
                opacity: badgeOpacity,
              },
            ]}
          >
            <Text style={styles.colorBadgeText}>{storedColor1.name}</Text>
          </Animated.View>
        )}

        {/* Viewfinder */}
        <View style={styles.viewfinder}>
          <Animated.View
            style={[
              styles.crosshair,
              {
                transform: [{ scale: pulseAnim }],
                borderWidth: 2,
                borderColor: liveHsl ? colorFromHsl(liveHsl) : colors.white,
              },
            ]}
          />
          {liveColorName ? (
            <Text style={styles.liveColorName}>{liveColorName}</Text>
          ) : null}

          <TouchableOpacity
            style={styles.simulateButton}
            onPress={() => handleMockPress(0)}
          >
            <Text style={styles.simulateButtonText}>Simulate Color (Dev)</Text>
          </TouchableOpacity>
        </View>

        {(cameraState === 'color1_locked' || cameraState === 'acquiring_2') &&
          storedColor1 && (
            <View style={styles.bottomNav}>
              <View style={styles.colorDots}>
                <View
                  style={[
                    styles.colorDot,
                    { backgroundColor: colorFromHsl(storedColor1.hsl) },
                  ]}
                >
                  <Text style={styles.checkmark}>✓</Text>
                </View>
                <View style={[styles.colorDot, styles.colorDotEmpty]} />
              </View>
            </View>
          )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  warningBanner: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    alignItems: 'center',
  },
  warningText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  holdBanner: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    alignItems: 'center',
  },
  holdText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  colorBadge: {
    alignSelf: 'center',
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  colorBadgeText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  viewfinder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  crosshair: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.white,
  },
  crosshairAcquiring: {
    borderColor: colors.tertiary,
  },
  liveColorName: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBar: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  statusBarAcquiring: {
    backgroundColor: colors.secondary,
  },
  statusText: {
    color: colors.white,
    fontSize: 16,
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  colorDots: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  colorDot: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorDotEmpty: {
    backgroundColor: 'rgba(200,200,200,0.4)',
  },
  checkmark: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  simulateButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginTop: 24,
  },
  simulateButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
})
