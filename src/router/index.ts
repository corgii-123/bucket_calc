import { createWebHashHistory, createRouter } from "vue-router";
import HomeVue from "../views/Home/Home.vue";
import CalcVue from "../views/Calc/Calc.vue";
import Result from "../views/Result/Result.vue";

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
  {
    path: "/result/:id",
    name: "Result",
    component: Result,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
