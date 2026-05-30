import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { StackScreenHeader, OfflineBanner, layout } from '../components/ScreenLayout';
import { colors, spacing, radius, font } from '../theme/theme';
export default function MandiPricesScreen({ navigation }) {
  const { t, offline, getMandiPrices } = useApp();
  const prices = getMandiPrices();

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StackScreenHeader
        title={t('mandiPrices')}
        subtitle={`${prices.length} crops · Updated today`}
        onBack={() => navigation.goBack()}
        accent={colors.gold}
      />
      {offline ? <OfflineBanner text={t('offlineBanner')} /> : null}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        <Text style={s.sub}>Daily crop prices at nearest mandi</Text>
        <View style={layout.listPad}>
          {prices.map((p) => (
            <View key={p.id} style={s.card}>
              <View style={[s.accent, { backgroundColor: colors.gold }]} />
              <View style={s.cardBody}>
                <View style={s.row}>
                  <View style={[s.iconWrap, { backgroundColor: colors.gold + '14' }]}>
                    <Ionicons name="nutrition" size={22} color={colors.gold} />
                  </View>
                  <View style={{ flex: 1, marginLeft: spacing.md }}>
                    <Text style={s.crop}>{p.crop}</Text>
                    <Text style={s.mandi}>{p.mandi}</Text>
                  </View>
                  <View style={s.priceCol}>
                    <Text style={s.price}>{p.price}</Text>
                    <View style={s.changeRow}>
                      <Ionicons
                        name={p.trend === 'up' ? 'trending-up' : p.trend === 'down' ? 'trending-down' : 'remove'}
                        size={14}
                        color={p.trend === 'up' ? colors.success : p.trend === 'down' ? colors.danger : colors.textMuted}
                      />
                      <Text style={[
                        s.change,
                        { color: p.trend === 'up' ? colors.success : p.trend === 'down' ? colors.danger : colors.textMuted },
                      ]}>
                        {p.change}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1 },
  sub: {
    ...font.body,
    color: colors.textMuted,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    lineHeight: 22,
  },
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
  row: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crop: { ...font.bodyBold, color: colors.text, fontSize: 17 },
  mandi: { ...font.small, color: colors.textMuted, marginTop: 2 },
  priceCol: { alignItems: 'flex-end' },
  price: { ...font.h3, color: colors.primary, fontSize: 20 },
  changeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  change: { ...font.small, fontWeight: '700', marginLeft: 4 },
});
