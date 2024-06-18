import { createApp } from "vue";
import ArcoVue from "@arco-design/web-vue";
import "@arco-design/web-vue/dist/arco.css";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "@/access";

const pijnia = createPinia();

createApp(App).use(pijnia).use(ArcoVue).use(router).mount("#app");
