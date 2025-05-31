import React from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { mockUsers } from "../data/mock/mockUsers";
import { mockReports } from "../data/mock/mockReports";

const currentUser = mockUsers[0]; // Simulación: usuario actual es el primero

export default function PerfilScreen() {
  const userReports = mockReports.filter(
    (report) => report.creatorUserID === currentUser.userId
  );

  const renderReportItem = ({ item }) => (
    <View style={styles.reportCard}>
      <Text style={styles.reportTitle}>{item.title}</Text>
      <Text numberOfLines={2} style={styles.reportDescription}>
        {item.description}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: "https://via.placeholder.com/100.png?text=User" }}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{currentUser.displayName}</Text>
      </View>

      <Text style={styles.sectionTitle}>Mis Reportes</Text>
      {userReports.length === 0 ? (
        <Text style={styles.noReportsText}>No has creado reportes aún.</Text>
      ) : (
        <FlatList
          data={userReports}
          keyExtractor={(item) => item.id}
          renderItem={renderReportItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ccc",
    marginBottom: 12,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#555",
  },
  noReportsText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
  reportCard: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  reportDescription: {
    fontSize: 14,
    color: "#555",
  },
});
