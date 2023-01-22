import { createWebHashHistory, createRouter } from "vue-router";
import HomeVue from "../views/Home/Home.vue";
import CalcVue from "../views/Calc/Calc.vue";

const routes = [
  {
    path: "",
    name: "Home",
    component: HomeVue,
  },
  {
    path: "/calc/:id",
    name: "Calc",
    component: CalcVue,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
