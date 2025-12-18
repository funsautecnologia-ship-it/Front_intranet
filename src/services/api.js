import axios from 'axios';
import store from '../store';
import router from '../router';

const baseURL = import.meta.env.VITE_API_BASE_URL ;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para tratar token expirado
api.interceptors.response.use(
  response => response,
  error => {
    if (
      error.response &&
      (
        error.response.status === 401 ||
        error.response.status === 403
      )
    ) {
      store.commit('destroyToken');
      store.commit('setUser', null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      store.dispatch('logout')
      router.push('/login');
    }
    // Sempre rejeita o erro para que o componente possa tratar localmente
    return Promise.reject(error);
  }
);

export default api;
