<template>
  <div class="wrapper">
    <div class="card">
      <h1>SMS SERVICE</h1>

      <p>Введите ID устройства с мобильного приложения</p>

      <input v-model="deviceId" placeholder="id" @keyup.enter="login" />

      <button @click="login">Войти</button>

      <p v-if="error" class="error">Устройство не найдено</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const auth = useAuth()

const deviceId = ref('')
const error = ref(false)

const login = async () => {
  error.value = false

  if (!deviceId.value.trim()) {
    error.value = true
    return
  }

  const success = await auth.login(deviceId.value)

  if (!success) {
    error.value = true
    return
  }

  await router.replace('/sms')
}
</script>

<style scoped>
.wrapper {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Courier New', monospace;
}

.card {
  width: 340px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

input {
  padding: 10px;
  border: 1px solid #000;
  font-family: inherit;
}

button {
  padding: 10px;
  border: 1px solid #000;
  background: #fff;
  cursor: pointer;
  transition: 0.2s;
}

button:hover {
  background: #000;
  color: #fff;
}

.error {
  color: red;
}
</style>
