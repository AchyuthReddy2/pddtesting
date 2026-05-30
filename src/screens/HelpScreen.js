import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useApp } from '../context/AppContext';
import {
  TabScreenHeader,
  SegmentedTabs,
  FilterChips,
  BottomSheet,
  layout,
} from '../components/ScreenLayout';
import { PrimaryButton, EmptyState } from '../components/UI';
import { colors, spacing, radius, font } from '../theme/theme';
import { grievanceCategories } from '../data/constants';
import { callNumber } from '../utils/call';

const statusMeta = {
  pending: { color: colors.warning, icon: 'time' },
  inProgress: { color: colors.info, icon: 'sync' },
  resolved: { color: colors.success, icon: 'checkmark-circle' },
};

const statusFilters = ['All', 'pending', 'inProgress', 'resolved'];

function GrievanceCard({ g, t, showReporter, children }) {
  const m = statusMeta[g.status] || statusMeta.pending;
  return (
    <View style={s.card}>
      <View style={[s.accent, { backgroundColor: m.color }]} />
      <View style={s.cardBody}>
        <View style={s.gRow}>
          <Text style={s.gCat}>{g.category}</Text>
          <View style={[s.badge, { backgroundColor: m.color + '22' }]}>
            <Ionicons name={m.icon} size={14} color={m.color} />
            <Text style={[s.badgeText, { color: m.color }]}>{t(g.status)}</Text>
          </View>
        </View>
        {g.ticketId ? (
          <Text style={s.ticket}>{t('ticketId')}: {g.ticketId}</Text>
        ) : null}
        {showReporter && g.reporterName ? (
          <View style={s.reporterRow}>
            <Ionicons name="person-outline" size={14} color={colors.textMuted} />
            <Text style={s.reporterText}>
              {t('reportedBy')}: {g.reporterName}
              {g.reporterVillage ? ` · ${g.reporterVillage}` : ''}
            </Text>
          </View>
        ) : null}
        <Text style={s.gDesc}>{g.description}</Text>
        {g.photo ? <Image source={{ uri: g.photo }} style={s.preview} /> : null}
        {g.location ? (
          <Text style={s.locText}>📍 {g.location.label || g.location}</Text>
        ) : null}
        {g.response ? (
          <View style={s.responseBox}>
            <Text style={s.responseLabel}>Official response:</Text>
            <Text style={s.responseText}>{g.response}</Text>
          </View>
        ) : null}
        <Text style={s.gDate}>Filed on {g.date}</Text>
        {children}
      </View>
    </View>
  );
}

