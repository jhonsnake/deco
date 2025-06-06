import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { MockReport } from '../../data/mock/mockReports';

interface ReportCardProps {
  report: MockReport;
  onPress: (reportId: string) => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

const formatDate = (dateString: string) => {
  if (!dateString) return 'Fecha desconocida';
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hace 1 día';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.ceil(diffDays / 7)} semanas`;
    
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  } catch (e) {
    return 'Fecha inválida';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'nuevo': return '#FF9500';
    case 'verificado': return '#007AFF';
    case 'en_progreso': return '#5856D6';
    case 'resuelto': return '#34C759';
    case 'rechazado': return '#FF3B30';
    default: return '#8E8E93';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'nuevo': return 'Nuevo';
    case 'verificado': return 'Verificado';
    case 'en_progreso': return 'En Progreso';
    case 'resuelto': return 'Resuelto';
    case 'rechazado': return 'Rechazado';
    default: return status;
  }
};

const getUrgencyColor = (urgency?: string) => {
  switch (urgency) {
    case 'alta': return '#FF3B30';
    case 'media': return '#FF9500';
    case 'baja': return '#34C759';
    default: return '#8E8E93';
  }
};

const ReportCard: React.FC<ReportCardProps> = ({ report, onPress }) => {
  const {
    id,
    title,
    description,
    categoryNombre,
    location,
    creatorDisplayName,
    timestampCreated,
    cloudinaryMedia,
    supportCount,
    commentCount,
    status,
    urgency
  } = report;

  const firstMediaImage = cloudinaryMedia?.find(media => media.type === 'image');

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onPress(id)} 
      activeOpacity={0.95}
    >
      {/* Header with status and urgency */}
      <View style={styles.header}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
          <Text style={styles.statusText}>{getStatusText(status)}</Text>
        </View>
        {urgency && (
          <View style={[styles.urgencyBadge, { borderColor: getUrgencyColor(urgency) }]}>
            <View style={[styles.urgencyDot, { backgroundColor: getUrgencyColor(urgency) }]} />
            <Text style={[styles.urgencyText, { color: getUrgencyColor(urgency) }]}>
              {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
            </Text>
          </View>
        )}
      </View>

      {/* Media */}
      {firstMediaImage && (
        <View style={styles.mediaContainer}>
          <Image source={{ uri: firstMediaImage.url }} style={styles.image} />
          <View style={styles.mediaOverlay}>
            <Text style={styles.categoryBadge}>{categoryNombre || 'Sin Categoría'}</Text>
          </View>
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <Text style={styles.description} numberOfLines={3}>
          {description}
        </Text>
        
        {/* Location */}
        <View style={styles.locationContainer}>
          <View style={styles.locationIcon} />
          <Text style={styles.location} numberOfLines={1}>
            {location?.addressText || 'Ubicación no especificada'}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.authorContainer}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {creatorDisplayName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>{creatorDisplayName}</Text>
              <Text style={styles.timestamp}>{formatDate(timestampCreated)}</Text>
            </View>
          </View>
          
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <View style={styles.heartIcon} />
              <Text style={styles.statText}>{supportCount || 0}</Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.commentIcon} />
              <Text style={styles.statText}>{commentCount || 0}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  urgencyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  urgencyText: {
    fontSize: 11,
    fontWeight: '500',
  },
  mediaContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  mediaOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  categoryBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 8,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    color: '#3C3C43',
    lineHeight: 20,
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF3B30',
    marginRight: 6,
  },
  location: {
    fontSize: 12,
    color: '#8E8E93',
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  timestamp: {
    fontSize: 11,
    color: '#8E8E93',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  heartIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF3B30',
    marginRight: 4,
  },
  commentIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    marginRight: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },
});

export default ReportCard;