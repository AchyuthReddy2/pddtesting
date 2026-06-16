import { Linking, Platform } from 'react-native';

export function shareWhatsApp(message) {
  const encoded = encodeURIComponent(message);
  const url = Platform.select({
    ios: `whatsapp://send?text=${encoded}`,
    android: `whatsapp://send?text=${encoded}`,
    default: `https://wa.me/?text=${encoded}`,
  });
  Linking.openURL(url).catch(() => {
    Linking.openURL(`https://wa.me/?text=${encoded}`);
  });
}

export function shareSMS(message, phone) {
  const body = encodeURIComponent(message);
  const sep = Platform.OS === 'ios' ? '&' : '?';
  const num = phone ? phone.replace(/\D/g, '') : '';
  Linking.openURL(`sms:${num}${sep}body=${body}`);
}

export function shareLocationSMS(lat, lng, label) {
  const msg = `${label || 'My location'}: https://maps.google.com/?q=${lat},${lng}`;
  shareSMS(msg);
}
