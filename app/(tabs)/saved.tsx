import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { fetchMatches, deleteMatch } from '@/src/db/queries'
import { MatchResult } from '@/src/types'
import { colors, globalStyles } from '@/src/constants/theme'

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

export default function SavedScreen() {
  const [matches, setMatches] = useState<MatchResult[]>([])

  const loadMatches = useCallback(() => {
    const data = fetchMatches()
    setMatches(data)
  }, [])

  useFocusEffect(loadMatches)

  if (matches.length === 0) {
    return (
      <View style={globalStyles.centered}>
        <Text style={styles.emptyText}>No saved matches yet.</Text>
        <Text style={styles.emptySubtext}>
          Save a match from the results screen to see it here.
        </Text>
      </View>
    )
  }

  return (
    <FlatList
      data={matches}
      keyExtractor={(_, index) => index.toString()}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <MatchRow match={item} onDelete={loadMatches} />
      )}
    />
  )
}

function MatchRow({
  match,
  onDelete,
}: {
  match: MatchResult
  onDelete: () => void
}) {
  const [showDelete, setShowDelete] = useState(false)

  const handleDelete = () => {
    deleteMatch(match.score, Date.now())
    onDelete()
  }

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => setShowDelete((v) => !v)}
      activeOpacity={0.8}
    >
      <View style={styles.swatches}>
        <View
          style={[
            styles.swatch,
            { backgroundColor: colorFromHsl(match.color1.hsl) },
          ]}
        />
        <View
          style={[
            styles.swatch,
            { backgroundColor: colorFromHsl(match.color2.hsl) },
          ]}
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.colorNames}>
          {match.color1.name} + {match.color2.name}
        </Text>
        <Text style={styles.score}>
          {match.score}% Match · {match.relationship}
        </Text>
      </View>
      {showDelete && (
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  list: {
    padding: 24,
    paddingTop: 24,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    gap: 12,
  },
  swatches: {
    flexDirection: 'row',
    gap: 4,
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  info: {
    flex: 1,
  },
  colorNames: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 4,
  },
  score: {
    fontSize: 13,
    color: colors.gray,
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  deleteText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
  },
})
