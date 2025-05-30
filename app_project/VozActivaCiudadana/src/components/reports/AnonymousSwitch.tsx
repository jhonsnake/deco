import React from 'react';
import { View, Text, Switch, StyleSheet, Platform } from 'react-native';

interface AnonymousSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
}

const AnonymousSwitch: React.FC<AnonymousSwitchProps> = ({
  value,
  onValueChange,
  label = "Publicar de forma anónima",
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={value ? "#007bff" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={onValueChange}
        value={value}
        style={styles.switch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  switch: Platform.select({
    ios: {
      transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }], // Adjust size for iOS if needed
    },
    android: {},
  }),
});

export default AnonymousSwitch;
