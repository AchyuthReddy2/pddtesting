import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { showAlert } from '../utils/alert';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { api } from '../api/client';
import { PrimaryButton } from '../components/UI';
import { colors, spacing, radius, font } from '../theme/theme';

export default function LoginScreen({ navigation }) {
  const { t, setSession } = useApp();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [stage, setStage] = useState('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendOtp = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    setError('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      const msg = 'Please enter a valid email address.';
      setError(msg);
      showAlert('Email', msg);
      return;
    }
    setLoading(true);
    try {
      await api.sendOtp(normalizedEmail);
      setStage('otp');
      showAlert(t('sendOtp'), 'OTP sent to your email.');
    } catch (e) {
      const msg = e.message || 'Could not reach server. Is the API running?';
      setError(msg);
      showAlert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const verify = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    setLoading(true);
    try {
      const res = await api.verifyOtp(normalizedEmail, otp);
      if (res.needsSignup) {
        navigation.replace('Signup', { email: normalizedEmail, signupToken: res.token });
      } else {
        await setSession(res.token, res.user);
      }
    } catch (e) {
      showAlert(t('enterOtp'), e.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <View style={s.logoCircle}>
            <Ionicons name="leaf" size={42} color={colors.white} />
          </View>
          <Text style={s.title}>{t('appName')}</Text>
          <Text style={s.sub}>{t('tagline')}</Text>

          <View style={s.card}>
            {stage === 'phone' ? (
              <>
                <Text style={s.label}>Email</Text>
                <View style={s.inputRow}>
                  <Ionicons name="mail-outline" size={20} color={colors.textMuted} />
                  <TextInput
                    style={s.input}
                    placeholder="you@example.com"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
                {error ? <Text style={s.error}>{error}</Text> : null}
                <PrimaryButton label={loading ? 'Sending…' : t('sendOtp')} icon="send" onPress={sendOtp} style={{ marginTop: spacing.lg }} />
              </>
            ) : (
              <>
                <Text style={s.label}>{t('enterOtp')}</Text>
                <Text style={s.otpHint}>Sent to {email}</Text>
                <View style={s.inputRow}>
                  <Ionicons name="keypad" size={20} color={colors.textMuted} />
                  <TextInput
                    style={[s.input, { letterSpacing: 6, marginLeft: spacing.sm }]}
                    placeholder="123456"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="number-pad"
                    maxLength={6}
                    value={otp}
                    onChangeText={setOtp}
                  />
                </View>
                <PrimaryButton label={t('verify')} icon="checkmark" onPress={verify} style={{ marginTop: spacing.lg }} />
                <TouchableOpacity onPress={() => setStage('phone')} style={s.changeBtn} disabled={loading}>
                  <Text style={s.changeText}>Change email</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <View style={s.footerRow}>
            <Text style={s.footerText}>{t('noAccount')} </Text>
            <TouchableOpacity onPress={() => navigation.replace('Signup', { email: '' })}>
              <Text style={s.footerLink}>{t('signup')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.primary },
  scroll: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  logoCircle: {
    width: 88, height: 88, borderRadius: radius.pill, backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)',
  },
  title: { ...font.h1, color: colors.white },
  sub: { ...font.body, color: colors.primaryLight, marginBottom: spacing.xl },
  card: {
    width: '100%', backgroundColor: colors.bg, borderRadius: radius.lg, padding: spacing.xl,
  },
  label: { ...font.bodyBold, color: colors.text, marginBottom: spacing.md },
  otpHint: { ...font.small, color: colors.textMuted, marginBottom: spacing.md },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: radius.md, paddingHorizontal: spacing.lg, height: 56,
    borderWidth: 1, borderColor: colors.border,
  },
  code: { ...font.bodyBold, color: colors.text, marginRight: spacing.sm },
  input: { flex: 1, ...font.body, color: colors.text, fontSize: 18 },
  changeBtn: { alignItems: 'center', marginTop: spacing.lg },
  changeText: { ...font.bodyBold, color: colors.accent },
  footerRow: { flexDirection: 'row', marginTop: spacing.xl },
  footerText: { ...font.body, color: colors.primaryLight },
  footerLink: { ...font.bodyBold, color: colors.gold },
  error: { ...font.small, color: '#c0392b', marginTop: spacing.md, textAlign: 'center' },
});
