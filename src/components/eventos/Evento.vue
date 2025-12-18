<template>
  <v-container fluid>
    <v-row>
      <!-- Conteúdo principal -->
      <v-col cols="12" md="8" class="mx-auto">
        <v-sheet
          elevation="3"
          rounded="xl"
          class="pa-6"
          max-width="900"
          style="margin-top: 32px;"
        >
          <v-row align="start" no-gutters>
            <!-- Imagem -->
            <v-col cols="12" md="4" class="pr-md-4 mb-4 mb-md-0">
              <v-img
                :src="event?.img"
                :alt="event?.title"
                height="220"
                cover
                class="rounded-lg elevation-1"
              ></v-img>
            </v-col>

            <!-- Texto -->
            <v-col cols="12" md="8">
              <div class="text-h5 font-weight-bold mb-2 text-primary">
                {{ event?.title }}
              </div>
              <v-divider class="mb-4" />
              <div
                v-html="event?.description"
                class="text-body-1"
                style="word-break:break-word; overflow-wrap:break-word;"
              ></div>
            </v-col>
          </v-row>
        </v-sheet>
      </v-col>

      <!-- Lateral -->
      <v-col cols="12" md="4">
        <v-card elevation="3" class="pa-4 mt-8 rounded-xl" color="surface">
          <div class="font-weight-bold text-success mb-3 text-subtitle-1">
            Outros eventos
          </div>

          <v-list density="compact" nav class="rounded">
            <v-list-item
              v-for="item in recentEvents"
              :key="item._id"
              @click="showEvent(item._id)"
              class="cursor-pointer hover-list"
            >
              <v-avatar v-if="item.img" size="48">
                <v-img
                  :src="item.img"
                  :alt="item.title"
                  height="48"
                  width="48"
                  cover
                  class="rounded"
                />
              </v-avatar>

              <v-list-item-title class="text-primary">
                {{ item.title.length > 40 ? item.title.slice(0, 40) + '...' : item.title }}
              </v-list-item-title>
            </v-list-item>

            <v-divider v-if="recentEvents.length > 1" class="my-2" />
          </v-list>

          <v-btn
            class="mt-4"
            color="info"
            variant="flat"
            rounded
            block
            @click="exploreMore"
            aria-label="Explorar todos os eventos"
          >
            <v-icon left>mdi-magnify</v-icon>
            <span class="hidden-sm-and-down">Explorar todos os eventos</span>
            <span class="hidden-md-and-up">Ver eventos</span>
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchEventById, fetchEvents } from '../../services/eventServices'

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const event = ref(null)
    const recentEvents = ref([])

    const loadEvent = async (id = null) => {
      try {
        const eventId = id || route.params.id
        event.value = await fetchEventById(eventId)
      } catch {
        event.value = null
      }
    }

    const loadRecentEvents = async () => {
      try {
        const events = await fetchEvents()
        recentEvents.value = events
          .filter(e => e._id !== route.params.id)
          .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
          .slice(0, 5)
      } catch {
        recentEvents.value = []
      }
    }

    const showEvent = async (id) => {
      await router.push({ name: 'showEvento', params: { id } })
      await loadEvent(id)
      await loadRecentEvents()
    }

    const exploreMore = () => {
      // Redireciona para a página de eventos
       router.push({name:'listevent'})
    }

    onMounted(() => {
      loadEvent()
      loadRecentEvents()
    })

    return {
      event,
      recentEvents,
      showEvent,
      exploreMore
    }
  },
}
</script>

<style scoped>
.hover-list:hover {
  background: #f5f5f5;
  transition: background 0.2s;
}
</style>