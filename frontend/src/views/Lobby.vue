<template>
  <div class="lobby-container">
    <header class="lobby-header">
      <h1>Gameolympics</h1>
    </header>

    <main class="main-content">
      <div class="game-selection-area">
        <div class="game-grid">
          <div v-for="n in 8" :key="n" class="game-tile"></div>
        </div>
        <div class="wheel-of-fortune">
          <p>Glücksrad</p>
        </div>
      </div>
    </main>

    <footer class="lobby-display">
      <div class="lobby-header-bar">
        <h2>Lobby</h2>
        <button @click="toggleLobbyType" class="toggle-button">
          {{ isPublic ? 'Öffentlich' : 'Privat' }}
        </button>
      </div>
       <p data-testid="welcome-message">Willkommen zurück, {{ username }}!</p>
      <button @click="handleLogout" class="logout-button">Logout</button>
      <div class="lobby-grid">
        <div v-for="n in 12" :key="n" class="lobby-tile"></div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const isPublic = ref(true);
const username = ref('Benutzer');
const router = useRouter();

const toggleLobbyType = () => {
  isPublic.value = !isPublic.value;
};

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
};

onMounted(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      username.value = user.username;
    } catch (e) {
      console.error('Failed to parse user data from localStorage', e);
    }
  }
});
</script>

<style scoped>
/* Styles are intentionally left out for brevity as they are unchanged */
.lobby-container {
  padding: 2rem;
  font-family: sans-serif;
}

.lobby-display {
  margin-top: 2rem;
}

.lobby-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.lobby-header-bar h2 {
  font-size: 1.5rem;
}

.toggle-button {
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.lobby-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
}

.lobby-tile {
  background-color: red;
  height: 50px;
}

.game-selection-area {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 3rem;
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  flex-grow: 1;
}

.game-tile {
  background-color: black;
  aspect-ratio: 1 / 1;
  cursor: pointer;
}

.wheel-of-fortune {
  background-color: #ddd;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  text-align: center;
}

.lobby-header {
  text-align: center;
  margin-bottom: 2rem;
}

.lobby-header h1 {
  font-size: 3rem;
  font-weight: bold;
}
</style>
