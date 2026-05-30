import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { api } from '../api/client';
import { PrimaryButton } from '../components/UI';
import { colors, spacing, radius, font } from '../theme/theme';

export default function LoginScreen({ navigation }) {
  const { t, setSession } = useApp();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [stage, setStage] = useState('phone');
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (phone.replace(/\D/g, '').length < 10) {
      Alert.alert(t('phoneNumber'), 'Please enter a valid 10-digit phone number.');
      return;
    }
    setLoading(true);
    try {
      await api.sendOtp(phone);
      setStage('otp');
      Alert.alert(t('sendOtp'), 'OTP sent. Use 1234 for demo login.');
    } catch (e) {
      Alert.alert('Error', e.message || 'Could not reach server. Is the API running?');
    } finally {
      setLoading(false);
    }
  };

  const verify = async () => {
    setLoading(true);
    try {
      const res = await api.verifyOtp(phone, otp);
      if (res.needsSignup) {
        navigation.replace('Signup', { phone, signupToken: res.token });
      } else {
        await setSession(res.token, res.user);
      }
    } catch (e) {
      Alert.alert(t('enterOtp'), e.message || 'Verification failed');
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
                <Text style={s.label}>{t('phoneNumber')}</Text>
                <View style={s.inputRow}>
                  <Text style={s.code}>+91</Text>
                  <TextInput
                    style={s.input}
                    placeholder="98765 43210"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={phone}
                    onChangeText={setPhone}
                  />
                </View>
                <PrimaryButton label={t('sendOtp')} icon="send" onPress={sendOtp} style={{ marginTop: spacing.lg }} />
              </>
            ) : (
              <>
                <Text style={s.label}>{t('enterOtp')}</Text>
                <Text style={s.otpHint}>Sent to +91 {phone}</Text>
                <View style={s.inputRow}>
                  <Ionicons name="keypad" size={20} color={colors.textMuted} />
                  <TextInput
                    style={[s.input, { letterSpacing: 8, marginLeft: spacing.sm }]}
                    placeholder="1234"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="number-pad"
                    maxLength={4}
                    value={otp}
                    onChangeText={setOtp}
                  />
                </View>
                <PrimaryButton label={t('verify')} icon="checkmark" onPress={verify} style={{ marginTop: spacing.lg }} />
                <TouchableOpacity onPress={() => setStage('phone')} style={s.changeBtn}>
                  <Text style={s.changeText}>Change number</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <View style={s.footerRow}>
            <Text style={s.footerText}>{t('noAccount')} </Text>
            <TouchableOpacity onPress={() => navigation.replace('Signup', { phone: '' })}>
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
});
