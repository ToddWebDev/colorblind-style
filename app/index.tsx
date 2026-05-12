import { useEffect, useRef } from 'react'
import { StyleSheet, View, Text, Animated } from 'react-native'
import { router } from 'expo-router'
import { colors } from '@/src/constants/theme'
import Svg, { Circle, Defs, ClipPath } from 'react-native-svg'

export default function SplashScreen() {
  const leftCircleX = useRef(new Animated.Value(-120)).current
  const rightCircleX = useRef(new Animated.Value(120)).current
  const intersectionOpacity = useRef(new Animated.Value(0)).current
  const textOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(leftCircleX, {
          toValue: 0,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(rightCircleX, {
          toValue: 0,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(intersectionOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(1300),
    ]).start(() => {
      router.replace('/start')
    })
  }, [])

  const circleSize = 80
  const r = circleSize / 2
  const overlap = 30

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {/* Left circle */}
        <Animated.View
          style={[
            styles.circleWrapper,
            { transform: [{ translateX: leftCircleX }] },
          ]}
        >
          <Svg width={circleSize} height={circleSize}>
            <Circle
              cx={r}
              cy={r}
              r={r - 3}
              stroke='white'
              strokeWidth={3}
              fill='none'
            />
          </Svg>
        </Animated.View>

        {/* Right circle */}
        <Animated.View
          style={[
            styles.circleWrapper,
            styles.rightCircle,
            { transform: [{ translateX: rightCircleX }] },
          ]}
        >
          <Svg width={circleSize} height={circleSize}>
            <Circle
              cx={r}
              cy={r}
              r={r - 3}
              stroke='white'
              strokeWidth={3}
              fill='none'
            />
          </Svg>
        </Animated.View>

        {/* Intersection overlay */}
        <Animated.View
          style={{
            position: 'absolute',
            opacity: intersectionOpacity,
          }}
        >
          <Svg width={100} height={80}>
            <Defs>
              <ClipPath id='intersectClip'>
                <Circle cx={25} cy={40} r={37} />
              </ClipPath>
            </Defs>
            <Circle
              cx={75}
              cy={40}
              r={37}
              fill='white'
              clipPath='url(#intersectClip)'
            />
          </Svg>
        </Animated.View>
      </View>

      <Animated.View style={{ opacity: textOpacity, alignItems: 'center' }}>
        <Text style={styles.title}>Colorblind</Text>
        <Text style={styles.subtitle}>S T Y L E</Text>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleWrapper: {
    width: 80,
    height: 80,
  },
  rightCircle: {
    marginLeft: -30,
  },
  intersectionWrapper: {
    position: 'absolute',
    alignSelf: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    letterSpacing: 6,
  },
})
