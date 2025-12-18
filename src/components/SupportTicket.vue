<template>
  <v-card class="mx-auto" max-width="1000" style="margin-top: 20px;" color="surface">
    <v-toolbar-title class="text-primary">Suporte</v-toolbar-title>
    <v-form @submit.prevent="submitTicket">
      <v-text-field
        v-model="ticket.title"
        label="Título"
        :rules="[value => !!value || 'Campo obrigatório']"
        required
        color="primary"
      ></v-text-field>
      <v-textarea
        v-model="ticket.description"
        label="Descrição"
        :rules="[value => !!value || 'Campo obrigatório']"
        required
        color="primary"
      ></v-textarea>
      <v-text-field
        v-model="ticket.createdBy"
        label="Nome do Solicitante"
        :rules="[value => !!value || 'Campo obrigatório']"
        required
        color="primary"
      >

      </v-text-field>
      <v-select
        v-model="ticket.priority"
        :items="['Baixa', 'Media', 'Alta']"
        label="Prioridade"
        :rules="[value => !!value || 'Campo obrigatório']"
        required
        color="primary"
      ></v-select>
      <v-select
        v-model="ticket.setor"
        :items="setores || []"
        :item-title="'nome'"
        :item-value="'_id'"
        label="Setor"
        color="primary"
      />
      
      <v-btn type="submit" color="primary" variant="flat">Abrir Chamado</v-btn>
    </v-form>
  </v-card>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { createTicket } from '../services/supportTicket';
import {getSetores} from '../services/setor';

/**
 * Componente para abertura de chamados de suporte.
 * Permite ao usuário criar um chamado preenchendo título, descrição e prioridade.
 */
export default {
  name: 'SupportTicket',
  setup() {
    const store = useStore();
    const setores = ref([]);
    /**
     * Dados do chamado a ser criado.
     */
    const ticket = ref({
      title: '',
      description: '',
      priority: 'Baixa',
      createdBy:'',
      UserId: null,
      setor: null,
    });
   

    /**
     * Envia o chamado para o backend após validação.
     * Exibe mensagens de sucesso ou erro via snackbar.
     */
    const submitTicket = () => {
      // Validação dos campos obrigatórios
      if (!ticket.value.title || !ticket.value.description) {
        store.dispatch('triggerSnackbar', {
          text: 'Preencha todos os campos obrigatórios.',
          color: 'error',
        });
        return;
      }
      if (!['Baixa', 'Media', 'Alta'].includes(ticket.value.priority)) {
        store.dispatch('triggerSnackbar', {
          text: 'Selecione uma prioridade válida.',
          color: 'error',
        });
        return;
      }

      // Define o ID do usuário
      ticket.value.UserId = store.state.user?.id;

      // Cria o chamado
      createTicket(ticket.value)
        .then(() => {
          store.dispatch('triggerSnackbar', {
            text: 'Chamado criado com sucesso!',
            color: 'success',
          });
          // Limpa o formulário após sucesso
          ticket.value = { title: '', description: '', priority: 'Baixa', UserId: null };
        })
        .catch(() => {
          store.dispatch('triggerSnackbar', {
            text: 'Erro ao criar chamado. Tente novamente.',
            color: 'error',
          });
        });
    };

    // Carrega os setores disponíveis
    getSetores()
      .then(response => {
        const all = Array.isArray(response.data) ? response.data : [];
        setores.value = all.filter(s => s && (s.active === undefined ? true : s.active === true));
        console.log('Setores carregados (apenas ativos):', setores.value);
      })
      .catch(() => {
        store.dispatch('triggerSnackbar', {
          text: 'Erro ao carregar setores. Tente novamente.',
          color: 'error',
        });
      });

    return {
      ticket,
      setores,
      submitTicket,
    };
  },
};
</script>

<style>
/* Se quiser, adicione estilos personalizados aqui */
</style>
