<template>
          
            
                <v-row class="pa-5" align="start">
                    <v-col cols="12" md="4">
                        <v-card class="mx-auto" max-width="1000" style="margin-top: 20px;" color="surface">
                            <v-card-text>
                                <v-form @submit.prevent="verifyAgendamentos(form.dataInicio, form.Hora)">
                                    <v-row>
                                        <v-col cols="12" sm="12">
                                            <v-date-picker
                                                v-model="form.dataInicio"
                                                label="Data"
                                                @update:model-value="atualizarHorasDisponiveis"
                                                required
                                                locale="pt-BR"
                                                timezone="America/Manaus"
                                            ></v-date-picker>
                                        </v-col>
                                        <v-col cols="12" sm="12">
                                            <v-card class="pa-3">
                                                <v-card-title>Selecione a Hora</v-card-title>
                                                <v-select
                                                    v-model="form.Hora"
                                                    :items="horasDisponiveis"
                                                    label="Hora"
                                                    outlined
                                                    dense
                                                    required
                                                    :rules="[horaRule]"
                                                ></v-select>
                                            </v-card>
                                        </v-col>
                                        <v-col cols="12" class="text-center">
                                            <v-btn color="primary" type="submit">Verificar Disponibilidades</v-btn>
                                        </v-col>
                                    </v-row>
                                </v-form>
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <v-col cols="12" md="8">
                        <v-card v-if="infraestruturas.length > 0" class="mx-auto" max-width="1000" style="margin-top: 20px;" color="surface">
                            <v-card-title class="headline">Infraestruturas Disponíveis</v-card-title>
                            <v-card-text>
                                <v-row>
                                    <v-col 
                                        v-for="infra in infraestruturas" 
                                        :key="infra._id" 
                                        cols="12" 
                                        md="6" 
                                        lg="4"
                                    >
                                        <v-card 
                                            :class="['infra-card', { 'selected': form.Infra === infra._id }]"
                                            @click="selectInfra(infra)"
                                            hover
                                        >
                                            <v-card-title class="text-h6">
                                                {{ infra.nome }}
                                            </v-card-title>
                                            <v-card-text>
                                                <div v-if="infra.descricao">
                                                    <strong>Descrição:</strong> {{ infra.descricao }}
                                                </div>
                                            </v-card-text>
                                            <v-card-actions>
                                                <v-chip 
                                                    color="green" 
                                                    v-if="form.Infra === infra._id"
                                                >
                                                    Selecionada
                                                </v-chip>
                                                <v-spacer></v-spacer>
                                                <v-btn 
                                                    color="primary" 
                                                    @click.stop="selectInfra(infra)"
                                                >
                                                    {{ form.Infra === infra._id ? 'Selecionado' : 'Selecionar' }}
                                                </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>

                        <v-card v-if="equipamentos.length > 0" class="mx-auto" max-width="1000" style="margin-top: 20px;" color="surface">
                            <v-card-title class="headline">Equipamentos Disponíveis</v-card-title>
                            <v-card-text>
                                <v-row>
                                    <v-col 
                                        v-for="equip in equipamentos" 
                                        :key="equip._id" 
                                        cols="12" 
                                        md="6" 
                                        lg="4"
                                    >
                                        <v-card 
                                            :class="['equip-card', { 'selected': isEquipSelected(equip._id) }]"
                                            @click="toggleEquip(equip)"
                                            hover
                                        >
                                            <v-card-title class="text-h6">
                                                {{ equip.nome }}
                                            </v-card-title>
                                            <v-card-text>
                                                <div v-if="equip.descricao">
                                                    <strong>Descrição:</strong> {{ equip.descricao }}
                                                </div>
                                                <div v-if="equip.quantidadeDisponivel">
                                                    <strong>Quantidade disponível:</strong> {{ equip.quantidadeDisponivel }}
                                                </div>
                                            </v-card-text>
                                            <v-card-actions>
                                                <v-chip 
                                                    color="green" 
                                                    v-if="isEquipSelected(equip._id)"
                                                >
                                                    Selecionado
                                                </v-chip>
                                                <v-spacer></v-spacer>
                                                <v-btn 
                                                    :color="isEquipSelected(equip._id) ? 'error' : 'primary'" 
                                                    @click.stop="toggleEquip(equip)"
                                                >
                                                    {{ isEquipSelected(equip._id) ? 'Remover' : 'Adicionar' }}
                                                </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>

                        <v-card v-if="infraestruturas.length > 0 || equipamentos.length > 0" class="mx-auto" max-width="1000" style="margin-top: 20px;" color="surface">
                            <v-card-title class="headline">Cadastro de Agendamento</v-card-title>
                            <v-card-text>
                                <v-form @submit.prevent="submitForm">
                                    <v-textarea
                                        v-model="form.descricao"
                                        label="Descrição do Agendamento"
                                        required
                                        rows="3"
                                    ></v-textarea>
                                    <v-text-field
                                        v-model="form.solicitante"
                                        label="Nome do Solicitante"
                                        required
                                        color="primary"
                                    >
                                    </v-text-field>
                                    <v-card v-if="form.Infra" class="mb-4" color="light-green lighten-5">
                                        <v-card-title class="text-h6">Infraestrutura Selecionada</v-card-title>
                                        <v-card-text>
                                            <strong>{{ getInfraName(form.Infra) }}</strong>
                                            <v-btn 
                                                color="error" 
                                                small 
                                                class="ml-2" 
                                                @click="form.Infra = null"
                                            >
                                                Remover
                                            </v-btn>
                                        </v-card-text>
                                    </v-card>
                                    <v-card v-if="form.Equipamentos && form.Equipamentos.length > 0" class="mb-4" color="light-blue lighten-5">
                                        <v-card-title class="text-h6">Equipamentos Selecionados</v-card-title>
                                        <v-card-text>
                                            <v-chip 
                                                v-for="equipId in form.Equipamentos" 
                                                :key="equipId" 
                                                class="ma-1"
                                                close
                                                @click:close="removeEquip(equipId)"
                                            >
                                                {{ getEquipName(equipId) }}
                                            </v-chip>
                                        </v-card-text>
                                    </v-card>
                                    <v-btn 
                                        type="submit" 
                                        color="primary" 
                                        class="mt-4"
                                    >
                                        Cadastrar Agendamento
                                    </v-btn>
                                </v-form>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            
           
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { createAgendamento, getAgendamentosByDataHora } from '../../services/agendamentoService.js';
import Agendamento from '../../models/Agendamento';

