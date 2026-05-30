import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { StackScreenHeader } from '../components/ScreenLayout';
import { colors, spacing, radius, font } from '../theme/theme';
export default function ThreadScreen({ navigation, route }) {
  const { t, user, forumPosts, forumThreads, addForumReply, markThreadRead, fetchThreadPosts } = useApp();
  const threadId = route.params?.threadId;
  const thread = useMemo(
    () => forumThreads.find((th) => th.id === threadId),
    [forumThreads, threadId]
  );
  const [reply, setReply] = useState('');

  useEffect(() => {
    if (threadId) {
      markThreadRead(threadId);
      fetchThreadPosts(threadId);
    }
  }, [threadId]);

  if (!thread) {
    return (
      <SafeAreaView style={s.safe} edges={['top']}>
        <StackScreenHeader title="Discussion" subtitle="Loading…" onBack={() => navigation.goBack()} />
        <View style={s.emptyWrap}>
          <Text style={s.empty}>Loading thread…</Text>
        </View>
      </SafeAreaView>
    );
  }

  const posts = forumPosts[threadId] || [];

  const send = async () => {
    if (!reply.trim()) return;
    try {
      await addForumReply(threadId, reply.trim(), user?.name || 'Villager');
      setReply('');
    } catch {
      // ignore
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StackScreenHeader
        title={thread.title}
        subtitle={`${posts.length} replies`}
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
          {posts.length === 0 ? (
            <View style={s.emptyWrap}>
              <Ionicons name="chatbubbles-outline" size={48} color={colors.border} />
              <Text style={s.empty}>No replies yet. Start the conversation!</Text>
            </View>
          ) : (
            posts.map((p) => (
              <View key={p.id} style={s.bubble}>
                <View style={s.bubbleAccent} />
                <View style={s.bubbleBody}>
                  <Text style={s.author}>{p.author}</Text>
                  <Text style={s.text}>{p.text}</Text>
                  <Text style={s.time}>{p.time}</Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        <View style={s.inputBar}>
          <TextInput
            style={s.input}
            placeholder={t('writeReply')}
            placeholderTextColor={colors.textMuted}
            value={reply}
            onChangeText={setReply}
          />
          <TouchableOpacity style={s.sendBtn} onPress={send} activeOpacity={0.85}>
            <Ionicons name="send" size={22} color={colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  body: { padding: spacing.lg, paddingBottom: 100 },
  emptyWrap: { alignItems: 'center', padding: spacing.xxl },
  empty: { ...font.body, color: colors.textMuted, textAlign: 'center', marginTop: spacing.md },
  bubble: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  bubbleAccent: { width: 4, backgroundColor: colors.primary },
  bubbleBody: { flex: 1, padding: spacing.lg },
  author: { ...font.bodyBold, color: colors.primary },
  text: { ...font.body, color: colors.text, marginTop: spacing.sm, lineHeight: 22 },
  time: { ...font.tiny, color: colors.textMuted, marginTop: spacing.sm },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: colors.bg,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...font.body,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
});
