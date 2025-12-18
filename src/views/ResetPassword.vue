<template>
  <v-container>
    <v-card max-width="400" class="mx-auto mt-12">
      <v-card-title>Definir Nova Senha</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="newPassword"
          label="Nova senha"
          type="password"
          required
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="submitNewPassword">Redefinir</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'
import Store from '../store/index'

const route = useRoute()
const router = useRouter()
const newPassword = ref('')

const submitNewPassword = async () => {
  if (!newPassword.value) {
    Store.dispatch('triggerSnackbar', {
      text: 'Digite a nova senha.',
      color: 'error'
    })
    return
  }
  try {
    await api.post('/auth/resetpassword', {
      token: route.params.token,
      newPassword: newPassword.value
    })
    Store.dispatch('triggerSnackbar', {
      text: 'Senha redefinida com sucesso!',
      color: 'success'
    })
    router.push('/login')
  } catch (error) {
    Store.dispatch('triggerSnackbar', {
      text: 'Erro ao redefinir senha: ' + error.message,
      color: 'error'
    })
  }
}
</script>