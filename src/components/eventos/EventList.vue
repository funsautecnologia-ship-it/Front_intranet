<template>
  <v-container>
    <v-row dense>
      <v-col
        v-for="event in events"
        :key="event._id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card class="mx-auto" max-width="350" style="min-height: 370px; display: flex; flex-direction: column;">
          <!-- Imagem do evento ou placeholder -->
          <v-img
            v-if="event.img"
            :src="event.img"
            height="140"
            cover
            style="border-radius: 4px 4px 0 0;"
          ></v-img>
          <v-img
            v-else
            src="../../../public/card_funsau.jpg"
            height="140"
            cover
            style="border-radius: 4px 4px 0 0;"
          ></v-img>
          <!-- Data do evento -->
          <div style="position:absolute; top:8px; left:8px; background:#219653; color:#fff; border-radius:4px; padding:2px 10px; font-size:0.95em; font-weight:bold; z-index:2;">
            {{ formatDate(event.date) }}
          </div>
          <!-- Título e descrição -->
          <v-card-text style="flex:1;">
            <div style="font-weight:bold; color:#219653; font-size:1.1em; margin-bottom:6px;">
              {{ event.title }}
            </div>
            <div style="color:#333; font-size:0.98em; min-height:48px;">
              {{ event.summary || truncate(event.description, 90) }}
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="orange-lighten-2" text @click="getEvento(event)">
              Ver Detalhes
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              icon
              color="red"
              @click="removeEvent(event._id)"
              v-if="userData?.role === 'admin'"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchEvents, deleteEvent } from '../../services/eventServices'
import { truncate, formatDate } from '../../utils/utils'

export default {
  props: {
    userData: Object,
  },
  setup(props) {
    const events = ref([])
    const router = useRouter()

    const getEvento = (evento) => {
      router.push({ name: 'showEvento', params: { id: evento._id } })
    }

    const loadEvents = async () => {
      try {
        let fetched = await fetchEvents()
        // Ordena por data de criação (mais recente primeiro)
        events.value = Array.isArray(fetched)
          ? [...fetched].sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
          : []
      } catch (error) {
        console.error('Erro ao buscar eventos:', error)
      }
    }

    const removeEvent = async (eventId) => {
      if (props.userData?.role !== 'admin') {
        alert('Apenas administradores podem excluir eventos.')
        return
      }
      try {
        await deleteEvent(eventId)
        events.value = events.value.filter(event => event._id !== eventId)
      } catch (error) {
        console.error('Erro ao remover evento:', error)
      }
    }

    
    onMounted(() => {
      loadEvents()
    })

    return {
      events,
      getEvento,
      removeEvent,
      formatDate,
      truncate,
      userData: props.userData,
    }
  },
}
</script>