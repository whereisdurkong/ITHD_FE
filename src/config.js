export const DASHBOARD_PATH = '/dashboard';

const config = {
  fontFamily: `'Roboto', sans-serif`,
  borderRadius: 8,
  defaultPath: '/dashboard',
  fontFamily: `'Roboto', sans-serif`,
  i18n: 'en',
  miniDrawer: false,
  container: true,
  mode: 'light',
  presetColor: 'default',
  baseApi: import.meta.env.VITE_API_URL || 'https://ithd-mw.onrender.com/api',
  baseUrl: import.meta.env.VITE_APP_URL || 'https://ithd-mw.onrender.com/'
};
export const drawerWidth = 280;
export default config;
