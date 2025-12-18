import Auth from '../services/auth'
import api from '../services/api'
import {getTickets, deleteTicket,getTicketBystatus} from '../services/supportTicket'

export default {
    loadSession({ commit, state }) {
      const token = localStorage.getItem('access_token')
      if (!token) {
        console.error('Token não encontrado no localStorage')
        return Promise.reject('Token ausente')
      }

      // Configura o cabeçalho Authorization com o token
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`

      return new Promise((resolve, reject) => {
        Auth.loadSession(token)
          .then((response) => {
            console.log('Sessão carregada com sucesso:', response.data)
            commit('setToken', token)
            commit('setUser', response.data.user)
            resolve(response)
          })
          .catch((error) => {
            console.error('Erro ao carregar sessão:', error)
            // Trate 400 e 401 como sessão inválida
            if (
              error.response &&
              (error.response.status === 401 || error.response.status === 400)
            ) {
              console.error('Token expirado ou inválido')
              commit('destroyToken')
              localStorage.removeItem('access_token')
              localStorage.removeItem('user')
            }
            reject(error)
          })
      })
    },
    login({ commit, state }, user) {
      return new Promise((resolve, reject) => {
        Auth.login(user)
          .then((response) => {
            const token = response.data.token
            console.log('user', response.data.user)
            localStorage.setItem('access_token', token)
            localStorage.setItem('user', JSON.stringify(response.data.user))
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            commit('setUser', response.data.user)
            commit('setAuth', response.data.auth)
            commit('setToken', token)
            resolve(response)
          })
          .catch((error) => {
            console.log(error)
            reject(error)
          })
      })
    },
    logout({ commit }) {
        commit('destroyToken')
        commit('setUser', null) // <-- Corrija aqui
        console.log('Logout realizado com sucesso')
        localStorage.removeItem('access_token')
        localStorage.removeItem('user') // Remova também o user do localStorage, se necessário
        commit('setTicket', null ) // Limpa o ticket atual
        commit('setTickets', []) // Limpa a lista de tickets
    },
    fetchUser({ commit }) {
      return new Promise((resolve, reject) => {
        Auth.getUser()
          .then((response) => {
            commit('setUser', response.data.user)
            resolve(response)
          })
          .catch((error) => {
            console.log(error)
            reject(error)
          })
      })
    },
    fetchAuth({ commit }) {
      return new Promise((resolve, reject) => {
        Auth.getAuth()
          .then((response) => {
            commit('setAuth', response.data.auth)
            resolve(response)
          })
          .catch((error) => {
            console.log(error)
            reject(error)
          })
      })
    },
    // buscar tickets
    fetchTickets({ commit }) { 
      return new Promise((resolve, reject) => {
        getTickets()
          .then((response) => {
            const items =response.data
            items.map((el,i)=>{
      
              items[i].setor = el.setor && el.setor.nome ? el.setor.nome : '-';
            })
            commit('setTickets', items);
            console.log('Tickets fetched:', response.data)
            resolve(response);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    },

    // delete ticket
    deleteTicket({ commit, state }, ticketId) {
      return new Promise((resolve, reject) => {
        deleteTicket(ticketId)
          .then((response) => {
            console.log('Ticket deleted:', response.data);
            // Atualiza a lista de tickets após a exclusão
            const updatedTickets = state.tickets.filter(ticket => ticket._id !== ticketId);
            commit('setTickets', updatedTickets);
            resolve(response);
          })
          .catch((error) => {
            console.error('Erro ao excluir o ticket:', error);
            reject(error);
          });
      });
    },

    //buscar ticket por status
    fetchTicketsByStatus({ commit }, status) {
      return new Promise((resolve, reject) => {
        getTicketBystatus(status)
          .then((response) => {
            const items =response.data
            items.map((el,i)=>{
             
              items[i].setor = el.setor && el.setor.nome ? el.setor.nome : '-';
            })
            commit('setTickets', items);
            console.log('Tickets fetched by status:', response.data);
            resolve(response);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });

    },
   
    
    triggerSnackbar({ commit }, payload) {
    commit('setSnackbarMessage', payload); // Mude de 'showSnackbar' para 'setSnackbarMessage'
    
    // Limpa a mensagem após um tempo para evitar loops
    setTimeout(() => {
      commit('clearSnackbarMessage');
    }, payload.timeout || 3000);
  },
  
};