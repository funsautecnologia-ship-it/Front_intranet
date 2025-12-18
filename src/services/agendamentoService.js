import api from './api';
const authHeader = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};
/** * Cria um novo Agendamento.
 * 
 * @param {Object} agendamento - Objeto contendo os dados do agendamento.
 * @returns {Promise<Object>} - Retorna a resposta da API com os dados do agendamento criado.  
 * */
export const createAgendamento = async (agendamento) => {
    try {
        const response = await api.post('/agendamentos/create', agendamento, {
            headers: { 'Content-Type': 'application/json', ...authHeader() }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao criar agendamento:', error.message);
        throw error; // Rejeita a promessa para que o componente possa tratar o erro
    }
};

/** Verificar se existe agendamentos para data e hora e retornar só os equipamentos e infraestruturas disponiveis
 * @param {String} data - Data no formato 'YYYY-MM-DD'.
 * @param {String} hora - Hora no formato 'HH:mm'.
 * @return {Promise<Object>} - Retorna a resposta da API com os agendamentos encontrados.
 * */
export const getAgendamentosByDataHora = async (data, hora, userId) => {
    console.log('Parâmetros enviados para busca de agendamentos por data e hora:', { data, hora, userId });
  
    try {
        const response = await api.get(`/agendamentos/datetime?data=${data}&hora=${hora}&userId=${userId}`, {
            headers: { 'Content-Type': 'application/json', ...authHeader() }
        });
        console.log('Agendamentos encontrados:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao obter agendamentos por data e hora:', error.message);
        throw error; // Rejeita a promessa para que o componente possa tratar o erro
    }
}
/** * Busca todos os agendamentos.
 * 
 * @returns {Promise<Array>} - Retorna a resposta da API com a lista de agendamentos.
 * */
export const getAllAgendamentos = async () => {
    try { 
        const response = await api.get('/agendamentos', {
            headers: { 'Content-Type': 'application/json', ...authHeader() }
        });
      
        return response.data;
    } catch (error) {
        console.error('Erro ao obter agendamentos:', error.message);
        throw error; // Rejeita a promessa para que o componente possa tratar o erro
    }
};

/** * Busca um agendamento pelo ID.
 *  
 * @param {String} id - ID do agendamento.
 * @returns {Promise<Object>} - Retorna a resposta da API com os dados do agendamento encontrado.
 * */   
export const getAgendamentoById = async (id) => {
    try {
        const response = await api.get(`/agendamentos/${id}`, {
            headers: { 'Content-Type': 'application/json', ...authHeader() }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao obter agendamento por ID:', error.message);
        throw error; // Rejeita a promessa para que o componente possa tratar o erro
    }
};
/** * Atualiza um agendamento pelo ID.
 * 
 * @param {String} id - ID do agendamento.
 * @param {Object} agendamento - Objeto contendo os dados atualizados do agendamento.
 * @returns {Promise<Object>} - Retorna a resposta da API com os dados do agendamento atualizado.
 * */
export const updateAgendamento = async (id, agendamento) => {
    try {
        const response = await api.put(`/agendamentos/${id}`, agendamento, {
            headers: { 'Content-Type': 'application/json', ...authHeader() }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar agendamento:', error.message);
        throw error; // Rejeita a promessa para que o componente possa tratar o erro
    }
};
/** * Deleta um agendamento pelo ID.
 *  @param {String} id - ID do agendamento.
 * @returns {Promise<Object>} - Retorna a resposta da API após a deleção do agendamento.
 * */
export const deleteAgendamento = async (id) => {
    try {
        const response = await api.delete(`/agendamentos/${id}`, {
            headers: { 'Content-Type': 'application/json', ...authHeader() }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar agendamento:', error.message);
        throw error; // Rejeita a promessa para que o componente possa tratar o erro
    }  
};
/** * Busca agendamentos por data.
 * 
 * @param {String} data - Data no formato 'YYYY-MM-DD'. 
 * @return {Promise<Array>} - Retorna a resposta da API com a lista de agendamentos encontrados.
 * */
export const getAgendamentosByDate = async (data) => {  
    try {
        const response = await api.get(`/agendamentos/date?data=${data}`, {
            headers: { 'Content-Type': 'application/json', ...authHeader() }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao obter agendamentos por data:', error.message);
        throw error; // Rejeita a promessa para que o componente possa tratar o erro
    }   
};
