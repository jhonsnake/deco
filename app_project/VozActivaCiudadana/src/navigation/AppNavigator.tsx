import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";

import FeedScreen from "../screens/FeedScreen";
import MapaScreen from "../screens/MapaScreen";
import CrearReporteScreen from "../screens/CrearReporteScreen";
import PerfilScreen from "../screens/PerfilScreen";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        id={undefined}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            switch (route.name) {
              case "Noticias":
                return (
                  <MaterialCommunityIcons
                    name="newspaper"
                    size={size}
                    color={color}
                  />
                );
              case "Mapa":
                return (
                  <MaterialCommunityIcons
                    name="map"
                    size={size}
                    color={color}
                  />
                );
              case "Crear":
                return (
                  <Ionicons
                    name="add-circle-outline"
                    size={size}
                    color={color}
                  />
                );
              case "Perfil":
                return (
                  <Ionicons
                    name="person-circle-outline"
                    size={size}
                    color={color}
                  />
                );
              default:
                return null;
            }
          },
          tabBarActiveTintColor: "#2196f3",
          tabBarInactiveTintColor: "gray",
          headerShown: false,
        })}
      >
        <Tab.Screen
          name="Noticias"
          component={FeedScreen}
          options={{ tabBarLabel: "Noticias" }}
        />
        <Tab.Screen
          name="Mapa"
          component={MapaScreen}
          options={{ tabBarLabel: "Mapa" }}
        />
        <Tab.Screen
          name="Crear"
          component={CrearReporteScreen}
          options={{ tabBarLabel: "Crear Reporte" }}
        />
        <Tab.Screen
          name="Perfil"
          component={PerfilScreen}
          options={{ tabBarLabel: "Perfil" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
