import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, font, shadow } from '../theme/theme';

/** Tab screen header (Feed, Directory, Market, Help, Profile tabs) */
export function TabScreenHeader({ title, subtitle, icon, accent = colors.primary }) {
  return (
    <View style={[layout.header, { backgroundColor: accent }]}>
      <View style={{ flex: 1 }}>
        <Text style={layout.headerTitle}>{title}</Text>
        {subtitle ? <Text style={layout.headerSub}>{subtitle}</Text> : null}
      </View>
      {icon ? (
        <View style={layout.headerIcon}>
          <Ionicons name={icon} size={24} color={colors.white} />
        </View>
      ) : null}
    </View>
  );
}

/** Stack screen with back button */
export function StackScreenHeader({
  title,
  subtitle,
  onBack,
  rightIcon,
  onRightPress,
  accent = colors.primary,
}) {
  return (
    <View style={[layout.header, layout.stackHeader, { backgroundColor: accent }]}>
      <TouchableOpacity onPress={onBack} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
        <Ionicons name="arrow-back" size={24} color={colors.white} />
      </TouchableOpacity>
      <View style={layout.stackTitleWrap}>
        <Text style={layout.headerTitle} numberOfLines={1}>{title}</Text>
        {subtitle ? <Text style={layout.headerSub} numberOfLines={1}>{subtitle}</Text> : null}
      </View>
      {rightIcon ? (
        <TouchableOpacity onPress={onRightPress} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Ionicons name={rightIcon} size={24} color={colors.white} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }} />
      )}
    </View>
  );
}

export function OfflineBanner({ text }) {
  return (
    <View style={layout.offlineBar}>
      <Ionicons name="cloud-offline-outline" size={16} color={colors.earth} />
      <Text style={layout.offlineText}>{text}</Text>
    </View>
  );
}

export function FilterChips({ options, value, onChange, activeColor = colors.primary, showCount }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={layout.filterContent}
      style={layout.filterScroll}
    >
      {options.map((opt) => {
        const label = typeof opt === 'string' ? opt : opt.label;
        const key = typeof opt === 'string' ? opt : opt.key ?? opt.label;
        const count = typeof opt === 'object' ? opt.count : showCount?.[label];
        const active = value === key;
        return (
          <TouchableOpacity
            key={key}
            onPress={() => onChange(key)}
            style={[layout.chip, active && { backgroundColor: activeColor, borderColor: activeColor }]}
            activeOpacity={0.8}
          >
            <Text style={[layout.chipText, active && layout.chipTextActive]}>{label}</Text>
            {count != null ? (
              <View style={[layout.chipCount, active && layout.chipCountActive]}>
                <Text style={[layout.chipCountText, active && layout.chipCountTextActive]}>{count}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

export function SearchField({ value, onChangeText, placeholder, onClear }) {
  return (
    <View style={layout.searchWrap}>
      <View style={layout.search}>
        <Ionicons name="search-outline" size={20} color={colors.textMuted} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          style={layout.searchInput}
        />
        {value ? (
          <TouchableOpacity onPress={onClear || (() => onChangeText(''))}>
            <Ionicons name="close-circle" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

export function FabButton({ onPress, icon = 'add', color = colors.primary }) {
  return (
    <TouchableOpacity style={[layout.fab, { backgroundColor: color }, shadow.raised]} onPress={onPress} activeOpacity={0.9}>
      <Ionicons name={icon} size={28} color={colors.white} />
    </TouchableOpacity>
  );
}

export function BottomSheet({ visible, onClose, title, children }) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={layout.modalOverlay}>
        <TouchableOpacity style={layout.modalBackdrop} activeOpacity={1} onPress={onClose} />
        <View style={layout.modalSheet}>
          <View style={layout.modalHandle} />
          <View style={layout.modalHead}>
            <Text style={layout.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <Ionicons name="close" size={24} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
}

/** Card with left accent bar */
export function AccentCard({ accentColor, children, onPress, style }) {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper
      activeOpacity={0.85}
      onPress={onPress}
      style={[layout.accentCard, shadow.card, style]}
    >
      <View style={[layout.accentBar, { backgroundColor: accentColor }]} />
      <View style={layout.accentInner}>{children}</View>
    </Wrapper>
  );
}

export function SegmentedTabs({ tabs, active, onChange }) {
  return (
    <View style={layout.segmented}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[layout.segTab, active === tab.key && layout.segTabActive]}
          onPress={() => onChange(tab.key)}
          activeOpacity={0.85}
        >
          <Text style={[layout.segText, active === tab.key && layout.segTextActive]}>{tab.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export const layout = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  stackHeader: { justifyContent: 'space-between' },
  stackTitleWrap: { flex: 1, marginHorizontal: spacing.md, alignItems: 'center' },
  headerTitle: { ...font.h2, color: colors.white, fontSize: 22 },
  headerSub: { ...font.small, color: colors.primaryLight, marginTop: 2 },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  filterScroll: { flexGrow: 0, marginTop: spacing.lg },
  filterContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.lg,
    paddingRight: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  chipText: { ...font.small, color: colors.text, fontWeight: '600' },
  chipTextActive: { color: colors.white },
  chipCount: {
    marginLeft: spacing.sm,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  chipCountActive: { backgroundColor: 'rgba(255,255,255,0.25)' },
  chipCountText: { ...font.tiny, color: colors.textMuted, fontWeight: '700' },
  chipCountTextActive: { color: colors.white },
  searchWrap: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: { flex: 1, ...font.body, color: colors.text, marginLeft: spacing.sm },
  listPad: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xl },
  accentCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  accentBar: { width: 4 },
  accentInner: { flex: 1, padding: spacing.lg },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject },
  modalSheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    paddingTop: spacing.md,
    maxHeight: '90%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  modalHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: { ...font.h3, color: colors.text },
  fieldLabel: { ...font.small, color: colors.textMuted, fontWeight: '600', marginBottom: spacing.sm },
  field: {
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...font.body,
    color: colors.text,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  segmented: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  segTab: { flex: 1, paddingVertical: spacing.md, alignItems: 'center', borderRadius: radius.sm },
  segTabActive: { backgroundColor: colors.primary },
  segText: { ...font.small, color: colors.text, fontWeight: '700' },
  segTextActive: { color: colors.white },
});
