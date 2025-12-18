<template>
  <div>
    <!-- Botão flutuante de chat, visível apenas se o usuário estiver logado -->
    <v-btn
      v-if="isLoggedIn"
      fab
      color="primary"
      class="floating-chat-btn"
      @click="showChat = true"
    >
      <v-icon>mdi-chat</v-icon>
    </v-btn>
    <!-- Componente de chat, aberto quando showChat é true -->
    <Chat v-if="showChat" :user="userId" @close="showChat = false" />
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import Chat from './Chat.vue';

export default {
  name: 'FloatingChatButton',
  components: { Chat },
  setup() {
    const store = useStore();
    // Controla a exibição do chat (modal)
    const showChat = ref(false);

    // Verifica se o usuário está logado (ajuste conforme sua autenticação)
    const isLoggedIn = computed(() => !!store.state.user);

    // Nome do usuário logado (não está sendo usado diretamente, mas pode ser útil)
    const userName = computed(() => store.state.user?.name || 'Usuário');

    // Identificador do usuário logado (id ou nome)
    const userId = computed(() => store.state.user?._id || store.state.user?.name || 'Usuário');

    return {
      showChat,      // Controla se o chat está aberto
      isLoggedIn,    // Indica se o usuário está logado
      userName,      // Nome do usuário (opcional)
      userId,        // ID do usuário (usado para identificar quem está enviando mensagem)
    };
  },
};
</script>

<style scoped>
/* Estiliza o botão para ficar fixo no canto inferior direito da tela */
.floating-chat-btn {
  position: fixed;
  right: 32px;
  bottom: 32px;
  z-index: 9999;
}
</style>
