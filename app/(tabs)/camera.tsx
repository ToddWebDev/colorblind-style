import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'

export default function CameraScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.viewfinder}>
        <View style={styles.crosshair} />
      </View>
      <View style={styles.toolbar}>
        <Text style={styles.instruction}>
          Hold the target over what you want to wear
        </Text>
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
  },
  instruction: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
})
