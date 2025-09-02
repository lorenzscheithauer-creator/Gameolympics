<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h3>Create Lobby</h3>
      <div class="form-group">
        <label for="lobbyName">Lobby Name</label>
        <input type="text" id="lobbyName" v-model="lobbyName" placeholder="My Awesome Lobby" />
      </div>
      <div class="options">
        <button
          :class="{ active: lobbyType === 'public' }"
          @click="setLobbyType('public')"
        >
          Public Lobby
        </button>
        <button
          :class="{ active: lobbyType === 'private' }"
          @click="setLobbyType('private')"
        >
          Private Lobby
        </button>
      </div>
      <div v-if="lobbyType === 'private'" class="password-section">
        <input type="password" v-model="password" placeholder="Lobby Password" />
      </div>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div class="modal-actions">
        <button class="cancel-button" @click="$emit('close')">Cancel</button>
        <button class="create-button" @click="handleCreateLobby">Create</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import lobbyService from '../services/lobbyService';

const lobbyName = ref('');
const lobbyType = ref('public');
const password = ref('');
const errorMessage = ref('');

const emit = defineEmits(['close']);

const setLobbyType = (type: 'public' | 'private') => {
  lobbyType.value = type;
};

const handleCreateLobby = async () => {
  errorMessage.value = '';
  try {
    const isPublic = lobbyType.value === 'public';
    const lobbyData: { lobbyName: string; isPublic: boolean; password?: string } = {
      lobbyName: lobbyName.value,
      isPublic,
    };
    if (!isPublic) {
      if (!password.value) {
        errorMessage.value = 'Password is required for a private lobby.';
        return;
      }
      lobbyData.password = password.value;
    }

    const response = await lobbyService.createLobby(lobbyData);
    console.log('Lobby created:', response.data);
    alert(`Lobby created successfully! Code: ${response.data.lobbyCode}`);
    emit('close');
  } catch (error: any) {
    console.error('Failed to create lobby:', error);
    errorMessage.value = error.response?.data?.message || 'An unknown error occurred.';
  }
};
</script>

<style scoped>
/* Scoped styles, adapted for the new input */
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
}

h3 {
  text-align: center;
  margin-top: 0;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  text-align: left;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

.options {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.options button {
  padding: 0.8rem 1.2rem;
  border: 1px solid #ccc;
  background-color: #f0f0f0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  flex-grow: 1;
}

.options button.active {
  background-color: #3cb371;
  color: white;
  border-color: #3cb371;
}

.password-section {
  margin-bottom: 1.5rem;
}

.password-section input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

.error-message {
  color: #d9534f;
  margin-bottom: 1rem;
  text-align: center;
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

.create-button {
  background-color: #4a90e2;
  color: white;
}
</style>
