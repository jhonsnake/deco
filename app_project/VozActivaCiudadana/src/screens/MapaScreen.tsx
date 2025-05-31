import React from "react";
import { View, StyleSheet, Text, Dimensions, Image } from "react-native";
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
    latitude: 10.96854, // Barranquilla, Colombia
    longitude: -74.78132,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  const getPinColor = (urgency: string | undefined) => {
    switch (urgency) {
      case "alta":
        return "red";
      case "media":
        return "orange";
      case "baja":
      default:
        return "green";
    }
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
            pinColor={getPinColor(report.urgency)}
          >
            <Callout
              onPress={() =>
                navigation.navigate("DetalleReporte", { reportId: report.id })
              }
            >
              <View style={styles.callout}>
                <Text style={styles.title}>{report.title}</Text>
                <Text style={{ fontWeight: "bold", marginTop: 4 }}>
                  Descripción:
                </Text>
                <Text numberOfLines={3} style={{ marginBottom: 4 }}>
                  {report.description}
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Categoría: </Text>
                  {report.categoryNombre}
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Estado: </Text>
                  {report.status}
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Urgencia: </Text>
                  {report.urgency ? report.urgency : "No especificada"}
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Creado por: </Text>
                  {report.creatorDisplayName}
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Fecha: </Text>
                  {new Date(report.timestampCreated).toLocaleDateString()}
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Apoyos: </Text>
                  {report.supportCount}
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Comentarios: </Text>
                  {report.commentCount ?? 0}
                </Text>
                {report.cloudinaryMedia && report.cloudinaryMedia.length > 0 ? (
                  <Image
                    source={{ uri: report.cloudinaryMedia[0].url }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={{
                      uri: "https://via.placeholder.com/150x100.png?text=Sin+Imagen",
                    }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                )}
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
    width: 220,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  image: {
    width: 200,
    height: 100,
    borderRadius: 8,
    marginTop: 6,
  },
  link: {
    marginTop: 6,
    color: "#2196f3",
    fontWeight: "bold",
  },
});
