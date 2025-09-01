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
// In a real app, you'd get this from your auth store/token
const username = ref('Benutzer');

const handleLogout = () => {
  console.log('Logging out...');
  localStorage.removeItem('token');
  router.push('/login');
};

onMounted(() => {
  // This is where you would fetch user data if needed
  // For now, we just use a placeholder username.
  const token = localStorage.getItem('token');
  if (!token) {
    // This is a simple check. The router guard is the main protection.
    router.push('/login');
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
