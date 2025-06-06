import React, { useState } from 'react';
import { TextInput, StyleSheet, View, Text, TextInputProps, ViewStyle, Animated } from 'react-native';

interface StyledInputProps extends TextInputProps {
  label?: string;
  errorMessage?: string;
  containerStyle?: ViewStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outline';
}

const StyledInput: React.FC<StyledInputProps> = ({
  label,
  errorMessage,
  style,
  containerStyle,
  leftIcon,
  rightIcon,
  variant = 'filled',
  value,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [animatedValue] = useState(new Animated.Value(value ? 1 : 0));

  const handleFocus = (e: any) => {
    setIsFocused(true);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (!value) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    onBlur?.(e);
  };

  const getContainerStyle = () => {
    const baseStyle = [styles.container];
    
    switch (variant) {
      case 'outline':
        baseStyle.push(styles.outlineContainer);
        break;
      case 'filled':
        baseStyle.push(styles.filledContainer);
        break;
      default:
        baseStyle.push(styles.defaultContainer);
    }
    
    if (isFocused) {
      baseStyle.push(styles.focusedContainer);
    }
    
    if (errorMessage) {
      baseStyle.push(styles.errorContainer);
    }
    
    return baseStyle;
  };

  const getInputStyle = () => {
    const baseStyle = [styles.input];
    
    if (leftIcon) {
      baseStyle.push(styles.inputWithLeftIcon);
    }
    
    if (rightIcon) {
      baseStyle.push(styles.inputWithRightIcon);
    }
    
    return baseStyle;
  };

  const labelStyle = {
    position: 'absolute' as const,
    left: leftIcon ? 44 : 16,
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 8],
    }),
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['#8E8E93', isFocused ? '#007AFF' : '#8E8E93'],
    }),
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <View style={getContainerStyle()}>
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
        
        {label && (
          <Animated.Text style={labelStyle}>
            {label}
          </Animated.Text>
        )}
        
        <TextInput
          style={[...getInputStyle(), style]}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor="#C7C7CC"
          {...props}
        />
        
        {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
      </View>
      
      {errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    minHeight: 56,
    position: 'relative',
  },
  defaultContainer: {
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filledContainer: {
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#E5E5EA',
  },
  focusedContainer: {
    borderColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  errorContainer: {
    borderColor: '#FF3B30',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  leftIconContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  rightIconContainer: {
    paddingRight: 16,
    paddingLeft: 8,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 16,
  },
});

export default StyledInput;