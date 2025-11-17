import { createApp } from 'vue'
import { createPinia } from 'pinia';
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import Ripple from 'primevue/ripple';
import Tooltip from 'primevue/tooltip';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import { useAuthStore } from './stores/authStore';

import 'primeicons/primeicons.css'

const app = createApp(App)
const pinia = createPinia();

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: 'dark',
      cssLayer: {
        name: 'primevue',
        order: 'tailwind-base, primevue, tailwind-utilities'
      }
    }
  },
  ripple: true
});

app.directive('ripple', Ripple);
app.directive('tooltip', Tooltip);

app.use(ConfirmationService);
app.use(ToastService);
app.use(PrimeVue)
app.use(pinia);
app.use(router)

// Inicializa a auth store e aguarda verificação de sessão antes de montar o app
const authStore = useAuthStore()
authStore.initialize()

// Aguarda a verificação inicial da autenticação antes de montar o app
// Isso garante que a sessão seja restaurada do localStorage antes do router guard executar
authStore.checkAuth().then(() => {
  app.mount('#app')
})
