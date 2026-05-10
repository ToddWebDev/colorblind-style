import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { fetchMatches, deleteEntry, SavedEntry } from '@/src/db/queries'
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

export default function SavedScreen() {
  const [entries, setEntries] = useState<SavedEntry[]>([])

  const loadEntries = useCallback(() => {
    const data = fetchMatches()
    setEntries(data)
  }, [])

  useFocusEffect(loadEntries)

  if (entries.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No saved colors or matches yet.</Text>
        <Text style={styles.emptySubtext}>
          Save a color or match to see it here.
        </Text>
      </View>
    )
  }

  return (
    <FlatList
      data={entries}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <EntryRow entry={item} onDelete={loadEntries} />
      )}
    />
  )
}

function EntryRow({
  entry,
  onDelete,
}: {
  entry: SavedEntry
  onDelete: () => void
}) {
  const [showDelete, setShowDelete] = useState(false)

  const handleDelete = () => {
    deleteEntry(entry.id)
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
            { backgroundColor: colorFromHsl(entry.color1.hsl) },
          ]}
        />
        {entry.color2 && (
          <View
            style={[
              styles.swatch,
              { backgroundColor: colorFromHsl(entry.color2.hsl) },
            ]}
          />
        )}
      </View>
      <View style={styles.info}>
        {entry.type === 'single' ? (
          <>
            <Text style={styles.colorNames}>{entry.color1.name}</Text>
            <Text style={styles.score}>Color ID</Text>
          </>
        ) : (
          <>
            <Text style={styles.colorNames}>
              {entry.color1.name} + {entry.color2?.name}
            </Text>
            <Text style={styles.score}>
              {entry.score}% Match · {entry.relationship}
            </Text>
          </>
        )}
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
    padding: 16,
    paddingTop: 24,
    backgroundColor: colors.white,
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    backgroundColor: colors.white,
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
