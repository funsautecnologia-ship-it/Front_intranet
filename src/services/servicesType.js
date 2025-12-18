import api from './api';
/** * cria um novo tipo de serviço.'
 * @param {Object} servico - Objeto contendo os dados do tipo de serviço.
 * @returns {Promise<Object>} - Retorna a resposta da API com os dados do tipo de serviço criado.
 * */
export const createServicoTipo = async (servico) => {
    try {
        const response = await api.post('/servicoTipo/create', servico, {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao criar tipo de serviço:', error.message);
        throw error; // Rejeita a promessa para que o componente possa tratar o erro
    }
};

/**
 * Obtém todos os tipos de serviço.
 * @returns {Promise<Object[]>} - Retorna a resposta da API com a lista de tipos de serviço.
 * */
export const getServicoTipos = async () => {
    try {
        return await api.get('/servicoTipo', {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
    } catch (error) {
        console.error('Erro ao obter tipos de serviço:', error.message);
        throw error; // Rejeita a promessa para que o componente possa tratar o erro
    }
}

/** * Atualiza um tipo de serviço existente.
 * @param {Object} servico - Objeto
 * contendo os dados do tipo de serviço a ser atualizado.
 * @returns {Promise<Object>} - Retorna a resposta da API com os dados do tipo de serviço atualizado.
 * */
export const updateServicoTipo = async (id, servico) => {
    try {
        const response = await api.put(`/servicoTipo/${id}`, servico, {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar tipo de serviço:', error.message);
        throw error; // Rejeita a promessa para que o componente possa tratar o erro
    }
}

/**
 * Exclui um tipo de serviço.
 * @param {number} id - ID do tipo de serviço a ser excluído.
 *  * @returns {Promise<Object>} - Retorna a resposta da API com a confirmação da exclusão.
 * */
export const deleteServicoTipo = async (id) => {
    try {
        const response = await api.delete(`/servicoTipo/${id}`, {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao excluir tipo de serviço:', error.message);
        throw error; // Rejeita a promessa para que o componente possa tratar o erro
    }
}