export default function HelpScreen() {
  const {
    t, user, grievances, addGrievance,
    villageGrievances, fetchVillageGrievances, updateGrievance,
  } = useApp();
  const isSarpanch = user?.role === 'Sarpanch';
  const [tab, setTab] = useState(isSarpanch ? 'manage' : 'raise');
  const [statusFilter, setStatusFilter] = useState('All');
  const [cat, setCat] = useState(null);
  const [desc, setDesc] = useState('');
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [sheet, setSheet] = useState(false);
  const [selected, setSelected] = useState(null);
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    if (isSarpanch) fetchVillageGrievances().catch(() => {});
  }, [isSarpanch, fetchVillageGrievances]);

  const pendingCount = villageGrievances.filter((g) => g.status === 'pending').length;

  const filteredVillage = useMemo(() => {
    if (statusFilter === 'All') return villageGrievances;
    return villageGrievances.filter((g) => g.status === statusFilter);
  }, [villageGrievances, statusFilter]);

  const chipOptions = useMemo(
    () =>
      statusFilters.map((key) => ({
        label: key === 'All' ? 'All' : t(key),
        key,
        count:
          key === 'All'
            ? villageGrievances.length
            : villageGrievances.filter((g) => g.status === key).length,
      })),
    [villageGrievances, t]
  );

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow photo access to attach evidence.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const attachLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLocation({ label: user?.village || 'Village location' });
      return;
    }
    try {
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        label: `${user?.village || 'Village'} (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`,
      });
    } catch {
      setLocation({ label: user?.village || 'Village location' });
    }
  };

  const submit = async () => {
    if (!cat) { Alert.alert('Select a category', 'Please choose what the grievance is about.'); return; }
    if (!desc.trim()) { Alert.alert('Add details', 'Please describe the problem.'); return; }
    try {
      const item = await addGrievance(cat, desc.trim(), { photo, location });
      setCat(null);
      setDesc('');
      setPhoto(null);
      setLocation(null);
      setTab(isSarpanch ? 'manage' : 'track');
      Alert.alert('Submitted', `Your grievance has been recorded. Ticket: ${item.ticketId}`);
    } catch (e) {
      Alert.alert('Error', e.message || 'Could not submit grievance');
    }
  };

  const openUpdate = (g) => {
    setSelected(g);
    setResponseText(g.response || '');
    setSheet(true);
  };

  const saveUpdate = async (status) => {
    if (!selected) return;
    try {
      await updateGrievance(selected.id, {
        status,
        response: responseText.trim() || undefined,
      });
      setSheet(false);
      setSelected(null);
    } catch (e) {
      Alert.alert('Error', e.message || 'Could not update complaint');
    }
  };

  const tabs = isSarpanch
    ? [
        { key: 'manage', label: t('villageComplaints') },
        { key: 'raise', label: t('raiseGrievance') },
      ]
    : [
        { key: 'raise', label: t('raiseGrievance') },
        { key: 'track', label: t('trackStatus') },
      ];

  const headerSub = isSarpanch
    ? `${pendingCount} ${t('pendingReview')} · ${villageGrievances.length} total`
    : `${grievances.length} tickets · Raise & track`;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <TabScreenHeader
        title={t('help')}
        subtitle={headerSub}
        icon="document-text"
        accent={isSarpanch ? colors.primary : colors.sky}
      />

      <SegmentedTabs tabs={tabs} active={tab} onChange={setTab} />

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        {tab === 'manage' && isSarpanch ? (
          <>
            <FilterChips
              options={chipOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              activeColor={colors.primary}
            />
            <View style={layout.listPad}>
              {filteredVillage.length === 0 ? (
                <EmptyState icon="document-outline" text="No village complaints yet." />
              ) : (
                filteredVillage.map((g) => (
                  <GrievanceCard key={g.id} g={g} t={t} showReporter>
                    <View style={s.adminActions}>
                      {g.reporterPhone ? (
                        <TouchableOpacity
                          style={s.callBtn}
                          onPress={() => callNumber(g.reporterPhone)}
                        >
                          <Ionicons name="call" size={16} color={colors.white} />
                          <Text style={s.callBtnText}>{t('callNow')}</Text>
                        </TouchableOpacity>
                      ) : null}
                      <TouchableOpacity
                        style={[s.updateBtn, { borderColor: colors.primary }]}
                        onPress={() => openUpdate(g)}
                      >
                        <Ionicons name="create-outline" size={16} color={colors.primary} />
                        <Text style={s.updateBtnText}>{t('updateComplaint')}</Text>
                      </TouchableOpacity>
                    </View>
                  </GrievanceCard>
                ))
              )}
            </View>
          </>
        ) : null}

        {tab === 'raise' ? (
          <>
            <Text style={layout.fieldLabel}>{t('category')}</Text>
            <View style={s.catGrid}>
              {grievanceCategories.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={[s.catTile, cat === c.label && s.catTileActive]}
                  onPress={() => setCat(c.label)}
                  activeOpacity={0.85}
                >
                  <Ionicons name={c.icon} size={24} color={cat === c.label ? colors.white : colors.sky} />
                  <Text style={[s.catText, cat === c.label && { color: colors.white }]}>{c.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={layout.fieldLabel}>{t('description')}</Text>
            <TextInput
              style={s.textarea}
              placeholder="Describe the issue with as much detail as possible…"
              placeholderTextColor={colors.textMuted}
              multiline value={desc} onChangeText={setDesc}
            />

            <View style={s.attachRow}>
              <TouchableOpacity style={s.attachBtn} onPress={pickPhoto} activeOpacity={0.85}>
                <Ionicons name="camera" size={20} color={colors.sky} />
                <Text style={s.attachText}>{t('attachPhoto')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.attachBtn} onPress={attachLocation} activeOpacity={0.85}>
                <Ionicons name="location" size={20} color={colors.sky} />
                <Text style={s.attachText}>{t('shareLocation')}</Text>
              </TouchableOpacity>
            </View>
            {photo ? <Image source={{ uri: photo }} style={s.preview} /> : null}
            {location ? <Text style={s.locText}>📍 {location.label}</Text> : null}

            <PrimaryButton label={t('submit')} icon="send" color={colors.sky} onPress={submit} style={{ marginTop: spacing.lg }} />
          </>
        ) : null}

        {tab === 'track' && !isSarpanch ? (
          <View style={layout.listPad}>
            {grievances.length === 0 ? (
              <EmptyState icon="document-outline" text="No grievances yet." />
            ) : (
              grievances.map((g) => (
                <GrievanceCard key={g.id} g={g} t={t} showReporter={false} />
              ))
            )}
          </View>
        ) : null}

        <View style={{ height: spacing.xl }} />
      </ScrollView>

      <BottomSheet
        visible={sheet}
        onClose={() => setSheet(false)}
        title={t('updateComplaint')}
      >
        {selected ? (
          <>
            <Text style={s.sheetMeta}>{selected.ticketId} · {selected.category}</Text>
            <Text style={layout.fieldLabel}>{t('officialResponse')}</Text>
            <TextInput
              style={[layout.field, { minHeight: 80, textAlignVertical: 'top' }]}
              multiline
              placeholder="Message to the resident…"
              placeholderTextColor={colors.textMuted}
              value={responseText}
              onChangeText={setResponseText}
            />
            <PrimaryButton
              label={t('markInProgress')}
              icon="sync"
              color={colors.info}
              onPress={() => saveUpdate('inProgress')}
            />
            <View style={{ height: spacing.sm }} />
            <PrimaryButton
              label={t('markResolved')}
              icon="checkmark-circle"
              color={colors.success}
              onPress={() => saveUpdate('resolved')}
            />
          </>
        ) : null}
      </BottomSheet>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  body: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: spacing.md },
  catTile: {
    width: '31%', backgroundColor: colors.card, borderRadius: radius.md,
    paddingVertical: spacing.lg, alignItems: 'center', marginBottom: spacing.md,
    borderWidth: 1, borderColor: colors.border,
  },
  catTileActive: { backgroundColor: colors.sky, borderColor: colors.sky },
  catText: { ...font.small, color: colors.text, fontWeight: '600', marginTop: 6, textAlign: 'center' },
  textarea: {
    backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.lg,
    minHeight: 120, textAlignVertical: 'top', ...font.body, color: colors.text,
    borderWidth: 1, borderColor: colors.border,
  },
  attachRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  attachBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.primaryLight, paddingVertical: spacing.md, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border,
  },
  attachText: { ...font.small, color: colors.sky, fontWeight: '700', marginLeft: 6 },
  preview: { width: '100%', height: 140, borderRadius: radius.md, marginTop: spacing.md },
  locText: { ...font.small, color: colors.textMuted, marginTop: spacing.sm },
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
  gRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  gCat: { ...font.bodyBold, color: colors.text, fontSize: 17 },
  ticket: { ...font.tiny, color: colors.sky, marginTop: 4, fontWeight: '700' },
  reporterRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 },
  reporterText: { ...font.small, color: colors.textMuted, flex: 1 },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radius.pill },
  badgeText: { ...font.tiny, marginLeft: 4 },
  gDesc: { ...font.body, color: colors.textMuted, marginTop: spacing.sm, lineHeight: 22 },
  responseBox: {
    backgroundColor: colors.primaryLight, borderRadius: radius.sm,
    padding: spacing.md, marginTop: spacing.md,
  },
  responseLabel: { ...font.tiny, color: colors.primary, fontWeight: '700' },
  responseText: { ...font.small, color: colors.text, marginTop: 4 },
  gDate: { ...font.small, color: colors.textMuted, marginTop: spacing.sm },
  adminActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, flexWrap: 'wrap' },
  callBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  callBtnText: { ...font.small, color: colors.white, fontWeight: '700' },
  updateBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    borderWidth: 2, paddingVertical: spacing.sm, borderRadius: radius.md,
  },
  updateBtnText: { ...font.small, color: colors.primary, fontWeight: '700' },
  sheetMeta: { ...font.bodyBold, color: colors.text, marginBottom: spacing.md },
});
