import { useNavigation } from 'expo-router'
import { useLayoutEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { router } from 'expo-router'
import { useMatchStore } from '@/src/store/useMatchStore'
import { isPoorMatch } from '@/src/color/engine'
import { globalStyles, colors } from '@/src/constants/theme'

export default function ColorMatchDetailsScreen() {
  const navigation = useNavigation()
  const { currentMatch, saveCurrentMatch } = useMatchStore()
  const { score, relationship, color1, color2 } = currentMatch

  const handleSave = () => {
    saveCurrentMatch()
    router.replace('/(tabs)/saved')
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        !isPoorMatch(score, relationship) ? (
          <TouchableOpacity
            onPress={handleSave}
            style={{
              width: 32,
              height: 32,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons
              name='bookmark-outline'
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>
        ) : null,
    })
  }, [navigation, currentMatch, score, relationship])

  if (!currentMatch) {
    return (
      <View style={globalStyles.centered}>
        <Text style={styles.emptyText}>No match data available.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={globalStyles.container}>
      <Text style={styles.scoreLabel}>{score}% Match</Text>
      <Text style={styles.relationshipLabel}>
        These colors are {relationship}
      </Text>

      <View style={styles.colorBlock}>
        <View
          style={[
            styles.colorCircle,
            { borderColor: colorFromHsl(color1.hsl) },
          ]}
        >
          <View
            style={[
              styles.colorCircleFill,
              { backgroundColor: colorFromHsl(color1.hsl) },
            ]}
          />
        </View>
        <View
          style={[
            styles.nameBadge,
            { backgroundColor: colorFromHsl(color1.hsl) },
          ]}
        >
          <Text style={styles.nameBadgeText}>{color1.name}</Text>
        </View>
      </View>

      <View style={styles.colorBlock}>
        <View
          style={[
            styles.colorCircle,
            { borderColor: colorFromHsl(color2.hsl) },
          ]}
        >
          <View
            style={[
              styles.colorCircleFill,
              { backgroundColor: colorFromHsl(color2.hsl) },
            ]}
          />
        </View>
        <View
          style={[
            styles.nameBadge,
            { backgroundColor: colorFromHsl(color2.hsl) },
          ]}
        >
          <Text style={styles.nameBadgeText}>{color2.name}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.tipsContainer}>
        <Text style={styles.tipsHeader}>Helpful Tips</Text>
        <Text style={styles.tipsText}>{getTip(relationship, 0)}</Text>
        <View style={styles.tipDivider} />
        <Text style={styles.tipsText}>{getTip(relationship, 1)}</Text>
      </View>

      <TouchableOpacity
        style={styles.newMatchButton}
        onPress={() => router.replace('/(tabs)/camera')}
      >
        <Text style={styles.newMatchButtonText}>New Match</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

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

function getTip(relationship: string, index: number): string {
  const tips: Record<string, string[]> = {
    complementary: [
      'Complementary colors create high contrast and make each other pop. Great for a bold look.',
      'Use one color as dominant and the other as an accent to avoid overwhelming the eye.',
    ],
    analogous: [
      'Analogous colors sit next to each other on the color wheel and create a harmonious look.',
      'Add a neutral color to your wardrobe to really make these colors pop.',
    ],
    triadic: [
      'Triadic colors are evenly spaced on the color wheel. Use one as dominant and the others as accents.',
      'Make sure color accents do not take up too much of your wardrobe.',
    ],
    'split-complementary': [
      'Split-complementary is a softer alternative to complementary. High contrast without being too bold.',
      'Use the bookmark button to save this color scheme for future reference.',
    ],
    neutral: [
      'These colors have a neutral relationship. A third accent color can tie the look together.',
      'Neutral pairings work well as a base — build on them with bolder accessories.',
    ],
  }

  return tips[relationship]?.[index] ?? ''
}

const styles = StyleSheet.create({
  scoreLabel: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 4,
  },
  relationshipLabel: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 32,
  },
  colorBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  colorCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  colorCircleFill: {
    width: '100%',
    height: '100%',
  },
  nameBadge: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  nameBadgeText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 24,
  },
  tipsContainer: {
    marginBottom: 32,
  },
  tipsHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 12,
  },
  tipsText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
  tipDivider: {
    height: 12,
  },
  newMatchButton: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  newMatchButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    color: colors.gray,
    marginBottom: 16,
  },
  back: {
    color: colors.primary,
    fontSize: 16,
  },
})
