export default {
 destroyToken(state) {
      state.token = null
    },
    setUser(state, user) {
      state.user = user
    },
    setAuth(state, auth) {
      state.Auth = auth
    },
    setToken(state, token) {
      state.token = token
    },
    setSession(state, session) {
      state.session = session
    },
    destroySession(state) {
      state.session = null
    },
    setTicket(state, ticket) {
      state.ticket = ticket
    },
    setTicketList(state, ticketList) {
      state.ticketList = ticketList
    },
    setTickets(state, tickets) {
      state.tickets = tickets; // Substitui o array inteiro!
    },
    setSnackbarMessage(state, payload) {
      state.snackbar.text = payload.text;
      state.snackbar.color = payload.color || 'success';
      state.snackbar.timeout = payload.timeout || 3000;
    },
    clearSnackbarMessage(state) {
      state.snackbar.text = '';
    },
}