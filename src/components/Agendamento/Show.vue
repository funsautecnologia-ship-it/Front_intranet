<template>
    <v-container class="py-6">
        <v-row>
            <v-col cols="12" class="d-flex align-center mb-4">
                <h1 class="text-h4 font-weight-bold text-primary">
                    <v-icon icon="mdi-calendar-month" size="42" class="mr-3"></v-icon>
                    Agenda de Agendamentos
                </h1>
                <v-spacer></v-spacer>
                <v-row>
                    <v-col>
                        
                    </v-col>
                </v-row>
                <v-btn color="primary" variant="flat" rounded="lg" @click="fetchAgendamento" class="mr-2">
                    <v-icon icon="mdi-refresh" class="mr-2"></v-icon>
                    Atualizar
                </v-btn>
             
                <v-btn  @click="exportToPDF" color="secondary" variant="outlined" rounded="lg" >
                    <v-icon icon="mdi-download" class="mr-2"></v-icon>
                        Exportar
                </v-btn>
                  
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" md="5" lg="4">
                <v-card elevation="8" rounded="xl" class="date-picker-card">
                    <v-card-text class="pa-5">
                        <div class="text-center mb-6">
                            <v-icon icon="mdi-calendar-search" size="40" color="primary" class="mb-2"></v-icon>
                            <h2 class="text-h5 font-weight-bold">Selecione a Data</h2>
                            <p class="text-caption text-medium-emphasis mt-1">Visualize os agendamentos por data</p>
                        </div>
                        
                        <v-date-picker
                            v-model="dataSelecionada"
                            color="primary"
                            locale="pt-BR"
                            header-color="primary"
                            @update:model-value="fetchAgendamento"
                            full-width
                            elevation="2"
                            rounded="lg"
                            show-adjacent-months
                            class="custom-date-picker"
                        ></v-date-picker>
                        
                        <div class="text-center mt-4">
                            <v-chip color="primary" variant="flat" label>
                                <v-icon icon="mdi-calendar" class="mr-2"></v-icon>
                                {{ formatarDataDisplay(dataSelecionada) }}
                            </v-chip>
                        </div>
                    </v-card-text>
                </v-card>
                
                <v-card elevation="8" rounded="xl" class="mt-6 stats-card">
                    <v-card-text class="pa-5">
                        <div class="text-center">
                            <v-icon icon="mdi-chart-box" size="40" color="secondary" class="mb-2"></v-icon>
                            <h3 class="text-h6 font-weight-bold">Resumo do Dia</h3>
                        </div>
                        <v-divider class="my-4"></v-divider>
                        <div class="d-flex justify-space-around">
                            <div class="text-center">
                                <div class="text-h4 font-weight-bold text-primary">{{ agendamentos.length }}</div>
                                <div class="text-caption">Total</div>
                            </div>
                            <v-divider vertical></v-divider>
                            <div class="text-center">
                                <div class="text-h4 font-weight-bold text-green">{{ agendamentosManha }}</div>
                                <div class="text-caption">Manhã</div>
                            </div>
                            <v-divider vertical></v-divider>
                            <div class="text-center">
                                <div class="text-h4 font-weight-bold text-blue">{{ agendamentosTarde }}</div>
                                <div class="text-caption">Tarde</div>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
                
            <v-col cols="12" md="7" lg="8">
                <v-card elevation="8" rounded="xl" class="agendamentos-card">
                    <v-card-text class="pa-0">
                        <div class="pa-5 pb-3 d-flex align-center">
                            <div>
                                <h2 class="text-h5 font-weight-bold">Agendamentos</h2>
                                <p class="text-caption text-medium-emphasis">Lista de agendamentos para a data selecionada</p>
                            </div>
                            <v-spacer></v-spacer>
                            <v-text-field
                                v-model="searchTerm"
                                density="compact"
                                variant="outlined"
                                placeholder="Buscar agendamento..."
                                prepend-inner-icon="mdi-magnify"
                                hide-details
                                single-line
                                class="search-field"
                            ></v-text-field>
                        </div>
                        
                        <v-divider></v-divider>
                        
                        <div class="agendamentos-list" style="max-height: 600px; overflow-y: auto;">
                            <template v-if="agendamentosFiltrados.length > 0">
                                <v-list lines="two" class="py-0">
                                    <v-list-item
                                        v-for="(item, index) in agendamentosFiltrados"
                                        :key="item._id"
                                        :class="['agendamento-item', 'mx-4', 'my-3', 'rounded-xl']"
                                        :style="{borderLeft: `4px solid ${getStatusColor(item)}`}"
                                    >
                                        <template v-slot:prepend>
                                            <v-avatar :color="getStatusColor(item)" variant="tonal" size="50" class="mr-4">
                                                <v-icon :icon="getStatusIcon(item)" size="24"></v-icon>
                                            </v-avatar>
                                        </template>

                                        <div class="d-flex flex-column w-100">
                                            <div class="d-flex justify-space-between align-start mb-2">
                                                <div>
                                                    <h3 class="text-h6 font-weight-bold mb-1">{{ item.descricao }}</h3>
                                                    <div class="d-flex align-center">
                                                        <v-icon icon="mdi-account" size="16" class="mr-1 text-medium-emphasis"></v-icon>
                                                        <span class="text-body-2">{{ item.solicitante }}</span>
                                                    </div>
                                                </div>
                                                <v-chip size="small" :color="getStatusColor(item)" variant="flat" class="ml-2">
                                                    {{ item.Hora }}
                                                </v-chip>
                                            </div>
                                            
                                            <v-divider class="my-2"></v-divider>
                                            
                                            <div class="d-flex justify-space-between align-center">
                                                <div class="d-flex align-center">
                                                    <v-icon icon="mdi-calendar" size="16" class="mr-1 text-medium-emphasis"></v-icon>
                                                    <span class="text-body-2">{{ formatarData(item.dataInicio) }}</span>
                                                </div>
                                                <div class="d-flex">
                                                    <v-btn icon variant="text" size="x-small" color="grey">
                                                        <v-icon>mdi-eye</v-icon>
                                                    </v-btn>
                                                    <v-btn icon variant="text" size="x-small" color="grey" class="ml-1" @click="openEditDialog(item)">
                                                        <v-icon>mdi-pencil</v-icon>
                                                    </v-btn>
                                                    <v-btn icon variant="text" size="x-small" color="grey" class="ml-1">
                                                        <v-icon>mdi-dots-vertical</v-icon>
                                                    </v-btn>
                                                </div>
                                            </div>

                                            <div class="mt-2">
                                                <div class="d-flex align-center mb-1">
                                                    <v-icon icon="mdi-office-building" size="16" class="mr-1 text-medium-emphasis"></v-icon>
                                                    <span class="text-body-2">{{ getInfraNome(item) }}</span>
                                                </div>
                                                <div class="d-flex align-center flex-wrap">
                                                    <v-icon icon="mdi-tools" size="16" class="mr-1 text-medium-emphasis"></v-icon>
                                                    <div>
                                                        <v-chip
                                                            v-for="(nome, i) in getEquipamentoNomes(item)"
                                                            :key="i"
                                                            size="x-small"
                                                            variant="tonal"
                                                            class="mr-1"
                                                        >
                                                            {{ nome }}
                                                        </v-chip>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </v-list-item>
                                </v-list>
                            </template>

                            <template v-else-if="loading">
                                <div class="text-center py-12 px-4">
                                    <v-progress-circular
                                        indeterminate
                                        color="primary"
                                        size="64"
                                        width="5"
                                    ></v-progress-circular>
                                    <h3 class="text-h5 text-grey-darken-1 mt-4">Carregando agendamentos...</h3>
                                </div>
                            </template>

                            <template v-else>
                                <div class="text-center py-12 px-4">
                                    <v-icon class="empty-state-icon" color="grey-lighten-2" size="80">mdi-calendar-blank</v-icon>
                                    <h3 class="text-h5 text-grey-darken-1 mt-4">Nenhum agendamento encontrado</h3>
                                    <p class="text-grey mt-2">Não há agendamentos para a data selecionada.</p>
                                    <v-btn color="primary" class="mt-4" variant="flat" rounded="lg" @click="fetchAgendamento" prepend-icon="mdi-refresh">
                                        Recarregar
                                    </v-btn>
                                </div>
                            </template>
                        </div>
                    </v-card-text>

                    <v-divider v-if="agendamentosFiltrados.length > 0"></v-divider>

                    <v-card-actions v-if="agendamentosFiltrados.length > 0" class="px-5 py-4">
                        <span class="text-caption text-medium-emphasis">
                            Exibindo <strong>{{ agendamentosFiltrados.length }}</strong> de <strong>{{ agendamentos.length }}</strong> agendamento(s)
                        </span>
                        <v-spacer></v-spacer>
                        <v-btn variant="text" color="primary" size="small" @click="exportToPDF" prepend-icon="mdi-file-pdf">
                            PDF
                        </v-btn>
                      
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
          <!-- Diálogo de Edição -->
         <EditAgendamentoDialog
            v-model:dialog="editDialog"
            :agendamento="editedAgendamento"
            :saving="saving"
            @save="saveAgendamento"
            @close="closeEditDialog"
        />
        
        <v-snackbar v-model="snackbar.show" :timeout="3000" :color="snackbar.color">
            {{ snackbar.message }}
            <template v-slot:actions>
                <v-btn variant="text" @click="snackbar.show = false">Fechar</v-btn>
            </template>
        </v-snackbar>
    </v-container>
