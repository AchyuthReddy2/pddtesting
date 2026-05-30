import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { StackScreenHeader, OfflineBanner, layout } from '../components/ScreenLayout';
import { colors, spacing, radius, font } from '../theme/theme';
export default function PanchayatCalendarScreen({ navigation }) {
  const { t, offline, getPanchayatCalendar } = useApp();
  const events = getPanchayatCalendar();

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StackScreenHeader
        title={t('calendar')}
        subtitle={`${events.length} upcoming events`}
        onBack={() => navigation.goBack()}
      />
      {offline ? <OfflineBanner text={t('offlineBanner')} /> : null}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        <View style={layout.listPad}>
          {events.map((ev) => (
            <View key={ev.id} style={s.card}>
              <View style={[s.accent, { backgroundColor: colors.primary }]} />
              <View style={s.cardBody}>
                <View style={s.row}>
                  <View style={[s.iconWrap, { backgroundColor: colors.primaryLight }]}>
                    <Ionicons name={ev.icon} size={22} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1, marginLeft: spacing.md }}>
                    <Text style={s.title}>{ev.title}</Text>
                    <View style={s.metaRow}>
                      <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
                      <Text style={s.meta}>{ev.date} · {ev.time}</Text>
                    </View>
                    <View style={s.metaRow}>
                      <Ionicons name="location-outline" size={14} color={colors.textMuted} />
                      <Text style={s.meta}>{ev.place}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ))}
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
  title: { ...font.bodyBold, color: colors.text, fontSize: 17 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 },
  meta: { ...font.small, color: colors.textMuted },
});
