<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h3>Join Lobby</h3>
      <div class="options">
        <button
          :class="{ active: joinType === 'code' }"
          @click="setJoinType('code')"
        >
          Gruppe mit Code beitreten
        </button>
        <button
          :class="{ active: joinType === 'random' }"
          @click="setJoinType('random')"
        >
          Zufälliger Gruppe beitreten
        </button>
      </div>
      <div v-if="joinType === 'code'" class="code-section">
        <input type="text" v-model="lobbyCodeInput" placeholder="Lobby-Code" />
        <input type="password" v-model="password" placeholder="Passwort (falls benötigt)" />
      </div>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div class="modal-actions">
        <button class="cancel-button" @click="$emit('close')">Cancel</button>
        <button class="join-button" @click="handleJoinLobby">Join</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import lobbyService from '../services/lobbyService';

const props = defineProps<{
  initialLobbyCode?: string;
}>();

const emit = defineEmits(['close']);

const joinType = ref('code');
const lobbyCodeInput = ref('');
const password = ref('');
const errorMessage = ref('');

onMounted(() => {
  if (props.initialLobbyCode) {
    joinType.value = 'code';
    lobbyCodeInput.value = props.initialLobbyCode;
  }
});

const setJoinType = (type: 'code' | 'random') => {
  joinType.value = type;
};

const handleJoinLobby = async () => {
  errorMessage.value = '';
  try {
    let response;
    if (joinType.value === 'random') {
      response = await lobbyService.joinRandomLobby();
    } else {
      if (!lobbyCodeInput.value) {
        errorMessage.value = 'Lobby code is required.';
        return;
      }
      const joinData: { lobbyCode: string; password?: string } = { lobbyCode: lobbyCodeInput.value };
      if (password.value) {
        joinData.password = password.value;
      }
      response = await lobbyService.joinLobby(joinData);
    }

    console.log('Lobby joined:', response.data);
    alert(`Successfully joined lobby: ${response.data.lobby.lobbyCode}`);
    emit('close');

  } catch (error: any) {
    console.error('Failed to join lobby:', error);
    errorMessage.value = error.response?.data?.message || 'An unknown error occurred.';
  }
};
</script>

<style scoped>
/* Styles are unchanged, but included for completeness */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  text-align: center;
}

h3 {
  margin-top: 0;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}

.options {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.options button {
  width: 80%;
  padding: 0.8rem 1.2rem;
  border: 1px solid #ccc;
  background-color: #f0f0f0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
}

.options button.active {
  background-color: #4a90e2;
  color: white;
  border-color: #4a90e2;
}

.code-section {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.code-section input {
  width: 80%;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.error-message {
  color: #d9534f;
  margin-bottom: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.modal-actions button {
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
}

.cancel-button {
  background-color: #ccc;
}

.join-button {
  background-color: #3cb371;
  color: white;
}
</style>
