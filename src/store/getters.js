export default{
     Auth(state) {
      return state.Auth
    },
    isAuthenticated(state) {
      return !!state.token
    },
    user(state) {
      return state.user
    },
    token(state) {
      return state.token
    },
   session(state) {
      return state.session
    },
    ticket(state) {
      return state.ticket
    },
    ticketList(state) {
      return state.ticketList
    },
    snackbar(state) {
      return state.snackbar;
    },
}