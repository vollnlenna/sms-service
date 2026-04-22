<template>
  <div class="page">
    <h2>Работа с API</h2>

    <button class="create-btn" @click="createKey" :disabled="!hasDeviceId">Создать API ключ</button>

    <div v-if="loading">Загрузка...</div>

    <div v-else class="list">
      <div v-for="key in keys" :key="key.id_api" class="card">
        <div class="top">
          <b>№{{ key.id_api }}</b>
          <span>{{ formatDate(key.created_at) }}</span>
        </div>

        <div class="key-row">
          <code>{{ key.key }}</code>

          <button @click="copy(key.key)">Копировать</button>
        </div>

        <button class="delete" @click="deleteKey(key.id_api)">Удалить</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useApiKeys } from '@/composables/useApiKeys'

const storedId = localStorage.getItem('deviceId')
const deviceId = storedId ? Number(storedId) : NaN

const hasDeviceId = computed(() => {
  const v = localStorage.getItem('deviceId')
  return !!v && v !== 'null'
})

const { keys, loadKeys, createKey, deleteKey, loading } = useApiKeys(
  isNaN(deviceId) ? null : deviceId,
)

onMounted(() => {
  loadKeys()
})

const formatDate = (d: string) => new Date(d).toLocaleString()

const copy = async (text: string) => {
  await navigator.clipboard.writeText(text)
}
</script>

<style scoped>
.page {
  max-width: 700px;
  margin: 40px auto;
  font-family: 'Courier New', monospace;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.create-btn {
  display: block;
  margin: 0 auto 20px;
  padding: 10px 16px;
  border: 1px solid #000;
  background: #fff;
  cursor: pointer;
  transition: 0.2s;
}

.create-btn:hover {
  background: #000;
  color: #fff;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card {
  border: 1px solid #000;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.top {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  opacity: 0.7;
}

.key-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

code {
  word-break: break-all;
}

button {
  cursor: pointer;
  border: 1px solid #000;
  background: #fff;
  padding: 4px 8px;
  transition: 0.2s;
}

button:hover {
  background: #000;
  color: #fff;
}

.delete {
  border-color: red;
  color: red;
}

.delete:hover {
  background: red;
  color: #fff;
}
</style>
