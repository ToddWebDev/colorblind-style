import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native'
import { router } from 'expo-router'
import { useRef, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors } from '@/src/constants/theme'
import { Ionicons } from '@expo/vector-icons'

const { width } = Dimensions.get('window')

const CARDS = [
  {
    icon: 'camera-outline',
    title: 'Point your camera',
    description:
      'Point at any clothing item in your closet or while shopping for something new.',
  },
  {
    icon: 'color-palette-outline',
    title: 'We identify the color',
    description:
      'The app instantly names the color and locks it in when you hold steady.',
  },
  {
    icon: 'checkmark-circle-outline',
    title: 'Find out if they match',
    description:
      'Scan a second item and get a match score based on color theory.',
  },
]

export default function StartScreen() {
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollRef = useRef<ScrollView>(null)
  const insets = useSafeAreaInsets()

  const handleScroll = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width)
    setActiveIndex(index)
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <View style={[styles.circle, styles.coral]} />
            <View style={[styles.circle, styles.blue]} />
            <View style={styles.overlap} />
          </View>
        </View>

        <Text style={styles.title}>Let's get started!</Text>
        <Text style={styles.subtitle}>Confidently match your clothes.</Text>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.carousel}
        contentContainerStyle={styles.carouselContent}
      >
        {CARDS.map((card, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardInner}>
              <Ionicons
                name={card.icon as any}
                size={48}
                color={colors.primary}
              />
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardDescription}>{card.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dots}>
        {CARDS.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === activeIndex && styles.dotActive]}
          />
        ))}
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.replace('/(tabs)/camera')}
        >
          <Text style={styles.startButtonText}>Start</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  logoContainer: {
    marginBottom: 8,
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
  coral: {
    backgroundColor: colors.primary,
    left: 0,
  },
  blue: {
    backgroundColor: colors.secondary,
    right: 0,
  },
  overlap: {
    width: 20,
    height: 35,
    backgroundColor: colors.tertiary,
    borderRadius: 10,
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.black,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
  },
  carousel: {
    width: width,
    flexGrow: 0,
  },
  carouselContent: {
    alignItems: 'center',
  },
  card: {
    width: width,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 12,
  },
  cardInner: {
    backgroundColor: colors.lightGray,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.black,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 15,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 22,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginVertical: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.primary,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 1,
  },
})
