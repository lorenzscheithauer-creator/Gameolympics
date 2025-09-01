<template>
  <div class="lobby-container">
    <header class="lobby-header">
      <h1>Gameolympics</h1>
      <div class="user-info">
        <span>Willkommen, {{ username }}!</span>
        <button @click="handleLogout" class="logout-button">Logout</button>
      </div>
    </header>

    <main class="main-content">
      <div class="game-grid">
        <div v-for="n in 8" :key="`game-${n}`" class="game-tile" @click="logClick(`Game ${n}`)"></div>
      </div>
      <div class="wheel-of-fortune" @click="logClick('Wheel of Fortune')">
        <img src="@/assets/wheel.png" alt="Glücksrad" class="wheel-image"/>
      </div>
    </main>

    <footer class="lobby-display">
      <div class="lobby-header-bar">
        <h2>Lobby</h2>
        <div class="toggle-switch">
          <button :class="{ active: lobbyType === 'public' }" @click="lobbyType = 'public'">
            <img src="@/assets/globe.png" alt="Public" class="toggle-icon"/>
            Öffentlich
          </button>
          <button :class="{ active: lobbyType === 'private' }" @click="lobbyType = 'private'">
            <img src="@/assets/lock.png" alt="Private" class="toggle-icon"/>
            Privat
          </button>
        </div>
      </div>
      <div class="lobby-grid">
        <div v-for="n in 10" :key="`lobby-${n}`" class="lobby-tile"></div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('Benutzer');
const lobbyType = ref('public');

const logClick = (message: string) => {
  console.log(`${message} clicked`);
};

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
};

onMounted(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
    return;
  }
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      username.value = user.username;
    } catch (e) {
      console.error('Failed to parse user data from localStorage', e);
      handleLogout();
    }
  } else {
    // If there's a token but no user data, something is wrong.
    handleLogout();
  }
});
</script>

<style scoped>
.lobby-container {
  padding: 2rem;
  font-family: sans-serif;
  background-color: #fdf6e4;
  max-width: 1200px;
  margin: auto;
}

.lobby-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.lobby-header h1 {
  font-size: 3rem;
  font-weight: bold;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logout-button {
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.main-content {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 3rem;
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  flex-grow: 1;
}

.game-tile {
  background-color: black;
  aspect-ratio: 1 / 1;
  cursor: pointer;
}

.wheel-of-fortune {
  width: 200px;
  cursor: pointer;
}

.wheel-image {
  width: 100%;
  height: auto;
}

.lobby-display {
  margin-top: 2rem;
}

.lobby-header-bar {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1.5rem;
}

.lobby-header-bar h2 {
  font-size: 2rem;
}

.toggle-switch button {
  padding: 0.5rem 1.5rem;
  border: 1px solid #ccc;
  background-color: #f0f0f0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toggle-switch button.active {
  background-color: #2e8b57;
  color: white;
}

.toggle-icon {
  width: 20px;
  height: 20px;
}

.lobby-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
}

.lobby-tile {
  background-color: red;
  height: 60px;
  border-radius: 5px;
}
</style>
