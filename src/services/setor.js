import api from './api.js';

/**
 * Cria um novo setor.
 * @param {Object} setor - Objeto contendo os dados do setor.
 *  * @returns {Promise<Object>} - Retorna a resposta da API com os dados do setor criado.
 */ 
export const createSetor = async (nome) => {
    try {
        const response = await api.post('/setor/create', nome,{
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
       
        return response.data;
    } catch (error) {
        console.error('Erro ao criar setor:', error.message);
        throw error; // Rejeita a promessa para que o componente possa tratar o erro
    }
}

/**
 * Obtém todos os setores.
 * @returns {Promise<Object[]>} - Retorna a resposta da API com a lista de setores.
 */

export const getSetores = async () => {
    try {
        return await api.get('/setor', {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
       
    } catch (error) {
        console.error('Erro ao obter setores:', error.message);
        throw error; // Rejeita a promessa para que o componente possa tratar o erro
    }
}
/**
 * Obtém um setor pelo ID.
    * @param {string} id - ID do setor a ser obtido.
    * @returns {Promise<Object>} - Retorna a resposta da API com os dados do setor.
 */

export const getSetorById = async (id) => {
    try {
        const response = await api.get(`/setor/${id}`, {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao obter setor por ID:', error.message);
        throw error; // Rejeita a promessa para que o componente possa tratar o erro
    }
}

/**
 * Atualiza um setor pelo ID.
 * @param {string} id - ID do setor a ser atualizado.
 * @param {Object} setor - Objeto contendo os dados atualizados do setor.
 * @returns {Promise<Object>} - Retorna a resposta da API com os dados do setor atualizado.
 */
export const updateSetor = async (id, setor) => {
    try {
        const response = await api.put(`/setor/${id}`, setor, {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar setor:', error.message);
        throw error; // Rejeita a promessa para que o componente possa tratar o erro
    }
}

/**
 * Deleta um setor pelo ID.
 * @param {string} id - ID do setor a ser deletado.
 * @returns {Promise<Object>} - Retorna a resposta da API com a confirmação da exclusão.
 */
export const deleteSetor = async (id) => {
    try {
        const response = await api.delete(`/setor/${id}`, {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar setor:', error.message);
        throw error; // Rejeita a promessa para que o componente possa tratar o erro
    }
}

export const setSetorActive = async (id, active) => {
    try {
        const response = await api.put(`/setor/${id}`, { active }, {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar status do setor:', error.message);
        throw error;
    }
}

export default {
    createSetor,
    getSetores,
};
