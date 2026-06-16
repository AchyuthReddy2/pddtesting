import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font, shadow } from '../theme/theme';

export function ScreenHeader({ title, subtitle, icon }) {
  return (
    <View style={s.header}>
      <View style={{ flex: 1 }}>
        <Text style={s.headerTitle}>{title}</Text>
        {subtitle ? <Text style={s.headerSub}>{subtitle}</Text> : null}
      </View>
      {icon ? (
        <View style={s.headerIcon}>
          <Ionicons name={icon} size={26} color={colors.white} />
        </View>
      ) : null}
    </View>
  );
}

export function Card({ children, style, onPress }) {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper
      activeOpacity={0.85}
      onPress={onPress}
      style={[s.card, shadow.card, style]}
    >
      {children}
    </Wrapper>
  );
}

export function Pill({ label, color = colors.primary, light }) {
  return (
    <View style={[s.pill, { backgroundColor: light ? color + '22' : color }]}>
      <Text style={[s.pillText, { color: light ? color : colors.white }]}>{label}</Text>
    </View>
  );
}

export function IconBadge({ name, color = colors.primary, size = 24, bg }) {
  return (
    <View style={[s.iconBadge, { backgroundColor: bg || color + '1A' }]}>
      <Ionicons name={name} size={size} color={color} />
    </View>
  );
}

export function PrimaryButton({ label, onPress, icon, color = colors.primary, style }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[s.btn, { backgroundColor: color }, shadow.card, style]}
    >
      {icon ? <Ionicons name={icon} size={20} color={colors.white} style={{ marginRight: 8 }} /> : null}
      <Text style={s.btnText}>{label}</Text>
    </TouchableOpacity>
  );
}

export function EmptyState({ icon = 'leaf-outline', text }) {
  return (
    <View style={s.empty}>
      <Ionicons name={icon} size={48} color={colors.textMuted} />
      <Text style={s.emptyText}>{text}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: { ...font.h1, color: colors.white },
  headerSub: { ...font.body, color: colors.primaryLight, marginTop: 2 },
  headerIcon: {
    width: 46, height: 46, borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  pillText: { ...font.tiny },
  iconBadge: {
    width: 48, height: 48, borderRadius: radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    borderRadius: radius.md,
  },
  btnText: { ...font.bodyBold, color: colors.white, fontSize: 17 },
  empty: { alignItems: 'center', justifyContent: 'center', padding: spacing.xxl },
  emptyText: { ...font.body, color: colors.textMuted, marginTop: spacing.md, textAlign: 'center' },
});
