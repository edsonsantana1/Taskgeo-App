import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', 
    paddingVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    // sombra para Android
    elevation: 3,
    // sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 120,
  },
  mapButton: {
    position: 'absolute',
    right: 16,
    bottom: 50,
  },
});
