<template>
  <div class="container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <input type="email" v-model="email" placeholder="E-Mail" required>
      <input type="password" v-model="password" placeholder="Passwort" required>
      <button type="submit">Login</button>
    </form>
    <div v-if="message" class="message">{{ message }}</div>
    <p>Noch keinen Account? <router-link to="/register">Hier registrieren</router-link>.</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const message = ref('');
const router = useRouter();

const handleLogin = async () => {
  // NOTE: API call will be implemented later with authService
  console.log('Logging in with:', email.value, password.value);

  // Placeholder for actual API call
  // For now, we'll just simulate a successful login and redirect.
  // In reality, we would store the token here.
  localStorage.setItem('token', 'dummy_token_for_dev'); // Simulate token
  message.value = 'Login erfolgreich! Du wirst zur Lobby weitergeleitet...';

  setTimeout(() => {
    router.push('/');
  }, 2000);
};
</script>

<style scoped>
.container {
  max-width: 400px;
  margin: 50px auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
}
input {
  display: block;
  width: 90%;
  margin: 10px auto;
  padding: 10px;
}
button {
  padding: 10px 20px;
  margin-top: 10px;
  cursor: pointer;
}
.message {
  margin-top: 15px;
  color: #d9534f;
}
p {
  margin-top: 20px;
}
</style>
