<template>
     <v-card color="surface">
        <v-card-title class="headline">Visualizar Chamado</v-card-title>
        <v-card-subtitle>Detalhes do Chamado</v-card-subtitle>
        
        <v-card-text v-if="ticket">
            <p><strong>Numero do Chamado:</strong> {{ ticket._id }}</p>
            <p><strong>Título:</strong> {{ ticket.title }}</p>
            <p><strong>Descrição:</strong> {{ ticket.description }}</p>
            <p><strong>Prioridade:</strong> {{ ticket.priority }}</p>
            <p><strong>Status:</strong> <span :class="ticket.status === 'closed' ? 'text-success' : 'text-warning'">{{ ticket.status }}</span></p>
            <div>
              
              <v-form ref="eventForm" v-model="valid">
                <v-text-field
                  v-model="newTicket.diagnostic"
                  label="Diagnóstico"
                  required
                  color="primary"
                ></v-text-field>

                <v-select
                  v-model="newTicket.servicoTipo"
                  :items="servicoTipos || []"
                  :item-title="'nome'"
                  :item-value="'_id'"
                  label="Tipo de Serviço"
                  required
                  color="primary"
                ></v-select>
               
                <v-btn
                  color="primary"
                  :disabled="!valid"
                  @click="finalizeTicket"
                >
                  Finalizar Chamado
                </v-btn>
              </v-form>
            </div>
           
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" @click="$router.push({name:'abertos'})">Voltar</v-btn>
        </v-card-actions>
    </v-card>
    
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getTicketById, updateTicket } from '../../services/supportTicket';
import { getServicoTipos } from '../../services/servicesType';

export default {
  name: 'ViewTicket',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const diagnosis = ref('');
    const valid = ref(true); // Variável para controle de validação do formulário
    const ticket = ref(null); // Inicializar ticket como nulo
    const id = route.params.id; // Obter o ID do ticket da rota
    const servicoTipos = ref([]); // Inicializar servicoTipos como um array vazio
    const newTicket = ref({
      diagnostic: '',
      status: 'closed',
      servicoTipo: null,
    })


    const loadTicket = async () => {
      try {
        const response = await getTicketById(route.params.id); // Chamar a função para obter o ticket
        ticket.value = response.data;
      } catch (error) {
        console.error('Erro ao carregar o chamado:', error);
      }
    };

    const finalizeTicket = async () => {
      if (!newTicket) {
        alert('Por favor, insira um diagnóstico antes de finalizar o chamado.');
        return;
      }
      try {
        // Verifica se o diagnóstico foi preenchido
        const data = {
          diagnostic: newTicket.value.diagnostic,
          status: 'closed',
          servicoTipo: newTicket.value.servicoTipo,
        };

        console.log('Finalizando chamado com dados:', data); // Logar dados para depuração

        await updateTicket(id, { data }); // Chamar a função para atualizar o ticket
        alert('Chamado finalizado com sucesso!');
        router.push({name:'chamados'}); // Redirecionar para a lista de chamados
      } catch (error) {
        console.error('Erro ao finalizar o chamado:', error);
      }
    };
    const loadServicoTipos = async () => {
      try {
        const response = await getServicoTipos();
        servicoTipos.value = response.data;
      } catch (error) {
        console.error('Erro ao carregar tipos de serviço:', error);
      }
    };

    onMounted(() => {
      loadTicket();
      loadServicoTipos();
    });

    return {
      ticket,
      diagnosis,
      finalizeTicket,
      newTicket,
      valid,
      loadServicoTipos,
      servicoTipos,
    };
  },
};
</script>

<style scoped>
.view-ticket {
  max-width: 600px;
  margin: 0 auto;
}
.view-ticket p {
  margin: 0.5em 0;
}
</style>

