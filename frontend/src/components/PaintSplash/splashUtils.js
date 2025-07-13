// JavaScript export const fetchSplashConfig = async () => {
  const res = await fetch('/api/splash-config');
  return await res.json();
};