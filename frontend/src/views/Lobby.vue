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
    <div class="lobby-section-header">
      <h2 class="lobby-title">Lobby</h2>
      <div class="lobby-actions">
        <button class="action-button create-button" @click="showCreateModal = true">Create Lobby</button>
        <button class="action-button join-button" @click="handleJoinClick">Join Lobby</button>
      </div>
    </div>
    <div class="lobby-list-container">
      <div v-if="lobbies.length > 0" class="lobby-list">
        <div v-for="lobby in lobbies" :key="lobby.lobbyCode" class="lobby-item" @click="handleLobbyClick(lobby)">
          <div class="lobby-info">
            <span class="lobby-name">{{ lobby.lobbyName }}</span>
            <span class="lobby-code">Code: {{ lobby.lobbyCode }}</span>
          </div>
          <span class="player-count">{{ lobby.playerCount }}/{{ lobby.maxPlayers }}</span>
        </div>
      </div>
      <div v-else class="no-lobbies-message">
        <p>No public lobbies available. Why not create one?</p>
      </div>
    </div>

    <CreateLobbyModal v-if="showCreateModal" @close="showCreateModal = false" />
    <JoinLobbyModal
      v-if="showJoinModal"
      :initial-lobby-code="selectedLobbyCode"
      @close="showJoinModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import CreateLobbyModal from '../components/CreateLobbyModal.vue';
import JoinLobbyModal from '../components/JoinLobbyModal.vue';
import lobbyService from '../services/lobbyService';

interface Lobby {
  lobbyCode: string;
  lobbyName: string;
  playerCount: number;
  maxPlayers: number;
}

const showCreateModal = ref(false);
const showJoinModal = ref(false);
const selectedLobbyCode = ref('');
const lobbies = ref<Lobby[]>([]);
let pollingInterval: number | undefined;

const logGameClick = (gameNumber: number) => {
  console.log(`Game ${gameNumber} clicked`);
};

const fetchLobbies = async () => {
  try {
    const response = await lobbyService.getLobbies();
    lobbies.value = response.data;
  } catch (error) {
    console.error('Failed to fetch lobbies:', error);
  }
};

const handleJoinClick = () => {
  selectedLobbyCode.value = '';
  showJoinModal.value = true;
};

const handleLobbyClick = (lobby: Lobby) => {
  selectedLobbyCode.value = lobby.lobbyCode;
  showJoinModal.value = true;
};

onMounted(() => {
  fetchLobbies();
  pollingInterval = window.setInterval(fetchLobbies, 5000);
});

onUnmounted(() => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }
});
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #FDFBF5;
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

.lobby-section-header {
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
  background-color: #3cb371;
}

.join-button {
  background-color: #4a90e2;
}

.lobby-list-container {
  width: 100%;
  max-width: 980px;
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 1rem;
  min-height: 150px;
}

.lobby-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.lobby-item {
  background-color: #fff;
  padding: 1rem;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.lobby-item:hover {
  transform: translateY(-2px);
}

.lobby-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.lobby-name {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.lobby-code {
  font-family: monospace;
  font-size: 0.9rem;
  color: #555;
  background-color: #eee;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
}

.player-count {
  font-weight: bold;
  font-size: 1.1rem;
  color: #333;
}

.no-lobbies-message {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #888;
  font-style: italic;
}
</style>
