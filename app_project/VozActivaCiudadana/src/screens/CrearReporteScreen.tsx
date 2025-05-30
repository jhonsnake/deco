import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  StyledInput,
  StyledButton,
  CategorySelector,
  AnonymousSwitch,
  MediaUploader,
  LocationPicker
} from '../../components'; // Assuming components/index.ts exports them
import { MockCategory } from '../../data/mock/mockCategories'; // For CategorySelector data type

// Define structure for form data - Adjusted MediaItem and LocationData types
interface MediaItem {
  id: string;
  uri: string;
  type: 'image' | 'video';
}
interface LocationData {
  latitude: number;
  longitude: number;
  addressText?: string;
}

interface ReportFormData {
  title: string;
  description: string;
  category: MockCategory | null;
  media: MediaItem[];
  location: LocationData | null;
  isAnonymous: boolean;
}

const CrearReporteScreen: React.FC = () => {
  const [formData, setFormData] = useState<ReportFormData>({
    title: '',
    description: '',
    category: null,
    media: [],
    location: null,
    isAnonymous: false,
  });

  const handleInputChange = (name: keyof ReportFormData, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: null,
      media: [], // This should clear the MediaUploader via prop
      location: null, // This should clear the LocationPicker via prop
      isAnonymous: false,
    });
  };

  const handleSubmit = () => {
    console.log('Datos del Reporte (Simulación):', formData);
    // Basic validation
    if (!formData.title || !formData.description || !formData.category || !formData.location) {
      Alert.alert("Campos Incompletos", "Por favor, complete todos los campos obligatorios: título, descripción, categoría y ubicación.");
      return;
    }

    Alert.alert(
      "Confirmar Envío (Simulación)",
      "¿Está seguro de que desea enviar este reporte?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Enviar",
          onPress: () => {
            // Simulate submission
            console.log('Reporte enviado (simulación).');
            Alert.alert("Reporte Enviado", "Su reporte ha sido enviado exitosamente (simulación).");
            resetForm();
            // Potentially navigate to Noticias or ReporteDetalle of the new mock report
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.header}>Crear Nuevo Reporte</Text>

      <StyledInput
        label="Título del Reporte:"
        placeholder="Ej: Bache peligroso en Av. Principal"
        value={formData.title}
        onChangeText={(text) => handleInputChange('title', text)}
        containerStyle={styles.inputGroup}
      />

      <StyledInput
        label="Descripción Detallada:"
        placeholder="Describa el problema o la situación..."
        value={formData.description}
        onChangeText={(text) => handleInputChange('description', text)}
        multiline
        numberOfLines={5}
        style={{ height: 120, textAlignVertical: 'top' }}
        containerStyle={styles.inputGroup}
      />

      <CategorySelector
        selectedCategoryId={formData.category?.id}
        onSelectCategory={(category) => handleInputChange('category', category)}
      />

      <View style={styles.separator} />

      <MediaUploader
        onMediaSelected={(mediaItems) => handleInputChange('media', mediaItems)}
        initialMedia={formData.media} // Now controlled
      />

      <View style={styles.separator} />

      <LocationPicker
        onLocationSelected={(locationData) => handleInputChange('location', locationData)}
        initialLocation={formData.location} // Now controlled
      />

      <View style={styles.separator} />

      <AnonymousSwitch
        value={formData.isAnonymous}
        onValueChange={(value) => handleInputChange('isAnonymous', value)}
      />

      <View style={styles.separator} />

      <StyledButton
        title="Enviar Reporte"
        onPress={handleSubmit}
        style={styles.submitButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  inputGroup: {
    marginBottom: 12,
  },
  separator: {
    height: 10,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#28a745',
    paddingVertical: 15,
  }
});

export default CrearReporteScreen;
