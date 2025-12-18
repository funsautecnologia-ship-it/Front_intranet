<template>
    <v-row>
        <v-col cols="12" sm="6" md="4">
           
            <v-card color="surface">
                <v-card-title class="headline">Cadastrar Equipamento</v-card-title>
                    <v-card-text>
                        <v-form @submit.prevent="submitForm">
                            <v-text-field
                            v-model="form.nome"
                            label="Nome do Equipamento"
                            required
                            color="primary"
                            ></v-text-field>
                    
                            <v-textarea
                            v-model="form.descricao"
                            label="Descrição"
                            required
                            color="primary"
                            ></v-textarea>
                    
                            <v-text-field
                            v-model.number="form.quantidade"
                            label="Quantidade"
                            type="number"
                            min="1"
                            required
                            color="primary"
                            ></v-text-field>
                    
                            <v-btn 
                            v-if="!isEditMode"
                            color="primary"
                            type="submit">Cadastrar Equipamento</v-btn>
                            <v-btn 
                            v-else   
                            color="primary"
                            @click="updateEquipamento">Atualizar Equipamento</v-btn>   
                           
                        </v-form>
                    </v-card-text>
            </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="8">
            <v-card color="surface">
                <v-card-title class="headline">Lista de Equipamentos</v-card-title>
                <v-card-text>
                    <v-data-table
                        :headers="[
                            { title: 'Nome', value: 'nome' },
                            { title: 'Descrição', value: 'descricao' },
                            { title: 'Quantidade', value: 'quantidade' }

                        ]"
                        :items="equipamentos"
                        class="elevation-1"
                        :items-per-page="10"
                        :search="search"
                        :footer-props="{
                            itemsPerPageOptions: [5, 10, 15],
                            showFirstLastPage: true
                        }"
                        no-data-text="Nenhum equipamento cadastrado"
                        no-results-text="Nenhum resultado encontrado"
                    >
                        <template v-slot:item="{ item }">
                            <tr @click.stop="selecEquip(item)" style="cursor:pointer">
                                <td>{{ item.nome }}</td>
                                <td>{{ item.descricao }}</td>
                                <td>{{ item.quantidade }}</td>
                                <td>
                                <v-btn v-if="!item.hasAgendamentos" icon @click.stop="openDelete(item)">
                                    <v-icon color="error">mdi-delete</v-icon>
                                </v-btn>
                                </td>
                            </tr>
                        </template>
                    </v-data-table>

                </v-card-text>
            </v-card>
        </v-col>
        <v-dialog v-model="deleteDialog" max-width="420">
          <v-card>
            <v-card-title>Confirmar exclusão</v-card-title>
            <v-card-text>
              Tem certeza que deseja excluir o equipamento
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
<script>
import { ref, onMounted} from 'vue'
import { useStore } from 'vuex';
import {createEquip, getAllEquips , updateEquip, deleteEquip}from '../../../services/equipServices'

export default {
  name: 'CreateEquip',
  setup() {
        
        const store = useStore();
        const form = ref({
            nome: '',
            descricao: '',
            quantidade: 1,
        });
        const isEditMode = ref(false);
        const editId = ref(null);
        const nome = ref('');
        const search = ref('');
        

        const equipamentos = ref([]);
        const deleteDialog = ref(false);
        const deleteTarget = ref(null);


        const submitForm = async () => {
            try {
                await createEquip(form.value);
               console.log('Equipamento cadastrado com sucesso!');
                form.value = { nome: '', descricao: '', quantidade: 1 }; // Limpa o formulário após o envio
                store.dispatch('triggerSnackbar', {
                    text: 'Equipamento cadastrado com sucesso!',
                    color: 'success',
                });
                await fetchAllEquips(); // Atualiza a lista de equipamentos
            } catch (error) {
                store.dispatch('triggerSnackbar', {
                    text: 'Erro ao cadastrar equipamento. Tente novamente.',
                    color: 'error',
                });
                console.error(error);
            }
        };
        // Função para obter todos os equipamentos
        const fetchAllEquips = async () => {
            try {
                const response = await getAllEquips();
                equipamentos.value = response.data; // Supondo que a resposta seja um array de equipamentos
                
                console.log('Equipamentos obtidos com sucesso:', response.data);
            } catch (error) {
                console.error('Erro ao obter equipamentos:', error);
            }
        };

        // Função para atualizar um equipamento
        const updateEquipamento = async () => {
            try {
                if (editId.value) {
                    await updateEquip(editId.value, form.value);
                    console.log('Equipamento atualizado com sucesso!');
                    form.value = { nome: '', descricao: '', quantidade: 1 }; // Limpa o formulário após a atualização
                    isEditMode.value = false;
                    editId.value = null;
                    store.dispatch('triggerSnackbar', {
                        text: 'Equipamento atualizado com sucesso!',
                        color: 'success',
                    });
                    await fetchAllEquips(); // Atualiza a lista de equipamentos
                }
            } catch (error) {
                console.error('Erro ao atualizar equipamento:', error);
                store.dispatch('triggerSnackbar', {
                    text: 'Erro ao atualizar equipamento. Tente novamente.',
                    color: 'error',
                });
            }
        };

        // Função para deletar um equipamento
        const deleteEquipe = async (id) => {
            try {
                await deleteEquip(id);
                console.log('Equipamento deletado com sucesso!');
                store.dispatch('triggerSnackbar', {
                    text: 'Equipamento deletado com sucesso!',
                    color: 'success',
                });
                await fetchAllEquips(); // Atualiza a lista de equipamentos
            } catch (error) {
                console.error('Erro ao deletar equipamento:', error);
                store.dispatch('triggerSnackbar', {
                    text: (error?.response?.data?.message || 'Erro ao deletar equipamento. Tente novamente.'),
                    color: 'error',
                });
            }
        };

        const openDelete = (item) => {
          deleteTarget.value = item;
          deleteDialog.value = true;
        };

        const closeDelete = () => {
          deleteDialog.value = false;
          deleteTarget.value = null;
        };

        const confirmDelete = async () => {
          const id = deleteTarget.value?._id;
          if (!id) return;
          await deleteEquipe(id);
          closeDelete();
        };

        const selecEquip = (item) => {
          form.value = { ...item };
          isEditMode.value = true;
          editId.value = item._id || null;
          console.log(editId.value);
        };

        const cancelEdit = () => {
            nome.value = ''
            editId.value = null
            isEditMode.value = false
        };

      onMounted(() => {
            fetchAllEquips();
        });


        return {
            form,
            submitForm,
            equipamentos,
            isEditMode,
            editId,
            nome,
            search,
            selecEquip,
            cancelEdit,
            updateEquipamento,
            deleteEquipe,
            deleteDialog,
            deleteTarget,
            openDelete,
            closeDelete,
            confirmDelete
            
        };
    },
};
</script>
