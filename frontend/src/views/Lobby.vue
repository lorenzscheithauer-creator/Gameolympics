<template>
  <div class="container">
    <h2>Lobby</h2>
    <p>Willkommen zurück, {{ username }}!</p>
    <button @click="handleLogout">Logout</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('Benutzer');

const handleLogout = () => {
  console.log('Logging out...');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
};

onMounted(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
  } else {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        username.value = user.username;
      } catch (e) {
        console.error('Failed to parse user data from localStorage', e);
        // If user data is corrupt, log out
        handleLogout();
      }
    }
  }
});
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: 50px auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
}
button {
  padding: 10px 20px;
  margin-top: 20px;
  cursor: pointer;
}
</style>
