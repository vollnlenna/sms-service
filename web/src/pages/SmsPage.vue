<template>
  <div class="page">
    <div class="tabs">
      <button
        type="button"
        class="tab"
        :class="{ active: tab === 'sent' }"
        @click="switchTab('sent')"
      >
        Отправленные
      </button>

      <button
        type="button"
        class="tab"
        :class="{ active: tab === 'received' }"
        @click="switchTab('received')"
      >
        Полученные
      </button>
    </div>

    <div class="content">
      <div class="listArea">
        <div class="filters">
          <div class="filtersRow searchRow">
            <input class="searchInput" v-model="qAll" placeholder="Поиск..." />
          </div>

          <div class="filtersRow filtersRowDates">
            <label>
              С:
              <input type="date" v-model="dateFrom" />
            </label>

            <label>
              По:
              <input type="date" v-model="dateTo" />
            </label>

            <label v-if="tab === 'sent'" class="statusSelect">
              Статус:
              <select v-model="statusFilter">
                <option value="all">Все</option>
                <option value="pending">В ожидании</option>
                <option value="sent">Отправлено</option>
                <option value="failed">Ошибка</option>
              </select>
            </label>
          </div>

          <div class="filtersActions">
            <button type="button" class="resetBtn" @click="resetFilters">Сбросить фильтры</button>
          </div>
        </div>

        <div v-if="loading" class="loading">Загрузка...</div>

        <div v-else class="list">
          <div v-for="msg in displayMessages" :key="msg.id_message" class="card">
            <div class="top">
              <b>{{ formatPhone(tab === 'received' ? msg.phone_from : msg.phone_to) }}</b>
              <span>{{ formatDate(msg.created_at) }}</span>
            </div>

            <div class="text">{{ msg.text }}</div>

            <div v-if="tab === 'sent'" class="bottom">
              <span :class="msg.status">{{ ruStatusLabel(msg.status) }}</span>
              <button class="deleteBtn" @click="deleteMessage(msg.id_message)">Удалить</button>
            </div>
          </div>

          <div v-if="displayMessages.length === 0" class="empty">
            Ничего не найдено по выбранным фильтрам
          </div>
        </div>
      </div>

      <aside class="sendPanel">
        <div class="panelTitle">Отправка SMS</div>

        <div class="form">
          <PhoneInput v-model="phone" placeholder="Номер телефона" />
          <textarea v-model="text" placeholder="Сообщение"></textarea>

          <button class="sendBtn" @click="handleSend">Отправить</button>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useMessages } from '@/composables/useMessages'
import PhoneInput from '@/components/PhoneInput.vue'

const stored = localStorage.getItem('deviceId')
const deviceId = stored && stored !== 'guest' ? Number(stored) : null

const { sent, received, loadSent, loadReceived, sendMessage, deleteMessage, loading } = useMessages(deviceId)

const phone = ref('')
const text = ref('')
const tab = ref<'sent' | 'received'>('sent')

type MsgStatus = 'pending' | 'sent' | 'failed'

const qAll = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const statusFilter = ref<MsgStatus | 'all'>('all')

watch(tab, (newTab) => {
  if (newTab === 'received') {
    statusFilter.value = 'all'
  }
})

const resetFilters = () => {
  qAll.value = ''
  dateFrom.value = ''
  dateTo.value = ''
  statusFilter.value = 'all'
}

const normalizeDigits = (s: string) => s.replace(/\D/g, '')

const ruStatusLabel = (s: MsgStatus) => {
  switch (s) {
    case 'pending':
      return 'в ожидании'
    case 'sent':
      return 'отправлено'
    case 'failed':
      return 'ошибка'
  }
}

const toTs = (d: string) => {
  const t = new Date(d).getTime()
  return Number.isFinite(t) ? t : null
}

const dateInputToRange = () => {
  const from = dateFrom.value ? new Date(`${dateFrom.value}T00:00:00`).getTime() : null
  const to = dateTo.value ? new Date(`${dateTo.value}T23:59:59`).getTime() : null
  return { from, to }
}

const baseMessages = computed(() => (tab.value === 'sent' ? sent.value : received.value))

const displayMessages = computed(() => {
  const list = baseMessages.value

  const query = qAll.value.trim().toLowerCase()
  const queryDigits = normalizeDigits(qAll.value).trim()

  const { from, to } = dateInputToRange()

  return list.filter((msg) => {
    if (query) {
      const phoneField = tab.value === 'received' ? msg.phone_from : msg.phone_to
      const matchesPhone = queryDigits
        ? normalizeDigits(phoneField || '').includes(queryDigits)
        : false
      const matchesText = msg.text?.toLowerCase().includes(query)

      const matchesStatus =
        tab.value === 'sent' &&
        ((msg.status as string).toLowerCase().includes(query) ||
          ruStatusLabel(msg.status as MsgStatus).includes(query))

      const matchesDate = String(msg.created_at).toLowerCase().includes(query)

      if (!(matchesPhone || matchesText || matchesStatus || matchesDate)) return false
    }

    if (tab.value === 'sent' && statusFilter.value !== 'all') {
      if (msg.status !== statusFilter.value) return false
    }

    if (from !== null || to !== null) {
      const t = toTs(String(msg.created_at))
      if (t === null) return false
      if (from !== null && t < from) return false
      if (to !== null && t > to) return false
    }

    return true
  })
})

onMounted(async () => {
  if (deviceId) await loadSent()
})

const switchTab = async (t: 'sent' | 'received') => {
  tab.value = t
  if (!deviceId) return
  if (t === 'sent') await loadSent()
  else await loadReceived()
}

const isValidPhone = (p: string) => p.replace(/\D/g, '').length === 11

