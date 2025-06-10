import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { FAB, Card, Title, Paragraph } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const API_URL = 'http://192.168.0.138:4001';

export default function HomeScreen() {
  const [places, setPlaces] = useState([]);
  const navigation = useNavigation();

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/places`);
      const data = await res.json();
      setPlaces(data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={places}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => {
          const hora = item.createdAt
            ? new Date(item.createdAt).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '';

          return (
            <Card style={styles.card}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Mapa', {
                    latitude: Number(item.latitude),
                    longitude: Number(item.longitude),
                    name: item.name,
                  })
                }
              >
                {item.photo && (
                  <Card.Cover
                    source={{ uri: `${API_URL}/${item.photo}` }}
                    style={styles.image}
                  />
                )}
              </TouchableOpacity>
              <Card.Content>
                <Title style={styles.title}>{item.name}</Title>
                <Paragraph style={styles.paragraph}>{item.description}</Paragraph>
                {hora !== '' && (
                  <Paragraph style={styles.time}>Adicionado às {hora}</Paragraph>
                )}
              </Card.Content>
            </Card>
          );
        }}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('Adicionar Lugar')}
      />
      <FAB
        icon="map"
        style={styles.mapButton}
        onPress={() => navigation.navigate('Mapa')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f', // Fundo escuro
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  card: {
    backgroundColor: '#1a1a1d',
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#3d3d3d',
    shadowColor: '#0ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  image: {
    height: 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#39ff14', // Verde neon
    marginTop: 12,
  },
  paragraph: {
    fontSize: 16,
    color: '#cccccc',
    marginTop: 6,
  },
  time: {
    fontSize: 13,
    color: '#888',
    marginTop: 8,
    fontStyle: 'italic',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#7f00ff', // Roxo gamer
    elevation: 8,
    shadowColor: '#39ff14',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
  },
  mapButton: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    backgroundColor: '#00f0ff', // Azul neon
    elevation: 8,
    shadowColor: '#00f0ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
  },
});
