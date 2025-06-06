import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView, 
  RefreshControl,
  TouchableOpacity,
  StatusBar,
  Dimensions
} from 'react-native';
import { ReportCard } from '../components';
import { mockReports, MockReport } from '../data/mock/mockReports';

const { width } = Dimensions.get('window');

const FeedScreen: React.FC = () => {
  const [reports, setReports] = useState<MockReport[]>(mockReports);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('todos');

  const filters = [
    { key: 'todos', label: 'Todos' },
    { key: 'nuevo', label: 'Nuevos' },
    { key: 'verificado', label: 'Verificados' },
    { key: 'en_progreso', label: 'En Progreso' },
    { key: 'resuelto', label: 'Resueltos' },
  ];

  const filteredReports = reports.filter(report => {
    if (selectedFilter === 'todos') return true;
    return report.status === selectedFilter;
  });

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleReportPress = (reportId: string) => {
    console.log('Navegando a reporte:', reportId);
    // TODO: Navigate to ReportDetailScreen
  };

  const renderFilterItem = ({ item }: { item: typeof filters[0] }) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        selectedFilter === item.key && styles.filterChipActive
      ]}
      onPress={() => setSelectedFilter(item.key)}
    >
      <Text style={[
        styles.filterChipText,
        selectedFilter === item.key && styles.filterChipTextActive
      ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderReportItem = ({ item }: { item: MockReport }) => (
    <ReportCard report={item} onPress={handleReportPress} />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Reportes Ciudadanos</Text>
      <Text style={styles.headerSubtitle}>
        {filteredReports.length} {filteredReports.length === 1 ? 'reporte' : 'reportes'}
      </Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon} />
      <Text style={styles.emptyTitle}>No hay reportes</Text>
      <Text style={styles.emptySubtitle}>
        {selectedFilter === 'todos' 
          ? 'Aún no hay reportes disponibles'
          : `No hay reportes con estado "${filters.find(f => f.key === selectedFilter)?.label}"`
        }
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {renderHeader()}
      
      {/* Filters */}
      <View style={styles.filtersContainer}>
        <FlatList
          data={filters}
          renderItem={renderFilterItem}
          keyExtractor={(item) => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        />
      </View>

      {/* Reports List */}
      <FlatList
        data={filteredReports}
        renderItem={renderReportItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#007AFF"
            colors={['#007AFF']}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
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
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  filtersContent: {
    paddingHorizontal: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  filterChipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3C3C43',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E5E5EA',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default FeedScreen;