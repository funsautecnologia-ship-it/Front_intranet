<template>
  <v-app>
    <router-view />
    <v-snackbar
      v-model="localSnackbar.show"
      :timeout="snackbar.timeout"
      :color="snackbar.color"
      location="top right"
    >
      {{ snackbar.text }}  <!-- Mude para 'text' -->
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="localSnackbar.show = false">
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
    <FloatingChatButton />
  </v-app>
</template>

<script>
import FloatingChatButton from './components/chmados/FloatingChatButton.vue';
import { inject, onMounted, onUnmounted, computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  components: {
    FloatingChatButton,
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const isAuthenticated = computed(() => store.state.isAuthenticated)
    const snackbar = computed(() => store.state.snackbar)
    const socket = inject('$socket');
    
    const localSnackbar = ref({
      show: false
    });

    // Watch para detectar quando há um novo texto
    watch(() => snackbar.value.text, (newText, oldText) => {
      if (newText && newText !== oldText) {
        localSnackbar.value.show = true;
        
        setTimeout(() => {
          localSnackbar.value.show = false;
        }, snackbar.value.timeout);
      }
    });

    watch(() => localSnackbar.value.show, (show) => {
      if (!show) {
        store.commit('clearSnackbarMessage');
      }
    });

    const goToLogin = () => {
      router.push('/login')
    }

    const logout = () => {
      store.dispatch('logout')
      router.push('/login')
    }

    onMounted(() => {
      if (!socket) return;
      socket.on('ticket-deleted', (payload) => {
        store.commit('setTickets', store.state.tickets.filter(ticket => ticket._id !== payload.ticketId));
      });
    });

    onUnmounted(() => {
      if (!socket) return;
      socket.off('ticket-deleted');
    });

    return {
      isAuthenticated,
      goToLogin,
      logout,
      snackbar,
      localSnackbar
    }
  },
}
</script>