</template>

<script setup>    
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getAgendamentosByDate, updateAgendamento } from '../../services/agendamentoService.js';
import { usePdfExport } from '../../composables/usePdfExport.js'
import Agendamento from '../../models/Agendamento';
import EditAgendamentoDialog from './EditAgendamentoDialog.vue'; // Importar o componente


const route = useRoute();
const dataSelecionada = ref(new Date());
const agendamentos = ref([]);
const searchTerm = ref('');
const loading = ref(false);
const { exportTableToPDF } = usePdfExport();
const snackbar = ref({
    show: false,
    message: '',
    color: 'success'
});

const editDialog = ref(false);
const valid = ref(false);
const saving = ref(false);
const editedAgendamento = ref({
    ...new Agendamento(),
    

});
const editForm = ref(null);

const openEditDialog = (agendamento) => {
    editedAgendamento.value = {
        _id: agendamento._id,
        descricao: agendamento.descricao || '',
        solicitante: agendamento.solicitante || '',
        dataInicio: agendamento.dataInicio || '',
        Hora: agendamento.Hora || '',
        observacoes: agendamento.observacoes || ''
    };
    editDialog.value = true;
};

const closeEditDialog = () => {
    editDialog.value = false;
    editedAgendamento.value = {
        _id: '',
        descricao: '',
        solicitante: '',
        dataInicio: '',
        Hora: '',
        observacoes: ''
    };
};

