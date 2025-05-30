import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MockReport } from '../../data/mock/mockReports'; // Using mock type for now

interface ReportCardProps {
  report: MockReport;
  onPress: (reportId: string) => void;
}

// Helper to format date, can be moved to utils later
const formatDate = (dateString: string) => {
  if (!dateString) return 'Fecha desconocida';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch (e) {
    return 'Fecha inválida';
  }
};

const ReportCard: React.FC<ReportCardProps> = ({ report, onPress }) => {
  const {
    id,
    title,
    description,
    categoryNombre, // Using denormalized name from mock
    location,
    creatorDisplayName,
    timestampCreated,
    cloudinaryMedia,
    supportCount,
    commentCount
  } = report;

  const firstMediaImage = cloudinaryMedia?.find(media => media.type === 'image');

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(id)} activeOpacity={0.8}>
      {firstMediaImage && (
        <Image source={{ uri: firstMediaImage.url }} style={styles.image} />
      )}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <Text style={styles.category}>{categoryNombre || 'Sin Categoría'}</Text>
        <Text style={styles.description} numberOfLines={3}>
          {description}
        </Text>
        <Text style={styles.location} numberOfLines={1}>
          Ubicación: {location?.addressText || 'No especificada'}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.metaText}>Por: {creatorDisplayName}</Text>
          <Text style={styles.metaText}>{formatDate(timestampCreated)}</Text>
        </View>
        <View style={styles.stats}>
            <Text style={styles.statText}>{supportCount || 0} Apoyos</Text>
            <Text style={styles.statText}>{commentCount || 0} Comentarios</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden', // Ensures image corners are also rounded
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  category: {
    fontSize: 12,
    color: '#007bff',
    fontWeight: '600',
    backgroundColor: '#e7f3ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
    overflow: 'hidden', // Ensure text within rounded corners is clipped
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    lineHeight: 20,
  },
  location: {
    fontSize: 12,
    color: '#777',
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    marginTop: 5,
  },
  metaText: {
    fontSize: 11,
    color: '#666',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statText: {
      fontSize: 12,
      color: '#4CAF50', // A green color for positive stats
      fontWeight: '500',
  }
});

export default ReportCard;
