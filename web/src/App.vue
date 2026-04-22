<template>
  <div class="app">
    <nav v-if="isLoggedIn" class="nav">
      <div class="tabs">
        <router-link to="/device" class="tab" active-class="active">Устройство</router-link>
        <router-link to="/api-keys" class="tab" active-class="active">API</router-link>
        <router-link to="/sms" class="tab" active-class="active">SMS</router-link>
      </div>
      <button class="logout" @click="handleLogout">Выход</button>
    </nav>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from './composables/useAuth'

const router = useRouter()
const auth = useAuth()

auth.init()

const isLoggedIn = computed(() => !!auth.deviceId.value)

const handleLogout = () => {
  auth.logout()
  router.replace('/start')
}
</script>

<style scoped>
.app {
  font-family: 'Courier New', monospace;
  min-height: 100vh;
}

.nav {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  position: relative;
  border-bottom: 1px solid #000;
}

.tabs {
  display: flex;
  gap: 20px;
}

.tab {
  text-decoration: none;
  padding: 10px 16px;
  border: 1px solid #000;
  color: #000;
  transition: 0.2s;
}

.tab:hover {
  background: #000;
  color: #fff;
}

.active {
  background: #000;
  color: #fff;
}

.logout {
  position: absolute;
  right: 20px;

  padding: 10px 16px;
  border: 1px solid red;
  background: #fff;
  color: red;

  cursor: pointer;
  transition: 0.2s;
}

.logout:hover {
  background: red;
  color: #fff;
}

@media (max-width: 576px) {
  .logout {
    position: fixed;
    left: 10px;
    bottom: 10px;
    right: auto;
    padding: 6px 10px;
    font-size: 12px;
  }
}
</style>
