import { StyleSheet, View, Text } from 'react-native'

export default function SavedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>Saved matches will appear here</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  message: {
    fontSize: 16,
    color: '#888',
  },
})
