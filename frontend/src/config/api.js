/** Local API URL (Development) */
const DEV_API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:4000/api';
/** Production API on Render */
const PROD_API_URL = 'https://villageconnect-782o.onrender.com/api';
export const API_BASE_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;