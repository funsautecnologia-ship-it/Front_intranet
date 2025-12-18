<template>
  <v-card color="surface">
    <v-data-table-virtual
      :headers="headers"
      :items="tickets"
      :items-per-page="5"
      :search="search"
      class="ticket-list"
    >
      <template v-slot:top>
        <v-toolbar flat color="surface">
          <v-toolbar-title class="text-primary">Lista de Chamados</v-toolbar-title>
          <v-spacer></v-spacer>
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

      <template v-slot:item="{ item: ticket }">
        <tr>
          <td class="text-on-surface">{{ ticket._id || '-' }}</td>
          <td class="text-on-surface">{{ ticket.title || '-' }}</td>
          <td class="text-on-surface">{{ ticket.description || '-' }}</td>
          <td class="text-on-surface">{{ ticket.priority || '-' }}</td>
          <td>
            <span :class="ticket.status === 'closed' ? 'text-success' : 'text-warning'">
              {{ ticket.status || '-' }}
            </span>
          </td>
          <td class="text-on-surface">
            {{ ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : '-' }}
          </td>
          <td class="text-on-surface">
            {{ ticket.setor ? ticket.setor: '-' }} 
          </td>
          <td class="text-on-surface">
            {{ ticket.createdBy || '-' }}
          </td>
          <td class="text-center" v-if="user && user.role === 'admin'">
            <v-btn
              v-if="route.name === 'abertos'"
              @click="viewTicket(ticket._id)"
              color="primary"
              variant="flat"
              class="mr-2"
            >Visualizar</v-btn>
            <v-btn 
              v-if="route.name === 'abertos'"
              @click="deleteTicket(ticket._id)"
              color="error"
              variant="flat"
            >Excluir</v-btn>
          </td>
        </tr>
      </template>

      <template v-slot:no-data>
        <v-alert :value="true" color="error" icon="mdi-alert-circle-outline">
          Nenhum chamado encontrado.
        </v-alert>
      </template>
    </v-data-table-virtual>
  </v-card>
</template>

<script>
import { computed, onMounted, ref, watch, inject, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
export default {
  name: 'GetTicket',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const socket = inject('$socket');

    if (!socket) {
      console.error('Socket.IO não foi injetado corretamente. Verifique a configuração no main.js.');
    }

    const tickets = computed(() => store.state.tickets);
    const search = ref('');
    const status = ref('');
    const headers = [
      { title: 'Número do Chamado', value: '_id' },
      { title: 'Título', value: 'title' },
      { title: 'Descrição', value: 'description' },
      { title: 'Prioridade', value: 'priority' },
      { title: 'Status', value: 'status' },
      { title: 'Data de Abertura', value: 'createdAt' },
      {title:  'Setor', value: 'setor'},
      { title: 'Solicitante', value: 'createdBy' },
      { title: 'Ações', value: 'actions' },
    ];

    const loadTickets = async () => {
      if (!user.value) return;
      try {
        
        if (route.name === 'chamados') {
          await store.dispatch('fetchTickets');
        } else if (route.name === 'abertos') {
          status.value = 'open';
          await store.dispatch('fetchTicketsByStatus', status.value);
        }
      } catch (error) {
        store.dispatch('triggerSnackbar', {
          text: 'Erro ao carregar os tickets.',
          color: 'error',
        });
      }
    };

    const viewTicket = (id) => {
      router.push({ name: 'view-ticket', params: { id } });
    };

    const deleteTicket = async (id) => {
      try {
        await store.dispatch('deleteTicket', id);
        store.dispatch('triggerSnackbar', {
          text: 'Chamado excluído com sucesso.',
          color: 'success',
        });
      } catch (error) {
        store.dispatch('triggerSnackbar', {
          text: 'Erro ao excluir o chamado.',
          color: 'error',
        });
      }
    };

    const handleSocketEvents = () => {
      if (!socket) return;
      socket.on('ticket-created', (newTicket) => {
        const ticket = newTicket.ticket;
        const createdID = ticket.createdBy._id;
        ticket.createdBy = ticket.createdBy.name;
        // Atualiza só se for admin ou criador do ticket
        if (
          user.value &&
          (
            user.value.role === 'admin' ||
            (user.value._id === createdID)
          )
        ) {
          // Adiciona o novo ticket à lista de tickets
          store.commit('setTickets', [...store.state.tickets, ticket]);
          store.dispatch('triggerSnackbar', {
            text: 'Novo chamado recebido: ' + ticket.title,
            color: 'success',
          });
        }
      });
    };

    

    onMounted(() => {
      loadTickets();
      handleSocketEvents();
    });

    onUnmounted(() => {
      //limpar ticket
      if (!socket) return;
      socket.off('ticket-created');
    });

    watch(
      () => route.name,
      () => {
       
           loadTickets();
        
      }
    );

    // Atualize a referência do usuário para ser reativa ao Vuex
    const user = computed(() => store.state.user);

    // Redireciona para login se user for null/undefined
   

    return {
      tickets,
      viewTicket,
      deleteTicket,
      headers,
      search,
      route,
      user,
    };
  },
};
</script>

<style>
.ticket-list table {
  width: 100%;
  border-collapse: collapse;
}
.ticket-list th, .ticket-list td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
.ticket-list th {
  background-color: var(--v-theme-surface);
  color: var(--v-theme-on-surface);
}
.ticket-list td {
  background-color: var(--v-theme-surface);
  color: var(--v-theme-on-surface);
}
</style>
