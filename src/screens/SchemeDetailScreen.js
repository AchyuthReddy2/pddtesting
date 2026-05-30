import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { StackScreenHeader, layout } from '../components/ScreenLayout';
import { PrimaryButton } from '../components/UI';
import { colors, spacing, radius, font } from '../theme/theme';
import { shareWhatsApp } from '../utils/share';

export default function SchemeDetailScreen({ navigation, route }) {
  const { t, schemeRSVPs, toggleSchemeRSVP, getSchemes } = useApp();
  const scheme = getSchemes().find((s) => s.id === route.params?.schemeId);

  if (!scheme) {
    return (
      <SafeAreaView style={s.safe}>
        <Text style={{ padding: spacing.lg }}>Scheme not found.</Text>
      </SafeAreaView>
    );
  }

  const isScheme = scheme.type === 'Scheme';
  const color = isScheme ? colors.gold : colors.danger;
  const registered = schemeRSVPs.includes(scheme.id);

  const rsvp = async () => {
    try {
      await toggleSchemeRSVP(scheme.id);
      Alert.alert(
        registered ? 'Interest removed' : 'Registered!',
        registered ? 'You have removed your registration.' : 'You will receive reminders about this event.'
      );
    } catch (e) {
      Alert.alert('Error', e.message || 'Could not update registration');
    }
  };

  const share = () => {
    shareWhatsApp(`${scheme.title}\n${scheme.fullDetail || scheme.detail}\nDeadline: ${scheme.deadline}`);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StackScreenHeader
        title={t('details')}
        subtitle={scheme.type}
        onBack={() => navigation.goBack()}
        rightIcon="logo-whatsapp"
        onRightPress={share}
        accent={color}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        <View style={layout.listPad}>
          <View style={s.heroCard}>
            <View style={[s.accent, { backgroundColor: color }]} />
            <View style={s.heroBody}>
              <View style={[s.iconWrap, { backgroundColor: color + '14' }]}>
                <Ionicons name={isScheme ? 'ribbon' : 'medkit'} size={28} color={color} />
              </View>
              <Text style={s.title}>{scheme.title}</Text>
              <Text style={s.detail}>{scheme.fullDetail || scheme.detail}</Text>
              <View style={s.deadline}>
                <Ionicons name="calendar-outline" size={18} color={colors.textMuted} />
                <Text style={s.deadlineText}>{scheme.deadline}</Text>
              </View>
            </View>
          </View>

          {scheme.eligibility ? (
            <View style={s.sectionCard}>
              <Text style={s.section}>{t('eligibility')}</Text>
              <Text style={s.listItem}>{scheme.eligibility}</Text>
            </View>
          ) : null}

          {scheme.documents?.length ? (
            <View style={s.sectionCard}>
              <Text style={s.section}>{t('documents')}</Text>
              {scheme.documents.map((doc) => (
                <View key={doc} style={s.docRow}>
                  <Ionicons name="document-text-outline" size={18} color={colors.primary} />
                  <Text style={s.listItem}>{doc}</Text>
                </View>
              ))}
            </View>
          ) : null}

          <PrimaryButton
            label={registered ? t('registered') : t('registerInterest')}
            icon={registered ? 'checkmark-circle' : 'calendar'}
            color={registered ? colors.success : colors.primary}
            onPress={rsvp}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1 },
  heroCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  accent: { width: 4 },
  heroBody: { flex: 1, padding: spacing.lg },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: { ...font.h3, color: colors.text },
  detail: { ...font.body, color: colors.textMuted, marginTop: spacing.md, lineHeight: 24 },
  deadline: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg, gap: 6 },
  deadlineText: { ...font.bodyBold, color: colors.text },
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  section: { ...font.bodyBold, color: colors.text, marginBottom: spacing.sm },
  listItem: { ...font.body, color: colors.textMuted, marginLeft: spacing.sm, lineHeight: 22 },
  docRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm, gap: 6 },
});
