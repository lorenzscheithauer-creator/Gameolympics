<template>
  <div class="page-container">
    <div v-if="currentLobby" class="in-lobby-view">
      <h1 class="main-title">{{ currentLobby.lobbyName }}</h1>
      <p class="lobby-code-display">Lobby Code: {{ currentLobby.lobbyCode }}</p>

      <div class="players-list">
        <h2>Players ({{ currentLobby.players.length }} / 6)</h2>
        <ul>
          <li v-for="player in currentLobby.players" :key="player.id">
            {{ player.username }} <span v-if="player.id === currentLobby.hostId">(Host)</span>
          </li>
        </ul>
      </div>

      <div class="lobby-actions">
        <button
          v-if="isHost"
          @click="startGame"
          :disabled="currentLobby.players.length < 2"
          class="action-button start-game-button"
        >
          Start Game
        </button>
        <button @click="leaveLobby" class="action-button leave-lobby-button">Leave Lobby</button>
      </div>
    </div>
    <div v-else>
      <h1 class="main-title">You are not in a lobby</h1>
      <p>Create or join a lobby to start playing.</p>
      <!-- In a real application, we would have buttons here to create or join a lobby -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import lobbyService from '../services/lobbyService';

interface Player {
  id: string;
  username: string;
}

interface Lobby {
  lobbyCode: string;
  lobbyName: string;
  players: Player[];
  hostId: string;
  gameStarted?: boolean;
}

interface User {
  id: string;
  username: string;
  token: string;
}

const currentLobby = ref<Lobby | null>(null);
const currentUser = ref<User | null>(null);
let pollingInterval: number | undefined;

const isHost = computed(() => {
  if (!currentLobby.value || !currentUser.value) return false;
  return currentLobby.value.hostId === currentUser.value.id;
});

const fetchCurrentLobby = async () => {
  try {
    const response = await lobbyService.getCurrentLobby();
    currentLobby.value = response.data;
  } catch (error) {
    console.log('Not currently in a lobby.');
    currentLobby.value = null;
  }
};

const startGame = async () => {
  if (!currentLobby.value) return;
  try {
    const response = await lobbyService.startGame(currentLobby.value.lobbyCode);
    console.log('Game started:', response.data);
    if (currentLobby.value) {
      currentLobby.value = response.data;
    }
  } catch (error) {
    console.error('Failed to start game:', error);
  }
};

const leaveLobby = async () => {
  try {
    await lobbyService.leaveLobby();
    currentLobby.value = null;
  } catch (error) {
    console.error('Failed to leave lobby:', error);
  }
};

onMounted(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    currentUser.value = JSON.parse(storedUser);
  }

  fetchCurrentLobby();
  pollingInterval = window.setInterval(fetchCurrentLobby, 3000); // Poll for updates
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
  margin-bottom: 1rem;
}
.in-lobby-view {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.lobby-code-display {
  font-family: monospace;
  font-size: 1.2rem;
  color: #555;
  background-color: #eee;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  margin-bottom: 2rem;
}
.players-list {
  width: 100%;
  margin-bottom: 2rem;
}
.players-list h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}
.players-list ul {
  list-style: none;
  padding: 0;
}
.players-list li {
  background-color: #fff;
  padding: 1rem;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
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
}
.start-game-button {
  background-color: #3cb371;
}
.start-game-button:disabled {
  background-color: #9e9e9e;
  cursor: not-allowed;
}
.leave-lobby-button {
  background-color: #f44336;
}
</style>
