import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { PrimaryButton } from '../components/UI';
import { colors, spacing, radius, font } from '../theme/theme';
import { onboardingSlides } from '../data/constants';

const accents = [colors.primary, colors.sky, colors.accent, colors.danger];

export default function OnboardingScreen({ navigation }) {
  const { t, completeOnboarding } = useApp();
  const { width: slideWidth } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const scrollRef = useRef(null);

  const goTo = useCallback(
    (i) => {
      const next = Math.max(0, Math.min(i, onboardingSlides.length - 1));
      scrollRef.current?.scrollTo({ x: next * slideWidth, animated: true });
      setIndex(next);
    },
    [slideWidth]
  );

  const onScroll = (e) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / slideWidth);
    if (i !== index && i >= 0 && i < onboardingSlides.length) setIndex(i);
  };

  const finish = () => {
    completeOnboarding();
    navigation.replace('Login');
  };

  const isLast = index === onboardingSlides.length - 1;

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.topBar}>
        <TouchableOpacity onPress={finish} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={s.skip}>{t('skip')}</Text>
        </TouchableOpacity>
      </View>

      <View style={s.carouselWrap}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          style={s.carousel}
          contentContainerStyle={{ alignItems: 'stretch' }}
        >
          {onboardingSlides.map((slide, i) => (
            <View key={slide.id} style={[s.slide, { width: slideWidth }]}>
              <View style={[s.iconCircle, { backgroundColor: accents[i] + '1A' }]}>
                <View style={[s.iconInner, { backgroundColor: accents[i] }]}>
                  <Ionicons name={slide.icon} size={56} color={colors.white} />
                </View>
              </View>
              <Text style={s.title}>{slide.title}</Text>
              <Text style={s.text}>{slide.text}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={s.bottom}>
        <View style={s.dots}>
          {onboardingSlides.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => goTo(i)}
              style={[s.dot, i === index && { width: 24, backgroundColor: accents[index] }]}
            />
          ))}
        </View>
        <PrimaryButton
          label={isLast ? t('getStarted') : t('next')}
          icon={isLast ? 'arrow-forward' : undefined}
          color={accents[index]}
          onPress={() => (isLast ? finish() : goTo(index + 1))}
        />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  topBar: { alignItems: 'flex-end', paddingHorizontal: spacing.xl, paddingTop: spacing.sm },
  skip: { ...font.bodyBold, color: colors.textMuted },
  carouselWrap: {
    flex: 1,
    minHeight: 280,
  },
  carousel: {
    flex: 1,
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xl,
  },
  iconCircle: {
    width: 200,
    height: 200,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  iconInner: {
    width: 130,
    height: 130,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...font.h1,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
    fontSize: 26,
  },
  text: {
    ...font.body,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 17,
    maxWidth: 320,
  },
  bottom: { paddingHorizontal: spacing.xl, paddingBottom: spacing.lg },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: spacing.xl },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
});
