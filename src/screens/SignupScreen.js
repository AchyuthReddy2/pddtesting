import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { api } from '../api/client';
import { PrimaryButton } from '../components/UI';
import { colors, spacing, radius, font } from '../theme/theme';
import { languageNames } from '../data/translations';

export default function SignupScreen({ navigation, route }) {
  const { t, setSession, lang, setLang } = useApp();
  const presetPhone = route?.params?.phone || '';
  const signupToken = route?.params?.signupToken;
  const [name, setName] = useState('');
  const [village, setVillage] = useState('');
  const [phone, setPhone] = useState(presetPhone);
  const [loading, setLoading] = useState(false);

  const finish = async () => {
    if (!name.trim()) { Alert.alert(t('fullName'), 'Please enter your name.'); return; }
    if (!village.trim()) { Alert.alert(t('villageName'), 'Please enter your village name.'); return; }
    if (phone.replace(/\D/g, '').length < 10) {
      Alert.alert(t('phoneNumber'), 'Complete OTP login first with a valid phone number.');
      return;
    }
    if (!signupToken) {
      Alert.alert('OTP required', 'Verify your phone on the login screen first.');
      navigation.replace('Login');
      return;
    }
    setLoading(true);
    try {
      const res = await api.signup(
        { name: name.trim(), village: village.trim(), lang },
        signupToken
      );
      await setSession(res.token, res.user);
    } catch (e) {
      Alert.alert('Signup failed', e.message || 'Could not create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color={colors.white} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>{t('signup')}</Text>
          <View style={{ width: 26 }} />
        </View>

        <ScrollView contentContainerStyle={s.body} keyboardShouldPersistTaps="handled">
          <View style={s.avatar}>
            <Ionicons name="person" size={40} color={colors.white} />
          </View>

          <Text style={s.label}>{t('fullName')}</Text>
          <View style={s.field}>
            <Ionicons name="person-outline" size={20} color={colors.textMuted} />
            <TextInput style={s.input} placeholder="e.g. Suresh Kumar" placeholderTextColor={colors.textMuted} value={name} onChangeText={setName} />
          </View>

          <Text style={s.label}>{t('villageName')}</Text>
          <View style={s.field}>
            <Ionicons name="home-outline" size={20} color={colors.textMuted} />
            <TextInput style={s.input} placeholder="e.g. Rampur" placeholderTextColor={colors.textMuted} value={village} onChangeText={setVillage} />
          </View>

          <Text style={s.label}>{t('phoneNumber')}</Text>
          <View style={s.field}>
            <Ionicons name="call-outline" size={20} color={colors.textMuted} />
            <TextInput style={s.input} placeholder="98765 43210" placeholderTextColor={colors.textMuted} keyboardType="phone-pad" maxLength={10} value={phone} onChangeText={setPhone} />
          </View>

          <Text style={s.label}>{t('language')}</Text>
          <View style={s.langRow}>
            {Object.keys(languageNames).map((code) => (
              <TouchableOpacity
                key={code}
                style={[s.langChip, lang === code && s.langChipActive]}
                onPress={() => setLang(code)}
              >
                <Text style={[s.langText, lang === code && { color: colors.white }]}>{languageNames[code]}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <PrimaryButton label={t('continue')} icon="arrow-forward" onPress={finish} style={{ marginTop: spacing.xl }} />
          <View style={{ height: spacing.xl }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.primary },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.lg,
  },
  headerTitle: { ...font.h2, color: colors.white },
  body: { backgroundColor: colors.bg, padding: spacing.xl, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, flexGrow: 1 },
  avatar: {
    width: 84, height: 84, borderRadius: radius.pill, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginVertical: spacing.lg,
  },
  label: { ...font.bodyBold, color: colors.text, marginBottom: spacing.sm, marginTop: spacing.md },
  field: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: radius.md, paddingHorizontal: spacing.lg, height: 56,
    borderWidth: 1, borderColor: colors.border,
  },
  input: { flex: 1, ...font.body, color: colors.text, marginLeft: spacing.sm, fontSize: 17 },
  langRow: { flexDirection: 'row', marginTop: spacing.sm },
  langChip: {
    flex: 1, paddingVertical: spacing.md, alignItems: 'center', borderRadius: radius.md,
    backgroundColor: colors.card, marginHorizontal: 4, borderWidth: 1, borderColor: colors.border,
  },
  langChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  langText: { ...font.small, color: colors.text, fontWeight: '700' },
});
