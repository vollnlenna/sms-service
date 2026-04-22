<template>
  <div class="page">
    <h2>Информация об устройстве</h2>

    <div v-if="loading">Загрузка...</div>

    <div v-else-if="device" class="card">
      <div class="row">
        <span>ID:</span>
        <b>{{ device.id_device }}</b>
      </div>

      <div class="row">
        <span>Название:</span>
        <b>{{ device.name }}</b>
      </div>

      <div class="row">
        <span>Номер:</span>
        <b>{{ device.phone_number }}</b>
      </div>

      <div class="row">
        <span>Дата регистрации:</span>
        <b>{{ formatDate(device.created_at) }}</b>
      </div>

      <div class="row switch-row">
        <span>Активность:</span>

        <label class="switch">
          <input type="checkbox" :checked="device.is_active" @change="toggleActive" />
          <span class="slider"></span>
        </label>
      </div>
    </div>

    <div v-else>Устройство не найдено</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useDevice } from '@/composables/useDevice'

const { device, loadDevice, toggleActive, loading } = useDevice()

const deviceId = localStorage.getItem('deviceId')

onMounted(() => {
  if (deviceId && deviceId !== 'guest') {
    loadDevice()
  }
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleString()
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  font-family: 'Courier New', monospace;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.card {
  border: 1px solid #000;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.row {
  display: flex;
  gap: 10px;
}

.switch-row {
  align-items: center;
}

.switch {
  position: relative;
  width: 50px;
  height: 24px;
}

.switch input {
  display: none;
}

.slider {
  position: absolute;
  cursor: pointer;
  background: #ccc;
  border: 1px solid #000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: 0.2s;
}

.slider:before {
  position: absolute;
  content: '';
  height: 18px;
  width: 18px;
  left: 3px;
  top: 2px;
  background: #000;
  transition: 0.2s;
}

input:checked + .slider {
  background: #000;
}

input:checked + .slider:before {
  transform: translateX(24px);
  background: #fff;
}
</style>
