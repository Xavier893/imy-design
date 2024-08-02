// https://nuxt.com/docs/api/configuration/nuxt-config

import Aura from "@primevue/themes/aura"
import { definePreset } from "@primevue/themes"

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
        50: '{indigo.50}',
        100: '{indigo.100}',
        200: '{indigo.200}',
        300: '{indigo.300}',
        400: '{indigo.400}',
        500: '{indigo.500}',
        600: '{indigo.600}',
        700: '{indigo.700}',
        800: '{indigo.800}',
        900: '{indigo.900}',
        950: '{indigo.950}'
    }
  }
});


export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@primevue/nuxt-module', "@nuxtjs/tailwindcss"],
  primevue: {
    usePrimeVue: true,
    options: {
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: 'light',
        }
      }
    }
  },
  css: ['primeicons/primeicons.css']
})