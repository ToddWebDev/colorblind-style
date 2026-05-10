import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { router, useNavigation } from 'expo-router'
import { useLayoutEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useMatchStore } from '@/src/store/useMatchStore'
import { colors } from '@/src/constants/theme'

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

export default function ColorDetailScreen() {
  const { color1, saveSingleColor, clearColor1 } = useMatchStore()
  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            handleDone()
            router.replace('/(tabs)/camera')
          }}
          style={{ marginLeft: 8 }}
        >
          <Ionicons name='chevron-back' size={24} color={colors.primary} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            saveSingleColor()
            router.replace('/(tabs)/saved')
          }}
          style={{
            width: 32,
            height: 32,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name='bookmark-outline' size={24} color={colors.primary} />
        </TouchableOpacity>
      ),
    })
  }, [navigation, color1])

  if (!color1) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No color identified yet.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const handleDone = () => {
    clearColor1()
    router.replace('/(tabs)/camera')
  }

  const handleMatch = () => {
    router.replace('/(tabs)/camera')
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.colorHero,
          { backgroundColor: colorFromHsl(color1.hsl) },
        ]}
      >
        <Text style={styles.colorName}>{color1.name}</Text>
        <Text style={styles.hslValues}>
          H: {color1.hsl.h} S: {color1.hsl.s}% L: {color1.hsl.l}%
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <View
            style={[
              styles.swatch,
              { backgroundColor: colorFromHsl(color1.hsl) },
            ]}
          />
          <View style={styles.infoText}>
            <Text style={styles.infoName}>{color1.name}</Text>
            <Text style={styles.infoHsl}>
              HSL({color1.hsl.h}, {color1.hsl.s}%, {color1.hsl.l}%)
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.matchButton} onPress={handleMatch}>
          <Text style={styles.matchButtonText}>Match to another color</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDone}>
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
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
  colorHero: {
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  colorName: {
    fontSize: 40,
    fontWeight: '800',
    color: colors.white,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  hslValues: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  content: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: colors.lightGray,
    borderRadius: 16,
    padding: 16,
  },
  swatch: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  infoText: {
    gap: 4,
  },
  infoName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.black,
  },
  infoHsl: {
    fontSize: 13,
    color: colors.gray,
  },
  matchButton: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  matchButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  doneText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
})
