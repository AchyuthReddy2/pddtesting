import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { translations } from '../data/translations';
import { buildCacheSnapshot } from '../data/constants';
import { api, setToken, getToken } from '../api/client';
import { loadCache, saveCache } from '../utils/offlineCache';

const AppContext = createContext(null);
const STORE_KEY = '@villageconnect_prefs_v4';

function detectLang() {
  const locale = Localization.getLocales?.()?.[0]?.languageCode
    || Localization.locale?.split?.('-')?.[0]
    || 'en';
  return ['en', 'hi', 'te'].includes(locale) ? locale : 'en';
}

function applyUserToState(user, setters) {
  if (!user) return;
  setters.setUser({
    id: user.id,
    name: user.name,
    village: user.village,
    phone: user.phone,
    role: user.role,
  });
  if (user.lang) setters.setLang(user.lang);
  if (typeof user.offline === 'boolean') setters.setOffline(user.offline);
  if (typeof user.notif === 'boolean') setters.setNotif(user.notif);
  if (typeof user.onboarded === 'boolean') setters.setOnboarded(user.onboarded);
  if (typeof user.fontScale === 'number') setters.setFontScale(user.fontScale);
  if (typeof user.highContrast === 'boolean') setters.setHighContrast(user.highContrast);
  if (Array.isArray(user.joinedGroups)) setters.setJoinedGroups(user.joinedGroups);
  if (Array.isArray(user.schemeRSVPs)) setters.setSchemeRSVPs(user.schemeRSVPs);
  if (Array.isArray(user.readThreads)) setters.setReadThreads(user.readThreads);
  if (Array.isArray(user.personalEmergencyContacts)) {
    setters.setPersonalEmergencyContacts(user.personalEmergencyContacts);
  }
}

