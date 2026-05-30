import { Linking, Alert, Platform } from 'react-native';

// Opens the native dialer. Falls back to an alert if telephony is unavailable
// (e.g. web preview or tablet without SIM).
export function callNumber(phone) {
  const clean = String(phone).replace(/\s+/g, '');
  const url = `tel:${clean}`;
  Linking.canOpenURL(url)
    .then((supported) => {
      if (supported) return Linking.openURL(url);
      Alert.alert('Call', `Dial ${phone}`);
    })
    .catch(() => Alert.alert('Call', `Dial ${phone}`));
}
