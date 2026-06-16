import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { api } from '../api/client';
import { PrimaryButton } from '../components/UI';
import { colors, spacing, radius, font } from '../theme/theme';
import { languageNames } from '../data/translations';
import { safeGoBack } from '../utils/navigation';
import { showAlert } from '../utils/alert';

export default function SignupScreen({ navigation, route }) {
  const { t, setSession, lang, setLang } = useApp();
  const presetEmail = route?.params?.email || '';
  const signupToken = route?.params?.signupToken;
  const [name, setName] = useState('');
  const [village, setVillage] = useState('');
  const [email] = useState(presetEmail);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const finish = async () => {
    setError('');
    if (!name.trim()) {
      setError('Please enter your full name.');
      showAlert(t('fullName'), 'Please enter your name.');
      return;
    }
    if (!village.trim()) {
      setError('Please enter your village name.');
      showAlert(t('villageName'), 'Please enter your village name.');
      return;
    }
    if (!email) {
      setError('Verify your email on the login screen first.');
      showAlert('OTP required', 'Verify your email on the login screen first.');
      navigation.replace('Login');
      return;
    }
    if (phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit phone number.');
      showAlert(t('phoneNumber'), 'Please enter your 10-digit phone number.');
      return;
    }
    if (!signupToken) {
      setError('Verify your email on the login screen first.');
      showAlert('OTP required', 'Verify your email on the login screen first.');
      navigation.replace('Login');
      return;
    }
    setLoading(true);
    try {
      const res = await api.signup(
        { name: name.trim(), village: village.trim(), lang, phone },
        signupToken
      );
      await setSession(res.token, res.user);
    } catch (e) {
      const msg = e.message || 'Could not create account';
      setError(msg);
      showAlert('Signup failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => safeGoBack(navigation)}>
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
            <TextInput
              style={s.input}
              placeholder="9876543210"
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onChangeText={(v) => { setPhone(v.replace(/\D/g, '')); setError(''); }}
            />
          </View>

          <Text style={s.label}>Email (verified)</Text>
          <View style={s.field}>
            <Ionicons name="mail-outline" size={20} color={colors.textMuted} />
            <TextInput
              style={s.input}
              value={email}
              editable={false}
              selectTextOnFocus={false}
              placeholderTextColor={colors.textMuted}
            />
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

          {error ? <Text style={s.error}>{error}</Text> : null}
          <PrimaryButton
            label={loading ? 'Creating account…' : t('continue')}
            icon="arrow-forward"
            onPress={finish}
            style={{ marginTop: spacing.xl }}
          />
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
  error: { ...font.small, color: '#c0392b', marginTop: spacing.lg, textAlign: 'center' },
});
