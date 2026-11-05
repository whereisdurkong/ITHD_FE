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
  baseApi: import.meta.env.VITE_API_URL || 'http://localhost:5007/api',
  baseUrl: import.meta.env.VITE_APP_URL || 'http://localhost:3007'
};
export const drawerWidth = 280;
export default config;
