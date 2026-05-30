import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useApp } from '../context/AppContext';
import { StackScreenHeader, BottomSheet, layout } from '../components/ScreenLayout';
import { PrimaryButton } from '../components/UI';
import { colors, spacing, radius, font, shadow } from '../theme/theme';
import { callNumber } from '../utils/call';
import { shareLocationSMS } from '../utils/share';

export default function EmergencyScreen({ navigation }) {
  const { t, personalEmergencyContacts, addEmergencyContact, removeEmergencyContact, getEmergencyContacts } = useApp();
  const emergencyContacts = getEmergencyContacts();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [loc, setLoc] = useState(null);

  const shareLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Location access is required to share your coordinates.');
      return;
    }
    try {
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLoc(pos.coords);
      shareLocationSMS(pos.coords.latitude, pos.coords.longitude, 'Emergency — I need help at');
      Alert.alert('Location shared', 'An SMS with your location link has been opened.');
    } catch {
      Alert.alert('Error', 'Could not get your location. Try again.');
    }
  };

  const addContact = () => {
    if (!form.name.trim() || !form.phone.trim()) {
      Alert.alert('Missing info', 'Please enter name and phone.');
      return;
    }
    addEmergencyContact({ name: form.name.trim(), phone: form.phone.trim() });
    setForm({ name: '', phone: '' });
    setModal(false);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StackScreenHeader
        title={t('emergency')}
        subtitle="Tap to call · Share location"
        onBack={() => navigation.goBack()}
        accent={colors.danger}
      />

      <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        <View style={s.alertBanner}>
          <Ionicons name="alert-circle" size={28} color={colors.white} />
          <Text style={s.alertText}>Tap any service to call immediately. Stay calm and share your location.</Text>
        </View>

        <TouchableOpacity style={s.locBtn} onPress={shareLocation} activeOpacity={0.85}>
          <Ionicons name="location" size={22} color={colors.white} />
          <Text style={s.locText}>{t('shareLocation')}</Text>
        </TouchableOpacity>
        {loc ? (
          <Text style={s.coords}>
            Last location: {loc.latitude.toFixed(5)}, {loc.longitude.toFixed(5)}
          </Text>
        ) : null}

        <View style={s.grid}>
          {emergencyContacts.map((e) => (
            <TouchableOpacity
              key={e.id}
              style={[s.tile, shadow.card]}
              activeOpacity={0.85}
              onPress={() => callNumber(e.phone)}
            >
              <View style={[s.iconWrap, { backgroundColor: e.color }]}>
                <Ionicons name={e.icon} size={28} color={colors.white} />
              </View>
              <Text style={s.label}>{e.label}</Text>
              <Text style={s.phone}>{e.phone}</Text>
              <View style={[s.callBtn, { backgroundColor: e.color }]}>
                <Ionicons name="call" size={16} color={colors.white} />
                <Text style={s.callText}>{t('callNow')}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={s.personalHeader}>
          <Text style={s.personalTitle}>{t('emergencyContacts')}</Text>
          <TouchableOpacity onPress={() => setModal(true)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="add-circle" size={28} color={colors.primary} />
          </TouchableOpacity>
        </View>
        {personalEmergencyContacts.length === 0 ? (
          <Text style={s.emptyPersonal}>Add family or neighbour contacts for quick access.</Text>
        ) : (
          personalEmergencyContacts.map((c) => (
            <View key={c.id} style={s.personalRow}>
              <View style={[s.personalAccent, { backgroundColor: colors.primary }]} />
              <View style={{ flex: 1, padding: spacing.lg }}>
                <Text style={s.personalName}>{c.name}</Text>
                <Text style={s.personalPhone}>{c.phone}</Text>
              </View>
              <TouchableOpacity onPress={() => callNumber(c.phone)} style={s.personalCall}>
                <Ionicons name="call" size={20} color={colors.white} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeEmergencyContact(c.id)} style={s.trashBtn}>
                <Ionicons name="trash-outline" size={22} color={colors.danger} />
              </TouchableOpacity>
            </View>
          ))
        )}
        <View style={{ height: spacing.xl }} />
      </ScrollView>

      <BottomSheet visible={modal} onClose={() => setModal(false)} title={t('addContact')}>
        <Text style={layout.fieldLabel}>Name</Text>
        <TextInput
          style={layout.field}
          placeholder="Contact name"
          placeholderTextColor={colors.textMuted}
          value={form.name}
          onChangeText={(v) => setForm({ ...form, name: v })}
        />
        <Text style={layout.fieldLabel}>Phone</Text>
        <TextInput
          style={layout.field}
          keyboardType="phone-pad"
          placeholder="Phone number"
          placeholderTextColor={colors.textMuted}
          value={form.phone}
          onChangeText={(v) => setForm({ ...form, phone: v })}
        />
        <PrimaryButton label={t('save')} icon="checkmark" onPress={addContact} />
      </BottomSheet>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  body: { padding: spacing.lg, flexGrow: 1 },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.danger,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  alertText: { ...font.body, color: colors.white, flex: 1, marginLeft: spacing.md, lineHeight: 22 },
  locBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },
  locText: { ...font.bodyBold, color: colors.white, marginLeft: spacing.sm },
  coords: { ...font.tiny, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  label: { ...font.bodyBold, color: colors.text, fontSize: 16 },
  phone: { ...font.h3, color: colors.text, marginTop: 2, fontSize: 18 },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  callText: { ...font.small, color: colors.white, fontWeight: '700', marginLeft: 6 },
  personalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  personalTitle: { ...font.h3, color: colors.text },
  emptyPersonal: { ...font.body, color: colors.textMuted, marginBottom: spacing.xl },
  personalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  personalAccent: { width: 4, alignSelf: 'stretch' },
  personalName: { ...font.bodyBold, color: colors.text },
  personalPhone: { ...font.small, color: colors.textMuted, marginTop: 2 },
  personalCall: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  trashBtn: { paddingRight: spacing.lg },
});
