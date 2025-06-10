import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, ActivityIndicator, Alert } from 'react-native';
import * as Location from 'expo-location';

const API_URL = 'http://192.168.0.138:4001';

export default function PlacesMapScreen() {
  const [places, setPlaces] = useState([]);
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão de localização negada.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      console.log("Localização obtida:", loc.coords);

      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.02, // Zoom ajustado para foco maior
        longitudeDelta: 0.02,
      });

      fetchData(); // Carrega os lugares da API
    })();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/places`);
      const data = await res.json();
      console.log("Locais carregados:", data);
      setPlaces(data);
    } catch (error) {
      Alert.alert('Erro ao carregar os lugares', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {loading && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      )}

      {region && (
        <MapView
          style={{ flex: 1 }}
          initialRegion={region} // Define a região no início
          showsUserLocation={true}
          followsUserLocation={true} // Faz o mapa seguir a posição do usuário
        >
          {places.map((place) => (
            <Marker
              key={place._id}
              coordinate={{
                latitude: Number(place.latitude || 0),
                longitude: Number(place.longitude || 0),
              }}
              title={place.name || 'Local'}
              description={place.description || 'Sem descrição disponível'}
              pinColor="blue"
            />
          ))}
        </MapView>
      )}
    </View>
  );
}