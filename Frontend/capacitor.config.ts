import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'tareas-frontend',
  webDir: 'dist',
  server: {
    cleartext: true,  // Permite el uso de HTTP en lugar de HTTPS
    androidScheme: 'http'  // Asegurar que se use HTTP en Android
  }
};

export default config;
