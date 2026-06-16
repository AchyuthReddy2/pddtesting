import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useApp } from '../context/AppContext';
import { EmptyState, PrimaryButton } from '../components/UI';
import { colors, spacing, radius, font, shadow } from '../theme/theme';

const CATEGORY_ICONS = {
  Panchayat: 'megaphone-outline',
  Weather: 'rainy-outline',
  Event: 'calendar-outline',
  Water: 'water-outline',
  Outage: 'flash-off-outline',
};

function NoticeCard({ item, t, onListen, isFeatured }) {
  const iconName = item.icon?.includes('-outline') ? item.icon : `${item.icon}-outline`;

  return (
    <View style={[s.noticeCard, isFeatured && s.noticeFeatured, shadow.card]}>
      <View style={[s.accentBar, { backgroundColor: item.color }]} />
      <View style={s.noticeInner}>
        <View style={s.noticeTop}>
          <View style={[s.catBadge, { backgroundColor: item.color + '14' }]}>
            <Ionicons name={CATEGORY_ICONS[item.category] || iconName} size={14} color={item.color} />
            <Text style={[s.catText, { color: item.color }]}>{item.category}</Text>
          </View>
          <Text style={s.timeText}>{item.time}</Text>
        </View>

        <Text style={[s.noticeTitle, isFeatured && s.noticeTitleFeatured]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={s.noticeBody} numberOfLines={isFeatured ? 4 : 3}>
          {item.body}
        </Text>

        <View style={s.noticeFooter}>
          <View style={s.authorRow}>
            <Ionicons name="person-circle-outline" size={16} color={colors.textMuted} />
            <Text style={s.authorText} numberOfLines={1}>
              {item.author}
            </Text>
          </View>
          <TouchableOpacity style={s.listenBtn} onPress={() => onListen(item)} activeOpacity={0.8}>
            <Ionicons name="volume-medium-outline" size={18} color={colors.primary} />
            <Text style={s.listenText}>{t('listen')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function FeedScreen() {
  const { t, user, offline, getAnnouncements, addAnnouncement, refreshBootstrap } = useApp();
  const [filter, setFilter] = useState('All');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', category: 'Panchayat' });
  const [refreshing, setRefreshing] = useState(false);

  const announcements = getAnnouncements();
  const isAdmin = user?.role === 'Sarpanch';

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(announcements.map((a) => a.category)))],
    [announcements]
  );

  const list = filter === 'All' ? announcements : announcements.filter((a) => a.category === filter);

  const speak = (a) => {
    Speech.speak(`${a.title}. ${a.body}`, { language: 'en-IN', rate: 0.9 });
  };

  const post = async () => {
    if (!form.title.trim() || !form.body.trim()) {
      Alert.alert('Missing info', 'Please add a title and message.');
      return;
    }
    const catColors = {
      Panchayat: '#1B5E3F',
      Weather: '#2E7DA1',
      Event: '#E8762B',
      Water: '#7A5230',
      Outage: '#D9A521',
    };
    try {
      await addAnnouncement({
        category: form.category,
        title: form.title.trim(),
        body: form.body.trim(),
        color: catColors[form.category] || colors.primary,
        icon: 'megaphone',
      });
      setForm({ title: '', body: '', category: 'Panchayat' });
      setModal(false);
    } catch (e) {
      Alert.alert('Error', e.message || 'Could not post announcement');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshBootstrap();
    setRefreshing(false);
  };

  const formCategories = ['Panchayat', 'Weather', 'Event', 'Water', 'Outage'];

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.headerTitle}>{t('announcements')}</Text>
          <Text style={s.headerSub}>
            {list.length} {list.length === 1 ? 'notice' : 'notices'}
            {filter !== 'All' ? ` · ${filter}` : ''}
          </Text>
        </View>
        <View style={s.headerIcon}>
          <Ionicons name="megaphone" size={24} color={colors.white} />
        </View>
      </View>

      {offline ? (
        <View style={s.offlineBar}>
          <Ionicons name="cloud-offline-outline" size={16} color={colors.earth} />
          <Text style={s.offlineText}>{t('offlineBanner')}</Text>
        </View>
      ) : null}

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        contentContainerStyle={s.scrollContent}
      >
        {/* Category filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.filterContent}
          style={s.filterScroll}
        >
          {categories.map((c) => {
            const active = filter === c;
            const count = c === 'All' ? announcements.length : announcements.filter((a) => a.category === c).length;
            return (
              <TouchableOpacity
                key={c}
                onPress={() => setFilter(c)}
                style={[s.chip, active && s.chipActive]}
                activeOpacity={0.8}
              >
                <Text style={[s.chipText, active && s.chipTextActive]}>{c}</Text>
                <View style={[s.chipCount, active && s.chipCountActive]}>
                  <Text style={[s.chipCountText, active && s.chipCountTextActive]}>{count}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Notice list */}
        <View style={s.listWrap}>
          {list.length === 0 ? (
            <EmptyState icon="megaphone-outline" text="No notices in this category yet." />
          ) : (
            list.map((a, index) => (
              <NoticeCard
                key={a.id}
                item={a}
                t={t}
                onListen={speak}
                isFeatured={index === 0 && filter === 'All'}
              />
            ))
          )}
        </View>

        <View style={{ height: isAdmin ? 88 : spacing.xl }} />
      </ScrollView>

      {isAdmin ? (
        <TouchableOpacity style={[s.fab, shadow.raised]} onPress={() => setModal(true)} activeOpacity={0.9}>
          <Ionicons name="add" size={28} color={colors.white} />
        </TouchableOpacity>
      ) : null}

      <Modal visible={modal} animationType="slide" transparent onRequestClose={() => setModal(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modal}>
            <View style={s.modalHandle} />
            <View style={s.modalHead}>
              <Text style={s.modalTitle}>{t('postAnnouncement')}</Text>
              <TouchableOpacity onPress={() => setModal(false)} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                <Ionicons name="close" size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={s.fieldLabel}>{t('category')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
              {formCategories.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setForm({ ...form, category: c })}
                  style={[s.formChip, form.category === c && s.formChipActive]}
                >
                  <Text style={[s.formChipText, form.category === c && s.formChipTextActive]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={s.fieldLabel}>Title</Text>
            <TextInput
              style={s.field}
              placeholder="Announcement headline"
              placeholderTextColor={colors.textMuted}
              value={form.title}
              onChangeText={(v) => setForm({ ...form, title: v })}
            />

            <Text style={s.fieldLabel}>Message</Text>
            <TextInput
              style={[s.field, s.fieldArea]}
              placeholder="Write the full notice for villagers…"
              placeholderTextColor={colors.textMuted}
              multiline
              value={form.body}
              onChangeText={(v) => setForm({ ...form, body: v })}
            />

            <PrimaryButton label={t('submit')} icon="send" onPress={post} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  headerTitle: { ...font.h2, color: colors.white, fontSize: 24 },
  headerSub: { ...font.small, color: colors.primaryLight, marginTop: 4 },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  offlineBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentLight,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  offlineText: { ...font.small, color: colors.earth, fontWeight: '600' },

  scrollContent: { flexGrow: 1 },
  filterScroll: { flexGrow: 0, marginTop: spacing.lg },
  filterContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, gap: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.lg,
    paddingRight: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { ...font.small, color: colors.text, fontWeight: '600' },
  chipTextActive: { color: colors.white },
  chipCount: {
    marginLeft: spacing.sm,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  chipCountActive: { backgroundColor: 'rgba(255,255,255,0.25)' },
  chipCountText: { ...font.tiny, color: colors.textMuted, fontWeight: '700' },
  chipCountTextActive: { color: colors.white },

  listWrap: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },

  noticeCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  noticeFeatured: {
    borderColor: colors.primary + '40',
    borderWidth: 1.5,
  },
  accentBar: { width: 4 },
  noticeInner: { flex: 1, padding: spacing.lg },
  noticeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  catBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.pill,
    gap: 6,
  },
  catText: { ...font.tiny, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3 },
  timeText: { ...font.tiny, color: colors.textMuted, fontWeight: '600' },
  noticeTitle: { ...font.bodyBold, color: colors.text, fontSize: 17, lineHeight: 24 },
  noticeTitleFeatured: { fontSize: 18 },
  noticeBody: {
    ...font.body,
    color: colors.textMuted,
    marginTop: spacing.sm,
    lineHeight: 22,
    fontSize: 15,
  },
  noticeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  authorRow: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: spacing.md },
  authorText: { ...font.small, color: colors.textMuted, marginLeft: 6, flex: 1 },
  listenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.primary + '44',
    backgroundColor: colors.primaryLight,
    gap: 4,
  },
  listenText: { ...font.tiny, color: colors.primary, fontWeight: '700' },

  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    paddingTop: spacing.md,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  modalHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: { ...font.h3, color: colors.text },
  fieldLabel: { ...font.small, color: colors.textMuted, fontWeight: '600', marginBottom: spacing.sm },
  formChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  formChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  formChipText: { ...font.small, color: colors.text, fontWeight: '600' },
  formChipTextActive: { color: colors.white },
  field: {
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...font.body,
    color: colors.text,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fieldArea: { minHeight: 120, textAlignVertical: 'top' },
});
