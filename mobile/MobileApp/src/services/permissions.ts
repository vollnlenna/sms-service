import { Alert, PermissionsAndroid, Platform } from 'react-native';

export async function requestSmsPermissions(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }

  const results = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.SEND_SMS,
    PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
    PermissionsAndroid.PERMISSIONS.READ_SMS,
  ]);

  const ok =
    results[PermissionsAndroid.PERMISSIONS.SEND_SMS] ===
      PermissionsAndroid.RESULTS.GRANTED &&
    results[PermissionsAndroid.PERMISSIONS.RECEIVE_SMS] ===
      PermissionsAndroid.RESULTS.GRANTED &&
    results[PermissionsAndroid.PERMISSIONS.READ_SMS] ===
      PermissionsAndroid.RESULTS.GRANTED;

  if (!ok) {
    Alert.alert('Нет прав SMS', 'Для отправки/получения SMS нужны разрешения.');
  }
  return ok;
}
