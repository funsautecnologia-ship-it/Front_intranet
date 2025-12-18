<template>
    <v-dialog :model-value="dialog" @update:model-value="val => $emit('update:dialog', val)" max-width="600px" persistent>
        <v-card>
            <v-card-title class="d-flex justify-space-between align-center">
                <span class="text-h5">Editar Agendamento</span>
                <v-btn icon @click="closeDialog">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <v-card-text>
                <v-form ref="editForm" v-model="valid">
                    <v-row>
                        <v-col cols="12" md="6">
                        <v-text-field
                            v-model="localAgendamento.descricao"
                            label="Descrição"
                            :rules="[v => !!v || 'Descrição é obrigatória']"
                            required
                        ></v-text-field>
                        </v-col>
                        
                        <v-col cols="12" md="6">
                        <v-text-field
                            v-model="localAgendamento.solicitante"
                            label="Solicitante"
                            :rules="[v => !!v || 'Solicitante é obrigatório']"
                            required
                        ></v-text-field>
                        </v-col>
                        
                        <v-col cols="12" md="6">
                        <v-text-field
                            v-model="localAgendamento.dataInicio"
                            label="Data"
                            type="date"
                            :rules="[v => !!v || 'Data é obrigatória']"
                            required
                        ></v-text-field>
                        </v-col>
                        
                        <v-col cols="12" md="6">
                        <v-text-field
                            v-model="localAgendamento.Hora"
                            label="Hora"
                            type="time"
                            :rules="[v => !!v || 'Hora é obrigatória']"
                            required
                        ></v-text-field>
                        </v-col>
                        
                        <v-col cols="12">
                        <v-textarea
                            v-model="localAgendamento.observacoes"
                            label="Observações"
                            rows="3"
                        ></v-textarea>
                        </v-col>

                    </v-row>

                </v-form>
            </v-card-text>
        </v-card>
         <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" variant="text" @click="closeDialog">
            Cancelar
            </v-btn>
            <v-btn color="primary" variant="flat" @click="save" :loading="saving">
            Salvar Alterações
            </v-btn>
        </v-card-actions>
    

    </v-dialog>
</template>

<script setup>
import { ref, watch} from 'vue';

const props = defineProps({
  dialog: {
    type: Boolean,
    required: true
  },
  agendamento: {
    type: Object,
    required: true
  },
  saving: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:dialog', 'save', 'close']);

const editForm = ref(null);
const valid = ref(false);
const localAgendamento = ref({});

// Watch for changes in the agendamento prop
watch(() => props.agendamento, (newVal) => {
  localAgendamento.value = { ...newVal };
}, { immediate: true });

// Watch for dialog changes
watch(() => props.dialog, (newVal) => {
  if (!newVal) {
    resetForm();
  }
});

const closeDialog = () => {
  emit('update:dialog', false);
  emit('close');
};

const save = async () => {
  const { valid } = await editForm.value.validate();
  
  if (!valid) {
    return;
  }

  emit('save', localAgendamento.value);
};

const resetForm = () => {
  if (editForm.value) {
    editForm.value.resetValidation();
  }
};
</script>
