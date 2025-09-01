<template>
  <div class="container">
    <h2>Registrieren</h2>
    <form @submit.prevent="handleRegister">
      <input type="text" v-model="username" placeholder="Username" required>
      <input type="email" v-model="email" placeholder="E-Mail" required>
      <input type="password" v-model="password" placeholder="Passwort" required>
      <button type="submit">Registrieren</button>
    </form>
    <div v-if="message" class="message">{{ message }}</div>
    <p>Schon einen Account? <router-link to="/login">Hier anmelden</router-link>.</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const email = ref('');
const password = ref('');
const message = ref('');
const router = useRouter();

const handleRegister = async () => {
  // Basic validation
  if (password.value.length < 6) {
    message.value = 'Das Passwort muss mindestens 6 Zeichen lang sein.';
    return;
  }

  // NOTE: API call will be implemented later with authService
  console.log('Registering with:', username.value, email.value, password.value);
  message.value = 'Registrierung erfolgreich! Du wirst zum Login weitergeleitet...';

  // Placeholder for actual API call
  // For now, we'll just simulate a successful registration and redirect.
  setTimeout(() => {
    router.push('/login');
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
  color: #d9534f; /* A reddish color for errors, can be adapted */
}
p {
  margin-top: 20px;
}
</style>
