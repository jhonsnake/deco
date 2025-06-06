import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { mockReports } from '../data/mock/mockReports';

const { width, height } = Dimensions.get('window');

const MapaScreen: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');

  const initialRegion = {
    latitude: 19.4326,
    longitude: -99.1332,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'nuevo': return '#FF9500';
      case 'verificado': return '#007AFF';
      case 'en_progreso': return '#5856D6';
      case 'resuelto': return '#34C759';
      case 'rechazado': return '#FF3B30';
      default: return '#8E8E93';
    }
  };

  const handleMarkerPress = (reportId: string) => {
    setSelectedReport(reportId);
  };

  const handleMapPress = () => {
    setSelectedReport(null);
  };

  const toggleMapType = () => {
    setMapType(prev => prev === 'standard' ? 'satellite' : 'standard');
  };

  const selectedReportData = mockReports.find(report => report.id === selectedReport);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Mapa de Reportes</Text>
          <Text style={styles.headerSubtitle}>
            {mockReports.length} reportes en el área
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.mapTypeButton}
          onPress={toggleMapType}
        >
          <Text style={styles.mapTypeButtonText}>
            {mapType === 'standard' ? '🛰️' : '🗺️'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={initialRegion}
          mapType={mapType}
          onPress={handleMapPress}
          showsUserLocation
          showsMyLocationButton
        >
          {mockReports.map((report) => (
            <Marker
              key={report.id}
              coordinate={{
                latitude: report.location.latitude,
                longitude: report.location.longitude,
              }}
              onPress={() => handleMarkerPress(report.id)}
              pinColor={getMarkerColor(report.status)}
            />
          ))}
        </MapView>

        {/* Legend */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Estado de Reportes</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#FF9500' }]} />
              <Text style={styles.legendText}>Nuevo</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#007AFF' }]} />
              <Text style={styles.legendText}>Verificado</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#5856D6' }]} />
              <Text style={styles.legendText}>En Progreso</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#34C759' }]} />
              <Text style={styles.legendText}>Resuelto</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Selected Report Card */}
      {selectedReportData && (
        <View style={styles.reportCard}>
          <View style={styles.reportCardHeader}>
            <View style={[
              styles.statusIndicator, 
              { backgroundColor: getMarkerColor(selectedReportData.status) }
            ]} />
            <Text style={styles.reportTitle} numberOfLines={1}>
              {selectedReportData.title}
            </Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setSelectedReport(null)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.reportDescription} numberOfLines={2}>
            {selectedReportData.description}
          </Text>
          
          <View style={styles.reportFooter}>
            <Text style={styles.reportCategory}>
              {selectedReportData.categoryNombre}
            </Text>
            <Text style={styles.reportAuthor}>
              Por: {selectedReportData.creatorDisplayName}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.viewDetailsButton}
            onPress={() => {
              console.log('Ver detalles del reporte:', selectedReportData.id);
              // TODO: Navigate to ReportDetailScreen
            }}
          >
            <Text style={styles.viewDetailsButtonText}>Ver Detalles</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#8E8E93',
  },
  mapTypeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  mapTypeButtonText: {
    fontSize: 20,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  legend: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  legendItems: {
    gap: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 10,
    color: '#3C3C43',
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  reportCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  reportTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  closeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  reportDescription: {
    fontSize: 14,
    color: '#3C3C43',
    lineHeight: 18,
    marginBottom: 12,
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportCategory: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  reportAuthor: {
    fontSize: 12,
    color: '#8E8E93',
  },
  viewDetailsButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  viewDetailsButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default MapaScreen;