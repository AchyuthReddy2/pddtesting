import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors, spacing, radius, font, shadow } from '../theme/theme';
import { promoCards } from '../data/promos';
import PromoCarousel from '../components/PromoCarousel';

const primaryServices = [
  { key: 'Feed', label: 'feed', icon: 'megaphone-outline', color: colors.primary },
  { key: 'Directory', label: 'directory', icon: 'people-outline', color: colors.sky },
  { key: 'Market', label: 'market', icon: 'storefront-outline', color: colors.accent },
  { key: 'Help', label: 'help', icon: 'document-text-outline', color: colors.earth },
];

const exploreLinks = [
  { key: 'Schemes', label: 'schemes', icon: 'ribbon-outline', color: colors.gold },
  { key: 'Groups', label: 'groups', icon: 'chatbubbles-outline', color: colors.success, badgeKey: 'forum' },
  { key: 'MandiPrices', label: 'mandiPrices', icon: 'stats-chart-outline', color: colors.gold },
  { key: 'HelpBoard', label: 'helpBoard', icon: 'hand-left-outline', color: colors.sky },
  { key: 'PanchayatCalendar', label: 'calendar', icon: 'calendar-outline', color: colors.primary },
];

function SectionHeader({ title, onSeeAll, seeAllLabel = 'View all' }) {
  return (
    <View style={s.sectionHeader}>
      <Text style={s.sectionTitle}>{title}</Text>
      {onSeeAll ? (
        <TouchableOpacity onPress={onSeeAll} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={s.sectionLink}>{seeAllLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

function ListRow({ icon, iconColor, title, subtitle, onPress, badge }) {
  return (
    <TouchableOpacity style={s.listRow} onPress={onPress} activeOpacity={0.7}>
      <View style={[s.listIcon, { backgroundColor: iconColor + '14' }]}>
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <View style={s.listContent}>
        <Text style={s.listTitle} numberOfLines={1}>{title}</Text>
        {subtitle ? <Text style={s.listSub} numberOfLines={1}>{subtitle}</Text> : null}
      </View>
      {badge > 0 ? (
        <View style={s.listBadge}>
          <Text style={s.listBadgeText}>{badge}</Text>
        </View>
      ) : null}
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }) {
  const { t, user, unreadCount, offline, unreadForumCount, grievances, getAnnouncements, getMandiPrices, getPanchayatCalendar } = useApp();
  const announcements = getAnnouncements();
  const mandiPrices = getMandiPrices();
  const panchayatCalendar = getPanchayatCalendar();
  const latestNotice = announcements[0];
  const nextEvent = panchayatCalendar[0];
  const firstName = user?.name?.split(' ')[0] || 'Villager';

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
        style={s.scrollView}
      >
        {/* Header */}
        <View style={s.header}>
          <View style={s.headerTop}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>{firstName.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={s.headerInfo}>
              <Text style={s.greet}>{t('welcome')}, {firstName}</Text>
              <View style={s.metaRow}>
                <Ionicons name="location-outline" size={14} color={colors.primaryLight} />
                <Text style={s.village}>{user.village}</Text>
                <View style={s.rolePill}>
                  <Text style={s.roleText}>{user.role}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={s.iconBtn}
              onPress={() => navigation.navigate('Notifications')}
              activeOpacity={0.8}
            >
              <Ionicons name="notifications-outline" size={22} color={colors.white} />
              {unreadCount > 0 ? (
                <View style={s.notifDot}>
                  <Text style={s.notifDotText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                </View>
              ) : null}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={s.sosStrip}
            onPress={() => navigation.navigate('Emergency')}
            activeOpacity={0.9}
          >
            <View style={s.sosLeft}>
              <View style={s.sosIconWrap}>
                <Ionicons name="shield" size={20} color={colors.white} />
              </View>
              <View>
                <Text style={s.sosTitle}>{t('emergency')}</Text>
                <Text style={s.sosSub}>Ambulance, police, fire — one tap</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.8)" />
          </TouchableOpacity>
        </View>

        {offline ? (
          <View style={s.offlineBar}>
            <Ionicons name="cloud-offline-outline" size={16} color={colors.earth} />
            <Text style={s.offlineText}>{t('offlineBanner')}</Text>
          </View>
        ) : null}

        <View style={s.content}>
          {/* Summary stats */}
          <View style={s.statsRow}>
            <View style={s.statCard}>
              <Text style={s.statValue}>{grievances.length}</Text>
              <Text style={s.statLabel}>Grievances</Text>
            </View>
            <View style={s.statSep} />
            <View style={s.statCard}>
              <Text style={s.statValue}>{unreadCount}</Text>
              <Text style={s.statLabel}>Alerts</Text>
            </View>
            <View style={s.statSep} />
            <View style={s.statCard}>
              <Text style={s.statValue}>{mandiPrices.length}</Text>
              <Text style={s.statLabel}>Mandi rates</Text>
            </View>
          </View>

          <SectionHeader title={t('featured')} />
          <PromoCarousel
            promos={promoCards}
            onPress={(promo) => navigation.navigate(promo.route)}
          />

          {/* Primary services */}
          <SectionHeader title={t('quickActions')} />
          <View style={s.serviceGrid}>
            {primaryServices.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={[s.serviceCard, shadow.card]}
                onPress={() => navigation.navigate(item.key)}
                activeOpacity={0.85}
              >
                <View style={[s.serviceIcon, { backgroundColor: item.color + '12' }]}>
                  <Ionicons name={item.icon} size={24} color={item.color} />
                </View>
                <Text style={s.serviceLabel}>{t(item.label)}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Latest notice highlight */}
          {latestNotice ? (
            <>
              <SectionHeader
                title={t('announcements')}
                onSeeAll={() => navigation.navigate('Feed')}
              />
              <TouchableOpacity
                style={[s.highlightCard, shadow.card]}
                onPress={() => navigation.navigate('Feed')}
                activeOpacity={0.85}
              >
                <View style={s.highlightTop}>
                  <View style={[s.catTag, { backgroundColor: latestNotice.color + '18' }]}>
                    <Text style={[s.catTagText, { color: latestNotice.color }]}>
                      {latestNotice.category}
                    </Text>
                  </View>
                  <Text style={s.highlightTime}>{latestNotice.time}</Text>
                </View>
                <Text style={s.highlightTitle} numberOfLines={2}>{latestNotice.title}</Text>
                <Text style={s.highlightMeta} numberOfLines={1}>
                  {latestNotice.author}
                </Text>
              </TouchableOpacity>
            </>
          ) : null}

          {/* Mandi snapshot */}
          <SectionHeader
            title={t('mandiPrices')}
            onSeeAll={() => navigation.navigate('MandiPrices')}
          />
          <View style={[s.tableCard, shadow.card]}>
            {mandiPrices.slice(0, 4).map((p, i) => (
              <TouchableOpacity
                key={p.id}
                style={[s.tableRow, i < 3 && s.tableRowBorder]}
                onPress={() => navigation.navigate('MandiPrices')}
                activeOpacity={0.7}
              >
                <Text style={s.tableCrop}>{p.crop}</Text>
                <Text style={s.tablePrice}>{p.price}</Text>
                <Text
                  style={[
                    s.tableChange,
                    { color: p.trend === 'up' ? colors.success : p.trend === 'down' ? colors.danger : colors.textMuted },
                  ]}
                >
                  {p.change}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Explore more */}
          <SectionHeader title="Explore" />
          <View style={[s.listCard, shadow.card]}>
            {exploreLinks.map((item, i) => (
              <View key={item.key}>
                <ListRow
                  icon={item.icon}
                  iconColor={item.color}
                  title={t(item.label)}
                  onPress={() => navigation.navigate(item.key)}
                  badge={item.badgeKey === 'forum' ? unreadForumCount : 0}
                />
                {i < exploreLinks.length - 1 ? <View style={s.listDivider} /> : null}
              </View>
            ))}
          </View>

          {/* Upcoming event */}
          {nextEvent ? (
            <>
              <SectionHeader
                title={t('calendar')}
                onSeeAll={() => navigation.navigate('PanchayatCalendar')}
              />
              <TouchableOpacity
                style={[s.eventCard, shadow.card]}
                onPress={() => navigation.navigate('PanchayatCalendar')}
                activeOpacity={0.85}
              >
                <View style={s.eventDate}>
                  <Ionicons name="calendar" size={20} color={colors.primary} />
                </View>
                <View style={s.eventBody}>
                  <Text style={s.eventTitle}>{nextEvent.title}</Text>
                  <Text style={s.eventMeta}>{nextEvent.date} · {nextEvent.time}</Text>
                  <Text style={s.eventPlace}>{nextEvent.place}</Text>
                </View>
              </TouchableOpacity>
            </>
          ) : null}

          <View style={{ height: spacing.xxl }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scrollView: { flex: 1 },
  scroll: { flexGrow: 1 },

  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  avatarText: { fontSize: 20, fontWeight: '700', color: colors.white },
  headerInfo: { flex: 1, marginLeft: spacing.md },
  greet: { ...font.h3, color: colors.white, fontSize: 20 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, flexWrap: 'wrap', gap: 6 },
  village: { ...font.small, color: colors.primaryLight, marginLeft: 2 },
  rolePill: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  roleText: { ...font.tiny, color: colors.white },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  notifDotText: { fontSize: 9, fontWeight: '800', color: colors.white },

  sosStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    backgroundColor: colors.danger,
    borderRadius: radius.md,
    padding: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  sosLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  sosIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  sosTitle: { ...font.bodyBold, color: colors.white, fontSize: 15 },
  sosSub: { ...font.tiny, color: 'rgba(255,255,255,0.85)', marginTop: 2 },

  offlineBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentLight,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  offlineText: { ...font.small, color: colors.earth, fontWeight: '600' },

  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  statCard: { flex: 1, alignItems: 'center' },
  statSep: { width: 1, backgroundColor: colors.border, alignSelf: 'stretch', marginVertical: spacing.sm },
  statValue: { ...font.h2, color: colors.primary, fontSize: 22 },
  statLabel: { ...font.tiny, color: colors.textMuted, marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.4 },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  sectionTitle: { ...font.bodyBold, color: colors.text, fontSize: 17, letterSpacing: -0.2 },
  sectionLink: { ...font.small, color: colors.primary, fontWeight: '600' },

  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  serviceCard: {
    width: '47%',
    flexGrow: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  serviceLabel: {
    ...font.bodyBold,
    color: colors.text,
    fontSize: 15,
    textAlign: 'center',
  },

  highlightCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  highlightTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  catTag: { paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radius.pill },
  catTagText: { ...font.tiny, fontWeight: '700' },
  highlightTime: { ...font.tiny, color: colors.textMuted },
  highlightTitle: { ...font.bodyBold, color: colors.text, fontSize: 17, lineHeight: 24 },
  highlightMeta: { ...font.small, color: colors.textMuted, marginTop: spacing.sm },

  tableCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  tableRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  tableCrop: { ...font.bodyBold, color: colors.text, flex: 1, fontSize: 15 },
  tablePrice: { ...font.body, color: colors.text, fontWeight: '600', marginRight: spacing.lg },
  tableChange: { ...font.small, fontWeight: '700', minWidth: 40, textAlign: 'right' },

  listCard: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  listIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: { flex: 1, marginLeft: spacing.md },
  listTitle: { ...font.bodyBold, color: colors.text, fontSize: 15 },
  listSub: { ...font.small, color: colors.textMuted, marginTop: 2 },
  listBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    paddingHorizontal: 5,
  },
  listBadgeText: { fontSize: 10, fontWeight: '800', color: colors.white },
  listDivider: { height: 1, backgroundColor: colors.border, marginLeft: 56 + spacing.lg },

  eventCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  eventDate: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventBody: { flex: 1, marginLeft: spacing.md },
  eventTitle: { ...font.bodyBold, color: colors.text, fontSize: 16 },
  eventMeta: { ...font.small, color: colors.primary, fontWeight: '600', marginTop: 4 },
  eventPlace: { ...font.small, color: colors.textMuted, marginTop: 2 },
});
