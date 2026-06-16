import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import {
  StackScreenHeader,
  FabButton,
  BottomSheet,
  layout,
} from '../components/ScreenLayout';
import { PrimaryButton } from '../components/UI';
import { colors, spacing, radius, font } from '../theme/theme';
import { callNumber } from '../utils/call';
import { safeGoBack } from '../utils/navigation';

export default function HelpBoardScreen({ navigation }) {
  const { t, user, getHelpBoard, addHelpBoardPost } = useApp();
  const posts = getHelpBoard();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ type: 'Need', title: '', place: '', phone: '' });

  const submit = async () => {
    if (!form.title.trim()) {
      Alert.alert('Missing info', 'Please describe what you need or offer.');
      return;
    }
    try {
      await addHelpBoardPost({
        type: form.type,
        title: form.title.trim(),
        place: form.place || user?.village,
        phone: form.phone || user?.phone,
      });
      setForm({ type: 'Need', title: '', place: '', phone: '' });
      setModal(false);
    } catch (e) {
      Alert.alert('Error', e.message || 'Could not post');
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StackScreenHeader
        title={t('helpBoard')}
        subtitle={`${posts.length} posts`}
        onBack={() => safeGoBack(navigation)}
        accent={colors.sky}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        <Text style={s.sub}>Offer or request help from neighbours — tractors, labour, transport</Text>
        <View style={layout.listPad}>
          {posts.map((p) => {
            const accent = p.type === 'Offer' ? colors.success : colors.accent;
            return (
              <View key={p.id} style={s.card}>
                <View style={[s.accent, { backgroundColor: accent }]} />
                <View style={s.cardBody}>
                  <View style={s.row}>
                    <View style={[s.typeBadge, { backgroundColor: accent + '18' }]}>
                      <Text style={[s.typeText, { color: accent }]}>
                        {p.type === 'Offer' ? t('offer') : t('need')}
                      </Text>
                    </View>
                    <Text style={s.time}>{p.time}</Text>
                  </View>
                  <Text style={s.title}>{p.title}</Text>
                  <Text style={s.meta}>{p.author} · {p.place}</Text>
                  {p.phone ? (
                    <TouchableOpacity style={[s.callBtn, { backgroundColor: colors.primary }]} onPress={() => callNumber(p.phone)} activeOpacity={0.85}>
                      <Ionicons name="call" size={16} color={colors.white} />
                      <Text style={s.callText}>{t('callNow')}</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            );
          })}
          <View style={{ height: 80 }} />
        </View>
      </ScrollView>

      <FabButton onPress={() => setModal(true)} color={colors.sky} />

      <BottomSheet visible={modal} onClose={() => setModal(false)} title={t('postHelp')}>
        <View style={s.typeRow}>
          {['Need', 'Offer'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[s.typeChip, form.type === type && s.typeChipActive]}
              onPress={() => setForm({ ...form, type })}
            >
              <Text style={[s.typeChipText, form.type === type && { color: colors.white }]}>
                {type === 'Offer' ? t('offer') : t('need')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={layout.fieldLabel}>Description</Text>
        <TextInput
          style={layout.field}
          placeholder="What do you need or offer?"
          placeholderTextColor={colors.textMuted}
          value={form.title}
          onChangeText={(v) => setForm({ ...form, title: v })}
        />
        <Text style={layout.fieldLabel}>Location</Text>
        <TextInput
          style={layout.field}
          placeholder="Where?"
          placeholderTextColor={colors.textMuted}
          value={form.place}
          onChangeText={(v) => setForm({ ...form, place: v })}
        />
        <PrimaryButton label={t('submit')} icon="checkmark" color={colors.sky} onPress={submit} />
      </BottomSheet>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1 },
  sub: {
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
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  typeBadge: { paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radius.pill },
  typeText: { ...font.tiny, fontWeight: '700' },
  time: { ...font.tiny, color: colors.textMuted },
  title: { ...font.bodyBold, color: colors.text, fontSize: 17, marginTop: spacing.sm },
  meta: { ...font.small, color: colors.textMuted, marginTop: 4 },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    marginTop: spacing.md,
    gap: 6,
  },
  callText: { ...font.small, color: colors.white, fontWeight: '700' },
  typeRow: { flexDirection: 'row', marginBottom: spacing.md, gap: spacing.sm },
  typeChip: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeChipActive: { backgroundColor: colors.sky, borderColor: colors.sky },
  typeChipText: { ...font.bodyBold, color: colors.text },
});
