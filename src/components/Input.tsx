import React, {useState, forwardRef} from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  error?: string;
  disabled?: boolean;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  onIconPress?: () => void;
  borderColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: number;
}

const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      placeholder,
      value,
      defaultValue,
      onChangeText,
      secureTextEntry = false,
      keyboardType = 'default',
      error,
      disabled = false,
      loading = false,
      iconLeft,
      iconRight,
      onIconPress,
      borderColor = '#ccc',
      backgroundColor = '#fff',
      textColor = '#000',
      borderRadius = 8,
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);

    const getInputContainerStyle = () => ({
      borderColor: focused ? '#007bff' : borderColor,
      backgroundColor: backgroundColor,
      borderRadius: borderRadius,
    });

    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}

        <View
          style={[
            styles.inputContainer,
            getInputContainerStyle(),
            error && styles.errorBorder,
            disabled && styles.disabledInput,
          ]}>
          {iconLeft && <View style={styles.icon}>{iconLeft}</View>}

          <TextInput
            ref={ref}
            style={[styles.input, {color: textColor}]}
            placeholder={placeholder}
            placeholderTextColor="#888"
            value={value}
            defaultValue={defaultValue}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            editable={!disabled}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            accessibilityLabel={label}
            accessibilityHint={placeholder}
            accessibilityRole="search"
            accessibilityState={{disabled}}
          />

          {loading && (
            <ActivityIndicator
              size="small"
              color="#007bff"
              style={styles.icon}
            />
          )}
          {iconRight && (
            <TouchableOpacity onPress={onIconPress} disabled={disabled}>
              <View style={styles.icon}>{iconRight}</View>
            </TouchableOpacity>
          )}
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  icon: {
    marginHorizontal: 8,
  },
  errorText: {
    color: '#d9534f',
    fontSize: 12,
    marginTop: 4,
  },
  errorBorder: {
    borderColor: '#d9534f',
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
  },
});

export default Input;
