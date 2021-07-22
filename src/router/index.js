import { createRouter, createWebHistory } from "vue-router";
import GMap from "../views/GMap";
import Signup from "../views/auth/Signup";
import Login from "../views/auth/Login";
import ViewProfile from "../views/profile/ViewProfile";

// route guard
import { projectAuth } from "../firebase/config";

const requireAuth = (to, from, next) => {
  let user = projectAuth.currentUser;
  if (!user) {
    next({ name: "Login" });
  } else {
    next();
  }
};

const routes = [
  {
    path: "/",
    name: "GMap",
    component: GMap,
    beforeEnter: requireAuth,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/profile/:id",
    name: "ViewProfile",
    component: ViewProfile,
    beforeEnter: requireAuth,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
