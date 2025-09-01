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
import authService from '../services/authService';

const email = ref('');
const password = ref('');
const message = ref('');
const router = useRouter();

const handleLogin = async () => {
  message.value = ''; // Reset message on new login attempt
  try {
    const credentials = { username: email.value, password: password.value };
    const response = await authService.login(credentials);

    // Store token and user data
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    // Redirect to lobby
    router.push('/');

  } catch (error: any) {
    console.error("Login fehlgeschlagen:", error);
    if (error.response && error.response.data && error.response.data.message) {
        message.value = error.response.data.message;
    } else {
        message.value = 'Login fehlgeschlagen. Bitte versuchen Sie es erneut.';
    }
  }
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
