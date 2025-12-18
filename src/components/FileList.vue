<template>
  <v-container>
    <v-card class="mx-auto" max-width="100%">
      <v-card-item class="indigo white--text">
        <v-card-title>
          <span class="text-h5">Tutoriais Sistema Pixeon</span>
        </v-card-title>
      </v-card-item>

      <v-list density="compact">
        <v-list-item 
          v-for="file in files"
          :key="file.id"
        >
          <v-divider inset></v-divider>
          <v-card class="pa-3 d-flex align-center flex-wrap ga-4">
            <v-img
              :src="file.idgoogle"
              aspect-ratio="1.5"
              max-width="100"
              max-height="100"
              contain
              class="mr-4"
            />
            <v-list-item>
              <v-list-item-title class="font-weight-bold text-subtitle-1">{{ file.titulo }}</v-list-item-title>
             
            </v-list-item>
            <v-list-item-action class="ml-auto">
              <v-btn
                color="primary"
                :href="file.urlView"
                target="_blank"
                icon
              >
                <v-icon>mdi-eye</v-icon>
              </v-btn>
              <v-btn
                v-if="userData?.role === 'admin'"
                class="ma-2"
                color="red"
                @click="removeFile(file._id)"
                icon
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-card>
        </v-list-item>
      </v-list>

      <p v-if="files.length === 0" class="pa-4 text-subtitle-2 text-center">Nenhum arquivo encontrado.</p>

      <v-dialog v-model="dialog" max-width="400">
        <v-card>
          <v-card-title class="headline">Confirmação</v-card-title>
          <v-card-text>{{ dialogMessage }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="closeDialog">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue'
import { fetchFiles, deleteFile } from '../services/fileServices'

export default {
  props: {
    userData: Object,
  },
  setup(props) {
    const files = ref([])
    const dialog = ref(false)
    const dialogMessage = ref('')

    const loadFiles = async () => {
      try {
        files.value = await fetchFiles()
      } catch (error) {
        console.error('Erro ao buscar arquivos:', error)
      }
    }

    const removeFile = async (fileId) => {
      if (props.userData?.role !== 'admin') {
        alert('Apenas administradores podem excluir arquivos.')
        return
      }
      try {
        await deleteFile(fileId)
        files.value = files.value.filter(file => file._id !== fileId)
        dialogMessage.value = 'Arquivo removido com sucesso!'
        dialog.value = true
      } catch (error) {
        console.error('Erro ao remover arquivo:', error)
        dialogMessage.value = 'Erro ao remover arquivo'
        dialog.value = true
      }
    }

    const closeDialog = () => {
      dialog.value = false
    }

    onMounted(() => {
      loadFiles()
    })

    return { files, removeFile, dialog, dialogMessage, closeDialog }
  }
}
</script>

<style scoped>
.v-card-item {
  background-color: #009688;
  color: rgb(255, 255, 255);
}
.v-card {
  margin-bottom: 16px;
  border-radius: 12px;
}
.v-img {
  border-radius: 8px;
  background-color: #f5f5f5;
}
</style>
