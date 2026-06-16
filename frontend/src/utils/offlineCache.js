import AsyncStorage from '@react-native-async-storage/async-storage';

export const CACHE_KEY = '@villageconnect_data_cache_v1';

export async function loadCache() {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function saveCache(data) {
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ ...data, cachedAt: Date.now() }));
  } catch {
    // ignore
  }
}