const handleSend = async () => {
  if (!deviceId) return alert('deviceId не найден')
  if (!isValidPhone(phone.value)) return alert('Неверный номер')
  if (!text.value.trim()) return alert('Пустое сообщение')

  const cleanPhone = '+' + phone.value.replace(/\D/g, '')

  try {
    await sendMessage(cleanPhone, text.value)

    alert('СМС отправлено')

    phone.value = ''
    text.value = ''

    tab.value = 'sent'
    await loadSent()
  } catch {
    alert('Не удалось отправить СМС (возможно ваше устройство не активно)')
  }
}

const formatPhone = (v: string | undefined) => {
  if (!v) return '—'
  const d = v.replace(/\D/g, '')
  if (d.length < 11) return v
  return `+7 ${d.slice(1, 4)} ${d.slice(4, 7)} ${d.slice(7, 9)} ${d.slice(9, 11)}`
}

const formatDate = (d: string) => new Date(d).toLocaleString()
</script>

<style scoped>
.page {
  max-width: 1050px;
  margin: 30px auto;
  font-family: 'Courier New', monospace;
}

.tabs {
  display: flex;
  justify-content: left;
  gap: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.18);
  margin-bottom: 18px;
}

.tab {
  appearance: none;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 12px 28px;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.55);
  border-bottom: 2px solid transparent;
  transition: 0.15s;
}

.tab:hover {
  color: rgba(0, 0, 0, 0.9);
}

.tab + .tab {
  border-left: 1px solid rgba(0, 0, 0, 0.18);
}

.tab.active {
  color: #000;
  border-bottom-color: #000;
}

.content {
  display: flex;
  align-items: flex-start;
  gap: 18px;
}

.listArea {
  flex: 1;
  min-width: 0;
}

.sendPanel {
  width: 320px;
  border: 1px solid rgba(0, 0, 0, 0.25);
  padding: 14px;
  background: #fff;
}

.panelTitle {
  font-weight: 700;
  margin-bottom: 10px;
}

.loading {
  text-align: center;
  opacity: 0.7;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card {
  border: 1px solid rgba(0, 0, 0, 0.35);
  padding: 12px;
  display: flex;
  flex-direction: column;
}

.top {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  opacity: 0.75;
}

.text {
  margin: 10px 0;
  word-break: break-word;
  overflow-wrap: break-word;
  max-height: 150px;
  overflow-y: auto;
  padding-right: 4px;
}

.bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-top: auto;
}

.pending {
  color: gray;
}

.sent {
  color: #1e5cff;
}

.failed {
  color: #d10000;
}

.deleteBtn {
  border: 1px solid red;
  color: red;
  background: #fff;
  cursor: pointer;
  padding: 6px 10px;
  transition: 0.15s;
}

.deleteBtn:hover {
  background: red;
  color: #fff;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 6px;
}

textarea {
  border: 1px solid rgba(0, 0, 0, 0.6);
  padding: 8px;
  font-family: inherit;
  resize: vertical;
  min-height: 90px;
}

.sendBtn {
  border: 1px solid #000;
  background: #fff;
  cursor: pointer;
  padding: 10px 12px;
  transition: 0.15s;
}

.sendBtn:hover {
  background: #000;
  color: #fff;
}

.filters {
  border: 1px solid rgba(0, 0, 0, 0.18);
  padding: 12px;
  margin-bottom: 14px;
  background: #fff;
}

.filtersRow {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
  margin-bottom: 10px;
  align-items: flex-end;
}

.searchRow {
  flex-wrap: nowrap;
}

.searchInput {
  width: 100%;
  max-width: 684px;
  border: 1px solid rgba(0, 0, 0, 0.45);
  padding: 10px 12px;
  font-family: inherit;
  background: #fff;
}

.filtersRow input[type='date'],
.filtersRow input,
.filtersRow select {
  border: 1px solid rgba(0, 0, 0, 0.45);
  padding: 10px 12px;
  font-family: inherit;
  background: #fff;
}

.filtersRow label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  opacity: 0.85;
  min-width: 200px;
}

.filtersRowDates {
  flex-wrap: nowrap;
  gap: 22px;
}

.statusSelect {
  min-width: 240px;
}

.statusSelect select {
  appearance: none;
  background-color: #fff;
  background-image:
    linear-gradient(45deg, transparent 50%, #000 50%),
    linear-gradient(135deg, #000 50%, transparent 50%);
  background-position:
    calc(100% - 18px) calc(50% - 2px),
    calc(100% - 13px) calc(50% - 2px);
  background-size:
    6px 6px,
    6px 6px;
  background-repeat: no-repeat;
  padding-right: 42px;
}

.filtersActions {
  display: flex;
  justify-content: flex-start;
  margin-top: 4px;
}

.resetBtn {
  border: 1px solid rgba(0, 0, 0, 0.45);
  background: #fff;
  padding: 8px 12px;
  cursor: pointer;
  transition: 0.15s;
  font-family: inherit;
}

.resetBtn:hover {
  background: #000;
  color: #fff;
}

.empty {
  opacity: 0.7;
  padding: 10px 0;
}

@media (max-width: 900px) {
  .content {
    gap: 12px;
  }

  .sendPanel {
    width: 280px;
  }

  .filtersRowDates {
    flex-wrap: wrap;
    gap: 12px;
  }

  .statusSelect {
    min-width: 200px;
  }
}

@media (max-width: 650px) {
  .tabs {
    justify-content: center;
  }

  .content {
    flex-direction: column;
    gap: 14px;
  }

  .listArea {
    width: 100%;
  }

  .sendPanel {
    width: 100%;
  }

  .filtersRowDates {
    flex-wrap: wrap;
    gap: 12px;
  }

  .statusSelect {
    min-width: 180px;
  }

  .searchInput {
    max-width: 100%;
  }
}
</style>
