// pages/_app.js (Applies to all pages)
import PaintSplashEffect from '../components/PaintSplashEffect';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <PaintSplashEffect />
    </>
  );
}