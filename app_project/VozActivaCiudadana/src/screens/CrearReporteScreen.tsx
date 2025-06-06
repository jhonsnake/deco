import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import {
  StyledInput,
  StyledButton,
  CategorySelector,
  AnonymousSwitch,
  MediaUploader,
  LocationPicker
} from '../components';
import { MockCategory } from '../data/mock/mockCategories';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (name: keyof ReportFormData, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: null,
      media: [],
      location: null,
      isAnonymous: false,
    });
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      Alert.alert("Campo requerido", "Por favor, ingrese un título para el reporte.");
      return false;
    }
    
    if (!formData.description.trim()) {
      Alert.alert("Campo requerido", "Por favor, ingrese una descripción del problema.");
      return false;
    }
    
    if (!formData.category) {
      Alert.alert("Campo requerido", "Por favor, seleccione una categoría.");
      return false;
    }
    
    if (!formData.location) {
      Alert.alert("Campo requerido", "Por favor, seleccione una ubicación.");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        "¡Reporte Enviado!",
        "Su reporte ha sido enviado exitosamente. Recibirá notificaciones sobre el progreso.",
        [
          {
            text: "Aceptar",
            onPress: () => {
              resetForm();
              // TODO: Navigate to feed or report detail
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "Hubo un problema al enviar el reporte. Por favor, inténtelo nuevamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProgressPercentage = () => {
    let completed = 0;
    const total = 5; // title, description, category, location, media (optional)
    
    if (formData.title.trim()) completed++;
    if (formData.description.trim()) completed++;
    if (formData.category) completed++;
    if (formData.location) completed++;
    if (formData.media.length > 0) completed++;
    
    return (completed / total) * 100;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Crear Reporte</Text>
          <Text style={styles.headerSubtitle}>
            Ayúdanos a mejorar tu comunidad
          </Text>
          
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${getProgressPercentage()}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round(getProgressPercentage())}% completado
            </Text>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Form Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información Básica</Text>
            
            <StyledInput
              label="Título del Reporte"
              placeholder="Ej: Bache peligroso en Av. Principal"
              value={formData.title}
              onChangeText={(text) => handleInputChange('title', text)}
              variant="filled"
            />

            <StyledInput
              label="Descripción Detallada"
              placeholder="Describa el problema o la situación..."
              value={formData.description}
              onChangeText={(text) => handleInputChange('description', text)}
              multiline
              numberOfLines={4}
              style={{ height: 100, textAlignVertical: 'top' }}
              variant="filled"
            />

            <CategorySelector
              selectedCategoryId={formData.category?.id}
              onSelectCategory={(category) => handleInputChange('category', category)}
            />
          </View>

          {/* Media Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Evidencia (Opcional)</Text>
            <Text style={styles.sectionSubtitle}>
              Agregue fotos o videos para ayudar a ilustrar el problema
            </Text>
            
            <MediaUploader
              onMediaSelected={(mediaItems) => handleInputChange('media', mediaItems)}
              initialMedia={formData.media}
            />
          </View>

          {/* Location Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ubicación</Text>
            <Text style={styles.sectionSubtitle}>
              Seleccione la ubicación exacta del problema
            </Text>
            
            <LocationPicker
              onLocationSelected={(locationData) => handleInputChange('location', locationData)}
              initialLocation={formData.location}
            />
          </View>

          {/* Privacy Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Privacidad</Text>
            
            <AnonymousSwitch
              value={formData.isAnonymous}
              onValueChange={(value) => handleInputChange('isAnonymous', value)}
              label="Publicar de forma anónima"
            />
            
            <Text style={styles.privacyNote}>
              {formData.isAnonymous 
                ? "Su identidad se mantendrá privada. El reporte aparecerá como 'Anónimo'."
                : "Su nombre aparecerá asociado con este reporte."
              }
            </Text>
          </View>

          {/* Submit Button */}
          <View style={styles.submitSection}>
            <StyledButton
              title={isSubmitting ? "Enviando..." : "Enviar Reporte"}
              onPress={handleSubmit}
              disabled={isSubmitting}
              loading={isSubmitting}
              variant="primary"
              size="large"
            />
            
            <Text style={styles.submitNote}>
              Al enviar este reporte, acepta nuestros términos de servicio y política de privacidad.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
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
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 16,
    lineHeight: 18,
  },
  privacyNote: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 8,
    lineHeight: 16,
  },
  submitSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  submitNote: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 16,
  },
});

export default CrearReporteScreen;