<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="#009688" dark flat>
            <v-toolbar-title>Cadastrar Usuário</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="secondary" variant="tonal" @click="buscarUsuarios">Buscar usuários</v-btn>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="register" ref="registerForm" v-model="formValid">
              <v-window v-model="step">
                <v-window-item :value="1">
                  <v-subheader class="pl-0">Dados do Usuário</v-subheader>
                  <v-text-field
                    v-model="user.nome"
                    label="Nome"
                    autocomplete="name"
                    :rules="[v => !!v || 'Nome é obrigatório']"
                    required
                    autofocus
                  ></v-text-field>
                  <v-text-field
                    v-model="user.email"
                    label="E-mail"
                    autocomplete="email"
                    :rules="[v => !!v || 'E-mail é obrigatório', v => validEmail(v) || 'E-mail inválido']"
                    required
                  ></v-text-field>
                  <v-select
                    v-model="user.role"
                    label="Tipo de Usuário"
                    :items="roleOptions"
                    item-title="text"
                    item-value="value"
                    :rules="[v => !!v || 'Tipo de usuário é obrigatório']"
                    required
                  ></v-select>
                  <v-text-field
                    v-model="user.password"
                    label="Senha"
                    type="password"
                    autocomplete="new-password"
                    :rules="[v => !!v || 'Senha é obrigatória', v => v.length >= 6 || 'Mínimo 6 caracteres']"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="user.confirmPassword"
                    label="Confirme a Senha"
                    type="password"
                    autocomplete="new-password"
                    :rules="[v => !!v || 'Confirmação obrigatória', v => v === user.password || 'Senhas não conferem']"
                    required
                  ></v-text-field>
                  <v-btn color="primary" block class="mt-4" @click="nextStep" :disabled="!step1Valid || dialog">Próximo</v-btn>
                </v-window-item>
                <v-window-item :value="2">
                  <v-subheader class="pl-0">Endereço</v-subheader>
                  <v-text-field
                    v-model="user.endereco[0].rua"
                    label="Rua"
                    type="text"
                    :rules="[v => !!v || 'Rua é obrigatória']"
                    required
                    autofocus
                  ></v-text-field>
                  <v-text-field
                    v-model="user.endereco[0].numero"
                    label="Número"
                    type="text"
                    :rules="[v => !!v || 'Número é obrigatório']"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="user.endereco[0].bairro"
                    label="Bairro"
                    type="text"
                    :rules="[v => !!v || 'Bairro é obrigatório']"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="user.endereco[0].cidade"
                    label="Cidade"
                    type="text"
                    :rules="[v => !!v || 'Cidade é obrigatória']"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="user.endereco[0].estado"
                    label="Estado"
                    type="text"
                    :rules="[v => !!v || 'Estado é obrigatório']"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="user.endereco[0].cep"
                    label="CEP"
                    type="text"
                    :rules=" [
                      v => !!v || 'CEP é obrigatório',
                      v => validCep(v) || 'CEP inválido (use 99999-999)'
                    ]"
                    required
                    maxlength="9"
                    @input="onCepInput"
                  ></v-text-field>
                  <v-row class="mt-4">
                    <v-col cols="6">
                      <v-btn color="grey" block @click="step = 1" :disabled="dialog">Voltar</v-btn>
                    </v-col>
                    <v-col cols="6">
                      <v-btn type="submit" color="#009688" block :disabled="!formValid || dialog">Cadastrar</v-btn>
                    </v-col>
                  </v-row>
                </v-window-item>
              </v-window>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <div class="text-center">
    <v-dialog v-model="dialog" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Processando Cadastro
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../services/api'
import { useStore } from 'vuex'
import User from '../../models/user' // Importa o model

export default {
  setup() {
    const store = useStore()
    const router = useRouter()
    const user = ref(new User()) // Usa o model User
    const roleOptions = [
      { text: 'Usuário', value: 'user' },
      { text: 'Administrador', value: 'admin' }
    ]
    const dialog = ref(false)
    const errorMessage = ref('')
    const formValid = ref(false)
    const registerForm = ref(null)
    const step = ref(1)

    const step1Valid = computed(() =>
      !!user.value.nome &&
      !!user.value.email &&
      validEmail(user.value.email) &&
      !!user.value.role &&
      !!user.value.password &&
      user.value.password.length >= 6 &&
      !!user.value.confirmPassword &&
      user.value.password === user.value.confirmPassword
    )

    const register = async () => {
      if (!registerForm.value.validate()) return
      try {
        dialog.value = true
        const response = await api.post('/auth/register', {
          name: user.value.nome,
          email: user.value.email,
          password: user.value.password,
          role: user.value.role,
          endereco: [
            {
              rua: user.value.endereco[0].rua,
              numero: user.value.endereco[0].numero,
              bairro: user.value.endereco[0].bairro,
              cidade: user.value.endereco[0].cidade,
              estado: user.value.endereco[0].estado,
              cep: user.value.endereco[0].cep,
            }
          ],
        })
        dialog.value = false
        store.dispatch('triggerSnackbar', {
          text: 'Usuário cadastrado com sucesso!',
          color: 'success',
        })
        user.value = new User() // Limpa o formulário
        step.value = 1
        registerForm.value.resetValidation()
      } catch (error) {
        dialog.value = false
        errorMessage.value =
          error.response?.data?.message ||
          (error.response?.data?.error ? error.response.data.error : '') ||
          'Erro ao cadastrar usuário. Verifique os dados e tente novamente.'
        store.dispatch('triggerSnackbar', {
          text: errorMessage.value,
          color: 'error',
        })
      }
    }

    const onCepInput = (e) => {
      let v = e.target.value.replace(/\D/g, '').slice(0, 8)
      if (v.length > 5) v = v.replace(/^(\d{5})(\d{1,3})/, '$1-$2')
      user.value.endereco[0].cep = v
    }

    const validEmail = (email) => {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email)
    }

    const validCep = cep => /^\d{5}-\d{3}$/.test(cep)

    const nextStep = () => {
      if (step1Valid.value) step.value = 2
    }

    const buscarUsuarios = () => {
      router.push({ name: 'user-list' })
    }

    return {
      user, register, dialog, errorMessage, formValid, registerForm, onCepInput,
      step, nextStep, step1Valid, validEmail, roleOptions, validCep,
      buscarUsuarios
    }
  },
}
</script>
