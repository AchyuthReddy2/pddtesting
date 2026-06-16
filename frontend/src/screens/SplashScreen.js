import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Easing, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors, spacing, radius, font } from '../theme/theme';

export default function SplashScreen({ onDone }) {
  const { t } = useApp();
  const scale = useRef(new Animated.Value(0.7)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const native = Platform.OS !== 'web';
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: native }),
      Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: native }),
      Animated.timing(slide, { toValue: 0, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: native }),
    ]).start();

    const timer = setTimeout(() => onDone && onDone(), 1900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={s.root}>
      <Animated.View style={[s.logoWrap, { transform: [{ scale }], opacity }]}>
        <View style={s.logoCircle}>
          <Ionicons name="leaf" size={56} color={colors.white} />
        </View>
      </Animated.View>
      <Animated.View style={{ opacity, transform: [{ translateY: slide }], alignItems: 'center' }}>
        <Text style={s.title}>{t('appName')}</Text>
        <Text style={s.tagline}>{t('tagline')}</Text>
      </Animated.View>

      <View style={s.footer}>
        <View style={s.dots}>
          <View style={[s.dot, { backgroundColor: colors.gold }]} />
          <View style={[s.dot, { backgroundColor: colors.accent }]} />
          <View style={[s.dot, { backgroundColor: colors.primaryLight }]} />
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  logoWrap: { marginBottom: spacing.xl },
  logoCircle: {
    width: 120, height: 120, borderRadius: radius.pill, backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)',
  },
  title: { ...font.h1, color: colors.white, fontSize: 34, letterSpacing: 0.5 },
  tagline: { ...font.body, color: colors.primaryLight, marginTop: spacing.sm },
  footer: { position: 'absolute', bottom: 60 },
  dots: { flexDirection: 'row' },
  dot: { width: 10, height: 10, borderRadius: 5, marginHorizontal: 5 },
});
