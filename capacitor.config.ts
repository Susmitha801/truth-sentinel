import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fakenewsshield.app',
  appName: 'Fake News Shield',
  webDir: '.output/public',
  server: {
    url: 'https://susmitha801.github.io/truth-sentinel/',
    cleartext: true
  }
};

export default config;
