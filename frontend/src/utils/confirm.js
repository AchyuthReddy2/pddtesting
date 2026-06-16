import { Alert, Platform } from 'react-native';

/** Cross-platform confirm — Alert.alert is unreliable on web */
export function confirmAction({ title, message, confirmLabel = 'OK', onConfirm }) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.confirm(`${title}\n\n${message}`)) {
      onConfirm();
    }
    return;
  }
  Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel' },
    { text: confirmLabel, style: 'destructive', onPress: onConfirm },
  ]);
}
