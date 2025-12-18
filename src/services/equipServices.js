import api from './api'

/**
 * Cria um novo equipamento.
 * @param {Object} nome - Objeto contendo os dados do equipamento.
 * @returns {Promise<Object>} - Retorna a resposta da API com os dados do equipamento criado.
 * */
export const createEquip = async (nome) => {
    try {
        const response = await api.post('/equipamentos/create', nome);
       
        return response.data;
    } catch (error) {
        console.error('Erro ao criar equipamento:', error.message);
        throw error; // Rejeita a promessa para que o componente possa tratar o erro
    }
};
/**
 * Obtém todos os equipamentos.
 * @returns {Promise<Object[]>} - Retorna uma lista de equipamentos.   
 * */
export const getAllEquips = async () => {
    try {
        const response = await api.get('/equipamentos');
        return response;
    } catch (error) {
        console.error('Erro ao obter equipamentos:', error.message);
        throw error; // Rejeita a promessa para que o componente possa tratar o erro
    }
};
/** * atualiza um equipamento pelo ID.
 * @param {string} id - ID do equipamento a ser atualizado.     
 * @param {Object} nome - Objeto contendo os dados atualizados do equipamento.
 * @returns {Promise<Object>} - Retorna a resposta da API com os dados do equipamento
 *  
 * */
 export const updateEquip = async (id, equipamento) => {
    console.log('Atualizando equipamento com ID:', id, 'e dados:', equipamento);
    try {
        const response = await api.put(`/equipamentos/${id}`, equipamento, {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar equipamento:', error.message);
        throw error; // Rejeita a promessa para que o componente possa tratar o erro
    }
};

/** *Exccluir equipamento 
 * @param {string} id - ID do equipamento a ser excluído.
 * @returns {Promise<Object>} - Retorna a resposta da API com a confirmação da exclusão.
 * */
export const deleteEquip = async (id) => {
    try {
        const response = await api.delete(`/equipamentos/${id}`, {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao excluir equipamento:', error.message);
        throw error; // Rejeita a promessa para que o componente possa tratar o erro
    }   
}