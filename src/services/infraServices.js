import api from './api'; 
/** * cria uma nova infraestrutura de serviço.
 * @param {object} infra- dados infraestrutura.
 * * @returns {Promise<Object>} - Retorna a resposta da API com os dados da infraestrutura criada.
 */
export const createInfra = async (infra) => {
    console.log('Criando infraestrutura com os dados:', infra);
    try {
        const response = await api.post('/infra/create', {infra }, {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao criar infraestrutura de serviço:', error.message);
        throw error; // Rejeita a promessa para que o componente possa tratar o erro
    }
};
/**
 * Obtém todas as infraestruturas de serviço.
 * @returns {Promise<Object[]>} - Retorna uma lista de infraestruturas de serviço.
 */
export const getAllInfra = async () => {
    try {
        const response = await api.get('/infra');
    
        return response.data;
       
    } catch (error) {
        console.error('Erro ao obter infraestruturas de serviço:', error.message);
        throw error; // Rejeita a promessa para que o componente possa tratar o erro
    }
};
/**
 * Atualiza uma infraestrutura de serviço pelo ID.
 * @param {string} id - ID da infraestrutura a ser atualizada.
 * @param {Object} infra - Objeto contendo os dados atualizados da infraestrutura.
 * @returns {Promise<Object>} - Retorna a resposta da API com os dados da infraestrutura atualizada.
 */
export const updateInfra = async (id, infra) => {
    console.log('Atualizando infraestrutura com ID:', id, 'e dados:', infra);
    try {
        const response = await api.put(`/infra/${id}`, infra, {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar infraestrutura de serviço:', error.message);
        throw error; // Rejeita a promessa para que o componente possa tratar o erro
    }
};
/**
 * Exclui uma infraestrutura de serviço pelo ID.
 * @param {string} id - ID da infraestrutura a ser excluída.
 * @returns {Promise<Object>} - Retorna a resposta da API com a confirmação da exclusão.
 */
export const deleteInfra = async (id) => {
    try {
        const response = await api.delete(`/infra/${id}`, {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao excluir infraestrutura de serviço:', error.message);
        throw error; // Rejeita a promessa para que o componente possa tratar o erro
    }

};
/**
 * Obtém uma infraestrutura de serviço pelo ID.
 * @param {string} id - ID da infraestrutura a ser obtida.
 * @returns {Promise<Object>} - Retorna os dados da infraestrutura solicitada.
 */
export const getInfraById = async (id) => {
    try {
        const response = await api.get(`/infra/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao obter infraestrutura de serviço:', error.message);
        throw error; // Rejeita a promessa para que o componente possa tratar o erro
    }   
}
