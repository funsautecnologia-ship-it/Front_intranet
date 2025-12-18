<template>
  <v-container class="py-6">
    <v-row>
      <v-col cols="12" class="mb-4 text-center">
        <h1 class="text-h5">Agendamentos do Dia</h1>
        <div class="d-flex justify-center mt-2">
          <v-text-field
            v-model="selectedDate"
            type="date"
            label="Data"
            density="comfortable"
            style="max-width: 220px;"
            @update:model-value="fetchByDate"
          />
          <v-btn color="teal-lighten-5" class="ml-2" @click="fetchByDate" prepend-icon="mdi-refresh">Atualizar</v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <v-card>
          <v-card-text>
            <div v-if="loading" class="text-center pa-8">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
            <div v-else>
              <div v-if="filtered.length === 0" class="text-center py-12">
                <v-icon color="grey" size="64">mdi-calendar-blank</v-icon>
                <div class="mt-2">Nenhum agendamento para a data selecionada</div>
              </div>
              <div v-else>
                <v-row class="trello-columns">
                  <v-col cols="12" md="4">
                    <v-card class="trello-column" elevation="1" rounded="lg">
                      <v-card-title class="d-flex align-center justify-space-between">
                        <span>Manhã</span>
                        <v-chip size="small" variant="tonal">{{ periods.morning.length }}</v-chip>
                      </v-card-title>
                      <v-divider></v-divider>
                      <v-card-text class="agendamentos-list">
                        <v-card
                          v-for="(a, idx) in periods.morning"
                          :key="a._id"
                          :class="['trello-card', 'mb-3', getStatusClass(a)]"
                          elevation="2"
                          rounded="lg"
                          :style="getStatusStyle(a)"
                          variant="tonal"
                          :color="getCardColor(a)"
                        >
                          <v-card-text>
                            <div class="top-line d-flex align-center mb-2">
                              <v-icon color="primary">mdi-clock-outline</v-icon>
                              <span class="ml-2 text-body-1 font-weight-bold">{{ a.Hora }}</span>
                            </div>
                            <div class="solicitante-line text-medium-emphasis font-weight-bold text-primary">Solicitante: {{ a.solicitante }}</div>
                            <div class="trello-badges mt-2">
                              <v-chip v-if="a.Infra && a.Infra.nome" color="primary" variant="tonal" size="medium">Infra: {{ a.Infra.nome }}</v-chip>
                              <v-chip v-if="Array.isArray(a.Equipamentos) && a.Equipamentos.length" size="medium" color="primary" variant="tonal">Equipamentos: {{ a.Equipamentos.map(e => e.nome || e).join(', ') }}</v-chip>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-card class="trello-column" elevation="1" rounded="lg">
                      <v-card-title class="d-flex align-center justify-space-between">
                        <span>Tarde</span>
                        <v-chip size="small" variant="tonal">{{ periods.afternoon.length }}</v-chip>
                      </v-card-title>
                      <v-divider></v-divider>
                      <v-card-text class="agendamentos-list">
                        <v-card
                          v-for="(a, idx) in periods.afternoon"
                          :key="a._id"
                          :class="['trello-card', 'mb-3', getStatusClass(a)]"
                          elevation="2"
                          rounded="lg"
                          :style="getStatusStyle(a)"
                          variant="tonal"
                          :color="getCardColor(a)"
                        >
                          <v-card-text>
                            <div class="top-line d-flex align-center mb-2">
                              <v-icon color="primary">mdi-clock-outline</v-icon>
                              <span class="ml-2 text-body-1 font-weight-bold">{{ a.Hora }}</span>
                            </div>
                            <div class="solicitante-line text-medium-emphasis font-weight-bold text-primary">Solicitante: {{ a.solicitante }}</div>
                            <div class="trello-badges mt-2">
                              <v-chip v-if="a.Infra && a.Infra.nome" color="primary" variant="tonal" size="medium">Infra: {{ a.Infra.nome }}</v-chip>
                              <v-chip v-if="Array.isArray(a.Equipamentos) && a.Equipamentos.length" size="medium" color="primary" variant="tonal">Equipamentos: {{ a.Equipamentos.map(e => e.nome || e).join(', ') }}</v-chip>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-card class="trello-column" elevation="1" rounded="lg">
                      <v-card-title class="d-flex align-center justify-space-between">
                        <span>Noite</span>
                        <v-chip size="small" variant="tonal">{{ periods.evening.length }}</v-chip>
                      </v-card-title>
                      <v-divider></v-divider>
                      <v-card-text class="agendamentos-list">
                        <v-card
                          v-for="(a, idx) in periods.evening"
                          :key="a._id"
                          :class="['trello-card', 'mb-3', getStatusClass(a)]"
                          elevation="2"
                          rounded="lg"
                          :style="getStatusStyle(a)"
                          variant="tonal"
                          :color="getCardColor(a)"
                        >
                          <v-card-text>
                            <div class="top-line d-flex align-center mb-2">
                              <v-icon color="primary">mdi-clock-outline</v-icon>
                              <span class="ml-2 text-body-1 font-weight-bold">{{ a.Hora }}</span>
                            </div>
                            <div class="solicitante-line text-medium-emphasis font-weight-bold text-primary">Solicitante: {{ a.solicitante }}</div>
                            <div class="trello-badges mt-2">
                              <v-chip v-if="a.Infra && a.Infra.nome" color="primary" variant="tonal" size="medium">Infra: {{ a.Infra.nome }}</v-chip>
                              <v-chip v-if="Array.isArray(a.Equipamentos) && a.Equipamentos.length" size="medium" color="primary" variant="tonal">Equipamentos: {{ a.Equipamentos.map(e => e.nome || e).join(', ') }}</v-chip>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { getAgendamentosByDate } from '../../services/agendamentoService.js'