const saveAgendamento = async (agendamentoData) => {
    saving.value = true;
    try {
        // Criar uma cópia do objeto para não modificar o original
        const agendamentoToSave = { ...agendamentoData };
        
        // Extrair apenas a parte da data (YYYY-MM-DD) sem converter para Date
        if (typeof agendamentoToSave.dataInicio === 'string') {
            agendamentoToSave.dataInicio = agendamentoToSave.dataInicio.split('T')[0];
        } else if (agendamentoToSave.dataInicio instanceof Date) {
            agendamentoToSave.dataInicio = `${agendamentoToSave.dataInicio.getFullYear()}-${String(agendamentoToSave.dataInicio.getMonth() + 1).padStart(2, '0')}-${String(agendamentoToSave.dataInicio.getDate()).padStart(2, '0')}`;
        }
        
        console.log('Data formatada para envio:', agendamentoToSave.dataInicio);
        
        const response = await updateAgendamento(agendamentoToSave._id, agendamentoToSave);
        showSnackbar('Agendamento atualizado com sucesso!', 'success');
        
        // Atualizar a lista local
        const index = agendamentos.value.findIndex(a => a._id === agendamentoData._id);
        if (index !== -1) {
            agendamentos.value[index] = { ...agendamentos.value[index], ...agendamentoData };
        }
        
        closeEditDialog();
    } catch (error) {
        console.error('Erro ao atualizar agendamento:', error);
        showSnackbar('Erro ao atualizar agendamento: ' + error.message, 'error');
    } finally {
        saving.value = false;
    }
};


const fetchAgendamento = async () => {
    try {
        let dateStr;
        const v = dataSelecionada.value;
        if (v instanceof Date) {
            const y = v.getFullYear();
            const m = String(v.getMonth() + 1).padStart(2, '0');
            const d = String(v.getDate()).padStart(2, '0');
            dateStr = `${y}-${m}-${d}`;
        } else {
            const s = String(v);
            dateStr = s.includes('T') ? s.split('T')[0] : s;
        }
        const response = await getAgendamentosByDate(dateStr);
        console.log('Agendamentos recebidos da API:', dataSelecionada.value);
        agendamentos.value = response;
        console.log('Agendamentos carregados:', agendamentos.value);
    } catch (error) {
        console.error('Erro ao buscar agendamento:', error);
    }
};

const formatarData = (data) => {
    if (!data) return '';
    const d = new Date(data);
    if (!isNaN(d)) {
        return d.toLocaleDateString('pt-BR');
    }
    const s = String(data);
    const base = s.includes('T') ? s.split('T')[0] : s;
    const [ano, mes, dia] = base.split('-');
    return `${dia}/${mes}/${ano}`;
};



