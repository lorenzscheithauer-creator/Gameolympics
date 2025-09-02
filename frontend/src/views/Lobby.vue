<template>
  <div class="page-container">
    <h1 class="main-title">Gameolympics</h1>
    <div class="games-section">
      <div class="games-grid">
        <button v-for="i in 8" :key="i" class="game-button" @click="logGameClick(i)">
          Game{{ i }}
        </button>
      </div>
      <div class="wheel-placeholder"></div>
    </div>
    <div class="lobby-section">
      <h2 class="lobby-title">Lobby</h2>
      <div class="lobby-actions">
        <button class="action-button create-button" @click="showCreateModal = true">Create Lobby</button>
        <button class="action-button join-button" @click="showJoinModal = true">Join Lobby</button>
      </div>
    </div>
    <div class="lobby-grid-container">
       <div v-for="n in 12" :key="n" class="lobby-tile-placeholder"></div>
    </div>

    <!-- Modals will be added here in later steps -->
    <CreateLobbyModal v-if="showCreateModal" @close="showCreateModal = false" />
    <JoinLobbyModal v-if="showJoinModal" @close="showJoinModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CreateLobbyModal from '../components/CreateLobbyModal.vue';
// Modal components will be imported here later
import JoinLobbyModal from '../components/JoinLobbyModal.vue';

const showCreateModal = ref(false);
const showJoinModal = ref(false);

const logGameClick = (gameNumber: number) => {
  console.log(`Game ${gameNumber} clicked`);
};
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #FDFBF5; /* Creamy off-white from mockup */
  min-height: 100vh;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.main-title {
  font-size: 3.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 3rem;
}

.games-section {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 3rem;
  margin-bottom: 3rem;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.game-button {
  width: 120px;
  height: 120px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.wheel-placeholder {
  width: 160px;
  height: 160px;
  background-color: #E0E0E0;
  border-radius: 50%;
  border: 4px solid #C0C0C0;
}

.lobby-section {
  width: 100%;
  max-width: 980px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.lobby-title {
  font-size: 2.5rem;
  color: #333;
  margin: 0;
}

.lobby-actions {
  display: flex;
  gap: 1rem;
}

.action-button {
  color: white;
  border: none;
  border-radius: 50px;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.create-button {
  background-color: #3cb371; /* Green */
}

.join-button {
  background-color: #4a90e2; /* Blue */
}

.lobby-grid-container {
  width: 100%;
  max-width: 980px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;
}

.lobby-tile-placeholder {
  height: 50px;
  background-color: #d9534f;
  border-radius: 4px;
}
</style>
