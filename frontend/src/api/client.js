import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

const TOKEN_KEY = '@villageconnect_token';
/** Render free tier may cold-start; allow extra time on first request */
const REQUEST_TIMEOUT_MS = 45000;

export { API_BASE_URL };

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
  if (token && !headers.Authorization) headers.Authorization = `Bearer ${token}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
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
      throw new Error('Server not responding. Check your internet connection and try again.');
    }
    if (e.message === 'Failed to fetch') {
      throw new Error('Cannot reach API server. Start it with: cd server && npm run dev');
    }
    throw e;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const api = {
  sendOtp: (email) => request('/auth/send-otp', { method: 'POST', body: { email } }),
  verifyOtp: (email, otp) => request('/auth/verify-otp', { method: 'POST', body: { email, otp } }),
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
