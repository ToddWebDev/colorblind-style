import { StyleSheet } from 'react-native'

export const globalStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 16,
    paddingBottom: 48,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    backgroundColor: '#fff',
  },
})

export const colors = {
  primary: '#E05C3A',
  black: '#1a1a1a',
  gray: '#888',
  lightGray: '#f8f8f8',
  border: '#eee',
  white: '#fff',
}