const formatarDataDisplay = (data) => {
    if (!data) return '';
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const getStatusColor = (item) => {
    // Defina a lógica de status com base nos seus dados reais
    // Exemplo: você pode usar item.status se existir na sua API
    const hora = parseInt(item.Hora?.split(':')[0] || 0);
    
    if (hora < 9) return '#4CAF50'; // Verde para manhã cedo
    if (hora < 12) return '#2196F3'; // Azul para manhã
    if (hora < 18) return '#FF9800'; // Laranja para início da tarde
    return '#9C27B0'; // Roxo para final da tarde
};

const getStatusIcon = (item) => {
    const hora = parseInt(item.Hora?.split(':')[0] || 0);
    
    if (hora < 9) return 'mdi-weather-sunset-up';
    if (hora < 12) return 'mdi-weather-sunny';
    if (hora < 18) return 'mdi-weather-sunset';
    return 'mdi-weather-night';
};

const getInfraNome = (item) => {
    const infra = item.Infra;
    if (!infra) return 'Não informado';
    if (typeof infra === 'string') return infra;
    if (infra && infra.nome) return infra.nome;
    return String(infra);
};

const getEquipamentoNomes = (item) => {
    const eq = item.Equipamentos;
    const nomes = [];
    if (!eq) return nomes;
    if (Array.isArray(eq)) {
        eq.forEach((e) => {
            if (!e) return;
            if (typeof e === 'string') nomes.push(e);
            else if (e.nome) nomes.push(e.nome);
            else nomes.push(String(e));
        });
    } else {
        if (typeof eq === 'string') nomes.push(eq);
        else if (eq.nome) nomes.push(eq.nome);
        else nomes.push(String(eq));
    }
    return nomes;
};

const agendamentosManha = computed(() => {
    return agendamentos.value.filter(a => {
        const hora = parseInt(a.Hora?.split(':')[0] || 0);
        return hora < 12;
    }).length;
});

const agendamentosTarde = computed(() => {
    return agendamentos.value.filter(a => {
        const hora = parseInt(a.Hora?.split(':')[0] || 0);
        return hora >= 12;
    }).length;
});

const agendamentosFiltrados = computed(() => {
    if (!searchTerm.value) return agendamentos.value;
    const term = searchTerm.value.toLowerCase();
    return agendamentos.value.filter(item => 
        item.descricao?.toLowerCase().includes(term) ||
        item.solicitante?.toLowerCase().includes(term) ||
        item.Hora?.includes(term)
    );
});

const exportToPDF = () => {
  try {
    const tableData = agendamentosFiltrados.value.map(item => [
      item.descricao || 'Não informado',
      item.solicitante || 'Não informado',
      formatarData(item.dataInicio),
      item.Hora || 'Não informado',
      getInfraNome(item) || 'Não informado',
      getEquipamentoNomes(item).join(', ') || 'Não informado'
    ]);

    exportTableToPDF({
      title: 'Relatório de Agendamentos',
      subtitle: `Data: ${formatarDataDisplay(dataSelecionada.value)}`,
      headers: ['Descrição', 'Solicitante', 'Data', 'Hora', 'Infraestrutura', 'Equipamentos'],
      data: tableData,
      fileName: 'agendamentos',
      orientation: 'landscape',
      styles: {
        title: { fontSize: 20, color: [25, 118, 210] },
        header: { fillColor: [25, 118, 210] }
      }
    });

    showSnackbar('PDF exportado com sucesso!', 'success');
  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    showSnackbar('Erro ao exportar PDF: ' + error.message, 'error');
  }
};



const showSnackbar = (message, color = 'success') => {
    snackbar.value = {
        show: true,
        message,
        color
    };
};

watch(dataSelecionada, () => {
    fetchAgendamento();
});

onMounted(() => {
    fetchAgendamento();
});
</script>

<style scoped>
.date-picker-card {
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
}

.stats-card {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.agendamentos-card {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
}

.agendamento-item {
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04);
    background-color: white;
}

.agendamento-item:hover {
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}

.search-field {
    max-width: 250px;
}

:deep(.custom-date-picker .v-btn.v-btn--size-default) {
    border-radius: 8px;
}

:deep(.custom-date-picker .v-date-picker-month__day--selected .v-btn) {
    background-color: rgb(var(--v-theme-primary));
    color: white;
}

:deep(.agendamentos-list) {
    padding: 0 16px;
}

.empty-state-icon {
    opacity: 0.6;
}

@media (max-width: 960px) {
    .agendamentos-list {
        max-height: 400px !important;
    }
}
</style>
const toDateOnly = (value) => {
    if (!value) return '';
    if (value instanceof Date) {
        const y = value.getFullYear();
        const m = String(value.getMonth() + 1).padStart(2, '0');
        const d = String(value.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }
    const str = String(value);
    if (str.includes('T')) return str.split('T')[0];
    return str;
};
