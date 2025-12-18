<template>
  <v-row>
    <!-- Formulário de criação/edição -->
    <v-col cols="12" md="4" class="mx-auto">
      <v-sheet elevation="3" rounded="xl" class="pa-6" max-width="900" color="#E0F2F1" style="margin-top: 32px;">
        <v-form @submit.prevent class="d-flex flex-column">
          <v-text-field
            v-model="nome"
            :rules="rules"
            label="Nome do Setor"
            color="#004D40"
          ></v-text-field>
          <v-btn
            color="primary"
            @click="isEditMode ? updateSetores() : createSetores()"
            :disabled="!nome"
          >
            {{ isEditMode ? 'Editar Setor' : 'Criar Setor' }}
          </v-btn>
          <v-btn
            v-if="isEditMode"
            class="mt-2"
            color="grey"
            @click="cancelEdit"
          >
            Cancelar
          </v-btn>
        </v-form>
      </v-sheet>
    </v-col>

    <!-- Lista de setores -->
    <v-col cols="12" md="4" class="mx-auto">
      <v-sheet elevation="3" rounded="xl" class="pa-6" color="#E0F2F1" max-width="900" style="margin-top: 32px;">
        <v-row>
          <v-col
            v-for="item in setor"
            :key="item._id"
            cols="12"
            sm="12"
            md="12"
          >
            <v-card @click="selectSetor(item)" style="cursor:pointer;">
              <v-row class="d-flex align-center">
                <v-card-title>{{ item.nome }}</v-card-title>
                <v-chip :color="item.active ? 'success' : 'grey'" class="ml-2" variant="flat">
                  {{ item.active ? 'Ativo' : 'Inativo' }}
                </v-chip>
                <v-spacer />
                <v-btn
                  @click.stop="toggleActive(item)"
                  :color="item.active ? 'warning' : 'success'"
                  class="ma-0"
                >
                  <v-icon left>{{ item.active ? 'mdi-cancel' : 'mdi-check' }}</v-icon>
                  {{ item.active ? 'Inativar' : 'Ativar' }}
                </v-btn>
                <v-btn
                  v-if="!item.hasTickets"
                  @click.stop="openDelete(item)"
                  color="error"
                  class="ma-0 ml-2"
                >
                  <v-icon left>mdi-delete</v-icon>
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
          Tem certeza que deseja excluir o setor
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
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { getSetores, createSetor, updateSetor, setSetorActive, deleteSetor } from '../../services/setor'

const nome = ref('')
const store = useStore()
const setor = ref([])
const editId = ref(null)
const isEditMode = ref(false)

const loadSetores = async () => {
  try {
    const response = await getSetores()
    setor.value = response.data
    console.log('Setores carregados:', setor.value)
  } catch (error) {
    console.error('Erro ao buscar setores', error)
  }
}

const createSetores = async () => {
  try {
    await createSetor({ nome: nome.value })
    nome.value = ''
    await loadSetores()
  } catch (error) {
    console.error('Error creating setor:', error)
  }
}

const updateSetores = async () => {
  try {
    await updateSetor(editId.value, { nome: nome.value })
    nome.value = ''
    editId.value = null
    isEditMode.value = false
    await loadSetores()
  } catch (error) {
    console.error('Error updating setor:', error)
  }
}

const toggleActive = async (item) => {
  try {
    await setSetorActive(item._id, !item.active)
    await loadSetores()
  } catch (error) {
    console.error('Erro ao atualizar status do setor:', error)
  }
}

const deleteSetores = async (id) => {
  try {
    await deleteSetor(id)
    store.dispatch('triggerSnackbar', { text: 'Setor excluído com sucesso', color: 'success' })
    await loadSetores()
  } catch (error) {
    const msg = error?.response?.data?.message || 'Erro ao excluir setor'
    store.dispatch('triggerSnackbar', { text: msg, color: 'error' })
    console.error('Erro ao excluir setor:', error)
  }
}

const selectSetor = (item) => {
  nome.value = item.nome
  editId.value = item._id
  isEditMode.value = true
}

const cancelEdit = () => {
  nome.value = ''
  editId.value = null
  isEditMode.value = false
}

const deleteDialog = ref(false)
const deleteTarget = ref(null)

const openDelete = (item) => {
  deleteTarget.value = item
  deleteDialog.value = true
}

const closeDelete = () => {
  deleteTarget.value = null
  deleteDialog.value = false
}

const confirmDelete = async () => {
  if (!deleteTarget.value?._id) return
  await deleteSetores(deleteTarget.value._id)
  closeDelete()
}

const rules = [
  value => {
    if (value) return true
    return 'Você precisa preencher o campo Nome.'
  },
]

onMounted(() => {
  loadSetores()
})
</script>
