import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import FeedScreen from '../screens/FeedScreen';
import MapaScreen from '../screens/MapaScreen';
import CrearReporteScreen from '../screens/CrearReporteScreen';
import PerfilScreen from '../screens/PerfilScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Noticias" component={FeedScreen} options={{ tabBarLabel: 'Noticias' }} />
        <Tab.Screen name="Mapa" component={MapaScreen} options={{ tabBarLabel: 'Mapa' }} />
        <Tab.Screen name="Crear" component={CrearReporteScreen} options={{ tabBarLabel: 'Crear Reporte' }} />
        <Tab.Screen name="Perfil" component={PerfilScreen} options={{ tabBarLabel: 'Perfil' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
