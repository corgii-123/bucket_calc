import "vue-devui/style.css";
import "@devui-design/icons/icomoon/devui-icon.css";
import DevUI from "vue-devui";
import { ThemeServiceInit, infinityTheme, Theme } from "devui-theme";
import App from "./App.vue";
import { createApp } from "vue";
import router from "./router";
import "./style.css";

const myLightTheme: Theme = new Theme({
  id: "my-light-theme",
  name: "My Light Theme",
  cnName: "我的浅色主题",
  data: Object.assign({}, infinityTheme.data, {
    "devui-brand": "#4069a6",
    "devui-brand-foil": "#5e86c1",
    "devui-brand-hover": "#4069a6",
    "devui-brand-active": "#4069a6",
    "devui-brand-active-focus": "#335485",
    "devui-primary": "#4069a6",
  }),
  isDark: false,
});
const themeService = ThemeServiceInit();
themeService?.applyTheme(myLightTheme);

createApp(App).use(router).use(DevUI).mount("#app");
