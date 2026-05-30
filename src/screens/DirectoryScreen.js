import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import {
  TabScreenHeader,
  OfflineBanner,
  FilterChips,
  SearchField,
  layout,
} from '../components/ScreenLayout';
import { EmptyState } from '../components/UI';
import { colors, spacing, radius, font } from '../theme/theme';
import { directoryCategories } from '../data/constants';
import { callNumber } from '../utils/call';

export default function DirectoryScreen() {
  const { t, offline, getDirectory } = useApp();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');

  const directory = getDirectory();

  const list = directory.filter((d) => {
    const matchCat = cat === 'All' || d.category === cat;
    const matchQ =
      d.name.toLowerCase().includes(q.toLowerCase()) ||
      d.role.toLowerCase().includes(q.toLowerCase());
    return matchCat && matchQ;
  });

  const chipOptions = useMemo(
    () =>
      directoryCategories.map((c) => ({
        label: c,
        key: c,
        count: c === 'All' ? directory.length : directory.filter((d) => d.category === c).length,
      })),
    [directory]
  );

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <TabScreenHeader
        title={t('directory')}
        subtitle={`${list.length} contacts${cat !== 'All' ? ` · ${cat}` : ''}`}
        icon="call"
      />
      {offline ? <OfflineBanner text={t('offlineBanner')} /> : null}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        <FilterChips options={chipOptions} value={cat} onChange={setCat} />
        <SearchField
          value={q}
          onChangeText={setQ}
          placeholder="Search name or service…"
        />

        <View style={layout.listPad}>
          {list.length === 0 ? (
            <EmptyState icon="search-outline" text="No contacts match your search." />
          ) : (
            list.map((d) => (
              <View key={d.id} style={s.card}>
                <View style={[s.accent, { backgroundColor: d.color }]} />
                <View style={s.cardBody}>
                  <View style={s.topRow}>
                    <View style={[s.iconWrap, { backgroundColor: d.color + '14' }]}>
                      <Ionicons name={d.icon} size={22} color={d.color} />
                    </View>
                    <View style={s.info}>
                      <Text style={s.name}>{d.name}</Text>
                      <Text style={s.role}>{d.role}</Text>
                    </View>
                    <TouchableOpacity
                      style={[s.callBtn, { backgroundColor: d.color }]}
                      onPress={() => callNumber(d.phone)}
                      activeOpacity={0.85}
                    >
                      <Ionicons name="call" size={20} color={colors.white} />
                    </TouchableOpacity>
                  </View>
                  <View style={s.metaRow}>
                    <Ionicons name="call-outline" size={14} color={colors.textMuted} />
                    <Text style={s.phone}>{d.phone}</Text>
                    {d.hours ? (
                      <>
                        <Text style={s.dot}>·</Text>
                        <Ionicons name="time-outline" size={14} color={colors.textMuted} />
                        <Text style={s.hours}>{d.hours}</Text>
                      </>
                    ) : null}
                  </View>
                </View>
              </View>
            ))
          )}
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
  topRow: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, marginLeft: spacing.md },
  name: { ...font.bodyBold, color: colors.text, fontSize: 16 },
  role: { ...font.small, color: colors.textMuted, marginTop: 2 },
  callBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexWrap: 'wrap',
    gap: 4,
  },
  phone: { ...font.small, color: colors.textMuted, marginLeft: 4 },
  hours: { ...font.small, color: colors.textMuted, marginLeft: 4 },
  dot: { ...font.small, color: colors.border, marginHorizontal: 4 },
});
