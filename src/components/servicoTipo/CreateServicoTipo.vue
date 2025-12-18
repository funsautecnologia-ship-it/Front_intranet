<template>
    <v-row>
        <!-- Formulário para criação de um novo tipo de serviço -->
        <v-col cols="12" md="4" class="mx-auto">
            <v-sheet elevation="3" rounded="xl" class="pa-6" max-width="900" color="#E0F2F1" style="margin-top: 32px;">
                <v-form @submit.prevent>
                    <v-text-field
                        v-model="servicoTipo.nome"
                        label="Nome do Tipo de Serviço"
                        :rules="[value => !!value || 'Campo obrigatório']"
                        required
                        color="#004D40"
                    ></v-text-field>
                    <v-textarea
                        v-model="servicoTipo.descricao"
                        label="Descrição do Tipo de Serviço"
                        :rules="[value => !!value || 'Campo obrigatório']"
                        required
                        color="#004D40"
                    ></v-textarea>
                    <v-btn @click="isEditMode? handleUpdateServicoTipo() : handleCreateServicoTipo()" 
                        class="mt-4"
                        color="#004D40"
                        :disabled="!servicoTipo.nome || !servicoTipo.descricao"
                       
                       
                    > 
                        {{ isEditMode ? 'Atualizar Tipo de Serviço' : 'Criar Tipo de Serviço' }}
                    </v-btn>
                    <v-btn @click="cancelEdit" class="mt-4" color="grey" v-if="isEditMode">
                        Cancelar Edição
                    </v-btn>
                </v-form>
            </v-sheet>
        </v-col>
        <!-- Lista de tipos de serviço existentes -->
        <v-col cols="12" md="4" class="mx-auto">
                    <v-sheet elevation="3" rounded="xl" class="pa-6" color="#E0F2F1" max-width="900" style="margin-top: 32px;">
                        <v-row>
                            <v-col
                                v-for="item in servicoTipos"
                                :key="item._id"
                                cols="12"
                                sm="12"
                                md="12"
                            >
                    <v-card @click="selectServicoTipo(item)" class="ma-2" color="#004D40" text-color="white">
                        <v-row class="d-flex align-center">
                            <v-expansion-panels>
                                    <v-expansion-panel
                                        :title=" item.nome "
                                        class="ma-2"
                                        color="#004D40"
                                        text-color="white"
                                        :text= "item.descricao"
                                    >
                                    </v-expansion-panel>
                            </v-expansion-panels>
                            
                            <v-spacer />
                            <v-btn
                                v-if="!item.hasTickets"
                                color="red"
                                @click.stop="openDelete(item)"
                                class="ma-2"
                            >
                                Excluir
                            </v-btn>

                           
                        </v-row>
                    </v-card>
                        
                    </v-col>
                </v-row>
            </v-sheet>
        </v-col>
        <v-dialog v-model="deleteDialog" max-width="420">
          <v-card>
            <v-card-title>Confirmar exclusão</v-card-title>
            <v-card-text>
              Tem certeza que deseja excluir o serviço
              <strong>{{ deleteTarget?.nome }}</strong>? Esta ação não pode ser desfeita.
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn variant="text" @click="closeDelete">Cancelar</v-btn>
              <v-btn color="error" variant="flat" @click="confirmDelete">Excluir</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
    
    </v-row>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { createServicoTipo,getServicoTipos, deleteServicoTipo, updateServicoTipo } from '../../services/servicesType';

const servicoTipo = ref({
    // Objeto para armazenar os dados do tipo de serviço
    nome: '',
    descricao: ''
});

const isEditMode = ref(false)
const editId = ref(null)
const store = useStore()
const deleteDialog = ref(false)
const deleteTarget = ref(null)

const handleCreateServicoTipo = async () => {
    try {
        await createServicoTipo(servicoTipo.value);
        servicoTipo.value.nome = ''; // Limpa o campo após a criação
        servicoTipo.value.descricao = ''; // Limpa o campo de descrição
        store.dispatch('triggerSnackbar', { text: 'Tipo de serviço criado com sucesso!', color: 'success' })
        await fetchServicoTipos(); // Atualiza a lista de tipos de serviço
    } catch (error) {
        console.error('Erro ao criar tipo de serviço:', error);
        const msg = error?.response?.data?.message || 'Erro ao criar tipo de serviço. Tente novamente.'
        store.dispatch('triggerSnackbar', { text: msg, color: 'error' })
    }
};
const servicoTipos = ref([]);
const fetchServicoTipos = async () => {
    try {
        const response = await getServicoTipos();
        servicoTipos.value = response.data; // Armazena os tipos de serviço obtidos
        console.log('Tipos de serviço carregados:', servicoTipos.value);
    } catch (error) {
        console.error('Erro ao buscar tipos de serviço:', error);
    }
};

const handleDeleteServicoTipo = async (id) => {
    try {
        await deleteServicoTipo(id);
        store.dispatch('triggerSnackbar', { text: 'Tipo de serviço excluído com sucesso!', color: 'success' })
        await fetchServicoTipos(); // Atualiza a lista após exclusão
    } catch (error) {
        console.error('Erro ao excluir tipo de serviço:', error);
        const msg = error?.response?.data?.message || 'Erro ao excluir tipo de serviço. Tente novamente.'
        store.dispatch('triggerSnackbar', { text: msg, color: 'error' })
    }
};

const openDelete = (item) => {
  deleteTarget.value = item
  deleteDialog.value = true
}

const closeDelete = () => {
  deleteDialog.value = false
  deleteTarget.value = null
}

const confirmDelete = async () => {
  const id = deleteTarget.value?._id
  if (!id) return
  await handleDeleteServicoTipo(id)
  closeDelete()
}

const selectServicoTipo = (item) => {
    // Função para selecionar um tipo de serviço, se necessário
    console.log('Tipo de serviço selecionado:', item);
    servicoTipo.value = { ...item }; // Preenche o formulário com os dados do tipo de serviço selecionado
    isEditMode.value = true; // Ativa o modo de edição
    editId.value = item._id; // Armazena o ID do tipo de serviço
};

const handleUpdateServicoTipo = async () => {
   
    try {
        await updateServicoTipo(editId.value, servicoTipo.value);
        store.dispatch('triggerSnackbar', { text: 'Tipo de serviço atualizado com sucesso!', color: 'success' })
        servicoTipo.value = { nome: '', descricao: '' }; // Limpa o formulário
        isEditMode.value = false; // Sai do modo de edição
        editId.value = null; // Limpa o ID armazenado
        await fetchServicoTipos(); // Atualiza a lista após a atualização
    } catch (error) {
        console.error('Erro ao atualizar tipo de serviço:', error);
        const msg = error?.response?.data?.message || 'Erro ao atualizar tipo de serviço. Tente novamente.'
        store.dispatch('triggerSnackbar', { text: msg, color: 'error' })
    }
};

const cancelEdit = () => {
    // Função para cancelar a edição e limpar o formulário
    servicoTipo.value = { nome: '', descricao: '' };
    isEditMode.value = false;
    editId.value = null;
};

onMounted(() => {
    fetchServicoTipos(); // Chama a função para buscar os tipos de serviço ao montar o componente
});
</script>
