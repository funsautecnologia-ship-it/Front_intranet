import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';
import { pt } from 'vuetify/locale'
import 'vuetify/styles';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

export default createVuetify({
  locale: {
    locale: 'pt',
    fallback: 'en',
    messages: { pt },
  },
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
          background: '#FFFFFF',
          surface: '#FFFFFF',
          onSurface: '#222222', // texto principal mais escuro
          onPrimary: '#FFFFFF',
          onSecondary: '#FFFFFF',
        },
      },
      dark: {
        dark: true,
        colors: {
          background: '#121212',
          surface: '#1e1e1e',
          primary: '#90caf9',
          secondary: '#03dac6',
          error: '#f44336',
          info: '#2196f3',
          success: '#4caf50',
          warning: '#fb8c00',
          onSurface: '#FFFFFF', // texto claro no dark
        },
      },
    },
  },
});