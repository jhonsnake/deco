import React from 'react';
import { TextInput, StyleSheet, View, Text, TextInputProps, ViewStyle } from 'react-native';

interface StyledInputProps extends TextInputProps {
  label?: string;
  errorMessage?: string;
  containerStyle?: ViewStyle;
}

const StyledInput: React.FC<StyledInputProps> = ({
  label,
  errorMessage,
  style,
  containerStyle,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, style, errorMessage ? styles.errorInput : null]}
        placeholderTextColor="#888"
        {...props}
      />
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});

export default StyledInput;
