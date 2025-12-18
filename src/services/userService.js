import api from './api';

export const getUsers = async () => {
  try {
    const response = await api.get('/users', {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    });
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Erro ao buscar usuários:', error.message);
    throw error;
  }
};

export const updateUser = async (id, data) => {
  try {
    const response = await api.put(`/users/${id}`, data, {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error.message);
    throw error;
  }
};

export const setUserActive = async (id, active) => {
  return updateUser(id, { active });
};
