<template>
  <v-container>
    <v-card>
      <v-card-title class="headline">Gerenciar Eventos</v-card-title>
      <v-card-text>
        <!-- Validação de formulário e feedback -->
        <v-form ref="eventForm" v-model="valid">
          <v-text-field
            v-model="newEvent.title"
            label="Título do Evento"
            required
            :rules="[v => !!v || 'Título é obrigatório']"
          ></v-text-field>
           <Editor
            v-model="newEvent.description"
            api-key="4y9w0ytymrqs82u4erptdj6yv6b5b2zq1a9s4owwzw9o4fkx"
             :init="{
                  toolbar_mode: 'sliding',
                  plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                  toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                   content_style: `
                      body { max-width: 100%; word-break: break-word; overflow-wrap: break-word; }
                      img, table { max-width: 100%; height: auto; }
                    `
                  }"
          ></Editor>
            
               
          <!-- 
            <Editor v-model="newEvent.description" />
          -->        
          <v-file-input
            v-model="newEvent.file"
            accept="image/png, image/jpeg, image/bmp"
            label="Photos"
            placeholder="Upload your photos"
            prepend-icon="mdi-camera"
          ></v-file-input>
          <v-btn
            color="primary"
            :disabled="!valid || !newEvent.title || !newEvent.description || loading"
            @click="addEvent"
          >
            <v-progress-circular
              v-if="loading"
              indeterminate
              size="20"
              color="white"
              class="mr-2"
            />
            Adicionar Evento
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue'
import Editor from '@tinymce/tinymce-vue'
import { createEvent, deleteEvent } from '../../services/eventServices'
//import Editor from '../../utils/WysiwygEditor.vue'

export default {
  components: {
    Editor,
  },
  props: {
    userData: Object,
  },
  setup(props) {
    const newEvent = ref({
      title: '',
      description: '',
      file: null,
    })
    const events = ref([])
    const valid = ref(false)
    const loading = ref(false) // Para feedback de carregamento

    

    const addEvent = async () => {
      if (!newEvent.value.title || !newEvent.value.description) return
      try {
        loading.value = true
        const createdEvent = await createEvent(newEvent.value)
        events.value.push(createdEvent)
        newEvent.value.title = ''
        newEvent.value.description = ''
        newEvent.value.file = null
        valid.value = false
      } catch (error) {
        alert('Erro ao adicionar evento!')
        console.error('Erro ao adicionar evento:', error)
      }
      loading.value = false
    }

    const removeEvent = async (eventId) => {
      if (props.userData?.role !== 'admin') {
        alert('Apenas administradores podem excluir eventos.')
        return
      }
      if (!confirm('Tem certeza que deseja excluir este evento?')) return
      try {
        loading.value = true
        await deleteEvent(eventId)
        events.value = events.value.filter(event => event._id !== eventId)
      } catch (error) {
        alert('Erro ao remover evento!')
        console.error('Erro ao remover evento:', error)
      }
      loading.value = false
    }

   
    return {
      newEvent,
      events,
      valid,
      loading,
      addEvent,
      removeEvent,
    }
  }
}
</script>

<style scoped>
.text-body-1 {
  word-break: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
}

.text-body-1 img,
.text-body-1 table {
  max-width: 100%;
  height: auto;
  display: block;
}
</style>