const store = useStore();
const userId = store.state.user ? store.state.user._id : null;
const verficar = ref(true);
const horasDisponiveis = ref([
            '00:00', '01:00', '02:00', '03:00', '04:00', 
            '05:00', '06:00', '07:00', '08:00', '09:00', 
            '10:00', '11:00', '12:00', '13:00', '14:00', 
            '15:00', '16:00', '17:00', '18:00', '19:00', 
            '20:00', '21:00', '22:00', '23:00'
]);
const form = ref({
    ...new Agendamento(),
           dataInicio: null}
);
const infraestruturas = ref([]);    
const equipamentos = ref([]);


// Data mínima (hoje)
const minDate = computed(() => {
    return new Date().toISOString().split('T')[0];

});

const atualizarHorasDisponiveis = () => {
    form.value.Hora = null; // Resetar hora selecionada ao mudar a data
    console.log('Atualizando horas disponíveis para a data:', form.value.dataInicio);
    
    // Criar objetos Date para hoje com fuso horário do Brasil/Amazonas (UTC-4)
    const hoje = new Date();
    console.log('Data de hoje (Brasil):', hoje);
    
    // Formatar a data sem usar toISOString para evitar problemas de fuso horário
    const dataHoje = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
    
    // Garantir que form.dataInicio seja um objeto Date
    let dataSelecionada;
    if (typeof form.value.dataInicio === 'string') {
        dataSelecionada = new Date(form.value.dataInicio);
    } else {
        dataSelecionada = form.value.dataInicio;
    }
    
    const dataFormatada = dataSelecionada.toISOString().split('T')[0];
    
    console.log('Data de hoje (Amazonas):', dataHoje);
    console.log('Data selecionada:', dataFormatada);
    
    // Comparar apenas as datas (ignorando horas)
    if (dataFormatada === dataHoje) {
        console.log('Data selecionada é hoje, filtrando horas futuras');
        // Se a data selecionada for hoje, filtrar horas futuras
        const horaAtual = hoje.getHours();
        console.log('Hora atual (Amazonas):', horaAtual);
        
        // Filtrar apenas horas futuras
        const horasFiltradas = [
            '00:00', '01:00', '02:00', '03:00', '04:00', 
            '05:00', '06:00', '07:00', '08:00', '09:00', 
            '10:00', '11:00', '12:00', '13:00', '14:00', 
            '15:00', '16:00', '17:00', '18:00', '19:00', 
            '20:00', '21:00', '22:00', '23:00'
        ].filter(hora => {
            const horaInt = parseInt(hora.split(':')[0], 10);
            return horaInt > horaAtual;
        });
        
        horasDisponiveis.value = horasFiltradas;
        console.log('Horas disponíveis filtradas:', horasDisponiveis.value);
    } else {
        console.log('Data selecionada é futura, mostrando todas as horas.');
        // Se for uma data futura, mostrar todas as horas
        horasDisponiveis.value = [
            '00:00', '01:00', '02:00', '03:00', '04:00', 
            '05:00', '06:00', '07:00', '08:00', '09:00', 
            '10:00', '11:00', '12:00', '13:00', '14:00', 
            '15:00', '16:00', '17:00', '18:00', '19:00', 
            '20:00', '21:00', '22:00', '23:00'
        ];
    }
};