const agendamentos = ref([])
const loading = ref(false)
const selectedDate = ref('')
const periods = ref({ morning: [], afternoon: [], evening: [] })

const hojeStr = () => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const fetchByDate = async () => {
  loading.value = true
  try {
    if (!selectedDate.value) selectedDate.value = hojeStr()
    const data = await getAgendamentosByDate(selectedDate.value)
    agendamentos.value = Array.isArray(data) ? data : []
    rebuildColumns()
  } catch (e) {
    agendamentos.value = []
  } finally {
    loading.value = false
  }
}

const filtered = computed(() => {
  return (agendamentos.value || []).filter(a => {
    const hasInfra = !!(a.Infra && a.Infra.nome)
    const hasEquips = Array.isArray(a.Equipamentos) && a.Equipamentos.length > 0
    return hasInfra || hasEquips
  })
})

const getHour = (h) => {
  if (!h) return 0
  const parts = String(h).split(':')
  return parseInt(parts[0]) || 0
}

const rebuildColumns = () => {
  periods.value.morning = []
  periods.value.afternoon = []
  periods.value.evening = []
  const sorted = [...filtered.value].sort((a, b) => getHour(a.Hora) - getHour(b.Hora))
  sorted.forEach(a => {
    const hr = getHour(a.Hora)
    if (hr < 12) {
      periods.value.morning.push(a)
    } else if (hr < 18) {
      periods.value.afternoon.push(a)
    } else {
      periods.value.evening.push(a)
    }
  })
}

const makeManausMs = (dateStr, timeStr) => {
  const [h, m] = String(timeStr || '00:00').split(':')
  const hh = String(parseInt(h || '0')).padStart(2, '0')
  const mm = String(parseInt(m || '0')).padStart(2, '0')
  const iso = `${dateStr}T${hh}:${mm}:00-04:00`
  return new Date(iso).getTime()
}

const getNowManausMs = () => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Manaus',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(new Date())
  const v = t => parts.find(p => p.type === t)?.value || '00'
  const iso = `${v('year')}-${v('month')}-${v('day')}T${v('hour')}:${v('minute')}:${v('second')}-04:00`
  return new Date(iso).getTime()
}

const getStatusClass = (a) => {
  const dateStr = selectedDate.value || hojeStr()
  const scheduled = makeManausMs(dateStr, a.Hora)
  const nowMs = getNowManausMs()
  return scheduled < nowMs ? 'card-past' : 'card-upcoming'
}

const getStatusStyle = (a) => {
  const past = getStatusClass(a) === 'card-past'
  return past
    ? { backgroundColor: 'rgba(76, 175, 80, 0.12)', borderLeft: '4px solid rgba(76, 175, 80, 0.7)' }
    : { backgroundColor: 'rgba(255, 193, 7, 0.12)', borderLeft: '4px solid rgba(255, 193, 7, 0.7)' }
}

const getCardColor = (a) => {
  return getStatusClass(a) === 'card-past' ? 'success' : 'warning'
}


watch(filtered, () => {
  rebuildColumns()
})

onMounted(() => {
  selectedDate.value = hojeStr()
  fetchByDate()
})
</script>

<style scoped>
.agendamentos-list {
  max-height: 60vh;
  overflow-y: auto;
}
.trello-column {
  min-height: 40vh;
}
.trello-card {
  transition: all 0.2s ease;
  border-left: 4px solid rgb(var(--v-theme-primary));
}
.trello-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0,0,0,0.08);
}
.trello-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.top-line {
  display: flex;
  align-items: center;
}
.solicitante-line {
  display: block;
}
.card-past {
  background-color: rgba(76, 175, 80, 0.12);
}
.card-upcoming {
  background-color: rgba(255, 193, 7, 0.12);
}
</style>
