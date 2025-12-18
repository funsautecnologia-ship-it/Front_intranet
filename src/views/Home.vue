<template>
  <v-container class="home-bg fill-height" fluid>
    <v-row justify="center" align="center" class="mb-8">
      <v-col cols="12" class="text-center">
        <v-avatar size="80" class="mb-3" color="teal lighten-2">
          <v-icon size="60" color="white">mdi-hospital-building</v-icon>
        </v-avatar>
        <h1 class="display-1 font-weight-bold text-teal mb-2">Bem-vindo à Intranet Hospitalar</h1>
        <div class="subtitle-1 text-grey-darken-1 mb-6">
          Acesse informações, arquivos e acompanhe o movimento do hospital em tempo real.
        </div>
      </v-col>
    </v-row>
    <v-row justify="center" align="stretch" class="home-cards-row">
      <!-- Chamados Abertos (apenas para admin) -->
      <v-col
        v-if="isAdmin"
        cols="12"
        sm="6"
        md="4"
        class="d-flex"
      >
        <v-card class="home-card teal-gradient" elevation="10" outlined @click="$router.push({ name: 'abertos' })">
          <v-card-title class="justify-center">
            <v-icon size="36" color="white" class="mr-2">mdi-ticket</v-icon>
            <span class="headline white--text">Chamados Abertos</span>
          </v-card-title>
          <v-card-text class="text-center">
            <span class="home-number">{{ chamadosAbertos }}</span>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- Arquivos Enviados -->
      <v-col
        :cols="isAdmin ? 12 : 12"
        :sm="isAdmin ? 6 : 6"
        :md="isAdmin ? 4 : 6"
        class="d-flex"
      >
        <v-card class="home-card blue-gradient" elevation="10" outlined @click="$router.push({ name: 'files'})">
          <v-card-title class="justify-center">
            <v-icon size="36" color="white" class="mr-2">mdi-file</v-icon>
            <span class="headline white--text">Tutoriais</span>
          </v-card-title>
          <v-card-text class="text-center">
            <span class="home-number">{{ arquivosEnviados }}</span>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- Painel de Vídeos -->
      <v-col
        :cols="isAdmin ? 12 : 12"
        :sm="isAdmin ? 6 : 6"
        :md="isAdmin ? 4 : 6"
        class="d-flex"
      >
        <v-card class="home-card green-gradient" elevation="10" outlined @click="$router.push({ name: 'videos' })">
          <v-card-title class="justify-center">
            <v-icon size="36" color="white" class="mr-2">mdi-video</v-icon>
            <span class="headline white--text">Vídeos</span>
          </v-card-title>
          <v-card-text class="text-center">
            <span class="home-number">
              <v-icon size="28" color="white">mdi-play-circle-outline</v-icon>
            </span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Painel de busca de notícias: sempre abaixo dos outros cards -->
    <v-row justify="center" class="mt-4">
      <v-col cols="12" md="8">
        <v-card class="news-panel" elevation="8" @click="navigateToEvents" style="cursor:pointer;">
          <v-card-title class="headline text-primary">
            <v-icon left color="primary" class="mr-2">mdi-newspaper-variant-outline</v-icon>
            Notícias / Eventos
          </v-card-title>
          <v-card-text>
            Clique aqui para ver a lista de notícias e eventos recentes.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center" class="mt-8">
      <v-col cols="12" md="8" class="text-center">
        <v-alert type="info" border="start" colored-border elevation="2" class="pa-4 home-alert">
          <v-icon left color="teal">mdi-information</v-icon>
          <span class="font-weight-medium">Dica:</span>
          Use o menu lateral para navegar entre arquivos, chamados, eventos e muito mais!
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import api from '../services/api'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const store = useStore()
    const chamadosAbertos = ref(0)
    const arquivosEnviados = ref(0)
    const router = useRouter()

    // Busca quantidade de chamados abertos
    const fetchChamadosAbertos = async () => {
      try {
        const res = await api.get('/tickets/status/open')
        chamadosAbertos.value = Array.isArray(res.data) ? res.data.length : 0
      } catch {
        chamadosAbertos.value = 0
      }
    }

    // Busca quantidade de arquivos enviados
    const fetchArquivos = async () => {
      try {
        const res = await api.get('/files')
        arquivosEnviados.value = Array.isArray(res.data) ? res.data.length : 0
      } catch {
        arquivosEnviados.value = 0
      }
    }

    // Computed para verificar se é admin
    const isAdmin = computed(() => {
      return store.state.user && store.state.user.role === 'admin'
    })

    const navigateToEvents = () => {
      router.push({ name: 'listevent' }) // Redireciona para a página de eventos/notícias
    }

    onMounted(() => {
      fetchChamadosAbertos()
      fetchArquivos()
    })

    return {
      chamadosAbertos,
      arquivosEnviados,
      isAdmin,
      navigateToEvents,
    }
  }
}
</script>

<style scoped>
.home-bg {
  min-height: 100vh;
  padding-top: 40px;
  padding-bottom: 40px;
  background: linear-gradient(135deg, #e0f7fa 0%, #f5f5f5 100%);
  position: relative;
}
.home-bg::before {
  content: "";
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 0;
  background: url('/logoH.png') no-repeat center center;
  background-size: 320px auto;
  opacity: 0.18; /* aumente para deixar a imagem mais forte (0.08 -> 0.18) */
  pointer-events: none;
  /* Para reforçar ainda mais, pode usar filter: contrast(1.2) brightness(1.1); */
  filter: contrast(1.2) brightness(1.1);
}
.v-container, .home-bg > * {
  position: relative;
  z-index: 1;
}
.display-1 {
  font-size: 2.8rem;
  letter-spacing: 1px;
}
.text-teal {
  color: #009688 !important;
}
.home-cards-row {
  margin-top: 0;
  margin-bottom: 0;
}
.home-card {
  border-radius: 18px;
  transition: box-shadow 0.2s, transform 0.2s;
  cursor: pointer;
  min-height: 180px;
  max-width: 400px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.07);
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
@media (max-width: 960px) {
  .home-card {
    max-width: 100%;
    min-height: 140px;
  }
}
@media (max-width: 600px) {
  .home-card {
    max-width: 100%;
    min-height: 120px;
    font-size: 1rem;
  }
}
.home-card:hover {
  box-shadow: 0 8px 32px 0 rgba(0,0,0,0.13);
  transform: translateY(-4px) scale(1.03);
}
.teal-gradient {
  background: linear-gradient(135deg, #009688 80%, #26a69a 100%);
}
.blue-gradient {
  background: linear-gradient(135deg, #1976d2 80%, #64b5f6 100%);
}
.green-gradient {
  background: linear-gradient(135deg, #43a047 80%, #66bb6a 100%);
}
.headline {
  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}
.white--text {
  color: #fff !important;
}
.home-number {
  font-size: 3.2rem;
  font-weight: bold;
  color: #fff;
  text-shadow: 1px 2px 8px rgba(0,0,0,0.13);
}
@media (max-width: 600px) {
  .home-number {
    font-size: 2rem;
  }
}
.home-alert {
  border-radius: 12px;
  font-size: 1.1rem;
  background: #e0f2f1;
}
.news-panel {
  border-radius: 18px;
  margin-bottom: 32px;
  background: #fff;
  transition: box-shadow 0.2s, transform 0.2s;
}
.news-panel:hover {
  box-shadow: 0 8px 32px 0 rgba(0,0,0,0.13);
  transform: translateY(-2px) scale(1.01);
  background: #e0f7fa;
}
</style>