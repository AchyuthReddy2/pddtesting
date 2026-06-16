import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import {
  TabScreenHeader,
  OfflineBanner,
  FilterChips,
  FabButton,
  BottomSheet,
  layout,
} from '../components/ScreenLayout';
import { PrimaryButton } from '../components/UI';
import { colors, spacing, radius, font } from '../theme/theme';
import { marketTags } from '../data/constants';
import { callNumber } from '../utils/call';
import { shareWhatsApp } from '../utils/share';

const tags = ['All', ...marketTags];

export default function MarketScreen() {
  const { t, user, offline, getMarketItems, addMarketItem } = useApp();
  const items = getMarketItems();
  const [tag, setTag] = useState('All');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: '', price: '', place: '', phone: '', tag: 'Produce' });

  const list = tag === 'All' ? items : items.filter((i) => i.tag === tag);

  const chipOptions = useMemo(
    () =>
      tags.map((c) => ({
        label: c,
        key: c,
        count: c === 'All' ? items.length : items.filter((i) => i.tag === c).length,
      })),
    [items]
  );

  const post = async () => {
    if (!form.title.trim() || !form.price.trim()) {
      Alert.alert('Missing info', 'Please add an item name and price.');
      return;
    }
    try {
      await addMarketItem({
        title: form.title,
        price: form.price,
        place: form.place || user?.village,
        phone: form.phone || user?.phone,
        tag: form.tag,
      });
      setForm({ title: '', price: '', place: '', phone: '', tag: 'Produce' });
      setModal(false);
    } catch (e) {
      Alert.alert('Error', e.message || 'Could not post listing');
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <TabScreenHeader
        title={t('market')}
        subtitle={`${list.length} listings`}
        icon="storefront"
        accent={colors.accent}
      />
      {offline ? <OfflineBanner text={t('offlineBanner')} /> : null}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        <FilterChips
          options={chipOptions}
          value={tag}
          onChange={setTag}
          activeColor={colors.accent}
        />

        <View style={layout.listPad}>
          {list.map((m) => (
            <View key={m.id} style={s.card}>
              <View style={[s.accent, { backgroundColor: colors.accent }]} />
              <View style={s.cardBody}>
                <View style={s.topRow}>
                  <View style={{ flex: 1 }}>
                    <View style={s.tagRow}>
                      <Text style={s.tag}>{m.tag}</Text>
                    </View>
                    <Text style={s.title}>{m.title}</Text>
                    <Text style={s.meta}>{m.seller} · {m.place}</Text>
                  </View>
                  <Text style={s.price}>{m.price}</Text>
                </View>
                <View style={s.actions}>
                  <TouchableOpacity style={s.iconAction} onPress={() => shareWhatsApp(`${m.title} — ${m.price}\nSeller: ${m.seller}`)}>
                    <Ionicons name="logo-whatsapp" size={22} color={colors.success} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={s.contactBtn}
                    onPress={() => callNumber(m.phone)}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="call-outline" size={18} color={colors.white} />
                    <Text style={s.contactText}>{t('contactSeller')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
          <View style={{ height: 80 }} />
        </View>
      </ScrollView>

      <FabButton onPress={() => setModal(true)} color={colors.accent} />

      <BottomSheet visible={modal} onClose={() => setModal(false)} title={t('sellItem')}>
        <Text style={layout.fieldLabel}>{t('selectTag')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
          {marketTags.map((tg) => (
            <TouchableOpacity
              key={tg}
              onPress={() => setForm({ ...form, tag: tg })}
              style={[s.formChip, form.tag === tg && s.formChipActive]}
            >
              <Text style={[s.formChipText, form.tag === tg && s.formChipTextActive]}>{tg}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={layout.fieldLabel}>Item</Text>
        <TextInput style={layout.field} placeholder="e.g. Fresh Rice 25 kg" placeholderTextColor={colors.textMuted} value={form.title} onChangeText={(v) => setForm({ ...form, title: v })} />
        <Text style={layout.fieldLabel}>Price (₹)</Text>
        <TextInput style={layout.field} keyboardType="numeric" placeholderTextColor={colors.textMuted} value={form.price} onChangeText={(v) => setForm({ ...form, price: v })} />
        <Text style={layout.fieldLabel}>Location</Text>
        <TextInput style={layout.field} placeholderTextColor={colors.textMuted} value={form.place} onChangeText={(v) => setForm({ ...form, place: v })} />
        <Text style={layout.fieldLabel}>{t('sellerPhone')}</Text>
        <TextInput style={layout.field} keyboardType="phone-pad" placeholderTextColor={colors.textMuted} value={form.phone} onChangeText={(v) => setForm({ ...form, phone: v })} />
        <PrimaryButton label={t('submit')} icon="checkmark" color={colors.accent} onPress={post} />
      </BottomSheet>
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
  topRow: { flexDirection: 'row', alignItems: 'flex-start' },
  tagRow: { alignSelf: 'flex-start', backgroundColor: colors.accentLight, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.pill, marginBottom: 6 },
  tag: { ...font.tiny, color: colors.accent, fontWeight: '700' },
  title: { ...font.bodyBold, color: colors.text, fontSize: 16 },
  meta: { ...font.small, color: colors.textMuted, marginTop: 2 },
  price: { ...font.h3, color: colors.primary, fontSize: 20 },
  actions: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md, gap: spacing.sm },
  iconAction: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  contactBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    gap: 6,
  },
  contactText: { ...font.small, color: colors.white, fontWeight: '700' },
  formChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  formChipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  formChipText: { ...font.small, color: colors.text, fontWeight: '600' },
  formChipTextActive: { color: colors.white },
});
