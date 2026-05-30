import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { StackScreenHeader } from '../components/ScreenLayout';
import { PrimaryButton } from '../components/UI';
import { colors, spacing, radius, font } from '../theme/theme';

const roles = ['Resident', 'Sarpanch'];

export default function EditProfileScreen({ navigation }) {
  const { t, user, updateUser } = useApp();
  const [name, setName] = useState(user?.name || '');
  const [village, setVillage] = useState(user?.village || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [role, setRole] = useState(user?.role || 'Resident');

  const save = () => {
    if (!name.trim() || !village.trim()) {
      Alert.alert(t('editProfile'), 'Name and village cannot be empty.');
      return;
    }
    updateUser({ name: name.trim(), village: village.trim(), phone, role });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <StackScreenHeader
          title={t('editProfile')}
          subtitle={user?.village || ''}
          onBack={() => navigation.goBack()}
        />

        <ScrollView contentContainerStyle={s.body} keyboardShouldPersistTaps="handled">
          <View style={s.avatar}>
            <Text style={s.avatarText}>{(name || 'V').charAt(0)}</Text>
          </View>

          <Text style={s.label}>{t('fullName')}</Text>
          <View style={s.field}>
            <Ionicons name="person-outline" size={20} color={colors.textMuted} />
            <TextInput style={s.input} value={name} onChangeText={setName} placeholderTextColor={colors.textMuted} />
          </View>

          <Text style={s.label}>{t('villageName')}</Text>
          <View style={s.field}>
            <Ionicons name="home-outline" size={20} color={colors.textMuted} />
            <TextInput style={s.input} value={village} onChangeText={setVillage} placeholderTextColor={colors.textMuted} />
          </View>

          <Text style={s.label}>{t('phoneNumber')}</Text>
          <View style={s.field}>
            <Ionicons name="call-outline" size={20} color={colors.textMuted} />
            <TextInput style={s.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" maxLength={10} placeholderTextColor={colors.textMuted} />
          </View>

          <Text style={s.label}>Role</Text>
          <View style={s.roleRow}>
            {roles.map((r) => (
              <TouchableOpacity
                key={r}
                style={[s.roleChip, role === r && s.roleChipActive]}
                onPress={() => setRole(r)}
              >
                <Text style={[s.roleText, role === r && { color: colors.white }]}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {role === 'Sarpanch' ? (
            <Text style={s.hint}>Sarpanch role enables posting panchayat announcements.</Text>
          ) : null}

          <PrimaryButton label={t('save')} icon="save" onPress={save} style={{ marginTop: spacing.xl }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  body: { backgroundColor: colors.bg, padding: spacing.xl, flexGrow: 1 },
  avatar: {
    width: 84, height: 84, borderRadius: radius.pill, backgroundColor: colors.gold,
    alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginVertical: spacing.lg,
  },
  avatarText: { ...font.h1, color: colors.white, fontSize: 36 },
  label: { ...font.bodyBold, color: colors.text, marginBottom: spacing.sm, marginTop: spacing.md },
  field: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: radius.md, paddingHorizontal: spacing.lg, height: 56,
    borderWidth: 1, borderColor: colors.border,
  },
  input: { flex: 1, ...font.body, color: colors.text, marginLeft: spacing.sm, fontSize: 17 },
  roleRow: { flexDirection: 'row', gap: spacing.sm },
  roleChip: {
    flex: 1, paddingVertical: spacing.md, alignItems: 'center', borderRadius: radius.md,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
  },
  roleChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  roleText: { ...font.bodyBold, color: colors.text },
  hint: { ...font.small, color: colors.textMuted, marginTop: spacing.sm, fontStyle: 'italic' },
});
