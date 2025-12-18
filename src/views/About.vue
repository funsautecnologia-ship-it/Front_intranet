<template>
  <v-main>
    <AppBar
      :toggleDrawer="() => drawer = !drawer"
      :toggleTheme="toggleTheme"
      :isDark="isDark"
      :logout="logout"
    />
    <v-container>
      <v-row>
        <AppDrawer
          v-model:drawer="drawer"
          :userData="userData"
          :filteredItems="filteredItems"
          v-model:open="open"
          v-model:group="group"
          :suport="suport"
          :cruds="cruds"
          :Agendamentos="Agendamentos"
          :openUserDialog="openUserDialog"
        />
        <v-main class="main-content">
          <v-container>
            <router-view :user-data="userData" />
           
          </v-container>
        </v-main>
      </v-row>
    </v-container>
  </v-main>
  <UserEditDialog 
    v-model="userDialog" 
    :user-data="userData" 
    @saved="handleUserSaved"
  />

</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useTheme } from 'vuetify'
import AppBar from '../components/layout/AppBar.vue'
import AppDrawer from '../components/layout/AppDrawer.vue'


import UserEditDialog from '../components/user/UserEditDialog.vue'

const router = useRouter()
const store = useStore()
const theme = useTheme()
const drawer = ref(false)
const group = ref([])
const userData = ref(null)
const open = ref([])
const userDialog = ref(false)
const isDark = ref(theme.global.name.value === 'dark')

// Itens do menu
const items = [
  { title: 'Início', value: 'home', link: 'home', icon: 'mdi-home' },
  { title: 'Tutoriais', value: 'files', link: 'files', icon: 'mdi-file' },
  { title: 'Upload', value: 'uploads', link: 'upload', icon: 'mdi-upload', adminOnly: true },
  { title: 'Videos', value: 'videos', link: 'videos', icon: 'mdi-video' },
  { title: 'Cadastrar usuários', value: 'users', link: 'users', icon: 'mdi-account', adminOnly: true },
  { title: 'Buscar usuários', value: 'user-list', link: 'user-list', icon: 'mdi-account-search', adminOnly: true },
  { title: 'Sobre', value: 'aboutContent', link: 'aboutContent', icon: 'mdi-information' },
  { title: 'Noticias', value: 'listevent', link: 'listevent', icon: 'mdi-calendar' },
  { title: 'Eventos', value: 'eventos', link:'events',  icon: 'mdi-calendar', adminOnly: true},

 
  

  
]
const cruds = [
  ['Abrir', 'mdi-plus-outline','support-ticket'],
  ['Listar', 'mdi-file-outline', 'ticket'],
  ['Abertos', 'mdi-file-outline', 'abertos'],
]

const Agendamentos = [
  ['Listar', 'mdi-calendar-check', 'showAgendamento'],
  ['Cadastrar', 'mdi-calendar-plus', 'CreateAgendamento'],
]

const suport =[
  ['Setores', 'mdi-office-building', 'setor'],
  ['Serviços', 'mdi-cog', 'servico'],
  ['Equipamentos', 'mdi-wrench', 'ManterEquip'],
  ['Infraestrutura', 'mdi-home-city', 'ManterInfra'],
]

// Filtra os itens do menu com base no tipo de usuário
const filteredItems = computed(() => {
  if (!userData.value) return []
  return items.filter(item => !item.adminOnly || userData.value.role === 'admin')
})

const fetchUser = () => {
  try {
    const token = store.state.token
    const user = store.state.user
    if (!token || !user) {
      router.push('/login')
      console.log('Token ou usuário não encontrado, redirecionando para o login')
      return
    }
    userData.value = user
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error)
    router.push('/login')
  }
}

const logout = () => {
  try {
    store.dispatch('logout')
    router.push('/login')
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
  }
}

watch(group, () => {
  drawer.value = false
})

onMounted(() => {
  fetchUser()
})

const navigateToEvents = () => {
   router.push({name:'listevent'})
}

const openUserDialog = () => {
  if (!userData.value) return
  userDialog.value = true
}

const handleUserSaved = (payload) => {
  userData.value.name = payload.name
  userData.value.endereco = payload.endereco
}

const toggleTheme = () => {
  if (theme.global.name.value === 'dark') {
    theme.global.name.value = 'light'
    isDark.value = false
  } else {
    theme.global.name.value = 'dark'
    isDark.value = true
  }
}
</script>

<style>
.main-content {
  height: 500px;
}

@media (max-width: 600px) {
  .v-list-item__action {
    margin-bottom: 4px;
  }
}

.news-panel {
  border-radius: 18px;
  margin-top: 32px;
  background: #fff;
  transition: box-shadow 0.2s, transform 0.2s;
}
.news-panel:hover {
  box-shadow: 0 8px 32px 0 rgba(0,0,0,0.13);
  transform: translateY(-2px) scale(1.01);
  background: #e0f7fa;
}

.v-main {
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f7fa 0%, #f5f5f5 100%);
  position: relative;
}
.v-main::before {
  content: "";
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 0;
  background: url('/logoH.png') no-repeat center center;
  background-size: 320px auto;
  opacity: 0.32;
  pointer-events: none;
  filter: contrast(1.3) brightness(1.15);
}
.v-main > * {
  position: relative;
  z-index: 1;
}

.footer-text {
  color: #0728ac;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}
</style>
