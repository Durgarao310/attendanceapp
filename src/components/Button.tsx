import React, {useCallback, useRef, useMemo} from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  StyleSheet,
  Platform,
  TouchableNativeFeedback,
  Animated,
} from 'react-native';

interface ButtonProps {
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  onPress?: () => void;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  borderRadius?: number;
  backgroundColor?: string;
  textColor?: string;
  hitSlop?: {top?: number; bottom?: number; left?: number; right?: number};
  testID?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  children?: React.ReactNode;
  rippleEffect?: boolean;
  elevation?: number;
  animation?: boolean;
  shadow?: boolean;
  textStyle?: object;
}

const Button: React.FC<ButtonProps> = ({
  size = 'medium',
  disabled = false,
  loading = false,
  variant = 'primary',
  onPress = () => {},
  icon,
  iconPosition = 'left',
  fullWidth = false,
  borderRadius = 4,
  backgroundColor,
  textColor,
  hitSlop,
  testID,
  accessible = true,
  accessibilityLabel,
  accessibilityHint,
  children,
  rippleEffect = false,
  elevation = 2,
  animation = false,
  shadow = false,
  textStyle,
}) => {
  const animatedValue = useRef(new Animated.Value(1)).current;
  const lastPress = useRef<NodeJS.Timeout | null>(null);

  const handlePressIn = () => {
    if (animation) {
      Animated.spring(animatedValue, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (animation) {
      Animated.spring(animatedValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePress = useCallback(() => {
    if (disabled || loading) {
      return;
    }
    if (lastPress.current) {
      return;
    }

    lastPress.current = setTimeout(() => {
      lastPress.current = null;
    }, 500);

    onPress();
  }, [onPress, disabled, loading]);

  const animatedStyle = {transform: [{scale: animatedValue}]};

  const buttonStyle = useMemo(
    () => ({
      backgroundColor: backgroundColor || getVariantColor(variant),
      borderRadius,
      paddingVertical: getSizePadding(size).vertical,
      paddingHorizontal: getSizePadding(size).horizontal,
      opacity: disabled ? 0.5 : 1,
      borderWidth: variant === 'outline' ? 1 : 0,
      borderColor:
        variant === 'outline' ? getVariantColor('primary') : 'transparent',
      elevation: Platform.OS === 'android' ? elevation : 0,
      ...Platform.select({
        ios: shadow
          ? {
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            }
          : {},
      }),
    }),
    [backgroundColor, variant, size, borderRadius, disabled, elevation, shadow],
  );

  const ButtonComponent =
    Platform.OS === 'android' && rippleEffect
      ? TouchableNativeFeedback
      : TouchableOpacity;

  const ButtonContent = (
    <View style={[styles.wrapper, buttonStyle, fullWidth && styles.fullWidth]}>
      <Animated.View style={[styles.content, animatedStyle]}>
        {loading ? (
          <ActivityIndicator color={textColor || '#fff'} />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <View style={styles.icon}>{icon}</View>
            )}
            <Text
              style={[styles.text, {color: textColor || '#fff'}, textStyle]}
              numberOfLines={1}
              ellipsizeMode="tail">
              {children}
            </Text>
            {icon && iconPosition === 'right' && (
              <View style={styles.icon}>{icon}</View>
            )}
          </>
        )}
      </Animated.View>
    </View>
  );

  return Platform.OS === 'android' && rippleEffect ? (
    <ButtonWrapper borderRadius={borderRadius}>
      <ButtonComponent
        onPress={disabled || loading ? undefined : handlePress}
        background={TouchableNativeFeedback.Ripple('#fff', false)}>
        {ButtonContent}
      </ButtonComponent>
    </ButtonWrapper>
  ) : (
    <TouchableOpacity
      onPress={disabled || loading ? undefined : handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={0.7}
      hitSlop={hitSlop}
      testID={testID}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      accessibilityLiveRegion="polite"
      accessibilityState={{disabled}}>
      {ButtonContent}
    </TouchableOpacity>
  );
};

const ButtonWrapper: React.FC<{
  borderRadius: number;
  children: React.ReactNode;
}> = ({borderRadius, children}) => (
  <View style={[styles.buttonWrapper, {borderRadius}]}>{children}</View>
);

const getSizePadding = (buttonSize: string) => {
  switch (buttonSize) {
    case 'small':
      return {vertical: 6, horizontal: 12};
    case 'large':
      return {vertical: 14, horizontal: 28};
    case 'medium':
    default:
      return {vertical: 10, horizontal: 20};
  }
};

const getVariantColor = (variantType: string) => {
  switch (variantType) {
    case 'primary':
      return '#007bff';
    case 'secondary':
      return '#6c757d';
    case 'danger':
      return '#dc3545';
    case 'outline':
      return 'transparent';
    default:
      return '#007bff';
  }
};

const styles = StyleSheet.create({
  buttonWrapper: {
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
  },
  icon: {
    marginHorizontal: 5,
  },
  fullWidth: {
    width: '100%',
  },
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Button;
