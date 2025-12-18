<!-- UserEditDialog.vue -->
<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <!-- Avatar Section -->
      <v-card-title>Atualizar Avatar</v-card-title>
      <v-card-text class="text-center">
        <v-file-input
          v-model="avatarFile"
          label="Selecionar imagem"
          accept="image/*"
          prepend-icon="mdi-camera"
          @change="previewAvatar"
          outlined
          dense
        />
        
        <v-img
          v-if="avatarPreview || userData.avatarUrl"
          :src="avatarPreview || userData.avatarUrl"
          max-height="120"
          max-width="120"
          class="mx-auto my-2 rounded-circle"
        />

        <v-btn 
          color="primary" 
          @click="uploadAvatar" 
          :disabled="!avatarFile"
          class="mb-4"
        >
          Salvar Avatar
        </v-btn>
      </v-card-text>

      <v-divider></v-divider>

      <!-- User Data Section -->
      <v-card-title>Editar Dados do Usuário</v-card-title>
      <v-card-text>
        <v-form ref="userEditForm" v-model="formValid">
          <v-text-field
            v-model="editUser.name"
            label="Nome"
            required
            outlined
            dense
          ></v-text-field>
          
          <v-text-field
            v-model="editUser.email"
            label="E-mail"
            required
            disabled
            outlined
            dense
          ></v-text-field>
          
          <v-text-field
            v-model="editUser.password"
            label="Nova Senha"
            type="password"
            autocomplete="new-password"
            :rules="[v => !v || v.length >= 6 || 'Mínimo 6 caracteres']"
            outlined
            dense
          ></v-text-field>
          
          <v-divider class="my-2"></v-divider>
          
          <v-list-subheader class="pl-0">Endereço</v-list-subheader>
          
          <v-text-field
            v-model="editUser.endereco[0].rua"
            label="Rua"
            outlined
            dense
          ></v-text-field>
          
          <v-text-field
            v-model="editUser.endereco[0].numero"
            label="Número"
            outlined
            dense
          ></v-text-field>
          
          <v-text-field
            v-model="editUser.endereco[0].bairro"
            label="Bairro"
            outlined
            dense
          ></v-text-field>
          
          <v-text-field
            v-model="editUser.endereco[0].cidade"
            label="Cidade"
            outlined
            dense
          ></v-text-field>
          
          <v-text-field
            v-model="editUser.endereco[0].estado"
            label="Estado"
            outlined
            dense
          ></v-text-field>
          
          <v-text-field
            v-model="editUser.endereco[0].cep"
            label="CEP"
            maxlength="9"
            @input="onCepInput"
            outlined
            dense
          ></v-text-field>
        </v-form>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" text @click="close">Cancelar</v-btn>
        <v-btn 
          color="primary" 
          text 
          @click="save" 
          :disabled="!formValid"
        >
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref,  watch } from 'vue'
import api from '../../services/api'
import { updateUser as updateUserService } from '../../services/userService'
import { useStore } from 'vuex'
import User from '../../models/user'

const props = defineProps({
  modelValue: Boolean,
  userData: Object
})

const emit = defineEmits(['update:modelValue', 'saved'])

const store = useStore()
const dialog = ref(false)
const formValid = ref(false)
const userEditForm = ref(null)
const editUser = ref(new User())
const avatarFile = ref(null)
const avatarPreview = ref(null)

// Observa a propriedade modelValue para abrir/fechar o diálogo
watch(() => props.modelValue, (val) => {
  dialog.value = val
})

// Observa o estado do diálogo e emite evento para o componente pai
watch(dialog, (val) => {
  emit('update:modelValue', val)
})

// Observa mudanças nos dados do usuário recebidos por props e inicializa o formulário de edição
watch(() => props.userData, (user) => {
  if (user) {
    // Usa os defaults do model para endereco quando não vem do backend
    editUser.value = new User({
      ...user,
      password: '',
      confirmPassword: '',
    })
  }
}, { immediate: true })

// Gera um preview da imagem de avatar selecionada pelo usuário
const previewAvatar = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// Faz upload do avatar selecionado para o servidor
const uploadAvatar = async () => {
  if (!avatarFile.value) return
  const formData = new FormData()
  formData.append('file', avatarFile.value)
  try {
    await api.post(`/users/${props.userData._id}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    store.dispatch('triggerSnackbar', {
      text: 'Avatar atualizado com sucesso!',
      color: 'success',
    })
    close()
  } catch (error) {
    console.error('Erro ao atualizar avatar:', error)
    store.dispatch('triggerSnackbar', {
      text: 'Erro ao atualizar avatar.',
      color: 'error',
    })
  }
}

// Formata o campo de CEP enquanto o usuário digita
const onCepInput = (e) => {
  let v = e.target.value.replace(/\D/g, '').slice(0, 8)
  if (v.length > 5) v = v.replace(/^(\d{5})(\d{1,3})/, '$1-$2')
  if (editUser.value.endereco && editUser.value.endereco[0]) {
    editUser.value.endereco[0].cep = v
  }
}

// Salva as alterações dos dados do usuário no servidor
const save = async () => {
  if (!userEditForm.value.validate()) return
  try {
    const payload = {
      name: editUser.value.name,
      endereco: [
        {
          rua: editUser.value.endereco?.[0]?.rua || '',
          numero: editUser.value.endereco?.[0]?.numero || '',
          bairro: editUser.value.endereco?.[0]?.bairro || '',
          cidade: editUser.value.endereco?.[0]?.cidade || '',
          estado: editUser.value.endereco?.[0]?.estado || '',
          cep: editUser.value.endereco?.[0]?.cep || '',
        }
      ]
    }
    if (editUser.value.password) {
      payload.password = editUser.value.password
    }
    await updateUserService(props.userData._id, payload)
    emit('saved', payload)
    close()
    store.dispatch('triggerSnackbar', {
      text: 'Dados atualizados com sucesso!',
      color: 'success',
    })
  } catch (error) {
    const msg = error?.response?.data?.message || 'Erro ao atualizar dados do usuário.'
    store.dispatch('triggerSnackbar', { text: msg, color: 'error' })
  }
}

// Fecha o diálogo de edição
const close = () => {
  dialog.value = false
}
</script>
