import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { StackScreenHeader, layout } from '../components/ScreenLayout';
import { EmptyState } from '../components/UI';
import { colors, spacing, radius, font } from '../theme/theme';
import { safeGoBack } from '../utils/navigation';

export default function NotificationsScreen({ navigation }) {
  const { t, notifications, markAllRead } = useApp();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StackScreenHeader
        title={t('notifications')}
        subtitle={unread ? `${unread} unread` : 'All caught up'}
        onBack={() => safeGoBack(navigation)}
        rightIcon="checkmark-done"
        onRightPress={markAllRead}
        accent={colors.accent}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {notifications.length === 0 ? (
          <View style={layout.listPad}>
            <EmptyState icon="notifications-outline" text={t('noNotifications')} />
          </View>
        ) : (
          <>
            <TouchableOpacity onPress={markAllRead} style={s.markAll}>
              <Text style={s.markAllText}>{t('markAllRead')}</Text>
            </TouchableOpacity>
            <View style={layout.listPad}>
              {notifications.map((n) => (
                <View key={n.id} style={[s.card, !n.read && s.unread]}>
                  <View style={[s.accent, { backgroundColor: n.color }]} />
                  <View style={s.cardBody}>
                    <View style={s.row}>
                      <View style={[s.iconWrap, { backgroundColor: n.color + '14' }]}>
                        <Ionicons name={n.icon} size={22} color={n.color} />
                      </View>
                      <View style={{ flex: 1, marginLeft: spacing.md }}>
                        <View style={s.titleRow}>
                          <Text style={s.title}>{n.title}</Text>
                          {!n.read ? <View style={s.dot} /> : null}
                        </View>
                        <Text style={s.bodyText}>{n.body}</Text>
                        <Text style={s.time}>{n.time}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1 },
  markAll: { alignSelf: 'flex-end', marginRight: spacing.lg, marginTop: spacing.md },
  markAllText: { ...font.small, color: colors.accent, fontWeight: '700' },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  unread: { borderColor: colors.accent + '44' },
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
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { ...font.bodyBold, color: colors.text, flex: 1, fontSize: 16 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent, marginLeft: spacing.sm },
  bodyText: { ...font.body, color: colors.textMuted, marginTop: 4, lineHeight: 21 },
  time: { ...font.small, color: colors.textMuted, marginTop: 6 },
});
