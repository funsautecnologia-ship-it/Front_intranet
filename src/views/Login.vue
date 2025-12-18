<template>
  <v-app id="inspire">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="4" class="text-center">
           
               <a
              href="https://pixeon.cloud.com/Citrix/StoreWeb/#/home"
              target="_blank"
              style="display: inline-block;"
            >
              <v-avatar
                size="150"
                class="mx-auto"
                style="cursor: pointer;"
                
                block
              >
                <v-img src="/citrix.png" alt="Citrix Logo" class="mb-4"   />
              </v-avatar>
            </a>

            
           
          </v-col>
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="#009688" dark flat>
                <v-toolbar-title>Login</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form @submit.prevent="login">
                  <v-text-field v-model="email" label="E-mail" type="email" required></v-text-field>
                  <v-text-field v-model="password" label="Senha" type="password" required></v-text-field>
                  <v-btn type="submit" color="#009688" block>Entrar</v-btn>
                  <v-btn text color="primary" block @click="openResetDialog">Esqueci minha senha</v-btn>
              
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
              Buscando Dados
              <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
      <!-- Diálogo para resetar senha -->
      <v-dialog v-model="resetDialog" max-width="400">
        <v-card>
          <v-card-title>Redefinir Senha</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="resetEmail"
              label="Digite seu e-mail"
              type="email"
              required
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="sendResetEmail">Enviar</v-btn>
            <v-btn text @click="resetDialog = false">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog>
        
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Store from '../store/index'
import api from '../services/api'
export default {
  setup() {
    const router = useRouter()
    const errorMessage = ref('')
    const dialog = ref(false)
    const email = ref('')
    const password = ref('')
    const resetDialog = ref(false)
    const resetEmail = ref('')
    const user = {
      email:'',
      password:'',
    }

   

    const login = async () => {
      try {
        if (!email.value || !password.value) {
          alert('Por favor, preencha todos os campos.')
          return
        }
        user.email = email.value
        user.password = password.value
        dialog.value = true // Exibe o diálogo imediatamente
        errorMessage.value = '' // Limpa mensagens de erro anteriores

        await Store.dispatch('login', user)
        router.push({
          name: 'home',
        })
          .then(() => {
            Store.dispatch('triggerSnackbar', {
              text: 'Login realizado com sucesso!',
              color: 'success'
            })
          })
          .catch((err) => {
        
            Store.dispatch('triggerSnackbar', {
              text: 'Erro ao redirecionar: ' + err.message,
              color: 'error'
            })
          })
      } catch (error) {
        Store.dispatch('triggerSnackbar', {
            text: 'Mensagem de erro: ' + error.message,
            color: 'error'
          });
      } finally {
        dialog.value = false // Garante que o diálogo seja fechado
      }
    }

    const openResetDialog = () => {
      resetEmail.value = ''
      resetDialog.value = true
    }

    const sendResetEmail = async () => {
      if (!resetEmail.value) {
        Store.dispatch('triggerSnackbar', {
          text: 'Digite seu e-mail.',
          color: 'error'
        })
        return
      }
      try {
        const response = await api.post('/auth/reset-password', {
          email: resetEmail.value,
        })
        Store.dispatch('triggerSnackbar', {
          text:response.data.message,
          color: 'success'
        })
      } catch (error) {
        Store.dispatch('triggerSnackbar', {
          text: 'Erro ao solicitar redefinição: ' + error.response.data.message,
          color: 'error'
        })
      } finally {
        resetDialog.value = false
      }
    }

    watch(dialog, (newValue) => {
      if (newValue) {
        setTimeout(() => {
          if (dialog.value) dialog.value = false // Fecha o diálogo apenas se ainda estiver aberto
        }, 50000)
      }
    })

    return { email, password, login, errorMessage, dialog, resetDialog, resetEmail, openResetDialog, sendResetEmail}
  },
}
</script>
