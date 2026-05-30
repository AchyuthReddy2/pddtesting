import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { StackScreenHeader, FilterChips, layout } from '../components/ScreenLayout';
import { colors, spacing, radius, font } from '../theme/theme';
const filters = ['All', 'Scheme', 'Health Camp'];

export default function SchemesScreen({ navigation }) {
  const { t, getSchemes } = useApp();
  const schemes = getSchemes();
  const [f, setF] = useState('All');
  const list = f === 'All' ? schemes : schemes.filter((x) => x.type === f);

  const chipOptions = useMemo(
    () =>
      filters.map((c) => ({
        label: c,
        key: c,
        count: c === 'All' ? schemes.length : schemes.filter((x) => x.type === c).length,
      })),
    [schemes]
  );

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StackScreenHeader
        title={t('schemes')}
        subtitle={`${list.length} programs`}
        onBack={() => navigation.goBack()}
        accent={colors.gold}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        <FilterChips options={chipOptions} value={f} onChange={setF} activeColor={colors.gold} />

        <View style={layout.listPad}>
          {list.map((sc) => {
            const isScheme = sc.type === 'Scheme';
            const color = isScheme ? colors.gold : colors.danger;
            return (
              <TouchableOpacity
                key={sc.id}
                style={s.card}
                onPress={() => navigation.navigate('SchemeDetail', { schemeId: sc.id })}
                activeOpacity={0.85}
              >
                <View style={[s.accent, { backgroundColor: color }]} />
                <View style={s.cardBody}>
                  <View style={s.row}>
                    <View style={[s.iconWrap, { backgroundColor: color + '14' }]}>
                      <Ionicons name={isScheme ? 'ribbon' : 'medkit'} size={22} color={color} />
                    </View>
                    <View style={{ flex: 1, marginLeft: spacing.md }}>
                      <View style={[s.pill, { backgroundColor: color + '18' }]}>
                        <Text style={[s.pillText, { color }]}>{sc.type}</Text>
                      </View>
                      <Text style={s.title}>{sc.title}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                  </View>
                  <Text style={s.detail} numberOfLines={2}>{sc.detail}</Text>
                  <View style={s.footer}>
                    <Ionicons name="calendar-outline" size={16} color={colors.textMuted} />
                    <Text style={s.deadlineText}>{sc.deadline}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1 },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  accent: { width: 4 },
  cardBody: { flex: 1, padding: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    marginBottom: 4,
  },
  pillText: { ...font.tiny, fontWeight: '700' },
  title: { ...font.bodyBold, color: colors.text, fontSize: 16 },
  detail: { ...font.body, color: colors.textMuted, marginTop: spacing.sm, lineHeight: 22 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 6,
  },
  deadlineText: { ...font.small, color: colors.textMuted, fontWeight: '600' },
});
