import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { StackScreenHeader, layout } from '../components/ScreenLayout';
import { colors, spacing, radius, font } from '../theme/theme';
import { safeGoBack } from '../utils/navigation';
export default function GroupsScreen({ navigation }) {
  const { t, joinedGroups, toggleGroup, getGroups } = useApp();
  const groups = getGroups();
  const joinedCount = joinedGroups.length;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StackScreenHeader
        title={t('groups')}
        subtitle={`${joinedCount} joined · ${groups.length} available`}
        onBack={() => safeGoBack(navigation)}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        <Text style={s.intro}>Join community groups to discuss topics and stay informed.</Text>

        <View style={layout.listPad}>
          {groups.map((g) => {
            const joined = joinedGroups.includes(g.id);
            return (
              <View key={g.id} style={s.card}>
                <View style={[s.accent, { backgroundColor: g.color }]} />
                <View style={s.cardBody}>
                  <View style={s.row}>
                    <View style={[s.iconWrap, { backgroundColor: g.color + '14' }]}>
                      <Ionicons name={g.icon} size={24} color={g.color} />
                    </View>
                    <View style={{ flex: 1, marginLeft: spacing.md }}>
                      <Text style={s.name}>{g.name}</Text>
                      <Text style={s.topic}>{g.topic}</Text>
                      <View style={s.membersRow}>
                        <Ionicons name="people-outline" size={14} color={colors.textMuted} />
                        <Text style={s.members}>
                          {g.members + (joined ? 1 : 0)} {t('members')}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={s.btnRow}>
                    <TouchableOpacity
                      style={[s.joinBtn, joined ? s.joinedBtn : { backgroundColor: g.color }]}
                      onPress={() => toggleGroup(g.id)}
                      activeOpacity={0.85}
                    >
                      <Ionicons
                        name={joined ? 'checkmark' : 'add'}
                        size={18}
                        color={joined ? g.color : colors.white}
                      />
                      <Text style={[s.joinText, joined && { color: g.color }]}>
                        {joined ? t('joined') : t('join')}
                      </Text>
                    </TouchableOpacity>
                    {joined ? (
                      <TouchableOpacity
                        style={[s.viewBtn, { borderColor: g.color }]}
                        onPress={() => navigation.navigate('GroupDetail', { groupId: g.id })}
                        activeOpacity={0.85}
                      >
                        <Text style={[s.viewText, { color: g.color }]}>{t('viewGroup')}</Text>
                        <Ionicons name="chevron-forward" size={16} color={g.color} />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>
              </View>
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
  intro: {
    ...font.body,
    color: colors.textMuted,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    lineHeight: 22,
  },
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
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { ...font.bodyBold, color: colors.text, fontSize: 17 },
  topic: { ...font.small, color: colors.textMuted, marginTop: 2 },
  membersRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 },
  members: { ...font.small, color: colors.textMuted },
  btnRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  joinBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  joinedBtn: { backgroundColor: colors.primaryLight, borderWidth: 1, borderColor: colors.border },
  joinText: { ...font.bodyBold, color: colors.white, marginLeft: 6 },
  viewBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 2,
    gap: 4,
  },
  viewText: { ...font.small, fontWeight: '700' },
});
