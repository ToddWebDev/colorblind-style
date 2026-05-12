import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { useNavigation } from 'expo-router'
import { useLayoutEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useMatchStore } from '@/src/store/useMatchStore'
import { router } from 'expo-router'
import { globalStyles, colors } from '@/src/constants/theme'
import { analyzeMatch, suggestColors, isPoorMatch } from '@/src/color/engine'

export default function ColorMatchResultScreen() {
  const { currentMatch, saveCurrentMatch, clearCurrentMatch } = useMatchStore()
  const { score, relationship, color1, color2 } = currentMatch

  const navigation = useNavigation()

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
        <Text style={styles.emptyText}>
          No match yet. Use the camera to scan two colors.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace('/(tabs)/camera')}
        >
          <Text style={styles.buttonText}>Go to Camera</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const handleSave = () => {
    saveCurrentMatch()
    router.replace('/(tabs)/saved')
  }

  const handleNewMatch = () => {
    clearCurrentMatch()
    router.dismissAll()
  }

  return (
    <View style={styles.screenContainer}>
      <ScrollView contentContainerStyle={globalStyles.container}>
        <View style={styles.header}>
          <Text style={styles.scoreLabel}>It's a {score}% Match</Text>
          <Text style={styles.relationshipLabel}>
            These colors are {relationship}
          </Text>
        </View>

        <View style={styles.vennContainer}>
          <View
            style={[
              styles.circle,
              { backgroundColor: colorFromHsl(color1.hsl), marginRight: -22 },
            ]}
          />
          <View
            style={[
              styles.circle,
              { backgroundColor: colorFromHsl(color2.hsl), marginLeft: -22 },
            ]}
          />
        </View>

        <TouchableOpacity onPress={() => router.push('/color-match-details')}>
          <Text style={styles.viewDetails}>View Details</Text>
        </TouchableOpacity>

        {isPoorMatch(score, relationship) && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsHeader}>Not a great match.</Text>
            <Text style={styles.suggestionsSubtitle}>
              One of these colors would pair well with what you have.
            </Text>
            {suggestColors(color1.hsl, color2.hsl).map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.suggestionRow,
                  { borderLeftColor: colorFromHsl(suggestion.hsl) },
                ]}
                onPress={() => {}}
              >
                <View
                  style={[
                    styles.suggestionSwatch,
                    { backgroundColor: colorFromHsl(suggestion.hsl) },
                  ]}
                />
                <Text style={styles.suggestionText}>
                  Find {suggestion.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.tipsContainer}>
          <Text style={styles.tipsHeader}>Helpful Tips</Text>
          <Text style={styles.tipsText}>{getTip(relationship)}</Text>
        </View>
      </ScrollView>
    </View>
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

function getTip(relationship: string): string {
  switch (relationship) {
    case 'complementary':
      return 'Complementary colors create high contrast and make each other pop. Great for a bold look.'
    case 'analogous':
      return 'Analogous colors sit next to each other on the color wheel. They create a harmonious, relaxed look.'
    case 'triadic':
      return 'Triadic colors are evenly spaced on the color wheel. Use one as dominant and the others as accents.'
    case 'split-complementary':
      return 'Split-complementary is a softer alternative to complementary. High contrast without being too bold.'
    default:
      return 'Add a neutral color like white, gray, or navy to tie these colors together.'
  }
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  scoreLabel: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 8,
  },
  relationshipLabel: {
    fontSize: 16,
    color: colors.gray,
  },
  vennContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  circle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    opacity: 0.85,
  },
  viewDetails: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 32,
  },
  tipsContainer: {
    backgroundColor: colors.lightGray,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 32,
  },
  tipsHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: 24,
  },
  suggestionsContainer: {
    width: '100%',
    marginBottom: 32,
  },
  suggestionsHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.black,
    marginBottom: 4,
  },
  suggestionsSubtitle: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 16,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
  },
  suggestionSwatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  suggestionText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.black,
  },
})
