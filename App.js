import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import AddPlaceScreen from './screens/AddPlaceScreen';
import PlacesMapScreen from './screens/PlacesMapScreen';

// Se você quiser criar uma tela Game, importe ela aqui também
// import GameScreen from './screens/GameScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0f0f0f', // fundo preto escuro
            shadowColor: 'transparent', // sem sombra
          },
          headerTintColor: '#39ff14', // texto e ícones verde limão
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 22,
          },
        }}
      >
        {/* A tela Home agora aparece com o título 'Gamer' */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Gamer' }} 
        />

        {/* Se quiser adicionar a tela Game para navegação, descomente isso e importe o componente */}
        {/* <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{ title: 'Game' }}
        /> */}

        <Stack.Screen 
          name="Adicionar Lugar" 
          component={AddPlaceScreen} 
          options={{ title: 'Adicionar Lugar' }}
        />
        <Stack.Screen 
          name="Mapa" 
          component={PlacesMapScreen} 
          options={{ title: 'Mapa' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
