import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { BottomSheet, layout } from '../components/ScreenLayout';
import { PrimaryButton } from '../components/UI';
import { colors, spacing, radius, font, useThemeSettings } from '../theme/theme';
import { languageNames } from '../data/translations';
import { callNumber } from '../utils/call';
import { confirmAction } from '../utils/confirm';

export default function ProfileScreen({ navigation }) {
  const {
    t, user, lang, setLang, offline, setOffline, notif, setNotif,
    grievances, joinedGroups, logout,
    fontScale, setFontScale, highContrast, setHighContrast,
    personalEmergencyContacts, addEmergencyContact, removeEmergencyContact,
  } = useApp();
  const theme = useThemeSettings(fontScale, highContrast);
  const safeUser = user || { name: 'Villager', village: 'My Village', role: 'Resident' };
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });

  const addContact = () => {
    if (!form.name.trim() || !form.phone.trim()) return;
    addEmergencyContact({ name: form.name.trim(), phone: form.phone.trim() });
    setForm({ name: '', phone: '' });
    setModal(false);
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: theme.colors.primary }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[s.header, { backgroundColor: theme.colors.primary }]}>
          <View style={s.avatar}>
            <Text style={[s.avatarText, theme.font.h1]}>{safeUser.name.charAt(0)}</Text>
          </View>
          <Text style={[s.name, theme.font.h2, { color: theme.colors.white }]}>{safeUser.name}</Text>
          <Text style={[s.sub, theme.font.body, { color: theme.colors.primaryLight }]}>
            {safeUser.village} • {safeUser.role}
          </Text>

          <TouchableOpacity style={s.editBtn} onPress={() => navigation.navigate('EditProfile')} activeOpacity={0.85}>
            <Ionicons name="create-outline" size={18} color={colors.white} />
            <Text style={s.editText}>{t('editProfile')}</Text>
          </TouchableOpacity>

          <View style={s.statsRow}>
            <View style={s.stat}>
              <Text style={[s.statNum, theme.font.h2]}>{grievances.length}</Text>
              <Text style={s.statLabel}>Grievances</Text>
            </View>
            <View style={s.divider} />
            <View style={s.stat}>
              <Text style={[s.statNum, theme.font.h2]}>{joinedGroups.length}</Text>
              <Text style={s.statLabel}>Groups</Text>
            </View>
          </View>
        </View>

        <View style={[s.body, { backgroundColor: theme.colors.bg }]}>
          <Text style={[s.section, theme.font.h3, { color: theme.colors.text }]}>{t('language')}</Text>
          <View style={[s.settingsCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            {Object.keys(languageNames).map((code, i, arr) => (
              <TouchableOpacity key={code} style={s.langRow} onPress={() => setLang(code)} activeOpacity={0.8}>
                <Text style={[s.langText, theme.font.bodyBold, { color: theme.colors.text }]}>
                  {languageNames[code]}
                </Text>
                {lang === code ? (
                  <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                ) : (
                  <Ionicons name="ellipse-outline" size={24} color={theme.colors.border} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[s.section, theme.font.h3, { color: theme.colors.text }]}>Settings</Text>
          <View style={[s.settingsCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, paddingHorizontal: spacing.md }]}>
            <View style={s.settingRow}>
              <View style={s.settingLeft}>
                <Ionicons name="cloud-offline" size={22} color={theme.colors.earth} />
                <Text style={[s.settingText, theme.font.bodyBold, { color: theme.colors.text }]}>
                  {t('offlineMode')}
                </Text>
              </View>
              <Switch
                value={offline}
                onValueChange={setOffline}
                trackColor={{ true: theme.colors.primary, false: theme.colors.border }}
                thumbColor={theme.colors.white}
              />
            </View>
            <View style={s.line} />
            <View style={s.settingRow}>
              <View style={s.settingLeft}>
                <Ionicons name="notifications" size={22} color={theme.colors.accent} />
                <Text style={[s.settingText, theme.font.bodyBold, { color: theme.colors.text }]}>
                  {t('notifications')}
                </Text>
              </View>
              <Switch
                value={notif}
                onValueChange={setNotif}
                trackColor={{ true: theme.colors.primary, false: theme.colors.border }}
                thumbColor={theme.colors.white}
              />
            </View>
            <View style={s.line} />
            <View style={s.settingRow}>
              <View style={s.settingLeft}>
                <Ionicons name="text" size={22} color={theme.colors.sky} />
                <Text style={[s.settingText, theme.font.bodyBold, { color: theme.colors.text }]}>
                  {t('largeText')}
                </Text>
              </View>
              <Switch
                value={fontScale > 1}
                onValueChange={(v) => setFontScale(v ? 1.2 : 1)}
                trackColor={{ true: theme.colors.primary, false: theme.colors.border }}
                thumbColor={theme.colors.white}
              />
            </View>
            <View style={s.line} />
            <View style={s.settingRow}>
              <View style={s.settingLeft}>
                <Ionicons name="contrast" size={22} color={theme.colors.text} />
                <Text style={[s.settingText, theme.font.bodyBold, { color: theme.colors.text }]}>
                  {t('highContrast')}
                </Text>
              </View>
              <Switch
                value={highContrast}
                onValueChange={setHighContrast}
                trackColor={{ true: theme.colors.primary, false: theme.colors.border }}
                thumbColor={theme.colors.white}
              />
            </View>
          </View>

          <View style={s.ecHeader}>
            <Text style={[s.section, theme.font.h3, { color: theme.colors.text, marginBottom: 0 }]}>
              {t('emergencyContacts')}
            </Text>
            <TouchableOpacity onPress={() => setModal(true)}>
              <Ionicons name="add-circle" size={26} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={[s.settingsCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            {personalEmergencyContacts.length === 0 ? (
              <Text style={[theme.font.body, { color: theme.colors.textMuted, padding: spacing.md }]}>
                No personal contacts added yet.
              </Text>
            ) : (
              personalEmergencyContacts.map((c) => (
                <View key={c.id} style={s.ecRow}>
                  <View style={[s.ecAccent, { backgroundColor: theme.colors.primary }]} />
                  <View style={{ flex: 1, paddingVertical: spacing.md }}>
                    <Text style={[theme.font.bodyBold, { color: theme.colors.text }]}>{c.name}</Text>
                    <Text style={[theme.font.small, { color: theme.colors.textMuted }]}>{c.phone}</Text>
                  </View>
                  <TouchableOpacity onPress={() => callNumber(c.phone)} style={s.ecCall}>
                    <Ionicons name="call" size={18} color={colors.white} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removeEmergencyContact(c.id)} style={{ paddingRight: spacing.md }}>
                    <Ionicons name="trash-outline" size={20} color={theme.colors.danger} />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>

          <TouchableOpacity
            style={s.logout}
            activeOpacity={0.85}
            onPress={() =>
              confirmAction({
                title: t('logout'),
                message: 'Are you sure you want to log out?',
                confirmLabel: t('logout'),
                onConfirm: () => logout(),
              })
            }
          >
            <Ionicons name="log-out-outline" size={22} color={theme.colors.danger} />
            <Text style={[s.logoutText, theme.font.bodyBold, { color: theme.colors.danger }]}>{t('logout')}</Text>
          </TouchableOpacity>

          <Text style={[s.version, theme.font.small, { color: theme.colors.textMuted }]}>
            VillageConnect v1.0.0
          </Text>
          <View style={{ height: spacing.xl }} />
        </View>
      </ScrollView>

      <BottomSheet visible={modal} onClose={() => setModal(false)} title={t('addContact')}>
        <Text style={layout.fieldLabel}>Name</Text>
        <TextInput
          style={layout.field}
          placeholder="Contact name"
          placeholderTextColor={theme.colors.textMuted}
          value={form.name}
          onChangeText={(v) => setForm({ ...form, name: v })}
        />
        <Text style={layout.fieldLabel}>Phone</Text>
        <TextInput
          style={layout.field}
          placeholder="Phone number"
          placeholderTextColor={theme.colors.textMuted}
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(v) => setForm({ ...form, phone: v })}
        />
        <PrimaryButton label={t('save')} icon="checkmark" onPress={addContact} />
      </BottomSheet>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.primary },
  header: {
    backgroundColor: colors.primary, alignItems: 'center',
    paddingTop: spacing.lg, paddingBottom: spacing.xl,
    borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl,
  },
  avatar: {
    width: 84, height: 84, borderRadius: radius.pill, backgroundColor: colors.gold,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md,
  },
  avatarText: { color: colors.white, fontSize: 36 },
  name: { color: colors.white },
  sub: { marginTop: 2 },
  editBtn: {
    flexDirection: 'row', alignItems: 'center', marginTop: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm, borderRadius: radius.pill,
  },
  editText: { ...font.small, color: colors.white, fontWeight: '700', marginLeft: 6 },
  statsRow: {
    flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: radius.md,
    paddingHorizontal: spacing.xl, paddingVertical: spacing.md,
  },
  stat: { alignItems: 'center', paddingHorizontal: spacing.xl },
  statNum: { color: colors.white },
  statLabel: { ...font.small, color: colors.primaryLight },
  divider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.25)' },
  body: { padding: spacing.lg, backgroundColor: colors.bg },
  settingsCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  section: { marginBottom: spacing.md, marginTop: spacing.md },
  langRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingVertical: spacing.md,
  },
  langText: {},
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.sm },
  settingLeft: { flexDirection: 'row', alignItems: 'center' },
  settingText: { marginLeft: spacing.md },
  line: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
  ecHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.md },
  ecRow: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.border },
  ecAccent: { width: 4, alignSelf: 'stretch' },
  ecCall: {
    width: 36, height: 36, borderRadius: radius.pill, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  logout: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.accentLight, borderRadius: radius.md,
    paddingVertical: spacing.lg, marginTop: spacing.xl,
  },
  logoutText: { marginLeft: spacing.sm },
  version: { textAlign: 'center', marginTop: spacing.lg },
});
