import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import StyledButton from '../common/StyledButton'; // Assuming StyledButton is in common

interface LocationData {
  latitude: number;
  longitude: number;
  addressText?: string;
}

interface LocationPickerProps {
  onLocationSelected: (location: LocationData) => void;
  initialLocation?: LocationData | null;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelected, initialLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(initialLocation || null);

  const handlePickLocation = () => {
    // Simulate location picking
    // In a real app, this would open a map view or use Geolocation API
    console.log('Simulando selección de ubicación...');
    const mockLocation: LocationData = {
      latitude: 19.432608 + (Math.random() - 0.5) * 0.1, // Randomize slightly around Mexico City
      longitude: -99.133209 + (Math.random() - 0.5) * 0.1,
      addressText: `Calle Falsa ${Math.floor(Math.random() * 1000)}, Colonia Simulada, Ciudad Ejemplo`,
    };
    setSelectedLocation(mockLocation);
    onLocationSelected(mockLocation); // Notify parent
  };

  return (
    <View style={styles.container}>
      <StyledButton title="Seleccionar Ubicación" onPress={handlePickLocation} />
      {selectedLocation && (
        <View style={styles.locationDisplay}>
          <Text style={styles.locationTextLabel}>Ubicación Seleccionada:</Text>
          <Text style={styles.locationText}>
            {selectedLocation.addressText ? selectedLocation.addressText : `Lat: ${selectedLocation.latitude.toFixed(5)}, Lon: ${selectedLocation.longitude.toFixed(5)}`}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  locationDisplay: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ced4da',
  },
  locationTextLabel: {
    fontSize: 13,
    color: '#495057',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 15,
    color: '#212529',
  },
});

export default LocationPicker;
