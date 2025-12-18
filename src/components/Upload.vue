<template>
  <v-container>
    <v-card>
      <v-card-item class="indigo white--text">
       
        <v-card-title>
          <span class="text-h5">Upload de Arquivos</span>
        </v-card-title>
      </v-card-item>
      <v-card-item>
        <v-text-field
                    v-model="filename"
                    label="Título do Arquivo"
                    type="text"
                    required
        ></v-text-field>
        <v-file-input
          v-model="file"
          :key="fileInputKey"
          label="Selecione um arquivo"
          outlined
          accept="image/*"
        ></v-file-input>
        
        <v-btn @click="upload" color="#009688" dark>Enviar</v-btn>
        <div class="mt-2">
           <span class="bg-teal-lighten-5">{{ message }}</span>
        </div>
       

      </v-card-item>
       

    </v-card>
   
  </v-container>
</template>

<script>
import { ref } from 'vue'
import { uploadFile } from '../services/fileServices'

export default {
  setup() {
    
    const file = ref(null) // Armazena o arquivo selecionado
    const filename = ref('') // Armazena o nome do arquivo
    const fileInputKey = ref(0) // Chave para forçar a recriação do componente
    const message = ref('')

    const upload = async () => {
      if (!file.value) {
        message.value = 'Selecione um arquivo '
       
        return
      }
      
     
     try {
        // Envie o arquivo e o título juntos
         console.log(filename)
        await uploadFile(file.value, filename.value)
        message.value = 'Arquivo enviado com sucesso!'
        file.value = null
        filename.value = ''
        fileInputKey.value++
      } catch (error) {
        message.value = 'Erro ao enviar arquivo'
      }
    }

    return { file,filename, fileInputKey, upload, message }
  }
}
</script>
