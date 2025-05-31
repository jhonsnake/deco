import React from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { mockReports } from "../data/mock/mockReports";
import { useNavigation, NavigationProp } from "@react-navigation/native";

type RootStackParamList = {
  DetalleReporte: { reportId: string };
  // otras rutas si existen
};

export default function MapaScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const initialRegion = {
    latitude: 19.4326,
    longitude: -99.1332,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        {mockReports.map((report) => (
          <Marker
            key={report.id}
            coordinate={{
              latitude: report.location.latitude,
              longitude: report.location.longitude,
            }}
            pinColor={
              report.urgency === "alta"
                ? "red"
                : report.urgency === "media"
                ? "orange"
                : "green"
            }
          >
            <Callout
              onPress={() =>
                navigation.navigate("DetalleReporte", { reportId: report.id })
              }
            >
              <View style={styles.callout}>
                <Text style={styles.title}>{report.title}</Text>
                <Text numberOfLines={2}>{report.description}</Text>
                <Text style={styles.link}>Ver detalles</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  callout: {
    width: 200,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  link: {
    marginTop: 6,
    color: "#2196f3",
    fontWeight: "bold",
  },
});