export function AppProvider({ children }) {
  const [lang, setLang] = useState('en');
  const [offline, setOffline] = useState(false);
  const [notif, setNotif] = useState(true);
  const [user, setUser] = useState(null);
  const [onboarded, setOnboarded] = useState(false);
  const [grievances, setGrievances] = useState([]);
  const [villageGrievances, setVillageGrievances] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [marketItems, setMarketItems] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [directory, setDirectory] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [groups, setGroups] = useState([]);
  const [forumPosts, setForumPosts] = useState({});
  const [forumThreads, setForumThreads] = useState([]);
  const [schemeRSVPs, setSchemeRSVPs] = useState([]);
  const [readThreads, setReadThreads] = useState([]);
  const [helpBoard, setHelpBoard] = useState([]);
  const [mandiPrices, setMandiPrices] = useState([]);
  const [panchayatCalendar, setPanchayatCalendar] = useState([]);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [personalEmergencyContacts, setPersonalEmergencyContacts] = useState([]);
  const [fontScale, setFontScale] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const [dataCache, setDataCache] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [langAutoSet, setLangAutoSet] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const applyBootstrap = useCallback((data) => {
    if (data.announcements) setAnnouncements(data.announcements);
    if (data.directory) setDirectory(data.directory);
    if (data.marketItems) setMarketItems(data.marketItems);
    if (data.schemes) setSchemes(data.schemes);
    if (data.groups) setGroups(data.groups);
    if (data.mandiPrices) setMandiPrices(data.mandiPrices);
    if (data.panchayatCalendar) setPanchayatCalendar(data.panchayatCalendar);
    if (data.helpBoard) setHelpBoard(data.helpBoard);
    if (data.emergencyContacts) setEmergencyContacts(data.emergencyContacts);
    if (data.grievances) setGrievances(data.grievances);
    if (data.villageGrievances) setVillageGrievances(data.villageGrievances);
    if (data.notifications) setNotifications(data.notifications);
    if (data.forumPosts) setForumPosts(data.forumPosts);
    if (data.forumThreads) setForumThreads(data.forumThreads);
    if (data.user) {
      applyUserToState(data.user, {
        setUser,
        setLang,
        setOffline,
        setNotif,
        setOnboarded,
        setFontScale,
        setHighContrast,
        setJoinedGroups,
        setSchemeRSVPs,
        setReadThreads,
        setPersonalEmergencyContacts,
      });
    }
  }, []);

  const bootstrapInFlight = useRef(false);

  const persistOfflineCache = useCallback(async (snapshot) => {
    await saveCache(snapshot);
    setDataCache(snapshot);
  }, []);

  const refreshBootstrap = useCallback(async () => {
    const token = await getToken();
    if (!token || bootstrapInFlight.current) return;
    bootstrapInFlight.current = true;
    setRefreshing(true);
    setApiError(null);
    try {
      const data = await api.bootstrap();
      applyBootstrap(data);
      const snapshot = buildCacheSnapshot(data);
      await persistOfflineCache(snapshot);
    } catch (e) {
      setApiError(e.message || 'Could not reach server');
    } finally {
      bootstrapInFlight.current = false;
      setRefreshing(false);
    }
  }, [applyBootstrap, persistOfflineCache]);

  const loadPublicData = useCallback(async () => {
    try {
      const results = await Promise.allSettled([
        api.getAnnouncements(),
        api.getDirectory(),
        api.getMarket(),
        api.getSchemes(),
        api.getGroups(),
        api.getMandiPrices(),
        api.getCalendar(),
        api.getHelpBoard(),
        api.getEmergencyContacts(),
      ]);
      const pick = (i) => (results[i].status === 'fulfilled' ? results[i].value : null);
      if (pick(0)) setAnnouncements(pick(0));
      if (pick(1)) setDirectory(pick(1));
      if (pick(2)) setMarketItems(pick(2));
      if (pick(3)) setSchemes(pick(3));
      if (pick(4)) setGroups(pick(4));
      if (pick(5)) setMandiPrices(pick(5));
      if (pick(6)) setPanchayatCalendar(pick(6));
      if (pick(7)) setHelpBoard(pick(7));
      if (pick(8)) setEmergencyContacts(pick(8));
    } catch {
      // use AsyncStorage cache when API unavailable
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORE_KEY);
        const cache = await loadCache();
        if (cache) setDataCache(cache);

        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.lang) setLang(parsed.lang);
          else if (!parsed.langAutoSet) {
            setLang(detectLang());
            setLangAutoSet(true);
          }
          if (typeof parsed.offline === 'boolean') setOffline(parsed.offline);
          if (typeof parsed.notif === 'boolean') setNotif(parsed.notif);
          if (typeof parsed.onboarded === 'boolean') setOnboarded(parsed.onboarded);
          if (typeof parsed.fontScale === 'number') setFontScale(parsed.fontScale);
          if (typeof parsed.highContrast === 'boolean') setHighContrast(parsed.highContrast);
          if (typeof parsed.langAutoSet === 'boolean') setLangAutoSet(parsed.langAutoSet);
        } else {
          setLang(detectLang());
          setLangAutoSet(true);
        }

        const token = await getToken();
        if (token) {
          await refreshBootstrap();
        } else {
          await loadPublicData();
        }
      } catch {
        // ignore
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(
      STORE_KEY,
      JSON.stringify({ lang, offline, notif, onboarded, fontScale, highContrast, langAutoSet })
    ).catch(() => {});
  }, [lang, offline, notif, onboarded, fontScale, highContrast, langAutoSet, loaded]);

  // Debounced offline cache — must NOT depend on dataCache (was causing infinite write loop)
  useEffect(() => {
    if (!loaded) return;
    const snapshot = buildCacheSnapshot({
      announcements,
      directory,
      marketItems,
      schemes,
      mandiPrices,
      panchayatCalendar,
      helpBoard,
    });
    const timer = setTimeout(() => {
      persistOfflineCache(snapshot);
    }, 400);
    return () => clearTimeout(timer);
  }, [
    loaded,
    announcements,
    directory,
    marketItems,
    schemes,
    mandiPrices,
    panchayatCalendar,
    helpBoard,
    persistOfflineCache,
  ]);

  const t = (key) => translations[lang]?.[key] ?? translations.en[key] ?? key;

  const setSession = async (token, userData) => {
    await setToken(token);
    applyUserToState(userData, {
      setUser,
      setLang,
      setOffline,
      setNotif,
      setOnboarded,
      setFontScale,
      setHighContrast,
      setJoinedGroups,
      setSchemeRSVPs,
      setReadThreads,
      setPersonalEmergencyContacts,
    });
    await refreshBootstrap();
  };

  const login = () => {
    /* legacy — use setSession from SignupScreen */
  };

  const logout = useCallback(async () => {
    await setToken(null);
    setUser(null);
    setGrievances([]);
    setVillageGrievances([]);
    setJoinedGroups([]);
    setNotifications([]);
    setSchemeRSVPs([]);
    setForumPosts({});
    setReadThreads([]);
    setPersonalEmergencyContacts([]);
    loadPublicData().catch(() => {});
  }, [loadPublicData]);

  const completeOnboarding = () => {
    setOnboarded(true);
  };

  const updateUser = async (patch) => {
    setUser((u) => ({ ...u, ...patch }));
    try {
      const { user: updated } = await api.patchMe(patch);
      applyUserToState(updated, {
        setUser,
        setLang,
        setOffline,
        setNotif,
        setOnboarded,
        setFontScale,
        setHighContrast,
        setJoinedGroups,
        setSchemeRSVPs,
        setReadThreads,
        setPersonalEmergencyContacts,
      });
    } catch {
      // keep local
    }
  };

  const addGrievance = async (category, description, extras = {}) => {
    const item = await api.postGrievance({
      category,
      description,
      photo: extras.photo || null,
      location: extras.location || null,
    });
    setGrievances((prev) => [item, ...prev]);
    if (user?.role === 'Sarpanch') {
      fetchVillageGrievances().catch(() => {});
    }
    return item;
  };

  const fetchVillageGrievances = useCallback(async () => {
    if (user?.role !== 'Sarpanch') return [];
    const list = await api.getVillageGrievances();
    setVillageGrievances(list);
    return list;
  }, [user?.role]);

  const updateGrievance = async (id, patch) => {
    const updated = await api.updateGrievance(id, patch);
    setVillageGrievances((prev) => prev.map((g) => (g.id === id ? updated : g)));
    return updated;
  };

  const addMarketItem = async (item) => {
    const created = await api.postMarket(item);
    setMarketItems((prev) => [created, ...prev]);
    return created;
  };

  const addAnnouncement = async (ann) => {
    const created = await api.postAnnouncement(ann);
    setAnnouncements((prev) => [created, ...prev]);
    return created;
  };

  const toggleGroup = async (id) => {
    const joined = joinedGroups.includes(id);
    const { user: u } = joined ? await api.leaveGroup(id) : await api.joinGroup(id);
    setJoinedGroups(u.joinedGroups);
    if (joined) {
      setForumThreads((prev) => prev.filter((t) => t.groupId !== id));
    } else {
      fetchGroupThreads(id).catch(() => {});
    }
  };

  const toggleSchemeRSVP = async (schemeId) => {
    const { user: u } = await api.toggleSchemeRsvp(schemeId);
    setSchemeRSVPs(u.schemeRSVPs);
  };

  const addForumReply = async (threadId, text, author) => {
    const post = await api.postThreadReply(threadId, text);
    setForumPosts((prev) => ({
      ...prev,
      [threadId]: [...(prev[threadId] || []), post],
    }));
    setReadThreads((prev) => prev.filter((id) => id !== threadId));
    return post;
  };

  const markThreadRead = async (threadId) => {
    setReadThreads((prev) => (prev.includes(threadId) ? prev : [...prev, threadId]));
    try {
      const { user: u } = await api.markThreadRead(threadId);
      setReadThreads(u.readThreads);
    } catch {
      // local mark ok
    }
  };

  const fetchGroupThreads = async (groupId) => {
    const threads = await api.getGroupThreads(groupId);
    setForumThreads((prev) => {
      const rest = prev.filter((t) => t.groupId !== groupId);
      return [...rest, ...threads];
    });
    return threads;
  };

  const fetchThreadPosts = async (threadId) => {
    const posts = await api.getThreadPosts(threadId);
    setForumPosts((prev) => ({ ...prev, [threadId]: posts }));
    return posts;
  };

  const addHelpBoardPost = async (post) => {
    const created = await api.postHelpBoard(post);
    setHelpBoard((prev) => [created, ...prev]);
    return created;
  };

  const addEmergencyContact = async (contact) => {
    const { user: u } = await api.addEmergencyContact(contact);
    setPersonalEmergencyContacts(u.personalEmergencyContacts);
  };

  const removeEmergencyContact = async (id) => {
    const { user: u } = await api.removeEmergencyContact(id);
    setPersonalEmergencyContacts(u.personalEmergencyContacts);
  };

  const markAllRead = async () => {
    const list = await api.markAllRead();
    setNotifications(list);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const unreadForumCount = useMemo(() => {
    const joinedThreadIds = forumThreads
      .filter((thread) => joinedGroups.includes(thread.groupId))
      .map((thread) => thread.id)
      .filter((tid) => (forumPosts[tid]?.length || 0) > 0);
    return joinedThreadIds.filter((id) => !readThreads.includes(id)).length;
  }, [forumPosts, forumThreads, joinedGroups, readThreads]);

  const getAnnouncements = useCallback(() => {
    if (offline && dataCache?.announcements) return dataCache.announcements;
    return announcements;
  }, [offline, dataCache, announcements]);

  const getDirectory = useCallback(() => {
    if (offline && dataCache?.directory) return dataCache.directory;
    return directory;
  }, [offline, dataCache, directory]);

  const getMarketItems = useCallback(() => {
    if (offline && dataCache?.marketItems) return dataCache.marketItems;
    return marketItems;
  }, [offline, dataCache, marketItems]);

  const getHelpBoard = useCallback(() => {
    if (offline && dataCache?.helpBoard) return dataCache.helpBoard;
    return helpBoard;
  }, [offline, dataCache, helpBoard]);

  const getSchemes = useCallback(() => {
    if (offline && dataCache?.schemes) return dataCache.schemes;
    return schemes;
  }, [offline, dataCache, schemes]);

  const getMandiPrices = useCallback(() => {
    if (offline && dataCache?.mandiPrices) return dataCache.mandiPrices;
    return mandiPrices;
  }, [offline, dataCache, mandiPrices]);

  const getPanchayatCalendar = useCallback(() => {
    if (offline && dataCache?.panchayatCalendar) return dataCache.panchayatCalendar;
    return panchayatCalendar;
  }, [offline, dataCache, panchayatCalendar]);

  const getEmergencyContacts = useCallback(() => emergencyContacts, [emergencyContacts]);

  const getGroups = useCallback(() => groups, [groups]);

  const getForumThreadsForGroup = useCallback(
    (groupId) => forumThreads.filter((t) => t.groupId === groupId),
    [forumThreads]
  );

  const handleSetOffline = (value) => {
    setOffline(value);
    if (user) api.patchMe({ offline: value }).catch(() => {});
  };

  const handleSetLang = (code) => {
    setLang(code);
    if (user) api.patchMe({ lang: code }).catch(() => {});
  };

  const handleSetNotif = (value) => {
    setNotif(value);
    if (user) api.patchMe({ notif: value }).catch(() => {});
  };

  const handleSetFontScale = (value) => {
    setFontScale(value);
    if (user) api.patchMe({ fontScale: value }).catch(() => {});
  };

  const handleSetHighContrast = (value) => {
    setHighContrast(value);
    if (user) api.patchMe({ highContrast: value }).catch(() => {});
  };

  const contextValue = useMemo(
    () => ({
      lang, setLang: handleSetLang, t,
      offline, setOffline: handleSetOffline,
      notif, setNotif: handleSetNotif,
      user, login, logout, updateUser, setSession,
      onboarded, completeOnboarding,
      grievances, addGrievance, villageGrievances, fetchVillageGrievances, updateGrievance,
      joinedGroups, toggleGroup,
      notifications, markAllRead, unreadCount,
      marketItems, addMarketItem, getMarketItems,
      announcements, addAnnouncement, getAnnouncements,
      directory, getDirectory,
      schemes, getSchemes, schemeRSVPs, toggleSchemeRSVP,
      groups, getGroups,
      forumPosts, forumThreads, addForumReply, markThreadRead, unreadForumCount,
      fetchGroupThreads, fetchThreadPosts, getForumThreadsForGroup,
      helpBoard, addHelpBoardPost, getHelpBoard,
      personalEmergencyContacts, addEmergencyContact, removeEmergencyContact,
      mandiPrices, getMandiPrices,
      panchayatCalendar, getPanchayatCalendar,
      emergencyContacts, getEmergencyContacts,
      fontScale, setFontScale: handleSetFontScale,
      highContrast, setHighContrast: handleSetHighContrast,
      dataCache,
      loaded,
      apiError,
      refreshing,
      refreshBootstrap,
    }),
    [
      lang, offline, notif, user, onboarded, grievances, villageGrievances, joinedGroups, notifications,
      marketItems, announcements, directory, schemes, groups, forumPosts, forumThreads,
      schemeRSVPs, readThreads, helpBoard, personalEmergencyContacts, mandiPrices,
      panchayatCalendar, emergencyContacts, fontScale, highContrast, dataCache, loaded,
      apiError, refreshing,
      unreadCount, unreadForumCount,
      getAnnouncements, getDirectory, getMarketItems, getHelpBoard, getSchemes,
      getMandiPrices, getPanchayatCalendar, getEmergencyContacts, getGroups, getForumThreadsForGroup,
      logout, setSession, updateUser, refreshBootstrap, addGrievance, fetchVillageGrievances, updateGrievance,
      addAnnouncement, markAllRead, addForumReply, markThreadRead, fetchGroupThreads, fetchThreadPosts,
      addHelpBoardPost, addEmergencyContact, removeEmergencyContact, completeOnboarding, login,
    ]
  );

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
