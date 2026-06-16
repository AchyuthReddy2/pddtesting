import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font, shadow } from '../theme/theme';

const CARD_HEIGHT = 168;
const AUTO_INTERVAL_MS = 5000;

function PromoCard({ promo, width, onPress }) {
  const [failed, setFailed] = useState(false);

  return (
    <TouchableOpacity
      style={[s.card, { width }, shadow.raised]}
      activeOpacity={0.92}
      onPress={() => onPress?.(promo)}
    >
      {!failed ? (
        <Image
          source={{ uri: promo.image }}
          style={s.image}
          resizeMode="cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <View style={s.fallbackBg}>
          <Ionicons name={promo.fallbackIcon || 'image'} size={48} color="rgba(255,255,255,0.5)" />
        </View>
      )}
      <View style={s.overlay} />
      <View style={s.content}>
        <Text style={s.title} numberOfLines={2}>{promo.title}</Text>
        <Text style={s.subtitle} numberOfLines={2}>{promo.subtitle}</Text>
        <View style={s.ctaRow}>
          <Text style={s.cta}>{promo.cta}</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.white} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function PromoCarousel({ promos, onPress }) {
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = screenWidth - spacing.lg * 2;
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null);

  const scrollTo = useCallback(
    (index) => {
      if (!promos.length) return;
      const next = index % promos.length;
      scrollRef.current?.scrollTo({ x: next * (cardWidth + spacing.md), animated: true });
      setActiveIndex(next);
    },
    [cardWidth, promos.length]
  );

  useEffect(() => {
    if (promos.length <= 1) return undefined;
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % promos.length;
        scrollRef.current?.scrollTo({ x: next * (cardWidth + spacing.md), animated: true });
        return next;
      });
    }, AUTO_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [promos.length, cardWidth]);

  const onScrollEnd = (e) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / (cardWidth + spacing.md));
    setActiveIndex(Math.min(index, promos.length - 1));
  };

  if (!promos?.length) return null;

  return (
    <View style={s.wrap}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled={false}
        snapToInterval={cardWidth + spacing.md}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        contentContainerStyle={{ paddingRight: spacing.lg }}
      >
        {promos.map((promo) => (
          <PromoCard key={promo.id} promo={promo} width={cardWidth} onPress={onPress} />
        ))}
      </ScrollView>

      <View style={s.dots}>
        {promos.map((p, i) => (
          <TouchableOpacity
            key={p.id}
            onPress={() => scrollTo(i)}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          >
            <View style={[s.dot, i === activeIndex && s.dotActive]} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  card: {
    height: CARD_HEIGHT,
    borderRadius: radius.lg,
    marginRight: spacing.md,
    overflow: 'hidden',
    backgroundColor: colors.primaryDark,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  fallbackBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 61, 39, 0.55)',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing.lg,
  },
  title: {
    ...font.h3,
    color: colors.white,
    fontSize: 18,
    lineHeight: 24,
  },
  subtitle: {
    ...font.small,
    color: 'rgba(255,255,255,0.88)',
    marginTop: 4,
    lineHeight: 18,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    gap: 6,
  },
  cta: {
    ...font.small,
    color: colors.white,
    fontWeight: '700',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  dotActive: {
    width: 20,
    backgroundColor: colors.primary,
  },
});
