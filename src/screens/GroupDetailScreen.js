import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { StackScreenHeader, layout } from '../components/ScreenLayout';
import { colors, spacing, radius, font } from '../theme/theme';
export default function GroupDetailScreen({ navigation, route }) {
  const { t, joinedGroups, forumPosts, readThreads, getGroups, getForumThreadsForGroup, fetchGroupThreads } = useApp();
  const groupId = route.params?.groupId;
  const group = getGroups().find((g) => g.id === groupId);
  const joined = joinedGroups.includes(groupId);

  useEffect(() => {
    if (joined && groupId) fetchGroupThreads(groupId);
  }, [joined, groupId]);

  if (!group) return null;

  const threads = getForumThreadsForGroup(groupId);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StackScreenHeader
        title={group.name}
        subtitle={group.topic}
        onBack={() => navigation.goBack()}
        accent={group.color}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {!joined ? (
          <View style={s.locked}>
            <View style={s.lockIcon}>
              <Ionicons name="lock-closed" size={32} color={colors.textMuted} />
            </View>
            <Text style={s.lockedText}>{t('joinToView')}</Text>
          </View>
        ) : (
          <View style={layout.listPad}>
            <Text style={s.section}>{t('threads')}</Text>
            {threads.map((th) => {
              const posts = forumPosts[th.id] || [];
              const unread = !readThreads.includes(th.id) && posts.length > 0;
              return (
                <TouchableOpacity
                  key={th.id}
                  style={s.card}
                  onPress={() => navigation.navigate('Thread', { threadId: th.id, groupId })}
                  activeOpacity={0.85}
                >
                  <View style={[s.accent, { backgroundColor: group.color }]} />
                  <View style={s.cardBody}>
                    <View style={s.threadRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={s.threadTitle}>{th.title}</Text>
                        <Text style={s.threadMeta}>
                          {th.author} · {th.time} · {posts.length || th.replies} replies
                        </Text>
                      </View>
                      {unread ? <View style={s.dot} /> : null}
                      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1 },
  section: { ...font.h3, color: colors.text, marginBottom: spacing.md },
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
  threadRow: { flexDirection: 'row', alignItems: 'center' },
  threadTitle: { ...font.bodyBold, color: colors.text, fontSize: 17 },
  threadMeta: { ...font.small, color: colors.textMuted, marginTop: 4 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.danger, marginRight: spacing.sm },
  locked: { alignItems: 'center', padding: spacing.xxl, marginTop: spacing.xl },
  lockIcon: {
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  lockedText: { ...font.body, color: colors.textMuted, marginTop: spacing.lg, textAlign: 'center', lineHeight: 22 },
});
