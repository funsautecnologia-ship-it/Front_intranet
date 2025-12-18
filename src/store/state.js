export default {
  Auth: null,
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    token: localStorage.getItem('access_token') || null,
    session: null,
    ticket: null,
    ticketList: [],
    tickets: [],
     snackbar: {
      text: '',       // Mude de 'message' para 'text'
      color: 'success',
      timeout: 3000,
    },
};