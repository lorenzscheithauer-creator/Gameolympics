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
          <!-- Placeholder for wheel image -->
        </div>
      </div>
    </main>

    <footer class="lobby-display">
      <div class="lobby-header-bar">
        <h2>Lobby</h2>
        <button @click="toggleLobbyType" class="toggle-button">
          <span class="toggle-text">
            <span v-if="isPublic">Öffentlich</span>
            <span v-else>Privat</span>
          </span>
          <!-- Placeholders for icons -->
        </button>
      </div>
      <div class="lobby-grid">
        <div v-for="n in 12" :key="n" class="lobby-tile"></div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isPublic = ref(true);

const toggleLobbyType = () => {
  isPublic.value = !isPublic.value;
};

// Note: Logout functionality is removed to match the mockup exactly.
// If needed, it can be re-added.
</script>

<style scoped>
/* Applying background color to the root element of the component */
.lobby-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: #FDFBF5; /* Creamy off-white background */
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.lobby-header {
  width: 100%;
  text-align: center;
  margin-bottom: 2rem; /* Adjusted margin */
}

.lobby-header h1 {
  font-size: 3.5rem; /* Slightly larger font */
  font-weight: bold;
  color: #333;
}

.main-content {
  /* This container is less necessary with the flex alignment on the parent */
  margin-bottom: 3rem; /* Adjusted margin */
}

.game-selection-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3rem; /* Increased gap */
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.game-tile {
  width: 110px; /* Adjusted size */
  height: 110px; /* Adjusted size */
  background-color: black;
  cursor: pointer;
}

.wheel-of-fortune {
  width: 160px; /* Adjusted size */
  height: 160px; /* Adjusted size */
  background-color: #E0E0E0; /* Light gray placeholder color */
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #888;
  font-size: 1.2rem;
  border: 4px solid #C0C0C0; /* Added border to look more like a wheel */
}

.lobby-display {
  width: 100%;
  max-width: 980px; /* Adjusted max-width */
}

.lobby-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0 0.5rem; /* Adjusted padding */
}

.lobby-header-bar h2 {
  font-size: 2.5rem; /* Larger font */
  color: #333;
  margin: 0;
}

.toggle-button {
  background-color: #3cb371; /* Greenish color */
  color: white;
  border: none;
  border-radius: 50px;
  padding: 0.75rem 2rem; /* Adjusted padding */
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 160px; /* Adjusted min-width */
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.lobby-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;
}

.lobby-tile {
  height: 50px; /* Adjusted height */
  background-color: #d9534f; /* A more muted red */
  border-radius: 4px;
}
</style>
