<template>
<v-row>
    <v-col cols="12" sm="6" md="4">
        <v-card color="surface">
            <v-card-title class="headline">Cadastrar Infraestrutura</v-card-title>
            <v-card-text>
                <v-form @submit.prevent="submitForm">
                    <v-text-field
                        v-model="form.nome"
                        label="Nome da Infraestrutura"
                        required
                        color="primary"
                    ></v-text-field>

                    <v-textarea
                        v-model="form.descricao"
                        label="Descrição"
                        required
                        color="primary"
                    ></v-textarea>

                    <v-btn 
                        v-if="!isEditMode"
                        color="primary"
                        type="submit">Cadastrar Infraestrutura</v-btn>
                    <v-btn 
                        v-else   
                        color="primary"
                        type="submit">Atualizar Infraestrutura</v-btn>   
                </v-form>
            </v-card-text>
        </v-card>
    </v-col>

    <v-col cols="12" sm="6" md="8">
        <v-card color="surface">
            <v-card-title class="headline">Lista de Infraestruturas</v-card-title>
            <v-card-text>
                <v-data-table
                    :headers="headers"
                    :items="infraestruturas"
                    class="elevation-1"
                    :items-per-page="10"
                    :search="search"
                >
                    <template v-slot:item="{ item }">
                        <tr @click.stop="selecInfra(item)" style="cursor:pointer">
                            <td>{{ item.nome }}</td>
                            <td>{{ item.descricao }}</td>
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
          Tem certeza que deseja excluir a infraestrutura
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
import {createInfra, getAllInfra, updateInfra, deleteInfra} from '../../../services/infraServices';
const store = useStore();
const headers = [
  { title: 'Nome', value: 'nome' },
  { title: 'Descrição', value: 'descricao' }
];
const form = ref({
    nome: '',
    descricao: ''

});
const isEditMode = ref(false);
const editId = ref(null);
const search = ref('');
const infraestruturas = ref([]);
const deleteDialog = ref(false);
const deleteTarget = ref(null);
const loadInfraestruturas = async () => {
    try {
        const response = await getAllInfra();
        infraestruturas.value = response;
    } catch (error) {
        console.error('Erro ao buscar infraestruturas', error);
    }
};

const submitForm = async () => {
    try {
        if (isEditMode.value) {
            await updateInfra(editId.value, form.value);
            store.dispatch('triggerSnackbar', {
                text: 'Infraestrutura atualizada com sucesso!',
                color: 'success',
            });
        } else {
            console.log(form.value);
            await createInfra(form.value);
            store.dispatch('triggerSnackbar', {
                text: 'Infraestrutura cadastrada com sucesso!',
                color: 'success',
            });
        }
        form.value = { nome: '', descricao: '' }; // Limpa o formulário após o envio
        isEditMode.value = false;
        editId.value = null;
        await loadInfraestruturas(); // Atualiza a lista de infraestruturas
    } catch (error) {
        store.dispatch('triggerSnackbar', {
            text: 'Erro ao cadastrar infraestrutura. Tente novamente.',
            color: 'error',
        });
        console.error(error);
    }
};
const selecInfra = (item) => {
    form.value.nome = item.nome;
    form.value.descricao = item.descricao;
    editId.value = item._id;
    isEditMode.value = true;
};
const cancelEdit = () => {
    form.value = { nome: '', descricao: '' };
    editId.value = null;
    isEditMode.value = false;
};
const deleteInfraestrutura = async (id) => {
    try {
        await deleteInfra(id);
        store.dispatch('triggerSnackbar', {
            text: 'Infraestrutura deletada com sucesso!',
            color: 'success',
        });
        await loadInfraestruturas(); // Atualiza a lista de infraestruturas
    } catch (error) {
        store.dispatch('triggerSnackbar', {
            text: (error?.response?.data?.message || 'Erro ao deletar infraestrutura. Tente novamente.'),
            color: 'error',
        });
        console.error('Erro ao deletar infraestrutura:', error);
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
  await deleteInfraestrutura(id);
  closeDelete();
};
onMounted(() => {
    loadInfraestruturas();
});



</script>