// Regra de validação para garantir que a hora termine com :00
const horaRule = (value) => {
    if (!value) return 'Hora é obrigatória';
    if (!value.endsWith(':00')) return 'A hora deve terminar com :00';
    if (!horasDisponiveis.value.includes(value)) return 'Hora não disponível';
    return true;
};

const verifyAgendamentos = async (dataInicio, Hora) => {
    if (!dataInicio || !Hora) {
        store.dispatch('triggerSnackbar', {
            text: 'Por favor, selecione uma data e hora válidas.',
            color: 'error',
        });
        return;
    }
    try {
        let dateStr;
        if (dataInicio instanceof Date) {
            const y = dataInicio.getFullYear();
            const m = String(dataInicio.getMonth() + 1).padStart(2, '0');
            const d = String(dataInicio.getDate()).padStart(2, '0');
            dateStr = `${y}-${m}-${d}`;
        } else {
            const s = String(dataInicio);
            dateStr = s.includes('T') ? s.split('T')[0] : s;
        }
        const response = await getAgendamentosByDataHora(dateStr, Hora, userId);
        infraestruturas.value = response.infraestruturas || [];
        equipamentos.value = response.equipamentos || [];
        if (infraestruturas.value.length === 0 && equipamentos.value.length === 0) {
            store.dispatch('triggerSnackbar', {
                text: 'Nenhuma infraestrutura ou equipamento disponível para o horário selecionado.',
                color: 'info',
            });
        }else {
            store.dispatch('triggerSnackbar', {
                text: `Encontradas ${infraestruturas.value.length} infraestruturas e ${equipamentos.value.length} equipamentos disponíveis`,
                color: 'success',
                 
            });
            
            verficar.value = false;
        }
       
        
       
    } catch (error) {
        console.error('Erro ao verificar agendamentos:', error);
        store.dispatch('triggerSnackbar', {
            text: 'Erro ao buscar disponibilidades',
            color: 'error',
        });
    }
};

// Selecionar infraestrutura
const selectInfra = (infra) => {
    form.value.Infra = infra._id;
};

// Toggle equipamento
const toggleEquip = (equip) => {
    if (!form.value.Equipamentos) {
        form.value.Equipamentos = [];
    }
    
    const index = form.value.Equipamentos.findIndex(id => id === equip._id);
    
    if (index === -1) {
        // Adicionar equipamento
        form.value.Equipamentos.push(equip._id);
    } else {
        // Remover equipamento
        form.value.Equipamentos.splice(index, 1);
    }
};

// Remover equipamento específico
const removeEquip = (equipId) => {
    const index = form.value.Equipamentos.findIndex(id => id === equipId);
    if (index !== -1) {
        form.value.Equipamentos.splice(index, 1);
    }
};

// Verificar se equipamento está selecionado
const isEquipSelected = (equipId) => {
    return form.value.Equipamentos && form.value.Equipamentos.includes(equipId);
};

// Obter nome da infraestrutura
const getInfraName = (infraId) => {
    const infra = infraestruturas.value.find(i => i._id === infraId);
    return infra ? infra.nome : 'Infraestrutura selecionada';
};

// Obter nome do equipamento
const getEquipName = (equipId) => {
    const equip = equipamentos.value.find(e => e._id === equipId);
    return equip ? equip.nome : 'Equipamento';
};

const submitForm = async () => {
    try {
        // Garantir que a data e hora estão preenchidas
        if (!form.value.dataInicio || !form.value.Hora) {
            store.dispatch('triggerSnackbar', {
                text: 'Data e hora são obrigatórias',
                color: 'error',
            });
            return;
        }

        await createAgendamento(form.value);
        store.dispatch('triggerSnackbar', {
            text: 'Agendamento cadastrado com sucesso!',
            color: 'success',
        });
        
        // Limpar formulário mas manter a data/hora para nova consulta
        const dataInicio = form.value.dataInicio;
        const Hora = form.value.Hora;
        form.value = new Agendamento();
        form.value.dataInicio = dataInicio;
        form.value.Hora = Hora;
        verficar.value = true;
        infraestruturas.value = [];
        equipamentos.value = [];
        
    } catch (error) {
        const msg = error?.response?.data?.message || 'Erro ao cadastrar agendamento. Tente novamente.';
        store.dispatch('triggerSnackbar', {
            text: msg,
            color: 'error',
        });
        console.error(error);
    }
};

onMounted(() => {
    // Inicialização se necessário
    verficar.value = true;
    
});
</script>

<style scoped>

</style>
