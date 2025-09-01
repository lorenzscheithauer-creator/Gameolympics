import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Lobby from '../views/Lobby.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/',
    name: 'Lobby',
    component: Lobby,
    meta: { requiresAuth: true }, // Add meta field for protected routes
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard
router.beforeEach((to, _from, next) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Check for token

  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    // If the route requires auth and the user is not authenticated, redirect to login
    next('/login');
  } else {
    // Otherwise, allow navigation
    next();
  }
});

export default router;
