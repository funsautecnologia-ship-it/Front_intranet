<template>
  <v-card color="surface" class="pa-4">
    <v-row>
      <v-col cols="12" md="4">
        <v-select
          v-model="status"
          :items="statusOptions"
          label="Status"
          clearable
        ></v-select>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="date"
          label="Data"
          type="date"
          clearable
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4" class="d-flex align-end">
        <v-btn color="primary" @click="buscarChamados" :disabled="!status && !date">
          Buscar Chamados
        </v-btn>
      </v-col>
    </v-row>

    <v-divider class="my-4"></v-divider>

    <v-data-table
      v-if="tickets.length"
      :headers="headers"
      :items="tickets"
      :items-per-page="10"
      :search="search"
      class="ticket-search-list"
    >
    <template v-slot:top>
        <v-toolbar flat color="surface">
          <v-toolbar-title class="text-primary">Lista de Chamados</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="secondary" variant="flat" @click="exportDetailedPDF" prepend-icon="mdi-file-document-outline" class="mr-2">
            Exportar
          </v-btn>
          <v-text-field
            v-model="search"
            label="Pesquisar"
            append-icon="mdi-magnify"
            single-line
            hide-details
            class="mx-4"
            color="primary"
            :placeholder="'Pesquisar por título, descrição ou prioridade'"
          ></v-text-field>
        </v-toolbar>
      </template>
      <template v-slot:item.status="{ item }">
        <span :class="item.status === 'closed' ? 'text-success' : 'text-warning'">
          {{ item.status || '-' }}
        </span>
      </template>
      <template v-slot:item.createdAt="{ item }">
        {{ new Date(item.createdAt).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }) }}
      </template>
      <template v-slot:no-data>
        <v-alert type="info" border="start" color="primary" variant="tonal">
          Nenhum chamado encontrado para os filtros selecionados.
        </v-alert>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import api from '../../services/api'
import { usePdfExport } from '../../composables/usePdfExport.js'

const store = useStore()
const status = ref('')
const date = ref('')
const tickets = ref([])
const search = ref('');
const { exportDetailsToPDF } = usePdfExport()

const statusOptions = [
  { title: 'Aberto', value: 'open' },
  { title: 'Fechado', value: 'closed' },
  // Adicione outros status se necessário
]

const headers = [
  { title: 'Número', value: '_id' },
  { title: 'Título', value: 'title' },
  { title: 'Descrição', value: 'description' },
  { title: 'Prioridade', value: 'priority' },
  { title: 'Status', value: 'status' },
  { title: 'Data de Abertura', value: 'createdAt' },
  { title: 'Solicitante', value: 'createdBy' },
]

const filteredTickets = computed(() => {
  if (!search.value) return tickets.value
  const term = search.value.toLowerCase()
  return tickets.value.filter(t =>
    (t.title || '').toLowerCase().includes(term) ||
    (t.description || '').toLowerCase().includes(term) ||
    (t.priority || '').toLowerCase().includes(term) ||
    (t.status || '').toLowerCase().includes(term) ||
    (t.createdBy || '').toLowerCase().includes(term) ||
    String(t._id || '').toLowerCase().includes(term)
  )
})

const buildSubtitle = () => {
  const parts = []
  if (status.value) {
    const label = statusOptions.find(s => s.value === status.value)?.title || status.value
    parts.push(`Status: ${label}`)
  }
  if (date.value) parts.push(`Data: ${date.value}`)
  return parts.length ? parts.join(' | ') : ''
}


const exportDetailedPDF = () => {
  try {
    const items = filteredTickets.value
    const fields = [
      { label: 'Número', key: '_id' },
      { label: 'Título', key: 'title' },
      { label: 'Descrição', key: 'description' },
      { label: 'Prioridade', key: 'priority' },
      { label: 'Status', key: 'status' },
      { label: 'Data de Abertura', getter: (i) => i.createdAt ? new Date(i.createdAt).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }) : '-' },
      { label: 'Solicitante', key: 'createdBy' }
    ]

    exportDetailsToPDF({
      title: 'Chamados - Detalhado',
      subtitle: buildSubtitle(),
      items,
      fields,
      fileName: 'chamados_detalhado',
      orientation: 'portrait'
    })

    store.dispatch('triggerSnackbar', { text: 'PDF detalhado exportado!', color: 'success' })
  } catch (error) {
    store.dispatch('triggerSnackbar', { text: 'Erro ao exportar PDF detalhado.', color: 'error' })
  }
}

const buscarChamados = async () => {
  let response
  try {
    const query = []
    if (status.value) query.push(`status=${status.value}`)
    if (date.value) query.push(`date=${date.value}`)
    const queryString = query.length ? `?${query.join('&')}` : ''
    const token = store.state.token // ou store.getters['auth/token'] se usar getter

     response = await api.get(
      `/tickets${queryString}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    tickets.value = response.data
    if(tickets.value.length === 0) {
      // Se não houver tickets, exibe uma mensagem
      store.dispatch('triggerSnackbar', {
        text: 'Nenhum chamado encontrado para essa data ou com esse estado.',
        color: 'info',
      })
      tickets.value = []
    }
  } catch (error) {
    
    tickets.value = []
    store.dispatch('triggerSnackbar', {
      text: 'Erro ao buscar chamados.',
      color: 'error',
    })
  }
}
</script>

<style scoped>
.ticket-search-list table {
  width: 100%;
  border-collapse: collapse;
}
.ticket-search-list th,
.ticket-search-list td {
  padding: 8px;
  text-align: left;
}
.ticket-search-list thead th:nth-child(1),
.ticket-search-list tbody td:nth-child(1) {
  width: 180px;
  white-space: nowrap;
}
.ticket-search-list thead th:nth-child(2),
.ticket-search-list tbody td:nth-child(2) {
  min-width: 220px;
  word-break: break-word;
  overflow-wrap: anywhere;
}
</style>
