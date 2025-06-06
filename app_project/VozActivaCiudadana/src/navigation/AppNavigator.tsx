import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';

import FeedScreen from '../screens/FeedScreen';
import MapaScreen from '../screens/MapaScreen';
import CrearReporteScreen from '../screens/CrearReporteScreen';
import PerfilScreen from '../screens/PerfilScreen';

const Tab = createBottomTabNavigator();

// Custom tab bar icons
const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  const getIcon = () => {
    switch (name) {
      case 'Noticias': return '📰';
      case 'Mapa': return '🗺️';
      case 'Crear': return '➕';
      case 'Perfil': return '👤';
      default: return '📱';
    }
  };

  return (
    <View style={[styles.tabIcon, focused && styles.tabIconFocused]}>
      <Text style={[styles.tabIconText, focused && styles.tabIconTextFocused]}>
        {getIcon()}
      </Text>
    </View>
  );
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon name={route.name} focused={focused} />
          ),
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
              {route.name}
            </Text>
          ),
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#8E8E93',
        })}
      >
        <Tab.Screen 
          name="Noticias" 
          component={FeedScreen}
          options={{ 
            tabBarLabel: 'Reportes',
          }} 
        />
        <Tab.Screen 
          name="Mapa" 
          component={MapaScreen}
          options={{ 
            tabBarLabel: 'Mapa',
          }} 
        />
        <Tab.Screen 
          name="Crear" 
          component={CrearReporteScreen}
          options={{ 
            tabBarLabel: 'Crear',
          }} 
        />
        <Tab.Screen 
          name="Perfil" 
          component={PerfilScreen}
          options={{ 
            tabBarLabel: 'Perfil',
          }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingTop: 8,
    paddingBottom: 8,
    height: 84,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tabIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  tabIconFocused: {
    backgroundColor: '#E3F2FD',
  },
  tabIconText: {
    fontSize: 18,
  },
  tabIconTextFocused: {
    fontSize: 20,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#8E8E93',
  },
  tabLabelFocused: {
    color: '#007AFF',
    fontWeight: '600',
  },
});