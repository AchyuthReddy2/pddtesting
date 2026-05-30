import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const TOKEN_KEY = '@villageconnect_token';
const REQUEST_TIMEOUT_MS = 12000;

/** Use localhost on web/simulator; set EXPO_PUBLIC_API_URL for device testing */
function getBaseUrl() {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, '');
  }
  if (Platform.OS === 'web') return 'http://localhost:4000/api';
  return 'http://localhost:4000/api';
}

export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function setToken(token) {
  if (token) await AsyncStorage.setItem(TOKEN_KEY, token);
  else await AsyncStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const token = await getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(`${getBaseUrl()}${path}`, {
      ...options,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.error || res.statusText || 'Request failed');
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  } catch (e) {
    if (e.name === 'AbortError') {
      throw new Error('Server not responding. Start the API with: cd server && npm run dev');
    }
    throw e;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const api = {
  sendOtp: (phone) => request('/auth/send-otp', { method: 'POST', body: { phone } }),
  verifyOtp: (phone, otp) => request('/auth/verify-otp', { method: 'POST', body: { phone, otp } }),
  signup: (body, signupToken) =>
    request('/auth/signup', {
      method: 'POST',
      body,
      headers: signupToken ? { Authorization: `Bearer ${signupToken}` } : {},
    }),
  bootstrap: () => request('/bootstrap'),
  patchMe: (body) => request('/users/me', { method: 'PATCH', body }),
  addEmergencyContact: (body) => request('/users/me/emergency-contacts', { method: 'POST', body }),
  removeEmergencyContact: (id) => request(`/users/me/emergency-contacts/${id}`, { method: 'DELETE' }),

  getAnnouncements: () => request('/announcements'),
  postAnnouncement: (body) => request('/announcements', { method: 'POST', body }),
  getDirectory: () => request('/directory'),
  getMarket: () => request('/market'),
  postMarket: (body) => request('/market', { method: 'POST', body }),
  getSchemes: () => request('/schemes'),
  getScheme: (id) => request(`/schemes/${id}`),
  getGroups: () => request('/groups'),
  getGroupThreads: (groupId) => request(`/groups/${groupId}/threads`),
  getThread: (id) => request(`/threads/${id}`),
  getThreadPosts: (threadId) => request(`/threads/${threadId}/posts`),
  postThreadReply: (threadId, text) =>
    request(`/threads/${threadId}/posts`, { method: 'POST', body: { text } }),
  markThreadRead: (threadId) => request(`/threads/${threadId}/read`, { method: 'POST' }),
  joinGroup: (groupId) => request(`/groups/${groupId}/join`, { method: 'POST' }),
  leaveGroup: (groupId) => request(`/groups/${groupId}/leave`, { method: 'POST' }),
  toggleSchemeRsvp: (schemeId) => request(`/schemes/${schemeId}/rsvp`, { method: 'POST' }),
  getGrievances: () => request('/grievances'),
  getVillageGrievances: () => request('/grievances/village'),
  updateGrievance: (id, body) => request(`/grievances/${id}`, { method: 'PATCH', body }),
  postGrievance: (body) => request('/grievances', { method: 'POST', body }),
  getNotifications: () => request('/notifications'),
  markAllRead: () => request('/notifications/read-all', { method: 'PATCH' }),
  getHelpBoard: () => request('/help-board'),
  postHelpBoard: (body) => request('/help-board', { method: 'POST', body }),
  getMandiPrices: () => request('/mandi-prices'),
  getCalendar: () => request('/calendar'),
  getEmergencyContacts: () => request('/emergency-contacts'),
};
