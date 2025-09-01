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

    <hr style="margin: 2rem 0;">

    <h3>Als Gast fortfahren</h3>
    <form @submit.prevent="handleGuestLogin">
        <input type="text" v-model="guestNickname" placeholder="Spitzname" required>
        <button type="submit">Als Gast fortfahren</button>
    </form>
    <div v-if="guestMessage" class="message">{{ guestMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '../services/authService';

const email = ref('');
const password = ref('');
const message = ref('');
const guestNickname = ref('');
const guestMessage = ref('');
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

const handleGuestLogin = async () => {
  guestMessage.value = '';
  try {
    const response = await authService.guestLogin(guestNickname.value);

    // Store token and guest data
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify({
        nickname: response.data.nickname,
        isGuest: response.data.isGuest
    }));

    // Redirect to lobby
    router.push('/');

  } catch (error: any) {
    console.error("Guest login failed:", error);
    if (error.response && error.response.data && error.response.data.message) {
        guestMessage.value = error.response.data.message;
    } else {
        guestMessage.value = 'Guest login failed. Please try again.';
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
