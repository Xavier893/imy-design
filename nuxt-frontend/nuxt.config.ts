// https://nuxt.com/docs/api/configuration/nuxt-config

import Aura from "@primevue/themes/aura";
import { definePreset } from "@primevue/themes";

const MyPreset = definePreset(Aura, {});

export default defineNuxtConfig({
	compatibilityDate: "2024-04-03",
	devtools: { enabled: true },
	modules: [
		"@primevue/nuxt-module",
		"@nuxtjs/tailwindcss",
		"@nuxt/image",
		"@nuxt/fonts",
		"@pinia/nuxt",
	],
	primevue: {
		usePrimeVue: true,
		options: {
			theme: {
				preset: MyPreset,
				options: {
					darkModeSelector: "light",
				},
			},
		},
	},
	css: ["primeicons/primeicons.css"],
	app: {
		pageTransition: { name: "page", mode: "out-in" },
	},
});
