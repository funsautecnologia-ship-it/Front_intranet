import api from './api.js'; 


export const createTicket = async (ticketData) => {
  try {
    const response = await api.post('/tickets', ticketData);
    return response;
  } catch (error) {
    console.error('Erro ao criar chamado:', error);
    throw error;
  }
};

export const getTickets = async () => {
  try {
    return await api.get('/tickets');
  } catch (error) {
    console.error('Erro ao buscar chamados:', error);
    throw error;
  }
}

export const deleteTicket = async (ticketId) => {
  try {
     return await api.delete(`/tickets/${ticketId}`);
  
  } catch (error) {
    console.error('Erro ao deletar chamado:', error);
    throw error;
  }
}

export const getTicketById = async (ticketId) => {
  try {
    return await api.get(`/tickets/${ticketId}`);
  } catch (error) {
    console.error('Erro ao buscar chamado por ID:', error);
    throw error;
  }
}
export const updateTicket = async (ticketId, data) => { // Desestruturando os dados recebidos
  try {
    const response = await api.put(`/tickets/${ticketId}`, data);
    return response;
  } catch (error) {
    console.error('Erro ao atualizar chamado:', error);
    throw error;
  }
}

export const getTicketBystatus = async (status) => {
  console.log('status',status);
  try {
   return api.get(`/tickets/status/${status}`);
  } catch (error) {
    console.error('Erro ao buscar chamados por status:', error);
    throw error;
  }
}

export const finalizeTicketById = async (id, data) => {
  try {
    const response = await api.put(`/tickets/${id}/finalize`, data);
    return response;
  } catch (error) {
    console.error('Erro ao finalizar o chamado:', error);
    throw error;
  }
};





