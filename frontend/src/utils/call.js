import { Linking, Alert, Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';

// Opens the native dialer. Falls back to an alert if telephony is unavailable
// (e.g. web preview or tablet without SIM).
function normalizePhone(phone) {
  const value = String(phone || '').trim();
  if (!value) return '';
  const hasPlus = value.startsWith('+');
  const digits = value.replace(/\D/g, '');
  return hasPlus ? `+${digits}` : digits;
}

export async function callNumber(phone) {
  const dialable = normalizePhone(phone);
  if (!dialable) {
    Alert.alert('Call', 'Invalid phone number.');
    return;
  }

  const primaryUrl = Platform.OS === 'ios' ? `telprompt:${dialable}` : `tel:${dialable}`;
  const fallbackUrl = `tel:${dialable}`;
  const smsUrl = `sms:${dialable}`;
  const whatsappUrl = `https://wa.me/${dialable.replace(/^\+/, '')}`;

  try {
    // Attempt to open primary url directly (telprompt on iOS / tel on Android)
    await Linking.openURL(primaryUrl);
    return;
  } catch (e) {
    try {
      // Fallback to opening tel: directly
      await Linking.openURL(fallbackUrl);
      return;
    } catch (err) {
      // Direct dialing not supported or failed (e.g. running in web browser without telephony)
      console.warn('Could not launch native dialer directly:', err);
    }
  }

  Alert.alert('Could not open dialer', `Use another option for ${dialable}.`, [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Copy Number',
      onPress: async () => {
        try {
          await Clipboard.setStringAsync(dialable);
          Alert.alert('Copied', `${dialable} copied to clipboard.`);
        } catch {
          Alert.alert('Copy failed', `Please copy manually: ${dialable}`);
        }
      },
    },
    {
      text: 'Try SMS',
      onPress: async () => {
        try {
          const supported = await Linking.canOpenURL(smsUrl);
          if (supported) await Linking.openURL(smsUrl);
        } catch {
          // ignore fallback errors
        }
      },
    },
    {
      text: 'WhatsApp',
      onPress: async () => {
        try {
          await Linking.openURL(whatsappUrl);
        } catch {
          // ignore fallback errors
        }
      },
    },
  ]);
}
