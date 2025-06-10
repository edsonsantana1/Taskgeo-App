import React, { useEffect, useState } from 'react';
import { View, Image, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

const API_URL = 'http://192.168.0.138:4001';

export default function AddPlaceScreen({ navigation }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
      } else {
        Alert.alert('Permissão de localização negada');
      }
    })();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão para acessar a câmera foi negada!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Por favor, insira o nome do lugar');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Por favor, insira a descrição');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);

    if (image) {
      const filename = image.uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      formData.append('photo', {
        uri: image.uri,
        type: type,
        name: filename,
      });
    }

    if (location) {
      formData.append('latitude', location.latitude.toString());
      formData.append('longitude', location.longitude.toString());
    }

    try {
      const response = await fetch(`${API_URL}/places`, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Erro ao salvar lugar');
      }

      Alert.alert('Lugar salvo com sucesso!');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Erro ao salvar lugar:', error);
      Alert.alert('Erro ao salvar lugar', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Nome"
        value={name}
        onChangeText={setName}
        style={styles.input}
        mode="outlined"
        textColor="#39ff14"
        placeholderTextColor="#66ff66"  // placeholder verde claro
        theme={{
          colors: {
            background: '#1a1a1d',  // fundo escuro do input
            primary: '#39ff14',     // cor do foco e borda
            placeholder: '#66ff66', // placeholder verde claro
            text: '#39ff14',        // texto digitado verde limão
          },
        }}
      />
      <TextInput
      label="Descrição"
      value={description}
      onChangeText={setDescription}
      style={styles.input}
      mode="outlined"
      multiline
      textColor="#39ff14"
      placeholderTextColor="#66ff66"
      theme={{
        colors: {
          background: '#1a1a1d',
          primary: '#39ff14',
          placeholder: '#66ff66',
          text: '#39ff14',
        },
      }}
      />
      <Button
        mode="outlined"
        onPress={pickImage}
        icon="camera"
        style={styles.button}
        textColor="#7f00ff"
      >
        Tirar Foto
      </Button>

      {image && (
        <Image
          source={{ uri: image.uri }}
          style={styles.image}
        />
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#39ff14" style={{ marginTop: 16 }} />
      ) : (
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.button}
          buttonColor="#7f00ff"
          textColor="#39ff14"
        >
          Salvar
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#0f0f0f',
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#1a1a1d',
    borderRadius: 8,
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
    borderColor: '#7f00ff',
    backgroundColor: '#2a2a2d',
    shadowColor: '#00f0ff',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 6,
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#39ff14',
  },
});
