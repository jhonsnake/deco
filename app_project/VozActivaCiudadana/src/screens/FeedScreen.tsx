import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { mockReports } from "../data/mock/mockReports";
import { mockCategories } from "../data/mock/mockCategories";
import { NavigationProp, useNavigation } from "@react-navigation/native";

type RootStackParamList = {
  DetalleReporte: { reportId: string };
  // otras rutas si existen
};

const urgencyColors = {
  baja: "#4caf50",
  media: "#ff9800",
  alta: "#f44336",
};

export default function FeedScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const renderReportItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("DetalleReporte", { reportId: item.id })
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>{item.title}</Text>
          <View
            style={[
              styles.urgencyBadge,
              { backgroundColor: urgencyColors[item.urgency || "baja"] },
            ]}
          >
            <Text style={styles.urgencyText}>
              {item.urgency?.toUpperCase() || "BAJA"}
            </Text>
          </View>
        </View>
        <Text style={styles.category}>{item.categoryNombre}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        {item.cloudinaryMedia && item.cloudinaryMedia.length > 0 && (
          <Image
            source={{ uri: item.cloudinaryMedia[0].url }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        <View style={styles.footer}>
          <Text style={styles.creator}>
            Reportado por: {item.creatorDisplayName}
          </Text>
          <Text style={styles.status}>Estado: {item.status}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={mockReports}
        keyExtractor={(item) => item.id}
        renderItem={renderReportItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    marginRight: 8,
  },
  urgencyBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  urgencyText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  category: {
    fontSize: 14,
    color: "#666",
    marginVertical: 4,
  },
  description: {
    fontSize: 14,
    color: "#333",
  },
  image: {
    height: 150,
    borderRadius: 8,
    marginTop: 8,
  },
  footer: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  creator: {
    fontSize: 12,
    color: "#555",
  },
  status: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2196f3",
  },
});
