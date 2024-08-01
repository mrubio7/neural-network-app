import {createApp} from 'vue'
import App from './App.vue'
import router from './router';
import PrimeVue from 'primevue/config';
import Fluid from 'primevue/fluid';
import Aura from '@primevue/themes/aura';
import { definePreset } from '@primevue/themes';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';
import './style.css';
import 'primeicons/primeicons.css'

const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{sky.50}',
            100: '{sky.100}',
            200: '{sky.200}',
            300: '{sky.300}',
            400: '{sky.400}',
            500: '{sky.500}',
            600: '{sky.600}',
            700: '{sky.700}',
            800: '{sky.800}',
            900: '{sky.900}',
            950: '{sky.950}'
        }
    }
});

const app = createApp(App);

app.directive('tooltip', Tooltip);
app.use(PrimeVue, {
    theme: {
        preset: MyPreset,
    }
});

app.use(router);

app.use(ToastService);
app.component('Fluid', Fluid);
app.mount('#app')
